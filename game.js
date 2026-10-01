/**
 * ECONOVA - Core Game Controller Engine
 * Orchestrates turns, 3D dice rolling, pawn navigation, card mechanics,
 * AI Bot turns, mission updates, and victory/defeat condition evaluation.
 */
class EconovaGame {
    constructor() {
        this.board = null;
        this.threeHub = null;
        this.craftingSystem = null;
        this.cardModal = null;
        this.ecoBot = null;

        // Game State
        this.globalGreenScore = 15;
        this.globalPollution = 65;
        this.activeEvent = GLOBAL_EVENTS[0];
        this.currentPhase = GAME_PHASES[0];

        this.players = [];
        this.currentPlayerIdx = 0;
        this.isTurnProcessing = false;
        this.isGameOver = false;

        this.logListEl = null;
    }

    start(config) {
        // Initialize Core Components
        this.board = new GameBoard("boardContainer");
        this.threeHub = new ThreeBoardHub("threeHubCanvas");
        this.cardModal = new CardModal(this);
        this.craftingSystem = new CraftingSystem(this);
        this.ecoBot = new EcoBotAI(this);
        window.ecoBot = this.ecoBot;

        // Setup Players from Room Lobby
        if (config.playersList && config.playersList.length > 0) {
            this.players = config.playersList.map((p, idx) => {
                const roleObj = PLAYER_ROLES.find(r => r.id === p.roleId) || PLAYER_ROLES[idx % PLAYER_ROLES.length];
                return {
                    id: p.id,
                    name: p.name,
                    isAI: p.isAI || false,
                    roleId: roleObj.id,
                    role: roleObj,
                    avatar: roleObj.avatar,
                    image: p.image || roleObj.image,
                    color: p.color || ["#10b981", "#0284c7", "#f59e0b", "#8b5cf6"][idx % 4],
                    position: 0,
                    greenPoints: 5,
                    ecoCoins: 300,
                    cards: [
                        GREEN_CARDS.find(c => c.id === "cay_xanh"),
                        GREEN_CARDS.find(c => c.id === "rac_huu_co"),
                        GREEN_CARDS.find(c => c.id === "ba_mia")
                    ]
                };
            });
        } else {
            // Fallback default
            const humanRole = PLAYER_ROLES.find(r => r.id === config.roleId) || PLAYER_ROLES[0];
            const humanPlayer = {
                id: "player_human",
                name: config.name || "Chiến Binh Xanh",
                isAI: false,
                roleId: humanRole.id,
                role: humanRole,
                avatar: humanRole.avatar,
                image: humanRole.image,
                color: config.color || "#10b981",
                position: 0,
                greenPoints: 5,
                ecoCoins: 300,
                cards: [
                    GREEN_CARDS.find(c => c.id === "cay_xanh"),
                    GREEN_CARDS.find(c => c.id === "rac_huu_co"),
                    GREEN_CARDS.find(c => c.id === "ba_mia")
                ]
            };

            this.players = [humanPlayer];

            const otherRoles = PLAYER_ROLES.filter(r => r.id !== humanRole.id);
            const botNames = ["Dr. Tuệ Minh", "Kỹ Sư An", "Hà Sinh Thái"];
            otherRoles.slice(0, 3).forEach((r, idx) => {
                this.players.push({
                    id: `player_bot_${idx}`,
                    name: botNames[idx] || `Bot ${idx + 1}`,
                    isAI: true,
                    roleId: r.id,
                    role: r,
                    avatar: r.avatar,
                    image: r.image,
                    color: ["#0284c7", "#f59e0b", "#8b5cf6"][idx],
                    position: 0,
                    greenPoints: 4,
                    ecoCoins: 250,
                    cards: [
                        GREEN_CARDS.find(c => c.id === "khung_nhom") || GREEN_CARDS[0],
                        GREEN_CARDS.find(c => c.id === "cay_xanh") || GREEN_CARDS[0]
                    ]
                });
            });
        }

        // Store Room Code
        this.roomCode = config.roomCode || "ECO-888";
        const roomText = document.getElementById("roomCodeTextHUD");
        if (roomText) roomText.textContent = this.roomCode;

        // Render pawns on board
        this.board.renderPawns(this.players);

        // Bind HUD & buttons
        this.bindHUD();
        this.updateUI();

        this.logMessage(`🌍 Trò chơi bắt đầu! Hành trình phục hồi Trái Đất cùng ${this.players.length} người chơi.`);
        this.threeHub.updateGlobalHealth(this.globalGreenScore);
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIdx];
    }

    bindHUD() {
        this.logListEl = document.getElementById("gameLogList");

        // Roll Dice Button
        const btnRoll = document.getElementById("btnRollDice");
        if (btnRoll) {
            btnRoll.addEventListener("click", () => this.handlePlayerRoll());
        }

        // Crafting Button in top HUD
        const btnOpenCraft = document.getElementById("btnOpenCrafting");
        if (btnOpenCraft) {
            btnOpenCraft.addEventListener("click", () => this.craftingSystem.show());
        }

        // Sound Toggle Button
        const btnSound = document.getElementById("btnToggleSound");
        if (btnSound) {
            btnSound.addEventListener("click", () => {
                const isMuted = window.soundEngine.toggleMute();
                btnSound.innerHTML = isMuted ? "🔇 Âm thanh: Tắt" : "🔊 Âm thanh: Bật";
                btnSound.classList.toggle("opacity-60", isMuted);
            });
        }

        // View 3D / 2D Toggle
        const btnToggleView = document.getElementById("btnToggleView");
        if (btnToggleView) {
            btnToggleView.addEventListener("click", () => {
                const isIso = this.board.toggleView();
                btnToggleView.innerHTML = isIso ? "📐 Góc nhìn: 3D Isometric" : "🗺️ Góc nhìn: 2D Phẳng";
            });
        }

        // EcoBot Button in HUD
        const btnOpenBot = document.getElementById("btnOpenEcoBot");
        if (btnOpenBot) {
            btnOpenBot.addEventListener("click", () => this.ecoBot.toggle());
        }

        // Render Missions in HUD
        this.renderMissionsList();
    }

    renderMissionsList() {
        const missionsContainer = document.getElementById("missionsListContainer");
        if (!missionsContainer) return;
        missionsContainer.innerHTML = "";

        MISSIONS.slice(0, 4).forEach(m => {
            const item = document.createElement("div");
            item.className = "mission-item-card glass-panel";
            item.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="text-xl">${m.icon}</span>
                    <div class="flex-1">
                        <div class="text-xs font-bold text-emerald-200">${m.title}</div>
                        <div class="text-[10px] text-gray-300">${m.requirement}</div>
                    </div>
                    <span class="text-xs font-bold text-amber-300">${m.reward}</span>
                </div>
            `;
            missionsContainer.appendChild(item);
        });
    }

    // --- TURN CYCLE ---

    async handlePlayerRoll() {
        if (this.isTurnProcessing || this.isGameOver) return;
        const player = this.getCurrentPlayer();
        if (player.isAI) return;

        this.isTurnProcessing = true;
        document.getElementById("btnRollDice").disabled = true;

        // Roll 2 dice (1 to 6 each)
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const sum = d1 + d2;

        this.threeHub.rollDice(d1, d2, (total) => {
            this.showDiceBadge(total);
            this.executePlayerMove(player, total);
        });
    }

    showDiceBadge(sum) {
        const badge = document.getElementById("diceRollResultBadge");
        const sumText = document.getElementById("diceSumText");
        if (badge && sumText) {
            sumText.textContent = sum;
            badge.classList.remove("hidden");
            setTimeout(() => badge.classList.add("hidden"), 3000);
        }
    }

    async executePlayerMove(player, steps) {
        // Bonus steps if player has Electric Vehicle
        const hasEV = player.cards.some(c => c.id === "xe_dien_xanh");
        const effectiveSteps = hasEV ? steps + 2 : steps;

        if (hasEV) {
            this.logMessage(`⚡ ${player.name} tăng tốc +2 ô nhờ Thẻ Xe Điện Xanh!`);
        }

        const startPos = player.position;
        const targetPos = (startPos + effectiveSteps) % 40;

        // Animate pawn move tile-by-tile
        await this.board.animateMovePawn(
            player.id,
            startPos,
            effectiveSteps,
            (currPos) => {
                // Check if passed Start (Tile 0)
                if (currPos === 0 && startPos !== 0) {
                    player.ecoCoins += 200;
                    player.greenPoints += 2;
                    this.addGlobalScore(2);
                    this.logMessage(`🌱 ${player.name} đi qua Trạm Khởi Hành Xanh: +200 Tiền Xanh & +2 Điểm Sức Khỏe!`);
                }
            },
            async (finalPos, tile) => {
                player.position = finalPos;
                await this.handleTileAction(player, tile);
                this.updateUI();
                this.finishTurn();
            }
        );
    }

    async handleTileAction(player, tile) {
        this.logMessage(`📍 ${player.name} đặt chân đến [Ô #${tile.id}: ${tile.name}] (${tile.zoneName})`);

        // Citizen Zone Bonus
        if (player.roleId === "citizen" && tile.zone === "ocean") {
            player.greenPoints += 2;
            this.addGlobalScore(2);
            this.logMessage(`🧑‍🤝‍🧑 Đặc quyền Cư Dân Xanh: Nhặt rác tại bờ biển, nhận thêm +2 Điểm Xanh!`);
        }

        // Check Tile Type
        if (tile.cardType === "green") {
            // Draw a Green Card
            const card = this.getRandomGreenCard();
            await new Promise(resolve => {
                if (player.isAI) {
                    player.cards.push(card);
                    player.greenPoints += card.points || 2;
                    this.addGlobalScore(card.points || 2);
                    this.logMessage(`✨ [AI] ${player.name} nhận Thẻ: ${card.name} (+${card.points || 2} điểm)`);
                    resolve();
                } else {
                    this.cardModal.showCard(card, () => {
                        this.applyCardEffects(player, card);
                        resolve();
                    });
                }
            });
        } else if (tile.cardType === "pollution") {
            // Draw a Pollution Card
            const card = this.getRandomPollutionCard();
            await new Promise(resolve => {
                if (player.isAI) {
                    this.applyCardEffects(player, card);
                    resolve();
                } else {
                    this.cardModal.showCard(card, () => {
                        this.applyCardEffects(player, card);
                        resolve();
                    });
                }
            });
        } else if (tile.effectType === "sanctuary") {
            // Corner 10 - Eco Sanctuary
            player.greenPoints += 2;
            this.addGlobalScore(2);
            this.logMessage(`🦜 ${player.name} dừng chân tại Khu Bảo Tồn Sinh Thái: +2 Điểm Xanh & miễn nhiễm thẻ phạt!`);
        } else if (tile.effectType === "energy") {
            // Corner 20 - Natural Energy Hub
            player.greenPoints += 3;
            this.addGlobalScore(3);
            this.logMessage(`⚡ ${player.name} hấp thụ Năng Lượng Thiên Nhiên: +3 Điểm Xanh!`);
        } else if (tile.effectType === "disaster") {
            // Corner 30 - Disaster Area
            player.greenPoints = Math.max(0, player.greenPoints - 2);
            this.increasePollution(5);
            this.logMessage(`☣️ ${player.name} đi lạc vào Vùng Ô Nhiễm Nguy Cấp! Bị phạt -2 Điểm Xanh.`);
        }
    }

    getRandomGreenCard() {
        const pool = GREEN_CARDS;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    getRandomPollutionCard() {
        const pool = POLLUTION_CARDS;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    applyCardEffects(player, card) {
        const isPollution = card.category === "pollution" || card.penalty !== undefined;

        if (!isPollution) {
            // Check Farmer passive: +1 on tree cards
            let pts = card.points || 2;
            if (player.roleId === "farmer" && card.id === "cay_xanh") {
                pts += 1;
                this.logMessage(`👨‍🌾 Đặc quyền Bác Nông Dân: +1 Điểm Thưởng Cây Trồng!`);
            }
            // Check Engineer passive: double points on solar / wind
            if (player.roleId === "engineer" && (card.id.includes("mat_troi") || card.id.includes("tuabin"))) {
                pts *= 2;
                this.logMessage(`👷‍♂️ Đặc quyền Kỹ Sư: Gấp đôi điểm số Năng Lượng Tái Tạo!`);
            }

            player.cards.push(card);
            player.greenPoints += pts;
            this.addGlobalScore(pts);
            this.reducePollution(3);
            this.logMessage(`✨ ${player.name} nhận [${card.name}]: +${pts} Điểm Xanh!`);
        } else {
            // Check if player has Smart Recycling Workshop to block negative effect
            const workshopIdx = player.cards.findIndex(c => c.id === "xuong_tai_che_thong_minh");
            if (workshopIdx > -1) {
                player.cards.splice(workshopIdx, 1);
                this.logMessage(`🛡️ ${player.name} đã dùng [Thẻ Xưởng Tái Chế Thông Minh] để CHẶN đứng tác hại của ${card.name}!`);
                return;
            }

            // Check if player has BioGreen to be immune
            const bioIdx = player.cards.findIndex(c => c.id === "biogreen");
            if (bioIdx > -1) {
                player.cards.splice(bioIdx, 1);
                this.logMessage(`🧪 ${player.name} sử dụng [Thẻ BioGreen] để miễn nhiễm hoàn toàn ${card.name}!`);
                return;
            }

            // Check Engineer immunity to energy outage
            if (player.roleId === "engineer" && card.id === "can_kiet_nang_luong") {
                this.logMessage(`👷‍♂️ Đặc quyền Kỹ Sư: Độc lập năng lượng, hoàn toàn miễn nhiễm Cạn Kiệt Năng Lượng!`);
                return;
            }

            // Check EV immunity to traffic smoke
            const hasEV = player.cards.some(c => c.id === "xe_dien_xanh");
            if (card.id === "khoi_xe_co" && hasEV) {
                player.greenPoints += 3;
                this.addGlobalScore(3);
                this.logMessage(`🚗 ${player.name} sở hữu Xe Điện Xanh: Miễn nhiễm Khói Xe Cộ và nhận thưởng +3 Điểm Xanh!`);
                return;
            }

            // Farmer partial drought resistance
            let loss = Math.abs(card.points || 2);
            if (card.id === "han_han_toan_cau" && player.roleId === "farmer") {
                loss = 1;
                this.logMessage(`👨‍🌾 Bác Nông Dân có kỹ năng trữ nước chống hạn, giảm 50% thiệt hại (-1 điểm thay vì -3 điểm)!`);
            }

            // Apply penalty
            player.greenPoints = Math.max(0, player.greenPoints - loss);
            this.increasePollution(8);
            this.logMessage(`⚠️ ${player.name} gánh chịu tác động: ${card.name} (-${loss} Điểm Xanh)!`);

            // Check step back penalties
            if (card.penalty === "step_back_2") {
                player.position = (player.position - 2 + 40) % 40;
                this.board.renderPawns(this.players);
            } else if (card.penalty === "step_back_1") {
                player.position = (player.position - 1 + 40) % 40;
                this.board.renderPawns(this.players);
            }
        }
    }

    addGlobalScore(points) {
        this.globalGreenScore = Math.min(100, this.globalGreenScore + points);
        this.threeHub.updateGlobalHealth(this.globalGreenScore);

        // Update Phase
        if (this.globalGreenScore >= 76) {
            this.currentPhase = GAME_PHASES[3];
        } else if (this.globalGreenScore >= 51) {
            this.currentPhase = GAME_PHASES[2];
        } else if (this.globalGreenScore >= 26) {
            this.currentPhase = GAME_PHASES[1];
        } else {
            this.currentPhase = GAME_PHASES[0];
        }

        // Check Victory
        if (this.globalGreenScore >= 100 && !this.isGameOver) {
            this.triggerVictory();
        }
    }

    reducePollution(percent) {
        this.globalPollution = Math.max(0, this.globalPollution - percent);
        this.updateUI();
    }

    increasePollution(percent) {
        this.globalPollution = Math.min(100, this.globalPollution + percent);
        this.updateUI();
        if (this.globalPollution >= 100 && !this.isGameOver) {
            this.triggerDefeat();
        }
    }

    finishTurn() {
        this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length;
        const nextPlayer = this.getCurrentPlayer();

        this.updateUI();

        if (nextPlayer.isAI && !this.isGameOver) {
            document.getElementById("btnRollDice").disabled = true;
            setTimeout(() => this.runAITurn(nextPlayer), 1500);
        } else {
            this.isTurnProcessing = false;
            document.getElementById("btnRollDice").disabled = false;
        }
    }

    async runAITurn(bot) {
        this.logMessage(`🤖 Lượt của AI: [${bot.name} (${bot.role.name})] đang suy nghĩ...`);

        // AI Dice Roll
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;

        this.threeHub.rollDice(d1, d2, (total) => {
            this.showDiceBadge(total);
            this.executePlayerMove(bot, total);
        });
    }

    updateUI() {
        // Update Progress Bars
        const healthBar = document.getElementById("earthHealthBar");
        const healthVal = document.getElementById("earthHealthVal");
        if (healthBar && healthVal) {
            healthBar.style.width = `${this.globalGreenScore}%`;
            healthVal.textContent = `${this.globalGreenScore} / 100`;
        }

        const polBar = document.getElementById("pollutionBar");
        const polVal = document.getElementById("pollutionVal");
        if (polBar && polVal) {
            polBar.style.width = `${this.globalPollution}%`;
            polVal.textContent = `${this.globalPollution}% (${this.globalPollution > 70 ? 'Nguy cấp' : (this.globalPollution > 30 ? 'Báo động' : 'An toàn')})`;
        }

        // Update Phase text & description
        const phaseNameEl = document.getElementById("currentPhaseName");
        const phaseDescEl = document.getElementById("currentPhaseDesc");
        if (phaseNameEl && this.currentPhase) {
            phaseNameEl.textContent = `Giai Đoạn ${this.currentPhase.phase}: ${this.currentPhase.name}`;
        }
        if (phaseDescEl && this.currentPhase) {
            phaseDescEl.textContent = this.currentPhase.description;
        }

        // Update Global Event ticker
        const eventTicker = document.getElementById("globalEventTicker");
        if (eventTicker && this.activeEvent) {
            eventTicker.textContent = `${this.activeEvent.icon} ${this.activeEvent.name} - ${this.activeEvent.description}`;
        }

        // Current turn banner
        const turnBadge = document.getElementById("currentTurnPlayerBadge");
        if (turnBadge) {
            const curr = this.getCurrentPlayer();
            turnBadge.innerHTML = `
                <span class="inline-block w-3 h-3 rounded-full mr-2" style="background:${curr.color}"></span>
                <span>Lượt chơi: <strong>${curr.name}</strong> (${curr.role.name})</span>
            `;
        }

        // Player Scoreboard
        this.renderScoreboard();
    }

    renderScoreboard() {
        const container = document.getElementById("playersScoreboardList");
        if (!container) return;
        container.innerHTML = "";

        this.players.forEach(p => {
            const isTurn = p.id === this.getCurrentPlayer().id;
            const row = document.createElement("div");
            row.className = `player-card-hud glass-panel ${isTurn ? 'current-turn-border' : ''}`;
            row.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style="border: 2px solid ${p.color}; box-shadow: 0 0 10px ${p.color}66">
                        ${p.image ? `<img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" />` : `<span class="text-xl">${p.avatar}</span>`}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-bold text-white flex items-center gap-1 truncate">
                            ${p.name}
                            ${p.isAI ? '<span class="text-[9px] px-1 rounded bg-gray-700 text-gray-300">BOT</span>' : '<span class="text-[9px] px-1 rounded bg-emerald-700 text-emerald-200">BẠN</span>'}
                        </div>
                        <div class="text-[10px] text-emerald-300/80">${p.role.name}</div>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <div class="text-base font-black text-amber-300">${p.greenPoints}đ</div>
                        <div class="text-[10px] text-gray-300">${p.cards.length} thẻ bài</div>
                    </div>
                </div>
            `;
            container.appendChild(row);
        });
    }

    logMessage(msg) {
        if (!this.logListEl) return;
        const li = document.createElement("li");
        li.className = "log-entry";
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        li.innerHTML = `<span class="log-time text-gray-400 text-[10px]">[${time}]</span> <span class="log-text">${msg}</span>`;
        this.logListEl.prepend(li);

        // Keep maximum 40 log lines
        while (this.logListEl.children.length > 40) {
            this.logListEl.removeChild(this.logListEl.lastChild);
        }
    }

    triggerVictory() {
        this.isGameOver = true;
        if (window.soundEngine) window.soundEngine.playGaiaStorm();

        const modal = document.createElement("div");
        modal.className = "eco-modal-backdrop";
        modal.innerHTML = `
            <div class="eco-modal-dialog glass-panel text-center p-8 border-2 border-emerald-400 max-w-lg">
                <div class="text-7xl mb-4 animate-bounce">🏆🌍🕊️</div>
                <h2 class="text-3xl font-black text-emerald-300">TRÁI ĐẤT ĐÃ HOÀN TOÀN HỒI SINH!</h2>
                <p class="text-sm text-gray-200 mt-3">
                    Chúc mừng bạn và các Chiến Binh Xanh! Chỉ số Sức Khỏe Toàn Cầu đã đạt <strong>100 Điểm Xanh</strong>. Kỷ nguyên sinh thái Gaia Harmony đã mở ra rực rỡ!
                </p>
                <button onclick="location.reload()" class="eco-btn-action gold-glow mt-6 px-8 py-3 text-lg font-bold">
                    🔄 Chơi Lại Hành Trình Mới
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    triggerDefeat() {
        this.isGameOver = true;
        if (window.soundEngine) window.soundEngine.playAlert();

        const modal = document.createElement("div");
        modal.className = "eco-modal-backdrop";
        modal.innerHTML = `
            <div class="eco-modal-dialog glass-panel text-center p-8 border-2 border-rose-500 max-w-lg">
                <div class="text-7xl mb-4">☣️🌪️⚠️</div>
                <h2 class="text-3xl font-black text-rose-400">KHỦNG HOẢNG SINH THÁI!</h2>
                <p class="text-sm text-gray-200 mt-3">
                    Mức độ Ô Nhiễm đã chạm mốc 100%! Bầu khí quyển bị đầu độc và thiên tai tàn phá. Hãy rút kinh nghiệm và bảo vệ Trái Đất tốt hơn ở lượt chơi kế tiếp.
                </p>
                <button onclick="location.reload()" class="eco-btn-action danger-glow mt-6 px-8 py-3 text-lg font-bold">
                    🔄 Thử Thách Lại
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

window.EconovaGame = EconovaGame;

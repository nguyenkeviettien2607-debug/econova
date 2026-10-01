/**
 * ECONOVA - Crafting Bench System (Bàn Chế Tạo Xanh)
 * Drag-and-drop / slot-selection interactive workbench for synthesizing
 * high-tech eco inventions, renewable equipment, and the ultimate Gaia Master Combo.
 */
class CraftingSystem {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.modal = null;
        this.selectedRecipe = null;
        this.slots = [];
        this.initDOM();
    }

    initDOM() {
        let el = document.getElementById("craftingModal");
        if (!el) {
            el = document.createElement("div");
            el.id = "craftingModal";
            el.className = "eco-modal-backdrop hidden";
            el.innerHTML = `
                <div class="eco-modal-dialog crafting-dialog-glass">
                    <div class="modal-header">
                        <div class="flex items-center gap-3">
                            <span class="text-3xl">🧪</span>
                            <div>
                                <h2 class="text-2xl font-black text-emerald-300">BÀN CHẾ TẠO XANH (CRAFTING BENCH)</h2>
                                <p class="text-xs text-emerald-100/70">Kết hợp các nguyên liệu sinh thái để tạo nên các công trình và phát minh vĩ đại</p>
                            </div>
                        </div>
                        <button id="btnCloseCrafting" class="modal-close-btn">&times;</button>
                    </div>

                    <div class="crafting-body-grid">
                        <!-- Left: Recipe Book -->
                        <div class="recipes-sidebar glass-panel">
                            <h3 class="text-sm font-bold text-amber-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <span>📖</span> Sách Công Thức Xanh
                            </h3>
                            <div class="recipes-list" id="craftingRecipeList"></div>
                        </div>

                        <!-- Right: Crafting Fusion Workbench -->
                        <div class="fusion-workbench glass-panel">
                            <div id="recipeHeaderInfo" class="mb-4 text-center">
                                <h4 id="selectedRecipeName" class="text-xl font-bold text-emerald-200">Chọn một công thức để chế tạo</h4>
                                <p id="selectedRecipeDesc" class="text-xs text-gray-300 mt-1">Các nguyên liệu có trong tay sẽ tự động sáng lên.</p>
                            </div>

                            <!-- Fusion Altar with slots -->
                            <div class="fusion-altar-container">
                                <div class="fusion-core-circle">
                                    <div class="core-pulsing-rings"></div>
                                    <div id="fusionResultIcon" class="result-preview-icon">✨</div>
                                </div>

                                <div class="materials-slots-row" id="craftingSlotsContainer">
                                    <!-- Dynamic slots populated here -->
                                </div>
                            </div>

                            <!-- Craft Action Button -->
                            <div class="crafting-action-bar text-center mt-6">
                                <button id="btnExecuteCraft" class="eco-btn-action gold-glow disabled" disabled>
                                    ⚡ KÍCH HOẠT HỢP NHẤT XANH
                                </button>
                                <div id="craftStatusNotice" class="text-xs text-amber-200/80 mt-2 font-medium"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Player Material Inventory Bar -->
                    <div class="player-materials-tray glass-panel mt-4">
                        <h4 class="text-xs font-bold text-emerald-300 mb-2 uppercase tracking-wider">
                            🎒 Nguyên liệu & Thẻ bài trên tay của bạn:
                        </h4>
                        <div id="playerHandMaterials" class="flex flex-wrap gap-2 min-h-[50px] items-center">
                            <!-- Cards on hand chips rendered here -->
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(el);
            this.modal = el;

            // Bind events
            document.getElementById("btnCloseCrafting").addEventListener("click", () => this.hide());
            document.getElementById("btnExecuteCraft").addEventListener("click", () => this.executeCraft());
        }
    }

    show() {
        this.renderRecipeList();
        this.renderPlayerHand();
        if (!this.selectedRecipe && CRAFTING_RECIPES.length > 0) {
            this.selectRecipe(CRAFTING_RECIPES[0]);
        }
        this.modal.classList.remove("hidden");
    }

    hide() {
        this.modal.classList.add("hidden");
    }

    renderRecipeList() {
        const listEl = document.getElementById("craftingRecipeList");
        listEl.innerHTML = "";

        const currentPlayer = this.game.getCurrentPlayer();
        const playerMaterials = currentPlayer ? currentPlayer.cards.map(c => c.id) : [];

        CRAFTING_RECIPES.forEach(recipe => {
            // Check if player has all required materials
            const canCraft = this.canPlayerCraft(recipe, playerMaterials, currentPlayer ? currentPlayer.roleId : null);

            const card = document.createElement("div");
            card.className = `recipe-item-card ${this.selectedRecipe && this.selectedRecipe.id === recipe.id ? 'active' : ''} ${canCraft ? 'craftable-ready' : ''} ${recipe.isUltimateCombo ? 'ultimate-recipe' : ''}`;
            card.innerHTML = `
                <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-emerald-500/30">
                        <img src="${recipe.image}" alt="${recipe.name}" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="recipe-name font-bold text-xs text-emerald-200 truncate">${recipe.name}</div>
                        <div class="recipe-badge text-[10px] text-amber-400 font-semibold">${recipe.badge}</div>
                    </div>
                    <div class="recipe-reward text-right flex-shrink-0">
                        <span class="text-emerald-400 font-bold text-xs">+${recipe.points}đ</span>
                        ${canCraft ? '<span class="ready-dot"></span>' : ''}
                    </div>
                </div>
            `;
            card.addEventListener("click", () => this.selectRecipe(recipe));
            listEl.appendChild(card);
        });
    }

    canPlayerCraft(recipe, playerCardIds, roleId) {
        // Scientist perk: can miss 1 material if recipe has >= 3 materials
        const isScientist = roleId === "scientist";
        let missingCount = 0;

        const inventoryCopy = [...playerCardIds];
        for (const req of recipe.materials) {
            const idx = inventoryCopy.indexOf(req);
            if (idx > -1) {
                inventoryCopy.splice(idx, 1);
            } else {
                missingCount++;
            }
        }

        if (isScientist && recipe.materials.length >= 3 && missingCount <= 1) {
            return true;
        }
        return missingCount === 0;
    }

    selectRecipe(recipe) {
        this.selectedRecipe = recipe;
        document.getElementById("selectedRecipeName").textContent = `${recipe.icon} ${recipe.name}`;
        document.getElementById("selectedRecipeDesc").textContent = recipe.description;
        document.getElementById("fusionResultIcon").innerHTML = `<img src="${recipe.image}" class="w-full h-full rounded-full object-cover" />`;

        const currentPlayer = this.game.getCurrentPlayer();
        const playerCardIds = currentPlayer ? currentPlayer.cards.map(c => c.id) : [];
        const isScientist = currentPlayer && currentPlayer.roleId === "scientist";

        const slotsContainer = document.getElementById("craftingSlotsContainer");
        slotsContainer.innerHTML = "";

        const inventoryCopy = [...playerCardIds];
        let hasAll = true;
        let missing = 0;

        recipe.materials.forEach(matId => {
            const foundCard = GREEN_CARDS.find(c => c.id === matId) || { name: matId, icon: "📦" };
            const inInvIdx = inventoryCopy.indexOf(matId);
            const hasIt = inInvIdx > -1;

            if (hasIt) {
                inventoryCopy.splice(inInvIdx, 1);
            } else {
                missing++;
            }

            const slotEl = document.createElement("div");
            slotEl.className = `craft-material-slot ${hasIt ? 'filled' : 'missing'}`;
            slotEl.innerHTML = `
                <div class="w-12 h-12 rounded-lg overflow-hidden mb-1 border border-white/20">
                    <img src="${foundCard.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80'}" alt="${foundCard.name}" class="w-full h-full object-cover" />
                </div>
                <div class="slot-name">${foundCard.name}</div>
                <div class="slot-status">${hasIt ? '✓ Đủ' : '✗ Thiếu'}</div>
            `;
            slotsContainer.appendChild(slotEl);
        });

        const craftBtn = document.getElementById("btnExecuteCraft");
        const statusNotice = document.getElementById("craftStatusNotice");

        let canCraft = missing === 0;
        if (isScientist && recipe.materials.length >= 3 && missing <= 1) {
            canCraft = true;
            statusNotice.textContent = "👩‍🔬 Đặc quyền Nhà Khoa Học: Được miễn 1 nguyên liệu phụ!";
        } else if (canCraft) {
            statusNotice.textContent = "✨ Tất cả nguyên liệu đã sẵn sàng để hợp nhất!";
        } else {
            statusNotice.textContent = `Thiếu ${missing} nguyên liệu để hoàn thành công thức.`;
        }

        if (canCraft) {
            craftBtn.disabled = false;
            craftBtn.classList.remove("disabled");
        } else {
            craftBtn.disabled = true;
            craftBtn.classList.add("disabled");
        }

        this.renderRecipeList();
    }

    renderPlayerHand() {
        const handContainer = document.getElementById("playerHandMaterials");
        handContainer.innerHTML = "";

        const currentPlayer = this.game.getCurrentPlayer();
        if (!currentPlayer || currentPlayer.cards.length === 0) {
            handContainer.innerHTML = `<span class="text-xs text-gray-400 italic">Bạn chưa có thẻ bài nào trong tay. Hãy đi vào các ô Xanh trên bàn cờ để rút thẻ!</span>`;
            return;
        }

        currentPlayer.cards.forEach(card => {
            const chip = document.createElement("div");
            chip.className = `hand-card-chip ${card.category === 'green' ? 'chip-green' : 'chip-red'}`;
            chip.innerHTML = `
                ${card.image ? `<img src="${card.image}" class="w-5 h-5 rounded-full object-cover border border-white/40" />` : `<span>${card.icon || '🌿'}</span>`}
                <span class="font-medium text-xs">${card.name}</span>
            `;
            handContainer.appendChild(chip);
        });
    }

    executeCraft() {
        if (!this.selectedRecipe) return;
        const player = this.game.getCurrentPlayer();
        if (!player) return;

        // Animate fusion
        const fusionCore = document.querySelector(".fusion-core-circle");
        fusionCore.classList.add("fusion-burst-active");

        if (window.soundEngine) {
            window.soundEngine.playCraftSuccess();
        }

        // Deduct materials from player's hand
        const isScientist = player.roleId === "scientist";
        let waivedOne = !isScientist || this.selectedRecipe.materials.length < 3;

        this.selectedRecipe.materials.forEach(matId => {
            const idx = player.cards.findIndex(c => c.id === matId);
            if (idx > -1) {
                player.cards.splice(idx, 1);
            } else if (!waivedOne) {
                // Waive this missing item for scientist
                waivedOne = true;
            }
        });

        // Award points and add product card
        player.greenPoints += this.selectedRecipe.points;
        this.game.addGlobalScore(this.selectedRecipe.points);

        // Check if this is the ultimate combo
        if (this.selectedRecipe.isUltimateCombo) {
            this.triggerGaiaStorm();
        } else {
            // Normal invention created
            this.game.logMessage(`🎉 ${player.name} vừa chế tạo thành công: ${this.selectedRecipe.name} (+${this.selectedRecipe.points} Điểm Xanh)!`);
        }

        // EcoBot trigger
        if (window.ecoBot) {
            window.ecoBot.sendBotMessage(`Tuyệt vời! Bạn vừa hoàn thành **${this.selectedRecipe.name}**. Hãy tiếp tục thu thập thêm tài nguyên để hồi sinh Trái Đất nhé!`, "excited");
        }

        setTimeout(() => {
            fusionCore.classList.remove("fusion-burst-active");
            this.renderPlayerHand();
            this.selectRecipe(this.selectedRecipe);
            this.game.updateUI();
        }, 1200);
    }

    // Trigger full-board radiant green light storm
    triggerGaiaStorm() {
        if (window.soundEngine) {
            window.soundEngine.playGaiaStorm();
        }

        // Screen Flash Full Board Aurora
        const storm = document.createElement("div");
        storm.className = "gaia-storm-overlay";
        storm.innerHTML = `
            <div class="gaia-storm-content">
                <div class="text-7xl mb-4 animate-bounce">🌟🌍✨</div>
                <h1 class="text-4xl md:text-6xl font-black text-amber-300 drop-shadow-lg tracking-wider">
                    BÃO SÁNG XANH GAIA TOÀN BÀN!
                </h1>
                <p class="text-xl text-emerald-200 mt-4 max-w-xl text-center">
                    COMBO "VÒNG TUẦN HOÀN XANH" ĐÃ ĐƯỢC KÍCH HOẠT! Tất cả người chơi nhận +3 điểm, rác toàn bản đồ giảm một nửa và Trái Đất bừng sáng hồi sinh!
                </p>
            </div>
        `;
        document.body.appendChild(storm);

        // Reward all players +3 points & reduce pollution
        this.game.players.forEach(p => p.greenPoints += 3);
        this.game.reducePollution(30);

        setTimeout(() => {
            storm.classList.add("fade-out");
            setTimeout(() => storm.remove(), 1000);
        }, 4500);
    }
}

window.CraftingSystem = CraftingSystem;

/**
 * ECONOVA - Isometric 3D Board Engine
 * Renders the 40-tile perimeter Monopoly board, handles zone particle effects,
 * hover animations, player pawns, and smooth step-by-step movement animations.
 */
class GameBoard {
    constructor(boardContainerId) {
        this.container = document.getElementById(boardContainerId);
        this.tilesElements = new Map();
        this.pawnsElements = new Map();
        this.isIsometric = true;
        this.particleContainer = null;
        this.init();
    }

    init() {
        if (!this.container) return;
        this.container.innerHTML = "";

        // Particle container overlay
        this.particleContainer = document.createElement("div");
        this.particleContainer.className = "board-particle-overlay pointer-events-none";
        this.container.appendChild(this.particleContainer);

        // Grid Wrapper for 40 perimeter tiles
        const gridWrapper = document.createElement("div");
        gridWrapper.className = "board-grid-wrapper";
        gridWrapper.id = "boardGrid";

        // Generate 40 tiles based on BOARD_TILES
        BOARD_TILES.forEach((tile) => {
            const tileEl = this.createTileElement(tile);
            this.tilesElements.set(tile.id, tileEl);
            gridWrapper.appendChild(tileEl);
        });

        // Center Board Hub Holder
        const centerHub = document.createElement("div");
        centerHub.className = "board-center-hub";
        centerHub.id = "boardCenterHub";
        centerHub.innerHTML = `
            <div id="threeHubCanvas" class="three-hub-container"></div>
            
            <!-- Global Metrics Bar -->
            <div class="global-metrics-glass">
                <div class="metric-item">
                    <span class="metric-label">🌱 SỨC KHỎE TRÁI ĐẤT</span>
                    <div class="progress-bar-bg">
                        <div id="earthHealthBar" class="progress-bar-fill green-gradient" style="width: 15%"></div>
                    </div>
                    <span id="earthHealthVal" class="metric-value text-emerald-400">15 / 100</span>
                </div>
                
                <div class="metric-item">
                    <span class="metric-label">☣️ MỨC ĐỘ Ô NHIỄM</span>
                    <div class="progress-bar-bg">
                        <div id="pollutionBar" class="progress-bar-fill red-gradient" style="width: 65%"></div>
                    </div>
                    <span id="pollutionVal" class="metric-value text-rose-400">65% (Báo động)</span>
                </div>
                
                <div class="metric-item active-event-badge">
                    <span class="metric-label">🌍 SỰ KIỆN TOÀN CẦU</span>
                    <div id="globalEventTicker" class="event-ticker-text text-amber-300">
                        🌊 Bão Nhựa Đại Dương - Rác đang dạt vào bờ!
                    </div>
                </div>
            </div>

            <!-- Dice Roll Station Bar & Action Buttons -->
            <div class="dice-station-controls">
                <div id="diceRollResultBadge" class="roll-result-badge hidden">
                    <span class="text-xs uppercase tracking-wider text-emerald-300">Tổng điểm xúc xắc</span>
                    <span id="diceSumText" class="text-3xl font-black text-amber-400">7</span>
                </div>
                <button id="btnRollDice" class="eco-btn-action primary-glow">
                    🎲 Tung Xúc Xắc 3D
                </button>
            </div>
        `;
        gridWrapper.appendChild(centerHub);

        this.container.appendChild(gridWrapper);

        // Apply grid positioning to each tile
        this.positionTiles();
        this.zoomScale = 0.9;
        this.setupZoomAndPan();
        this.applyTransforms();
    }

    createTileElement(tile) {
        const div = document.createElement("div");
        div.className = `board-tile zone-${tile.zone}`;
        div.dataset.tileId = tile.id;
        div.dataset.zone = tile.zone;

        let zoneBadgeClass = "bg-emerald-800 text-emerald-200";
        if (tile.zone === "ocean") zoneBadgeClass = "bg-cyan-800 text-cyan-200";
        if (tile.zone === "urban") zoneBadgeClass = "bg-teal-800 text-teal-200";
        if (tile.zone === "crisis") zoneBadgeClass = "bg-rose-900 text-rose-200";
        if (tile.zone === "corner") zoneBadgeClass = "bg-amber-800 text-amber-200 font-bold";

        div.innerHTML = `
            <div class="tile-header">
                <span class="tile-id">#${tile.id}</span>
                <span class="tile-icon">${tile.icon}</span>
            </div>
            ${tile.image ? `<div class="tile-thumb-cover" style="background-image: url('${tile.image}')"></div>` : ''}
            <div class="tile-name">${tile.name}</div>
            <div class="tile-footer">
                <span class="tile-zone-badge ${zoneBadgeClass}">${tile.zoneName}</span>
                ${tile.greenPoints !== undefined ? `
                    <span class="tile-points ${tile.greenPoints >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
                        ${tile.greenPoints >= 0 ? '+' : ''}${tile.greenPoints}đ
                    </span>
                ` : ''}
            </div>
            <!-- Zone FX visual container -->
            <div class="tile-fx-overlay"></div>
            <!-- Container for player tokens on this tile -->
            <div class="tile-pawns-slot" id="pawnSlot_${tile.id}"></div>
        `;

        // Interactive hover effects with sound & particles
        div.addEventListener("mouseenter", () => this.handleTileHover(tile, div));

        return div;
    }

    positionTiles() {
        // Grid is 11 columns x 11 rows (0 to 10)
        // Corner 0: bottom-left (grid-row 11, col 1)
        // Bottom row: tiles 1 to 9 (grid-row 11, cols 2 to 10)
        // Corner 10: bottom-right (grid-row 11, col 11)
        // Right col: tiles 11 to 19 (grid-row 10 down to 2, col 11)
        // Corner 20: top-right (grid-row 1, col 11)
        // Top row: tiles 21 to 29 (grid-row 1, cols 10 down to 2)
        // Corner 30: top-left (grid-row 1, col 1)
        // Left col: tiles 31 to 39 (grid-row 2 up to 10, col 1)
        BOARD_TILES.forEach(tile => {
            const el = this.tilesElements.get(tile.id);
            if (!el) return;

            let row, col;
            const id = tile.id;

            if (id === 0) {
                row = 11; col = 1;
            } else if (id >= 1 && id <= 9) {
                row = 11; col = id + 1;
            } else if (id === 10) {
                row = 11; col = 11;
            } else if (id >= 11 && id <= 19) {
                row = 11 - (id - 10); col = 11;
            } else if (id === 20) {
                row = 1; col = 11;
            } else if (id >= 21 && id <= 29) {
                row = 1; col = 11 - (id - 20);
            } else if (id === 30) {
                row = 1; col = 1;
            } else if (id >= 31 && id <= 39) {
                row = id - 30 + 1; col = 1;
            }

            el.style.gridRow = `${row}`;
            el.style.gridColumn = `${col}`;
        });
    }

    handleTileHover(tile, element) {
        if (!window.soundEngine) return;

        // Trigger thematic sound & visual FX based on Zone
        if (tile.zone === "forest") {
            window.soundEngine.playForestFX();
            this.spawnForestParticles(element);
        } else if (tile.zone === "ocean") {
            window.soundEngine.playOceanFX();
            this.spawnOceanParticles(element);
        } else if (tile.zone === "urban") {
            window.soundEngine.playTechFX();
            this.spawnUrbanParticles(element);
        } else if (tile.zone === "crisis") {
            window.soundEngine.playAlert();
            this.spawnCrisisParticles(element);
        }
    }

    // --- ZONE PARTICLE EFFECTS ---

    spawnForestParticles(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 6; i++) {
            const leaf = document.createElement("div");
            leaf.className = "fx-leaf";
            leaf.textContent = ["🍃", "🌱", "🌿", "✨"][Math.floor(Math.random() * 4)];
            leaf.style.left = `${rect.left + Math.random() * rect.width}px`;
            leaf.style.top = `${rect.top + rect.height * 0.7}px`;
            document.body.appendChild(leaf);

            // Animate upward with flutter
            setTimeout(() => leaf.remove(), 1200);
        }
        element.classList.add("pulse-forest-glow");
        setTimeout(() => element.classList.remove("pulse-forest-glow"), 800);
    }

    spawnOceanParticles(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 7; i++) {
            const bubble = document.createElement("div");
            bubble.className = "fx-bubble";
            bubble.style.left = `${rect.left + Math.random() * rect.width}px`;
            bubble.style.top = `${rect.top + rect.height * 0.8}px`;
            document.body.appendChild(bubble);

            setTimeout(() => bubble.remove(), 1400);
        }
        element.classList.add("pulse-ocean-glow");
        setTimeout(() => element.classList.remove("pulse-ocean-glow"), 800);
    }

    spawnUrbanParticles(element) {
        // Laser sweep beam
        const laser = document.createElement("div");
        laser.className = "fx-laser-beam";
        element.appendChild(laser);
        setTimeout(() => laser.remove(), 600);

        element.classList.add("pulse-urban-glow");
        setTimeout(() => element.classList.remove("pulse-urban-glow"), 800);
    }

    spawnCrisisParticles(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
            const smoke = document.createElement("div");
            smoke.className = "fx-smoke";
            smoke.style.left = `${rect.left + Math.random() * rect.width}px`;
            smoke.style.top = `${rect.top + rect.height * 0.5}px`;
            document.body.appendChild(smoke);
            setTimeout(() => smoke.remove(), 1200);
        }
        element.classList.add("pulse-red-alert");
        setTimeout(() => element.classList.remove("pulse-red-alert"), 900);
    }

    // --- PLAYER PAWNS SYSTEM ---

    renderPawns(players) {
        players.forEach(player => {
            let pawn = this.pawnsElements.get(player.id);
            if (!pawn) {
                pawn = document.createElement("div");
                pawn.className = `player-pawn pawn-${player.roleId}`;
                pawn.id = `pawn_${player.id}`;
                const avatarImg = player.image || (player.role ? player.role.image : '');
                pawn.innerHTML = `
                    <div class="pawn-body" style="background-color: ${player.color}; border: 2px solid #fff; box-shadow: 0 0 14px ${player.color}">
                        ${avatarImg ? `<img src="${avatarImg}" alt="${player.name}" class="pawn-img" />` : `<span class="pawn-icon">${player.avatar}</span>`}
                    </div>
                    <div class="pawn-shadow"></div>
                `;
                this.pawnsElements.set(player.id, pawn);
            }

            const slot = document.getElementById(`pawnSlot_${player.position}`);
            if (slot && !slot.contains(pawn)) {
                slot.appendChild(pawn);
            }
        });
    }

    // Smooth step-by-step pawn movement animation across tiles
    async animateMovePawn(playerId, fromPos, steps, onStep, onFinish) {
        const pawn = this.pawnsElements.get(playerId);
        if (!pawn) return;

        let current = fromPos;
        for (let i = 0; i < steps; i++) {
            current = (current + 1) % 40;
            const targetSlot = document.getElementById(`pawnSlot_${current}`);
            const targetTile = BOARD_TILES[current];

            if (targetSlot) {
                // Play hopping sound
                if (window.soundEngine) {
                    window.soundEngine.playPawnStep();
                }

                // Add bounce animation class
                pawn.classList.add("pawn-bounce-hop");
                targetSlot.appendChild(pawn);

                // Flash the tile stepped on
                const tileEl = this.tilesElements.get(current);
                if (tileEl) {
                    tileEl.classList.add("tile-stepped-on");
                    setTimeout(() => tileEl.classList.remove("tile-stepped-on"), 350);
                }

                if (onStep) onStep(current, targetTile);

                await new Promise(res => setTimeout(res, 280));
                pawn.classList.remove("pawn-bounce-hop");
            }
        }

        // Final landing effect
        const finalTile = BOARD_TILES[current];
        const finalTileEl = this.tilesElements.get(current);
        if (finalTile && finalTileEl) {
            this.handleTileHover(finalTile, finalTileEl);
        }

        if (onFinish) onFinish(current, finalTile);
    }

    setupZoomAndPan() {
        const viewport = document.querySelector(".board-viewport-container");
        if (!viewport) return;
        viewport.addEventListener("wheel", (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 0.05 : -0.05;
            this.zoomScale = Math.max(0.55, Math.min(1.35, this.zoomScale + delta));
            this.applyTransforms();
        }, { passive: false });
    }

    applyTransforms() {
        const grid = document.getElementById("boardGrid");
        if (!grid) return;
        if (this.isIsometric) {
            grid.style.transform = `perspective(1400px) rotateX(46deg) rotateZ(-28deg) scale(${this.zoomScale})`;
        } else {
            grid.style.transform = `perspective(1400px) rotateX(0deg) rotateZ(0deg) scale(${this.zoomScale * 0.92})`;
        }
    }

    toggleView() {
        this.isIsometric = !this.isIsometric;
        this.applyTransforms();
        return this.isIsometric;
    }
}

window.GameBoard = GameBoard;

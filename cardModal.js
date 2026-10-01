/**
 * ECONOVA - Magic Card Draw & 3D Card Flip Modal
 * Features:
 * 1. 3D Card flip presentation with realistic perspective and shadow.
 * 2. High-resolution curated web artwork images from Unsplash.
 * 3. Particle glow effects & audio cues based on Green vs Pollution card classifications.
 * 4. Scientific environmental trivia facts.
 */
class CardModal {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.modalEl = null;
        this.currentCard = null;
        this.onCardAction = null;
        this.initDOM();
    }

    initDOM() {
        let el = document.getElementById("magicCardModal");
        if (!el) {
            el = document.createElement("div");
            el.id = "magicCardModal";
            el.className = "eco-modal-backdrop hidden";
            el.innerHTML = `
                <div class="card-draw-stage">
                    <!-- 3D Flipping Card Container -->
                    <div class="card-3d-wrapper" id="cardFlipWrapper">
                        <!-- Card Back (Initial face before flip) -->
                        <div class="magic-card card-face card-back">
                            <div class="card-back-pattern">
                                <div class="eco-sigil">🌱</div>
                                <div class="sigil-ring"></div>
                                <h3 class="sigil-title">ECONOVA</h3>
                                <p class="sigil-subtitle">HÀNH TRÌNH XANH</p>
                            </div>
                        </div>

                        <!-- Card Front (Revealed face after flip) -->
                        <div class="magic-card card-face card-front" id="cardFrontSide">
                            <div class="card-front-header" id="cardCategoryBadge">
                                <span id="cardTypeTag" class="badge-text font-bold">THẺ MÔI TRƯỜNG</span>
                                <span id="cardRarityStars" class="rarity-stars">⭐⭐⭐</span>
                            </div>

                            <!-- High-Resolution Artwork Frame -->
                            <div class="card-front-artwork" id="cardArtworkFrame">
                                <img id="cardImageCover" class="card-cover-image" src="" alt="Lá bài Econova" />
                                <div class="card-artwork-gradient"></div>
                                <div id="cardLargeIcon" class="artwork-icon-badge">🌲</div>
                            </div>

                            <div class="card-front-body">
                                <h3 id="cardTitle" class="card-title-text font-black text-lg text-emerald-200">Thẻ Cây Xanh</h3>
                                <div id="cardPointBadge" class="card-point-pill">+3 Điểm Xanh</div>
                                <p id="cardDescription" class="card-desc-text">
                                    Mô tả chức năng chi tiết của thẻ bài...
                                </p>
                            </div>

                            <div class="card-front-footer">
                                <div class="eco-fact-box" id="cardEcoFactBox">
                                    <span class="fact-tag">🌍 BẠN CÓ BIẾT:</span>
                                    <span id="cardFactText" class="fact-content">Kiến thức môi trường...</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons beneath card -->
                    <div class="card-draw-actions mt-6 flex justify-center gap-4">
                        <button id="btnClaimCard" class="eco-btn-action gold-glow px-6 py-2.5">
                            ✨ Thu Thập Thẻ Bài
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(el);
            this.modalEl = el;

            document.getElementById("btnClaimCard").addEventListener("click", () => this.claim());
        }
    }

    showCard(card, callback) {
        this.currentCard = card;
        this.onCardAction = callback;

        const wrapper = document.getElementById("cardFlipWrapper");
        const frontSide = document.getElementById("cardFrontSide");
        const categoryBadge = document.getElementById("cardCategoryBadge");
        const typeTag = document.getElementById("cardTypeTag");
        const rarityStars = document.getElementById("cardRarityStars");
        const iconEl = document.getElementById("cardLargeIcon");
        const imageEl = document.getElementById("cardImageCover");
        const titleEl = document.getElementById("cardTitle");
        const pointBadge = document.getElementById("cardPointBadge");
        const descEl = document.getElementById("cardDescription");
        const factBox = document.getElementById("cardEcoFactBox");
        const factText = document.getElementById("cardFactText");
        const claimBtn = document.getElementById("btnClaimCard");

        // Reset flip state
        wrapper.classList.remove("flipped");
        frontSide.className = "magic-card card-face card-front";

        // Sound: Card draw whoosh
        if (window.soundEngine) {
            window.soundEngine.playCardDraw();
        }

        // Setup Card Data
        const isPollution = card.category === "pollution" || card.penalty !== undefined;
        iconEl.textContent = card.icon || (isPollution ? "⚠️" : "🌱");

        // High-res photo cover
        if (card.image) {
            imageEl.src = card.image;
            imageEl.style.display = "block";
        } else {
            imageEl.src = isPollution 
                ? "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80"
                : "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80";
        }

        titleEl.textContent = card.name;
        descEl.textContent = card.description;

        if (card.ecoFact) {
            factBox.classList.remove("hidden");
            factText.textContent = card.ecoFact;
        } else {
            factBox.classList.add("hidden");
        }

        if (isPollution) {
            frontSide.classList.add("theme-pollution-card");
            categoryBadge.className = "card-front-header bg-rose-950/80 text-rose-200 border-b border-rose-500/40";
            typeTag.textContent = "THẺ Ô NHIỄM NGUY HẠI";
            rarityStars.textContent = "⚠️⚠️⚠️";
            pointBadge.className = "card-point-pill badge-red";
            pointBadge.textContent = `${card.points} Điểm Xanh`;
            claimBtn.className = "eco-btn-action danger-glow";
            claimBtn.textContent = "Xác Nhận & Gánh Chịu";
        } else {
            frontSide.classList.add("theme-green-card");
            categoryBadge.className = "card-front-header bg-emerald-950/80 text-emerald-200 border-b border-emerald-500/40";
            typeTag.textContent = "THẺ MÔI TRƯỜNG & PHÁT MINH";
            rarityStars.textContent = "🌟🌟🌟";
            pointBadge.className = "card-point-pill badge-green";
            pointBadge.textContent = `+${card.points || 2} Điểm Xanh`;
            claimBtn.className = "eco-btn-action gold-glow";
            claimBtn.textContent = "✨ Thu Thập Lá Bài";
        }

        this.modalEl.classList.remove("hidden");

        // Trigger 3D Card Flip Animation after short delay
        setTimeout(() => {
            wrapper.classList.add("flipped");
            if (window.soundEngine) {
                if (isPollution) {
                    window.soundEngine.playAlert();
                } else {
                    window.soundEngine.playCardSuccess();
                }
            }
            if (window.ecoBot) {
                window.ecoBot.onCardDrawn(card);
            }
        }, 400);
    }

    claim() {
        this.modalEl.classList.add("hidden");
        if (this.onCardAction) {
            this.onCardAction(this.currentCard);
            this.onCardAction = null;
        }
    }
}

window.CardModal = CardModal;

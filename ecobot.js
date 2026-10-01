/**
 * ECONOVA - EcoBot AI Assistant System
 * Cute interactive mascot with animated facial expressions, proactive strategic advisor,
 * 4-phase rulebook analyzer, and real-world environmental science educator.
 */
class EcoBotAI {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.isOpen = false;
        this.widgetEl = null;
        this.chatMessagesEl = null;
        this.messages = [];
        this.isTyping = false;
        this.mood = "happy"; // "happy", "thinking", "excited", "warning"

        this.initDOM();
    }

    initDOM() {
        const botContainer = document.createElement("div");
        botContainer.id = "ecoBotWidget";
        botContainer.className = "ecobot-widget-wrapper";

        botContainer.innerHTML = `
            <!-- Floating Mascot Avatar Button -->
            <button id="ecoBotToggleBtn" class="ecobot-mascot-btn" title="Trò chuyện cùng EcoBot AI">
                <div class="mascot-avatar-svg">
                    <svg viewBox="0 0 100 100" class="w-14 h-14 ecobot-svg">
                        <!-- Antenna with glowing leaf -->
                        <path d="M50 24 Q50 10 40 6 Q55 12 50 24" fill="#34d399" />
                        <circle cx="40" cy="6" r="4.5" fill="#facc15" class="antenna-bulb animate-pulse" />
                        <!-- Head -->
                        <rect x="20" y="24" width="60" height="48" rx="24" fill="#10b981" stroke="#059669" stroke-width="3" />
                        <!-- Screen Face Glass -->
                        <rect x="26" y="32" width="48" height="32" rx="16" fill="#0f172a" />
                        <!-- Eyes (Blinking Animation) -->
                        <ellipse cx="38" cy="46" rx="5" ry="6" fill="#38bdf8" class="bot-eye left-eye" />
                        <ellipse cx="62" cy="46" rx="5" ry="6" fill="#38bdf8" class="bot-eye right-eye" />
                        <!-- Smile Mouth -->
                        <path id="botMouth" d="M42 54 Q50 60 58 54" stroke="#38bdf8" stroke-width="2.5" fill="none" stroke-linecap="round" />
                        <!-- Body / Base -->
                        <ellipse cx="50" cy="78" rx="18" ry="8" fill="#047857" />
                        <!-- Waving Hand -->
                        <path d="M78 50 Q88 40 86 32" stroke="#10b981" stroke-width="4" stroke-linecap="round" fill="none" class="bot-waving-arm" />
                    </svg>
                </div>
                <div class="bot-badge-ping"></div>
                <span class="bot-label">EcoBot AI</span>
            </button>

            <!-- Chat Sidebar Window -->
            <div id="ecoBotChatPanel" class="ecobot-chat-panel glass-panel hidden">
                <div class="chat-header">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-lg">
                            🤖
                        </div>
                        <div>
                            <h3 class="font-bold text-sm text-emerald-200">EcoBot AI Assistant</h3>
                            <span class="text-[10px] text-emerald-400 flex items-center gap-1">
                                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Sẵn sàng hỗ trợ bạn
                            </span>
                        </div>
                    </div>
                    <button id="btnCloseEcoBot" class="text-gray-400 hover:text-white text-lg">&times;</button>
                </div>

                <!-- Chat History -->
                <div id="ecoBotMessages" class="chat-messages-container"></div>

                <!-- Typing Indicator -->
                <div id="ecoBotTyping" class="bot-typing-row hidden">
                    <div class="typing-bubble">
                        <span></span><span></span><span></span>
                    </div>
                    <span class="text-[10px] text-gray-400 italic">EcoBot đang phân tích...</span>
                </div>

                <!-- Quick Action Chips -->
                <div class="quick-chips-row">
                    <button class="quick-chip" data-action="strategy">💡 Chiến thuật</button>
                    <button class="quick-chip" data-action="rules">📜 4 Giai đoạn</button>
                    <button class="quick-chip" data-action="craft">🧪 Công thức</button>
                    <button class="quick-chip" data-action="facts">🌍 Kiến thức xanh</button>
                </div>

                <!-- Chat Input Box -->
                <form id="ecoBotForm" class="chat-input-form">
                    <input type="text" id="ecoBotInput" placeholder="Hỏi EcoBot về nước đi, luật chơi..." autocomplete="off" />
                    <button type="submit" id="btnSendBot" class="send-btn">
                        ➤
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(botContainer);
        this.widgetEl = botContainer;
        this.chatMessagesEl = document.getElementById("ecoBotMessages");

        // Bind events
        document.getElementById("ecoBotToggleBtn").addEventListener("click", () => this.toggle());
        document.getElementById("btnCloseEcoBot").addEventListener("click", () => this.toggle());

        document.getElementById("ecoBotForm").addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleUserSend();
        });

        // Quick chips click
        document.querySelectorAll(".quick-chip").forEach(chip => {
            chip.addEventListener("click", () => {
                const action = chip.dataset.action;
                this.handleQuickChip(action);
            });
        });

        // Initial Greeting
        this.sendBotMessage(
            "Xin chào! Tôi là **EcoBot AI** 🌿, người bạn đồng hành trong Hành Trình Xanh ECONOVA! Hãy tung xúc xắc và thu thập thẻ bài, tôi sẽ liên tục phân tích và gợi ý nước đi tối ưu cho bạn.",
            "happy"
        );
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById("ecoBotChatPanel");
        if (this.isOpen) {
            panel.classList.remove("hidden");
            this.scrollBottom();
        } else {
            panel.classList.add("hidden");
        }
    }

    setMood(mood) {
        this.mood = mood;
        const mouth = document.getElementById("botMouth");
        if (!mouth) return;
        if (mood === "happy") {
            mouth.setAttribute("d", "M42 54 Q50 60 58 54");
        } else if (mood === "thinking") {
            mouth.setAttribute("d", "M44 56 Q50 56 56 56");
        } else if (mood === "excited") {
            mouth.setAttribute("d", "M40 52 Q50 64 60 52");
        } else if (mood === "warning") {
            mouth.setAttribute("d", "M42 58 Q50 52 58 58");
        }
    }

    sendBotMessage(text, mood = "happy") {
        this.setMood(mood);
        if (window.soundEngine) {
            window.soundEngine.playBotChat();
        }

        const msgObj = { sender: "bot", text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        this.messages.push(msgObj);
        this.renderMessage(msgObj);
    }

    sendUserMessage(text) {
        const msgObj = { sender: "user", text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        this.messages.push(msgObj);
        this.renderMessage(msgObj);
    }

    renderMessage(msg) {
        const bubble = document.createElement("div");
        bubble.className = `chat-bubble-row ${msg.sender === 'bot' ? 'bot-row' : 'user-row'}`;

        // Parse markdown bold & icons
        const formattedText = msg.text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br/>');

        bubble.innerHTML = `
            <div class="message-bubble ${msg.sender === 'bot' ? 'bubble-bot' : 'bubble-user'}">
                <div class="bubble-text">${formattedText}</div>
                <div class="bubble-time">${msg.time}</div>
            </div>
        `;

        this.chatMessagesEl.appendChild(bubble);
        this.scrollBottom();
    }

    scrollBottom() {
        if (this.chatMessagesEl) {
            this.chatMessagesEl.scrollTop = this.chatMessagesEl.scrollHeight;
        }
    }

    showTyping(show = true) {
        this.isTyping = show;
        const el = document.getElementById("ecoBotTyping");
        if (el) {
            if (show) el.classList.remove("hidden");
            else el.classList.add("hidden");
            this.scrollBottom();
        }
    }

    handleUserSend() {
        const input = document.getElementById("ecoBotInput");
        const query = input.value.trim();
        if (!query) return;

        this.sendUserMessage(query);
        input.value = "";

        this.showTyping(true);
        setTimeout(() => {
            this.showTyping(false);
            this.processQuery(query);
        }, 600);
    }

    handleQuickChip(action) {
        if (!this.isOpen) this.toggle();
        this.showTyping(true);

        setTimeout(() => {
            this.showTyping(false);
            if (action === "strategy") {
                this.provideRealtimeStrategy();
            } else if (action === "rules") {
                this.explain4Phases();
            } else if (action === "craft") {
                this.showCraftAdvice();
            } else if (action === "facts") {
                this.shareRandomEcoFact();
            }
        }, 500);
    }

    // --- REALTIME STRATEGY ADVISOR ---
    provideRealtimeStrategy() {
        const player = this.game.getCurrentPlayer();
        if (!player) return;

        const cardIds = player.cards.map(c => c.id);

        // Check if player has sugarcane recipe ingredients
        if (cardIds.includes("ba_mia")) {
            this.sendBotMessage("💡 **Gợi ý chiến thuật:** Bạn đang sở hữu **Thẻ Bã Mía**! Hãy cố gắng thu thập thêm **Thẻ Nước** và **Thẻ Khuôn Tạo Hình** để ghép thành **Ống Hút Bã Mía** (nhận ngay +4 Điểm Xanh và tiến thêm 1 bước)!", "excited");
            return;
        }

        // Check if player has solar panel ingredients
        if (cardIds.includes("khung_nhom") || cardIds.includes("tam_nen") || cardIds.includes("kinh_cuong_luc")) {
            this.sendBotMessage("☀️ **Gợi ý chiến thuật:** Bạn đang có một phần linh kiện của **Pin Năng Lượng Mặt Trời**. Hãy tìm các thẻ linh kiện còn lại để ghép phiên bản cao cấp nhận tới +5 Điểm Xanh!", "happy");
            return;
        }

        // Check if player has tree cards
        const treeCount = cardIds.filter(id => id === "cay_xanh").length;
        if (treeCount >= 2 && treeCount < 5) {
            this.sendBotMessage(`🌲 Bạn đã có **${treeCount}/5 Thẻ Cây Xanh**. Cố gắng thu thập đủ 5 thẻ để hợp nhất thành **Cánh Rừng Xanh Phục Hồi** giúp tăng tốc chỉ số Trái Đất nhé!`, "happy");
            return;
        }

        // Check role specific tip
        if (player.roleId === "farmer") {
            this.sendBotMessage("👨‍🌾 **Đặc quyền Bác Nông Dân:** Bạn nhận thêm +1 điểm với mọi cây trồng và kháng hạn hán. Hãy ưu tiên di chuyển tại **Khu Rừng U Ám**!", "happy");
        } else if (player.roleId === "scientist") {
            this.sendBotMessage("👩‍🔬 **Đặc quyền Nhà Khoa Học:** Bạn được giảm 1 nguyên liệu phụ khi chế tạo. Hãy mở ngay **Bàn Chế Tạo Xanh** để xem các công thức đã sẵn sàng!", "excited");
        } else if (player.roleId === "engineer") {
            this.sendBotMessage("👷‍♂️ **Đặc quyền Kỹ Sư:** Bạn được gấp đôi điểm từ các nguồn năng lượng tái tạo. Hãy hướng tới chế tạo **Tuabin Gió** và **Pin Mặt Trời**!", "happy");
        } else {
            this.sendBotMessage("🧑‍🤝‍🧑 **Đặc quyền Cư Dân Xanh:** Nhặt rác tại **Khu Đại Dương** sẽ mang lại điểm số vượt trội cho bạn và toàn đội!", "happy");
        }
    }

    // --- 4 PHASES EXPLANATION ---
    explain4Phases() {
        const text = `📜 **4 GIAI ĐOẠN HỒI SINH TRÁI ĐẤT:**\n` +
            `• **Giai đoạn 1 (0-25đ) - Thức Tỉnh Xanh:** Khói bụi mịt mù, dọn dẹp rác cơ bản & gieo mầm đầu tiên.\n` +
            `• **Giai đoạn 2 (26-50đ) - Hành Động Cứu Nguy:** Bầu trời hé sáng, phát động làm sạch bãi biển & phân loại rác.\n` +
            `• **Giai đoạn 3 (51-75đ) - Đột Phá Công Nghệ:** Năng lượng gió, điện mặt trời và vật liệu sinh học thay thế than đá.\n` +
            `• **Giai đoạn 4 (76-100đ) - Gaia Harmony:** Trái Đất bừng sáng ngọc bích, hoàn thành sứ mệnh cứu toàn cầu!`;
        this.sendBotMessage(text, "happy");
    }

    showCraftAdvice() {
        this.sendBotMessage("🧪 **Mở Bàn Chế Tạo Xanh:** Bạn có thể bấm nút **Bàn Chế Tạo** trên thanh điều khiển bất kỳ lúc nào để ghép các nguyên liệu trên tay. Đặc biệt, nếu ghép đủ 4 thành phần của **Combo Vòng Tuần Hoàn Xanh**, bạn sẽ kích hoạt hiện tượng Bão Sáng Gaia toàn bàn cờ!", "excited");
        if (this.game.craftingSystem) {
            this.game.craftingSystem.show();
        }
    }

    shareRandomEcoFact() {
        const facts = [
            "Ống hút bã mía phân hủy 100% trong đất sau 6 tháng thành phân bón hữu cơ, không chứa bất kỳ vi nhựa độc hại nào!",
            "Tái chế 1 tấn giấy có thể cứu sống 17 cây xanh trưởng thành và tiết kiệm 26,000 lít nước sạch.",
            "Rừng ngập mặn có khả năng lưu trữ carbon cao gấp 4 lần so với các khu rừng mưa nhiệt đới trên cạn.",
            "Năng lượng mặt trời chiếu xuống Trái Đất trong 1 giờ đủ cung cấp điện cho toàn nhân loại sử dụng trong cả 1 năm.",
            "Khoảng 8 triệu tấn rác thải nhựa bị thải ra đại dương mỗi năm, tương đương việc cứ mỗi phút có 1 xe tải rác đổ xuống biển."
        ];
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        this.sendBotMessage(`🌍 **Kiến thức xanh thực tế:**\n${randomFact}`, "happy");
    }

    // Proactive hook when player draws a card
    onCardDrawn(card) {
        if (!card) return;
        if (card.category === "pollution") {
            this.sendBotMessage(`⚠️ **Báo Động Ô Nhiễm:** Rút phải lá bài **${card.name}**! ${card.warning || ''}. ${card.ecoFact || ''}`, "warning");
        } else if (card.ecoFact) {
            this.sendBotMessage(`✨ **Bài học môi trường từ ${card.name}:**\n${card.ecoFact}`, "happy");
        }
    }

    processQuery(query) {
        const q = query.toLowerCase();
        if (q.includes("luật") || q.includes("giai đoạn") || q.includes("phase")) {
            this.explain4Phases();
        } else if (q.includes("chế tạo") || q.includes("craft") || q.includes("công thức") || q.includes("ghép")) {
            this.showCraftAdvice();
        } else if (q.includes("chiến thuật") || q.includes("nước đi") || q.includes("làm gì") || q.includes("gợi ý")) {
            this.provideRealtimeStrategy();
        } else if (q.includes("ô nhiễm") || q.includes("giảm") || q.includes("khói")) {
            this.sendBotMessage("🌱 Để giảm chỉ số Ô Nhiễm Toàn Cầu, hãy tập trung trồng cây ở Khu Rừng U Ám, dọn rác ở Đại Dương và chế tạo Hộp Phân Loại Rác Thông Minh AI nhé!", "happy");
        } else {
            this.sendBotMessage(`Tôi hiểu bạn đang hỏi về "${query}". Hãy thử dùng các phím tắt nhanh bên dưới hoặc bấm **Tung Xúc Xắc** để tiếp tục hành trình khám phá!`, "thinking");
        }
    }
}

window.EcoBotAI = EcoBotAI;

/**
 * ECONOVA - Auth & Multiplayer Room Lobby Engine
 * Features:
 * 1. Full Login & Register system with persistence (localStorage).
 * 2. 4-Character Role Selector with High-Resolution Curated Web Artworks.
 * 3. Multiplayer Room Management: Generate Room Code, Join by Code (Max 4 Players).
 * 4. Real-time Cross-Tab Synchronization using BroadcastChannel & localStorage events.
 * 5. Host controls: Add/Remove AI Bots, Copy Room Code, Synchronized Game Start.
 */
class AuthComponent {
    constructor(onStartGame) {
        this.onStartGame = onStartGame;

        // Current user session
        this.currentUser = null;
        this.selectedRole = "farmer";
        this.selectedColor = "#10b981";

        // Room state
        this.currentRoom = null;
        this.isHost = false;

        // BroadcastChannel for cross-tab multiplayer sync
        this.channel = null;
        try {
            this.channel = new BroadcastChannel("econova_multiplayer_sync");
            this.channel.onmessage = (e) => this.handleChannelMessage(e.data);
        } catch (err) {
            console.warn("BroadcastChannel not supported, falling back to storage events", err);
        }

        // Storage event fallback
        window.addEventListener("storage", (e) => {
            if (e.key === "econova_room_update" && e.newValue) {
                try {
                    const data = JSON.parse(e.newValue);
                    this.handleChannelMessage(data);
                } catch (err) { }
            }
        });

        // Ambient Canvas
        this.bgCanvas = null;
        this.bgCtx = null;
        this.particles = [];

        this.initDOM();
        this.initAmbientCanvas();
    }

    initDOM() {
        const container = document.getElementById("authScreen");
        if (!container) return;

        container.innerHTML = `
            <!-- Ambient Dynamic Canvas Background -->
            <canvas id="ambientAuthCanvas" class="ambient-bg-canvas"></canvas>

            <div class="auth-overlay-glass">
                <!-- STEP 1: LOGIN / REGISTER / GUEST -->
                <div id="authAccountSection" class="auth-box glass-panel animate-fade-in">
                    <div class="auth-header text-center mb-6">
                        <div class="inline-block p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 mb-2">
                            <span class="text-4xl animate-bounce inline-block">🌍</span>
                        </div>
                        <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 tracking-wider font-orbitron">
                            ECONOVA
                        </h1>
                        <p class="text-xs uppercase tracking-widest text-emerald-400 font-semibold mt-1">
                            GIÁO DỤC HÀNH TRÌNH XANH
                        </p>
                    </div>

                    <!-- Auth Tabs -->
                    <div class="auth-tabs flex mb-4 border-b border-white/10">
                        <button class="auth-tab active" id="tabBtnLogin" data-mode="login">Đăng Nhập</button>
                        <button class="auth-tab" id="tabBtnRegister" data-mode="register">Đăng Ký</button>
                        <button class="auth-tab" id="tabBtnGuest" data-mode="guest">Chơi Nhanh</button>
                    </div>

                    <!-- Notice banner -->
                    <div id="authNotice" class="text-xs text-amber-300 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-3 hidden"></div>

                    <!-- Form -->
                    <form id="accountAuthForm" class="space-y-3.5">
                        <div class="input-group">
                            <label class="text-xs font-medium text-emerald-200 block mb-1">Tên Đăng Nhập / Nickname</label>
                            <input type="text" id="authUsernameInput" value="Chiến Binh Xanh" class="eco-input" placeholder="Nhập tên tài khoản..." required />
                        </div>
                        <div class="input-group" id="groupFullName" style="display: none;">
                            <label class="text-xs font-medium text-emerald-200 block mb-1">Họ & Tên Hiển Thị</label>
                            <input type="text" id="authFullNameInput" class="eco-input" placeholder="Ví dụ: Nguyễn Văn An" />
                        </div>
                        <div class="input-group" id="groupPassword">
                            <label class="text-xs font-medium text-emerald-200 block mb-1">Mật Khẩu</label>
                            <input type="password" id="authPasswordInput" value="123456" class="eco-input" placeholder="••••••••" required />
                        </div>

                        <button type="submit" id="btnSubmitAuth" class="eco-btn-action w-full primary-glow mt-4">
                            Đăng Nhập Vào Hệ Thống ➔
                        </button>
                    </form>

                    <div class="auth-features-preview mt-6 pt-4 border-t border-white/10 flex justify-around text-center">
                        <div class="feature-tag">
                            <span class="text-lg">🎲</span>
                            <span class="text-[10px] block text-emerald-200/80">Cờ Tỷ Phú 40 Ô</span>
                        </div>
                        <div class="feature-tag">
                            <span class="text-lg">👥</span>
                            <span class="text-[10px] block text-emerald-200/80">Phòng 4 Người Chơi</span>
                        </div>
                        <div class="feature-tag">
                            <span class="text-lg">🤖</span>
                            <span class="text-[10px] block text-emerald-200/80">EcoBot AI Trợ Lý</span>
                        </div>
                    </div>
                </div>

                <!-- STEP 2: ROOM MANAGEMENT (CREATE OR JOIN WITH ROOM CODE) -->
                <div id="authRoomMenuSection" class="auth-box glass-panel hidden animate-fade-in">
                    <div class="text-center mb-6">
                        <span class="text-3xl">🏰</span>
                        <h2 class="text-2xl font-black text-emerald-300 mt-1">SẢNH PHÒNG CHƠI (LOBBY)</h2>
                        <p class="text-xs text-gray-300" id="welcomeUserGreeting">Chào mừng Nhà Thám Hiểm!</p>
                    </div>

                    <div class="space-y-4">
                        <!-- Option 1: Create New Room -->
                        <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer" id="btnShowCreateRoom">
                            <div class="flex items-center gap-3">
                                <span class="text-3xl">👑</span>
                                <div>
                                    <h3 class="text-sm font-bold text-emerald-200">Tạo Phòng Chơi Mới</h3>
                                    <p class="text-[11px] text-gray-300">Nhận Mã Phòng ngẫu nhiên & làm Chủ Phòng</p>
                                </div>
                            </div>
                        </div>

                        <!-- Option 2: Join by Room Code -->
                        <div class="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30">
                            <div class="flex items-center gap-3 mb-3">
                                <span class="text-3xl">🔑</span>
                                <div>
                                    <h3 class="text-sm font-bold text-cyan-200">Tham Gia Bằng Mã Phòng</h3>
                                    <p class="text-[11px] text-gray-300">Nhập mã từ bạn bè (Tối đa 4 người/phòng)</p>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <input type="text" id="inputJoinRoomCode" placeholder="Ví dụ: ECO-829" class="eco-input uppercase font-mono tracking-widest text-center font-bold text-amber-300" maxlength="8" />
                                <button type="button" id="btnJoinRoomAction" class="eco-btn-action text-xs px-4">
                                    Vào Phòng
                                </button>
                            </div>
                        </div>

                        <!-- Option 3: Quick Solo Play vs 3 AI Bots -->
                        <div class="text-center pt-2">
                            <button type="button" id="btnQuickSoloPlay" class="text-xs text-amber-300 hover:text-white underline font-semibold">
                                🎮 Hoặc tạo phòng nhanh đấu với 3 AI Bots ngay lập tức
                            </button>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-between">
                        <button type="button" id="btnLogoutUser" class="text-xs text-rose-400 hover:text-rose-200">
                            ← Đăng xuất
                        </button>
                    </div>
                </div>

                <!-- STEP 3: ROLE SELECTION & WAITING LOBBY (MAX 4 PLAYERS) -->
                <div id="authLobbySection" class="role-selection-box glass-panel hidden animate-fade-in">
                    <!-- Room Info Top Banner -->
                    <div class="room-banner-glass mb-5 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 border border-emerald-500/30">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-xl">
                                🏰
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-gray-400 uppercase font-semibold">Mã Phòng:</span>
                                    <span id="displayRoomCode" class="text-xl font-black font-mono tracking-wider text-amber-300">ECO-000</span>
                                    <button type="button" id="btnCopyRoomCode" class="text-[11px] px-2 py-0.5 rounded bg-emerald-700/60 hover:bg-emerald-600 text-white font-bold transition-all" title="Sao chép mã phòng">
                                        📋 Sao chép mã
                                    </button>
                                </div>
                                <p class="text-[11px] text-emerald-300/80" id="roomSubText">Gửi mã này cho bạn bè để cùng tham gia phòng (Tối đa 4 người)!</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-gray-300">Trạng thái:</span>
                            <span id="lobbyPlayersCountBadge" class="text-xs px-2.5 py-1 rounded-full bg-emerald-900/80 border border-emerald-400 text-emerald-200 font-bold">
                                1 / 4 Người
                            </span>
                        </div>
                    </div>

                    <!-- 4 Connected Players Slot Bar -->
                    <div class="lobby-slots-grid mb-6" id="lobbySlotsContainer">
                        <!-- 4 Player Slots injected here -->
                    </div>

                    <!-- Character Role Picker for Current Player -->
                    <div class="mb-4">
                        <h3 class="text-lg font-black text-emerald-300 mb-1 flex items-center gap-2">
                            <span>🎭</span> CHỌN VAI TRÒ CHIẾN BINH CỦA BẠN
                        </h3>
                        <p class="text-xs text-gray-300 mb-3">Mỗi nhân vật sở hữu hình ảnh rực rỡ và đặc quyền sinh thái độc nhất</p>
                        <div class="characters-chibi-grid" id="charactersGrid">
                            <!-- 4 HD Illustrated Characters populated dynamically -->
                        </div>
                    </div>

                    <!-- Color Picker Row -->
                    <div class="player-customization-row glass-panel p-3 flex flex-wrap items-center justify-between gap-4">
                        <div class="flex items-center gap-3">
                            <span class="text-xs font-bold text-emerald-200 uppercase">Màu Quân Cờ Của Bạn:</span>
                            <div class="color-picker-group flex gap-2" id="colorPickerGroup">
                                <button type="button" class="color-dot active" data-color="#10b981" style="background:#10b981"></button>
                                <button type="button" class="color-dot" data-color="#0284c7" style="background:#0284c7"></button>
                                <button type="button" class="color-dot" data-color="#f59e0b" style="background:#f59e0b"></button>
                                <button type="button" class="color-dot" data-color="#8b5cf6" style="background:#8b5cf6"></button>
                            </div>
                        </div>

                        <!-- Host Controls: Add AI Bot button -->
                        <div class="flex items-center gap-2" id="hostExtraControls">
                            <button type="button" id="btnAddAIBot" class="eco-btn-action text-xs py-2 px-3 bg-slate-800">
                                🤖 Thêm AI Bot (Lấp phòng)
                            </button>
                        </div>
                    </div>

                    <!-- Bottom Action Controls -->
                    <div class="mt-6 flex justify-between items-center">
                        <button type="button" id="btnLeaveRoom" class="text-xs text-rose-400 hover:text-rose-200 underline">
                            ← Thoát phòng
                        </button>
                        
                        <div class="flex items-center gap-3">
                            <span id="lobbyStatusHint" class="text-xs text-amber-200 italic"></span>
                            <button type="button" id="btnStartGameFinal" class="eco-btn-action gold-glow px-8 py-3 text-lg font-black">
                                🚀 BẮT ĐẦU CHƠI
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindAuthEvents();
    }

    // --- AUTHENTICATION & LOGIN/REGISTER LOGIC ---

    bindAuthEvents() {
        let authMode = "login";

        const tabLogin = document.getElementById("tabBtnLogin");
        const tabRegister = document.getElementById("tabBtnRegister");
        const tabGuest = document.getElementById("tabBtnGuest");
        const groupFullName = document.getElementById("groupFullName");
        const groupPassword = document.getElementById("groupPassword");
        const btnSubmit = document.getElementById("btnSubmitAuth");
        const noticeEl = document.getElementById("authNotice");

        const setTab = (mode) => {
            authMode = mode;
            [tabLogin, tabRegister, tabGuest].forEach(t => t.classList.remove("active"));
            noticeEl.classList.add("hidden");

            if (mode === "login") {
                tabLogin.classList.add("active");
                groupFullName.style.display = "none";
                groupPassword.style.display = "block";
                btnSubmit.textContent = "Đăng Nhập Vào Hệ Thống ➔";
            } else if (mode === "register") {
                tabRegister.classList.add("active");
                groupFullName.style.display = "block";
                groupPassword.style.display = "block";
                btnSubmit.textContent = "Đăng Ký Tài Khoản Mới ➔";
            } else if (mode === "guest") {
                tabGuest.classList.add("active");
                groupFullName.style.display = "none";
                groupPassword.style.display = "none";
                document.getElementById("authUsernameInput").value = `Chiến Binh #${Math.floor(100 + Math.random() * 900)}`;
                btnSubmit.textContent = "Chơi Nhanh Với Tư Cách Khách ➔";
            }
        };

        tabLogin.addEventListener("click", () => setTab("login"));
        tabRegister.addEventListener("click", () => setTab("register"));
        tabGuest.addEventListener("click", () => setTab("guest"));

        // Form Submit
        document.getElementById("accountAuthForm").addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("authUsernameInput").value.trim();
            const password = document.getElementById("authPasswordInput").value.trim();
            const fullName = document.getElementById("authFullNameInput").value.trim();

            if (!username) return;

            // Load registered users from localStorage
            let users = [];
            try {
                users = JSON.parse(localStorage.getItem("econova_users") || "[]");
            } catch (err) { users = []; }

            if (authMode === "register") {
                const existing = users.find(u => u.username.toLowerCase() === username.toLowerCase());
                if (existing) {
                    noticeEl.textContent = "⚠️ Tên đăng nhập này đã tồn tại! Vui lòng chọn tên khác.";
                    noticeEl.classList.remove("hidden");
                    return;
                }
                const newUser = {
                    id: `usr_${Date.now()}`,
                    username,
                    fullName: fullName || username,
                    password
                };
                users.push(newUser);
                localStorage.setItem("econova_users", JSON.stringify(users));
                this.currentUser = newUser;
            } else if (authMode === "login") {
                const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
                if (user && user.password !== password) {
                    noticeEl.textContent = "❌ Mật khẩu không chính xác! Vui lòng thử lại.";
                    noticeEl.classList.remove("hidden");
                    return;
                }
                this.currentUser = user || { id: `usr_${Date.now()}`, username, fullName: username };
            } else {
                // Guest mode
                this.currentUser = { id: `guest_${Date.now()}`, username, fullName: username };
            }

            if (window.soundEngine) window.soundEngine.playCardSuccess();
            this.showRoomMenu();
        });

        // Room Menu Buttons
        document.getElementById("btnShowCreateRoom").addEventListener("click", () => {
            this.createNewRoom();
        });

        document.getElementById("btnJoinRoomAction").addEventListener("click", () => {
            const code = document.getElementById("inputJoinRoomCode").value.trim().toUpperCase();
            if (code) this.joinRoomByCode(code);
        });

        document.getElementById("btnQuickSoloPlay").addEventListener("click", () => {
            this.createNewRoom(true);
        });

        document.getElementById("btnLogoutUser").addEventListener("click", () => {
            this.currentUser = null;
            document.getElementById("authRoomMenuSection").classList.add("hidden");
            document.getElementById("authAccountSection").classList.remove("hidden");
        });

        // Lobby Actions
        document.getElementById("btnCopyRoomCode").addEventListener("click", () => {
            if (this.currentRoom) {
                navigator.clipboard.writeText(this.currentRoom.code);
                const btn = document.getElementById("btnCopyRoomCode");
                btn.textContent = "✓ Đã sao chép!";
                setTimeout(() => btn.textContent = "📋 Sao chép mã", 2000);
            }
        });

        document.getElementById("btnAddAIBot").addEventListener("click", () => {
            this.addAIBotToRoom();
        });

        document.getElementById("btnLeaveRoom").addEventListener("click", () => {
            this.leaveCurrentRoom();
        });

        // Color dots
        document.querySelectorAll(".color-dot").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".color-dot").forEach(d => d.classList.remove("active"));
                btn.classList.add("active");
                this.selectedColor = btn.dataset.color;
                this.updateCurrentPlayerInRoom();
            });
        });

        // Start Game Final
        document.getElementById("btnStartGameFinal").addEventListener("click", () => {
            this.handleFinalStartClick();
        });
    }

    showRoomMenu() {
        document.getElementById("authAccountSection").classList.add("hidden");
        document.getElementById("authRoomMenuSection").classList.remove("hidden");
        document.getElementById("welcomeUserGreeting").textContent = `Chào mừng ${this.currentUser.fullName || this.currentUser.username}! Hãy chọn cách tham gia phòng chơi.`;
    }

    // --- ROOM CREATION & MANAGEMENT ---

    generateRoomCode() {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let code = "ECO-";
        for (let i = 0; i < 3; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    createNewRoom(autoFillBots = false) {
        const roomCode = this.generateRoomCode();
        this.isHost = true;

        const role = PLAYER_ROLES.find(r => r.id === this.selectedRole) || PLAYER_ROLES[0];
        const hostPlayer = {
            id: this.currentUser.id,
            name: this.currentUser.fullName || this.currentUser.username,
            roleId: role.id,
            color: this.selectedColor,
            avatar: role.avatar,
            image: role.image,
            isHost: true,
            isAI: false
        };

        this.currentRoom = {
            code: roomCode,
            hostId: hostPlayer.id,
            players: [hostPlayer],
            status: "waiting",
            maxPlayers: 4
        };

        if (autoFillBots) {
            // Fill 3 AI bots automatically
            const otherRoles = PLAYER_ROLES.filter(r => r.id !== role.id);
            const botNames = ["Dr. Tuệ Minh (AI)", "Kỹ Sư An (AI)", "Hà Sinh Thái (AI)"];
            const botColors = ["#0284c7", "#f59e0b", "#8b5cf6"];

            for (let i = 0; i < 3; i++) {
                const r = otherRoles[i] || PLAYER_ROLES[i];
                this.currentRoom.players.push({
                    id: `bot_${i + 1}`,
                    name: botNames[i],
                    roleId: r.id,
                    color: botColors[i],
                    avatar: r.avatar,
                    image: r.image,
                    isHost: false,
                    isAI: true
                });
            }
        }

        this.saveAndBroadcastRoom();
        this.openLobbyView();
    }

    joinRoomByCode(code) {
        // Look up room from localStorage
        const allRooms = this.getAllRooms();
        const room = allRooms[code];

        if (!room) {
            alert(`Không tìm thấy phòng có mã: "${code}"! Vui lòng kiểm tra lại.`);
            return;
        }

        if (room.players.length >= 4) {
            alert(`Phòng "${code}" đã đầy (Tối đa 4 người chơi)! Vui lòng tham gia phòng khác hoặc tạo phòng mới.`);
            return;
        }

        this.isHost = false;
        const role = PLAYER_ROLES.find(r => r.id === this.selectedRole) || PLAYER_ROLES[0];

        // Pick non-overlapping color
        const usedColors = room.players.map(p => p.color);
        const availColors = ["#10b981", "#0284c7", "#f59e0b", "#8b5cf6"].filter(c => !usedColors.includes(c));
        this.selectedColor = availColors[0] || this.selectedColor;

        const myPlayer = {
            id: this.currentUser.id,
            name: this.currentUser.fullName || this.currentUser.username,
            roleId: role.id,
            color: this.selectedColor,
            avatar: role.avatar,
            image: role.image,
            isHost: false,
            isAI: false
        };

        // Remove if duplicate id
        room.players = room.players.filter(p => p.id !== myPlayer.id);
        room.players.push(myPlayer);
        this.currentRoom = room;

        this.saveAndBroadcastRoom();
        this.openLobbyView();
    }

    getAllRooms() {
        try {
            return JSON.parse(localStorage.getItem("econova_rooms") || "{}");
        } catch (e) {
            return {};
        }
    }

    saveAndBroadcastRoom() {
        if (!this.currentRoom) return;
        const allRooms = this.getAllRooms();
        allRooms[this.currentRoom.code] = this.currentRoom;
        localStorage.setItem("econova_rooms", JSON.stringify(allRooms));

        // Broadcast to other tabs/windows
        const payload = { type: "ROOM_UPDATE", room: this.currentRoom };
        if (this.channel) {
            this.channel.postMessage(payload);
        }
        localStorage.setItem("econova_room_update", JSON.stringify(payload));
    }

    handleChannelMessage(data) {
        if (!data || !this.currentRoom) return;

        if (data.type === "ROOM_UPDATE" && data.room && data.room.code === this.currentRoom.code) {
            this.currentRoom = data.room;
            this.renderLobbySlots();
            this.updateStartButtonState();
        } else if (data.type === "GAME_START" && data.roomCode === this.currentRoom.code) {
            // Synchronized game launch across all tabs!
            this.launchGameForPlayer(data.config);
        }
    }

    openLobbyView() {
        document.getElementById("authRoomMenuSection").classList.add("hidden");
        document.getElementById("authLobbySection").classList.remove("hidden");

        document.getElementById("displayRoomCode").textContent = this.currentRoom.code;
        this.renderCharacterCards();
        this.renderLobbySlots();
        this.updateStartButtonState();
    }

    leaveCurrentRoom() {
        if (this.currentRoom) {
            this.currentRoom.players = this.currentRoom.players.filter(p => p.id !== this.currentUser.id);
            this.saveAndBroadcastRoom();
            this.currentRoom = null;
        }
        document.getElementById("authLobbySection").classList.add("hidden");
        document.getElementById("authRoomMenuSection").classList.remove("hidden");
    }

    addAIBotToRoom() {
        if (!this.currentRoom || this.currentRoom.players.length >= 4) {
            alert("Phòng đã đạt tối đa 4 người chơi!");
            return;
        }

        const usedRoleIds = this.currentRoom.players.map(p => p.roleId);
        const availRoles = PLAYER_ROLES.filter(r => !usedRoleIds.includes(r.id));
        const role = availRoles[0] || PLAYER_ROLES[Math.floor(Math.random() * PLAYER_ROLES.length)];

        const usedColors = this.currentRoom.players.map(p => p.color);
        const availColors = ["#10b981", "#0284c7", "#f59e0b", "#8b5cf6"].filter(c => !usedColors.includes(c));
        const color = availColors[0] || "#f59e0b";

        const botNum = this.currentRoom.players.length;
        const botNames = ["Dr. Tuệ Minh", "Kỹ Sư An", "Hà Sinh Thái", "Bảo Sinh Học"];

        this.currentRoom.players.push({
            id: `bot_${Date.now()}_${Math.random()}`,
            name: `${botNames[botNum - 1] || 'AI Bot'} (AI)`,
            roleId: role.id,
            color: color,
            avatar: role.avatar,
            image: role.image,
            isHost: false,
            isAI: true
        });

        this.saveAndBroadcastRoom();
        this.renderLobbySlots();
        this.updateStartButtonState();
        if (window.soundEngine) window.soundEngine.playCardDraw();
    }

    removePlayerSlot(playerId) {
        if (!this.currentRoom || !this.isHost) return;
        this.currentRoom.players = this.currentRoom.players.filter(p => p.id !== playerId);
        this.saveAndBroadcastRoom();
        this.renderLobbySlots();
        this.updateStartButtonState();
    }

    updateCurrentPlayerInRoom() {
        if (!this.currentRoom || !this.currentUser) return;
        const me = this.currentRoom.players.find(p => p.id === this.currentUser.id);
        const role = PLAYER_ROLES.find(r => r.id === this.selectedRole) || PLAYER_ROLES[0];

        if (me) {
            me.roleId = role.id;
            me.avatar = role.avatar;
            me.image = role.image;
            me.color = this.selectedColor;
            this.saveAndBroadcastRoom();
            this.renderLobbySlots();
        }
    }

    renderLobbySlots() {
        const container = document.getElementById("lobbySlotsContainer");
        const countBadge = document.getElementById("lobbyPlayersCountBadge");
        if (!container || !this.currentRoom) return;

        container.innerHTML = "";
        countBadge.textContent = `${this.currentRoom.players.length} / 4 Người`;

        // Render 4 slots (1 to 4)
        for (let i = 0; i < 4; i++) {
            const player = this.currentRoom.players[i];
            const slotCard = document.createElement("div");
            slotCard.className = `lobby-slot-card glass-panel ${player ? 'slot-occupied' : 'slot-empty'}`;

            if (player) {
                const roleObj = PLAYER_ROLES.find(r => r.id === player.roleId) || PLAYER_ROLES[0];
                const isMe = player.id === this.currentUser.id;

                slotCard.innerHTML = `
                    <div class="slot-badge-tag ${player.isHost ? 'bg-amber-500/80 text-amber-100' : 'bg-emerald-700/80 text-emerald-100'}">
                        ${player.isHost ? '👑 Chủ Phòng' : (player.isAI ? '🤖 Bot AI' : (isMe ? '⭐ Bạn' : '👤 Người Chơi'))}
                    </div>

                    <div class="slot-avatar-wrapper" style="border-color: ${player.color}; box-shadow: 0 0 15px ${player.color}66">
                        <img src="${player.image || roleObj.image}" alt="${player.name}" class="slot-avatar-img" />
                    </div>

                    <div class="slot-player-name text-sm font-black text-white mt-2 flex items-center justify-center gap-1">
                        ${player.name}
                    </div>
                    <div class="slot-player-role text-[11px] font-bold text-amber-300">
                        ${roleObj.name}
                    </div>

                    <div class="mt-2 flex items-center justify-center gap-2">
                        <span class="w-3 h-3 rounded-full" style="background:${player.color}"></span>
                        <span class="text-[10px] text-gray-300 font-semibold">${player.isAI ? 'Sẵn sàng' : 'Đã kết nối'}</span>
                    </div>

                    ${this.isHost && !isMe ? `
                        <button type="button" class="btn-kick-slot text-[10px] text-rose-400 hover:text-rose-200 mt-2 block mx-auto underline" data-kick-id="${player.id}">
                            Đổi / Xóa slot
                        </button>
                    ` : ''}
                `;

                if (this.isHost && !isMe) {
                    const kickBtn = slotCard.querySelector(".btn-kick-slot");
                    if (kickBtn) {
                        kickBtn.addEventListener("click", (e) => {
                            e.stopPropagation();
                            this.removePlayerSlot(player.id);
                        });
                    }
                }
            } else {
                // Empty waiting slot
                slotCard.innerHTML = `
                    <div class="slot-empty-icon text-4xl mb-2 text-gray-500">➕</div>
                    <div class="text-xs font-bold text-gray-400">Vị Trí Trống #${i + 1}</div>
                    <p class="text-[10px] text-gray-500 mt-1">Đang chờ bạn bè tham gia...</p>
                    ${this.isHost ? `
                        <button type="button" class="btn-fill-bot eco-btn-action text-[10px] py-1 px-3 mt-3 bg-slate-800">
                            + Thêm Bot
                        </button>
                    ` : ''}
                `;

                if (this.isHost) {
                    const fillBtn = slotCard.querySelector(".btn-fill-bot");
                    if (fillBtn) {
                        fillBtn.addEventListener("click", () => this.addAIBotToRoom());
                    }
                }
            }

            container.appendChild(slotCard);
        }
    }

    updateStartButtonState() {
        const startBtn = document.getElementById("btnStartGameFinal");
        const hintEl = document.getElementById("lobbyStatusHint");
        if (!startBtn || !this.currentRoom) return;

        const count = this.currentRoom.players.length;

        if (!this.isHost) {
            startBtn.disabled = true;
            startBtn.classList.add("disabled");
            startBtn.textContent = "⏳ Chờ Chủ Phòng Khởi Động...";
            hintEl.textContent = "Chủ phòng sẽ bắt đầu trò chơi khi các vị trí sẵn sàng.";
            return;
        }

        if (count < 2) {
            startBtn.disabled = true;
            startBtn.classList.add("disabled");
            startBtn.textContent = "🚀 Cần Tối Thiểu 2 Người";
            hintEl.textContent = "Hãy thêm bot hoặc đợi bạn bè tham gia bằng mã phòng.";
        } else {
            startBtn.disabled = false;
            startBtn.classList.remove("disabled");
            startBtn.textContent = `🚀 BẮT ĐẦU CHƠI (${count}/4 Người)`;
            hintEl.textContent = "✨ Tất cả vị trí đã sẵn sàng lên đường!";
        }
    }

    handleFinalStartClick() {
        if (!this.isHost || !this.currentRoom) return;
        if (this.currentRoom.players.length < 2) {
            alert("Phòng cần ít nhất 2 người chơi (bạn có thể bấm 'Thêm AI Bot' để bắt đầu ngay)!");
            return;
        }

        // Broadcast game start signal to all connected tabs
        const startPayload = {
            type: "GAME_START",
            roomCode: this.currentRoom.code,
            config: {
                players: this.currentRoom.players,
                roomCode: this.currentRoom.code
            }
        };

        if (this.channel) {
            this.channel.postMessage(startPayload);
        }
        localStorage.setItem("econova_room_update", JSON.stringify(startPayload));

        this.launchGameForPlayer(startPayload.config);
    }

    launchGameForPlayer(config) {
        if (window.soundEngine) {
            window.soundEngine.playGaiaStorm();
            window.soundEngine.startBgm();
        }

        const authScreen = document.getElementById("authScreen");
        authScreen.classList.add("fade-out");
        setTimeout(() => {
            authScreen.classList.add("hidden");
            if (this.onStartGame) {
                this.onStartGame({
                    name: this.currentUser ? (this.currentUser.fullName || this.currentUser.username) : "Chiến Binh Xanh",
                    roleId: this.selectedRole,
                    color: this.selectedColor,
                    playersList: config.players,
                    roomCode: config.roomCode
                });
            }
        }, 600);
    }

    // --- CHARACTER CARD RENDER WITH HD WEB IMAGES ---

    renderCharacterCards() {
        const grid = document.getElementById("charactersGrid");
        if (!grid) return;
        grid.innerHTML = "";

        PLAYER_ROLES.forEach(role => {
            const card = document.createElement("div");
            card.className = `chibi-role-card ${this.selectedRole === role.id ? 'active' : ''}`;
            card.dataset.roleId = role.id;

            card.innerHTML = `
                <!-- High-Resolution Character Artwork Thumbnail -->
                <div class="chibi-avatar-frame" style="border-color: ${role.color}">
                    <img src="${role.image}" alt="${role.name}" class="chibi-web-img" />
                    <div class="avatar-glow-ring" style="border-color: ${role.color}"></div>
                </div>

                <div class="role-name font-black text-lg text-emerald-200 mt-2">${role.name}</div>
                <div class="role-badge-text text-[11px] font-bold text-amber-400">${role.badge}</div>
                <div class="role-ability-box text-xs text-gray-200 mt-2 leading-relaxed">
                    ${role.ability}
                </div>
                <div class="role-quote italic text-[10px] text-emerald-300/70 mt-2">
                    "${role.quote}"
                </div>
                <div class="check-mark-bubble">✓</div>
            `;

            card.addEventListener("click", () => {
                this.selectedRole = role.id;
                document.querySelectorAll(".chibi-role-card").forEach(c => c.classList.remove("active"));
                card.classList.add("active");
                this.updateCurrentPlayerInRoom();
                if (window.soundEngine) window.soundEngine.playCardSuccess();
            });

            grid.appendChild(card);
        });
    }

    // --- AMBIENT CANVAS ---

    initAmbientCanvas() {
        this.bgCanvas = document.getElementById("ambientAuthCanvas");
        if (!this.bgCanvas) return;
        this.bgCtx = this.bgCanvas.getContext("2d");

        const resize = () => {
            this.bgCanvas.width = window.innerWidth;
            this.bgCanvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        this.particles = [];
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                type: "leaf",
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: 14 + Math.random() * 12,
                vx: -0.5 + Math.random() * 1,
                vy: 0.8 + Math.random() * 1.2,
                angle: Math.random() * Math.PI * 2,
                vAngle: (Math.random() - 0.5) * 0.04,
                char: ["🍃", "🌿", "🌱"][Math.floor(Math.random() * 3)]
            });
        }
        for (let i = 0; i < 40; i++) {
            this.particles.push({
                type: "firefly",
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                radius: 1.5 + Math.random() * 2.5,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                alpha: Math.random(),
                dAlpha: 0.015 + Math.random() * 0.02
            });
        }

        const render = () => {
            this.bgCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);

            const grad = this.bgCtx.createLinearGradient(0, 0, this.bgCanvas.width, this.bgCanvas.height);
            grad.addColorStop(0, "#06231c");
            grad.addColorStop(0.5, "#0a2e28");
            grad.addColorStop(1, "#071c26");
            this.bgCtx.fillStyle = grad;
            this.bgCtx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);

            const time = performance.now() * 0.001;
            this.bgCtx.fillStyle = "rgba(14, 165, 233, 0.06)";
            this.bgCtx.beginPath();
            this.bgCtx.moveTo(0, this.bgCanvas.height);
            for (let x = 0; x <= this.bgCanvas.width; x += 30) {
                const y = this.bgCanvas.height - 70 + Math.sin(x * 0.008 + time) * 20 + Math.cos(x * 0.004 + time * 1.5) * 15;
                this.bgCtx.lineTo(x, y);
            }
            this.bgCtx.lineTo(this.bgCanvas.width, this.bgCanvas.height);
            this.bgCtx.closePath();
            this.bgCtx.fill();

            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.type === "leaf") {
                    p.angle += p.vAngle;
                    if (p.y > this.bgCanvas.height + 30) {
                        p.y = -30;
                        p.x = Math.random() * this.bgCanvas.width;
                    }
                    this.bgCtx.save();
                    this.bgCtx.translate(p.x, p.y);
                    this.bgCtx.rotate(p.angle);
                    this.bgCtx.font = `${p.size}px sans-serif`;
                    this.bgCtx.fillText(p.char, 0, 0);
                    this.bgCtx.restore();
                } else if (p.type === "firefly") {
                    p.alpha += p.dAlpha;
                    if (p.alpha > 1 || p.alpha < 0.1) p.dAlpha = -p.dAlpha;

                    if (p.x < 0) p.x = this.bgCanvas.width;
                    if (p.x > this.bgCanvas.width) p.x = 0;
                    if (p.y < 0) p.y = this.bgCanvas.height;
                    if (p.y > this.bgCanvas.height) p.y = 0;

                    this.bgCtx.beginPath();
                    this.bgCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    this.bgCtx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
                    this.bgCtx.shadowBlur = 10;
                    this.bgCtx.shadowColor = "#facc15";
                    this.bgCtx.fill();
                    this.bgCtx.shadowBlur = 0;
                }
            });

            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }
}

window.AuthComponent = AuthComponent;

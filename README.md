# ECONOVA - GIÁO DỤC HÀNH TRÌNH XANH 🌍✨
### Web Board Game 3D / Isometric Tương Tác Phong Cách Cờ Tỷ Phú (Monopoly)

Ứng dụng Web Game giáo dục môi trường đỉnh cao kết hợp đồ họa **Isometric 3D**, **Three.js 3D WebGL Hub**, hệ thống âm thanh mô phỏng theo thời gian thực **Web Audio API** và trợ lý thông minh **EcoBot AI**.

---

## 🌟 TÍNH NĂNG NỔI BẬT

### 1. Giao Diện & Đồ Họa 3D / Isometric Đỉnh Cao (UI/UX)
- **Bàn cờ 40 ô hình vuông phong cách Monopoly** với góc nhìn Isometric 3D (`perspective` xoay 2.5D), hỗ trợ chuyển đổi linh hoạt sang chế độ 2D phẳng (`📐 Góc nhìn`) và phóng to/thu nhỏ bằng con lăn chuột (`Wheel Zoom`).
- **Phong cách Glassmorphism sang trọng**: Hiệu ứng kính mờ `backdrop-filter: blur`, viền neon lân tinh, các hạt phát sáng mượt mà.
- **Trung tâm Bàn cờ (Board Hub)**:
  - **Trái Đất 3D tương tác (Three.js)**: Biến đổi từ xám xịt ô nhiễm (khói độc) sang màu xanh lam ngọc bích rực rỡ khi chỉ số **Sức Khỏe Trái Đất** tăng từ 0 đến 100. Người chơi có thể xoay và tương tác với Trái Đất bằng chuột.
  - **Trạm Xúc Xắc 3D (Dice Station)**: Tung 2 viên xúc xắc 3D với chuyển động nhào lộn, nảy vật lý trên bục kính và hạ cánh chính xác vào mặt điểm.
  - **Bảng Chỉ Số Toàn Cầu**: Theo dõi Sức Khỏe Toàn Cầu, Mức Độ Ô Nhiễm (Báo động đỏ), và Sự Kiện Toàn Cầu đang diễn ra.

### 2. Trang Đăng Nhập, Đăng Ký & Phòng Chờ Đa Người Chơi (Multiplayer Room Lobby)
- **Hệ Thống Tài Khoản Đầy Đủ**:
  - Hỗ trợ tab **Đăng Nhập**, **Đăng Ký** tài khoản mới (lưu trữ trong `localStorage`), và chế độ **Chơi Nhanh (Guest)**.
  - Lưu trữ thông tin người chơi, tên hiển thị và mật khẩu.
- **Hệ Thống Mã Phòng Chơi (Room Code Lobby - Tối đa 4 người)**:
  - **Tạo Phòng Mới**: Tự động sinh mã phòng 6 ký tự ngẫu nhiên (ví dụ: `ECO-829`) và trở thành Chủ Phòng (Host).
  - **Tham Gia Bằng Mã**: Nhập mã phòng để kết nối với phòng chơi của bạn bè.
  - **Đồng bộ thời gian thực đa tab (Cross-Tab Sync)**: Sử dụng `BroadcastChannel` và sự kiện `localStorage`, cho phép 2 đến 4 người chơi mở các tab/cửa sổ khác nhau trên cùng máy tính để chơi chung trong thời gian thực!
  - **Phòng Chờ 4 Vị Trí (Slots)**: Hiển thị avatar ảnh thật, trạng thái sẵn sàng, nút sao chép mã phòng, và nút của Chủ Phòng để thêm AI Bot lấp đầy phòng hoặc bắt đầu trò chơi đồng bộ!
- **Hình Ảnh Nhân Vật & Lá Bài Lấy Từ Web (HD Curated Artworks)**:
  - Thay thế toàn bộ icon đơn điệu bằng **ảnh chụp và minh họa kỹ thuật số sắc nét chuẩn HD từ Unsplash** cho 4 nhân vật, 40 ô bàn cờ và toàn bộ các thẻ bài chức năng.
  - 4 nhân vật: Bác Nông Dân, Nhà Khoa Học, Kỹ Sư Môi Trường, Cư Dân Xanh với ảnh đại diện rực rỡ và hoạt họa xoay vầng hào quang.

### 3. Bàn Cờ 40 Ô & Hiệu Ứng 4 Khu Vực (Visual & Particle FX)
- **Khu Rừng U Ám (Ô 1-9)**: Hiệu ứng mầm cây trồi lên, lá xanh bay lơ lửng, hào quang ngọc lục bảo và âm thanh chim hót.
- **Khu Đại Dương Nhiễm Bẩn (Ô 11-19)**: Bọt biển lấp lánh, sóng nước dâng lăn tăn, tia sáng làm sạch mặt nước và tiếng sóng nước vỗ.
- **Khu Đô Thị Bỏ Hoang (Ô 21-29)**: Quét laser công nghệ cao, bánh răng hologram xoay và âm thanh servo công nghệ tương lai.
- **Khu Khủng Hoảng Môi Trường (Ô 31-39)**: Khói độc xám cuộn trào, viền cảnh báo đỏ nhấp nháy liên tục (Red Alert) và tiếng còi báo động khẩn cấp.

### 4. Hệ Thống Thẻ Bài Ma Thuật (Magic Card Draw) & Bàn Chế Tạo (Crafting Bench)
- Pop-up lật thẻ bài 3D (`CardModal`) với hiệu ứng lật mặt sau sang mặt trước kèm âm thanh chuông ngân hoặc còi báo động.
- Đầy đủ 4 nhóm thẻ theo tài liệu:
  - **Nhóm A: Thẻ Môi Trường & Vật Phẩm Xanh**: Cây Xanh, Đồ Nội Thất Nhựa Tái Chế, Nhà Lãnh Đạo Môi Trường, Pin Mặt Trời, Ống Hút Bã Mía, Tuabin Gió, BioGreen, Cảm Biến Đô Thị, Tái Sinh Trái Đất, Rác Hữu Cơ, Phân Loại Rác, Xưởng Tái Chế, Xe Điện Xanh, Nhặt Rác...
  - **Nhóm B: Thẻ Ô Nhiễm**: Rừng Bị Chặt Phá, Rác Nhựa Tràn Ngập Bãi Biển, Cháy Rừng Lớn, Nhà Máy Xả Thải, Chai Nhựa, Khí Thải Đen, Túi Nilon, Rò Rỉ Hóa Chất, Hạn Hán Toàn Cầu, Mưa Axit, Khói Xe Cộ, Cạn Kiệt Năng Lượng...
  - **Nhóm C: Thẻ Phát Minh & Ghép Thẻ**: Trường Học Xanh, Hộp Phân Loại Rác AI, Vật Liệu Sinh Học Mới, Cánh Rừng Xanh.
  - **COMBO ĐỈNH CAO "VÒNG TUẦN HOÀN XANH"**: Ghép đủ 4 trụ cột -> Kích hoạt **BÃO SÁNG XANH GAIA TOÀN BÀN** (+3 điểm toàn đội, xóa thẻ ô nhiễm, rác toàn cầu giảm một nửa).
  - **Nhóm D: Sự Kiện & Nhiệm Vụ Toàn Cầu**: Bão Nhựa Đại Dương, Bụi Mịn Vượt Ngưỡng, Tuần Lễ Làm Sạch Biển, Sứ Mệnh Gaia...

### 5. Chatbot Trợ Lý AI "EcoBot AI"
- Mascot mầm cây / Robot xanh tương tác ở góc màn hình: hoạt họa chớp mắt, vẫy tay, hiệu ứng gõ văn bản (`typing indicator`).
- Phân tích kho thẻ trên tay người chơi theo thời gian thực để đưa ra gợi ý chiến thuật ghép đồ tối ưu.
- Tra cứu 4 giai đoạn tiến hóa của Trái Đất:
  - Giai đoạn 1: Thức Tỉnh Xanh (0 - 25 điểm)
  - Giai đoạn 2: Hành Động Cứu Nguy (26 - 50 điểm)
  - Giai đoạn 3: Đột Phá Công Nghệ (51 - 75 điểm)
  - Giai đoạn 4: Trái Đất Hồi Sinh / Gaia Harmony (76 - 100 điểm)
- Cung cấp dữ liệu giáo dục môi trường thực tế đính kèm trên từng lá bài.

### 6. Động Cơ Âm Thanh Procedural (Web Audio API)
- Hoàn toàn không phụ thuộc vào file MP3/WAV bên ngoài, không lo gãy link mạng hay lỗi CORS.
- Tự động tổng hợp âm thanh xúc xắc lăn gỗ, tiếng bước nhảy token, tiếng lật thẻ bài, chuông arpeggio vui tai, còi báo động khẩn cấp và nhạc thiền thiên nhiên du dương.

---

## 🚀 HƯỚNG DẪN CHẠY VÀ TRẢI NGHIỆM

### Cách 1: Chạy trực tiếp (Không cần cài đặt gì thêm)
1. Truy cập thư mục: `C:\Users\LENOVO\.gemini\antigravity\scratch\econova-game\`
2. Nhấp đúp chuột vào file `index.html` để mở ngay trên bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Brave, Safari).

### Cách 2: Chạy qua máy chủ nội bộ Python
Mở Terminal hoặc PowerShell tại thư mục dự án và chạy:
```powershell
py -m http.server 8000
```
Sau đó mở trình duyệt và truy cập: `http://localhost:8000`

---

## 📁 CẤU TRÚC MÃ NGUỒN

```
econova-game/
│
├── index.html            # File HTML chính, bố cục UI và kết nối các module
├── README.md             # Tài liệu hướng dẫn sử dụng và cấu trúc hệ thống
│
├── css/
│   └── style.css         # Thiết kế Glassmorphism, Isometric 3D, animations, hiệu ứng khu vực
│
└── js/
    ├── audio.js          # SoundEngine tổng hợp âm thanh bằng Web Audio API
    ├── cardsData.js      # Cơ sở dữ liệu 40 ô bàn cờ, thẻ xanh, thẻ ô nhiễm, công thức craft, sự kiện
    ├── threeHub.js       # Mô hình 3D Three.js: Quả cầu Trái Đất biến chuyển màu sắc & Trạm Xúc Xắc 3D
    ├── board.js          # Bàn cờ Isometric 40 ô, di chuyển token từng bước, hạt particle 4 khu vực
    ├── cardModal.js      # Modal rút thẻ 3D xoay lật (Magic Card Draw) và hiển thị kiến thức xanh
    ├── crafting.js       # Bàn chế tạo xanh (Crafting Bench), kết hợp nguyên liệu, kích hoạt bão Gaia
    ├── ecobot.js         # Chatbot EcoBot AI: mascot mầm cây, phân tích bài trên tay, tra cứu luật
    ├── authComponent.js  # Màn hình đăng nhập & chọn 4 vai trò Chibi với hoạt họa idle nhún nhảy
    └── game.js           # Bộ điều khiển vòng lặp game, lượt chơi AI Bots, tính điểm và điều kiện thắng/thua
```

---
*Phát triển với tâm huyết dành cho dự án ECONOVA - Giáo Dục Hành Trình Xanh.*

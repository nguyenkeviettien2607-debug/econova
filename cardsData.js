/**
 * ECONOVA - DATA ENGINE
 * Complete definitions of 40 Board Tiles, Green Items, Pollution Hazards,
 * Inventions & Crafting Recipes, Events, Missions, Roles, and Real-world Eco-Facts.
 * Enhanced with High-Resolution Curated Web Artworks from Unsplash.
 */

// 40 Tiles Configuration
const BOARD_TILES = [
    // Bottom Row (0 to 9) - Starts with START, then Khu Rừng U Ám
    {
        id: 0,
        name: "Trạm Khởi Hành Xanh",
        zone: "corner",
        zoneName: "Điểm Xuất Phát",
        icon: "🌱",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80",
        color: "#10b981",
        description: "Bắt đầu hành trình! Nhận +200 Tiền Xanh & +2 Điểm Sức Khỏe Toàn Cầu mỗi khi đi qua.",
        cost: 0,
        effectType: "start"
    },
    {
        id: 1,
        name: "Vườn Ươm Bản Địa",
        zone: "forest",
        zoneName: "Khu Rừng U Ám",
        icon: "🌲",
        image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80",
        color: "#059669",
        description: "Ươm 10,000 mầm cây bản địa chịu hạn. Cần gieo hạt để phục hồi hệ sinh thái.",
        cost: 60,
        greenPoints: 2,
        cardType: "green"
    },
    {
        id: 2,
        name: "Kho Rác Rừng",
        zone: "forest",
        zoneName: "Khu Rừng U Ám",
        icon: "🚯",
        image: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=400&q=80",
        color: "#047857",
        description: "Rác thải du lịch vứt bừa bãi trong rừng. Cần dọn dẹp khẩn cấp!",
        cost: 70,
        greenPoints: 1,
        cardType: "pollution"
    },
    {
        id: 3,
        name: "Đồi Thông Tái Sinh",
        zone: "forest",
        zoneName: "Khu Rừng U Ám",
        icon: "⛰️",
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80",
        color: "#059669",
        description: "Trồng dặm thông ba lá trên sườn đồi xói mòn để giữ đất chống lũ quét.",
        cost: 80,
        greenPoints: 3,
        cardType: "green"
    },
    {
        id: 4,
        name: "Trạm Kiểm Lâm Xanh",
        zone: "forest",
        zoneName: "Khu Rừng U Ám",
        icon: "🏡",
        image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=400&q=80",
        color: "#10b981",
        description: "Trạm bảo vệ rừng ứng dụng camera AI phát hiện sớm lâm tặc và cháy rừng.",
        cost: 100,
        greenPoints: 3,
        cardType: "event"
    },
    {
        id: 5,
        name: "Rừng Tre Sinh Thái",
        zone: "forest",
        zoneName: "Khu Rừng U Ám",
        icon: "🎋",
        image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80",
        color: "#059669",
        description: "Rừng tre hấp thụ CO2 nhanh gấp 4 lần rừng gỗ thông thường, tạo sinh kế bền vững.",
        cost: 110,
        greenPoints: 3,
        cardType: "green"
    },
    {
        id: 6,
        name: "Vực Sâu Xói Mòn",
        zone: "forest",
        zoneName: "Khu Rừng U Ám",
        icon: "⚠️",
        image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=400&q=80",
        color: "#d97706",
        description: "Đất bị xói mòn do phá rừng trước đây. Rút thẻ Ô Nhiễm cảnh báo!",
        cost: 120,
        greenPoints: -2,
        cardType: "pollution"
    },
    {
        id: 7,
        name: "Thung Lũng Hoa Dại",
        zone: "forest",
        zoneName: "Khu Rừng U Ám",
        icon: "🌸",
        image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=400&q=80",
        color: "#059669",
        description: "Hành lang thụ phấn cho ong bướm tự nhiên, gia tăng đa dạng sinh học.",
        cost: 130,
        greenPoints: 4,
        cardType: "green"
    },
    {
        id: 8,
        name: "Vườn Thảo Dược Rừng",
        zone: "forest",
        zoneName: "Khu Rừng U Ám",
        icon: "🌿",
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
        color: "#059669",
        description: "Bảo tồn cây thuốc quý dưới tán rừng già, nâng cao nhận thức cộng đồng.",
        cost: 140,
        greenPoints: 4,
        cardType: "green"
    },
    {
        id: 9,
        name: "Cổng Vườn Quốc Gia",
        zone: "forest",
        zoneName: "Khu Rừng U Ám",
        icon: "🏞️",
        image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=400&q=80",
        color: "#047857",
        description: "Cửa ngõ khu dự trữ sinh quyển thế giới. Cơ hội nhận tài trợ xanh!",
        cost: 150,
        greenPoints: 5,
        cardType: "green"
    },

    // Corner 10: Eco Sanctuary
    {
        id: 10,
        name: "Khu Bảo Tồn Sinh Thái",
        zone: "corner",
        zoneName: "Vùng An Toàn",
        icon: "🦜",
        image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=400&q=80",
        color: "#0ea5e9",
        description: "Khu bảo tồn động thực vật quý hiếm. Bạn được miễn nhiễm mọi thẻ phạt ô nhiễm tại đây!",
        cost: 0,
        effectType: "sanctuary"
    },

    // Left Column (11 to 19): Khu Đại Dương Nhiễm Bẩn
    {
        id: 11,
        name: "Bãi Biển Rác Thải Nhựa",
        zone: "ocean",
        zoneName: "Khu Đại Dương",
        icon: "🏖️",
        image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=400&q=80",
        color: "#0284c7",
        description: "Hàng ngàn tấn rác trôi dạt bờ biển. Cần huy động chiến dịch nhặt rác gấp!",
        cost: 160,
        greenPoints: -1,
        cardType: "pollution"
    },
    {
        id: 12,
        name: "Trạm Lọc Rác Biển",
        zone: "ocean",
        zoneName: "Khu Đại Dương",
        icon: "🛥️",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
        color: "#0ea5e9",
        description: "Phao chắn rác tự động chạy bằng năng lượng mặt trời gom 5 tấn rác/ngày.",
        cost: 170,
        greenPoints: 4,
        cardType: "green"
    },
    {
        id: 13,
        name: "Rạn San Hô Chết Mòn",
        zone: "ocean",
        zoneName: "Khu Đại Dương",
        icon: "🪸",
        image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=400&q=80",
        color: "#f43f5e",
        description: "Nhiệt độ nước tăng làm tẩy trắng san hô. Hệ sinh thái biển lâm nguy!",
        cost: 180,
        greenPoints: -3,
        cardType: "pollution"
    },
    {
        id: 14,
        name: "Vịnh Rừng Ngập Mặn",
        zone: "ocean",
        zoneName: "Khu Đại Dương",
        icon: "🦀",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
        color: "#0284c7",
        description: "Lá chắn xanh ven biển ngăn sóng thần và là vườn ươm ấu trùng tôm cá.",
        cost: 200,
        greenPoints: 5,
        cardType: "green"
    },
    {
        id: 15,
        name: "Vùng Đáy Biển Phục Hồi",
        zone: "ocean",
        zoneName: "Khu Đại Dương",
        icon: "🐟",
        image: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=400&q=80",
        color: "#0ea5e9",
        description: "Thả giá thể nhân tạo kích thích san hô non bám rễ và cá về sinh sống.",
        cost: 210,
        greenPoints: 4,
        cardType: "green"
    },
    {
        id: 16,
        name: "Đảo Rác Thái Bình Dương",
        zone: "ocean",
        zoneName: "Khu Đại Dương",
        icon: "🌊",
        image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=400&q=80",
        color: "#0369a1",
        description: "Xoáy rác khổng lồ rộng gấp 3 lần nước Pháp. Rút thẻ Thảm Họa Biển!",
        cost: 220,
        greenPoints: -4,
        cardType: "pollution"
    },
    {
        id: 17,
        name: "Rạn Vỏ Sò Lọc Nước",
        zone: "ocean",
        zoneName: "Khu Đại Dương",
        icon: "🐚",
        image: "https://images.unsplash.com/photo-1544551763-77ef2d0cf96c?auto=format&fit=crop&w=400&q=80",
        color: "#0284c7",
        description: "Trang trại hàu tự nhiên lọc sạch kim loại nặng và cặn bã trong nước biển.",
        cost: 230,
        greenPoints: 5,
        cardType: "green"
    },
    {
        id: 18,
        name: "Đầm Phá Nước Lợ",
        zone: "ocean",
        zoneName: "Khu Đại Dương",
        icon: "🦆",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80",
        color: "#0ea5e9",
        description: "Nơi cư ngụ của các đàn chim di cư xuyên lục địa. Giữ gìn mặt nước trong lành.",
        cost: 240,
        greenPoints: 4,
        cardType: "green"
    },
    {
        id: 19,
        name: "Hải Đăng Xanh Tự Trị",
        zone: "ocean",
        zoneName: "Khu Đại Dương",
        icon: "🏮",
        image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=400&q=80",
        color: "#38bdf8",
        description: "Ngọn hải đăng 100% điện sóng biển kết hợp pin mặt trời dẫn lối tàu bè xanh.",
        cost: 250,
        greenPoints: 6,
        cardType: "green"
    },

    // Corner 20: Free Energy Hub
    {
        id: 20,
        name: "Trạm Năng Lượng Tự Nhiên",
        zone: "corner",
        zoneName: "Trung Tâm Tái Tạo",
        icon: "⚡",
        image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=400&q=80",
        color: "#eab308",
        description: "Trạm sạc năng lượng miễn phí từ thiên nhiên. Tăng 1 lượt tung xúc xắc và +3 Điểm Xanh!",
        cost: 0,
        effectType: "energy"
    },

    // Top Row (21 to 29): Khu Đô Thị Bỏ Hoang
    {
        id: 21,
        name: "Xưởng Cơ Khí Tái Chế",
        zone: "urban",
        zoneName: "Khu Đô Thị",
        icon: "⚙️",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
        color: "#10b981",
        description: "Nơi các kỹ sư biến kim loại phế thải xe cũ thành linh kiện máy phát điện gió.",
        cost: 260,
        greenPoints: 4,
        cardType: "green"
    },
    {
        id: 22,
        name: "Bãi Phế Thải Điện Tử",
        zone: "urban",
        zoneName: "Khu Đô Thị",
        icon: "📟",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
        color: "#b45309",
        description: "Rác thải chip bo mạch chứa chì độc hại. Thu gom để chiết xuất kim loại quý.",
        cost: 270,
        greenPoints: -2,
        cardType: "pollution"
    },
    {
        id: 23,
        name: "Viện Nghiên Cứu AI Rác",
        zone: "urban",
        zoneName: "Khu Đô Thị",
        icon: "🤖",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80",
        color: "#06b6d4",
        description: "Phát triển thuật toán thị giác máy tính nhận diện và phân loại rác siêu tốc 99.8%.",
        cost: 280,
        greenPoints: 6,
        cardType: "green"
    },
    {
        id: 24,
        name: "Nhà Máy Nhựa Sinh Học",
        zone: "urban",
        zoneName: "Khu Đô Thị",
        icon: "🧪",
        image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=400&q=80",
        color: "#10b981",
        description: "Chuyển hóa tinh bột ngô và bã mía thành bao bì tự phân hủy trong 180 ngày.",
        cost: 300,
        greenPoints: 6,
        cardType: "green"
    },
    {
        id: 25,
        name: "Trạm Xe Buýt Điện",
        zone: "urban",
        zoneName: "Khu Đô Thị",
        icon: "🚌",
        image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=400&q=80",
        color: "#059669",
        description: "Mạng lưới xe buýt điện thông minh giảm phát thải 85% khói bụi nội đô.",
        cost: 310,
        greenPoints: 5,
        cardType: "green"
    },
    {
        id: 26,
        name: "Khu Phố Ống Khói Cũ",
        zone: "urban",
        zoneName: "Khu Đô Thị",
        icon: "🏭",
        image: "https://images.unsplash.com/photo-1569060139402-b2d99d3eb740?auto=format&fit=crop&w=400&q=80",
        color: "#e11d48",
        description: "Khu công nghiệp cũ chưa có hệ thống lọc khí SO2, NO2. Rút thẻ Ô Nhiễm!",
        cost: 320,
        greenPoints: -3,
        cardType: "pollution"
    },
    {
        id: 27,
        name: "Vườn Thẳng Đứng SkyGarden",
        zone: "urban",
        zoneName: "Khu Đô Thị",
        icon: "🏙️",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
        color: "#10b981",
        description: "Mặt đứng tòa cao ốc phủ kín 50,000 cây xanh làm mát tòa nhà giảm 3°C điều hòa.",
        cost: 330,
        greenPoints: 6,
        cardType: "green"
    },
    {
        id: 28,
        name: "Nhà Máy Điện Rác",
        zone: "urban",
        zoneName: "Khu Đô Thị",
        icon: "🔥",
        image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80",
        color: "#059669",
        description: "Đốt rác không thể tái chế bằng lò plasma siêu nhiệt, hòa lưới điện sạch 50MW.",
        cost: 340,
        greenPoints: 5,
        cardType: "green"
    },
    {
        id: 29,
        name: "Trung Tâm Đổi Đồ Cũ (Swap)",
        zone: "urban",
        zoneName: "Khu Đô Thị",
        icon: "🔄",
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80",
        color: "#10b981",
        description: "Mô hình kinh tế tuần hoàn: người dân trao đổi quần áo, sách vở và đồ gia dụng.",
        cost: 350,
        greenPoints: 7,
        cardType: "green"
    },

    // Corner 30: Red Alert Disaster Area
    {
        id: 30,
        name: "Vùng Ô Nhiễm Nguy Cấp",
        zone: "corner",
        zoneName: "Cảnh Báo Đỏ",
        icon: "☣️",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80",
        color: "#ef4444",
        description: "Báo động khẩn cấp! Nồng độ ô nhiễm vượt ngưỡng. Mất 1 lượt hoặc nộp 100 Tiền Quỹ Môi Trường.",
        cost: 0,
        effectType: "disaster"
    },

    // Right Column (31 to 39): Khu Khủng Hoảng Môi Trường
    {
        id: 31,
        name: "Mỏ Than Lộ Thiên",
        zone: "crisis",
        zoneName: "Khu Khủng Hoảng",
        icon: "⛏️",
        image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=400&q=80",
        color: "#dc2626",
        description: "Bụi than xám xịt bao phủ làng mạc. Phải đầu tư chuyển đổi năng lượng công bằng.",
        cost: 360,
        greenPoints: -4,
        cardType: "pollution"
    },
    {
        id: 32,
        name: "Điểm Rò Rỉ Hóa Chất",
        zone: "crisis",
        zoneName: "Khu Khủng Hoảng",
        icon: "🛢️",
        image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=400&q=80",
        color: "#ef4444",
        description: "Chất thải công nghiệp tràn ra kênh rạch. Mất 2 thẻ môi trường ngẫu nhiên!",
        cost: 370,
        greenPoints: -5,
        cardType: "pollution"
    },
    {
        id: 33,
        name: "Trạm Quan Trắc Bụi Mịn PM2.5",
        zone: "crisis",
        zoneName: "Khu Khủng Hoảng",
        icon: "🌫️",
        image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=400&q=80",
        color: "#f59e0b",
        description: "Cảnh báo không khí mức Tím - Cực kỳ nguy hại! Kêu gọi trồng thêm vành đai cây xanh.",
        cost: 380,
        greenPoints: 3,
        cardType: "green"
    },
    {
        id: 34,
        name: "Vùng Đất Nứt Nẻ Hạn Hán",
        zone: "crisis",
        zoneName: "Khu Khủng Hoảng",
        icon: "🏜️",
        image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80",
        color: "#dc2626",
        description: "El Nino kéo dài làm khô cạn đầm hồ, cây cỏ khô héo. Mất 3 điểm xanh nếu thiếu Thẻ Cây!",
        cost: 390,
        greenPoints: -4,
        cardType: "pollution"
    },
    {
        id: 35,
        name: "Rừng Cháy Âm Ỉ",
        zone: "crisis",
        zoneName: "Khu Khủng Hoảng",
        icon: "🔥",
        image: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=400&q=80",
        color: "#b91c1c",
        description: "Cháy rừng giải phóng hàng triệu tấn CO2. Đòi hỏi nỗ lực cứu hỏa tức thời!",
        cost: 400,
        greenPoints: -5,
        cardType: "pollution"
    },
    {
        id: 36,
        name: "Nhà Máy Nhiệt Điện Cũ",
        zone: "crisis",
        zoneName: "Khu Khủng Hoảng",
        icon: "🏭",
        image: "https://images.unsplash.com/photo-1569060139402-b2d99d3eb740?auto=format&fit=crop&w=400&q=80",
        color: "#dc2626",
        description: "Công nghệ lạc hậu phát thải khí nhà kính khổng lồ. Cần đóng cửa để thay thế bằng điện gió!",
        cost: 410,
        greenPoints: -6,
        cardType: "pollution"
    },
    {
        id: 37,
        name: "Vành Đai Cây Chắn Cát",
        zone: "crisis",
        zoneName: "Khu Khủng Hoảng",
        icon: "🌴",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
        color: "#059669",
        description: "Rừng phi lao ngăn sa mạc hóa xâm lấn đồng ruộng ven biển miền Trung.",
        cost: 420,
        greenPoints: 6,
        cardType: "green"
    },
    {
        id: 38,
        name: "Bãi Chôn Lấp Hở Khí Metan",
        zone: "crisis",
        zoneName: "Khu Khủng Hoảng",
        icon: "🗑️",
        image: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=400&q=80",
        color: "#991b1b",
        description: "Khí metan rò rỉ gây nguy cơ hỏa hoạn và làm nóng bầu khí quyển gấp 28 lần CO2.",
        cost: 430,
        greenPoints: -4,
        cardType: "pollution"
    },
    {
        id: 39,
        name: "Đền Bù Tín Chỉ Carbon",
        zone: "crisis",
        zoneName: "Khu Khủng Hoảng",
        icon: "📜",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80",
        color: "#10b981",
        description: "Mua tín chỉ carbon để bù trừ dấu chân sinh thái và tái đầu tư vào dự án rừng già.",
        cost: 450,
        greenPoints: 8,
        cardType: "green"
    }
];

// --- 4 PLAYER ROLES (With High-Definition Illustrated Characters) ---
const PLAYER_ROLES = [
    {
        id: "farmer",
        name: "Bác Nông Dân",
        title: "Bàn Tay Xanh Rừng Trồng",
        avatar: "👨‍🌾",
        image: "https://images.unsplash.com/photo-1592417817098-8f3d69102353?auto=format&fit=crop&w=400&q=80",
        color: "#10b981",
        badge: "Chuyên Gia Đất Mẹ",
        ability: "Khi nhận Thẻ Cây Xanh, được cộng thêm +1 Điểm Xanh. Kháng 50% hiệu ứng Hạn Hán.",
        passive: "+1 Green Point on all plant actions",
        quote: "Đất lành chim đậu, trồng cây gây rừng là cách gieo hy vọng cho tương lai!"
    },
    {
        id: "scientist",
        name: "Nhà Khoa Học",
        title: "Viện Sĩ Sinh Học Ứng Dụng",
        avatar: "👩‍🔬",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80",
        color: "#06b6d4",
        badge: "Bậc Thầy Chế Tạo",
        ability: "Giảm 1 nguyên liệu phụ khi chế tạo bất kỳ công thức nào trong Bàn Chế Tạo Xanh.",
        passive: "Crafting cost discount & bonus cards",
        quote: "Mọi rác thải chỉ là nguồn tài nguyên đặt sai chỗ. Khoa học sẽ hồi sinh tất cả!"
    },
    {
        id: "engineer",
        name: "Kỹ Sư Môi Trường",
        title: "Chuyên Gia Năng Lượng Xanh",
        avatar: "👷‍♂️",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
        color: "#f59e0b",
        badge: "Công Nghệ Tuần Hoàn",
        ability: "Miễn nhiễm thẻ 'Cạn Kiệt Năng Lượng'. Tăng gấp đôi điểm số từ Pin Mặt Trời & Tuabin Gió.",
        passive: "Immune to energy outage, double renewable bonus",
        quote: "Nắng và gió là nguồn năng lượng vô tận của thiên nhiên ban tặng."
    },
    {
        id: "citizen",
        name: "Cư Dân Xanh",
        title: "Đại Sứ Sống Tối Giản",
        avatar: "🧑‍🤝‍🧑",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        color: "#38bdf8",
        badge: "Hành Động Cộng Đồng",
        ability: "Nhận thêm +2 Điểm Xanh tại Khu Đại Dương & Ô Tái Chế rác. Tăng cơ hội kích hoạt sự kiện cộng đồng.",
        passive: "+2 Green Points on ocean cleanup & recycling",
        quote: "Một hành động nhỏ của mỗi người sẽ tạo nên làn sóng xanh lan tỏa toàn cầu."
    }
];

// --- GROUP A: GREEN CARDS & ECO ITEMS ---
const GREEN_CARDS = [
    {
        id: "cay_xanh",
        name: "Thẻ Cây Xanh",
        type: "item",
        category: "green",
        points: 1,
        icon: "🌱",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
        description: "Gieo một mầm cây xanh. Thu thập đủ 5 thẻ ghép thành 1 thẻ Rừng (+3 điểm xanh).",
        rarity: "common",
        craftableAsIngredient: true,
        ecoFact: "Một cây trưởng thành có thể hấp thụ tới 22kg CO2 mỗi năm và cung cấp đủ oxy cho 2 người hít thở."
    },
    {
        id: "noi_that_nhua",
        name: "Thẻ Đồ Nội Thất Nhựa Tái Chế",
        type: "item",
        category: "green",
        points: 3,
        icon: "🪑",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
        description: "Bàn ghế cao cấp làm từ 5,000 nắp chai tái chế. Bền bỉ và không mục nát. +3 điểm xanh.",
        rarity: "rare",
        ecoFact: "Tái chế 1 tấn nhựa tiết kiệm khoảng 5,774 kWh năng lượng và 16.3 thùng dầu mỏ."
    },
    {
        id: "lanh_dao_moi_truong",
        name: "Thẻ Nhà Lãnh Đạo Môi Trường",
        type: "passive",
        category: "green",
        points: 4,
        icon: "🎖️",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
        description: "Truyền cảm hứng cho toàn trường học và cộng đồng. Được rút thêm 1 thẻ mỗi lượt!",
        rarity: "epic",
        ecoFact: "Những phong trào do thanh niên khởi xướng đã thúc đẩy hơn 130 quốc gia cam kết Net Zero vào năm 2050."
    },
    {
        id: "pin_mat_troi",
        name: "Thẻ Pin Năng Lượng Mặt Trời",
        type: "tech",
        category: "green",
        points: 2,
        icon: "☀️",
        image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
        description: "Tấm pin quang điện chuyển ánh sáng thành dòng điện sạch. +2 điểm xanh (hoặc ghép từ Khung nhôm + Kính cường lực + Tấm nền -> +5 điểm).",
        rarity: "rare",
        ecoFact: "Năng lượng mặt trời chiếu xuống Trái Đất trong 1 giờ đủ đáp ứng nhu cầu tiêu thụ điện của nhân loại trong cả 1 năm."
    },
    {
        id: "ong_hut_ba_mia",
        name: "Thẻ Ống Hút Bã Mía",
        type: "product",
        category: "green",
        points: 4,
        icon: "🥤",
        image: "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&w=600&q=80",
        description: "Thay thế hoàn toàn ống hút nhựa dùng 1 lần. Tiến thêm 1 bước & +4 điểm xanh.",
        rarity: "rare",
        ecoFact: "Ống hút bã mía phân hủy 100% trong đất sau 6 tháng thành phân bón hữu cơ, không chứa vi nhựa độc hại."
    },
    {
        id: "tuabin_gio",
        name: "Thẻ Tuabin Điện Gió",
        type: "tech",
        category: "green",
        points: 5,
        icon: "💨",
        image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80",
        description: "Cánh quạt khổng lồ đón luồng gió biển. Rút thêm 2 lần thẻ ở bộ thẻ môi trường.",
        rarity: "epic",
        ecoFact: "Một tuabin gió 3MW hiện đại có thể cung cấp đủ điện cho 1,500 hộ gia đình mỗi năm."
    },
    {
        id: "biogreen",
        name: "Thẻ BioGreen Cứu Tinh",
        type: "legendary",
        category: "green",
        points: 8,
        icon: "🧪",
        image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80",
        description: "Hợp chất sinh học kỳ diệu phân hủy rác nhựa đại dương. +8 điểm xanh ngay lập tức, miễn nhiễm 1 thẻ Ô Nhiễm bất kỳ.",
        rarity: "legendary",
        ecoFact: "Các nhà khoa học đã phát hiện enzyme Ideonella sakaiensis có khả năng 'ăn' nhựa PET chỉ trong vài ngày."
    },
    {
        id: "cam_bien_do_thi",
        name: "Thẻ Cảm Biến Môi Trường Đô Thị",
        type: "tech",
        category: "green",
        points: 3,
        icon: "📡",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
        description: "Mạng lưới IoT giám sát chất lượng không khí & nguồn nước. Hủy 1 thẻ Ô Nhiễm ngay lập tức khi rút phải.",
        rarity: "rare",
        ecoFact: "Dữ liệu mở về ô nhiễm thời gian thực giúp giảm 30% số ca bệnh đường hô hấp nhờ cảnh báo sớm người dân."
    },
    {
        id: "tai_sinh_trai_dat",
        name: "Thẻ 'Tái Sinh Trái Đất'",
        type: "miracle",
        category: "green",
        points: 6,
        icon: "🌍",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
        description: "Sức mạnh phục hồi kỳ diệu của Mẹ Thiên Nhiên. Hủy bỏ 1 sự kiện đang có hiệu lực trong bộ thẻ Ô Nhiễm.",
        rarity: "epic",
        ecoFact: "Nếu con người ngừng tàn phá, các hệ sinh thái rừng mưa nhiệt đới có thể tự phục hồi tới 80% chỉ sau 20 năm."
    },
    {
        id: "rac_huu_co",
        name: "Thẻ Rác Hữu Cơ",
        type: "ingredient",
        category: "green",
        points: 3,
        icon: "🍌",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
        description: "Vỏ trái cây, rau thừa ủ thành phân compost giàu mùn nuôi dưỡng đất. +3 điểm xanh.",
        rarity: "common",
        craftableAsIngredient: true,
        ecoFact: "Rác hữu cơ chiếm hơn 50% lượng rác sinh hoạt. Ủ compost giúp ngăn tạo ra khí metan gây hiệu ứng nhà kính."
    },
    {
        id: "phan_loai_rac",
        name: "Thẻ Phân Loại Rác Đúng Cách",
        type: "habit",
        category: "green",
        points: 2,
        icon: "♻️",
        image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
        description: "Phân chia 3 thùng: Hữu cơ - Tái chế - Rác vô cơ. Rút thêm 1 thẻ & +2 điểm xanh.",
        rarity: "common",
        ecoFact: "Phân loại rác tại nguồn giúp nâng tỷ lệ tái chế thực tế từ 10% lên hơn 70%, giảm chi phí xử lý chôn lấp."
    },
    {
        id: "xuong_tai_che_thong_minh",
        name: "Thẻ Xưởng Tái Chế Thông Minh",
        type: "building",
        category: "green",
        points: 5,
        icon: "🏭",
        image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
        description: "Nhà máy robot hóa ép viên nhựa sạch. Dùng 1 lần chặn tác động tiêu cực thẻ Ô Nhiễm & +5 điểm xanh.",
        rarity: "epic",
        craftableAsIngredient: true,
        ecoFact: "Các xưởng tái chế hiện đại có thể xử lý 100 tấn rác thải nhựa mỗi ngày mà không phát sinh nước thải ô nhiễm."
    },
    {
        id: "xe_dien_xanh",
        name: "Thẻ Xe Điện Xanh",
        type: "vehicle",
        category: "green",
        points: 3,
        icon: "🚗",
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
        description: "Phương tiện không khói, không tiếng ồn. Tiến thêm 2 ô mỗi lượt tung xúc xắc, miễn nhiễm 'Khói xe cộ' & +3 điểm.",
        rarity: "rare",
        ecoFact: "Xe điện giúp cắt giảm tới 60% lượng khí thải carbon vòng đời so với xe xăng truyền thống khi dùng điện tái tạo."
    },
    {
        id: "nhat_rac",
        name: "Thẻ Nhặt Rác Bãi Biển",
        type: "action",
        category: "green",
        points: 2,
        icon: "🧤",
        image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80",
        description: "Chủ động dọn sạch rác thải nhựa ở bãi biển hoặc khu rừng chỉ định. +2 điểm xanh.",
        rarity: "common",
        craftableAsIngredient: true,
        ecoFact: "Chiến dịch Clean Up The World quy tụ hơn 35 triệu tình nguyện viên tại 133 quốc gia mỗi năm nhặt rác."
    },
    // Raw Crafting Ingredients
    { id: "khung_nhom", name: "Khung Nhôm Tái Chế", type: "material", category: "green", points: 1, icon: "🔩", image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80", description: "Vật liệu khung chịu lực từ vỏ lon tái sinh.", craftableAsIngredient: true },
    { id: "kinh_cuong_luc", name: "Kính Cường Lực Chống Xước", type: "material", category: "green", points: 1, icon: "🪟", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80", description: "Bảo vệ bề mặt quang điện.", craftableAsIngredient: true },
    { id: "tam_nen", name: "Tấm Nền Quang Điện Silicon", type: "material", category: "green", points: 1, icon: "🔋", image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80", description: "Trái tim chuyển đổi ánh sáng thành điện.", craftableAsIngredient: true },
    { id: "ba_mia", name: "Thẻ Bã Mía Ép", type: "material", category: "green", points: 1, icon: "🎋", image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80", description: "Phụ phẩm nông nghiệp giàu xơ tự nhiên.", craftableAsIngredient: true },
    { id: "nuoc", name: "Thẻ Nước Tinh Khiết Tự Nhiên", type: "material", category: "green", points: 1, icon: "💧", image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=400&q=80", description: "Dung môi cho quá trình tạo bột ép.", craftableAsIngredient: true },
    { id: "khuon_tao_hinh", name: "Thẻ Khuôn Tạo Hình Sinh Học", type: "material", category: "green", points: 1, icon: "📐", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80", description: "Khuôn dập ống hút tự động.", craftableAsIngredient: true },
    { id: "canh_quat", name: "Cánh Quạt Composite Nhẹ", type: "material", category: "green", points: 1, icon: "🪶", image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=400&q=80", description: "Thiết kế khí động học đón gió nhẹ.", craftableAsIngredient: true },
    { id: "thap_de", name: "Tháp Trụ Thép Vững Chãi", type: "material", category: "green", points: 1, icon: "🗼", image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80", description: "Nâng tuabin lên tầng đón gió cao 100m.", craftableAsIngredient: true },
    { id: "may_phat_dien", name: "Máy Phát Nam Châm Vĩnh Cửu", type: "material", category: "green", points: 1, icon: "⚡", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80", description: "Hiệu suất chuyển đổi cơ năng sang điện 95%.", craftableAsIngredient: true },
    { id: "kim_loai_phe_lieu", name: "Kim Loại Phế Liệu Sạch", type: "material", category: "green", points: 1, icon: "🧲", image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80", description: "Vỏ máy cũ thu gom từ đô thị.", craftableAsIngredient: true },
    { id: "ai_quan_ly", name: "AI Quản Lý Rác Thông Minh", type: "material", category: "green", points: 1, icon: "🧠", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80", description: "Bộ vi xử lý nhúng phân loại vật liệu.", craftableAsIngredient: true },
    { id: "phong_thi_nghiem_xanh", name: "Phòng Thí Nghiệm Xanh", type: "material", category: "green", points: 2, icon: "🔬", image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80", description: "Không gian ươm mầm các phát kiến sinh thái.", craftableAsIngredient: true },
    { id: "nhua_tai_che", name: "Nhựa Tái Chế RPET", type: "material", category: "green", points: 1, icon: "🍶", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80", description: "Hạt nhựa tái sinh chuẩn an toàn.", craftableAsIngredient: true },
    { id: "tui_giay", name: "Túi Giấy Tái Sinh FSC", type: "material", category: "green", points: 1, icon: "🛍️", image: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=400&q=80", description: "Thay thế túi nilon khi đi siêu thị.", craftableAsIngredient: true }
];

// --- GROUP B: POLLUTION CARDS ---
const POLLUTION_CARDS = [
    {
        id: "rung_bi_chat_pha",
        name: "Thẻ Rừng Bị Chặt Phá",
        penalty: "all_minus_1",
        points: -1,
        icon: "🪓",
        image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80",
        description: "Lâm tặc tàn phá 50 hecta rừng nguyên sinh. Toàn bộ người chơi bị -1 điểm xanh!",
        warning: "CẢNH BÁO MẤT RỪNG",
        ecoFact: "Mỗi phút trôi qua, thế giới mất đi diện tích rừng nhiệt đới tương đương 27 sân bóng đá."
    },
    {
        id: "rac_nhua_bien",
        name: "Thẻ Rác Nhựa Tràn Ngập Bãi Biển",
        penalty: "coop_or_minus_2",
        points: -2,
        icon: "🚯",
        image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=600&q=80",
        description: "Sóng đánh dạt hàng ngàn tấn chai nhựa. Tất cả bị -2 điểm (Nếu người chơi khác bấm hợp tác cùng dọn, cả hai đều được +3 điểm)!",
        warning: "THẢM HỌA RÁC BIỂN",
        ecoFact: "Có khoảng 14 triệu tấn vi nhựa đang nằm dưới đáy đại dương và thâm nhập vào chuỗi thức ăn hải sản."
    },
    {
        id: "chay_rung_lon",
        name: "Thẻ Cháy Rừng Lớn",
        penalty: "minus_2",
        points: -2,
        icon: "🔥",
        image: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80",
        description: "Thời tiết khô nóng cực đoan châm ngòi biển lửa. Bạn mất 2 điểm xanh và khói bụi lan rộng!",
        warning: "BÁO ĐỘNG ĐỎ CHÁY RỪNG",
        ecoFact: "Cháy rừng ở Amazon và Úc thải ra hàng tỷ tấn CO2, biến bể chứa carbon thành nguồn phát thải khí nhà kính."
    },
    {
        id: "nha_may",
        name: "Thẻ Nhà Máy Xả Thải",
        penalty: "step_back_2",
        points: -2,
        icon: "🏭",
        image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80",
        description: "Nhà máy xả trộm nước thải chưa xử lý ra sông. Lùi 2 bước & -2 điểm xanh.",
        warning: "XẢ THẢI BẤT HỢP PHÁP",
        ecoFact: "80% lượng nước thải trên toàn cầu vẫn bị xả thẳng ra môi trường tự nhiên mà không qua xử lý sơ cấp."
    },
    {
        id: "rac_thai",
        name: "Thẻ Rác Thải Ứ Đọng",
        penalty: "skip_card",
        points: -1,
        icon: "🗑️",
        image: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80",
        description: "Ùn ứ rác tại điểm trung chuyển gây mùi hôi. Mất lượt rút thẻ tiếp theo & -1 điểm xanh.",
        warning: "ÙN Ứ ĐÔ THỊ",
        ecoFact: "Rác sinh hoạt không thu gom kịp thời là nguồn lây lan dịch bệnh sốt xuất huyết và nhiễm khuẩn nguồn nước ngầm."
    },
    {
        id: "chai_nhua",
        name: "Thẻ Chai Nhựa Dùng Một Lần",
        penalty: "draw_hazard",
        points: -3,
        icon: "🍾",
        image: "https://images.unsplash.com/photo-1528190336454-13cd56b45b5a?auto=format&fit=crop&w=600&q=80",
        description: "Sử dụng chai nước dùng 1 lần vô tội vạ. Rút thêm 1 thẻ Ô Nhiễm & -3 điểm xanh.",
        warning: "LẠM DỤNG NHỰA",
        ecoFact: "Phải mất 450 đến 1,000 năm để một chiếc chai nhựa phân rã thành các mảnh vi nhựa siêu nhỏ."
    },
    {
        id: "khi_thai_den",
        name: "Thẻ Nhà Máy Khí Thải Đen",
        penalty: "heavy_loss",
        points: -6,
        icon: "💨",
        image: "https://images.unsplash.com/photo-1569060139402-b2d99d3eb740?auto=format&fit=crop&w=600&q=80",
        description: "Cột khói đen khổng lồ từ lò đốt than lạc hậu. Lùi 2 ô & -6 điểm xanh!",
        warning: "KHỦNG HOẢNG KHÔNG KHÍ",
        ecoFact: "Ô nhiễm không khí từ nhiên liệu hóa thạch là nguyên nhân cướp đi sinh mạng của hơn 8 triệu người mỗi năm."
    },
    {
        id: "tui_nilon",
        name: "Thẻ Túi Nilon Vấn Nạn",
        penalty: "step_back_1",
        points: -5,
        icon: "🛍️",
        image: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80",
        description: "Túi nilon bay vào cống thoát nước làm tắc nghẽn ngập lụt đô thị. Lùi 1 bước & -5 điểm xanh.",
        warning: "Ô NHIỄM TRẮNG",
        ecoFact: "Một chiếc túi nilon chỉ được sử dụng trung bình 12 phút, nhưng tồn tại ngoài thiên nhiên hơn 500 năm."
    },
    {
        id: "ro_ri_hoa_chat",
        name: "Thẻ Rò Rỉ Hóa Chất",
        penalty: "lose_2_cards",
        points: -4,
        icon: "🛢️",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
        description: "Thùng hóa chất ăn mòn thủng đáy ngấm vào mạch nước ngầm. Mất 2 thẻ môi trường ngẫu nhiên & -4 điểm xanh!",
        warning: "SỰ CỐ ĐỘC HẠI",
        ecoFact: "Một lít dầu nhớt thải rò rỉ có thể làm ô nhiễm tới 1 triệu lít nước sinh hoạt sạch của người dân."
    },
    {
        id: "han_han_toan_cau",
        name: "Thẻ Hạn Hán Toàn Cầu",
        penalty: "drought_check",
        points: -3,
        icon: "🏜️",
        image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
        description: "Đất đai nứt toác, sông ngòi cạn đáy. Mất 3 điểm nếu người chơi không sở hữu Thẻ Cây Xanh!",
        warning: "THIÊN TAI NẮNG HẠN",
        ecoFact: "Hạn hán ảnh hưởng tới hơn 55 triệu người mỗi năm và đe dọa trực tiếp an ninh lương thực toàn cầu."
    },
    {
        id: "o_nhiem_khong_khi",
        name: "Thẻ Ô Nhiễm Không Khí Mù Mịt",
        penalty: "all_minus_1",
        points: -1,
        icon: "🌫️",
        image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=600&q=80",
        description: "Bụi mịn bao phủ toàn thành phố, người dân phải đeo khẩu trang N95. Toàn bộ người chơi bị -1 điểm xanh.",
        warning: "BỤI MỊN BÁO ĐỘNG",
        ecoFact: "Chỉ số AQI vượt quá 300 tương đương với việc mỗi người hít thở khói của 20 điếu thuốc lá mỗi ngày."
    },
    {
        id: "mua_axit",
        name: "Thẻ Mưa Axit",
        penalty: "lock_tree",
        points: -2,
        icon: "🌧️",
        image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
        description: "Khí SO2 kết hợp hơi nước tạo mưa axit ăn mòn tán lá. Vô hiệu hóa 1 thẻ Trồng Cây trong 2 lượt.",
        warning: "MƯA AXIT TÀN PHÁ",
        ecoFact: "Mưa axit làm giảm độ pH của hồ nước, khiến trứng cá không thể nở và làm rụng lá cả những cánh rừng thông già."
    },
    {
        id: "khoi_xe_co",
        name: "Thẻ Khói Xe Cộ Giờ Cao Điểm",
        penalty: "traffic_smoke",
        points: -1,
        icon: "🚗",
        image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80",
        description: "Kẹt xe hàng dài phả khí CO độc hại. Lùi 1 ô & -1 điểm xanh (Nếu có Thẻ 'Xe điện xanh' -> Miễn trừ & +3 điểm)!",
        warning: "ÙN TẮC KHÓI BỤI",
        ecoFact: "Giao thông đô thị chiếm tới 25% lượng phát thải khí nhà kính toàn cầu và 40% ô nhiễm bụi mịn nội đô."
    },
    {
        id: "can_kiet_nang_luong",
        name: "Thẻ Cạn Kiệt Năng Lượng Toàn Cầu",
        penalty: "energy_crisis",
        points: 0,
        icon: "🔌",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80",
        description: "Lưới điện quá tải sụp đổ vì thiếu nhiên liệu hóa thạch. Mất 1 lượt (Trừ khi người chơi có 'Pin mặt trời' hoặc 'Tuabin gió')!",
        warning: "SỤP ĐỔ NĂNG LƯỢNG",
        ecoFact: "Trữ lượng than đá và dầu mỏ dự kiến sẽ cạn kiệt trong thế kỷ này nếu con người không chuyển đổi sang năng lượng sạch."
    }
];

// --- GROUP C: INVENTIONS & CRAFTING RECIPES ---
const CRAFTING_RECIPES = [
    {
        id: "craft_pin_mat_troi",
        resultId: "pin_mat_troi_advanced",
        name: "Pin Năng Lượng Mặt Trời Cao Cấp",
        icon: "☀️",
        image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
        points: 5,
        materials: ["khung_nhom", "kinh_cuong_luc", "tam_nen"],
        description: "Ghép từ Khung nhôm + Kính cường lực + Tấm nền quang điện. Đạt hiệu suất cao +5 Điểm Xanh!",
        badge: "Năng Lượng Sạch"
    },
    {
        id: "craft_ong_hut_ba_mia",
        resultId: "ong_hut_ba_mia",
        name: "Ống Hút Bã Mía Sinh Học",
        icon: "🥤",
        image: "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&w=600&q=80",
        points: 4,
        materials: ["ba_mia", "nuoc", "khuon_tao_hinh"],
        description: "Ghép từ Bã mía + Nước + Khuôn tạo hình. Tiến thêm 1 bước & +4 Điểm Xanh!",
        badge: "Giải Pháp Không Nhựa"
    },
    {
        id: "craft_tuabin_gio",
        resultId: "tuabin_gio_advanced",
        name: "Tuabin Điện Gió Siêu Cấp",
        icon: "💨",
        image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80",
        points: 6,
        materials: ["canh_quat", "thap_de", "may_phat_dien"],
        description: "Ghép từ Cánh quạt + Tháp & đế + Máy phát điện. Được rút thêm 2 lần thẻ Môi Trường!",
        badge: "Công Trình Biểu Tượng"
    },
    {
        id: "craft_truong_hoc_xanh",
        resultId: "truong_hoc_xanh",
        name: "Trường Học Xanh Không Rác Thải",
        icon: "🏫",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
        points: 2,
        materials: ["tui_giay", "ong_hut_ba_mia", "cay_xanh", "nhat_rac"],
        description: "Mô hình giáo dục xanh kết hợp [Túi giấy + Ống hút bã mía + Trồng cây + Nhặt rác]. +2 Điểm Xanh và mở khóa đào tạo thế hệ mầm non!",
        badge: "Giáo Dục Tương Lai"
    },
    {
        id: "craft_hop_phan_loai_ai",
        resultId: "hop_phan_loai_ai",
        name: "Hộp Phân Loại Rác Thông Minh AI",
        icon: "🤖",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
        points: 3,
        materials: ["kim_loai_phe_lieu", "ai_quan_ly"],
        description: "Thùng rác tự động mở nắp và phân loại rác bằng camera AI. +3 Điểm Xanh & HỦY 1 THẺ Ô NHIỄM BẤT KỲ!",
        badge: "Công Nghệ 4.0"
    },
    {
        id: "craft_vat_lieu_sinh_hoc",
        resultId: "vat_lieu_sinh_hoc",
        name: "Vật Liệu Sinh Học Tự Hủy",
        icon: "🧪",
        image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80",
        points: 3,
        materials: ["rac_huu_co", "nhua_tai_che"],
        description: "Tổng hợp polymer sinh học từ [Rác hữu cơ + Nhựa tái chế]. Nhẹ, bền và phân rã hoàn toàn trong đất. +3 Điểm Xanh.",
        badge: "Đột Phá Sinh Học"
    },
    {
        id: "craft_rung_xanh",
        resultId: "rung_xanh_hoan_thien",
        name: "Cánh Rừng Xanh Phục Hồi",
        icon: "🌲🌲",
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
        points: 3,
        materials: ["cay_xanh", "cay_xanh", "cay_xanh", "cay_xanh", "cay_xanh"],
        description: "Thu thập đủ 5 Thẻ Cây Xanh ghép thành một cánh rừng nhiệt đới trù phú. +3 Điểm Xanh & tăng độ che phủ toàn cầu!",
        badge: "Lá Phổi Xanh"
    },
    // The Ultimate Gaia Master Combo
    {
        id: "craft_combo_vong_tuan_hoan",
        resultId: "combo_vong_tuan_hoan",
        name: "COMBO 'VÒNG TUẦN HOÀN XANH'",
        icon: "🌟",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
        points: 12,
        materials: ["phong_thi_nghiem_xanh", "rac_huu_co", "xuong_tai_che_thong_minh", "vat_lieu_sinh_hoc"],
        description: "Sở hữu đủ 4 trụ cột: [Phòng thí nghiệm xanh + Rác hữu cơ + Xưởng tái chế + Vật liệu sinh học mới]. KÍCH HOẠT BÃO SÁNG XANH TOÀN BÀN! Tất cả người chơi +3 điểm, xóa 1 thẻ ô nhiễm, rác toàn bản đồ giảm một nửa!",
        badge: "ĐỈNH CAO GAIA",
        isUltimateCombo: true
    }
];

// --- GROUP D: EVENTS & MISSIONS ---
const GLOBAL_EVENTS = [
    {
        id: "bao_nhua_dai_duong",
        name: "Sự Kiện: Bão Nhựa Đại Dương",
        icon: "🌊",
        image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=600&q=80",
        description: "Triều cường dâng cao cuốn hàng triệu tấn rác nhựa dạt vào vịnh. Toàn bộ người chơi bị trừ 2 điểm xanh, trừ người đã sở hữu dự án tái chế.",
        duration: 2,
        type: "crisis"
    },
    {
        id: "o_nhiem_khong_khi_tang_cao",
        name: "Sự Kiện: Bụi Mịn Vượt Ngưỡng",
        icon: "🌫️",
        image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=600&q=80",
        description: "Hiện tượng nghịch nhiệt giữ chặt khói xe cộ trong lòng thung lũng. Ai chưa sở hữu thẻ Cây Xanh bị trừ 2 điểm.",
        duration: 2,
        type: "crisis"
    },
    {
        id: "song_toi_gian_lan_rong",
        name: "Sự Kiện: Phong Trào Sống Tối Giản",
        icon: "🧘",
        image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
        description: "Làn sóng từ bỏ tiêu dùng lãng phí lan tỏa. Bất kỳ ai có dưới 3 thẻ bài trong tay được nhận thưởng +3 Điểm Xanh khích lệ!",
        duration: 3,
        type: "blessing"
    },
    {
        id: "tuan_le_lam_sach_bien",
        name: "Sự Kiện: Tuần Lễ Làm Sạch Biển Quốc Tế",
        icon: "🏖️",
        image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80",
        description: "Chiến dịch tình nguyện toàn cầu! Người chơi đang đứng tại Khu Đại Dương được +3 điểm xanh, người ở các khu khác được +1 điểm.",
        duration: 2,
        type: "blessing"
    },
    {
        id: "hoi_thao_giao_duc_moi_truong",
        name: "Sự Kiện: Hội Thảo Giáo Dục Môi Trường",
        icon: "🎓",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
        description: "Diễn đàn các trường học xanh hội tụ. Người chơi sở hữu 'Trường học xanh' lập tức nhận +4 điểm xanh & rút 1 thẻ Phát Minh ngẫu nhiên.",
        duration: 3,
        type: "blessing"
    }
];

const MISSIONS = [
    {
        id: "mission_exchange",
        title: "Trao Đổi Ý Tưởng Xanh",
        reward: "+2 Điểm Xanh",
        points: 2,
        requirement: "Tương tác với EcoBot AI và tra cứu 1 giải pháp môi trường",
        icon: "💡"
    },
    {
        id: "mission_no_straw",
        title: "Không Còn Ống Hút Nhựa!",
        reward: "+3 Điểm & Tiến 1 ô",
        points: 3,
        bonusSteps: 1,
        requirement: "Chế tạo thành công 1 Thẻ Ống Hút Bã Mía",
        icon: "🥤"
    },
    {
        id: "mission_green_commute",
        title: "Di Chuyển Xanh",
        reward: "+2 Điểm Xanh",
        points: 2,
        requirement: "Sở hữu Thẻ Xe Buýt Điện hoặc Xe Điện Xanh",
        icon: "🚲"
    },
    {
        id: "mission_invention",
        title: "Phát Minh Vì Trái Đất",
        reward: "+4 Điểm Xanh",
        points: 4,
        requirement: "Ghép thành công bất kỳ phát minh công nghệ nào tại Bàn Chế Tạo",
        icon: "🔬"
    },
    {
        id: "mission_reforest",
        title: "Trồng Rừng Cộng Đồng",
        reward: "+5 Điểm & Đi thêm 3 ô",
        points: 5,
        bonusSteps: 3,
        requirement: "Sở hữu ít nhất 3 Thẻ Cây Xanh hoặc 1 Thẻ Rừng",
        icon: "🌲"
    },
    {
        id: "mission_clean_energy",
        title: "Trạm Năng Lượng Tái Tạo",
        reward: "+6 Điểm & Rút 2 thẻ",
        points: 6,
        extraCards: 2,
        requirement: "Hoàn thành Pin Mặt Trời hoặc Tuabin Gió",
        icon: "⚡"
    },
    {
        id: "mission_eco_city",
        title: "Thành Phố Xanh Toàn Diện",
        reward: "+7 Điểm & Thêm 1 lượt",
        points: 7,
        extraTurn: true,
        requirement: "Sở hữu cả Trường Học Xanh và Hộp Phân Loại Rác AI",
        icon: "🏙️"
    },
    {
        id: "mission_gaia",
        title: "Sứ Mệnh Gaia - Cứu Toàn Cầu",
        reward: "+11 Điểm & Cứu Thế Giới",
        points: 11,
        requirement: "Đưa Sức Khỏe Trái Đất đạt 100 Điểm Xanh và kích hoạt Combo Vòng Tuần Hoàn",
        icon: "🌟"
    }
];

// 4 Game Phases
const GAME_PHASES = [
    {
        phase: 1,
        name: "Thức Tỉnh Xanh",
        scoreRange: "0 - 25 Điểm Xanh",
        description: "Trái Đất đang bị bao phủ bởi khói xám ô nhiễm. Người chơi bắt đầu hành trình thu gom rác thải, trồng những mầm cây đầu tiên và thức tỉnh nhận thức cộng đồng."
    },
    {
        phase: 2,
        name: "Hành Động Cứu Nguy",
        scoreRange: "26 - 50 Điểm Xanh",
        description: "Bầu trời bắt đầu hé rạng. Các chiến dịch làm sạch bãi biển, dọn dẹp khu rừng và phân loại rác thải tại nguồn được triển khai mạnh mẽ."
    },
    {
        phase: 3,
        name: "Đột Phá Công Nghệ",
        scoreRange: "51 - 75 Điểm Xanh",
        description: "Khoa học kỹ thuật sinh thái bùng nổ: năng lượng mặt trời, tuabin gió ngoài khơi, và vật liệu sinh học tự hủy thay thế dần nhiên liệu hóa thạch."
    },
    {
        phase: 4,
        name: "Trái Đất Hồi Sinh (Gaia Harmony)",
        scoreRange: "76 - 100 Điểm Xanh",
        description: "Kỷ nguyên sinh thái viên mãn! Rừng già xanh mướt, đại dương trong vắt lấp lánh san hô, Trái Đất chuyển sang màu ngọc lam rực rỡ và nhân loại sống hài hòa với thiên nhiên."
    }
];

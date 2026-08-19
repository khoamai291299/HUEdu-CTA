/**
 * src/data/datasources/sqlite/seed/seedData.ts
 * Mục đích: Dữ liệu mẫu thực tế (danh mục + từ vựng tiếng Việt theo đề bài Epic 1) để seed lần đầu.
 * Dependency: không.
 */
export interface SeedCategory {
  key: string;
  nameVi: string;
  nameEn: string;
  icon: string;
  color: string;
  type: 'activity' | 'vocabulary';
  sortOrder: number;
}

export interface SeedVocabulary {
  nameVi: string;
  nameEn: string;
  speechTextVi?: string;
  speechTextEn?: string;
  categoryKey: string;
  type: 'activity' | 'vocabulary';
  sortOrder: number;
  imagePath?: string;
}

export const SEED_CATEGORIES: SeedCategory[] = [
  // Epic 1 Categories (using activity type to show up in DirectBoard)
  { key: 'food', nameVi: 'Ăn uống', nameEn: 'Food & Drink', icon: 'Utensils', color: '#F2B5A0', type: 'activity', sortOrder: 1 },
  { key: 'personal', nameVi: 'Sinh hoạt', nameEn: 'Personal', icon: 'Smile', color: '#5B8DEF', type: 'activity', sortOrder: 2 },
  { key: 'objects', nameVi: 'Đồ vật', nameEn: 'Objects', icon: 'Gamepad2', color: '#F4D03F', type: 'activity', sortOrder: 3 },
];

export const SEED_VOCABULARY: SeedVocabulary[] = [
  // --- NHÓM 1 - ĂN UỐNG ---
  { nameVi: 'Cơm', nameEn: 'Rice', speechTextVi: 'Con muốn ăn cơm', categoryKey: 'food', type: 'activity', sortOrder: 1, imagePath: 'arasaac_rice' },
  { nameVi: 'Thịt gà', nameEn: 'Chicken', speechTextVi: 'Con muốn ăn thịt gà', categoryKey: 'food', type: 'activity', sortOrder: 2, imagePath: 'arasaac_chicken' },
  { nameVi: 'Trứng chiên', nameEn: 'Fried Egg', speechTextVi: 'Con muốn ăn trứng chiên', categoryKey: 'food', type: 'activity', sortOrder: 3, imagePath: 'arasaac_fried_egg' },
  { nameVi: 'Canh', nameEn: 'Soup', speechTextVi: 'Con muốn ăn canh', categoryKey: 'food', type: 'activity', sortOrder: 4, imagePath: 'arasaac_soup' },
  { nameVi: 'Nước lọc', nameEn: 'Water', speechTextVi: 'Con muốn uống nước', categoryKey: 'food', type: 'activity', sortOrder: 5, imagePath: 'arasaac_water' },
  { nameVi: 'Sữa', nameEn: 'Milk', speechTextVi: 'Con muốn uống sữa', categoryKey: 'food', type: 'activity', sortOrder: 6, imagePath: 'arasaac_milk' },
  { nameVi: 'Nước cam', nameEn: 'Orange Juice', speechTextVi: 'Con muốn uống nước cam', categoryKey: 'food', type: 'activity', sortOrder: 7, imagePath: 'lucide:CupSoda' },
  { nameVi: 'Sữa chua', nameEn: 'Yogurt', speechTextVi: 'Con muốn ăn sữa chua', categoryKey: 'food', type: 'activity', sortOrder: 8, imagePath: 'arasaac_yogurt' },
  { nameVi: 'Táo', nameEn: 'Apple', speechTextVi: 'Con muốn ăn táo', categoryKey: 'food', type: 'activity', sortOrder: 9, imagePath: 'arasaac_apple' },
  { nameVi: 'Chuối', nameEn: 'Banana', speechTextVi: 'Con muốn ăn chuối', categoryKey: 'food', type: 'activity', sortOrder: 10, imagePath: 'arasaac_banana' },
  { nameVi: 'Cam', nameEn: 'Orange', speechTextVi: 'Con muốn ăn cam', categoryKey: 'food', type: 'activity', sortOrder: 11, imagePath: 'arasaac_orange' },
  { nameVi: 'Dưa hấu', nameEn: 'Watermelon', speechTextVi: 'Con muốn ăn dưa hấu', categoryKey: 'food', type: 'activity', sortOrder: 12, imagePath: 'arasaac_watermelon' },

  // --- NHÓM 2 - SINH HOẠT CÁ NHÂN ---
  { nameVi: 'Ăn', nameEn: 'Eat', speechTextVi: 'Con muốn ăn', categoryKey: 'personal', type: 'activity', sortOrder: 1, imagePath: 'arasaac_eat' },
  { nameVi: 'Uống', nameEn: 'Drink', speechTextVi: 'Con muốn uống nước', categoryKey: 'personal', type: 'activity', sortOrder: 2, imagePath: 'arasaac_drink' },
  { nameVi: 'Ngủ', nameEn: 'Sleep', speechTextVi: 'Con muốn đi ngủ', categoryKey: 'personal', type: 'activity', sortOrder: 3, imagePath: 'arasaac_sleep' },
  { nameVi: 'Đi vệ sinh', nameEn: 'Toilet', speechTextVi: 'Con muốn đi vệ sinh', categoryKey: 'personal', type: 'activity', sortOrder: 4, imagePath: 'local_toilet' },
  { nameVi: 'Rửa tay', nameEn: 'Wash Hands', speechTextVi: 'Con muốn đi rửa tay', categoryKey: 'personal', type: 'activity', sortOrder: 5, imagePath: 'local_wash_hands' },
  { nameVi: 'Đánh răng', nameEn: 'Brush Teeth', speechTextVi: 'Con muốn đi đánh răng', categoryKey: 'personal', type: 'activity', sortOrder: 6, imagePath: 'arasaac_brush_teeth' },
  { nameVi: 'Tắm', nameEn: 'Take a bath', speechTextVi: 'Con muốn đi tắm', categoryKey: 'personal', type: 'activity', sortOrder: 7, imagePath: 'local_shower' },
  { nameVi: 'Áo thun', nameEn: 'T-shirt', speechTextVi: 'Con muốn mặc áo thun', categoryKey: 'personal', type: 'activity', sortOrder: 8, imagePath: 'arasaac_t_shirt' },
  { nameVi: 'Quần dài', nameEn: 'Pants', speechTextVi: 'Con muốn mặc quần dài', categoryKey: 'personal', type: 'activity', sortOrder: 9, imagePath: 'arasaac_jeans' },

  // --- NHÓM 3 - ĐỒ VẬT ---
  { nameVi: 'Xe đồ chơi', nameEn: 'Toy Car', speechTextVi: 'Con muốn chơi xe đồ chơi', categoryKey: 'objects', type: 'activity', sortOrder: 1, imagePath: 'arasaac_toy_car' },
  { nameVi: 'Quả bóng', nameEn: 'Ball', speechTextVi: 'Con muốn chơi quả bóng', categoryKey: 'objects', type: 'activity', sortOrder: 2, imagePath: 'arasaac_ball' },
  { nameVi: 'Gấu bông', nameEn: 'Teddy Bear', speechTextVi: 'Con muốn chơi với gấu bông', categoryKey: 'objects', type: 'activity', sortOrder: 3, imagePath: 'arasaac_teddy_bear' },
  { nameVi: 'Búp bê', nameEn: 'Doll', speechTextVi: 'Con muốn chơi búp bê', speechTextEn: 'I want to play doll', categoryKey: 'objects', type: 'activity', sortOrder: 4, imagePath: 'arasaac_doll' },
  { nameVi: 'Khối gỗ', nameEn: 'Wooden blocks', speechTextVi: 'Con muốn xếp khối gỗ', speechTextEn: 'I want to play wooden blocks', categoryKey: 'objects', type: 'activity', sortOrder: 5, imagePath: 'local_wooden_blocks' },
  { nameVi: 'Sách', nameEn: 'Book', speechTextVi: 'Con muốn đọc sách', speechTextEn: 'I want to read book', categoryKey: 'objects', type: 'activity', sortOrder: 6, imagePath: 'arasaac_book' },
  { nameVi: 'Bút chì', nameEn: 'Pencil', speechTextVi: 'Con muốn dùng bút chì', categoryKey: 'objects', type: 'activity', sortOrder: 7, imagePath: 'arasaac_pencil' },
  { nameVi: 'Vở', nameEn: 'Notebook', speechTextVi: 'Con muốn viết vào vở', categoryKey: 'objects', type: 'activity', sortOrder: 8, imagePath: 'arasaac_notebook' },
  { nameVi: 'Cục tẩy', nameEn: 'Eraser', speechTextVi: 'Con muốn dùng cục tẩy', categoryKey: 'objects', type: 'activity', sortOrder: 9, imagePath: 'arasaac_pencil_eraser' },
];

export const SEED_DEFAULT_CHILD = { name: 'Bé' };

/**
 * src/data/datasources/sqlite/seed/seedData.ts
 * Mục đích: Dữ liệu mẫu thực tế (danh mục + 10 từ vựng tiếng Việt theo đề bài) để seed lần đầu.
 *           icon là tên component Lucide (resolver ở tầng presentation).
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
  // Vocabulary Categories
  { key: 'food', nameVi: 'Đồ ăn', nameEn: 'Food', icon: 'Utensils', color: '#F2B5A0', type: 'vocabulary', sortOrder: 1 },
  { key: 'drink', nameVi: 'Đồ uống', nameEn: 'Drink', icon: 'CupSoda', color: '#5B8DEF', type: 'vocabulary', sortOrder: 2 },
  { key: 'pronoun', nameVi: 'Đại từ', nameEn: 'Pronouns', icon: 'User', color: '#F4D03F', type: 'vocabulary', sortOrder: 3 },
  { key: 'verb', nameVi: 'Động từ', nameEn: 'Verbs', icon: 'Zap', color: '#E74C3C', type: 'vocabulary', sortOrder: 4 },
  { key: 'question', nameVi: 'Câu hỏi', nameEn: 'Questions', icon: 'HelpCircle', color: '#9C8CEF', type: 'vocabulary', sortOrder: 5 },
  { key: 'family', nameVi: 'Gia đình', nameEn: 'Family', icon: 'Users', color: '#7BD0C1', type: 'vocabulary', sortOrder: 6 },
  { key: 'emotion', nameVi: 'Cảm xúc', nameEn: 'Emotions', icon: 'Smile', color: '#E0A96E', type: 'vocabulary', sortOrder: 7 },
  { key: 'animal', nameVi: 'Động vật', nameEn: 'Animals', icon: 'Cat', color: '#F4D03F', type: 'vocabulary', sortOrder: 8 },
  { key: 'body', nameVi: 'Cơ thể', nameEn: 'Body Parts', icon: 'Hand', color: '#E74C3C', type: 'vocabulary', sortOrder: 9 },
  { key: 'clothing', nameVi: 'Quần áo', nameEn: 'Clothes', icon: 'Shirt', color: '#1ABC9C', type: 'vocabulary', sortOrder: 10 },

  // Activity Categories
  { key: 'activity', nameVi: 'Hoạt động', nameEn: 'Activities', icon: 'Activity', color: '#9C8CEF', type: 'activity', sortOrder: 1 },
  { key: 'act_eat', nameVi: 'Ăn uống', nameEn: 'Eating', icon: 'Utensils', color: '#F2B5A0', type: 'activity', sortOrder: 2 },
  { key: 'act_play', nameVi: 'Vui chơi', nameEn: 'Playing', icon: 'Gamepad2', color: '#5B8DEF', type: 'activity', sortOrder: 3 },
];

export const SEED_VOCABULARY: SeedVocabulary[] = [
  // Drinks (Vocabulary)
  { nameVi: 'Nước', nameEn: 'Water', categoryKey: 'drink', type: 'vocabulary', sortOrder: 1, imagePath: 'lucide:Droplet' },
  { nameVi: 'Sữa', nameEn: 'Milk', categoryKey: 'drink', type: 'vocabulary', sortOrder: 2, imagePath: 'lucide:CupSoda' },
  { nameVi: 'Nước ép', nameEn: 'Juice', categoryKey: 'drink', type: 'vocabulary', sortOrder: 3, imagePath: 'lucide:CupSoda' },

  // Food (Vocabulary)
  { nameVi: 'Cơm', nameEn: 'Rice', categoryKey: 'food', type: 'vocabulary', sortOrder: 1, imagePath: 'lucide:Utensils' },
  { nameVi: 'Bánh mì', nameEn: 'Bread', categoryKey: 'food', type: 'vocabulary', sortOrder: 2, imagePath: 'lucide:Carrot' },
  { nameVi: 'Trái cây', nameEn: 'Fruit', categoryKey: 'food', type: 'vocabulary', sortOrder: 3, imagePath: 'lucide:Apple' },
  { nameVi: 'Bánh', nameEn: 'Cake', categoryKey: 'food', type: 'vocabulary', sortOrder: 4, imagePath: 'lucide:Utensils' },
  { nameVi: 'Kẹo', nameEn: 'Candy', categoryKey: 'food', type: 'vocabulary', sortOrder: 5, imagePath: 'lucide:Heart' },
  { nameVi: 'Bún', nameEn: 'Noodles', categoryKey: 'food', type: 'vocabulary', sortOrder: 6, imagePath: 'lucide:Utensils' },
  { nameVi: 'Bữa sáng', nameEn: 'Breakfast', categoryKey: 'food', type: 'vocabulary', sortOrder: 7, imagePath: 'lucide:Sun' },
  { nameVi: 'Bữa trưa', nameEn: 'Lunch', categoryKey: 'food', type: 'vocabulary', sortOrder: 8, imagePath: 'lucide:Utensils' },
  { nameVi: 'Bữa tối', nameEn: 'Dinner', categoryKey: 'food', type: 'vocabulary', sortOrder: 9, imagePath: 'lucide:Moon' },
  { nameVi: 'Pizza', nameEn: 'Pizza', categoryKey: 'food', type: 'vocabulary', sortOrder: 10, imagePath: 'lucide:Pizza' },
  { nameVi: 'Salad', nameEn: 'Salad', categoryKey: 'food', type: 'vocabulary', sortOrder: 11, imagePath: 'lucide:Leaf' },

  // Pronouns (Vocabulary)
  { nameVi: 'Tôi (Con)', nameEn: 'I / Me', categoryKey: 'pronoun', type: 'vocabulary', sortOrder: 1, imagePath: 'lucide:User' },
  { nameVi: 'Bạn', nameEn: 'You', categoryKey: 'pronoun', type: 'vocabulary', sortOrder: 2, imagePath: 'lucide:Users' },

  // Verbs (Vocabulary)
  { nameVi: 'Muốn', nameEn: 'Want', categoryKey: 'verb', type: 'vocabulary', sortOrder: 1, imagePath: 'lucide:Heart' },
  { nameVi: 'Đi', nameEn: 'Go', categoryKey: 'verb', type: 'vocabulary', sortOrder: 2, imagePath: 'lucide:ArrowRight' },
  { nameVi: 'Ăn', nameEn: 'Eat', categoryKey: 'verb', type: 'vocabulary', sortOrder: 3, imagePath: 'lucide:Utensils' },
  { nameVi: 'Uống', nameEn: 'Drink', categoryKey: 'verb', type: 'vocabulary', sortOrder: 4, imagePath: 'lucide:CupSoda' },
  { nameVi: 'Làm', nameEn: 'Do', categoryKey: 'verb', type: 'vocabulary', sortOrder: 5, imagePath: 'lucide:Play' },
  { nameVi: 'Dừng', nameEn: 'Stop', categoryKey: 'verb', type: 'vocabulary', sortOrder: 6, imagePath: 'lucide:Square' },
  { nameVi: 'Không', nameEn: 'Not', categoryKey: 'verb', type: 'vocabulary', sortOrder: 7, imagePath: 'lucide:X' },
  { nameVi: 'Có', nameEn: 'Yes', categoryKey: 'verb', type: 'vocabulary', sortOrder: 8, imagePath: 'lucide:Check' },

  // Questions (Vocabulary)
  { nameVi: 'Cái gì?', nameEn: 'What?', categoryKey: 'question', type: 'vocabulary', sortOrder: 1, imagePath: 'lucide:HelpCircle' },
  { nameVi: 'Ở đâu?', nameEn: 'Where?', categoryKey: 'question', type: 'vocabulary', sortOrder: 2, imagePath: 'lucide:MapPin' },
  { nameVi: 'Như thế nào?', nameEn: 'How?', categoryKey: 'question', type: 'vocabulary', sortOrder: 3, imagePath: 'lucide:HelpCircle' },
  { nameVi: 'Tại sao?', nameEn: 'Why?', categoryKey: 'question', type: 'vocabulary', sortOrder: 4, imagePath: 'lucide:HelpCircle' },

  // Family (Vocabulary)
  { nameVi: 'Mẹ', nameEn: 'Mom', categoryKey: 'family', type: 'vocabulary', sortOrder: 1, imagePath: 'lucide:Users' },
  { nameVi: 'Cha', nameEn: 'Dad', categoryKey: 'family', type: 'vocabulary', sortOrder: 2, imagePath: 'lucide:Users' },
  { nameVi: 'Anh', nameEn: 'Brother', categoryKey: 'family', type: 'vocabulary', sortOrder: 3, imagePath: 'lucide:Users' },
  { nameVi: 'Chị', nameEn: 'Sister', categoryKey: 'family', type: 'vocabulary', sortOrder: 4, imagePath: 'lucide:Users' },
  { nameVi: 'Ông', nameEn: 'Grandpa', categoryKey: 'family', type: 'vocabulary', sortOrder: 5, imagePath: 'lucide:Users' },
  { nameVi: 'Bà', nameEn: 'Grandma', categoryKey: 'family', type: 'vocabulary', sortOrder: 6, imagePath: 'lucide:Users' },

  // Emotions (Vocabulary)
  { nameVi: 'Vui vẻ', nameEn: 'Happy', categoryKey: 'emotion', type: 'vocabulary', sortOrder: 1, imagePath: 'lucide:Laugh' },
  { nameVi: 'Buồn', nameEn: 'Sad', categoryKey: 'emotion', type: 'vocabulary', sortOrder: 2, imagePath: 'lucide:Frown' },
  { nameVi: 'Tức giận', nameEn: 'Angry', categoryKey: 'emotion', type: 'vocabulary', sortOrder: 3, imagePath: 'lucide:Angry' },
  { nameVi: 'Thích', nameEn: 'Like', categoryKey: 'emotion', type: 'vocabulary', sortOrder: 4, imagePath: 'lucide:ThumbsUp' },
  { nameVi: 'Không thích', nameEn: 'Dislike', categoryKey: 'emotion', type: 'vocabulary', sortOrder: 5, imagePath: 'lucide:ThumbsDown' },

  // Animals (Vocabulary)
  { nameVi: 'Chó', nameEn: 'Dog', categoryKey: 'animal', type: 'vocabulary', sortOrder: 1, imagePath: 'lucide:Dog' },
  { nameVi: 'Mèo', nameEn: 'Cat', categoryKey: 'animal', type: 'vocabulary', sortOrder: 2, imagePath: 'lucide:Cat' },
  { nameVi: 'Chim', nameEn: 'Bird', categoryKey: 'animal', type: 'vocabulary', sortOrder: 3, imagePath: 'lucide:Bird' },
  { nameVi: 'Cá', nameEn: 'Fish', categoryKey: 'animal', type: 'vocabulary', sortOrder: 4, imagePath: 'lucide:Fish' },

  // Body Parts (Vocabulary)
  { nameVi: 'Mắt', nameEn: 'Eye', categoryKey: 'body', type: 'vocabulary', sortOrder: 1, imagePath: 'lucide:Eye' },
  { nameVi: 'Tai', nameEn: 'Ear', categoryKey: 'body', type: 'vocabulary', sortOrder: 2, imagePath: 'lucide:Ear' },
  { nameVi: 'Mũi', nameEn: 'Nose', categoryKey: 'body', type: 'vocabulary', sortOrder: 3, imagePath: 'lucide:Smile' },
  { nameVi: 'Miệng', nameEn: 'Mouth', categoryKey: 'body', type: 'vocabulary', sortOrder: 4, imagePath: 'lucide:Smile' },
  { nameVi: 'Tay', nameEn: 'Hand', categoryKey: 'body', type: 'vocabulary', sortOrder: 5, imagePath: 'lucide:Hand' },
  { nameVi: 'Chân', nameEn: 'Foot', categoryKey: 'body', type: 'vocabulary', sortOrder: 6, imagePath: 'lucide:Footprints' },

  // Clothing (Vocabulary)
  { nameVi: 'Áo', nameEn: 'Shirt', categoryKey: 'clothing', type: 'vocabulary', sortOrder: 1, imagePath: 'lucide:Shirt' },
  { nameVi: 'Quần', nameEn: 'Pants', categoryKey: 'clothing', type: 'vocabulary', sortOrder: 2, imagePath: 'lucide:Shirt' },

  // --- ACTIVITIES ---
  { nameVi: 'Đi vệ sinh', nameEn: 'Go to toilet', speechTextVi: 'Con muốn đi vệ sinh', speechTextEn: 'I want to go to toilet', categoryKey: 'activity', type: 'activity', sortOrder: 1, imagePath: 'lucide:Bath' },
  { nameVi: 'Đi ngủ', nameEn: 'Sleep', speechTextVi: 'Con buồn ngủ', speechTextEn: 'I am sleepy', categoryKey: 'activity', type: 'activity', sortOrder: 2, imagePath: 'lucide:Bed' },
  { nameVi: 'Đi dạo', nameEn: 'Walk', speechTextVi: 'Con muốn đi dạo', speechTextEn: 'I want to take a walk', categoryKey: 'activity', type: 'activity', sortOrder: 3, imagePath: 'lucide:Footprints' },
  { nameVi: 'Đi tắm', nameEn: 'Take a bath', speechTextVi: 'Con muốn đi tắm', speechTextEn: 'I want to take a bath', categoryKey: 'activity', type: 'activity', sortOrder: 4, imagePath: 'lucide:Droplets' },
  { nameVi: 'Rửa tay', nameEn: 'Wash hands', speechTextVi: 'Con muốn rửa tay', speechTextEn: 'I want to wash my hands', categoryKey: 'activity', type: 'activity', sortOrder: 5, imagePath: 'lucide:Hand' },
  { nameVi: 'Đánh răng', nameEn: 'Brush teeth', speechTextVi: 'Con muốn đánh răng', speechTextEn: 'I want to brush my teeth', categoryKey: 'activity', type: 'activity', sortOrder: 6, imagePath: 'lucide:Smile' },
  { nameVi: 'Về nhà', nameEn: 'Go home', speechTextVi: 'Con muốn về nhà', speechTextEn: 'I want to go home', categoryKey: 'activity', type: 'activity', sortOrder: 7, imagePath: 'lucide:Home' },
  { nameVi: 'Đi học', nameEn: 'Go to school', speechTextVi: 'Con muốn đi học', speechTextEn: 'I want to go to school', categoryKey: 'activity', type: 'activity', sortOrder: 8, imagePath: 'lucide:GraduationCap' },

  { nameVi: 'Ăn cơm', nameEn: 'Eat rice', speechTextVi: 'Con muốn ăn cơm', speechTextEn: 'I want to eat rice', categoryKey: 'act_eat', type: 'activity', sortOrder: 9, imagePath: 'lucide:Utensils' },
  { nameVi: 'Uống nước', nameEn: 'Drink water', speechTextVi: 'Con muốn uống nước', speechTextEn: 'I want to drink water', categoryKey: 'act_eat', type: 'activity', sortOrder: 10, imagePath: 'lucide:Droplet' },
  { nameVi: 'Ăn bánh', nameEn: 'Eat cake', speechTextVi: 'Con muốn ăn bánh', speechTextEn: 'I want to eat cake', categoryKey: 'act_eat', type: 'activity', sortOrder: 11, imagePath: 'lucide:Utensils' },
  { nameVi: 'Uống sữa', nameEn: 'Drink milk', speechTextVi: 'Con muốn uống sữa', speechTextEn: 'I want to drink milk', categoryKey: 'act_eat', type: 'activity', sortOrder: 12, imagePath: 'lucide:CupSoda' },

  { nameVi: 'Chơi đồ chơi', nameEn: 'Play toys', speechTextVi: 'Con muốn chơi đồ chơi', speechTextEn: 'I want to play toys', categoryKey: 'act_play', type: 'activity', sortOrder: 13, imagePath: 'lucide:Gamepad2' },
  { nameVi: 'Đọc sách', nameEn: 'Read', speechTextVi: 'Con muốn đọc sách', speechTextEn: 'I want to read a book', categoryKey: 'act_play', type: 'activity', sortOrder: 14, imagePath: 'lucide:Book' },
  { nameVi: 'Nghe nhạc', nameEn: 'Listen to music', speechTextVi: 'Con muốn nghe nhạc', speechTextEn: 'I want to listen to music', categoryKey: 'act_play', type: 'activity', sortOrder: 15, imagePath: 'lucide:Music' },
  { nameVi: 'Xem tivi', nameEn: 'Watch TV', speechTextVi: 'Con muốn xem tivi', speechTextEn: 'I want to watch TV', categoryKey: 'act_play', type: 'activity', sortOrder: 16, imagePath: 'lucide:Tv' },
  { nameVi: 'Vẽ tranh', nameEn: 'Draw', speechTextVi: 'Con muốn vẽ tranh', speechTextEn: 'I want to draw a picture', categoryKey: 'act_play', type: 'activity', sortOrder: 17, imagePath: 'lucide:PenTool' },
  { nameVi: 'Ôm mẹ', nameEn: 'Hug mom', speechTextVi: 'Con muốn ôm mẹ', speechTextEn: 'I want to hug mom', categoryKey: 'act_play', type: 'activity', sortOrder: 18, imagePath: 'lucide:Heart' },
];

export const SEED_DEFAULT_CHILD = { name: 'Bé' };

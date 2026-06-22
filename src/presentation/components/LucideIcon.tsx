/**
 * src/presentation/components/LucideIcon.tsx
 * Mục đích: Ánh xạ TÊN icon (chuỗi lưu trong DB) -> component Lucide.
 *           Dùng bảng tra cứu cố định (an toàn hơn import động) + icon dự phòng.
 * Dependency: lucide-react-native.
 */
import React from 'react';
import {
  Activity,
  Apple,
  Bath,
  Bed,
  Book,
  Car,
  CupSoda,
  Gamepad2,
  Hand,
  Heart,
  Home,
  Music,
  Moon,
  Phone,
  Shirt,
  Smile,
  Square,
  Star,
  Sun,
  Users,
  Utensils,
  Cat,
  Dog,
  Bird,
  Fish,
  Plane,
  TrainFront,
  Bus,
  Bike,
  Footprints,
  Eye,
  Ear,
  Frown,
  Angry,
  Laugh,
  ThumbsUp,
  ThumbsDown,
  Droplet,
  Cloud,
  Coffee,
  Pizza,
  Carrot,
  HelpCircle,
  Check,
  X,
  ArrowRight,
  MapPin,
  Leaf,
} from 'lucide-react-native';

const ICONS: Record<
  string,
  React.ComponentType<{size?: number; color?: string}>
> = {
  Activity, Apple, Bath, Bed, Book, Car, CupSoda, Gamepad2, Hand, Heart,
  Home, Music, Moon, Phone, Shirt, Smile, Star, Sun, Users, Utensils,
  Cat, Dog, Bird, Fish, Plane, TrainFront, Bus, Bike, Footprints, Eye, Ear,
  Frown, Angry, Laugh, ThumbsUp, ThumbsDown, Droplet, Cloud, Coffee, Pizza, Carrot,
  HelpCircle, Check, X, ArrowRight, MapPin, Leaf
};

/** Danh sách tên icon để người dùng chọn khi tạo danh mục. */
export const ICON_NAMES = Object.keys(ICONS);

interface Props {
  name: string;
  size?: number;
  color?: string;
}

export const LucideIcon: React.FC<Props> = ({name, size = 28, color}) => {
  const Cmp = ICONS[name] ?? Square;
  return <Cmp size={size} color={color} />;
};

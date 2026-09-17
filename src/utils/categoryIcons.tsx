import React from 'react';
import {
  Utensils,
  Car,
  HeartPulse,
  GraduationCap,
  Zap,
  Home,
  Film,
  ShoppingBag,
  Users,
  Receipt,
  Wallet,
  CircleDot,
  PiggyBank,
  CreditCard,
  Building2,
  DollarSign,
  Coffee,
  Fuel,
  Plane,
  Shield,
  Laptop,
  ArrowUpRight,
  ArrowDownLeft,
  Briefcase,
  Gift,
  HelpCircle,
} from 'lucide-react';

interface IconProps {
  name?: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<IconProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  const iconMap: Record<string, React.ReactElement> = {
    Utensils: <Utensils className={className} size={size} />,
    Car: <Car className={className} size={size} />,
    HeartPulse: <HeartPulse className={className} size={size} />,
    GraduationCap: <GraduationCap className={className} size={size} />,
    Zap: <Zap className={className} size={size} />,
    Home: <Home className={className} size={size} />,
    Film: <Film className={className} size={size} />,
    ShoppingBag: <ShoppingBag className={className} size={size} />,
    Users: <Users className={className} size={size} />,
    Receipt: <Receipt className={className} size={size} />,
    Wallet: <Wallet className={className} size={size} />,
    CircleDot: <CircleDot className={className} size={size} />,
    PiggyBank: <PiggyBank className={className} size={size} />,
    CreditCard: <CreditCard className={className} size={size} />,
    Building2: <Building2 className={className} size={size} />,
    DollarSign: <DollarSign className={className} size={size} />,
    Coffee: <Coffee className={className} size={size} />,
    Fuel: <Fuel className={className} size={size} />,
    Plane: <Plane className={className} size={size} />,
    Shield: <Shield className={className} size={size} />,
    Laptop: <Laptop className={className} size={size} />,
    ArrowUpRight: <ArrowUpRight className={className} size={size} />,
    ArrowDownLeft: <ArrowDownLeft className={className} size={size} />,
    Briefcase: <Briefcase className={className} size={size} />,
    Gift: <Gift className={className} size={size} />,
  };

  return iconMap[name || ''] || <HelpCircle className={className} size={size} />;
};

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  collectionType: string;
  functionType: string;
  gender: string;
  condition: 'new' | 'used';
  image: string;
  stock: number;
  warranty: boolean;
  colors: string[];
  origin: string;
  history: string;
  waterResistance: string;
  usageConditions: string;
  reviews: Review[];
}

export interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  email: string;
  role: 'user' | 'admin';
  token: string;
}

export interface CartItem extends Product {
  quantity: number;
}

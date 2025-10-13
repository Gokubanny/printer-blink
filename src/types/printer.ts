export interface Printer {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  isAvailable: boolean;
  createdAt: string;
  views?: number;
  category?: string;
  brand?: string;
  imagePublicId?: string;
}
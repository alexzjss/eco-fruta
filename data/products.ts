import { Product } from '../types';

export const products: Product[] = [
  { id: 'abacaxi', name: 'Abacaxi', category: 'frutas', price: 8, unit: 'unidade', imageUrl: '🍍', producerId: 'ana', stock: 12 },
  { id: 'maca', name: 'Maçã', category: 'frutas', price: 10, unit: 'kg', imageUrl: '🍎', producerId: 'ana', stock: 20 },
  { id: 'manga', name: 'Manga', category: 'frutas', price: 7, unit: 'kg', imageUrl: '🥭', producerId: 'ana', stock: 15 },
  { id: 'morango', name: 'Morango', category: 'frutas', price: 10, unit: '100g', imageUrl: '🍓', producerId: 'ana', stock: 30 },
  { id: 'cenoura', name: 'Cenoura', category: 'legumes', price: 6, unit: 'kg', imageUrl: '🥕', producerId: 'jose', stock: 25 },
  { id: 'tomate', name: 'Tomate', category: 'legumes', price: 9, unit: 'kg', imageUrl: '🍅', producerId: 'jose', stock: 22 },
  { id: 'abobora', name: 'Abóbora', category: 'legumes', price: 8, unit: 'kg', imageUrl: '🎃', producerId: 'jose', stock: 10 },
  { id: 'brocolis', name: 'Brócolis', category: 'verduras', price: 8, unit: 'unidade', imageUrl: '🥦', producerId: 'marilia', stock: 16 },
  { id: 'alface', name: 'Alface', category: 'verduras', price: 5, unit: 'unidade', imageUrl: '🥬', producerId: 'marilia', stock: 28 },
  { id: 'milho', name: 'Milho verde', category: 'verduras', price: 6, unit: 'unidade', imageUrl: '🌽', producerId: 'marilia', stock: 18 }
];

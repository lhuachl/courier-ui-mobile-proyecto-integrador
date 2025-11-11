import { mockProducts } from './mock-data';
import { Product } from './types';

export async function loadProducts(): Promise<Product[]> {
  return [...mockProducts];
}

export async function loadProductById(id: number): Promise<Product | null> {
  return mockProducts.find(p => p.id === id) || null;
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const newProduct: Product = {
    id: Math.max(...mockProducts.map(p => p.id)) + 1,
    ...product,
  };
  mockProducts.push(newProduct);
  return newProduct;
}


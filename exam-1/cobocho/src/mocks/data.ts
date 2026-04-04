import type { Product } from '@/domain/products/api/products.types';
import productsJson from '../../../shared/products.json';

export const products = productsJson as Product[];

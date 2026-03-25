import type { Product } from '../types/product';
import productsJson from '../../../shared/products.json';

export const products = productsJson as Product[];

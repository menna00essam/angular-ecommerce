import { Product } from '../models/product.model';

export function enrichProduct(product: Product): Product {
  const oldPrice = product.discountPercentage
    ? +(product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : undefined;

  const isNew = product.meta?.createdAt
    ? (new Date().getTime() - new Date(product.meta.createdAt).getTime()) / (1000 * 60 * 60 * 24) <= 7
    : false;

  return {
    ...product,
    oldPrice,
    isNew
  };
}

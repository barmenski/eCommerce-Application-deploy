import type { ActiveCart } from '../api/get-active-cart';

export function calculatePrice(data: ActiveCart): string {
  const price = data.totalPrice.centAmount;
  return (price / 100).toFixed(2);
}

export function calculateOldPrice(data: ActiveCart): string {
  const price = data.totalPrice.centAmount;
  const discountPrice = data?.discountOnTotalPrice?.discountedAmount.centAmount;
  if (discountPrice) return ((price + discountPrice) / 100).toFixed(2);
  return (price / 100).toFixed(2);
}

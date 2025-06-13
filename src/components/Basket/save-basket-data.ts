import type { CartItem } from '../../api/get-active-cart';
import { setLSData } from '../../utility/local-storage';

export default function saveBasketData(data: CartItem[], id: string): void {
  const array = [];
  for (const element of data) {
    array.push({
      id: element.id,
      quantity: element.quantity,
      name: element.name['en-US'],
      key: element.productKey,
      productId: element.productId,
    });
  }
  setLSData('active_cart', array);
  setLSData('active_cart_id', id);
}

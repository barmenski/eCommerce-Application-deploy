import { isKeyOfType } from '../../utility/key-of-type';
import { getLSData } from '../../utility/local-storage';

type CartList = {
  id: string;
  key: string;
  name: string;
  quantity: number;
};

export default function findItem(key: string, mode: 'id' | 'productId'): string {
  const cart = getLSData<CartList[]>('active_cart') || [];
  const target = cart.find((item) => item.key === key);
  if (target && isKeyOfType(target, mode)) {
    return target[mode];
  }
  return '';
}

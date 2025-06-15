import { useEffect, useRef, useState, type JSX } from 'react';
import './basket.css';
import BasketList from '../../components/Basket/basket-list';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getActiveCart } from '../../api/get-active-cart';
import saveBasketData from '../../components/Basket/save-basket-data';
import { removeCart } from '../../api/remove-cart';
import { Link } from 'react-router';
import SimpleModal from '../../ui/simple-modal/simple-modal';
import Discount from '../../components/Basket/discount';
import { calculateOldPrice, calculatePrice } from '../../utility/calculat-price';
import Feedback from '../../ui/feedback';

export default function Basket(): JSX.Element {
  const { data } = useQuery({
    queryKey: ['active-cart'],
    queryFn: getActiveCart,
  });
  const [isVisible, setIsVisible] = useState(false);
  const queryClient = useQueryClient();

  const dialogReference = useRef<HTMLDialogElement>(null);

  const items = data?.lineItems;
  const id = data?.id;
  const version = data?.version;

  useEffect(() => {
    if (items && id) {
      saveBasketData(items, id);
    }
  }, [data]);

  async function clearBasket(): Promise<void> {
    const remove = await removeCart(version || 1);
    if (remove instanceof Error) return;
    queryClient.invalidateQueries({ queryKey: ['active-cart'] });
  }

  function handleDialog(): void {
    if (!dialogReference) return;
    if (dialogReference.current?.hasAttribute('open')) {
      dialogReference?.current?.close();
    } else {
      dialogReference?.current?.showModal();
    }
  }

  return (
    <div className="basket-wrapper">
      {data && data.totalLineItemQuantity > 0 ? (
        <>
          <h2>Basket</h2>
          <button onClick={handleDialog} type="button" id="delete-basket">
            Clear Shopping Cart
          </button>

          <BasketList array={items ?? []} version={version || 1} />

          <Discount version={version || 1} setIsVisible={setIsVisible} />

          <div
            className={['total-price', data.discountOnTotalPrice && 'old-price'].join(' ')}
          >{`Price: ${calculateOldPrice(data)} USD`}</div>

          {data.discountOnTotalPrice && (
            <div className="total-price discounted-price">{`Total Price: ${calculatePrice(data)} USD`}</div>
          )}

          <Feedback
            message="Promocode Activated!"
            duration={2000}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
          />

          <SimpleModal
            message={'Are you sure?'}
            title={'Clear Shopping Cart'}
            dialogReference={dialogReference}
            callback={clearBasket}
          />
        </>
      ) : (
        <div className="no-basket-wrapper">
          <h1>You don't have any items in your cart.</h1>
          <img src="/img/evaporate-disappear.gif" alt="crying emoji" width={115} height={107} />
          <h2>
            Please visit our
            <Link className="redirect-to-login-link" to={'/catalog'}>
              Catalog
            </Link>
            <span> page.</span>
          </h2>
        </div>
      )}
    </div>
  );
}

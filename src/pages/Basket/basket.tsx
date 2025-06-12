import { useRef, type JSX } from 'react';
import './basket.css';
import BasketList from '../../components/Basket/basket-list';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getActiveCart } from '../../api/get-active-cart';
import saveBasketData from '../../components/Basket/save-basket-data';
import { removeCart } from '../../api/remove-cart';
import { Link } from 'react-router';
import SimpleModal from '../../ui/simple-modal/simple-modal';

export default function Basket(): JSX.Element {
  const { data, isError } = useQuery({
    queryKey: ['active-cart'],
    queryFn: getActiveCart,
    retry: false,
  });
  const queryClient = useQueryClient();

  const dialogReference = useRef<HTMLDialogElement>(null);

  if (isError) return <h1 className="no-cart">You don't have a cart. ☹</h1>;

  const items = data?.lineItems;
  const id = data?.id;
  const version = data?.version;

  if (items && id) {
    saveBasketData(items, id);
  }

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
          <div className="total-price">{`Total Price: ${data.totalPrice.centAmount / 100} USD`}</div>

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

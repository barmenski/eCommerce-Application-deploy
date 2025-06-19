import type { ReactNode } from 'react';
import './promos.css';

export default function Promos(): ReactNode {
  return (
    <div className="promo">
      <div>
        Get <span className="promo-bold">10% off</span> on any destination with the promo code:{' '}
        <span className="promo-bold">{`${'adventure'}`.toUpperCase()}</span>
      </div>
      <div>
        Are you a RSS Student? Get<span className="promo-bold"> 20% off</span> with the promo code:{' '}
        <span className="promo-bold">{`${'RSSchool'}`.toUpperCase()}</span>
      </div>
    </div>
  );
}

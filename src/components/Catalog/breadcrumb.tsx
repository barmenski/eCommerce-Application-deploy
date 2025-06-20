import React from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';

type BreadcrumbArray = {
  breadcrumb: string[];
  breadcrumbNavigation: (crumb: string) => void;
};
const Breadcrumb: React.FC<BreadcrumbArray> = ({
  breadcrumb,
  breadcrumbNavigation,
}): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="breadcrumb-wrapper">
      <ul className="breadcrumb-nav">
        {breadcrumb.map((step) => (
          <li
            key={step}
            onClick={() => {
              breadcrumbNavigation(step);
              navigate(`/catalog`);
            }}
          >
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumb;

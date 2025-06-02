import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Pagination } from 'swiper/modules';
import type { ReactNode } from 'react';
import '../../pages/ProductPage/product-page.css';
import type { PlanetImages } from '../../api/get-product';
import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function Slider(images: PlanetImages[]): ReactNode {
  const arrayImages = Object.values(images);

  const pagination = {
    clickable: true,
    renderBullet: function (_index: number, className: string): string {
      return '<span class="' + className + '">' + '</span>';
    },
  };

  const [imageIndex, setImageIndex] = useState(0);

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal(): void {
    setIsOpen(true);
  }

  function closeModal(): void {
    setIsOpen(false);
  }

  return (
    <>
      <Swiper effect={'fade'} watchOverflow={true} pagination={pagination} modules={[Pagination]}>
        {...arrayImages.map((image, index) => (
          <SwiperSlide
            key={index}
            onClick={() => {
              openModal();
              setImageIndex(index);
            }}
          >
            <div>
              <img src={image.url} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-swiper"
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.8)',
          },
        }}
      >
        <button onClick={closeModal} className="btn-close">
          ✖️
        </button>
        <Swiper
          effect={'fade'}
          watchOverflow={true}
          pagination={pagination}
          modules={[Pagination]}
          className="my-swiper"
          initialSlide={imageIndex}
        >
          {...arrayImages.map((image, index) => (
            <SwiperSlide key={index} className="zoom-image">
              <div>
                <img src={image.url} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Modal>
    </>
  );
}

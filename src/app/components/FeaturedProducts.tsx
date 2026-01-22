'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import Slider from 'react-slick';

// slick css larni albatta import qil
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';

const products = [
  { id: 1, name: 'Makita DHP482Z', price: '1,200,000', rating: 4.8, reviews: 124, image: '/images/products/drill.png', category: 'Asboblar' },
  { id: 2, name: 'Bosch GWS 9-115', price: '850,000', rating: 4.9, reviews: 89, image: '/images/products/grinder.png', category: 'Asboblar' },
  { id: 2, name: 'Bosch GWS 9-115', price: '850,000', rating: 4.9, reviews: 89, image: '/images/products/grinder.png', category: 'Asboblar' },
  { id: 3, name: 'Karcher WD 3', price: '1,500,000', rating: 4.7, reviews: 210, image: '/images/products/vacuum.png', category: 'Tozalash' },
  { id: 3, name: 'Karcher WD 3', price: '1,500,000', rating: 4.7, reviews: 210, image: '/images/products/vacuum.png', category: 'Tozalash' },
  { id: 4, name: 'Stanley FatMax', price: '450,000', rating: 4.6, reviews: 56, image: '/images/products/toolbox.png', category: 'Asboblar' },
  { id: 4, name: 'Stanley FatMax', price: '450,000', rating: 4.6, reviews: 56, image: '/images/products/toolbox.png', category: 'Asboblar' },
];

export default function FeaturedProducts() {
  const [adverts, SetAdverts] = useState([])
  const t = useTranslations();

  useEffect( () => {
    const response = axios.get('https://fixoo-backend.onrender.com/advert', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(data => SetAdverts(data.data));
    console.log(response)
  })
  console.log(adverts)

  const settings = {
    mobileFirst: true,
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2500,
    swipeToSlide: true,
    adaptiveHeight: true,

    slidesToShow: 4,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
    ],
  };



  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {t('landing.featured_products', { defaultMessage: 'Tavsiya etilgan mahsulotlar' })}
            </h2>
            <p className="text-gray-600">
              {t('landing.best_quality_tools', { defaultMessage: 'Eng sifatli qurilish mollari va asboblar' })}
            </p>
          </div>
        </div>

        {/* Slider */}
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product.id} className="px-3">
                <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">

                  <div className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-100">
                      <span className="text-xs">
                        {t(
                          `categories.${product.category === 'Asboblar' ? 'tools' : 'cleaning'}`,
                          { defaultMessage: product.category }
                        )}
                      </span>
                    </div>

                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                      <Heart size={18} />
                    </button>

                    <div className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      NEW
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-xs text-gray-500 mb-4">
                      {t(
                        `categories.${product.category === 'Asboblar' ? 'tools' : 'cleaning'}`,
                        { defaultMessage: product.category }
                      )}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-teal-600">
                        {product.price} so'm
                      </span>
                      <button className="p-2 rounded-xl bg-gray-100 text-gray-900 hover:bg-teal-600 hover:text-white transition-all duration-300">
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

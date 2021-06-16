import React, { FC, useState } from "react";
import { StarIcon } from "@heroicons/react/solid";
import Currency from "react-currency-formatter";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToBasket } from "@slices/basketSlice";
import { ProductType } from "@type/product";
import { MAX_RATING, MIN_RATING } from "@config/constants";

interface ProductProps {
  data: ProductType;
}

const Product: FC<ProductProps> = ({ data }) => {
  const dispatch = useDispatch();

  const [rating] = useState(
    Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING
  );

  const [hasPrime] = useState(Math.random() < 0.5);

  const { title, price, description, category, image } = data;

  const addItemToBasket = () => {
    try {
      dispatch(addToBasket({ product: data }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-10">
      <p className="absolute top-2 right-2 text-xs italic text-gray-400">
        {category}
      </p>

      <Image src={image} height={200} width={200} objectFit="contain" />

      <h4 className="my-3">{title}</h4>

      <div className="flex">
        {Array(rating)
          .fill(rating)
          .map((_, i) => (
            <StarIcon key={i} className="h-5 text-yellow-500" />
          ))}
      </div>

      <p className="text-xs my-2 line-clamp-2">{description}</p>

      <div className="mb-5">
        <Currency quantity={price} currency="PHP" />
      </div>

      {hasPrime && (
        <div className="flex items-center space-x-2 -mt-5">
          <img
            className="w-12"
            src="https://links.papareact.com/fdw"
            alt="hasPrime"
          />
          <p className="text-xs text-gray-500">Free Next-day Delivery</p>
        </div>
      )}

      <button onClick={addItemToBasket} className="mt-auto button">
        Add to basket
      </button>
    </div>
  );
};

export default Product;

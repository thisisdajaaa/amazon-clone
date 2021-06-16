import React, { FC, useState } from "react";
import Image from "next/image";
import Currency from "react-currency-formatter";
import { StarIcon } from "@heroicons/react/outline";
import { useDispatch } from "react-redux";
import { MIN_RATING, MAX_RATING } from "@config/constants";
import { addToBasket, removeFromBasket } from "@slices/basketSlice";
import { ProductType } from "@type/product";

interface CheckoutProductProps {
  data: ProductType;
  count: number;
}

const CheckoutProduct: FC<CheckoutProductProps> = ({ data }) => {
  const dispatch = useDispatch();

  const [rating] = useState(
    Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING
  );
  const [hasPrime] = useState(Math.random() < 0.5);

  const { title, price, id, description, image } = data;

  const addItemToBasket = () => {
    dispatch(addToBasket({ product: data }));
  };

  const removeItemToBasket = () => {
    dispatch(removeFromBasket(id));
  };

  return (
    <div className="grid grid-cols-5">
      <Image src={image} height={200} width={200} objectFit="contain" />

      <div className="col-span-3 mx-5">
        <p>{title}</p>
        <div className="flex">
          {Array(rating)
            .fill(rating)
            .map((_, i) => (
              <StarIcon key={i} className="h-5 text-yellow-500" />
            ))}
        </div>

        <p className="text-xs my-2 line-clamp-3">{description}</p>
        <Currency quantity={price} currency="PHP" />

        {hasPrime && (
          <div className="flex items-center space-x-2">
            <img
              loading="lazy"
              className="w-12"
              src="https://links.papareact.com/fdw"
              alt="hasPrime"
            />
            <p className="text-xs text-gray-500">Free Next-day Delivery</p>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-2 my-auto justify-self-end">
        <button className="button" onClick={addItemToBasket}>
          Add to Basket
        </button>
        <button className="button" onClick={removeItemToBasket}>
          Remove to Basket
        </button>
      </div>
    </div>
  );
};

export default CheckoutProduct;

import { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
import { RequestBodyType } from "@type/request-body";

const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { items, email }: RequestBodyType = req.body;

  const transformedItems = items.map(({ count, product }) => ({
    description: product.description,
    quantity: count,
    price_data: {
      currency: "php",
      unit_amount: product.price * 100,
      product_data: {
        name: product.title,
        images: [product.image],
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_rates: ["shr_1IwkDmAwsu5je0ZYWBfSqf2U"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "PH"],
    },
    line_items: transformedItems,
    mode: "payment",
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/checkout`,
    metadata: {
      email,
      images: JSON.stringify(items.map(({ product }) => product.image)),
    },
  });

  res.status(200).json({ id: session.id });
};

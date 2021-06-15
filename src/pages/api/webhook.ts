import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import * as admin from "firebase-admin";
import { OrderType } from "@type/order";

import serviceAccount from "../../../permissions.json";

// Secure a connection to FIREBASE from the backend
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    })
  : admin.app();

// Establish connection to Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fullfillOrder = async (session: Stripe.Checkout.Session) => {
  return app
    .firestore()
    .collection("users")
    .doc(session.metadata?.email as string)
    .collection("orders")
    .doc(session.id)
    .set({
      amount: (session.amount_total as number) / 100,
      amount_shipping: (session.total_details?.amount_shipping as number) / 100,
      images: JSON.parse(session.metadata?.images as string),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    } as OrderType)
    .then(() => {
      console.log(`SUCCESS: Order ${session.id} has been added to the DB`);
    });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const signature = req.headers["stripe-signature"];

    let event;

    // Verify that the EVENT posted came from stripe
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
      );
    } catch (error) {
      return res.status(400).send(`Webhook error: ${error.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Fulfill the order
      return fullfillOrder(session)
        .then(() => res.status(200))
        .catch((error) =>
          res.status(400).send(`Webhook Error: ${error.message}`)
        );
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

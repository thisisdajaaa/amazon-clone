import Stripe from "stripe";
import * as admin from "firebase-admin";

export type OrderType = {
  id?: string;
  amount: number;
  amountShipping?: number;
  images: string[];
  timestamp: admin.firestore.FieldValue | number;
  items?: Stripe.LineItem[];
};

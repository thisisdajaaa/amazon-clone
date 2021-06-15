import { ItemType } from "./item";

export type RequestBodyType = {
  items: ItemType[];
  email: string;
};

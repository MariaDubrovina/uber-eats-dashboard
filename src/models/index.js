// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Transports = {
  "DRIVING": "DRIVING",
  "BICYCLING": "BICYCLING"
};

const OrderStatus = {
  "NEW": "NEW",
  "COOKING": "COOKING",
  "READY_FOR_PICKUP": "READY_FOR_PICKUP",
  "PICKED_UP": "PICKED_UP",
  "COMPLETED": "COMPLETED",
  "ACCEPTED": "ACCEPTED",
  "DECLINED_BY_RESTAURANT": "DECLINED_BY_RESTAURANT"
};

const { Driver, Basket, BasketItem, Dish, OrderItem, Order, Restaurant, User } = initSchema(schema);

export {
  Driver,
  Basket,
  BasketItem,
  Dish,
  OrderItem,
  Order,
  Restaurant,
  User,
  Transports,
  OrderStatus
};
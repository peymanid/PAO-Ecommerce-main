'use client';
import { useSwrInstance } from '../swr/swrInit';
import { useEffect, useState } from 'react';
import { CartResponse } from '../types/responseTypes';
import { components } from '../types/api';
import { calculateDiscountedPrice } from '../helpers/utils';
import { arraysEqual } from '../helpers/debounce';
import { CartUpdate } from '../types/requestTypes';

const calculateTotalPrice = (
  price: number,
  discount: number,
  quantity: number
) => {
  const discounted = calculateDiscountedPrice(price, discount);
  return parseFloat(discounted) * quantity;
};

export const useCustomerCart = (id?: string) => {
  const { requests, queries } = useSwrInstance();
  const [cart, setCart] = useState<CartResponse>();
  const options = { refreshInterval: 1000 };
  const { data, isLoading, error, mutate } = queries.useGetCartByUserId({
    id,
    options,
  });

  const common = async (
    updatedList: components['schemas']['Products'][],
    total: number
  ) => {
    const cartData: CartUpdate = {
      id: data?.data.id,
      customerId: id,
      products: updatedList,
      total: total,
    };
    const res = await requests.useUpdateCartByCartId(cartData);
    mutate(await res);
  };

  const addCartItem = async (
    product: components['schemas']['Products'],
    quantity: number
  ) => {
    const updatedList: (components['schemas']['Products'] & {
      quantity: number;
    })[] = cart?.data?.products
      ? [
          ...cart?.data.products.map((i) => {
            return { ...i, quantity: i.quantity };
          }),
          { ...product, quantity: quantity },
        ]
      : [{ ...product, quantity: quantity }];

    const total =
      (data?.data.total ?? 0) +
      calculateTotalPrice(product.price, product.discount, quantity);
    common(updatedList, total);
  };

  const updateCartItem = async (
    product:
      | components['schemas']['Products']
      | (components['schemas']['Products'] & { quantity: number })[],
    quantity?: number
  ) => {
    let updatedList, total;
    if (!Array.isArray(product)) {
      updatedList = cart?.data.products.map((i) => {
        if (i.id === product.id) return { ...product, quantity: quantity };

        return { ...i, quantity: i.quantity };
      }) as (components['schemas']['Products'] & {
        quantity: number;
      })[];
    } else {
      updatedList = product as (components['schemas']['Products'] & {
        quantity: number;
      })[];
    }

    total = updatedList.reduce((a, b) => {
      return a + calculateTotalPrice(b.price, b.discount, b.quantity);
    }, 0);

    common(updatedList ?? [], total);
  };

  const removeCartItem = async (product: components['schemas']['Products']) => {
    const updatedList: (components['schemas']['Products'] & {
      quantity: number;
    })[] =
      cart?.data.products
        .filter((prod) => prod.id !== product.id)
        .map((i) => {
          return {
            ...i,
            quantity: i.quantity,
          };
        }) ?? [];

    const total =
      updatedList.reduce((a, b) => {
        return a + calculateTotalPrice(b.price, b.discount, b.quantity);
      }, 0) ?? 0;

    common(updatedList ?? [], total);
  };

  const emptyCart = async () => {
    mutate(undefined);
  };

  const existingCartHasData = cart && cart.data;

  useEffect(() => {
    const shouldUpdateCart =
      !isLoading &&
      data &&
      (!existingCartHasData ||
        !arraysEqual(data.data.products, cart.data.products));

    const isError = error && !isLoading && !data && true;

    if (isError) {
      setCart(undefined);
    } else if (shouldUpdateCart) {
      setCart(data);
    }
  }, [isLoading, data, cart, existingCartHasData, error]);

  return {
    cart: cart?.data,
    isLoading,
    error,
    updateCart: {
      addCartItem,
      removeCartItem,
      updateCartItem,
      emptyCart,
    },
  };
};

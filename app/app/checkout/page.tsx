'use client';
import { useCustomerCart } from '@/shared/hooks/cart';
import { selectAuthState } from '@/shared/redux/authSlice';
import {
  Button,
  Combobox,
  Flex,
  Group,
  PasswordInput,
  Radio,
  TextInput,
  useCombobox,
  Modal,
} from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import ComboboxWrapper from './combobox';
import { CartTable } from '../cart/components/children';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { useOrders } from '@/shared/hooks/order';
import { SkeletonContainer } from '../Components/SkeletonComp';
import { z } from 'zod';
import { UseFormReturnType, useForm, zodResolver } from '@mantine/form';

const checkoutSchema = z.object({
  information: z.object({
    first_name: z.string().min(4),
    last_name: z.string().min(4),
    postal: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    payment: z.enum(['Apple Pay', 'Google Pay', 'Credit/Debit Card']),
  }),
});
export type formSchema = z.infer<typeof checkoutSchema>;

const CountriesCitiesList = ({
  form,
}: {
  form: UseFormReturnType<formSchema>;
}) => {
  const countryCombo = useCombobox({
    onDropdownClose: () => countryCombo.resetSelectedOption(),
  });
  const cityCombo = useCombobox({
    onDropdownClose: () => cityCombo.resetSelectedOption(),
  });
  const { data: Countries, isLoading: loadingCountries } = useSWR(
    'https://countriesnow.space/api/v0.1/countries',
    (url) => axios.get(url)
  );
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [citySearch, setCitySearch] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<
    { country: string; cities: string[] }[]
  >([]);
  const filteredCountriesList = countryFilter?.map(
    (i: { country: string }) => i.country
  );
  const filteredCitiesList = countryFilter?.[0]?.cities
    ?.map((item: string) => item)
    .filter((i: string) =>
      citySearch.length > 0
        ? i.toLowerCase().includes(citySearch.toLowerCase())
        : i
    );

  const countriesOptions = filteredCountriesList?.map(
    (item: string, index: number) => (
      <Combobox.Option
        w={'97%'}
        value={item as unknown as string}
        key={index}
        data-cy={'test-countries-options-item'}
      >
        {item}
      </Combobox.Option>
    )
  );
  const citiesOptions = filteredCitiesList?.map(
    (city: string, index: number) => (
      <Combobox.Option
        w={'97%'}
        value={city}
        key={index}
        data-cy={'test-cities-options-item'}
      >
        {city}
      </Combobox.Option>
    )
  );

  useEffect(() => {
    const c = Countries?.data.data?.filter((i: { country: string }) =>
      i.country?.toLowerCase().includes(countrySearch.toLowerCase().trim())
    );
    setCountryFilter(c);
  }, [Countries, countrySearch]);

  return (
    <>
      <ComboboxWrapper
        form={form}
        search={countrySearch}
        setSearch={setCountrySearch}
        label="Country"
        comboState={countryCombo}
      >
        {countriesOptions}
      </ComboboxWrapper>

      <ComboboxWrapper
        form={form}
        search={citySearch}
        setSearch={setCitySearch}
        comboState={cityCombo}
        label="City"
      >
        {citiesOptions}
      </ComboboxWrapper>
    </>
  );
};

const Payment = ({ form }: { form: UseFormReturnType<formSchema> }) => {
  return (
    <>
      <h1 className="text-[17px] border-b border-gray-500 m-0">
        Payment Method *
      </h1>
      <div>
        <Radio.Group
          {...form.getInputProps('information.payment')}
          name="payment"
          color="lime.4"
          withAsterisk
        >
          <Group mt="xs">
            <Radio
              value="Google Pay"
              label="Google Pay"
              color="var(--testColor)"
            />
            <Radio
              value="Apple Pay"
              label="Apple Pay"
              color="var(--testColor)"
            />
            <Radio
              value="Credit/Debit Card"
              label="Credit/Debit Card"
              color="var(--testColor)"
            />
          </Group>
        </Radio.Group>
        {form.values.information.payment === 'Credit/Debit Card' ? (
          <div className="w-[50%]">
            <TextInput
              label="Card Number"
              m={10}
              placeholder="XXXX XXXX XXXX XXXX"
              styles={{
                input: {
                  boxShadow: '20px 20px 48px #bebebe, -20px -20px 48px #ffffff',
                  border: '.1px solid var(--testColor)',
                },
                label: {
                  position: 'relative',
                  zIndex: 1,
                },
              }}
            />
            <Flex>
              <TextInput
                styles={{
                  input: {
                    boxShadow:
                      '20px 20px 48px #bebebe, -20px -20px 48px #ffffff',
                    border: '.1px solid var(--testColor)',
                  },
                  label: {
                    position: 'relative',
                    zIndex: 1,
                  },
                }}
                label="Exipration Date"
                description={<span className="relative z-[1]">(MM/YY)</span>}
                w={300}
                m={10}
              />
              <PasswordInput
                styles={{
                  input: {
                    boxShadow:
                      '20px 20px 48px #bebebe, -20px -20px 48px #ffffff',
                    border: '.1px solid var(--testColor)',
                  },
                  label: {
                    position: 'relative',
                    zIndex: 1,
                  },
                }}
                label="CVV/CVC"
                description={<span className="relative z-[1]">(MM/YY)</span>}
                w={300}
                m={10}
              />
            </Flex>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

const CheckoutInformation = ({
  form,
}: {
  form: UseFormReturnType<formSchema>;
}) => {
  return (
    <div>
      <div className="py-5">
        <div>
          <Flex h={'80px'}>
            <TextInput
              label="First Name *"
              w={300}
              m={10}
              {...form.getInputProps('information.first_name')}
              styles={{
                input: {
                  border: '.1px solid var(--testColor)',
                  boxShadow: '20px 20px 48px #bebebe,-20px -20px 48px #ffffff',
                },
                label: {
                  position: 'relative',
                  zIndex: 1,
                },
              }}
              data-cy="test-first-name-input"
            />
            <TextInput
              {...form.getInputProps('information.last_name')}
              styles={{
                input: {
                  border: '.1px solid var(--testColor)',
                  boxShadow: '20px 20px 48px #bebebe,-20px -20px 48px #ffffff',
                },
                label: {
                  position: 'relative',
                  zIndex: 1,
                },
              }}
              data-cy="test-last-name-input"
              label="Last Name *"
              w={300}
              m={10}
            />
          </Flex>
          <h1 className="text-[17px] border-b border-gray-500">Address</h1>
          <Flex wrap={'wrap'}>
            <CountriesCitiesList form={form} />
            <TextInput
              {...form.getInputProps(`information.postal`)}
              styles={{
                input: {
                  border: '.1px solid var(--testColor)',
                  boxShadow: '20px 20px 48px #bebebe,-20px -20px 48px #ffffff',
                },
                label: {
                  position: 'relative',
                  zIndex: 1,
                },
              }}
              label="Postal Code"
              w={300}
              m={10}
            />
          </Flex>
        </div>
      </div>
      <div>
        <Payment form={form} />
      </div>
    </div>
  );
};

const Billing = ({ form }: { form: UseFormReturnType<formSchema> }) => {
  return (
    <div>
      <Flex>
        <TextInput
          label="First Name"
          w={150}
          m={10}
          radius={0}
          styles={{
            input: {
              padding: 0,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid white ',
              cursor: 'default',
            },
            label: {
              position: 'relative',
              zIndex: 1,
            },
          }}
          value={form.values.information.first_name}
          disabled
        />
        <TextInput
          label="Last Name"
          styles={{
            input: {
              padding: 0,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid white ',
              cursor: 'default',
            },
            label: {
              position: 'relative',
              zIndex: 1,
            },
          }}
          value={form.values.information.last_name}
          radius={0}
          w={150}
          m={10}
          disabled
        />
      </Flex>
      <Flex wrap={'wrap'}>
        <TextInput
          label="Country"
          styles={{
            input: {
              padding: 0,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid white ',
              cursor: 'default',
            },
            label: {
              position: 'relative',
              zIndex: 1,
            },
          }}
          value={form.values.information.country}
          radius={0}
          w={150}
          m={10}
          disabled
        />
        <TextInput
          label="City"
          styles={{
            input: {
              padding: 0,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid white ',
              cursor: 'default',
            },
            label: {
              position: 'relative',
              zIndex: 1,
            },
          }}
          value={form.values.information.city}
          radius={0}
          w={150}
          m={10}
          disabled
        />
        <TextInput
          label="Postal Code"
          styles={{
            input: {
              padding: 0,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid white ',
              cursor: 'default',
            },
            label: {
              position: 'relative',
              zIndex: 1,
            },
          }}
          value={form.values.information.postal}
          radius={0}
          w={300}
          m={10}
          disabled
        />
      </Flex>
      <Flex>
        <TextInput
          label="Payment"
          styles={{
            input: {
              padding: 0,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid white ',
              cursor: 'default',
            },
            label: {
              position: 'relative',
              zIndex: 1,
            },
          }}
          value={form.values.information.payment}
          radius={0}
          w={300}
          m={10}
          disabled
        />
      </Flex>
    </div>
  );
};

const Checkout = () => {
  const user = useSelector(selectAuthState);
  
  const { cart, isLoading } = useCustomerCart(user?.data.user?.id);
  const { updateOrder } = useOrders({
    cartId: cart?.id,
    customerId: user?.data.user?.id,
  });
  const form = useForm<formSchema>({
    validateInputOnChange: true,
    validate: zodResolver(checkoutSchema),
    initialValues: {
      information: {
        first_name: '',
        last_name: '',
        postal: '',
        country: '',
        city: '',
        payment: 'Credit/Debit Card',
      },
    },
  });

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="w-full h-full flex justify-center p-5">
      {!cart || isLoading ? (
        <Flex w={'100%'} h={'100%'}>
          <SkeletonContainer repeat={1} w={600} h={600} mr={50} />
          <SkeletonContainer repeat={1} w={400} h={600} ml={50} />
        </Flex>
      ) : (
        <>
          <div className="flex w-full">
            <div className="payment-details w-[50%] p-5">
              <div>
                <h1 className="text-[25px] border-b-[0.8px] border-gray-800">
                  Checkout
                </h1>
              </div>
              <CheckoutInformation form={form} />
            </div>
            <div className="w-[30%] p-5 text-white">
              <div className="bg-[var(--testColor)]">
                <div className="px-5 pt-1">
                  <h1 className="text-white">Invoice</h1>
                  <Billing form={form} />
                </div>
                <div
                  className="checkout  sticky top-[var(--nav-height)] h-fit p-5"
                  data-cy="test-checkout"
                >
                  <div className="w-full">
                    <div className="w-full flex justify-between items-end">
                      <p className=" text-[18px] my-0 flex items-center uppercase">
                        Total Items
                        <span
                          className={'ml-1 text-white'}
                          data-cy="test-selected-items"
                        >
                          ({cart?.products?.length})
                        </span>
                      </p>
                      <p
                        className="text-xs cursor-pointer underline"
                        onClick={open}
                      >
                        Check out list
                      </p>
                    </div>
                    <div className="flex">
                      <p>Total:</p>
                      <p className="ml-1" data-cy="test-total">
                        ${cart?.total}
                      </p>
                    </div>
                    <Button
                      w={'100%'}
                      className="!bg-white !text-[var(--testColor)]"
                      data-cy="test-checkout-btn"
                      onClick={() => {
                        if (!form.validate().hasErrors) {
                          updateOrder(cart.id, user?.data.user?.id);
                        }
                      }}
                    >
                      Pay
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Modal opened={opened} onClose={close} size={'100%'}>
              <CartTable
                data={cart}
                // setData={setCartData}
                updateEnabled={false}
              />
              <Flex justify={'end'} mt={5}>
                <Link href="/cart">
                  <Button className="" color="var(--testColor)">
                    Update List
                  </Button>
                </Link>
              </Flex>
            </Modal>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;

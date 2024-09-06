'use client';
import Small from '@/app/Components/Product-type/small-product';
import { useProducts } from '@/shared/hooks/products';
import { SkeletonContainer } from '@/app/Components/SkeletonComp';
import { IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';
import Link from 'next/link';
import FilterWrapper from '@/app/Components/FilterWrapper';

const Category = ({ params }: { params: { category: string } }) => {
  const [filterByType, setFilterByType] = useState<string[]>([]);
  const [filterByPrice, setFilterByPrice] = useState<string>('');

  const filter = () => {};

  const parameters = {
    category: params.category,
    filterOptions: {
      type: filterByType,
      price: filterByPrice,
    },
  };
  const { data, productsIsLoading, productsError } = useProducts({
    category: params.category,
  });

  return (
    <div className="main-wrapper">
      {params && (
        <div className="flex items-end h-[25px]" data-cy="test-category-title">
          <h2 className="m-0 h-[25px] text-[var(--testColor)]">
            <Link href="/">HOME</Link>
          </h2>
          <div className="h-[23px]">
            <IconChevronRight />
          </div>
          <h2 className="m-0 uppercase h-[25px] cursor-pointer">
            {params.category}
          </h2>
        </div>
      )}
      <div className="flex flex-wrap justify-between relative pt-5">
        <div className="small-products-container">
          {(!data && productsIsLoading) || productsError ? (
            <SkeletonContainer
              w={'calc(100%/5 - 10px)'}
              h={500}
              repeat={10}
              mr={5}
              ml={5}
              mb={5}
              mt={5}
              wrap={true}
            />
          ) : !data ? (
            <p>No products to display.</p>
          ) : (
            // <FilterWrapper
            //   type={parameters.category}
            //   filterByPriceFn={{ filterByPrice, setFilterByPrice }}
            //   filterByTypeFn={{ filterByType, setFilterByType }}
            // >
            //   {
            //   }
            // </FilterWrapper>
            data.data.map((product, index) => (
              <Small id={product.id} key={index} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;

import kid1 from '@/public/images/third/kid_2.jpg';
import kid2 from '@/public/images/third/kid_1.jpg';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@mantine/core';

const ThirdSection = () => {
  return (
    <div className="w-full h-full flex justify-center relative">
      <span className="w-[75%] h-[1px] absolute bg-white"></span>
      <div className="w-[50%] h-full relative">
        <figure className="absolute w-[40%] h-[55%] top-20 left-16">
          <Image sizes="100%" className="" src={kid2} alt="kid" fill />
        </figure>
        <figure className="absolute w-[45%] h-[55%] bottom-20 right-20 border-[var(--testColor)] border-[10px]">
          <Image sizes="100%" className="" src={kid1} alt="kid" fill />
        </figure>
      </div>
      <div className="w-[35%] h-full flex flex-col justify-center">
        <h1 className="absolute uppercase text-white text-[60px] w-[620px] top-10 left-[35%] text-center">
          Meet a dreamy kids collection
        </h1>
        <h1 className="text-[40px] uppercase text-white">more to explore</h1>
        <p className="text-[20px] uppercase text-white">
          Discover our seasonal collection
        </p>
        <Link href={'/category/kids'} className="mt-5">
          <Button
            className="shop-now-btn !text-[var(--textColor)]"
            radius={2}
            variant="white"
          >
            Discover
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ThirdSection;

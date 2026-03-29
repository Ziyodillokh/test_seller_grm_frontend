// components/CustomSwiper.tsx
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import 'swiper/css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import 'swiper/css/navigation';

import { format, getMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useEffect, useRef, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Button } from '@/components/ui/button';

import { ReportData } from '../type';
// MonthlyReports:()=> <BossKassaReport/>,
// MonthlyReportsKassa:()=> <BossKassa/>,
// MonthlyReportsKassaSingle:()=> <BossSales/>,
const CustomSwiper = ({ data }: { data: ReportData[] }) => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const [activeIndex, setActiveIndex] = useQueryState("activeIndex", parseAsInteger.withDefault(getMonth(new Date())));
  const [select, setSelect] = useQueryState(
    "select",
    parseAsString.withDefault("Products")
  );
  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    if (prevRef.current && nextRef.current) {
      setNavReady(true);
    }
  }, [prevRef.current, nextRef.current]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Button
        ref={prevRef}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#F9F7F5] active:bg-[#d8d6d5] z-100 rounded-full text-primary"
      >
        <ChevronLeft />
      </Button>
      <Button
        ref={nextRef}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#F9F7F5] active:bg-[#d8d6d5] z-100 rounded-full text-primary"
      >
        <ChevronRight />
      </Button>

      {navReady && (
        <Swiper
          className="w-[80%]"
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          initialSlide={activeIndex}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            if (typeof swiper.params.navigation !== 'boolean' && swiper.params.navigation) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            if(select=="MonthlyReportsKassa" || select=="MonthlyReportsKassaSingle" ){
              setSelect("MonthlyReports")
            }
          }}
        >
          {data?.slice()?.reverse()?.map((item, index) => (
            <SwiperSlide className="w-[80%]" key={index}>
              <div className="text-center p-4">
                <p className="bg-transparent px-6 inline-block z-100 py-2.5 text-[12px] font-semibold border border-border/40 rounded-[50px]">
                  {format(new Date(2025, item?.month - 1), 'LLLL')}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default CustomSwiper;

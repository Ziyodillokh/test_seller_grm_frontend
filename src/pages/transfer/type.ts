export interface ProductsData {
  id: string;
  x: number;
  date: string;
  isMetric: boolean;
  productCount?: number;
  product: {
    isInternetShop: boolean;
    id: string;
    code: string | null;
    count: number;
    booking_count: number;
    date: string;
    updated_at: string;
    price: number;
    secondPrice: number;
    priceMeter: number;
    comingPrice: number;
    draft_priceMeter: number;
    draft_comingPrice: number;
    x: number | null;
    y: number;
    totalSize: number | null;
    check_count: number;
    is_deleted: boolean;
    partiya_title: string;
    bar_code: {
      isMetric: boolean;
      id: string;
      code: string;
      imgUrl: {
        id: string;
        path: string | null;
      };
      otherImgs: string[] | null;
      internetInfo:   null;
      is_active: boolean;
      is_accepted: boolean;
      date: string;
      model: {
        id: string;
        title: string;
      };
      collection: {
        id: string;
        title: string;
        collection_prices: [
          {
            priceMeter: number;
          },
        ];
      };
      color: {
        id: string;
        title: string;
      };
      size: {
        id: string;
        title: string;
      };
      shape: {
        id: string;
        title: string;
      };
    };
  };
}

export interface ProductsQuery {
  search?: string;
  limit?: number;
  page?: number;
  filialId?: string;
  is_transfer: boolean;
}

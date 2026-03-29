export type ProductsData = {
  check_count: number;
  title?:string;
  product: {
    bar_code: {
      isMetric: boolean;
      id: string;
      code: string;
      imgUrl: {
        id: string;
        path: string | null;
      };
      otherImgs: string[] | null;
      internetInfo: string | null;
      is_active: boolean;
      date: string;
      model: {
        id: string;
        title: string;
      };
      color: {
        id: string;
        title: string;
        code: string;
      };
      collection: {
        id: string;
        title: string;
        collection_prices: [{ priceMeter: number }];
      };
      size: {
        id: string;
        title: string;
        x?: number;
        y?: number;
        kv?: number;
      };
      shape: {
        id: string;
        title: string;
        meter: boolean;
      };
      style: {
        id: string;
        title: string;
      };
      country: {
        id: string;
        title: string;
      };
    };
    book_count: number;
    booking_count: number;
    price: number;
    priceMeter: number;
    x: number;
    y: number;
  };
  id: string;
  code: string;
  book_count: number;
  booking_count: number;
  bar_code: {
    isMetric: boolean;
    id: string;
    code: string;
    imgUrl: {
      id: string;
      path: string | null;
    };
    otherImgs: string[] | null;
    internetInfo: string | null;
    is_active: boolean;
    date: string;
    model: {
      id: string;
      title: string;
    };
    color: {
      id: string;
      title: string;
      code: string;
    };
    collection: {
      id: string;
      title: string;
      collection_prices: [{ priceMeter: number }];
    };
    size: {
      id: string;
      title: string;
      x: number | null;
      y: number | null;
      kv: number | null;
    };
    shape: {
      id: string;
      title: string;
      meter: boolean;
    };
    style: {
      id: string;
      title: string;
    };
    country: {
      id: string;
      title: string;
    };
  };
  model: {
    id: string;
    title: string;
    collection: {
      id: string;
      title: string;
    };
  };
  y: number;
  size: string;
  count: number;
  shape: string;
  priceMeter: number;
  style: string;
  color: {
    id: string;
    title: string;
    code: string;
  };
  price: string;
  isMetric: boolean;
  x: number;
};

export type ProductsQuery = {
  search?: string | undefined;
  limit?: number;
  page?: number;
  filialId?: string;
};

export type FilelsQuery = {
  search?: string | undefined;
  limit?: number;
  page?: number;
  // filialId:string;
};
type Seller = {
  id: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  fatherName: string;
  login: string;
  hired: string; // ISO date string
  from: string; // e.g. "09:00:00"
  to: string;
  username: string | null;
  salary: number;
  email: string | null;
  phone: string;
  password: string;
  isUpdated: boolean;
  createdAt: string;
};

export type BronModalType={
   id: string;
x: number;
date: string; // ISO date string
is_transfer: boolean;
isMetric: boolean;
seller: Seller;
}
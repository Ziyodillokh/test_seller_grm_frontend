export type ProductsData = {
  id: string;
  code: string;
  check_count: number;
  partiya_title:string;
  partiya:{
    title:string;
    factory:{
      id:string;
      title:string;
    }
    partiya_no:{
      title:string;
    }
  }
  bar_code: {
    isMetric: boolean;
    id: string;
    code: string;
    imgUrl: {
      id:string;
      path: string | null;
    };
    otherImgs: string[] | null;
    internetInfo: string | null;
    is_active: boolean;
    date: string;
    partiya_title: string;
    factory: {
      id: string;
      title: string;
    };
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
      collection_prices: [
        {
          priceMeter: number;
        },
      ];
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
};

export type ProductsQuery = {
  search: string | undefined;
  limit: number;
  page: number;
  filialId: string;
};

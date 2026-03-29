export type ProductsData = {
  id: string;
  code: string;
  product: {
    bar_code: {
      isMetric: boolean;
      id: string;
      code: string;
      imgUrl: { path: string | null };
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

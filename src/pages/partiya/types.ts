export interface  TData  {
  id: string;
  expense: number;
  volume: number;
  expensePerKv: number;
  date: string; // ISO date string
  check: boolean;
  finished: boolean;
  partiya_status: string;
  factory: {
    id: string;
    title: string;
  };
  partiya_no: {
    id: string;
    title: string;
  };
  country: {
    id: string;
    title: string;
  };
  warehouse: {
    id: string;
    title: string;
    given: number;
    owed: number;
    name: string;
    telegram: string;
    address: string;
    startWorkTime: string;
    endWorkTime: string;
    test: boolean;
    isDeleted: boolean;
    addressLink: string;
    landmark: string;
    phone1: string;
    phone2: string | null;
    isActive: boolean;
    hickCompleted: boolean;
    need_get_report: boolean;
    type: string;
  };
};
export interface TReportData {
  total: number;
  expence: number;
  volume: number;
  count: number;
}


export interface TOneData {
  isMetric: boolean;
  id: string;
  code: string;
  imgUrl: string | null;
  otherImgs: string[] | null;
  internetInfo: string | null;
  is_active: boolean;
  date: string;
  expense: number;
  count: number;
  y: number;
  title: string;
  kv: number;
  displayPrice: number;
  collectionPrice: {
    id: string;
    date: string;
    type: string;
    priceMeter: number;
    comingPrice: number;
    secondPrice: number;
    collectionId: string;
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
  factory: {
    id: string;
    title: string;
  };
  bar_code: {
    isMetric: boolean;
    id: string;
    code: string;
    imgUrl: string | null;
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
  collection_price: {
    id: string;
    secondPrice: number;
    priceMeter: number;
    comingPrice: number;
    collection: {
      id: string;
      title: string;
    };
    date: string;
  };
  check_count: number;
  partiya: {
    id: string;
    title: string;
  };
  commingPrice: number;
  expence: string;
  partiya_title: string;
  filial: {
    id: string;
    title: string;
  };
}
    export type TQuery = {
      search?: string | undefined;
      limit?:number,
      page?:number
      type?:string;
      filialId?:string
      partiyaId?:string
      tip?:string
      warehouse?:string;
    };
    
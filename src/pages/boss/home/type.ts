enum OrderEnum {
  Progress = "progress",
  Accept = "accepted",
  Reject = "rejected",
  Return = "returned",
}
export type CashFlowsData = {
  id: string;
  price: number;
  type: string; // e.g., "Приход"
  tip: string; // e.g., "order"
  comment: string;
  title: string;
  date: string;
  is_online: boolean;
  is_cancelled: boolean;
  partiya: {
    title: string;
  };
  casher: {
    id: string;
    isActive: boolean;
    firstName: string;
    lastName: string;
    fatherName: string;
    login: string;
    hired: string;
    from: string;
    to: string;
    username: string | null;
    salary: number;
    email: string | null;
    phone: string;
    password: string;
    isUpdated: boolean;
    createdAt: string;
    avatar: {
      id: string;
      path: string;
      model: string;
      mimetype: string;
      size: number;
      name: string;
      created_at: string;
    };
  };
  cashflow_type: {
    id: string;
    title: string;
    slug: string;
    type: string;
    is_visible: boolean;
  };
  filial: {
    id: string;
    title: string;
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
  order: {
    id: string;
    status: OrderEnum;
    comment: string | null;
    price: number;
    x: number;
    kv: number;
    date: string;
    additionalProfitSum: number;
    netProfitSum: number;
    discountSum: number;
    discountPercentage: string;
    tip: string;
    plasticSum: number;

    seller: {
      id: string;
      isActive: boolean;
      firstName: string;
      lastName: string;
      fatherName: string;
      login: string;
      hired: string;
      from: string;
      to: string;
      username: string | null;
      salary: number;
      email: string | null;
      phone: string;
      password: string;
      isUpdated: boolean;
      createdAt: string;
      avatar: {
        id: string;
        path: string;
        model: string;
        mimetype: string;
        size: number;
        name: string;
        created_at: string;
      };
    };
    bar_code: {
      isMetric: boolean;
      id: string;
      code: string;
      imgUrl: string | null;
      otherImgs: string | null;
      internetInfo: string | null;
      is_active: boolean;
      is_accepted: boolean;
      date: string;
      country: {
        title: string;
      };
      shape: {
        title: string;
      };
      color: {
        title: string;
      };
      style: {
        title: string;
      };
      collection: {
        id: string;
        title: string;
        secondPrice: number;
        priceMeter: number;
        comingPrice: number;
      };
      size: {
        id: string;
        title: string;
        x: number;
        y: number;
        kv: number;
      };
      model: {
        id: string;
        title: string;
      };
    };
  };
};
export type Filial = {
  id: string;
  title: string;
  name: string;
  telegram: string | null;
  address: string;
  startWorkTime: string; // e.g. "09:00"
  endWorkTime: string; // e.g. "20:00"
  test: boolean;
  isDeleted: boolean;
  addressLink: string | null;
  landmark: string | null;
  phone1: string; // "+998901760008"
  phone2: string | null;
  isActive: boolean;
  hickCompleted: boolean;
  need_get_report: boolean;
  type: "filial"; // add more literals if needed
};
export type KassaData = {
  id: string;
  startDate: string; // ISO‑8601 date string
  endDate: string | null;
  isActive: boolean;

  totalSellCount: number;
  totalSum: number;
  additionalProfitTotalSum: number;
  netProfitTotalSum: number;
  totalSize: number;
  plasticSum: number;
  internetShopSum: number;
  sale: number;
  return_sale: number;
  cash_collection: number;
  discount: number;
  income: number;
  expense: number;

  status: string;
  is_cancelled: boolean;

  filial: Filial;
  closer: {
    id: string;
    isActive: boolean;
    firstName: string;
    lastName: string;
    fatherName: string;
    login: string;
    hired: string;
    from: string;
    to: string;
    username: string | null;
    salary: number;
    email: string | null;
    phone: string;
    password: string;
    isUpdated: boolean;
    createdAt: string;
    avatar: {
      id: string;
      path: string;
      model: string;
      mimetype: string;
      size: number;
      name: string;
      created_at: string;
    };
  };

  closer_m: {
    id: string;
    isActive: boolean;
    firstName: string;
    lastName: string;
    fatherName: string;
    login: string;
    hired: string;
    from: string;
    to: string;
    username: string | null;
    salary: number;
    email: string | null;
    phone: string;
    password: string;
    isUpdated: boolean;
    createdAt: string;
    avatar: {
      id: string;
      path: string;
      model: string;
      mimetype: string;
      size: number;
      name: string;
      created_at: string;
    };
  };
};
export type ReportData = {
  id: string;
  year: number;
  month: number;
  totalSellCount: number;
  additionalProfitTotalSum: number;
  netProfitTotalSum: number;
  totalSize: number;
  totalPlasticSum: number;
  totalInternetShopSum: number;
  totalSale: number;
  totalSaleReturn: number;
  totalCashCollection: number;
  totalDiscount: number;
  totalIncome: number;
  totalExpense: number;
  totalSum: number;
  is_cancelled: boolean;
  status: string; // adjust if more statuses exist
  createdAt: string; // or Date, depending on usage
  updatedAt: string; // or Date
  reportStatus: number;
};

export type RemainingProductsCollection = {
  data: {
    country: {
      id: string;
      title: string;
    };
    id: string;
    totalCount: number;
    totalKv: number;
    totalPrice: number;
    totalSellCount: number;
    totalSellKv: number;
    totalSellPrice: number;
    totalNetProfitPrice?: number;
  }[];
  meta: metaType;
};

export type RemainingProductsFilial = {
  id: string;
  title: string;
  name: string;
  telegram: string;
  address: string;
  startWorkTime: string; // e.g. "08:00"
  endWorkTime: string; // e.g. "18:00"
  test: boolean;
  isDeleted: boolean;
  addressLink: string;
  landmark: string;
  phone1: string; // e.g. "+998900000000"
  phone2: string; // e.g. "+998 99 352 17 67"
  isActive: boolean;
  hickCompleted: boolean;
  need_get_report: boolean;
  type: "filial"; // enum could be used if there are other types
  remainingSize: number;
  remainingSum: number;
  count: number;
};
export type KassaReportData = {
  id: string;
  year: number;
  month: number;
  totalSellCount: number;
  additionalProfitTotalSum: number;
  netProfitTotalSum: number;
  totalSize: number;
  totalPlasticSum: number;
  totalInternetShopSum: number;
  totalSale: number;
  totalSaleReturn: number;
  totalCashCollection: number;
  totalDiscount: number;
  totalIncome: number;
  totalExpense: number;
  totalSum: number;
  status: "open" | "closed" | string; // Add more if needed
  is_cancelled: boolean;
  filialType: "filial"; // Add more if needed
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  kassaReportStatus: number;
  filial: Filial;
};

export type CollectionRemainingFactory = {
  data: {
    collection: {
      id: string;
      title: string;
    };
    factory: {
      id: string;
      title: string;
    };
    totalCount: number;
    totalKv: number;
    totalPrice: number;
    totalSellCount: number;
    totalSellKv: number;
    totalSellPrice: number;
    totalNetProfitPrice?: number;
  }[];
  meta: metaType;
};

export type BranchPlan = {
  filialId: string;
  filialTitle: string;
  plan_price: number;
  earn: number;
}

export type SellerPlan = {
  id: string;
  isActive: true;
  firstName: string;
  lastName: string;
  fatherName: string;
  login: string;
  hired: string;
  from: string;
  to: string;
  username: string;
  salary: number;
  email: string;
  phone: string;
  password: string;
  isUpdated: boolean;
  createdAt: string;
  avatar: { path: string | null };
  position: {
    id: string;
    title: string;
    is_active: boolean;
    role: number;
  };
  filial: {
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
    phone2: null;
    isActive: boolean;
    hickCompleted: boolean;
    need_get_report: boolean;
    type: string;
  };
  planYear: {
    id: string;
    year: 2025;
    yearlyGoal: 156250;
    collectedAmount: 0;
    day: 191;
    type: string;
    status: 0;
  }[];
};

export type UserManagersAccountants = {
  id: string;
  isActive: true;
  firstName: string;
  lastName: string;
  fatherName: string;
  login: string;
  hired: string;
  from: string;
  to: string;
  username: null;
  salary: null;
  email: null;
  phone: string;
  password: string;
  isUpdated: true;
  createdAt: string;
  position: {
    id: string;
    title: string;
    is_active: true;
    role: number;
  };
  filial: null;
  avatar: {
    id: string;
    path: string;
    model: string;
    mimetype: string;
    size: number;
    name: string;
    created_at: string;
  };
};
export type CashFlowsQuery = {
  search?: string | undefined;
  limit?: number;
  page?: number;
  tip?: string;
  filialId?: string;
  casherId?: string;
  sellerId?: string;
  month?: number;
  filial?: string;
  filter?: string;
  model?: string;
  country?: string;
  factory?: string;
  kassaReport?: string;
  collectionId?: string;
  year?: number;
  startDate?: number;
  endDate?: number;
  fromDate?: Date;
  toDate?: Date;
  type?: string;
  report?: string | undefined;
  kassaId?: string | undefined;
  typeOther?: string;
};

export type KassaQuery = {
  search?: string | undefined;
  limit?: number;
  page?: number;
  report?: string | undefined;
};

export type CashflowSummary = {
  period: {
    year: number;
    month: number;
    startDate: number;
    endDate: number;
    daysInMonth: number;
    totalDays: number;
  };
  totalIncome: number;
  totalExpense: number;
  netCashflow: number;
  transactionCount: number;
};

export type CashFlowsFilteredData = {
  casher: {
    firstName: string;
    avatar: {
      id: string;
      path: string;
      model: string;
      mimetypes: string;
      size: 373597;
    };
  };
  id: string;
  price: 131.21;
  type: string;
  tip: string;
  comment: string;
  title: string;
  date: Date;
  is_online: boolean;
  is_cancelled: boolean;
};

type metaType = {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  totals: {
    totalCount: number;
    totalKv: number;
    totalPrice: number;
    totalSellCount: number;
    totalSellKv: number;
    totalSellPrice: number;
  };
};

export type TManagerType = {
  income: number;
  expense: number;
};
export type TManagerTatalType = {
  totalNetProfit: number;
};

export type CashFlowsTotalData = {
  summary: number;
  // summary: {
  //   bossRasxod: number;
  //   biznesRasxod: number;
  //   totalRasxod: number;
  // };
  cashflows: {
    id: string;
    price: 200;
    date: Date;
    title: string;
    type: string;
    comment: string;
    category: string;
    categoryType: string;
    avatar: {
      id: string;
      path: string;
      model: string;
      mimetype: string;
      size: number;
      name: string;
      created_at: string;
    };
  }[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type ModelsReport = {
  id: string;
  title: string;
  totalCount: 6;
  totalKv: string;
  totalKvPrice: string;
  totalSellCount: 1;
  totalSellSize: string;
  totalSellPrice: string;
  totalSellDiscount: string;
  totalnetProfitSum: string;
  totalNetProfitPrice: number;
};

export type SizeReport = {
  id: string;
  title: string;
  totalCount: 6;
  totalKv: string;
  totalKvPrice: string;
  totalSellCount: 1;
  totalSellSize: string;
  totalSellPrice: string;
  totalSellDiscount: string;
  totalnetProfitSum: string;
  totalNetProfitPrice?: number;
};

export type SellerInPlan = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: { path: string };
  plan_price: number;
  earn: number;
};


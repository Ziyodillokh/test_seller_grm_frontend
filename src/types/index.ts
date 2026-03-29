export type TResponse<T> = {
  items: T[];
  meta: {
    page: number;
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    total: number;
  };
};
export type IUserData = {
  items: [{ id: string; title: string }];
  id: string;
  isActive: boolean;
  avatar: { path: string | null };
  firstName: string;
  lastName: string;
  fatherName: string;
  login: string;
  hired: string;
  from: string;
  to: string;
  username: string | null;
  salary: number | null;
  email: string | null;
  phone: string;
  password: string;
  isUpdated: boolean;
  createdAt: string;
  position: {
    id: string;
    title: string;
    is_active: boolean;
    role: number;
  };
  filial: {
    id: string;
    need_get_report: boolean;
    title: string;
    address?: string;
  };
};

export type TSelectOption = {
  value: string ;
  label: string;
};

export type Role = 'manufacturer' | 'logistics' | 'consumer';

export type ProductStatus = 
  | 'manufactured'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered';

export interface StatusUpdate {
  status: ProductStatus;
  timestamp: number;
  updatedBy: string;
}

export interface Product {
  id: string;
  name: string;
  manufacturer: string;
  origin: string;
  price: number;
  currentStatus: ProductStatus;
  statusHistory: StatusUpdate[];
  hash: string;
  paid: boolean;
}
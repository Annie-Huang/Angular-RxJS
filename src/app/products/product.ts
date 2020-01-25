/* Defines the product entity */
// export interface Product {
//   id: number;
//   productName: string;
//   productCode?: string;
//   description?: string;
//   price?: number;
//   categoryId?: number;
//   quantityInStock?: number;
//   searchKey?: string[];
//   supplierIds?: number[];
// }

// category will not be available until we mapped it.
export interface Product {
  id: number;
  productName: string;
  productCode?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  category?: string;
  quantityInStock?: number;
  searchKey?: string[];
  supplierIds?: number[];
}

import { ProductDropDownTypeIdEnum } from "../../constants/caseManagement";


/**
 * NOTE : this enum is mapped with enum in server
 */
// NOTE : for icharm user progress status list is 1,2,3,8,10,9,11,6
export enum OrderOverviewStatusEnum {
  All = 0,
  Draft = 1,
  WaitingOrder = 2,
  Ordered = 3,
  Delivery = 5,
  Completed = 6,
  Reject = 7,

  Canceled = 4,
  Step1 = 8,
  CustomerConfirmStep2 = 10,
  Step2 = 9,
}

/**
 * NOTE : this enum is mapped with enum in server
 */
export enum OrderOverviewSearchByEnum {
  All = 0,
  PatientName = 3,
  OrderRef = 4, // it display column as order id
}

export enum DentistStatusSearchEnum {
  ClinicName = 2,
}

export enum ClinicStatusSearchEnum {
  DentistName = 1,
}

export type DentistStatusFilterEnum = OrderOverviewSearchByEnum | DentistStatusSearchEnum;

export type ClinicStatusFilterEnum = OrderOverviewSearchByEnum | ClinicStatusSearchEnum;

export type OverviewSearch =
  | OrderOverviewSearchByEnum
  | DentistStatusSearchEnum
  | ClinicStatusSearchEnum;

export interface IOrderOverview {
  orderId: number;
  orderRef: string;
  status: OrderOverviewStatusEnum;
  productType: string;
  patientName: string;
  dentistName: string;
  clinicName: string;
  orderDate: Date;
  requestDeliveryDate: Date;
  estimatetionDate: Date;
  pickupDate: Date;
  caseType: string;
  isNotification: boolean;
}

export interface IOrderOverViewReceive {
  newDate: Date;
  orderList: IOrderOverview[];
  total: number;
}

export interface OrderDetialSelected {
  orderId: number;
  orderRef: string;
  patientName: string;
}

export interface OrderFilter {
  fromDate: Date;
  toDate: Date;
  status: number[];
  searchType: OverviewSearch;
  searchStr: string;
  page: number;
  pageSize: number;
  sortOrder: OrderSortType;
  productTypeId?: ProductDropDownTypeIdEnum
}

export enum OrderSortType {
  OrderRef = "orderRef",
  OrderRef_Desc = "orderRef_desc",

  Patient = "patient",
  Patient_Desc = "patient_Desc",

  Dentist = "dentist",
  Dentist_Desc = "dentist_desc",

  Clinic = "clinic",
  Clinic_Desc = "clinic_desc",

  Product = "product",
  Product_Desc = "product_Desc",

  Case = "case",
  Case_Desc = "case_Desc",

  OrderDate = "orderDate",
  OrderDate_Desc = "orderDate_Desc",

  RequestDate = "requestDate",
  RequestDate_Desc = "requestDate_Desc",

  None = "none",
}

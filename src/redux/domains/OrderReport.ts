import { IRejectNoteDetail } from "./OrderDetail";
import { OrderOverviewStatusEnum } from "./OrderOverview";

export interface IOrderReport {
  rowKey: string;
  statusId: OrderOverviewStatusEnum;
  status: string;
  orderRef: string;
  patientName: string;
  dentistName: string;
  clinicName: string;
  dentistId: number;
  clinicId: number;
  orderDate: Date;
  productType: string;
  productTypeId: number;
  caseType: string;
  method: string;
  selectedProducts: ISelectedProduct[];
  rejectNote: IRejectNoteDetail;
}

export interface ISelectedProduct {
  no: string;
  option: string;
  productName: string;
  age: number;
  gender: string;
  materialName: string;
  designName: string;
  productTypeId: number;
  productType: string;
  method: string;
  selectedAddOns: ISelectedAddOn[];
  shade: string;
  shadeSystem: string;
}

export interface ISelectedAddOn {
  addOnName: string;
  input: string;
}

export interface IOrderExportReport {
  status: string;
  orderRef: string;
  patientName: string;
  age: number;
  gender: string;
  dentistName: string;
  clinicName: string;
  caseType: string;
  productType: string;
  method: string;
  no: string;
  productName: string;
  materialName: string;
  designName: string;
  shade: string;
  addOn: string;
  note: string;
  orderDate: string;
}

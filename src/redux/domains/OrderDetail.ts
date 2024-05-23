import { IGetAttachmentFile } from "../actions/attachment.action";
import { CaseOrderListModel } from "./CaseManagement";
import { OrderOverviewStatusEnum } from "./OrderOverview";

export interface IOrderDetail {
  id: number;
  orderRef: string;
  caseName: string;
  patientName: string;
  orderedDate: Date | "";
  requestedDate: Date | "";
  dentistName: string | "";
  email: string | "";
  phoneNumber: string | "";
  clinicName: string | "";
  lineOrWhatsappId: string | "";
  levelOfTreatment: string | "";
  pickupDate: Date | "";
  expectedDate: Date | "";
  memo: string;
  pathAttachedFiles: IGetAttachmentFile[];
  status: OrderOverviewStatusEnum;
  isNotification: boolean | false;
  age: string;
  gender: number;
  clinic: IClinicResponse;
  doctor: IDoctorResponse;
  caseId: number;
  rejectNote: IRejectNoteDetail;
  aligners: string;
}

export interface IRejectNoteDetail {
  id: number;
  note: string | undefined;
  isAdmin: false;
  rejectDate: string | Date;
  orderId: number;
  rejectUserId: number;
  rejectUser: any;
}

export interface IDoctorResponse {
  doctorId: number;
  name: string;
  image: any;
  id: number;
  phoneNoti: any;
  emailNoti: any;
  type: string;
  lineUserId: null;
  email: string;
  lineId: string;
  phone: string;
}

export interface IClinicResponse {
  customerId: number;
  name: string;
  image: any;
  id: number;
  phoneNoti: any;
  emailNoti: any;
  type: string;
  lineUserId: null;
  email: string;
  lineId: string;
  phone: string;
}

export interface IOrderDetailResponse {
  caseOrderLists: CaseOrderListModel[];
  orderDetail: IOrderDetail;
}

export interface IUpdateNotificationResponse {
  caseId: number;
  id: number;
  isNotification: boolean;
}

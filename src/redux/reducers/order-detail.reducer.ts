import { castStatusNumberToStatusEnum } from "../../constants/progressManagement";
import { generateCaseOrderListModelUniqueName } from "../../utils/caseManagementUtils";
import { ActionType } from "../actions/order-detail.action";
import { CaseOrderListModel, IModifyHistoryDetail } from "../domains/CaseManagement";
import { IOrderDetail, IOrderDetailResponse } from "../domains/OrderDetail";
import { OrderOverviewStatusEnum } from "../domains/OrderOverview";
import { ICallbackResult } from "../type";

interface OrderDetailState {
  isCanceling: boolean;
  isLoading: boolean;
  orderDetail: IOrderDetail;
  caseOrderLists: CaseOrderListModel[];
  modifyHistory: IModifyHistoryDetail[];
  isUpdatingEstimatedDate: boolean;
  updateEstimatedDateResult: ICallbackResult;
  isUpdatingLevelOfTreatment: boolean;
  updateLevelOfTreatmentResult: ICallbackResult;
  isUpdatingMemo: boolean;
  updateMemoResult: ICallbackResult;
}

interface IOrderDetailRequestDetail {
  type: ActionType.ORDER_DETAIL_REQUEST_ORDER_DETAIL;
}

interface IOrderDetailReceiveModifyHistory {
  type: ActionType.ORDER_DETAIL_REQUEST_GET_MODIFY_HISTORY;
  payload: any;
}

interface IOrderDetailModifyCase {
  type: ActionType.ORDER_DETAIL_MODIFY_CASE;
  payload: any;
}

interface IOrderDetailReceiveDetail {
  type: ActionType.ORDER_DETAIL_RECEIVE_ORDER_DETAIL;
  payload: IOrderDetailResponse;
}

interface IOrderDetailReceiveDetailError {
  type: ActionType.ORDER_DETAIL_RECEIVE_ORDER_DETAIL_ERROR;
}

interface IOrderDetailRequestCancelDetail {
  type: ActionType.ORDER_DETAIL_REQUEST_CANCEL_ORDER_DETAIL;
}

interface IOrderDetailUpdateAligner {
  type: ActionType.ORDER_DETAIL_UPDATE_ALIGNER;
  payload: string;
}

interface IOrderDetailReceiveCancelDetail {
  type: ActionType.ORDER_DETAIL_RECEIVE_CANCEL_ORDER_DETAIL;
}

interface IOrderDetailReceiveCancelDetailError {
  type: ActionType.ORDER_DETAIL_RECEIVE_CANCEL_ORDER_DETAIL_ERROR;
}

interface IOrderDetailRequestEditEstimatedDate {
  type: ActionType.ORDER_DETAIL_REQUEST_EDIT_ESTIMATED_DATE;
}

interface IOrderDetailReceiveEditEstimatedDate {
  type: ActionType.ORDER_DETAIL_RECEIVE_EDIT_ESTIMATED_DATE;
  payload: ICallbackResult;
}
interface IOrderDetailRequestStatusUpdate {
  type: ActionType.ORDER_DETAIL_REQUEST_UPDATE_STATUS;
  payload: any;
}
interface IOrderDetailReceiveStausUpdate {
  type: ActionType.ORDER_DETAIL_RECEIVE_UPDATE_STATUS;
  payload: any;
}

interface IOrderDetailReceiveRejectNoteUpdate {
  type: ActionType.ORDER_DETAIL_RECEIVE_UPDATE_REJECT_NOTE;
  payload: any;
}

interface IOrderDetailUpdateNotification {
  type: ActionType.ORDER_DETAIL_RECEIVE_UPDATE_NOTIFICATION;
  payload: any;
}

interface IOrderDetailUpdateMemo {
  type: ActionType.ORDER_DETAIL_UPDATE_MEMO;
  payload: string;
}

interface IOrderDetailRequestUpdateCaseProduct {
  type : ActionType.ORDER_DETAIL_REQUEST_UPDATE_CASE_PRODUCT
}

interface IOrderDetailUpdateCaseProduct {
  type : ActionType.ORDER_DETAIL_UPDATE_CASE_PRODUCT,
  payload : ICallbackResult,
}

interface IOrderDetailRequestUpdateMemo {
  type : ActionType.ORDER_DETAIL_REQUEST_UPDATE_MEMO,
}

interface IOrderDetailUpdateMemoResult {
  type : ActionType.ORDER_DETAIL_UPDATE_MEMO_RESULT,
  payload : ICallbackResult;
}

type IOrdeDetailAction =
  | IOrderDetailRequestDetail
  | IOrderDetailReceiveDetail
  | IOrderDetailReceiveDetailError
  | IOrderDetailRequestCancelDetail
  | IOrderDetailReceiveCancelDetail
  | IOrderDetailReceiveCancelDetailError
  | IOrderDetailRequestEditEstimatedDate
  | IOrderDetailReceiveEditEstimatedDate
  | IOrderDetailRequestStatusUpdate
  | IOrderDetailReceiveStausUpdate
  | IOrderDetailModifyCase
  | IOrderDetailReceiveModifyHistory
  | IOrderDetailReceiveRejectNoteUpdate
  | IOrderDetailUpdateAligner
  | IOrderDetailUpdateNotification
  | IOrderDetailUpdateMemo
  | IOrderDetailRequestUpdateCaseProduct
  | IOrderDetailUpdateCaseProduct
  | IOrderDetailRequestUpdateMemo
  | IOrderDetailUpdateMemoResult;

const initialOrderDetailState: OrderDetailState = {
  isCanceling: false,
  isLoading: false,
  caseOrderLists: [],
  orderDetail: {
    id: -1,
    orderRef: "",
    caseName: "",
    patientName: "",
    orderedDate: "",
    dentistName: "",
    email: "",
    phoneNumber: "",
    clinicName: "",
    lineOrWhatsappId: "",
    levelOfTreatment: "",
    pickupDate: "",
    requestedDate: "",
    expectedDate: "",
    memo: "",
    pathAttachedFiles: [],
    status: OrderOverviewStatusEnum.Draft,
    isNotification: false,
    age: "",
    gender: 0,
    caseId: 0,
    aligners: "",
    doctor: {
      doctorId: 0,
      name: "",
      image: null,
      id: 0,
      phoneNoti: null,
      emailNoti: null,
      type: "",
      lineUserId: null,
      email: "",
      lineId: "",
      phone: "",
    },
    clinic: {
      customerId: 0,
      name: "",
      image: null,
      id: 0,
      phoneNoti: null,
      emailNoti: null,
      type: "",
      lineUserId: null,
      email: "",
      lineId: "",
      phone: "",
    },
    rejectNote: {
      id: 0,
      note: "",
      isAdmin: false,
      rejectDate: "",
      orderId: 0,
      rejectUserId: 0,
      rejectUser: null,
    },
  },
  isUpdatingEstimatedDate: false,
  modifyHistory: [
    {
      id: 0,
      caseId: 0,
      note: "",
      requestCaseAttachedFiles: [],
      requestedEditDate: "",
    },
  ],
  updateEstimatedDateResult: { success: true, message: "" },
  isUpdatingLevelOfTreatment: false,
  updateLevelOfTreatmentResult: { success: true, message: "" },
  isUpdatingMemo: false,
  updateMemoResult: { success: true, message: "" },
};

const handleCancel = (orderDetail: IOrderDetail) => {
  return {
    ...orderDetail,
    status: OrderOverviewStatusEnum.Reject,
  };
};

const OrderDetail = (
  state = initialOrderDetailState,
  action: IOrdeDetailAction
): OrderDetailState => {
  switch (action.type) {
    case ActionType.ORDER_DETAIL_REQUEST_ORDER_DETAIL:
      return { ...state, isLoading: true };

    case ActionType.ORDER_DETAIL_RECEIVE_ORDER_DETAIL:
      return {
        ...state,
        isLoading: false,
        orderDetail: action.payload.orderDetail,
        caseOrderLists: generateCaseOrderListModelUniqueName(action.payload.caseOrderLists),
      };

    case ActionType.ORDER_DETAIL_RECEIVE_ORDER_DETAIL_ERROR:
      return { ...state, isLoading: false };

    case ActionType.ORDER_DETAIL_REQUEST_CANCEL_ORDER_DETAIL:
      return { ...state, isCanceling: true };

    case ActionType.ORDER_DETAIL_RECEIVE_CANCEL_ORDER_DETAIL:
      return { ...state, isCanceling: false, orderDetail: handleCancel(state.orderDetail) };

    case ActionType.ORDER_DETAIL_RECEIVE_CANCEL_ORDER_DETAIL_ERROR:
      return { ...state, isCanceling: false };

    case ActionType.ORDER_DETAIL_REQUEST_EDIT_ESTIMATED_DATE:
      return {
        ...state,
        isUpdatingEstimatedDate: true,
        updateEstimatedDateResult: { success: true, message: "" },
      };

    case ActionType.ORDER_DETAIL_RECEIVE_EDIT_ESTIMATED_DATE:
      return {
        ...state,
        isUpdatingEstimatedDate: false,
        updateEstimatedDateResult: action.payload,
      };

    case ActionType.ORDER_DETAIL_RECEIVE_UPDATE_REJECT_NOTE:
      return {
        ...state,
        orderDetail: {
          ...state.orderDetail,
          rejectNote: action.payload,
        },
      };

    case ActionType.ORDER_DETAIL_RECEIVE_UPDATE_STATUS:
      return {
        ...state,
        orderDetail: {
          ...state.orderDetail,
          status: castStatusNumberToStatusEnum(action.payload),
        },
      };

    case ActionType.ORDER_DETAIL_REQUEST_GET_MODIFY_HISTORY:
      return {
        ...state,
        isLoading: false,
        modifyHistory: action.payload,
      };

    case ActionType.ORDER_DETAIL_UPDATE_ALIGNER:
      return {
        ...state,
        orderDetail: {
          ...state.orderDetail,
          aligners: action.payload,
        },
      };

    case ActionType.ORDER_DETAIL_UPDATE_MEMO:
      return {
        ...state,
        orderDetail: {
          ...state.orderDetail,
          memo: action.payload,
        },
      };

    case ActionType.ORDER_DETAIL_REQUEST_UPDATE_STATUS:
      return {
        ...state,
        orderDetail: {
          ...state.orderDetail,
        },
      };

    case ActionType.ORDER_DETAIL_RECEIVE_UPDATE_NOTIFICATION:
      return {
        ...state,
        orderDetail: {
          ...state.orderDetail,
          isNotification: action.payload,
        },
      };

    case ActionType.ORDER_DETAIL_REQUEST_UPDATE_CASE_PRODUCT:
      return {
        ...state,
        isUpdatingLevelOfTreatment: true,
      };

    case ActionType.ORDER_DETAIL_UPDATE_CASE_PRODUCT:
      return {
        ...state,
        isUpdatingLevelOfTreatment: false,
        updateEstimatedDateResult: action.payload,
      };

    case ActionType.ORDER_DETAIL_REQUEST_UPDATE_MEMO:
      return {
        ...state,
        isUpdatingMemo : true,
      };

    case ActionType.ORDER_DETAIL_UPDATE_MEMO_RESULT:
      return {
        ...state,
        isUpdatingMemo: false,
        updateMemoResult: action.payload
      }

    default:
      return state;
  }
};

export default OrderDetail;

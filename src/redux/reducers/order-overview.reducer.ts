import { ActionType } from "../actions/order-overview.action";
import {
  IOrderOverview,
  IOrderOverViewReceive,
  OrderOverviewStatusEnum,
} from "../domains/OrderOverview";
import { IOrderReport } from "../domains/OrderReport";
import { ICallbackResult } from "../type";

export interface IOrderAddPrintList {
  type: ActionType.ORDER_OVERVIEW_PRINT_LIST_ADD;
  payload: IOrderOverview;
}

export interface IOrderDestroyPrintList {
  type: ActionType.ORDER_OVERVIEW_PRINT_LIST_DESTROY;
}

export interface IOrderOverviewReceiveData {
  type: ActionType.ORDER_OVERVIEW_RECEIVE_ORDER_OVERVIEW;
  payload: IOrderOverViewReceive;
}

export interface IOrderOverviewRequestData {
  type: ActionType.ORDER_OVERVIEW_REQUEST_ORDER_OVERVIEW;
}

export interface IOrderOverviewReceiveDataError {
  type: ActionType.ORDER_OVERVIEW_RECEIVE_ORDER_OVERVIEW_ERROR;
}

export interface IOrderOverviewRequestDeleteOrder {
  type: ActionType.ORDER_OVERVIEW_REQUEST_DELETE_ORDER;
}

export interface IOrderOverviewReceiveDeleteOrder {
  type: ActionType.ORDER_OVERVIEW_RECEIVE_DELETE_ORDER;
  payload: number;
}

export interface IOrderOverviewReceiveDeleteOrderError {
  type: ActionType.ORDER_OVERVIEW_RECEIVE_DELETE_ORDER_ERROR;
}

export interface IOrderOverviewCancelOrder {
  type: ActionType.ORDER_OVERVIEW_RECEIVE_UPDATE_CANCEL_ORDER;
  payload: number;
}

export interface IOrderStatusReceiveData {
  type: ActionType.ORDER_OVERVIEW_RECEIVE_ALL_ORDER_LIST;
  payload: IOrderOverViewReceive;
}

export interface IOrderStatusRequestData {
  type: ActionType.ORDER_OVERVIEW_REQUEST_ALL_ORDER_LIST;
}

export interface IOrderStatusReceiveDataError {
  type: ActionType.ORDER_OVERVIEW_RECEIVE_ALL_ORDER_LIST_ERROR;
}

export interface IOrderReportReceiveData {
  type: ActionType.ORDER_OVERVIEW_RECEIVE_REPORT_ORDER_LIST;
  payload: IOrderReport[];
}

export interface IOrderReportRequestData {
  type: ActionType.ORDER_OVERVIEW_REQUEST_REPORT_ORDER_LIST;
}

export interface IOrderReportReceiveDataError {
  type: ActionType.ORDER_OVERVIEW_RECEIVE_REPORT_ORDER_LIST_ERROR;
}

export interface IOrderRequestExportPdf {
  type: ActionType.ORDER_OVERVIEW_REQUEST_PDF;
}

export interface IOrderReceiveExportPdf {
  type: ActionType.ORDER_OVERVIEW_RECEIVE_PDF;
}

export interface IOrderReceiveExportPdfError {
  type: ActionType.ORDER_OVERVIEW_RECEIVE_PDF_ERROR;
}

export type IOrderOverviewAction =
  | IOrderOverviewReceiveData
  | IOrderOverviewRequestData
  | IOrderOverviewReceiveDataError
  | IOrderOverviewRequestDeleteOrder
  | IOrderOverviewReceiveDeleteOrder
  | IOrderOverviewReceiveDeleteOrderError
  | IOrderOverviewCancelOrder
  | IOrderStatusReceiveData
  | IOrderStatusRequestData
  | IOrderStatusReceiveDataError
  | IOrderReportReceiveData
  | IOrderReportRequestData
  | IOrderReportReceiveDataError
  | IOrderAddPrintList
  | IOrderRequestExportPdf
  | IOrderReceiveExportPdf
  | IOrderReceiveExportPdfError
  | IOrderDestroyPrintList;

interface OrderOverviewState {
  isDeleting: boolean;
  isLoading: boolean;
  isLoadingAllList: boolean;
  orderList: IOrderOverview[];
  totalOrder: number;

  allOrderList: IOrderOverview[];
  totalOrderList: number; // count admin order list

  isReportLoading: boolean;
  orderReportList: IOrderReport[];
  getReportListResult: ICallbackResult;

  orderPrintList: IOrderOverview[];
  isExportPdf: boolean;
}

const initialOrderOverviewState: OrderOverviewState = {
  isDeleting: false,
  isLoading: false,
  isLoadingAllList: false,
  orderList: [],
  totalOrder: 0,
  orderPrintList: [],
  allOrderList: [],
  totalOrderList: 0,
  isReportLoading: false,
  orderReportList: [],
  getReportListResult: { success: true, message: "" },
  isExportPdf: false,
};

const handleDelete = (id: number, orginalOrderList: IOrderOverview[]) => {
  return orginalOrderList.filter((o) => o.orderId !== id);
};

const handleCancel = (id: number, orginalOrderList: IOrderOverview[]) => {
  return orginalOrderList.map((o) => {
    if (o.orderId === id) {
      return {
        ...o,
        status: OrderOverviewStatusEnum.Canceled,
      };
    }

    return o;
  });
};

const handlePrintList = (order: IOrderOverview, originalOrderList: IOrderOverview[]) => {
  const findDuplicate = originalOrderList.find((o) => o.orderId === order.orderId);
  let newOrderList: IOrderOverview[];

  if (findDuplicate) {
    newOrderList = originalOrderList.filter((o) => o.orderId !== order.orderId);
  } else {
    newOrderList = [...originalOrderList, order];
  }

  newOrderList.sort((a, b) => (a.orderId < b.orderId ? -1 : 1));

  return newOrderList;
};

const OrderOverview = (
  state = initialOrderOverviewState,
  action: IOrderOverviewAction
): OrderOverviewState => {
  switch (action.type) {
    case ActionType.ORDER_OVERVIEW_PRINT_LIST_DESTROY:
      return {
        ...state,
        orderPrintList: [],
      };
    case ActionType.ORDER_OVERVIEW_PRINT_LIST_ADD:
      return {
        ...state,
        orderPrintList: handlePrintList(action.payload, state.orderPrintList),
      };
    case ActionType.ORDER_OVERVIEW_REQUEST_ORDER_OVERVIEW:
      return { ...state, isLoading: true, orderPrintList: [] };
    case ActionType.ORDER_OVERVIEW_RECEIVE_ORDER_OVERVIEW:
      return {
        ...state,
        isLoading: false,
        orderList: action.payload.orderList,
        totalOrder: action.payload.total,
      };
    case ActionType.ORDER_OVERVIEW_RECEIVE_ORDER_OVERVIEW_ERROR:
      return { ...state, isLoading: false };

    case ActionType.ORDER_OVERVIEW_REQUEST_DELETE_ORDER:
      return { ...state, isDeleting: true };
    case ActionType.ORDER_OVERVIEW_RECEIVE_DELETE_ORDER:
      return {
        ...state,
        isDeleting: false,
        orderList: handleDelete(action.payload, state.orderList),
      };
    case ActionType.ORDER_OVERVIEW_RECEIVE_DELETE_ORDER_ERROR:
      return { ...state, isDeleting: false };

    case ActionType.ORDER_OVERVIEW_RECEIVE_UPDATE_CANCEL_ORDER:
      return {
        ...state,
        isDeleting: false,
        orderList: handleCancel(action.payload, state.orderList),
      };

    case ActionType.ORDER_OVERVIEW_REQUEST_ALL_ORDER_LIST:
      return { ...state, isLoadingAllList: true };

    case ActionType.ORDER_OVERVIEW_RECEIVE_ALL_ORDER_LIST:
      return {
        ...state,
        isLoadingAllList: false,
        allOrderList: action.payload.orderList,
        totalOrderList: action.payload.total,
      };
    case ActionType.ORDER_OVERVIEW_RECEIVE_ALL_ORDER_LIST_ERROR:
      return { ...state, isLoadingAllList: false };

    case ActionType.ORDER_OVERVIEW_REQUEST_REPORT_ORDER_LIST:
      return {
        ...state,
        isReportLoading: true,
        orderReportList: [],
        getReportListResult: { success: true, message: "" },
      };
    case ActionType.ORDER_OVERVIEW_RECEIVE_REPORT_ORDER_LIST:
      return {
        ...state,
        isReportLoading: false,
        orderReportList: action.payload,
        getReportListResult: { success: true, message: "" },
      };
    case ActionType.ORDER_OVERVIEW_RECEIVE_REPORT_ORDER_LIST_ERROR:
      return {
        ...state,
        isReportLoading: false,
        orderReportList: [],
        getReportListResult: { success: false, message: "Get Report Error" },
      };
    case ActionType.ORDER_OVERVIEW_REQUEST_PDF:
      return {
        ...state,
        isExportPdf: true,
      };
    case ActionType.ORDER_OVERVIEW_RECEIVE_PDF:
    return {
      ...state,
      isExportPdf: false,
    };
    case ActionType.ORDER_OVERVIEW_RECEIVE_PDF_ERROR:
    return {
      ...state,
      isExportPdf: false,
    };
    default:
      return state;
  }
};

export default OrderOverview;

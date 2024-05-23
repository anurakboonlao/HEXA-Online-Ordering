import dayjs from "dayjs";
import { toast } from "react-toastify";
import { ProductDropDownTypeIdEnum } from "../../constants/caseManagement";

import { UserRoleEnum } from "../../constants/constant";
import { DEFAULT_PAGESIZE } from "../../constants/paging";
import { authFetch, handleError } from "../../utils/apiUtils";
import { dateToInterFormat } from "../../utils/converter";
import {
  IOrderOverViewReceive,
  OrderFilter,
  OrderOverviewSearchByEnum,
  OrderOverviewStatusEnum,
  OverviewSearch,
  OrderSortType,
  IOrderOverview,
} from "../domains/OrderOverview";
import { IOrderReport } from "../domains/OrderReport";
import { GlobalState } from "../reducers";
import createAction from "./base.actions";
import downloadjs from "downloadjs";
import { getFilterQueryList, OrderStatusFilterClient } from "../../constants/orderDetail";

export enum ActionType {
  // get order list
  ORDER_OVERVIEW_REQUEST_ORDER_OVERVIEW = "ORDER_OVERVIEW_REQUEST_ORDER_OVERVIEW",
  ORDER_OVERVIEW_RECEIVE_ORDER_OVERVIEW = "ORDER_OVERVIEW_RECEIVE_ORDER_OVERVIEW",
  ORDER_OVERVIEW_RECEIVE_ORDER_OVERVIEW_ERROR = "ORDER_OVERVIEW_RECEIVE_ORDER_OVERVIEW_ERROR",

  // delete order
  ORDER_OVERVIEW_REQUEST_DELETE_ORDER = "ORDER_OVERVIEW_REQUEST_DELETE_ORDER",
  ORDER_OVERVIEW_RECEIVE_DELETE_ORDER = "ORDER_OVERVIEW_RECEIVE_DELETE_ORDER",
  ORDER_OVERVIEW_RECEIVE_DELETE_ORDER_ERROR = "ORDER_OVERVIEW_RECEIVE_DELETE_ORDER_ERROR",

  //update client cancel case
  ORDER_OVERVIEW_RECEIVE_UPDATE_CANCEL_ORDER = "ORDER_OVERVIEW_RECEIVE_UPDATE_CANCEL_ORDER",

  // get all order list
  ORDER_OVERVIEW_REQUEST_ALL_ORDER_LIST = "ORDER_OVERVIEW_REQUEST_ALL_ORDER_LIST",
  ORDER_OVERVIEW_RECEIVE_ALL_ORDER_LIST = "ORDER_OVERVIEW_RECEIVE_ALL_ORDER_LIST",
  ORDER_OVERVIEW_RECEIVE_ALL_ORDER_LIST_ERROR = "ORDER_OVERVIEW_RECEIVE_ALL_ORDER_LIST_ERROR",

  // add print order list
  ORDER_OVERVIEW_PRINT_LIST_ADD = "ORDER_OVERVIEW_PRINT_LIST_ADD",

  // delete print order list
  ORDER_OVERVIEW_PRINT_LIST_DESTROY = "ORDER_OVERVIEW_PRINT_LIST_DESTROY",

  // get order for report
  ORDER_OVERVIEW_REQUEST_REPORT_ORDER_LIST = "ORDER_OVERVIEW_REQUEST_REPORT_ORDER_LIST",
  ORDER_OVERVIEW_RECEIVE_REPORT_ORDER_LIST = "ORDER_OVERVIEW_RECEIVE_REPORT_ORDER_LIST",
  ORDER_OVERVIEW_RECEIVE_REPORT_ORDER_LIST_ERROR = "ORDER_OVERVIEW_RECEIVE_REPORT_ORDER_LIST_ERROR",

  // export order pdf
  ORDER_OVERVIEW_REQUEST_PDF = "ORDER_OVERVIEW_REQUEST_PDF",
  ORDER_OVERVIEW_RECEIVE_PDF = "ORDER_OVERVIEW_RECEIVE_PDF",
  ORDER_OVERVIEW_RECEIVE_PDF_ERROR = "ORDER_OVERVIEW_RECEIVE_PDF_ERROR",
}

export const getOrderOverview =
  (
    fromDate?: Date,
    toDate?: Date,
    statusFilter?: number[],
    searchType?: OverviewSearch,
    search?: string,
    currentPage?: number,
    pageSize?: number,
    memberId?: number,
    sortOrder?: string,
    selectedProductType?: ProductDropDownTypeIdEnum
  ) =>
  (dispatch: any, getState: () => GlobalState) => {
    dispatch(createAction(ActionType.ORDER_OVERVIEW_REQUEST_ORDER_OVERVIEW));
    //dispatch(createAction(ActionType.ORDER_OVERVIEW_PRINT_LIST_DESTROY));

    const role = getState().User.payload.role as UserRoleEnum;
    const selectedContactId: number = Number(
      getState().User.selectedContactId ? getState().User.selectedContactId : 0
    );
    
    const statusToQuery = statusFilter?.map(val => `status=${val}`).join('&') ?? `status=${OrderStatusFilterClient.All}`;

    const id = Number(getState().User.payload.ContactId);
    const url =
      (role === UserRoleEnum.Clinic
        ? "/OrderOverview/GetOrdersByClinicId/"
        : "/OrderOverview/GetOrdersByDentistId/") +
      id +
      `?` +
      `&from=${dateToInterFormat(fromDate ?? dayjs(new Date()).add(-7, "day").toDate())}` +
      `&to=${dateToInterFormat(toDate ?? new Date())}` +
      `&${statusToQuery}` +
      `&searchType=${searchType ?? OrderOverviewSearchByEnum.All}` +
      `&searchStr=${search ?? ""}` +
      `&page=${currentPage ?? 1}` +
      `&pageSize=${pageSize ?? DEFAULT_PAGESIZE}` +
      `&sortOrder=${sortOrder ?? OrderSortType.None}` +
      `&productTypeId=${selectedProductType ?? ProductDropDownTypeIdEnum.All}` +
      (role === UserRoleEnum.Clinic ? `&dentistId=` : `&clinicId=`) +
      `${memberId ?? selectedContactId}`;

    return authFetch({
      url: url,
      state: getState(),
      options: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      requireAuth: true,
    })
      .then((response) => {
        let data = response as IOrderOverViewReceive;

        dispatch(createAction(ActionType.ORDER_OVERVIEW_RECEIVE_ORDER_OVERVIEW, data));
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            toast.error(error?.responseBody?.message);
            dispatch(createAction(ActionType.ORDER_OVERVIEW_RECEIVE_ORDER_OVERVIEW_ERROR));
          },
        })
      );
  };

export const addPrintingOrderList = (order: IOrderOverview) => (dispatch: any, getState: any) => {
  dispatch(createAction(ActionType.ORDER_OVERVIEW_PRINT_LIST_ADD, order));
};

export const destroyPrintOrderList = () => (dispatch: any) => {
  dispatch(createAction(ActionType.ORDER_OVERVIEW_PRINT_LIST_DESTROY));
};

export const updateCancelOrder = (caseId: number) => (dispatch: any, getState: any) => {
  dispatch(createAction(ActionType.ORDER_OVERVIEW_RECEIVE_UPDATE_CANCEL_ORDER, caseId));
};

export const deleteOrder = (id: number) => (dispatch: any, getState: any) => {
  dispatch(createAction(ActionType.ORDER_OVERVIEW_REQUEST_DELETE_ORDER));

  const url = "/OrderOverview/DeleteOrder/" + id;

  return authFetch({
    url: url,
    state: getState(),
    options: {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    requireAuth: true,
  })
    .then((response) => {
      const deletedId = response as number;
      dispatch(createAction(ActionType.ORDER_OVERVIEW_RECEIVE_DELETE_ORDER, deletedId));
    })
    .catch(
      handleError.bind(null, {
        dispatch,
        SERVER_ERROR: (error) => {
          toast.error(error?.responseBody?.message);
          dispatch(createAction(ActionType.ORDER_OVERVIEW_RECEIVE_DELETE_ORDER_ERROR));
        },
      })
    );
};

const orderFilterInitial = {
  fromDate: dayjs(new Date()).add(-7, "day").toDate(),
  toDate: new Date(),
  status: [OrderStatusFilterClient.All],
  searchType: OrderOverviewSearchByEnum.All,
  searchStr: "",
  sortOrder: OrderSortType.None,
  page: 1,
  pageSize: DEFAULT_PAGESIZE,
  productTypeId: ProductDropDownTypeIdEnum.All,
  isNotification: false,
};

export const getAllOrders =
  (orderFilter: OrderFilter = orderFilterInitial) =>
  (dispatch: any, getState: () => GlobalState) => {
    dispatch(createAction(ActionType.ORDER_OVERVIEW_REQUEST_ALL_ORDER_LIST));

    const statusToQuery = orderFilter.status.map(val => `status=${val}`).join('&');

    const url =
      "/OrderOverview/GetAllOrders?" +
      `fromDate=${dateToInterFormat(orderFilter.fromDate)}` +
      `&toDate=${dateToInterFormat(orderFilter.toDate)}` +
      `&${statusToQuery}` +
      `&searchType=${orderFilter.searchType}` +
      `&searchStr=${orderFilter.searchStr}` +
      `&page=${orderFilter.page}` + // default current page is 1
      `&pageSize=${orderFilter.pageSize}` +
      `&sortOrder=${orderFilter.sortOrder}` +
      `&ProductTypeId=${orderFilter.productTypeId}`;

    return authFetch({
      url: url,
      state: getState(),
      options: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      requireAuth: true,
    })
      .then((response) => {
        const data = response as IOrderOverViewReceive;
        dispatch(createAction(ActionType.ORDER_OVERVIEW_RECEIVE_ALL_ORDER_LIST, data));
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            toast.error(error?.responseBody?.message);
            dispatch(createAction(ActionType.ORDER_OVERVIEW_RECEIVE_ALL_ORDER_LIST_ERROR));
          },
        })
      );
  };

export const getReportOrders =
  (orderFilter: OrderFilter = orderFilterInitial) =>
  (dispatch: any, getState: () => GlobalState) => {
    dispatch(createAction(ActionType.ORDER_OVERVIEW_REQUEST_ALL_ORDER_LIST));

    const statusToQuery = orderFilter.status.map(val => `status=${val}`).join('&');

    const url =
      "/OrderOverview/GetOrderReports?" +
      `fromDate=${dateToInterFormat(orderFilter.fromDate)}` +
      `&toDate=${dateToInterFormat(orderFilter.toDate)}` +
      `&${statusToQuery}`;

    return authFetch({
      url: url,
      state: getState(),
      options: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      requireAuth: true,
    })
      .then((response) => {
        const data = response as IOrderReport[];
        console.log("orderReport", response);

        dispatch(createAction(ActionType.ORDER_OVERVIEW_RECEIVE_REPORT_ORDER_LIST, data));
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            toast.error(error?.responseBody?.message);
            dispatch(createAction(ActionType.ORDER_OVERVIEW_RECEIVE_REPORT_ORDER_LIST_ERROR));
          },
        })
      );
  };

export const orderExportPdf = (orderIds: number[]) => (dispatch: any, getState: any) => {
  dispatch(createAction(ActionType.ORDER_OVERVIEW_REQUEST_PDF));

  const url = "/OrderOverview/ExportPdf";

  return authFetch({
    url: url,
    state: getState(),
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(orderIds),
    },
    requireAuth: true,
    responseType: "file",
  })
    .then((response) => {
      downloadjs(response as Blob, `Order ${orderIds.join("_")}.pdf`, "application/pdf");
      dispatch(createAction(ActionType.ORDER_OVERVIEW_RECEIVE_PDF));
    })
    .catch(
      handleError.bind(null, {
        dispatch,
        SERVER_ERROR: (error) => {
          toast.error(error);
          dispatch(createAction(ActionType.ORDER_OVERVIEW_RECEIVE_PDF_ERROR));
        },
      })
    );
};

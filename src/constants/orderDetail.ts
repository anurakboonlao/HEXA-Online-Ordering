import { OrderOverviewStatusEnum } from "../redux/domains/OrderOverview";

export const OrderStatusAdminFilterGroup = {
  All: [OrderOverviewStatusEnum.All],
  Pending: [
    OrderOverviewStatusEnum.Draft,
    OrderOverviewStatusEnum.WaitingOrder,
  ],
  Accept: [OrderOverviewStatusEnum.Ordered, OrderOverviewStatusEnum.Step1],
  Delivered: [
    OrderOverviewStatusEnum.Delivery,
    OrderOverviewStatusEnum.CustomerConfirmStep2,
    OrderOverviewStatusEnum.Step2,
  ],
  Complete: [OrderOverviewStatusEnum.Completed],
  Cancel: [OrderOverviewStatusEnum.Canceled],
  Reject: [OrderOverviewStatusEnum.Reject],
};

export const OrderStatusFilterGroup = {
  All: [OrderOverviewStatusEnum.All],
  Pending: [OrderOverviewStatusEnum.Draft],
  Accept: [
    OrderOverviewStatusEnum.WaitingOrder,
    OrderOverviewStatusEnum.Step1,
    OrderOverviewStatusEnum.Ordered,
  ],
  Delivered: [OrderOverviewStatusEnum.Delivery, OrderOverviewStatusEnum.Step2],
  Complete: [OrderOverviewStatusEnum.Completed],
  Cancel: [OrderOverviewStatusEnum.Canceled],
  Reject: [OrderOverviewStatusEnum.Reject],
};

export enum OrderStatusFilterClient {
  All = 0,
  Pending = 1,
  Accepted = 2,
  Delivered = 3,
  Completed = 4,
  Canceled = 5,
  Rejected = 6,
}

export const getFilterQueryList = (enums: OrderStatusFilterClient) => {
  switch (enums) {
    case OrderStatusFilterClient.All:
      return OrderStatusFilterGroup.All;
    case OrderStatusFilterClient.Pending:
      return OrderStatusFilterGroup.Pending;
    case OrderStatusFilterClient.Accepted:
      return OrderStatusFilterGroup.Accept;
    case OrderStatusFilterClient.Delivered:
      return OrderStatusFilterGroup.Delivered;
    case OrderStatusFilterClient.Completed:
      return OrderStatusFilterGroup.Complete;
    case OrderStatusFilterClient.Canceled:
      return OrderStatusFilterGroup.Cancel;
    case OrderStatusFilterClient.Rejected:
      return OrderStatusFilterGroup.Reject;
    default:
      return [];
  }
};

export const getAdminFilterQueryList = (enums: OrderStatusFilterClient) => {
  switch (enums) {
    case OrderStatusFilterClient.All:
      return OrderStatusAdminFilterGroup.All;
    case OrderStatusFilterClient.Pending:
      return OrderStatusAdminFilterGroup.Pending;
    case OrderStatusFilterClient.Accepted:
      return OrderStatusAdminFilterGroup.Accept;
    case OrderStatusFilterClient.Delivered:
      return OrderStatusAdminFilterGroup.Delivered;
    case OrderStatusFilterClient.Completed:
      return OrderStatusAdminFilterGroup.Complete;
    case OrderStatusFilterClient.Canceled:
      return OrderStatusAdminFilterGroup.Cancel;
    case OrderStatusFilterClient.Rejected:
      return OrderStatusAdminFilterGroup.Reject;
    default:
      return [];
  }
};

export const orderStatusGroupToString = (enums: OrderStatusFilterClient) => {
  switch (enums) {
    case OrderStatusFilterClient.All:
      return "All Status";
    case OrderStatusFilterClient.Pending:
      return "Pending";
    case OrderStatusFilterClient.Accepted:
      return "Accepted";
    case OrderStatusFilterClient.Delivered:
      return "Delivered";
    case OrderStatusFilterClient.Completed:
      return "Completed";
    case OrderStatusFilterClient.Canceled:
      return "Canceled";
    case OrderStatusFilterClient.Rejected:
      return "Rejected";
    default:
      return;
  }
};

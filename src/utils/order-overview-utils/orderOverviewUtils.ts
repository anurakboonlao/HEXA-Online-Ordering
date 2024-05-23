import i18n from "../../i18n";
import {
  ClinicStatusSearchEnum,
  DentistStatusSearchEnum,
  OrderOverviewSearchByEnum,
  OrderOverviewStatusEnum,
  OverviewSearch,
} from "../../redux/domains/OrderOverview";

export const orderEnumToString = (enums: OrderOverviewStatusEnum | string) => {
  // NOTE : convert enum from server to String
  switch (enums) {
    case OrderOverviewStatusEnum.All:
      return "All Status";
    case OrderOverviewStatusEnum.Draft:
      return "Pending";
    case OrderOverviewStatusEnum.WaitingOrder:
      return "Pending";
    case OrderOverviewStatusEnum.Ordered:
      return "Accepted";
    case OrderOverviewStatusEnum.Delivery:
      return "Delivered";
    case OrderOverviewStatusEnum.Completed:
      return "Completed";
    case OrderOverviewStatusEnum.Reject:
      return "Rejected";
    case OrderOverviewStatusEnum.Canceled:
      return "Canceled";
    default:
      return;
  }
};

export const displayGender = (genderId: number) => {
  switch (genderId) {
    case 1:
      return i18n.t("MALE");
    case 2:
      return i18n.t("FEMALE");
    default:
      return "";
  }
};

export const orderICharmEnumToString = (enums: OrderOverviewStatusEnum | string) => {
  switch (enums) {
    case OrderOverviewStatusEnum.CustomerConfirmStep2:
      return i18n.t("ALL_SETS_ORDERED");
    case OrderOverviewStatusEnum.Step1:
      return i18n.t("FIRST_SET_ORDERED");
    case OrderOverviewStatusEnum.Ordered:
      return i18n.t("FIRST_SET_ORDERED");
    case OrderOverviewStatusEnum.Delivery:
      return i18n.t("FIRST_SET_DELIVERED_TABLE");
    case OrderOverviewStatusEnum.Step2:
      return i18n.t("ALL_SETS_ORDERED");
    case OrderOverviewStatusEnum.Completed:
      return i18n.t("ALL_SETS_DELIVERED");
    case OrderOverviewStatusEnum.Reject:
      return i18n.t("REJECTED");
    case OrderOverviewStatusEnum.Canceled:
      return i18n.t("CANCELED");
    case OrderOverviewStatusEnum.WaitingOrder:
      return i18n.t("ACCEPTED");
    case OrderOverviewStatusEnum.Draft:
      return i18n.t("PENDING");
    default:
      return;
  }
};
export const orderSearchEnumToString = (
  enums: OverviewSearch | DentistStatusSearchEnum | ClinicStatusSearchEnum
) => {
  switch (enums) {
    case OrderOverviewSearchByEnum.All:
      return "All";

    // for search type
    case OrderOverviewSearchByEnum.PatientName:
      return "Patient";
    case DentistStatusSearchEnum.ClinicName:
      return "Clinic / Hospital";
    case ClinicStatusSearchEnum.DentistName:
      return "Dentist";
    case OrderOverviewSearchByEnum.OrderRef:
      return "Order Id";
    default:
      return "";
  }
};

export const getOrderOverviewBadageStatus = (status: OrderOverviewStatusEnum | string) => {
  switch (status) {
    case OrderOverviewStatusEnum.Completed:
      return "badge-dark-blue";
    case OrderOverviewStatusEnum.Delivery:
      return "badge-dark-blue";
    case OrderOverviewStatusEnum.Ordered:
      return "badge-green";
    case OrderOverviewStatusEnum.Draft:
      return "badge-yellow";
    case OrderOverviewStatusEnum.WaitingOrder:
      return "badge-yellow";
    case OrderOverviewStatusEnum.Reject:
      return "badge-red";
    case OrderOverviewStatusEnum.Canceled:
      return "badge-red";
    default:
      return "badge-yellow";
  }
};

export const getBadgeICharmAdminStatus = (status: OrderOverviewStatusEnum | string) => {
  switch (status) {
    case OrderOverviewStatusEnum.Ordered:
      return "badge-green";
    case OrderOverviewStatusEnum.Step1:
      return "badge-green";
    case OrderOverviewStatusEnum.CustomerConfirmStep2:
      return "badge-orange";
    case OrderOverviewStatusEnum.Completed:
      return "badge-dark-blue";
    case OrderOverviewStatusEnum.Step2:
      return "badge-dark-blue";
    case OrderOverviewStatusEnum.Delivery:
      return "badge-green";
    case OrderOverviewStatusEnum.Reject:
      return "badge-red";
    case OrderOverviewStatusEnum.Canceled:
      return "badge-red";
    case OrderOverviewStatusEnum.Draft:
      return "badge-draft";
    case OrderOverviewStatusEnum.WaitingOrder:
      return "badge-yellow badge-py";
    default:
      return "badge-icharm";
  }
};

export const getBadgeICharmStatus = (status: OrderOverviewStatusEnum | string) => {
  switch (status) {
    case OrderOverviewStatusEnum.Ordered:
      return "badge-purple";
    case OrderOverviewStatusEnum.Step1:
      return "badge-purple";
    case OrderOverviewStatusEnum.CustomerConfirmStep2:
      return "badge-orange";
    case OrderOverviewStatusEnum.Completed:
      return "badge-dark-blue";
    case OrderOverviewStatusEnum.Step2:
      return "badge-orange";
    case OrderOverviewStatusEnum.Delivery:
      return "badge-green";
    case OrderOverviewStatusEnum.Reject:
      return "badge-red";
    case OrderOverviewStatusEnum.Canceled:
      return "badge-red";
    case OrderOverviewStatusEnum.Draft:
      return "badge-yellow";
    case OrderOverviewStatusEnum.WaitingOrder:
      return "badge-green";
    default:
      return "badge-yellow";
  }
};

export const orderICharmAdminEnumToString = (enums: OrderOverviewStatusEnum | string) => {
  switch (enums) {
    case OrderOverviewStatusEnum.CustomerConfirmStep2:
      return i18n.t("FIRST_SET_INSERTED");
    case OrderOverviewStatusEnum.Step1:
      return i18n.t("FIRST_SET");
    case OrderOverviewStatusEnum.Ordered:
      return i18n.t("ACCEPTED");
    case OrderOverviewStatusEnum.Delivery:
      return i18n.t("FIRST_SET_DELIVERED_TABLE");
    case OrderOverviewStatusEnum.Step2:
      return i18n.t("ALL_SETS");
    case OrderOverviewStatusEnum.Completed:
      return i18n.t("ALL_SETS_DELIVERED");
    case OrderOverviewStatusEnum.Reject:
      return i18n.t("REJECTED");
    case OrderOverviewStatusEnum.Canceled:
      return i18n.t("CANCELED");
    case OrderOverviewStatusEnum.WaitingOrder:
      return i18n.t("WAITING_FOR_CONFIRMATION");
    case OrderOverviewStatusEnum.Draft:
      return i18n.t("NEW_CASE_CAPITALIZE");
    default:
      return;
  }
};

export const orderSearchTextToEnum = (text: string) => {
  // NOTE : convert enum from server to String
  switch (text) {
    case "Patient":
      return OrderOverviewSearchByEnum.PatientName;
    case "Clinic / Hospital":
      return DentistStatusSearchEnum.ClinicName;
    case "Dentist":
      return ClinicStatusSearchEnum.DentistName;
    case "Order Id":
      return OrderOverviewSearchByEnum.OrderRef;
    default:
      return OrderOverviewSearchByEnum.All;
  }
};

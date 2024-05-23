import { FC, useEffect, useState } from "react";
import BootstrapTable, { ColumnDescription } from "react-bootstrap-table-next";
import { Badge, Image, Row } from "react-bootstrap";
import SVG from "react-inlinesvg";
import dayjs from "dayjs";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import paginationFactory from "react-bootstrap-table2-paginator";
import './../../../scss/page/case-detail/_caseDetail.scss';

import { UserRoleEnum } from "../../../constants/constant";
import {
  IOrderOverview,
  OrderDetialSelected,
  OrderOverviewStatusEnum,
} from "../../../redux/domains/OrderOverview";
import { cancelOrder } from "../../../redux/actions/order-detail.action";
import { addPrintingOrderList } from "../../../redux/actions/order-overview.action";
import ConfirmModal from "../../ui/confirm-modal.component";
import { GlobalState } from "../../../redux/reducers";
import PATH from "../../../constants/path";
import { history } from "../../../utils/history";
import Ring from "../../../assets/svg/ring.svg";
import {
  getBadgeICharmAdminStatus,
  getBadgeICharmStatus,
  getOrderOverviewBadageStatus,
  orderEnumToString,
  orderICharmAdminEnumToString,
  orderICharmEnumToString,
} from "../../../utils/order-overview-utils/orderOverviewUtils";
import MoreMenu from "../../ui/more-menu.component";

import searchIcon from "../../../assets/svg/search-icon.svg";
import { IMoreMenu } from "../../../redux/type";
import { OrderTypeEnum, ProductDropDownTypeEnum } from "../../../constants/caseManagement";
import { DEFAULT_PAGESIZE } from "../../../constants/paging";
import _ from "lodash";
import i18n from "../../../i18n";
import "../../../scss/components/_badge.scss";
interface IOrderOverviewTable {
  orderList: IOrderOverview[];
  role: UserRoleEnum;
  selectedPage: number;
  onPageChange: (page: number, sizePerPage: number) => void;
  addCase: (orderType: OrderTypeEnum, selectedOrderDetial: OrderDetialSelected) => void;
  hideWarning?: boolean;
  hideAction?: boolean;
  remotePagination?: boolean;
  totalData?: number;
  onSort?: (sortField: string, sortOrder: string) => void;
}

type IOrderOverviewProps = ReturnType<typeof mapStateToProps>;
type IOrderOverviewDispatchStateProps = ReturnType<typeof mapDispatchToProps>;

const OrderOverviewTable: FC<
  IOrderOverviewTable & IOrderOverviewDispatchStateProps & IOrderOverviewProps
> = ({
  orderList = [],
  role,
  cancelOrder,
  addPrintingOrderList,
  isCanceling,
  addCase,
  selectedPage = 1,
  onPageChange = (page: number, sizePerPage: number) => {},
  hideWarning,
  hideAction = false,
  remotePagination,
  totalData,
  onSort,
}) => {
  const [modalVisible, toggle] = useState(false);
  const [cancelId, setCancelId] = useState<number>(-1);
  const [targetRef, setTargetRef] = useState<string>("");

  useEffect(() => {
    if (!isCanceling && modalVisible) {
      toggle(false);
      setCancelId(-1);
      setTargetRef("");
    }
  }, [isCanceling]);

  const paginationOption = {
    alwaysShowAllBtns: false,
    hidePageListOnlyOnePage: true,
    hideSizePerPage: true,
    disablePageTitle: true,
    totalSize: totalData ?? orderList.length, // TODO : use total data from API
    sizePerPage: DEFAULT_PAGESIZE,
    onPageChange: onPageChange,
    page: selectedPage,
    isLoadingReport: false,
  };

  const columns: ColumnDescription[] = [
    {
      // for warning icon
      // isDummyField: true,
      dataField: "isNotification",
      text: "",
      headerClasses: "table-header-column text-right",
      classes: "table-column",
      align: "right",
      headerStyle: { width: "32px" },
      hidden: role !== "Admin",
      formatter: (cell: any, row: IOrderOverview, rowIndex: number, formatExtraData: any) => {
        return row.isNotification === true ? (
          <Image className="pointer mt-1" src={Ring} width="16px" height="16px" />
        ) : (
          ""
        );
      },
    },
    {
      dataField: "status",
      text: i18n.t("STATUS"),
      headerClasses: "table-header-column",
      classes: "table-column",
      headerStyle: { width: "150px" },
      formatter: (cell: any, row: IOrderOverview, rowIndex: number, formatExtraData: any) => {
        {
          return row.productType.toLowerCase() === ProductDropDownTypeEnum.ICharm.toLowerCase() ? (
            <>
              {role !== "Admin" ? (
                <>
                  <div
                    className={"hexa-badge badge-status-table " + getBadgeICharmStatus(row.status)}
                  >
                    {orderICharmEnumToString(row.status)}
                  </div>
                </>
              ) : (
                <div
                  className={
                    "hexa-badge badge-status-table " + getBadgeICharmAdminStatus(row.status)
                  }
                >
                  {orderICharmAdminEnumToString(row.status)}
                </div>
              )}
            </>
          ) : (
            <>
              <div
                className={
                  "hexa-badge badge-status-table " + getOrderOverviewBadageStatus(row.status)
                }
              >
                {orderEnumToString(row.status)}
              </div>
            </>
          );
        }
      },
    },
    {
      dataField: "orderRef",
      text: i18n.t("ORDER_ID"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      headerStyle: { width: "150px" },
      sort: true,
    },
    {
      dataField: "dentistName",
      text: i18n.t("DENTIST"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      hidden: role === "Dentist",
      sort: true,
    },
    {
      dataField: "clinicName",
      text: i18n.t("CLINIC"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      hidden: role === "Clinic",
      sort: true,
    },
    {
      dataField: "patientName",
      text: i18n.t("PATIENT"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
    },
    {
      dataField: "productType",
      text: i18n.t("PRODUCT_TYPE"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
    },
    {
      dataField: "caseType",
      text: i18n.t("CASE_TYPE"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
      formatter: (cell: any, row: IOrderOverview, rowIndex: number, formatExtraData: any) => {
        return <span>{cell && cell === "New Case" ? "Regular" : cell}</span>;
      },
    },
    {
      dataField: "orderDate",
      text: i18n.t("ORDER_DATE"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
      formatter: (cell: any, row: IOrderOverview, rowIndex: number, formatExtraData: any) => {
        return <span>{dayjs(row.orderDate).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      dataField: "requestDeliveryDate",
      text: i18n.t("REQUEST_DELIVERY_DATE"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
      formatter: (cell: any, row: IOrderOverview, rowIndex: number, formatExtraData: any) => {
        return (
          <span>
            {row.requestDeliveryDate ? dayjs(row.requestDeliveryDate).format("DD-MM-YYYY") : "-"}
          </span>
        );
      },
    },
    {
      dataField: "PickupDate",
      text: i18n.t("PICKUP_DATE"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
      formatter: (cell: any, row: IOrderOverview, rowIndex: number, formatExtraData: any) => {
        return <span>{row.pickupDate ? dayjs(row.pickupDate).format("DD-MM-YYYY") : "-"}</span>;
      },
    },
    {
      // info an delete button
      isDummyField: true,
      dataField: "action",
      text: "",
      headerClasses: "table-header-column text-center",
      classes: "table-column",
      headerStyle: { width: "100px" },
      // hidden :  hideAction ?? false,
      formatter: (cell: any, row: IOrderOverview, rowIndex: number, formatExtraData: any) => {
        return (
          <ul className="table-btn-column text-left">
            <Row style={{ justifyContent: "space-evenly" }} className="px-0w mr-0 ml-0">
              {" "}
              {
                <SVG
                  src={searchIcon}
                  width="16"
                  height="16"
                  className="svg-click"
                  onClick={() => {
                    hideAction
                      ? history.push(PATH.ADMIN.ORDER_STATUS_DETAIL_NOINFO + row.orderId)
                      : history.push(PATH.CLIENT.ORDER_OVERVIEW_DETAIL_NOINFO + row.orderId);
                  }}
                ></SVG>
              }
              {!hideAction && renderMenuItem(row)}
            </Row>
          </ul>
        );
      },
    },
  ];

  const cancelOrderAction = () => {
    // toggle;
    cancelOrder(cancelId);
  };

  const renderMenuItem = (data: IOrderOverview) => {
    const order: OrderDetialSelected = {
      orderId: data.orderId,
      orderRef: data.orderRef,
      patientName: data.patientName,
    };

    const isSkipCancel: boolean =
      data.status !== OrderOverviewStatusEnum.Draft &&
      data.status !== OrderOverviewStatusEnum.WaitingOrder;

    const menuList: IMoreMenu[] = addMenuList(isSkipCancel, order);

    return <MoreMenu menuList={menuList}></MoreMenu>;
  };

  const addMenuList = (skipCancelAction: boolean, order: OrderDetialSelected) => {
    if (skipCancelAction) {
      return [
        {
          displayText: i18n.t("CREATE_REMAKE_CASE_FROM_ORDER"),
          params: [],
          onClicked: () => addCase(OrderTypeEnum.Remake, order),
        },
        {
          displayText: i18n.t("CREATE_WARRANTY_CASE_FROM_ORDER"),
          params: [],
          onClicked: () => addCase(OrderTypeEnum.Warranty, order),
        },
      ];
    }

    return [
      {
        displayText: i18n.t("CREATE_REMAKE_CASE_FROM_ORDER"),
        params: [],
        onClicked: () => addCase(OrderTypeEnum.Remake, order),
      },
      {
        displayText: i18n.t("CREATE_WARRANTY_CASE_FROM_ORDER"),
        params: [],
        onClicked: () => addCase(OrderTypeEnum.Warranty, order),
      },
      {
        displayText: i18n.t("CANCEL_ORDER"),
        params: [],
        onClicked: () => {
          toggle(true);
          setCancelId(order.orderId);
          setTargetRef(order.orderRef);
        },
        className: "moreMenuItem__delete",
      },
    ];
  };

  return (
    <>
      <BootstrapTable
        keyField="orderId"
        data={orderList}
        columns={columns}
        classes="table-main hexa-table-fix"
        wrapperClasses="hexa-expand-table"
        bordered={false}
        pagination={paginationFactory(paginationOption)}
        remote={{ pagination: remotePagination ?? false }} // TODO ::::: set to true if you want to get data each page from API
        onTableChange={(type, { sortField, sortOrder, data }) => {
          if (onSort !== undefined) {
            onSort(sortField, sortOrder);
          }
        }}
        selectRow={
          role === UserRoleEnum.Clinic || role === UserRoleEnum.Dentist
            ? {
                mode: "checkbox",
                selected: [],
                hideSelectAll: true,
                onSelect: (row, isSelect, rowIndex, e) => {
                  addPrintingOrderList(row);
                  return true;
                },
              }
            : undefined
        }
        striped
        bootstrap4={true}
      />
      <ConfirmModal
        onCancel={() => {
          toggle(false);
          setCancelId(-1);
        }}
        onConfirm={() => cancelOrderAction()}
        showModal={modalVisible}
        bodyText={
          <span>
            {" "}
            {i18n.t("CONFIRM_CANCEL_ORDER")} {targetRef}
          </span>
        }
        cancelButton={i18n.t("NO")}
        confirmButtonVariant=""
        confirmButton={i18n.t("CANCEL_ORDER")}
        className="primary-btn case-detail__menu_btn-cancel"
        modalTitle={i18n.t("CONFIRMATION")}
        disableComfirm={isCanceling}
      />
    </>
  );
};

const mapStateToProps = (state: GlobalState) => {
  return {
    isCanceling: state.OrderDetail.isCanceling,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      addPrintingOrderList,
      cancelOrder,
    },
    dispatch
  ),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderOverviewTable);

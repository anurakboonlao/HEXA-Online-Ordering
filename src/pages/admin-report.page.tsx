import React from "react";
import { Dropdown, Navbar, Nav, Badge, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { debounce, sortBy, reduce } from "lodash";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import paginationFactory from "react-bootstrap-table2-paginator";
import { CSVLink } from "react-csv";
import { bindActionCreators } from "redux";
import "../scss/components/_badge.scss";
import SideBarContainer from "../components/menu/side-bar.component";
import PageHeader from "../components/page-header.component";
import {
  ClientReportFilterEnum,
  SideMenuOption,
  DatePeriodOptionEnum,
  UserRoleEnum,
} from "../constants/constant";
import {
  OrderOverviewSearchByEnum,
  OrderOverviewStatusEnum,
  OrderSortType,
} from "../redux/domains/OrderOverview";
import { GlobalState } from "../redux/reducers";
import {
  getBadgeICharmAdminStatus,
  getOrderOverviewBadageStatus,
  orderEnumToString,
  orderICharmAdminEnumToString,
} from "../utils/order-overview-utils/orderOverviewUtils";
import { getReportOrders } from "../redux/actions/order-overview.action";

import "../scss/page/case-detail/_caseDetail.scss";

import {
  IOrderExportReport,
  IOrderReport,
  ISelectedAddOn,
  ISelectedProduct,
} from "../redux/domains/OrderReport";
import {
  CaseTypeDropDownEnum,
  castProductTypeToId,
  iCharmGenderEnum,
  MethodEnum,
  ProductDropDownTypeEnum,
  ProductTypeEnum,
} from "../constants/caseManagement";
import DatePeriodFilter from "../components/ui/date-period-filter.component";
import SearchBox from "../components/ui/search.component";
import BootstrapTable, { ColumnDescription } from "react-bootstrap-table-next";
import { DEFAULT_PAGESIZE } from "../constants/paging";
import { getShadeNameFromProductTypeId } from "../utils/caseManagementUtils";

import i18n from "../i18n";
import { IRejectNoteDetail } from "../redux/domains/OrderDetail";
import { getAdminFilterQueryList, OrderStatusFilterClient, orderStatusGroupToString } from "../constants/orderDetail";

type IAdminReportProps = ReturnType<typeof mapStateToProps>;
type IAdminReportDispatchProps = ReturnType<typeof mapDispatchToProps>;

interface IAdminReportStateprops {
  fromDate: Date;
  toDate: Date;
  filterReportList: IOrderReport[];
  selectedStatus: OrderStatusFilterClient;
  selectedCriteria: string;
  searchInputText: string;
  selectedCaseType: CaseTypeDropDownEnum;
  selectedProductType: ProductDropDownTypeEnum;
  selectedMethod: MethodEnum;
  selectedPage: number;
  totalSize: number;
  isShowRejectNote: boolean;
  rejectNote: string | undefined;
}

class AdminReportPage extends React.Component<
  IAdminReportProps & IAdminReportDispatchProps,
  IAdminReportStateprops
> {
  constructor(props: any) {
    super(props);
    this.state = {
      fromDate: dayjs(new Date()).add(-7, "day").toDate(),
      toDate: new Date(),
      filterReportList: this.props.orderReportList,
      selectedStatus: OrderStatusFilterClient.All,
      selectedCriteria: ClientReportFilterEnum.All,
      searchInputText: "",
      selectedCaseType: CaseTypeDropDownEnum.All,
      selectedProductType: ProductDropDownTypeEnum.All,
      selectedMethod: MethodEnum.All,
      selectedPage: 1,
      totalSize: 0,
      isShowRejectNote: false,
      rejectNote: "",
    };
    this.loadData = debounce(this.loadData, 100);
  }

  loadData: any = () => {
    let fromDate = new Date(
      this.state.fromDate.getFullYear(),
      this.state.fromDate.getMonth(),
      this.state.fromDate.getDate(),
      0,
      0,
      0
    );
    let toDate = new Date(
      this.state.toDate.getFullYear(),
      this.state.toDate.getMonth(),
      this.state.toDate.getDate(),
      23,
      59,
      59
    );
    this.props.getReportOrders({
      fromDate: fromDate,
      toDate: toDate,
      status: getAdminFilterQueryList(this.state.selectedStatus),
      searchType: OrderOverviewSearchByEnum.All,
      searchStr: "",
      sortOrder: OrderSortType.None,
      page: 1,
      pageSize: 1,
    });
  };
  filterReport = () => {
    let filterList: IOrderReport[] = this.props.orderReportList;

    if (
      this.state.selectedCaseType !== CaseTypeDropDownEnum.All &&
      this.state.selectedCaseType !== CaseTypeDropDownEnum.Regular
    ) {
      filterList = filterList.filter((value) => value.caseType === this.state.selectedCaseType);
    } else if (this.state.selectedCaseType === CaseTypeDropDownEnum.Regular) {
      filterList = filterList.filter((value) => value.caseType === "New Case");
    }

    if (this.state.selectedMethod !== MethodEnum.All) {
      filterList = filterList.filter((value) => value.method === this.state.selectedMethod);
    }

    if (this.state.selectedProductType !== ProductDropDownTypeEnum.All) {
      filterList = filterList.filter(
        (value) => value.productType === this.state.selectedProductType
      );
    }

    if (this.state.searchInputText !== "") {
      switch (this.state.selectedCriteria) {
        case ClientReportFilterEnum.Patient:
          filterList = filterList.filter((value) =>
            value.patientName.toLowerCase().includes(this.state.searchInputText.toLowerCase())
          );
          break;
        case ClientReportFilterEnum.Clinic:
          filterList = filterList.filter((value) =>
            value.clinicName.toLowerCase().includes(this.state.searchInputText.toLowerCase())
          );
          break;
        case ClientReportFilterEnum.Dentist:
          filterList = filterList.filter((value) =>
            value.dentistName.toLowerCase().includes(this.state.searchInputText.toLowerCase())
          );
          break;
        case ClientReportFilterEnum.OrderRef:
          filterList = filterList.filter((value) =>
            value.orderRef.toLowerCase().includes(this.state.searchInputText.toLowerCase())
          );
          break;
        case ClientReportFilterEnum.Product:
          filterList = this.filterProducts(filterList, this.state.searchInputText);
          break;
        default:
          const otherFilter = filterList.filter(
            (value) =>
              value.patientName.toLowerCase().includes(this.state.searchInputText.toLowerCase()) ||
              value.clinicName.toLowerCase().includes(this.state.searchInputText.toLowerCase()) ||
              value.dentistName.toLowerCase().includes(this.state.searchInputText.toLowerCase()) ||
              value.orderRef.toLowerCase().includes(this.state.searchInputText.toLowerCase()) ||
              value.selectedProducts.filter((product) =>
                product.productName.toLowerCase().includes(this.state.searchInputText.toLowerCase())
              ).length !== 0
          );
          filterList = otherFilter;
      }
    }

    this.setState({ totalSize: filterList.length });
    this.setState({ filterReportList: filterList });
  };

  componentDidUpdate(prevProps: IAdminReportProps, prevState: IAdminReportStateprops) {
    if (JSON.stringify(prevProps.orderReportList) !== JSON.stringify(this.props.orderReportList)) {
      this.setState({
        filterReportList: this.props.orderReportList,
        selectedPage: 1,
      });
      this.filterReport();
    }

    if (
      prevState.fromDate !== this.state.fromDate ||
      prevState.toDate !== this.state.toDate ||
      prevState.selectedStatus !== this.state.selectedStatus
    ) {
      this.setState({ selectedPage: 1 });
      this.loadData();
    }
    if (
      prevState.searchInputText !== this.state.searchInputText ||
      prevState.selectedCriteria !== this.state.selectedCriteria ||
      prevState.selectedMethod !== this.state.selectedMethod ||
      prevState.selectedCaseType !== this.state.selectedCaseType ||
      prevState.selectedProductType !== this.state.selectedProductType
    ) {
      this.setState({ selectedPage: 1 });
      this.filterReport();
    }

    if (prevProps.isReportLoading === true && this.props.isReportLoading === false) {
      if (!this.props.getReportListResult.success) {
        toast.error(this.props.getReportListResult.message);
      }
    }
  }

  filterProducts = (filterList: IOrderReport[], searchInputText: string) => {
    const orders = filterList
      ?.map((list) => ({
        ...list,
        selectedProducts: list.selectedProducts.filter((product) =>
          product.productName.toLowerCase().includes(searchInputText.toLowerCase())
        ),
      }))
      .filter((list) => list.selectedProducts.length !== 0);

    return orders;
  };

  onSelectedCriteria = (value: string) => {
    this.setState({ selectedCriteria: value });
  };

  onSearchKey = (input: string) => {
    this.setState({ searchInputText: input });
  };

  getSelectedCriteriaList = () => {
    let result: { value: string; text: string }[] = [];
    Object.values(ClientReportFilterEnum).forEach((value) => {
      result.push({ value: value, text: value });
    });
    return result;
  };

  onChangeFromDate = (date: Date) => {
    this.setState({ fromDate: date });
  };

  onChangeToDate = (date: Date) => {
    this.setState({ toDate: date });
  };

  setSelectCaseType = (value: CaseTypeDropDownEnum) => {
    this.setState({ selectedCaseType: value });
  };

  setSelectProductType = (value: ProductDropDownTypeEnum) => {
    this.setState({ selectedProductType: value });
    this.loadData();
  };

  setSelectMethod = (value: MethodEnum) => {
    this.setState({ selectedMethod: value });
  };

  csvHeader = [
    { label: i18n.t("STATUS"), key: "status" },
    { label: i18n.t("ORDER_ID"), key: "orderRef" },
    { label: i18n.t("PATIENT"), key: "patientName" },
    { label: i18n.t("AGE"), key: "age" },
    { label: i18n.t("GENDER"), key: "gender" },
    { label: i18n.t("DENTIST"), key: "dentistName" },
    { label: i18n.t("CLINIC_HOSPITAL"), key: "clinicName" },
    { label: i18n.t("CASE_TYPE"), key: "caseType" },
    { label: i18n.t("PRODUCT_TYPE"), key: "productType" },
    { label: i18n.t("METHOD"), key: "method" },
    { label: i18n.t("ARCH_NO"), key: "no" },
    { label: i18n.t("PRODUCT"), key: "productName" },
    { label: i18n.t("MATERIAL"), key: "materialName" },
    { label: i18n.t("DESIGN"), key: "designName" },
    { label: i18n.t("SHADE"), key: "shade" },
    { label: i18n.t("ADD_ON"), key: "addOn" },
    { label: i18n.t("REJECT_NOTE"), key: "note" },
    { label: i18n.t("ORDERED_DATE"), key: "orderDate" },
  ];

  castGenderNumberToString = (gender?: string) => {
    if (gender === iCharmGenderEnum.Male.toString()) {
      return i18n.t("MALE");
    } else if (gender === iCharmGenderEnum.Female.toString()) {
      return i18n.t("FEMALE");
    } else {
      return "";
    }
  };

  createExportModel = (data: IOrderReport[]) => {
    const exportData: IOrderExportReport[] = [];

    data?.forEach((order) => {
      order.selectedProducts?.forEach((product) => {
        const item: IOrderExportReport = {
          status: order.status,
          orderRef: order.orderRef,
          patientName: order.patientName,
          age: product.age,
          gender: this.castGenderNumberToString(product.gender),
          dentistName: order.dentistName,
          clinicName: order.clinicName,
          caseType:
            order.caseType && order.caseType === "New Case" ? i18n.t("REGULAR") : order.caseType,
          productType: order.productType ?? "",
          method: order.method,
          no: product.option ? `${product.no}- ${product.option}` : product.no,
          productName: product.productName,
          materialName: product.materialName,
          designName: product.designName,
          addOn: this.addOnString(product.selectedAddOns),
          orderDate: dayjs(order.orderDate).format("DD-MM-YYYY").toString(),
          note: order.rejectNote.note ?? "-",
          shade: this.shadeStringCombine(product.shade, product.shadeSystem, product.productTypeId),
        };
        exportData.push(item);
      });
    });

    return exportData;
  };

  genFileName = () => {
    return "OnlineSaleReport_" + dayjs(new Date()).format("YYYY_MM_DD_h_mm_ss") + ".csv";
  };

  addOnString = (addOns: ISelectedAddOn[]) => {
    let result: string = "";
    if (addOns && addOns.length > 0) {
      result = reduce(
        addOns,
        (str, addOn) => {
          return str + "|" + (addOn.input ? addOn.addOnName + " " + addOn.input : addOn.addOnName);
        },
        ""
      );
    }
    return result;
  };

  shadeStringCombine = (shade: string, shadeSystem: string, productTypeId: number) => {
    let shadeSystemName: string = getShadeNameFromProductTypeId(productTypeId);

    if (shade === undefined && shadeSystem === undefined) {
      return "";
    }

    if (shade?.length > 0 && shadeSystem.length > 0) {
      return i18n.t("SHADE") + ":" + shade + " | " + shadeSystemName + ":" + shadeSystem;
    } else if (shade?.length > 0) {
      return i18n.t("SHADE") + ":" + shade;
    } else if (shadeSystem?.length > 0) {
      return shadeSystemName + ":" + shadeSystem;
    }

    return "";
  };

  columns: ColumnDescription[] = [
    {
      dataField: "status",
      text: i18n.t("STATUS"),
      headerClasses: "table-header-column",
      classes: "table-column",
      headerStyle: { width: "150px" },
      formatter: (cell: any, row: IOrderReport, rowIndex: number, formatExtraData: any) => {
        return row.productType.toLowerCase() !== ProductDropDownTypeEnum.ICharm.toLowerCase() ? (
          <>
            <div
              className={
                "hexa-badge badge-status-table " + getOrderOverviewBadageStatus(row.statusId)
              }
            >
              {orderEnumToString(row.statusId)}
            </div>
          </>
        ) : (
          <>
            <div
              className={"hexa-badge badge-status-table " + getBadgeICharmAdminStatus(row.statusId)}
            >
              {orderICharmAdminEnumToString(row.statusId)}
            </div>
          </>
        );
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
      dataField: "patientName",
      text: i18n.t("PATIENT"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
      headerStyle: { width: "140px" },
    },
    {
      dataField: "dentistName",
      text: i18n.t("DENTIST"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
      headerStyle: { width: "140px" },
    },
    {
      dataField: "clinicName",
      text: i18n.t("CLINIC_HOSPITAL"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
      headerStyle: { width: "140px" },
    },
    {
      dataField: "caseType",
      text: i18n.t("CASE_TYPE"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
      formatter: (cell: any, row: IOrderReport, rowIndex: number, formatExtraData: any) => {
        return <span>{cell && cell === i18n.t("NEW_CASE") ? i18n.t("REGULAR") : cell}</span>;
      },
      headerStyle: { width: "100px" },
    },
    {
      dataField: "productType",
      text: i18n.t("PRODUCT_TYPE"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
      headerStyle: { width: "100px" },
    },
    {
      dataField: "method",
      text: i18n.t("METHOD"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
      headerStyle: { width: "100px" },
    },
    {
      dataField: "rejectNote",
      text: i18n.t("REJECT_NOTE"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
      headerStyle: { width: "60px" },
      formatter: (row: IRejectNoteDetail, cell: any, rowIndex: number, formatExtraData: any) => {
        if (row.note) {
          return (
            <span
              className="view-reject-button"
              onClick={() => {
                this.setState({
                  isShowRejectNote: true,
                  rejectNote: row.note,
                });
              }}
            >
              {i18n.t("VIEW")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      dataField: "orderDate",
      text: i18n.t("ORDERED_DATE"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
      headerStyle: { width: "100px" },
      formatter: (row: IOrderReport, cell: any, rowIndex: number, formatExtraData: any) => {
        return <span>{dayjs(row.orderDate).format("DD-MM-YYYY")}</span>;
      },
    },
  ];

  productColumnsICharm = () => {
    const columnHeader: ColumnDescription[] = [
      {
        dataField: "productName",
        text: i18n.t("PRODUCT"),
        headerClasses: "table-header-column text-left product-expand-row",
        classes: "table-column",
        align: "left",
      },
      {
        dataField: "age",
        text: i18n.t("AGE"),
        headerClasses: "table-header-column text-left product-expand-row",
        classes: "table-column",
        align: "left",
      },
      {
        dataField: "gender",
        text: i18n.t("GENDER"),
        headerClasses: "table-header-column text-left product-expand-row",
        classes: "table-column",
        formatter: (cell: any) => {
          return <span>{this.castGenderNumberToString(cell)}</span>;
        },
        align: "left",
      },
    ];
    return columnHeader;
  };

  productColumns = (type: string) => {
    let columnHeader: ColumnDescription[];

    if (type !== ProductDropDownTypeEnum.ICharm) {
      console.log("type:" + type);
      columnHeader = [
        {
          dataField: "option",
          text: i18n.t("ARCH_NO"),
          isDummyField: true,
          headerClasses: "table-header-column text-left product-expand-row",
          classes: "table-column",
          align: "left",
          headerStyle: { width: "100px" },
          formatter: (cell: any, row: ISelectedProduct, rowIndex: number, formatExtraData: any) => {
            if (row.option) {
              return <span>{`${row.no}, ${row.option}`}</span>;
            } else {
              return <span>{row.no}</span>;
            }
          },
        },
        {
          dataField: "productName",
          text: i18n.t("PRODUCT"),
          headerClasses: "table-header-column text-left product-expand-row",
          classes: "table-column",
          formatter: (cell: any) => {
            return <span>{cell && cell !== "" ? cell : "-"}</span>;
          },
          align: "left",
        },
        {
          dataField: "materialName",
          text: i18n.t("MATERIAL"),
          headerClasses: "table-header-column text-left product-expand-row",
          classes: "table-column",
          formatter: (cell: any) => {
            return <span>{cell && cell !== "" ? cell : "-"}</span>;
          },
          align: "left",
        },
        {
          dataField: "designName",
          text: i18n.t("DESIGN"),
          headerClasses: "table-header-column text-left product-expand-row",
          classes: "table-column",
          align: "left",
          formatter: (cell: any) => {
            return <span>{cell && cell !== "" ? cell : "-"}</span>;
          },
        },
        {
          dataField: "shade",
          text: i18n.t("SHADE"),
          headerClasses: "table-header-column text-left product-expand-row",
          classes: "table-column",
          align: "left",
          formatter: (row: ISelectedProduct) => {
            return (
              <>
                {row.productType === ProductTypeEnum.CrownAndBridge ||
                row.productType === ProductTypeEnum.Removable ||
                (row.shade && row.shadeSystem) ? (
                  <>
                    {<li>{i18n.t("SHADE") + ": " + (row.shade ? row.shade : "-")}</li>}
                    {
                      <li>
                        {getShadeNameFromProductTypeId(row.productTypeId) +
                          ": " +
                          (row.shadeSystem ? row.shadeSystem : "-")}
                      </li>
                    }
                  </>
                ) : (
                  "-"
                )}
              </>
            );
          },
        },
        {
          dataField: "addOn",
          text: i18n.t("ADD_ON"),
          headerClasses: "table-header-column text-left product-expand-row",
          classes: "table-column addon-list",
          formatter: (row: ISelectedProduct) => {
            if (row && row.selectedAddOns && row.selectedAddOns.length > 0) {
              return (
                <ul className="">
                  {row.selectedAddOns?.map((value, index) => (
                    <li key={row.no + "_addon_" + index}>
                      <span> {value.addOnName + (" " + value.input)}</span>
                    </li>
                  ))}
                </ul>
              );
            } else {
              return <span>-</span>;
            }
          },
          align: "left",
        },
      ];
    } else {
      columnHeader = [
        {
          dataField: "productName",
          text: i18n.t("PRODUCT"),
          headerClasses: "table-header-column text-left product-expand-row",
          classes: "table-column",
          align: "left",
        },
        {
          dataField: "age",
          text: i18n.t("AGE"),
          headerClasses: "table-header-column text-left product-expand-row",
          classes: "table-column",
          align: "left",
        },
        {
          dataField: "gender",
          text: i18n.t("GENDER"),
          headerClasses: "table-header-column text-left product-expand-row",
          classes: "table-column",
          formatter: (cell: any) => {
            console.log("this is cell", cell);
            return <span>{this.castGenderNumberToString(cell)}</span>;
          },
          align: "left",
        },
      ];
    }

    return columnHeader;
  };

  expandRow = {
    parentClassName: "product-expand-row",
    renderer: (row: IOrderReport) => (
      <div style={{ width: "100%" }}>
        <BootstrapTable
          keyField="no"
          data={sortBy(row.selectedProducts, ["option", "no"])}
          columns={this.productColumns(row.productType)}
          classes="table-main"
          bordered={false}
        />
      </div>
    ),
    showExpandColumn: true,
    expandByColumnOnly: true,
  };

  productTypeDropdownItem = (productType: ProductDropDownTypeEnum) => {
    if (
      this.props.userRole !== UserRoleEnum.Admin &&
      productType !== ProductDropDownTypeEnum.All &&
      !this.props.adminProductType.some((pt) => pt === castProductTypeToId(productType))
    ) {
      return <></>;
    }

    return (
      <Dropdown.Item
        eventKey={productType}
        className="dropdown-button-dropdown-item"
        onSelect={() => this.setSelectProductType(productType)}
      >
        {productType}
      </Dropdown.Item>
    );
  };

  render() {
    return (
      <SideBarContainer
        selectedMenu={SideMenuOption.OrderReport}
        userRole={this.props.userRolePermission}
      >
        <div className="p-3">
          {!this.props.isReportLoading && (
            <>
              <PageHeader pageTitle={i18n.t("ORDER_REPORT")} displayAction={false} />
              <Navbar className="top-filter__top-menu">
                <Nav className="top-filter__menu">
                  <Nav.Item className="top-filter__menu-item">
                    <DatePeriodFilter
                      fromDate={this.state.fromDate}
                      toDate={this.state.toDate}
                      setFromDate={this.onChangeFromDate}
                      setToDate={this.onChangeToDate}
                      defaultSelectedOption={DatePeriodOptionEnum.Last7Days}
                    ></DatePeriodFilter>
                  </Nav.Item>
                  <Nav.Item className="top-filter__menu-item">
                    <Dropdown className="dropdown-light ">
                      <Dropdown.Toggle className="border-radius-4" variant="" id="status-filter">
                        {orderStatusGroupToString(this.state.selectedStatus)}
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="dropdown-light-menu">

                    {/* All */}
                      <Dropdown.Item
                        eventKey={OrderStatusFilterClient.All}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => {
                          this.setState({
                            selectedStatus: OrderStatusFilterClient.All,
                          });
                        }}
                      >
                        {orderStatusGroupToString(OrderStatusFilterClient.All)}
                      </Dropdown.Item>

                    {/* Pending */}
                      <Dropdown.Item
                        eventKey={OrderStatusFilterClient.Pending}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => {
                          this.setState({
                            selectedStatus: OrderStatusFilterClient.Pending,
                          });
                        }}
                      >
                        {orderStatusGroupToString(OrderStatusFilterClient.Pending)}
                      </Dropdown.Item>

                    {/* Accepted */}
                      <Dropdown.Item
                        eventKey={OrderStatusFilterClient.Accepted}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => {
                          this.setState({
                            selectedStatus: OrderStatusFilterClient.Accepted,
                          });
                        }}
                      >
                        {orderStatusGroupToString(OrderStatusFilterClient.Accepted)}
                      </Dropdown.Item>

                    {/* Delivered */}
                      <Dropdown.Item
                        eventKey={OrderStatusFilterClient.Delivered}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => {
                          this.setState({
                            selectedStatus: OrderStatusFilterClient.Delivered,
                          });
                        }}
                      >
                        {orderStatusGroupToString(OrderStatusFilterClient.Delivered)}
                      </Dropdown.Item>

                    {/* Completed */}
                      <Dropdown.Item
                        eventKey={OrderStatusFilterClient.Completed}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => {
                          this.setState({
                            selectedStatus: OrderStatusFilterClient.Completed,
                          });
                        }}
                      >
                        {orderStatusGroupToString(OrderStatusFilterClient.Completed)}
                      </Dropdown.Item>

                    {/* Canceled */}
                      <Dropdown.Item
                        eventKey={OrderStatusFilterClient.Canceled}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => {
                          this.setState({
                            selectedStatus: OrderStatusFilterClient.Canceled,
                          });
                        }}
                      >
                        {orderStatusGroupToString(OrderStatusFilterClient.Canceled)}
                      </Dropdown.Item>

                    {/* Rejected */}
                      <Dropdown.Item
                        eventKey={OrderStatusFilterClient.Rejected}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => {
                          this.setState({
                            selectedStatus: OrderStatusFilterClient.Rejected,
                          });
                        }}
                      >
                        {orderStatusGroupToString(OrderStatusFilterClient.Rejected)}
                      </Dropdown.Item>

                    </Dropdown.Menu>
                    </Dropdown>
                  </Nav.Item>

                  <Nav.Item className="top-filter__menu-item">
                    <Dropdown className="dropdown-light ">
                      <Dropdown.Toggle className="border-radius-4" variant="" id="casetype-filter">
                        {this.state.selectedProductType}
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="dropdown-light-menu">
                        {this.productTypeDropdownItem(ProductDropDownTypeEnum.All)}
                        {this.productTypeDropdownItem(ProductDropDownTypeEnum.CrownAndBridge)}
                        {this.productTypeDropdownItem(ProductDropDownTypeEnum.Removable)}
                        {this.productTypeDropdownItem(ProductDropDownTypeEnum.Orthodontic)}
                        {this.productTypeDropdownItem(ProductDropDownTypeEnum.Orthopedic)}
                        {this.productTypeDropdownItem(ProductDropDownTypeEnum.ICharm)}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Nav.Item>

                  <Nav.Item className="top-filter__menu-item">
                    <Dropdown className="dropdown-light ">
                      <Dropdown.Toggle className="border-radius-4" variant="" id="casetype-filter">
                        {this.state.selectedCaseType}
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="dropdown-light-menu">
                        <Dropdown.Item
                          eventKey={CaseTypeDropDownEnum.All}
                          className="dropdown-button-dropdown-item"
                          onSelect={() => this.setSelectCaseType(CaseTypeDropDownEnum.All)}
                        >
                          {CaseTypeDropDownEnum.All}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey={CaseTypeDropDownEnum.Regular}
                          className="dropdown-button-dropdown-item"
                          onSelect={() => this.setSelectCaseType(CaseTypeDropDownEnum.Regular)}
                        >
                          {CaseTypeDropDownEnum.Regular}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey={CaseTypeDropDownEnum.Remake}
                          className="dropdown-button-dropdown-item"
                          onSelect={() => this.setSelectCaseType(CaseTypeDropDownEnum.Remake)}
                        >
                          {CaseTypeDropDownEnum.Remake}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey={CaseTypeDropDownEnum.Warranty}
                          className="dropdown-button-dropdown-item"
                          onSelect={() => this.setSelectCaseType(CaseTypeDropDownEnum.Warranty)}
                        >
                          {CaseTypeDropDownEnum.Warranty}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Nav.Item>

                  <Nav.Item className="top-filter__menu-item">
                    <Dropdown className="dropdown-light ">
                      <Dropdown.Toggle className="border-radius-4" variant="" id="casetype-filter">
                        {this.state.selectedMethod}
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="dropdown-light-menu">
                        <Dropdown.Item
                          eventKey={MethodEnum.All}
                          className="dropdown-button-dropdown-item"
                          onSelect={() => this.setSelectMethod(MethodEnum.All)}
                        >
                          {MethodEnum.All}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey={MethodEnum.Contour}
                          className="dropdown-button-dropdown-item"
                          onSelect={() => this.setSelectMethod(MethodEnum.Contour)}
                        >
                          {MethodEnum.Contour}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey={MethodEnum.Finish}
                          className="dropdown-button-dropdown-item"
                          onSelect={() => this.setSelectMethod(MethodEnum.Finish)}
                        >
                          {MethodEnum.Finish}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey={MethodEnum.Remake}
                          className="dropdown-button-dropdown-item"
                          onSelect={() => this.setSelectMethod(MethodEnum.Remake)}
                        >
                          {MethodEnum.Remake}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey={MethodEnum.SetUpTeeth}
                          className="dropdown-button-dropdown-item"
                          onSelect={() => this.setSelectMethod(MethodEnum.SetUpTeeth)}
                        >
                          {MethodEnum.SetUpTeeth}
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey={MethodEnum.TryIn}
                          className="dropdown-button-dropdown-item"
                          onSelect={() => this.setSelectMethod(MethodEnum.TryIn)}
                        >
                          {MethodEnum.TryIn}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Nav.Item>

                  <Nav.Item className="top-filter__menu-item">
                    <SearchBox
                      onSelectedCriteria={this.onSelectedCriteria}
                      onSearchKey={this.onSearchKey}
                      selectedCaption={i18n.t("SEARCHING_CRITERIA")}
                      inputTextPlaceholder={i18n.t("SEARCH")}
                      searchInputText={this.state.searchInputText}
                      selectedCriteria={this.state.selectedCriteria}
                      selectOption={this.getSelectedCriteriaList()}
                    />
                  </Nav.Item>
                  <Nav.Item className="top-filter__menu-item">
                    <CSVLink
                      className="secondary-btn case-detail__menu_btn export-btn"
                      filename={this.genFileName()}
                      headers={this.csvHeader}
                      data={this.createExportModel(this.state.filterReportList)}
                      target="_blank"
                    >
                      {i18n.t("EXPORT")}
                    </CSVLink>
                  </Nav.Item>
                </Nav>
              </Navbar>

              <div className="">
                <BootstrapTable
                  keyField="rowKey"
                  data={this.state.filterReportList}
                  columns={this.columns}
                  classes="table-main table-report"
                  bordered={false}
                  bootstrap4={true}
                  pagination={paginationFactory({
                    sizePerPage: DEFAULT_PAGESIZE,
                    hideSizePerPage: true,
                    hidePageListOnlyOnePage: true,
                    totalSize: this.state.totalSize,
                    page: this.state.selectedPage,
                  })}
                  expandRow={this.expandRow}
                  // onTableChange={ this.handleTableChange }
                />
              </div>
            </>
          )}
        </div>

        <Modal show={this.state.isShowRejectNote}>
          <Modal.Header closeButton>
            <Modal.Title>{i18n.t("REJECT_NOTE")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.rejectNote}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-primary"
              onClick={() => {
                this.setState({
                  isShowRejectNote: false,
                });
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </SideBarContainer>
    );
  }
}

const mapStateToProps = (state: GlobalState) => {
  return {
    userRole: state.User.payload.role as UserRoleEnum,
    adminProductType: state.User.payload.AdminProductType as number[],
    userRolePermission: state.User.userRolePermission,
    isReportLoading: state.OrderOverview.isReportLoading,
    orderReportList: state.OrderOverview.orderReportList,
    getReportListResult: state.OrderOverview.getReportListResult,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      getReportOrders,
    },
    dispatch
  ),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminReportPage);

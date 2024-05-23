import React from "react";
import { Dropdown, Navbar, Nav } from "react-bootstrap";
import { connect } from "react-redux";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import dayjs from "dayjs";

import i18n from "i18next";

import SideBarContainer from "../components/menu/side-bar.component";
import PageHeader from "../components/page-header.component";
import OrderOverviewTable from "../components/page/order-overview/order-overview-table-component";
import DatePeriodFilter from "../components/ui/date-period-filter.component";
import SearchBox from "../components/ui/search.component";
import {
  DatePeriodOptionEnum,
  SideMenuOption,
  UserRoleEnum,
} from "../constants/constant";
import {
  OrderDetialSelected,
  OrderOverviewSearchByEnum,
  OrderOverviewStatusEnum,
  OrderSortType,
  OverviewSearch,
} from "../redux/domains/OrderOverview";
import { GlobalState } from "../redux/reducers";
import {
  destroyPrintOrderList,
  getOrderOverview,
} from "../redux/actions/order-overview.action";
import {
  orderEnumToString,
  orderSearchEnumToString,
  orderSearchTextToEnum,
} from "../utils/order-overview-utils/orderOverviewUtils";
import {
  OrderTypeEnum,
  ProductDropDownTypeEnum,
  saveDraftCaseDetailModel,
  castProductTypeToId,
  ProductDropDownTypeIdEnum,
} from "../constants/caseManagement";
import { history } from "../utils/history";
import { convertCaseTypeTonumber } from "../utils/caseManagementUtils";
import { saveDraftCase } from "../redux/actions/case.actions";
import PATH from "../constants/path";
import { DEFAULT_PAGESIZE } from "../constants/paging";
import {
  getFilterQueryList,
  OrderStatusFilterClient,
  orderStatusGroupToString,
} from "../constants/orderDetail";

type IOrderOverviewProps = ReturnType<typeof mapStateToProps>;
type IOrderOverviewDispatchProps = ReturnType<typeof mapDispatchToProps>;

interface IOrderOverviewStateprops {
  fromDate: Date;
  toDate: Date;
  selectedStatus: OrderStatusFilterClient;
  selectedCriteria: OverviewSearch;
  searchInputText: string;
  selectedPage: number;
  selectedSortType: OrderSortType;
  selectedProductType: ProductDropDownTypeEnum;
  statusQuery: number[];
}

class OrderOverviewPage extends React.Component<
  IOrderOverviewProps & IOrderOverviewDispatchProps,
  IOrderOverviewStateprops
> {
  constructor(props: any) {
    super(props);
    this.state = {
      fromDate: dayjs(new Date()).add(-7, "day").toDate(),
      toDate: new Date(),
      selectedStatus: OrderStatusFilterClient.All,
      selectedCriteria: OrderOverviewSearchByEnum.All,
      statusQuery: [],
      searchInputText: "",
      selectedPage: 1,
      selectedSortType: OrderSortType.None,
      selectedProductType: ProductDropDownTypeEnum.All,
    };

    // use debounce so when set from/to date in the short time
    this.fetched = debounce(this.fetched, 200);
  }

  fetched: any = () => {
    const state = this.state;
    this.props.getOrderOverview(
      state.fromDate,
      state.toDate,
      getFilterQueryList(state.selectedStatus),
      state.selectedCriteria as OverviewSearch,
      state.searchInputText,
      state.selectedPage,
      DEFAULT_PAGESIZE,
      this.props.selectedContactId,
      state.selectedSortType,
      castProductTypeToId(
        state.selectedProductType ?? ProductDropDownTypeIdEnum.All
      )
    );
  };

  componentWillUnmount() {
    this.props.destroyPrintOrderList();
  }

  componentDidUpdate(
    prevProps: IOrderOverviewProps,
    prevState: IOrderOverviewStateprops
  ) {
    if (
      prevState.toDate !== this.state.toDate ||
      prevState.fromDate !== this.state.fromDate ||
      prevProps.selectedContactId !== this.props.selectedContactId ||
      prevState.selectedCriteria !== this.state.selectedCriteria ||
      prevState.searchInputText !== this.state.searchInputText ||
      prevState.selectedSortType !== this.state.selectedSortType ||
      prevState.selectedStatus !== this.state.selectedStatus ||
      prevState.selectedProductType !== this.state.selectedProductType
    ) {
      this.setState({ selectedPage: 1 });
      // this.setState({ printOrderList: [] });
      this.fetched();
    }

    if (prevProps.isSavingDraft && !this.props.isSavingDraft) {
      if (this.props.newDraftCaseId > 0) {
        // new draft case success

        const path: string =
          PATH.CLIENT.CASE_MANAGEMENT_EDIT_DELETABLE_NOTYPE +
          this.props.newDraftCaseId;
        history.push(path);
      } else {
        toast.error(i18n.t("ERROR_CREATE_NEW_CASE"));
      }
    }
  }

  getOrderWithSortBy = (sortBy: OrderSortType) => {
    this.setState({ selectedSortType: sortBy });
  };

  onSort = (sortField: string, sortOrder: string) => {
    switch (sortField) {
      case "orderRef":
        if (sortOrder === "desc") {
          this.getOrderWithSortBy(OrderSortType.OrderRef_Desc);
        } else {
          this.getOrderWithSortBy(OrderSortType.OrderRef);
        }
        break;
      case "dentistName":
        if (sortOrder === "desc") {
          this.getOrderWithSortBy(OrderSortType.Dentist_Desc);
        } else {
          this.getOrderWithSortBy(OrderSortType.Dentist);
        }
        break;
      case "clinicName":
        if (sortOrder === "desc") {
          this.getOrderWithSortBy(OrderSortType.Clinic_Desc);
        } else {
          this.getOrderWithSortBy(OrderSortType.Clinic);
        }
        break;
      case "patientName":
        if (sortOrder === "desc") {
          this.getOrderWithSortBy(OrderSortType.Patient_Desc);
        } else {
          this.getOrderWithSortBy(OrderSortType.Patient);
        }
        break;
      case "productType":
        if (sortOrder === "desc") {
          this.getOrderWithSortBy(OrderSortType.Product_Desc);
        } else {
          this.getOrderWithSortBy(OrderSortType.Product);
        }
        break;
      case "caseType":
        if (sortOrder === "desc") {
          this.getOrderWithSortBy(OrderSortType.Case_Desc);
        } else {
          this.getOrderWithSortBy(OrderSortType.Case);
        }
        break;
      case "orderDate":
        if (sortOrder === "desc") {
          this.getOrderWithSortBy(OrderSortType.OrderDate_Desc);
        } else {
          this.getOrderWithSortBy(OrderSortType.OrderDate);
        }
        break;
      case "requestDeliveryDate":
        if (sortOrder === "desc") {
          this.getOrderWithSortBy(OrderSortType.RequestDate_Desc);
        } else {
          this.getOrderWithSortBy(OrderSortType.RequestDate);
        }
        break;
      default:
        break;
    }
  };

  getStatusDropDown = () => {
    let result: { value: string; text: string }[] = [];

    for (const key in OrderOverviewSearchByEnum) {
      if (!isNaN(Number(key))) {
        //if (Number(key) === Number(OrderOverviewSearchByEnum.OrderRef)){
        // bofore adding order id drop down , add dentist or clinic (depend on user role)
        // if (this.props.userRole === UserRoleEnum.Dentist) {
        //     result.push({ value: orderSearchEnumToString(DentistStatusSearchEnum.ClinicName)
        //         , text: orderSearchEnumToString(DentistStatusSearchEnum.ClinicName) })
        // }

        // if (this.props.userRole === UserRoleEnum.Clinic) {
        //     result.push({ value: orderSearchEnumToString(ClinicStatusSearchEnum.DentistName)
        //         , text: orderSearchEnumToString(ClinicStatusSearchEnum.DentistName) })
        // }
        // }

        result.push({
          value: orderSearchEnumToString(Number(key)),
          text: orderSearchEnumToString(Number(key)),
        });
      }
    }

    return result;
  };

  addCase = (orderType: OrderTypeEnum, selectedOrder: OrderDetialSelected) => {
    if (!this.props.selectedContactId || this.props.selectedContactId < 1) {
      if (this.props.userRole === UserRoleEnum.Clinic)
        toast.error(i18n.t("PLEASE_SELECT_DENTIST"));
      else toast.error(i18n.t("PLEASE_SELECT_DENTIST"));
    } else {
      // Add Draft Case
      const saveCaseDetailModel: saveDraftCaseDetailModel = {
        caseTypeId: convertCaseTypeTonumber(orderType),
        userId: parseInt(this.props.userId),
        dentistId:
          this.props.userRole === UserRoleEnum.Clinic
            ? this.props.selectedContactId
            : this.props.contactId,
        clinicId:
          this.props.userRole === UserRoleEnum.Dentist
            ? this.props.selectedContactId
            : this.props.contactId,
        orderRef: selectedOrder.orderRef,
        orderId: selectedOrder.orderId,
        patientName: selectedOrder.patientName,
      };
      this.props.saveDraftCase(saveCaseDetailModel);
    }
  };

  // setPrintOrderList = (order: IOrderOverview) => {
  //   const state = this.state.printOrderList;
  //   let printList: IOrderOverview[];

  //   if (state) {
  //     const findDuplicate = state.find((o) => o.orderId === order.orderId);

  //     if (findDuplicate) {
  //       printList = state.filter((o) => o.orderId !== order.orderId);
  //     } else {
  //       printList = [...state, order];
  //     }

  //     printList.sort((a, b) => (a.orderId < b.orderId ? -1 : 1));
  //     this.setState({ printOrderList: printList });
  //   }
  // };

  setFromDate = (selectDate: Date) => {
    this.setState({ fromDate: selectDate });
  };

  setToDate = (selectDate: Date) => {
    this.setState({ toDate: selectDate });
  };

  onPageChange = (page: number, sizePerPage: number) => {
    this.setState({ selectedPage: page });

    const state = this.state;
    this.props.getOrderOverview(
      state.fromDate,
      state.toDate,
      getFilterQueryList(state.selectedStatus),
      state.selectedCriteria as OverviewSearch,
      state.searchInputText,
      page,
      sizePerPage,
      this.props.selectedContactId,
      state.selectedSortType
    );
  };

  setSelectProductType = (value: ProductDropDownTypeEnum) => {
    this.setState({ selectedProductType: value });
  };

  render() {
    return (
      <SideBarContainer
        selectedMenu={SideMenuOption.OrderOverview}
        userRole={this.props.userRolePermission}
      >
        <div className="p-3">
          <PageHeader
            pageTitle={i18n.t("ORDER_OVERVIEW")}
            displayAction={true}
            isDisplayDropdown={true}
          />
          <Navbar className="top-filter__top-menu">
            <Nav className="top-filter__menu">
              <Nav.Item className="top-filter__menu-item">
                <DatePeriodFilter
                  fromDate={this.state.fromDate}
                  toDate={this.state.toDate}
                  setFromDate={this.setFromDate}
                  setToDate={this.setToDate}
                  defaultSelectedOption={DatePeriodOptionEnum.Last7Days}
                  tooltip={i18n.t("FILTER_BY_ORDER_DATE")}
                ></DatePeriodFilter>
              </Nav.Item>

              <Nav.Item className="top-filter__menu-item">
                <Dropdown className="dropdown-light ">
                  <Dropdown.Toggle
                    className="border-radius-4"
                    variant=""
                    id="casetype-filter"
                  >
                    {this.state.selectedProductType}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-light-menu">
                    <Dropdown.Item
                      eventKey={ProductDropDownTypeEnum.All}
                      className="dropdown-button-dropdown-item"
                      onSelect={() =>
                        this.setSelectProductType(ProductDropDownTypeEnum.All)
                      }
                    >
                      {ProductDropDownTypeEnum.All}
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey={ProductDropDownTypeEnum.CrownAndBridge}
                      className="dropdown-button-dropdown-item"
                      onSelect={() =>
                        this.setSelectProductType(
                          ProductDropDownTypeEnum.CrownAndBridge
                        )
                      }
                    >
                      {ProductDropDownTypeEnum.CrownAndBridge}
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey={ProductDropDownTypeEnum.Removable}
                      className="dropdown-button-dropdown-item"
                      onSelect={() =>
                        this.setSelectProductType(
                          ProductDropDownTypeEnum.Removable
                        )
                      }
                    >
                      {ProductDropDownTypeEnum.Removable}
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey={ProductDropDownTypeEnum.Orthodontic}
                      className="dropdown-button-dropdown-item"
                      onSelect={() =>
                        this.setSelectProductType(
                          ProductDropDownTypeEnum.Orthodontic
                        )
                      }
                    >
                      {ProductDropDownTypeEnum.Orthodontic}
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey={ProductDropDownTypeEnum.Orthopedic}
                      className="dropdown-button-dropdown-item"
                      onSelect={() =>
                        this.setSelectProductType(
                          ProductDropDownTypeEnum.Orthopedic
                        )
                      }
                    >
                      {ProductDropDownTypeEnum.Orthopedic}
                    </Dropdown.Item>

                    <Dropdown.Item
                      eventKey={ProductDropDownTypeEnum.ICharm}
                      className="dropdown-button-dropdown-item"
                      onSelect={() =>
                        this.setSelectProductType(
                          ProductDropDownTypeEnum.ICharm
                        )
                      }
                    >
                      {ProductDropDownTypeEnum.ICharm}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Item>

              <Nav.Item className="top-filter__menu-item">
                <Dropdown className="dropdown-light ">
                  <Dropdown.Toggle
                    className="border-radius-4"
                    variant=""
                    id="status-filter"
                  >
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
                <SearchBox
                  onSelectedCriteria={(value: string) => {
                    this.setState({
                      selectedCriteria: orderSearchTextToEnum(value),
                    });
                  }}
                  onSearchKey={(value: string) => {
                    this.setState({ searchInputText: value });
                  }}
                  selectedCaption={i18n.t("SEARCHING_CRITERIA")}
                  inputTextPlaceholder={i18n.t("SEARCH")}
                  searchInputText={this.state.searchInputText}
                  selectedCriteria={orderSearchEnumToString(
                    this.state.selectedCriteria
                  )}
                  selectOption={this.getStatusDropDown()}
                />
              </Nav.Item>
            </Nav>
          </Navbar>
          <OrderOverviewTable
            orderList={this.props.orderList}
            role={this.props.userRole}
            selectedPage={this.state.selectedPage}
            onPageChange={this.onPageChange}
            addCase={(
              type: OrderTypeEnum,
              orderDetial: OrderDetialSelected
            ) => {
              this.addCase(type, orderDetial);
            }}
            remotePagination={true}
            totalData={this.props.totalOrder}
            onSort={this.onSort}
          />
        </div>
      </SideBarContainer>
    );
  }
}

const mapStateToProps = (state: GlobalState) => {
  return {
    userRolePermission: state.User.userRolePermission,
    userRole: state.User.payload.role as UserRoleEnum,
    selectedContactId: state.User.selectedContactId
      ? state.User.selectedContactId
      : 0,
    userId: state.User.payload.Id,
    contactId: Number(state.User.payload.ContactId),

    isSavingDraft: state.Case.savingDraft,
    newDraftCaseId: state.Case.newDraftCaseId,
    orderList: state.OrderOverview.orderList,
    totalOrder: state.OrderOverview.totalOrder,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      getOrderOverview,
      saveDraftCase,
      destroyPrintOrderList,
    },
    dispatch
  ),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderOverviewPage);

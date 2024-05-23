//@ts-nocheck
import React from "react";
import { connect } from "react-redux";
import { Dropdown, Nav, Navbar } from "react-bootstrap";
import { bindActionCreators } from "redux";
import dayjs from "dayjs";
import { debounce } from "lodash";

import {
  DatePeriodOptionEnum,
  SideMenuOption,
  UserRoleEnum,
} from "../constants/constant";
import {
  ClinicStatusSearchEnum,
  DentistStatusSearchEnum,
  OrderOverviewSearchByEnum,
  OrderOverviewStatusEnum,
  OrderSortType,
  OverviewSearch,
  IOrderOverview,
} from "../redux/domains/OrderOverview";
import {
  ProductDropDownTypeIdEnum,
  ProductDropDownTypeEnum,
  castProductTypeToId,
} from "../constants/caseManagement";

import { GlobalState } from "../redux/reducers";
import SideBarContainer from "../components/menu/side-bar.component";
import { OrderFilter } from "../redux/domains/OrderOverview";
import PageHeader from "../components/page-header.component";
import DatePeriodFilter from "../components/ui/date-period-filter.component";
import {
  orderSearchEnumToString,
  orderSearchTextToEnum,
} from "../utils/order-overview-utils/orderOverviewUtils";
import { getAllOrders } from "../redux/actions/order-overview.action";
import SearchBox from "../components/ui/search.component";
import OrderOverviewTable from "../components/page/order-overview/order-overview-table-component";
import { DEFAULT_PAGESIZE } from "../constants/paging";
import i18n from "../i18n";
import { getAdminFilterQueryList, OrderStatusAdminFilterGroup, OrderStatusFilterClient, orderStatusGroupToString } from "../constants/orderDetail";

interface IAdminOrderStatusState {
  fromDate: Date;
  toDate: Date;
  selectedStatus: OrderStatusFilterClient;
  selectedCriteria: OverviewSearch;
  searchInputText: string;
  selectedPage: number;
  selectedSortType: OrderSortType;
  pageSize: number;
  orderFilterList: any;
  selectedProductType: ProductDropDownTypeEnum;
  selectedProductTypeId: ProductDropDownTypeIdEnum;
}

type IAdminOrderStatusStateProps = ReturnType<typeof mapStateToProps>;
type IAdminOrderStatusDispatchProps = ReturnType<typeof mapDispatchToProps>;

class AdminOrderStatusPage extends React.Component<
  IAdminOrderStatusStateProps & IAdminOrderStatusDispatchProps,
  IAdminOrderStatusState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      fromDate: dayjs(new Date()).add(-7, "day").toDate(),
      toDate: new Date(),
      selectedStatus: OrderStatusFilterClient.All,
      selectedCriteria: OrderOverviewSearchByEnum.All,
      searchInputText: "",
      selectedPage: 1,
      pageSize: DEFAULT_PAGESIZE,
      selectedSortType: OrderSortType.None,
      selectedProductType: ProductDropDownTypeEnum.All,
      orderFilterList: props.orderList,
      selectedProductTypeId: ProductDropDownTypeIdEnum.All,
    };

    // use debounce so when set from/to date in the short time
    this.fetched = debounce(this.fetched, 200);
  }

  componentDidUpdate(
    prevProps: IAdminOrderStatusStateProps,
    prevState: IAdminOrderStatusState
  ) {
    if (
      prevState.toDate !== this.state.toDate ||
      prevState.fromDate !== this.state.fromDate
    ) {
      this.fetched();
    }

    if (
      prevState.searchInputText !== this.state.searchInputText ||
      prevState.selectedStatus !== this.state.selectedStatus
    ) {
      // if change search text reset page to 1
      this.setState({ selectedPage: 1 });
    }
  }

  onPageChange = (page: number, pageSize: number) => {
    this.setState({ selectedPage: page, pageSize: pageSize });
    this.fetched();
  };

  fetched: any = () => {
    const state = this.state;
    // @ts-ignore
    const orderFilter: OrderFilter = {
      fromDate: state.fromDate,
      toDate: state.toDate,
      status: getAdminFilterQueryList(state.selectedStatus),
      searchType: state.selectedCriteria,
      searchStr: state.searchInputText,
      sortOrder: state.selectedSortType,
      page: state.selectedPage,
      pageSize: DEFAULT_PAGESIZE,
      productTypeId: state.selectedProductTypeId,
    };

    this.props.getAllOrders(orderFilter);
  };

  setSelectProductType = (value: ProductDropDownTypeEnum) => {
    const produceTypeId = castProductTypeToId(value);
    this.setState({
      selectedProductType: value,
      selectedProductTypeId: produceTypeId,
    });
    this.fetched();
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
        if (Number(key) === Number(OrderOverviewSearchByEnum.OrderRef)) {
          // bofore adding order id drop down , add dentist or clinic (depend on user role)
          result.push({
            value: orderSearchEnumToString(DentistStatusSearchEnum.ClinicName),
            text: orderSearchEnumToString(DentistStatusSearchEnum.ClinicName),
          });

          result.push({
            value: orderSearchEnumToString(ClinicStatusSearchEnum.DentistName),
            text: orderSearchEnumToString(ClinicStatusSearchEnum.DentistName),
          });
        }

        result.push({
          value: orderSearchEnumToString(Number(key)),
          text: orderSearchEnumToString(Number(key)),
        });
      }
    }

    return result;
  };

  setFromDate = (selectDate: Date) => {
    this.setState({ fromDate: selectDate, selectedPage: 1 });
  };

  setToDate = (selectDate: Date) => {
    this.setState({ toDate: selectDate, selectedPage: 1 });
  };

  getOrderWithSortBy = (sortBy: OrderSortType) => {
    this.setState({ selectedSortType: sortBy });
    this.fetched();
  };

  setPrintOrderList = (order: IOrderOverview) => {
    console.log(order);
  };

  productTypeDropdownItem = (productType: ProductDropDownTypeEnum) => {
    if (
      this.props.userRole !== UserRoleEnum.Admin &&
      productType !== ProductDropDownTypeEnum.All &&
      !this.props.adminProductType.some(
        (pt) => pt === castProductTypeToId(productType)
      )
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
        selectedMenu={SideMenuOption.OrderStatus}
        userRole={this.props.userRolePermission}
      >
        <div>
          <div className="p-3">
            <PageHeader
              pageTitle={i18n.t("ORDER_STATUS")}
              displayAction={false}
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
                      {this.productTypeDropdownItem(
                        ProductDropDownTypeEnum.All
                      )}
                      {this.productTypeDropdownItem(
                        ProductDropDownTypeEnum.CrownAndBridge
                      )}
                      {this.productTypeDropdownItem(
                        ProductDropDownTypeEnum.Removable
                      )}
                      {this.productTypeDropdownItem(
                        ProductDropDownTypeEnum.Orthodontic
                      )}
                      {this.productTypeDropdownItem(
                        ProductDropDownTypeEnum.Orthopedic
                      )}
                      {this.productTypeDropdownItem(
                        ProductDropDownTypeEnum.ICharm
                      )}
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
                          this.fetched();
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
                          this.fetched();
                          this.setState({
                            selectedStatus: OrderStatusFilterClient.Pending,
                          });
                        }}
                      >
                        {orderStatusGroupToString(
                          OrderStatusFilterClient.Pending
                        )}
                      </Dropdown.Item>

                      {/* Accepted */}
                      <Dropdown.Item
                        eventKey={OrderStatusFilterClient.Accepted}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => {
                          this.fetched();
                          this.setState({
                            selectedStatus: OrderStatusFilterClient.Accepted,
                          });
                        }}
                      >
                        {orderStatusGroupToString(
                          OrderStatusFilterClient.Accepted
                        )}
                      </Dropdown.Item>

                      {/* Delivered */}
                      <Dropdown.Item
                        eventKey={OrderStatusFilterClient.Delivered}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => {
                          this.fetched();
                          this.setState({
                            selectedStatus: OrderStatusFilterClient.Delivered,
                          });
                        }}
                      >
                        {orderStatusGroupToString(
                          OrderStatusFilterClient.Delivered
                        )}
                      </Dropdown.Item>

                      {/* Completed */}
                      <Dropdown.Item
                        eventKey={OrderStatusFilterClient.Completed}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => {
                          this.fetched();
                          this.setState({
                            selectedStatus: OrderStatusFilterClient.Completed,
                          });
                        }}
                      >
                        {orderStatusGroupToString(
                          OrderStatusFilterClient.Completed
                        )}
                      </Dropdown.Item>

                      {/* Canceled */}
                      <Dropdown.Item
                        eventKey={OrderStatusFilterClient.Canceled}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => {
                          this.fetched();
                          this.setState({
                            selectedStatus: OrderStatusFilterClient.Canceled,
                          });
                        }}
                      >
                        {orderStatusGroupToString(
                          OrderStatusFilterClient.Canceled
                        )}
                      </Dropdown.Item>

                      {/* Rejected */}
                      <Dropdown.Item
                        eventKey={OrderStatusFilterClient.Rejected}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => {
                          this.fetched();
                          this.setState({
                            selectedStatus: OrderStatusFilterClient.Rejected,
                          });
                        }}
                      >
                        {orderStatusGroupToString(
                          OrderStatusFilterClient.Rejected
                        )}
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
                      this.fetched();
                      this.setState({ searchInputText: value });
                    }}
                    selectedCaption={i18n.t("SEARCHING_CRIRERIA")}
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
              addCase={() => {}}
              hideAction={true}
              hideWarning={true}
              remotePagination={true}
              totalData={this.props.totalOrderList}
              onSort={this.onSort}
            />
          </div>
        </div>
      </SideBarContainer>
    );
  }
}

const mapStateToProps = (state: GlobalState) => {
  return {
    userRolePermission: state.User.userRolePermission,
    userRole: state.User.payload.role as UserRoleEnum,
    adminProductType: state.User.payload.AdminProductType as number[],
    isLoadingAllList: state.OrderOverview.isLoadingAllList,
    orderList: state.OrderOverview.allOrderList,
    totalOrderList: state.OrderOverview.totalOrderList,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      getAllOrders,
    },
    dispatch
  ),
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminOrderStatusPage);

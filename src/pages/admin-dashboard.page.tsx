import React, { Suspense } from "react";
import { GlobalState } from "../redux/reducers";
import { connect } from "react-redux";
import dayjs from "dayjs";
import { bindActionCreators } from "redux";
import { sumBy } from "lodash";
import SVG from "react-inlinesvg";

import PageHeader from "../components/page-header.component";
import SideBarContainer from "../components/menu/side-bar.component";
import { SideMenuOption, DatePeriodOptionEnum } from "../constants/constant";
import { IDashboardModel } from "../redux/domains/Dashboard";
import { ICallbackResult } from "../redux/type";
import { filterAdminDashboard } from "../redux/actions/admin.actions";
import DailyStatisticsLineChart from "../components/dashboard/daily-statistics-line-chart.component";
import ProductTypeBarChart from "../components/dashboard/product-type-bar-chart.component";
import DatePeriodFilter from "../components/ui/date-period-filter.component";

import "../scss/page/dashboard-page/_dashboard.scss";
import deliveredIcon from "../assets/svg/delivered_icon.svg";
import totalIcon from "../assets/svg/total_icon.svg";
import pendingIcon from "../assets/svg/pending_icon.svg";
import checkIcon from "../assets/svg/check_icon.svg";
import closeIcon from "../assets/svg/close_icon.svg";
import i18n from "../i18n";

interface IAdminDashboardProps {
  userRolePermission: number;
  filteringAdminDashboard: boolean;
  filterAdminDashboardResult: ICallbackResult;
  adminDashboardData: IDashboardModel;
}

interface IAdminDashboardStateProps {
  fromDate: Date;
  toDate: Date;
  productChartHeight: number;
}

interface IAdminDashboardDispatchProps {
  filterAdminDashboard: typeof filterAdminDashboard;
}

const today: Date = new Date();
class AdminDashboard extends React.Component<
  IAdminDashboardProps & IAdminDashboardDispatchProps,
  IAdminDashboardStateProps
> {
  constructor(porps: any) {
    super(porps);
    this.state = {
      fromDate: dayjs(today).add(-7, "day").toDate(),
      toDate: today,
      productChartHeight: 0,
    };
  }

  componentDidUpdate(prevProps: IAdminDashboardProps, prevState: IAdminDashboardStateProps) {
    if (prevState.toDate !== this.state.toDate || prevState.fromDate !== this.state.fromDate) {
      this.props.filterAdminDashboard(this.state.fromDate, this.state.toDate);
    }
  }

  setProductChatHeight = (height: number) => {
    this.setState({ productChartHeight: height });
  };

  onChangeFromDate = (date: Date) => {
    this.setState({ fromDate: date });
  };

  onChangeToDate = (date: Date) => {
    this.setState({ toDate: date });
  };

  getOrderDelivered = (dashboard: IDashboardModel) => {
    return sumBy(dashboard?.orderCounts, (o) => {
      return o.deliveredCount;
    });
  };

  getOrderPending = (dashboard: IDashboardModel) => {
    return sumBy(dashboard?.orderCounts, (o) => {
      return o.pendingCount;
    });
  };

  getOrderAccepted = (dashboard: IDashboardModel) => {
    return sumBy(dashboard?.orderCounts, (o) => {
      return o.acceptedCount;
    });
  };

  getOrderRejected = (dashboard: IDashboardModel) => {
    return sumBy(dashboard?.orderCounts, (o) => {
      return o.rejectedCount;
    });
  };

  getOrderTotal = (dashboard: IDashboardModel) => {
    return sumBy(dashboard?.orderCounts, (o) => {
      return o.totalCount;
    });
  };

  getCaseTotal = (dashboard: IDashboardModel) => {
    return sumBy(dashboard?.caseCounts, (o) => {
      return o.caseCount;
    });
  };

  drowStatusAndFilter = () => {
    const { adminDashboardData } = this.props;
    return (
      <div className="col-12 col-xl-5">
        <div className="dashboard__date-filter">
          <DatePeriodFilter
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
            setFromDate={this.onChangeFromDate}
            setToDate={this.onChangeToDate}
            defaultSelectedOption={DatePeriodOptionEnum.Last7Days}
          ></DatePeriodFilter>
        </div>
        <div className="dashboard__status-bar">
          <div className="dashboard__status-icon total-color">
            <SVG src={totalIcon} width="22" height="22"></SVG>
          </div>
          <div className="dashboard__status-detail">
            <div className="dashboard__status-title total-text-color">{i18n.t("TOTAL_ORDER")}</div>
            <div className="dashboard__status-value total-text-color">
              {this.getOrderTotal(adminDashboardData)}
            </div>
          </div>
        </div>
        <div className="dashboard__status-bar">
          <div className="dashboard__status-icon delivered-color">
            <SVG src={deliveredIcon} width="28" height="28"></SVG>
          </div>
          <div className="dashboard__status-detail">
            <div className="dashboard__status-title delivered-text-color">
              {i18n.t("DELIVERED")}
            </div>
            <div className="dashboard__status-value delivered-text-color">
              {this.getOrderDelivered(adminDashboardData)}
            </div>
          </div>
        </div>
        <div className="dashboard__status-bar">
          <div className="dashboard__status-icon accepted-color">
            <SVG src={checkIcon} width="28" height="28"></SVG>
          </div>
          <div className="dashboard__status-detail">
            <div className="dashboard__status-title accepted-text-color">{i18n.t("ACCEPTED")}</div>
            <div className="dashboard__status-value accepted-text-color">
              {this.getOrderAccepted(adminDashboardData)}
            </div>
          </div>
        </div>
        <div className="dashboard__status-bar">
          <div className="dashboard__status-icon pending-color">
            <SVG src={pendingIcon} width="28" height="28"></SVG>
          </div>
          <div className="dashboard__status-detail">
            <div className="dashboard__status-title pending-text-color">{i18n.t("PENDING")}</div>
            <div className="dashboard__status-value pending-text-color">
              {this.getOrderPending(adminDashboardData)}
            </div>
          </div>
        </div>

        <div className="dashboard__status-bar">
          <div className="dashboard__status-icon cancel-color">
            <SVG src={closeIcon} width="28" height="28"></SVG>
          </div>
          <div className="dashboard__status-detail">
            <div className="dashboard__status-title cancel-text-color">{i18n.t("REJECTED")}</div>
            <div className="dashboard__status-value cancel-text-color">
              {this.getOrderRejected(adminDashboardData)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <SideBarContainer
        selectedMenu={SideMenuOption.AdminDashboard}
        userRole={this.props.userRolePermission}
      >
        <div>
          <div className="p-3">
            <PageHeader pageTitle={i18n.t("DASHBOARD")} displayAction={false} />
            <div className="row">
              {this.drowStatusAndFilter()}
              <div className="col-12 col-xl-7 h-100">
                {!this.props.filteringAdminDashboard && (
                  <ProductTypeBarChart
                    dashboardModel={this.props.adminDashboardData}
                    chartSize={{ chartClassName: "product-manual-size" }}
                    productChartHeight={this.state.productChartHeight}
                    setProductChartHeight={this.setProductChatHeight}
                  ></ProductTypeBarChart>
                )}
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <DailyStatisticsLineChart
                  dashboardModel={this.props.adminDashboardData}
                  disabledTotalCase={true}
                  chartSize={{ chartClassName: "line-manual-size" }}
                ></DailyStatisticsLineChart>
              </div>
            </div>
          </div>
        </div>
      </SideBarContainer>
    );
  }
}

const mapStateToProps = (state: GlobalState) => {
  const { filteringAdminDashboard, filterAdminDashboardResult, adminDashboardData } = state.Admin;
  return {
    filteringAdminDashboard: filteringAdminDashboard,
    filterAdminDashboardResult: filterAdminDashboardResult,
    adminDashboardData: adminDashboardData,
    userRolePermission: state.User.userRolePermission,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      filterAdminDashboard,
    },
    dispatch
  ),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);

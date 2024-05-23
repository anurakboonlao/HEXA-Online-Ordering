import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SVG from 'react-inlinesvg';
import { Carousel } from 'react-bootstrap';
import dayjs from 'dayjs';
import { sumBy } from 'lodash';


import PageHeader from '../components/page-header.component';
import { filterClientDashboard } from '../redux/actions/home.actions';
import { GlobalState } from '../redux/reducers';
import SideBarContainer from '../components/menu/side-bar.component';
import { SideMenuOption, DatePeriodOptionEnum } from '../constants/constant';
import DatePeriodFilter from '../components/ui/date-period-filter.component';
import ProductTypeBarChart from '../components/dashboard/product-type-bar-chart.component';
import DailyStatisticsLineChart from '../components/dashboard/daily-statistics-line-chart.component';
import { ICallbackResult } from '../redux/type';
import { IDashboardModel } from '../redux/domains/Dashboard';


import '../scss/page/dashboard-page/_dashboard.scss';
import deliveredIcon from '../assets/svg/delivered_icon.svg';
import totalIcon from '../assets/svg/total_icon.svg';
import pendingIcon from '../assets/svg/pending_icon.svg';
import checkIcon from '../assets/svg/check_icon.svg';
import closeIcon from '../assets/svg/close_icon.svg';
import { IAdvertise } from '../redux/domains/Advertise';
import i18n from '../i18n';


interface IHomeProps {
    welcomeMessage: string;
    counter: number;
    userRolePermission: number;
    filteringClientDashboard: boolean;
    filterClientDashboardResult: ICallbackResult;
    clientDashboardData: IDashboardModel;
    advertisements: IAdvertise[];
    selectedContactId: number;
    isLoadingData: boolean;
}

interface IHomStateProps {
    fromDate: Date;
    toDate: Date;
    productChartHeight: number;
}

interface IHomeDispatchProps {
    filterClientDashboard: typeof filterClientDashboard;
}

const today: Date = new Date();
class HomePage extends React.Component<IHomeProps & IHomeDispatchProps, IHomStateProps> {

    constructor(porps: any) {
        super(porps);
        this.state = {
            fromDate: (dayjs(today).add(-7, 'day')).toDate(),
            toDate: today,
            productChartHeight:0
        }
    }

    componentDidUpdate(prevProps: IHomeProps, prevState: IHomStateProps) {
        if (prevState.toDate !== this.state.toDate || prevState.fromDate !== this.state.fromDate || prevProps.selectedContactId !== this.props.selectedContactId) {
            this.props.filterClientDashboard(
                this.state.fromDate
                , this.state.toDate
                , this.props.selectedContactId);
        }
    }

    setProductChatHeight = (height:number) =>{
        this.setState({ productChartHeight: height });
    }

    onChangeFromDate = (date: Date) => {
        this.setState({ fromDate: date })
    }

    onChangeToDate = (date: Date) => {
        this.setState({ toDate: date })
    }

    getOrderDelivered = (dashboard: IDashboardModel) => {
        return sumBy(dashboard?.orderCounts, (o) => { return o.deliveredCount; });
    }

    getOrderPending = (dashboard: IDashboardModel) => {
        return sumBy(dashboard?.orderCounts, (o) => { return o.pendingCount; });
    }

    getOrderAccepted = (dashboard: IDashboardModel) => {
        return sumBy(dashboard?.orderCounts, (o) => { return o.acceptedCount; });
    }

    getOrderCanceled = (dashboard: IDashboardModel) => {
        return sumBy(dashboard?.orderCounts, (o) => { return o.rejectedCount; });
    }

    getOrderTotal = (dashboard: IDashboardModel) => {
        return sumBy(dashboard?.orderCounts, (o) => { return o.totalCount; });
    }

    getCaseTotal = (dashboard: IDashboardModel) => {
        return sumBy(dashboard?.caseCounts, (o) => { return o.caseCount; });
    }


    drowStatusAndFilter = (showInPc: boolean) => {
        const { clientDashboardData } = this.props;
        return (
            <div className={(showInPc ? "d-none d-xl-block col-12 col-lg-5" : "d-lg-block d-xl-none col-12 mt-3")}>
                <div className="dashboard__date-filter">
                    <DatePeriodFilter fromDate={this.state.fromDate} toDate={this.state.toDate} setFromDate={this.onChangeFromDate} setToDate={this.onChangeToDate} defaultSelectedOption={DatePeriodOptionEnum.Last7Days} ></DatePeriodFilter>
                </div>

                {
                    showInPc?
                    <div className="row">
                        <div className="col-6">
                            <div className="dashboard__status-bar">
                                <div className="dashboard__status-icon delivered-color">
                                    <SVG src={deliveredIcon} width="28" height="28"></SVG>
                                </div>
                                <div className="dashboard__status-detail">
                                    <div className="dashboard__status-title delivered-text-color">
                                        {i18n.t("DELIVERED")}
                                    </div>
                                    <div className="dashboard__status-value delivered-text-color">
                                        {this.getOrderDelivered(clientDashboardData)}
                                    </div>
                                </div>
                            </div>

                            <div className="dashboard__status-bar">
                                <div className="dashboard__status-icon accepted-color">
                                    <SVG src={checkIcon} width="28" height="28"></SVG>
                                </div>
                                <div className="dashboard__status-detail">
                                    <div className="dashboard__status-title accepted-text-color">
                                        {i18n.t("ACCEPTED")}
                                    </div>
                                    <div className="dashboard__status-value accepted-text-color">
                                        {this.getOrderAccepted(clientDashboardData)}
                                    </div>
                                </div>
                            </div>

                            <div className="dashboard__status-bar">
                                <div className="dashboard__status-icon pending-color">
                                    <SVG src={pendingIcon} width="28" height="28"></SVG>
                                </div>
                                <div className="dashboard__status-detail">
                                    <div className="dashboard__status-title pending-text-color">
                                        {i18n.t("PENDING")}
                                    </div>
                                    <div className="dashboard__status-value pending-text-color">
                                        {this.getOrderPending(clientDashboardData)}
                                    </div>
                                </div>
                            </div>

                            <div className="dashboard__status-bar">
                                <div className="dashboard__status-icon cancel-color">
                                    <SVG src={closeIcon} width="28" height="28"></SVG>
                                </div>
                                <div className="dashboard__status-detail">
                                    <div className="dashboard__status-title cancel-text-color">
                                        {i18n.t("REJECTED")}
                                    </div>
                                    <div className="dashboard__status-value cancel-text-color">
                                        {this.getOrderCanceled(clientDashboardData)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="dashboard__status-bar">
                                <div className="dashboard__status-icon total-color">
                                    <SVG src={totalIcon} width="22" height="22"></SVG>
                                </div>
                                <div className="dashboard__status-detail">
                                    <div className="dashboard__status-title total-text-color">
                                        {i18n.t("TOTAL_CASE")}
                                    </div>
                                    <div className="dashboard__status-value total-text-color">
                                        {this.getCaseTotal(clientDashboardData)}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    :
                    <>
                     <div className="dashboard__status-bar">
                        <div className="dashboard__status-icon total-color">
                            <SVG src={totalIcon} width="22" height="22"></SVG>
                        </div>
                        <div className="dashboard__status-detail">
                            <div className="dashboard__status-title total-text-color">
                                {i18n.t("TOTAL_CASE")}
                            </div>
                            <div className="dashboard__status-value total-text-color">
                                {this.getCaseTotal(clientDashboardData)}
                            </div>
                        </div>
                    </div>
                    <div className="dashboard__status-bar">
                        <div className="dashboard__status-icon delivered-color">
                            <SVG src={deliveredIcon} width="28" height="28"></SVG>
                        </div>
                        <div className="dashboard__status-detail">
                            <div className="dashboard__status-title delivered-text-color">
                                {i18n.t("DElIVERED")}
                            </div>
                            <div className="dashboard__status-value delivered-text-color">
                                {this.getOrderDelivered(clientDashboardData)}
                            </div>
                        </div>
                    </div>
                    <div className="dashboard__status-bar">
                        <div className="dashboard__status-icon accepted-color">
                            <SVG src={checkIcon} width="28" height="28"></SVG>
                        </div>
                        <div className="dashboard__status-detail">
                            <div className="dashboard__status-title accepted-text-color">
                                {i18n.t("ACCEPTED")}
                            </div>
                            <div className="dashboard__status-value accepted-text-color">
                                {this.getOrderAccepted(clientDashboardData)}
                            </div>
                        </div>
                    </div>

                    <div className="dashboard__status-bar">
                        <div className="dashboard__status-icon pending-color">
                            <SVG src={pendingIcon} width="28" height="28"></SVG>
                        </div>
                        <div className="dashboard__status-detail">
                            <div className="dashboard__status-title pending-text-color">
                                {i18n.t("PENDING")}
                            </div>
                            <div className="dashboard__status-value pending-text-color">
                                {this.getOrderPending(clientDashboardData)}
                            </div>
                        </div>
                    </div>

                    <div className="dashboard__status-bar">
                        <div className="dashboard__status-icon cancel-color">
                            <SVG src={closeIcon} width="28" height="28"></SVG>
                        </div>
                        <div className="dashboard__status-detail">
                            <div className="dashboard__status-title cancel-text-color">
                                {i18n.t("REJECTED")}
                            </div>
                            <div className="dashboard__status-value cancel-text-color">
                                {this.getOrderCanceled(clientDashboardData)}
                            </div>
                        </div>
                    </div>
                </>
                }
            </div>
        )
    }

    render() {

        const { advertisements } = this.props;

        return (
            <SideBarContainer selectedMenu={SideMenuOption.Dashboard} userRole={this.props.userRolePermission}>
                <div>
                    <div className="p-3">
                    <PageHeader pageTitle={i18n.t("DASHBOARD")} displayAction={true} isDisplayDropdown={true} />
                        <div className="row">
                            {this.drowStatusAndFilter(true)}
                            <div className="col-12 col-xl-7">
                                <Carousel id="home-ads">
                                    {
                                        advertisements.map((adsItem: IAdvertise, i: number) => <Carousel.Item interval={1000}
                                        key= {'adds_'+i}>
                                            <img

                                                className="d-block w-100"
                                                src={adsItem.url}
                                                alt={`${i18n.t("ADVERTISEMENT")}-${i}`}
                                            />
                                        </Carousel.Item>)
                                    }
                                </Carousel>

                            </div>
                            {this.drowStatusAndFilter(false)}
                        </div>

                        <div className="row">
                            <div className="col-12 col-xl-6 mt-3">
                             { !this.props.isLoadingData && <ProductTypeBarChart dashboardModel={this.props.clientDashboardData} chartSize={{chartClassName:"product-client-size"}} productChartHeight={this.state.productChartHeight} setProductChartHeight={this.setProductChatHeight} ></ProductTypeBarChart> }
                            </div>
                            <div className="col-12 col-xl-6 mt-3">
                                <DailyStatisticsLineChart dashboardModel={this.props.clientDashboardData} chartSize={{chartClassName:"line-client-size"}} productChartHeight={this.state.productChartHeight}></DailyStatisticsLineChart>
                            </div>
                        </div>
                    </div>
                </div>
            </SideBarContainer>
        )
    }
}

const mapStateToProps = (state: GlobalState) => {
    const { filteringClientDashboard, filterClientDashboardResult, clientDashboardData, isLoadingData } = state.Home;
    return {
        filteringClientDashboard: filteringClientDashboard,
        filterClientDashboardResult: filterClientDashboardResult,
        clientDashboardData: clientDashboardData,
        userRolePermission: state.User.userRolePermission,
        selectedContactId: state.User.selectedContactId?state.User.selectedContactId: 0,
        advertisements: state.Advertise.adsList,
        isLoadingData: isLoadingData,
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    ...bindActionCreators(
        {
            filterClientDashboard
        },
        dispatch
    ),
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
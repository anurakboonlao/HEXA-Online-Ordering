export interface IDashboardModel{
    dateList: Date[];
    caseCounts: IDashboardCaseCount[];
    orderCounts: IDashboardOrderCount[];
    orderProduct: IDashboardOrder[];
    allGroupsOfProduct: IGroupsOfProduct[];
}

export interface IChartSize{
    chartClassName: string;
}

export interface IDashboardCaseCount{
    date: Date;
    caseCount: number;
}

export interface IDashboardOrderCount{
    date: Date;
    totalCount: number;
    pendingCount: number;
    acceptedCount: number;
    deliveredCount: number;
    rejectedCount: number;
}

export interface IDashboardOrder{
    orderId: number;
    orderStatusId: number;
    products:IDashboardOrderProduct[];
}

export interface IDashboardOrderProduct{
    productTypeId: number;
    productId: number;
    productGroupId: number;
    productGroupName: string;
    productName: string;
    qty: number;
}

export interface IProductGroupUnit{
    productName: string; 
    unit: number;
}

export interface IGroupsOfProduct {
    id:number;
    name:string;
    productTypeId: number;
    orderNumber: number;
}
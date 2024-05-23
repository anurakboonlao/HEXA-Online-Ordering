import { OrderOverviewStatusEnum } from "../redux/domains/OrderOverview"

export enum ProgressManagementStatusEnum{
    Draft = "Draft",
    WaitingOrder = "Waiting Order",
    Ordered = "Ordered",
    Canceled = "Canceled",
    Delivery = "Delivery",
    Completed = "Completed",
    Reject = "Reject",
    Step1 = "Step1",
    Step2 = "Step2",
    Step1Develivery = "Step1Develivery",
    Step2Develivery = "Step2Develivery",

}


export const castStatusNumberToStatusEnum = (statusId: number) => {
    switch(statusId){
        case 1:
            return OrderOverviewStatusEnum.Draft
        case 2:
            return OrderOverviewStatusEnum.WaitingOrder
        case 3:
            return OrderOverviewStatusEnum.Ordered
        case 4:
            return OrderOverviewStatusEnum.Canceled
        case 5:
            return OrderOverviewStatusEnum.Delivery
        case 6:
            return OrderOverviewStatusEnum.Completed
        case 7:
            return OrderOverviewStatusEnum.Reject
        case 8:
            return OrderOverviewStatusEnum.Step1
        case 9:
            return OrderOverviewStatusEnum.Step2
        case 10:
            return OrderOverviewStatusEnum.CustomerConfirmStep2
        default:
            return OrderOverviewStatusEnum.Draft
    }

}

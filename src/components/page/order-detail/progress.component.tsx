import i18n from "../../../i18n";
import '../../../scss/components/_progressComponent.scss';
import { FC } from 'react'
import ProgressProps  from '../../case/progress-props.component'

import UserOrderReceive from '../../../assets/svg/manage-order1.svg'
import UserOrderConfirm from '../../../assets/svg/manage-order6.svg'
import UserOrderProcess from '../../../assets/svg/manage-order3.svg'
import UserOrderDelivered from '../../../assets/svg/manage-order4.svg'
import UserOrderSecondProcess from '../../../assets/svg/manage-order5.svg'

import ProgressReceive from '../../../assets/svg/progress-received.svg'
import ProgressConfirm from '../../../assets/svg/progress-confirm.svg'
import ProgressProcess from '../../../assets/svg/progress-process.svg'
import ProgressDelivered from '../../../assets/svg/progress-delivered.svg'
import ProgressSecondConfirm from '../../../assets/svg/progress-second-confirm.svg'
import ProgressSecondProcess from '../../../assets/svg/progress-second-process.svg'
import ProgressSecondDelivered from '../../../assets/svg/progress-second-delivered.svg'
import { OrderOverviewStatusEnum } from "../../../redux/domains/OrderOverview";
interface IPropgressProps {
    status:number
}
const Progress : FC<IPropgressProps> = (
    {status}
) => {
    const displayShowStatus = (status: number) => {
        switch(status){
            case OrderOverviewStatusEnum.Draft:
                return (<div></div>);
            case OrderOverviewStatusEnum.WaitingOrder:
                return <ProgressProps img={UserOrderReceive} title={i18n.t("CASE_PRESENTATION_RECEIVED")} description={i18n.t("PLEASE_REVIEW_CASE_PRESENTATION_AND_ATTACHMENTS_RECEIVED")} progressBarImg={ProgressReceive}/>;
            case OrderOverviewStatusEnum.Ordered:
                return <ProgressProps img={UserOrderConfirm} title={i18n.t("ORDER_STEP_ONE_CONFIRM")} description={i18n.t("ORDER_STEP_ONE_CONFIRM_PROCESS")} progressBarImg={ProgressConfirm} />;
            case OrderOverviewStatusEnum.Step1:
                return <ProgressProps img={UserOrderProcess} title={i18n.t("ORDER_STEP_ONE_IS_PROCESS")} description={i18n.t("ORDER_STEP_ONE_IS_PROCESS_DESC")} progressBarImg={ProgressProcess}/>;
            case OrderOverviewStatusEnum.CustomerConfirmStep2:
                return <ProgressProps img={UserOrderConfirm} title={i18n.t("ORDER_STEP_TWO_IS_CONFIRM")} description={i18n.t("ORDER_STEP_TWO_IS_CONFIRM_DESC")} progressBarImg={ProgressSecondConfirm} />;
            case OrderOverviewStatusEnum.Delivery:
                return <ProgressProps img={UserOrderDelivered} title={i18n.t("ORDER_STEP_ONE_IS_DELIVERED")} description={i18n.t("ORDER_STEP_ONE_IS_DELIVERED_DESC")} progressBarImg={ProgressDelivered}/>;
            case OrderOverviewStatusEnum.Step2:
                return <ProgressProps img={UserOrderSecondProcess} title={i18n.t("ORDER_STEP_TWO_IS_PROCESS")} description={i18n.t("ORDER_STEP_TWO_IS_PROCESS_DESC")} progressBarImg={ProgressSecondProcess} />;
            case OrderOverviewStatusEnum.Completed:
                return <ProgressProps img={UserOrderDelivered} title={i18n.t("ORDER_STEP_TWO_IS_DELIVERED")} description={i18n.t("ORDER_STEP_TWO_IS_DELIVERED_DESC")} progressBarImg={ProgressSecondDelivered } />;
        }
    }
    return (
  <>
    <div>
        <div className="title-bar">
            <h5 className="progress-title">{i18n.t("PROGRESS")}</h5>
            {displayShowStatus(status)}
        </div>
    </div>
  </>
  );
};
export default Progress;

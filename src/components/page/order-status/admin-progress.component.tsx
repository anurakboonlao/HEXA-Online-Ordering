import { FC } from "react";
import i18n from "../../../i18n";
import { OrderOverviewStatusEnum } from "../../../redux/domains/OrderOverview";
import ProgressAdminProps from "./admin-progress-props.component";
import ManageImg6 from "../../../assets/svg/manage-order6.svg";
import ManageImg from "../../../assets/svg/manage-order1.svg";
import ManageImg2 from "../../../assets/svg/manage-order2.svg";
import ManageImg3 from "../../../assets/svg/manage-order3.svg";
import ManageImg4 from "../../../assets/svg/manage-order4.svg";
import ManageImg5 from "../../../assets/svg/manage-order5.svg";
import ProgressAdmin from "../../../assets/svg/progress-admin1.svg";
import ProgressAdmin2 from "../../../assets/svg/progress-admin2.svg";
import ProgressAdmin3 from "../../../assets/svg/progress-admin3.svg";
import ProgressAdmin4 from "../../../assets/svg/progress-admin4.svg";
import ProgressAdmin5 from "../../../assets/svg/progress-admin5.svg";
import ProgressAdmin6 from "../../../assets/svg/progress-admin6.svg";
import ProgressAdmin7 from "../../../assets/svg/progress-admin7.svg";

interface IAdminProgressProps {
  statusId: number;
}

const AdminProgress: FC<IAdminProgressProps> = ({ statusId }) => {
  const displayShowProgress = (statusId: number) => {
    switch (statusId) {
      case OrderOverviewStatusEnum.Draft:
        return (
          <ProgressAdminProps
            img={ManageImg6}
            title={i18n.t("NEW_ORDER_RECEIVED")}
            description={i18n.t("PLEASE_REVIEW_ORDER_AND_ATTACHMENT")}
            progressBarImg={ProgressAdmin}
          />
        );
      case OrderOverviewStatusEnum.WaitingOrder:
        return (
          <ProgressAdminProps
            img={ManageImg}
            title={i18n.t("ADMIN_PRESENTATION_SENT")}
            description={i18n.t("PLEASE_WAIT_CUSTOMER_REVIEW")}
            progressBarImg={ProgressAdmin}
          />
        );
      case OrderOverviewStatusEnum.Ordered:
        return (
          <ProgressAdminProps
            img={ManageImg2}
            title={i18n.t("CUSTOMER_CONFIRM")}
            description={i18n.t("STEP_1_CAN_START")}
            progressBarImg={ProgressAdmin2}
          />
        );
      case OrderOverviewStatusEnum.Step1:
        return (
          <ProgressAdminProps
            img={ManageImg3}
            title={i18n.t("FIRST_SET_START")}
            description={i18n.t("FIRST_SET_CAN_NOW_START")}
            progressBarImg={ProgressAdmin3}
          />
        );
      case OrderOverviewStatusEnum.Delivery:
        return (
          <ProgressAdminProps
            img={ManageImg4}
            title={i18n.t("FIRST_SET_DELIVERED")}
            description={i18n.t("PRODUCT_FROM_STEP_1_SEND")}
            progressBarImg={ProgressAdmin4}
          />
        );
      case OrderOverviewStatusEnum.CustomerConfirmStep2:
        return (
          <ProgressAdminProps
            img={ManageImg2}
            title={i18n.t("CUSTOMER_CONFIRM")}
            description={i18n.t("SECOND_SET_CAN_START")}
            progressBarImg={ProgressAdmin4}
          />
        );
      case OrderOverviewStatusEnum.Step2:
        return (
          <ProgressAdminProps
            img={ManageImg5}
            title={i18n.t("SECOND_SET_START")}
            description={i18n.t("SECOND_SET_START_DESCRIPTION")}
            progressBarImg={ProgressAdmin6}
          />
        );
      case OrderOverviewStatusEnum.Completed:
        return (
          <ProgressAdminProps
            img={ManageImg4}
            title={i18n.t("SECOND_SET_DELIVERED")}
            description={i18n.t("PRODUCT_FROM_SECOND_SET_HAVE_BEEN_DELIVERED")}
            progressBarImg={ProgressAdmin7}
          />
        );
    }
  };
  return (
    <>
      <div>{displayShowProgress(statusId)}</div>
    </>
  );
};
export default AdminProgress;

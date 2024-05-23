import { FC, useState } from "react";
import "../../scss/components/_progress.scss";
import i18n from "../../i18n";
import { GlobalState } from "../../redux/reducers";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { modifyCase, updateStatus } from "../../redux/actions/order-detail.action";
import { OrderOverviewStatusEnum } from "../../redux/domains/OrderOverview";
import ConfirmModal from "../ui/confirm-modal.component";
import { Form } from "react-bootstrap";
interface IOrderDetailDetailStatus {
  status: number;
  caseId: number;
  modifyCase: (caseId: number, modifyNote: string) => void;
  updateStatus: (caseId: number, statusId: number, rejectNote?: string) => void;
}

const OrderDetailDetailStatus: FC<IOrderDetailDetailStatus> = ({
  status,
  caseId,
  modifyCase,
  updateStatus,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenReject, setIsOpenReject] = useState<boolean>(false);
  const [isOpenModify, setIsOpenModify] = useState<boolean>(false);
  const [modifyNote, setModifyNote] = useState<string>("");
  const [isEmptyModifyNote, setIsEmptyModifyNote] = useState<boolean>(false);
  const [rejectNote, setRejectNote] = useState<string>("");
  const [isEmptyRejectNote, setIsEmptyRejectNote] = useState<boolean>(false);
  const [statusIdModify, setStatusIdModify] = useState(status);
  const [wordModal, setWordModal] = useState("");
  const confirmButton = (statusId: number, wordModal: string) => {
    return (
      <button className="confirm-button" onClick={() => handleConfirm(statusId, wordModal)}>
        {i18n.t("CONFIRM")}
      </button>
    );
  };

  const rejectButton = (statusId: number, wordModal: string) => {
    return (
      <button className="reject-button" onClick={() => handleReject(statusId, wordModal)}>
        {i18n.t("REJECT")}
      </button>
    );
  };

  const modifyButton = (statusId: number, wordModal: string) => {
    return (
      <button className="reject-button" onClick={() => handleModify(statusId, wordModal)}>
        {wordModal}
      </button>
    );
  };

  const handleModify = (statusId: number, wordModal: string) => {
    setIsOpenModify(true);
  };

  const handleConfirm = (statusId: number, wordModal: string) => {
    setWordModal(wordModal);
    setIsOpen(true);
    setStatusIdModify(statusId);
  };

  const handleReject = (statusId: number, wordModal: string) => {
    setWordModal(wordModal);
    setIsOpenReject(true);
    setStatusIdModify(statusId);
  };

  const modifyAction = () => {
    modifyCase(caseId, modifyNote);
    updateStatus(caseId, OrderOverviewStatusEnum.Draft);
  };

  const rejectAction = () => {
    updateStatus(caseId, OrderOverviewStatusEnum.Reject, rejectNote);
  };

  const actionConfirm = () => {
    updateStatus(caseId, statusIdModify);
    setIsOpen(false);
  };

  const displayDetailStatus = (status: any) => {
    switch (status) {
      case OrderOverviewStatusEnum.Draft:
        return <div></div>;
      case OrderOverviewStatusEnum.WaitingOrder:
        return (
          <div className="group-button">
            {confirmButton(
              OrderOverviewStatusEnum.Ordered,
              i18n.t("CONFIRM_CASE_PRESENTATION_TO_START_PRODUCTION")
            )}
            {modifyButton(OrderOverviewStatusEnum.WaitingOrder, i18n.t("MODIFY"))}
            {rejectButton(OrderOverviewStatusEnum.Reject, i18n.t("REJECT_CASE_PRESENTATION"))}
          </div>
        );
      case OrderOverviewStatusEnum.Delivery:
        return (
          <div className="group-button">
            {confirmButton(
              OrderOverviewStatusEnum.CustomerConfirmStep2,
              i18n.t("CONFIRM_START_STEP_2_PRODUCTION")
            )}
            {rejectButton(
              OrderOverviewStatusEnum.Reject,
              i18n.t("REJECT_TO_CONTINUE_STEP_2_PRODUCTION")
            )}
          </div>
        );
      case OrderOverviewStatusEnum.Completed:
        return <div></div>;
      default:
        return <p className="in-progress-div">{i18n.t("IN_PROGRESS")}</p>;
    }
  };
  return (
    <>
      {displayDetailStatus(status)}
      <ConfirmModal
        confirmButton={i18n.t("YES")}
        cancelButton={i18n.t("NO")}
        onConfirm={() => {
          actionConfirm();
        }}
        onCancel={() => setIsOpen(false)}
        showModal={isOpen}
        bodyText={wordModal}
        modalTitle={i18n.t("CONFIRMATION")}
      />
      <ConfirmModal
        confirmButton={i18n.t("YES")}
        cancelButton={i18n.t("NO")}
        onConfirm={() => {
          if (!rejectNote) {
            setIsEmptyRejectNote(true);
          } else {
            rejectAction();
            setIsOpenReject(false);
          }
        }}
        onCancel={() => {
          setIsOpenReject(false);
          setIsEmptyRejectNote(false);
        }}
        showModal={isOpenReject}
        bodyText={
          <Form.Group>
            <Form.Label>{i18n.t("REJECT_CASE_PRESENTATION_ADMIN")}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={i18n.t("REJECT_NOTE")}
              onChange={(e) => setRejectNote(e.target.value)}
              required
              isInvalid={isEmptyRejectNote}
            />
            <Form.Control.Feedback type="invalid">
              {i18n.t("REJECT_NOTE_REQUIRED")}
            </Form.Control.Feedback>
          </Form.Group>
        }
        modalTitle={i18n.t("CONFIRMATION")}
      />

      {/* Modify Note Modal */}
      <ConfirmModal
        confirmButton={i18n.t("YES")}
        cancelButton={i18n.t("NO")}
        onConfirm={() => {
          if (!modifyNote) {
            setIsEmptyModifyNote(true);
          } else {
            modifyAction();
          }
        }}
        onCancel={() => {
          setIsOpenModify(false);
          setIsEmptyModifyNote(false);
        }}
        showModal={isOpenModify}
        bodyText={
          <Form.Group>
            <Form.Label>{i18n.t("MODIFY_NOTE")}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              onChange={(e) => setModifyNote(e.target.value)}
              required
              isInvalid={isEmptyModifyNote}
            />
            <Form.Control.Feedback type="invalid">
              {i18n.t("MODIFY_NOTE_REQUIRED")}
            </Form.Control.Feedback>
          </Form.Group>
        }
        modalTitle={i18n.t("MODIFY")}
      />
    </>
  );
};
const mapStateToProps = (state: GlobalState) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      modifyCase,
      updateStatus,
    },
    dispatch
  ),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailDetailStatus);

import { FC, useEffect, useState } from "react";
import { fileICharmTypeEnum } from "../../constants/caseManagement";
import i18n from "../../i18n";
import "../../scss/components/_progress.scss";
import { IGetAttachmentFile, removeImage } from "../../redux/actions/attachment.action";
import { addAligner, updateStatus } from "../../redux/actions/order-detail.action";
import { OrderOverviewStatusEnum } from "../../redux/domains/OrderOverview";
import OrderFormAttachments from "../case/order-form-attachments.component";
import { GlobalState } from "../../redux/reducers";
import { bindActionCreators } from "redux";
import ConfirmModal from "../ui/confirm-modal.component";
import { connect } from "react-redux";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
interface IAttachUpload {
  caseId: number;
  attachedFile: IGetAttachmentFile[];
  uploadMethod: (e: any) => void;
  statusId: number;
  updateStatus: (caseId: number, statusId: number, rejectNote?: string) => void;
  addAligner: (caseId: number, aligner: string) => void;
  removeImage?: (fileId: number) => void;
  isUploading: boolean;
  aligners: string;
}
const AttachUploadComp: FC<IAttachUpload> = ({
  caseId,
  attachedFile,
  uploadMethod,
  addAligner,
  statusId,
  updateStatus,
  removeImage,
  isUploading,
  aligners,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState<string>("");
  const [isOpenReject, setIsOpenReject] = useState(false);
  const [isEmptyRejectNote, setIsEmptyRejectNote] = useState<boolean>(false);
  const [statusIdModify, setStatusIdModify] = useState(statusId);
  const [wordModal, setWordModal] = useState("");
  const changeHandlerPresentation = (event: any) => {
    let fileAndType = event.target.files;
    if (fileAndType !== undefined) {
      fileAndType[0].fileTypeId = fileICharmTypeEnum.CasePresentation;
      uploadMethod(fileAndType);
    }
  };

  const confirmButton = (statusId: number, wordModal: string) => {
    return (
      <button className="confirm-button" onClick={() => handleConfirm(caseId, statusId, wordModal)}>
        {i18n.t("CONFIRM")}
      </button>
    );
  };

  const handleReject = (caseId: number, statusId: number, wordModal: string) => {
    setIsOpenReject(true);
    setWordModal(wordModal);
    setIsOpenReject(true);
    setStatusIdModify(statusId);
  };

  const handleConfirm = (caseId: number, statusId: number, wordModal: string) => {
    if (statusId === OrderOverviewStatusEnum.WaitingOrder && !aligners) {
      toast.error(i18n.t("PLEASE_FILL_OUT_ALIGNERS"))
      return
    }

    setWordModal(wordModal);
    setIsOpen(true);
    setStatusIdModify(statusId);
  };

  const rejectButton = (statusId: number, wordModal: string) => {
    return (
      <button className="reject-button" onClick={() => handleReject(caseId, statusId, wordModal)}>
        {i18n.t("REJECT")}
      </button>
    );
  };
  const handleOnRemove = (id: number) => {
    if (removeImage) {
      removeImage(id);
    }
  };
  const sendButton = () => {
    return (
      <button
        className={attachedFile.length !== 0 ? "send-button" : "send-button-disable"}
        onClick={() =>
          handleConfirm(
            caseId,

            OrderOverviewStatusEnum.WaitingOrder,

            i18n.t("SEND_CASE_PRESENTATION_FILE")
          )
        }
        disabled={attachedFile.length === 0}
      >
        {i18n.t("SEND")}
      </button>
    );
  };

  const displayButton = (statusId: number) => {
    switch (statusId) {
      case OrderOverviewStatusEnum.Draft:
        return (
          <div className="group-button">
            {sendButton()}
            {rejectButton(OrderOverviewStatusEnum.Reject, i18n.t("REJECT_CASE_PRESENTATION_ADMIN"))}
          </div>
        );
      case OrderOverviewStatusEnum.Ordered:
        return (
          <div className="group-button">
            {confirmButton(
              OrderOverviewStatusEnum.Step1,

              i18n.t("CONFIRM_CASE_PRESENTATION_TO_START_STEP_1")
            )}
            {rejectButton(OrderOverviewStatusEnum.Reject, i18n.t("REJECT_CASE_PRESENTATION"))}
          </div>
        );
      case OrderOverviewStatusEnum.Step1:
        return (
          <div className="group-button">
            {confirmButton(
              OrderOverviewStatusEnum.Delivery,

              i18n.t("CONFIRM_TO_DELIVER_STEP_1_PRODUCT")
            )}
            {rejectButton(OrderOverviewStatusEnum.Reject, i18n.t("REJECT_TO_DELIVER_PRODUCT"))}
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
      case OrderOverviewStatusEnum.CustomerConfirmStep2:
        return (
          <div className="group-button">
            {confirmButton(
              OrderOverviewStatusEnum.Step2,

              i18n.t("CONFIRM_TO_START_STEP_2_PRODUCTION")
            )}
          </div>
        );
      case OrderOverviewStatusEnum.Step2:
        return (
          <div className="group-button">
            {confirmButton(
              OrderOverviewStatusEnum.Completed,

              i18n.t("CONFIRM_TO_DELIVER_STEP_2_PRODUCT")
            )}
          </div>
        );
      case OrderOverviewStatusEnum.Completed:
        return <div></div>;
      case OrderOverviewStatusEnum.Reject:
        return <div></div>;
      default:
        return <p className="in-progress-div">{i18n.t("IN_PROGRESS")}</p>;
    }
  };
  const confirmModal = () => {
    return (
      <ConfirmModal
        onConfirm={() => {
          if (aligners) {
            addAligner(caseId, aligners);
          }

          updateStatus(caseId, statusIdModify);
          setIsOpen(false);
        }}
        onCancel={() => {
          setIsOpen(false);
        }}
        confirmButton={i18n.t("YES")}
        cancelButton={i18n.t("NO")}
        showModal={isOpen}
        bodyText={wordModal}
        modalTitle={i18n.t("CONFIRMATION")}
      />
    );
  };
  const rejectModal = () => {
    return (
      <ConfirmModal
        onConfirm={() => {
          if (!rejectNote) {
            setIsEmptyRejectNote(true);
          } else {
            updateStatus(caseId, statusIdModify, rejectNote);
            setIsOpenReject(false);
          }
        }}
        confirmButton={i18n.t("YES")}
        cancelButton={i18n.t("NO")}
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
    );
  };

  return (
    <>
      <div>
        <p className="text-left presentation-title">{i18n.t("PRESENTATION_FILES")}</p>
        <OrderFormAttachments
          attachedFile={attachedFile}
          onRemove={handleOnRemove}
          isUploading={isUploading}
          methodOnChange={changeHandlerPresentation}
        />

        {confirmModal()}
        {rejectModal()}
      </div>
      <div className="attach-button">{displayButton(statusId)}</div>
    </>
  );
};
const mapStateToProps = (state: GlobalState) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      updateStatus,
      addAligner,
      removeImage,
    },
    dispatch
  ),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(AttachUploadComp);

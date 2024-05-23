import dayjs from "dayjs";
import { FC } from "react";
import { Form, Button, Modal, Nav, Col } from "react-bootstrap";
import { ProductDropDownTypeIdEnum } from "../../constants/caseManagement";

import { UserRoleEnum } from "../../constants/constant";
import i18n from "../../i18n";
import { IGetAttachmentFile } from "../../redux/actions/attachment.action";
import { CaseDetailModel } from "../../redux/domains/CaseManagement";
import AttachedFilePreview from "../ui/attached-file-preview.component";
import CustomDatePicker from "../ui/date-picker.component";
import CaseItemTable from "./case-item-table.component";

interface IOrderOverViewModalProps {
  caseModel: CaseDetailModel;
  show: boolean;
  confirmShowing: boolean;
  onClose: () => void;
  onOrder: () => void;
  readonly: boolean;
  userRole: UserRoleEnum;
  setRequestDate: (value: Date) => void;
  setPickupDate: (value: Date) => void;
  attachmentFile: IGetAttachmentFile[];
  xrayFile: IGetAttachmentFile[];
  patientFile: IGetAttachmentFile[];
  isOrdering: boolean;
}

const OrderOverViewModal: FC<IOrderOverViewModalProps> = ({
  caseModel,
  readonly,
  show,
  confirmShowing,
  onClose,
  onOrder,
  userRole,
  setRequestDate,
  setPickupDate,
  attachmentFile = [],
  xrayFile = [],
  patientFile = [],
  isOrdering,
}) => {
  const convertDate = (value?: Date) => {
    if (value) return dayjs(value).toDate();
    else return undefined;
  };

  const displayAttachedFileBadge = (files?:IGetAttachmentFile[] ) => {
    if (files && files.length > 0) {
      return (
        <>
          {files.map((file, index) => (
            <Col xl={3} lg={3}>
              <AttachedFilePreview
                key={file.id}
                attachedFile={file}
                readonly={true}
                onDownload={true}
                attachedFileList={files}/>
            </Col>
          ))}
        </>
      );
    }
    return  <Col> - </Col>
  };

  const icharmType: boolean =
  caseModel.caseOrderLists.filter(
    (caseOrder) => caseOrder.productTypeId === ProductDropDownTypeIdEnum.ICharm
  ).length > 0;
  return (
    <Modal
      show={show}
      size="lg"
      className={show && confirmShowing ? "modal__overlay modal__main" : "modal__main"}
      centered
    >
      <Modal.Body>
        <Modal.Title className="modal__title">{i18n.t("ORDER_SUMMARY")}</Modal.Title>
        <div>
          <div className="row mt-3">
            <div className="col-6">
              <Form.Label className="">
                {userRole === UserRoleEnum.Clinic ? i18n.t("DENTIST") : i18n.t("CLINIC")}
              </Form.Label>
              <Form.Control
                placeholder=""
                className=""
                value={
                  userRole === UserRoleEnum.Clinic ? caseModel.dentistName : caseModel.clinicName
                }
                disabled={true}
              />
            </div>
            <div className="col-6">
              <Form.Label className="">{i18n.t("PATIENT")}</Form.Label>
              <Form.Control
                placeholder=""
                className=""
                value={caseModel.patientName}
                disabled={true}
              />
            </div>
          </div>
          <div className="row mt-3">       
            <div className="col-6">
              <Form.Label>{i18n.t("PICKUP_DATE")}</Form.Label>
              {readonly ? (
                <Form.Control
                  disabled
                  type="text"
                  value={
                    caseModel.pickupDate
                      ? dayjs(caseModel.pickupDate).format("DD-MM-YYYY hh:mm A")
                      : "-"
                  }
                />
              ) : (
                <CustomDatePicker
                  setDate={setPickupDate}
                  disabled={readonly}
                  selectDate={convertDate(caseModel.pickupDate)}
                  minDate={new Date()}
                />
              )}
            </div>
            <div className="col-6">
              <Form.Label className="">{i18n.t("REQUESTED_DUE_DATE")}</Form.Label>
              {readonly ? (
                <Form.Control
                  disabled
                  type="text"
                  value={
                    caseModel.requestDate
                      ? dayjs(caseModel.requestDate).format("DD-MM-YYYY hh:mm A")
                      : "-"
                  }
                />
              ) : (
                <CustomDatePicker
                  setDate={setRequestDate}
                  disabled={readonly}
                  selectDate={convertDate(caseModel.requestDate)}
                  minDate={new Date()}
                />
              )}
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <Form.Label className="">{i18n.t("MEMO")}</Form.Label>
              <Form.Control
                as="textarea"
                placeholder=""
                className="memo-modal__text"
                value={caseModel.memo}
                disabled={true}
              />
            </div>
          </div>

          {icharmType ?
            (<><div className="row my-3">
              <div className="col-12">
                <Form.Label className="">{i18n.t("PATIENT_IMAGE")}</Form.Label>
              </div>
              <>
                {displayAttachedFileBadge(patientFile)}
              </>
            </div>
            <div className="row my-3">
              <div className="col-12">
                <Form.Label className="">{i18n.t("XREY_FILM")}</Form.Label>
              </div>
              <>{displayAttachedFileBadge(xrayFile)}</>
            </div></>)
            : <></>
          }

          <div className="row my-3">
            <div className="col-12">
              <Form.Label className="">{i18n.t("ATTACHED_FILE")}</Form.Label>
            </div>
            <>{displayAttachedFileBadge(attachmentFile)}</>
          </div>
        </div>

        <CaseItemTable
          caseOrderLists={caseModel.caseOrderLists}
          onDeleteItem={() => {}}
          onSelectItem={() => {}}
          disabledDelete={readonly}
          displayActionColumn={false}
        ></CaseItemTable>

        <div className="case-detail__action">
          <Nav className="case-detail__menu mb-0">
            <Nav.Item className="case-detail__menu-item mr-3">
              <Button
                className="case-detail__menu_btn"
                variant="outline-primary"
                onClick={() => onClose()}
              >
                {i18n.t("CANCEL")}
              </Button>
            </Nav.Item>
            <Nav.Item className="case-detail__menu-item">
              <Button
                className="secondary-btn case-detail__menu_btn"
                variant="primary"
                onClick={() => onOrder()}
                disabled={readonly || isOrdering}
              >
                {isOrdering ? i18n.t("ORDERING") : i18n.t("ORDER")}
              </Button>
            </Nav.Item>
          </Nav>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OrderOverViewModal;
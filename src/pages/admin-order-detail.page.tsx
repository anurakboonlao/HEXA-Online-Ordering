import React from "react";
import { Badge, Button, Col, Form, Modal, Nav, Navbar, Row } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { connect } from "react-redux";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import { bindActionCreators } from "redux";
import CaseItemTable from "../components/case/case-item-table.component";
import TextInputCase from "../components/case/text-input-case.component";
import SideBarContainer from "../components/menu/side-bar.component";
import PageHeader from "../components/page-header.component";
import { SideMenuOption, UserRoleEnum } from "../constants/constant";
import PATH from "../constants/path";
import orderReportIcon from "../assets/svg/order-report.svg";
import { GlobalState } from "../redux/reducers";
import {
  displayGender,
  getBadgeICharmAdminStatus,
  getOrderOverviewBadageStatus,
  orderEnumToString,
  orderICharmAdminEnumToString,
} from "../utils/order-overview-utils/orderOverviewUtils";
import { history } from "../utils/history";
import {
  updateEstimatedDate,
  getOrderDetail,
  updateNotification,
  getModifyHistory,
} from "../redux/actions/order-detail.action";

import OrderDetail from "../components/page/order-detail/order-detail-detail.component";

import "../scss/page/case-detail/_caseDetail.scss";
import AttachedFileBadge from "../components/ui/attached-file-badge.component";
import CustomDatePicker from "../components/ui/date-picker.component";
import EstimateNatificationModal from "../components/page/order-overview/send-notification-estimate-modal.component";
import { OrderOverviewStatusEnum } from "../redux/domains/OrderOverview";
import Progress from "../components/page/order-status/admin-progress.component";
import i18n from "../i18n";
import Mark from "../assets/svg/mark.svg";
import Marked from "../assets/svg/marked.svg";

import {
  fileICharmTypeEnum,
  ProductDropDownTypeIdEnum,
  ProductTypeEnum,
} from "../constants/caseManagement";
import {
  IGetAttachmentFile,
  removeImage,
  uploadAttachmentFile,
} from "../redux/actions/attachment.action";
import AttachUpload from "../components/ui/attached-upload.component";
import { CaseDetail } from "./loadable-pages";
import { IOrderDetail } from "../redux/domains/OrderDetail";
import BootstrapTable, { ColumnDescription } from "react-bootstrap-table-next";
import AttachedFilePreview from "../components/ui/attached-file-preview.component";

type IAdminOrderDetailProps = ReturnType<typeof mapStateToProps>;
type IAdminOrderDetailDispatchProps = ReturnType<typeof mapDispatchToProps>;

interface IAdminOrderDetailStateprops {
  dispalyNotification: boolean;
  stateEstimateDate: Date | undefined;
  notificationText: string;
  removeImage?: (fileId: number) => void;
  isShowModifyHistory: boolean;
  modifyHistoryColumns: ColumnDescription[];
  alignerText: string;
}

const convertDate = (value?: Date) => {
  if (value) return dayjs(value).toDate();
  else return undefined;
};

const styles = {
  badgeFileDiv: "badge-file-div",
  badgeFile: "badge-file",
  badgeFileText: "badge-file-text",
  badgeFileClose: "badge-file-close",
};
class AdminOrderDetailPage extends React.Component<
  IAdminOrderDetailProps & IAdminOrderDetailDispatchProps,
  IAdminOrderDetailStateprops
> {
  constructor(props: any) {
    super(props);
    this.state = {
      dispalyNotification: false,
      stateEstimateDate: undefined,
      notificationText: "",
      isShowModifyHistory: false,
      modifyHistoryColumns: [
        {
          dataField: "id",
          text: i18n.t("MODEFY_HISTORY_ID"),
          headerClasses: "table-header-column text-center",
          classes: "table-column",
          align: "center",
          headerStyle: { width: "150px" },
          formatter: (cell: any, row: any, rowIndex: number, formatExtraData: any) => {
            return <span>{rowIndex + 1}</span>;
          },
        },
        {
          dataField: "note",
          text: i18n.t("MODIFY_NOTE"),
          headerClasses: "table-header-column text-left",
          classes: "table-column",
          align: "left",
          formatter: (cell: any, row: any, rowIndex: number, formatExtraData: any) => {
            return <span>{row.note ? row.note : "-"}</span>;
          },
        },
        {
          dataField: "orderDate",
          text: i18n.t("MODIFY_REQUEST_DATEORDER_DATE"),
          headerClasses: "table-header-column text-left",
          classes: "table-column",
          align: "left",
          formatter: (cell: any, row: any, rowIndex: number, formatExtraData: any) => {
            return <span>{dayjs(row.requestEditDate).format("DD-MM-YYYY hh:mm:ss")}</span>;
          },
        },
        {
          dataField: "requestCaseAttachedFiles",
          text: i18n.t("PRESENTATION_FILES"),
          headerClasses: "table-header-column text-left",
          classes: "table-column",
          align: "left",
          formatter: (cell: any, row: any, rowIndex: number, formatExtraData: any) => {
            return row.requestCaseAttachedFiles.map((file: IGetAttachmentFile) => {
              return (
                <Col className="badge-file-component" key={file.id}>
                  <AttachedFileBadge
                    attachedFile={file}
                    readonly={false}
                    onDownload={true}
                    styles={styles}
                    textColorBlack={true}
                    key={file.id}
                    attachedFileList={this.props.orderAttachFiles}
                  ></AttachedFileBadge>
                </Col>
              );
            });
          },
        },
      ],
      alignerText: "",
    };
  }

  handleOnRemove = (id: number) => {
    if (this.props.removeImage) {
      this.props.removeImage(id);
    }
  };

  convertEstimateDate = () => {
    return this.props.orderDetail?.expectedDate ? this.props.orderDetail?.expectedDate : undefined;
  };

  filterAttachedFileList = (fileTypeId: number) => {
    if (!this.props.attachFiles) {
      return [];
    }

    const files = this.props.attachFiles.filter((file: IGetAttachmentFile) => {
      return file.fileTypeId === fileTypeId;
    });

    return files;
  };
  onMarkAsReadClick = (orderDetail: IOrderDetail): void => {
    this.props.updateNotification(orderDetail.id, !orderDetail.isNotification);
  };

  markAsReadButton = () => {
    const isNotification = this.props.orderDetail.isNotification;

    return (
      <>
        <div
          className={!isNotification ? "mark-button-disable" : "mark-button"}
          onClick={() => this.onMarkAsReadClick(this.props.orderDetail)}
        >
          <img src={isNotification ? Mark : Marked} className="mark-button-img " />
          <p className="mark-button-text">{i18n.t("MARK_AS_READ")}</p>
        </div>
      </>
    );
  };

  componentDidUpdate(prevProps: IAdminOrderDetailProps, prevState: IAdminOrderDetailStateprops) {
    if (this.props.modifyHistory.length > 0) {
      if (this.props.modifyHistory[0].caseId <= 0) {
        const caseId = this.props.orderDetail.caseId;
        this.props.getModifyHistory(caseId);
      }
    }

    if (prevProps.isLoading && !this.props.isLoading) {
      this.setState({
        stateEstimateDate: this.props.orderDetail?.expectedDate
          ? this.props.orderDetail?.expectedDate
          : undefined,
      });
    }
    if (prevProps.isUpdatingEstimatedDate && !this.props.isUpdatingEstimatedDate) {
      if (this.props.updateEstimatedDateResult.success === true) {
        toast.success(i18n.t("UPDATE_DELIVERY_DATE_COMPLETED"));
        this.setState({
          dispalyNotification: false,
        });
      } else {
        toast.error(this.props.updateEstimatedDateResult.message);
      }
    }
  }

  setNotificationText = (text: string) => {
    this.setState({
      notificationText: text,
    });
  };

  setEstimatedDate = (value: Date) => {
    this.setState({
      stateEstimateDate: value,
      notificationText: "",
      dispalyNotification: true,
    });
  };

  onSaveEstimatedDate = () => {
    if (this.state.stateEstimateDate)
      this.props.updateEstimatedDate(
        this.props.orderDetail.id,
        this.state.stateEstimateDate,
        this.state.notificationText
      );
    else toast.error(i18n.t("PLEASE_SELECT_EXPECTED_DELIVERYDATE_DATE"));
  };

  uploadMethod = (files: any[]) => {
    this.props.uploadAttachmentFile(files, this.props.orderDetail.caseId);
  };

  closeHistoryModal = () => {
    this.setState({
      ...this.state,
      isShowModifyHistory: false,
    });
  };

  render() {
    const { orderDetail, modifyHistory } = this.props;
    const readonly: boolean =
      orderDetail.status !== OrderOverviewStatusEnum.Step2 &&
      orderDetail.status !== OrderOverviewStatusEnum.Ordered &&
      orderDetail.status !== OrderOverviewStatusEnum.WaitingOrder &&
      orderDetail.status !== OrderOverviewStatusEnum.Draft;

    const isAlignersReadOnly = orderDetail.status !== OrderOverviewStatusEnum.Draft;

    const icharmType: boolean =
      this.props.caseOrderLists.filter(
        (caseOrder) => caseOrder.productTypeId === ProductDropDownTypeIdEnum.ICharm
      ).length > 0;

    return (
      <SideBarContainer
        selectedMenu={SideMenuOption.OrderStatus}
        userRole={this.props.userRolePermission}
      >
        <div className="pt-3">
          <PageHeader pageTitle={i18n.t("ORDER_STATUS")} displayAction={false} />
          <div className="case-detail__main-page">
            {!this.props.isLoading && (
              <>
                {" "}
                <Navbar className="case-detail__top-menu">
                  <div className="case-detail__name case-min-width">
                    <TextInputCase
                      inputText={orderDetail.patientName}
                      onInputChange={() => {}}
                      placeholder=""
                      onBackClick={() => {
                        history.push(PATH.ADMIN.ORDER_STATUS);
                      }}
                      readOnly={true}
                    ></TextInputCase>
                  </div>
                  <div className="order-detail__group-action">
                    <Nav className="case-detail__menu">
                      <Nav.Item className="case-detail__menu-item margin-nav-right">
                        {this.props.caseOrderLists.filter(
                          (caseDetail) =>
                            caseDetail.productTypeId === ProductDropDownTypeIdEnum.ICharm
                        ).length > 0 ? (
                          <>
                            <Row>
                              {this.markAsReadButton()}
                              <div
                                className={
                                  "hexa-badge case-detail__menu_badge " +
                                  getBadgeICharmAdminStatus(orderDetail.status)
                                }
                              >
                                {orderICharmAdminEnumToString(orderDetail.status)}
                              </div>
                            </Row>
                          </>
                        ) : (
                          <div
                            className={
                              "hexa-badge case-detail__menu_badge " +
                              getOrderOverviewBadageStatus(orderDetail.status)
                            }
                          >
                            {orderEnumToString(orderDetail.status)}
                          </div>
                        )}
                      </Nav.Item>
                    </Nav>
                  </div>
                </Navbar>
                <div className="px-3 pb-3 case-detail__layout-main">
                  <div className="case-detail__layout-left fixed-max">
                    <div className="case-detail__type-select hexa__box-detail-shadow">
                      <Form.Group className="px-3 py-3 text-left">
                        <Row>
                          <Col>
                            <Form.Label className="modal__form-label-text">
                              {i18n.t("ORDER_ID")}
                            </Form.Label>
                            <Form.Control disabled type="text" value={orderDetail.orderRef} />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Label className="modal__form-label-text mt-2">
                              {i18n.t("PATIENT")}
                            </Form.Label>
                            <Form.Control disabled type="text" value={orderDetail.patientName} />
                          </Col>
                        </Row>
                        {icharmType ? (
                          <>
                            <Row>
                              <Col>
                                <Form.Label className="modal__form-label-text mt-2">
                                  {i18n.t("GENDER")}
                                </Form.Label>
                                <Form.Control
                                  disabled
                                  type="text"
                                  value={displayGender(orderDetail.gender)}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <Form.Label className="modal__form-label-text mt-2">
                                  {i18n.t("AGE")}
                                </Form.Label>
                                <Form.Control disabled type="text" value={orderDetail.age} />
                              </Col>
                            </Row>
                          </>
                        ) : (
                          <></>
                        )}
                        <Row>
                          <Col>
                            <Form.Label className="modal__form-label-text mt-2">
                              {i18n.t("ORDER_DATE")}
                            </Form.Label>
                            <Form.Control
                              disabled
                              type="text"
                              value={
                                orderDetail.orderedDate
                                  ? dayjs(orderDetail.orderedDate).format("DD-MM-YYYY")
                                  : "-"
                              }
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Label className="modal__form-label-text mt-2">
                              {i18n.t("PICKUP_DATE")}
                            </Form.Label>
                            <Form.Control
                              disabled
                              type="text"
                              value={
                                orderDetail.pickupDate
                                  ? dayjs(orderDetail.pickupDate).format("DD-MM-YYYY hh:mm A")
                                  : "-"
                              }
                            />
                          </Col>
                          <Col>
                            <Form.Label className="modal__form-label-text mt-2">
                              {i18n.t("REQUESTED_DUE_DATE")}
                            </Form.Label>
                            <Form.Control
                              disabled
                              type="text"
                              value={
                                orderDetail.requestedDate
                                  ? dayjs(orderDetail.requestedDate).format("DD-MM-YYYY hh:mm A")
                                  : "-"
                              }
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Label className="modal__form-label-text mt-2">
                              {i18n.t("EXPECTED_DELIVERY_DATE")}
                            </Form.Label>
                            {readonly ? (
                              <Form.Control
                                disabled
                                type="text"
                                value={
                                  orderDetail.requestedDate
                                    ? dayjs(orderDetail.requestedDate).format("DD-MM-YYYY")
                                    : "-"
                                }
                              />
                            ) : (
                              <CustomDatePicker
                                showTimeSelect={false}
                                setDate={this.setEstimatedDate}
                                selectDate={convertDate(this.state.stateEstimateDate)}
                                minDate={new Date()}
                              />
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Label className="modal__form-label-text mt-2">
                              {i18n.t("MEMO")}
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              placeholder=""
                              className="memo-modal__text"
                              value={orderDetail.memo}
                              readOnly={true}
                            />
                          </Col>
                        </Row>
                        {this.props.orderDetail.status === OrderOverviewStatusEnum.Reject ? (
                          <Row>
                            <Col>
                              <Form.Label className="modal__form-label-text mt-2">
                                {i18n.t("REJECT_NOTE")}
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                placeholder=""
                                className="memo-modal__text"
                                value={orderDetail.rejectNote.note ?? "-"}
                                readOnly={true}
                              />
                            </Col>
                          </Row>
                        ) : (
                          <></>
                        )}
                        {icharmType ? (
                          <>
                            <Row>
                              <Col>
                                <Form.Label className="modal__form-label-text mt-3">
                                  {i18n.t("PATIENT_IMAGE")}
                                </Form.Label>
                                <div className="order-overview-attach-file-div-attach">
                                  <Row>
                                    <>
                                      {this.filterAttachedFileList(fileICharmTypeEnum.Patient)
                                        .length > 0 ? (
                                        this.filterAttachedFileList(fileICharmTypeEnum.Patient).map(
                                          (file, index) => (
                                            <Col xl={6} lg={6}>
                                              {/* <AttachedFileBadge
                                                key={index}
                                                textColorBlack={true}
                                                attachedFile={file}
                                                readonly={false}
                                                onDownload={true}
                                                attachedFileList={this.filterAttachedFileList(
                                                  fileICharmTypeEnum.Patient
                                                )}
                                              ></AttachedFileBadge> */}
                                              <AttachedFilePreview
                                                key={file.id}
                                                attachedFile={file}
                                                readonly={false}
                                                onDownload={true}
                                                attachedFileList={this.filterAttachedFileList(
                                                  fileICharmTypeEnum.Patient
                                                )}
                                              />
                                            </Col>
                                          )
                                        )
                                      ) : (
                                        <div> - </div>
                                      )}
                                    </>
                                  </Row>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <Form.Label className="modal__form-label-text mt-3">
                                  {i18n.t("XREY_FILM")}
                                </Form.Label>
                                <div className="order-overview-attach-file-div-attach">
                                  <Row>
                                    {this.filterAttachedFileList(fileICharmTypeEnum.Xrey).length >
                                    0 ? (
                                      this.filterAttachedFileList(fileICharmTypeEnum.Xrey).map(
                                        (file, index) => (
                                          // <Col xl={6} lg={6}>
                                          //   <AttachedFileBadge
                                          //     key={index}
                                          //     textColorBlack={true}
                                          //     attachedFile={file}
                                          //     readonly={false}
                                          //     onDownload={true}
                                          //     attachedFileList={this.filterAttachedFileList(
                                          //       fileICharmTypeEnum.Xrey
                                          //     )}
                                          //   ></AttachedFileBadge>
                                          // </Col>
                                          <Col xl={6} lg={6}>
                                            <AttachedFilePreview
                                              key={file.id}
                                              attachedFile={file}
                                              readonly={false}
                                              onDownload={true}
                                              attachedFileList={this.filterAttachedFileList(
                                                fileICharmTypeEnum.Xrey
                                              )}
                                            />
                                          </Col>
                                        )
                                      )
                                    ) : (
                                      <div> - </div>
                                    )}
                                  </Row>
                                </div>
                              </Col>
                            </Row>
                          </>
                        ) : (
                          <></>
                        )}
                        <Row>
                          <Col>
                            <Form.Label className="modal__form-label-text mt-3">
                              {i18n.t("ATTACHMENTS")}
                            </Form.Label>
                            <div className="order-overview-attach-file-div-attach">
                              <Row>
                                {this.filterAttachedFileList(fileICharmTypeEnum.Normal).length >
                                0 ? (
                                  this.filterAttachedFileList(fileICharmTypeEnum.Normal).map(
                                    (file, index) => (
                                      <Col xl={6} lg={6}>
                                        <AttachedFilePreview
                                          key={file.id}
                                          attachedFile={file}
                                          readonly={false}
                                          onDownload={true}
                                          attachedFileList={this.filterAttachedFileList(
                                            fileICharmTypeEnum.Normal
                                          )}
                                        />
                                      </Col>
                                    )
                                  )
                                ) : (
                                  <div> - </div>
                                )}
                              </Row>
                            </div>
                          </Col>
                        </Row>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="case-detail__layout-right">
                    <div className="case-detail__table hexa__box-detail-shadow">
                      <div className="case-detail__table-title mb-2">
                        {i18n.t("ORDER_LIST")}
                        {this.props.caseOrderLists[0].productType === ProductTypeEnum.ICHARM ? (
                          <Button
                            onClick={() => {
                              this.props.getModifyHistory(orderDetail.caseId);
                              this.setState({
                                ...this.state,
                                isShowModifyHistory: true,
                              });
                            }}
                          >
                            <SVG className="modify-history-icon" src={orderReportIcon}></SVG>
                          </Button>
                        ) : (
                          <></>
                        )}
                      </div>
                      {this.props.caseOrderLists.filter(
                        (caseOrder) => caseOrder.productTypeId === ProductDropDownTypeIdEnum.ICharm
                      ).length > 0 ? (
                        <>
                          {/* Edit  */}
                          <OrderDetail
                            orderDetail={orderDetail}
                            caseOrderLists={this.props.caseOrderLists}
                            isReadonly={isAlignersReadOnly}
                            onAlignersChange={(alignersText: string) => {
                              this.setState({
                                alignerText: alignersText,
                              });
                            }}
                          />
                          <div className="case-detail__table-title mb-2">{i18n.t("PROGRESS")}</div>
                          <div className="status-divbar">
                            {this.props.orderDetail.status !== OrderOverviewStatusEnum.Reject &&
                              this.props.orderDetail.status !==
                                OrderOverviewStatusEnum.Canceled && (
                                <>
                                  <Progress statusId={this.props.orderDetail.status} />

                                  <AttachUpload
                                    caseId={this.props.orderDetail.caseId}
                                    isUploading={this.props.isUploadingAttachment}
                                    attachedFile={this.filterAttachedFileList(
                                      fileICharmTypeEnum.CasePresentation
                                    )}
                                    uploadMethod={this.uploadMethod}
                                    aligners={this.state.alignerText}
                                    statusId={this.props.orderDetail.status}
                                  />
                                </>
                              )}
                          </div>
                        </>
                      ) : (
                        <>
                          <CaseItemTable
                            caseOrderLists={this.props.caseOrderLists}
                            onDeleteItem={() => {}}
                            onSelectItem={() => {}}
                            disabledDelete={true}
                            displayMethodColumn={true}
                            displayActionColumn={false}
                          ></CaseItemTable>
                        </>
                      )}
                    </div>
                    <div className="case-detail__action">
                      <Nav className="case-detail__menu mb-0">
                        <Nav.Item className="case-detail__menu-item mr-3">
                          <Button
                            className="case-detail__menu_btn"
                            variant="outline-primary"
                            onClick={() => {
                              history.push(PATH.ADMIN.ORDER_STATUS);
                            }}
                          >
                            {i18n.t("BACK")}
                          </Button>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Modal size="xl" show={this.state.isShowModifyHistory} onHide={this.closeHistoryModal}>
          <Modal.Header closeButton>
            <Modal.Title>{i18n.t("MODIFY_HISTORY")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BootstrapTable
              keyField="id"
              data={modifyHistory}
              columns={this.state.modifyHistoryColumns}
              classes="table-main hexa-table-fix"
              wrapperClasses="hexa-expand-table"
              bordered={false}
              bootstrap4={true}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={this.closeHistoryModal}>
              {i18n.t("CLOSE")}
            </Button>
          </Modal.Footer>
        </Modal>

        <EstimateNatificationModal
          onClose={() => {
            this.setState({
              dispalyNotification: false,
              stateEstimateDate: this.convertEstimateDate(),
            });
          }}
          onSave={this.onSaveEstimatedDate}
          show={this.state.dispalyNotification}
          notificationText={this.state.notificationText}
          setNotificationText={this.setNotificationText}
          isSending={this.props.isUpdatingEstimatedDate}
        />
      </SideBarContainer>
    );
  }
}

const mapStateToProps = (state: GlobalState) => {
  return {
    userRolePermission: state.User.userRolePermission,
    userRole: state.User.payload.role as UserRoleEnum,
    isLoading: state.OrderDetail.isLoading,
    isUpdatingEstimatedDate: state.OrderDetail.isUpdatingEstimatedDate,
    updateEstimatedDateResult: state.OrderDetail.updateEstimatedDateResult,
    caseOrderLists: state.OrderDetail.caseOrderLists,
    orderDetail: state.OrderDetail.orderDetail,
    modifyHistory: state.OrderDetail.modifyHistory,
    attachFiles: state.Attachment.attachFiles,
    orderAttachFiles: state.OrderDetail.orderDetail.pathAttachedFiles,
    isLoadingAttachFile: state.Attachment.isLoading,
    isRemovingAttachFile: state.Attachment.isRemoving,
    isUploadingAttachment: state.Attachment.isUploading,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      updateEstimatedDate,
      getOrderDetail,
      uploadAttachmentFile,
      updateNotification,
      getModifyHistory,
      removeImage,
    },
    dispatch
  ),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminOrderDetailPage);

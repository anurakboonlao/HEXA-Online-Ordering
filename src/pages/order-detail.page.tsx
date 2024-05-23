import React from "react";
import {
  Badge,
  Button,
  Col,
  Form,
  Modal,
  Nav,
  Navbar,
  Row,
} from "react-bootstrap";
import { connect } from "react-redux";
import SVG from "react-inlinesvg";
import dayjs from "dayjs";
import orderReportIcon from "../assets/svg/order-report.svg";
import editIcon from "../assets/svg/edit-icon.svg";
import xButton from "../assets/svg/x-button.svg";
import checkIcon from "../assets/svg/check_icon.svg";

import { bindActionCreators } from "redux";
import {
  fileICharmTypeEnum,
  ProductDropDownTypeIdEnum,
  ProductTypeEnum,
} from "../constants/caseManagement";
import Presentation from "../components/page/order-detail/presentation.component";
import TextInputCase from "../components/case/text-input-case.component";
import SideBarContainer from "../components/menu/side-bar.component";
import PageHeader from "../components/page-header.component";
import { SideMenuOption, UserRoleEnum } from "../constants/constant";
import OrderDetailDetail from "../components/page/order-detail/order-detail-detail.component";
import Progress from "../components/page/order-detail/progress.component";
import PATH from "../constants/path";
import { OrderOverviewStatusEnum } from "../redux/domains/OrderOverview";
import { GlobalState } from "../redux/reducers";
import {
  getOrderOverviewBadageStatus,
  orderEnumToString,
  getBadgeICharmStatus,
  orderICharmEnumToString,
  displayGender,
} from "../utils/order-overview-utils/orderOverviewUtils";
import { history } from "../utils/history";
import ConfirmModal from "../components/ui/confirm-modal.component";
import {
  cancelOrder,
  getModifyHistory,
} from "../redux/actions/order-detail.action";
import {
  getAttachmentFile,
  IGetAttachmentFile,
} from "../redux/actions/attachment.action";
import { updateMemo } from "../redux/actions/order-detail.action";

import "../scss/page/case-detail/_caseDetail.scss";
import AttachedFileBadge from "../components/ui/attached-file-badge.component";
import i18n from "../i18n";
import OrderDetailDetailStatus from "../components/case/order-detail-detail-status.component";
import CaseItemTable from "../components/case/case-item-table.component";
import BootstrapTable, { ColumnDescription } from "react-bootstrap-table-next";
import AttachedFilePreview from "../components/ui/attached-file-preview.component";
import { toast } from "react-toastify";

type IOrderDetailProps = ReturnType<typeof mapStateToProps>;
type IOrderDetailDispatchProps = ReturnType<typeof mapDispatchToProps>;

const styles = {
  badgeFileDiv: "badge-file-div",
  badgeFile: "badge-file",
  badgeFileText: "badge-file-text",
  badgeFileClose: "badge-file-close",
};
interface IOrderDetailStateprops {
  dispalyConfirmModal: boolean;
  isShowModifyHistory: boolean;
  memo: string;
  displayMemoDiscardChange: boolean;
  isMemoDisable: boolean;
  modifyHistoryColumns: ColumnDescription[];
}

class OrderDetailPage extends React.Component<
  IOrderDetailProps & IOrderDetailDispatchProps,
  IOrderDetailStateprops
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isMemoDisable: true,
      memo: "",
      displayMemoDiscardChange: false,
      dispalyConfirmModal: false,
      isShowModifyHistory: false,
      modifyHistoryColumns: [
        {
          dataField: "id",
          text: i18n.t("MODEFY_HISTORY_ID"),
          headerClasses: "table-header-column text-center",
          classes: "table-column",
          align: "center",
          headerStyle: { width: "150px" },
          formatter: (
            cell: any,
            row: any,
            rowIndex: number,
            formatExtraData: any
          ) => {
            return <span>{rowIndex + 1}</span>;
          },
        },
        {
          dataField: "note",
          text: i18n.t("MODIFY_NOTE"),
          headerClasses: "table-header-column text-left",
          classes: "table-column",
          align: "left",
          formatter: (
            cell: any,
            row: any,
            rowIndex: number,
            formatExtraData: any
          ) => {
            return <span>{row.note ? row.note : "-"}</span>;
          },
        },
        {
          dataField: "orderDate",
          text: i18n.t("MODIFY_REQUEST_DATEORDER_DATE"),
          headerClasses: "table-header-column text-left",
          classes: "table-column",
          align: "left",
          formatter: (
            cell: any,
            row: any,
            rowIndex: number,
            formatExtraData: any
          ) => {
            return (
              <span>
                {dayjs(row.requestEditDate).format("DD-MM-YYYY hh:mm:ss")}
              </span>
            );
          },
        },
        {
          dataField: "requestCaseAttachedFiles",
          text: i18n.t("PRESENTATION_FILES"),
          headerClasses: "table-header-column text-left",
          classes: "table-column",
          align: "left",
          formatter: (
            cell: any,
            row: any,
            rowIndex: number,
            formatExtraData: any
          ) => {
            return row.requestCaseAttachedFiles.map(
              (file: IGetAttachmentFile) => {
                return (
                  <Col className="badge-file-component p-1" key={file.id}>
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
              }
            );
          },
        },
      ],
    };
  }

  filterAttachedFileList = (fileTypeId: number) => {
    if (!this.props.attachFiles) {
      return [];
    }

    const files = this.props.attachFiles.filter((file: IGetAttachmentFile) => {
      return file.fileTypeId === fileTypeId;
    });

    return files;
  };

  componentDidUpdate(
    prevProps: IOrderDetailProps,
    prevState: IOrderDetailStateprops
  ) {
    if (
      prevProps.isCanceling &&
      !this.props.isCanceling &&
      (prevProps.orderDetail.status === OrderOverviewStatusEnum.Draft ||
        prevProps.orderDetail.status ===
          OrderOverviewStatusEnum.WaitingOrder) &&
      this.props.orderDetail.status === OrderOverviewStatusEnum.Reject
    ) {
      // cancel order success
      history.push(PATH.CLIENT.ORDER_OVERVIEW);
    }

    if (prevProps.isUpdatingMemo && !this.props.isUpdatingMemo) {
      if (this.props.updateMemoResult.success) {
        toast.success(i18n.t("UPDATE_MEMO_COMPLETED"));
        this.setState({
          dispalyConfirmModal: false,
          isMemoDisable: true,
        });
      } else {
        toast.error(this.props.updateMemoResult.message);
      }
    }
  }

  componentWillReceiveProps(props: any) {
    if (this.state.isMemoDisable) {
      this.setState({
        memo: props.orderDetail.memo,
      });
    }
  }

  closeHistoryModal = () => {
    this.setState({
      ...this.state,
      isShowModifyHistory: false,
    });
  };

  enableEditMemo = (e : any) => {
    e.preventDefault()
    this.setState({ isMemoDisable: false });
  };

  discardMemoChange = (e : any) => {
    e.preventDefault()
    if (this.state.memo === this.props.orderDetail.memo) {
      this.setState({ isMemoDisable: true });
    } else {
      this.setState({ displayMemoDiscardChange: true });
    }
  };

  disableEditMemo = () => {
    this.setState({ memo: this.props.orderDetail.memo });
    this.setState({ isMemoDisable: true, displayMemoDiscardChange: false });
  };

  saveMemo = (e : any) => {
    e.preventDefault()
    if (!this.props.isUpdatingMemo) {
      this.props.updateMemo(this.props.orderDetail.caseId, this.state.memo);
    }
  }

  checkMemoText = () => {
    if (this.state.isMemoDisable) {
      this.setState({ dispalyConfirmModal: true });
    } else {
      toast.error(i18n.t("PLEASE_SAVE_MEMO_BEFORE_CONTINUE"));
    }

  }

  render() {
    const { orderDetail } = this.props;
    const icharmType: boolean =
      this.props.caseOrderLists.filter(
        (caseOrder) =>
          caseOrder.productTypeId === ProductDropDownTypeIdEnum.ICharm
      ).length > 0;

    return (
      <SideBarContainer
        selectedMenu={SideMenuOption.OrderOverview}
        userRole={this.props.userRolePermission}
      >
        <div>
          <div className="px-3 pt-3">
            <PageHeader
              pageTitle={i18n.t("ORDER_OVERVIEW_DETAIL")}
              displayAction={true}
            />
          </div>
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
                        history.push(PATH.CLIENT.ORDER_OVERVIEW);
                      }}
                      readOnly={true}
                    ></TextInputCase>
                  </div>

                  <div className="order-detail__group-action">
                    <Nav className="case-detail__menu">
                      <Nav.Item className="case-detail__menu-item margin-nav-right">
                        {this.props.caseOrderLists.filter(
                          (caseDetail) =>
                            caseDetail.productTypeId ===
                            ProductDropDownTypeIdEnum.ICharm
                        ).length > 0 ? (
                          <>
                            <Badge
                              pill
                              className={
                                "hexa-badge case-detail__menu_badge " +
                                getBadgeICharmStatus(orderDetail.status)
                              }
                            >
                              {orderICharmEnumToString(orderDetail.status)}
                            </Badge>
                          </>
                        ) : (
                          <Badge
                            pill
                            className={
                              "hexa-badge case-detail__menu_badge " +
                              getOrderOverviewBadageStatus(orderDetail.status)
                            }
                          >
                            {orderEnumToString(orderDetail.status)}
                          </Badge>
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
                            <Form.Control
                              disabled
                              type="text"
                              value={orderDetail.orderRef}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Label className="modal__form-label-text mt-2">
                              {i18n.t("PATIENT")}
                            </Form.Label>
                            <Form.Control
                              disabled
                              type="text"
                              value={orderDetail.patientName}
                            />
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
                                  {i18n.t("AGE")} <span> *</span>
                                </Form.Label>
                                <Form.Control
                                  disabled
                                  type="text"
                                  value={orderDetail.age}
                                />
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
                                  ? dayjs(orderDetail.orderedDate).format(
                                      "DD-MM-YYYY"
                                    )
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
                                  ? dayjs(orderDetail.pickupDate).format(
                                      "DD-MM-YYYY hh:mm A"
                                    )
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
                                  ? dayjs(orderDetail.requestedDate).format(
                                      "DD-MM-YYYY hh:mm A"
                                    )
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
                            <Form.Control
                              disabled
                              type="text"
                              value={
                                orderDetail.expectedDate
                                  ? dayjs(orderDetail.expectedDate).format(
                                      "DD-MM-YYYY"
                                    )
                                  : "-"
                              }
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Label className="modal__form-label-text d-flex justify-content-between mt-2">
                              {i18n.t("MEMO")}

                              {OrderOverviewStatusEnum.Completed !== this.props.orderDetail.status &&
                              <div className="">
                                {this.state.isMemoDisable ? (
                                  <a
                                    href="javascrip:void(0)"
                                    className="edit-memo-button p-0"
                                    onClick={(e) => this.enableEditMemo(e)}
                                  >
                                    <SVG
                                      src={editIcon}
                                      width="12"
                                      height="12"
                                    ></SVG>
                                  </a>
                                ) : (
                                  <>
                                    <a
                                      href="javascrip:void(0)"
                                      className={"memo-button " + (this.props.isUpdatingMemo ? "memo-button__disabled" : "memo-button__save")}
                                      onClick={(e) => this.saveMemo(e)}
                                      >
                                      <SVG
                                        src={checkIcon}
                                        width="14"
                                        height="14"
                                      ></SVG>
                                    </a>
                                    <a
                                      href="javascrip:void(0)"
                                      className={"ml-1 memo-button " + (this.props.isUpdatingMemo ? "memo-button__disabled" : "memo-button__discard")}
                                      onClick={(e) => this.discardMemoChange(e)}
                                    >
                                      <SVG
                                        src={xButton}
                                        width="10"
                                        height="10"
                                      ></SVG>
                                    </a>
                                  </>
                                )}
                              </div>
                              }
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              placeholder=""
                              className="memo-modal__text"
                              value={this.state.memo}
                              readOnly={this.state.isMemoDisable}
                              onChange={(e) => {
                                this.setState({
                                  memo: e.target.value,
                                });
                              }}
                            />
                          </Col>
                        </Row>
                        {this.props.orderDetail.status ===
                        OrderOverviewStatusEnum.Reject ? (
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
                                      {this.filterAttachedFileList(
                                        fileICharmTypeEnum.Patient
                                      ).length > 0 ? (
                                        this.filterAttachedFileList(
                                          fileICharmTypeEnum.Patient
                                        ).map((file, index) => (
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
                                        ))
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
                                    {this.filterAttachedFileList(
                                      fileICharmTypeEnum.Xrey
                                    ).length > 0 ? (
                                      this.filterAttachedFileList(
                                        fileICharmTypeEnum.Xrey
                                      ).map((file, index) => (
                                        <Col xl={6} lg={6}>
                                          {/* <AttachedFileBadge
                                              key={index}
                                              textColorBlack={true}
                                              attachedFile={file}
                                              readonly={false}
                                              onDownload={true}
                                              attachedFileList={this.filterAttachedFileList(
                                                fileICharmTypeEnum.Xrey
                                              )}
                                            ></AttachedFileBadge> */}
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
                                      ))
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
                                {this.filterAttachedFileList(
                                  fileICharmTypeEnum.Normal
                                ).length > 0 ? (
                                  this.filterAttachedFileList(
                                    fileICharmTypeEnum.Normal
                                  ).map((file, index) => (
                                    <Col xl={6} lg={6}>
                                      <AttachedFilePreview
                                        key={file.id}
                                        attachedFile={file}
                                        readonly={false}
                                        onDownload={true}
                                        attachedFileList={this.props.orderAttachFiles.filter(
                                          (e) =>
                                            e.fileTypeId !==
                                              fileICharmTypeEnum.Normal &&
                                            e.fileTypeId !==
                                              fileICharmTypeEnum.Xrey
                                        )}
                                      />
                                    </Col>
                                  ))
                                ) : (
                                  <div> - </div>
                                )}
                              </Row>
                            </div>
                          </Col>
                        </Row>
                        <Col></Col>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="case-detail__layout-right">
                    <div className="case-detail__table hexa__box-detail-shadow">
                      <div className="case-detail__table-title mb-2 order-list-title">
                        {i18n.t("ORDER_LIST")}
                        {this.props.caseOrderLists[0].productType ===
                        ProductTypeEnum.ICHARM ? (
                          <Button
                            onClick={() => {
                              this.props.getModifyHistory(orderDetail.caseId);
                              this.setState({
                                ...this.state,
                                isShowModifyHistory: true,
                              });
                            }}
                          >
                            <SVG
                              className="modify-history-icon"
                              src={orderReportIcon}
                            ></SVG>
                          </Button>
                        ) : (
                          <></>
                        )}
                      </div>
                      <>
                        {this.props.caseOrderLists.filter(
                          (casedetail) =>
                            casedetail.productTypeId ===
                            ProductDropDownTypeIdEnum.ICharm
                        ).length > 0 ? (
                          <>
                            <OrderDetailDetail
                              orderDetail={this.props.orderDetail}
                              caseOrderLists={this.props.caseOrderLists}
                              onAlignersChange={(alignersText: string) => {}}
                              isReadonly={true}
                            />
                            {this.props.orderDetail.status !==
                              OrderOverviewStatusEnum.Draft &&
                              this.props.orderDetail.status !==
                                OrderOverviewStatusEnum.Reject && (
                                <>
                                  <Progress
                                    status={this.props.orderDetail.status}
                                  />
                                  <Presentation
                                    attachFile={this.filterAttachedFileList(
                                      fileICharmTypeEnum.CasePresentation
                                    )}
                                  />
                                  <OrderDetailDetailStatus
                                    status={this.props.orderDetail.status}
                                    caseId={this.props.orderDetail.caseId}
                                  />
                                </>
                              )}
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
                            />
                          </>
                        )}
                      </>
                    </div>
                    <div className="case-detail__action">
                      <Nav className="case-detail__menu mb-0">
                        <Nav.Item className="case-detail__menu-item mr-3">
                          <Button
                            className="case-detail__menu_btn"
                            variant="outline-primary"
                            onClick={() => {
                              history.push(PATH.CLIENT.ORDER_OVERVIEW);
                            }}
                          >
                            {i18n.t("BACK")}
                          </Button>
                        </Nav.Item>
                        {orderDetail.status !== OrderOverviewStatusEnum.Draft &&
                        orderDetail.status !==
                          OrderOverviewStatusEnum.WaitingOrder ? (
                          <></>
                        ) : (
                          <Nav.Item className="case-detail__menu-item">
                            <Button
                              className="primary-btn case-detail__menu_btn-cancel"
                              variant=""
                              onClick={() => this.checkMemoText()}
                              disabled={
                                orderDetail.status !==
                                  OrderOverviewStatusEnum.Draft &&
                                orderDetail.status !==
                                  OrderOverviewStatusEnum.WaitingOrder
                              }
                            >
                              {i18n.t("CANCEL_ORDER")}
                            </Button>
                          </Nav.Item>
                        )}
                      </Nav>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Modal
          size="xl"
          show={this.state.isShowModifyHistory}
          onHide={this.closeHistoryModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>{i18n.t("MODIFY_HISTORY")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BootstrapTable
              keyField="id"
              data={this.props.modifyHistory}
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

        <ConfirmModal
          onCancel={() => {
            this.setState({ dispalyConfirmModal: false });
          }}
          onConfirm={() => {
            this.props.cancelOrder(this.props.orderDetail.id);
          }}
          showModal={this.state.dispalyConfirmModal}
          bodyText={
            <span>
              {i18n.t("CONFIRM_CANCEL_ORDER")} {this.props.orderDetail.orderRef}
            </span>
          }
          cancelButton={i18n.t("NO")}
          confirmButton={i18n.t("CANCEL_ORDER")}
          confirmButtonVariant=""
          modalTitle={i18n.t("CONFIRMATION")}
          disableComfirm={this.props.isCanceling}
          className="primary-btn case-detail__menu_btn-cancel"
        />

        <ConfirmModal
          onCancel={() => {
            this.setState({ displayMemoDiscardChange: false });
          }}
          onConfirm={() => {
            this.disableEditMemo();
          }}
          showModal={this.state.displayMemoDiscardChange}
          bodyText={<span>Click confirm button to discard all changes?</span>}
          cancelButton={i18n.t("CANCEL")}
          confirmButton={i18n.t("CONFIRM")}
          confirmButtonVariant=""
          modalTitle={i18n.t("Discard change?")}
          disableComfirm={this.props.isCanceling}
          className="primary-btn case-detail__menu_btn-cancel"
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
    isCanceling: state.OrderDetail.isCanceling,
    modifyHistory: state.OrderDetail.modifyHistory,
    caseOrderLists: state.OrderDetail.caseOrderLists,
    orderDetail: state.OrderDetail.orderDetail,
    orderAttachFiles: state.OrderDetail.orderDetail.pathAttachedFiles,
    attachFiles: state.Attachment.attachFiles,
    caseDetailModel: state.Case.caseDetailModel,
    getCaseResult: state.Case.getCaseResult,
    getCaseList : state.Case.caseList,
    isUpdatingMemo : state.OrderDetail.isUpdatingMemo,
    updateMemoResult: state.OrderDetail.updateMemoResult
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      cancelOrder,
      getAttachmentFile,
      getModifyHistory,
      updateMemo,
    },
    dispatch
  ),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailPage);

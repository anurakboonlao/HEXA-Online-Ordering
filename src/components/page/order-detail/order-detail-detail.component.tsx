import React, {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  useEffect,
  useState,
} from "react";
import "../../../scss/components/_orderDetailDetail.scss";
import { Container, Row, Col, Form, Dropdown } from "react-bootstrap";
import "../../../scss/components/_progress.scss";
import i18n from "../../../i18n";
import { IOrderDetail } from "../../../redux/domains/OrderDetail";
import { CaseOrderListModel } from "../../../redux/domains/CaseManagement";
import { bindActionCreators } from "redux";
import {
  ProductTypeEnum,
  LevelOfTreatmentEnum,
} from "../../../constants/caseManagement";
import EditLevelOfTreatmentModal from "./edit-level-of-treatment-modal.component";
import { UserRoleEnum } from "../../../constants/constant";
import { GlobalState } from "../../../redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderDetail,
  updateCaseProduct,
} from "../../../redux/actions/order-detail.action";
import { toast } from "react-toastify";
import { useIsMount } from "../../../utils/isMount";

interface IOrderDetailProps {
  orderDetail: IOrderDetail;
  caseOrderLists?: CaseOrderListModel[];
  isReadonly: boolean;
  onAlignersChange: (alignersText: string) => void;
}

const OrderDetailDetail: FC<IOrderDetailProps> = ({
  orderDetail,
  caseOrderLists,
  isReadonly,
  onAlignersChange,
}) => {
  const [levelOfTreatmentLabel, setLevelOfTreatmentLabel] =
    useState<string>("");
  const [notificationText, setNotificationText] = useState<string>("");
  const [modalVisible, toggle] = useState<boolean>(false);
  const [productId, setProductId] = useState<number>(
    LevelOfTreatmentEnum.CANINE_TO_CANINE
  );
  const [selectedProducId, setSelectedProductId] = useState<number>(
    LevelOfTreatmentEnum.CANINE_TO_CANINE
  );
  const dispatch = useDispatch();
  const role = useSelector((state: GlobalState) => state.User.payload.role);
  const isUpdatingLevelOfTreatment = useSelector(
    (state: GlobalState) => state.OrderDetail.isUpdatingLevelOfTreatment
  );
  const updateLevelOfTreatmentResult = useSelector(
    (state: GlobalState) => state.OrderDetail.updateLevelOfTreatmentResult
  );
  const isMount = useIsMount();

  const onChangeAligners = (e: ChangeEvent<HTMLInputElement>) => {
    onAlignersChange(e.target.value);
  };

  const findIndexOfOrderName = () => {
    if (caseOrderLists) {
      const index = caseOrderLists.findIndex(
        (item) =>
          item.selectProduct &&
          (item.selectProduct.name === ProductTypeEnum.CanineToCanine ||
            item.selectProduct.name === ProductTypeEnum.PremolarToPremolar)
      );
      return index;
    }
    return -1;
  };

  const onLevelOfTreatmentSelect = (selected: number) => {
    if (selected === productId) {
      return;
    }

    toggle(true);
    setSelectedLabel(selected);
  };

  const initLevelOfTreatment = () => {
    toggle(false);
    setNotificationText("");
    if (caseOrderLists) {
      const productIdFromProp =
        caseOrderLists[findIndexOfOrderName()].selectProduct?.id ??
        LevelOfTreatmentEnum.CANINE_TO_CANINE;
      setProductId(productIdFromProp);
      setSelectedProductId(productIdFromProp);
      setSelectedLabel(productIdFromProp);
    }
  };

  const onSaveLevelOfTreatment = () => {
    if (!notificationText) {
      toast.error(i18n.t("PLEASE_FILL_OUT_THE_REASON"));
      return;
    }
    setProductId(selectedProducId);
    dispatch(
      updateCaseProduct(orderDetail.caseId, selectedProducId, notificationText)
    );
  };

  const setSelectedLabel = (selected: number) => {
    setSelectedProductId(selected);

    if (selected === LevelOfTreatmentEnum.CANINE_TO_CANINE) {
      setLevelOfTreatmentLabel(i18n.t("CANINE_TO_CANINE"));
    } else {
      setLevelOfTreatmentLabel(i18n.t("PREMOLAR_TO_PREMOLAR"));
    }
  };

  useEffect(() => {
    if (isMount) {
      initLevelOfTreatment();
    } else {
      if (!isUpdatingLevelOfTreatment) {
        if (updateLevelOfTreatmentResult.success === true) {
          toggle(false);
          setNotificationText("");
          toast.success(i18n.t("UPDATE_LEVEL_OF_TREATMENT_SUCCESS"));
        } else {
          toast.error(updateLevelOfTreatmentResult.message);
        }
      }
    }
  }, [isUpdatingLevelOfTreatment]);

  return (
    <Container className="text-order-oder">
      <Row>
        <Col xl={5} lg={12}>
          <Col>
            <Row xl={2} lg={4}>
              <p className="text-left text-title">{i18n.t("DENTIST_NAME")}:</p>
              <p className="text-left text-data text-break">
                {orderDetail.doctor ? orderDetail.doctor.name : "-"}
              </p>
            </Row>
          </Col>
          <Col>
            <Row xl={2} lg={4}>
              <p className="text-left text-title">{i18n.t("EMAIL")}:</p>
              <p className="text-left text-data text-break">
                {orderDetail.clinic.email ? orderDetail.clinic.email : "-"}
              </p>
            </Row>
          </Col>
          <Col>
            <Row xl={2} lg={4}>
              <p className="text-left text-title text-break">
                {i18n.t("PHONE_NUMBER")}:
              </p>
              <p className="text-left text-data text-break">
                {orderDetail.clinic.phone ? orderDetail.clinic.phone : "-"}
              </p>
            </Row>
          </Col>
          <Col>
            <Row xl={2} lg={4}>
              <p className="text-left text-title text-break">
                {i18n.t("LINE_WHATSAPP_ID")}:
              </p>
              <p className="text-left text-data text-break">
                {orderDetail.clinic.lineId ? orderDetail.clinic.lineId : "-"}
              </p>
            </Row>
          </Col>
          <Col>
            <Row xl={2} lg={4}>
              {isReadonly ? (
                <>
                  <p className="text-left text-title text-break">
                    {i18n.t("ALIGNER")} :
                  </p>
                  <p className="text-left text-data text-break">
                    {orderDetail.aligners ? orderDetail.aligners : "-"}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-left text-title text-break">
                    {i18n.t("ALIGNER")} <span className="text-danger">*</span> :
                  </p>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    required
                    placeholder=""
                    readOnly={isReadonly}
                    defaultValue={orderDetail.aligners}
                    onChange={onChangeAligners}
                  />
                </>
              )}
            </Row>
          </Col>
        </Col>
        <Col xl={6} lg={12}>
          <Col>
            <Row xl={2} lg={6}>
              <p className="text-left text-title text-break">
                {i18n.t("PATIENT")}:
              </p>
              <p className="text-left text-data text-break">
                {orderDetail.patientName}
              </p>
            </Row>
          </Col>
          <Col>
            <Row xl={2} lg={6}>
              <p className="text-left text-title text-break">
                {i18n.t("CLINIC_HOSPITAL")}:
              </p>
              <p className="text-left text-data text-break">
                {orderDetail.clinic.name ? orderDetail.clinic.name : "-"}
              </p>
            </Row>
          </Col>
          <Col>
            <Row xl={2} lg={4}>
              <p className="text-left text-title text-break">
                {i18n.t("METHOD")}:
              </p>
              <p className="text-left text-data text-break">
                {caseOrderLists &&
                  caseOrderLists[findIndexOfOrderName()].method?.name}
              </p>
            </Row>
          </Col>
          <Col>
            <Row xl={2} lg={4}>
              <p className="text-left text-title text-break">
                {i18n.t("LEVEL_OF_TREATMENT")}:
              </p>
              {role !== UserRoleEnum.Admin || isReadonly ? (
                <p className="text-left text-data text-break">
                  {caseOrderLists &&
                    caseOrderLists[findIndexOfOrderName()].selectProduct?.name}
                </p>
              ) : (
                <>
                  <Dropdown className="dropdown-light ">
                    <Dropdown.Toggle
                      className="border-radius-4 text-wrap"
                      variant=""
                      id="casetype-filter"
                    >
                      {levelOfTreatmentLabel}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropdown-light-menu">
                      <Dropdown.Item
                        eventKey="1"
                        onSelect={() =>
                          onLevelOfTreatmentSelect(
                            LevelOfTreatmentEnum.CANINE_TO_CANINE
                          )
                        }
                      >
                        {i18n.t("CANINE_TO_CANINE")}
                      </Dropdown.Item>
                      <Dropdown.Item
                        eventKey="2"
                        onSelect={() =>
                          onLevelOfTreatmentSelect(
                            LevelOfTreatmentEnum.PREMOLAR_TO_PREMOLAR
                          )
                        }
                      >
                        {i18n.t("PREMOLAR_TO_PREMOLAR")}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
            </Row>
          </Col>
        </Col>
      </Row>

      <EditLevelOfTreatmentModal
        onSave={() => onSaveLevelOfTreatment()}
        onClose={() => initLevelOfTreatment()}
        notificationText={notificationText}
        show={modalVisible}
        isSending={isUpdatingLevelOfTreatment}
        setNotificationText={(e) => setNotificationText(e)}
      />
    </Container>
  );
};

export default OrderDetailDetail;

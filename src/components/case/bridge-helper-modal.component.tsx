import SVG from 'react-inlinesvg';
import { Modal, Row, Col, Button } from "react-bootstrap";
import bridgeTeethBlue from '../../assets/svg/bridge-helper1.svg';
import bridgeTeethRed from '../../assets/svg/bridge-helper2.svg';
import bridgeTeethColorful from '../../assets/svg/bridge-helper3.svg';
import bigBin from '../../assets/svg/big-bin.svg';
import i18n from '../../i18n';

interface IBridgingProps {
    showBridgeHelper:boolean;
    onClose : () => void;
}

const BridgeHelperModal: React.FC<IBridgingProps> = ({showBridgeHelper, onClose}) => {
    return (
    <Modal
        show={showBridgeHelper}
        className="bridge-helper_modal"
        backdrop="static"
        keyboard={false}
        onHide={onClose}
        centered
    >
        <Modal.Body className="addon-modal__body-helper justify-center">

            <Modal.Title className="modal__title">{i18n.t("DENTAL_BRIDGE")}</Modal.Title>
            <>
                <Row className="bridge-helper_svg">
                    <SVG src={bridgeTeethBlue} width="110" height="110"></SVG>
                </Row>
                <Row>
                    <Col className="bridge-helper_text"><p>{i18n.t("IN_ORDER_ALREADY_HAVE_PRODUCT")}</p></Col>

                </Row>
                <Row className="bridge-helper_svg">
                    <SVG src={bridgeTeethRed} width="110" height="110"></SVG>
                </Row>
                <Row className="bridge-helper_svg">
                    <Col className="bridge-helper_text"><p>{i18n.t("BRIDGE_HELPER_TEXT")}</p></Col>
                </Row>
                <Row className="bridge-helper_svg">
                    <SVG src={bridgeTeethColorful} width="110" height="110"></SVG>
                </Row>
                <Row>
                    <Col className="bridge-helper_text"><p>{i18n.t("BRIDGE_HEPLER_TEXT_DIFFERENT_GROUP")}</p></Col>
                </Row>
                <Row className="bridge-helper_svg">
                    <SVG src={bigBin} width="55" height="55"></SVG>
                </Row>
                <Row>
                    <Col className="bridge-helper_text"><p>{i18n.t("BRIDGE_HELPER_TEXT_CLEAR_BRIDGE_GROUP")}</p></Col>
                </Row>
                <Row>
                    <Col className="bridge-helper_text-below"><span>{i18n.t("BRIDGE_HELPER_TEXT_FOR_TOUCHABLE_DEVICE")}</span></Col>
                </Row>
            </>

        </Modal.Body>
        <Modal.Footer className="modal__footer-full mb-0">
            <Button className="case-detail__menu_btn" variant="outline-primary" onClick={() => onClose()}>{i18n.t("CLOSE")}</Button>
        </Modal.Footer>
    </Modal>
    )
}

export default BridgeHelperModal;
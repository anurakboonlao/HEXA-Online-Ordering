import { FC } from 'react';
import { Form, Button,  Modal, Nav } from 'react-bootstrap';
import i18n from '../../../i18n';

interface IEstimateNatificationModalProps {
    notificationText: string;
    show: boolean;
    setNotificationText: (text: string) => void;
    onSave: () => void;
    onClose: () => void;
    isSending?: boolean;
}

const EditLevelOfTreatment: FC<IEstimateNatificationModalProps> = ({show, notificationText, setNotificationText ,onSave, onClose, isSending=false }) => {
    return (
        <Modal
            show={show}
            className="memo-modal"
            centered
            >
            <Modal.Body className="memo-modal__body">
                <Form.Label className="memo-modal__label">{i18n.t("EDIT_LEVEL_OF_TREATMENT")}</Form.Label>
                <Form.Label className="memo-modal__label-item">{i18n.t("PLEASE_FILL_OUT_THE_REASON")}</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder=""
                    className="memo-modal__text"
                    value={notificationText}
                    onChange={e => setNotificationText(e.target.value)} 
                    />          
                <div className="case-detail__action">
                        <Nav className="case-detail__menu mb-0">
                            <Nav.Item className="case-detail__menu-item mr-3">
                                <Button disabled={isSending} className="secondary-btn case-detail__menu_btn" variant="primary" onClick={()=> onSave()}>{isSending? i18n.t("SENDING") : i18n.t("SEND")}</Button>
                            </Nav.Item>
                            <Nav.Item className="case-detail__menu-item">
                                <Button disabled={isSending} className="case-detail__menu_btn" variant="outline-primary" onClick={()=> onClose()}>{i18n.t("CANCEL")}</Button>
                            </Nav.Item>
                            
                        </Nav>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default EditLevelOfTreatment;
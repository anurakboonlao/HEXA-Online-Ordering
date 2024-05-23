import { FC } from "react";
import { Form, Button, Modal, Nav } from "react-bootstrap";
import i18n from "../../i18n";

interface ICaseMemoModalProps {
  memoText: string;
  show: boolean;
  label: string;
  confirmShowing: boolean;
  setMemoText: (text: string) => void;
  onSave: () => void;
  onClose: () => void;
  readonly: boolean;
}

const CaseMemoModal: FC<ICaseMemoModalProps> = ({
  show,
  confirmShowing,
  label,
  memoText,
  setMemoText,
  onSave,
  onClose,
  readonly,
}) => {
  return (
    <Modal
      show={show}
      className={show && confirmShowing ? "modal__overlay memo-modal" : "memo-modal"}
      centered
    >
      <Modal.Body className="memo-modal__body">
        <Form.Label className="memo-modal__label">{label}</Form.Label>
        <Form.Control
          as="textarea"
          placeholder=""
          className="memo-modal__text"
          value={memoText}
          onChange={(e) => setMemoText(e.target.value)}
          readOnly={readonly}
        />

        <div className="case-detail__action">
          <Nav className="case-detail__menu mb-0">
            <Nav.Item className="case-detail__menu-item mr-3">
              <Button
                className="secondary-btn case-detail__menu_btn"
                variant="primary"
                onClick={() => onSave()}
                disabled={readonly}
              >
                {i18n.t("OK")}
              </Button>
            </Nav.Item>
            <Nav.Item className="case-detail__menu-item">
              <Button
                className="case-detail__menu_btn"
                variant="outline-primary"
                onClick={() => onClose()}
              >
                {i18n.t("CANCEL")}
              </Button>
            </Nav.Item>
          </Nav>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CaseMemoModal;

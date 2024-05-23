import { FC } from "react";
import { Modal, Button, Image } from "react-bootstrap";

interface IConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  showModal: boolean;
  logo?: string;
  bodyText: JSX.Element | string;
  cancelButton?: string;
  confirmButton?: string;
  modalTitle?: string;
  confirmButtonVariant?: string;
  disableComfirm?: boolean;
  className?: string;
}

const ConfirmModal: FC<IConfirmModalProps> = ({
  onConfirm,
  onCancel,
  showModal,
  logo,
  cancelButton = "Cancel",
  confirmButton = "OK",
  modalTitle,
  bodyText,
  confirmButtonVariant = null,
  disableComfirm = false,
  className,
}) => {
  return (
    <Modal
      show={showModal}
      backdrop="static"
      keyboard={false}
      onHide={onCancel}
      size={"sm"}
      className="modal__main"
      centered
    >
      <Modal.Body>
        {modalTitle && <Modal.Title className="modal__title">{modalTitle}</Modal.Title>}
        {logo && <Image className="mb-3 mt-3" src={logo}></Image>}

        {bodyText}
      </Modal.Body>
      <Modal.Footer className="modal__footer-full mb-0">
        <Button
          variant="outline-primary"
          className="modal__footer-button modal__btn-margin-right"
          onClick={onCancel}
        >
          {cancelButton}
        </Button>
        <Button
          disabled={disableComfirm}
          variant={confirmButtonVariant ?? "primary"}
          className={"modal__footer-button modal__btn-margin-left " + className ?? ""}
          onClick={onConfirm}
        >
          {confirmButton}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;

import { FC } from "react";
import { Modal, Form } from "react-bootstrap";
import i18n from "../../../i18n";
import { useState, useEffect } from "react";
import "../../../scss/page/role-management/_roleManagement.scss";
import { castIdProductToEnum, IRoleManagement } from "../../../constants/roleManagement";
import RoleManagementDropdown from "./role-management-checkbox.component";
import { toast } from "react-toastify";

interface IRoleManagementModalProps {
  modalTitle: string;
  role?: IRoleManagement;
  showModal: boolean;
  handleClose: () => void;
  createRoleManagementData: (roleManagement: IRoleManagement) => void;
  updateRoleManagementData: (roleManagement: IRoleManagement) => void;
}

const RoleManagementModal: FC<IRoleManagementModalProps> = ({
  modalTitle,
  role,
  showModal,
  handleClose,
  createRoleManagementData,
  updateRoleManagementData,
}) => {
  const [roleState, setRoleState] = useState<IRoleManagement>(
    role || ({} as IRoleManagement)
  );

  const [newRole, setNewRole] = useState<IRoleManagement>(
    { name: "", productTypeList: [], userCount:0 } || ({} as IRoleManagement)
  );

  useEffect(() => {
    setRoleState(role || ({} as IRoleManagement));
  }, [role]);

  const validation = () => {
    if (newRole.name === "") {
      toast.error(i18n.t("PLEASE_SELECT_ROLE_NAME"));
      return false;
    }
    if (newRole.productTypeList.length === 0) {
      toast.error(i18n.t("PLEASE_SELECT_PRODUCT_TYPE"));
      return false;
    }
    return true;
  };

  const validationEdit = () => {
    if (roleState.name === "") {
      toast.error(i18n.t("PLEASE_SELECT_ROLE_NAME"));
      return false;
    }
    if (roleState.productTypeList.length === 0) {
      toast.error(i18n.t("PLEASE_SELECT_PRODUCT_TYPE"));
      return false;
    }
    return true;
  };

  const handleCreateAndEditRole = () => {
    if (checkRoleNameEdit()) {
      if (validationEdit()) {
        if (roleState.id){
        updateRoleManagementData(roleState)
        }
        handleClose();
      }
    } else {
      if (validation()) {
        createRoleManagementData(newRole);
        setNewRole({ name: "", productTypeList: [], userCount:0 });
        handleClose();
      }
    }
  };

  const handleChangeNameEdit = (e: any) => {
    setRoleState({ ...roleState, name: e.target.value });
  };

  const handleChangeNewName = (e: any) => {
    setNewRole({ ...newRole, name: e.target.value });
  };

  const checkRoleNameEdit = () => {
    return Object.keys(roleState).length !== 0;
  };

  const clearStateAndClose = () => {
    setNewRole({ name: "", productTypeList: [] ,userCount:0 });
    handleClose();
  };


  const handleSetSelected = (productType: number) => {
    let addProductTypeRole;
    let productTypeObject = { id: productType, name: castIdProductToEnum(productType) };

    if (checkRoleNameEdit()) {
      addProductTypeRole = roleState.productTypeList.findIndex(
        (productTypeRole) => productTypeRole.id === productType
      );
      if (addProductTypeRole !== -1) {
        let copy = { ...roleState };
        copy.productTypeList.splice(addProductTypeRole, 1);
        let editedRole = { ...roleState, productTypeList: copy.productTypeList };
        setRoleState(editedRole);
      } else {
        addProductTypeRole = { ...roleState };
        addProductTypeRole.productTypeList.push(productTypeObject);
        setRoleState(addProductTypeRole);
      }
    } else {
      addProductTypeRole = newRole.productTypeList.findIndex(
        (productTypeRole) => productTypeRole.id === productType
      );
      if (addProductTypeRole !== -1) {
        let copy = { ...newRole };
        copy.productTypeList.splice(addProductTypeRole, 1);
        let editedRole = { ...newRole, productTypeList: copy.productTypeList };
        setRoleState(editedRole);
      } else {
        addProductTypeRole = { ...newRole };
        addProductTypeRole.productTypeList.push(productTypeObject);
        setNewRole(addProductTypeRole);
      }
    }
  };

  return (
    <div className="modal-container">
      <Modal show={showModal} onHide={handleClose} className="modal">
        <div className="modal-div">
          <div className="modal-title">
            <Modal.Title className="edit-user text-modal-title">
              {modalTitle}
            </Modal.Title>
          </div>
          <Form>
            <Modal.Body>
              <div className="name-input">
                <label className="text-form">{i18n.t("NAME")}</label>
                <input
                  type="text"
                  className="text-input"
                  value={
                    checkRoleNameEdit() ? roleState.name : newRole.name
                  }
                  onChange={
                    checkRoleNameEdit()
                      ? handleChangeNameEdit
                      : handleChangeNewName
                  }
                ></input>
              </div>
              <div className="text-form-access-product-type">
                <label className="text-form">
                  {i18n.t("ACCESS_PRODUCT_TYPE")}
                </label>
              </div>
              <RoleManagementDropdown
                role={roleState ? roleState : newRole}
                handleSetSelected={handleSetSelected}
              />
            </Modal.Body>
          </Form>
          <Modal.Footer className="div-button">
            <div>
              <button className="save-button" onClick={handleCreateAndEditRole}>
                {i18n.t("SAVE")}
              </button>
              <button className="cancel-button" onClick={clearStateAndClose}>
                {i18n.t("CANCEL")}
              </button>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default RoleManagementModal;

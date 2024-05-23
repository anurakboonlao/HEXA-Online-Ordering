import { Button, Container } from "react-bootstrap";
import SVG from "react-inlinesvg";
import BootstrapTable, { ColumnDescription } from "react-bootstrap-table-next";
import { GlobalState } from "../redux/reducers";
import RoleManagementModal from "../components/page/role-management/role-management-modal.component";
import "../scss/page/role-management/_roleManagement.scss";

import { connect } from "react-redux";
import {
  getRoleManagementData,
  deleteRoleManagementData,
  updateRoleManagementData,
  createRoleManagementData,
} from "../redux/actions/rolemanagement.action";
import { bindActionCreators } from "redux";
import PageHeader from "../components/page-header.component";
import { SideMenuOption } from "../constants/constant";
import { FC, useState } from "react";
import plusIcon from "../assets/svg/plus.svg";
import SideBarContainer from "../components/menu/side-bar.component";
import i18n from "../i18n";

import { IRoleManagement, IProductType } from "../constants/roleManagement";

import deleteIcon from "../assets/svg/delete-icon.svg";
import editIcon from "../assets/svg/edit-icon.svg";

interface IUserManagementProps {
  userRolePermission: number;
  roleManagementData: IRoleManagement[];
  deleteRoleManagementData: (id: number) => void;
  updateRoleManagementData: (roleManagement: IRoleManagement) => void;
  createRoleManagementData: (roleManagement: IRoleManagement) => void;
}

interface IRoleManagementTableShow {
  name:string,
  productTypeList: IProductType[],
  userCount: number,
}

const RoleManagement: FC<IUserManagementProps> = ({
  userRolePermission,
  updateRoleManagementData,
  createRoleManagementData,
  deleteRoleManagementData,
  roleManagementData,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [role, setRole] = useState<IRoleManagement>({
    name: "",
    productTypeList: [{} as IProductType],
    userCount:0
  });

  const columns: ColumnDescription[] = [
    {
      dataField: "name",
      text: i18n.t("ROLE"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
    },
    {
      dataField: "productTypeList",
      text: i18n.t("PRODUCT_TYPE"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      formatter: (
        cell: any,
        row: IRoleManagement,
        rowIndex: number,
        formatExtraData: any
      ) => {
        return (
          <ul>
            {cell.map((item: any) => {
              return <li key={item.id}>{item.name}</li>;
            })}
          </ul>
        );
      },
    },
    {
      dataField: "userCount",
      text: i18n.t("USER_COUNT"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
    },
    {
      dataField: "",
      text: "",
      headerClasses: "table-header-column",
      headerStyle: { width: "100px" },
      formatter: (
        cell: any,
        row: IRoleManagement,
        rowIndex: number,
        formatExtraData: any
      ) => {
        return row.userCount === 0 ? (
          <ul className="table-btn-column">
            <li>
              {" "}
              <SVG
                src={deleteIcon}
                width="16"
                height="16"
                onClick={() => handleDeleteRole(row)}
                className="svg-click"
              ></SVG>
            </li>
            <li>
              {" "}
              <SVG
                src={editIcon}
                width="16"
                height="16"
                className="svg-click"
                onClick={() => {
                  handleOpenEdit(row);
                }}
              ></SVG>
            </li>
          </ul>
        ) : <></>;
      },
      align: "right",
    },
  ];

  const handleClose = () => {
    setShowModal(false);
  };
  const handleCloseEdit = () => {
    setShowModalEdit(false);
  };
  const handleOpen = () => {
    setShowModal(true);
  };

  const handleDeleteRole = (row: any) => {
    deleteRoleManagementData(row.id);
  };

  const handleOpenEdit = (data: any) => {
    setRole(data);
    setShowModalEdit(true);
  };

  return (
    <SideBarContainer
      selectedMenu={SideMenuOption.RoleManagement}
      userRole={userRolePermission}
    >
      <Container fluid>
        <div className="page">
          <PageHeader
            pageTitle={i18n.t("ROLE_MANAGEMENT")}
            displayAction={false}
          />
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              className="secondary-btn"
              onClick={handleOpen}
            >
              <SVG src={plusIcon} width="12" height="12" className="mr-2"></SVG>
              <span> {i18n.t("USER_ADD")}</span>
            </Button>
          </div>
          <BootstrapTable
            keyField="id"
            data={roleManagementData}
            columns={columns}
            classes="table-main"
            bordered={false}
            striped
          />
          <RoleManagementModal
            modalTitle={i18n.t("CREATE_ROLE")}
            showModal={showModal}
            handleClose={handleClose}
            createRoleManagementData={createRoleManagementData}
            updateRoleManagementData={updateRoleManagementData}
          />
          <RoleManagementModal
            modalTitle={i18n.t("EDIT_ROLE")}
            showModal={showModalEdit}
            handleClose={handleCloseEdit}
            role={role}
            createRoleManagementData={createRoleManagementData}
            updateRoleManagementData={updateRoleManagementData}
          />
        </div>
      </Container>
    </SideBarContainer>
  );
};
const mapStateToProps = (state: GlobalState) => {
  return {
    userRolePermission: state.User.userRolePermission,
    roleManagementData: state.RoleManagement.roleManagement,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      getRoleManagementData,
      updateRoleManagementData,
      deleteRoleManagementData,
      createRoleManagementData,
    },
    dispatch
  ),
  dispatch,
});
export default connect(mapStateToProps, mapDispatchToProps)(RoleManagement);
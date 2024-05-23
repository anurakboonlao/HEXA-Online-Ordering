import { FC, useState } from "react";
import { Modal, Nav, Button, Form } from "react-bootstrap";
import BootstrapTable, { ColumnDescription } from "react-bootstrap-table-next";

import { IFavoriteModel } from "../../redux/domains/CaseManagement";
import ConfirmModal from "../ui/confirm-modal.component";
import MoreMenu from "../ui/more-menu.component";
import { IMoreMenu } from "../../redux/type";
import { ProductTypeEnum } from "../../constants/caseManagement";
import { convertProductTypeTonumber } from "../../utils/caseManagementUtils";
import i18n from "../../i18n";

interface IFavoriteTableProps {
  favorites: IFavoriteModel[];
  onApplyFavorite: (item: IFavoriteModel) => void;
  onRenameFavorite: (id: number, name: string) => void;
  onDeleteFavorite: (id: number) => void;
  isDisabledApply: boolean;
}

const FavoriteTable: FC<IFavoriteTableProps> = ({
  favorites,
  onApplyFavorite,
  onRenameFavorite,
  onDeleteFavorite,
  isDisabledApply,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [newName, setNewName] = useState("");

  const columns: ColumnDescription[] = [
    {
      dataField: "name",
      text: i18n.t("NAME"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
    },
    {
      dataField: "productName",
      text: i18n.t("PRODUCT"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
    },
    {
      dataField: "materials",
      text: i18n.t("MATERIAL"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      formatter: (cell: any, row: IFavoriteModel, rowIndex: number, formatExtraData: any) => {
        return row.materialModels && row.materialModels.length > 0
          ? row.materialModels
              .map((i) => {
                return i.materialName;
              })
              .join(", ")
          : "-";
      },
    },
    {
      dataField: "designs",
      text: i18n.t("DESIGN"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      formatter: (cell: any, row: IFavoriteModel, rowIndex: number, formatExtraData: any) => {
        return row.designModels && row.designModels.length > 0
          ? row.designModels
              .map((i) => {
                return i.designName;
              })
              .join(", ")
          : "-";
      },
    },
    {
      dataField: "shade",
      text: i18n.t("SHADE"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      formatter: (cell: any, row: IFavoriteModel, rowIndex: number, formatExtraData: any) => {
        return (
          <>
            {row.shade && row.shadeSystem ? (
              <>
                {<li>{i18n.t("SHADE") + ": " + (row.shade ? row.shade : "-")}</li>}
                {
                  <li>
                    {i18n.t("SHADE_SYSTEM") + ": " + (row.shadeSystem ? row.shadeSystem : "-")}
                  </li>
                }
              </>
            ) : (
              "-"
            )}
            {row.substitutionTooth && (
              <li>
                {i18n.t("SUBSTITUTION_TOOTH") +
                  ": " +
                  (row.substitutionTooth ? row.substitutionTooth : "-")}
              </li>
            )}
          </>
        );
      },
    },
    {
      dataField: "add",
      text: i18n.t("ADD_ON"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      formatter: (cell: any, row: IFavoriteModel, rowIndex: number, formatExtraData: any) => {
        if (row.addOnModels && row.addOnModels.length > 0) {
          return (
            <ul>
              {row.addOnModels?.map((i) => {
                return <li key={i.addOnId}>{i.addOnName + " " + i.inputAddOn}</li>;
              })}
            </ul>
          );
        } else {
          return "-";
        }
      },
    },
    {
      dataField: "",
      text: "",
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "right",
      headerStyle: { width: "40px" },
      formatter: (cell: any, row: IFavoriteModel, rowIndex: number, formatExtraData: any) => {
        return renderMenuItem(row);
        // <ul className="table-btn-column">
        //     <li> <SVG src={starIcon} width="16" height="16" className="svg-click" onClick={() => {onApplyFavorite(row)}}></SVG></li>
        //     <li> <SVG src={editIcon} width="16" height="16" className="svg-click" onClick={() => {onClickRename(row)}}></SVG></li>
        //     <li> <SVG src={deleteIcon} width="16" height="16" className="svg-click" onClick={() => {onClickDelete(row)}}></SVG></li>
        // </ul>
      },
    },
  ];

  const renderMenuItem = (item: IFavoriteModel) => {
    const menuList: IMoreMenu[] = [];
    if (!isDisabledApply) {
      menuList.push({
        displayText: i18n.t("APPLY_FAVORITE"),
        params: [item],
        onClicked: (params) => onApplyFavorite(params[0]),
      });
    }
    menuList.push({
      displayText: i18n.t("RENAME_FAVORITE"),
      params: [item],
      onClicked: (params) => onClickRename(params[0]),
    });
    menuList.push({
      displayText: i18n.t("DELETE_FAVORITE"),
      className: "moreMenuItem__delete",
      params: [item],
      onClicked: (params) => onClickDelete(params[0]),
    });
    return <MoreMenu menuList={menuList}></MoreMenu>;
  };

  const onClickRename = (item: IFavoriteModel) => {
    setSelectedId(item.id);
    setNewName(item.name);
    setShowModal(true);
  };

  const onClickDelete = (item: IFavoriteModel) => {
    setShowDeleteModal(true);
    setSelectedId(item.id);
  };

  const onSave = () => {
    onRenameFavorite(selectedId, newName);
    onClose();
  };

  const onClose = () => {
    setShowModal(false);
    setSelectedId(0);
    setNewName("");
  };

  const onConfirmDelete = () => {
    onDeleteFavorite(selectedId);
    onCloseDelete();
  };

  const onCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedId(0);
  };

  return (
    <div>
      <BootstrapTable
        keyField="id"
        data={favorites}
        columns={columns}
        classes="table-modal"
        bordered={false}
        striped
      />
      <Modal show={showModal} className="addon-modal" centered onHide={() => {}}>
        <Modal.Body className="addon-modal__body">
          <div className="mt-3">
            <Form.Label className="mb-3">{i18n.t("FAVORITE_NAME")}</Form.Label>
            <Form.Control
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

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
                  onClick={() => onSave()}
                >
                  {i18n.t("SAVE")}
                </Button>
              </Nav.Item>
            </Nav>
          </div>
        </Modal.Body>
      </Modal>
      <ConfirmModal
        onCancel={onCloseDelete}
        onConfirm={onConfirmDelete}
        showModal={showDeleteModal}
        bodyText={<span>{i18n.t("CONFIRM_DELETE_FAVORITE")}</span>}
        cancelButton={i18n.t("NO")}
        confirmButton={i18n.t("DELETE")}
        modalTitle={i18n.t("CONFIRMATION")}
      />
    </div>
  );
};

export default FavoriteTable;

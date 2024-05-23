import { FC } from "react";
import { Button, Modal, Nav } from "react-bootstrap";
import { ProductTypeEnum } from "../../constants/caseManagement";
import i18n from "../../i18n";
import {
  CaseOrderListModel,
  DesignModel,
  MaterialModel,
  ProductModel,
  SelectedAddOnModel,
} from "../../redux/domains/CaseManagement";
import CaseItemTable from "./case-item-table.component";

interface ISelectMultipleProductTableProps {
  show: boolean;
  archNo: string;
  prodctType: ProductTypeEnum;
  caseOrderLists: CaseOrderListModel[];
  onDeleteItem: (item: CaseOrderListModel) => void;
  onSelectItem: (selectedTeeth: CaseOrderListModel, productType: ProductTypeEnum) => void;
  onClose: () => void;
  onAddingProduct: () => void;
  onAddingFavorite: (
    selectedProductTypeId: number,
    selectedProduct: ProductModel | undefined,
    selectedMaterial: MaterialModel | undefined,
    selectedDesign: DesignModel | undefined,
    selectedAddOnList: SelectedAddOnModel[],
    selectedShade: string,
    selectedShadeSystem: string,
    selectedShadeSystemId: number | undefined,
    selectedShadeId: number | undefined,
    substitutionTooth: string | undefined
  ) => void;
  disableDelete: boolean;
}

const SelectMultipleProductTable: FC<ISelectMultipleProductTableProps> = ({
  show,
  caseOrderLists,
  archNo,
  onDeleteItem,
  onSelectItem,
  onClose,
  onAddingProduct,
  prodctType,
  onAddingFavorite,
  disableDelete,
}) => {
  const getTitle = (): string => {
    const main: string = i18n.t("PRODUCT_LIST_OF");

    let type: string = "";

    if (prodctType === ProductTypeEnum.CrownAndBridge) {
      type = i18n.t("NO") + ". ";
    }
    return main + " - " + prodctType + " - " + type + archNo;
  };

  const title: string = getTitle();

  return (
    <>
      <Modal show={show} size="lg" className="modal__overlay modal__main" centered>
        <Modal.Body>
          <Modal.Title className="modal__title">{title}</Modal.Title>
          <div className="case-detail__action">
            <Nav className="case-detail__menu mb-3">
              <Button
                className="case-detail__menu_btn"
                variant="outline-primary"
                onClick={() => onAddingProduct()}
              >
                {i18n.t("ADD_PRODUCT")}
              </Button>
            </Nav>
          </div>
          <CaseItemTable
            caseOrderLists={caseOrderLists || []}
            onDeleteItem={onDeleteItem}
            onSelectItem={onSelectItem}
            disabledDelete={disableDelete}
            showFavorite={true}
            onApplyFavorite={onAddingFavorite}
          ></CaseItemTable>
          <div className="case-detail__action">
            <Nav className="case-detail__menu mt-3">
              <Button
                className="case-detail__menu_btn"
                variant="outline-primary"
                onClick={() => onClose()}
              >
                {i18n.t("CLOSE")}
              </Button>
            </Nav>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SelectMultipleProductTable;

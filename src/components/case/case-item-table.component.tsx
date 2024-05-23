import { FC } from "react";
import SVG from "react-inlinesvg";
import BootstrapTable, { ColumnDescription } from "react-bootstrap-table-next";

import { ProductTypeEnum } from "../../constants/caseManagement";
import {
  CaseOrderListModel,
  ProductModel,
  MaterialModel,
  DesignModel,
  SelectedAddOnModel,
} from "../../redux/domains/CaseManagement";

import deleteIcon from "../../assets/svg/delete-icon.svg";
import editIcon from "../../assets/svg/edit-icon.svg";
import starIcon from "../../assets/svg/star.svg";
import { convertProductTypeTonumber } from "../../utils/caseManagementUtils";
import i18n from "../../i18n";

interface ICaseItemTableProps {
  caseOrderLists: CaseOrderListModel[];
  onApplyFavorite?: (
    selectedProductTypeId: number,
    selectedProduct: ProductModel | undefined,
    selectedMaterial: MaterialModel | undefined,
    selectedDesign: DesignModel | undefined,
    selectedAddOnList: SelectedAddOnModel[],
    selectedShade: string,
    selectedShadeSystem: string,
    selectedShadeSystemId: number | undefined,
    selectedShadeId: number | undefined,
    substutitionTooth: string | undefined
  ) => void;
  onSelectItem: (select: CaseOrderListModel, productType: ProductTypeEnum) => void;
  onDeleteItem: (select: CaseOrderListModel) => void;
  disabledDelete: boolean;
  displayMethodColumn?: boolean;
  displayActionColumn?: boolean;
  showFavorite?: boolean;
}

const CaseItemTable: FC<ICaseItemTableProps> = ({
  displayMethodColumn = false,
  caseOrderLists,
  onApplyFavorite,
  onSelectItem,
  onDeleteItem,
  disabledDelete,
  displayActionColumn = true,
  showFavorite = false,
}) => {
  const columns = () => {
    const columnHeader: ColumnDescription[] = [
      {
        dataField: "fav",
        text: i18n.t("FAVORITE"),
        headerClasses: "table-header-column text-left",
        headerStyle: { width: "90px" },
        classes: "table-column text-left",
        align: "letf",
        hidden: !showFavorite,
        formatter: (cell: any, row: CaseOrderListModel, rowIndex: number, formatExtraData: any) => {
          return (
            <div className="div-star">
              <SVG
                src={starIcon}
                width="16"
                height="16"
                className="svg-star"
                onClick={() =>
                  onApplyFavorite &&
                  onApplyFavorite(
                    row.productTypeId,
                    row.selectProduct,
                    row.selectMaterial,
                    row.selectDesign,
                    row.selectAddOn ?? [],
                    row.selectShade,
                    row.selectShadeSystem,
                    row.selectedShadeSystemId,
                    row.selectedShadeId,
                    row.substitutionTooth
                  )
                }
              />
            </div>
          );
        },
      },
      {
        dataField: "option",
        text: i18n.t("ARCH_NO"),
        isDummyField: true,
        headerClasses: "table-header-column text-left",
        classes: "table-column",
        align: "left",
        formatter: (cell: any, row: CaseOrderListModel, rowIndex: number, formatExtraData: any) => {
          return <span>{row.option ? `${row.no}, ${row.option}` : row.no}</span>;
        },
      },
      {
        dataField: "productType",
        text: i18n.t("TYPE"),
        headerClasses: "table-header-column text-left",
        classes: "table-column",
        align: "left",
      },
      {
        dataField: "selectProduct.name",
        text: i18n.t("PRODUCT"),
        headerClasses: "table-header-column text-left",
        classes: "table-column",
        formatter: (cell: any, row: CaseOrderListModel, rowIndex: number, formatExtraData: any) => {
          return <span>{cell && cell !== "" ? cell : "-"}</span>;
        },
        align: "left",
      },
      {
        dataField: "method.name",
        text: i18n.t("METHOD"),
        headerClasses: "table-header-column text-left",
        classes: "table-column",
        hidden: !displayMethodColumn,
        formatter: (cell: any, row: CaseOrderListModel, rowIndex: number, formatExtraData: any) => {
          return <span>{cell && cell !== "" ? cell : "-"}</span>;
        },
        align: "left",
      },
      {
        dataField: "selectMaterial.name",
        text: i18n.t("MATERIAL"),
        headerClasses: "table-header-column text-left",
        classes: "table-column",
        align: "left",
        formatter: (cell: any, row: CaseOrderListModel, rowIndex: number, formatExtraData: any) => {
          return <span>{cell && cell !== "" ? cell : "-"}</span>;
        },
      },
      {
        dataField: "selectDesign.name",
        text: i18n.t("DESIGN"),
        headerClasses: "table-header-column text-left",
        classes: "table-column",
        align: "left",
        formatter: (cell: any, row: CaseOrderListModel, rowIndex: number, formatExtraData: any) => {
          return <span>{cell && cell !== "" ? cell : "-"}</span>;
        },
      },
      {
        dataField: "shade",
        text: i18n.t("SHADE"),
        headerClasses: "table-header-column text-left",
        classes: "table-column",
        align: "left",
        formatter: (cell: any, row: CaseOrderListModel, rowIndex: number, formatExtraData: any) => {
          return (
            <>
              {row.selectShade && row.selectShadeSystem ? (
                <>
                  {<li>{i18n.t("SHADE") + ": " + (row.selectShade ? row.selectShade : "-")}</li>}
                  {
                    <li>
                      {i18n.t("SHADE_SYSTEM") +
                        ": " +
                        (row.selectShadeSystem ? row.selectShadeSystem : "-")}
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
        dataField: "addOn",
        text: i18n.t("ADD_ON"),
        headerClasses: "table-header-column text-left",
        classes: "table-column addon-list",
        formatter: (cell: any, row: CaseOrderListModel, rowIndex: number, formatExtraData: any) => {
          if (row && row.selectAddOn && row.selectAddOn.length > 0) {
            return (
              <ul className="">
                {row.selectAddOn?.map((value, index) => (
                  <li key={row.no + "_addon_" + index}>
                    <span>
                      {" "}
                      {value.displayName +
                        (value.requiredInput
                          ? value.inputType === 1
                            ? " #" + value.input
                            : " " + value.input
                          : "")}
                    </span>
                  </li>
                ))}
              </ul>
            );
          } else {
            return <span>-</span>;
          }
        },
        align: "left",
      },
    ];
    if (displayActionColumn) {
      columnHeader.push({
        dataField: "",
        text: "",
        headerClasses: "table-header-column",
        headerStyle: { width: "100px" },
        classes: "table-column",
        formatter: (cell: any, row: CaseOrderListModel, rowIndex: number, formatExtraData: any) => {
          return (
            <ul className="table-btn-column">
              <li>
                {" "}
                <SVG
                  src={editIcon}
                  width="16"
                  height="16"
                  className="svg-click"
                  onClick={() => onSelectItem(row, row.productType)}
                ></SVG>
              </li>
              <li>
                {" "}
                {disabledDelete ? (
                  ""
                ) : (
                  <SVG
                    src={deleteIcon}
                    width="16"
                    height="16"
                    className="svg-click"
                    onClick={() => onDeleteItem(row)}
                  ></SVG>
                )}
              </li>
            </ul>
          );
        },
      });
    }

    return columnHeader;
  };

  return (
    <BootstrapTable
      keyField="uniqueName"
      data={caseOrderLists}
      columns={columns()}
      classes="table-main"
      bordered={false}
      striped
    />
  );
};

export default CaseItemTable;
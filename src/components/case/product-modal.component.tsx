import { FC, useState, useEffect, useCallback } from "react";
import {
  Button,
  Form,
  Modal,
  Nav,
  Tabs,
  Tab,
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import _, { find, findIndex } from "lodash";
import SVG from "react-inlinesvg";

import AddOnInputModal from "../case/addon-input-modal.component";
import FavoriteTable from "../case/favorite-table.component";
import { ProductTypeEnum, TeethEnum, ProductStepEnum } from "../../constants/caseManagement";
import {
  ProductGroupModel,
  ProductModel,
  MaterialModel,
  DesignModel,
  AddOnModel,
  SelectedAddOnModel,
  IFavoriteModel,
  IFavoriteAddOnModel,
  GroupAddOnModel,
  CatalogModel,
  CaseOrderListModel,
  ShadeSystemModel,
  ShadeModel,
} from "../../redux/domains/CaseManagement";
import { convertProductTypeIdToProductTypeEnum } from "../../utils/caseManagementUtils";

import starIcon from "../../assets/svg/star.svg";
import { toast } from "react-toastify";
import i18n from "../../i18n";

interface ICaseProductModalProps {
  substitutionTooth: string | undefined;
  setSubstitutionTooth: (input: string) => void;
  shadeSystemList: ShadeSystemModel[];
  selectedProductType: ProductTypeEnum;
  selectedProductTypeId: number;
  selectedTeeth: TeethEnum;
  show: boolean;
  productGroups: ProductGroupModel[];
  onSave: () => void;
  onClose: () => void;
  confirmShowing: boolean;
  selectedProduct: ProductModel | undefined;
  selectedMaterial: MaterialModel | undefined;
  selectedDesign: DesignModel | undefined;
  selectedAddOnList: SelectedAddOnModel[];
  selectedShade: string;
  selectedShadeSystem: string;
  selectedShadeSystemId: number | undefined;
  selectedShadeId: number | undefined;
  setSelectedProduct: (product: ProductModel | undefined) => void;
  setSelectedMaterial: (material: MaterialModel | undefined) => void;
  setSelectedDesign: (design: DesignModel | undefined) => void;
  setSelectedAddOnList: (addOnList: SelectedAddOnModel[]) => void;
  setSelectedShade: (shade: ShadeModel) => void;
  setSelectedShadeSystem: (shadeSystem: ShadeSystemModel) => void;
  disabledEdit: boolean;
  favorites: IFavoriteModel[];
  onAddFavorite: (
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
  onRenameFavorite: (id: number, name: string) => void;
  onDeleteFavorite: (id: number) => void;
  onSelectedItemByFavorite: (
    product: ProductModel,
    material: MaterialModel | undefined,
    design: DesignModel | undefined,
    addOnList: SelectedAddOnModel[],
    shade: string,
    shadeSystem: string,
    shadeSystemId: number,
    shadeId: number,
    substitutionTooth: string
  ) => void;
  catalogs?: CatalogModel[];
  filteredCaseOrderList?: CaseOrderListModel[]; // case order list that filter by selectedTeeth and selectedProductType
}

const CaseProductModal: FC<ICaseProductModalProps> = ({
  selectedShadeSystemId,
  selectedShadeId,
  substitutionTooth,
  setSubstitutionTooth,
  show,
  confirmShowing,
  onClose,
  onSave,
  productGroups,
  selectedProduct,
  selectedMaterial,
  selectedDesign,
  selectedAddOnList,
  selectedShade,
  selectedShadeSystem,
  setSelectedProduct,
  setSelectedMaterial,
  setSelectedDesign,
  setSelectedAddOnList,
  setSelectedShade,
  setSelectedShadeSystem,
  disabledEdit,
  favorites,
  onAddFavorite,
  onRenameFavorite,
  onDeleteFavorite,
  selectedProductTypeId,
  onSelectedItemByFavorite,
  selectedProductType,
  catalogs,
  filteredCaseOrderList,
  shadeSystemList,
}) => {
  const [currentTab, setCurrentTab] = useState(ProductStepEnum.Product);
  const [hasShadeTab, setHasShadeTab] = useState<boolean>(false);
  const [showAddOnInput, setShowAddOnInput] = useState<boolean>(false);
  const [addOnModel, setAddOnModel] = useState<AddOnModel | undefined>(undefined);
  const [addOnInput, setAddOnInput] = useState("");
  const [enabledMaterialTab, setEnabledMaterialTab] = useState<boolean>(false);
  const [enabledDesignTab, setEnabledDesignTab] = useState<boolean>(false);
  const [enabledAddOnTab, setEnabledAddOnTab] = useState<boolean>(false);
  const [enableShadeTab, setEnableShadeTab] = useState<boolean>(false);
  const [enableSubstitutionToothTab, setEnableSubstitutionToothTab] = useState<boolean>(false);
  const [caseOrderList, setCaseOrderList] = useState<CaseOrderListModel[] | undefined>([]);
  const [shadeList, setShadeList] = useState<ShadeModel[] | undefined>([]);

  const onSelectTab = (method: ProductStepEnum) => {
    setCurrentTab(method);
  };

  const bindGroupProdct = () => {
    const groupItems: Array<JSX.Element> = [];
    if (productGroups && productGroups.length > 0) {
      productGroups.forEach((group) => {
        if (group.displayAsGroup) {
          groupItems.push(
            <Form.Label key={"group-" + group.id} className="product-modal__group-label">
              {group.name}
            </Form.Label>
          );
        }
        const product: Array<JSX.Element> = bindProdct(group.productItems);
        if (product.length > 0) {
          groupItems.push(
            <div key={"group-detail-" + group.id} className="product-modal__tab-content">
              {product}
            </div>
          );
        }
      });
      return <div>{groupItems}</div>;
    }
    return <></>;
  };

  const isProductSelected = (product: ProductModel) => {
    if (!caseOrderList || caseOrderList.length === 0) return false;

    const isSelected = caseOrderList.some((element) => {
      if (element.selectProduct?.id === selectedProduct?.id) {
        // edit case, skip the product we choose
        return false;
      }
      return element.selectProduct?.id === product.id;
    });
    return isSelected;
  };

  const bindProdct = (productList: ProductModel[]) => {
    const productHtmlList: Array<JSX.Element> = [];
    if (productList && productList.length > 0) {
      productList.forEach((product) => {
        let disableProduct: boolean = isProductSelected(product); // if product is already selected, disable it.

        productHtmlList.push(
          <div key={"product_" + product.id} className=" col-12 col-md-6 col-lg-3 px-1 my-2">
            <Button
              disabled={disabledEdit || disableProduct}
              className={
                (selectedProduct?.id === product.id
                  ? " selected"
                  : disabledEdit || disableProduct
                  ? " disabled"
                  : "") + " product-modal__item-redio w-100"
              }
              onClick={() => onSelectProduct(product.id)}
              variant=""
            >
              <div className="product-modal__item-logo">
                {product.logoPath ? (
                  <img
                    alt={product.name}
                    src={product.logoPath}
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  ></img>
                ) : (
                  <></>
                )}
              </div>
              <div className="product-modal__item-name">{product.name}</div>
            </Button>
          </div>
        );
      });
    }
    return productHtmlList;
  };

  const bindMaterial = (materialList: MaterialModel[] | undefined) => {
    const materialHtmlList: Array<JSX.Element> = [];
    if (materialList && materialList.length > 0) {
      materialList.forEach((material) => {
        materialHtmlList.push(
          <div key={"material_" + material.id} className=" col-12 col-md-6 col-lg-3 px-1 my-2">
            <Button
              disabled={disabledEdit}
              className={
                (selectedMaterial?.id === material.id
                  ? " selected"
                  : disabledEdit
                  ? " disabled"
                  : "") + " product-modal__item-redio w-100"
              }
              onClick={() => onSelectMaterial(material.id)}
              variant=""
            >
              <div className="product-modal__item-logo">
                {material.logoPath ? (
                  <img
                    alt={material.name}
                    src={material.logoPath}
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  ></img>
                ) : (
                  <></>
                )}
              </div>
              <div className="product-modal__item-name">{material.name}</div>
            </Button>
          </div>
        );
      });
    }
    return <div className="product-modal__tab-content">{materialHtmlList}</div>;
  };

  const bindDesign = (designList: DesignModel[] | undefined) => {
    const designHtmlList: Array<JSX.Element> = [];
    if (designList && designList.length > 0) {
      designList.forEach((design) => {
        designHtmlList.push(
          <div key={"design_" + design.id} className=" col-12 col-md-6 col-lg-3 px-1 my-2">
            <Button
              disabled={disabledEdit}
              className={
                (selectedDesign?.id === design.id ? " selected" : disabledEdit ? " disabled" : "") +
                " product-modal__item-redio w-100"
              }
              onClick={() => onSelectDesign(design.id)}
              variant=""
            >
              <div className="product-modal__item-logo">
                {design.logoPath ? (
                  <img
                    alt={design.name}
                    src={design.logoPath}
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  ></img>
                ) : (
                  <></>
                )}
              </div>
              <div className="product-modal__item-name">{design.name}</div>
            </Button>
          </div>
        );
      });
    }
    return <div className="product-modal__tab-content">{designHtmlList}</div>;
  };

  const bindGroupAddOns = (groupAddOnList: GroupAddOnModel[] | undefined) => {
    const groupItems: Array<JSX.Element> = [];
    if (groupAddOnList && groupAddOnList.length > 0) {
      groupAddOnList.forEach((group) => {
        if (group.displayAsGroup) {
          groupItems.push(
            <Form.Label key={"group-addon-" + group.id} className="product-modal__group-label">
              {group.name}
            </Form.Label>
          );
        }
        const addOn: Array<JSX.Element> = bindAddOn(group.addOns);
        if (addOn.length > 0) {
          groupItems.push(
            <div key={"group-addon-item-" + group.id} className="product-modal__tab-content">
              {addOn}
            </div>
          );
        }
      });
      return <div>{groupItems}</div>;
    }
    return <></>;
  };

  const bindAddOn = (addOnList: AddOnModel[] | undefined) => {
    const addOnHtmlList: Array<JSX.Element> = [];
    if (addOnList && addOnList.length > 0) {
      addOnList.forEach((addOn) => {
        addOnHtmlList.push(
          <div key={"design_" + addOn.id} className=" col-12 col-md-6 col-lg-3 px-1 my-2">
            <Button
              disabled={disabledEdit}
              className={
                (isSelectedAddOn(addOn.id) ? " selected" : disabledEdit ? " disabled" : "") +
                " product-modal__item-redio w-100"
              }
              onClick={() => onSelectAddOn(addOn.id)}
              variant=""
            >
              <div className="product-modal__item-logo">
                {addOn.logoPath ? (
                  <img
                    alt={addOn.name}
                    src={addOn.logoPath}
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  ></img>
                ) : (
                  <></>
                )}
              </div>
              <div className="product-modal__item-name">{addOn.name}</div>
            </Button>
          </div>
        );
      });
    }
    return addOnHtmlList;
  };

  const onSelectedShadeSystem = (shadeSystem: ShadeSystemModel) => {
    const findShadeSystem = shadeSystemList.find((shade) => shade.id === shadeSystem.id);
    setShadeList(findShadeSystem?.shades);
    setSelectedShadeSystem(shadeSystem);
  };

  const onSelectedShade = (shade: ShadeModel) => {
    setSelectedShade(shade);
  };

  const displaySubstitutionInput = () => {
    if (selectedProductType === ProductTypeEnum.Removable) {
      return (
        <>
          <Row className="justify-content-left case-detail__method justify-content-between pl-3 pr-3">
            <Col md={12}>
              <Form.Label className="addon-modal__label mt-3">
                {i18n.t("SUBSTITUTION_TOOTH")}
              </Form.Label>
            </Col>
          </Row>
          <Row className="pl-3 pr-3 mt-2">
            <Col md={12} sm={12} lg={6}>
              <Form.Control
                type="text"
                placeholder={i18n.t("PLEASE_SPECTIFY")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSubstitutionTooth(e.target.value)
                }
                value={substitutionTooth}
              />
            </Col>
          </Row>
        </>
      );
    }
  };

  const bindShadeField = () => {
    const shadeHtmlList: Array<JSX.Element> = [];

    if (shadeSystemList.length > 0) {
      shadeHtmlList.push(
        <>
          <Row className="justify-content-left case-detail__method justify-content-between pl-3 pr-3">
            <Col md={12}>
              <Form.Label className="addon-modal__label mt-3">{i18n.t("SHADE_SYSTEM")}</Form.Label>
            </Col>
          </Row>

          <Row className="pl-3 pr-3">
            <Dropdown className="dropdown-light dropdown-shade pl-3 pr-3 mt-2" as={ButtonGroup}>
              <Dropdown.Toggle className="border-radius-4" variant="" disabled={disabledEdit}>
                {selectedShadeSystem || i18n.t("PLEASE_SPECTIFY")}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-light-menu hexa__box-shadow">
                {shadeSystemList.map((value, index) => (
                  <Dropdown.Item
                    eventKey={value.id}
                    key={value.id}
                    className="dropdown-button-dropdown-item"
                    onSelect={() => onSelectedShadeSystem(value)}
                  >
                    <span>{value.name}</span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Row>

          <Row className="justify-content-left case-detail__method justify-content-between pl-3 pr-3">
            <Col md={12}>
              <Form.Label className="addon-modal__label mt-3">{i18n.t("SHADE")}</Form.Label>
            </Col>
          </Row>

          <Row className="pl-3 pr-3">
            <Dropdown className="dropdown-light dropdown-shade pl-3 pr-3 mt-2" as={ButtonGroup}>
              <Dropdown.Toggle
                className="border-radius-4"
                variant=""
                disabled={!selectedShadeSystem || disabledEdit}
              >
                {selectedShade || i18n.t("PLEASE_SPECTIFY")}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-light-menu hexa__box-shadow">
                {shadeList?.map((value, index) => (
                  <Dropdown.Item
                    eventKey={value.id}
                    key={value.id}
                    className="dropdown-button-dropdown-item"
                    onSelect={() => onSelectedShade(value)}
                  >
                    <span>{value.name}</span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Row>
        </>
      );
    }

    return shadeHtmlList;
  };

  const onSelectProduct = (productId: number) => {
    let group = find(productGroups, function (g) {
      return find(g.productItems, function (p) {
        return p.id === productId;
      });
    });

    if (group) {
      let product = find((group as ProductGroupModel).productItems, function (p) {
        return p.id === productId;
      });

      if (product) {
        if (selectedProduct?.id === product.id) setNextTab(product, selectedProductType);
        else {
          setSelectedProduct(product);
          loadItemInProduct(product, true, selectedProductType);
          setNextTab(product, selectedProductType);
        }
      }
    }
  };

  const onSelectMaterial = (materialId: number) => {
    if (selectedProduct?.materials) {
      let material = find(selectedProduct?.materials, ["id", materialId]);
      setSelectedMaterial(material);
      if (material) {
        if (selectedProduct?.designs && selectedProduct.designs.length > 0) {
          setCurrentTab(ProductStepEnum.Design);
        } else if (hasShadeTab) {
          setCurrentTab(ProductStepEnum.Shade);
        } else if (selectedProduct.addOnGroups && selectedProduct.addOnGroups.length > 0) {
          setCurrentTab(ProductStepEnum.AddOn);
        }
      }
    }
  };

  const onSelectDesign = (designId: number) => {
    if (selectedProduct?.designs) {
      let design = find(selectedProduct?.designs, ["id", designId]);
      setSelectedDesign(design);
      if (design) {
        if (hasShadeTab) setCurrentTab(ProductStepEnum.Shade);
        else if (selectedProduct.addOnGroups && selectedProduct.addOnGroups.length > 0)
          setCurrentTab(ProductStepEnum.AddOn);
      }
    }
  };

  const findAddOnInGroup = (addOnId: number, Product: ProductModel | undefined) => {
    const result = _.flatMap(Product?.addOnGroups, (item) =>
      _(item.addOns).filter({ id: addOnId }).value()
    );
    if (result?.length > 0) {
      return result[0];
    }
    return undefined;
  };

  const onSelectAddOn = (addOnId: number) => {
    if (isSelectedAddOn(addOnId)) {
      setSelectedAddOnList(selectedAddOnList.filter((x) => x.id !== addOnId));
    } else {
      let addOn = findAddOnInGroup(addOnId, selectedProduct);
      if (addOn && addOn.requiredInput) {
        setShowAddOnInput(true);
        setAddOnModel(addOn);
        setAddOnInput("");
      } else if (addOn) {
        setSelectedAddOnList([
          ...selectedAddOnList,
          {
            id: addOn.id,
            name: addOn.name,
            displayName: addOn.displayName,
            colorCode: addOn.colorCode,
            logoPath: addOn.logoPath,
            requiredInput: addOn.requiredInput,
            inputType: addOn.inputType,
            groupAddOnId: addOn.groupAddOnId,
            input: "",
          },
        ]);
      }
    }
  };

  const canApplyFavorite = (favItem: IFavoriteModel) => {
    if (!filteredCaseOrderList || filteredCaseOrderList.length === 0) {
      return true;
    }

    // check if the favorite product you want to apply is already selected?
    const hasProduct: boolean = filteredCaseOrderList.some((element) => {
      return element.selectProduct?.id === favItem.productId;
    });

    if (hasProduct) {
      return false;
    }

    return true;
  };

  const onApplyFavorite = (favItem: IFavoriteModel) => {
    if (!favItem) {
      toast.error(i18n.t("NO_FAVORITE_PRODUCT_IS_SELECTED"));
      return;
    }

    if (!canApplyFavorite(favItem)) {
      toast.error(
        i18n.t("CAN_NOT_APPLY_FAVORITE") +
          favItem.productName +
          " " +
          i18n.t("IS_ALREADY_SELECTED") +
          "."
      );
      return;
    }

    let group = find(productGroups, function (g) {
      return find(g.productItems, function (p) {
        return p.id === favItem.productId;
      });
    });

    if (group) {
      let product = find((group as ProductGroupModel).productItems, function (p) {
        return p.id === favItem.productId;
      });

      if (product) {
        selectItemByFavorite(favItem, product);
      }
    }
  };

  const selectItemByFavorite = (favItem: IFavoriteModel, product: ProductModel) => {
    let material: MaterialModel | undefined = undefined;
    let design: DesignModel | undefined = undefined;
    let addOns: SelectedAddOnModel[] = [];
    let shade: string = "";
    let shadeSystem: string = "";
    let substitutionTooth: string = "";
    let shadeSystemId: number = 0;
    let shadeId: number = 0;
    if (favItem.materialModels && favItem.materialModels.length > 0) {
      material = find(product?.materials, ["id", favItem.materialModels[0].materialId]);
    }
    if (favItem.designModels && favItem.designModels.length > 0) {
      design = find(product?.designs, ["id", favItem.designModels[0].designId]);
    }
    if (favItem.addOnModels && favItem.addOnModels.length > 0) {
      addOns = getAddOnByFavorite(favItem.addOnModels, product);
    }
    if (favItem.shade && favItem.shade.length > 0) {
      shade = favItem.shade;
    }
    if (favItem.shadeSystem && favItem.shadeSystem.length > 0) {
      shadeSystem = favItem.shadeSystem;
    }
    if (favItem.shadeSystemId && favItem.shadeSystemId !== null) {
      shadeSystemId = favItem.shadeSystemId;
    }
    if (favItem.shadeId && favItem.shadeId !== null) {
      shadeId = favItem.shadeId;
    }
    if (favItem.substitutionTooth && favItem.substitutionTooth.length > 0) {
      substitutionTooth = favItem.substitutionTooth;
    }
    onSelectedItemByFavorite(
      product,
      material,
      design,
      addOns,
      shade,
      shadeSystem,
      shadeSystemId,
      shadeId,
      substitutionTooth
    );
    setTabForFavorite(product, material, design, addOns, shade, shadeSystem, favItem.productTypeId);
  };

  const getAddOnByFavorite = (addOns: IFavoriteAddOnModel[], product: ProductModel) => {
    const addOnList: SelectedAddOnModel[] = [];
    addOns.forEach((item) => {
      const addOn = findAddOnInGroup(item.addOnId, product); // send product
      if (addOn) {
        addOnList.push({
          id: addOn.id,
          name: addOn.name,
          displayName: addOn.displayName,
          colorCode: addOn.colorCode,
          logoPath: addOn.logoPath,
          requiredInput: addOn.requiredInput,
          inputType: addOn.inputType,
          groupAddOnId: addOn.groupAddOnId,
          input: item.inputAddOn,
        });
      }
    });
    return addOnList;
  };

  const setTabForFavorite = (
    product: ProductModel,
    material: MaterialModel | undefined,
    design: DesignModel | undefined,
    addOnList: SelectedAddOnModel[],
    shade: string,
    shadeSystem: string,
    prouctTypeId: number
  ) => {
    const productType: ProductTypeEnum | 0 =
      convertProductTypeIdToProductTypeEnum(prouctTypeId);
    const hasShade: boolean =
      productType === ProductTypeEnum.CrownAndBridge || productType === ProductTypeEnum.Removable;

    if (product.materials?.length > 0 && material === undefined) {
      setCurrentTab(ProductStepEnum.Material);
    } else if (product?.designs?.length > 0 && design === undefined) {
      setCurrentTab(ProductStepEnum.Design);
    } else if (hasShade && (shade.length === 0 || shadeSystem.length === 0)) {
      setCurrentTab(ProductStepEnum.Shade);
    } else if (product.addOnGroups?.length > 0 && addOnList === []) {
      setCurrentTab(ProductStepEnum.AddOn);
    } else if (product.addOnGroups?.length > 0) {
      setCurrentTab(ProductStepEnum.AddOn);
    } else if (hasShade) {
      setCurrentTab(ProductStepEnum.Shade);
    } else if (product?.designs?.length > 0) {
      setCurrentTab(ProductStepEnum.Design);
    } else if (product.materials?.length > 0) {
      setCurrentTab(ProductStepEnum.Material);
    } else {
      setCurrentTab(ProductStepEnum.Product);
    }
  };

  const isSelectedAddOn = (addOnId: number) => {
    return findIndex(selectedAddOnList, ["id", addOnId]) > -1;
  };

  const loadItemInProduct = useCallback(
    (product: ProductModel | undefined, isSetNextTab: boolean, productType: ProductTypeEnum) => {
      if (product) {
        setEnabledMaterialTab(product?.materials && product?.materials.length > 0);
        setEnabledDesignTab(product?.designs && product?.designs.length > 0);
        setEnabledAddOnTab(product?.addOnGroups && product?.addOnGroups.length > 0);
        setHasShadeTab(
          productType === ProductTypeEnum.CrownAndBridge ||
            productType === ProductTypeEnum.Removable
        );
        setEnableShadeTab(
          productType === ProductTypeEnum.CrownAndBridge ||
            productType === ProductTypeEnum.Removable
        );
      } else {
        setEnabledMaterialTab(false);
        setEnabledDesignTab(false);
        setEnabledAddOnTab(false);
        setEnableShadeTab(false);
      }
    },
    []
  );

  const setNextTab = (product: ProductModel, productType: ProductTypeEnum) => {
    if (product.materials?.length > 0) {
      setCurrentTab(ProductStepEnum.Material);
    } else if (product?.designs?.length > 0) {
      setCurrentTab(ProductStepEnum.Design);
    } else if (
      productType === ProductTypeEnum.CrownAndBridge ||
      productType === ProductTypeEnum.Removable
    ) {
      setCurrentTab(ProductStepEnum.Shade);
    } else if (product.addOnGroups?.length > 0) {
      setCurrentTab(ProductStepEnum.AddOn);
    }
  };

  const onSaveAddOnInput = (newInput: string) => {
    if (addOnModel) {
      setSelectedAddOnList([
        ...selectedAddOnList,
        {
          id: addOnModel.id,
          name: addOnModel.name,
          displayName: addOnModel.displayName,
          colorCode: addOnModel.colorCode,
          logoPath: addOnModel.logoPath,
          requiredInput: addOnModel.requiredInput,
          inputType: addOnModel.inputType,
          groupAddOnId: addOnModel.groupAddOnId,
          input: newInput,
        },
      ]);
    }
    setShowAddOnInput(false);
    setAddOnModel(undefined);
    setAddOnInput("");
  };
  const onCloseAddOnInput = () => {
    setShowAddOnInput(false);
    setAddOnModel(undefined);
    setAddOnInput("");
  };

  const displaySelectStep = () => {
    return (
      <Row>
        <Col sm={11}>
          <div className="product-modal__status">
            <Button
              className="product-modal__status-btn"
              variant=""
              onClick={() => {
                setCurrentTab(ProductStepEnum.Product);
              }}
            >
              {selectedProduct ? selectedProduct.name : i18n.t("PRODUCT")}
            </Button>
            <Button
              className="product-modal__status-btn"
              disabled={!enabledMaterialTab}
              variant=""
              onClick={() => {
                setCurrentTab(ProductStepEnum.Material);
              }}
            >
              {!enabledMaterialTab
                ? "-"
                : selectedMaterial
                ? selectedMaterial.name
                : i18n.t("MATERIAL")}
            </Button>
            <Button
              className="product-modal__status-btn"
              disabled={!enabledDesignTab}
              variant=""
              onClick={() => {
                setCurrentTab(ProductStepEnum.Design);
              }}
            >
              {!enabledDesignTab ? "-" : selectedDesign ? selectedDesign.name : i18n.t("DESIGN")}
            </Button>
            <Button
              className="product-modal__status-btn"
              disabled={!enableShadeTab}
              variant=""
              onClick={() => {
                setCurrentTab(ProductStepEnum.Shade);
              }}
            >
              {!enableShadeTab
                ? "-"
                : selectedShade?.length > 0
                ? i18n.t("SHADE") + ": " + selectedShade
                : i18n.t("SHADE")}
            </Button>
            <Button
              className="product-modal__status-btn"
              disabled={!enableShadeTab}
              variant=""
              onClick={() => {
                setCurrentTab(ProductStepEnum.Shade);
              }}
            >
              {!enableShadeTab
                ? "-"
                : selectedShadeSystem?.length > 0
                ? i18n.t("SHADE_SYSTEM") + ": " + selectedShadeSystem
                : i18n.t("SHADE_SYSTEM")}
            </Button>

            {selectedProductType === ProductTypeEnum.Removable && (
              <Button
                className="product-modal__status-btn"
                disabled={!enableShadeTab}
                variant=""
                onClick={() => setCurrentTab(ProductStepEnum.Shade)}
              >
                {!enableShadeTab
                  ? "-"
                  : substitutionTooth !== undefined
                  ? i18n.t("SUBSTITUTION_TOOTH") + ": " + substitutionTooth
                  : i18n.t("SUBSTITUTION_TOOTH")}
              </Button>
            )}

            {/* <Button className="product-modal__status-btn" disabled={!enabledAddOnTab} variant="" onClick={() => { setCurrentTab(ProductStepEnum.AddOn) }}>
                            {!enabledAddOnTab ? "-" : selectedAddOnList ? selectedAddOnList.length : "AddOn"}
                        </Button> */}
            {displaySelectAddOnStep()}
          </div>
        </Col>
        <Col sm={1} className="text-center pad-top-10px">
          {displayFavoriteIcon()}
        </Col>
      </Row>
    );
  };

  const displayFavoriteIcon = () => {
    if (selectedProduct) {
      return (
        <OverlayTrigger placement="left" delay={{ show: 0, hide: 100 }} overlay={renderTooltip}>
          <SVG
            src={starIcon}
            width="24"
            height="24"
            className="svg-star"
            onClick={() =>
              onAddFavorite(
                selectedProductTypeId,
                selectedProduct,
                selectedMaterial,
                selectedDesign,
                selectedAddOnList,
                selectedShade,
                selectedShadeSystem,
                selectedShadeSystemId,
                selectedShadeId,
                substitutionTooth
              )
            }
          />
        </OverlayTrigger>
      );
    }
    return;
  };

  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props} className="favorite-tooltip">
      {i18n.t("ADD_TO_FAVORITE")}
    </Tooltip>
  );

  const displaySelectAddOnStep = () => {
    if (
      !enabledAddOnTab ||
      !selectedAddOnList ||
      (selectedAddOnList && selectedAddOnList.length === 0)
    ) {
      return (
        <Button
          className="product-modal__status-btn"
          disabled={!enabledAddOnTab}
          variant=""
          onClick={() => {
            setCurrentTab(ProductStepEnum.AddOn);
          }}
        >
          {!enabledAddOnTab ? "-" : i18n.t("ADD_ON")}
        </Button>
      );
    } else {
      return (
        <>
          {selectedAddOnList?.map((value, index) => (
            <Button
              key={index}
              className="product-modal__status-btn"
              disabled={!enabledAddOnTab}
              variant=""
              onClick={() => {
                setCurrentTab(ProductStepEnum.AddOn);
              }}
            >
              {value.displayName +
                (value.requiredInput
                  ? value.inputType === 1
                    ? " #" + value.input
                    : " " + value.input
                  : "")}
            </Button>
          ))}
        </>
      );
    }
  };

  const displayFavoritesTable = () => {
    return (
      <FavoriteTable
        favorites={favorites}
        onApplyFavorite={onApplyFavorite}
        onRenameFavorite={onRenameFavorite}
        onDeleteFavorite={onDeleteFavorite}
        isDisabledApply={disabledEdit}
      />
    );
  };

  const HasShadeAndShadeSystemFilled = () => {
    // check shade and shadeSystem
    console.log("asdf", selectedProductType);

    if (
      selectedProductType === ProductTypeEnum.Removable &&
      (substitutionTooth === undefined || substitutionTooth === "")
    ) {
      toast.error(i18n.t("PLEASE_FILL_SUBSTITUTION_TOOTH"));
      return false;
    }

    if (
      selectedProductType === ProductTypeEnum.CrownAndBridge ||
      selectedProductType === ProductTypeEnum.Removable
    ) {
      if (
        selectedShade === undefined ||
        selectedShadeSystem === undefined ||
        selectedShade.trim() === "" ||
        selectedShadeSystem.trim() === ""
      ) {
        toast.error(i18n.t("PLEASE_FILL_SHADE") + " " + i18n.t("AND_SHADE_SYSTEM"));
        setCurrentTab(ProductStepEnum.Shade);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (show === true) {
      setCurrentTab(ProductStepEnum.Product);
    }
  }, [show, setCurrentTab]);

  useEffect(() => {
    loadItemInProduct(selectedProduct, false, selectedProductType);
  }, [selectedProduct, loadItemInProduct, selectedProductType]);

  useEffect(() => {
    // check if this modal is from edit (there is selected product exist)
    if (selectedProduct && filteredCaseOrderList) {
      setCaseOrderList(
        filteredCaseOrderList.filter((element) => element.selectProduct?.id !== selectedProduct.id)
      );
    } else if (filteredCaseOrderList) {
      setCaseOrderList(filteredCaseOrderList);
    } else {
      setCaseOrderList([]);
    }
  }, [show]);

  return (
    <>
      <Modal
        size="lg"
        show={show}
        className={
          show && (showAddOnInput || confirmShowing)
            ? "modal__overlay product-modal"
            : "product-modal"
        }
        onHide={() => {}}
        centered
      >
        <Modal.Body className="product-modal__body">
          <div>
            <Tabs
              activeKey={currentTab}
              onSelect={(tab) => onSelectTab((tab as ProductStepEnum) ?? ProductStepEnum.Product)}
              id="tab-product"
              className="mb-3 product-modal__tab"
            >
              <Tab
                className="product-modal__tab-item"
                eventKey={ProductStepEnum.Product}
                title={ProductStepEnum.Product}
              >
                {displaySelectStep()}
                {bindGroupProdct()}
              </Tab>
              <Tab
                className="product-modal__tab-item"
                disabled={!enabledMaterialTab}
                eventKey={ProductStepEnum.Material}
                title={ProductStepEnum.Material}
              >
                {displaySelectStep()}
                {bindMaterial(selectedProduct?.materials)}
              </Tab>
              <Tab
                className="product-modal__tab-item"
                disabled={!enabledDesignTab}
                eventKey={ProductStepEnum.Design}
                title={ProductStepEnum.Design}
              >
                {displaySelectStep()}
                {bindDesign(selectedProduct?.designs)}
              </Tab>
              <Tab
                className="product-modal__tab-item"
                disabled={!enableShadeTab}
                eventKey={ProductStepEnum.Shade}
                title={ProductStepEnum.Shade}
              >
                {displaySelectStep()}
                {displaySubstitutionInput()}
                {bindShadeField()}
              </Tab>
              <Tab
                className="product-modal__tab-item"
                disabled={!enabledAddOnTab}
                eventKey={ProductStepEnum.AddOn}
                title={ProductStepEnum.AddOn}
              >
                {displaySelectStep()}
                {bindGroupAddOns(selectedProduct?.addOnGroups)}
              </Tab>
              <Tab
                className="product-modal__tab-item"
                eventKey={ProductStepEnum.Favorites}
                title={ProductStepEnum.Favorites}
              >
                {displayFavoritesTable()}
              </Tab>
            </Tabs>
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
                  onClick={() => {
                    if (selectedProduct === undefined) {
                      toast.error(i18n.t("PLEASE_SELECT_PRODUCT"));
                      return false;
                    }

                    HasShadeAndShadeSystemFilled() && onSave();
                  }}
                  disabled={disabledEdit}
                >
                  {i18n.t("SAVE")}
                </Button>
              </Nav.Item>
            </Nav>
          </div>
        </Modal.Body>
      </Modal>

      <AddOnInputModal
        show={showAddOnInput}
        addOnModel={addOnModel}
        inputValue={addOnInput}
        setInputValue={setAddOnInput}
        onSave={onSaveAddOnInput}
        onClose={onCloseAddOnInput}
        catalogs={catalogs}
      ></AddOnInputModal>
    </>
  );
};

export default CaseProductModal;

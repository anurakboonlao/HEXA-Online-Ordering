import React from "react";
import { GlobalState } from "../redux/reducers";
import { connect } from "react-redux";
import SVG from "react-inlinesvg";
import { bindActionCreators } from "redux";
import i18n from "../i18n";
import OrderForm from "../components/case/order-form.component";
import {
  Dropdown,
  Button,
  ButtonGroup,
  Badge,
  Nav,
  Navbar,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import _, { find } from "lodash";
import { toast } from "react-toastify";
import PageHeader from "../components/page-header.component";
import SideBarContainer from "../components/menu/side-bar.component";
import { SideMenuOption, UserRoleEnum } from "../constants/constant";
import {
  OrderTypeEnum,
  ProductTypeEnum,
  TeethEnum,
  CaseStatusEnum,
  CaseModeEnum,
  iCharmGenderEnum,
  fileICharmTypeEnum,
} from "../constants/caseManagement";
import {
  CaseDetailModel,
  MethodModel,
  ProductTypeModel,
  CaseOrderListModel,
  ProductModel,
  MaterialModel,
  DesignModel,
  SelectedAddOnModel,
  IFavoriteModel,
  IFavoriteAddOnModel,
  ShadeSystemModel,
  ShadeModel,
  ICharmProductModel,
  ProductGroupModel,
} from "../redux/domains/CaseManagement";
import TeethTypeSelect from "../components/case/teeth-type-select.component";
import TextInputCase from "../components/case/text-input-case.component";
import CaseItemTable from "../components/case/case-item-table.component";
import SelectMultipleProductTable from "../components/case/select-multiple-products.component";
import { history } from "../utils/history";
import CaseProductModal from "../components/case/product-modal.component";
import CaseMemoModal from "../components/case/case-memo-modal.component";
import ConfirmModal from "../components/ui/confirm-modal.component";
import {
  createOrder,
  deleteCase,
  getProductTypeItem,
  saveAddCase,
  saveAddCaseAndOrder,
  saveUpdateCase,
  saveUpdateCaseAndOrder,
  addFavorite,
  getFavorites,
  renameFavorite,
  deleteFavorite,
  getCatalog,
  getCase,
} from "../redux/actions/case.actions";
import {
  uploadAttachmentFile,
  removeImage,
  IGetAttachmentFile,
} from "../redux/actions/attachment.action";
import {
  convertCaseTypeTonumber,
  convertProductTypeTonumber,
} from "../utils/caseManagementUtils";
import OrderOverViewModal from "../components/case/order-overview-modal.component";
import PATH from "../constants/path";

import "../scss/page/case-detail/_caseDetail.scss";
import addFile from "../assets/svg/addFile.svg";
import addNote from "../assets/svg/addNote.svg";
import questionMark from "../assets/svg/question_mark.svg";
import deleteIcon from "../assets/svg/delete-icon.svg";
import FileAttachmentModal from "../components/case/attachments-modal.component";
import BridgeHelperModal from "../components/case/bridge-helper-modal.component";

type ICaseDetailProps = ReturnType<typeof mapStateToProps>;
interface ICaseDetailDispatchProps {
  getProductTypeItem: typeof getProductTypeItem;
  saveAddCase: typeof saveAddCase;
  saveUpdateCase: typeof saveUpdateCase;
  deleteCase: typeof deleteCase;
  createOrder: typeof createOrder;
  saveAddCaseAndOrder: typeof saveAddCaseAndOrder;
  saveUpdateCaseAndOrder: typeof saveUpdateCaseAndOrder;
  uploadAttachmentFile: typeof uploadAttachmentFile;
  removeImage: typeof removeImage;
  addFavorite: typeof addFavorite;
  getFavorites: typeof getFavorites;
  renameFavorite: typeof renameFavorite;
  deleteFavorite: typeof deleteFavorite;
  getCatalog: typeof getCatalog;
  getCase: typeof getCase;
}

interface ICaseDetailStateProps {
  showConfirmBackFromIcharmModal: boolean;
  showConfirmIcharmModal: boolean;
  selectedProductType: ProductTypeEnum;
  selectedProductTypeTemp: ProductTypeEnum;
  selectedProductTypeItem: ProductTypeModel;
  selectedTeeth: TeethEnum;
  selectMethod: MethodModel;
  caseStateModel: CaseDetailModel;
  selectCaseItem: CaseOrderListModel;
  showItemModal: boolean;
  showMemoModal: boolean;
  memoText: string;
  showConfirmMemoModal: boolean;
  showConfirmCloseProductModal: boolean;
  showConfirmClosePageModal: boolean;
  showConfirmDeleteCase: boolean;
  deleteDisplayBodyText: string;
  deleteCaseId: number;
  selectedIcharmProduct: ICharmProductModel;

  // attachment state
  showAttachedFile: boolean;
  showOrderModal: boolean;
  showConfirmCloseOrderModal: boolean;

  // bridge modal controller
  showBridgeHelper: boolean;

  //select multiple product table modal
  showProductTableModal: boolean;

  //loading icharm on first load
  isLoadIcharmType: boolean;

  backPath: string;
}
const nonMethod: MethodModel = {
  id: 0,
  name: i18n.t("PLEASE_SPECTIFY"),
  productTypeId: 0,
};
class CaseDetail extends React.Component<
  ICaseDetailProps & ICaseDetailDispatchProps,
  ICaseDetailStateProps
> {
  constructor(porps: any) {
    super(porps);
    this.state = {
      showConfirmBackFromIcharmModal: false,
      showConfirmIcharmModal: false,
      selectedProductTypeTemp: ProductTypeEnum.CrownAndBridge,
      selectedProductTypeItem: {
        id: 0,
        name: "",
        methods: [],
        productGroupModels: [],
        shadeSystemsModels: [],
      },
      selectedIcharmProduct: {
        caseId: 0,
        productType: ProductTypeEnum.ICHARM,
        productTypeId: 0,
      },
      selectedTeeth: TeethEnum.None,
      selectedProductType: ProductTypeEnum.CrownAndBridge,
      selectMethod: nonMethod,
      caseStateModel: {
        caseId: 0,
        caseName: "",
        patientName: "",
        age: 0,
        gender: iCharmGenderEnum.Male,
        dentistName: "",
        clinicName: "",
        dentistId: 0,
        clinicId: 0,
        memo: "",
        userId: 0,
        status: CaseStatusEnum.Draft,
        caseMode: "",
        caseOrderLists: [],
        caseTypeId: 0,
        attachedFileList: [],
        caseTypeName: OrderTypeEnum.NewCase,
        referenceOrderNumber: "",
      },
      selectCaseItem: {
        uniqueName: new Date().toString(),
        caseId: 0,
        productType: ProductTypeEnum.CrownAndBridge,
        no: TeethEnum.None,
        method: nonMethod,
        productTypeId: 2,
        option: "",
        selectProduct: undefined,
        selectDesign: undefined,
        selectMaterial: undefined,
        selectAddOn: [],
        selectShade: "",
        selectedShadeSystemId: undefined,
        selectedShadeId: undefined,
        selectShadeSystem: "",
        selectedShadeSystem: undefined,
        selectedShade: undefined,
        substitutionTooth: "",
      },
      showItemModal: false,
      showMemoModal: false,
      memoText: "",
      showConfirmMemoModal: false,
      showConfirmCloseProductModal: false,
      showConfirmClosePageModal: false,
      showConfirmDeleteCase: false,
      deleteDisplayBodyText: "",
      deleteCaseId: 0,

      showAttachedFile: false,
      showOrderModal: false,
      showConfirmCloseOrderModal: false,
      backPath: PATH.CLIENT.CASE_MANAGEMENT,
      showBridgeHelper: false,
      showProductTableModal: false,
      isLoadIcharmType: false,
    };
  }

  setBackPath = (path: string) => {
    this.setState({
      backPath: path,
    });
  };

  getMapType = (select: ProductTypeEnum) =>{
    if (select === ProductTypeEnum.ICHARM ||
    select === ProductTypeEnum.CanineToCanine ||
    select === ProductTypeEnum.PremolarToPremolar){
      return ProductTypeEnum.ICHARM;
    }
    return select;
  }

  getFirstProductTypeItem = () => {
    if (this.props.caseDetailModel?.caseOrderLists?.length > 0) {
      if (this.props.caseDetailModel?.caseOrderLists[0].productType === ProductTypeEnum.ICHARM) {
        return this.props.caseDetailModel?.caseOrderLists[0].selectProduct.name as ProductTypeEnum;
      } else {
        return this.props.caseDetailModel?.caseOrderLists[0].productType as ProductTypeEnum;
      }
    } else {
      return ProductTypeEnum.CrownAndBridge;
    }
  };

  getFirstMethodItem = () => {
    return this.props.caseDetailModel?.caseOrderLists?.length > 0
      ? this.props.caseDetailModel?.caseOrderLists[0].method
      : nonMethod;
  };

  getMethodOfType = (productType: ProductTypeEnum) => {
    if (this.state.caseStateModel?.caseOrderLists?.length > 0) {
      const caseMethod = this.state.caseStateModel.caseOrderLists.find(
        (c) => c.productType === productType
      );
      return caseMethod ? caseMethod.method : nonMethod;
    } else {
      return nonMethod;
    }
  };

  componentDidMount() {
    window.addEventListener("beforeunload", this.beforeunload);
    if (this.props.caseDetailModel.caseId !== this.state.caseStateModel.caseId) {
      this.setState({
        caseStateModel: this.props.caseDetailModel,
        memoText: this.props.caseDetailModel.memo,
        selectMethod: this.getFirstMethodItem(),
        selectedProductType: this.getFirstProductTypeItem(),
      });

      this.getProductByType(this.getFirstProductTypeItem(), true);
    } else if (this.props.caseMode === CaseModeEnum.New) {
      this.getProductByType(this.state.selectedProductType, true);
    }
  }

  beforeunload = (e: any) => {
    if (!this.checkNotDirty()) {
      e.preventDefault();
      e.returnValue = true;
    }
  };

  componentDidUpdate(prevProps: ICaseDetailProps, prevState: ICaseDetailStateProps) {
    if (
      prevProps.loadingProductTypeItemList === true &&
      this.props.loadingProductTypeItemList === false 
    ) {
      //Not product type icharm Do normal
      if(this.props.loadingProductTypeItemType !== 5){
        this.getProductByType(this.state.selectedProductType, false);
      }
      else{
        this.onSetIcharmProduct(ProductTypeEnum.CanineToCanine);
      }  
    }

    if (prevProps.creatingOrder === true && this.props.creatingOrder === false) {
      if (this.props.createOrderResult.success) {
        toast.success("Order complete");
        window.removeEventListener("beforeunload", this.beforeunload.bind(this));
        history.push(PATH.CLIENT.CASE_MANAGEMENT);
      } else {
        toast.error(this.props.createOrderResult.message);
      }
    }

    if (
      (prevProps.loadingGetCase === true && this.props.loadingGetCase === false) ||
      this.props.caseDetailModel.caseId !== prevProps.caseDetailModel.caseId
    ) {
      this.setState({
        caseStateModel: this.props.caseDetailModel,
        memoText: this.props.caseDetailModel.memo,
        selectMethod: this.getFirstMethodItem(),
        selectedProductType: this.getFirstProductTypeItem(),
      });

      this.getProductByType(this.getFirstProductTypeItem(), true);
    }

    if (prevState.selectedProductType !== this.state.selectedProductType) {
      this.getProductByType(this.state.selectedProductType, true);
    }

    if (prevProps.caseMode !== this.props.caseMode && this.props.caseMode === CaseModeEnum.New) {
      this.changeMethodType(nonMethod);
    }

    if (prevProps.savingCase === true && this.props.savingCase === false) {
      if (this.props.saveCaseResult.success) {
        toast.success("Save complete");
        window.removeEventListener("beforeunload", this.beforeunload.bind(this));
        history.push(PATH.CLIENT.CASE_MANAGEMENT);
      } else {
        toast.error(this.props.saveCaseResult.message);
      }
    }

    if (prevProps.deletingCase === true && this.props.deletingCase === false) {
      if (this.props.deleteCaseResult.success) {
        if (!this.props.enableCancelToDeleteCase) {
          toast.success("Remove case completed");
        }

        this.closeDeleteConfirmModal();
        this.setState({ showConfirmClosePageModal: false });
        window.removeEventListener("beforeunload", this.beforeunload.bind(this));
        history.push(this.state.backPath);
      } else {
        toast.error(this.props.deleteCaseResult.message);
        this.closeDeleteConfirmModal();
      }
    }

    if (prevProps.gettingFavorites && !this.props.gettingFavorites) {
      if (!this.props.getFavoritesResult.success) {
        toast.error(this.props.getFavoritesResult.message);
      }
    }

    if (prevProps.addingFavorite && !this.props.addingFavorite) {
      if (this.props.addFavoriteResult.success) {
        toast.success("Add favorite completed");
      } else {
        toast.error(this.props.addFavoriteResult.message);
      }
    }

    if (prevProps.renamingFavorite && !this.props.renamingFavorite) {
      if (!this.props.renameFavoriteResult.success) {
        toast.error(this.props.deleteFavoriteResult.message);
      }
    }

    if (prevProps.deletingFavorite && !this.props.deletingFavorite) {
      if (!this.props.deleteFavoriteResult.success) {
        toast.error(this.props.deleteFavoriteResult.message);
      }
    }

    if (!prevState.isLoadIcharmType && this.state.isLoadIcharmType) {    
      this.onSetIcharmProduct(ProductTypeEnum.CanineToCanine);
    }
  }

  iCharmSetAge = (newAge: string) => {
    this.setState({
      caseStateModel: {
        ...this.state.caseStateModel,
        age: parseInt(newAge),
      },
    });
  };

  iCharmGenderSelected = (gender: number) => {
    this.setState({
      caseStateModel: {
        ...this.state.caseStateModel,
        gender: gender,
      },
    });
  };

  onDeleteClick = (caseDisplay: CaseDetailModel) => {
    const text: string =
      i18n.t("CONFIRM_DELETE_CASE") + caseDisplay.patientName + i18n.t("WHOSE_CASE");
    this.setState({
      deleteDisplayBodyText: text,
      showConfirmDeleteCase: true,
      deleteCaseId: caseDisplay?.caseId,
    });
  };

  deleteCase = () => {
    this.props.deleteCase(this.state.deleteCaseId);
  };

  closeDeleteConfirmModal = () => {
    this.setState({
      showConfirmDeleteCase: false,
      deleteDisplayBodyText: "",
      deleteCaseId: 0,
    });
  };

  getProductByType = (selected: ProductTypeEnum, willReloadWhenNotfound: boolean) => {
    let selectType: ProductTypeEnum = selected;

    const productTypeId: number = convertProductTypeTonumber(selectType);
    const prodFound = this.props.productTypeItemList.find((f) => f.id === productTypeId);
    if (prodFound) {
      this.setState({
        selectedProductTypeItem: prodFound,
      });
    } else if (willReloadWhenNotfound) {
      this.props.getProductTypeItem(productTypeId);
      this.props.getCatalog();
    }
  };

  selectedTeethProp = (teethType: TeethEnum, productType: ProductTypeEnum) => {
    if (
      this.state.caseStateModel.caseOrderLists &&
      this.state.caseStateModel.caseOrderLists.length > 0
    ) {
      let teeth = _.find(this.state.caseStateModel.caseOrderLists, function (p) {
        return p.no === teethType && p.productType === productType;
      });
      return teeth;
    }
  };

  onSelectTeeth = (selectItem: TeethEnum) => {
    this.getProductByType(this.state.selectedProductType, false);
    this.props.getFavorites(
      Number(this.props.userId),
      convertProductTypeTonumber(this.state.selectedProductType)
    );
    let selectedTeeth = this.selectedTeethProp(selectItem, this.state.selectedProductType);
    if (selectedTeeth) {
      // show multiple select product table
      this.setState({ showProductTableModal: true, selectedTeeth: selectItem });
      // this.setState({ selectCaseItem: selectedTeeth, selectedTeeth: selectItem, showItemModal: true });
    } else {
      this.setState({
        selectCaseItem: {
          ...this.state.selectCaseItem,
          uniqueName: new Date().toString(),
          caseId: this.state.caseStateModel.caseId,
          productType: this.state.selectedProductType,
          productTypeId: convertProductTypeTonumber(this.state.selectedProductType),
          option: "",
          method: this.state.selectMethod,
          no: selectItem,
          selectProduct: undefined,
          selectMaterial: undefined,
          selectDesign: undefined,
          selectAddOn: [],
          selectShade: "",
          selectedShadeSystemId: undefined,
          selectedShadeId: undefined,
          selectShadeSystem: "",
          substitutionTooth: "",
        },
        selectedTeeth: selectItem,
        showItemModal: true,
      });
    }
  };

  onSetShowBackConfirmIcharmModal = (select: ProductTypeEnum) => {
    if (!_.isEmpty(this.state.caseStateModel.caseOrderLists)) {
      if (this.state.caseStateModel.caseOrderLists[0].productType === ProductTypeEnum.ICHARM) {
        this.setState({
          showConfirmBackFromIcharmModal: true,
          selectedProductTypeTemp: select,
        });
      }
    } else {
      this.onSelectProductType(select);
    }
  };

  onSelectProductType = (select: ProductTypeEnum) => {
    this.setState({
      selectedProductType: select,
      caseStateModel: {
        ...this.state.caseStateModel,
      },
      selectedTeeth: TeethEnum.None,
      selectMethod: this.getMethodOfType(this.getMapType(select)),
      showConfirmIcharmModal: false,
      showConfirmBackFromIcharmModal: false,
    });

    this.getProductByType(select, true);
  };

  onChangePatientName = (text: string) => {
    this.setState({
      caseStateModel: { ...this.state.caseStateModel, patientName: text },
    });
  };

  isEqualItemList = (oldItemList?: CaseOrderListModel[], newItemList?: CaseOrderListModel[]) => {
    if (oldItemList !== undefined && newItemList !== undefined) {
      if (oldItemList.length === 0 && newItemList.length === 0) {
        // check method in no select any product
        return this.state.selectMethod.id === 0;
      } else return JSON.stringify(oldItemList) === JSON.stringify(newItemList);
    } else return oldItemList === undefined && newItemList === undefined;
  };

  onClosePage = (path: string) => {
    if (this.checkNotDirty()) {
      this.closePage(path);
    } else {
      this.setBackPath(path);
      this.setState({ showConfirmClosePageModal: true });
    }
  };

  onCloseMultipleProductsModal = () => {
    this.setState({
      showProductTableModal: false,
      selectedTeeth: TeethEnum.None,
    });
  };

  checkNotDirty = () => {
    return (
      this.props.caseDetailModel.patientName === this.state.caseStateModel.patientName &&
      this.props.caseDetailModel.memo === this.state.caseStateModel.memo &&
      this.isEqualItemList(
        this.props.caseDetailModel.caseOrderLists,
        this.state.caseStateModel.caseOrderLists
      )
    );
  };

  isNotEmptyIcharmProduct = (caseStateModel: CaseDetailModel): boolean => {
    if (caseStateModel.age || caseStateModel.gender || caseStateModel.attachedFileList) {
      return true;
    }

    return false;
  };

  onSaveCase = () => {
    if (this.isNotEmptyIcharmProduct(this.state.caseStateModel)) {
      if (this.state.caseStateModel.patientName === "" && !this.props.isWarrantOrRemake) {
        toast.error(i18n.t("PLEASE_INPUT_PATIENT_NAME"));
      } else if (
        this.props.caseMode === CaseModeEnum.New &&
        (!this.props.selectedContactId || this.props.selectedContactId < 1)
      ) {
        if (this.props.userRole === UserRoleEnum.Clinic)
          toast.error(i18n.t("PLEASE_SELECT_DENTIST"));
        else toast.error(i18n.t("PLEASE_SELECT_CLINIC"));
      } else {
        const nosetMethod = _.find(
          this.state.caseStateModel?.caseOrderLists,
          (o) => !o.method || o.method.id === 0
        );
        if (nosetMethod) {
          toast.error(i18n.t("PLEASE_SELECT_METHOD"));
          if (this.getMapType(nosetMethod.productType) !== this.getMapType(this.state.selectedProductType)) {
            this.onSelectProductType(nosetMethod.productType);
          }
        } else {
          this.onSubmitSaveCase();
        }
      }

      return;
    }

    if (this.state.caseStateModel.patientName === "" && !this.props.isWarrantOrRemake) {
      toast.error(i18n.t("PLEASE_INPUT_PATIENT_NAME"));
    } else if (
      !this.state.caseStateModel.caseOrderLists ||
      (this.state.caseStateModel.caseOrderLists &&
        this.state.caseStateModel.caseOrderLists.length === 0)
    ) {
      toast.error(i18n.t("PLEASE_SELECT_PRODUCT"));
    } else if (
      this.props.caseMode === CaseModeEnum.New &&
      (!this.props.selectedContactId || this.props.selectedContactId < 1)
    ) {
      if (this.props.userRole === UserRoleEnum.Clinic) toast.error(i18n.t("PLEASE_SELECT_DENTIST"));
      else toast.error(i18n.t("PLEASE_SELECT_CLINIC"));
    } else {
      const nosetMethod = _.find(
        this.state.caseStateModel?.caseOrderLists,
        (o) => !o.method || o.method.id === 0
      );
      if (nosetMethod) {
        toast.error(i18n.t("PLEASE_SELECT_METHOD"));
        if (this.getMapType(nosetMethod.productType) !== this.getMapType(this.state.selectedProductType)) {
          this.onSelectProductType(nosetMethod.productType);
        }
      } else {
        this.onSubmitSaveCase();
      }
    }
  };

  onSubmitSaveCase = () => {
    let userId: number = Number(this.props.userId);

    if (this.props.caseMode === CaseModeEnum.New) {
      let saveCaseDetailModel: CaseDetailModel = {
        ...this.state.caseStateModel,
        memo: this.state.memoText,
        caseTypeId: convertCaseTypeTonumber(this.props.caseNewPass as OrderTypeEnum),
        caseName: this.props.caseNewPass,
        userId: userId,
        dentistId:
          this.props.userRole === UserRoleEnum.Clinic
            ? this.props.selectedContactId
            : this.props.contactId,
        clinicId:
          this.props.userRole === UserRoleEnum.Dentist
            ? this.props.selectedContactId
            : this.props.contactId,
      };

      this.props.saveAddCase(saveCaseDetailModel);
    } else {
      /**
       * if it is warrant or remake case, use patient name from order detial
       * bacause we know where this case comes from order
       *
       * */
      let saveCaseDetailModel: CaseDetailModel = this.props.isWarrantOrRemake
        ? {
          ...this.state.caseStateModel,
          memo: this.state.memoText,
          patientName: this.props.caseDetailModel.patientName,
        }
        : {
          ...this.state.caseStateModel,
          memo: this.state.memoText,
        };
      this.props.saveUpdateCase(saveCaseDetailModel);
    }
  };

  closeConfirmClosePageModal = () => {
    this.setState({ showConfirmClosePageModal: false });
  };

  closePage = (path: string) => {
    this.setState({ showConfirmClosePageModal: false });
    if (this.props.enableCancelToDeleteCase) {
      // NOTE : Delete case bacause this is new case
      this.props.deleteCase(this.state.caseStateModel.caseId);
    } else {
      window.removeEventListener("beforeunload", this.beforeunload.bind(this));
      history.push(path);
    }
  };

  getDefaultFavoriteName = (
    selectedProduct: ProductModel | undefined,
    selectedMaterial: MaterialModel | undefined,
    selectedDesign: DesignModel | undefined,
    selectedAddOnList: SelectedAddOnModel[],
    selectedShade: string,
    selectedShadeSystem: string,
    selectedProductTypeId: number,
    substitutionTooth: string | undefined,
    selectedShadeSystemId: number | undefined,
    selectedShadeId: number | undefined
  ) => {
    let name = selectedProduct?.name ?? "";
    if (selectedMaterial) {
      name = name + " | " + (selectedMaterial?.name ?? "");
    }
    if (selectedDesign) {
      name = name + " | " + (selectedDesign?.name ?? "");
    }
    if (selectedAddOnList && selectedAddOnList.length > 0) {
      name =
        name +
        " | " +
        selectedAddOnList
          ?.map((i) => {
            return i.name;
          })
          .join(" | ");
    }
    if (selectedShade.length > 0) {
      name = name + " | Shade: " + selectedShade;
    }
    if (selectedShadeSystem.length > 0) {
      name = name + " | " + i18n.t("SHADE_SYSTEM") + ": " + selectedShadeSystem;
    }
    if (substitutionTooth) {
      name = name + " | " + i18n.t("SUBSTUTITION_TOOTH") + ": " + (substitutionTooth ?? "");
    }
    return name;
  };

  onAddFavorite = (
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
  ) => {
    if (selectedProduct) {
      const name = this.getDefaultFavoriteName(
        selectedProduct,
        selectedMaterial,
        selectedDesign,
        selectedAddOnList,
        selectedShade,
        selectedShadeSystem,
        selectedProductTypeId,
        substitutionTooth,
        selectedShadeId,
        selectedShadeSystemId
      );
      const fav: IFavoriteModel = {
        id: 0,
        name: name,
        userId: Number(this.props.userId),
        productTypeId: selectedProductTypeId,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        shade: selectedShade,
        shadeSystem: selectedShadeSystem,
        shadeId: selectedShadeId,
        shadeSystemId: selectedShadeSystemId,
        substitutionTooth: substitutionTooth,
      };

      fav.materialModels = selectedMaterial
        ? [
          {
            materialId: selectedMaterial.id,
            materialName: selectedMaterial.name,
          },
        ]
        : [];
      fav.designModels = selectedDesign
        ? [{ designId: selectedDesign.id, designName: selectedDesign.name }]
        : [];
      fav.addOnModels = selectedAddOnList
        ? selectedAddOnList.map((i) => {
          return {
            addOnId: i.id,
            addOnName: i.name,
            inputAddOn: i.input,
          } as IFavoriteAddOnModel;
        })
        : [];
      this.props.addFavorite(fav);
    } else {
      toast.error(i18n.t("PLEASE_SELECT_PRODUCT"));
    }
  };

  onRenameFavorite = (id: number, name: string) => {
    this.props.renameFavorite(id, name);
  };

  onDeleteFavorite = (id: number) => {
    this.props.deleteFavorite(id);
  };

  onDeleteItem = (item: CaseOrderListModel) => {
    // check if target product has group
    if (item.option !== "") {
      toast.error(i18n.t("ERROR_PRODUCT_ALREADY_ON_BRIDGE"));
      return;
    }

    this.setState({
      caseStateModel: {
        ...this.state.caseStateModel,
        caseOrderLists: [
          ...this.state.caseStateModel.caseOrderLists.filter(
            (x) => x.uniqueName !== item.uniqueName
          ),
        ],
      },
    });
  };

  onSelectedItem = (selectedTeeth: CaseOrderListModel, productType: ProductTypeEnum) => {
    if (selectedTeeth) {
      if (productType !== this.state.selectedProductType) this.onSelectProductType(productType);

      this.props.getFavorites(Number(this.props.userId), convertProductTypeTonumber(productType));
      this.setState({
        selectCaseItem: selectedTeeth,
        selectedTeeth: selectedTeeth.no as TeethEnum,
        showItemModal: true,
      });
    }
  };

  onSelectProduct = (product: ProductModel | undefined) => {
    this.setState({
      selectCaseItem: {
        ...this.state.selectCaseItem,
        selectProduct: product,
        selectMaterial: undefined,
        selectDesign: undefined,
        selectAddOn: [],
        selectShade: "",
        selectShadeSystem: "",
      },
    });
  };

  onSelectMaterial = (material: MaterialModel | undefined) => {
    this.setState({
      selectCaseItem: {
        ...this.state.selectCaseItem,
        selectMaterial: material,
      },
    });
  };

  onSelectDesign = (design: DesignModel | undefined) => {
    this.setState({
      selectCaseItem: { ...this.state.selectCaseItem, selectDesign: design },
    });
  };

  onSelectedAddOnList = (addOnList: SelectedAddOnModel[]) => {
    this.setState({
      selectCaseItem: { ...this.state.selectCaseItem, selectAddOn: addOnList },
    });
  };

  onSelectedItemByFavorite = (
    product: ProductModel,
    material: MaterialModel | undefined,
    design: DesignModel | undefined,
    addOnList: SelectedAddOnModel[],
    shade: string,
    shadeSystem: string,
    shadeSystemId: number,
    shadeId: number,
    substitutionTooth: string
  ) => {
    this.setState({
      selectCaseItem: {
        ...this.state.selectCaseItem,
        selectProduct: product,
        selectMaterial: material,
        selectDesign: design,
        selectAddOn: addOnList,
        selectShade: shade,
        selectShadeSystem: shadeSystem,
        selectedShadeSystemId: shadeSystemId,
        selectedShadeId: shadeId,
        substitutionTooth: substitutionTooth,
      },
    });
  };

  isEqualAddOnProduct = (oldAddOns?: SelectedAddOnModel[], newAddOns?: SelectedAddOnModel[]) => {
    if (oldAddOns && newAddOns) return _(oldAddOns).differenceWith(newAddOns, _.isEqual).isEmpty();
    else
      return (
        (oldAddOns === undefined || oldAddOns === null) &&
        (newAddOns === undefined || newAddOns === null)
      );
  };

  checkProductDeirty = () => {
    const caseOld = this.state.caseStateModel.caseOrderLists.find(
      (c) => c.no === this.state.selectCaseItem.no
    );
    if (caseOld) {
      //edit
      return (
        caseOld.productType !== this.state.selectCaseItem.productType ||
        caseOld.selectProduct !== this.state.selectCaseItem.selectProduct ||
        caseOld.selectProduct?.id !== this.state.selectCaseItem.selectProduct?.id ||
        caseOld.selectMaterial !== this.state.selectCaseItem.selectMaterial ||
        caseOld.selectMaterial?.id !== this.state.selectCaseItem.selectMaterial?.id ||
        caseOld.selectDesign !== this.state.selectCaseItem.selectDesign ||
        caseOld.selectDesign?.id !== this.state.selectCaseItem.selectDesign?.id ||
        caseOld.selectShade !== this.state.selectCaseItem.selectShade ||
        caseOld.selectShadeSystem !== this.state.selectCaseItem.selectShadeSystem ||
        !this.isEqualAddOnProduct(caseOld.selectAddOn, this.state.selectCaseItem.selectAddOn)
      );
    } else {
      return (
        this.state.selectCaseItem.selectProduct ||
        this.state.selectCaseItem.selectDesign ||
        (this.state.selectCaseItem.selectAddOn && this.state.selectCaseItem.selectAddOn.length > 0)
      );
    }
  };

  onCloseProductModel = () => {
    if (this.checkProductDeirty()) {
      this.setState({ showConfirmCloseProductModal: true });
    } else {
      this.setState({ showItemModal: false });

      /**
       * NOTE: if multiple select product table is shown, do not reset selectedTeeth
       */
      if (!this.state.showProductTableModal) {
        this.setState({ selectedTeeth: TeethEnum.None });
      }
    }
  };

  closeConfirmProductModal = () => {
    this.setState({ showConfirmCloseProductModal: false });
  };

  closeProductModal = () => {
    this.setState({
      selectCaseItem: {
        uniqueName: new Date().toString(),
        caseId: 0,
        productType: ProductTypeEnum.CrownAndBridge,
        productTypeId: 1,
        no: TeethEnum.None,
        method: nonMethod,
        option: "",
        selectProduct: undefined,
        selectDesign: undefined,
        selectMaterial: undefined,
        selectAddOn: [],
        selectShade: "",
        selectedShadeSystemId: undefined,
        selectedShadeId: undefined,
        selectShadeSystem: "",
        substitutionTooth: "",
      },
      showItemModal: false,
      showConfirmCloseProductModal: false,
    });

    /**
     * NOTE: if multiple select product table is shown, do not reset selectedTeeth
     */
    if (!this.state.showProductTableModal) {
      this.setState({ selectedTeeth: TeethEnum.None });
    }
  };

  onSaveProductModel = () => {
    let selectedTeeth = this.selectedTeethProp(
      this.state.selectCaseItem.no as TeethEnum,
      this.state.selectedProductType
    );
    if (
      this.state.selectCaseItem.selectProduct?.id &&
      this.state.selectCaseItem.selectProduct?.id > 0
    ) {
      // To check if this case is new
      const indexCase = this.state.caseStateModel.caseOrderLists.findIndex(
        (c) => c.uniqueName === this.state.selectCaseItem.uniqueName
      );

      if (selectedTeeth && indexCase !== -1) {
        //edit
        const newRecoreds = [...this.state.caseStateModel.caseOrderLists];
        const existingIndex = this.state.caseStateModel.caseOrderLists.findIndex(
          (c) =>
            c.no === this.state.selectCaseItem.no &&
            c.uniqueName === this.state.selectCaseItem.uniqueName
        );
        newRecoreds[existingIndex] = this.state.selectCaseItem;
        this.setState({
          caseStateModel: {
            ...this.state.caseStateModel,
            caseOrderLists: newRecoreds,
          },
          showItemModal: false,
        });
      } else {
        //add

        // check if user add product in same teeth that already has group (bridge)
        let newRecoreds = this.state.selectCaseItem;
        if (selectedTeeth) {
          newRecoreds.option = selectedTeeth.option;
        }

        this.setState({
          caseStateModel: {
            ...this.state.caseStateModel,
            caseOrderLists: [...this.state.caseStateModel.caseOrderLists, newRecoreds],
          },
          selectCaseItem: newRecoreds,
          showItemModal: false,
        });
      }

      /**
       * NOTE: if the multiple select product table is shown, not to reset selectedTeeth
       */
      if (!this.state.showProductTableModal) {
        this.setState({ selectedTeeth: TeethEnum.None });
      }
    } else {
      toast.error(i18n.t("PLEASE_SELECT_PRODUCT"));
    }
  };

  setShowMemo = () => {
    this.setState({
      memoText: this.state.caseStateModel.memo,
      showMemoModal: true,
    });
  };

  setCaseMemo = (text: string) => {
    this.setState({
      memoText: text,
    });
  };

  onCloseMemoModel = () => {
    if (this.state.memoText !== this.state.caseStateModel.memo) {
      this.setState({ showConfirmMemoModal: true });
    } else {
      this.setState({ memoText: "", showMemoModal: false });
    }
  };

  closeConfirmMemoModal = () => {
    this.setState({ showConfirmMemoModal: false });
  };

  closeMemoModal = () => {
    this.setState({
      memoText: "",
      showMemoModal: false,
      showConfirmMemoModal: false,
    });
  };

  onSaveMemoModel = () => {
    this.setState({
      caseStateModel: {
        ...this.state.caseStateModel,
        memo: this.state.memoText,
      },
      showMemoModal: false,
    });
  };

  createMethodDropdown = () => {
    return (
      <>
        {this.state.selectedProductTypeItem.methods.map((value, index) => (
          <Dropdown.Item
            eventKey={value.id}
            key={value.id}
            className="dropdown-button-dropdown-item"
            onSelect={() => this.changeMethodType(value)}
          >
            <span>{value.name}</span>
          </Dropdown.Item>
        ))}
      </>
    );
  };

  changeMethodType = (method: MethodModel) => {
    this.setState({ selectMethod: method });
    this.changeMethodToProductType(method);
  };

  changeMethodToProductType = (method: MethodModel) => {
    let selectedProductType: ProductTypeEnum = this.state.selectedProductType;

    if (
      selectedProductType === ProductTypeEnum.CanineToCanine ||
      selectedProductType === ProductTypeEnum.PremolarToPremolar
    ) {
      if (!_.isEmpty(this.state.caseStateModel.caseOrderLists)) {
        const record: CaseOrderListModel[] = [...this.state.caseStateModel.caseOrderLists];
        const newRecord = record.map((item) => {
          return { ...item, method: method, productType: ProductTypeEnum.ICHARM, productTypeId: 5 };
        });

        this.setState({
          caseStateModel: {
            ...this.state.caseStateModel,
            caseOrderLists: newRecord,
          },
        });
      }
    } else {
      if (method?.productTypeId > 0) {
        const recoreds = [...this.state.caseStateModel.caseOrderLists];
        const newRecoreds = recoreds.map((item) =>
          item.productTypeId === method.productTypeId ? { ...item, method: method } : item
        );

        this.setState({
          caseStateModel: {
            ...this.state.caseStateModel,
            caseOrderLists: newRecoreds,
          },
        });
      }
    }
  };

  setNameOnAddNew = () => {
    if (this.props.caseMode === CaseModeEnum.New) {
      this.setState({
        caseStateModel: {
          ...this.state.caseStateModel,
          dentistName:
            this.props.userRole === UserRoleEnum.Clinic ? this.props.selectedContactName : "",
          clinicName:
            this.props.userRole === UserRoleEnum.Dentist ? this.props.selectedContactName : "",
        },
      });
    }
  };

  onOpenOrderDetail = () => {
    this.setNameOnAddNew();
    this.setState({
      showOrderModal: true,
    });
  };

  onOrder = () => {
    // validate select patient name
    if (this.state.caseStateModel.patientName === "") {
      toast.error(i18n.t("PLEASE_INPUT_PATIENT_NAME"));
      return;
    } 

    // validate select product
    if (
      !this.state.caseStateModel.caseOrderLists ||
      (this.state.caseStateModel.caseOrderLists &&
        this.state.caseStateModel.caseOrderLists.length === 0)
    ) {
      toast.error(i18n.t("PLEASE_SELECT_PRODUCT"));
      return;
    } 
       
      // validate method
      const nosetMethod = _.find(
        this.state.caseStateModel?.caseOrderLists,
        (o) => !o.method || o.method.id === 0
      );
      if (nosetMethod) {
        toast.error(i18n.t("PLEASE_SELECT_METHOD"));
        if (this.getMapType(nosetMethod.productType) !== this.getMapType(this.state.selectedProductType)) {
          this.onSelectProductType(nosetMethod.productType);
        }
        return;
      }

      const icharmProduct = _.find(
        this.state.caseStateModel?.caseOrderLists,
        (o) => o.productTypeId === convertProductTypeTonumber(ProductTypeEnum.ICHARM)
      );

      if(icharmProduct){
        if (!this.state.caseStateModel.age) {
          toast.error(i18n.t("PLEASE_ADD_AGE"));
          return;
        } 

        if( this.filterAttachedFileList(
          fileICharmTypeEnum.Patient
        ).length === 0
          ) {
            toast.error(i18n.t("PLEASE_ADD_PATIENT_IMAGE"));
            return;
          } 
      }

      let userId: number = Number(this.props.userId);
      if (this.props.caseMode === CaseModeEnum.New) {
        let saveCaseDetailModel: CaseDetailModel = {
          ...this.state.caseStateModel,
          memo: this.state.memoText,
          caseTypeId: convertCaseTypeTonumber(this.props.caseNewPass as OrderTypeEnum),
          caseName: this.props.caseNewPass,
          userId: userId,
          dentistId:
            this.props.userRole === UserRoleEnum.Clinic
              ? this.props.selectedContactId
              : this.props.contactId,
          clinicId:
            this.props.userRole === UserRoleEnum.Dentist
              ? this.props.selectedContactId
              : this.props.contactId,
        };
        this.props.saveAddCaseAndOrder(saveCaseDetailModel);
      } else {
        let saveCaseDetailModel: CaseDetailModel = {
          ...this.state.caseStateModel,
          memo: this.state.memoText,
        };
        this.props.saveUpdateCaseAndOrder(saveCaseDetailModel);
      }
      
  
    // if(this.state.caseStateModel.caseId > 0){
    //     this.props.createOrder(this.state.caseStateModel.caseId,this.state.caseStateModel.requestDate);
    // }
    // else{
    //     //Create case and order
    //     this.props.saveAddCaseAndOrder()
    // }
  };

  setRequestDate = (value: Date) => {
    this.setState({
      caseStateModel: { ...this.state.caseStateModel, requestDate: value },
    });
  };

  setPickupDate = (value: Date) => {
    this.setState({
      caseStateModel: { ...this.state.caseStateModel, pickupDate: value },
    });
  };

  onCloseOrderDetail = () => {
    this.setState({
      showOrderModal: false,
    });
  };

  onUpdateBridge = (groupName: string, items: TeethEnum[]) => {
    // If the selected tooth are  alaready bridged, then reject else to the bridge with collection.
    const updatedProducts = this.state.caseStateModel.caseOrderLists.map((prod) => {
      if (prod.productType === ProductTypeEnum.CrownAndBridge) {
        items.forEach((teethNumber) => {
          if (prod.no === teethNumber) {
            prod.option = groupName;
          }
        });
      }
      return prod;
    });

    this.setState({
      caseStateModel: {
        ...this.state.caseStateModel,
        caseOrderLists: updatedProducts,
      },
    });
    toast.success(
      i18n.t("ADD_TEETH_NUMBER") +
      " " +
      items.join(",") +
      " " +
      i18n.t("TO_BRIDGE_GROUP") +
      " " +
      groupName
    );
  };

  onRemoveBridge = (groupName: string) => {
    const updatedProducts = this.state.caseStateModel.caseOrderLists.map((prod) => {
      if (prod.productType === ProductTypeEnum.CrownAndBridge && prod.option === groupName) {
        prod.option = "";
      }
      return prod;
    });

    this.setState(
      {
        caseStateModel: {
          ...this.state.caseStateModel,
          caseOrderLists: updatedProducts,
        },
      },
      () => { }
    );
    toast.info(i18n.t("REMOVE_BRIDGE_GROUP") + " " + groupName);
  };

  onAddingNewProduct = () => {
    this.setState({
      selectCaseItem: {
        ...this.state.selectCaseItem,
        uniqueName: new Date().toString(),
        caseId: this.state.caseStateModel.caseId,
        productType: this.state.selectedProductType,
        productTypeId: convertProductTypeTonumber(this.state.selectedProductType),
        option: "",
        method: this.state.selectMethod,
        no: this.state.selectedTeeth,
        selectProduct: undefined,
        selectMaterial: undefined,
        selectDesign: undefined,
        selectAddOn: [],
        selectShade: "",
        selectShadeSystem: "",
        substitutionTooth: "",
      },
      selectedTeeth: this.state.selectedTeeth,
      showItemModal: true,
    });
  };

  onSelectShadeSystem = (shadeSystem: ShadeSystemModel) => {
    this.setState({
      selectCaseItem: {
        ...this.state.selectCaseItem,
        selectedShadeSystemId: shadeSystem.id,
        selectShadeSystem: shadeSystem.name,
        selectedShadeSystem: shadeSystem,
        selectShade: "",
        selectedShade: undefined,
      },
    });
  };

  onSelectShade = (shade: ShadeModel) => {
    this.setState({
      selectCaseItem: {
        ...this.state.selectCaseItem,
        selectedShadeId: shade.id,
        selectShade: shade.name,
        selectedShade: shade,
      },
    });
  };

  onCloseConfirmIcharm = () => {
    this.setState({
      showConfirmIcharmModal: false,
      showConfirmBackFromIcharmModal: false,
    });
  };

  onConfirmSelectIcharm = () => {
    this.onSetIcharmType();
  };

  onSetShowConfirmIcharmModal = (select: ProductTypeEnum) => {
    if (_.isEmpty(this.state.caseStateModel.caseOrderLists)) {
      this.onSetIcharmType();
    } else {
      this.setState({
        showConfirmIcharmModal: true,
        selectedProductTypeTemp: select,
      });
    }
  };

  onSetIcharmType = () => {
    let selectType: ProductTypeEnum = ProductTypeEnum.CanineToCanine;

    const productTypeId: number = convertProductTypeTonumber(selectType);
    const prodFound = this.props.productTypeItemList.find((f) => f.id === productTypeId);
    if (prodFound) {
      this.setState({
        selectedProductType: selectType,
        caseStateModel: {
          ...this.state.caseStateModel,
        },
        selectedTeeth: TeethEnum.None,
        selectMethod: this.getMethodOfType(selectType),
        showConfirmIcharmModal: false,
        showConfirmBackFromIcharmModal: false,
        isLoadIcharmType: true,
        selectedProductTypeItem: prodFound,
      });
    }
     else  {
      this.props.getProductTypeItem(productTypeId);
    }

    // this.setState({
    //   selectedProductType: selectType,
    //   caseStateModel: {
    //     ...this.state.caseStateModel,
    //   },
    //   selectedTeeth: TeethEnum.None,
    //   selectMethod: this.getMethodOfType(selectType),
    //   showConfirmIcharmModal: false,
    //   showConfirmBackFromIcharmModal: false,
    //   //isLoadIcharmType:false,
    //   selectedProductTypeItem: prodFound,
    // });

    //this.getProductByType(selectType, true);

  };

  onSetIcharmProduct = (select: ProductTypeEnum) => {
    const productId = select === ProductTypeEnum.CanineToCanine ? 144 : 145;
    this.onSelectProductType(select);

    const productGroups = this.state.selectedProductTypeItem.productGroupModels;

    this.onSetShowConfirmIcharmModal(select);

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
        const record: CaseOrderListModel = {
          uniqueName: product.name,
          caseId: this.state.caseStateModel.caseId,
          productType: this.state.selectedProductTypeItem.name as ProductTypeEnum,
          productTypeId: this.state.selectedProductTypeItem.id,
          no: TeethEnum.None,
          method: this.state.selectMethod,
          option: "",
          selectShadeSystem: "",
          selectShade: "",
          selectProduct: product,
          
        };

        this.setState({
          showConfirmIcharmModal: false,
          caseStateModel: {
            ...this.state.caseStateModel,
            caseOrderLists: [record],
            gender: iCharmGenderEnum.Male,
          },
          isLoadIcharmType: false,
        });
      }
    }
  };

  onConfirmBackFromIcharm = async () => {
    // LOGIC FOR REMOVE ATTACHMENT FILE WHEN CHANGE TAB

    // let attachFiles: (IGetAttachmentFile | AttachedFile)[] = [];

    // if (!_.isEmpty(this.state.caseStateModel.attachedFileList)) {
    //   attachFiles = [...this.state.caseStateModel.attachedFileList];
    // }

    // if (!_.isEmpty(this.props.attachFiles)) {
    //   attachFiles = [...this.props.attachFiles];
    // }

    // if (!_.isEmpty(attachFiles)) {
    //   console.log("attachFiles", attachFiles);

    //   if (!_.isEmpty(attachFiles)) {
    //     const ids = attachFiles.map((item) => {
    //       return item.id;
    //     });

    //     const uniqueIds = ids.filter((item, index) => ids.indexOf(item) === index);

    //     if (!_.isEmpty(uniqueIds)) {
    //       uniqueIds.forEach((id) => {
    //         this.props.removeImage(id);
    //       });
    //     }
    //   }
    // }

    this.onSelectProductType(this.state.selectedProductTypeTemp);

    this.setState({
      caseStateModel: {
        ...this.state.caseStateModel,
        caseOrderLists: [],
        age: undefined,
        gender: iCharmGenderEnum.Male,
      },
    });

    this.setState({
      showConfirmBackFromIcharmModal: false,
    });
  }
  onChangeSubstitutionTooth = (input: string) => {
    this.setState({
      selectCaseItem: {
        ...this.state.selectCaseItem,
        substitutionTooth: input,
      },
    });
  };

  filterAttachedFileList = (fileTypeId: number) => {
    if(!this.props.attachFiles){
      return [];
    }
    const files = this.props.attachFiles.filter((file: IGetAttachmentFile) => {
      return file.fileTypeId === fileTypeId;
    });
    return files;
  };

  render() {
    return (
      <SideBarContainer
        selectedMenu={SideMenuOption.CaseManagement}
        userRole={this.props.userRolePermission}
        checkLeavePageFunction={this.onClosePage}
      >
        <div>
          <div className="px-3 pt-3">
            <PageHeader pageTitle={i18n.t("CASE_MANAGEMENT")} displayAction={true} />
          </div>
          {!this.props.loadingGetCase && (
            <>
              <div className="case-detail__main-page">
                <Navbar className="case-detail__top-menu">
                  <div className="case-detail__name case-min-width">
                    <TextInputCase
                      inputText={this.state.caseStateModel.patientName}
                      onInputChange={this.onChangePatientName}
                      placeholder={i18n.t("PATIENT_NAME")}
                      onBackClick={() => this.onClosePage(PATH.CLIENT.CASE_MANAGEMENT)}
                      readOnly={
                        this.props.caseDetailModel.status === CaseStatusEnum.Ordered ||
                        this.props.isWarrantOrRemake
                      }
                    ></TextInputCase>
                  </div>

                  <div className="case-detail__group-action">
                    <Nav.Item className="case-detail__menu-item margin-nav-right">
                      <div className="pl-3 pb-3 case-detail__method ">
                        <span className="case-detail_label mr-2">{i18n.t("STATUS")} :</span>
                        <div
                          className={
                            this.props.caseDetailModel.status === CaseStatusEnum.Ordered
                              ? "hexa-badge case-detail__menu_badge badge-green"
                              : // : this.props.caseDetailModel.status === CaseStatusEnum.Canceled ? 'hexa-badge case-detail__menu_badge badge-outlined-canceled'
                              //     : this.props.caseDetailModel.status === CaseStatusEnum.Delayed ? 'hexa-badge case-detail__menu_badge badge-outlined-delayed'
                              //         : this.props.caseDetailModel.status === CaseStatusEnum.Delivered ? 'hexa-badge case-detail__menu_badge badge-outlined-delivered'
                              "hexa-badge case-detail__menu_badge badge-yellow"
                          }
                        >
                          {this.props.caseDetailModel.status}
                        </div>
                      </div>
                    </Nav.Item>
                    <Nav className="case-detail__menu">
                      <Nav.Item className="case-detail__menu-item margin-icon">
                        <Nav.Link className="" onClick={this.setShowMemo}>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={<Tooltip id="note-tooltip">{i18n.t("NOTE")}</Tooltip>}
                          >
                            <SVG src={addNote} className="case-detail__menu-icon"></SVG>
                          </OverlayTrigger>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="case-detail__menu-item margin-icon">
                        <Nav.Link
                          className=""
                          onClick={() => {
                            this.setState({ showAttachedFile: true });
                          }}
                          disabled={this.props.caseDetailModel.status === CaseStatusEnum.Ordered}
                        >
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={<Tooltip id="note-tooltip">{i18n.t("ATTACHMENTS")}</Tooltip>}
                          >
                            <SVG src={addFile} className="case-detail__menu-icon"></SVG>
                          </OverlayTrigger>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="case-detail__menu-item margin-icon">
                        <Nav.Link
                          className=""
                          onClick={() => {
                            this.onDeleteClick(this.props.caseDetailModel);
                          }}
                          disabled={
                            this.props.caseDetailModel.status === CaseStatusEnum.Ordered ||
                            this.props.caseMode === CaseModeEnum.New
                          }
                        >
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={
                              <Tooltip id="note-tooltip">{i18n.t("REMOVE_THIS_CASE")}</Tooltip>
                            }
                          >
                            <SVG src={deleteIcon} className="case-detail__menu-icon"></SVG>
                          </OverlayTrigger>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="case-detail__menu-item margin-nav-left">
                        <Button
                          className="secondary-btn case-detail__menu_btn"
                          variant="secondary"
                          onClick={this.onOpenOrderDetail}
                        >
                          {this.props.caseDetailModel.status === CaseStatusEnum.Ordered
                            ? i18n.t("VIEW_ORDER")
                            : i18n.t("ORDER")}
                        </Button>
                      </Nav.Item>
                    </Nav>
                  </div>
                </Navbar>
                <div className="px-3 pb-3 case-detail__layout-main">
                  <div className="case-detail__layout-left">
                    <div className="pl-3 pb-3 case-detail__method justify-content-between">
                      <div>
                        <span className="case-detail_label">{i18n.t("METHOD")} :</span>
                        <Dropdown className="dropdown-light" as={ButtonGroup}>
                          <Dropdown.Toggle
                            className="border-radius-4"
                            variant=""
                            disabled={this.props.caseDetailModel.status === CaseStatusEnum.Ordered}
                          >
                            {this.state.selectMethod?.name}
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dropdown-light-menu hexa__box-shadow">
                            {this.createMethodDropdown()}
                          </Dropdown.Menu>
                        </Dropdown>
                        {this.state.selectMethod?.id === 0 ? (
                          <span className="case-detail_label_wan">*</span>
                        ) : (
                          <></>
                        )}
                      </div>
                      {this.state.selectedProductType === ProductTypeEnum.CrownAndBridge && (
                        <Button
                          disabled={false}
                          className="case-detial_bridge_btn d-inline-flex align-items-center px-2 mt-1 mb-1"
                          variant="outline-primary"
                          onClick={() => {
                            this.setState({ showBridgeHelper: true });
                          }}
                        >
                          <SVG
                            src={questionMark}
                            className="case-detail__menu-icon questionMark-icon mr-1"
                          ></SVG>
                          <span>{i18n.t("DENTAL_BRIDGE")}</span>
                        </Button>
                      )}
                    </div>
                    <div className="case-detail__type-select hexa__box-detail-shadow">
                      <TeethTypeSelect
                        onSetShowBackConfirmIcharmModal={this.onSetShowBackConfirmIcharmModal}
                        onSetIcharmProduct={this.onSetIcharmProduct}
                        selectedProductType={this.state.selectedProductType}
                        caseOrderList={[...this.state.caseStateModel.caseOrderLists]}
                        selectedTeeth={this.state.selectedTeeth}
                        onSelectTeeth={this.onSelectTeeth}
                        onSelectProductType={this.onSelectProductType}
                        disabledEdit={this.props.caseDetailModel.status === CaseStatusEnum.Ordered}
                        onUpdateBridge={this.onUpdateBridge}
                        onSetShowConfirmIcharmModal={this.onSetShowConfirmIcharmModal}
                        onRemoveBridge={this.onRemoveBridge}
                      ></TeethTypeSelect>
                    </div>
                  </div>
                  <div className="case-detail__layout-right">
                    <div className="pl-3 pb-3 case-detail__method">
                      {this.props.isWarrantOrRemake && (
                        <span className="case-detail_label">
                          {this.props.caseDetailModel.caseTypeId ===
                            convertCaseTypeTonumber(OrderTypeEnum.Remake)
                            ? i18n.t("REMAKE")
                            : i18n.t("WARRANTY")}
                          {i18n.t("FROM_ORDER")} {this.props.caseDetailModel.referenceOrderNumber}
                        </span>
                      )}
                    </div>
                    {(this.state.selectedProductType === ProductTypeEnum.PremolarToPremolar ||
                      this.state.selectedProductType === ProductTypeEnum.CanineToCanine) && (
                        <div className="case-detail__table hexa__box-detail-shadow">
                          <div className="case-detail__table-title">{i18n.t("ORDER_FORM")}</div>
                          <div className="order-form-div">
                            {/* TODO: Create component for Order Form */}
                            <OrderForm
                              caseState={this.state.caseStateModel}
                              iCharmSetAge={this.iCharmSetAge}
                              iCharmGenderSelected={this.iCharmGenderSelected}
                              uploadAction={(files: any[]) => {
                                this.props.uploadAttachmentFile(
                                  files,
                                  this.state.caseStateModel.caseId
                                );
                              }}
                              onRemove={(id) => {
                                this.props.removeImage(id);
                              }}
                              attachedFile={this.props.attachFiles}
                              isUploading={this.props.isUploading}
                              isRemovingImage={this.props.isRemoving}
                            />
                          </div>
                        </div>
                      )}
                    {this.state.selectedProductType !== ProductTypeEnum.CanineToCanine &&
                      this.state.selectedProductType !== ProductTypeEnum.PremolarToPremolar && (
                        <div className="case-detail__table hexa__box-detail-shadow">
                          <div className="case-detail__table-title">{i18n.t("ORDER_LIST")}</div>
                          <div></div>
                          <CaseItemTable
                            caseOrderLists={this.state.caseStateModel.caseOrderLists || []}
                            onDeleteItem={this.onDeleteItem}
                            onSelectItem={this.onSelectedItem}
                            disabledDelete={
                              this.props.caseDetailModel.status === CaseStatusEnum.Ordered
                            }
                            onApplyFavorite={this.onAddFavorite}
                            showFavorite={true}
                          ></CaseItemTable>
                        </div>
                      )}
                    <div className="case-detail__action">
                      <Nav className="case-detail__menu mb-0">
                        <Nav.Item className="case-detail__menu-item mr-3">
                          <Button
                            className="case-detail__menu_btn"
                            variant="outline-primary"
                            onClick={() => this.onClosePage(PATH.CLIENT.CASE_MANAGEMENT)}
                          >
                            {i18n.t("CANCEL")}
                          </Button>
                        </Nav.Item>
                        <Nav.Item className="case-detail__menu-item">
                          <Button
                            className="secondary-btn case-detail__menu_btn"
                            variant="primary"
                            onClick={this.onSaveCase}
                            disabled={this.props.caseDetailModel.status === CaseStatusEnum.Ordered}
                          >
                            {i18n.t("SAVE")}
                          </Button>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <CaseProductModal
          selectedShadeSystemId={this.state.selectCaseItem.selectedShadeSystemId}
          selectedShadeId={this.state.selectCaseItem.selectedShadeId}
          substitutionTooth={this.state.selectCaseItem.substitutionTooth}
          setSubstitutionTooth={this.onChangeSubstitutionTooth}
          show={this.state.showItemModal}
          confirmShowing={this.state.showConfirmCloseProductModal}
          onClose={this.onCloseProductModel}
          onSave={this.onSaveProductModel}
          selectedProductType={this.state.selectedProductType}
          selectedProductTypeId={this.state.selectedProductTypeItem.id}
          selectedTeeth={this.state.selectedTeeth}
          productGroups={this.state.selectedProductTypeItem.productGroupModels}
          shadeSystemList={this.state.selectedProductTypeItem.shadeSystemsModels}
          selectedProduct={this.state.selectCaseItem.selectProduct}
          selectedMaterial={this.state.selectCaseItem.selectMaterial}
          selectedDesign={this.state.selectCaseItem.selectDesign}
          selectedShade={this.state.selectCaseItem.selectShade}
          selectedShadeSystem={this.state.selectCaseItem.selectShadeSystem}
          selectedAddOnList={this.state.selectCaseItem.selectAddOn ?? []}
          setSelectedProduct={this.onSelectProduct}
          setSelectedMaterial={this.onSelectMaterial}
          setSelectedDesign={this.onSelectDesign}
          setSelectedAddOnList={this.onSelectedAddOnList}
          setSelectedShade={this.onSelectShade}
          setSelectedShadeSystem={this.onSelectShadeSystem}
          disabledEdit={this.props.caseDetailModel.status === CaseStatusEnum.Ordered}
          favorites={this.props.favorites}
          onAddFavorite={this.onAddFavorite}
          onRenameFavorite={this.onRenameFavorite}
          onDeleteFavorite={this.onDeleteFavorite}
          onSelectedItemByFavorite={this.onSelectedItemByFavorite}
          catalogs={this.props.catalogs}
          filteredCaseOrderList={undefined} // fix from HEXA-266 allow user select multiple products (same product)
        ></CaseProductModal>

        <OrderOverViewModal
          caseModel={this.state.caseStateModel}
          show={this.state.showOrderModal}
          confirmShowing={this.state.showConfirmCloseOrderModal}
          readonly={this.props.caseDetailModel.status === CaseStatusEnum.Ordered}
          isOrdering={this.props.creatingOrder}
          userRole={this.props.userRole}
          onClose={this.onCloseOrderDetail}
          onOrder={this.onOrder}
          setRequestDate={this.setRequestDate}
          setPickupDate={this.setPickupDate}
          attachmentFile={this.filterAttachedFileList(fileICharmTypeEnum.Normal)}
          xrayFile={this.filterAttachedFileList(fileICharmTypeEnum.Xrey)}
          patientFile={this.filterAttachedFileList(fileICharmTypeEnum.Patient)}
        ></OrderOverViewModal>

        <ConfirmModal
          onCancel={this.closeConfirmProductModal}
          onConfirm={this.closeProductModal}
          showModal={this.state.showConfirmCloseProductModal}
          bodyText={
            <span>
              {i18n.t("CONFIRM_CLOSE_UNCHANGE")} <br />
              {i18n.t("CONFIRM_CLOSE_UNCHANGE_AND_CLOSE")}
            </span>
          }
          cancelButton={i18n.t("NO")}
          confirmButton={i18n.t("DISCARD")}
          modalTitle={i18n.t("CONFIRMATION")}
        />

        <CaseMemoModal
          show={this.state.showMemoModal}
          confirmShowing={this.state.showConfirmMemoModal}
          setMemoText={this.setCaseMemo}
          memoText={this.state.memoText}
          label="Memo"
          onClose={this.onCloseMemoModel}
          onSave={this.onSaveMemoModel}
          readonly={this.props.caseDetailModel.status === CaseStatusEnum.Ordered}
        ></CaseMemoModal>

        <ConfirmModal
          onCancel={this.closeConfirmMemoModal}
          onConfirm={this.closeMemoModal}
          showModal={this.state.showConfirmMemoModal}
          bodyText={
            <span>
              {i18n.t("CONFIRM_CLOSE_UNCHANGE")} <br />
              {i18n.t("CONFIRM_CLOSE_UNCHANGE_AND_CLOSE")}
            </span>
          }
          cancelButton={i18n.t("NO")}
          confirmButton={i18n.t("DISCARD")}
          modalTitle={i18n.t("CONFIRMATION")}
        />

        <ConfirmModal
          onCancel={this.closeConfirmClosePageModal}
          onConfirm={() => this.closePage(this.state.backPath)}
          showModal={this.state.showConfirmClosePageModal}
          bodyText={
            <span>
              {i18n.t("CONFIRM_CLOSE_UNCHANGE")} <br />
              {i18n.t("CONFIRM_CLOSE_UNCHANGE_AND_CLOSE")}
            </span>
          }
          cancelButton={i18n.t("NO")}
          confirmButton={i18n.t("DISCARD")}
          modalTitle={i18n.t("CONFIRMATION")}
        />

        <ConfirmModal
          showModal={this.state.showConfirmIcharmModal}
          bodyText={<span>{i18n.t("CHANGE_OTHER_TO_ICHARM")}</span>}
          onCancel={this.onCloseConfirmIcharm}
          onConfirm={this.onConfirmSelectIcharm}
        />

        <ConfirmModal
          showModal={this.state.showConfirmBackFromIcharmModal}
          bodyText={<span>{i18n.t("CHANGE_ICHARM_TO_OTHER")}</span>}
          onCancel={this.onCloseConfirmIcharm}
          onConfirm={this.onConfirmBackFromIcharm}
        />

        <ConfirmModal
          onCancel={this.closeDeleteConfirmModal}
          onConfirm={this.deleteCase}
          showModal={this.state.showConfirmDeleteCase}
          bodyText={<span>{this.state.deleteDisplayBodyText}</span>}
          cancelButton={i18n.t("NO")}
          confirmButton={i18n.t("DISCARD")}
          modalTitle={i18n.t("CONFIRMATION")}
        />

        <FileAttachmentModal
          show={this.state.showAttachedFile}
          confirmShowing={false}
          attachFile={this.filterAttachedFileList(
            fileICharmTypeEnum.Normal
          )}
          onHide={() => this.setState({ showAttachedFile: false })}
          isUploading={this.props.isUploading}
          isRemovingImage={this.props.isRemoving}
          isLoading={this.props.isLoadingAttachment}
          onRemove={(id) => {
            this.props.removeImage(id);
          }}
          uploadAction={(files: any[]) => {
            this.props.uploadAttachmentFile(files, this.state.caseStateModel.caseId);
          }}
        />

        <SelectMultipleProductTable
          show={this.state.showProductTableModal}
          archNo={this.state.selectedTeeth}
          prodctType={this.state.selectedProductType}
          caseOrderLists={this.state.caseStateModel.caseOrderLists}
          onDeleteItem={this.onDeleteItem}
          onSelectItem={this.onSelectedItem}
          onClose={this.onCloseMultipleProductsModal}
          onAddingProduct={() => this.onAddingNewProduct()}
          onAddingFavorite={this.onAddFavorite}
          disableDelete={this.props.caseDetailModel.status === CaseStatusEnum.Ordered}
        />

        <BridgeHelperModal
          showBridgeHelper={this.state.showBridgeHelper}
          onClose={() => {
            this.setState({ showBridgeHelper: false });
          }}
        />
      </SideBarContainer>
    );
  }
}

const mapStateToProps = (state: GlobalState) => {
  const warrantOrRemakeMode: boolean =
    state.Case.caseDetailModel.caseTypeId === convertCaseTypeTonumber(OrderTypeEnum.Remake) ||
    state.Case.caseDetailModel.caseTypeId === convertCaseTypeTonumber(OrderTypeEnum.Warranty);

  return {
    userRolePermission: state.User.userRolePermission,
    userRole: state.User.payload.role as UserRoleEnum,
    caseNewPass: state.Case.caseNewPass,
    caseMode: state.Case.caseMode,
    caseDetailModel: state.Case.caseDetailModel,
    productTypeItemList: state.Case.productTypeItemList,
    loadingProductTypeItemList: state.Case.loadingProductTypeItemList,
    loadingProductTypeItemType: state.Case.loadingProductTypeItemType,
    savingCase: state.Case.savingCase,
    saveCaseResult: state.Case.saveCaseResult,
    userId: state.User.payload.Id,
    loadingGetCase: state.Case.loadingGetCase,
    getCaseResult: state.Case.getCaseResult,
    deletingCase: state.Case.deletingCase,
    deleteCaseResult: state.Case.deleteCaseResult,
    creatingOrder: state.Case.creatingOrder,
    createOrderResult: state.Case.createOrderResult,

    // attach file
    attachFiles: state.Attachment.attachFiles,
    isLoadingAttachment: state.Attachment.isLoading,
    isRemoving: state.Attachment.isRemoving,
    isUploading: state.Attachment.isUploading,

    // handle cancel to delete new case
    enableCancelToDeleteCase: state.Case.enableCancelToDeleteCase,

    contactId: Number(state.User.payload.ContactId),
    selectedContactId: state.User.selectedContactId ? state.User.selectedContactId : 0,
    selectedContactName: state.User.selectedContactName,
    addingFavorite: state.Case.addingFavorite,
    addFavoriteResult: state.Case.addFavoriteResult,
    favorites: state.Case.favorites,
    gettingFavorites: state.Case.gettingFavorites,
    getFavoritesResult: state.Case.getFavoritesResult,
    renamingFavorite: state.Case.renamingFavorite,
    renameFavoriteResult: state.Case.renameFavoriteResult,
    deletingFavorite: state.Case.deletingFavorite,
    deleteFavoriteResult: state.Case.deleteFavoriteResult,

    // edit mode
    isWarrantOrRemake: warrantOrRemakeMode,

    //catalog
    loadingCatalog: state.Case.loadingCatalog,
    catalogs: state.Case.catalogs,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      getProductTypeItem,
      saveAddCase,
      saveUpdateCase,
      deleteCase,
      createOrder,
      saveAddCaseAndOrder,
      saveUpdateCaseAndOrder,
      uploadAttachmentFile,
      removeImage,
      addFavorite,
      getFavorites,
      renameFavorite,
      deleteFavorite,
      getCatalog,
      getCase,
    },
    dispatch
  ),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(CaseDetail);

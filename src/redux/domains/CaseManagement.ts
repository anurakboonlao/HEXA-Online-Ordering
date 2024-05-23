import {
  CaseStatusEnum,
  OrderTypeEnum,
  ProductTypeEnum,
  TeethEnum,
} from "../../constants/caseManagement";
import { IGetAttachmentFile } from "../actions/attachment.action";
import { AttachedFile } from "./AttachedFile";

export interface caseDisplayModel {
  caseId: number;
  caseName: string;
  patientName: string;
  dentistName: string;
  clinicName: string;
  lastUpdate: Date;
  productType: string;
  status: string;
  caseType: string;
  dentistId: number;
  clinicId: number;
}

export interface CaseDetailModel {
  caseId: number;
  caseName: string;
  patientName: string;
  age?: number;
  gender: number;
  dentistName: string;
  clinicName: string;
  dentistId: number;
  clinicId: number;
  status: CaseStatusEnum;
  memo: string;
  caseMode: string;
  caseTypeName: OrderTypeEnum;
  caseTypeId: number;
  userId: number;
  requestDate?: Date;
  pickupDate?: Date;
  estimatedDate?: Date;
  attachedFileList: AttachedFile[];
  caseOrderLists: CaseOrderListModel[];
  referenceOrderId?: number;
  referenceOrderNumber: string;
}

export interface ICharmProductModel {
  caseId: number;
  productType: ProductTypeEnum;
  productTypeId: number;
  method?: MethodModel;
  selectProduct?: any;
}

export interface IModifyHistoryDetail {
  id: number;
  caseId: number;
  note: string;
  requestCaseAttachedFiles: IGetAttachmentFile[];
  requestedEditDate: string | Date;
}

export interface CaseOrderListModel {
  uniqueName: string;
  caseId: number;
  productType: ProductTypeEnum;
  productTypeId: number;
  no: TeethEnum;
  method: MethodModel;
  option: string;
  selectProduct?: ProductModel;
  selectMaterial?: MaterialModel;
  selectDesign?: DesignModel;
  selectAddOn?: SelectedAddOnModel[];
  selectShadeSystem: string;
  selectShade: string;
  selectedShadeId?: number | undefined;
  selectedShadeSystemId?: number | undefined;
  selectedShadeSystem?: ShadeSystemModel;
  selectedShade?: ShadeModel;
  substitutionTooth?: string;
}

export interface ProductTypeModel {
  id: number;
  name: string;
  methods: MethodModel[];
  productGroupModels: ProductGroupModel[];
  shadeSystemsModels: ShadeSystemModel[];
}

export interface MethodModel {
  id: number;
  name: string;
  productTypeId: number;
}

export interface ProductGroupModel {
  id: number;
  name: string;
  displayAsGroup: boolean;
  productItems: ProductModel[];
}

export interface ProductModel {
  id: number;
  name: string;
  colorCode: string;
  logoPath: string;
  expectedProductDay: number;
  materials: MaterialModel[];
  designs: DesignModel[];
  addOnGroups: GroupAddOnModel[];
  shade: string;
  shadeSystem: string;
}

export interface ShadeSystemModel {
  id: number;
  name: string;
  order: number;
  productTypeId: number;
  shades: ShadeModel[];
}

export interface ShadeModel {
  id: number;
  name: string;
  order: number;
  shadeSystemId: number;
}

export interface MaterialModel {
  id: number;
  name: string;
  logoPath: string;
}

export interface DesignModel {
  id: number;
  name: string;
  logoPath: string;
}

export interface GroupAddOnModel {
  id: number;
  name: string;
  displayAsGroup: boolean;
  orderNumber: number;
  addOns: AddOnModel[];
}

export interface AddOnModel {
  id: number;
  name: string;
  displayName: string;
  colorCode: string;
  logoPath: string;
  requiredInput: boolean;
  groupAddOnId: number;
  inputType: number;
}

export interface SelectedAddOnModel extends AddOnModel {
  input: string;
}

export interface SelectTeethWithColor {
  teeth: TeethEnum;
  color: string;
  logo: string;
}

export interface IFavoriteModel {
  id: number;
  name: string;
  userId: number;
  productTypeId: number;
  productId: number;
  productName: string;
  materialModels?: IFavoriteMaterialModel[];
  designModels?: IFavoriteDesignModel[];
  addOnModels?: IFavoriteAddOnModel[];
  shade: string;
  shadeSystem: string;
  shadeId: number | undefined;
  shadeSystemId: number | undefined;
  substitutionTooth?: string;
}

export interface IFavoriteMaterialModel {
  materialId: number;
  materialName: string;
}

export interface IFavoriteDesignModel {
  designId: number;
  designName: string;
}

export interface IFavoriteAddOnModel {
  addOnId: number;
  addOnName: string;
  inputAddOn: string;
}

export enum CatalogGroupEnum {
  All = 0,
  Plate = 1,
  Glitter = 2,
}

export interface CatalogModel {
  id: number;
  name: string;
  logoPath: string;
  orderNumber: number;
  catalogGroupId: CatalogGroupEnum;
  catalogGroupName: string;
}

import { OrderTypeEnum, ProductTypeEnum } from "../constants/caseManagement";
import { CaseOrderListModel } from "../redux/domains/CaseManagement";

export const convertCaseTypeTonumber = (productType: OrderTypeEnum) => {
  switch (productType) {
    case OrderTypeEnum.NewCase:
      return 1;
    case OrderTypeEnum.Remake:
      return 2;
    case OrderTypeEnum.Warranty:
      return 3;
  }
};

export const convertProductTypeTonumber = (productType: ProductTypeEnum) => {
  switch (productType) {
    case ProductTypeEnum.CrownAndBridge:
      return 1;
    case ProductTypeEnum.Removable:
      return 2;
    case ProductTypeEnum.Orthodontic:
      return 3;
    case ProductTypeEnum.Orthopedic:
      return 4;
    case ProductTypeEnum.ICHARM:
      return 5;
    default:
      return 5;
  }
};

export const convertProductTypeIdToProductTypeEnum = (productTypeId: number) => {
  switch (productTypeId) {
    case 1:
      return ProductTypeEnum.CrownAndBridge;
    case 2:
      return ProductTypeEnum.Removable;
    case 3:
      return ProductTypeEnum.Orthodontic;
    case 4:
      return ProductTypeEnum.Orthopedic;
    case 5:
      return ProductTypeEnum.ICHARM;
    default:
      return 0;
  }
};

export const generateCaseOrderListModelUniqueName = (caseOrderLists: CaseOrderListModel[]) => {
  if (caseOrderLists?.length > 0) {
    return caseOrderLists.map((value, index) => ({
      ...value,
      uniqueName: index.toString(),
    }));
  }
  return [];
};

export const getShadeNameFromProductTypeId = (productTypeId: number) => {
  const targetProductTypeEnum = convertProductTypeIdToProductTypeEnum(productTypeId);
  if (targetProductTypeEnum === ProductTypeEnum.CrownAndBridge) return "Shade System";
  else if (targetProductTypeEnum === ProductTypeEnum.Removable) return "Subsitute Tooth";
  return "";
};

export const getShadeNameFromProductType = (productType: ProductTypeEnum) => {
  if (productType === ProductTypeEnum.CrownAndBridge) return "Shade System";
  else if (productType === ProductTypeEnum.Removable) return "Subsitute Tooth";
  return "";
};

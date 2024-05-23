export enum CaseStatusEnum {
  Draft = "Draft",
  Ordered = "Ordered",
}

export enum CaseStatusDropDownEnum {
  All = "All Status",
  Draft = "Draft",
  Ordered = "Ordered",
}

export enum CaseTypeDropDownEnum {
  All = "All Case Type",
  Regular = "Regular",
  Remake = "Remake",
  Warranty = "Warranty",
}

export enum ProductDropDownTypeEnum {
  All = "All Product Type",
  CrownAndBridge = "Crown & Bridge",
  Removable = "Removable",
  Orthodontic = "Orthodontic",
  Orthopedic = "Orthopedic",
  ICharm = "ICHARM",
}
export enum ProductDropDownTypeIdEnum {
  All = 0,
  CrownAndBridge = 1,
  Removable = 2,
  Orthodontic = 3,
  Orthopedic = 4,
  ICharm = 5,
}

export enum OrderStatusEnum {
  Accepted = "Accepted",
  Canceled = "Canceled",
  Pending = "Pending",
}

export enum OrderTypeEnum {
  NewCase = "NewCase",
  Remake = "Remake",
  Warranty = "Warranty",
}

export enum CaseModeEnum {
  New = "New",
  Edit = "Edit",
}

export enum ProductTypeEnum {
  CrownAndBridge = "Crown & Bridge",
  Removable = "Removable",
  Orthodontic = "Orthodontic",
  Orthopedic = "Orthopedic",
  CanineToCanine = "Canine to Canine",
  PremolarToPremolar = "Premolar to Premolar",
  ICHARM = "ICHARM",
}

export enum MethodEnum {
  All = "All Method",
  Contour = "Contour",
  Finish = "Finish",
  Remake = "Remake",
  SetUpTeeth = "Set up teeth",
  TryIn = "Try in",
}

export enum TeethEnum {
  None = "",
  Upper = "Maxilla",
  Lower = "Mandible",
  T11 = "11",
  T12 = "12",
  T13 = "13",
  T14 = "14",
  T15 = "15",
  T16 = "16",
  T17 = "17",
  T18 = "18",

  T21 = "21",
  T22 = "22",
  T23 = "23",
  T24 = "24",
  T25 = "25",
  T26 = "26",
  T27 = "27",
  T28 = "28",

  T31 = "31",
  T32 = "32",
  T33 = "33",
  T34 = "34",
  T35 = "35",
  T36 = "36",
  T37 = "37",
  T38 = "38",

  T41 = "41",
  T42 = "42",
  T43 = "43",
  T44 = "44",
  T45 = "45",
  T46 = "46",
  T47 = "47",
  T48 = "48",
}

export enum ProductStepEnum {
  Product = "Product",
  Material = "Material",
  AddOn = "Add-on",
  Design = "Design",
  Favorites = "Favorites",
  Shade = "Shade",
}

export enum AddOnInputType {
  Text = 1,
  DropDownList = 2,
  QuadrantWithAll = 3,
  Number = 4,
  Plate = 5,
  Sticker = 6,
  Labial = 7,
  Buccal = 8,
  Glitter = 9,
}

export interface saveDraftCaseDetailModel {
  caseTypeId: number;
  userId: number;
  dentistId: number;
  clinicId: number;
  orderId?: number;
  orderRef: string;
  patientName: string;
}

export enum fileICharmTypeEnum {
  Normal = 1,
  Patient = 2,
  Xrey = 3,
  CasePresentation = 4,
}
export enum iCharmGenderEnum {
  Male = 1,
  Female = 2,
}

export enum LevelOfTreatmentEnum {
  CANINE_TO_CANINE = 144,
  PREMOLAR_TO_PREMOLAR = 145
}

export const castProductTypeToId = (value: ProductDropDownTypeEnum) => {
  switch (value) {
    case ProductDropDownTypeEnum.CrownAndBridge:
      return ProductDropDownTypeIdEnum.CrownAndBridge;
    case ProductDropDownTypeEnum.Removable:
      return ProductDropDownTypeIdEnum.Removable;
    case ProductDropDownTypeEnum.Orthodontic:
      return ProductDropDownTypeIdEnum.Orthodontic;
    case ProductDropDownTypeEnum.Orthopedic:
      return ProductDropDownTypeIdEnum.Orthopedic;
    case ProductDropDownTypeEnum.ICharm:
      return ProductDropDownTypeIdEnum.ICharm;
    default:
      return ProductDropDownTypeIdEnum.All;
  }
};

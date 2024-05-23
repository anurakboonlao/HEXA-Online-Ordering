import dayjs from "dayjs";

import { UserRoleEnum } from "../../constants/constant";
import { authFetch, extractErrors, handleError } from "../../utils/apiUtils";
import {
  CaseDetailModel,
  CatalogGroupEnum,
  CatalogModel,
  IFavoriteModel,
} from "../domains/CaseManagement";
import { generateCaseOrderListModelUniqueName } from "../../utils/caseManagementUtils";
import createAction from "./base.actions";
import { saveDraftCaseDetailModel } from "../../constants/caseManagement";
import { dateToInterFormat } from "../../utils/converter";
import { DEFAULT_PAGESIZE } from "../../constants/paging";

export const actionType = {
  CASE_PASS_NEW_TYPE: "CASE_PASS_NEW_TYPE",
  CASE_REQUEST_GET_PRODUCT_TYPE: "CASE_REQUEST_GET_PRODUCT_TYPE",
  CASE_RECEIVE_GET_PRODUCT_TYPE: "CASE_RECEIVE_GET_PRODUCT_TYPE",

  CASE_REQUEST_GET_CASE_LIST: "CASE_REQUEST_GET_CASE_LIST",
  CASE_RECEIVE_GET_CASE_LIST: "CASE_RECEIVE_GET_CASE_LIST",
  CASE_RECEIVE_GET_CASE_LIST_ERROR: "CASE_RECEIVE_GET_CASE_LIST_ERROR",

  CASE_REQUEST_SAVE_CASE: "CASE_REQUEST_SAVE_CASE",
  CASE_RECEIVE_SAVE_CASE: "CASE_RECEIVE_SAVE_CASE",

  CASE_REQUEST_SAVE_DRAFT_CASE: "CASE_REQUEST_SAVE_DRAFT_CASE",
  CASE_RECEIVE_SAVE_DRAFT_CASE: "CASE_RECEIVE_SAVE_DRAFT_CASE",
  CASE_RECEIVE_SAVE_DRAFT_CASE_ERROR: "CASE_RECEIVE_SAVE_DRAFT_CASE_ERROR",

  CASE_REQUEST_GET_CASE: "CASE_REQUEST_GET_CASE",
  CASE_RECEIVE_GET_CASE: "CASE_RECEIVE_GET_CASE",
  CASE_RECEIVE_GET_CASE_ERROR: "CASE_RECEIVE_GET_CASE_ERROR",

  CASE_REQUEST_DELETE_CASE: "CASE_REQUEST_DELETE_CASE",
  CASE_RECEIVE_DELETE_CASE: "CASE_RECEIVE_DELETE_CASE",

  CASE_REQUEST_CREATE_ORDER: "CASE_REQUEST_CREATE_ORDER",
  CASE_RECEIVE_CREATE_ORDER: "CASE_RECEIVE_CREATE_ORDER",

  CASE_ENABLE_CANCEL_TO_DELETE_CASE: "CASE_ENABLE_CANCEL_TO_DELETE_CASE",

  CASE_REQUEST_GET_FAVORITES: "CASE_REQUEST_GET_FAVORITES",
  CASE_RECEIVE_GET_FAVORITES: "CASE_RECEIVE_GET_FAVORITES",
  CASE_RECEIVE_GET_FAVORITES_ERROR: "CASE_RECEIVE_GET_FAVORITES_ERROR",

  CASE_REQUEST_ADD_FAVORITE: "CASE_REQUEST_ADD_FAVORITE",
  CASE_RECEIVE_ADD_FAVORITE: "CASE_RECEIVE_ADD_FAVORITE",
  CASE_RECEIVE_ADD_FAVORITE_ERROR: "CASE_RECEIVE_ADD_FAVORITE_ERROR",

  CASE_REQUEST_RENAME_FAVORITE: "CASE_REQUEST_RENAME_FAVORITE",
  CASE_RECEIVE_RENAME_FAVORITE: "CASE_RECEIVE_RENAME_FAVORITE",
  CASE_RECEIVE_RENAME_FAVORITE_ERROR: "CASE_RECEIVE_RENAME_FAVORITE_ERROR",

  CASE_REQUEST_DELETE_FAVORITE: "CASE_REQUEST_DELETE_FAVORITE",
  CASE_RECEIVE_DELETE_FAVORITE: "CASE_RECEIVE_DELETE_FAVORITE",
  CASE_RECEIVE_DELETE_FAVORITE_ERROR: "CASE_RECEIVE_DELETE_FAVORITE_ERROR",

  CASE_REQUEST_DUPLICATE_CASE: "CASE_REQUEST_DUPLICATE_CASE",
  CASE_RECEIVE_DUPLICATE_CASE: "CASE_RECEIVE_DUPLICATE_CASE",
  CASE_RECEIVE_DUPLICATE_CASE_ERROR: "CASE_RECEIVE_DUPLICATE_CASE_ERROR",

  CASE_REQUEST_GET_CATALOG: "CASE_REQUEST_GET_CATALOG",
  CASE_RECEIVE_GET_CATALOG: "CASE_RECEIVE_GET_CATALOG",
  CASE_RECEIVE_GET_CATALOG_ERROR: "CASE_RECEIVE_GET_CATALOG_ERROR",
};

const getErrorMessage = (error: any) => {
  let errorMessage = error?.responseBody?.message;
  if (error?.responseBody?.errors) {
    errorMessage = extractErrors(error?.responseBody?.errors);
  }
  if (errorMessage === "") {
    errorMessage = error.message;
  }
  return errorMessage;
};

export const addNewCasePass = (type: string) => (dispatch: any, getState: any) => {
  dispatch(createAction(actionType.CASE_PASS_NEW_TYPE, type));
};

export const getProductTypeItem = (typeId: number) => (dispatch: any, getState: any) => {
  dispatch(createAction(actionType.CASE_REQUEST_GET_PRODUCT_TYPE));
  return authFetch({
    url: "/product/GetProductType/" + typeId,
    state: getState(),
    options: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    requireAuth: true,
  })
    .then((response) => {
      dispatch(createAction(actionType.CASE_RECEIVE_GET_PRODUCT_TYPE, response));
    })
    .catch(
      handleError.bind(null, {
        dispatch,
      })
    );
};

export const saveAddCase = (caseModel: CaseDetailModel) => (dispatch: any, getState: any) => {
  dispatch(createAction(actionType.CASE_REQUEST_SAVE_CASE));
  return authFetch({
    url: "/Case/AddNewCase",
    state: getState(),
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(caseModel),
    },
    requireAuth: true,
  })
    .then((response) => {
      dispatch(createAction(actionType.CASE_RECEIVE_SAVE_CASE, { success: true, message: "" }));
    })
    .catch(
      handleError.bind(null, {
        dispatch,
        SERVER_ERROR: (error) => {
          let errorMessage = error?.responseBody?.message;
          if (error?.responseBody?.errors) {
            errorMessage = extractErrors(error?.responseBody?.errors);
          }

          if (errorMessage === "") errorMessage = error.message;
          dispatch(
            createAction(actionType.CASE_RECEIVE_SAVE_CASE, {
              success: false,
              message: errorMessage,
            })
          );
        },
      })
    );
};

export const saveUpdateCase = (caseModel: CaseDetailModel) => (dispatch: any, getState: any) => {
  dispatch(createAction(actionType.CASE_REQUEST_SAVE_CASE));
  return authFetch({
    url: "/Case/UpdateCase",
    state: getState(),
    options: {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(caseModel),
    },
    requireAuth: true,
  })
    .then((response) => {
      dispatch(createAction(actionType.CASE_RECEIVE_SAVE_CASE, { success: true, message: "" }));
    })
    .catch(
      handleError.bind(null, {
        dispatch,
        SERVER_ERROR: (error) => {
          let errorMessage = error?.responseBody?.message;
          if (error?.responseBody?.errors) {
            errorMessage = extractErrors(error?.responseBody?.errors);
          }

          if (errorMessage === "") errorMessage = error.message;
          dispatch(
            createAction(actionType.CASE_RECEIVE_SAVE_CASE, {
              success: false,
              message: errorMessage,
            })
          );
        },
      })
    );
};

export const loadGetCaseList = () => (dispatch: any, getState: any) => {
  const selectedContactId: number = Number(
    getState().User.selectedContactId ? getState().User.selectedContactId : 0
  );
  const fromDate: Date = dayjs(new Date()).add(-7, "day").toDate();
  const toDate: Date = new Date();
  dispatch(
    getCaseList(fromDate, toDate, selectedContactId, 0, 1, DEFAULT_PAGESIZE, "", "", "", "", 0, 0)
  );
};

export const getCaseList =
  (
    fromDate: Date,
    toDate: Date,
    memberId: number,
    status: number,
    page: number,
    pageSize: number,
    sortField: string,
    sortOrder: string,
    filterField: string,
    filterText: string,
    caseTypeId: number,
    productTypeId: number
  ) =>
  (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.CASE_REQUEST_GET_CASE_LIST));
    if (getState().User?.payload?.role && getState().User?.payload?.ContactId) {
      const id = Number(getState().User.payload.ContactId);
      const role = getState().User.payload.role as UserRoleEnum;

      const url =
        (role === UserRoleEnum.Clinic
          ? "/Case/GetCaseListByClinicId/"
          : "/Case/GetCaseListByDentistId/") +
        id +
        `?startDate=${dateToInterFormat(fromDate)}` +
        `&endDate=${dateToInterFormat(toDate)}` +
        (role === UserRoleEnum.Clinic ? `&dentistId=` : `&clinicId=`) +
        `${memberId}` +
        `&statusId=${status}` +
        `&page=${page}` +
        `&pageSize=${pageSize}` +
        `&sortField=${sortField}` +
        `&sortOrder=${sortOrder}` +
        `&filterField=${filterField}` +
        `&filterText=${filterText}` +
        `&caseTypeId=${caseTypeId}` +
        `&productTypeId=${productTypeId}`;

      return authFetch({
        url: url,
        state: getState(),
        options: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
        requireAuth: true,
      })
        .then((response) => {
          dispatch(createAction(actionType.CASE_RECEIVE_GET_CASE_LIST, response));
        })
        .catch(
          handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
              let errorMessage = error?.responseBody?.message;
              if (error?.responseBody?.errors) {
                errorMessage = extractErrors(error?.responseBody?.errors);
              }

              if (errorMessage === "") errorMessage = error.message;
              dispatch(
                createAction(actionType.CASE_RECEIVE_GET_CASE_LIST_ERROR, {
                  success: false,
                  message: errorMessage,
                })
              );
            },
          })
        );
    }
  };

export const getCase = (id: number) => (dispatch: any, getState: any) => {
  dispatch(createAction(actionType.CASE_REQUEST_GET_CASE));
  return authFetch({
    url: "/Case/GetCaseByCaseId/" + id,
    state: getState(),
    options: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    requireAuth: true,
  })
    .then((response) => {
      let model: CaseDetailModel = response as CaseDetailModel;
      if (model) {
        model.caseOrderLists = generateCaseOrderListModelUniqueName(model.caseOrderLists);
      }
      dispatch(createAction(actionType.CASE_RECEIVE_GET_CASE, response));
    })
    .catch(
      handleError.bind(null, {
        dispatch,
        SERVER_ERROR: (error) => {
          let errorMessage = error?.responseBody?.message;
          if (error?.responseBody?.errors) {
            errorMessage = extractErrors(error?.responseBody?.errors);
          }

          if (errorMessage === "") errorMessage = error.message;
          dispatch(
            createAction(actionType.CASE_RECEIVE_GET_CASE_ERROR, {
              success: false,
              message: errorMessage,
            })
          );
        },
      })
    );
};

export const deleteCase = (caseId: number) => (dispatch: any, getState: any) => {
  dispatch(createAction(actionType.CASE_REQUEST_DELETE_CASE));
  return authFetch({
    url: "/Case/Delete/" + caseId,
    state: getState(),
    options: {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    requireAuth: true,
  })
    .then((response) => {
      dispatch(createAction(actionType.CASE_RECEIVE_DELETE_CASE, { success: true, message: "" }));
    })
    .catch(
      handleError.bind(null, {
        dispatch,
        SERVER_ERROR: (error) => {
          let errorMessage = error?.responseBody?.message;
          if (error?.responseBody?.errors) {
            errorMessage = extractErrors(error?.responseBody?.errors);
          }

          if (errorMessage === "") errorMessage = error.message;
          dispatch(
            createAction(actionType.CASE_RECEIVE_DELETE_CASE, {
              success: false,
              message: errorMessage,
            })
          );
        },
      })
    );
};

export const createOrder =
  (caseId: number, requestDate?: Date) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.CASE_REQUEST_CREATE_ORDER));
    return authFetch({
      url: "/Case/CreateSaleOrders",
      state: getState(),
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          caseId: caseId,
          requestDate: requestDate ? dayjs(requestDate).format("YYYY-MM-DD") : null,
        }),
      },
      requireAuth: true,
    })
      .then((response) => {
        dispatch(
          createAction(actionType.CASE_RECEIVE_CREATE_ORDER, { success: true, message: "" })
        );
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            let errorMessage = error?.responseBody?.message;
            if (error?.responseBody?.errors) {
              errorMessage = extractErrors(error?.responseBody?.errors);
            }

            if (errorMessage === "") errorMessage = error.message;
            dispatch(
              createAction(actionType.CASE_RECEIVE_CREATE_ORDER, {
                success: false,
                message: errorMessage,
              })
            );
          },
        })
      );
  };

export const saveAddCaseAndOrder =
  (caseModel: CaseDetailModel) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.CASE_REQUEST_CREATE_ORDER));
    return authFetch({
      url: "/Case/AddNewCaseAndOrder",
      state: getState(),
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(caseModel),
      },
      requireAuth: true,
    })
      .then((response) => {
        dispatch(
          createAction(actionType.CASE_RECEIVE_CREATE_ORDER, { success: true, message: "" })
        );
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            let errorMessage = error?.responseBody?.message;
            if (error?.responseBody?.errors) {
              errorMessage = extractErrors(error?.responseBody?.errors);
            }

            if (errorMessage === "") errorMessage = error.message;
            dispatch(
              createAction(actionType.CASE_RECEIVE_CREATE_ORDER, {
                success: false,
                message: errorMessage,
              })
            );
          },
        })
      );
  };

export const saveUpdateCaseAndOrder =
  (caseModel: CaseDetailModel) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.CASE_REQUEST_CREATE_ORDER));
    return authFetch({
      url: "/Case/UpdateCaseAndOrder",
      state: getState(),
      options: {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(caseModel),
      },
      requireAuth: true,
    })
      .then((response) => {
        dispatch(
          createAction(actionType.CASE_RECEIVE_CREATE_ORDER, { success: true, message: "" })
        );
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            let errorMessage = error?.responseBody?.message;
            if (error?.responseBody?.errors) {
              errorMessage = extractErrors(error?.responseBody?.errors);
            }

            if (errorMessage === "") errorMessage = error.message;
            dispatch(
              createAction(actionType.CASE_RECEIVE_CREATE_ORDER, {
                success: false,
                message: errorMessage,
              })
            );
          },
        })
      );
  };

export const handleCancelToDeleteCase = (enable: boolean) => (dispatch: any, getState: any) => {
  dispatch(createAction(actionType.CASE_ENABLE_CANCEL_TO_DELETE_CASE, enable));
};
export const getFavorites =
  (userId: number, productTypeId: number) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.CASE_REQUEST_GET_FAVORITES));
    return authFetch({
      url: "/Favorite/GetFavorites?userId=" + userId + "&productTypeId=" + productTypeId,
      state: getState(),
      options: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      requireAuth: true,
    })
      .then((response) => {
        dispatch(createAction(actionType.CASE_RECEIVE_GET_FAVORITES, response));
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            let errorMessage = getErrorMessage(error);
            dispatch(createAction(actionType.CASE_RECEIVE_GET_FAVORITES_ERROR, errorMessage));
          },
        })
      );
  };

export const saveDraftCase =
  (caseModel: saveDraftCaseDetailModel) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.CASE_REQUEST_SAVE_DRAFT_CASE));
    return authFetch({
      url: "/Case/AddDraftCase",
      state: getState(),
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(caseModel),
      },
      requireAuth: true,
    })
      .then((response) => {
        const caseId = response as number;
        dispatch(createAction(actionType.CASE_RECEIVE_SAVE_DRAFT_CASE, caseId));
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            let errorMessage = error?.responseBody?.message;
            if (error?.responseBody?.errors) {
              errorMessage = extractErrors(error?.responseBody?.errors);
            }

            if (errorMessage === "") errorMessage = error.message;
            dispatch(createAction(actionType.CASE_RECEIVE_SAVE_DRAFT_CASE_ERROR));
          },
        })
      );
  };
export const addFavorite = (item: IFavoriteModel) => (dispatch: any, getState: any) => {
  dispatch(createAction(actionType.CASE_REQUEST_ADD_FAVORITE));
  return authFetch({
    url: "/Favorite/AddFavorite",
    state: getState(),
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(item),
    },
    requireAuth: true,
  })
    .then((response) => {
      dispatch(createAction(actionType.CASE_RECEIVE_ADD_FAVORITE, response));
    })
    .catch(
      handleError.bind(null, {
        dispatch,
        SERVER_ERROR: (error) => {
          let errorMessage = getErrorMessage(error);
          dispatch(createAction(actionType.CASE_RECEIVE_ADD_FAVORITE_ERROR, errorMessage));
        },
      })
    );
};

export const renameFavorite = (id: number, name: string) => (dispatch: any, getState: any) => {
  dispatch(createAction(actionType.CASE_REQUEST_RENAME_FAVORITE));
  return authFetch({
    url: "/Favorite/RenameFavorite?id=" + id + "&name=" + name,
    state: getState(),
    options: {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    requireAuth: true,
  })
    .then((response) => {
      dispatch(createAction(actionType.CASE_RECEIVE_RENAME_FAVORITE, { id: id, name: name }));
    })
    .catch(
      handleError.bind(null, {
        dispatch,
        SERVER_ERROR: (error) => {
          let errorMessage = getErrorMessage(error);
          dispatch(createAction(actionType.CASE_RECEIVE_RENAME_FAVORITE_ERROR, errorMessage));
        },
      })
    );
};

export const deleteFavorite = (id: number) => (dispatch: any, getState: any) => {
  dispatch(createAction(actionType.CASE_REQUEST_DELETE_FAVORITE));
  return authFetch({
    url: "/Favorite/DeleteFavorite/" + id,
    state: getState(),
    options: {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    requireAuth: true,
  })
    .then((response) => {
      dispatch(createAction(actionType.CASE_RECEIVE_DELETE_FAVORITE, response));
    })
    .catch(
      handleError.bind(null, {
        dispatch,
        SERVER_ERROR: (error) => {
          let errorMessage = getErrorMessage(error);
          dispatch(createAction(actionType.CASE_RECEIVE_DELETE_FAVORITE_ERROR, errorMessage));
        },
      })
    );
};

export const duplicateCase =
  (caseId: number, userId: number, dentistId: number, clinicId: number) =>
  (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.CASE_REQUEST_DUPLICATE_CASE));
    return authFetch({
      url: "/Case/DuplicateCase",
      state: getState(),
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          caseId: caseId,
          userId: userId,
          dentistId: dentistId,
          clinicId: clinicId,
        }),
      },
      requireAuth: true,
    })
      .then((response) => {
        const caseId = response as number;
        dispatch(createAction(actionType.CASE_RECEIVE_DUPLICATE_CASE, caseId));
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            let errorMessage = error?.responseBody?.message;
            if (error?.responseBody?.errors) {
              errorMessage = extractErrors(error?.responseBody?.errors);
            }

            if (errorMessage === "") errorMessage = error.message;
            dispatch(
              createAction(actionType.CASE_RECEIVE_DUPLICATE_CASE_ERROR, {
                success: false,
                message: errorMessage,
              })
            );
          },
        })
      );
  };

export const getCatalog =
  (catalogGroupId: CatalogGroupEnum = CatalogGroupEnum.All) =>
  (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.CASE_REQUEST_GET_CATALOG));
    return authFetch({
      url: "/product/GetCatalog/" + catalogGroupId,
      state: getState(),
      options: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      requireAuth: true,
    })
      .then((response) => {
        const catalogs: CatalogModel[] = response as CatalogModel[];
        dispatch(createAction(actionType.CASE_RECEIVE_GET_CATALOG, catalogs));
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            let errorMessage = error?.responseBody?.message;
            if (error?.responseBody?.errors) {
              errorMessage = extractErrors(error?.responseBody?.errors);
            }

            if (errorMessage === "") errorMessage = error.message;
            dispatch(
              createAction(actionType.CASE_RECEIVE_GET_CATALOG_ERROR, {
                success: false,
                message: errorMessage,
              })
            );
          },
        })
      );
  };
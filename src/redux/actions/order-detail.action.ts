import dayjs from "dayjs";
import { toast } from "react-toastify";
import { authFetch, handleError } from "../../utils/apiUtils";
import {
  IOrderDetailResponse,
  IUpdateNotificationResponse,
} from "../domains/OrderDetail";
import { GlobalState } from "../reducers";
import createAction from "./base.actions";
import { updateCancelOrder } from "./order-overview.action";

export enum ActionType {
  // get order detail
  ORDER_DETAIL_REQUEST_ORDER_DETAIL = "ORDER_DETAIL_REQUEST_ORDER_DETAIL",
  ORDER_DETAIL_RECEIVE_ORDER_DETAIL = "ORDER_DETAIL_RECEIVE_ORDER_DETAIL",
  ORDER_DETAIL_RECEIVE_ORDER_DETAIL_ERROR = "ORDER_DETAIL_RECEIVE_ORDER_DETAIL_ERROR",

  // cancel order
  ORDER_DETAIL_REQUEST_CANCEL_ORDER_DETAIL = "ORDER_DETAIL_REQUEST_CANCEL_ORDER_DETAIL",
  ORDER_DETAIL_RECEIVE_CANCEL_ORDER_DETAIL = "ORDER_DETAIL_RECEIVE_CANCEL_ORDER_DETAIL",
  ORDER_DETAIL_RECEIVE_CANCEL_ORDER_DETAIL_ERROR = "ORDER_DETAIL_RECEIVE_CANCEL_ORDER_DETAIL_ERROR",

  // cancel order
  ORDER_DETAIL_REQUEST_EDIT_ESTIMATED_DATE = "ORDER_DETAIL_REQUEST_EDIT_ESTIMATED_DATE",
  ORDER_DETAIL_RECEIVE_EDIT_ESTIMATED_DATE = "ORDER_DETAIL_RECEIVE_EDIT_ESTIMATED_DATE",

  ORDER_DETAIL_REQUEST_UPDATE_STATUS = "ORDER_DETAIL_REQUEST_UPDATE_STATUS",
  ORDER_DETAIL_RECEIVE_UPDATE_STATUS = "ORDER_DETAIL_RECEIVE_UPDATE_STATUS",
  ORDER_DETAIL_RECEIVE_UPDATE_STATUS_ERROR = "ORDER_DETAIL_RECEIVE_UPDATE_STATUS_ERROR",

  // modify order
  ORDER_DETAIL_REQUEST_GET_MODIFY_HISTORY = "ORDER_DETAIL_REQUEST_GET_MODIFY_HISTORY",
  ORDER_DETAIL_MODIFY_CASE = "ORDER_DETAIL_MODIFY_CASE",

  // aligner
  ORDER_DETAIL_UPDATE_ALIGNER = "ORDER_DETAIL_UPDATE_ALIGNER",

  // reject note
  ORDER_DETAIL_RECEIVE_UPDATE_REJECT_NOTE = "ORDER_DETAIL_RECEIVE_UPDATE_REJECT_NOTE",

  ORDER_DETAIL_REQUEST_GET_NOTIFICATION = "ORDER_DETAIL_REQUEST_GET_NOTIFICATION",
  ORDER_DETAIL_RECEIVE_GET_NOTIFICATION = "ORDER_DETAIL_RECEIVE_GET_NOTIFICATION",
  ORDER_DETAIL_RECEIVE_GET_NOTIFICATION_ERROR = "ORDER_DETAIL_RECEIVE_GET_NOTIFICATION_ERROR",

  ORDER_DETAIL_REQUEST_UPDATE_NOTIFICATION = "ORDER_DETAIL_REQUEST_UPDATE_NOTIFICATION",
  ORDER_DETAIL_RECEIVE_UPDATE_NOTIFICATION = "ORDER_DETAIL_RECEIVE_UPDATE_NOTIFICATION",
  ORDER_DETAIL_RECEIVE_UPDATE_NOTIFICATION_ERROR = "ORDER_DETAIL_RECEIVE_UPDATE_NOTIFICATION_ERROR",

  // memo
  ORDER_DETAIL_UPDATE_MEMO = "ORDER_DETAIL_UPDATE_MEMO",
  ORDER_DETAIL_UPDATE_MEMO_RESULT = "ORDER_DETAIL_UPDATE_MEMO_RESULT",

  // Case product
  ORDER_DETAIL_REQUEST_UPDATE_CASE_PRODUCT = "ORDER_DETAIL_REQUEST_UPDATE_CASE_PRODUCT",
  ORDER_DETAIL_UPDATE_CASE_PRODUCT = "ORDER_DETAIL_UPDATE_CASE_PRODUCT",
  ORDER_DETAIL_REQUEST_UPDATE_MEMO = "ORDER_DETAIL_REQUEST_UPDATE_MEMO",
}

const convertDate = (value?: Date) => {
  if (value) return dayjs(value).toDate();
  else return undefined;
};

const checkFileVideoOrImage = (fileName: string) => {
  if (fileName.toLocaleLowerCase().match(/\.(jpg|jpeg|png)$/)) {
    return "photo";
  } else if (fileName.toLocaleLowerCase().match(/\.(mp4|mov|avi)$/)) {
    return "video";
  } else {
    return "file";
  }
};

export const getModifyHistory =
  (caseId: number) => (dispatch: any, getState: () => GlobalState) => {
    dispatch(createAction(ActionType.ORDER_DETAIL_REQUEST_ORDER_DETAIL));
    const url = `/CasePresentationHistory?caseId=${caseId}`;

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
    }).then((response) => {
      dispatch(
        createAction(
          ActionType.ORDER_DETAIL_REQUEST_GET_MODIFY_HISTORY,
          response
        )
      );
    });
  };

export const getOrderDetail =
  (id: number) => (dispatch: any, getState: () => GlobalState) => {
    dispatch(createAction(ActionType.ORDER_DETAIL_REQUEST_ORDER_DETAIL));

    const url = `/OrderOverview/GetOrderDetail/${id}`;

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
        const data = response as IOrderDetailResponse;
        data.orderDetail.pathAttachedFiles =
          data.orderDetail.pathAttachedFiles.map((file) => {
            return {
              ...file,
              uploadDate: convertDate(file.uploadDate),
              url: file.filePath,
              type: checkFileVideoOrImage(file.fileName),
              fileTypeId: file.fileTypeId,
            };
          });
        dispatch(
          createAction(ActionType.ORDER_DETAIL_RECEIVE_ORDER_DETAIL, data)
        );
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            toast.error(error?.responseBody?.message);
            dispatch(
              createAction(ActionType.ORDER_DETAIL_RECEIVE_ORDER_DETAIL_ERROR)
            );
          },
        })
      );
  };

export const cancelOrder = (id: number) => (dispatch: any, getState: any) => {
  dispatch(createAction(ActionType.ORDER_DETAIL_REQUEST_CANCEL_ORDER_DETAIL));

  const url = "/OrderOverview/CancelOrder/" + id;

  return authFetch({
    url: url,
    state: getState(),
    options: {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    requireAuth: true,
  })
    .then((response) => {
      const cancelId = response as number;

      // update cancel case in order overview page
      dispatch(updateCancelOrder(cancelId));

      // update cancel in order detail page
      dispatch(
        createAction(
          ActionType.ORDER_DETAIL_RECEIVE_CANCEL_ORDER_DETAIL,
          cancelId
        )
      );
    })
    .catch(
      handleError.bind(null, {
        dispatch,
        SERVER_ERROR: (error) => {
          toast.error(error?.responseBody?.message);
          dispatch(
            createAction(
              ActionType.ORDER_DETAIL_RECEIVE_CANCEL_ORDER_DETAIL_ERROR
            )
          );
        },
      })
    );
};

export const updateEstimatedDate =
  (id: number, estimatedDate: Date, notificationText: string) =>
  (dispatch: any, getState: any) => {
    dispatch(createAction(ActionType.ORDER_DETAIL_REQUEST_EDIT_ESTIMATED_DATE));

    const url = "/OrderOverview/UpdateEstimated";

    return authFetch({
      url: url,
      state: getState(),
      options: {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          orderId: id,
          estimatedDate: estimatedDate,
          notificationText: notificationText,
        }),
      },
      requireAuth: true,
    })
      .then((response) => {
        const updateResult = response as boolean;
        if (updateResult)
          dispatch(
            createAction(ActionType.ORDER_DETAIL_RECEIVE_EDIT_ESTIMATED_DATE, {
              success: true,
              message: "",
            })
          );
        else
          dispatch(
            createAction(ActionType.ORDER_DETAIL_RECEIVE_EDIT_ESTIMATED_DATE, {
              success: false,
              message: "Update Expected Delivery Date error",
            })
          );
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            toast.error(error?.responseBody?.message);
            dispatch(
              createAction(
                ActionType.ORDER_DETAIL_RECEIVE_EDIT_ESTIMATED_DATE,
                {
                  success: false,
                  message: error?.responseBody?.message,
                }
              )
            );
          },
        })
      );
  };

export const modifyCase =
  (caseId: number, modifyNote: string) => (dispatch: any, getState: any) => {
    dispatch(createAction(ActionType.ORDER_DETAIL_REQUEST_UPDATE_STATUS));
    const url = "/CasePresentationHistory";

    return authFetch({
      url: url,
      state: getState(),
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          caseId: caseId,
          note: modifyNote,
        }),
      },
      requireAuth: true,
    }).then((response) => {
      dispatch(createAction(ActionType.ORDER_DETAIL_MODIFY_CASE, response));
    });
  };

export const addAligner =
  (caseId: number, aligners: string) => (dispatch: any, getState: any) => {
    dispatch(createAction(ActionType.ORDER_DETAIL_REQUEST_UPDATE_STATUS));
    const url = "/OrderOverview/UpdateOrderAligners";

    return authFetch({
      url: url,
      state: getState(),
      options: {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          caseId: caseId,
          aligners: aligners,
        }),
      },
      requireAuth: true,
    }).then((response) => {
      const addAlignerResult = response as boolean;
      if (addAlignerResult)
        dispatch(
          createAction(ActionType.ORDER_DETAIL_UPDATE_ALIGNER, aligners)
        );
    });
  };

// add reject note
export const addRejectNote = (
  caseId: number,
  state: any,
  dispatch: any,
  rejectNote?: string
) => {
  const rejectNoteUrl = "/RejectNote";

  authFetch({
    url: rejectNoteUrl,
    state: state,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        caseId: caseId,
        note: rejectNote,
      }),
    },
    requireAuth: true,
  }).then((response) => {
    dispatch(
      createAction(ActionType.ORDER_DETAIL_RECEIVE_UPDATE_REJECT_NOTE, response)
    );
  });
};

// update status for order detail
export const updateStatus =
  (caseId: number, status: number, rejectNote?: string) =>
  (dispatch: any, getState: any) => {
    dispatch(createAction(ActionType.ORDER_DETAIL_REQUEST_UPDATE_STATUS));
    let updateStatusObject = {
      caseId: caseId,
      orderStatusId: status,
    };
    const url = "/OrderOverview/UpdateOrderStatus";

    return authFetch({
      url: url,
      state: getState(),
      options: {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(updateStatusObject),
      },
      requireAuth: true,
    })
      .then(async (response) => {
        const updateResult = response as boolean;

        if (updateResult) {
          if (rejectNote) {
            await addRejectNote(caseId, getState(), dispatch, rejectNote);
          }

          dispatch(
            createAction(ActionType.ORDER_DETAIL_RECEIVE_UPDATE_STATUS, status)
          );
        }
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            toast.error(error?.responseBody?.message);
            dispatch(
              createAction(
                ActionType.ORDER_DETAIL_RECEIVE_UPDATE_STATUS_ERROR,
                {
                  success: false,
                  message: error?.responseBody?.message,
                }
              )
            );
          },
        })
      );
  };

export const updateNotification =
  (id: number, isNotification: boolean) => (dispatch: any, getState: any) => {
    dispatch(createAction(ActionType.ORDER_DETAIL_REQUEST_UPDATE_NOTIFICATION));
    const url = "/OrderOverview/UpdateOrderNotification";

    return authFetch({
      url: url,
      state: getState(),
      options: {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          orderId: id,
          isNotification: isNotification,
        }),
      },
      requireAuth: true,
    })
      .then((response) => {
        const data = response as IUpdateNotificationResponse;
        dispatch(
          createAction(
            ActionType.ORDER_DETAIL_RECEIVE_UPDATE_NOTIFICATION,
            data.isNotification
          )
        );
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            toast.error(error?.responseBody?.message);
            dispatch(
              createAction(
                ActionType.ORDER_DETAIL_RECEIVE_UPDATE_NOTIFICATION_ERROR
              )
            );
          },
        })
      );
  };

export const updateMemo =
  (caseId: number, memo: string) => (dispatch: any, getState: any) => {
    dispatch(createAction(ActionType.ORDER_DETAIL_REQUEST_UPDATE_MEMO));
    const url = "/OrderOverview/UpdateOrderMemo";

    return authFetch({
      url: url,
      state: getState(),
      options: {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          caseId: caseId,
          memo: memo,
        }),
      },
      requireAuth: true,
    }).then((response) => {
      const updateMemo = response as boolean;
      if (updateMemo) {
        dispatch(createAction(ActionType.ORDER_DETAIL_UPDATE_MEMO, memo));
        dispatch(createAction(ActionType.ORDER_DETAIL_UPDATE_MEMO_RESULT, {
          success : true,
          message : ""
        }));
      } else {
        dispatch(createAction(ActionType.ORDER_DETAIL_UPDATE_MEMO_RESULT, {
          success : false,
          message : "Update memo fail"
        }));
      }
    });
  };

export const updateCaseProduct =
  (caseId: number, productId: number, notificationText : string) => (dispatch: any, getState: any) => {
    dispatch(createAction(ActionType.ORDER_DETAIL_REQUEST_UPDATE_CASE_PRODUCT));
    const url = "/OrderOverview/UpdateLevelOfTreatment";

    return authFetch({
      url: url,
      state: getState(),
      options: {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          caseId: caseId,
          productId: productId,
          notificationText: notificationText
        }),
      },
      requireAuth: true,
    }).then((response) => {
      const updateResult = response as boolean;
      if (updateResult) {
        dispatch(
          createAction(ActionType.ORDER_DETAIL_UPDATE_CASE_PRODUCT, {
            success: true,
            message: "",
          })
        );
      } else {
        dispatch(
          createAction(ActionType.ORDER_DETAIL_UPDATE_CASE_PRODUCT, {
            success: false,
            message: "Update Level of Treatment error.",
          })
        );
      }
    });
  };

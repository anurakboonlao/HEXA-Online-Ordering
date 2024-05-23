import dayjs from "dayjs";
import { toast } from "react-toastify";
import { authFetch, handleError } from "../../utils/apiUtils";
import createAction from "./base.actions";

export enum ActionType {
  // get Attachment file by Id
  ATTACHMENT_FILE_REQUEST_GET_ATTACHMENT_FILE = "ATTACHMENT_FILE_REQUEST_GET_ATTACHMENT_FILE",
  ATTACHMENT_FILE_RECEIVE_GET_ATTACHMENT_FILE = "ATTACHMENT_FILE_RECEIVE_GET_ATTACHMENT_FILE",
  ATTACHMENT_FILE_RECEIVE_GET_ATTACHMENT_FILE_ERROR = "ATTACHMENT_FILE_RECEIVE_GET_ATTACHMENT_FILE_ERROR",

  ATTACHMENT_FILE_REQUEST_UPLOAD_ATTACHMENT_FILE = "ATTACHMENT_FILE_REQUEST_UPLOAD_ATTACHMENT_FILE",
  ATTACHMENT_FILE_RECEIVE_UPLOAD_ATTACHMENT_FILE = "ATTACHMENT_FILE_RECEIVE_UPLOAD_ATTACHMENT_FILE",
  ATTACHMENT_FILE_RECEIVE_UPLOAD_ATTACHMENT_FILE_ERROR = "ATTACHMENT_FILE_RECEIVE_UPLOAD_ATTACHMENT_FILE_ERROR",

  // remove Attacment file by file Id
  ATTACHMENT_FILE_REQUEST_REMOVE_ATTACHMENT_FILE = "ATTACHMENT_FILE_REQUEST_REMOVE_ATTACHMENT_FILE",
  ATTACHMENT_FILE_RECEIVE_REMOVE_ATTACHMENT_FILE = "ATTACHMENT_FILE_RECEIVE_REMOVE_ATTACHMENT_FILE",
  ATTACHMENT_FILE_RECEIVE_REMOVE_ATTACHMENT_FILE_ERROR = "ATTACHMENT_FILE_RECEIVE_REMOVE_ATTACHMENT_FILE_ERROR",

  // clear Attachment file in state
  ATTACHMENT_FILE_CLEAR_ATTACHMENT_FILE = "ATTACHMENT_FILE_CLEAR_ATTACHMENT_FILE",
}

export interface IGetResponseAttachmentFile {
  data: IGetAttachmentFile[];
}

export interface IGetAttachmentFile {
  id: number;
  fileName: string;
  uploadDate?: Date;
  size: number;
  fileTypeId: number;
  filePath: string;
  type?: string;
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

export const getAttachmentFile = (caseId: number) => (dispatch: any, getState: any) => {
  dispatch(createAction(ActionType.ATTACHMENT_FILE_REQUEST_GET_ATTACHMENT_FILE));

  const url: string = `/Attachment/GetFiles/${caseId}`;
  return authFetch({
    url: url,
    state: getState(),
    options: {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
    requireAuth: true,
  })
    .then((response) => {
      const data = response as IGetAttachmentFile[];

      const result = data.map((file) => {
        return {
          ...file,
          uploadDate: convertDate(file.uploadDate),
          url: file.filePath,
          type: checkFileVideoOrImage(file.fileName),
          fileTypeId: file.fileTypeId,
        };
      });

      dispatch(createAction(ActionType.ATTACHMENT_FILE_RECEIVE_GET_ATTACHMENT_FILE, result));
    })
    .catch(
      handleError.bind(null, {
        dispatch,
        SERVER_ERROR: (error) => {
          toast.error("Get Image Error");
          dispatch(createAction(ActionType.ATTACHMENT_FILE_RECEIVE_GET_ATTACHMENT_FILE_ERROR));
        },
        NOT_FOUND: (error) => {
          toast.error("Get Image Error");
          dispatch(createAction(ActionType.ATTACHMENT_FILE_RECEIVE_GET_ATTACHMENT_FILE_ERROR));
        },
      })
    );
};

export const getAttachmentFileByOrderId = (orderId: number) => (dispatch: any, getState: any) => {
  dispatch(createAction(ActionType.ATTACHMENT_FILE_REQUEST_GET_ATTACHMENT_FILE));

  const url: string = `/Attachment/GetFilesByOrderId/${orderId}`;
  return authFetch({
    url: url,
    state: getState(),
    options: {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
    requireAuth: true,
  })
    .then((response) => {
      const data = response as IGetAttachmentFile[];

      const result = data.map((file) => {
        return {
          ...file,
          uploadDate: convertDate(file.uploadDate),
          url: file.filePath,
          type: checkFileVideoOrImage(file.fileName),
          fileTypeId: file.fileTypeId,
        };
      });

      dispatch(createAction(ActionType.ATTACHMENT_FILE_RECEIVE_GET_ATTACHMENT_FILE, result));
    })
    .catch(
      handleError.bind(null, {
        dispatch,
        SERVER_ERROR: (error) => {
          toast.error("Get Image Error");
          dispatch(createAction(ActionType.ATTACHMENT_FILE_RECEIVE_GET_ATTACHMENT_FILE_ERROR));
        },
        NOT_FOUND: (error) => {
          toast.error("Get Image Error");
          dispatch(createAction(ActionType.ATTACHMENT_FILE_RECEIVE_GET_ATTACHMENT_FILE_ERROR));
        },
      })
    );
};

export const uploadAttachmentFile =
  (filesInput: any[], currentCaseId: number, fileTypeId?: number) =>
  (dispatch: any, getState: any) => {
    dispatch(createAction(ActionType.ATTACHMENT_FILE_REQUEST_UPLOAD_ATTACHMENT_FILE));

    const url = `/Attachment/UploadFiles/${currentCaseId}`;
    const form = new FormData();
    if (filesInput) {
      for (let i = 0; i < filesInput.length; i++) {
        form.append("files", filesInput[i]);
        form.append("fileTypeId", filesInput[i].fileTypeId);
      }
    }

    return authFetch({
      url: url,
      state: getState(),
      options: {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: form,
      },
      requireAuth: true,
    })
      .then((response) => {
        const data = response as IGetAttachmentFile[];
        const result = data.map((file) => {
          return {
            ...file,
            uploadDate: convertDate(file.uploadDate),
            url: file.filePath,
            type: checkFileVideoOrImage(file.fileName),
            fileTypeId: file.fileTypeId,
          };
        });

        dispatch(createAction(ActionType.ATTACHMENT_FILE_RECEIVE_UPLOAD_ATTACHMENT_FILE, result));
      })
      .catch(
        handleError.bind(null, {
          dispatch,
          SERVER_ERROR: (error) => {
            toast.error("Upload Image Error");
            dispatch(createAction(ActionType.ATTACHMENT_FILE_RECEIVE_UPLOAD_ATTACHMENT_FILE_ERROR));
          },
          NOT_FOUND: (error) => {
            toast.error("Upload Image Error");
            dispatch(createAction(ActionType.ATTACHMENT_FILE_RECEIVE_UPLOAD_ATTACHMENT_FILE_ERROR));
          },
        })
      );
  };

export const removeImage = (fileId: number) => (dispatch: any, getState: any) => {
  dispatch(createAction(ActionType.ATTACHMENT_FILE_REQUEST_REMOVE_ATTACHMENT_FILE));

  const url: string = `/Attachment/DeleteFile/${fileId}`;
  return authFetch({
    url: url,
    state: getState(),
    options: {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    },
    requireAuth: true,
  })
    .then((response) => {
      const data = response as number;
      dispatch(createAction(ActionType.ATTACHMENT_FILE_RECEIVE_REMOVE_ATTACHMENT_FILE, data));
    })
    .catch(
      handleError.bind(null, {
        dispatch,
        SERVER_ERROR: (error) => {
          toast.error("Remove Error");
          dispatch(createAction(ActionType.ATTACHMENT_FILE_RECEIVE_REMOVE_ATTACHMENT_FILE_ERROR));
        },
        NOT_FOUND: (error) => {
          toast.error("Remove Error");
          dispatch(createAction(ActionType.ATTACHMENT_FILE_RECEIVE_REMOVE_ATTACHMENT_FILE_ERROR));
        },
      })
    );
};

export const clearAttachmentFileState = () => (dispatch: any, getState: any) => {
  dispatch(createAction(ActionType.ATTACHMENT_FILE_CLEAR_ATTACHMENT_FILE));
};

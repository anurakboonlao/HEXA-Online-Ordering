import { ActionType } from "../actions/notification.action";
import { receiveNotification, receiveNotificationsWithTotal } from "../domains/Notification";

interface INotificationRequestGetNotification {
  type: ActionType.NOTIFICATION_REQUEST_GET_NOTIFICATION;
}

interface INotificationReceiveGetNotification {
  type: ActionType.NOTIFICATION_RECEIVE_GET_NOTIFICATION;
  payload: receiveNotificationsWithTotal;
}

interface INotificationReceiveGetNotificationError {
  type: ActionType.NOTIFICATION_RECEIVE_GET_NOTIFICATION_ERROR;
}

interface INotificationRequestReadNotification {
  type: ActionType.NOTIFICATION_REQUEST_READ_NOTIFICATION;
}

interface INotificationReceiveReadNotification {
  type: ActionType.NOTIFICATION_RECEIVE_READ_NOTIFICATION;
  payload: receiveNotification[];
}

interface INotificationReceiveReadNotificationError {
  type: ActionType.NOTIFICATION_RECEIVE_READ_NOTIFICATION_ERROR;
}

interface NotificationState {
  isLoading: boolean;
  notificationList: receiveNotification[];
  totalNoti: number;
}

const initialNotificationState: NotificationState = {
  isLoading: false,
  notificationList: [],
  totalNoti: 0,
};

type INotificationAction =
  | INotificationRequestGetNotification
  | INotificationReceiveGetNotification
  | INotificationReceiveGetNotificationError
  | INotificationRequestReadNotification
  | INotificationReceiveReadNotification
  | INotificationReceiveReadNotificationError;

const Notification = (
  state = initialNotificationState,
  action: INotificationAction
): NotificationState => {
  switch (action.type) {
    case ActionType.NOTIFICATION_REQUEST_GET_NOTIFICATION:
      return { ...state, isLoading: true };

    case ActionType.NOTIFICATION_RECEIVE_GET_NOTIFICATION:
      return {
        ...state,
        isLoading: false,
        notificationList: action.payload.notification,
        totalNoti: action.payload.totalNotification,
      };
    case ActionType.NOTIFICATION_RECEIVE_GET_NOTIFICATION_ERROR:
      return { ...state, isLoading: false };

    case ActionType.NOTIFICATION_REQUEST_READ_NOTIFICATION:
      return { ...state, isLoading: true };

    case ActionType.NOTIFICATION_RECEIVE_READ_NOTIFICATION:
      return {
        ...state,
        isLoading: false,
        notificationList: action.payload,
      };
    case ActionType.NOTIFICATION_RECEIVE_READ_NOTIFICATION_ERROR:
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export default Notification;

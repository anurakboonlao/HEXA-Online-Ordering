import { FC } from "react";
import { Dropdown } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { GlobalState } from "../redux/reducers";
import { selectContact } from "../redux/actions/user.actions";
import { NOTI_FETCH_LIMIT, UserRoleEnum } from "../constants/constant";

import checkIcon from "../assets/svg/check-cl.svg";
import { ClinicToken, DoctorToken } from "../redux/domains/Auth";
import NotificationBox from "./ui/notification.component";
import { readNotification, getNotification } from "../redux/actions/notification.action";
import PrintButton from "./ui/print-button.component";
import i18n from "../i18n";
import { orderExportPdf } from "../redux/actions/order-overview.action";

interface IPageHeaderProps {
  pageTitle: string;
  displayAction: boolean;
  isDisplayDropdown?: boolean;
  onChangeDropdown?: (selectedValue: number) => void;
}

type IHeaderProps = ReturnType<typeof mapStateToProps>;
type IHeaderDispatchStateProps = ReturnType<typeof mapDispatchToProps>;

const PageHeader: FC<IPageHeaderProps & IHeaderProps & IHeaderDispatchStateProps> = ({
  pageTitle,
  displayAction,
  role,
  contactId,
  selectedContactId,
  Doctors,
  Clinics,
  userId,
  selectContact,
  notificationList,
  readNotification,
  totalNotifications,
  getNotification,
  isDisplayDropdown = false,
  orderPrintList,
  onChangeDropdown = () => {},
  orderExportPdf,
  isExporting,
}) => {
  const selectedContact = (contactId: number, name: string) => {
    selectContact(contactId, name);
    onChangeDropdown(contactId);
  };

  const unReadNoti: number = notificationList.filter(
    (notification) => notification.read !== true
  ).length;

  const getSelectName = (contactId: number) => {
    if (role === UserRoleEnum.Clinic && Doctors) {
      const found = Doctors.find((d) => d.doctorId === contactId);
      if (found) {
        return found.name;
      }
      return "All";
    } else if (role === UserRoleEnum.Dentist && Clinics) {
      const found = Clinics.find((d) => d.clinicId === contactId);
      if (found) {
        return found.name;
      }
      return "All";
    }

    return "";
  };

  const createDropdown = () => {
    if (role === UserRoleEnum.Clinic && Doctors) {
      return (
        <>
          <Dropdown.Item
            eventKey={0}
            key={0 + 1}
            className={(selectedContactId === 0 ? "active " : "") + "page-head-dropdown-item"}
            onSelect={() => selectedContact(0, "All")}
          >
            <span>{i18n.t("ALL")}</span>
            <SVG src={checkIcon} width="18" height="18"></SVG>
          </Dropdown.Item>
          {Doctors.map((doctor, index) => (
            <Dropdown.Item
              eventKey={doctor.doctorId}
              key={index + 1}
              className={
                (doctor.doctorId === selectedContactId ? "active " : "") + "page-head-dropdown-item"
              }
              onSelect={() => selectedContact(doctor.doctorId, doctor.name)}
            >
              <span>{doctor.name}</span>
              <SVG src={checkIcon} width="18" height="18"></SVG>
            </Dropdown.Item>
          ))}
        </>
      );
    } else if (role === UserRoleEnum.Dentist && Clinics) {
      return (
        <>
          <Dropdown.Item
            eventKey={0}
            key={0 + 1}
            className={(selectedContactId === 0 ? "active " : "") + "page-head-dropdown-item"}
            onSelect={() => selectedContact(0, "All")}
          >
            <span>{i18n.t("ALL")}</span>
            <SVG src={checkIcon} width="18" height="18"></SVG>
          </Dropdown.Item>
          {Clinics.map((clinic, index) => (
            <Dropdown.Item
              eventKey={clinic.clinicId}
              key={index}
              className={
                (clinic.clinicId === selectedContactId ? "active " : "") + "page-head-dropdown-item"
              }
              onSelect={() => selectedContact(clinic.clinicId, clinic.name)}
            >
              <span>{clinic.name}</span>
              <SVG src={checkIcon} width="18" height="18"></SVG>
            </Dropdown.Item>
          ))}
        </>
      );
    }
  };

  const onClickPrintOrder = () => {
    let orderIds:number[] = orderPrintList.map((order)=>{return order.orderId});
    orderExportPdf(orderIds);
  };

  return (
    <>
      <div id="page-header" className="row pb-3 px-3 pt-0 mb-2">
        <div className="page-title col-12 col-sm-5 page-header-title">{pageTitle}</div>
        <div className="col-12 col-sm-7">
          {displayAction ? (
            <div className="page-header-action">
              {isDisplayDropdown && (
                <>
                  <div style={{ minWidth: "85px" }}>
                    <span className="mr-1">{i18n.t("INTERACT_AS")}</span>
                  </div>
                  <div>
                    <Dropdown className="page-head-dropdown">
                      <Dropdown.Toggle variant="">
                        {getSelectName(selectedContactId)}
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="page-head-dropdown-menu hexa__box-shadow">
                        {createDropdown()}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </>
              )}
              <div>
                <PrintButton
                 loading={isExporting}
                  onClickPrintOrder={onClickPrintOrder}
                  show={true}
                  orderPrintList={orderPrintList}
                />
              </div>
              <div>
                <NotificationBox
                  show={true}
                  totalNotifications={totalNotifications}
                  notificationList={notificationList}
                  onClickNotification={(notiId: number) => {
                    readNotification(notiId);
                  }}
                  onClickViewOlderNoti={(amountOfExpanded: number) => {
                    getNotification(userId, NOTI_FETCH_LIMIT + NOTI_FETCH_LIMIT * amountOfExpanded);
                  }}
                  unReadCount={unReadNoti}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: GlobalState) => {
  return {
    role: state.User?.payload?.role,
    contactId: state.User?.payload?.ContactId,
    selectedContactId: state.User?.selectedContactId,
    Doctors: state.User?.subContact?.doctors as DoctorToken[],
    Clinics: state.User?.subContact?.clinics as ClinicToken[],
    notificationList: state.Notification?.notificationList || [],
    totalNotifications: state.Notification?.totalNoti,
    userId: parseInt(state.User?.payload?.Id),
    orderPrintList: state.OrderOverview?.orderPrintList,
    isExporting: state.OrderOverview?.isExportPdf,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      selectContact,
      readNotification,
      getNotification,
      orderExportPdf,
    },
    dispatch
  ),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);

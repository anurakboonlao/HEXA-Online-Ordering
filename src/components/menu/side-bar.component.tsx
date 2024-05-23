import { FC } from "react";
import { Nav, Image } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars-2";
import { bindActionCreators } from "redux";
import { connect, useSelector } from "react-redux";

import { SideMenuOption } from "../../constants/constant";
import HexaMenuItem from "./side-bar-item.component";
import { GlobalState } from "../../redux/reducers";
import { setSideBarToggle } from "../../redux/actions/home.actions";

import leftIcon from "../../assets/svg/arrow_left.svg";
import rightIcon from "../../assets/svg/arrow_right.svg";
import i18n from "../../i18n";

interface ISideBarProps {
  selectedMenu: SideMenuOption;
  userRole: number;
  checkLeavePageFunction?: (path: string) => void;
}

type ISideBarActionProps = ReturnType<typeof mapDispatchToProps>;

const SideBarContainer: FC<ISideBarProps & ISideBarActionProps> = ({
  children,
  selectedMenu,
  userRole,
  setSideBarToggle,
  checkLeavePageFunction,
}) => {
  const { isSideBarToggle } = useSelector(mapStateToProps);

  const btnToggleClick = () => {
    setSideBarToggle(!isSideBarToggle);
  };

  return (
    <>
      <div id="wrapper">
        <div id="sidebar-wrapper" className={isSideBarToggle ? "toggle" : ""}>
          <Nav className={isSideBarToggle ? "toggle col-12" : "col-12"} activeKey="/home">
            <div className="custom-menu">
              <button
                type="button"
                id="sidebar-collapse"
                className="btn"
                onClick={() => btnToggleClick()}
              >
                <Image
                  className="sidebar-collapse-icon"
                  alt=""
                  src={isSideBarToggle ? rightIcon : leftIcon}
                  width="24"
                  height="24"
                />
              </button>
            </div>
            <Nav.Item className="sidebar-title">
              <div className="sidebar-title-text">{i18n.t("ONLINE_ORDERING")}</div>
            </Nav.Item>
            <HexaMenuItem
              selectedMenu={selectedMenu}
              userRole={userRole}
              checkLeavePageFunction={checkLeavePageFunction}
            />
          </Nav>
        </div>
        <div id="page-content-wrapper">
          <Scrollbars autoHide>{children}</Scrollbars>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: GlobalState) => {
  return {
    isSideBarToggle: state.Home.isSideBarToggle,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      setSideBarToggle,
    },
    dispatch
  ),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(SideBarContainer) as FC<ISideBarProps>;

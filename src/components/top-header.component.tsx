import React from 'react';
import { Nav, Navbar, Image, NavDropdown } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GlobalState } from '../redux/reducers';


import { logout } from '../redux/actions/login.actions';


import logo from '../assets/svg/logo-haxa-ceram.png';
import userUnknow from '../assets/svg/user_no_image.png';
import facebookIcon from '../assets/svg/facebook.svg';
import LineIcon from '../assets/svg/line.svg';
import listIcon from '../assets/svg/checkList.svg';
import settingIcon from '../assets/svg/settings.svg';
import '../scss/components/_topHeader.scss';
import { TokenPayload } from '../redux/domains/Auth';
import PATH from '../constants/path';
import i18n from '../i18n';
require('dotenv').config();


interface ITopHeaderProps {
    AuthUser : TokenPayload;
}

interface ITopHeaderDispatchProps {
    logout: typeof logout;
}

class TopHeader extends React.Component<ITopHeaderProps & ITopHeaderDispatchProps, {}> {

    logoutAction = () =>
    {
        this.props.logout();
    }

    render() {
        const { AuthUser } = this.props;
        const priceListUrl = `${process.env.REACT_APP_HEXA_PRICE_LIST_URL}`;
        const lineUrl = `${process.env.REACT_APP_HEAX_LINE_URL}`;
        const facebookUrl = `${process.env.REACT_APP_HEXA_FACEBOOK_URL}`;
        const retainerGalleryUrl = `${process.env.REACT_APP_HEXA_RETAINER_GALLERY_URL}`;
        const homeUrl = AuthUser && (AuthUser.role === 'Admin' || AuthUser.role === 'Staff') ? PATH.ADMIN.DASHBAORD : `${process.env.REACT_APP_MARKETING_URL}`;
        return (
            AuthUser &&
            <>
                <Navbar collapseOnSelect expand="md" className="app-top-header">
                    <Navbar.Brand href={homeUrl}>
                        <img
                            alt=""
                            src={logo}
                            width="150"
                            height="66"
                            className="d-inline-block align-top"
                        />{' '}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                        <Nav>
                            <Nav.Item className="top-header__menu">
                                <Nav.Link className="w-100 text-left" onClick={() => { window.open(retainerGalleryUrl, "_gallery") }}>
                                    <SVG
                                        className="top-header__menu-image"
                                        src={listIcon}
                                        width="24"
                                        height="24"
                                    />
                                    <span className="top-header__menu-text"> {i18n.t("RETAINER_GALLERY")} </span>
                                </Nav.Link>
                            </Nav.Item>
                            {
                                AuthUser.role === 'Clinic' &&
                                <Nav.Item className="top-header__menu">
                                    <Nav.Link className="w-100 text-left" onClick={() => { window.open(priceListUrl, "_pricelist") }}>
                                        <SVG
                                            className="top-header__menu-image"
                                            src={listIcon}
                                            width="24"
                                            height="24"
                                        />
                                        <span className="top-header__menu-text"> {i18n.t("PRICE_LIST")}</span>
                                    </Nav.Link>
                                </Nav.Item>
                            }
                            <Nav.Item className="top-header__menu">
                                <Nav.Link className="w-100 text-left" onClick={()=> window.open(lineUrl, "_blank")}>
                                    <SVG
                                        className="top-header__menu-image"
                                        src={LineIcon}
                                        width="24"
                                        height="24"
                                    />
                                    <span className="top-header__menu-text">{i18n.t("TEXT_AT_HEXACERAM")}</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="top-header__menu">
                                <Nav.Link className="w-100 text-left" onClick={()=> window.open(facebookUrl, "_blank")}>
                                    <SVG
                                        className="top-header__menu-image"
                                        src={facebookIcon}
                                        width="24"
                                        height="24"
                                    />
                                    <span className="top-header__menu-text">{ i18n.t("TEXT_HEXACERAM")}</span>
                                </Nav.Link>
                            </Nav.Item>

                            <NavDropdown title={
                                <span  >
                                <span className="top-header__username-text"> {AuthUser.sub} </span>
                                <Image
                                    className="top-header__username-image"
                                    alt=""
                                    src={AuthUser.DisplayImage && AuthUser.DisplayImage !=="" ? AuthUser.DisplayImage : userUnknow}
                                    width="48"
                                    height="48"
                                    roundedCircle
                                />
                                <SVG
                                    className="top-header__username-setting"
                                    src={settingIcon}
                                    width="18"
                                    height="18"
                                />
                                </span>
                            }

                            className="top-header__username"
                            id="top-header__setting-menu">
                                    <NavDropdown.Item href={homeUrl}>{i18n.t("GO_TO_WEBSITE")}</NavDropdown.Item>
                                    <NavDropdown.Item onClick={this.logoutAction}>{i18n.t("LOGOUT")}</NavDropdown.Item>
                                </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </>
        );
    }
}

const mapStateToProps = (state: GlobalState) => {
    return {
        AuthUser: state.User.payload
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    ...bindActionCreators(
        {
           logout
        },
        dispatch
    ),
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader);
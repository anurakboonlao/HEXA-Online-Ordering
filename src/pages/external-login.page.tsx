import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import i18n from "../i18n";

import { GlobalState } from '../redux/reducers';
import { history } from '../utils/history';

import '../scss/page/error-page/_error.scss';

require('dotenv').config()

type IExternalLoginProps = ReturnType<typeof mapStateToProps>;

type IExternalLoginDispatchProps = ReturnType<typeof mapDispatchToProps>;

class ExternalLogin extends React.Component<IExternalLoginProps & IExternalLoginDispatchProps, {}> {

    handleRedirect = () => {
        setTimeout(() => history.replace('/Home'), 1000);
    }

    render() {
        const { validating, tokenValid, errorMessage } = this.props;
        return (
            <div className="error__body">
                <div className="error__plain-container">
                    {
                        validating ? (
                            <>
                                <div className="error__title">
                                    {i18n.t("PROCESS")}
                                </div>
                            </>
                        ) : tokenValid ? (
                            <>
                                <div className="error__title">
                                    {i18n.t("PROCESS_PROCESSING")}
                                </div>
                                <div className="error__sub-title">
                                    {i18n.t("REDIRECT_ONLINE_ORDER")}
                                </div>
                                {
                                    this.handleRedirect()
                                }
                            </>
                        ) :
                            (
                                <>
                                    <div className="error__title">
                                        {i18n.t("ERROR")}
                                    </div>
                                    <div className="error__sub-title">
                                        {i18n.t("SOMETHING_WENT_WRONG")}
                                    </div>
                                    <div className="error__sub-description">
                                        {errorMessage}
                                    </div>
                                    <div className="error__action">
                                        <Button variant="outline-primary" className="" onClick={() => { window.location.replace(`${process.env.REACT_APP_MARKETING_URL}`) }}>
                                            {i18n.t("GO_BACK")}
                                        </Button>
                                        <Link to="/home" className="error__link">
                                            {i18n.t("CONTACT_US")}
                                        </Link>
                                    </div>
                                </>
                            )
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: GlobalState) => {
    const { validating, tokenValid, errorMessage } = state.Login;
    return {
        validating,
        tokenValid,
        errorMessage
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    ...bindActionCreators(
        {

        },
        dispatch
    ),
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(ExternalLogin);
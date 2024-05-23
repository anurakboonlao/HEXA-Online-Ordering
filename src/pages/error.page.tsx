import React from 'react';

import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { history } from '../utils/history';
import i18n from "../i18n";
import '../scss/page/error-page/_error.scss';

class ErrorPage extends React.Component<{}, {}> {
    render() {
        return (
            <div className="error__body">
                <div className="error__plain-container">
                    <div className="error__title">
                        {i18n.t("ERROR")}
                    </div>    
                    <div className="error__sub-title">
                        {i18n.t("SOMETHING_WENT_WRONG")}
                    </div>    
                    <div className="error__sub-description">
                        {i18n.t("INTERNAL_SERVER_PROBLEM")}
                    </div>   
                    <div className="error__action">
                        <Button variant="outline-primary" className="" onClick={()=>{history.goBack()}}>
                            {i18n.t("GO_BACK")}
                        </Button>
                        <Link to="/home" className="error__link">
                            {i18n.t("CONTACT_US")}
                        </Link>
                    </div> 
                </div>      
            </div>          
        )
    }
}

export default ErrorPage;
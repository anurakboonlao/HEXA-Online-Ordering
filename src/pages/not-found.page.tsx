import React from "react";
import { Button } from "react-bootstrap";

import { history } from "../utils/history";
import i18n from "../i18n";
import "../scss/page/error-page/_not-found.scss";

class NotFoundPage extends React.Component<{}, {}> {
  render() {
    return (
      <div className="notfound__body">
        <div className="notfound__plain-container">
          <div className="notfound__title">{i18n.t("STATUS_CODE_404")}</div>
          <div className="notfound__sub-title">{i18n.t("PAGE_NOT_FOUND")}</div>
          <div className="notfound__sub-description">
            {i18n.t("CAN_NOT_FIND_PAGE")}
          </div>
          <div className="notfound__action">
            <Button
              variant="outline-primary"
              className=""
              onClick={() => {
                history.goBack();
              }}
            >
              {i18n.t("GO_BACK")}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFoundPage;

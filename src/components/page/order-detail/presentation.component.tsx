import React, { FC, useEffect } from "react";
import "../../../scss/components/_presentation.scss";
import { IGetAttachmentFile } from "../../../redux/actions/attachment.action";
import AttachedFileBadge from "../../../components/ui/attached-file-badge.component";
import { Col, Row } from "react-bootstrap";
import i18n from "../../../i18n";
import AttachedFilePreview from "../../ui/attached-file-preview.component";
interface IPresentationProps {
  attachFile: IGetAttachmentFile[];
}
const Presentation: FC<IPresentationProps> = ({ attachFile }) => {
  return (
    <div className="presentation-body">
      <p className="title-text presentation-file">{i18n.t("PRESENTATION_FILES")}</p>
      <div className="presentation-div">
        <Row>
          {attachFile && attachFile.length > 0 ? (
            attachFile.map((file, index) => (
              <Col xl={3} lg={6}>
                <AttachedFilePreview
                  key={file.id}
                  attachedFile={file}
                  readonly={false}
                  onDownload={true}
                  attachedFileList={attachFile}
                />
              </Col>
            ))
          ) : (
            <div className="none-text"> - </div>
          )}
        </Row>
      </div>
    </div>
  );
};
export default Presentation;

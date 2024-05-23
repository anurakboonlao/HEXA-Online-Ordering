import { IGetAttachmentFile } from "../../redux/actions/attachment.action";
import { FC, useRef, useEffect } from "react";
import "../../scss/components/_orderForm.scss";
import i18n from "i18next";
import { Col, Row } from "react-bootstrap";
import AttachedFileBadge from "../../components/ui/attached-file-badge.component";
import AttachedFilePreview from "../ui/attached-file-preview.component";

interface IOrderFormAttachmentsProps {
  topicText?: string;
  isUploading?: boolean;
  isRemovingImage?: boolean;
  onRemove?: (id: number) => void;
  attachedFile: IGetAttachmentFile[];
  methodOnChange: (e: any) => void;
  isRequire?: boolean;
  limitationText?: string;
}

const OrderFormAttachments: FC<IOrderFormAttachmentsProps> = ({
  topicText,
  isUploading,
  isRemovingImage,
  onRemove,
  attachedFile,
  methodOnChange,
  isRequire = false,
  limitationText,
}) => {
  useEffect(() => {
    filterFile();
  }, [attachedFile]);

  const styles = {
    badgeFileDiv: "badge-file-div",
    badgeFile: "badge-file",
    badgeFileText: "badge-file-text",
    badgeFileClose: "badge-file-close",
  };
  let dataFileList: IGetAttachmentFile[] = [];
  const filterFile = () => {
    dataFileList = attachedFile.filter((file) => file.type !== "file");
  };

  const handleOnRemove = (id: number) => {
    if (onRemove) {
      onRemove(id);
    }
  };
  const isLoadingProp = () => {
    if (isUploading || isRemovingImage) {
      return (
        <div className="spinner-border spinner-loading" role="status">
          <span className="sr-only">{i18n.t("LOADING")}</span>
        </div>
      );
    }
  };
  const chooseFileOrLoading = () => {
    if (isUploading || isRemovingImage) {
      return i18n.t("LOADING");
    }
    return i18n.t("CHOOSE_FILE");
  };

  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="order-form-div">
        <div className="text-left">
          <label className="order-form-text d-block" htmlFor="files">
            {topicText}{" "}
            {limitationText ? <span className="limit"> {" " + limitationText}</span> : ""}{" "}
            {isRequire ? <span> *</span> : <></>}
          </label>
          <label className="file-upload order-form-text-choosefile">
            <input
              type="file"
              multiple
              onChange={methodOnChange}
              ref={inputRef}
              disabled={isUploading || isRemovingImage}
            />
            <i className="fa fa-cloud-upload">{isLoadingProp()}</i>
            <span className="order-form-text-text-choosefile">{chooseFileOrLoading()}</span>
          </label>
        </div>
        <Row className="attach-file-wrapper">
          {attachedFile.map((file, index) => (
            <>
              {/* <Col xl={3} lg={6} className="badge-file-component" key={file.id}>
                <AttachedFileBadge
                  attachedFile={file}
                  readonly={false}
                  styles={styles}
                  textColorBlack={true}
                  onRemove={handleOnRemove}
                  key={file.id}
                  attachedFileList={attachedFile}
                ></AttachedFileBadge>
              </Col> */}
              <Col xl={3} lg={4} sm={6}>
                <AttachedFilePreview
                  key={file.id}
                  attachedFile={file}
                  attachedFileList={attachedFile}
                  onRemove={handleOnRemove}
                  readonly={false}
                ></AttachedFilePreview>
              </Col>
            </>
          ))}
        </Row>
      </div>
    </>
  );
};

export default OrderFormAttachments;

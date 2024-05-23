//@ts-nocheck
import { FC, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { Card } from "react-bootstrap";
import { IGetAttachmentFile } from "../../redux/actions/attachment.action";
import ReactImageVideoLightbox from "react-image-video-lightbox";
import i18n from "../../i18n";
import ConfirmModal from "./confirm-modal.component";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";
import "../../scss/components/_orderFormBadge.scss";

import deleteIcon from "../../assets/svg/delete-icon.svg";
import downloadIcon from "../../assets/svg/download-button.svg";
import fileZip from "../../assets/svg/file-zip.svg";
import fileBackground from "../../assets/images/file-preview-background.png";
import aviIcon from "../../assets/svg/filetype-avi.svg";
import movIcon from "../../assets/svg/filetype-mov.svg";
import mp4Icon from "../../assets/svg/filetype-mp4.svg";

import "../../scss/components/_attachedFilePreview.scss";

type AttachedFilePreviewType = {
  attachedFile: IGetAttachmentFile;
  attachedFileList: IGetAttachmentFile[];
  onRemove?: (id: number) => void;
  readonly: boolean;
  onDownload?: boolean;
};

const AttachedFilePreview: FC<AttachedFilePreviewType> = ({
  attachedFile,
  attachedFileList,
  onRemove,
  readonly,
  onDownload,
}) => {
  const [showImage, setShowImage] = useState<number>(false);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [iconStyle, setIconStyle] = useState({
    visibility: "hidden",
  });

  useEffect(() => {
    if (isHovering) {
      setIconStyle({
        visibility: "visible",
      });
    } else {
      setIconStyle({
        visibility: "hidden",
      });
    }
  }, [isHovering]);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const filterAttachedFileListType = () => {
    return attachedFileList.filter((file: IGetAttachmentFile) => {
      return file.type !== "file";
    });
  };

  const findIndexForPhoto = () => {
    if (attachedFileList) {
      setPhotoIndex(filterAttachedFileListType().findIndex((item) => item.id === attachedFile.id));
    }
    return photoIndex;
  };

  const openImageShow = (event: any) => {
    event.preventDefault();
    if (!(attachedFile.type === "file")) {
      if (attachedFileList && attachedFileList.length > 0) {
        findIndexForPhoto();
        setShowImage(true);
      } else {
        setShowImage(true);
      }
    }
  };

  const displayImageShow = () => {
    if (showImage) {
      return (
        <div className="lightbox-index">
          <ReactImageVideoLightbox
            data={filterAttachedFileListType()}
            startIndex={photoIndex}
            showResourceCount={true}
            onCloseCallback={() => setShowImage(false)}
            onNavigationCallback={(currentIndex: any) => `Current index: ${currentIndex}`}
          />
        </div>
      );
    }
  };

  const handleRemove = (e: any, id: number) => {
    e.stopPropagation();
    setIsOpenRemoveModal(true);
    setSelectedId(id);
  };

  const removeAction = () => {
    onRemove(selectedId);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {attachedFile.fileName}
    </Tooltip>
  );

  const getPreviewBackground = () => {
    return attachedFile.type === "photo" ? attachedFile.filePath : fileBackground;
  };

  const findFileExtention = (fileName: string): string => {
    if (fileName.toLocaleLowerCase().match(/\.(mp4)$/)) {
      return mp4Icon;
    }

    if (fileName.toLocaleLowerCase().match(/\.(mov)$/)) {
      return movIcon;
    }

    if (fileName.toLocaleLowerCase().match(/\.(avi)$/)) {
      return aviIcon;
    }

    return fileZip;
  };

  const checkRenderBackground = () => {
    const { fileName, type } = attachedFile;
    const fileIcon = findFileExtention(fileName);

    if (type === "file" || type === "video") {
      return (
        <div className="attached-preview__background-icon">
          <SVG onClick={openImageShow} className="file-zip-icon" src={fileIcon}></SVG>
        </div>
      );
    }
  };

  return (
    <>
      <Card
        className="attached-preview mt-2"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <div>
          <Card.Img
            className="attached-preview__image"
            onClick={openImageShow}
            variant="top"
            src={getPreviewBackground()}
          ></Card.Img>
          {checkRenderBackground()}
        </div>

        {readonly === false && onRemove ? (
          <button
            className="attached-preview__button-icon"
            onClick={(e) => handleRemove(e, attachedFile.id)}
            style={iconStyle}
          >
            <SVG className="icon" src={deleteIcon}></SVG>
          </button>
        ) : (
          <></>
        )}

        {readonly === false && onDownload ? (
          <a
            className="attached-preview__button-icon text-center"
            href={attachedFile.filePath}
            download={attachedFile.fileName}
            target="_blank"
            style={iconStyle}
          >
            <SVG className="icon" src={downloadIcon}></SVG>
          </a>
        ) : (
          <></>
        )}

        <Card.Body className="preview-card">
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <Card.Text className="attached-preview__body-text text-truncate">
              {attachedFile.fileName}
            </Card.Text>
          </OverlayTrigger>
        </Card.Body>
      </Card>
      {displayImageShow()}

      <ConfirmModal
        showModal={isOpenRemoveModal}
        onConfirm={() => removeAction()}
        onCancel={() => setIsOpenRemoveModal(false)}
        cancelButton={i18n.t("CANCEL")}
        bodyText={i18n.t("CONFIRM_DELETE")}
        modalTitle={i18n.t("CONFIRMATION")}
      />
    </>
  );
};

export default AttachedFilePreview;

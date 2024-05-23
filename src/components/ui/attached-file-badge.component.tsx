//@ts-nocheck
import { FC, useState } from "react";
import { Badge, Tooltip, OverlayTrigger } from "react-bootstrap";
import SVG from "react-inlinesvg";
import "../../scss/components/_orderFormBadge.scss";
import closeIcon from "../../assets/svg/close.svg";
import { IGetAttachmentFile } from "../../redux/actions/attachment.action";
import ConfirmModal from "../../components/ui/confirm-modal.component";
import ReactImageVideoLightbox from "react-image-video-lightbox";
import downloadIcon from "../../assets/svg/download-button.svg";
import i18n from "../../i18n";
import fileDownload from "js-file-download";
import { fileICharmTypeEnum } from "../../constants/caseManagement";
interface IStyleForOrderForm {
  badgeFileDiv: string;
  badgeFile: string;
  badgeFileText: string;
  badgeFileClose: string;
}

interface IAttachedFileBadgeProps {
  onRemove?: (id: number) => void;
  attachedFile: IGetAttachmentFile;
  attachedFileList: IGetAttachmentFile[];
  readonly: boolean;
  styles?: IStyleForOrderForm;
  onDownload?: boolean;
  textColorBlack?: boolean;
}

const AttachedFileBadge: FC<IAttachedFileBadgeProps> = ({
  onRemove,
  attachedFile,
  readonly,
  styles,
  attachedFileList,
  onDownload,
  textColorBlack,
}) => {
  const [showImage, setShowImage] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const filterAttachedFileListType = () => {
    return attachedFileList.filter((file: IGetAttachmentFile) => {
      return file.type !== "file";
    });
  };

  const removeImage = (e: any, attachedFileId: number) => {
    e.stopPropagation();
    onRemove(attachedFileId);
  };

  const handleDownload = (e: any, filePath: string, fileName: string) => {
    e.preventDefault();
    e.stopPropagation();
    fileDownload(filePath, fileName);
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

  return (
    <>
      <Badge
        className={
          styles
            ? (readonly ? "readonly " : "") + styles.badgeFileDiv
            : (readonly ? "readonly " : "") + "attached-badge"
        }
        variant=""
      >
        <div className={styles ? styles.badgeFile : "attached-item"} onClick={openImageShow}>
          <div className={styles ? styles.badgeFileText : "attached-text"}>
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip id="tooltrip-download">{attachedFile.fileName}</Tooltip>}
            >
              {/* <span className={styles? styles.closeButton : 'attached-text'} onClick={() => setShowImage(true)}> */}
              {/* <span onClick={() => setShowImage(true)}> */}

              <span style={{ color: textColorBlack ? "black" : "#0171ba" }}>
                {styles || attachedFile.fileName?.length < 35
                  ? attachedFile.fileName
                  : attachedFile.fileName.slice(0, 35) + "..."}
              </span>

              {/**
               * fix display file name only 35 characters.
               */}
              {/* {styles && attachedFile.fileName?.length < 12 ? attachedFile.fileName : (attachedFile.fileName.slice(0, 12)+'...')} */}
              {/* {attachedFile.fileName?.length < 35 ? attachedFile.fileName : (attachedFile.fileName.slice(0, 35)+'...')}  */}
              {/* {attachedFile.fileName} */}
            </OverlayTrigger>
          </div>
          {readonly === false && onRemove ? (
            <div className="close-button">
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={<Tooltip id="tooltrip-download">{i18n.t("REMOVE")}</Tooltip>}
              >
                <SVG
                  src={closeIcon}
                  className={styles?.badgeFileClose ? styles.badgeFileClose : "attached-close"}
                  width="10"
                  height="10"
                  onClick={(e) => handleRemove(e, attachedFile.id)}
                ></SVG>
              </OverlayTrigger>
            </div>
          ) : (
            <></>
          )}
          {readonly === false && onDownload ? (
            <div className="download-button">
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={<Tooltip id="tooltrip-download">{i18n.t("DOWNLOAD")}</Tooltip>}
              >
                <>
                  <SVG
                    src={downloadIcon}
                    className={styles?.badgeFileClose ? styles.badgeFileClose : "attached-close"}
                    width="10"
                    height="10"
                    onClick={(e) => handleDownload(e, attachedFile.filePath, attachedFile.fileName)}
                  ></SVG>
                </>
              </OverlayTrigger>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Badge>
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
export default AttachedFileBadge;

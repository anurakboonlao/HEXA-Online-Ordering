//@ts-nocheck
import { FC, useRef, useState } from 'react';
import { Button, Modal, Row, Col, Card, Image } from 'react-bootstrap';
import { IGetAttachmentFile } from '../../redux/actions/attachment.action';
import './../../scss/components/_attachFileModal.scss';
import './../../scss/page/case-detail/_caseDetail.scss';
import  uploadLogo  from './../../assets/svg/upload-img.svg';
import closeLogo from './../../assets/svg/x-button.svg';
import ReactImageVideoLightbox from "react-image-video-lightbox";
import {fileICharmTypeEnum } from '../../constants/caseManagement';
import i18n from '../../i18n';

interface IFileAttachmentProps {
    show: boolean;
    confirmShowing:boolean;
    attachFile: IGetAttachmentFile[];
    onHide: () => void;
    isUploading: boolean;
    onRemove: (id:number) => void;
    isRemovingImage: boolean;
    isLoading: boolean;
    uploadAction: (file:File[]) => void;
    
}

const FileAttachmentModal: FC<IFileAttachmentProps> = ({
    show = false
    , confirmShowing = false
    , isRemovingImage = false
    , attachFile = []
    , onHide = () => {}
    , isUploading = true
    , isLoading = true
    , uploadAction =  (file:File []) => {}
    , onRemove = (id:number) => {} }) => {

    const [showImage, setShowImage] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

	const [selectedFile, setSelectedFile] = useState<IGetAttachmentFile | undefined>(undefined);

    const changeHandler = (event:any) => {     
        let fileWithType = event.target.files;
        fileWithType[0].fileTypeId = fileICharmTypeEnum.Normal;
        uploadAction(fileWithType);
	};
    const filterAttachedFileListType = () => {
        return attachFile.filter((file: IGetAttachmentFile) => {
          return file.type !== "file";
        });
      };
    const removeImageFile = (e:any, id:number) => {
        e.stopPropagation();
        onRemove(id)
    }

    
    const findIndexForPhoto = () => {
        if (attachFile) {
          setPhotoIndex(
            filterAttachedFileListType().findIndex((item) => item.id === selectedFile.id)
          );
        }
        return photoIndex;
      };
      const closeImageShow = () => {
        setSelectedFile(undefined);
        setShowImage(false);
      }
      const openImageShow = (event: any, file:any) => {
        setSelectedFile(file);
        if(selectedFile && (selectedFile.type !== 'file')){
        if (attachFile && attachFile.length > 0) {
          findIndexForPhoto();
          setShowImage(true);
        }else {
            setShowImage(true);
          }
      };
    }
    

    return (
        <Modal
            show={show}
            className={(show && confirmShowing ? "modal__overlay modal__main" : "modal__main") + ' attachFile-modal '}
            backdrop="static"
            onHide={onHide}
            >
         <Modal.Body>
            <div className="attachFile-modal__label">{i18n.t("ATTACHMENTS")}</div>
            <Row className="mt-3 mb-3">
                <Col className="text-center">
                     <input
                        ref={inputRef}
                        onChange={changeHandler}
                        type="file"
                        style={{ display: "none" }}
                        multiple={true}
                        />
                    <Button className="attachFile-secondary-btn case-detail__menu_small_btn" variant="primary" onClick={() => inputRef.current?.click()} disabled={isUploading || isRemovingImage}>
                    <Row style={{paddingLeft:'11px'}}>
                            {
                            isUploading || isRemovingImage? 
                            <>
                                <div className="loader pr-1"/>
                                <span className="px-3 attachFile__btn_label">{isRemovingImage? i18n.t("REMOVING") : i18n.t("UPLOADING")}</span>
                            </>
                            : 
                            <>
                                <Image src={uploadLogo} className="hexa-attach-logo case-detail__menu-icon"></Image>
                                <span className="pl-1 text-right attachFile__btn_label">{i18n.t("UPLOAD_IMAGE")}</span>
                            </>  
                            }
                        </Row>
                    </Button>
                </Col>
            </Row>

            {/** display upload file card */}
            <Row className="justify-content-md-center">

                    {
                       isLoading? <><div className="mt-5 mb-5 text-center loader color"/></> : (attachFile.map((file,index) => {
                            return (
                                <Card className="hexa-card" key={index} onClick={(e) => openImageShow(e,file)}>
                                    <Image src={closeLogo} onClick={ (e) => removeImageFile(e,file.id)} className="hexa-x-logo"></Image>
                                    <Card.Body onClick={() => {
                                    }}>
                                        <div className="hexa-card__title">{file.fileName}</div>
                                        <div className="hexa-card__body">{file.uploadDate.toISOString().slice(0,10) + ' (' + file.size + ' KB)' }</div>
                                    </Card.Body>
                                </Card>
                            );
                        })
                        )
                    }
            </Row>

            <Row className="mt-4">
                <Col className="text-right">
                    <Button className="attachFile-outlined-btn case-detail__menu_small_btn attachFile__btn_label" variant="outline-primary" onClick={onHide} disabled={false}>{i18n.t("CLOSE")}</Button>
                </Col>
            </Row>
         </Modal.Body>
        {
         showImage && <ReactImageVideoLightbox
         data={filterAttachedFileListType()}
         startIndex={photoIndex}
         showResourceCount={true}
         onCloseCallback={() => {closeImageShow()}}
         onNavigationCallback={(currentIndex: any) =>
           console.log(`Current index: ${currentIndex}`)
         }
       />
         }
        </Modal>

    );
}

export default FileAttachmentModal;
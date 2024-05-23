import "../../scss/components/_orderForm.scss";
import GenderCard from "../../components/case/gender-card.component";
import Male from "../../assets/svg/gender-male.svg";
import Female from "../../assets/svg/gender-female.svg";
import i18n from "i18next";
import OrderFormAttachments from "./order-form-attachments.component";
import { IGetAttachmentFile } from "../../redux/actions/attachment.action";
import { FC } from "react";
import { Container } from "react-bootstrap";
import { fileICharmTypeEnum, iCharmGenderEnum } from "../../constants/caseManagement";

interface IOrderFormProps {
  caseState: any;
  iCharmSetAge: (newAge: string) => void;
  iCharmGenderSelected: (gender: number) => void;
  uploadAction: (file: any[], fileTypeNumber: number) => void;
  isUploading: boolean;
  isRemovingImage: boolean;
  onRemove: (id: number) => void;
  attachedFile: IGetAttachmentFile[];
}

const OrderForm: FC<IOrderFormProps> = ({
  caseState,
  iCharmSetAge,
  uploadAction,
  onRemove,
  iCharmGenderSelected,
  isUploading = true,
  isRemovingImage = false,
  attachedFile,
}) => {
  const changeHandlerXrey = (event: any) => {
    let fileAndType = event.target.files;
    fileAndType[0].fileTypeId = fileICharmTypeEnum.Xrey;
    uploadAction(fileAndType, fileAndType[0].fileTypeId);
  };

  const changeHandlerPatient = (event: any) => {
    if (event.target.value) {
      let fileWithType = event.target.files;
      fileWithType[0].fileTypeId = fileICharmTypeEnum.Patient;
      uploadAction(fileWithType, fileWithType[0].fileTypeId);
    }
  };
  const filterAttachedFileList = (fileTypeId: number) => {
    return attachedFile.filter((file: IGetAttachmentFile) => {
      return file.fileTypeId === fileTypeId;
    });
  };

  return (
    <Container fluid>
      <div className="order-form-container">
        <div className="order-form-age">
          <label className="order-form-text">{i18n.t("AGE")} <span> *</span></label>
          <input
            type="number"
            min="1"
            onWheel={(event) => event.currentTarget.blur()}
            className="order-form-age-input"
            multiple
            value={caseState.age || ""}
            onChange={(e) => iCharmSetAge(e.target.value)}
          ></input>
        </div>
        <div className="order-form-gender">
          <div>
            <label className="order-form-text">{i18n.t("GENDER")}</label>
          </div>
          <div className="order-form-gender-card">
            <div
              onClick={() => {
                iCharmGenderSelected(iCharmGenderEnum.Male);
              }}
            >
              <GenderCard
                image={Male}
                text={i18n.t("MALE")}
                numberOfGender={iCharmGenderEnum.Male}
                selectedGender={caseState.gender}
              />
            </div>
            <div
              className="order-form-gender-female"
              onClick={() => {
                iCharmGenderSelected(iCharmGenderEnum.Female);
              }}
            >
              <GenderCard
                image={Female}
                text={i18n.t("FEMALE")}
                numberOfGender={iCharmGenderEnum.Female}
                selectedGender={caseState.gender}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="order-form-patient">
            <OrderFormAttachments
              onRemove={onRemove}
              attachedFile={filterAttachedFileList(fileICharmTypeEnum.Patient)}
              isUploading={isUploading}
              isRemovingImage={isRemovingImage}
              methodOnChange={changeHandlerPatient}
              topicText={i18n.t("UPLOAD_PATIENT_IMAGE")}
              isRequire={true}
              limitationText={i18n.t("UPLOAD_LIMITATION")}
            />
          </div>
        </div>
        <div>
          <div className="order-form-xray-file mb-3">
            <OrderFormAttachments
              onRemove={onRemove}
              attachedFile={filterAttachedFileList(fileICharmTypeEnum.Xrey)}
              isUploading={isUploading}
              isRemovingImage={isRemovingImage}
              methodOnChange={changeHandlerXrey}
              topicText={i18n.t("UPLOAD_XREY_FILM")}
              limitationText={i18n.t("UPLOAD_LIMITATION")}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default OrderForm;

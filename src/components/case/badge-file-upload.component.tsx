import { FC } from "react";
import "../../scss/components/_badgeFile.scss";
import SVG from "react-inlinesvg";
import CloseIcon from "../../assets/svg/close-badge.svg";

interface IBadgeFileUpload {
  fileName: string;
  indexBadge: number;
  removeByIndex: (index: number) => void;
}

const BadgeFileUpload: FC<IBadgeFileUpload> = ({
  fileName,
  removeByIndex,
  indexBadge
}) => {
  return (
    <>
      <div className="badge-file-div">
        <div className="badge-file">
          <p className="badge-file-text">{fileName}</p>
        </div>
          <SVG
            src={CloseIcon}
            className="badge-file-close"
            width="10.47"
            height="10.47"
            onClick={() => removeByIndex(indexBadge)}
          ></SVG>
      </div>
    </>
  );
};
export default BadgeFileUpload;

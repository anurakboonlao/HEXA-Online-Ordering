import { FC } from "react";

interface IAdminProgressProps {
  img: string;
  title: string;
  description: string;
  progressBarImg: string;
}
const AdminProgressProps: FC<IAdminProgressProps> = ({
  img,
  title,
  description,
  progressBarImg,
}) => {
  return (
    <>
      <div>
        <div className="title-bar">
          <div className="description">
            <img src={img} />
            <h3 className="description-title">{title}</h3>
            <p className="description-desc">{description}</p>
          </div>
        </div>
        <div className="description-img-div">
          <img src={progressBarImg} className="description-img" />
        </div>
      </div>
    </>
  );
};
export default AdminProgressProps;

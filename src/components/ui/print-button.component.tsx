import { FC } from "react";
import { Button } from "react-bootstrap";
import SVG from "react-inlinesvg";
import printIcon from "../../assets/svg/print-icon.svg";
import { IOrderOverview } from "../../redux/domains/OrderOverview";
import hexaLoading from "../../utils/loading";

interface IPrintButtonProps {
  show: boolean;
  orderPrintList?: IOrderOverview[];
  onClickPrintOrder: () => void;
  loading:boolean;
}

const PrintButton: FC<IPrintButtonProps> = ({
  show,
  orderPrintList = [],
  onClickPrintOrder,
  loading = false, 
}) => {
  const disabled = ()=>{
      return orderPrintList.length <= 0 || loading;
  };

  return (
    <>
      {show && (
        <Button
          disabled={disabled()}
          className={"dropdown-notification ml-3 fill-noti"}
          onClick={() => onClickPrintOrder()}
        >
          {loading ? hexaLoading() :
          <SVG src={printIcon} width="19" height="19"></SVG>}
        </Button>
      )}
    </>
  );
};

export default PrintButton;

import { FC, useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { find, min } from "lodash";
import { toast } from "react-toastify";

import CanineToCanine from "../../assets/svg/canine-to-canine.jpeg";
import PremolarToPremolar from "../../assets/svg/premolar-to-premolar.jpeg";
import ICharm from "../../assets/svg/icharm.jpg";

import { ProductTypeEnum, TeethEnum } from "../../constants/caseManagement";
import { CaseOrderListModel } from "../../redux/domains/CaseManagement";
import DragableTeeth from "./dragable-teeth.component";

import teethLower from "../../assets/svg/teeth-lower.svg";
import teethUpper from "../../assets/svg/teeth-upper.svg";

import teeth11 from "../../assets/svg/Teeth-11.svg";
import teeth12 from "../../assets/svg/Teeth-12.svg";
import teeth13 from "../../assets/svg/Teeth-13.svg";
import teeth14 from "../../assets/svg/Teeth-14.svg";
import teeth15 from "../../assets/svg/Teeth-15.svg";
import teeth16 from "../../assets/svg/Teeth-16.svg";
import teeth17 from "../../assets/svg/Teeth-17.svg";
import teeth18 from "../../assets/svg/Teeth-18.svg";

import teeth21 from "../../assets/svg/Teeth-21.svg";
import teeth22 from "../../assets/svg/Teeth-22.svg";
import teeth23 from "../../assets/svg/Teeth-23.svg";
import teeth24 from "../../assets/svg/Teeth-24.svg";
import teeth25 from "../../assets/svg/Teeth-25.svg";
import teeth26 from "../../assets/svg/Teeth-26.svg";
import teeth27 from "../../assets/svg/Teeth-27.svg";
import teeth28 from "../../assets/svg/Teeth-28.svg";

import teeth31 from "../../assets/svg/Teeth-31.svg";
import teeth32 from "../../assets/svg/Teeth-32.svg";
import teeth33 from "../../assets/svg/Teeth-33.svg";
import teeth34 from "../../assets/svg/Teeth-34.svg";
import teeth35 from "../../assets/svg/Teeth-35.svg";
import teeth36 from "../../assets/svg/Teeth-36.svg";
import teeth37 from "../../assets/svg/Teeth-37.svg";
import teeth38 from "../../assets/svg/Teeth-38.svg";

import teeth41 from "../../assets/svg/Teeth-41.svg";
import teeth42 from "../../assets/svg/Teeth-42.svg";
import teeth43 from "../../assets/svg/Teeth-43.svg";
import teeth44 from "../../assets/svg/Teeth-44.svg";
import teeth45 from "../../assets/svg/Teeth-45.svg";
import teeth46 from "../../assets/svg/Teeth-46.svg";
import teeth47 from "../../assets/svg/Teeth-47.svg";
import teeth48 from "../../assets/svg/Teeth-48.svg";

import bin from "../../assets/svg/delete-icon.svg";
import i18n from "../../i18n";

interface ITeethTypeSelectProps {
  selectedProductType: ProductTypeEnum;
  caseOrderList: CaseOrderListModel[];
  selectedTeeth: TeethEnum;
  onSelectTeeth: (select: TeethEnum) => void;
  onSelectProductType: (select: ProductTypeEnum) => void;
  disabledEdit: boolean;
  onUpdateBridge: (groupName: string, selectedTeeth: TeethEnum[]) => void;
  onRemoveBridge: (groupName: string) => void;
  onSetShowConfirmIcharmModal: (select: ProductTypeEnum) => void;
  onSetIcharmProduct: (select: ProductTypeEnum) => void;
  onSetShowBackConfirmIcharmModal: (select: ProductTypeEnum) => void;
}

const TeethTypeSelect: FC<ITeethTypeSelectProps> = ({
  onSetShowBackConfirmIcharmModal,
  onSetShowConfirmIcharmModal,
  onSetIcharmProduct,
  selectedProductType,
  selectedTeeth,
  caseOrderList,
  onSelectTeeth,
  onSelectProductType,
  onUpdateBridge,
  onRemoveBridge,
  disabledEdit,
}) => {
  const [startDrag, setStartDrag] = useState<TeethEnum>();
  const [endDrag, setEndDrag] = useState<TeethEnum>();

  useEffect(() => {}, [startDrag, endDrag]);

  const isSelected = (teethType: TeethEnum) => {
    if (selectedTeeth === teethType) return true;
    else {
      let selectTeethFromList = selectedTeethProp(teethType);
      return selectTeethFromList !== undefined;
    }
  };

  const selectedTeethProp = (teethType: TeethEnum) => {
    if (caseOrderList && caseOrderList.length > 0) {
      let teeth = find(caseOrderList, function (p) {
        return p.no === teethType && p.productType === selectedProductType;
      });
      return teeth;
    }
  };

  const productColorCode = (teethType: TeethEnum) => {
    const cassOrder = selectedTeethProp(teethType);
    if (cassOrder) {
      return cassOrder.selectProduct?.colorCode;
    }
  };

  const isIcharmType = (select: ProductTypeEnum) =>{
    return (select == ProductTypeEnum.ICHARM ||
    select == ProductTypeEnum.CanineToCanine ||
    select == ProductTypeEnum.PremolarToPremolar)
  }

  const productTypeClick = (select: ProductTypeEnum) => {
    const currentSelect = selectedProductType;
    if (!isIcharmType(currentSelect)) {
      //Current normal Type
      if (!isIcharmType(select)){
        //To normal Type
        if (selectedProductType !== select) onSelectProductType(select);
      } else {
        //To Icharm Type
        onSetShowConfirmIcharmModal(select);
      }
    } else {
      //Current Icharm Type
      if (!isIcharmType(select)) {
        //To normal Type
        onSetShowBackConfirmIcharmModal(select);
      } else {
        //To Icharm Type
        if (selectedProductType !== select) onSelectProductType(select);
      }
    }
  };

  const onStartDrag = (e: React.DragEvent<HTMLDivElement>, id: TeethEnum) => {
    e.dataTransfer.setDragImage(getImageTemp(), 0, 0);
    setStartDrag(id);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>, id: TeethEnum) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, dropTarget: TeethEnum): void => {
    e.preventDefault();

    setEndDrag(dropTarget);
    onDropWithoutResetStartDrag(e, dropTarget);
    setStartDrag(undefined);
  };

  const onDropWithoutResetStartDrag = (
    e: React.DragEvent<HTMLDivElement>,
    dropTarget: TeethEnum
  ): void => {
    console.log(`Start drag at ${startDrag} and drop at ${dropTarget}`);
    let selectedTooth: TeethEnum[] = [];
    let teethInBetween: TeethEnum[] = [];

    // 1. Validate from upper to lower case
    if (
      startDrag &&
      (/^1/.test(startDrag) || /^2/.test(startDrag)) &&
      !(/^1/.test(dropTarget) || /^2/.test(dropTarget))
    ) {
      console.log(i18n.t("NOT_POSSIBLE_TO_BRIDGE_FROM_UPPER_TO_LOWER"));
      toast.error(i18n.t("NOT_POSSIBLE_TO_BRIDGE_FROM_UPPER_TO_LOWER"));
      return;
    }

    // 2. Validate from lower to upper case
    if (
      startDrag &&
      (/^3/.test(startDrag) || /^4/.test(startDrag)) &&
      !(/^3/.test(dropTarget) || /^4/.test(dropTarget))
    ) {
      console.log(i18n.t("NOT_POSSIBLE_TO_BRIDGE_FROM_LOWER_TO_UPPER"));
      toast.error(i18n.t("NOT_POSSIBLE_TO_BRIDGE_FROM_LOWER_TO_UPPER"));
      return;
    }

    if (startDrag && dropTarget && startDrag !== dropTarget) {
      let startIndex = toothProperties[startDrag].position;
      let dropIndex = toothProperties[dropTarget].position;
      let startTooth: TeethEnum;
      let targetTooth: TeethEnum;

      if (dropIndex < startIndex) {
        startIndex = toothProperties[dropTarget].position;
        dropIndex = toothProperties[startDrag].position;
      }
      console.log(`start : ${startIndex} -> end : ${dropIndex}`);

      // Add to collection of selectedTooth
      for (let i = startIndex; i <= dropIndex; i++) {
        if (/^3/.test(startDrag) || /^4/.test(startDrag)) {
          selectedTooth.push(toothLowerPositions[i]);

          if (i === startIndex) startTooth = toothLowerPositions[i];
          else if (i === dropIndex) targetTooth = toothLowerPositions[i];
          else teethInBetween.push(toothLowerPositions[i]);
        } else {
          selectedTooth.push(toothUpperPositions[i]);

          if (i === startIndex) startTooth = toothUpperPositions[i];
          else if (i === dropIndex) targetTooth = toothUpperPositions[i];
          else teethInBetween.push(toothUpperPositions[i]);
        }
      }

      // Check if selected tooth must be setup product.
      const fixedProducts = caseOrderList.filter(
        (c) => c.productType === ProductTypeEnum.CrownAndBridge
      );
      const startProduct: CaseOrderListModel | undefined = fixedProducts.filter(
        (product) => product.no === startTooth
      )[0];
      const endProduct: CaseOrderListModel | undefined = fixedProducts.filter(
        (product) => product.no === targetTooth
      )[0];
      const fixedProductTeethList: TeethEnum[] = fixedProducts.map((product) => product.no);
      const isSelectedToothContainedInFixedProducts: boolean = selectedTooth.every((tooth) =>
        fixedProductTeethList.includes(tooth)
      );

      if (!isSelectedToothContainedInFixedProducts) {
        toast.error(i18n.t("NOT_POSSIBLE_TO_BRIDGE_ACROSS_UNSELECTED_PRODUCTS"));
        return;
      }

      if (teethInBetween.length > 0) {
        const teethProducts: CaseOrderListModel[] | undefined = fixedProducts.filter((product) => {
          for (let i = 0; i < teethInBetween.length; i++) {
            if (teethInBetween[i] === product.no) return true;
          }
          return false;
        });

        const isToothInBetweenHasGroup: boolean = teethProducts.some(
          (product) => product.option !== ""
        );
        if (isToothInBetweenHasGroup) {
          toast.error(i18n.t("NOT_POSSIBLE_TO_BRIDGE_ACROSS_MULTIPLE_GROUPS"));
          return;
        }
      }

      // Both of start and end already have groups
      if (startProduct.option !== "" && endProduct.option !== "") {
        toast.error(i18n.t("NOT_POSSIBLE_TO_BRIDGE_ACROSS_MULTIPLE_GROUPS"));
        return;
      }

      if (
        fixedProducts.length > 0 &&
        startProduct &&
        endProduct /*&& selectedTooth.every(t => fixedProducts.filter(p => p.option === '').map(p => p.no).includes(t))*/
      ) {
        let collection;
        // Start and End does not belong to the same group, add them to the existing groups
        if (startProduct.option !== "" && endProduct.option === "") {
          // Add to start group
          collection = bridgeCollection.find((c) => c.name === startProduct.option);
          if (collection) onUpdateBridge(collection.name, selectedTooth);
          return;
        } else if (endProduct.option !== "" && startProduct.option === "") {
          // Add to end group
          collection = bridgeCollection.find((c) => c.name === endProduct.option);
          if (collection) onUpdateBridge(collection.name, selectedTooth);
          return;
        }
        // Create new group
        // Get available bridge collection.
        const availableCollection = bridgeCollection.filter(
          (c) => !fixedProducts.find((p) => p.option === c.name)
        );
        // console.log(availableCollection);
        //Collection must alwayd be found.
        collection = bridgeCollection.find(
          (c) => c.order === min(availableCollection.map((p) => p.order))
        );
        // console.log(collection);
        if (collection) onUpdateBridge(collection.name, selectedTooth);
      }
      // If the start draged or ended is  already bridged, then reject the bridge.
      else {
        toast.error(i18n.t("NOT_POSSIBLE_TO_BRIDGE_ACROSS_UNSELECTED_PRODUCTS"));
      }
    }
  };

  const getImageTemp = () => {
    // workaround solution (drag drop does not work in safari) : Adding empty GIF as the image to
    let dragImg: HTMLImageElement = new Image();
    dragImg.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    dragImg.style.visibility = "hidden";
    return dragImg;
  };

  const toothUpperPositions: Record<number, TeethEnum> = {
    1: TeethEnum.T18,
    2: TeethEnum.T17,
    3: TeethEnum.T16,
    4: TeethEnum.T15,
    5: TeethEnum.T14,
    6: TeethEnum.T13,
    7: TeethEnum.T12,
    8: TeethEnum.T11,
    9: TeethEnum.T21,
    10: TeethEnum.T22,
    11: TeethEnum.T23,
    12: TeethEnum.T24,
    13: TeethEnum.T25,
    14: TeethEnum.T26,
    15: TeethEnum.T27,
    16: TeethEnum.T28,
  };

  const toothLowerPositions: Record<number, TeethEnum> = {
    1: TeethEnum.T48,
    2: TeethEnum.T47,
    3: TeethEnum.T46,
    4: TeethEnum.T45,
    5: TeethEnum.T44,
    6: TeethEnum.T43,
    7: TeethEnum.T42,
    8: TeethEnum.T41,
    9: TeethEnum.T31,
    10: TeethEnum.T32,
    11: TeethEnum.T33,
    12: TeethEnum.T34,
    13: TeethEnum.T35,
    14: TeethEnum.T36,
    15: TeethEnum.T37,
    16: TeethEnum.T38,
  };

  const toothProperties: Record<TeethEnum, { className: string; src: string; position: number }> = {
    [TeethEnum.T11]: { className: "teeth11", src: teeth11, position: 8 },
    [TeethEnum.T12]: { className: "teeth12", src: teeth12, position: 7 },
    [TeethEnum.T13]: { className: "teeth13", src: teeth13, position: 6 },
    [TeethEnum.T14]: { className: "teeth14", src: teeth14, position: 5 },
    [TeethEnum.T15]: { className: "teeth15", src: teeth15, position: 4 },
    [TeethEnum.T16]: { className: "teeth16", src: teeth16, position: 3 },
    [TeethEnum.T17]: { className: "teeth17", src: teeth17, position: 2 },
    [TeethEnum.T18]: { className: "teeth18", src: teeth18, position: 1 },
    [TeethEnum.T21]: { className: "teeth21", src: teeth21, position: 9 },
    [TeethEnum.T22]: { className: "teeth22", src: teeth22, position: 10 },
    [TeethEnum.T23]: { className: "teeth23", src: teeth23, position: 11 },
    [TeethEnum.T24]: { className: "teeth24", src: teeth24, position: 12 },
    [TeethEnum.T25]: { className: "teeth25", src: teeth25, position: 13 },
    [TeethEnum.T26]: { className: "teeth26", src: teeth26, position: 14 },
    [TeethEnum.T27]: { className: "teeth27", src: teeth27, position: 15 },
    [TeethEnum.T28]: { className: "teeth28", src: teeth28, position: 16 },
    [TeethEnum.T31]: { className: "teeth31", src: teeth31, position: 9 },
    [TeethEnum.T32]: { className: "teeth32", src: teeth32, position: 10 },
    [TeethEnum.T33]: { className: "teeth33", src: teeth33, position: 11 },
    [TeethEnum.T34]: { className: "teeth34", src: teeth34, position: 12 },
    [TeethEnum.T35]: { className: "teeth35", src: teeth35, position: 13 },
    [TeethEnum.T36]: { className: "teeth36", src: teeth36, position: 14 },
    [TeethEnum.T37]: { className: "teeth37", src: teeth37, position: 15 },
    [TeethEnum.T38]: { className: "teeth38", src: teeth38, position: 16 },
    [TeethEnum.T41]: { className: "teeth41", src: teeth41, position: 8 },
    [TeethEnum.T42]: { className: "teeth42", src: teeth42, position: 7 },
    [TeethEnum.T43]: { className: "teeth43", src: teeth43, position: 6 },
    [TeethEnum.T44]: { className: "teeth44", src: teeth44, position: 5 },
    [TeethEnum.T45]: { className: "teeth45", src: teeth45, position: 4 },
    [TeethEnum.T46]: { className: "teeth46", src: teeth46, position: 3 },
    [TeethEnum.T47]: { className: "teeth47", src: teeth47, position: 2 },
    [TeethEnum.T48]: { className: "teeth48", src: teeth48, position: 1 },
    [TeethEnum.Upper]: { className: "", src: "", position: 0 },
    [TeethEnum.Lower]: { className: "", src: "", position: 0 },
    [TeethEnum.None]: { className: "", src: "", position: 0 },
  };

  const toothSeq = {
    q1: [
      TeethEnum.T11,
      TeethEnum.T12,
      TeethEnum.T13,
      TeethEnum.T14,
      TeethEnum.T15,
      TeethEnum.T16,
      TeethEnum.T17,
      TeethEnum.T18,
    ],
    q2: [
      TeethEnum.T21,
      TeethEnum.T22,
      TeethEnum.T23,
      TeethEnum.T24,
      TeethEnum.T25,
      TeethEnum.T26,
      TeethEnum.T27,
      TeethEnum.T28,
    ],
    q3: [
      TeethEnum.T31,
      TeethEnum.T32,
      TeethEnum.T33,
      TeethEnum.T34,
      TeethEnum.T35,
      TeethEnum.T36,
      TeethEnum.T37,
      TeethEnum.T38,
    ],
    q4: [
      TeethEnum.T41,
      TeethEnum.T42,
      TeethEnum.T43,
      TeethEnum.T44,
      TeethEnum.T45,
      TeethEnum.T46,
      TeethEnum.T47,
      TeethEnum.T48,
    ],
  };

  // Name of bridge group can be change here.
  const bridgeCollection = [
    { name: "A", color: "#663511", order: 1 },
    { name: "B", color: "#946592", order: 2 },
    { name: "C", color: "#C86B31", order: 3 },
    { name: "D", color: "#E29D17", order: 4 },
    { name: "E", color: "#E94210", order: 5 },
    { name: "F", color: "#ABEE93", order: 6 },
    { name: "G", color: "#2D938E", order: 7 },
    { name: "H", color: "#0B4462", order: 8 },
    { name: "I", color: "#F7A48B", order: 9 },
    { name: "J", color: "#954E1A", order: 10 },
    { name: "K", color: "#A379A2", order: 11 },
    { name: "L", color: "#D2704A", order: 12 },
    { name: "M", color: "#E9AB33", order: 13 },
    { name: "N", color: "#C4597D", order: 14 },
    { name: "O", color: "#AE9104", order: 15 },
    { name: "P", color: "#3A9A18", order: 16 },
  ];

  const displayImage = (productType: ProductTypeEnum) => {
    if (productType === ProductTypeEnum.CrownAndBridge) {
      const displayBin = caseOrderList.find(
        (p) =>
          p.productType === ProductTypeEnum.CrownAndBridge && p.no === startDrag && p.option !== ""
      );
      return (
        <>
          <div
            className="arch"
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              setStartDrag(undefined);
            }}
          >
            <div className="arch-upper cb-box">
              <div className="teeth-q1">
                {toothSeq.q1.map((teeth, i) => {
                  const bridge = caseOrderList.find(
                    (c) => c.productType === ProductTypeEnum.CrownAndBridge && c.no === teeth
                  );
                  return (
                    <DragableTeeth
                      key={i}
                      teeth={teeth}
                      src={toothProperties[teeth].src}
                      seleceted={isSelected(teeth)}
                      fillColor={"#0171BB"}
                      className={toothProperties[teeth].className}
                      highlightColor={
                        bridge
                          ? bridgeCollection.find((b) => b.name === bridge.option)?.color
                          : undefined
                      }
                      draggable={!disabledEdit}
                      onDragStart={(e, teeth) => onStartDrag(e, teeth)}
                      onDragOver={(e, teeth) => onDragOver(e, teeth)}
                      onDrop={(e, teeth) => onDrop(e, teeth)}
                      onSelectTeeth={(teeth) => onSelectTeeth(teeth)}
                    />
                  );
                })}
              </div>
              <div className="teeth-q2">
                {toothSeq.q2.map((teeth, i) => {
                  const bridge = caseOrderList.find(
                    (c) => c.productType === ProductTypeEnum.CrownAndBridge && c.no === teeth
                  );
                  return (
                    <DragableTeeth
                      key={i}
                      teeth={teeth}
                      src={toothProperties[teeth].src}
                      seleceted={isSelected(teeth)}
                      fillColor={"#0171BB"}
                      className={toothProperties[teeth].className}
                      highlightColor={
                        bridge
                          ? bridgeCollection.find((b) => b.name === bridge.option)?.color
                          : undefined
                      }
                      draggable={!disabledEdit}
                      onDragStart={(e, teeth) => onStartDrag(e, teeth)}
                      onDragOver={(e, teeth) => onDragOver(e, teeth)}
                      onDrop={(e, teeth) => onDrop(e, teeth)}
                      onSelectTeeth={(teeth) => onSelectTeeth(teeth)}
                    />
                  );
                })}
              </div>
            </div>
            <div className="arch-lowe cb-box">
              <div className="teeth-q4">
                {toothSeq.q4.map((teeth, i) => {
                  const bridge = caseOrderList.find(
                    (c) => c.productType === ProductTypeEnum.CrownAndBridge && c.no === teeth
                  );
                  return (
                    <DragableTeeth
                      key={i}
                      teeth={teeth}
                      src={toothProperties[teeth].src}
                      seleceted={isSelected(teeth)}
                      fillColor={"#0171BB"}
                      className={toothProperties[teeth].className}
                      highlightColor={
                        bridge
                          ? bridgeCollection.find((b) => b.name === bridge.option)?.color
                          : undefined
                      }
                      draggable={!disabledEdit}
                      onDragStart={(e, teeth) => onStartDrag(e, teeth)}
                      onDragOver={(e, teeth) => onDragOver(e, teeth)}
                      onDrop={(e, teeth) => onDrop(e, teeth)}
                      onSelectTeeth={(teeth) => onSelectTeeth(teeth)}
                    />
                  );
                })}
              </div>
              <div className="teeth-q3">
                {toothSeq.q3.map((teeth, i) => {
                  const bridge = caseOrderList.find(
                    (c) => c.productType === ProductTypeEnum.CrownAndBridge && c.no === teeth
                  );
                  return (
                    <DragableTeeth
                      key={i}
                      teeth={teeth}
                      src={toothProperties[teeth].src}
                      seleceted={isSelected(teeth)}
                      fillColor={"#0171BB"}
                      className={toothProperties[teeth].className}
                      highlightColor={
                        bridge
                          ? bridgeCollection.find((b) => b.name === bridge.option)?.color
                          : undefined
                      }
                      draggable={!disabledEdit}
                      onDragStart={(e, teeth) => onStartDrag(e, teeth)}
                      onDragOver={(e, teeth) => onDragOver(e, teeth)}
                      onDrop={(e, teeth) => onDrop(e, teeth)}
                      onSelectTeeth={(teeth) => onSelectTeeth(teeth)}
                    />
                  );
                })}
              </div>
            </div>
            {displayBin && (
              <div
                draggable
                className="remove-icon"
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const removeBridge = caseOrderList.find(
                    (p) => p.no === startDrag && p.option !== ""
                  );
                  if (removeBridge) {
                    onRemoveBridge(removeBridge.option);
                  }
                }}
              >
                <SVG src={bin}></SVG>
              </div>
            )}
          </div>
        </>
      );
    }
    if (productType === ProductTypeEnum.CanineToCanine) {
      return (
        <>
          <img src={CanineToCanine} width="376" height="539"></img>
        </>
      );
    }
    if (productType === ProductTypeEnum.PremolarToPremolar) {
      return (
        <>
          <img
            src={PremolarToPremolar}
            width="376"
            height="539"
            className="premolar-to-premolar"
          ></img>
        </>
      );
    } else {
      return (
        <>
          <div className="arch">
            <div className="arch-upper">
              <SVG
                src={teethUpper}
                width="400"
                style={
                  isSelected(TeethEnum.Upper)
                    ? { fill: productColorCode(TeethEnum.Upper) }
                    : undefined
                }
                className={isSelected(TeethEnum.Upper) ? "svg-click selected" : "svg-click"}
                onClick={() => onSelectTeeth(TeethEnum.Upper)}
              ></SVG>
            </div>
            <div className="arch-lower">
              <SVG
                src={teethLower}
                width="400"
                style={
                  isSelected(TeethEnum.Lower)
                    ? { fill: productColorCode(TeethEnum.Lower) }
                    : undefined
                }
                className={isSelected(TeethEnum.Lower) ? "svg-click selected" : "svg-click"}
                onClick={() => onSelectTeeth(TeethEnum.Lower)}
              ></SVG>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <Nav className="teeth-type__top-nav">
        <Nav.Item
          className={
            selectedProductType === ProductTypeEnum.CrownAndBridge
              ? "teeth-type__nav-menu selected"
              : "teeth-type__nav-menu"
          }
        >
          <Nav.Link className="" onClick={() => productTypeClick(ProductTypeEnum.CrownAndBridge)}>
            <span className="teeth-type__nav-menu-text"> {ProductTypeEnum.CrownAndBridge} </span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item
          className={
            selectedProductType === ProductTypeEnum.Removable
              ? "teeth-type__nav-menu selected"
              : "teeth-type__nav-menu"
          }
        >
          <Nav.Link className="" onClick={() => productTypeClick(ProductTypeEnum.Removable)}>
            <span className="teeth-type__nav-menu-text"> {ProductTypeEnum.Removable} </span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item
          className={
            selectedProductType === ProductTypeEnum.Orthodontic ||
            selectedProductType === ProductTypeEnum.Orthopedic
              ? "teeth-type__nav-menu selected"
              : "teeth-type__nav-menu"
          }
        >
          <Nav.Link className="" onClick={() => productTypeClick(ProductTypeEnum.Orthodontic)}>
            <span className="teeth-type__nav-menu-text">
              {" "}
              {ProductTypeEnum.Orthodontic + " / " + ProductTypeEnum.Orthopedic}{" "}
            </span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item
          className={
            selectedProductType === ProductTypeEnum.CanineToCanine ||
            selectedProductType === ProductTypeEnum.PremolarToPremolar ||
            selectedProductType === ProductTypeEnum.ICHARM
              ? "teeth-type__nav-menu_icharm selected"
              : "teeth-type__nav-menu_icharm"
          }
        >
          <Nav.Link className="" onClick={() => productTypeClick(ProductTypeEnum.CanineToCanine)}>
            <img src={ICharm} width="66" height="22"></img>
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="teeth-type__select-image">{displayImage(selectedProductType)}</div>

      <Nav className="teeth-type__bottom-nav">
        {selectedProductType === ProductTypeEnum.Orthodontic ||
        selectedProductType === ProductTypeEnum.Orthopedic ? (
          <>
            <Nav.Item
              className={
                selectedProductType === ProductTypeEnum.Orthodontic
                  ? "teeth-type__nav-menu selected"
                  : "teeth-type__nav-menu"
              }
            >
              <Nav.Link className="" onClick={() => productTypeClick(ProductTypeEnum.Orthodontic)}>
                <span className="teeth-type__nav-menu-text"> {ProductTypeEnum.Orthodontic} </span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item
              className={
                selectedProductType === ProductTypeEnum.Orthopedic
                  ? "teeth-type__nav-menu selected"
                  : "teeth-type__nav-menu"
              }
            >
              <Nav.Link onClick={() => productTypeClick(ProductTypeEnum.Orthopedic)}>
                <span className="teeth-type__nav-menu-text"> {ProductTypeEnum.Orthopedic} </span>
              </Nav.Link>
            </Nav.Item>
          </>
        ) : (
          <></>
        )}
      </Nav>
      <Nav className="teeth-type__bottom-nav">
        {selectedProductType === ProductTypeEnum.CanineToCanine ||
        selectedProductType === ProductTypeEnum.PremolarToPremolar ? (
          <>
            <Nav.Item
              className={
                selectedProductType === ProductTypeEnum.CanineToCanine
                  ? "teeth-type__nav-menu_icharm selected"
                  : "teeth-type__nav-menu_icharm"
              }
            >
              <Nav.Link
                className=""
                onClick={() => onSetIcharmProduct(ProductTypeEnum.CanineToCanine)}
              >
                <span className="teeth-type__nav-menu-text_icharm">
                  {" "}
                  {ProductTypeEnum.CanineToCanine}{" "}
                </span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item
              className={
                selectedProductType === ProductTypeEnum.PremolarToPremolar
                  ? "teeth-type__nav-menu_icharm selected"
                  : "teeth-type__nav-menu_icharm"
              }
            >
              <Nav.Link onClick={() => onSetIcharmProduct(ProductTypeEnum.PremolarToPremolar)}>
                <span className="teeth-type__nav-menu-text_icharm">
                  {" "}
                  {ProductTypeEnum.PremolarToPremolar}{" "}
                </span>
              </Nav.Link>
            </Nav.Item>
          </>
        ) : (
          <></>
        )}
      </Nav>
    </>
  );
};

export default TeethTypeSelect;

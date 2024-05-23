import { FC, useState } from 'react';
import { Dropdown, Form, Button,  Modal, Nav, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import { DropdownItemColorOrtho, DropdownItemEnum, DropdownItemGlitter, DropdownItemSticker } from '../../constants/addOn';
import { AddOnInputType } from '../../constants/caseManagement';
import { AddOnModel, CatalogGroupEnum, CatalogModel } from '../../redux/domains/CaseManagement';
import questionMark from '../../assets/svg/question_mark.svg';
import i18n from '../../i18n';

interface IAddOnInputModalProps {
    // productList: string;
    show: boolean;
    addOnModel: AddOnModel | undefined;
    inputValue: string;
    setInputValue: (value:string) => void;
    onSave: (newInput:string) => void;
    onClose: () => void;  
    catalogs?: CatalogModel[];
}

const AddOnInputModal: FC<IAddOnInputModalProps> = ({show, addOnModel, inputValue,setInputValue , onSave, onClose, catalogs }) => {
    
    const enabledSaveBtn = inputValue && inputValue.length > 0 && inputValue.trim() !=='';
    const showLargeModal:boolean = !!(addOnModel && addOnModel.inputType === AddOnInputType.Plate);

    const [labelOnPlate, setLabelOnPlate] = useState('');
    const [selectedCatalogId, setSelectedCatalogId] = useState(-1);

    const bindDropDownList = () => {    
        return (
            <>
                {
                    Object.values(DropdownItemEnum).map((value, index) => {
                        if( value === DropdownItemEnum.All && addOnModel?.inputType && addOnModel?.inputType !== AddOnInputType.QuadrantWithAll){
                            return false;
                        }
                        
                        return (<Dropdown.Item eventKey={value} key={index} className="page-head-dropdown-item" onSelect={() => onSelectedOption(value)}>
                                    <span>{value}</span>
                                </Dropdown.Item>)
                    })
                }
            </>
        );
    }

    const bindDropDownColorOrtho = () => {
        return (<>
        {
            Object.values(DropdownItemColorOrtho).map((value, index) => {
                return (<Dropdown.Item eventKey={value} key={index} className="page-head-dropdown-item" onSelect={() => onSelectedOption(value)}>
                <span>{value}</span>
                </Dropdown.Item>)
            })
        }
            </>)
    }

    
    const bindDropDownStickerOrtho = () => {
        return (<>
        {
            Object.values(DropdownItemSticker).map((value, index) => {
                return (<Dropdown.Item eventKey={value} key={index} className="page-head-dropdown-item" onSelect={() => onSelectedOption(value)}>
                <span>{value}</span>
                </Dropdown.Item>)
            })
        }
            </>)
    }

    const bindDropDownGlitterOrtho = () => {
        return (<>
            {
                Object.values(DropdownItemGlitter).map((value, index) => {
                    return (<Dropdown.Item eventKey={value} key={index} className="page-head-dropdown-item" onSelect={() => onSelectedOption(value)}>
                    <span>{value}</span>
                    </Dropdown.Item>)
                })
            }
                </>)
    }

    const bindCatalog = (catalogList: CatalogModel[] | undefined) => {
        const catalogHtmlList: Array<JSX.Element> = [];
        if (catalogList && catalogList.length > 0) {
            catalogList.forEach((catalog) => {
                catalogHtmlList.push(
                    <div key={"catalog_" + catalog.id} className=" col-12 col-md-6 col-lg-3 px-1 my-2">
                        <Button disabled={false} className={(catalog.id === selectedCatalogId ? ' selected' : '') + ' product-modal__item-redio w-100'} onClick={
                            () => {
                                setSelectedCatalogId(catalog.id); 
                                onSelectedOption(catalog.name);
                            }} variant=""  >
                            <div className="product-modal__catalog-item-logo">
                                { catalog.logoPath ?<div className="photo-catalog" ><img alt={catalog.name} src={catalog.logoPath} style={{maxHeight:"100%",maxWidth:"100%"}}></img></div> :<></>}
                            </div>
                            <div className="product-modal__item-name">{catalog.name}</div>
                        </Button>
                    </div>
                );
            });
        }
        return (<div className="product-modal__tab-content">{catalogHtmlList}</div>);
    }

    const onLabelInput = (value:string) =>{
        if(value.length <= 5){
            setLabelOnPlate(value);
        }
    }

    const onSelectedOption = (value:string) =>{
        setInputValue(value);
    }

    const onSetNumber = (value:string) =>{
        const re = /^[0-9\b]+$/;
        if (value === '' || re.test(value)) {
            setInputValue(value);
         }
    }
    const onSetTeethNumber = (value:string) =>{
        const re = /^[0-9,\b]+$/;
        if( ( value === ',' && inputValue === '') ||
            ( inputValue && value && value.length > inputValue.length && value.charAt(0) === ',') ||
            ( value.includes(",,")) ){
                return;
        }

        if (value === '' || re.test(value)) {
            setInputValue(value);
         }
    }

    const retainerGalleryUrl = `${process.env.REACT_APP_RETAINER}`;

    const displayAddOnLabelWithCatalog = (label:string) => {
            return (<Row className="mr-0 ml-0 mt-3">
            <Form.Label className="addon-modal__label mr-3">{label}</Form.Label>

                <OverlayTrigger
                    placement='top'
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                        <Tooltip id="note-tooltip">
                            {i18n.t("TEXT_SEE_FULL_RETAINER_GALLERY")}
                        </Tooltip>
                    }
                >
                <Button
                    disabled={false}
                    className="case-detial_bridge_btn d-inline-flex align-items-center px-2 mt-1 mb-1"
                    variant="outline-primary"
                    onClick={() => {window.open(retainerGalleryUrl,'_blank')}}
                    >
                    <SVG src={questionMark} className="case-detail__menu-icon questionMark-icon mr-1" ></SVG> 
                    {i18n.t("RETAINER_GALLERY")}
                </Button>
                </OverlayTrigger>
        </Row>);
    } 

    const displayBodyOnInputType = () => {

        if(addOnModel?.inputType){
            switch(addOnModel?.inputType) {
                
                case AddOnInputType.Text:
                    return (<div>
                        <Form.Label className="addon-modal__label">{i18n.t("INPUT_TEETH_NUMBER")}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=""
                                className="addon-modal__text"
                                value={inputValue}
                                onChange={e => onSetTeethNumber(e.target.value)} 
                                />
                        </div>);

                case AddOnInputType.DropDownList:
                case AddOnInputType.QuadrantWithAll:
                    return (<div>
                        <Form.Label className="addon-modal__label">{i18n.t("SELECT_QUADRANT")}</Form.Label>
                        <Dropdown className="dropdown-light">
                            <Dropdown.Toggle variant=""><span>{inputValue}</span></Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-light-menu hexa__box-shadow">
                                {bindDropDownList()}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>);

                case AddOnInputType.Number:
                    return (<div>
                        <Form.Label className="addon-modal__label">{i18n.t("INPUT_NUMBER")}</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder=""
                            className="addon-modal__text"
                            value={inputValue}
                            onChange={e => onSetNumber(e.target.value)} 
                            />
                    </div>);

                case AddOnInputType.Plate:
                    return (<div>
                        <Form.Label className="addon-modal__label mt-3">{i18n.t("LABEL_TITLE")}<br/><span className="label-text" >{i18n.t("OPTIONAL_MAX_5_CHARACTERS")}</span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            className="addon-modal__text"
                            value={labelOnPlate}
                            onChange={e => onLabelInput(e.target.value)} 
                            />
                        {displayAddOnLabelWithCatalog(i18n.t("SELECT_PLATE_COLOR"))}
                        { 
                          catalogs && bindCatalog(catalogs.filter(catalog => catalog.catalogGroupId === CatalogGroupEnum.Plate))
                        }
                        
                    </div>);

                case AddOnInputType.Glitter:
                    return (<div>
                        {displayAddOnLabelWithCatalog(i18n.t("SELECT_PLATE_GLITTER_COLOR"))}
                        { 
                          catalogs && bindCatalog(catalogs.filter(catalog => catalog.catalogGroupId === CatalogGroupEnum.Glitter))
                        }
                    </div>);

                case AddOnInputType.Labial:
                    return(                    <div>
                        {displayAddOnLabelWithCatalog(i18n.t("SELECT_LABIAL_COLOR"))}
                        { 
                          catalogs && bindCatalog(catalogs.filter(catalog => catalog.catalogGroupId === CatalogGroupEnum.Plate))
                        }
                    </div>);

                case AddOnInputType.Buccal:
                    return(<div>
                        {displayAddOnLabelWithCatalog(i18n.t("SELECT_BUCCAL_COLOR"))}
                        { 
                          catalogs && bindCatalog(catalogs.filter(catalog => catalog.catalogGroupId === CatalogGroupEnum.Plate))
                        }
                    </div>);

                case AddOnInputType.Sticker:
                    return(<div>
                        {displayAddOnLabelWithCatalog(i18n.t("SELECT_STICKER"))}
                        { 
                          catalogs && bindCatalog(catalogs.filter(catalog => catalog.catalogGroupId === CatalogGroupEnum.Plate))
                        }
                    </div>);

                default:
                    return (<></>)
            }
        }
        return (<></>);
    }

    return (
        <Modal
        size={showLargeModal?'lg':'sm'}
        show={show}
        className="addon-modal product-modal"
        centered
        >
            <Modal.Body className="addon-modal__body">
                {
                    displayBodyOnInputType()
                }
                              
                <div className="case-detail__action">
                        <Nav className="case-detail__menu mb-0">
                            <Nav.Item className="case-detail__menu-item mr-3">
                                    <Button className="secondary-btn case-detail__menu_btn" 
                                    variant="primary" 
                                    disabled={!enabledSaveBtn} 
                                    onClick={
                                        ()=> {
                                            // if there is a label on plate 
                                            if(addOnModel?.inputType && addOnModel?.inputType === AddOnInputType.Plate && labelOnPlate !== '' && labelOnPlate.trim() !== ''){
                                                onSave(inputValue + ', name: ' + labelOnPlate);
                                            }else{
                                                onSave(inputValue);
                                            }
                                            setLabelOnPlate('');
                                            setSelectedCatalogId(-1);
                                        }}>
                                        {i18n.t("OK")}
                                </Button>
                            </Nav.Item>
                            <Nav.Item className="case-detail__menu-item">
                                <Button className="case-detail__menu_btn" variant="outline-primary" onClick={()=> {onClose(); setLabelOnPlate(''); setSelectedCatalogId(-1)}}>{i18n.t("CLOSE")}</Button>
                            </Nav.Item>                        
                        </Nav>
                </div>
            </Modal.Body>
        </Modal>
    );
}
export default AddOnInputModal;
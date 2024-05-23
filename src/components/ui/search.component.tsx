import React from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import SVG from 'react-inlinesvg';


import searchIcon from '../../assets/svg/search-icon.svg';


interface ISearchBoxProps {
    onSelectedCriteria: (value:string) => void;
    onSearchKey: (input:string) => void;
    selectedCriteria: string;
    selectedCaption: string;
    selectOption: { value: string, text: string }[];

    searchInputText: string;
    inputTextPlaceholder: string;
}

const SearchBox: React.FC<ISearchBoxProps> = ({ onSelectedCriteria, onSearchKey, selectedCriteria, selectedCaption, selectOption, searchInputText, inputTextPlaceholder }) => {
    const getSelectOptionTextByValue = (value:string) =>
    {
        let result:string = "";
        if(selectOption && selectOption.length > 0){
            const found = selectOption.find(o=>o.value === value);
            if(found){
                result = found.text;
            }
        }
        return result;
    }

    const createDropdown = () =>
    {
        return(
            <>
                {selectOption.map(({text,value},index)=>(
                   <Dropdown.Item eventKey={value} key={index} className="page-head-dropdown-item" onSelect={()=>onSelectedCriteria(value)}>
                           <span>{text}</span>
                    </Dropdown.Item>
                ))}
            </>
        );
    }

    return (
        <div className="search__box h-100">
            <Dropdown className="search__dropdown px-0 h-100">
                <Dropdown.Toggle className="h-100" variant="">{getSelectOptionTextByValue(selectedCriteria)}</Dropdown.Toggle>
                <Dropdown.Menu className="search__dropdown-menu hexa__box-shadow">
                    {createDropdown()}
                </Dropdown.Menu>
            </Dropdown>
            <div className=" px-0 search__border-left h-100">
                <div className="position-relative h-100">
                    <Form.Control type="text" placeholder={inputTextPlaceholder} className="search__textbox h-100" value={searchInputText} onChange={e => onSearchKey(e.target.value)}></Form.Control>
                    <div className="search__text-icon h-100"><SVG src={searchIcon} width="20px" ></SVG ></div>
                </div>
            </div>
        </div>
    );
}

export default SearchBox;

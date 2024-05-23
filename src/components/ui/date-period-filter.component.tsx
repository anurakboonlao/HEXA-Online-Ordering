import React, { FC, useState} from 'react';
import {Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import dayjs from 'dayjs';


import CustomDatePicker from './date-picker.component';
import { DatePeriodOptionEnum, FIRST_DATE } from '../../constants/constant';


import calendarIcon from '../../assets/svg/calendar.svg';


interface IDatePeriodFilterProps {
    defaultSelectedOption?: string;
    fromDate:Date;
    toDate:Date;
    setFromDate: (selectDate: Date) => void;
    setToDate: (selectDate: Date) => void;
    tooltip?:string;
};

const DatePeriodFilter: FC<IDatePeriodFilterProps> = ({fromDate,toDate,setFromDate,setToDate, defaultSelectedOption = DatePeriodOptionEnum.Today, tooltip}) => {
    const [selectedOption, setSelectedOption] = useState(defaultSelectedOption);
    const [showMainMenu, setShowMainMenu] = useState(false);

    const onSelectedOption = (value:string) =>
    {      
        const today: Date = new Date();
        let tempStartDate :Date =  fromDate;       
        let tempEndDate :Date =  toDate;
        switch (value)        {
            case DatePeriodOptionEnum.All:
                tempStartDate = FIRST_DATE;
                tempEndDate = today;
                break;
            case DatePeriodOptionEnum.Last30Days:
                tempStartDate = (dayjs(today).add(-30,'day')).toDate();
                tempEndDate = today;
                break;
            case DatePeriodOptionEnum.Last7Days:
                tempStartDate = (dayjs(today).add(-7,'day')).toDate();
                tempEndDate = today;
                break;
            case DatePeriodOptionEnum.PreviousMonth:
                let month: number = today.getMonth() -1;
                let year: number = today.getFullYear();
                if(month === 0){
                    month = 12;
                    year --;
                }
                tempStartDate = new Date(year,month,1);
                tempEndDate = new Date(year,today.getMonth(),0);
                break;
            case DatePeriodOptionEnum.ThisMonth:
                tempStartDate = new Date(today.getFullYear(),today.getMonth(),1);
                tempEndDate = new Date(today.getFullYear(),today.getMonth()+1,0);
                break;
            case DatePeriodOptionEnum.Today:
                tempStartDate = tempEndDate = today;
                break;
            case DatePeriodOptionEnum.Yesterday:
                tempStartDate = tempEndDate = (dayjs(today).add(-1,'day')).toDate();
                break;
        }
   
        setFromDate(new Date(tempStartDate.getFullYear(),tempStartDate.getMonth(),tempStartDate.getDate(),0,0,0));
        setToDate(new Date(tempEndDate.getFullYear(),tempEndDate.getMonth(),tempEndDate.getDate(),23,59,59));
        setSelectedOption(value as DatePeriodOptionEnum);
    };

    const selectFromDate = (value:Date) =>
    {
        setSelectedOption(DatePeriodOptionEnum.CustomRange);
        setFromDate(value);
    }

    const selectToDate = (value:Date) =>
    {
        setSelectedOption(DatePeriodOptionEnum.CustomRange);
        setToDate(value);
    }

    const customMainTogle = (isOpen:boolean,event: React.SyntheticEvent<Dropdown>, metadata: {
        source: 'select' | 'click' | 'rootClose' | 'keydown';}) => {
            if(metadata.source === 'select' ){
                setShowMainMenu(true);
            }
            else
                setShowMainMenu(isOpen);
    }

    const optionDropDownItem = () => {
        return (
            <>
                {Object.values(DatePeriodOptionEnum).map((value, index) => (
                    <Dropdown.Item eventKey={value} key={index} className="date-period-filter__select-item" onSelect={() => onSelectedOption(value)}>
                        <span>{value}</span>
                    </Dropdown.Item>
                ))}
            </>
        );
    }

    return (
       
            <Dropdown className="date-period-filter__dropdown" show={showMainMenu} onToggle={customMainTogle}>
                 <OverlayTrigger
                    placement="top"
                    delay={{ show: 0, hide: 100 }}
                    overlay={
                        tooltip ? (<Tooltip id="tooltip-date-filter">{tooltip}</Tooltip>) : <span></span>
                }>
                    <Dropdown.Toggle className="date-period-filter__main-btn" variant="" id="dropdown-date-period">
                        <SVG src={calendarIcon} className="date-period-filter__main-icon" width="16" height="16"></SVG>
                        <span>{dayjs(fromDate).format('DD-MM-YYYY')} - {dayjs(toDate).format('DD-MM-YYYY')}</span>
                    </Dropdown.Toggle>
                </OverlayTrigger>
                <Dropdown.Menu className="date-period-filter__period-menu"   >
                    <div className="date-period-filter__menu-box">
                        <div className="date-period-filter__select row">
                            <Dropdown className="date-period-filter__select-ddl col-12 col-sm-6">
                                <Dropdown.Toggle className="date-period-filter__select-btn" variant="" id="dropdown-option">
                                    {selectedOption}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="date-period-filter__select-menu">
                                    {optionDropDownItem()}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="date-period-filter__date row">
                            <div className="col-12 col-sm-6">
                                <div className="date-period-filter__label">From</div>
                                <CustomDatePicker setDate={selectFromDate} selectDate={fromDate} showTimeSelect={false}/>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="date-period-filter__label">To</div>
                                <CustomDatePicker setDate={selectToDate} selectDate={toDate} showTimeSelect={false}/>
                            </div>
                        </div>
                    </div>
                </Dropdown.Menu>
            </Dropdown>
    );
}

export default DatePeriodFilter;
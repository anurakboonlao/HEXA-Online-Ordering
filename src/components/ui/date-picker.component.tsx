import { FC } from 'react';
import SVG from 'react-inlinesvg';
import DatePicker from "react-datepicker";


import calendarIcon from '../../assets/svg/calendar.svg';
import timeIcon from '../../assets/svg/time-icon.svg';

interface IDatePickerProps {
    setDate: (selectDate: Date) => void;
    selectDate?: Date;
    showTimeSelect?: boolean
    disabled?: boolean;
    minDate?: Date|undefined;
    maxDate?: Date|undefined;
};

const CustomDatePicker: FC<IDatePickerProps> = ({ setDate, selectDate, showTimeSelect = true, disabled = false, minDate,maxDate }) => {
    const onDateChange = (date: Date | [Date, Date] | null) => {
        if (date)
            setDate(date as Date);
    }

    return (
        <div className={disabled?"date-picker__group disabled":"date-picker__group"}>
            <SVG src={calendarIcon} className="date-picker__icon" width="25" height="25"></SVG>
            <DatePicker className="date-picker__input"
            showTimeSelect={showTimeSelect}
            showTimeSelectOnly={false}
            selected={selectDate}
            onChange={(date) => onDateChange(date)}
            disabled={disabled}
            minDate = {minDate}
            maxDate = {maxDate}
            dateFormat={showTimeSelect?"dd-MM-yyyy hh:mm aa": "dd-MM-yyyy"} ></DatePicker>
        </div>
    );

}

export default CustomDatePicker;
import { FC } from 'react';
import { Form } from 'react-bootstrap';
import SVG from 'react-inlinesvg';

import arrowLeftIcon from '../../assets/svg/arrowLeft2.svg';

interface ITextInputCaseProps {
    inputText: string;
    onInputChange: (text: string) => void;
    placeholder: string;
    onBackClick: () => void;
    readOnly: boolean;
}

const TextInputCase: FC<ITextInputCaseProps> = ({ inputText, onInputChange, placeholder, onBackClick, readOnly }) => {

    return (
        <div className="text-input-case__main">
            <SVG src={arrowLeftIcon} className="text-input-case__back" onClick={() => onBackClick()}></SVG>
            <div className="text-input-case__input-wrapper position-relative">
                <Form.Control type="text" className="text-input-case__input" placeholder={placeholder} value={inputText} onChange={e => onInputChange(e.target.value)} readOnly={readOnly} />
                {/* {readOnly ? <></> : <SVG src={editIcon} className="text-input-case__edit" onClick={() => onBackClick()}></SVG>} */}
            </div>
        </div>
    );
};

export default TextInputCase;


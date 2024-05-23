import React, { useState } from 'react';
import { Image, Form } from 'react-bootstrap';

import eyeOff from '../../assets/svg/visibility_off.svg';
import eye from '../../assets/svg/visibility.svg';

interface IPasswordProps {
    id: string,
    labelText: any,
    placeholder?: string,
    setPasswordText: (inputString: string) => void,
    passwordText?: string,
    className?: string
}

const Password: React.FC<IPasswordProps> = ({ id, labelText, placeholder, setPasswordText, passwordText,className }) => {
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const toggleVisibility = () => {
        setPasswordVisibility(!passwordVisibility);
    };

    return (
        <Form.Group controlId={id}>
            { labelText && <Form.Label>{labelText}</Form.Label>}
            <div className="position-relative">
                <Form.Control type={passwordVisibility ? "text" : "password"} placeholder={placeholder} className={className?className:""} value={passwordText} onChange={e => setPasswordText(e.target.value)}></Form.Control>
                <div onClick={toggleVisibility} className="password-eye"><Image src={passwordVisibility ? eye : eyeOff} width="20px" ></Image ></div>
            </div>

        </Form.Group>
    );
}

export default Password;

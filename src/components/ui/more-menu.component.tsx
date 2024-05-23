import { FC, useState, useRef } from 'react';
import { Overlay } from 'react-bootstrap';
import SVG from 'react-inlinesvg';

import { IMoreMenu } from '../../redux/type';

import moreIcon from '../../assets/svg/more-icon.svg';

interface IMoreMenuProps {
    menuList: IMoreMenu[]
}

const MoreMenu: FC<IMoreMenuProps> = ({menuList}) => {
    const [show, setShow] = useState(false);
    const target = useRef(null);

    const renderMenuItem = () => {
        return (
            <div>
                {menuList.map((i,index) => { return(
                    <div className={'moreMenuItem ' + (i.className??'') } key={index} onClick={() => {setShow(false); i.onClicked(i.params);}}>
                        {i.displayText}
                    </div>
                )})}
            </div>
        );
    }

    return (
        <div>
            <div ref={target} onClick={() => setShow(!show)}>
                <SVG src={moreIcon} width="24" height="24" className="svg-click"></SVG>
            </div>
            
            <Overlay 
                target={target.current} 
                rootClose={true} 
                show={show} 
                placement="bottom-end"
                onHide={()=>{setShow(false)}}
            >
                {({ placement, arrowProps, show: _show, popper, ...props }) => (
                <div
                    className="moreMenuPanel"
                    {...props}
                >
                    {renderMenuItem()}
                </div>
                )}
            </Overlay>
        </div>
    );
}

export default MoreMenu;
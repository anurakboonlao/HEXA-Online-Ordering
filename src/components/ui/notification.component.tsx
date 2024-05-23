import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { Dropdown, DropdownButton, Row, Col } from 'react-bootstrap';
import SVG from 'react-inlinesvg';


import { receiveNotification } from '../../redux/domains/Notification';


import bellIcon from '../../assets/svg/bell.svg';
import bellWhiteIcon from '../../assets/svg/bell-white.svg';
import React from 'react';

interface INotificationProps {
    show : boolean
    notificationList: receiveNotification[];
    totalNotifications : number;
    onClickNotification: (notiId:number) => void
    onClickViewOlderNoti: (amountOfExpand:number) => void
    unReadCount:number
};

const NotificationBox: FC<INotificationProps> = ({show = true, notificationList = [], onClickNotification, unReadCount=0, totalNotifications, onClickViewOlderNoti}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [amountOfExpanded, setAmountOfExpanded] = useState(0);
    const hasNoti:boolean = notificationList.some(noti => !noti.read);

    return (
        <>
            {
                show && (<>
                        <DropdownButton 
                        className={'dropdown-notification ml-3 '+ (hasNoti? 'fill-noti' : 'empty-noti' )} 
                        variant=""
                        title={
                            <>
                                <SVG src={(hasNoti && !showDropdown) ? bellWhiteIcon : bellIcon}
                                width="16"
                                height="19.5"
                                className={ (hasNoti && !showDropdown)? 'bell-icon' : 'bell-icon-fill'}> 
                                </SVG>
                                {
                                hasNoti && <span className="position-absolute top-0 start-100 translate-middle rounded-pill noti-badge">
                                    {unReadCount > 9? '9+' : unReadCount}
                                </span>
                                }
                            </>
                        }
                        onToggle={() => setShowDropdown(!showDropdown)}
                        show={showDropdown}
                        >
                                    <Dropdown.Header className="mb-2">
                                        Notification
                                    </Dropdown.Header>
                                    {
                                        notificationList.length>0 ? (notificationList.map((notification,index) => {
                                            return (<Dropdown.Item className="mb-3" key={index}>
                                                <Row onClick={ (event:React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                                                        !notification.read && onClickNotification(notification.id);
                                                        event.stopPropagation();
                                                     }}>
                                                    <Col md={12}>
                                                        <div
                                                            className={'dropdown-notification-menu__title ' + (notification.read ? 'disable' : '')}>
                                                            {notification.message}
                                                        </div>
                                                    </Col>
                                                    <Col md={12}>
                                                        <div
                                                            className={'dropdown-notification-menu__time ' + (notification.read ? 'disable' : '')}>
                                                            {/* TODO: Now hard code th */}
                                                            {dayjs(notification.lastUpdateDate).format('DD-MM-YYYY h:mm A')}
                                                        </div>
                                                    </Col>
                                                    <div className={'dropdown-notification__dot ' + (notification.read ? 'disable' : '')} />
                                                </Row>
                                            </Dropdown.Item>);
                                        }))
                                    : ( <p className="text-center mt-3">no notification</p>) 
                                    }
                                    { notificationList.length < totalNotifications && <Dropdown.Item className="">
                                        <Row className="justify-content-center" onClick={ (event:React.MouseEvent<HTMLSpanElement, MouseEvent>) => {   
                                            onClickViewOlderNoti(amountOfExpanded+1);
                                            setAmountOfExpanded(amountOfExpanded+1);
                                            event.stopPropagation();
                                        }}>
                                            <span>View Older</span>
                                        </Row>
                                    </Dropdown.Item>}
                                    
                                </DropdownButton>
                </> )
            }
        </>
    );

}

export default NotificationBox;
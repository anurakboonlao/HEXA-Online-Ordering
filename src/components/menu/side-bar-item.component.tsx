import { FC } from 'react';
import { Nav } from 'react-bootstrap';
import SVG from 'react-inlinesvg';

import { PermissionResultEnum, SideMenuOption, SIDE_MENU } from '../../constants/constant';
import { history } from '../../utils/history';

interface IHexaMenuItemProps {
    selectedMenu: SideMenuOption;
    userRole: number;
    checkLeavePageFunction?: (path:string) => void;
}

const HexaMenuItem: FC<IHexaMenuItemProps> = ({ selectedMenu, userRole,checkLeavePageFunction }) => {

    const checkRolePermission = ( userRolePermission :number ) => {
    
        return SIDE_MENU.filter(menu => (menu.permission & userRolePermission) !== PermissionResultEnum.Denied);
    };

    const linkAction = (path:string) =>{
        if(checkLeavePageFunction){
            checkLeavePageFunction(path);
        }
        else{
            history.push(path);
        }
    }
    
    return (
        <>
            {
             checkRolePermission(userRole).map((item, index) => {
                return(
                <Nav.Item key={index} className={"col-12" + (selectedMenu === item.menuId ? " selected" : "")}>
                    <Nav.Link
                       // as={Link}
                        //to={item.path}
                        eventKey={item.menuId}
                        className="p-0"
                        onClick={() => linkAction(item.path)}
                    >
                        <SVG src={item.logo} width="18" height="18" className="side__item-image"></SVG>
                        <span className="side__item-text">  {item.name} </span>
                    </Nav.Link>
                </Nav.Item>
                )
            })
            }
        </>
    );
}
export default HexaMenuItem;
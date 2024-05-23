import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';
import { GlobalState } from '../redux/reducers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toast } from 'react-toastify';

import PageHeader from '../components/page-header.component';
import SideBarContainer from '../components/menu/side-bar.component';
import { SideMenuOption } from '../constants/constant';
import { userManagement, roleDDL } from '../constants/userManagement';
import ConfirmModal from '../components/ui/confirm-modal.component';

import plusIcon from '../assets/svg/plus.svg';
import deleteIcon from '../assets/svg/delete-icon.svg';
import editIcon from '../assets/svg/edit-icon.svg';
import { getUserList,addUser,editUser,deleteUser } from '../redux/actions/admin.actions';
import { ICallbackResult } from '../redux/type';

import i18n from 'i18next';
import { IRoleManagement } from '../constants/roleManagement';

interface IUserManagementError {
    name: string,
    username: string,
    password: string,
    confirmPassword: string
}

interface IUserManagementPageStateProps {
    userManagementData: userManagement,
    isEditMode: boolean,
    showModal: boolean,
    validated: boolean,
    userManagementOriginal: userManagement,
    errors: IUserManagementError,
    firstSubmit: boolean,
    showConfirmModal: boolean,   
    showDeleteConfirmModal: boolean,
}

const initUserManagementState: userManagement = {
    userId: 0,
    username: "",
    password: "",
    name: "",
    userRoleId: 0,
    role: "",
    confirmPassword: "",
}

const initUserManagementError: IUserManagementError = {
    username: "",
    password: "",
    name: "",
    confirmPassword: ""
}

interface IUserManagementProps {
    userRolePermission: number;
    userManagementList: userManagement[];
    userManagementLoading: boolean;
    getUserManagementListResult: ICallbackResult;

    userManagementAdding: boolean;
    addUserManagementResult: ICallbackResult;

    userManagementEditing: boolean;
    editUserManagementResult: ICallbackResult;

    userManagementdeleting: boolean;
    deleteUserManagementResult: ICallbackResult;
    roleManagement: IRoleManagement[]

}

interface IUserManagementDispatchProps {
    getUserList : typeof getUserList;
    addUser : typeof addUser;
    editUser : typeof editUser;
    deleteUser : typeof deleteUser;
}

class UserManagementPage extends React.Component<IUserManagementProps & IUserManagementDispatchProps, IUserManagementPageStateProps> {
    
    constructor(porps: any) {
        super(porps);
        this.state = {
            isEditMode: false,
            showModal: false,
            validated: false,
            firstSubmit: true,
            userManagementData: initUserManagementState,
            userManagementOriginal: initUserManagementState,
            errors: initUserManagementError,
            showConfirmModal: false,
            showDeleteConfirmModal: false,
        };
    }

    columns: ColumnDescription[] = [{
        dataField: 'username',
        text: i18n.t("USERNAME"),
        headerClasses: 'table-header-column text-left',
        classes: 'table-column',
        align: 'left'
    }, {
        dataField: 'name',
        text: i18n.t("NAME"),
        headerClasses: 'table-header-column text-left',
        classes: 'table-column',
        align: 'left'
    }, {
        dataField: 'role',
        text: i18n.t("ROLE"),
        headerClasses: 'table-header-column text-left',
        classes: 'table-column',
        align: 'left'
    }, {
        dataField: '',
        text: '',
        headerClasses: 'table-header-column',
        headerStyle: { width: '100px' },
        formatter: (cell: any, row: userManagement, rowIndex: number, formatExtraData: any) => {
            return (
                <ul className="table-btn-column">
                    <li> <SVG src={editIcon} width="16" height="16" className="svg-click" onClick={() => this.editUserClick(row)}></SVG></li>
                    <li> <SVG src={deleteIcon} width="16" height="16" className="svg-click" onClick={() => this.deleteUserClick(row)}></SVG></li>
                </ul>
            )
        },
        align: 'right'
    }
    ];

    componentDidUpdate(prevProps: IUserManagementProps , prevState: IUserManagementPageStateProps) {
      
        if(prevProps.userManagementAdding === true && this.props.userManagementAdding === false){
            if(this.props.addUserManagementResult.success){
                //add success
                toast.success(i18n.t("COMPLETED_SAVE"));
                this.closeEditModal();
                this.props.getUserList();
            }
            else{
                toast.error(this.props.addUserManagementResult.message);
            }
        }

        if(prevProps.userManagementEditing === true && this.props.userManagementEditing === false){
            if(this.props.editUserManagementResult.success){
                //add success
                toast.success(i18n.t("COMPLETED_SAVE"));
                this.closeEditModal();
                this.props.getUserList();
            }
            else{
                toast.error(this.props.editUserManagementResult.message);
            }
        }

        if(prevProps.userManagementdeleting === true && this.props.userManagementdeleting === false){
            if(this.props.deleteUserManagementResult.success){
                toast.success(i18n.t("COMPLETED_REMOVE_USER"));
                this.closeDeleteConfirmModal();
                this.props.getUserList();
            }
            else{
                toast.error(this.props.deleteUserManagementResult.message);
                this.closeDeleteConfirmModal();
            }
        }
    }

    checkDirty = () =>{
        const { userManagementData, userManagementOriginal } = this.state;
        return (userManagementData.name !== userManagementOriginal.name || userManagementData.username !== userManagementOriginal.username || userManagementData.userRoleId !== userManagementOriginal.userRoleId || userManagementData.password !== userManagementOriginal.password);
    }

    closeChange = () => {       
        if (this.checkDirty()) {
            this.setState({ showConfirmModal: true });
        }
        else {
            this.setState({ showModal: false });
        }
    };
 
    closeEditModal = () => {
        this.setState({ showModal: false, showConfirmModal: false });
    }

    closeConfirmModal = () => {
        this.setState({ showConfirmModal: false });
    }

    deleteUserClick = (data: userManagement) => {
        this.setState({ showDeleteConfirmModal: true ,userManagementData: data});
    }

    closeDeleteConfirmModal = () => {
        
        this.setState({ showDeleteConfirmModal: false, userManagementData:initUserManagementState });
    }

    deleteUserConfirmText = (data: userManagement) => {

        if(data && !!data.name){
            return(
                 <div>
                     {i18n.t("CONFIRM_DELETE")} "{data.name}"?
                 </div>
                );
        }
        else
        {
            return(
                <div>
                    {i18n.t("CONFIRM_DELETE_THIS_USER")}
                </div>
               );
        }

    }

    deleteUser = () => {
        this.props.deleteUser(this.state.userManagementData?this.state.userManagementData.userId:0);
    }

    
    onSaveUser = () => {
        if (!this.validateInput()) {
            // event.preventDefault();
            // event.stopPropagation();
        }
        else{
            const { userManagementData, isEditMode } = this.state;
            if(isEditMode){
                // Edit User
                let password:string = '';
                let confirmPassword:string = '';
                if(userManagementData.password && userManagementData.password.trim() !== ''){
                    password = userManagementData.password.trim();
                    confirmPassword = userManagementData.confirmPassword.trim();
                }

                this.props.editUser(userManagementData);
            }
            else{
                // Add User
                this.props.addUser(userManagementData);
            }
        }
    };

    validateInput = () => {
        const { userManagementData } = this.state;
        let error: IUserManagementError = {
            username: '',
            password: '',
            name: '',
            confirmPassword: ''
        }
        if(userManagementData.userRoleId === 0){
            if(this.props.roleManagement.length > 0){
                let idDefault = this.props.roleManagement[0].id;
                if(idDefault){
                    this.setState({
                        userManagementData: { ...this.state.userManagementData, userRoleId: idDefault }
                    });
                }
            }
        }

        error.name = this.validateName(userManagementData.name);
        error.username = this.validateUsername(userManagementData.username);
        error.password = this.validatePassword(userManagementData.password);
        error.confirmPassword = this.validateConfirmPassword(userManagementData.password, userManagementData.confirmPassword);

        this.setState({ errors: error, firstSubmit: false });
        return (!error.name && !error.username && !error.password && !error.confirmPassword);
    }

    validateName = (name: string) => {
        if (name.trim() === '') {
            return i18n.t("REQUIRED_FIELD_NAME");
        }
        else {
            return '';
        }
    }
    validateUsername = (username: string) => {
        if (username.trim() === '') {
            return i18n.t("REQUIRED_FIELD_USERNAME");
        }
        else if (username.trim().length < 4) {
            return i18n.t("LESS_USERNAME_LENGTH");
        }   
        else {
            return '';
        }
    }
    validatePassword = (password: string) => {
        if(this.state.isEditMode){
            if (password && password.trim() !== '' && password.trim().length < 8) {
                return i18n.t("LESS_PASSWORD_LENGTH");
            }
            else{
                return '';
            }
        }
        else{
            if (password.trim() === '') {
                return i18n.t("REQUIRED_PASSWORD_FIELD");
            }
            else if (password.trim().length < 8) {
                return i18n.t("LESS_PASSWORD_LENGTH");
            }
            else {
                return '';
            }
        }
    }
    validateConfirmPassword = (password: string, confirmPassword: string) => {
        if (password && password.trim() !== confirmPassword.trim()) {
            return i18n.t("MISMATCH_PASSWORD");
        }
        else {
            return '';
        }
    }
    addUseClick = () => {
        this.setState({
            showModal: true,
            isEditMode: false,
            userManagementData: initUserManagementState,
            userManagementOriginal: initUserManagementState,
            errors: initUserManagementError,
            firstSubmit: true
        });
    }

    editUserClick = (data: userManagement) => {
        this.setState({
            showModal: true,
            isEditMode: true,
            userManagementData: data,
            userManagementOriginal: data,
            errors: initUserManagementError,
            firstSubmit: true
        });
    }


    handleChanged = (value: any, key: string) => {
        if (key === 'name') {
            this.setState({
                errors: { ...this.state.errors, name: this.validateName(value) }
            });
        }
        else if (key === 'username') {
            this.setState({
                errors: { ...this.state.errors, username: this.validateUsername(value) }
            });
        }
        else if (key === 'password') {
            this.setState({
                errors: { ...this.state.errors, password: this.validatePassword(value) }
            });
        }
        else if (key === 'confirmPassword') {
            this.setState({
                errors: { ...this.state.errors, confirmPassword: this.validateConfirmPassword(this.state.userManagementData.password, value) }
            });
        }
        else if (key === 'userRoleId') {
            this.setState({
                userManagementData: { ...this.state.userManagementData, userRoleId: Number(value) }
            });
        }
        this.setState({
            userManagementData: { ...this.state.userManagementData, [key]: value }
        });

    }
    render() {
        
        const { isEditMode, userManagementData, showModal, validated, errors, showConfirmModal, showDeleteConfirmModal } = this.state;
        const { userManagementAdding,userManagementEditing} = this.props;
        const isDirty: boolean = this.checkDirty();
        const isLoading: boolean = userManagementAdding || userManagementEditing;
        return (
            <SideBarContainer selectedMenu={SideMenuOption.UserManagement} userRole={this.props.userRolePermission}>
                <div>
                    <div className="p-3">
                    <PageHeader pageTitle={i18n.t("USER_MANAGEMENT")} displayAction={false} />
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="secondary-btn" onClick={this.addUseClick}>
                                <SVG src={plusIcon} width="12" height="12" className="mr-2"></SVG>
                                <span> {i18n.t("USER_ADD")}</span>
                            </Button>
                        </div>
                        <BootstrapTable
                            keyField="userId"
                            data={this.props.userManagementList}
                            columns={this.columns}
                            classes="table-main"
                            bordered={false}
                            striped                            
                        />
                        <Modal
                            show={showModal}
                            backdrop="static"
                            keyboard={false}
                            className={showModal && showConfirmModal ? "modal__overlay modal__main" : "modal__main"}
                            onHide={this.closeChange}
                            size={'sm'}
                            centered>
                            <Modal.Body>
                                <Modal.Title className="modal__title">{isEditMode ? i18n.t("EDIT_USER") : i18n.t("CREATE_USER")}</Modal.Title>
                                <Form validated={validated}>
                                    <Form.Group>
                                        <Form.Label className="modal__form-label-text">{i18n.t("NAME")}</Form.Label>
                                        <Form.Control isInvalid={!!errors.name} type="text" value={userManagementData.name} onChange={e => this.handleChanged(e.target.value, 'name')} />
                                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="modal__form-label-text">{i18n.t("ROLE")}</Form.Label>
                                        <Form.Control as="select" onChange={e => this.handleChanged(e.target.value, 'userRoleId')} value={userManagementData.userRoleId}>
                                                {
                                                    this.props.roleManagement.map((role) => {
                                                        return <option key={role.id} value={role.id}>{role.name}</option>
                                                    })
                                                }
                                            </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="modal__form-label-text">{i18n.t("USERNAME")}</Form.Label>
                                        <Form.Control isInvalid={!!errors.username} type="text" value={userManagementData.username} onChange={e => this.handleChanged(e.target.value, 'username')} />
                                        <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="modal__form-label-text">{i18n.t("PASSWORD")}</Form.Label>
                                        <Form.Control isInvalid={!!errors.password} type="password" value={userManagementData.password} onChange={e => this.handleChanged(e.target.value, 'password')} />
                                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="modal__form-label-text">{i18n.t("CONFIRM_PASSWORD")}</Form.Label>
                                        <Form.Control isInvalid={!!errors.confirmPassword} type="password" value={userManagementData.confirmPassword} onChange={e => this.handleChanged(e.target.value, 'confirmPassword')} />
                                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="modal__footer-full mb-0">
                                        <Button 
                                        variant="primary" 
                                        className="modal__footer-button modal__btn-margin-right" 
                                        type="button" 
                                        disabled={!isDirty || isLoading} 
                                        onClick={this.onSaveUser}>
                                            {isLoading ? i18n.t("SAVING"): isEditMode ? i18n.t("UPDATE") : i18n.t("CREATE")}
                                            
                                        </Button>
                                        <Button variant="outline-primary" className="modal__footer-button modal__btn-margin-left" onClick={this.closeChange}>
                                            {i18n.t("CANCEL")}
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                        </Modal>
                        <ConfirmModal
                            onCancel={this.closeConfirmModal}
                            onConfirm={this.closeEditModal}
                            showModal={showConfirmModal}
                            bodyText={<span>{i18n.t("CONFIRM_CLOSE_MODAL")}</span>}
                            cancelButton={i18n.t("NO")}
                            confirmButton={i18n.t("DISCARD")}
                            modalTitle={i18n.t("CONFIRMATION")}
                        />

                        <ConfirmModal
                            onCancel={this.closeDeleteConfirmModal}
                            onConfirm={this.deleteUser}
                            showModal={showDeleteConfirmModal}
                            bodyText= {<span>{this.deleteUserConfirmText(userManagementData)}</span>}
                            cancelButton={i18n.t("NO")}
                            confirmButton={i18n.t("DELETE")}
                            modalTitle={i18n.t("DELETE_USER")}
                        />
                    </div>
                </div>
            </SideBarContainer>
            
        )
    }
}

const mapStateToProps = (state: GlobalState) => {
    return {
        userRolePermission: state.User.userRolePermission,
        userManagementList: state.Admin.userManagementList,
        userManagementLoading: state.Admin.userManagementLoading,
        getUserManagementListResult: state.Admin.getUserManagementListResult,
        roleManagement: state.RoleManagement.roleManagement,
        userManagementAdding: state.Admin.userManagementAdding,
        addUserManagementResult: state.Admin.addUserManagementResult,

        userManagementEditing: state.Admin.userManagementEditing,
        editUserManagementResult: state.Admin.editUserManagementResult,

        userManagementdeleting: state.Admin.userManagementdeleting,
        deleteUserManagementResult: state.Admin.deleteUserManagementResult,
    }
};

const mapDispatchToProps = (dispatch: any) => ({
   
    ...bindActionCreators(
        {
            getUserList,
            addUser,
            editUser,
            deleteUser
        },
        dispatch
    ),
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementPage);

import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SVG from 'react-inlinesvg';
import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';

import PageHeader from '../components/page-header.component';
import SideBarContainer from '../components/menu/side-bar.component';
import ConfirmModal from '../components/ui/confirm-modal.component';
import { SideMenuOption } from '../constants/constant';
import { GlobalState } from '../redux/reducers';
import { IAdvertise } from '../redux/domains/Advertise'
import { getAdsList, deleteAds, addAds, editAds, reorderAvertisement } from '../redux/actions/advertise.actions';

import plusIcon from '../assets/svg/plus.svg';
import deleteIcon from '../assets/svg/delete-icon.svg';
import editIcon from '../assets/svg/edit-icon.svg';
import AdvertisementForm from '../components/advertisement/advertisement-form.component';
import upArrow from '../assets/svg/up-arrow.svg';
import downArrow from '../assets/svg/down-arrow.svg';
import i18n from "../i18n";


interface IAdvertiseProps {
    userRolePermission: number;
    loading: boolean;
    advertiseList: IAdvertise[];
    edittingAds: boolean;
    addingAds: boolean;
}

interface IAdvertiseDispatchProps {
    getAdsList: typeof getAdsList;
    deleteAds: typeof deleteAds;
    addAds: typeof addAds;
    editAds: typeof editAds;
    reorderAvertisement: typeof reorderAvertisement;
}

interface IAdvertiseStateProps {
    selectedId: number;
    showModal: boolean;
    displayAdsForm: boolean
    displayAdsMode: 'Create' | 'Update';
    editedAds: IAdvertise;
}

class AdvertiseManagement extends React.Component<IAdvertiseProps & IAdvertiseDispatchProps, IAdvertiseStateProps> {
    constructor(porps: any) {
        super(porps);
        this.state = {
            selectedId: 0,
            showModal: false,
            displayAdsForm: false,
            displayAdsMode: 'Create',
            editedAds: {
                id: 0,
                name: '',
                disabled: false,
                filePath: '',
                orderNumber: 0,
                url: ''
            }
        };
    }

    componentDidUpdate(prevProps: IAdvertiseProps) {
        if(prevProps.addingAds && !this.props.addingAds) {
            this.props.getAdsList();
            this.setState({
                displayAdsForm: false
            })
        }

        if(prevProps.edittingAds && !this.props.edittingAds) {
            this.props.getAdsList();
            this.setState({
                displayAdsForm: false
            })
        }
    }

    columns: ColumnDescription[] = [
        {
            dataField: 'url',
            text: i18n.t('THUMBNAIL'),
            headerClasses: 'table-header-column',
            classes: 'table-column',
            formatter: (cell: any, row: IAdvertise, rowIndex: number, formatExtraData: any) => {
                return (
                    <img src={row.url} style={{ maxWidth: 128 }}></img>
                )
            },
            headerStyle: () => {
                return { width: '200px' };
            }
        },
        {
            dataField: 'name',
            text: i18n.t('NAME'),
            headerClasses: 'table-header-column text-left',
            classes: 'table-column text-left'
        },
        {
            dataField: 'disabled',
            text: i18n.t('STATUS'),
            headerClasses: 'table-header-column',
            classes: 'table-column',
            formatter: (cell: any, row: IAdvertise, rowIndex: number, formatExtraData: any) => {
                return (
                    <div className={row.disabled ? 'text-danger' : 'text-success'}>{row.disabled ? i18n.t("INACTIVE") : i18n.t("ACTIVE")}</div>
                )
            },
            headerStyle: () => {
                return { width: '150px' };
            }
        },
        {
            dataField: 'order',
            text: i18n.t('RECORDER'),
            headerClasses: 'table-header-column',
            classes: 'table-column',
            formatter: (cell: any, row: IAdvertise, rowIndex: number, formatExtraData: any) => {

                return (
                    <div>
                        {
                            rowIndex !== 0 &&
                            <SVG src={upArrow} width="12" height="12" className="svg-click" onClick={() => this.props.reorderAvertisement({
                                avertisementId: row.id,
                                moveUp: true,
                                currentOrder: row.orderNumber
                            })} title={i18n.t("MOVE_UP")}></SVG>
                        }
                        {
                            rowIndex !== this.props.advertiseList.length - 1 &&
                            <SVG src={downArrow} width="12" height="12" className="svg-click ml-2" onClick={() => this.props.reorderAvertisement({
                                avertisementId: row.id,
                                moveUp: false,
                                currentOrder: row.orderNumber
                            })} title={i18n.t("MOVE_DOWN")}></SVG>
                        }
                    </div>
                )
            },
            headerStyle: () => {
                return { width: '150px' };
            }
        },
        {
            dataField: 'custom',
            text: '',
            headerClasses: 'table-header-column',
            headerStyle: { width: '100px' },
            formatter: (cell: any, row: IAdvertise, rowIndex: number, formatExtraData: any) => {
                return (
                    <ul className="table-btn-column">
                        <li> <SVG src={editIcon} width="18" height="18" className="svg-click" onClick={() => this.clickedEdit(row)}></SVG></li>
                        <li> <SVG src={deleteIcon} width="18" height="18" className="svg-click" onClick={() => this.clickedDelete(row)}></SVG></li>
                    </ul>
                )
            },
            align: 'right'
        }
    ];

    clickedAdd = () => {
        this.setState({
            displayAdsForm: true,
            displayAdsMode: i18n.t("CREATE"),
            editedAds: {
                id: 0,
                name: '',
                disabled: false,
                filePath: '',
                orderNumber: 0,
                url: ''
            }
        })
    }

    clickedEdit = (item: IAdvertise) => {
        const adsItem = this.props.advertiseList.find(c => c.id === item.id);
        if (!adsItem)
            return;

        this.setState({
            editedAds: { ...adsItem },
            displayAdsMode: i18n.t('UPDATE'),
            displayAdsForm: true
        })
    }

    clickedDelete = (item: IAdvertise) => {
        this.setState({
            selectedId: item.id,
            showModal: true
        });
    }

    onConfirmDelete = () => {
        if (this.state.selectedId > 0) {
            this.props.deleteAds(this.state.selectedId);
        }
        this.onCancelDelete();
    }

    onCancelDelete = () => {
        this.setState({
            selectedId: 0,
            showModal: false
        });
    }

    renderTable(data: IAdvertise[]) {
        return (
            <BootstrapTable
                key="id"
                keyField="id"
                data={data.sort((a,b) => a.orderNumber - b.orderNumber)}
                columns={this.columns}
                classes="table-main"
                bordered={false}
                striped
            />
        );
    }

    render() {
        const { loading, advertiseList, addAds, editAds } = this.props;
        const { displayAdsForm, displayAdsMode, editedAds } = this.state;

        return (
            <SideBarContainer selectedMenu={SideMenuOption.AdvertiseManagement} userRole={this.props.userRolePermission}>
                <div>                    
                    <div className="p-3">
                    <PageHeader pageTitle={i18n.t("ADVERTISEMENT_MANAGEMENT")} displayAction={false} />
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="secondary-btn" onClick={this.clickedAdd}>
                                <SVG src={plusIcon} width="14" height="14" className="mr-2"></SVG>
                                <span>{i18n.t("ADD")}</span>
                            </Button>
                        </div>
                        {loading ? i18n.t("LOADING") : this.renderTable(advertiseList)}
                    </div>
                </div>
                <ConfirmModal
                    onConfirm={this.onConfirmDelete}
                    onCancel={this.onCancelDelete}
                    showModal={this.state.showModal}
                    bodyText={i18n.t("CONFIRM_DELETE")}
                    modalTitle={i18n.t("CONFIRMATION")}
                />
                <Modal
                    show={displayAdsForm}
                    className={"modal__main"}
                    onHide={() => {
                        this.setState({
                            displayAdsForm: false
                        })
                    }}
                    backdrop="static"
                    size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title className="">{displayAdsMode === i18n.t("CREATE") ? i18n.t("CREATE_ADVERTISEMENT") : i18n.t("EDIT_ADVERTISEMENT")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AdvertisementForm adsItem={editedAds}
                            onCancel={() => {
                                this.setState({
                                    displayAdsForm: false
                                })
                            }}
                            onSubmit={(advertisement: IAdvertise) => {
                                if (displayAdsMode === i18n.t("CREATE")) {
                                    addAds(advertisement);
                                }
                                else {
                                    editAds(advertisement);
                                }
                            }}
                        ></AdvertisementForm>
                    </Modal.Body>
                </Modal>
            </SideBarContainer>
        )
    }
}

const mapStateToProps = (state: GlobalState) => {
    return {
        userRolePermission: state.User.userRolePermission,
        loading: state.Advertise.gettingAdsList,
        advertiseList: state.Advertise.adsList,
        addingAds: state.Advertise.addingAds,
        edittingAds: state.Advertise.edittingAds
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    ...bindActionCreators(
        {
            getAdsList,
            deleteAds,
            addAds,
            editAds,
            reorderAvertisement
        },
        dispatch
    ),
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(AdvertiseManagement);
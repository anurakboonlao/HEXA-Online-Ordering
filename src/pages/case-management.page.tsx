import React from "react";
import { GlobalState } from "../redux/reducers";
import { connect } from "react-redux";
import SVG from "react-inlinesvg";
import { Dropdown, Button, Badge, Navbar, Nav } from "react-bootstrap";
import BootstrapTable, { ColumnDescription } from "react-bootstrap-table-next";
import dayjs from "dayjs";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";
import paginationFactory from "react-bootstrap-table2-paginator";
import { debounce } from "lodash";
import i18n from "../i18n";

import PageHeader from "../components/page-header.component";
import SideBarContainer from "../components/menu/side-bar.component";
import {
  ClientFilterEnum,
  DatePeriodOptionEnum,
  SideMenuOption,
  UserRoleEnum,
} from "../constants/constant";
import SearchBox from "../components/ui/search.component";
import {
  CaseStatusDropDownEnum,
  CaseStatusEnum,
  CaseTypeDropDownEnum,
  OrderTypeEnum,
  ProductDropDownTypeEnum,
  saveDraftCaseDetailModel,
  castProductTypeToId,
} from "../constants/caseManagement";
import DatePeriodFilter from "../components/ui/date-period-filter.component";
import { history } from "../utils/history";
import {
  getCaseList,
  getCase,
  deleteCase,
  saveDraftCase,
  duplicateCase,
} from "../redux/actions/case.actions";
import { caseDisplayModel } from "../redux/domains/CaseManagement";
import ConfirmModal from "../components/ui/confirm-modal.component";

import editIcon from "../assets/svg/edit-icon.svg";
import PATH from "../constants/path";
import { convertCaseTypeTonumber } from "../utils/caseManagementUtils";
import MoreMenu from "../components/ui/more-menu.component";
import { IMoreMenu } from "../redux/type";
import { DEFAULT_PAGESIZE } from "../constants/paging";

type ICaseManagementProps = ReturnType<typeof mapStateToProps>;

interface ICaseManagementDispatchProps {
  getCaseList: typeof getCaseList;
  getCase: typeof getCase;
  deleteCase: typeof deleteCase;
  saveDraftCase: typeof saveDraftCase;
  duplicateCase: typeof duplicateCase;
}

interface ICaseManagementStateProps {
  selectedCriteria: string;
  searchInputText: string;
  fromDate: Date;
  toDate: Date;

  filterCaseList: caseDisplayModel[];
  orderType: OrderTypeEnum;

  showConfirmDeleteCase: boolean;
  deleteDisplayBodyText: string;
  deleteCaseId: number;

  selectedPage: number;
  sortField: string;
  sortOrder: string;
  selectedStatus: CaseStatusDropDownEnum;
  selectedCaseType: CaseTypeDropDownEnum;
  selectedProductType: ProductDropDownTypeEnum;
}

class CaseManagement extends React.Component<
  ICaseManagementProps & ICaseManagementDispatchProps,
  ICaseManagementStateProps
> {
  constructor(porps: any) {
    super(porps);
    this.state = {
      selectedCriteria: ClientFilterEnum.Patient,
      searchInputText: "",
      fromDate: dayjs(new Date()).add(-7, "day").toDate(),
      toDate: new Date(),
      filterCaseList: this.props.caseList,
      orderType: OrderTypeEnum.NewCase,
      selectedStatus: CaseStatusDropDownEnum.All,

      showConfirmDeleteCase: false,
      deleteDisplayBodyText: "",
      deleteCaseId: 0,
      selectedPage: 1,
      sortField: "",
      sortOrder: "",
      selectedCaseType: CaseTypeDropDownEnum.All,
      selectedProductType: ProductDropDownTypeEnum.All,
    };

    this.fetched = debounce(this.fetched, 200);
  }

  fetched: any = () => {
    const state = this.state;
    this.props.getCaseList(
      state.fromDate,
      state.toDate,
      this.props.selectedContactId,
      state.selectedStatus === CaseStatusDropDownEnum.Draft
        ? 1
        : state.selectedStatus === CaseStatusDropDownEnum.Ordered
        ? 2
        : 0,
      state.selectedPage,
      DEFAULT_PAGESIZE,
      state.sortField,
      state.sortOrder,
      state.selectedCriteria,
      state.searchInputText,
      state.selectedCaseType === CaseTypeDropDownEnum.Regular
        ? 1
        : state.selectedCaseType === CaseTypeDropDownEnum.Remake
        ? 2
        : state.selectedCaseType === CaseTypeDropDownEnum.Warranty
        ? 3
        : 0,
        castProductTypeToId(state.selectedProductType)
    );
  };

  columns: ColumnDescription[] = [
    {
      dataField: "status",
      text: i18n.t("STATUS"),
      headerClasses: "table-header-column",
      classes: "table-column",
      formatter: (cell: any, row: caseDisplayModel, rowIndex: number, formatExtraData: any) => {
        return (
          <Badge
            pill
            className={
              row.status === CaseStatusEnum.Ordered
                ? "hexa-badge badge-status-table badge-green"
                : // : row.status === CaseStatusEnum.Ordered ? 'hexa-badge badge-outlined-canceled'
                  // : row.status === CaseStatusEnum.Delayed ? 'hexa-badge badge-outlined-delayed'
                  // : row.status === CaseStatusEnum.Delivered ? 'hexa-badge badge-outlined-delivered'
                  "hexa-badge badge-status-table badge-yellow"
            }
          >
            {row.status}
          </Badge>
        );
      },
    },
    {
      dataField: this.props.userRole === UserRoleEnum.Clinic ? "dentistName" : "clinicName",
      text: this.props.userRole === UserRoleEnum.Clinic ? i18n.t("DENTIST") : i18n.t("CLINIC"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: false,
    },
    {
      dataField: "patientName",
      text: i18n.t("PATIENT"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
    },
    {
      dataField: "productType",
      text: i18n.t("PRODUCT_TYPE"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
    },
    {
      dataField: "caseType",
      text: i18n.t("CASE_TYPE"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
      formatter: (cell: any, row: caseDisplayModel, rowIndex: number, formatExtraData: any) => {
        return <span>{cell && cell === i18n.t("NEW_CASE") ? i18n.t("REGULAR") : cell}</span>;
      },
    },
    {
      dataField: "lastUpdate",
      text: i18n.t("DATE_MODIFIED"),
      headerClasses: "table-header-column text-left",
      classes: "table-column",
      align: "left",
      sort: true,
      formatter: (cell: any, row: caseDisplayModel, rowIndex: number, formatExtraData: any) => {
        return (
          <span>
            {/* TODO: Now hard code th */}
            {dayjs(row.lastUpdate).format("DD-MM-YYYY h:mm A")}
          </span>
        );
      },
    },
    {
      dataField: "",
      text: "",
      headerClasses: "table-header-column",
      headerStyle: { width: "100px" },
      formatter: (cell: any, row: caseDisplayModel, rowIndex: number, formatExtraData: any) => {
        return (
          <ul className="table-btn-column d-flex">
            <li>
              {" "}
              <SVG
                src={editIcon}
                width="16"
                height="16"
                className="svg-click"
                onClick={() => {
                  this.onEditClick(row.caseId);
                }}
              ></SVG>
            </li>
            <li> {this.renderMenuItem(row)}</li>
          </ul>
        );
      },
      align: "left",
    },
  ];

  renderMenuItem = (item: caseDisplayModel) => {
    const menuList: IMoreMenu[] = [
      {
        displayText: i18n.t("DUPLICATE_CASE"),
        params: [item],
        onClicked: (params) => this.onDuplicate(params[0]),
      },
    ];
    if (item.status === CaseStatusEnum.Draft)
      menuList.push({
        displayText: i18n.t("DELETE_CASE"),
        className: "moreMenuItem__delete",
        params: [item],
        onClicked: (params) => this.onDeleteClick(params[0]),
      });
    return <MoreMenu menuList={menuList}></MoreMenu>;
  };

  onEditClick = (caseId: number) => {
    let path: string = PATH.CLIENT.CASE_MANAGEMENT_EDIT_NOTYPE + caseId;
    history.push(path);
  };

  onDeleteClick = (caseDisplay: caseDisplayModel) => {
    let text: string = i18n.t("CONFIRM_DELETE_CASE");
    if (caseDisplay.patientName !== "")
      text = i18n.t("CONFIRM_DELETE") + caseDisplay.patientName + i18n.t("WHOSE_CASE");

    this.setState({
      deleteDisplayBodyText: text,
      showConfirmDeleteCase: true,
      deleteCaseId: caseDisplay?.caseId,
    });
  };

  deleteCase = () => {
    this.props.deleteCase(this.state.deleteCaseId);
  };

  closeDeleteConfirmModal = () => {
    this.setState({ showConfirmDeleteCase: false, deleteDisplayBodyText: "", deleteCaseId: 0 });
  };

  onSelectedCriteria = (value: string) => {
    this.setState({ selectedCriteria: value });
  };

  onSearchKey = (input: string) => {
    this.setState({ searchInputText: input });
  };

  getSelectedCriteriaList = () => {
    let result: { value: string; text: string }[] = [];
    Object.values(ClientFilterEnum).forEach((value) => {
      result.push({ value: value, text: value });
    });
    return result;
  };

  onChangeFromDate = (date: Date) => {
    this.setState({ fromDate: date });
  };

  onChangeToDate = (date: Date) => {
    this.setState({ toDate: date });
  };

  removeCaseOnMemory = (caseId: number) => {
    this.setState({
      filterCaseList: [...this.state.filterCaseList.filter((x) => x.caseId !== caseId)],
    });
  };

  componentDidUpdate(prevProps: ICaseManagementProps, prevState: ICaseManagementStateProps) {
    if (JSON.stringify(prevProps.caseList) !== JSON.stringify(this.props.caseList)) {
      this.setState({ filterCaseList: this.props.caseList });
    }

    if (
      prevState.fromDate !== this.state.fromDate ||
      prevState.toDate !== this.state.toDate ||
      prevState.searchInputText !== this.state.searchInputText ||
      prevState.selectedCriteria !== this.state.selectedCriteria ||
      prevState.selectedStatus !== this.state.selectedStatus ||
      prevProps.selectedContactId !== this.props.selectedContactId ||
      prevState.selectedCaseType !== this.state.selectedCaseType ||
      prevState.selectedProductType !== this.state.selectedProductType
    ) {
      this.setState({ selectedPage: 1 });
      this.fetched();
    } else if (
      prevState.selectedPage !== this.state.selectedPage ||
      prevState.sortField !== this.state.sortField ||
      prevState.sortOrder !== this.state.sortOrder
    ) {
      this.fetched();
    }

    if (prevProps.loadingCaseList === true && this.props.loadingCaseList === false) {
      if (!this.props.caseListResult.success) {
        toast.error(this.props.caseListResult.message);
      }
    }

    if (prevProps.deletingCase === true && this.props.deletingCase === false) {
      if (this.props.deleteCaseResult.success) {
        toast.success(i18n.t("COMPLETED_REMOVE_CASE"));
        this.fetched();
        this.closeDeleteConfirmModal();
      } else {
        toast.error(this.props.deleteCaseResult.message);
        this.closeDeleteConfirmModal();
      }
    }

    if (prevProps.isSavingDraft && !this.props.isSavingDraft) {
      if (this.props.newDraftCaseId > 0) {
        // new draft case success
        const path: string =
          PATH.CLIENT.CASE_MANAGEMENT_EDIT_DELETABLE_NOTYPE + this.props.newDraftCaseId;
        history.push(path);
      } else {
        toast.error(i18n.t("ERROR_CREATE_NEW_CASE"));
      }
    }

    if (prevProps.isDuplicatingCase && !this.props.isDuplicatingCase) {
      if (this.props.duplicateCaseId > 0) {
        // new draft case success
        const path: string =
          PATH.CLIENT.CASE_MANAGEMENT_EDIT_DELETABLE_NOTYPE + this.props.duplicateCaseId;
        history.push(path);
      } else {
        if (!this.props.duplicateCaseResult.success)
          toast.error(this.props.duplicateCaseResult.message);
        else toast.error(i18n.t("DUPLICATE_CASE_ERROR"));
      }
    }
  }

  //loadData = () =>{
  //     let fromDate = new Date(this.state.fromDate.getFullYear(), this.state.fromDate.getMonth(), this.state.fromDate.getDate(), 0, 0, 0);
  //     let toDate = new Date(this.state.toDate.getFullYear(), this.state.toDate.getMonth(), this.state.toDate.getDate(), 23, 59, 59);
  //     this.props.getCaseList(
  //          this.state.fromDate
  //         , this.state.toDate
  //         , this.props.selectedContactId);

  // }
  // filterCase = () => {
  //     let filterCaseList: caseDisplayModel[] = this.props.caseList;

  //     if(this.state.selectedStatus !== CaseStatusDropDownEnum.All){
  //         filterCaseList = filterCaseList.filter(value => value.status === this.state.selectedStatus);
  //     }

  //     if (this.state.searchInputText !== '') {
  //         switch(this.state.selectedCriteria)
  //         {
  //             case ClientFilterEnum.Patient:
  //                 filterCaseList = filterCaseList.filter(value => value.patientName.toLowerCase().includes(this.state.searchInputText.toLowerCase()));
  //                 break;
  //             // case ClientFilterEnum.Clinic:
  //             //     filterCaseList = filterCaseList.filter(value => value.clinicName.toLowerCase().includes(this.state.searchInputText.toLowerCase()));
  //             //     break;
  //             // case ClientFilterEnum.Dentist:
  //             //     filterCaseList = filterCaseList.filter(value => value.dentistName.toLowerCase().includes(this.state.searchInputText.toLowerCase()));
  //             //     break;
  //             default:
  //                 filterCaseList = filterCaseList.filter(value => value.patientName.toLowerCase().includes(this.state.searchInputText.toLowerCase()));
  //         }
  //     }

  //     this.setState({ filterCaseList: filterCaseList });
  // }

  onDuplicate = (caseModel: caseDisplayModel) => {
    if (!this.props.selectedContactId || this.props.selectedContactId < 1) {
      if (this.props.userRole === UserRoleEnum.Clinic) toast.error(i18n.t("PLEASE_SELECT_DENTIST"));
      else toast.error(i18n.t("PLEASE_SELECT_CLINIC"));
    } else {
      this.props.duplicateCase(
        caseModel.caseId,
        parseInt(this.props.userId),
        this.props.userRole === UserRoleEnum.Clinic
          ? this.props.selectedContactId
          : this.props.contactId,
        this.props.userRole === UserRoleEnum.Dentist
          ? this.props.selectedContactId
          : this.props.contactId
      );
    }
  };

  changeOrderType(orderType: OrderTypeEnum) {
    this.setState({ orderType: orderType });
    this.addCase(orderType);
  }

  displayOrderTypeString(orderType: OrderTypeEnum) {
    if (orderType === OrderTypeEnum.NewCase) return i18n.t("NEW_CASE");
    else return orderType;
  }

  addCase = (orderType: OrderTypeEnum) => {
    if (!this.props.selectedContactId || this.props.selectedContactId < 1) {
      if (this.props.userRole === UserRoleEnum.Clinic) toast.error(i18n.t("PLEASE_SELECT_DENTIST"));
      else toast.error(i18n.t("PLEASE_SELECT_CLINIC"));
    } else {
      // Add Draft Case
      const saveCaseDetailModel: saveDraftCaseDetailModel = {
        caseTypeId: convertCaseTypeTonumber(orderType),
        userId: parseInt(this.props.userId),
        dentistId:
          this.props.userRole === UserRoleEnum.Clinic
            ? this.props.selectedContactId
            : this.props.contactId,
        clinicId:
          this.props.userRole === UserRoleEnum.Dentist
            ? this.props.selectedContactId
            : this.props.contactId,
        orderRef: "",
        patientName: "",
      };

      this.props.saveDraftCase(saveCaseDetailModel);
    }
  };

  setSelectStatus = (value: CaseStatusDropDownEnum) => {
    this.setState({ selectedStatus: value });
  };

  setSelectCaseType = (value: CaseTypeDropDownEnum) => {
    this.setState({ selectedCaseType: value });
  };

  setSelectProductType = (value: ProductDropDownTypeEnum) => {
    this.setState({ selectedProductType: value });
  };

  handleTableChange = (type: string, c: any) => {
    let page: number = c.page;
    let sortField: string = c.sortField ?? "";
    let sortOrder: string = c.sortOrder ?? "";
    this.setState({ selectedPage: page, sortField: sortField, sortOrder: sortOrder });
  };

  render() {
    return (
      <SideBarContainer
        selectedMenu={SideMenuOption.CaseManagement}
        userRole={this.props.userRolePermission}
      >
        <div>
          <div className="p-3">
            <PageHeader
              pageTitle={i18n.t("CASE_MANAGEMENT")}
              displayAction={true}
              isDisplayDropdown={true}
            />
            <Navbar className="top-filter__top-menu">
              <Nav className="top-filter__menu">
                <Nav.Item className="top-filter__menu-item">
                  <DatePeriodFilter
                    fromDate={this.state.fromDate}
                    toDate={this.state.toDate}
                    setFromDate={this.onChangeFromDate}
                    setToDate={this.onChangeToDate}
                    defaultSelectedOption={DatePeriodOptionEnum.Last7Days}
                  ></DatePeriodFilter>
                </Nav.Item>

                <Nav.Item className="top-filter__menu-item">
                  <Dropdown className="dropdown-light ">
                    <Dropdown.Toggle className="border-radius-4" variant="" id="casetype-filter">
                      {this.state.selectedProductType}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropdown-light-menu">
                      <Dropdown.Item
                        eventKey={ProductDropDownTypeEnum.All}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => this.setSelectProductType(ProductDropDownTypeEnum.All)}
                      >
                        {ProductDropDownTypeEnum.All}
                      </Dropdown.Item>
                      <Dropdown.Item
                        eventKey={ProductDropDownTypeEnum.CrownAndBridge}
                        className="dropdown-button-dropdown-item"
                        onSelect={() =>
                          this.setSelectProductType(ProductDropDownTypeEnum.CrownAndBridge)
                        }
                      >
                        {ProductDropDownTypeEnum.CrownAndBridge}
                      </Dropdown.Item>
                      <Dropdown.Item
                        eventKey={ProductDropDownTypeEnum.Removable}
                        className="dropdown-button-dropdown-item"
                        onSelect={() =>
                          this.setSelectProductType(ProductDropDownTypeEnum.Removable)
                        }
                      >
                        {ProductDropDownTypeEnum.Removable}
                      </Dropdown.Item>
                      <Dropdown.Item
                        eventKey={ProductDropDownTypeEnum.Orthodontic}
                        className="dropdown-button-dropdown-item"
                        onSelect={() =>
                          this.setSelectProductType(ProductDropDownTypeEnum.Orthodontic)
                        }
                      >
                        {ProductDropDownTypeEnum.Orthodontic}
                      </Dropdown.Item>
                      <Dropdown.Item
                        eventKey={ProductDropDownTypeEnum.Orthopedic}
                        className="dropdown-button-dropdown-item"
                        onSelect={() =>
                          this.setSelectProductType(ProductDropDownTypeEnum.Orthopedic)
                        }
                      >
                        {ProductDropDownTypeEnum.Orthopedic}
                      </Dropdown.Item>

                      <Dropdown.Item
                        eventKey={ProductDropDownTypeEnum.ICharm}
                        className="dropdown-button-dropdown-item"
                        onSelect={() =>
                          this.setSelectProductType(ProductDropDownTypeEnum.ICharm)
                        }
                      >
                        {ProductDropDownTypeEnum.ICharm}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav.Item>

                <Nav.Item className="top-filter__menu-item">
                  <Dropdown className="dropdown-light ">
                    <Dropdown.Toggle className="border-radius-4" variant="" id="casetype-filter">
                      {this.state.selectedCaseType}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropdown-light-menu">
                      <Dropdown.Item
                        eventKey={CaseTypeDropDownEnum.All}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => this.setSelectCaseType(CaseTypeDropDownEnum.All)}
                      >
                        {CaseTypeDropDownEnum.All}
                      </Dropdown.Item>
                      <Dropdown.Item
                        eventKey={CaseTypeDropDownEnum.Regular}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => this.setSelectCaseType(CaseTypeDropDownEnum.Regular)}
                      >
                        {CaseTypeDropDownEnum.Regular}
                      </Dropdown.Item>
                      <Dropdown.Item
                        eventKey={CaseTypeDropDownEnum.Remake}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => this.setSelectCaseType(CaseTypeDropDownEnum.Remake)}
                      >
                        {CaseTypeDropDownEnum.Remake}
                      </Dropdown.Item>
                      <Dropdown.Item
                        eventKey={CaseTypeDropDownEnum.Warranty}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => this.setSelectCaseType(CaseTypeDropDownEnum.Warranty)}
                      >
                        {CaseTypeDropDownEnum.Warranty}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav.Item>

                <Nav.Item className="top-filter__menu-item">
                  <Dropdown className="dropdown-light ">
                    <Dropdown.Toggle className="border-radius-4" variant="" id="status-filter">
                      {this.state.selectedStatus}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropdown-light-menu">
                      <Dropdown.Item
                        eventKey={CaseStatusDropDownEnum.All}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => this.setSelectStatus(CaseStatusDropDownEnum.All)}
                      >
                        {CaseStatusDropDownEnum.All}
                      </Dropdown.Item>
                      <Dropdown.Item
                        eventKey={CaseStatusDropDownEnum.Draft}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => this.setSelectStatus(CaseStatusDropDownEnum.Draft)}
                      >
                        {CaseStatusDropDownEnum.Draft}
                      </Dropdown.Item>
                      <Dropdown.Item
                        eventKey={CaseStatusDropDownEnum.Ordered}
                        className="dropdown-button-dropdown-item"
                        onSelect={() => this.setSelectStatus(CaseStatusDropDownEnum.Ordered)}
                      >
                        {CaseStatusDropDownEnum.Ordered}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav.Item>

                <Nav.Item className="top-filter__menu-item">
                  <SearchBox
                    onSelectedCriteria={this.onSelectedCriteria}
                    onSearchKey={this.onSearchKey}
                    selectedCaption={i18n.t("SEARCHING_CRITERIA")}
                    inputTextPlaceholder={i18n.t("SEARCH")}
                    searchInputText={this.state.searchInputText}
                    selectedCriteria={this.state.selectedCriteria}
                    selectOption={this.getSelectedCriteriaList()}
                  />
                </Nav.Item>
                <Nav.Item className="top-filter__menu-item">
                  <Button
                    className="secondary-btn case-detail__menu_btn"
                    variant="secondary"
                    onClick={() => this.addCase(OrderTypeEnum.NewCase)}
                  >
                    {this.displayOrderTypeString(OrderTypeEnum.NewCase)}
                  </Button>
                </Nav.Item>
              </Nav>
            </Navbar>

            <BootstrapTable
              keyField="caseId"
              data={this.props.caseList}
              columns={this.columns}
              classes="table-main"
              bordered={false}
              striped
              bootstrap4={true}
              remote
              pagination={paginationFactory({
                sizePerPage: DEFAULT_PAGESIZE,
                hideSizePerPage: true,
                hidePageListOnlyOnePage: true,
                totalSize: this.props.totalFilterRow,
                page: this.state.selectedPage,
              })}
              onTableChange={this.handleTableChange}
            />
          </div>
        </div>

        <ConfirmModal
          onCancel={this.closeDeleteConfirmModal}
          onConfirm={this.deleteCase}
          showModal={this.state.showConfirmDeleteCase}
          bodyText={<span>{this.state.deleteDisplayBodyText}</span>}
          cancelButton={i18n.t("NO")}
          confirmButton={i18n.t("DELETE")}
          modalTitle={i18n.t("CONFIRMATION")}
        />
      </SideBarContainer>
    );
  }
}

const mapStateToProps = (state: GlobalState) => {
  return {
    userRolePermission: state.User.userRolePermission,
    userRole: state.User.payload.role as UserRoleEnum,
    userId: state.User.payload.Id,
    caseList: state.Case.caseList as caseDisplayModel[],
    totalFilterRow: state.Case.totalFilterRow,
    loadingCaseList: state.Case.loadingCaseList,
    caseListResult: state.Case.caseListResult,
    deletingCase: state.Case.deletingCase,
    deleteCaseResult: state.Case.deleteCaseResult,

    newDraftCaseId: state.Case.newDraftCaseId,
    isSavingDraft: state.Case.savingDraft,
    contactId: Number(state.User.payload.ContactId),
    selectedContactId: state.User.selectedContactId ? state.User.selectedContactId : 0,

    isDuplicatingCase: state.Case.isDuplicatingCase,
    duplicateCaseId: state.Case.duplicateCaseId,
    duplicateCaseResult: state.Case.duplicateCaseResult,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      getCaseList,
      getCase,
      deleteCase,
      saveDraftCase,
      duplicateCase,
    },
    dispatch
  ),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(CaseManagement);

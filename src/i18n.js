import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translations: {
        ACTIVE: "Active",
        ATTACHMENTS: "Attachments",
        ATTACHED_FILE: "Attached File(s)",
        AND_SHADE_SYSTEM: "and Shade System",
        ASPECT_RATIO: "* The aspect ratio should be 3:1 (900 * 300 pixel)",
        ADD_PRODUCT: "Add Product",
        ACCEPTED: "Accepted",
        AGE: "Age",
        AND_SUBSITUTE_TOOTH: "and Subsitute Tooth",
        PLEASE_FILL_SUBSTITUTION_TOOTH: "Please Fill Substitution Tooth",
        ACCESS_PRODUCT_TYPE: "Access Product Type",
        ADD_TO_FAVORITE: "Add to favorite",
        ADD_TEETH_NUMBER: "Add teeth number",
        ADD_ON: "Add-on",
        ALL_STATUS: "All Status",
        ADVERTISEMENT_MANAGEMENT: "Advertisement Management",
        ADVERTISEMENT: "Advertisement",
        APPLY_FAVORITE: "Apply favorite",
        ARCH_NO: "Arch/No.",
        ALL: "All",
        BACK: "Back",
        BRIDGE_HELPER_TEXT:
          "You can bridge a group of teeth together by clicking on the starting tooth, hold and release on the destination tooth. For example, bridging from tooth #26 to #28 can be done by click-and-hold on tooth #26 and release the mouse click on tooth #28. (Similar to drag and drop)",
        BRIDGE_HEPLER_TEXT_DIFFERENT_GROUP:
          "You should see a toast message indicating that you successfully performed the bridging. The color of the teeth also portrays different bridging groups.",
        BRIDGE_HELPER_TEXT_CLEAR_BRIDGE_GROUP:
          "To clear the bridge group, simply click-and-hold on the group you wish to clear and move the mouse cursor to the trash bin icon then release it.",
        BRIDGE_HELPER_TEXT_FOR_TOUCHABLE_DEVICE:
          "*Please note that dental bridging is currently not supported on touch devices.",
        CHANGE_ICHARM_TO_OTHER:
          "Can not create Icharm order with other products. \nIf you want to create new icharm product, System will clear products you selected.",
        CHANGE_OTHER_TO_ICHARM:
          "Can not create Icharm order with other products. \nIf you want to create another product, System will clear Icharm product you selected.",
        CHOOSE_THE_IMAGE: "Choose the image",
        CLOSE: "Close",
        CREATE: "Create",
        CANCEL: "Cancel",
        CANCEL_ORDER: "Cancel Order",
        CAN_NOT_FIND_PAGE: "Sorry, We couldn’t find the page you are looking for.",
        CAN_NOT_APPLY_FAVORITE: "Can not apply favorite,",
        CREATE_ADVERTISEMENT: "Create Advertisement",
        CLINIC: "Clinic",
        CONFIRM: "Confirm",
        CONFIRMATION: "Confirmation",
        CANCELED: "Canceled",
        CREATE_USER: "Create User",
        CREATE_ROLE: "Create Role",
        EDIT_ROLE: "Edit Role",
        CASE_PRESENTATION_RECEIVED: "Presentation Received",
        CONTACT_US: "Contact Us",
        CLINIC_HOSPITAL: "Clinic/Hospital",
        CREATE_REMAKE_CASE_FROM_ORDER: 'Create "Remake Case" from Order',
        CONFIRM_CLOSE_UNCHANGE: "Closing the dialog will discard all unsaved changes.",
        CONFIRM_CLOSE_UNCHANGE_AND_CLOSE:
          "Are you sure you want to discard all unsaved changes and close the dialog?",
        CONFIRM_CLOSE_MODAL:
          "Closing the dialog will discard all unsaved changes. Are you sure you want to discard all unsaved changes and close the dialog?",
        CONFIRM_DELETE: "Are you sure you want to delete ",
        CONFIRM_DELETE_THIS_USER: "Are you sure you want to delete this user?",
        CONFIRM_DELETE_CASE: "Are you sure you want to delete case?",
        CONFIRM_PASSWORD: "Confirm Password",
        CONFIRM_CANCEL_ORDER: "Are you sure you want to cancel order",
        CONFIRM_TO_START_STEP_2_PRODUCTION: "Confirm to start step 2 production",
        CONFIRM_TO_DELIVER_STEP_2_PRODUCT: "Confirm to deliver step2 product",
        CONFIRM_CASE_PRESENTATION_TO_START_PRODUCTION:
          "Confirm case presentation to start production",
        CONFIRM_DELETE_FAVORITE: "Are you sure to delete favorite?",
        CONFIRM_UPDATE_STATUS: "Confirm to update status? After this action cannot be changed",
        CONFIRM_REJECT_STATUS: "Confirm to reject status? After this action cannot be changed",
        COMPLETED_ORDER: "Order complete",
        COMPLETED: "Completed",
        CUSTOMER_CONFIRM: "Customer Confirmed",
        COMPLETED_SAVE: "Save completed",
        CASE_TYPE: "Case Type",
        CHOOSE_FILE: "Choose File",
        COMPLETED_REMOVE_USER: "Remove user completed",
        COMPLETED_REMOVE_CASE: "Remove case completed",
        CONFIRM_TO_DELIVER_STEP_1_PRODUCT: "Confirm to deliver step1 product",
        CONFIRM_CASE_PRESENTATION_TO_START_STEP_1:
          "Confirm case presentation to start step 1 production",
        CONFIRM_START_STEP_2_PRODUCTION: "Confirm to start step 2 production",
        COMPLETED_ADD_FAVORITE: "Add favorite completed",
        CONFIRM_SEND_NOTIFICATION_TO_CLIENT: "Send Notification to Client?",
        CREATE_WARRANTY_CASE_FROM_ORDER: 'Create "Warranty Case" from Order',
        CASE_MANAGEMENT: "Case Management",
        DATE_MODIFIED: "Date Modified",
        DUPLICATE_CASE: "Duplicate Case",
        DUPLICATE_CASE_ERROR: "Duplicate Case Error",
        DELETE_CASE: "Delete Case",
        DELETE_FAVORITE: "Delete favorite",
        DELETE: "Delete",
        DOWNLOAD: "Download",
        DISCARD: "Discard",
        DELETE_USER: "Delete User",
        DENTAL_BRIDGE: "Dental Bridge",
        DENTIST: "Dentist",
        DENTIST_NAME: "Dentist Name",
        DELIVERED: "Delivered",
        DESIGN: "Design",
        DASHBOARD: "Dashboard",
        EDIT_USER: "Edit User",
        EDIT_ADVERTISEMENT: "Edit Advertisement",
        ERROR_CREATE_NEW_CASE: "Create New Case Error",
        EXPORT: "Export",
        ERROR: "Error",
        EMAIL: "Email",
        ERROR_PRODUCT_ALREADY_ON_BRIDGE:
          "Not possible to remove a product which already belongs to a bridge group. Please remove the bridge first before removing this product.",
        EXPECTED_DELIVERY_DATE: "Expected Delivery Date",
        FILE: "File",
        FROM_ORDER: "From Order",
        FAVORITE: "Favorite",
        FIRST_SET: "1st set",
        SECOND_SET: "2nd set",
        FIRST_SET_START: "Step 1 Started",
        FIRST_SET_DELIVERED: "Products Delivered",
        STEP_1_CAN_START: "Step 1 can now be started.",
        FIRST_SET_CAN_NOW_START: "We can now start production process and delivery",
        FILTER_BY_ORDER_DATE: "Filter by 'Ordered Date",
        FAVORITE_NAME: "Favorite's name",
        FEMALE: "Female",
        FILE_TYPE_NOT_SUPPORT: "File Type Not Support",
        GO_TO_WEBSITE: "Go to Website",
        GO_BACK: "Go Back",
        GENDER: "Gender",
        IN_ORDER_ALREADY_HAVE_PRODUCT:
          "In order to perform dental bridge please ensure that your teeth already have products assigned to them.",
        INACTIVE: "Inactive",
        IN_PROGRESS: "In Progress",
        REQUEST_DELIVERY_DATE: "Requested Due Date T",
        INTERNAL_SERVER_PROBLEM: "Sorry, We're experencing an internal server problem.",
        INPUT_TEETH_NUMBER: "Input Teeth Number",
        INPUT_NUMBER: "Input Number",
        IS_ALREADY_SELECTED: "is already selected",
        INTERACT_AS: "Interact as:",
        LABEL_TITLE: "Add Name in Acrylic Plate",
        LABEL_CROWN_AND_BRIDGE: "Crown & Bridge",
        LABEL_REMOVABLE: "Removable",
        LABEL_ICHARM: "ICharm",
        LABEL_ORTHODONTIC: "Orthodontic",
        LABEL_ORTHOPEDIC: "Orthopedic",
        LABEL_RETAINER: "Retainer",
        LABEL_PASSIVE: "Passive / Active Plate",
        LABEL_FUNCTIONAL: "Functional",
        LABEL_SPACE_MANTINER: "Space Mantainer",
        LABEL_SPLINT_STANT: "Splint / Stant",
        LABEL_MODEL: "Model",
        LABEL_ANTI_SNORING: "Anti Snoring",
        LABEL_OTHER: "Other",
        LINE_WHATSAPP_ID: "Line / Whatsapp ID",
        LEVEL_OF_TREATMENT: "Level of Treatment",
        LESS_USERNAME_LENGTH: "Username must be at least 4 characters",
        LESS_PASSWORD_LENGTH: "Password must be at least 8 characters",
        LOGIN: "Login",
        LOADING: "Loading...",
        LOGOUT: "Log out",
        MALE: "Male",
        MOVE_UP: "Move Up",
        MOVE_DOWN: "Move Down",
        MEMO: "Memo",
        MUST_UPLOAD: "must upload",
        METHOD: "Method",
        MISMATCH_PASSWORD: "Password mismatch",
        MATERIAL: "Material",
        MARK_AS_READ: "mark as read",
        NAME: "Name",
        NO: "No",
        ADMIN_PRESENTATION_SENT: "Presentation sent",
        NEW_ORDER_RECEIVED: "New Order Received",
        NO_FAVORITE_PRODUCT_IS_SELECTED: "No favorite product is selected",
        NOT_POSSIBLE_TO_BRIDGE_FROM_UPPER_TO_LOWER: "Not possible to bridge from upper to lower.",
        NOT_POSSIBLE_TO_BRIDGE_FROM_LOWER_TO_UPPER: "Not possible to bridge from lower to upper.",
        NOT_POSSIBLE_TO_BRIDGE_ACROSS_UNSELECTED_PRODUCTS:
          "Not possible to bridge across unselected products.",
        NOT_POSSIBLE_TO_BRIDGE_AFILTER_BY_ORDER_DATECROSS_MULTIPLE_GROUPS:
          "Not possible to bridge across multiple groups.",
        NOTIFICATION_MESSAGE: "Notification Message",
        NOTE: "Note",
        NEW_CASE: "NEW CASE",
        NEW_CASE_CAPITALIZE: "New Case",
        NAME_IS_REQUIRED: "Name is required.",
        ORDER_SUMMARY: "Order Summary",
        ORDER_OVERVIEW_DETAIL: "Order Overview Detail",
        ORDER_OVERVIEW: "Order Overview",
        ONLINE_ORDERING: "Online Ordering",
        ORDER_ID: "Order ID",
        ORDER_DATE: "Order Date",
        ORDER_LIST: "Order List",
        ORDER_FORM: "Order Form",
        ORDER_STATUS: "Order Status",
        ORDERED_PRODUCT: "Ordered Products",
        ORDER_STEP_ONE_CONFIRM: "Order for Step 1 confirmed",
        ORDER_STEP_ONE_CONFIRM_PROCESS:
          "Order has been confirmed and Step 1 is now being processed. Please wait for the update.",
        ORDER_STEP_ONE_IS_PROCESS: "Step 1 is being processed",
        ORDER_STEP_ONE_IS_PROCESS_DESC:
          "This will take approximately 7 working days including the delivery.",
        ORDER_STEP_ONE_IS_DELIVERED: "Products Delivered",
        ORDER_STEP_ONE_IS_DELIVERED_DESC:
          "Please check for any defects before clicking through to proceed to Step 2 order confirmation.",
        ORDER_STEP_TWO_IS_CONFIRM: "Order for Step 2 confirmed",
        ORDER_STEP_TWO_IS_CONFIRM_DESC:
          "Order has been confirmed and Step 2 is now being processed. Please wait for the update.",
        ORDER_STEP_TWO_IS_DELIVERED: "Products Delivered",
        ORDER_STEP_TWO_IS_DELIVERED_DESC:
          "All products have been delivered. Please check for any defects.",
        ORDER_STEP_TWO_IS_PROCESS: "Step 2 is being processed",
        ORDER_STEP_TWO_IS_PROCESS_DESC:
          "This will take approximately 7 working days including the delivery.",
        ORDERING: "Ordering...",
        ORDER: "Order",
        OK: "Ok",
        OPTIONAL_MAX_5_CHARACTERS: "(optional) maximum 5 characters",
        ORDERED_DATE: "Ordered Date",
        ORDER_REPORT: "Order Report",
        PLEASE_FILL_SHADE: "Please fill shade",
        PLEASE_SELECT_VALID_IMAGE: "Please select valid image.",
        PASSWORD: "Password",
        PLEASE_SELECT_DENTIST: "Please select Dentist",
        PLEASE_ADD_PATIENT_IMAGE: "Please add Patient's Photos",
        PLEASE_ADD_AGE: "please input patient age",
        PLEASE_SELECT_CLINIC: "Please select Clinic",
        PLEASE_INPUT_PATIENT_NAME: "Please input Patient's Name",
        PLEASE_SELECT_PRODUCT: "Please select Product",
        PLEASE_SELECT_METHOD: "Please select Method",
        PHONE_NUMBER: "Phone Number",
        PLEASE_SELECT_EXPECTED_DELIVERYDATE_DATE: "Please select Expected Delivery Date",
        PLEASE_SELECT_ROLE_NAME: "Please enter role name",
        PLEASE_SELECT_PRODUCT_TYPE: "Please select product type",
        PRODUCT_LIST_OF: "Product List of ",
        PLEASE_REVIEW_ORDER_AND_ATTACHMENT:
          "Please review order and attachments prior to proceeding.",
        PLEASE_WAIT_CUSTOMER_REVIEW: "Please wait for customer's confirmation in order to proceed.",
        PENDING: "Pending",
        PRODUCT_TYPE: "Product Type",
        PRODUCT: "Product",
        PRODUCT_FROM_SECOND_SET_HAVE_BEEN_DELIVERED: "Products from Step 2 have been delivered.",
        PATIENT: "Patient",
        PATIENT_NAME: "Patient Name",
        PROCESSING: "Processing",
        PICKUP_DATE: "Pickup Date T",
        PRODUCT_FROM_STEP_1_SEND: "Products from Step 1 have been delivered.",
        PROCESS_PROCESSING: "Processing...",
        PAGE_NOT_FOUND: "PAGE NOT FOUND",
        PATIENT_IMAGE: "Patient's Photos",
        PROGRESS: "Progress",
        REJECT_TO_CONTINUE_STEP_2_PRODUCTION: "Reject to continue step 2 production",
        PLEASE_SPECTIFY: "Please specify",
        PRESENTATION_FILES: "Presentation file(s)",
        PLEASE_REVIEW_CASE_PRESENTATION_AND_ATTACHMENTS_RECEIVED:
          "Please review presentation and attachments received",
        PRICE_LIST: "Pricelist",
        REQUESTED_DUE_DATE: "Requested Due Date",
        REJECT_TO_DELIVER_PRODUCT: "Reject to deliver product",
        REJECT_CASE_PRESENTATION: "Reject case presentation",
        REQUIRED_FIELD_NAME: "Name is a required field",
        REQUIRED_FIELD_USERNAME: "Username is a required field",
        REQUIRED_PASSWORD_FIELD: "Password is a required field",
        REMOVE_BRIDGE_GROUP: "Removed bridge group",
        REJECTED_ORDER: "Rejected Orders",
        REDIRECT_ONLINE_ORDER: "Redirecting to Online Ordering",
        RECORDER: "Reorder",
        ROLE_MANAGEMENT: "Role Management",
        REMOVING: "Removing...",
        REJECT: "Reject",
        REJECTED: "Rejected",
        REMOVE_THIS_CASE: "Remove This Case",
        REMOVE: "Remove",
        REGULAR: "Regular",
        RENAME_FAVORITE: "Rename favorite",
        RETAINER_GALLERY: "Retainer Gallery",
        REMAKE: "Remake",
        ROLE: "Role",
        SELECT_PLATE_COLOR: "Select Plate Color",
        SELECT_QUADRANT: "Select Quadrant",
        SELECT_PLATE_GLITTER_COLOR: "Select Plate Glitter Color",
        SELECT_LABIAL_COLOR: "Select Labial Color",
        SELECT_BUCCAL_COLOR: "Select Buccal Color",
        SELECT_STICKER: "Select Sticker",
        SOMETHING_WENT_WRONG: "Something went wrong.",
        SECOND_SET_CAN_START: "Step 2 can now be started.",
        SECOND_SET_START: "Step 2 Started",
        SECOND_SET_START_DESCRIPTION: "We can now start production process and delivery.",
        SECOND_SET_DELIVERED: "Products Delivered",
        SHADE: "Shade",
        SHADE_SYSTEM: "Shade system",
        SUBSTITUTION_TOOTH: "Substitution Tooth",
        SEND_CASE_PRESENTATION_FILE: "Send case presentation file",
        REJECT_CASE_PRESENTATION_ADMIN: "Reject case",
        REJECT_NOTE: "Reject note",
        REJECT_NOTE_REQUIRED: "Reject note is required",
        SAVING: "Saving...",
        SAVE: "Save",
        STATUS_CODE_404: 404,
        SEARCHING_CRITERIA: "Searching Criteria",
        SUBMIT: "Submit",
        SENDING: "Sending...",
        SEND: "Send",
        STATUS: "Status",
        SEARCH: "Search",
        TYPE: "Type",
        TEXT_SEE_FULL_RETAINER_GALLERY: "see full retainer gallery",
        TOTAL_NUMBER: "Total Number",
        TOTAL_CASE: "Total Case",
        TOTAL_ORDER: "Total Order",
        TO_BRIDGE_GROUP: "to bridge group",
        TEXT_AT_HEXACERAM: "@hexaceram",
        TEXT_HEXACERAM: "Hexa Ceram",
        THUMBNAIL: "Thumbnail",
        USER_ADD: "Add",
        USERNAME: "Username",
        UPLOADING: "Uploading...",
        UPLOAD_IMAGE: "Upload Image",
        UPLOAD_XREY_FILM: "X-Ray films",
        UPDATE: "Update",
        USER_COUNT: "User Count",
        UPLOAD_PATIENT_IMAGE: "Upload patient image",
        UPLOAD_LIMITATION: "(.jpg, .png, .mp4, .avi, .mov, .stl) [Max upload size: 25MB]",
        USER_MANAGEMENT: "User Management",
        UPDATE_DELIVERY_DATE_COMPLETED: "Update Expected Delivery Date completed",
        VIEW_ORDER: "View Order",
        WARRANTY: "Warranty",
        WHOSE_CASE: "'s case?",
        XREY_FILM: "X-Ray films",
        YES: "Yes",
        MODIFY: "Modify",
        MODIFY_NOTE: "Modify Note",
        MODIFY_NOTE_REQUIRED: "Modify Note Required",
        MODIFY_REQUEST_DATEORDER_DATE: "Modify Requested Date",
        MODIFY_HISTORY: "Modify History",
        ID: "Id",
        ALIGNER: "Aligners",
        VIEW: "View",
        MODEFY_HISTORY_ID : "No.",
        ALL_SETS_ORDERED : "All Sets Ordered",
        FIRST_SET_ORDERED : "1st Set Ordered",
        FIRST_SET_DELIVERED_TABLE : "1st Set Delivered",
        ALL_SETS_DELIVERED : "All Sets Delivered",
        FIRST_SET_INSERTED : "1st Set Inserted",
        WAITING_FOR_CONFIRMATION : "Waiting for confirmation",
        ALL_SETS : "All Sets",
        EDIT_LEVEL_OF_TREATMENT : "Edit Level of Treatment ?",
        PLEASE_FILL_OUT_THE_REASON : "Please fill out the reason",
        PLEASE_FILL_OUT_ALIGNERS : "Please fill out aligner",
        CANINE_TO_CANINE : "Canine to Canine",
        PREMOLAR_TO_PREMOLAR : "Premolar to Premolar",
        UPDATE_LEVEL_OF_TREATMENT_SUCCESS : "Update Level of Treatment completed",
        UPDATE_MEMO_COMPLETED : "Update memo completed",
        UPDATE_MEMO_FAIL : "Update memo error",
        PLEASE_SAVE_MEMO_BEFORE_CONTINUE : "Please save memo before continue."
      },
    },
  },
  fallbackLng: "en",
  debug: true,
  ns: ["translations"],
  defaultNS: "translations",
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

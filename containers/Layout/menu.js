import {
  BookFilled,
  BookOutlined,
  CopyFilled,
  FormOutlined,
  MailFilled,
} from "@ant-design/icons";
import BookIcon from "@mui/icons-material/Book";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DynamicFormOutlinedIcon from "@mui/icons-material/DynamicFormOutlined";
import MailIcon from "@mui/icons-material/Mail";

export default [
  {
    key: "/login",
    code: "LO",
  },
  {
    key: "/adminLogin",
    code: "ALO",
  },
  {
    path: "adminLogout",
    code: "ALOU",
  },
  {
    key: "/departmentLogin",
    code: "DLO",
  },
  // {
  //   key: "/timepass",
  //   code: "TP",
  // },
  {
    label: "Dashboard",
    key: "/dashboard",
    // icon: GoogleOutlined,
    code: "DB",

    innerCards: [
      {
        title: "Hawker Management System",
        key: "hawkerManagementSystem",
        content: "Description",
        icon: DynamicFormOutlinedIcon,
        clickTo: "/hawkerManagementSystem",
        code: "HMSZ",
      },
    ],
  },

  {
    label: "Hawker Management System",
    // icon: DynamicFormOutlinedIcon,
    key: "/hawkerManagementSystem",
    code: "HMS",
    innerCards: [
      {
        title: "Masters",
        content: "Description",
        icon: BookIcon,
        clickTo: "/hawkerManagementSystem/masters",
        code: "HMSM",
        breadcrumName: "Hawker Management System / masters",
        childrenCards: [
          {
            title: "Religion",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/religion",
            code: "C-HMSM01",
            breadcrumName: "Hawker Management System / masters / Religion ",
          },
          {
            title: "Hawker Type",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/hawkerType",
            code: "C-HMSM02",
            breadcrumName: "Hawker Management System / masters / Hawker Type ",
          },
          {
            title: "Business Type Master",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/businessTypeMaster",
            code: "C-HMSM03",
            breadcrumName:
              "Hawker Management System / masters / Business Type Master ",
          },
          {
            title: "Business Sub Type",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/businessSubType",
            code: "C-HMSM04",
            breadcrumName:
              "Hawker Management System / masters / Business Sub Type ",
          },
          {
            title: "Title",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/title",
            code: "C-HMSM05",
            breadcrumName: "Hawker Management System / masters / title",
          },
          {
            title: "Item Master",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/itemMaster",
            code: "C-HMSM10",
            breadcrumName: "Hawker Management System / masters / Item Master ",
          },
          {
            title: "Item Category Master",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/itemCategoryMaster",
            code: "C-HMSM11",
            breadcrumName:
              "Hawker Management System / masters / Item Category Master ",
          },
          {
            title: "Cast Category",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/castCategory",
            code: "C-HMSM08",
            breadcrumName: "Hawker Management System / masters / castCategory",
          },
          {
            title: "Cast Master",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/castMaster",
            code: "C-HMSM07",
            breadcrumName: "Hawker Management System / masters / castMaster",
          },

          {
            title: "Hawking Zone",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/hawkingZone",
            code: "C-HMSM06",
            breadcrumName: "Hawker Management System / masters / hawkingZone",
          },

          {
            title: "Sub Cast Master",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/subCastMaster",
            code: "C-HMSM09",
            breadcrumName:
              "Hawker Management System / masters / Sub Cast Master",
          },
          {
            title: "License Validity",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/licenseValidity",
            code: "C-HMSM10",
            breadcrumName:
              "Hawker Management System / masters / License Validity",
          },
          {
            title: "Penalty",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/penalty",
            code: "C-HMSM11",
            breadcrumName: "Hawker Management System / masters / Penalty",
          },
          {
            title: "Bank Master",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/bankMaster",
            code: "C-HMSM12",
            breadcrumName: "Hawker Management System / masters / Bank Master",
          },
          {
            title: "Hawking Zone Wise Facilities",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo:
              "/hawkerManagementSystem/masters/hawkingZoneWiseFacilities",
            code: "C-HMSM13",
            breadcrumName:
              "Hawker Management System / masters / Hawking Zone Wise Facilities",
          },
          {
            title: "Tax Type Master",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/taxTypeMaster",
            code: "C-HMSM14",
            breadcrumName:
              "Hawker Management System / masters / Tax Type Master",
          },
          {
            title: "Tax Name Master",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/taxNameMaster",
            code: "C-HMSM14",
            breadcrumName:
              "Hawker Management System / masters / Tax Name Master",
          },
          {
            title: "Service Tax Collection Cycle",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo:
              "/hawkerManagementSystem/masters/serviceTaxCollectionCycle",
            code: "C-HMSM14",
            breadcrumName:
              "Hawker Management System / masters / service Tax Collection Cycle",
          },
          {
            title: "Tax Rate Chart Master",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/taxRateChartMaster",
            code: "C-HMSM14",
            breadcrumName:
              "Hawker Management System / masters / Tax Rate Chart Master",
          },
          {
            title: "No Hawking Zone",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/masters/noHawkingZone",
            code: "C-HMSM14",
            breadcrumName:
              "Hawker Management System / masters / No Hawking Zone",
          },
        ],
      },

      {
        title: "Transactions",
        content: "Description",
        icon: BookIcon,
        clickTo: "/hawkerManagementSystem/transactions",
        code: "HMST",
        breadcrumName: "Hawker Management System / transactions",
        childrenCards: [
          {
            title: " Isssuance of Hawker License",
            content: "Description",
            icon: BookIcon,
            clickTo:
              "/hawkerManagementSystem/transactions/issuanceOfHawkerLicense",
            code: "C-HMST02",
            breadcrumName: "Hawker Management System / issuanceOfHawkerLicense",
          },

          {
            title: " Site Visit",
            content: "Description",
            icon: BookIcon,
            clickTo: "/hawkerManagementSystem/transactions/siteVisit",
            code: "C-HMST02",
            breadcrumName: "Hawker Management System / siteVisit",
          },

          {
            title: "Task Transfer",
            content: "Description",
            icon: BookIcon,
            clickTo: "/hawkerManagementSystem/transactions/taskTransfer",
            code: "C-HMST01",
            breadcrumName: "Hawker Management System / taskTransfer",
          },
        ],
      },

      {
        title: "Reports",
        content: "Description",
        icon: BookIcon,
        clickTo: "/hawkerManagementSystem/reports",
        code: "HMST",
        breadcrumName: "Hawker Management System / reports",
        childrenCards: [
          {
            title: "Age Proof Document",
            content: "Description",
            icon: BookOutlinedIcon,
            clickTo: "/hawkerManagementSystem/reports/ageProofDocument",
            code: "C-HMST01",
            breadcrumName:
              "Hawker Management System / reports / Age Proof Document",
          },
        ],
      },
    ],
  },
];

export const menuCodes = [
  {
    path: "login",
    code: "LO",
  },
  {
    path: "adminLogin",
    code: "ALO",
  },
  {
    path: "adminLogout",
    code: "ALOU",
  },
  {
    path: "departmentLogin",
    code: "DLO",
  },
  // {
  //   path: "",
  //   code: "HM",
  // },
  // {
  //   path: "dashboard",
  //   code: "M01",
  // },
  {
    path: "/hawkerManagementSystem",
    code: "HMS",
  },
];

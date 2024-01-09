import NextPlanIcon from '@mui/icons-material/NextPlan'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import UndoIcon from '@mui/icons-material/Undo'
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
// import { useSelector } from "react-redux";
// import BasicLayout from "../../../../../../containers/Layout/BasicLayout";
import CancelIcon from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
// import styles from "./deparmentalCleark.module.css";
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation'
import BrushIcon from '@mui/icons-material/Brush'
import CloseIcon from '@mui/icons-material/Close'
import EventIcon from '@mui/icons-material/Event'
import PaidIcon from '@mui/icons-material/Paid'
import SearchIcon from '@mui/icons-material/Search'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import axios from 'axios'
import moment from 'moment'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import styles from '../../../../styles/sportsPortalStyles/clerk.module.css'
import theme from '../../../../theme'
import URLS from '../../../../URLS/urls'
// import LoiGenerationReport from "../../components/LoiGenerationReport";
import AadharAuthentication from '../components/AadharAuthentication'
import BookingDetail from '../components/BookingDetail'
import BookingPersonDetails from '../components/BookingPersonDetails'
import DocumentsUpload from '../components/DocumentsUpload'
import EcsDetails from '../components/EcsDetails'

import { toast, ToastContainer } from 'react-toastify'

// import SiteVisit from "../../components/siteVisit";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
// import LoiGenerationComponent from "../../components/LoiGenerationComponent";
// Main Component - Clerk
const Index = () => {
  const [authority, setAuthority] = useState([])
  const [remark, setRemark] = useState(null)
  const [formPreviewDailog, setFormPreviewDailog] = useState(false)
  const formPreviewDailogOpen = () => setFormPreviewDailog(true)
  const formPreviewDailogClose = () => setFormPreviewDailog(false)
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false)
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true)
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false)
  const [documentRemarkModal, DocumentModal] = useState(false)
  const documentRemarkModalOpen = () => DocumentModal(true)
  const documentRemarkModalClose = () => DocumentModal(false)
  // site visit Modal
  // const [siteVisitModal, setSiteVisitModal] = useState(false);
  // const siteVisitModalOpen = () => setSiteVisitModal(true);
  // const siteVisitModalClose = () => setSiteVisitModal(false);
  // Loi Modal
  const [loiModal, setLoiModal] = useState(false)
  const loiModalOpen = () => setLoiModal(true)
  const loiModalClose = () => setLoiModal(false)
  // loi - Generation
  const [loiGeneration, setLoiGeneration] = useState(false)
  const loiGenerationOpen = () => setLoiGeneration(true)
  const loiGenerationClose = () => setLoiGeneration(false)

  // loi Collection
  const [loiCollection, setLoiCollection] = useState(false)
  const loiCollectionOpen = () => setLoiCollection(true)
  const loiCollectionClose = () => setLoiCollection(false)
  const [modalforAprov, setmodalforAprov] = useState(false)

  // site Visit Dailog
  // const [siteVisitDailog, setSetVisitDailog] = useState();
  // const siteVisitOpen = () => setSetVisitDailog(true);
  // const siteVisitClose = () => setSetVisitDailog(false);

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        console.log('r.roles', r.roles)
        return r
      }
    })?.roles
    console.log('auth0000', auth)
    setAuthority(auth)
  }, [])
  let user = useSelector((state) => state.user.user)
  const router = useRouter()
  const [tableData, setTableData] = useState([])
  const [dataSource, setDataSource] = useState([])
  let selectedMenuFromDrawer = localStorage.getItem('selectedMenuFromDrawer')

  // zones
  const [zoneKeys, setZoneKeys] = useState([])
  // get Zone Keys
  const getZoneKeys = () => {
    axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneKey: row.zoneName,
        })),
      )
    })
  }

  // Ward Keys
  const [wardKeys, setWardKeys] = useState([])
  // get Ward Keys
  const getWardKeys = () => {
    axios.get(`${URLS.CFCURL}/master/ward/getAll`).then((r) => {
      setWardKeys(
        r.data.ward.map((row) => ({
          id: row.id,
          wardKey: row.wardName,
        })),
      )
    })
  }

  // Service name
  const [serviceNames, setServiceNames] = useState([])
  // get Services
  const getServiceNames = () => {
    axios.get(`${URLS.CFCURL}/master/service/getAll`).then((r) => {
      setServiceNames(
        r.data.service.map((row) => ({
          id: row.id,
          serviceName: row.serviceName,
        })),
      )
    })
  }

  // departments name
  const [departments, setDepartments] = useState([])
  // get departments
  const getDepartments = () => {
    axios.get(`${URLS.CFCURL}/master/department/getAll`).then((r) => {
      setDepartments(
        r.data.department.map((row) => ({
          id: row.id,
          department: row.department,
        })),
      )
    })
  }

  const removeLocalStorageItems = () => {
    localStorage.removeItem("issuanceOfHawkerLicenseId");
    localStorage.removeItem("renewalOfHawkerLicenseId");
    localStorage.removeItem("cancellationOfHawkerLicenseId");
    localStorage.removeItem("transferOfHawkerLicenseId");
    localStorage.removeItem("castOtherA");
    localStorage.removeItem("castCategoryOtherA");
    localStorage.removeItem("applicantTypeOtherA");
    localStorage.removeItem("disabledFieldInputState");
    localStorage.removeItem("disablityNameYN");
    localStorage.removeItem("QueryParamsData");
    localStorage.removeItem("issuanceOfHawkerLicenseInputState");
    localStorage.removeItem("applicationRevertedToCititizen");
    localStorage.removeItem("draft");
    localStorage.removeItem("DepartSideEditApplication");
    localStorage.removeItem("oldLicenseYNA");
    localStorage.removeItem("disablityNameYNA");
    localStorage.removeItem("voterNameYNA");
    localStorage.removeItem("sportsBookingAddMemberKey");
    localStorage.removeItem("sportsBookingKey");
    localStorage.removeItem("applicationRevertedToCititizen");
    localStorage.removeItem("draft");
    localStorage.removeItem("issuanceOfHawkerLicenseId");
    localStorage.removeItem("renewalOfHawkerLicenseId");
    localStorage.removeItem("cancellationOfHawkerLicenseId");
    localStorage.removeItem("transferOfHawkerLicenseId");
    localStorage.removeItem("issuanceOfHawkerLicenseInputState");
    localStorage.removeItem("DepartSideEditApplication");
    localStorage.removeItem("oldLicenseYNA");
    localStorage.removeItem("voterNameYNA");
    localStorage.removeItem("sportsBookingAddMemberKey");
    localStorage.removeItem("sportsBookingKey");
    localStorage.removeItem("castOtherA");
    localStorage.removeItem("castCategoryOtherA");
    localStorage.removeItem("applicantTypeOtherA");
    localStorage.removeItem("disabledFieldInputState");
    localStorage.removeItem("disablityNameYN");
    localStorage.removeItem("QueryParamsData");
    localStorage.removeItem("disablityNameYNA");
    localStorage.removeItem("GroundBookingId");
    localStorage.removeItem("disabledFieldInputState");
    localStorage.removeItem("propertyRegistractionId");
  }

  // Use Effect
  useEffect(() => {
    getWardKeys()
    getZoneKeys()
    getServiceNames()
    getDepartments()
    getFacilityTypes()
    removeLocalStorageItems();
  }, [])

  const rows1 = [
    {
      id: 1,
      srNO: 1,
      documentName: 'Aadhaar Card',
    },
    {
      id: 2,
      srNO: 1,
      documentName: 'Aadhaar Card',
    },
  ]

  const columns1 = [
    {
      field: 'srNO',
      headerName: 'Sr.No',
      widht: 50,
      align: 'center',
    },
    {
      field: 'documentName',
      headerName: 'Document Name',
      width: 500,
      align: 'center',
    },
    {
      field: 'actions',
      headerName: 'viewButton',
      width: 150,
      align: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <strong>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  console.log('Yetoy Ka')
                    ; <a
                      href={`${URLS.CFCURL}/file/preview?filePath=${getValues(
                        'aadhaarCardPhoto',
                      )}`}
                      target="__blank"
                    ></a>
                }}
              >
                View
              </Button>
            </strong>
          </>
        )
      },
    },
  ]

  // Methods in useForm
  const methods = useForm({
    defaultValues: {
      serviceName: '',
      formPreviewDailogState: false,
      applicationNumber: 'HMS089734584837',
      applicationDate: moment(Date.now()).format('YYYY-MM-DD'),
      trackingID: '46454565454445',
      citySurveyNo: '',
      hawkingZoneName: '',
      title: '',
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      religion: '',
      cast: '',
      subCast: '',
      dateOfBirth: null,
      age: '',
      disbality: '',
      typeOfDisability: '',
      mobile: '',
      emailAddress: '',
      crCitySurveyNumber: '',
      crAreaName: '',
      crLandmarkName: '',
      crVillageName: '',
      crCityName: 'Pimpri-Chinchwad',
      crState: 'Maharashtra',
      crPincode: '',
      crLattitude: '',
      crLogitude: '',
      addressCheckBox: '',
      prCitySurveyNumber: '',
      prAreaName: '',
      prLandmarkName: '',
      prVillageName: '',
      prCityName: 'Pimpri-Chinchwad',
      prState: 'Maharashtra',
      prPincode: '',
      prLattitude: '',
      prLogitude: '',
      wardNo: '',
      wardName: '',
      natureOfBusiness: '',
      hawkingDurationDaily: '',
      hawkerType: '',
      item: '',
      periodOfResidenceInMaharashtra: null,
      periodOfResidenceInPCMC: null,
      rationCardNo: '',
      bankMaster: '',
      branchName: '',
      bankAccountNo: '',
      ifscCode: '',
      crPropertyTaxNumber: '',
      proprtyAmount: '',
      crWaterConsumerNo: '',
      waterAmount: '',
      inputState: true,
      serviceName: '',
    },
    mode: 'onChange',
    criteriaMode: 'all',
    // resolver: yupResolver(Schema),
  })

  // destructure values from methods
  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods

  setValue('inputState', true)

  // site visit preview
  // const siteVisitPreview = () => {
  //   siteVisitOpen();
  //   siteVisitModalClose();
  // };
  // // loi Generation
  const loiGenerationFun = () => {
    // <loiIntegration />;
    loiGenerationOpen()
    loiModalClose()
  }

  // // loi Generation
  const loiCollectionFun = () => {
    loiCollectionOpen()
    loiModalClose()
  }

  // Application Form Preview
  const ApplicationFormPreview = (props) => {
    reset(props)

    return (
      <>
        <Grid
          container
          alignItems="center"
          justify="center"
          style={{ minWidth: '500px' }}
        >
          <Grid xs="auto">
            <Button
              type="button"
              onClick={() => {
                setDocumentPreviewDialog(true)
              }}
              color="primary"
              variant="contained"
            >
              Preview Application Form
            </Button>
          </Grid>
          <br />
          <br />
        </Grid>

        <></>
      </>
    )
  }

  // Site Visit Form Preview
  // const SiteVisitFormPreview = (props) => {
  //   reset(props);
  //   siteVisitModalOpen(record);
  // };

  // Save Remark
  const viewDocumentPreviewSaveRemark = () => {
    documentRemarkModalClose()
    viewDocumentRemarkSuccessNotify()
  }

  // Filter Data on Find Button
  const mrFilterTableData = () => {
    // Approved Application Count
    const tempData = dataSource.filter((data, index) => {
      return data.wardKey == getValues('wardKey')
    })
    console.log('tempData', tempData)
    setTableData(tempData)
  }

  // Reset Data on Reset Button
  const resetFilterData = () => {
    alert('ok')
  }

  // Approved Application
  // const clerkTabClick = (props) => {
  //   const tableData = dataSource.filter((data, index) => {
  //     if (data.applicationVerficationStatus == props) {
  //       return data;
  //     } else if ("TotalApplications" == props) {
  //       return data;
  //     }
  //   });
  //   setTableData(tableData);
  // };

  const onSubmitForm = () => { }

  // useEffect(() => {
  //   clerkTabClick("TotalApplications");
  // }, [dataSource]);

  // Record Count State
  const [pendingApplication, setPendingApplication] = useState(0)
  const [rejectedApplication, setRejectedApplication] = useState(0)
  const [approvedApplication, setApprovedApplication] = useState(0)
  const [totalApplication, setTotalApplication] = useState(0)
  const [facilityTypess, setFacilityTypess] = useState([])

  // getFacility Type
  const getFacilityTypes = () => {
    axios.get(`${URLS.SPURL}/facilityType/getAll`).then((r) => {
      console.log('facility types are:', r.data.facilityType)
      setFacilityTypess(r.data.facilityType)
      setFacilityTypess(
        r.data.facilityType.map((row) => ({
          id: row.id,
          facilityType: row.facilityType,
        })),
      )
    })
  }

  // Get Table - Data
  const getGroundBooking = () => {
    axios.get(`${URLS.SPURL}/groundBooking/getAll`).then((resp) => {
      console.log('Ground data', resp)
      console.log('response Data', JSON.stringify(resp.data.groundBooking))
      // dispach(addAllNewMarriageRegistraction(resp.data.groundBooking));

      let _data = resp.data.groundBooking

      setTableData(
        _data.map((val) => {
          return {
            id: val.id,
            ...val,
            facilityType: facilityTypess.find(
              (obj) => obj?.id == val.facilityType,
            )?.facilityType,
          }
        }),
      )

      setDataSource(resp.data.groundBooking)
      // setTableData(resp.data.groundBooking);
      reset(resp.data.groundBooking)
      // Approved Application Count
      // const approvedApplicationCount = resp.data.filter((data, index) => {
      //   return data.applicationVerficationStatus == "APPROVED";
      // });
      // setApprovedApplication(approvedApplicationCount.length);

      // Pending Application
      // const pendingApplicationCount = resp.data.filter((data, index) => {
      //   return data.applicationVerficationStatus == "PENDING";
      // });
      // setPendingApplication(pendingApplicationCount.length);

      // Rejected  Application
      // const rejectedApplicationCount = resp.data.filter((data, index) => {
      //   return data.applicationVerficationStatus == "REJECTED";
      // });
      // setRejectedApplication(rejectedApplicationCount.length);

      // Total  Application
      // const totalApplicationCount = resp.data.filter((data, index) => {
      //   return data.applicationVerficationStatus;
      // });
      // setTotalApplication(totalApplicationCount.length);
    })
  }

  useEffect(() => {
    getGroundBooking()
  }, [facilityTypess])

  // view
  const viewRecord = (record) => {
    const record1 = { ...record }
    ApplicationFormPreview(record1)
    formPreviewDailogOpen()
    // setFormDailogState(true);
    // setValue("formPreviewDailogState", true);
  }

  // view
  const viewRecord1 = (record) => {
    const record1 = { ...record }
    ApplicationFormPreview(record1)
    documentPreviewDailogOpen()
    // setValue("formPreviewDailogState", true);
  }

  // Site Visit
  // const siteVisit = (record) => {
  //   const record2 = { ...record };
  //   reset(record2);
  //   siteVisitModalOpen();
  // };

  // Loi Modal
  const loiModalFun = (record) => {
    const record3 = { ...record }
    reset(record3)
    loiModalOpen()
  }

  const sendApprovedNotify = () => {
    toast.success('Approved Successfully !!!', {
      position: toast.POSITION.TOP_RIGHT,
    })
  }

  const viewDocumentRemarkSuccessNotify = () => {
    toast.success('Application Reverted !!!', {
      position: toast.POSITION.TOP_RIGHT,
    })
  }

  // Revert Button
  const revertButton = () => {
    documentPreviewDailogClose()
    documentRemarkModalOpen()
  }

  // Approve Button
  const approveButton = () => {
    documentPreviewDailogClose()
    sendApprovedNotify()
  }

  // Columns
  const columns = [
    // {
    //   field: "id",
    //   headerName: "Sr No",
    //   description: "Serial Number",
    //   width: 30,
    // },
    {
      field: 'bookingRegistrationId',
      headerName: 'Application No.',
      // description: "Application Number",
      width: 180,
      // flex: 1,
    },
    {
      field: 'applicationDate',
      headerName: 'Application Date',
      description: 'Application Date',
      width: 120,
      // flex: 1,
    },
    {
      field: 'firstName',
      headerName: 'Name',
      width: 180,
    },
    {
      field: 'facilityType',
      headerName: 'Service Name',
      width: 180,
    },
    {
      field: 'applicationStatus',
      headerName: 'Status',
      width: 180,
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 180,
    // },

    // {
    //   field: "gFName",
    //   headerName: "Applicant Name",
    //   description: "Applicant Name",
    //   width: 100,
    //   // flex: 1,
    // },
    // {
    //   field: "departments",
    //   headerName: "Department Name",
    //   description: "Department Name",
    //   width: 120,
    //   // flex: 1,
    // // },
    // {
    //   field: "serviceName",
    //   headerName: "Service Name",
    //   description: "Service Name",
    //   width: 120,
    //   // flex: 1,
    // },
    // {
    //   field: "applicationVerficationStatus",
    //   headerName: "Status",
    //   headerName: "Status",
    //   width: 100,
    //   // flex: 1,
    // },

    // All buttons

    // {
    //   field: "actions",
    //   description: "Actions",
    //   headerName: <FormattedLabel id="actions" />,
    //   // flex: 1,
    //   width: 800,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (record) => {
    //     return (
    //       <>
    //         <IconButton onClick={() => viewRecord(record.row)}>
    //           <Button endIcon={<VisibilityIcon />} size="small">
    //             View Form
    //           </Button>
    //           {/* <VisibilityIcon /> */}
    //         </IconButton>

    //         <IconButton
    //         // onClick={() => viewRecord(record.row)}
    //         >
    //           <Button
    //             endIcon={<VisibilityIcon />}
    //             size="small"
    //             onClick={() => viewRecord1(record.row)}
    //           >
    //             View Document
    //           </Button>
    //           {/* <VisibilityIcon /> */}
    //         </IconButton>

    //         {/* <IconButton
    //         onClick={() => viewRecord(record.row)}
    //         >
    //           <Button size="small" onClick={() => siteVisit(record.row)}>
    //             Site Visit
    //           </Button>
    //           <VisibilityIcon />
    //         </IconButton> */}

    //         <IconButton
    //         // onClick={() => viewRecord(record.row)}
    //         >
    //           <Button size="small" onClick={() => loiModalFun(record.row)}>
    //             LOI
    //           </Button>
    //           {/* <VisibilityIcon /> */}
    //         </IconButton>

    //         {/* <IconButton
    //         onClick={() => viewRecord(record.row)}
    //         >
    //           <Button size="small">DR Letter</Button>
    //           <VisibilityIcon />
    //         </IconButton> */}
    //         <IconButton
    //         // onClick={() => viewRecord(record.row)}
    //         >
    //           <Button size="small">Collection</Button>
    //           {/* <VisibilityIcon /> */}
    //         </IconButton>
    //         <IconButton
    //         // onClick={() => viewRecord(record.row)}
    //         >
    //           <Button size="small">Approval</Button>
    //           {/* <VisibilityIcon /> */}
    //         </IconButton>
    //       </>
    //     );
    //   },
    // },
    {
      field: 'actions',
      headerName: <FormattedLabel id="actions" />,
      width: 280,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <div className={styles.buttonRow}>
              {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
                (authority?.includes('VERIFICATION') ||
                  authority?.includes('ADMIN')) && (
                  <IconButton
                    onClick={() => viewRecord(record.row)}
                  // router.push({
                  //   // pathname:
                  //   //   "/sportsPortal/transaction/components/DocumentUpload",
                  //   query: {
                  //     disabled: true,
                  //     // id:record.row.id,
                  //     // serviceId:record.row.serviceId,
                  //     ...record.row,
                  //     role: "VERIFICATION",
                  //     pageMode: "VERIFICATION",
                  //     // pageModeMr: "कागदपत्र तपासणी",
                  //   },
                  // })
                  >
                    <Button
                      style={{
                        height: '30px',
                        width: '250px',
                      }}
                      variant="contained"
                      color="primary"
                      onClick={() => viewRecord(record.row)}
                    >
                      VERIFICATION
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus ===
                'APPLICATION_SENT_TO_SR_CLERK' &&
                (authority?.includes('APPOINTMENT_SCHEDULE') ||
                  authority?.includes('ADMIN')) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<EventIcon />}
                      style={{
                        height: '30px',
                        width: '250px',
                      }}
                      onClick={() =>
                        router.push({
                          pathname: `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/slot`,
                          query: {
                            appId: record.row.id,
                            role: 'APPOINTMENT_SCHEDULE',
                          },
                        })
                      }
                    >
                      Schedule
                    </Button>
                  </IconButton>
                )}
              {record?.row?.applicationStatus === 'APPOINTMENT_SCHEDULED' &&
                authority?.find(
                  (r) => r === 'DOCUMENT_VERIFICATION' || r === 'ADMIN',
                ) && (
                  <>
                    <IconButton>
                      <Button
                        variant="contained"
                        endIcon={<CheckIcon />}
                        style={{
                          height: '30px',
                          width: '250px',
                        }}
                        onClick={() =>
                          router.push({
                            // pathname: "scrutiny/scrutiny",
                            query: {
                              ...record.row,
                              role: 'DOCUMENT_VERIFICATION',
                              pageMode: 'APPLICATION VERIFICATION',
                              pageModeMr: 'अर्ज पडताळणी',
                            },
                          })
                        }
                      >
                        Verify
                      </Button>
                    </IconButton>
                  </>
                )}

              {record?.row?.applicationStatus === 'APPLICATION_SENT_TO_CMO' &&
                authority?.find(
                  (r) => r === 'FINAL_APPROVAL' || r === 'ADMIN',
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<CheckIcon />}
                      style={{
                        height: '30px',
                        width: '250px',
                      }}
                      onClick={() =>
                        router.push({
                          // pathname: "scrutiny/scrutiny",
                          query: {
                            ...record.row,
                            role: 'FINAL_APPROVAL',
                            pageMode: 'FINAL VERIFICATION',
                            pageModeMr: 'अंतिम पडताळणी',
                          },
                        })
                      }
                    >
                      CMO VERIFY
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === 'CMO_APPROVED' &&
                authority?.find(
                  (r) => r === 'LOI_GENERATION' || r === 'ADMIN',
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<BrushIcon />}
                      style={{
                        height: '30px',
                        width: '250px',
                      }}
                      //  color="success"
                      onClick={() => viewLOI(record.row)}
                    >
                      GENERATE LOI
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === 'LOI_GENERATED' &&
                authority?.find((r) => r === 'CASHIER' || r === 'ADMIN') && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<PaidIcon />}
                      style={{
                        height: '30px',
                        width: '250px',
                      }}
                      color="success"
                      onClick={() =>
                        router.push({
                          // pathname: "scrutiny/PaymentCollection",
                          query: {
                            ...record.row,
                            role: 'CASHIER',
                          },
                        })
                      }
                    >
                      Collect Payment
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
                authority?.find(
                  (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: 'px',
                        width: '250px',
                      }}
                      color="success"
                      onClick={() => issueCertificate(record.row)}
                    >
                      GENERATE CERTIFICATE
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === 'CERTIFICATE_ISSUED' &&
                authority?.find(
                  (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: 'px',
                        width: '250px',
                      }}
                      color="success"
                      onClick={() => issueCertificate(record.row)}
                    >
                      DOWNLOAD CERTIFICATE
                    </Button>
                  </IconButton>
                )}
            </div>
          </>
        )
      },
    },
  ]

  // view
  return (
    <div>
      <ToastContainer />
      <Paper
        elevation={5}
        sx={{
          marginLeft: '10px',
          marginRight: '10px',
          padding: 1,
          paddingLeft: '20px',
          backgroundColor: '#F5F5F5',
        }}
      // component={Box}
      // squar='true'
      // m={1}
      // pt={2}
      // pb={2}
      // pr={2}
      // pl={4}
      >
        {/** DashBoard Header */}
        <Grid container>
          {/** Clerk */}
          <Grid item xs={4}>
            <Paper
              sx={{ height: '160px' }}
              component={Box}
              p={2}
              m={2}
              squar="true"
              elevation={5}
            >
              <Typography variant="h6">
                <strong>WelCome </strong>
              </Typography>

              <Typography variant="h6" style={{ justifyContent: 'center' }}>
                <strong>User's Name</strong>
              </Typography>
              <Typography variant="subtitle">
                <strong>User's Designation </strong>
              </Typography>
              <br />
            </Paper>
          </Grid>
          {/** Applicatins Tabs */}
          <Grid item xs={8}>
            <Paper
              sx={{ height: '160px' }}
              component={Box}
              p={2}
              m={2}
              squar="true"
              elevation={5}
            // sx={{ align: "center" }}
            >
              <div className={styles.test}>
                {/** Total Application */}
                <div
                  className={styles.one}
                  onClick={() => clerkTabClick('TotalApplications')}
                >
                  <div className={styles.icono}>
                    <BabyChangingStationIcon color="primary" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">Total Application</strong>
                  </div>
                  <Typography variant="h6" align="center" color="primary">
                    {totalApplication}
                  </Typography>
                </div>

                {/** Vertical Line */}
                <div className={styles.jugaad}></div>

                {/** Approved Application */}
                <div
                  className={styles.one}
                  onClick={() => clerkTabClick('APPROVED')}
                >
                  <div className={styles.icono}>
                    <ThumbUpAltIcon color="success" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">Approved Application</strong>
                  </div>
                  <Typography variant="h6" align="center" color="green">
                    {approvedApplication}
                  </Typography>
                </div>

                {/** Vertical Line */}
                <div className={styles.jugaad}></div>

                {/** Pending Applications */}
                <div
                  className={styles.one}
                  onClick={() => clerkTabClick('PENDING')}
                >
                  <div className={styles.icono}>
                    <PendingActionsIcon color="warning" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center"> Pending Application</strong>
                  </div>
                  <Typography variant="h6" align="center" color="orange">
                    {pendingApplication}
                  </Typography>
                </div>

                {/** Vertical Line */}
                <div className={styles.jugaad}></div>

                {/** Rejected Application */}
                <div
                  className={styles.one}
                  onClick={() => clerkTabClick('REJECTED')}
                >
                  <div className={styles.icono}>
                    <CancelIcon color="error" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">Rejected Application</strong>
                  </div>
                  <Typography variant="h6" align="center" color="error">
                    {rejectedApplication}
                  </Typography>
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>

        <ThemeProvider theme={theme}>
          <FormProvider {...methods}>
            {/* <form onSubmit={handleSubmit(onSubmitForm)}>
              {/** Filters */}
            <div className={styles.gridCenter}>
              <Grid
                container
                component={Paper}
                squar="true"
                elevation={5}
                m={2}
                p={2}
              >
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{
                      backgroundColor: '#0084ff',
                      color: 'white',
                      fontSize: 19,
                      // marginTop: 30,
                      // marginBottom: 30,
                      padding: 8,
                      paddingLeft: 10,
                      marginLeft: '10px',
                      marginRight: '45px',
                      borderRadius: 100,
                    }}
                  >
                    Filters
                  </Grid>
                </Grid>
                <Grid container ml={2}>
                  <Grid itemxs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl
                      variant="standard"
                      sx={{ marginTop: 2 }}
                      error={!!errors.serviceName}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Service Name
                        {/* <FormattedLabel id="serviceName" /> */}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Service Name *"
                            sx={{ width: '38vw' }}
                          >
                            {serviceNames &&
                              serviceNames.map((serviceName, index) => (
                                <MenuItem key={index} value={serviceName.id}>
                                  {serviceName.serviceName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="serviceName"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.serviceName
                          ? errors.serviceName.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <FormControl
                      variant="standard"
                      sx={{ marginTop: 2 }}
                      error={!!errors.zoneKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="zone" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            //sx={{ width: 230 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Zone Name *"
                          >
                            {zoneKeys &&
                              zoneKeys.map((zoneKey, index) => (
                                <MenuItem key={index} value={zoneKey.id}>
                                  {zoneKey.zoneKey}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="zoneKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.zoneKey ? errors.zoneKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <FormControl
                      variant="standard"
                      sx={{ marginTop: 2 }}
                      error={!!errors.wardKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="ward" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Ward Name *"
                          >
                            {wardKeys &&
                              wardKeys.map((wardKey, index) => (
                                <MenuItem key={index} value={wardKey.id}>
                                  {wardKey.wardKey}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="wardKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.wardKey ? errors.wardKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <FormControl variant="standard">
                      <InputLabel htmlFor="standard-adornment">
                        Application Number
                      </InputLabel>
                      <Input
                        id="standard-adornment"
                        {...register('applicantNumber')}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton>
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <FormControl variant="standard">
                      <InputLabel htmlFor="standard-adornment">
                        Applicant Name
                      </InputLabel>
                      <Input
                        id="standard-adornment"
                        {...register('applicantName')}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton>
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    {' '}
                    <FormControl
                      sx={{ marginTop: 0 }}
                      error={!!errors.fromDate}
                    >
                      <Controller
                        name="fromDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16, marginTop: 2 }}>
                                  From Date
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  InputLabelProps={{
                                    style: {
                                      fontSize: 12,
                                      marginTop: 3,
                                    },
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.fromDate ? errors.fromDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <FormControl sx={{ marginTop: 0 }} error={!!errors.toDate}>
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16, marginTop: 2 }}>
                                  To Date
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  InputLabelProps={{
                                    style: {
                                      fontSize: 12,
                                      marginTop: 3,
                                    },
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.toDate ? errors.toDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container ml={2}>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Button
                      sx={{
                        marginTop: '5vh',
                        margin: 'normal',
                        width: 230,
                        size: 'medium',
                      }}
                      onClick={() => {
                        mrFilterTableData()
                      }}
                    >
                      Find
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Button
                      sx={{
                        marginTop: '5vh',
                        margin: 'normal',
                        width: 230,
                        size: 'medium',
                      }}
                      variant="contained"
                      onClick={() => {
                        resetFilterData()
                      }}
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </div>
            {/** Table */}
            <DataGrid
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  // quickFilterProps: { debounceMs: 100 },
                  // printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  // csvOptions: { disableToolbarButton: true },
                },
              }}
              components={{ Toolbar: GridToolbar }}
              sx={{
                backgroundColor: 'white',
                m: 2,
                overflowY: 'scroll',
                '& .MuiDataGrid-columnHeadersInner': {
                  backgroundColor: '#0084ff',
                  color: 'white',
                },
                '& .MuiDataGrid-cell:hover': {
                  color: 'primary.main',
                },
              }}
              density="density"
              autoHeight
              rows={tableData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
            {/** Form Preview Dailog */}

            <Dialog
              fullWidth
              maxWidth={'lg'}
              open={formPreviewDailog}
              onClose={() => formPreviewDailogClose()}
            >
              <CssBaseline />
              <DialogTitle>
                <Grid container>
                  <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                    Preview
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sm={2}
                    md={4}
                    lg={6}
                    xl={6}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <IconButton
                      aria-label="delete"
                      sx={{
                        marginLeft: '530px',
                        backgroundColor: 'primary',
                        ':hover': {
                          bgcolor: 'red', // theme.palette.primary.main
                          color: 'white',
                        },
                      }}
                    >
                      <CloseIcon
                        sx={{
                          color: 'black',
                        }}
                        onClick={() => {
                          formPreviewDailogClose()
                        }}
                      />
                    </IconButton>
                  </Grid>
                </Grid>
              </DialogTitle>
              <DialogContent>
                <BookingDetail />
                <BookingPersonDetails />
                <AadharAuthentication />
                <EcsDetails />
                <DocumentsUpload />
              </DialogContent>

              <DialogTitle>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Button onClick={formPreviewDailogClose}>Close</Button>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Button
                    variant="contained"
                    endIcon={<NextPlanIcon />}
                    color="success"
                    onClick={() => {
                      setmodalforAprov(true)
                    }}
                  >
                    Action
                  </Button>
                </Grid>
              </DialogTitle>
            </Dialog>

            {/** Document Preview Dailog */}
            <Dialog
              fullWidth
              maxWidth={'lg'}
              open={documentPreviewDialog}
              onClose={() => documentPreviewDailogClose()}
            >
              <Paper sx={{ p: 2 }}>
                <CssBaseline />
                <DialogTitle>
                  <Grid container>
                    <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                      Preview
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <IconButton
                        aria-label="delete"
                        sx={{
                          marginLeft: '530px',
                          backgroundColor: 'primary',
                          ':hover': {
                            bgcolor: 'red', // theme.palette.primary.main
                            color: 'white',
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{
                            color: 'black',
                          }}
                          onClick={() => {
                            documentPreviewDailogClose()
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle>

                <DataGrid
                  autoHeight
                  rows={rows1}
                  columns={columns1}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  density="standard"
                  sx={{
                    m: 5,
                    overflowY: 'scroll',
                    '& .MuiDataGrid-cell:hover': {
                      color: 'primary.main',
                    },
                    '& .mui-style-f3jnds-MuiDataGrid-columnHeaders': {
                      backgroundColor: '#556CD6',
                      color: 'white',
                    },
                  }}
                />
                <Grid container>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <Button onClick={approveButton}>Approve</Button>
                      <Button onClick={revertButton}>Revert</Button>
                    </Stack>
                  </Grid>
                </Grid>
                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button onClick={documentPreviewDailogClose}>Exit</Button>
                  </Grid>
                </DialogTitle>
              </Paper>
            </Dialog>

            {/** Revert Remark Modal Preview Dailog */}
            <Modal
              open={documentRemarkModal}
              onClose={() => documentRemarkModalClose()}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 5,
              }}
            >
              <Paper
                sx={{
                  backgroundColor: '#F5F5F5',
                  padding: 2,
                  height: '400px',
                  width: '600px',
                  // display: "flex",
                  // alignItems: "center",
                  // justifyContent: "center",
                }}
                elevation={5}
                component={Box}
              >
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <h1 id="parent-modal-description"> Remark</h1>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextareaAutosize
                      style={{
                        width: '550px',
                        height: '200px',
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Button onClick={viewDocumentPreviewSaveRemark}>
                      Revert Application
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button onClick={documentRemarkModalClose}>Exit</Button>
                  </Grid>
                </Grid>
              </Paper>
            </Modal>

            {/** Site Visit Modal */}
            {/* <Modal
                open={siteVisitModal}
                onClose={siteVisitModalClose}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 5,
                }}
              >
                <Paper
                  sx={{
                    padding: 2,
                    height: "200px",
                    width: "500px",
                  }}
                  elevation={5}
                  component={Box}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{
                        backgroundColor: "#0084ff",
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <h3
                        id="parent-modal-description"
                        style={{ color: "white" }}
                      >
                        Site Visit
                      </h3>
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: "#0084ff",
                        color: "white",
                      }}
                    ></Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{
                        mt: "30px",
                        mb: "30px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Stack direction="row" spacing={4}>
                        <Button>Schedule Site Visit</Button>
                        <Button onClick={siteVisitPreview}>Site Visit</Button>
                      </Stack>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button size="small" onClick={siteVisitModalClose}>
                        Exit
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Modal> */}

            {/** LOI Modal */}
            <Modal
              open={loiModal}
              onClose={loiModalClose}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 5,
              }}
            >
              <Paper
                sx={{
                  padding: 2,
                  height: '200px',
                  width: '500px',
                }}
                elevation={5}
                component={Box}
              >
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: '#0084ff',
                    }}
                  >
                    <h3
                      id="parent-modal-description"
                      style={{ color: 'white' }}
                    >
                      LOI
                    </h3>
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sm={2}
                    md={4}
                    lg={6}
                    xl={6}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: '#0084ff',
                      color: 'white',
                    }}
                  ></Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{
                      mt: '30px',
                      mb: '30px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Stack direction="row" spacing={4}>
                      <Button
                        onClick={() => {
                          loiGenerationFun()
                        }}
                      >
                        LOI Generation
                      </Button>
                      <Button
                        onClick={() => {
                          loiCollectionFun()
                        }}
                      >
                        LOI Collection
                      </Button>
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button size="small" onClick={loiModalClose}>
                      Exit
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Modal>

            {/** Site Visit Modal*/}
            {/* <Dialog
                fullWidth
                maxWidth={"lg"}
                open={siteVisitDailog}
                onClose={() => siteVisitClose()}
              > */}
            <CssBaseline />
            {/* <DialogTitle>
                  <Grid container>
                    <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                      Site Visit
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <IconButton
                        aria-label="delete"
                        sx={{
                          marginLeft: "530px",
                          backgroundColor: "primary",
                          ":hover": {
                            bgcolor: "red", // theme.palette.primary.main
                            color: "white",
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                          onClick={() => {
                            siteVisitClose();
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle> */}
            {/* <DialogContent>
                  <BookingDetail />
                  <BookingPersonDetails />
                  <AadharAuthentication />
                  <EcsDetails />
                  <DocumentsUpload />
                </DialogContent> */}

            {/* <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button onClick={() => siteVisitClose()}>Exit</Button>
                  </Grid>
                </DialogTitle>
              </Dialog> */}

            {/** LOI Generation */}
            <Dialog
              fullWidth
              maxWidth={'lg'}
              open={loiGeneration}
              onClose={() => loiGenerationClose()}
            >
              <CssBaseline />
              <DialogTitle>
                <Grid container>
                  <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                    LOI Generation
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sm={2}
                    md={4}
                    lg={6}
                    xl={6}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <IconButton
                      aria-label="delete"
                      sx={{
                        marginLeft: '530px',
                        backgroundColor: 'primary',
                        ':hover': {
                          bgcolor: 'red', // theme.palette.primary.main
                          color: 'white',
                        },
                      }}
                    >
                      <CloseIcon
                        sx={{
                          color: 'black',
                        }}
                        onClick={() => {
                          loiGenerationClose()
                        }}
                      />
                    </IconButton>
                  </Grid>
                </Grid>
              </DialogTitle>
              <DialogContent>{/* <LoiGenerationComponent /> */}</DialogContent>
              <DialogTitle>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Button onClick={() => loiGenerationClose()}>Exit</Button>
                </Grid>
              </DialogTitle>
            </Dialog>

            {/** LOI Collection */}
            <Dialog
              fullWidth
              maxWidth={'lg'}
              open={loiCollection}
              onClose={() => loiCollectionClose()}
            >
              <CssBaseline />
              <DialogTitle>
                <Grid container>
                  <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                    LOI Collection
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sm={2}
                    md={4}
                    lg={6}
                    xl={6}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <IconButton
                      aria-label="delete"
                      sx={{
                        marginLeft: '530px',
                        backgroundColor: 'primary',
                        ':hover': {
                          bgcolor: 'red', // theme.palette.primary.main
                          color: 'white',
                        },
                      }}
                    >
                      <CloseIcon
                        sx={{
                          color: 'black',
                        }}
                        onClick={() => {
                          loiCollectionClose()
                        }}
                      />
                    </IconButton>
                  </Grid>
                </Grid>
              </DialogTitle>
              <DialogContent>{/* <LoiGenerationReport /> */}</DialogContent>
              <DialogTitle>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Button onClick={() => loiCollectionClose()}>Exit</Button>
                </Grid>
              </DialogTitle>
            </Dialog>
            {/* </form> */}
            <form onSubmit={handleSubmit('remarks')}>
              <div className={styles.model}>
                <Modal
                  // component={Paper}
                  open={modalforAprov}
                  sx={{ width: '700px', marginLeft: '330px' }}
                  //onClose={clerkApproved}
                  onCancel={() => {
                    setmodalforAprov(false)
                  }}
                >
                  <Paper>
                    <div className={styles.boxRemark}>
                      <div className={styles.titlemodelremarkAprove}>
                        <Typography
                          className={styles.titleOne}
                          variant="h6"
                          component="h2"
                          color="#f7f8fa"
                          style={{ marginLeft: '25px' }}
                        >
                          Enter Remark on application
                        </Typography>
                        <IconButton>
                          <CloseIcon
                            onClick={() =>
                              router.push(
                                `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/`,
                              )
                            }
                          />
                        </IconButton>
                      </div>

                      <div
                        className={styles.btndate}
                        style={{ marginLeft: '47px' }}
                      >
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={4}
                          placeholder="Enter a Remarks"
                          style={{ width: 600 }}
                          onChange={(e) => {
                            setRemark(e.target.value)
                          }}
                        />
                      </div>

                      <div className={styles.btnappr}>
                        <Button
                          variant="contained"
                          color="success"
                          endIcon={<ThumbUpIcon />}
                          onClick={async () => {
                            remarks('APPROVE')
                            // setBtnSaveText('APPROVED')
                            router.push(
                              `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/`,
                            )
                          }}
                        >
                          approve
                        </Button>

                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<UndoIcon />}
                          onClick={() => {
                            // alert('tu karnar ressign ')
                            // setBtnSaveText('REASSIGN')
                            remarks('REASSIGN')
                            router.push(
                              `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/`,
                            )
                          }}
                        >
                          reassign
                        </Button>

                        <Button
                          variant="contained"
                          endIcon={<CloseIcon />}
                          color="error"
                          onClick={() =>
                            router.push(
                              `/sportsPortal/transaction/groundsBooking`,
                            )
                          }
                        >
                          Exit
                        </Button>
                      </div>
                    </div>
                  </Paper>
                </Modal>
              </div>
            </form>
          </FormProvider>
        </ThemeProvider>
      </Paper>
    </div>
  )
}

export default Index

// import {
//   Box,
//   Grid,
//   Paper,
//   Button,
//   Typography,
//   FormControl,
//   InputLabel,
//   FormHelperText,
//   Select,
//   ThemeProvider,
//   MenuItem,
//   TextField,
//   IconButton,
//   InputAdornment,
//   Input,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   CssBaseline,
// } from "@mui/material";
// import { useRouter } from "next/router";
// import { useDispatch, useSelector } from "react-redux";
// import React, { useState, useEffect } from "react";
// import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
// import ThumbDownIcon from "@mui/icons-material/ThumbDown";
// import DoneIcon from "@mui/icons-material/Done";
// import WcIcon from "@mui/icons-material/Wc";
// import PendingActionsIcon from "@mui/icons-material/PendingActions";
// import CancelIcon from "@mui/icons-material/Cancel";
// import CheckIcon from "@mui/icons-material/Check";
// import styles from "../components/clerk.module.css";
// import { Divider } from "antd";
// import axios from "axios";
// import { Controller, FormProvider, useForm } from "react-hook-form";
// // import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
// import theme from "../../../../theme";
// // import urls from "../../../../../URLS/urls";
// import urls from "../../../../URLS/urls";

// import SearchIcon from "@mui/icons-material/Search";
// import { Search, SearchOutlined } from "@mui/icons-material";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import EventIcon from "@mui/icons-material/Event";
// import FlakyIcon from "@mui/icons-material/Flaky";
// import PermIdentityIcon from "@mui/icons-material/PermIdentity";
// import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// // import LinaerStepper from "../../issuanceOfHawkerLicense";
// // import BasicApplicationDetails from "../../components/BasicApplicationDetails";
// // import HawkerDetails from "../../components/HawkerDetails";
// // import AddressOfHawker from "../../components/AddressOfHawker";
// // import AadharAuthentication from "../../components/AadharAuthentication";
// // import PropertyAndWaterTaxes from "../../components/PropertyAndWaterTaxes";
// // import DocumentsUpload from "../../components/DocumentsUpload";
// // import AdditionalDetails from "../../components/AdditionalDetails";
// import moment from "moment";
// import CloseIcon from "@mui/icons-material/Close";
// // // Main Component - Clerk
// const index = () => {
//   const {
//     register,
//     control,
//     handleSubmit,
//     methods,
//     getValues,
//     setValue,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm({
//     criteriaMode: "all",
//     //resolver: yupResolver(schema),
//     mode: "onChange",
//   });

//   // zones
//   const [zoneKeys, setZoneKeys] = useState([]);

//   // getZoneKeys
//   const getZoneKeys = () => {
//     axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((r) => {
//       setZoneKeys(
//         r.data.zone.map((row) => ({
//           id: row.id,
//           zoneKey: row.zoneName,
//         }))
//       );
//     });
//   };

//   // wardKeys
//   const [wardKeys, setWardKeys] = useState([]);

//   // getWardKeys
//   const getWardKeys = () => {
//     axios.get(`${URLS.CFCURL}/master/ward/getAll`).then((r) => {
//       setWardKeys(
//         r.data.ward.map((row) => ({
//           id: row.id,
//           wardKey: row.wardName,
//         }))
//       );
//     });
//   };

//   useEffect(() => {
//     getWardKeys();
//     getZoneKeys();
//   }, []);

//   // Filter Data on Find Button
//   const mrFilterTableData = () => {
//     // Approved Application Count
//     const tempData = dataSource.filter((data, index) => {
//       return data.wardKey == getValues("wardKey");
//     });

//     alert("hello");

//     alert("tempData");
//     console.log("tempData", tempData);
//     setTableData(tempData);
//     //alert(getValues("zoneKey"));
//   };

//   // Reset Data on Reset Button
//   const resetFilterData = () => {
//     alert("ok bhai");
//   };

//   // Approved Application
//   const clerkTabClick = (props) => {
//     const tableData = dataSource.filter((data, index) => {
//       if (data.applicationVerficationStatus == props) {
//         return data;
//       } else if ("TotalApplications" == props) {
//         return data;
//       }
//     });
//     setTableData(tableData);
//   };

//   const [tableData, setTableData] = useState([]);

//   const onSubmitForm = () => {};

//   useEffect(() => {
//     clerkTabClick("TotalApplications");
//   }, [dataSource]);

//   const [dataSource, setDataSource] = useState([]);
//   const router = useRouter();
//   const dispach = useDispatch();

//   // Record Count State
//   const [pendingApplication, setPendingApplication] = useState(0);
//   const [rejectedApplication, setRejectedApplication] = useState(0);
//   const [approvedApplication, setApprovedApplication] = useState(0);
//   const [totalApplication, setTotalApplication] = useState(0);

//   // Get Table - Data
//   const getNewMarriageRegistractionDetails = () => {
//     axios
// .get(`${URLS.SPURL}/groundBooking/getAll`)
// .then((resp) => {
//   console.log("Ground data", resp);
//   console.log("response Data", JSON.stringify(resp.data.groundBooking));
//   // dispach(addAllNewMarriageRegistraction(resp.data.groundBooking));
//   setDataSource(resp.data.groundBooking);
//   setTableData(resp.data.groundBooking);
//   reset(resp.data.groundBooking);

//         // Approved Application Count
//         // const approvedApplicationCount = resp.data.groundBooking.filter((data, index) => {
//         //   return data.applicationVerficationStatus == "APPROVED";
//         // });
//         // setApprovedApplication(approvedApplicationCount.length);

//         // // Pending Application
//         // const pendingApplicationCount = resp.data.groundBooking.filter((data, index) => {
//         //   return data.applicationVerficationStatus == "PENDING";
//         // });
//         // setPendingApplication(pendingApplicationCount.length);

//         // // Rejected  Application
//         // const rejectedApplicationCount = resp.data.groundBooking.filter((data, index) => {
//         //   return data.applicationVerficationStatus == "REJECTED";
//         // });
//         // setRejectedApplication(rejectedApplicationCount.length);

//         // // Total  Application
//         // const totalApplicationCount = resp.data.groundBooking.filter((data, index) => {
//         //   return data.applicationVerficationStatus;
//         // });
//         // setTotalApplication(totalApplicationCount.length);
//       });
//   };

//   useEffect(() => {
//     getNewMarriageRegistractionDetails();
//   }, []);

//   // Add Record
//   const addNewRecord = () => {
//     router.push({
//       pathname: `/marriageRegistration/transactions/newMarriageRegistration/newMarriageRegistraction`,
//       query: {
//         pageMode: "Add",
//       },
//     });
//   };

//   // view

//   const viewRecord = (record) => {
//     alert("Remark");
//     console.log("record value => ", record);

//     // router.push({
//     //   pathname:
//     //     "/marriageRegistration/transactions/newMarriageRegistration/cleark/DocumentAproveTAB",
//     //   query: {
//     //     pageMode: "View",
//     //     disabled: true,
//     //     ...record,
//     //   },
//     // });
//   };

//   // Columns
//   const columns = [
//     {
//       field: "srNo",
//       headerName: "Sr No.",

//       // headerName: <FormattedLabel id="srNo" />,
//       // flex: 1,
//     },
// {
//   field: "bankAccountHolderName",
//   headerName: "Name",
//   flex: 1,
// },
//     {
//       field: "bankAddress",
//       headerName: "Address",
//       flex: 1,
//     },

//     {
//       field: "purposeOfBooking",
//       headerName: "Purpose Of Booking",
//       flex: 1,
//     },
//     // {
//     //   field: "departments",
//     //   headerName: "Department Name",
//     //   flex: 1,
//     // },
//     // {
//     //   field: "serviceName",
//     //   headerName: "Service Name",
//     //   flex: 1,
//     // },
//     // {
//     //   field: "applicationVerficationStatus",
//     //   headerName: "Status",
//     //   flex: 1,
//     // },

//     {
//       field: "actions",
//       // headerName: <FormattedLabel id="actions" />,
//       headerName: "Action",

//       width: 300,
//       sortable: false,
//       disableColumnMenu: true,
//       renderCell: (record) => {
//         return (
//           <>
//             <IconButton onClick={() => viewRecord(record.row)}>
//               <Button
//                 style={{
//                   height: "30px",
//                   width: "100px",
//                 }}
//                 variant="contained"
//                 endIcon={<FlakyIcon />}
//                 color="success"
//               >
//                 verify
//               </Button>
//               {/* <VisibilityIcon /> */}
//             </IconButton>

//             {/* <IconButton>
//               <Button
//                 variant="outlined"
//                 endIcon={<EventIcon />}
//                 style={{
//                   height: "40px",
//                   width: "120px",
//                 }}
//               >
//                 Schedule
//               </Button>
//             </IconButton> */}
//           </>
//         );
//       },
//     },
//   ];

//   return (
//     <div>
//       {/* <BasicLayout titleProp={"Clerk DashBoard"}> */}
//       <Paper
//         component={Box}
//         squar="true"
//         elevation={5}
//         m={1}
//         pt={2}
//         pb={2}
//         pr={2}
//         pl={4}
//       >
//         <Grid container>
//           {/** Clerk */}
//           <Grid item xs={4}>
//             <Paper
//               sx={{ height: "160px" }}
//               component={Box}
//               p={2}
//               m={2}
//               squar="true"
//               elevation={5}
//             >
//               <Typography variant="h6">
//                 <strong>WelCome </strong>
//               </Typography>

//               <Typography variant="h6" style={{ justifyContent: "center" }}>
//                 <strong>Officer Name</strong>
//               </Typography>
//               <Typography variant="subtitle">
//                 <strong>Officer Designation </strong>
//               </Typography>
//               <br />
//             </Paper>
//           </Grid>
//           {/** Applicatins Tabs */}
//           <Grid item xs={8}>
//             <Paper
//               sx={{ height: "160px" }}
//               component={Box}
//               p={2}
//               m={2}
//               squar="true"
//               elevation={5}
//               // sx={{ align: "center" }}
//             >
//               <div className={styles.test}>
//                 {/** Total Application */}
//                 <div
//                   className={styles.one}
//                   onClick={() => clerkTabClick("TotalApplications")}
//                 >
//                   <div className={styles.icono}>
//                     <WcIcon color="secondary" />
//                   </div>
//                   <br />
//                   <div className={styles.icono}>
//                     <strong align="center">Total Application</strong>
//                   </div>
//                   <Typography variant="h6" align="center" color="secondary">
//                     {totalApplication}
//                   </Typography>
//                 </div>

//                 {/** Vertical Line */}
//                 <div className={styles.jugaad}></div>

//                 {/** Approved Application */}
//                 <div
//                   className={styles.one}
//                   onClick={() => clerkTabClick("APPROVED")}
//                 >
//                   <div className={styles.icono}>
//                     <ThumbUpAltIcon color="success" />
//                   </div>
//                   <br />
//                   <div className={styles.icono}>
//                     <strong align="center">Approved Application</strong>
//                   </div>
//                   <Typography variant="h6" align="center" color="green">
//                     {approvedApplication}
//                   </Typography>
//                 </div>

//                 {/** Vertical Line */}
//                 <div className={styles.jugaad}></div>

//                 {/** Pending Applications */}
//                 <div
//                   className={styles.one}
//                   onClick={() => clerkTabClick("PENDING")}
//                 >
//                   <div className={styles.icono}>
//                     <PendingActionsIcon color="warning" />
//                   </div>
//                   <br />
//                   <div className={styles.icono}>
//                     <strong align="center"> Pending Application</strong>
//                   </div>
//                   <Typography variant="h6" align="center" color="orange">
//                     {pendingApplication}
//                   </Typography>
//                 </div>

//                 {/** Vertical Line */}
//                 <div className={styles.jugaad}></div>

//                 {/** Rejected Application */}
//                 <div
//                   className={styles.one}
//                   onClick={() => clerkTabClick("REJECTED")}
//                 >
//                   <div className={styles.icono}>
//                     <CancelIcon color="error" />
//                   </div>
//                   <br />
//                   <div className={styles.icono}>
//                     <strong align="center">Rejected Application</strong>
//                   </div>
//                   <Typography variant="h6" align="center" color="error">
//                     {rejectedApplication}
//                   </Typography>
//                 </div>
//               </div>
//             </Paper>
//           </Grid>
//         </Grid>

//         <ThemeProvider theme={theme}>
//           <FormProvider>
//             <form onSubmit={handleSubmit(onSubmitForm)}>
//               <div className={styles.gridCenter}>
//                 <Grid
//                   container
//                   component={Paper}
//                   squar="true"
//                   elevation={5}
//                   m={2}
//                   p={2}
//                 >
//                   <Grid item md={3}>
//                     <FormControl
//                       variant="standard"
//                       sx={{ marginTop: 2 }}
//                       error={!!errors.zoneKey}
//                     >
//                       <InputLabel id="demo-simple-select-standard-label">
//                         {/* <FormattedLabel id="zone" /> */}
//                         Zone
//                       </InputLabel>
//                       <Controller
//                         render={({ field }) => (
//                           <Select
//                             //sx={{ width: 230 }}
//                             value={field.value}
//                             onChange={(value) => field.onChange(value)}
//                             label="Zone Name *"
//                           >
//                             {zoneKeys &&
//                               zoneKeys.map((zoneKey, index) => (
//                                 <MenuItem key={index} value={zoneKey.id}>
//                                   {zoneKey.zoneKey}
//                                 </MenuItem>
//                               ))}
//                           </Select>
//                         )}
//                         name="zoneKey"
//                         control={control}
//                         defaultValue=""
//                       />
//                       <FormHelperText>
//                         {errors?.zoneKey ? errors.zoneKey.message : null}
//                       </FormHelperText>
//                     </FormControl>
//                   </Grid>
//                   <Grid item md={3}>
//                     <FormControl
//                       variant="standard"
//                       sx={{ marginTop: 2 }}
//                       error={!!errors.wardKey}
//                     >
//                       <InputLabel id="demo-simple-select-standard-label">
//                         {/* <FormattedLabel id="ward" /> */}
//                         Ward
//                       </InputLabel>
//                       <Controller
//                         render={({ field }) => (
//                           <Select
//                             value={field.value}
//                             onChange={(value) => field.onChange(value)}
//                             label="Ward Name *"
//                           >
//                             {wardKeys &&
//                               wardKeys.map((wardKey, index) => (
//                                 <MenuItem key={index} value={wardKey.id}>
//                                   {wardKey.wardKey}
//                                 </MenuItem>
//                               ))}
//                           </Select>
//                         )}
//                         name="wardKey"
//                         control={control}
//                         defaultValue=""
//                       />
//                       <FormHelperText>
//                         {errors?.wardKey ? errors.wardKey.message : null}
//                       </FormHelperText>
//                     </FormControl>
//                   </Grid>
//                   <Grid item md={3}>
//                     <FormControl variant="standard">
//                       <InputLabel htmlFor="standard-adornment">
//                         Application Number
//                       </InputLabel>
//                       <Input
//                         id="standard-adornment"
//                         {...register("applicantNumber")}
//                         endAdornment={
//                           <InputAdornment position="end">
//                             <IconButton>
//                               <SearchIcon />
//                             </IconButton>
//                           </InputAdornment>
//                         }
//                       />
//                     </FormControl>
//                   </Grid>

//                   <Grid item md={3}>
//                     <FormControl variant="standard">
//                       <InputLabel htmlFor="standard-adornment">
//                         Applicant Name
//                       </InputLabel>
//                       <Input
//                         id="standard-adornment"
//                         {...register("applicantName")}
//                         endAdornment={
//                           <InputAdornment position="end">
//                             <IconButton>
//                               <SearchIcon />
//                             </IconButton>
//                           </InputAdornment>
//                         }
//                       />
//                     </FormControl>
//                   </Grid>
//                   <Grid item md={2}>
//                     <Button
//                       sx={{ width: "150px", height: "45px", mt: "30px" }}
//                       variant="contained"
//                       onClick={() => {
//                         mrFilterTableData();
//                       }}
//                     >
//                       Find
//                     </Button>
//                   </Grid>
//                   <Grid item md={3}>
//                     <Button
//                       sx={{ width: "150px", height: "45px", mt: "30px" }}
//                       variant="contained"
//                       color="success"
//                       onClick={() => {
//                         resetFilterData();
//                       }}
//                     >
//                       Reset
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </div>
//               <DataGrid
//                 autoHeight
//                 sx={{
//                   p: 2,
//                   m: 2,
//                 }}
//                 rows={tableData}
//                 columns={columns}
//                 pageSize={5}
//                 rowsPerPageOptions={[5]}
//               />
//             </form>
//           </FormProvider>
//         </ThemeProvider>
//       </Paper>
//       {/* </BasicLayout> */}
//     </div>
//   );
// };

// export default index;

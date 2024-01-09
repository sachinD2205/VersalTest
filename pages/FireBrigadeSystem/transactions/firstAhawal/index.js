import { yupResolver } from "@hookform/resolvers/yup";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "./form";
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const {
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  const router = useRouter();
  const [id, setID] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [vardiTypes, setVardiTypes] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState([]);

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getVardiTypes();
    getData();
  }, []);

  // get Vardi Types
  const getVardiTypes = () => {
    axios
      .get(`${urls.BaseURL}/vardiTypeMaster/getVardiTypeMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        let vardi = {};
        r.vardiSlip?.data.map(
          (r) => (vardi[r.vardiSlip.id] = r.vardiSlip.vardiName)
        );
        setVardiTypes(vardi);
      });
  };

  const [load, setLoad] = useState(false);

  // For Paginantion
  // get Table Data
  //     .get(
  //       `${urls.FbsURL}/transaction/trnEmergencyServices/saveTrnEmergencyServices`
  //     )
  //     .then((res) => {
  //       setDataSource(
  //         res.data.map((r, i) => ({
  //           id: r.vardiSlip.id,
  //           srNo: i + 1,
  //           informerName: r.vardiSlip.informerName,
  //           contactNumber: r.vardiSlip.contactNumber,
  //           occurancePlace: r.vardiSlip.occurancePlace,
  //           typeOfVardiId: r.vardiSlip.typeOfVardiId,
  //           dateAndTimeOfVardi: moment(
  //             r.vardiSlip.dateAndTimeOfVardi,
  //             "DD-MM-YYYY  HH:mm"
  //           ).format("DD-MM-YYYY  HH:mm"),
  //           // fromDate: moment(r.vardiSlip.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
  //           // businessType: r.vardiSlip.businessType,
  //           // businessTypeName: businessTypes?.find(
  //           //   (obj) => obj?.id === r.vardiSlip.businessType
  //           // )?.businessType,
  //           // businessSubType: r.vardiSlip.businessSubType,
  //           // remark: r.vardiSlip.remark,
  //         }))
  //       );
  //     });
  // };

  // Get Table - Data
  const getData = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoad(true);

    axios
      .get(`${urls.FbsURL}/transaction/trnEmergencyServices/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoad(false);

        let _res = res?.data?.emergencyService
          // .filter((u) => u.isPayment === "Y")
          .map((r, i) => ({
            srNo: i + 1,
            activeFlag: r.activeFlag,
            id: r.id,
            serialNo: i + 1 + _pageNo * _pageSize,

            dateOfVardi: moment(r.dateAndTimeOfVardi, "DD-MM-YYYY").format(
              "DD-MM-YYYY"
            ),

            timeOfVardi: moment(r.dateAndTimeOfVardi, "HH:mm A").format(
              "HH:mm A"
            ),

            informerNameCol:
              r?.vardiSlip?.informerName +
              " " +
              r?.vardiSlip?.informerMiddleName +
              " " +
              r?.vardiSlip?.informerLastName,

            informerNameColMr:
              r?.vardiSlip?.informerNameMr +
              " " +
              r?.vardiSlip?.informerMiddleNameMr +
              " " +
              r?.vardiSlip?.informerLastNameMr,

            // application date
            dateAndTimeOfVardi: moment(
              r.dateAndTimeOfVardi,
              "YYYY-MM-DDTHH:mm:ss"
            ).format("YYYY-MM-DDTHH:mm:ss"),

            // Vardi Slip
            firstAhawalId: r?.firstAhawalId?.id,
            informerName: r?.vardiSlip?.informerName,
            informerNameMr: r?.vardiSlip?.informerNameMr,
            informerMiddleName: r?.vardiSlip?.informerMiddleName,
            informerMiddleNameMr: r?.vardiSlip?.informerMiddleNameMr,
            informerLastName: r?.vardiSlip?.informerLastName,
            informerLastNameMr: r?.vardiSlip?.informerLastNameMr,
            area: r?.vardiSlip?.area,
            areaMr: r?.vardiSlip?.areaMr,
            city: r?.vardiSlip?.city,
            cityMr: r?.vardiSlip?.cityMr,
            contactNumber: r?.vardiSlip?.contactNumber,
            mailID: r?.vardiSlip?.mailID,

            // vardi details
            vardiPlace: r?.vardiSlip?.vardiPlace,
            vardiPlaceMr: r?.vardiSlip?.vardiPlaceMr,
            landmark: r?.vardiSlip?.landmark,
            landmarkMr: r?.vardiSlip?.landmarkMr,
            typeOfVardiId: r?.vardiSlip?.typeOfVardiId,
            otherVardiType:
              r?.vardiSlip?.otherVardiType == ""
                ? "-"
                : r?.vardiSlip?.otherVardiType,
            slipHandedOverTo: r?.vardiSlip?.slipHandedOverTo,
            fireStationName: r?.vardiSlip?.fireStationName,
            // first Ahawal
            subTypesOfVardi: r?.firstAhawal?.subTypesOfVardi,
            employeeName: r?.firstAhawal?.employeeName,
            // vardiDispatchTime: r?.firstAhawal?.vardiDispatchTime,\

            vardiDispatchTime:
              r?.firstAhawal?.vardiDispatchTime == null
                ? "--"
                : moment(r?.firstAhawal?.vardiDispatchTime, "hh:mm:ss").format(
                    "hh:mm:ss"
                  ),

            // vardiDispatchTime: moment(r?.firstAhawal?.vardiDispatchTime, "hh:mm:ss").format("hh:mm:ss"),
            reasonOfFire: r?.firstAhawal?.reasonOfFire,
            otherReasonOfFire: r?.firstAhawal?.otherReasonOfFire,
            nameOfSubFireOfficer: r?.firstAhawal?.nameOfSubFireOfficer,
            nameOfMainFireOfficer: r?.firstAhawal?.nameOfMainFireOfficer,
            // isTenantHaveAnyLoss: r?.firstAhawal?.isTenantHaveAnyLoss,
            isLossInAmount: r?.firstAhawal?.isLossInAmount,
            fireStations: r?.firstAhawal?.fireStations,
            fireStationCrews: r?.firstAhawal?.fireStationCrews,
            isExternalPersonAddedInDuty:
              r?.firstAhawal?.isExternalPersonAddedInDuty,
            offDutyEmployees: r?.firstAhawal?.offDutyEmployees,
            // Table

            otherEmployeesLst: r?.firstAhawal?.otherEmployeesLst,

            isExternalServiceProvide: r?.firstAhawal?.isExternalServiceProvide,
            // add more feild

            externalSupportLst: r?.firstAhawal?.externalSupportLst,
            vehicleEntryLst: r?.firstAhawal?.vehicleEntryLst,

            // external service (add)
            externalServiceId: r?.firstAhawal?.externalServiceId,
            esname: r?.firstAhawal?.esname,
            esconatact: r?.firstAhawal?.escontactNo,

            // external person employee added
            offDutyEmpName: r?.firstAhawal?.offDutyEmpName,
            offDutyEmpNameMr: r?.firstAhawal?.offDutyEmpNameMr,
            offDutyEmpContactNo: r?.firstAhawal?.offDutyEmpContactNo,
            offDutyEmpAddress: r?.firstAhawal?.offDutyEmpAddress,
            offDutyEmpAddressMr: r?.firstAhawal?.offDutyEmpAddressMr,

            firedThingsDuringAccuse: r?.firstAhawal?.firedThingsDuringAccuse,
            firedThingsDuringAccuseMr:
              r?.firstAhawal?.firedThingsDuringAccuseMr,
            insurancePolicyApplicable:
              r?.firstAhawal?.insurancePolicyApplicable,
            insurancePolicyDetails: r?.firstAhawal?.insurancePolicyDetails,
            insurancePolicyDetailsMr: r?.firstAhawal?.insurancePolicyDetailsMr,
            isFireEquipmentsAvailable:
              r?.firstAhawal?.isFireEquipmentsAvailable,
            fireEquipments: r?.firstAhawal?.fireEquipments,
            // fireEquipmentsMr: r?.firstAhawal?.fireEquipmentsMr,

            // vahicle Feild
            vehicle: r?.firstAhawal?.vehicle,
            outTime: r?.firstAhawal?.outTime,
            reachedTime: r?.firstAhawal?.reachedTime,
            workDuration: r?.firstAhawal?.workDuration,
            leaveTime: r?.firstAhawal?.leaveTime,
            inTime: r?.firstAhawal?.inTime,
            firstAhawalId: r?.firstAhawal?.firstAhawalId,
            distanceTravelledInKms: r?.firstAhawal?.distanceTravelledInKms,

            // loss
            capacity: r?.finalAhawal?.capacity,

            manPowerLoss: r?.firstAhawal?.manPowerLoss,
            injurred: r?.firstAhawal?.injurred,
            totalVehicleLoss: r?.firstAhawal?.totalVehicleLoss,
            totalBuildingLoss: r?.firstAhawal?.totalBuildingLoss,
            fireDamages: r?.firstAhawal?.fireDamages,
            selfLossDetails: r?.firstAhawal?.selfLossDetails,
            otherLossDetails: r?.firstAhawal?.otherLossDetails,

            selfEmployeeInjurred: r?.firstAhawal?.selfEmployeeInjurred,
            selfEmployeeDead: r?.firstAhawal?.selfEmployeeDead,
            otherInjurred: r?.firstAhawal?.otherInjurred,
            otherDead: r?.firstAhawal?.otherDead,

            ownerOfPropertyInjurredCount:
              r?.firstAhawal?.ownerOfPropertyInjurredCount,
            ownerOfPropertyDeadCount: r?.firstAhawal?.ownerOfPropertyDeadCount,
            ownerOfPropertyOtherDetails:
              r?.firstAhawal?.ownerOfPropertyOtherDetails,

            // other added
            subTypeOfVardiId: r?.firstAhawal?.subTypeOfVardiId,
            // otherVardiType: r?.firstAhawal?.otherVardiType,

            // slipHandedOverTo: r.firstAhawal?.slipHandedOverTo,
            // isExternalSupportProvided: r.isExternalSupportProvided,
            // fireStationName: r.firstAhawal?.fireStationName,
            // locationArrivalTime: r.firstAhawal?.locationArrivalTime,
            // lossInAmount: r.firstAhawal?.lossInAmount,
            // employeeDetailsDuringFireWorks:
            //   r.firstAhawal?.employeeDetailsDuringFireWorks,
            // chargesCollected: r.firstAhawal?.chargesCollected,
            // chargesCollectedMr: r.firstAhawal?.chargesCollectedMr,
            // billPayerDetails: r.firstAhawal?.billPayerDetails,
            // billPayerDetailsMr: r.firstAhawal?.billPayerDetailsMr,
            // employeeName: r.firstAhawal?.employeeName,
            // employeeNameMr: r.firstAhawal?.employeeNameMr,
            // nameOfOwner: r.firstAhawal?.nameOfOwner,
            // nameOfOwnerMr: r.firstAhawal?.nameOfOwnerMr,
            // nameOfTenant: r.firstAhawal?.nameOfTenant,
            // nameOfTenantMr: r.firstAhawal?.nameOfTenantMr,
            // firstVehicleReachAtLocationTime:
            //   r.firstAhawal?.firstVehicleReachAtLocationTime,
            // distanceFromMainFireStation:
            //   r.firstAhawal?.distanceFromMainFireStation,
            // distanceFromSubFireStation:
            //   r.firstAhawal?.distanceFromSubFireStation,
            // constructionLoss: r.firstAhawal?.constructionLoss,
            // insuranced: r.firstAhawal?.insuranced,
            // fireType: r.firstAhawal?.fireType,
            // fireTypeMr: r.firstAhawal?.fireTypeMr,
            // fireReason: r.firstAhawal?.fireReason,
            // fireReasonMr: r.firstAhawal?.fireReasonMr,
            // fireLossInformationDetails:
            //   r.firstAhawal?.fireLossInformationDetails,
            // fireLossInformationDetailsMr:
            //   r.firstAhawal?.fireLossInformationDetailsMr,
            // finacialLoss: r.firstAhawal?.finacialLoss,
            // finacialLossMr: r.firstAhawal?.finacialLossMr,
            // actual: r.firstAhawal?.actual,
            // saveOfLoss: r.firstAhawal?.saveOfLoss,
            // lossOfBuildingMaterial: r.firstAhawal?.lossOfBuildingMaterial,
            // lossOfBuildingMaterialMr: r.firstAhawal?.lossOfBuildingMaterialMr,
            // otherOutsideLoss: r.firstAhawal?.otherOutsideLoss,
            // otherOutsideLossMr: r.firstAhawal?.otherOutsideLossMr,
            // firstVehicleLeftAtLocationDateAndTime:
            //   r.firstAhawal?.firstVehicleLeftAtLocationDateAndTime,
            // billPayerName: r.firstAhawal?.billPayerName,
            // billPayeraddress: r.firstAhawal?.billPayeraddress,
            // billPayerContact: r.firstAhawal?.billPayerContact,
            // billPayerNameMr: r.firstAhawal?.billPayerNameMr,
            // billPayeraddressMr: r.firstAhawal?.billPayeraddressMr,
            // collectedAmount: r.firstAhawal?.collectedAmount,
            // referenceNumber: r.firstAhawal?.referenceNumber,
          }));

        // let _res = res.data.emergencyService.map((r, i) => ({
        //   activeFlag: r.activeFlag,
        //   id: r.id,
        //   serialNo: r.id,
        //   informerName: r.informerName,
        //   informerNameMr: r.informerNameMr,
        //   informerMiddleName: r.informerMiddleName,
        //   informerMiddleNameMr: r.informerMiddleNameMr,
        //   informerLastName: r.informerLastName,
        //   informerLastNameMr: r.informerLastNameMr,
        //   contactNumber: r.contactNumber,
        //   occurancePlace: r.occurancePlace,
        //   occurancePlaceMr: r.occurancePlaceMr,
        //   area: r.area,
        //   areaMr: r.areaMr,
        //   landmark: r.landmark,
        //   landmarkMr: r.landmarkMr,
        //   city: r.city,
        //   cityMr: r.cityMr,
        //   pinCode: r.pinCode,
        //   typeOfVardiId: r.typeOfVardiId,

        //   // typeOfVardiId: dataSource?.find((obj) => {
        //   //   console.log("obj", obj);
        //   //   return obj.id === r.typeOfVardiId;
        //   // })?.vardiName
        //   //   ? dataSource?.find((obj) => {
        //   //       return obj.id === r.typeOfVardiId;
        //   //     })?.vardiName
        //   //   : "-",

        //   slipHandedOverTo: r.slipHandedOverTo,

        //   slipHandedOverToMr: r.slipHandedOverToMr,
        //   // dateAndTimeOfVardi: moment(
        //   //   r.dateAndTimeOfVardi,
        //   //   "YYYY-MM-DD HH:mm:ss"
        //   // ).format("YYYY-MM-DD HH:mm:ss"),

        //   dateAndTimeOfVardi: moment(
        //     r.dateAndTimeOfVardi,
        //     "YYYY-MM-DD HH:mm:ss"
        //   ).format("YYYY-MM-DD HH:mm:ss"),

        // }));

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((err) => {
        console.log(err);
        setLoad(false);
      });
  };

  // Delete
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(
              `${urls.FbsURL}/transaction/trnEmergencyServices/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                setEditButtonInputState(true);
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getData();
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(
              `${urls.FbsURL}/transaction/trnEmergencyServices/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                setEditButtonInputState(false);
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getSubType()
                getData();
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // View Record
  // const viewRecord = (record) => {
  //   console.log("rec", record);
  //   router.push({
  //     pathname: "/FireBrigadeSystem/transactions/emergencyService/form",
  //     query: {
  //       btnSaveText: "Update",
  //       pageMode: "Edit",
  //       ...record,
  //     },
  //   });
  // };

  // define colums table
  // const columns = [
  //   {
  //     headerName: <FormattedLabel id='srNoF' />,
  //     field: "srNo",
  //     align: "center",
  //     headerAlign: "center",
  //     // flex: 1,
  //     width: 100,
  //   },
  //   {
  //     headerName: <FormattedLabel id='informerNameF' />,
  //     // headerName: "Informer Name",
  //     field: language == "en" ? "informerName" : "informerNameMr",
  //     flex: 1,
  //     width: 150,
  //   },
  //   {
  //     headerName: <FormattedLabel id='informerLastNameF' />,
  //     field: language == "en" ? "informerLastName" : "informerLastNameMr",
  //     flex: 1,
  //     width: 150,
  //   },
  //   {
  //     headerName: <FormattedLabel id='occurancePlaceF' />,
  //     field: language == "en" ? "vardiPlace" : "vardiPlaceMr",
  //     flex: 1,
  //   },

  //   {
  //     field: "contactNumber",
  //     headerName: <FormattedLabel id='contactNumberF' />,
  //     flex: 1,
  //   },

  //   // {
  //   //   headerName: <FormattedLabel id="typeOfVardiIdF" />,
  //   //   field: language == "en" ? "typeOfVardiId" : "typeOfVardiIdMr",
  //   //   flex: 1,
  //   // },
  //   {
  //     headerName: <FormattedLabel id='dateAndTimeOfVardiF' />,
  //     field: "dateAndTimeOfVardi",
  //     width: 200,
  //   },

  //   // For Paginantion Change Code
  // {
  //   field: "actions",
  //   headerName: <FormattedLabel id='actions' />,
  //   width: 150,
  //   headerAlign: "center",
  //   align: "center",
  //   sortable: false,
  //   disableColumnMenu: true,
  //   renderCell: (params) => {
  //     console.log("params", params.row);
  //     return (
  //       <Box>
  //         <Tooltip title='View'>
  //           <IconButton
  //             onClick={(e) => {
  //               console.log("e", e, "params", params.row);
  //               router.push({
  //                 pathname:
  //                   "/FireBrigadeSystem/transactions/firstAhawal/form",
  //                 query: {
  //                   ...params.row,
  //                   mode: "view",
  //                   pageMode: "View",
  //                 },
  //               });
  //             }}
  //           >
  //             <VisibilityIcon
  //               style={{
  //                 fontSize: "20px",
  //                 hover: {
  //                   color: "blue",
  //                 },
  //               }}
  //             />
  //           </IconButton>
  //         </Tooltip>
  //         <IconButton
  //           // disabled={params.row.activeFlag === "Y" ? false : true}
  //           onClick={() => {
  //             const record = params.row;
  //             router.push(
  //               {
  //                 pathname:
  //                   "/FireBrigadeSystem/transactions/firstAhawal/form",
  //                 query: {
  //                   pageMode: "Edit",
  //                   ...record,
  //                   firstAhawalId: record?.firstAhawalId?.id,
  //                 },
  //               }
  //               // "/FireBrigadeSystem/transactions/firstAhawal/form"
  //             );
  //             console.log("mmm", params.row);
  //             ("");
  //           }}
  //         >
  //           <Button
  //             size='small'
  //             // variant="contained"
  //             // className={styles.click}

  //             sx={{
  //               border: "1px solid #5499C7",
  //               backgroundColor: "#ecf0f1",
  //             }}
  //           >
  //             Action
  //           </Button>
  //         </IconButton>
  //         {/* <IconButton
  //           style={{ cursor: "pointer" }}
  //           onClick={() => {
  //             setBtnSaveText("Update"),
  //               setID(params.row.id),
  //               console.log("params.row: ", params.row);
  //             reset(params.row);
  //           }}
  //         >
  //           {params.row.activeFlag == "Y" ? (
  //             <ToggleOnIcon
  //               style={{ color: "green", fontSize: 30 }}
  //               onClick={() => deleteById(params.id, "N")}
  //             />
  //           ) : (
  //             <ToggleOffIcon
  //               style={{ color: "red", fontSize: 30 }}
  //               onClick={() => deleteById(params.id, "Y")}
  //             />
  //           )}
  //         </IconButton> */}
  //       </Box>
  //     );
  //   },
  // },
  // ];
  const columns = [
    {
      headerName: <FormattedLabel id="srNoF" />,
      field: "serialNo",
      align: "center",
      headerAlign: "center",
      flex: 0.4,
    },
    {
      headerName: <FormattedLabel id="informerNameF" />,
      field: language == "en" ? "informerNameCol" : "informerNameColMr",
      flex: 1.1,
    },

    {
      field: "contactNumber",
      headerName: <FormattedLabel id="contactNumberF" />,
      flex: 0.7,
    },
    {
      headerName: <FormattedLabel id="areaEn" />,
      field: language == "en" ? "area" : "areaMr",
      flex: 0.5,
    },
    {
      headerName: <FormattedLabel id="occurancePlaceF" />,
      field: language == "en" ? "vardiPlace" : "vardiPlaceMr",
      flex: 0.5,
    },

    {
      headerName: <FormattedLabel id="dateOfVardi" />,
      field: "dateOfVardi",
      flex: 0.5,
    },
    {
      headerName: <FormattedLabel id="timeOfVardi" />,
      field: "timeOfVardi",
      flex: 0.5,
    },
    // {
    //   headerName: <FormattedLabel id='typeOfVardiIdF' />,
    //   field: "typeOfVardiId",
    //   // width: 170,
    //   // align: "center",
    //   // headerAlign: "center",
    // },
    {
      headerName: <FormattedLabel id="vardiDispatchTime" />,
      flex: 0.7,
      align: "center",
      field: "vardiDispatchTime",
    },

    // For Paginantion Change Code
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.7,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <Box>
            <Tooltip title="View">
              <IconButton
                onClick={(e) => {
                  console.log("e", e, "params", params.row);
                  router.push({
                    pathname:
                      "/FireBrigadeSystem/transactions/firstAhawal/form",
                    query: {
                      ...params.row,
                      mode: "View",
                      pageMode: "View",
                    },
                  });
                }}
              >
                <VisibilityIcon
                  style={{
                    fontSize: "20px",
                    hover: {
                      color: "blue",
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
            <IconButton
              // disabled={params.row.activeFlag === "Y" ? false : true}
              onClick={() => {
                const record = params.row;
                router.push(
                  {
                    pathname:
                      "/FireBrigadeSystem/transactions/firstAhawal/form",
                    query: {
                      pageMode: "Edit",
                      ...record,
                      firstAhawalId: record?.firstAhawalId?.id,
                    },
                  }
                  // "/FireBrigadeSystem/transactions/firstAhawal/form"
                );
                console.log("mmm", params.row);
                ("");
              }}
            >
              <Button
                size="small"
                // variant="contained"
                // className={styles.click}

                sx={{
                  border: "1px solid #5499C7",
                  backgroundColor: "#ecf0f1",
                }}
              >
                Action
              </Button>
            </IconButton>
            {/* <IconButton
              style={{ cursor: "pointer" }}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton> */}
          </Box>
        );
      },
    },
  ];
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id="firstVardi" />}
          </Box>
        </Box>
      </Box>

      {load && <Loader />}
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color='inherit' />
      </Backdrop> */}
      <Box style={{ height: "100%", width: "100%" }}>
        {/* For Pagination Changes in Code */}
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          getRowId={(row) => row.srNo}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density="compact"
          sx={{
            backgroundColor: "white",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              // backgroundColor: "#87E9F7",
              backgroundColor: "#2E86C1",
              color: "white",
            },
          }}
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getData(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getData(_data, data.page);
          }}
        />
      </Box>
    </Box>
  );
};

export default Index;

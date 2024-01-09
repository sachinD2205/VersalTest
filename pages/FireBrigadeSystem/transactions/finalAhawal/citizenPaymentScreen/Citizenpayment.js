import PendingIcon from "@mui/icons-material/Pending";
import PrintIcon from "@mui/icons-material/Print";
import { Box, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../../../../../styles/fireBrigadeSystem/view.module.css";
import urls from "../../../../../URLS/urls";

// import schema from "./form";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";

// style For Loi Buttons Modal
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};

const CitizenPayment = () => {
  const userToken = useGetToken();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  // loi receipt
  const viewRecord4 = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      pathname: "/FireBrigadeSystem/transactions/firstAhawal/loiRecipt",
      query: {
        pageMode: "Edit",
        ...record,
      },
    });
  };

  // loi generation
  const viewRecord5 = (record) => {
    console.log("genrecord", JSON.stringify(record));
    router.push({
      pathname:
        "/FireBrigadeSystem/transactions/firstAhawal/loiGenerationComponent",
      query: {
        pageMode: "Edit",
        ...record,
      },
    });
  };

  // loi collection
  const viewRecord6 = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      pathname:
        "/FireBrigadeSystem/transactions/firstAhawal/loiCollectionComponent",
      query: {
        pageMode: "Edit",
        ...record,
      },
    });
  };

  const language = useSelector((state) => state?.labels.language);

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
        r.data.map((r) => (vardi[r.id] = r.vardiName));
        setVardiTypes(vardi);
      });
  };

  // For Paginantion
  // get Table Data
  //     .get(
  //       `${urls.FbsURL}/transaction/trnEmergencyServices/saveTrnEmergencyServices`
  //     )
  //     .then((res) => {
  //       setDataSource(
  //         res.data.map((r, i) => ({
  //           id: r.id,
  //           srNo: i + 1,
  //           informerName: r.informerName,
  //           contactNumber: r.contactNumber,
  //           vardiPlace: r.vardiPlace,
  //           typeOfVardiId: r.typeOfVardiId,
  //           dateAndTimeOfVardi: moment(
  //             r.dateAndTimeOfVardi,
  //             "DD-MM-YYYY  HH:mm"
  //           ).format("DD-MM-YYYY  HH:mm"),
  //           // fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
  //           // businessType: r.businessType,
  //           // businessTypeName: businessTypes?.find(
  //           //   (obj) => obj?.id === r.businessType
  //           // )?.businessType,
  //           // businessSubType: r.businessSubType,
  //           // remark: r.remark,
  //         }))
  //       );
  //     });
  // };

  // Get Table - Data
  const getData = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.FbsURL}/transaction/trnEmergencyServices/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },

        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("form data", res.data.emergencyService);

        let _res = res.data.emergencyService
          // .filter(
          //   (u) =>
          //     u.activeFlag === "Y" &&
          //     u.applicationNo == "PCMC10022023FBS000000000025"
          // )
          .map((r, i) => {
            console.log("121", r);
            return {
              activeFlag: r.activeFlag,
              isPayment: r.isPayment,
              chargesApply: r.chargesApply,
              id: r.id,
              serialNo: r.id,
              informerName: r?.vardiSlip?.informerName,
              informerNameMr: r?.vardiSlip?.informerNameMr,
              informerMiddleName: r?.vardiSlip?.informerMiddleName,
              informerMiddleNameMr: r?.vardiSlip?.informerMiddleNameMr,
              informerLastName: r?.vardiSlip?.informerLastName,
              informerLastNameMr: r?.vardiSlip?.informerLastNameMr,
              contactNumber: r?.vardiSlip?.contactNumber,
              vardiPlace: r?.vardiSlip?.vardiPlace,
              vardiPlaceMr: r?.vardiSlip?.vardiPlaceMr,
              area: r?.vardiSlip?.area,
              areaMr: r?.vardiSlip?.areaMr,
              landmark: r?.vardiSlip?.landmark,
              landmarkMr: r?.vardiSlip?.landmarkMr,
              city: r?.vardiSlip?.city,
              cityMr: r?.vardiSlip?.cityMr,
              // pinCode: r?.vardiSlip?.pinCode,
              typeOfVardiId: r?.vardiSlip?.typeOfVardiId,
              rescueVardi: r?.vardiSlip?.rescueVardi,
              pumpingCharge: r.pumpingCharge,
              standByDuty: r.standByDuty,

              // typeOfVardiId: dataSource?.find((obj) => {
              //   console.log("obj", obj);
              //   return obj.id === r.typeOfVardiId;
              // })?.vardiName
              //   ? dataSource?.find((obj) => {
              //       return obj.id === r.typeOfVardiId;
              //     })?.vardiName
              //   : "-",

              slipHandedOverTo: r.slipHandedOverTo,

              slipHandedOverToMr: r.slipHandedOverToMr,

              dateAndTimeOfVardi: moment(
                r.dateAndTimeOfVardi,
                "YYYY-MM-DD HH:mm:ss"
              ).format("YYYY-MM-DD HH:mm:ss"),

              departureTime: moment(r.departureTime, "hh:mm (a/p)m").format(
                "hh:mm (a/p)m"
              ),

              arriavalKM: r.arriavalKM,
              arriavalTime: r.arriavalTime,
              Date: r.Date,
              fireStationName: r.fireStationName,
              // typeOfVardi: null,
              locationArrivalTime: r.locationArrivalTime,
              reasonOfFire: r.reasonOfFire,
              firedThingsDuringAccuse: r.firedThingsDuringAccuse,
              firedThingsDuringAccuseMr: r.firedThingsDuringAccuseMr,
              lossInAmount: r.lossInAmount,
              insurancePolicyDetails: r.insurancePolicyDetails,
              insurancePolicyDetailsMr: r.insurancePolicyDetailsMr,
              fireEquipments: r.fireEquipments,
              fireEquipmentsMr: r.fireEquipmentsMr,
              manPowerLoss: r.manPowerLoss,
              manPowerLossMr: r.manPowerLossMr,
              employeeDetailsDuringFireWorks: r.employeeDetailsDuringFireWorks,
              chargesCollected: r.chargesCollected,
              chargesCollectedMr: r.chargesCollectedMr,
              billPayerDetails: r.billPayerDetails,
              billPayerDetailsMr: r.billPayerDetailsMr,
              nameOfSubFireOfficer: r.nameOfSubFireOfficer,
              nameOfMainFireOfficer: r.nameOfMainFireOfficer,
              employeeName: r.employeeName,
              employeeNameMr: r.employeeNameMr,
              nameOfOwner: r.nameOfOwner,
              nameOfOwnerMr: r.nameOfOwnerMr,
              nameOfTenant: r.nameOfTenant,
              nameOfTenantMr: r.nameOfTenantMr,
              firstVehicleReachAtLocationTime:
                r.firstVehicleReachAtLocationTime,
              distanceFromMainFireStation: r.distanceFromMainFireStation,
              distanceFromSubFireStation: r.distanceFromSubFireStation,
              constructionLoss: r.constructionLoss,
              insuranced: r.insuranced,
              fireType: r.fireType,
              fireTypeMr: r.fireTypeMr,
              fireReason: r.fireReason,
              fireReasonMr: r.fireReasonMr,
              fireLossInformationDetails: r.fireLossInformationDetails,
              fireLossInformationDetailsMr: r.fireLossInformationDetailsMr,
              finacialLoss: r.finacialLoss,
              finacialLossMr: r.finacialLossMr,
              actual: r.actual,
              saveOfLoss: r.saveOfLoss,
              lossOfBuildingMaterial: r.lossOfBuildingMaterial,
              lossOfBuildingMaterialMr: r.lossOfBuildingMaterialMr,
              otherOutsideLoss: r.otherOutsideLoss,
              otherOutsideLossMr: r.otherOutsideLossMr,
              firstVehicleLeftAtLocationDateAndTime:
                r.firstVehicleLeftAtLocationDateAndTime,
              billPayerName: r.billPayerName,
              billPayeraddress: r.billPayeraddress,
              billPayerContact: r.billPayerContact,
              billPayerNameMr: r.billPayerNameMr,
              billPayeraddressMr: r.billPayeraddressMr,
              collectedAmount: r.collectedAmount,
              referenceNumber: r.referenceNumber,
              serviceName: r.serviceName,
              citizenNeedToPayment: r.citizenNeedToPayment,
              outSidePcmcArea: r.outSidePcmcArea,
              numberOfTrip: r.numberOfTrip,
              subMenu: r.subMenu,
              thirdCharge: r.thirdCharge,
              mailID: r.mailID,
            };
          });

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
        //   vardiPlace: r.vardiPlace,
        //   vardiPlaceMr: r.vardiPlaceMr,
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

        //   // departureTime: r.departureTime,

        //   departureTime: moment(r.departureTime, "hh:mm (a/p)m").format(
        //     "hh:mm (a/p)m"
        //   ),
        // }));

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
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
  const columns = [
    {
      headerName: <FormattedLabel id="srNoF" />,
      field: "serialNo",
      align: "center",
      headerAlign: "center",
      // flex: 1,
      width: 80,
    },
    {
      headerName: <FormattedLabel id="informerNameF" />,
      // headerName: "Informer Name",
      field: language == "en" ? "informerName" : "informerNameMr",
      flex: 1,
      width: 150,
    },
    {
      headerName: <FormattedLabel id="informerLastNameF" />,
      field: language == "en" ? "informerLastName" : "informerLastNameMr",
      flex: 1,
      width: 150,
    },

    {
      field: "contactNumber",
      headerName: <FormattedLabel id="contactNumberF" />,
      flex: 1,
    },

    {
      headerName: <FormattedLabel id="occurancePlaceF" />,
      field: language == "en" ? "vardiPlace" : "vardiPlaceMr",
      flex: 1,
    },

    // {
    //   headerName: <FormattedLabel id="typeOfVardiIdF" />,
    //   field: language == "en" ? "typeOfVardiId" : "typeOfVardiIdMr",
    //   flex: 1,
    // },
    {
      headerName: <FormattedLabel id="dateAndTimeOfVardiF" />,
      field: "dateAndTimeOfVardi",
      width: 180,
    },
    // For Paginantion Change Code
    {
      field: "paymentStatus",
      headerAlign: "center",
      align: "center",
      // headerName: <FormattedLabel id="actions" />,
      headerName: "Payement Status",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {params.row.isPayment === "Y" ? (
              <Button>
                <CheckCircleIcon color="success" />
              </Button>
            ) : (
              <IconButton
                disabled={params.row.activeFlag === "Y" ? false : true}
                onClick={() => {
                  const record = params.row;
                  router.push({
                    pathname:
                      "/FireBrigadeSystem/transactions/firstAhawal/citizenPaymentScreen/payDetail",
                    query: {
                      pageMode: "Edit",
                      isPayment: "N",
                      ...record,
                    },
                  });
                  ("");
                }}
              >
                <Button
                  size="small"
                  // className={styles.click}
                  // sx={{ color: "white", backgroundColor: "#0000FF" }}
                  sx={{ color: "#0000FF", textTransform: "capitalize" }}
                  // variant="outlined"
                >
                  Pay
                </Button>
              </IconButton>
            )}
            {/* style={{ cursor: "pointer" }} */}
          </Box>
        );
      },
    },
    {
      field: "print",
      headerAlign: "center",
      align: "center",
      // headerName: <FormattedLabel id="actions" />,
      headerName: "Print",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {params.row.isPayment === "Y" ? (
              // <Button>
              //   <CheckCircleIcon color="success" />
              // </Button>
              <IconButton
                disabled={params.row.activeFlag === "Y" ? false : true}
                onClick={() => {
                  const record = params.row;
                  console.log("0000", params.row);

                  router.push({
                    pathname:
                      "/FireBrigadeSystem/transactions/firstAhawal/forPrint",
                    query: {
                      pageMode: "Edit",
                      isPayment: "N",
                      ...record,
                    },
                  });
                  ("");
                }}
              >
                <Button
                  size="small"
                  // className={styles.click}
                  // variant="outlined"
                >
                  <PrintIcon sx={{ color: "black" }} />
                </Button>
              </IconButton>
            ) : (
              // <>Payment Incompleted</>
              <Button
                size="small"
                // className={styles.click}
                // variant="outlined"
                sx={{ color: "#CCD1D1" }}
                readOnly
              >
                <PendingIcon />
              </Button>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <>
      {/* <Box className={styles.tableHead}>
        <Box className={styles.h1Tag}>
          Emergency Services
        </Box>
      </Box> */}
      <Box style={{ height: "100%", width: "100%" }}>
        {/* For Pagination Changes in Code */}
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density="compact"
          sx={{
            paddingLeft: "1%",
            paddingRight: "1%",
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
              backgroundColor: "#87E9F7",
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
    </>
  );
};

export default CitizenPayment;

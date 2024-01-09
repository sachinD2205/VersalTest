import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "./form";
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const {
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const userToken = useGetToken();

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
  //           occurancePlace: r.occurancePlace,
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
  // Get Table - Data
  const getData = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.FbsURL}/transaction/trnOccuranceRegister/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("form data123", res.data.occuranceRegister);
        let _res = res?.data?.occuranceRegister
          // .filter((u) => u.activeFlag === "Y")
          .map((r, i) => {
            console.log("121", r);
            return {
              // required
              srNo: i + 1,
              activeFlag: r.activeFlag,
              id: r.id,

              // add

              dateOfIncident: moment(r?.dateOfIncident).format("DD-MM-YYYY"),

              timeOfIncident: r.timeOfIncident,

              occuranceDetails: r.occuranceDetails,

              occuranceDetailsMr: r.occuranceDetailsMr,

              informerDetails: r.informerDetails,

              informerDetailsMr: r.informerDetailsMr,

              addressOfInformer: r.addressOfInformer,

              addressOfInformeMr: r.addressOfInformeMr,

              incidanceTookPlace: r.incidanceTookPlace,

              incidanceTookPlaceMr: r.incidanceTookPlaceMr,

              damageDetails: r.damageDetails,

              damageDetailsMr: r.damageDetailsMr,

              occuranceWithinPCMCArea: r.occuranceWithinPCMCArea,

              chargesIfOutsidePCMC: r.chargesIfOutsidePCMC,

              detailsDescriptionOfIncidentSite:
                r.detailsDescriptionOfIncidentSite,

              detailsDescriptionOfIncidentSiteMr:
                r.detailsDescriptionOfIncidentSiteMr,

              gEOLocationOfSite: r.gEOLocationOfSite,

              vehicleDetails: r.vehicleDetails,

              ownerName: r.ownerName,

              causeOfFire: r.causeOfFire,

              vardiAhalNumber: r.vardiAhalNumber,
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
      field: "srNo",
      align: "center",
      headerAlign: "center",
      flex: 0.8,
    },
    {
      headerName: <FormattedLabel id="vardiAhalNumber" />,
      field: "vardiAhalNumber",
      flex: 2,
    },
    {
      headerName: <FormattedLabel id="dateOfIncident" />,
      // headerName: "Informer Name",
      field: language == "en" ? "dateOfIncident" : "dateOfIncident",
      flex: 2,
    },
    {
      headerName: <FormattedLabel id="occuranceDetails" />,
      field: language == "en" ? "occuranceDetails" : "occuranceDetailsMr",
      flex: 2,
    },

    {
      field: "informerDetails",
      headerName: <FormattedLabel id="informerDetails" />,
      flex: 2,
    },

    {
      headerName: <FormattedLabel id="detailsDescriptionOfIncidentSiteMr" />,
      field:
        language == "en"
          ? "detailsDescriptionOfIncidentSiteMr"
          : "detailsDescriptionOfIncidentSiteMr",
      flex: 2.9,
    },

    {
      field: "actions",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="actions" />,
      flex: 2,

      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row.activeFlag);
        return (
          <Box>
            <Tooltip title="View">
              <IconButton
                onClick={(e) => {
                  console.log("e", e, "params", params.row);
                  const record = params.row;

                  router.push({
                    pathname:
                      "/FireBrigadeSystem/transactions/occuranceRegister/form",
                    query: {
                      // ...params.row,
                      ...record,
                      mode: "view",
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
              disabled={params.row.activeFlag === "Y" ? false : true}
              onClick={() => {
                // const record = {
                //   ...fromData,
                //   dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
                //     "YYYY-MM-DDThh:mm:ss"
                //   ),
                // };
                const record = params.row;

                router.push({
                  pathname:
                    "/FireBrigadeSystem/transactions/occuranceRegister/form",
                  query: {
                    pageMode: "Edit",
                    // role: "CREATE_APPLICATION",
                    // desg: "DEPT_CLERK",
                    ...record,
                    // slipHandedOverTo: record.slipHandedOverTo == "No" ? 2 : 1,
                    // fireStationName:
                    //   record.fireStationName === "string"
                    //     ? record.fireStationName
                    //         .split(",")
                    //         .map(
                    //           (rec) =>
                    //             fireStation.find((fire) => fire.id == rec)
                    //               ?.fireStationName
                    //         )
                    //     : "",
                  },
                });
                console.log("...record", params.row);
                ("");
              }}
            >
              {/* {params.row.activeFlag == "Y" ? <EditIcon style={{ color: "#556CD6" }} /> : <EditIcon />} */}

              <Button
                size="small"
                // variant="contained"
                // className={styles.click}

                sx={{
                  border: "1px solid #5499C7",
                  backgroundColor: "#ecf0f1",
                }}
              >
                Edit
                <EditIcon style={{ color: "#556CD6" }} />
              </Button>
            </IconButton>
            {/* <IconButton
              style={{ cursor: "pointer" }}
              onClick={() => {
                setBtnSaveText("Update"), setID(params.row.id), console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
              )}
            </IconButton> */}
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id="occuranceBookEntry" />}
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            disabled={buttonInputState}
            onClick={() =>
              router.push({
                pathname:
                  "/FireBrigadeSystem/transactions/occuranceRegister/form",
              })
            }
          >
            <AddIcon size="70" />
          </Button>
        </Box>
      </Box>
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

      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default Index;

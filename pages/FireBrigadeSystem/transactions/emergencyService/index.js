import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
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
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

import { useRouter } from "next/router";
import schema from "./form";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
// import FormattedLabel from "../../../../containers/FB_ReusableComponent/reusableComponents/FormattedLabel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
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
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
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
  }, []);

  useEffect(() => {
    console.log("router.query", router.query);
    getFireStationName();
  }, []);

  const [shifts, setShift] = useState();

  useEffect(() => {
    getShiftData();
  }, []);

  const getShiftData = () => {
    axios
      .get(`${urls.FbsURL}/employeeShiftMaster/getEmployeeShiftMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setShift(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const [load, setLoad] = useState();

  // const handleLoad = () => {
  //   setLoad(false);
  // };

  const [fireStation, setfireStation] = useState();

  // get fire station name
  const getFireStationName = () => {
    axios
      .get(
        `${urls.FbsURL}/fireStationDetailsMaster/getFireStationDetailsMasterData`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log("resss", res.data);
        setfireStation(res?.data);
      });
  };

  // get Vardi Types
  const getVardiTypes = () => {
    axios
      .get(`${urls.FbsURL}/vardiTypeMaster/getVardiTypeMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("vardi Name", res?.data);
        setDataSource(res.data);
        // setDataSource(
        //   res.data.map((r, i) => ({
        //     id: r.id,
        //     vardiName: r.vardiName,
        //   }))
        // );
      });

    // r.data.map((r) => (id: r.id, ));
    // setVardiTypes(vardi);
    // });
  };

  console.log("after vardi Name", dataSource);

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

        console.log("1290", res.data);

        let _res = res?.data?.emergencyService.map((r, i) => ({
          activeFlag: r.activeFlag,
          // role: r.role,
          // desg: r.desg,

          // application date
          // dateAndTimeOfVardi: moment(
          //   r.dateAndTimeOfVardi,
          //   "YYYY-MM-DDTHH:mm:ss"
          // ).format("YYYY-MM-DDTHH:mm:ss"),

          dateOfVardi: moment(r.dateAndTimeOfVardi, "DD-MM-YYYY").format(
            "DD-MM-YYYY"
          ),

          timeOfVardiCol: moment(r.dateAndTimeOfVardi, "HH:mm A").format(
            "HH:mm A"
          ),

          timeOfVardi: moment(r.dateAndTimeOfVardi, "HH:mm:ss").format(
            "HH:mm:ss"
          ),

          //  r?.dateAndTimeOfVardi,

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

          serialNo: i + 1 + _pageNo * _pageSize,

          id: r.id,
          // Informer Details
          vardiTypeId: r?.vardiSlip?.id,
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
          otherVardiType: r?.vardiSlip?.otherVardiType,
          // subTypesOfVardi: r?.vardiSlip?.subTypesOfVardi,
          slipHandedOverTo: r?.vardiSlip?.slipHandedOverTo == 2 ? "No" : "Yes",
          // fireStationName: r?.vardiSlip?.fireStationName,
          // employeeName: r?.vardiSlip?.employeeName,
          fireStationName: r?.vardiSlip?.fireStationName
            ? r?.vardiSlip?.fireStationName
            : "Not Available",
          // employeeName: r?.vardiSlip?.employeeName ? r?.vardiSlip?.employeeName : "Not Available",
          employeeName: r?.vardiSlip?.employeeName
            ? r?.vardiSlip?.employeeName
            : "Not Available",

          vardiTime: r?.vardiSlip?.vardiTime,
          shift: r?.vardiSlip?.shift,

          // shiftColEn: shifts.find((s) => s.id == r?.vardiSlip?.shift)
          //   ?.shiftName,

          // shiftColMr: shifts.find((s) => s.id == r?.vardiSlip?.shift)
          //   ?.shiftNameMr,

          // fireStationName: fireStation.find((f) => f.id == r?.vardiSlip?.employeeName)?.fireStationName,

          // typeOfVardiId: vardiTypes[r.typeOfVardiId]
          //   ? vardiTypes[r.typeOfVardiId]
          //   : "-",

          // typeOfVardiId: dataSource?.find((obj) => {
          //   console.log("obj", obj);
          //   return obj.id === r.typeOfVardiId;
          // })?.vardiName
          //   ? dataSource?.find((obj) => {
          //       return obj.id === r.typeOfVardiId;
          //     })?.vardiName
          //   : "-",

          // slipHandedOverTo: dataSource?.find((obj) => {
          //   console.log("obj", obj);
          //   return obj.id === r.typeOfVardiId;
          // })?.vardiName
          //   ? dataSource?.find((obj) => {
          //       return obj.id === r.typeOfVardiId;
          //     })?.vardiName
          //   : "-",

          // slipHandedOverToMr: r?.vardiSlip?.slipHandedOverToMr,

          // otherReasonOfFire: r?.vardiSlip?.otherReasonOfFire,
          // isLossInAmount: r?.vardiSlip?.isLossInAmount,
          // dateAndTimeOfVardi: moment(
          //   r.dateAndTimeOfVardi,
          //   "YYYY-MM-DD HH:mm:ss"
          // ).format("DD-MM-YYYY hh:mm a"),
        }));

        // YYYY-MM-DDThh:mm:ss
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((err) => {
        setLoad(false);

        console.log("err", err);
      });
  };

  // Delete
  // const deleteById = (value, _activeFlag) => {
  //   let body = {
  //     activeFlag: _activeFlag,
  //     id: value,
  //   };
  //   console.log("body", body);
  //   if (_activeFlag === "N") {
  //     swal({
  //       title: "Inactivate?",
  //       text: "Are you sure you want to inactivate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios
  //           .post(`${urls.FbsURL}/transaction/trnEmergencyServices/save`, body)
  //           .then((res) => {
  //             console.log("delet res", res);
  //             if (res.status == 200) {
  //               setEditButtonInputState(true);
  //               swal("Record is Successfully Deleted!", {
  //                 icon: "success",
  //               });
  //               // getSubType()
  //               getData();
  //             }
  //           });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   } else {
  //     swal({
  //       title: "Activate?",
  //       text: "Are you sure you want to activate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios
  //           .post(`${urls.FbsURL}/transaction/trnEmergencyServices/save`, body)
  //           .then((res) => {
  //             console.log("delet res", res);
  //             if (res.status == 200) {
  //               setEditButtonInputState(false);
  //               swal("Record is Successfully Activated!", {
  //                 icon: "success",
  //               });
  //               // getSubType()
  //               getData();
  //             }
  //           });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   }
  // };

  // View Record
  const viewRecord = (record) => {
    console.log("rec", record);
    router.push({
      pathname: "/FireBrigadeSystem/transactions/emergencyService/form",
      query: {
        btnSaveText: "Update",
        pageMode: "Edit",
        ...record,
        slipHandedOverTo: record.slipHandedOverTo,
      },
    });
  };

  // define colums table
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
      flex: 1.2,
    },
    {
      field: "contactNumber",
      headerName: <FormattedLabel id="contactNumberF" />,
      flex: 1,
    },
    {
      headerName: <FormattedLabel id="areaEn" />,
      field: language == "en" ? "area" : "areaMr",
      flex: 0.8,
    },
    {
      headerName: <FormattedLabel id="occurancePlaceF" />,
      field: language == "en" ? "vardiPlace" : "vardiPlaceMr",
      flex: 0.8,
    },
    {
      headerName: <FormattedLabel id="dateOfVardi" />,
      field: "dateOfVardi",
      flex: 0.6,
      // align: "center",
      // headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="timeOfVardi" />,
      field: "timeOfVardiCol",
      flex: 0.6,
      // align: "center",
      // headerAlign: "center",
    },

    {
      headerName: "Slip Handed Over To",
      flex: 1,
      align: "center",
      field: "slipHandedOverTo",
    },

    // For Paginantion Change Code
    {
      field: "actions",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.8,
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
                  router.push({
                    pathname:
                      "/FireBrigadeSystem/transactions/emergencyService/form",
                    query: {
                      ...params.row,
                      mode: "view",
                      pageMode: "View",
                      slipHandedOverTo:
                        params.row.slipHandedOverTo == "No" ? 2 : 1,
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
                    "/FireBrigadeSystem/transactions/emergencyService/form",
                  query: {
                    pageMode: "Edit",
                    role: "CREATE_APPLICATION",
                    desg: "DEPT_CLERK",
                    ...record,
                    slipHandedOverTo: record.slipHandedOverTo == "No" ? 2 : 1,
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
            {<FormattedLabel id="emergencyServices" />}
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
                  "/FireBrigadeSystem/transactions/emergencyService/form",
              })
            }
          >
            <AddIcon size="70" />
          </Button>
        </Box>
      </Box>
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color='inherit' />
      </Backdrop> */}
      {load && <Loader />}
      <Box style={{ height: "100%", width: "100%" }}>
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          components={{ Toolbar: GridToolbar }}
          // autoHeight
          autoHeight={data.pageSize}
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
    </>
  );
};

export default Index;

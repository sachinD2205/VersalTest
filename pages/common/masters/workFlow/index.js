import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

import { useRouter } from "next/router";
import schema from "./form";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useSelector } from "react-redux";
// import FormattedLabel from "../../../../containers/FB_ReusableComponent/reusableComponents/FormattedLabel";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

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

  useEffect(() => {
    getData();
  }, [dataSource]);

  const [fireStation, setfireStation] = useState();

  // get fire station name
  const getFireStationName = () => {
    axios.get(`${urls.FbsURL}/fireStationDetailsMaster/getFireStationDetailsMasterData`).then((res) => {
      console.log("resss", res.data);
      setfireStation(res?.data);
    });
  };

  // get Vardi Types
  const getVardiTypes = () => {
    axios.get(`${urls.FbsURL}/vardiTypeMaster/getVardiTypeMasterData`).then((res) => {
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
  const getData = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.CFCURL}/master/workFlow/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log("12", res.data.workFlow);

        let _res = res?.data?.workFlow.map((data, i) => ({
          activeFlag: data.activeFlag,
          srNo: i + 1 + _pageNo * _pageSize,

          moduleId: data.moduleId,
          applicationId: data.applicationId,
          departmentId: data.departmentId,
          serviceId: data.serviceId,
          serviceTypeId: data.serviceTypeId,
          zoneId: data.zoneId,
          wardId: data.wardId,
          isZoneWardApplicable: data.isZoneWardApplicable,
          workFlowStepsDaoLst: data.workFlowStepsDaoLst,
        }));

        // YYYY-MM-DDThh:mm:ss
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
          axios.post(`${urls.FbsURL}/transaction/trnEmergencyServices/save`, body).then((res) => {
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
          axios.post(`${urls.FbsURL}/transaction/trnEmergencyServices/save`, body).then((res) => {
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
      // flex: 1,
      width: 100,
    },
    {
      //   headerName: <FormattedLabel id="informerNameF" />,
      headerName: "Module Name",
      field: "moduleId",
      flex: 1,
      width: 150,
    },
    {
      headerName: <FormattedLabel id="applicationName" />,
      field: "applicationId",
      flex: 1,
      width: 130,
    },

    {
      field: "departmentId",
      headerName: <FormattedLabel id="departmentName" />,
      flex: 1,
    },
    {
      headerName: <FormattedLabel id="serviceName" />,
      field: "serviceId",
      flex: 1,
      width: 100,
    },

    // {
    //   headerName: <FormattedLabel id="vardiPlaceF" />,
    //   field: language == "en" ? "vardiPlace" : "vardiPlaceMr",
    //   flex: 1,
    // },
    // {
    //   headerName: <FormattedLabel id="typeOfVardiIdF" />,
    //   field: language == "en" ? "typeOfVardiId" : "typeOfVardiIdMr",
    //   flex: 1,
    // },

    // For Paginantion Change Code
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row.activeFlag);
        return (
          <Box>
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
                  pathname: "/FireBrigadeSystem/transactions/emergencyService/form",
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
              {params.row.activeFlag == "Y" ? <EditIcon style={{ color: "#556CD6" }} /> : <EditIcon />}
            </IconButton>
            <IconButton
              style={{ cursor: "pointer" }}
              onClick={() => {
                setBtnSaveText("Update"), setID(params.row.id), console.log("params.row: ", params.row);
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
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>{<FormattedLabel id="emergencyServices" />}</Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            disabled={buttonInputState}
            onClick={() =>
              router.push({
                pathname: "/common/masters/workFlow/form",
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
          getRowId={(row) => row.srNo}
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

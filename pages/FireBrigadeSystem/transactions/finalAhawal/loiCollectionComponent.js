import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";

import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

// import schema from "./form";

import { useRouter } from "next/router";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import FormattedLabel from "../../../../containers/FB_ReusableComponent/reusableComponents/FormattedLabel";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const {
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
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
  }, []);

  useEffect(() => {
    console.log("router.query", router.query);
  }, []);

  useEffect(() => {
    getData();
  }, [dataSource]);

  // get Vardi Types
  const getVardiTypes = () => {
    axios
      .get(`${urls.BaseURL}/vardiTypeMaster/getVardiTypeMasterData`, {
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
  const getData = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.FbsURL}/trnLoi/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("form data", res.data.loii);

        let _res = res?.data?.loii.map((r, i) => ({
          activeFlag: r.activeFlag,
          id: r.id,
          serialNo: r.id,
          informerName: r.informerName,
          informerNameMr: r.informerNameMr,
          informerMiddleName: r.informerMiddleName,
          informerMiddleNameMr: r.informerMiddleNameMr,
          informerLastName: r.informerLastName,
          informerLastNameMr: r.informerLastNameMr,
          contactNumber: r.contactNumber,
          occurancePlace: r.occurancePlace,
          occurancePlaceMr: r.occurancePlaceMr,
          area: r.area,
          areaMr: r.areaMr,
          landmark: r.landmark,
          landmarkMr: r.landmarkMr,
          city: r.city,
          cityMr: r.cityMr,
          pinCode: r.pinCode,
          fireStationName: r.fireStationName,
        }));

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
  const viewRecord = (record) => {
    console.log("rec", record);
    router.push({
      pathname: "/FireBrigadeSystem/transactions/emergencyService/form",
      query: {
        btnSaveText: "Update",
        pageMode: "Edit",
        ...record,
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
      headerName: "Service Charge",
      field: "serviceCharge",
      width: 200,
    },
    // {
    //   headerName: <FormattedLabel id="typeOfVardiIdF" />,
    //   field: language == "en" ? "typeOfVardiId" : "typeOfVardiIdMr",
    //   flex: 1,
    // },
    {
      headerName: "Amount",
      field: "total",
      width: 200,
    },
    // For Paginantion Change Code
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params);
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
                  pathname:
                    "/FireBrigadeSystem/transactions/emergencyService/form",
                  query: {
                    pageMode: "Edit",
                    ...record,
                  },
                });
                console.log("row", params.row);
                ("");
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <EditIcon style={{ color: "#556CD6" }} />
              ) : (
                <EditIcon />
              )}
            </IconButton>
            <IconButton
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
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Box style={{ display: "flex", marginTop: "2%" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            <Typography
              sx={{
                color: "white",
                padding: "2%",
                typography: {
                  xs: "body1",
                  sm: "h6",
                  md: "h5",
                  lg: "h4",
                  xl: "h3",
                },
              }}
            >
              {/* {<FormattedLabel id="emergencyServices" />} */}
              Loi Collection
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box style={{ height: 400, width: "100%" }}>
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

export default Index;

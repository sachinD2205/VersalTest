import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import urls from "../../../../URLS/urls";

//
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "./form";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const {
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  const router = useRouter();

  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [vardiTypes, setVardiTypes] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState([]);
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
      .get(`${urls.BaseURL}/transaction/fireAttendanceCertificate/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("r", r);
        let result = r.data;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            // activeFlag: r.activeFlag,
            // id: r.id,
            // serialNo: r.id,
            // applicantName: r.applicantName,
            // applicantNameMr: r.applicantNameMr,
            // applicantMiddleName: r.applicantMiddleName,
            // applicantMiddleNameMr: r.applicantMiddleNameMr,
            // applicantLastName: r.applicantLastName,
            // applicantLastNameMr: r.applicantLastNameMr,
            // applicantAddress: r.applicantAddress,
            // applicantAddressMr: r.applicantAddressMr,
            // mobileNo: r.mobileNo,
            // bussinessAddress: r.bussinessAddress,
            // bussinessAddressMr: r.bussinessAddressMr,
            // typeOfBussinessMr: r.typeOfBussinessMr,
            // documentName: r.documentName,
            // remark: r.remark,
            // mobileNo: r.mobileNo,
            // typeOfBussiness: r.typeOfBussiness,
            // typeOfVardiId: vardiTypes[r.typeOfVardiId]
            //   ? vardiTypes[r.typeOfVardiId]
            //   : "-",
            // advocateName1: advocateNames?.find(
            //   (obj) => obj.id === r.advocateName
            // )?.advocateName,
            // advocateNameMr: advocateNames?.find(
            //   (obj) => obj.id === r.advocateName
            // )?.advocateNameMr,
            // dateOfApplication: moment(r.dateOfApplication).format("YYYY-MM-DD"),
            // status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        // setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  // Delete
  const deleteById = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // await
        axios
          .delete(
            `${urls.BaseURL}/transaction/trnEmergencyServices/discardTrnEmergencyServices/${value}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getData();
              setButtonInputState(false);
            } else {
              swal("Record is Safe");
            }
          });
      }
    });
  };

  // View Record
  const viewRecord = (record) => {
    console.log("rec", record);
    router.push({
      pathname:
        "/FireBrigadeSystem/transactions/fireAttendanceCertificate/form",
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
      field: "contactNumber",
      headerName: <FormattedLabel id="contactNumberF" />,
      flex: 1,
    },

    {
      headerName: <FormattedLabel id="occurancePlaceF" />,
      field: language == "en" ? "occurancePlace" : "occurancePlaceMr",
      flex: 1,
    },
    {
      headerName: <FormattedLabel id="typeOfVardiIdF" />,
      field: language == "en" ? "typeOfVardiId" : "typeOfVardiIdMr",
      flex: 1,
    },
    {
      headerName: <FormattedLabel id="dateAndTimeOfVardiF" />,
      field: "dateAndTimeOfVardi",
      width: 200,

      // flex: 1,
    },

    {
      field: "actions",
      headerAlign: "center",

      headerName: <FormattedLabel id="actions" />,
      // width: "160",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <IconButton
              className={btnStyles.edit}
              disabled={editButtonInputState}
              onClick={() => {
                console.log("Record", record);
                viewRecord(record.row);
                setBtnSaveText("Update");
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              className={btnStyles.delete}
              disabled={deleteButtonInputState}
              onClick={() => deleteById(record.id)}
            >
              <DeleteIcon />
            </IconButton>
            <br />
            {/* <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(record.id)}
            >
              <DeleteIcon className={styles.delete} />
              <br />
            </IconButton> */}
          </>
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
              {/* {<FormattedLabel id="fireAttendanceCertificate" />} */}
              Fire Attendance Certificate
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            sx={{
              borderRadius: 100,
              padding: 2,
              marginLeft: 1,
              textAlign: "center",
              border: "2px solid #3498DB",
            }}
            disabled={buttonInputState}
            onClick={() =>
              router.push({
                pathname:
                  "/FireBrigadeSystem/transactions/fireAttendanceCertificate/form",
              })
            }
          >
            <AddIcon />
          </Button>
        </Box>
      </Box>
      <Box style={{ height: 400, width: "100%" }}>
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
          // loading={data.loading}
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            // getCaseType(data.pageSize, _data);
            getAllCaseEntry(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getAllCaseEntry(_data, data.page);
          }}
        />
      </Box>
    </>
  );
};

export default Index;

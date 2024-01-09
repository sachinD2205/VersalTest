import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  // Card,
  // Checkbox,
  // FormControl,
  // FormControlLabel,
  // FormHelperText,
  // FormLabel,
  // Grid,
  // InputLabel,
  // MenuItem,
  // Radio,
  // RadioGroup,
  // Select,
  // TextField,
  Paper,
  Typography,
} from "@mui/material";
// import * as yup from 'yup'
import { Box } from "@mui/system";
import { DataGrid, GridToolbar, GridViewStreamIcon } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import schema from "../../../../containers/schema/fireBrigadeSystem/iodFireNocReport";
import urls from "../../../../URLS/urls";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const userToken = useGetToken();

  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();

  const [btnSaveText, setBtnSaveText] = useState("Save");

  const [editButtonInputState, setEditButtonInputState] = useState(false);

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // useEffect(() => {
  //   getCourtName();
  //   getAdvocateName();
  //   getCaseTypes();
  //   getCaseSubType();
  //   getYears();
  //   getDepartmentName();
  // }, []);

  useEffect(() => {
    console.log("dataSource=>", dataSource);
  }, [dataSource]);

  useEffect(() => {
    getAllCaseEntry();
  }, []);

  // get Table Data
  useEffect(() => {
    console.log("advocateName", advocateNames);
  }, []);

  useEffect(() => {
    getBusinessTypes();
  }, []);

  const [businessTypes, setBusinessTypes] = useState();

  // getBusiness Types
  // const getBusinessTypes = () => {
  //   axios
  //     .get(`${urls.FbsURL}/typeOfBusinessMaster/getTypeOfBusinessMasterData`)
  //     .then((r) => {
  //       let business = {};
  //       r.data.map((r) => (business[r.id] = r.typeOfBusiness));
  //       setBusinessTypes(business);
  //     });
  // };

  const getBusinessTypes = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBusinessMaster/getTypeOfBusinessMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("business Data", res?.data);
        setBusinessTypes(
          // res?.data.map((r) => ({
          //   typeOfBusiness: r.typeOfBusiness,
          //   id: r.id,
          // }))
          res?.data
        );
      });
  };

  console.log("id", businessTypes);

  const getAllCaseEntry = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.FbsURL}/trnIODFireNOC/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        // console.log("r", r);
        // let result = r.iodfireNOC;
        // console.log("result", result);
        let _res = r.data.iodfireNOC.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,
            serialNo: r.id,
            applicantName: r.applicantName,
            applicantNameMr: r.applicantNameMr,
            applicantMiddleName: r.applicantMiddleName,
            applicantMiddleNameMr: r.applicantMiddleNameMr,
            applicantLastName: r.applicantLastName,
            applicantLastNameMr: r.applicantLastNameMr,
            applicantAddress: r.applicantAddress,
            applicantAddressMr: r.applicantAddressMr,
            mobileNo: r.mobileNo,
            bussinessAddress: r.bussinessAddress,
            bussinessAddressMr: r.bussinessAddressMr,
            typeOfBussinessMr: r.typeOfBussinessMr,
            documentName: r.documentName,
            remark: r.remark,
            mobileNo: r.mobileNo,
            typeOfBussiness: r.typeOfBussiness,
            // idB: r.typeOfBussiness,

            // typeOfBusiness:
            //   businessTypes &&
            //   businessTypes.map((b) => (b.id == idB ? b.typeOfBusiness : "-")),

            // typeOfBussiness: businessTypes[r.typeOfBussiness]
            //   ? businessTypes[r.typeOfBussiness]
            //   : "-",

            // advocateName1: advocateNames?.find(
            //   (obj) => obj.id === r.advocateName
            // )?.advocateName,

            // advocateNameMr: advocateNames?.find(
            //   (obj) => obj.id === r.advocateName
            // )?.advocateNameMr,

            dateOfApplication: moment(r.dateOfApplication).format("YYYY-MM-DD"),

            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  // get Court Name
  const getCourtName = () => {
    axios
      .get(`${urls.LCMSURL}/master/court/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setCourtNames(
          res.data.court.map((r, i) => ({
            id: r.id,
            courtName: r.courtName,
            courtMr: r.courtMr,
          }))
        );
      });
  };

  // getAdvocateName
  // const getAdvocateName = () => {
  //   axios
  //     .get(`http://localhost:8098/lc/api/advocate/getAdvocateData`)
  //     .then((res) => {
  //       setAdvocateNames(
  //         res.data.map((r, i) => ({
  //           id: r.id,
  //           advocateName: r.firstName + " " + r.middleName + " " + r.lastName,
  //         }))
  //       );
  //     });
  // };

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
            .post(`${urls.FbsURL}/trnIODFireNOC/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getAllCaseEntry();
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
            .post(`${urls.FbsURL}/trnIODFireNOC/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getSubType()
                getAllCaseEntry();
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Edit Record
  const actionOnRecord = (record, pageMode) => {
    console.log("Record : ---> ", record);
    router.push({
      pathname: "/FireBrigadeSystem/transactions/businessNoc",
      query: {
        pageMode: pageMode,
        ...record,
      },
    });
  };

  // add Hearing

  const addHearing = (record) => {
    console.log("All Records", record);
    router.push({
      pathname: "/FireBrigadeSystem/transactions/businessNoc/form",
      query: {
        pageMode: "addHearing",
        ...record,
        caseEntry: record.id,
      },
    });
  };
  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      width: 50,
    },
    {
      field: "dateOfApplication",
      headerName: <FormattedLabel id="dateOfApplication" />,
      width: 140,
    },
    {
      headerName: <FormattedLabel id="applicantName" />,
      field: language == "en" ? "applicantName" : "applicantNameMr",
      width: 130,
    },
    {
      headerName: <FormattedLabel id="applicantAddressF" />,
      field: language == "en" ? "applicantAddress" : "applicantAddressMr",
      width: 140,
      flex: 1,
    },
    {
      headerName: <FormattedLabel id="mobileNo" />,
      field: "mobileNo",
      width: 110,
    },
    {
      headerName: <FormattedLabel id="typeOfBussiness" />,
      width: 130,
      field: language == "en" ? "typeOfBussiness" : "typeOfBussinessMr",
    },
    {
      headerName: <FormattedLabel id="bussinessAddressF" />,
      width: 150,
      field: language == "en" ? "bussinessAddress" : "bussinessAddressMr",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {console.log(
              "22",
              language === "en" ? "caseMainType" : "caseMainTypeMr"
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                const record = params.row;

                router.push({
                  pathname: "/FireBrigadeSystem/transactions/businessNoc/form",
                  query: {
                    pageMode: "Edit",
                    ...record,
                  },
                });
                console.log("row", params.row);
                ("");
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
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
              {<FormattedLabel id="iodFireNoc" />}
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
            // disabled={buttonInputState}
            onClick={() =>
              router.push({
                pathname: "/FireBrigadeSystem/transactions/iodFireNoc/form",
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

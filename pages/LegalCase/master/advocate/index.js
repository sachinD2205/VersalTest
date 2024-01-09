import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import theme from "../../../../theme.js";

import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  ThemeProvider,
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
import { useForm } from "react-hook-form";
import {
  bankDetailsSchema,
  advocateDetailsSchema,
} from "../../../../containers/schema/LegalCaseSchema/advocateSchema";

import Loader from "../../../../containers/Layout/components/Loader";

import urls from "../../../../URLS/urls";
import { setLocale } from "yup";

// import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";

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
    resolver: yupResolver(),
    mode: "onChange",
  });

  const language = useSelector((state) => state.labels.language);
  const [loadderState, setLoadderState] = useState(true);

  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [titles, settitles] = useState([]);
  const [dataValidation, setDataValidation] = useState(advocateDetailsSchema);

  const token = useSelector((state) => state.user.user.token);

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
  // useEffect(() => {
  //   console.log('steps', activeStep)
  //   if (activeStep == '0') {
  //     setDataValidation(advocateDetailsSchema)
  //   } else if (activeStep == '1') {
  //     setDataValidation(bankDetailsSchema)
  //   }
  // }, [activeStep])

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    localStorage.removeItem("mstAdvocateAttachmentDao");
    getCourtName();
    getAdvocateName();
    getCaseTypes();
    getCaseSubType();
    getYears();
    getDepartmentName();
    gettitles();
  }, []);

  useEffect(() => {
    //     if(dataSource?.mstAdvocateAttachmentDao != null || dataSource?.mstAdvocateAttachmentDao
    // != ""||  dataSource?.mstAdvocateAttachmentDao != undefined    ){
    //   localStorage.setItem("mstAdvocateAttachmentDao",dataSource?.mstAdvocateAttachmentDao
    //   )
    // }
    console.log("dataSource=>", dataSource);
  }, [dataSource]);

  useEffect(() => {
    getAdvocate();
  }, [courtNames, advocateNames, titles]);

  useEffect(() => {
    console.log("advocateName", advocateNames);
  }, []);

  const getAdvocate = () => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LCMSURL}/master/advocate/getAllForMaster`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // params: {
        //   pageSize: _pageSize,
        //   pageNo: _pageNo,
        // },
      })
      .then((r) => {
        console.log("r", r);

        setLoadderState(false);

        let result = r.data.advocate;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,

            // srNo: i + 1,
            srNo: i + 1,

            FullName: r.firstName + " " + r.middleName + " " + r.lastName,
            FullNameMr:
              r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
            firstName: r.firstName,
            firstNameMr: r.firstNameMr,
            middleName: r.middleName,
            middleNameMr: r.middleNameMr,
            lastName: r.lastName,
            lastNameMr: r.lastNameMr,

            nameOfBarCouncil: r.nameOfBarCouncil,
            nameOfBarCouncilMr: r.nameOfBarCouncilMr,

            address: r.area + " " + r.city + " " + r.pinCode,
            addressMr: r.areaMr + " " + r.cityMr + " " + r.pinCode,

            mobileNo: r.mobileNo,

            advocateCategory: r.advocateCategory,

            title: r.title,

            aadhaarNo: r.aadhaarNo,
            panNo: r.panNo,
            nameOfBarCouncil: r.nameOfBarCouncil,
            nameOfBarCouncilMr: r.nameOfBarCouncilMr,
            bankName: r.bankName,
            branchName: r.branchName,
            accountNo: r.accountNo,
            bankIFSCCode: r.bankIFSCCode,
            bankMICRCode: r.bankMICRCode,
            city: r.city,
            cityMr: r.cityMr,
            area: r.area,
            areaMr: r.areaMr,
            roadName: r.roadName,
            roadNameMr: r.roadNameMr,
            landmark: r.landmark,
            landmarkMr: r.landmarkMr,
            pinCode: r.pinCode,
            phoneNo: r.phoneNo,
            mobileNo: r.mobileNo,
            emailAddress: r.emailAddress,

            // mstAdvocateAttachmentDao: JSON.stringify(
            //   r.mstAdvocateAttachmentDao.map((r, i) => {
            //     return { ...r, srNo: i + 1 };
            //   }),
            // ),

            mstAdvocateAttachmentDao: r.mstAdvocateAttachmentDao,

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
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Court Name
  const getCourtName = () => {
    axios
      .get(`${urls.LCMSURL}/master/court/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getAdvocateName = () => {
    axios
      .get(`${urls.LCMSURL}/master/advocate/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAdvocateNames(
          res.data.advocate.map((r, i) => ({
            id: r.id,
            advocateName: r.firstName + " " + r.middleName + " " + r.lastName,
            advocateNameMr:
              r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const [departmentNames, setDepartmentNames] = useState([]);

  const getDepartmentName = () => {
    axios
      .get(`${urls.LCMSURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartmentNames(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Title
  const gettitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("22", res);
        settitles(
          res.data.title.map((r, i) => ({
            id: r.id,
            title: r.title,
            titleMr: r.titleMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

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
            .post(`${urls.LCMSURL}/master/advocate/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getAdvocate();
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
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
            .post(`${urls.LCMSURL}/master/advocate/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Safe", {
                  icon: "success",
                });
                // getSubType()
                getAdvocate();
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // get Case Type
  const [caseTypes, setCaseTypes] = useState([]);

  const getCaseTypes = () => {
    axios
      .get(`${urls.LCMSURL}/caseMainType/getCaseMainTypeData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCaseTypes(
          res.data.map((r, i) => ({
            id: r.id,
            caseMainType: r.caseMainType,
          }))
        );
      });
    // ?.catch((err) => {
    //   console.log("err", err);
    //   callCatchMethod(err, language);
    // });
  };

  const [caseSubTypes, setCaseSubTypes] = useState([]);

  const getCaseSubType = () => {
    axios
      .get(`${urls.LCMSURL}/CaseSubType/getCaseSubTypeData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCaseSubTypes(
          res.data.map((r, i) => ({
            id: r.id,
            subType: r.subType,
          }))
        );
      });
    // ?.catch((err) => {
    //   console.log("err", err);
    //   callCatchMethod(err, language);
    // });
  };

  const [years, setYears] = useState([]);

  const getYears = () => {
    axios
      .get(`${urls.LCMSURL}/master/year/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setYears(
          res.data.year.map((r, i) => ({
            id: r.id,
            year: r.year,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Edit Record
  const actionOnRecord = (record, pageMode) => {
    console.log("Record : ---> ", record);
    router.push({
      pathname: "/LegalCase/master/advocate/view",
      query: {
        pageMode: pageMode,
        ...record,
      },
    });
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      // width: 120,
    },
    {
      field: language === "en" ? "FullName" : "FullNameMr",
      align: "center",
      headerAlign: "center",

      headerName: <FormattedLabel id="name" />,
      width: 250,
    },
    // {
    //   field:"advocateCategory",
    //   headerName: <FormattedLabel id="advocateCategory" />,
    //   width: 200,
    // },
    {
      // field: language === 'en' ? 'fullNameEn' : 'fullNameMr',

      // field:"nameOfBarCouncil",

      field: language === "en" ? "nameOfBarCouncil" : "nameOfBarCouncilMr",
      align: "center",
      headerAlign: "center",

      headerName: <FormattedLabel id="nameOfBarCouncil" />,
      width: 250,
    },

    {
      field: "mobileNo",

      headerName: <FormattedLabel id="mobile" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      // headerName: "Actions",
      headerName: <FormattedLabel id="actions" />,
      // width:200,
      flex: 1,
      align: "center",
      headerAlign: "center",
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
                const mstAdvocateAttachmentDao = JSON.stringify(
                  record?.mstAdvocateAttachmentDao?.map((r, i) => {
                    return { ...r, srNo: i + 1 };
                  })
                );

                localStorage.setItem(
                  "mstAdvocateAttachmentDao",
                  mstAdvocateAttachmentDao
                );

                console.log("record123", record?.row);
                router.push({
                  pathname: "/LegalCase/master/advocate/view",
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
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  // setButtonInputState(true);
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

            {/* for View Icon */}

            {/* <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                alert("View Icon");
                const record = params.row;
                const mstAdvocateAttachmentDao = JSON.stringify(
                  record?.mstAdvocateAttachmentDao?.map((r, i) => {
                    return { ...r, srNo: i + 1 };
                  })
                );

                localStorage.setItem(
                  "mstAdvocateAttachmentDao",
                  mstAdvocateAttachmentDao
                );

                router.push({
                  pathname: "/LegalCase/master/advocate/view",
                  query: {
                    pageMode: "View",
                    ...record,
                  },
                });
                console.log(":...row", params.row);
                ("");
              }}
            >
              <EyeFilled style={{ color: "#556CD6" }} />
            </IconButton> */}
          </Box>
        );
      },
    },
  ];

  useEffect(() => {}, [loadderState]);

  return (
    <>
      {/* <ThemeProvider theme={theme}> */}
      <div>
        <BreadcrumbComponent />
      </div>

      {/* Loader */}

      {loadderState ? (
        <Loader />
      ) : (
        // <div
        //     style={{
        //       display: "flex",
        //       justifyContent: "center",
        //       alignItems: "center",
        //       height: "60vh", // Adjust itasper requirement.
        //     }}
        //   >
        //     <Paper
        //       style={{
        //         display: "flex",
        //         justifyContent: "center",
        //         alignItems: "center",
        //         background: "white",
        //         borderRadius: "50%",
        //         padding: 8,
        //       }}
        //       elevation={8}
        //     >
        //       <CircularProgress color="success" />
        //     </Paper>
        //   </div>

        <>
          <Paper
            elevation={8}
            variant="outlined"
            sx={{
              // border: 1,
              // borderColor: "grey.500",
              border: "1px solid",
              borderColor: "blue",
              // marginLeft: "10px",
              marginRight: "10px",
              marginTop: "10px",
              marginBottom: "60px",
              padding: 1,
            }}
          >
            <Box
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              //   paddingTop: "10px",
              //   // backgroundColor:'#0E4C92'
              //   // backgroundColor:'		#0F52BA'
              //   // backgroundColor:'		#0F52BA'
              //   background:
              //     "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              // }}

              style={{
                // backgroundColor: "#0084ff",
                backgroundColor: "#556CD6",
                // backgroundColor: "#1C39BB",

                // #00308F
                color: "white",
                display: "flex",
                justifyContent: "center",
                // fontSize: 19,
                // marginTop: 30,
                // marginBottom: "50px",
                // // marginTop: ,
                // padding: 8,
                // paddingLeft: 30,
                // marginLeft: "50px",
                // marginRight: "75px",
                borderRadius: 100,
                height: "8vh",
              }}
            >
              <h2
                style={{
                  color: "white",

                  marginTop: "1vh",
                }}
              >
                <FormattedLabel id="advocate" />
              </h2>
            </Box>

            <Divider />
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                  marginTop: 10,
                  marginRight: "9px",
                }}
              >
                <Button
                  // type="primary"
                  variant="contained"
                  onClick={() => {
                    localStorage.removeItem("MstAdvocateAttachmentDao"),
                      router.push(`/LegalCase/master/advocate/view`);
                  }}
                >
                  <FormattedLabel id="add" />
                </Button>
              </div>

              {/* </Paper> */}

              {/* New Table */}
              <Box
                sx={{
                  height: "100%",
                  marginTop: "10px",
                  // border:"color: red",
                  // width: 1000,
                  // marginLeft: 10,

                  // width: '100%',

                  // overflowX: 'auto',
                }}
              >
                <DataGrid
                  // disableColumnFilter
                  // disableColumnSelector
                  // disableToolbarButton
                  // disableDensitySelector
                  components={{ Toolbar: GridToolbar }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                      printOptions: { disableToolbarButton: true },
                      // disableExport: true,
                      // disableToolbarButton: true,
                      // csvOptions: { disableToolbarButton: true },
                    },
                  }}
                  autoHeight
                  sx={{
                    // marginLeft: 5,
                    // marginRight: 5,
                    // marginTop: 5,
                    // marginBottom: 5,
                    border: "1px solid",
                    borderColor: "blue",

                    overflowY: "scroll",

                    "& .MuiDataGrid-virtualScrollerContent": {},
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },

                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  density="compact"
                  // autoHeight={true}
                  // rowHeight={50}

                  // loading={data.loading}

                  // rowsPerPageOptions={data.rowsPerPageOptions}
                  // rowsPerPageOptions={[5]}

                  // pageSize={data.pageSize}
                  // pageSize={10}
                  rows={data.rows}
                  columns={columns}
                  // ***

                  // For Search Function
                  pageSize={10}
                  rowsPerPageOptions={[10]}

                  // ***
                  // onPageChange={(_data) => {
                  //   // getCaseType(data.pageSize, _data);
                  //   getAdvocate(data.pageSize, _data);
                  // }}
                  // onPageSizeChange={(_data) => {
                  //   console.log("222", _data);
                  //   // updateData("page", 1);
                  //   getAdvocate(_data, data.page);
                  // }}
                />
              </Box>
            </div>
          </Paper>
        </>
      )}

      {/* </ThemeProvider> */}
    </>
  );
};

export default Index;

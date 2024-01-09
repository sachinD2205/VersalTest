import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PostAddIcon from "@mui/icons-material/PostAdd";

import {
  Button,
  Divider,
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
  Tooltip,
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
import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
import urls from "../../../../URLS/urls";
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
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();
  const [concenDeptNames, setconcenDeptName] = useState([]);

  const [officeName, setOfficeName] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState("Save");

  const [editButtonInputState, setEditButtonInputState] = useState(false);

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

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getDeptName();
    getOfficeName();
  }, []);

  useEffect(() => {
    getAllOpinion();
  }, [concenDeptNames, officeName]);

  useEffect(() => {
    console.log("advocateName", advocateNames);
  }, []);

  const getAllOpinion = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LCMSURL}/transaction/opinion/getByAdvocateAllDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
          // role: 'CITIZEN',
        },
        // params: {
        //   pageSize: _pageSize,
        //   pageNo: _pageNo,
        // },
      })
      .then((r) => {
        console.log("r", r);
        let result = r.data;
        console.log("result", result);

        let _res = result
          // .filter((r) => {
          // if (r.opinionAdvPanelList.length > 0) {
          //   console.log("o ahe ");
          //   r.opinionAdvPanelList.map((op) => {
          //     if (op.opinion === null)
          //     console.log("o ahe confirm");
          //     return r;
          //   }
          //   )
          // }
          // if (r.reportAdvPanelList.length > 0) {
          //   console.log("r ahe");
          //   r.reportAdvPanelList.map((rp) => {
          //     if (rp.opinion === null)
          //     console.log("r ahe confirm");
          //     return r;
          //   }
          //   )
          // }
          // })
          .filter((r) =>
            ["OPINION_CREATED", "ADD_OPINION_DRAFT"].includes(r?.status)
          )
          .map((r, i) => {
            console.log("44");
            // if (r?.status == "OPINION_SUBMITTED") {
            return {
              activeFlag: r.activeFlag,
              id: r.id,
              srNo: i + 1,
              opinionRequestDate: moment(r.opinionRequestDate).format(
                "YYYY-MM-DD"
              ),

              searchTitleRptDate: moment(r.searchTitleRptDate).format(
                "YYYY-MM-DD"
              ),

              finalDraftDeliveryDate: moment(r.finalDraftDeliveryDate).format(
                "YYYY-MM-DD"
              ),
              opinionSubject: r.opinionSubject,
              // concenDeptName: r.concenDeptName,
              concenDeptId: r.concenDeptId,
              concenDeptName: concenDeptNames?.find(
                (obj) => obj?.id === r.concenDeptId
              )?.department,

              advPanel: r.advPanel,
              reportAdvPanel: r.reportAdvPanel,
              panelRemarks: r.panelRemarks,
              reportRemarks: r.reportRemarks,
              remarks: r.remarks,
              opinionSubmisionDate: moment(r.opinionSubmisionDate).format(
                "YYYY-MM-DD"
              ),
              opinion: r.opinion,
              officeLocation: r.officeLocation,
              officeLocationNameText: officeName?.find(
                (obj) => obj?.id === r.officeLocation
              )?.officeLocationName,
              officeLocationNameTextMr: officeName?.find(
                (obj) => obj?.id === r.officeLocation
              )?.officeLocationNameMr,
              department: r.department,
              department: concenDeptNames?.find(
                (obj) => obj?.id === r.concenDeptId
              )?.department,
              departmentMr: concenDeptNames?.find(
                (obj) => obj?.id === r.concenDeptId
              )?.department,
              opinionMr: r.opinionMr,
              panelRemarks: r.panelRemarks,
              panelRemarksMr: r.panelRemarksMr,
              courtCaseNumber: r.courtCaseNumber,
              filedBy: r.filedBy,
              filedByMr: r.filedByMr,
              caseDetails: r.caseDetails,
              caseDetailsMr: r.caseDetailsMr,
              status: r.activeFlag === "Y" ? "Active" : "Inactive",
            };
            // }
          });
        console.log("_res", _res);
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

  const getDeptName = () => {
    // alert("HEllo");
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setconcenDeptName(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            departmentMr: r.departmentMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Location Name

  const getOfficeName = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("ghfgf", res);
        setOfficeName(
          res.data.officeLocation.map((r, i) => ({
            id: r.id,
            officeLocationName: r.officeLocationName,
            officeLocationNameMr: r.officeLocationNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  //Delete By ID

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
  //           .post(`${urls.LCMSURL}/transaction/opinion/save`, body)
  //           .then((res) => {
  //             console.log("delet res", res);
  //             if (res.status == 200) {
  //               swal("Record is Successfully Deleted!", {
  //                 icon: "success",
  //               });
  //               // getSubType()
  //               getAllOpinion();
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
  //           .post(`${urls.LCMSURL}/transaction/opinion/save`, body)
  //           .then((res) => {
  //             console.log("delet res", res);
  //             if (res.status == 200) {
  //               swal("Record is Successfully Deleted!", {
  //                 icon: "success",
  //               });
  //               // getSubType()
  //               getAllOpinion();
  //             }
  //           });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   }
  // };

  // Edit Record
  // const actionOnRecord = (record, pageMode) => {
  //   console.log("Record : ---> ", record);
  //   router.push({
  //     pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
  //     query: {
  //       pageMode: pageMode,
  //       ...record,
  //     },
  //   });
  // };

  // add Hearing
  // const addHearing = (record) => {
  //   console.log("All Records", record);
  //   router.push({
  //     pathname: "/LegalCase/transaction/addHearing/view",
  //     query: {
  //       pageMode: "addHearing",
  //       ...record,
  //       caseEntry: record.id,
  //     },
  //   });
  // };

  const columns = [
    {
      headerName: "Sr.No",
      field: "srNo",
      width: 150,
      headerAlign: "center",
      align: "center",

      // dataIndex: "name",
    },

    {
      // headerName: "Opinion Request date",
      headerName: <FormattedLabel id="opinionRequestDate" />,
      field: "opinionRequestDate",
      width: 250,
      headerAlign: "center",
      align: "center",
    },

    {
      headerName: <FormattedLabel id="locationName" />,

      field:
        language === "en"
          ? "officeLocationNameText"
          : "officeLocationNameTextMr",

      // field:"officeLocationName",
      width: 300,
      headerAlign: "center",
      align: "center",
    },

    {
      headerName: <FormattedLabel id="deptName" />,

      // field: "concenDeptName",

      field: language === "en" ? "department" : "department",

      width: 300,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   // headerName: "Opinion Subject",
    //   headerName: <FormattedLabel id="opinionSubject" />,
    //   field: "opinionSubject",
    //   width: 180,
    // },

    {
      field: "actions",
      // headerName: "Actions",
      headerName: <FormattedLabel id="actiosn" />,
      width: 200,
      sortable: false,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {console.log(
              "22",
              language === "en" ? "caseMainType" : "caseMainTypeMr"
            )}
            <Tooltip title="Add Opinion">
              <IconButton
                variant="outlined"
                disabled={editButtonInputState}
                onClick={() => {
                  const record = params.row;
                  router.push({
                    pathname: "/LegalCase/transaction/addOpinion/addOpinion",
                    query: {
                      pageMode: "Edit",
                      ...record,
                    },
                  });
                  console.log("row", params.row);
                  ("");
                }}
              >
                {/* Add Opinion */}
                <PostAddIcon style={{ color: "#556CD6" }} />
              </IconButton>
            </Tooltip>

            {/* for View Icon */}
            {/* 
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                const record = params.row;

                router.push({
                  pathname: "/LegalCase/transaction/addOpinion/addOpinion",
                  query: {
                    pageMode: "View",
                    ...record,
                  },
                });
                console.log("row", params.row);
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

  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {" "}
            {/* <FormattedLabel id="opinion" /> */}
            Opinion List
          </h2>
        </Box>

        <Divider />

        <div>
          {/* </Paper> */}

          <Box
            sx={
              {
                // height: 400,
                // width: 1000,
                // marginLeft: 10,
                // width: '100%',
                // overflowX: 'auto',
              }
            }
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
                  // printOptions: { disableToolbarButton: true },
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
                width: "100%",

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
                getAllOpinion(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAllOpinion(_data, data.page);
              }}
            />
          </Box>
        </div>
      </Paper>
    </>
  );
};

export default Index;

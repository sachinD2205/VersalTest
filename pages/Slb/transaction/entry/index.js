import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { Button, IconButton, Paper, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import * as yup from 'yup'
import { EyeFilled } from "@ant-design/icons";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { Box } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import EditIcon from "@mui/icons-material/Edit";

// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import schema from "../../../../containers/schema/Slb/newCourtCaseSchema";
import urls from "../../../../URLS/urls";
import { Delete } from "@mui/icons-material";

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
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [caseSubTypes, setCaseSubTypes] = useState([]);
  const [years, setYears] = useState([]);
  const [parameterNames, setParameterName] = useState([]);
  const [subParameterName, setSubParameterName] = useState([]);
  let user = useSelector((state) => state.user.user);
  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Case entry
  const getFormEntry = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.SLB}/trnEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.trnEntryList.reverse();

        let _res = result.map((r, i) => {
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,
            parameterName: r.parameterName,
            subParameterName: r.subParameterName,
            createDtTm: moment(r.createDtTm).format("DD-MM-YYYY, h:mm:ss a"),
            valueString: r.valueString,
            moduleName: r.moduleName,
            entryUniqueIdentifier: r.entryUniqueIdentifier,
            zoneKey: r.zoneKey,
            wardKey: r.wardKey,
            zoneName: r.zoneName,
            wardName: r.wardName,
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

  // get Paramter

  const getParameterName = () => {
    axios
      .get(`${urls.SLB}/parameter/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setParameterName(
          res?.data?.parameterList?.map((r, i) => ({
            id: r.id,
            name: r.name,
            parameterName: r.parameterName,
          }))
        );
      });
  };

  // get sub-Parameter Name
  const getSubParameterName = (id) => {
    axios
      .get(`${urls.SLB}/subParameter/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setSubParameterName(
          res?.data?.subParameterList?.map((r, i) => ({
            id: r.id,
            description: r.description,
            parameterKey: r.parameterKey,
            subParameterName: r.subParameterName,
          }))
        );
      });
  };
  // columns
  const columns = [
    // old
    {
      field: "srNo",
      headerName: "Sr. No",
      align: "left",
      headerAlign: "left",

      columnWidth: 20,
    },
    // {
    //   field: "entryUniqueIdentifier",

    //   headerName: "UDID",
    //   flex: 1,
    //   align: "left",
    //   headerAlign: "left",
    // },
    {
      field: "zoneName",

      headerName: "Zone Name",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },

    {
      field: "wardName",

      headerName: "Ward Name",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },

    {
      field: "moduleName",

      headerName: "Module",
      flex: 2,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => (
        <Tooltip title={params.row.moduleName} placement="top">
          <span>{params.row.moduleName}</span>
        </Tooltip>
      ),
    },

    {
      field: "parameterName",

      headerName: "Benchmark",
      flex: 2,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => (
        <Tooltip title={params.row.parameterName} placement="top">
          <span>{params.row.parameterName}</span>
        </Tooltip>
      ),
    },

    {
      field: "activeFlag",
      // headerName: <FormattedLabel id='stampNo' />,
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "subParameterName",
      headerName: "Sub-Parameters",
      // headerName: <FormattedLabel id='filingDate' />,
      flex: 1,

      headerAlign: "left",
      align: "left",
      renderCell: (params) => (
        <Tooltip title={params.row.subParameterName} placement="top">
          <span>{params.row.subParameterName}</span>
        </Tooltip>
      ),
    },
    {
      field: "valueString",
      // headerName: <FormattedLabel id='stampNo' />,
      headerName: "Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "createDtTm",
      // headerName: <FormattedLabel id='stampNo' />,
      headerName: "Date & Time",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      align: "left",
      headerAlign: "left",
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {/* Edit Icon */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"), setID(params.row.id);
                // setButtonInputState(true);
                reset(params.row);
                //router.push(`/Slb/transaction/entry/entryForm?id=${JSON.stringify(params.row)}`);

                // Router Push along with queriy params
                router.push({
                  pathname: "/Slb/transaction/entry/editEntryForm",
                  query: { id: params.row.id },
                });
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>

            {/* Delete Icon */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                // Give a popup for confirmation with Yes and No Options
                let title = "";
                let text = "";
                let confirm = "";
                let cancel = "";
                if (language == "en") {
                  title = "Confirmation";
                  text = "Are you sure you want to proceed? UDID: " + params.row.entryUniqueIdentifier;
                  confirm = "Yes";
                  cancel = "No";
                } else {
                  title = "पुष्टीकरण";
                  text = "तुम्हाला नक्की पुढे जायचे आहे का? UDID: " + params.row.entryUniqueIdentifier;
                  confirm = "होय";
                  cancel = "नाही";
                }
                swal({
                  title: title,
                  text: text,
                  icon: "warning",
                  buttons: {
                    cancel: cancel,
                    confirm: confirm,
                  },
                }).then((confirmed) => {
                  if (confirmed) {
                    let body = {
                      entryUniqueIdentifier: params.row.entryUniqueIdentifier,
                    };
                    // const formData = new FormData();
                    // formData.append("udid", params.row.entryUniqueIdentifier);
                    axios
                      .post(`${urls.SLB}/trnEntry/deleteRecordsByUdid`, body, {
                        headers: {
                          Authorization: `Bearer ${user.token}`,
                        },
                      })
                      .then(
                        (res) => {
                          if (res.status == 201 || res.status == 200) {
                            if (res.data.status.toLowerCase().includes("error")) {
                              swal(res.data.status, res.data.message, "error");
                            } else {
                              let title = "";
                              let text = "";
                              if (language == "en") {
                                title = "Deleted!";
                                text = "Record deleted successfully!";
                              } else {
                                title = "हटवले!";
                                text = "रेकॉर्ड यशस्वीरित्या हटवले!";
                              }
                              swal(title, text, "success");
                              getFormEntry();
                            }
                          }
                        },
                        (error) => {
                          alert(error);
                        }
                      );
                    // User clicked "Yes" button
                    // Handle the confirmed action here
                  } else {
                    // User clicked "No" button or closed the dialog
                    // Handle the canceled action here
                  }
                });
              }}
            >
              <DeleteIcon style={{ color: "#FF0000" }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    getFormEntry();
  }, [parameterNames, subParameterName]);

  useEffect(() => {
    getParameterName();
    getSubParameterName();
  }, []);

  // View
  return (
    <>
      <Paper
        component={Box}
        elevation={5}
        // variant='outlined'
        sx={{
          // border: 1,
          // borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: "0vh",
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
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>SLB Entry Details</h2>
        </Box>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginTop: "20px",
              marginBottom: "20px",
              marginRight: "20px",
            }}
          >
            <Button
              endIcon={<AddIcon />}
              variant="contained"
              onClick={() => router.push(`/Slb/transaction/entry/entryForm`)}
            >
              {/* <FormattedLabel id='add' /> */}
              Add
            </Button>
          </div>

          {/* New Table */}
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
              // width: "1500px",

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
              getFormEntry(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              // updateData("page", 1);
              getFormEntry(_data, data.page);
            }}
          />
        </div>
      </Paper>
    </>
  );
};

export default Index;

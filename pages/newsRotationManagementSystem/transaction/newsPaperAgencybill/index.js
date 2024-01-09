import { EyeFilled } from "@ant-design/icons"
import { ApprovalRounded } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import { Box, Button, Divider, Paper, Tooltip } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import moment from "moment"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import urls from "../../../../URLS/urls"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const language = useSelector((state) => state.labels.language)
  const router = useRouter()
  const [id, setID] = useState()
  // const [department, setDepartment] = useState([]);
  // const [newsPaper, setNewsPaper] = useState([]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  const user = useSelector((state) => state.user.user)
  // console.log("user", user);
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
  // selected menu from drawer
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  )
  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer)

  // get authority of selected user
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer
  })?.roles
  console.log("authority", authority)

  // get Department Name
  // const getDepartment = () => {
  //   axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
  //     setDepartment(res.data.department);
  //     // console.log("res.data", r.data);
  //   });
  // };

  // const getNewsPaper = () => {
  //   axios.get(`${urls.NRMS}/newspaperMaster/getAll`).then((r) => {
  //     setNewsPaper(
  //       r?.data?.newspaperMasterList?.map((r, i) => ({
  //         id: r.id,
  //         newspaperName: r.newspaperName,
  //       }))
  //     );
  //   });
  // };

  // Get Table - Data
  const getAllBillData = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo)
    axios
      .get(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${user?.token}`,
          serviceId: selectedMenuFromDrawer,
        },
      })
      .then((r) => {
        let _res = r?.data?.trnNewspaperAgencyBillSubmissionList?.map(
          (r, i) => {
            return {
              srNo: i + 1,
              ...r,
              departmentName: r?.newsPublishRequestDao?.departmentName,
              departmentNameMr: r?.newsPublishRequestDao?.departmentNameMr,
              newsPublishDate: moment(
                r?.newsPublishRequestDao?.newsPublishDate
              ).format("DD-MM-YYYY"),
              newsPublishRequestNo:
                r?.newsPublishRequestDao?.newsPublishRequestNo,
            }
          }
        )
        console.log("rrrr", _res)
        if (_res?.length > 0) {
          setData({
            rows: _res,
            totalRows: r.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: r.data.pageSize,
            page: r.data.pageNo,
          })
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  // useEffect(() => {
  //   getDepartment();
  //   getNewsPaper();
  // }, []);

  useEffect(() => {
    getAllBillData()
  }, [])

  const columns = [
    {
      field: "srNo",
      headerName: language == "en" ? "Sr No" : "अ.क्र",
      align: "center",
      headerAlign: "center",
      width: 50,
    },
    {
      field: `newsPublishRequestNo`,
      headerName: language == "en" ? "Advertisement No" : "जाहिरात क्र",
      width: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "billNo",
      headerName: language == "en" ? "Bill No" : "बिल नं.",
      width: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? `departmentName` : `departmentNameMr`,
      headerName: language == "en" ? "Department Name" : "विभागाचे नाव",
      width: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "newsPublishDate",
      headerName:
        language == "en" ? "News/Advertisement Publish Date" : "प्रकाशन दिनांक",
      width: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "totalAmount",
      headerName: language == "en" ? "Bill Amount" : "बिलाची रक्कम",
      width: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "status",
      headerName: language == "en" ? "Status" : "स्थिती",
      width: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: language == "en" ? "Actions" : "कृती",
      width: 200,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                router.push({
                  pathname:
                    "/newsRotationManagementSystem/transaction/newsPaperAgencybill/create/",
                  query: {
                    pageMode: "View",
                    id: params?.row?.id,
                  },
                })
              }}
            >
              <EyeFilled style={{ color: "#556CD6" }} />
            </IconButton>
            {/* {params.row.status == "DATA_PUSHED_TO_FICO_SAP" && (
                  <IconButton
                    onClick={() => {
                      localStorage.setItem(
                        "newspaperAgencyBillSubmissionId",
                        params?.row?.id
                      );
                      router.push(
                        "/newsRotationManagementSystem/transaction/releasingOrder/payment/"
                      );
                    }}
                  >
                    <LocalPrintshopOutlinedIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                )} */}

            {authority?.includes("ENTRY") && (
              <>
                {[
                  "DRAFTED",
                  "REVERT_BACK_TO_DEPT_USER",
                  "PRASTAV_GENERATED",
                  "AADESH_GENERATED",
                  "BUDGET_PROVISION_GENERATED",
                ].includes(params.row.status) && (
                  <Tooltip title={language == "en" ? "Edit" : "सुधारणा करा"}>
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname:
                            "/newsRotationManagementSystem/transaction/newsPaperAgencybill/create/",
                          query: {
                            pageMode: "Edit",
                            id: params?.row?.id,
                          },
                        })
                      }}
                    >
                      <EditIcon style={{ color: "#556CD6" }} />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}

            {authority?.includes("FINAL_APPROVAL") &&
              params.row.status != "DRAFTED" && (
                <>
                  <Tooltip title={language == "en" ? "APPROVE" : "मंजूर करा"}>
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname:
                            "/newsRotationManagementSystem/transaction/newsPaperAgencybill/create",
                          query: {
                            pageMode: "PROCESS",
                            id: params.row.id,
                          },
                        })
                      }}
                    >
                      <ApprovalRounded style={{ color: "#556CD6" }} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
          </Box>
        )
      },
    },
  ]

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }
    console.log("body", body)
    if (_activeFlag === "N") {
      swal({
        title: "Activate?",
        text: "Are you sure you want to Activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getAllBillData()
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
        }
      })
    } else {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to Inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                // getPaymentRate();
                getAllBillData()
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
        }
      })
    }
  }

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          // marginTop: "10px",
          // marginBottom: "60px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {language == "en" ? "Bill Submission" : "बिल सबमिशन"}
            {/* <FormattedLabel id="addHearing" /> */}
          </h2>
        </Box>
        <Divider />

        <div
          // className={styles.addbtn}
          style={{
            display: "flex",
            justifyContent: "right",
            marginTop: 10,
            marginRight: 40,
            marginBottom: 10,
          }}
        >
          <div>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              // type='primary'
              // disabled={buttonInputState}
              onClick={() => {
                router.push({
                  pathname:
                    "/newsRotationManagementSystem/transaction/newsPaperAgencybill/create",
                  query: {
                    pageMode: "Add",
                  },
                })
              }}
            >
              <FormattedLabel id="add" />
            </Button>
          </div>
        </div>

        <div>
          {/* </Paper> */}

          {/* New Table */}
          <Box
            sx={{
              height: 500,
              // width: 1000,
              // marginLeft: 10,

              // width: '100%',

              overflowX: "auto",
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
              // rows={dataSource}
              // columns={columns}
              // pageSize={5}
              // rowsPerPageOptions={[5]}
              //checkboxSelection

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
                getAllBillData(data.pageSize, _data)
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data)
                // updateData("page", 1);
                getAllBillData(_data, data.page)
              }}
            />
          </Box>
        </div>
      </Paper>
    </>
  )
}

export default Index

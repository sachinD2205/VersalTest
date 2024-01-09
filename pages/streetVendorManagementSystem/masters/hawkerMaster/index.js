import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Button, Paper, ThemeProvider } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import HawkerMasterCSS from "../../../../components/streetVendorManagementSystem/styles/NewHawkerMaster.module.css";
import ItemMasterCSS from "../../../../components/streetVendorManagementSystem/styles/Item.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import Translation from "../../../../components/streetVendorManagementSystem/components/Translation";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import theme from "../../../../theme";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(),
    mode: "onChange",
  });
  const userToken = useGetToken();
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  // hawkerDataTable
  const [hawkerDataTable, setHawkerDataTable] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [loadderState, setLoadderState] = useState(false);
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
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [hawkingZones, setHawkingZones] = useState([]);
  const [titles, setTitles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [religions, setReligions] = useState([]);
  const [casts, setCasts] = useState([]);
  const [subCasts, setSubCasts] = useState([]);
  const [typeOfDisabilitys, setTypeOfDisabilitys] = useState([]);
  const [areaNames, setAreaNames] = useState([]);
  const [landmarkNames, setLandmarkNames] = useState([]);
  const [villages, setVillages] = useState([]);
  const [pincodes, setPinCode] = useState([]);
  const [wardNos, setWardNo] = useState([]);
  const [hawkingDurationDailys, setHawkingDurationDailys] = useState([]);
  const [hawkerTypes, setHawkerTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [bankNames, setBankNames] = useState([]);

  // hawkingZone
  const getHawkingZone = () => {
    axios.get(`${urls.HMSURL}/hawingZone/getAll`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }).then((r) => {
        console.log("r?data?hawkingzone", r?.data?.hawkingZone);
        setHawkingZones(
          r?.data?.hawkingZone?.map((row) => ({
            id: row.id,
            hawkingZoneName: row?.hawkingZoneName,
            hawkingZoneNameMr: row?.hawkingZoneNameMr,
          }))
        );
      }).catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // wardNo
  const getWardNo = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      console.log("wardNumber", r?.data?.ward);
      setWardNo(
        r?.data?.ward?.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // hawkerMaster
  const getHawkerMasterTableData = (_pageSize = 10, _pageNo = 0) => {
    setLoadderState(true);
    const url = `${urls.HMSURL}/hawkerMaster/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setLoadderState(false);
          let response = res?.data?.hawker;
          console.log(" ", response);
          let _res = response.map((r, i) => {
            return {
              id: r?.id,
              srNo: i + 1,
              hawkerPrefix: r?.hawkerPrefix,
              toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              hawkerName:
                r?.firstName + "  " + r?.middleName + "  " + r?.lastName,
              emailAddress: r?.emailAddress,
              mobile: r?.mobile,
              citySurveyNo: r?.citySurveyNo,
              // hawkingZones
              hawkingZoneName: hawkingZones?.find(
                (obj) => obj.id == r?.hawkingZoneName
              )?.hawkingZoneName,
              hawkingZoneNameMr: hawkingZones?.find(
                (obj) => obj.id == r?.hawkingZoneName
              )?.hawkingZoneNameMr,
              // hawkingDurationDaily
              hawkingDurationDaily: hawkingDurationDailys?.find(
                (obj) => obj?.id === r.hawkingDurationDaily
              )?.hawkingDurationDaily,
              // Item
              item: items?.find((obj) => obj?.id == r.item)?.item,
              itemMr: items?.find((obj) => obj?.id == r.item)?.itemMr,
              // hawkerType
              hawkerTypeName: hawkerTypes?.find(
                (obj) => obj?.id === r.hawkerType
              )?.hawkerType,

              // wardName
              wardName: wardNos?.find((obj) => obj?.id === r?.wardNo)?.wardName,
              wardNameMr: wardNos?.find((obj) => obj?.id === r?.wardNo)
                ?.wardNameMr,

              emailAddress: r.emailAddress,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
          console.log("_res_res", _res);
          setHawkerDataTable({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
        } else {
          toast.error("Filed Load Data !! Please Try Again !", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
      });
  };

  // religion
  const getReligion = () => {
    axios.get(`${urls.HMSURL}/religionMaster/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setReligions(
        r.data.map((row) => ({
          id: row.id,
          religion: row.religion,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // caste
  const getCast = () => {
    axios.get(`${urls.CFCURL}/cast/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setCasts(
        r.data.map((row) => ({
          id: row.id,
          castt: row.castt,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // subCaste
  const getSubCast = () => {
    axios.get(`${urls.CFCURL}/subCast/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
    ).then((r) => {
      setSubCasts(
        r.data.map((row) => ({
          id: row.id,
          subCast: row.subCast,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // typeOfDisablity
  const getTypeOfDisability = () => {
    axios.get(`${urls.CFCURL}/typeOfDisability/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setTypeOfDisabilitys(
        r.data.map((row) => ({
          id: row.id,
          typeOfDisability: row.typeOfDisability,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // area
  const getAreaName = () => {
    axios.get(`${urls.CFCURL}/area/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setAreaNames(
        r.data.map((row) => ({
          id: row.id,
          areaName: row.areaName,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // landmark
  const getLandmarkName = () => {
    axios.get(`${urls.CFCURL}/landmarkMaster/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setLandmarkNames(
        r.data.map((row) => ({
          id: row.id,
          landmarkName: row.landmarkName,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // village
  const getVillageName = () => {
    axios.get(`${urls.CFCURL}/village/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setVillages(
        r.data.map((row) => ({
          id: row.id,
          villageNameEng: row.villageNameEng,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // pinCode
  const getPinCode = () => {
    axios.get(`${urls.CFCURL}/pinCode/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setPinCode(
        r.data.map((row) => ({
          id: row.id,
          pincode: row.pincode,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // bankName
  const getBankName = () => {
    axios.get(`${urls.CFCURL}/bank/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setBankNames(
        r.data.map((row) => ({
          id: row.id,
          bankName: row.bankName,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // hawkingDurationDaily
  const getHawkingDurationDaily = () => {
    axios.get(`${urls.HMSURL}/hawkingDurationDaily/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      console.log("hawkingDurationDaily", r?.data?.hawkingDurationDaily);
      setHawkingDurationDailys(
        r?.data?.hawkingDurationDaily?.map((row) => ({
          id: row.id,
          hawkingDurationDaily:
            moment(row.hawkingDurationDailyFrom, "HH:mm:ss").format("hh:mm A") +
            " To " +
            moment(row.hawkingDurationDailyTo, "HH:mm:ss").format("hh:mm A"),
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // hawkerType
  const getHawkerType = () => {
    axios.get(`${urls.HMSURL}/hawkerType/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      console.log("hawkerType", r?.data?.hawkerType);
      setHawkerTypes(
        r?.data?.hawkerType?.map((row) => ({
          id: row.id,
          hawkerType: row.hawkerType,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // item
  const getItem = () => {
    axios.get(`${urls.HMSURL}/item/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      console.log("items2322", r?.data?.item);
      setItems(
        r?.data?.item?.map((row) => ({
          id: row?.id,
          item: row?.item,
          itemMr: row?.itemMr,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios.post(`${urls.HMSURL}/hawkerMaster/save`, body, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
          ).then((res) => {
            if (res.status == 200) {
              swal({
                title:
                  language == "en"
                    ? "Record is Successfully Deleted!"
                    : "रेकॉर्ड यशस्वीरित्या हटवले आहे!",
                text: "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                icon: "success",
                button: "ओके",
              });
              getHawkerMasterTableData();
              setButtonInputState(false);
            }
          }).catch((error) => {
            callCatchMethod(error, language);
          });
        } else if (willDelete == null) {
          swal({
            title: language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
            buttons: {
              confirm: language === "en" ? "OK" : "ओके",
            },
          });
        }
      });
    } else {
      swal({
        title: language == "en" ? "Inactivate?" : "निष्क्रिय करणे",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record ?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: {
          cancel: language === "en" ? "No, Cancel" : "नको, कॅन्सेल",
          confirm: language === "en" ? "Yes, Inactivate" : "होय, निष्क्रिय करा",
        },
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios.post(`${urls.HMSURL}/hawkerMaster/save`, body, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }).then((res) => {
            console.log("delet res", res);
            if (res.status == 200 || res.status == 226 || res?.status == 201) {
              swal({
                title:
                  language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
                buttons: {
                  confirm: language === "en" ? "OK" : "ओके",
                },
              });
              getHawkerMasterTableData();
              setButtonInputState(false);
            }
          }).catch((error) => {
            callCatchMethod(error, language);
          });
        } else if (willDelete == null) {
          swal({
            title: language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
            buttons: {
              confirm: language === "en" ? "OK" : "ओके",
            },
          });
        }
      });
    }
  };

  // HawkerMasterTableColumns
  const HawkerMasterTableColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id='srNo' />,
      description: <FormattedLabel id='srNo' />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },
    {
      field: "hawkerPrefix",
      headerName: <FormattedLabel id='hawkerPrefix' />,
      description: <FormattedLabel id='hawkerPrefix' />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },

    {
      field: "fromDate",
      headerName: <FormattedLabel id='fromDate' />,
      description: <FormattedLabel id='fromDate' />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id='toDate' />,
      description: <FormattedLabel id='toDate' />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },
    {
      field: "hawkerName",
      headerName: <FormattedLabel id='hawkerName' />,
      description: <FormattedLabel id='hawkerName' />,
      align: "left",
      headerAlign: "center",
      width: 400,
    },

    {
      field: "mobile",
      headerName: <FormattedLabel id='mobile' />,
      description: <FormattedLabel id='mobile' />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },

    {
      field: "emailAddress",
      headerName: <FormattedLabel id='emailAddress' />,
      description: <FormattedLabel id='emailAddress' />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },

    {
      field: "citySurveyNo",
      width: 200,
      headerName: <FormattedLabel id='citySurveyNo' />,
      description: <FormattedLabel id='citySurveyNo' />,
      align: "left",
      headerAlign: "center",
    },

    {
      field: language == "en" ? "hawkingZoneName" : "hawkingZoneNameMr",
      headerName: <FormattedLabel id='hawkingZone' />,
      description: <FormattedLabel id='hawkingZone' />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },

    {
      field: "hawkingDurationDaily",
      headerName: <FormattedLabel id='hawkingDurationDaily' />,
      description: <FormattedLabel id='hawkingDurationDaily' />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },
    {
      field: language == "en" ? "item" : "itemMr",
      headerName: <FormattedLabel id='item' />,
      description: <FormattedLabel id='item' />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id='action' />,
      description: <FormattedLabel id='action' />,
      align: "left",
      headerAlign: "center",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              size='small'
              disabled={editButtonInputState}
              onClick={() => {
                localStorage.setItem("hawkerMasterId", params?.row?.id);
                localStorage.setItem("disabledFieldInputState", true);
                router.push(
                  `/streetVendorManagementSystem/masters/hawkerMaster/HawkerMaster`
                );
              }}
            >
              <VisibilityIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              size='small'
              disabled={editButtonInputState}
              onClick={() => {
                localStorage.setItem("hawkerMasterId", params?.row?.id);
                localStorage.setItem("disabledFieldInputState", false);
                router.push(
                  `/streetVendorManagementSystem/masters/hawkerMaster/HawkerMaster`
                );
              }}
            >
              <EditIcon sx={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton size='small'>
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
          </>
        );
      },
    },
  ];

  useEffect(() => {
    console.log("language", language);
    getHawkingZone();
    getWardNo();
    getHawkingDurationDaily();
    getHawkerType();
    getItem();
  }, []);

  useEffect(() => {
    localStorage.removeItem("pageMode");
    localStorage.removeItem("hawkerMasterId");
    getHawkerMasterTableData();
  }, [hawkingZones, wardNos, hawkerTypes, items]);

  // View
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <Paper className={ItemMasterCSS.Paper} elevation={5}>
          <ThemeProvider theme={theme}>
            <div className={ItemMasterCSS.MainHeader}>
              {<FormattedLabel id='hawkerMaster' />}
            </div>

            <div className={ItemMasterCSS.AddButton}>
              <Button
                size='small'
                variant='contained'
                endIcon={<AddIcon />}
                type='primary'
                onClick={() => {
                  localStorage.setItem("disabledFieldInputState", false);
                  router.push(
                    `/streetVendorManagementSystem/masters/hawkerMaster/HawkerMaster`
                  );
                }}
              >
                <FormattedLabel id='add' />
              </Button>
            </div>
          </ThemeProvider>
          {/** Table */}
          <div className={ItemMasterCSS.DataGridDiv}>
            <DataGrid
              componentsProps={{
                toolbar: {
                  searchPlaceholder: "शोधा",
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  csvOptions: { disableToolbarButton: true },
                },
              }}
              components={{ Toolbar: GridToolbar }}
              sx={{
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
              columns={
                HawkerMasterTableColumns != null &&
                  HawkerMasterTableColumns != undefined
                  ? HawkerMasterTableColumns
                  : []
              }
              density='compact'
              autoHeight={true}
              pagination
              paginationMode='server'
              page={hawkerDataTable?.page}
              rowCount={hawkerDataTable?.totalRows}
              rowsPerPageOptions={hawkerDataTable?.rowsPerPageOptions}
              pageSize={hawkerDataTable?.pageSize}
              rows={hawkerDataTable?.rows}
              onPageChange={(_data) => {
                getHawkerMasterTableData(hawkerDataTable?.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                getHawkerMasterTableData(_data, hawkerDataTable?.page);
              }}
            />
          </div>
        </Paper>
      )}
    </>
  );
};

export default Index;

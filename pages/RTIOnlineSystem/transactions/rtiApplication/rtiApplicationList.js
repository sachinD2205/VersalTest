import {
  Button,
  Grid,
  Tooltip,
  IconButton,
  Box,
  TextField,
  Paper,
  Modal,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DownloadIcon from "@mui/icons-material/Download";
import DraftsIcon from "@mui/icons-material/Drafts";
import PaymentIcon from "@mui/icons-material/Payment";
import moment from "moment";
import { Controller, FormProvider, useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import sweetAlert from "sweetalert";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import roleId from "../../../../components/rtiOnlineSystem/commonRoleId";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const router1 = useRouter();
  const language = useSelector((state) => state.labels.language);
  const [dataSource, setDataSource] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartmentList] = useState([]);
  const router = useRouter();
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const [departmentData, setDepartmentData] = useState([]);
  let user = useSelector((state) => state.user.user);
  const [isForwoardOpen, setIsForward] = useState(false);
  const [applicationDetails, setApplicationDetails] = useState([]);
  const [allApplicationDetails, setAllApplicationDetails] = useState(null);
  const logedInUser = localStorage.getItem("loggedInUser");
  const [dataPageNo, setDataPage] = useState();
  const [dependDepartment, setdependDepartments] = useState([]);
  const [dependDeptId, setDependantDept] = useState(null);
  const [wards, setWards] = useState([]);
  const [zoneDetails, setZoneDetails] = useState();
  const [officeLocationDetails, setOfficeLocationDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusAll, setStatus] = useState([]);
  const [isForwardLoading, setIsForwardLoading] = useState(false);
  const headers = { Authorization: `Bearer ${user?.token}` };

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  const handleCancel = () => {
    setValue("zoneKey", "");
    setValue("officeLocationKey", "");
    setValue("departmentKey", "");
    setValue("subDepartmentKey", "");
    setValue("remarks", "");
    setIsForward(false);
  };

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;

  useEffect(() => {
    getAllStatus();
    getZone();
    getOfficeLocation();
    getDepartments();
    getAllSubDepartmentDetails();
  }, []);

  let checkAuth = () => {
    return authority?.includes(roleId.RTI_ADHIKARI_ROLE_ID) ? false : true;
  };

  useEffect(() => {
    if (
      logedInUser === "departmentUser" &&
      authority &&
      authority.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID)
    ) {
      getApplicationListByDept();
    } else {
      getApplicationDetails();
    }
  }, [departments != [] && zoneDetails != [] && officeLocationDetails != []]);

  useEffect(() => {
    setdependDepartments(
      departmentData.filter((obj) => obj.id != dependDeptId)
    );
  }, [departmentData]);

  useEffect(() => {
    if (watch("zoneKey") != null && watch("zoneKey") != "") {
      getOfficeLocationByZone();
    }
    setWards([]);
    setValue("officeLocationKey", "");
  }, [watch("zoneKey")]);

  useEffect(() => {
    if (
      watch("officeLocationKey") != null &&
      watch("officeLocationKey") != "" &&
      watch("zoneKey") != null &&
      watch("zoneKey") != ""
    ) {
      getDepartmentByOfficeLocation();
    }
    setdependDepartments([]);
    setValue("departmentKey", "");
  }, [watch("officeLocationKey")]);

  const getAllStatus = () => {
    axios
      .get(`${urls.RTI}/mstStatus/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setStatus(
          res.data.mstStatusDaoList.map((r, i) => ({
            id: r.id,
            statusTxt: r.statusTxt,
            statusTxtMr: r.statusTxtMr,
            status: r.status,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getDepartmentByOfficeLocation = () => {
    axios
      .get(
        `${
          urls.RTI
        }/mstZoneOfficeLocationDepartmentMapping/getAllDeptByZoneAndLocation?zoneKey=${watch(
          "zoneKey"
        )}&locationkey=${watch("officeLocationKey")}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        let data = r.data.mstZoneOfficeLocationDepartmentMappingDao.map(
          (row) => ({
            id: row.departmentKey,
            department: departments?.find((obj) => {
              return obj.id == row.departmentKey;
            })
              ? departments.find((obj) => {
                  return obj.id == row.departmentKey;
                }).department
              : "-",
            departmentMr: departments?.find((obj) => {
              return obj.id == row.departmentKey;
            })
              ? departments.find((obj) => {
                  return obj.id == row.departmentKey;
                }).departmentMr
              : "-",
          })
        );
        setDepartmentData(data.sort(sortByProperty("department")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const sortByProperty = (property) => {
    return (a, b) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    };
  };

  const getOfficeLocationByZone = () => {
    axios
      .get(
        `${
          urls.RTI
        }/mstZoneOfficeLocationDepartmentMapping/getAllLocByZone?zoneKey=${watch(
          "zoneKey"
        )}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        let data = r.data.mstZoneOfficeLocationDepartmentMappingDao.map(
          (row) => ({
            id: row.officeLocationkey,
            officeLocation: officeLocationDetails?.find((obj) => {
              return obj.id == row.officeLocationkey;
            })
              ? officeLocationDetails.find((obj) => {
                  return obj.id == row.officeLocationkey;
                }).officeLocationName
              : "-",
            officeLocationMr: officeLocationDetails?.find((obj) => {
              return obj.id == row.officeLocationkey;
            })
              ? officeLocationDetails.find((obj) => {
                  return obj.id == row.officeLocationkey;
                }).officeLocationNameMar
              : "-",
          })
        );
        setWards(data.sort(sortByProperty("officeLocation")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setDepartments(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
            departmentMr: row.departmentMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get sub department
  const getAllSubDepartmentDetails = () => {
    axios
      .get(`${urls.CFCURL}/master/subDepartment/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let data = res.data.subDepartment.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          departmentId: r.department,
          subDepartment: r.subDepartment,
          subDepartmentMr: r.subDepartmentMr,
        }));
        setSubDepartmentList(data.sort(sortByProperty("subDepartment")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get sub department by dept id
  const getSubDepartmentDetails = () => {
    if (watch("departmentKey")) {
      axios
        .get(
          `${urls.RTI}/master/subDepartment/getAllByDeptWise/${watch(
            "departmentKey"
          )}`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setSubDepartmentList(
            res.data.subDepartment.map((r, i) => ({
              id: r.id,
              srNo: i + 1,
              departmentId: r.department,
              subDepartment: r.subDepartment,
            }))
          );
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // get application by departmentwise
  const getApplicationListByDept = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.RTI}/trnRtiApplication/getAllByDepartmet`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: headers,
      })
      .then((res, j) => {
        setIsLoading(false);
        if (res.status === 200) {
          setAllApplicationDetails(res.data);
          setTotalElements(res.data.totalElements);
          setPageSize(res.data.pageSize);
          setPageNo(res.data.pageNo);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // get self application
  const getApplicationDetails = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.RTI}/trnRtiApplication/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: headers,
      })
      .then((res, i) => {
        setIsLoading(false);
        if (res.status === 200) {
          setAllApplicationDetails(res?.data);
          setTotalElements(res.data.totalElements);
          setPageSize(res.data.pageSize);
          setPageNo(res.data.pageNo);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (allApplicationDetails != null) {
      setDataSourceDetails();
    }
  }, [
    allApplicationDetails,
    language,
    departments,
    officeLocationDetails,
    zoneDetails,
    statusAll,
  ]);

  // get zone
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let data = res.data.zone.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          zoneName: r.zoneName,
          zoneNameMr: r.zoneNameMr,
        }));
        setZoneDetails(data.sort(sortByProperty("zoneName")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setOfficeLocationDetails(
          res.data.officeLocation.map((r, i) => ({
            id: r.id,
            officeLocationName: r.officeLocationName,
            officeLocationNameMar: r.officeLocationNameMar,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // set datatable details
  const setDataSourceDetails = () => {
    let res1 = allApplicationDetails;
    let result = res1?.trnRtiApplicationList;
    const _res = result?.map((res, i) => {
      return {
        srNo: i + 1 + res1.pageNo * res1.pageSize,
        id: res.id,
        applicationNo: res.applicationNo,
        deptId: res.departmentKey,
        applicantName:
          res.applicantFirstName +
          " " +
          res.applicantMiddleName +
          " " +
          res.applicantLastName,
        applicantNameMr:
          res.applicantFirstNameMr +
          " " +
          res.applicantMiddleNameMr +
          " " +
          res.applicantLastNameMr,
        departmentName: departments?.find((obj) => {
          return obj.id == res.departmentKey;
        })
          ? departments.find((obj) => {
              return obj.id == res.departmentKey;
            }).department
          : "-",
        departmentMr: departments?.find((obj) => {
          return obj.id == res.departmentKey;
        })
          ? departments.find((obj) => {
              return obj.id == res.departmentKey;
            }).departmentMr
          : "-",
        wardName: wards?.find((obj) => {
          return obj.id == res.wardKey;
        })
          ? wards.find((obj) => {
              return obj.id == res.wardKey;
            }).wardName
          : "-",
        wardNameMr: wards?.find((obj) => {
          return obj.id == res.wardKey;
        })
          ? wards.find((obj) => {
              return obj.id == res.wardKey;
            }).wardNameMr
          : "-",
        zoneName: zoneDetails?.find((obj) => {
          return obj.id == res.zoneKey;
        })
          ? zoneDetails.find((obj) => {
              return obj.id == res.zoneKey;
            }).zoneName
          : "-",
        zoneNameMr: zoneDetails?.find((obj) => {
          return obj.id == res.zoneKey;
        })
          ? zoneDetails.find((obj) => {
              return obj.id == res.zoneKey;
            }).zoneNameMr
          : "-",
        officeLocation: officeLocationDetails?.find((obj) => {
          return obj.id == res.officeLocationKey;
        })
          ? officeLocationDetails.find((obj) => {
              return obj.id == res.officeLocationKey;
            }).officeLocationName
          : "-",
        officeLocationMr: officeLocationDetails?.find((obj) => {
          return obj.id == res.officeLocationKey;
        })
          ? officeLocationDetails.find((obj) => {
              return obj.id == res.officeLocationKey;
            }).officeLocationNameMar
          : "-",
        createdDate: res.createdDate,
        isTransfer: res.isTransfer === false ? null : res.isTransfer,
        parentId: res.parentId,
        description: res.description,
        subject: res.subject,
        applicationDate:
          res.applicationDate == null
            ? "-"
            : moment(res.applicationDate).format("DD-MM-YYYY"),
        slaDate:
          res.slaDate == null ? "-" : moment(res.slaDate).format("DD-MM-YYYY"),
        pendingDays:
          res.pendingDays < 0
            ? `OverDue (${res.pendingDays})`
            : res.pendingDays,
        noOfDays: difference(res.slaDate),
        statusVal: res.status,
        isBpl: res.isBpl,
        status: manageStatus(res.status, language, statusAll),
        activeFlag: res.activeFlag,
      };
    });
    setDataSource([..._res]);
  };

  const difference = (date) => {
    if (date != null) {
      var Difference_In_Time = new Date(date).getTime() - new Date().getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      return Math.round(Difference_In_Days);
    } else {
      return "-";
    }
  };



  // datatable columns
  const columns = [
    {
      field: "srNo",
      headerName: (
        <Tooltip title={<FormattedLabel id="srNo" />}>
          <span>
            <FormattedLabel id="srNo" />
          </span>
        </Tooltip>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerName: (
        <Tooltip title={<FormattedLabel id="applicantName" />}>
          <span>
            <FormattedLabel id="applicantName" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "applicationNo",
      headerName: (
        <Tooltip title={<FormattedLabel id="applicationNo" />}>
          <span>
            <FormattedLabel id="applicationNo" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 280,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "zoneName" : "zoneNameMr",
      headerName: (
        <Tooltip title={<FormattedLabel id="zoneKey" />}>
          <span>
            <FormattedLabel id="zoneKey" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "officeLocation" : "officeLocationMr",
      headerName: (
        <Tooltip title={<FormattedLabel id="officeLocation" />}>
          <span>
            <FormattedLabel id="officeLocation" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "departmentName" : "departmentMr",
      headerName: (
        <Tooltip title={<FormattedLabel id="departmentKey" />}>
          <span>
            <FormattedLabel id="departmentKey" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "applicationDate",
      headerName: (
        <Tooltip title={<FormattedLabel id="rtiFileDate" />}>
          <span>
            <FormattedLabel id="rtiFileDate" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "slaDate",
      headerName: (
        <Tooltip title={<FormattedLabel id="rtiDueDate" />}>
          <span>
            <FormattedLabel id="rtiDueDate" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "pendingDays",
      headerName: (
        <Tooltip title={<FormattedLabel id="totalNoOfDays" />}>
          <span>
            <FormattedLabel id="totalNoOfDays" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: (
        <Tooltip title={<FormattedLabel id="status" />}>
          <span>
            <FormattedLabel id="status" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 180,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => {
        return (
          <>
            {params?.row?.statusVal === 3 ? (
              <div
                style={{ color: params?.row?.noOfDays <= 5 ? "red" : "blue" }}
              >
                {params?.row?.status}
              </div>
            ) : params?.row?.statusVal === 2 ? (
              <div
                style={{ color: params?.row?.noOfDays <= 5 ? "red" : "orange" }}
              >
                {params?.row?.status}
              </div>
            ) : params?.row?.statusVal === 4 ||
              params?.row?.statusVal === 5 ||
              params?.row?.statusVal === 14 ? (
              <div
                style={{ color: params?.row?.noOfDays <= 5 ? "red" : "orange" }}
              >
                {params?.row?.status}
              </div>
            ) : params?.row?.statusVal === 11 ? (
              <div style={{ color: "green" }}>{params?.row?.status}</div>
            ) : (
              <div
                style={{ color: params?.row?.noOfDays <= 5 ? "red" : "black" }}
              >
                {params?.row?.status}
              </div>
            )}
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 220,
      sortable: false,
      headerAlign: "center",
      align: "left",
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                router1.push({
                  pathname:
                    "/RTIOnlineSystem/transactions/rtiApplication/ViewRTIApplication",
                  query: { id: params.row.id },
                });
              }}
            >
              <Tooltip
                title={
                  language == "en"
                    ? `View Application against  ${params?.row?.applicationNo}`
                    : `${params?.row?.applicationNo} अर्ज पहा`
                }
              >
                <VisibilityIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
            {params?.row?.statusVal === 0 &&
              (logedInUser == "citizenUser" ||
                logedInUser === "cfcUser" ||
                (logedInUser === "departmentUser" && checkAuth())) && (
                <>
                  <IconButton
                    onClick={() => {
                      router1.push({
                        pathname:
                          "/RTIOnlineSystem/transactions/rtiApplication",
                        query: { id: params.row.id },
                      });
                    }}
                  >
                    <DraftsIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                </>
              )}
            {authority &&
              authority?.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID) &&
              params.row.statusVal === 3 && (
                <IconButton
                  onClick={() => {
                    sweetAlert({
                      title: language == "en" ? "Warning!" : "चेतावणी!",
                      text:
                        language == "en"
                          ? "Do you want to Transfer/Forward Application to another department?"
                          : "तुम्हाला अर्ज दुसऱ्या विभागात हस्तांतरित/फॉरवर्ड करायचा आहे का?",
                      dangerMode: false,
                      closeOnClickOutside: false,
                      buttons: [
                        language == "en" ? "No" : "नाही",
                        language == "en" ? "Yes" : "होय",
                      ],
                    }).then((will) => {
                      if (will) {
                        setIsForward(true);
                        setDependantDept(params.row.deptId);
                        getApplicationById(params.row.id);
                      } else {
                        if (
                          logedInUser === "departmentUser" &&
                          authority &&
                          authority.find(
                            (val) => val === roleId.RTI_ADHIKARI_ROLE_ID
                          )
                        ) {
                          getApplicationListByDept();
                        } else {
                          getApplicationDetails();
                        }
                      }
                    });
                  }}
                >
                  <ArrowForwardIosIcon style={{ color: "green" }} />
                </IconButton>
              )}

            {/* send for payment */}
            {(logedInUser == "citizenUser" ||
              logedInUser === "cfcUser" ||
              (logedInUser === "departmentUser" && checkAuth())) &&
              params.row.statusVal === 2 && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/RTIOnlineSystem/transactions/payment/PaymentCollection",
                      query: { id: params.row.applicationNo, trnType: "ap" },
                    });
                  }}
                >
                  <Tooltip
                    title={language == "en" ? `Make Payment` : "पेमेंट करा"}
                  >
                    <PaymentIcon style={{ color: "red" }} />
                  </Tooltip>
                </IconButton>
              )}

            {/* LOI RECEIPT */}
            {(logedInUser == "citizenUser" ||
              logedInUser === "cfcUser" ||
              (logedInUser === "departmentUser" && checkAuth())) &&
              params.row.statusVal === 4 && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/RTIOnlineSystem/transactions/acknowledgement/LoiGenerationRecipt",
                      query: { id: params.row.applicationNo },
                    });
                  }}
                >
                  <Tooltip
                    title={
                      language == "en" ? `View LOI Receipt` : "LOI पावती पहा"
                    }
                  >
                    <PaymentIcon style={{ color: "orange" }} />
                  </Tooltip>
                </IconButton>
              )}

            {(logedInUser == "citizenUser" ||
              logedInUser === "cfcUser" ||
              (logedInUser === "departmentUser" && checkAuth())) &&
              params.row.statusVal != 1 &&
              params.row.statusVal != 0 &&
              params.row.statusVal != 2 && (
                <>
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/RTIOnlineSystem/transactions/acknowledgement/rtiApplication",
                        query: { id: params.row.applicationNo },
                      });
                    }}
                  >
                    <Tooltip
                      title={
                        language == "en"
                          ? `Download Acknowldgement`
                          : "पावती डाउनलोड करा"
                      }
                    >
                      <DownloadIcon style={{ color: "blue" }} />
                    </Tooltip>
                  </IconButton>

                  {!params.row.isBpl && (
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname:
                            "/RTIOnlineSystem/transactions/receipt/serviceReceipt",
                          query: { id: params.row.id, trnType: "ap" },
                        });
                      }}
                    >
                      <Tooltip
                        title={
                          language == "en"
                            ? `Download Payment Receipt`
                            : "पेमेंट पावती डाउनलोड करा"
                        }
                      >
                        <ReceiptIcon style={{ color: "blue" }} />
                      </Tooltip>
                    </IconButton>
                  )}
                </>
              )}

            {(logedInUser == "citizenUser" ||
              logedInUser === "cfcUser" ||
              (logedInUser === "departmentUser" && checkAuth())) &&
              params.row.statusVal === 5 && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/RTIOnlineSystem/transactions/receipt/serviceReceipt",
                      query: { id: params.row.id, trnType: "loi" },
                    });
                  }}
                >
                  <Tooltip
                    title={
                      language == "en"
                        ? `Download LOI Payment Receipt`
                        : "LOI पेमेंट पावती डाउनलोड करा "
                    }
                  >
                    <ReceiptIcon style={{ color: "orange" }} />
                  </Tooltip>
                </IconButton>
              )}
          </>
        );
      },
    },
  ];
  // forward application
  const onForwardApplication = (formData) => {
    setIsForwardLoading(true);
    const body = {
      activeFlag: "Y",
      ...applicationDetails,
      zoneKey: formData.zoneKey,
      officeLocationKey: formData.officeLocationKey,
      departmentKey: formData.departmentKey,
      subDepartmentKey: formData.subDepartmentKey,
      forwardRemark: formData.remarks,
      isTransfer: true,
      forwardFlag: true,
    };
    const tempData = axios
      .post(`${urls.RTI}/trnRtiApplication/save`, body, {
        headers: headers,
      })
      .then((res) => {
        setIsForwardLoading(false);
        if (res.status == 201) {
          setIsForward(false);
          sweetAlert(
            language == "en" ? "Saved!" : "जतन केले!",
            language == "en"
              ? `RTI Application No ${
                  res.data.message.split("[")[1].split("]")[0]
                } is Transferred Successfully!`
              : `आरटीआय अर्ज क्र  ${
                  res.data.message.split("[")[1].split("]")[0]
                } यशस्वीरित्या हस्तांतरित केले आहे!`,
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
          if (
            logedInUser === "departmentUser" &&
            authority &&
            authority.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID)
          ) {
            getApplicationListByDept();
          } else {
            getApplicationDetails();
          }
        }
      })
      .catch((err) => {
        setIsForwardLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // get application by id
  const getApplicationById = (applicationID) => {
    axios
      .get(`${urls.RTI}/trnRtiApplication/getById?id=${applicationID}`, {
        headers: headers,
      })
      .then((res, i) => {
        setApplicationDetails(res.data);
        setValue("rtiapplicationNo", res.data.applicationNo);
        setValue(
          "applicantName",
          language === "en"
            ? res.data.applicantFirstName +
                " " +
                res.data.applicantMiddleName +
                " " +
                res.data.applicantLastName
            : res.data.applicantFirstNameMr +
                " " +
                res.data.applicantMiddleNameMr +
                " " +
                res.data.applicantLastNameMr
        );
        setValue("subject", res.data.description);
        setValue(
          "currentdept",
          departments?.find((obj) => {
            return obj.id == res.data.departmentKey;
          })
            ? departments.find((obj) => {
                return obj.id == res.data.departmentKey;
              }).department
            : "-"
        ),
          setValue(
            "currentSubDept",
            subDepartments?.find((obj) => {
              return obj.id == res.data.subDepartmentKey;
            })
              ? subDepartments.find((obj) => {
                  return obj.id == res.data.subDepartmentKey;
                }).subDepartment
              : "-"
          );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // ui
  return (
    <>
      {isLoading && <CommonLoader />}
      <BreadcrumbComponent />
      <Paper
        elevation={8}
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
        <Box>
          <Grid container className={commonStyles.title}>
            <Grid item xs={1}>
              <IconButton
                style={{
                  color: "white",
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginRight: "2rem",
                }}
              >
                <FormattedLabel id="rtiApplicationList" />
              </h3>
            </Grid>
          </Grid>
        </Box>

        <Grid container style={{ padding: "10px" }}>
          {(logedInUser === "citizenUser" ||
            logedInUser === "cfcUser" ||
            (logedInUser === "departmentUser" && checkAuth())) && (
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "end" }}
            >
              <Button
                variant="contained"
                size="small"
                endIcon={<AddIcon />}
                type="primary"
                onClick={() => {
                  router.push(
                    "/RTIOnlineSystem/transactions/rtiApplication/termsNdCondition"
                  );
                }}
              >
                <FormattedLabel id="newText" />{" "}
              </Button>
            </Grid>
          )}
        </Grid>
        <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              printOptions: {
                copyStyles: true,
                hideToolbar: true,
                hideFooter: true,
              },
            },
          }}
          autoHeight
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
          density="compact"
          pagination
          paginationMode="server"
          rowCount={totalElements}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 20, 50, 100]}
          rows={dataSource}
          columns={columns}
          page={pageNo}
          onPageChange={(_data) => {
            setDataPage(_data);
            if (
              logedInUser === "departmentUser" &&
              authority &&
              authority.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID)
            ) {
              getApplicationListByDept(pageSize, _data);
            } else {
              getApplicationDetails(pageSize, _data);
            }
          }}
          onPageSizeChange={(_data) => {
            setDataPage(_data);
            if (
              logedInUser === "departmentUser" &&
              authority &&
              authority.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID)
            ) {
              getApplicationListByDept(_data, pageNo);
            } else {
              getApplicationDetails(_data, pageNo);
            }
          }}
        />
        <Modal
          title="Modal For Forward Application"
          open={isForwoardOpen}
          onClose={handleCancel}
          footer=""
          sx={{
            padding: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              overflowY: "scroll",
              minWidth: "50%",
              backgroundColor: "white",
              minHeight: "50%",
            }}
          >
            <Box style={{ height: "70vh" }}>
              <>
                {isForwardLoading && <CommonLoader />}

                <Box style={{ marginTop: "1rem" }}>
                  <Grid container className={commonStyles.title}>
                    <Grid item xs={12}>
                      <h3
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          marginRight: "2rem",
                        }}
                      >
                        <FormattedLabel id="forwardApplication" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onForwardApplication)}>
                    <Grid container spacing={1} sx={{ padding: "2rem" }}>
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled={true}
                          InputLabelProps={{ shrink: true }}
                          id="standard-textarea"
                          label={<FormattedLabel id="rtiApplicationNO" />}
                          multiline
                          variant="standard"
                          {...register("rtiapplicationNo")}
                          error={!!error.rtiapplicationNo}
                          helperText={
                            error?.rtiapplicationNo
                              ? error.rtiapplicationNo.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xl={8} lg={8} md={6} sm={6} xs={12}>
                        <TextField
                          disabled={true}
                          InputLabelProps={{ shrink: true }}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-textarea"
                          label={<FormattedLabel id="applicantName" />}
                          multiline
                          variant="standard"
                          {...register("applicantName")}
                          error={!!error.applicantName}
                          helperText={
                            error?.applicantName
                              ? error.applicantName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled={true}
                          InputLabelProps={{ shrink: true }}
                          id="standard-textarea"
                          label={<FormattedLabel id="subject" />}
                          multiline
                          variant="standard"
                          {...register("subject")}
                          error={!!error.subject}
                          helperText={
                            error?.subject ? error.subject.message : null
                          }
                        />
                      </Grid>

                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          label={<FormattedLabel id="currentdept" />}
                          id="standard-textarea"
                          InputLabelProps={{ shrink: true }}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          disabled
                          {...register("currentdept")}
                          error={!!error.currentdept}
                          helperText={
                            error?.currentdept
                              ? error.currentdept.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          label={<FormattedLabel id="currentSubDept" />}
                          id="standard-textarea"
                          disabled
                          InputLabelProps={{ shrink: true }}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("currentSubDept")}
                          error={!!error.currentSubDept}
                          helperText={
                            error?.currentSubDept
                              ? error.currentSubDept.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!error.zoneKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="forwardTozoneKey" required/>
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "100%" }}
                                fullWidth
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                label="Complaint Type"
                              >
                                {zoneDetails &&
                                  zoneDetails?.map((zoneDetails, index) => (
                                    <MenuItem
                                      key={index}
                                      value={zoneDetails.id}
                                    >
                                      {language == "en"
                                        ? zoneDetails?.zoneName
                                        : zoneDetails?.zoneNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="zoneKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {error?.zoneKey ? error.zoneKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!error.officeLocationKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="forwardToOfficeLocation" required/>
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "100%" }}
                                fullWidth
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                label="Complaint Type"
                              >
                                {wards &&
                                  wards?.map((officeLocationDetails, index) => (
                                    <MenuItem
                                      key={index}
                                      value={officeLocationDetails.id}
                                    >
                                      {language == "en"
                                        ? officeLocationDetails?.officeLocation
                                        : officeLocationDetails?.officeLocationMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="officeLocationKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {error?.officeLocationKey
                              ? error.officeLocationKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          error={!!error.departmentKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="forwardToDept" required/>
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                autoFocus
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value),
                                    getSubDepartmentDetails();
                                }}
                                label={<FormattedLabel id="forwardToDept" />}
                              >
                                {dependDepartment.filter(
                                  (obj) => obj.id !== 2
                                ) &&
                                  dependDepartment.map((department, index) => (
                                    <MenuItem key={index} value={department.id}>
                                      {language == "en"
                                        ? department.department
                                        : department.departmentMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="departmentKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {error?.departmentKey
                              ? error.departmentKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {subDepartments.length !== 0 &&
                        watch("departmentKey") && (
                          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <FormControl
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              variant="standard"
                              error={!!error.subDepartmentKey}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="forwardTosubDept" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    fullWidth
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label={
                                      <FormattedLabel id="subDepartmentKey" />
                                    }
                                  >
                                    {subDepartments &&
                                      subDepartments?.map(
                                        (subDepartment, index) => (
                                          <MenuItem
                                            key={index}
                                            value={subDepartment.id}
                                          >
                                            {language == "en"
                                              ? subDepartment.subDepartment
                                              : subDepartment.subDepartmentMr}
                                          </MenuItem>
                                        )
                                      )}
                                  </Select>
                                )}
                                name="subDepartmentKey"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {error?.subDepartmentKey
                                  ? error.subDepartmentKey.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        )}

                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          label={<FormattedLabel id="remark" required/>}
                          id="standard-textarea"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          multiline
                          inputProps={{ maxLength: 500, minLength: 10 }}
                          {...register("remarks")}
                          error={!!error.remarks}
                          helperText={
                            error?.remarks ? error.remarks.message : null
                          }
                        />
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={12}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 5,
                          }}
                        >
                          <Button
                            sx={{ marginRight: 8 }}
                            variant="contained"
                            color="error"
                            size="small"
                            endIcon={<ClearIcon />}
                            onClick={() => handleCancel()}
                          >
                            <FormattedLabel id="closeModal" />
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={12}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 5,
                          }}
                        >
                          <Button
                            sx={{ marginRight: 8 }}
                            type="submit"
                            size="small"
                            disabled={
                              watch("departmentKey") &&
                              watch("remarks") &&
                              watch("zoneKey") &&
                              watch("officeLocationKey")
                                ? false
                                : true
                            }
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            <FormattedLabel id="forwardApplication" />
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                </FormProvider>
              </>
            </Box>
          </Box>
        </Modal>
      </Paper>
    </>
  );
};

export default Index;

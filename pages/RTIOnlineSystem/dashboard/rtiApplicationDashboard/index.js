import {
  Button,
  Link,
  Grid,
  Tooltip,
  IconButton,
  Typography,
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
import * as MuiIcons from "@mui/icons-material";
import styles from "../rtiApplicationDashboard/dashboard.module.css";
import moment from "moment";
import { Controller, FormProvider, useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useEffect, useState } from "react";
import { GridToolbar } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import sweetAlert from "sweetalert";
import { makeStyles } from "@mui/styles";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import Loader from "../../../../containers/Layout/components/Loader";
import roleId from "../../../../components/rtiOnlineSystem/commonRoleId";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const useStyles = makeStyles(() => ({
  dataGrid: {
    "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']": {
      display: "none",
    },
  },
}));

const RtiAppDashboard = (props) => {
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
  const [dependDeptId, setDependantDept] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartmentList] = useState([]);
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  let user = useSelector((state) => state.user.user);
  const [isForwoardOpen, setIsForward] = useState(false);
  const [applicationID, selectedApplicationId] = useState(null);
  const [applicationDetails, setApplicationDetails] = useState([]);
  const [selectDepartment, setSubDepartments] = useState(null);
  const [isBplval, setIsBpl] = useState(null);
  const logedInUser = localStorage.getItem("loggedInUser");
  const [completeCount, setCompleteCount] = useState(null);
  const [inProgressCount, setInProgressCount] = useState(null);
  const [loiCompleteCount, setLoiCompleteCount] = useState(null);
  const [totalCount, setTotoalCount] = useState(null);
  const [applicationBeyondSlaCount, setApplicationBeyondSla] = useState(null);
  const [dependDepartment, setdependDepartments] = useState([]);
  const [rtiApplicationDetails, setRtiApplicationDetails] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);
  const [applicationWithinSla, setApplicationWithinSla] = useState(null);
  const [officeLocationDetails, setOfficeLocationDetails] = useState([]);
  const [statusId, setStatusId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [statusAll, setStatus] = useState([]);
  const [dataPageNo, setDataPage] = useState();
  const [isForwardLoading, setIsForwardLoading] = useState(false);
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

  const user1 = useSelector((state) => {
    let userNamed =
      language === "en"
        ? state?.user?.user?.userDao && state?.user?.user?.userDao.firstNameEn
        : state?.user?.user?.userDao && state?.user?.user?.userDao.firstNameMr;
    return userNamed;
  });

  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return <Icon style={{ fontSize: "30px" }} />;
  };

  const [wards, setWards] = useState([]);
  const [zoneDetails, setZoneDetails] = useState();
  const handleCancel = () => {
    setIsForward(false);
  };

  useEffect(() => {
    getAllStatus();
    getZone();
    getDepartments();
    getAllSubDepartmentDetails();
    getOfficeLocation();
    getDashboardRtiCount();
  }, []);

  useEffect(() => {
    getApplicationListByDept();
  }, []);

  useEffect(() => {
    setDepartments(departments.filter((obj) => obj.id != dependDeptId));
  }, [dependDeptId]);

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
      watch("officeLocationKey") != ""
    ) {
      getDepartmentByOfficeLocation();
    }
    setdependDepartments([]);
    setValue("departmentKey", "");
  }, [watch("officeLocationKey")]);

  const getAllStatus = () => {
    axios
      .get(`${urls.RTI}/mstStatus/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
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
        )}&&locationkey=${watch("officeLocationKey")}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
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

  const getOfficeLocationByZone = () => {
    axios
      .get(
        `${
          urls.RTI
        }/mstZoneOfficeLocationDepartmentMapping/getAllLocByZone?zoneKey=${watch(
          "zoneKey"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
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

  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
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

  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
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

  const getDashboardRtiCount = () => {
    const data = {
      strFromDate: "2000-01-01 12:23:27.014",
      strToDate: "2080-12-31 12:23:27.014",
    };
    setIsLoading(true);
    axios
      .post(`${urls.RTI}/dashboard/getRtiCounts`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setIsLoading(false);
        for (var i = 0; i < r.data.length; i++) {
          if (r.data[i].trnType === "RAPN-Complete") {
            setCompleteCount(r.data[i].count);
          } else if (r.data[i].trnType === "RAPN-Inprogress") {
            setInProgressCount(r.data[i].count);
          } else if (r.data[i].status === 4 && r.data[i].trnType === "RAPN") {
            setLoiCompleteCount(r.data[i].count);
          } else if (r.data[i].trnType === "RAPN-Total") {
            setTotoalCount(r.data[i].count);
          } else if (r.data[i].trnType === "Application-Beyond-SLA") {
            setApplicationBeyondSla(r.data[i].count);
          } else if (r.data[i].trnType === "Application-Within-SLA") {
            setApplicationWithinSla(r.data[i].count);
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // get sub department
  const getAllSubDepartmentDetails = () => {
    axios
      .get(`${urls.RTI}/master/subDepartment/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
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
        cfcErrorCatchMethod(err, false);
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
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
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
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res, j) => {
        setIsLoading(false);
        setRtiApplicationDetails(res.data);
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (rtiApplicationDetails != null) {
      setDataSourceDetails();
    }
  }, [
    rtiApplicationDetails,
    language,
    departments,
    officeLocationDetails,
    zoneDetails,
  ]);

  // get application by departmentwise
  const getDashboardCardWiseData = (status, _pageSize = 10, _pageNo = 0) => {
    if (status != 0) {
      if (status === 12) {
        getWithoutSLA(_pageSize, _pageNo);
      } else if (status === 13) {
        getWithSLA(_pageSize, _pageNo);
      } else {
        setIsLoading(true);
        axios
          .post(
            `${urls.RTI}/trnRtiApplication/getAllByStatus?status=${status}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
              params: {
                pageSize: _pageSize,
                pageNo: _pageNo,
              },
            }
          )
          .then((res, j) => {
            setIsLoading(false);
            setRtiApplicationDetails(res.data);
            setTotalElements(res.data.totalElements);
            setPageSize(res.data.pageSize);
            setPageNo(res.data.pageNo);
          })
          .catch((err) => {
            setIsLoading(false);
            cfcErrorCatchMethod(err, false);
          });
      }
    } else {
      getApplicationListByDept(_pageSize, _pageNo);
    }
  };

  const getWithSLA = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    const tempData = axios
      .get(`${urls.RTI}/trnRtiApplication/getApplicationBeyondSLA`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setRtiApplicationDetails(res.data);
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const getWithoutSLA = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    const tempData = axios
      .get(`${urls.RTI}/trnRtiApplication/getApplicationWithinSLA`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setRtiApplicationDetails(res.data);
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let data = res.data.zone.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          zoneName: r.zoneName,
          zoneNameMr: r.zoneNameMr,
          zone: r.zone,
          ward: r.ward,
          area: r.area,
          zooAddress: r.zooAddress,
          zooAddressAreaInAcres: r.zooAddressAreaInAcres,
          zooApproved: r.zooApproved,
          zooFamousFor: r.zooFamousFor,
        }));
        setZoneDetails(data.sort(sortByProperty("zoneName")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
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

  // set datatable details
  const setDataSourceDetails = () => {
    let data = rtiApplicationDetails;
    let result = data.trnRtiApplicationList;
    const _res = result.map((res, i) => {
      return {
        srNo: i + 1 + data.pageNo * data.pageSize,
        id: res.id,
        applicationNo: res.applicationNo,
        deptId: res.departmentKey,
        applicantName:
          res.applicantFirstName +
          " " +
          res.applicantMiddleName +
          " " +
          res.applicantLastName,
        departmentName: departments?.find((obj) => {
          return obj.id == res.departmentKey;
        })
          ? departments.find((obj) => {
              return obj.id == res.departmentKey;
            }).department
          : "-",
        departmentNameMr: departments?.find((obj) => {
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
        createdDate: res.createdDate,
        isTransfer: res.isTransfer === false ? null : res.isTransfer,
        parentId: res.parentId,
        description: res.description,
        subject: res.subject,
        applicationDate:
          res.applicationDate === null
            ? "-"
            : moment(res.applicationDate).format("DD-MM-YYYY"),
        slaDate:
          res.slaDate === null ? "-" : moment(res.slaDate).format("DD-MM-YYYY"),
        pendingDays:
          res.pendingDays < 0
            ? `OverDue (${res.pendingDays})`
            : res.pendingDays,
        noOfDays: difference(res.slaDate),
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
        statusVal: res.status,
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
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "applicantName" : "applicantName",
      headerName: <FormattedLabel id="applicantName" />,
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "applicationNo",
      headerName: <FormattedLabel id="applicationNo" />,
      flex: 1,
      minWidth: 280,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "zoneName" : "zoneNameMr",
      headerName: <FormattedLabel id="zoneKey" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "officeLocation" : "officeLocationMar",
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
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: <FormattedLabel id="departmentKey" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="rtiFileDate" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "slaDate",
      headerName: <FormattedLabel id="rtiDueDate" />,
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "pendingDays",
      headerName: <FormattedLabel id="totalNoOfDays" />,
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: <FormattedLabel id="status" />,
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
        const isOverdue =
          params.row.pendingDays === "OverDue" ||
          parseInt(params.row.pendingDays) < 0;
        return (
          <>
            <IconButton
              onClick={() => {
                router1.push({
                  pathname:
                    "/RTIOnlineSystem/dashboard/rtiApplicationDashboard/view",
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
            {user.roleIds &&
              user.roleIds.includes(roleId.RTI_ADHIKARI_ROLE_ID) &&
              params.row.statusVal === 3 &&
              !isOverdue && (
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
                        selectedApplicationId(params?.row?.id);
                      } else {
                        if (
                          logedInUser === "departmentUser" &&
                          user.roleIds &&
                          user.roleIds.includes(roleId.RTI_ADHIKARI_ROLE_ID)
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
          </>
        );
      },
    },
  ];
  const classes = useStyles();

  // forward application
  const onForwardApplication = (formData) => {
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
    setIsForwardLoading(true);
    const tempData = axios
      .post(`${urls.RTI}/trnRtiApplication/save`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
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
              : `आरटीआय अर्ज क्र ${
                  res.data.message.split("[")[1].split("]")[0]
                } यशस्वीरित्या हस्तांतरित केले आहे!`,
            { button: language == "en" ? "Ok" : "ठीक आहे" }
          );
          getApplicationListByDept();
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
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res, i) => {
        setApplicationDetails(res.data);
        setValue("rtiapplicationNo", res.data.applicationNo);
        setValue(
          "applicantName",
          res.data.applicantFirstName +
            " " +
            res.data.applicantMiddleName +
            " " +
            res.data.applicantLastName
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
        <Box>
          <Box
            sx={{
              display: "flex",
              padding: "30px",

              flexDirection: "column",
            }}
          >
            {/* <Typography>
              <p className={styles.fancy_link}>
                <>
                  <FormattedLabel id="welcomeToTheDashboard" />{" "}
                  <strong>{user1}</strong>{" "}
                </>
              </p>
            </Typography> */}
            <Grid item xs={12}>
              <h2 style={{ textAlign: "center", color: "#ff0000" }}>
                <b>
                  {language == "en"
                    ? "RTI Application Dashboard"
                    : "माहिती अधिकार अर्ज डॅशबोर्ड"}
                </b>
              </h2>
            </Grid>
            {/* .......................CARDS............................ */}
            <Grid
              container
              style={{ display: "flex", justifyContent: "center" }}
            >
              {[
                {
                  id: 1,
                  icon: "Menu",
                  count: totalCount,
                  name: <FormattedLabel id="dashboardTotalCount" />,
                  bg: "#FFC0CB",
                },

                {
                  id: 2,
                  icon: "Menu",
                  count: loiCompleteCount,
                  name: <FormattedLabel id="dashboardLoiGenerated" />,
                  bg: "#FFA500",
                },
                {
                  id: 3,
                  icon: "Menu",
                  count: completeCount,
                  name: <FormattedLabel id="dashboardCompleted" />,
                  bg: "#00FF00",
                },
                {
                  id: 4,
                  icon: "Menu",
                  count: applicationWithinSla,
                  name: <FormattedLabel id="applicationWithSLA" />,
                  bg: "#FFFF00",
                },
                {
                  id: 5,
                  icon: "Menu",
                  count: applicationBeyondSlaCount,
                  name: <FormattedLabel id="applicationWithoutSLA" />,
                  bg: "#FF0000",
                },
              ].map((val, id) => {
                return (
                  <Tooltip title={val.name}>
                    <Grid
                      key={id}
                      item
                      xs={3}
                      style={{
                        paddingTop: "10px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        paddingBottom: "0px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Grid
                        container
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "10px",
                          borderRadius: "15px",
                          backgroundColor: "white",
                          height: "100%",
                        }}
                        sx={{
                          ":hover": {
                            boxShadow: "0px 5px #556CD6",
                          },
                        }}
                        boxShadow={3}
                      >
                        <Grid
                          item
                          xs={2}
                          style={{
                            padding: "5px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: val.bg,
                            color: "white",
                            borderRadius: "7px",
                          }}
                          boxShadow={2}
                        >
                          <ComponentWithIcon iconName={val.icon} />
                        </Grid>
                        <Grid
                          item
                          xs={10}
                          style={{
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            style={{
                              fontWeight: "500",
                              fontSize: "25px",
                              color: "#556CD6",
                            }}
                          >
                            {val.count}
                          </Typography>
                          {val.id === 1 && (
                            <Link
                              style={{ fontWeight: "600" }}
                              onClick={() => {
                                setStatusId(0);
                                getDashboardCardWiseData(0);
                              }}
                              tabIndex={0}
                              component="button"
                            >
                              {val.name}
                            </Link>
                          )}
                          {val.id === 2 && (
                            <Link
                              style={{ fontWeight: "600" }}
                              onClick={() => {
                                getDashboardCardWiseData(4);
                                setStatusId(4);
                              }}
                              tabIndex={0}
                              component="button"
                            >
                              {val.name}
                            </Link>
                          )}
                          {val.id === 3 && (
                            <Link
                              style={{ fontWeight: "600" }}
                              onClick={() => {
                                getDashboardCardWiseData(11);
                                setStatusId(11);
                              }}
                              tabIndex={0}
                              component="button"
                            >
                              {val.name}
                            </Link>
                          )}

                          {val.id === 4 && (
                            <Link
                              style={{ fontWeight: "600" }}
                              onClick={() => {
                                getDashboardCardWiseData(12);
                                setStatusId(12);
                              }}
                              tabIndex={0}
                              component="button"
                            >
                              {val.name}
                            </Link>
                          )}

                          {val.id === 5 && (
                            <Link
                              style={{ fontWeight: "600" }}
                              onClick={() => {
                                getDashboardCardWiseData(13);
                                setStatusId(13);
                              }}
                              tabIndex={0}
                              component="button"
                            >
                              {val.name}
                            </Link>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Tooltip>
                );
              })}
            </Grid>
          </Box>
        </Box>
        {/* <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {" "}
            <FormattedLabel id="rtiApplicationList" />
          </h2>
        </Box> */}
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
            marginTop: "20px",
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
          page={pageNo}
          columns={columns}
          onPageChange={(_data) => {
            setDataPage(_data);
            if (
              logedInUser === "departmentUser" &&
              user.roleIds &&
              user.roleIds.includes(roleId.RTI_ADHIKARI_ROLE_ID)
            ) {
              getDashboardCardWiseData(statusId, pageSize, _data);
            }
          }}
          onPageSizeChange={(_data) => {
            if (
              logedInUser === "departmentUser" &&
              user.roleIds &&
              user.roleIds.includes(roleId.RTI_ADHIKARI_ROLE_ID)
            ) {
              getDashboardCardWiseData(statusId, _data, pageNo);
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
            {isForwardLoading && <CommonLoader />}
              <>
                <Box>
                  <Grid
                    container
                    className={commonStyles.title}
                    style={{ marginTop: "1rem" }}
                  >
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
                            <FormattedLabel id="forwardToDept" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                autoFocus
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value),
                                    setSubDepartments(value.target.value);
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

export default RtiAppDashboard;

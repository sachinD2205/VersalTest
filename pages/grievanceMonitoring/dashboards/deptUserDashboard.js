import {
  Box,
  Button,
  IconButton,
  Grid,
  Checkbox,
  Link,
  Typography,
  Paper,
  Tooltip,
  Autocomplete,
  TextField,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import * as MuiIcons from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import urls from "../../../URLS/urls";
import moment from "moment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DashboardHome2 from "./deptUserDashboardV2";
import { FormProvider, useForm } from "react-hook-form";
import CommonLoader from "../../../containers/reuseableComponents/commonLoader";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../util/commonErrorUtil";
const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [complaintTypes, setcomplaintTypes] = useState([]);
  const [complaintSubTypes, setComplaintSubTypes] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [allWards, setAllWards] = useState([]);
  const [areaId, setAreaId] = useState([]);
  const [selectedComplaintTypes, setSelectedComplaintType] = useState([]);
  const [selectedComplaintSubTypes, setSelectedComplaintSubType] = useState([]);
  const [selectedZone, setSelectedZone] = useState([]);
  const [selectedWard, setSelectedWard] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);
  const language = useSelector((state) => state?.labels?.language);
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const [visible, setVisible] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [unVerified, setUnVerified] = useState([]);
  const [VerifiedD, setVerifiedD] = useState([]);
  const headers = { Authorization: `Bearer ${userToken}` };
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [myGrievances, setMyGrievances] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
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
  const handleSelect = (evt, value) => {
    const selectedIds = value.map((val) => val.id);
    setSelectedComplaintType(selectedIds);
  };
  const [uIData, setUIData] = useState([]);

  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return <Icon style={{ fontSize: "30px" }} />;
  };
  const [isDeptUser, setIsDeptUser] = useState(false);
  const user = useSelector((state) => {
    return state?.user?.user?.userDao?.id;
  });

  const handleSubSelect = (evt, value) => {
    const selectedIds = value.map((val) => val.id);
    setSelectedComplaintSubType(selectedIds);
  };

  useEffect(() => {
    if (myGrievances === false) {
      getTransactions();
      setIsDeptUser(false);
    }
    if (myGrievances !== false) {
      setIsDeptUser(true);
      getSortedTransactions();
    }
  }, [myGrievances]);

  useEffect(() => {
    let UnresolvedComplaints = dashboardData?.filter(
      (obj) =>
        obj.complaintStatusText === "Open" ||
        obj.complaintStatusText === "Reopen"
    );
    let resolvedComplaints = dashboardData?.filter(
      (obj) => obj.complaintStatusText === "Close"
    );
    setVerifiedD(resolvedComplaints);
    setUnVerified(UnresolvedComplaints);
    if (selectedCard === null) {
      setUIData(dashboardData);
    } else if (selectedCard === 1) {
      setUIData(
        resolvedComplaints.map((obj, index) => {
          return {
            ...obj,
            srNo: index + 1,
          };
        })
      );
    } else if (selectedCard === 2) {
      setUIData(
        UnresolvedComplaints.map((obj, index) => {
          return {
            ...obj,
            srNo: index + 1,
          };
        })
      );
    }
  }, [selectedCard, dashboardData]);

  const getSortedTransactions = async () => {
    try {
      setIsLoading(true); // Set loading before sending API request
      const response = await axios.get(
        `${urls.GM}/trnRegisterComplaint/getListByUser?id=${user}`,
        {
          headers: headers,
        }
      );
      let result = response?.data?.trnRegisterComplaintList;
      setIsLoading(false);
      setDashboardData(
        result?.map((val, i) => {
          return {
            id: val.id,
            srNo: i + 1,
            firstName: val.firstName,
            complaintType: val.complaintType,
            complaintTypeMr: val.complaintTypeMr,
            citizenName: val.citizenName,
            city: val.city,
            complaintDescription: val.complaintDescription,
            complaintSubType:
              val.complaintSubType != null ? val.complaintSubType : "-",
            complaintSubTypeMr:
              val.complaintSubTypeMr != null ? val.complaintSubTypeMr : "-",
            deptName: val.deptName,
            deptNameMr: val.deptNameMr,
            email: val.email,
            mobileNumber: val.mobileNumber,
            subDepartment: val.subDepartment,
            subDepartmentText: val.subDepartmentText,
            complaintStatus: val.complaintStatus,
            grievanceDate: moment(val.createDtTm).format("DD-MM-YYYY H:mm:ss"),
            escDate: moment(val.escDate).format("DD-MM-YYYY H:mm:ss"),
            complaintType: val.complaintType,
            complaintStatusText:
              val.reopenCount > 0 && val.complaintStatusText === "Open"
                ? "Reopen"
                : val.complaintStatusText,
            complaintStatusTextMr:
              val.reopenCount > 0 && val.complaintStatusTextMr === "उघडा"
                ? "पुन्हा उघडले"
                : val.complaintStatusTextMr,
            createdBy: val.createdBy,
            applicationNo: val.applicationNo,
          };
        })
      );
      setIsLoading(false); // Stop loading
    } catch (err) {
      setIsLoading(false); // Stop loading in case of error
      cfcErrorCatchMethod(err, false);
    }
  };

  const handleZoneSelect = (evt, value) => {
    const selectedIds = value.map((val) => val.id);
    setSelectedZone(selectedIds);
  };

  const handleWardSelect = (evt, value) => {
    const selectedIds = value.map((val) => val.id);
    setSelectedWard(selectedIds);
  };

  const handleAreaSelect = (evt, value) => {
    const selectedIds = value.map((val) => val.areaId);
    setSelectedArea(selectedIds);
  };
  useEffect(() => {
    getComplaintTypes();
    getAllZones();
  }, []);

  useEffect(() => {
    getComplaintSubType();
  }, [selectedComplaintTypes]);

  useEffect(() => {
    if (selectedZone.length === 1) getAllWards();
  }, [selectedZone]);

  const getTransactions = async () => {
    let url = ` `;
    try {
      url = `${urls.GM}/trnRegisterComplaint/getListByDeptV4`;
      setIsLoading(true); // Set loading before sending API request
      const response = await axios.get(url, {
        headers: headers,
      });
      let result = response?.data?.trnRegisterComplaintList;
      setIsLoading(false);
      setDashboardData(
        result?.map((val, i) => {
          return {
            id: val.id,
            srNo: i + 1,
            firstName: val.firstName,
            complaintType: val.complaintType,
            complaintTypeMr: val.complaintTypeMr,
            citizenName: val.citizenName,
            city: val.city,
            complaintDescription: val.complaintDescription,
            complaintSubType:
              val.complaintSubType != null ? val.complaintSubType : "-",
            complaintSubTypeMr:
              val.complaintSubTypeMr != null ? val.complaintSubTypeMr : "-",
            deptName: val.deptName,
            deptNameMr: val.deptNameMr,
            email: val.email,
            mobileNumber: val.mobileNumber,
            subDepartment: val.subDepartment,
            subDepartmentText: val.subDepartmentText,
            complaintStatus: val.complaintStatus,
            grievanceDate: moment(val.createDtTm).format("DD-MM-YYYY H:mm:ss"),
            escDate: moment(val.escDate).format("DD-MM-YYYY H:mm:ss"),
            complaintType: val.complaintType,
            complaintStatusText:
              val.reopenCount > 0 && val.complaintStatusText === "Open"
                ? "Reopen"
                : val.complaintStatusText,
            complaintStatusTextMr:
              val.reopenCount > 0 && val.complaintStatusTextMr === "उघडा"
                ? "पुन्हा उघडले"
                : val.complaintStatusTextMr,
            createdBy: val.createdBy,
            applicationNo: val.applicationNo,
          };
        })
      );

      setIsLoading(false); // Stop loading
    } catch (err) {
      setIsLoading(false); // Stop loading in case of error
      cfcErrorCatchMethod(err, false);
    }
  };

  useEffect(() => {
    if (selectedZone.length == 1 && selectedWard.length === 1) {
      getAllArea();
    }
  }, [selectedZone, selectedWard]);

  // getComplaintTypes
  const getComplaintTypes = () => {
    axios
      .get(`${urls.GM}/complaintTypeMaster/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        let data = res?.data?.complaintTypeMasterList?.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          complaintTypeEn: r.complaintType,
          complaintTypeMr: r.complaintTypeMr,
          departmentId: r.departmentId,
          departmentName: r.departmentName,
        }));
        setcomplaintTypes(data.sort(sortByProperty("complaintTypeEn")));
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // getComplaintSubType
  const getComplaintSubType = () => {
    if (selectedComplaintTypes.length === 1) {
      setIsLoading(true);
      axios
        .get(
          `${urls.GM}/complaintSubTypeMaster/getAllByCmplId?id=${selectedComplaintTypes[0]}`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setIsLoading(false);
          let data = res?.data?.complaintSubTypeMasterList?.map((r, i) => ({
            id: r.id,
            complaintSubType: r.complaintSubType,
            complaintSubTypeMr: r.complaintSubTypeMr,
            complaintTypeId: r.complaintTypeId,
            categoryKey: r.categoryKey,
            categoryName: r.categoryName,
            categoryNameMr: r.categoryNameMr,
          }));
          setComplaintSubTypes(data.sort(sortByProperty("complaintSubType")));
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  const getAllArea = () => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId?moduleId=9&zoneId=${selectedZone[0]}&wardId=${selectedWard[0]}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAreaId(
            res?.data?.map((r, i) => ({
              id: r.id,
              srNo: i + 1,
              areaId: r.areaId,
              areaName: r.areaName,
              areaNameMr: r.areaNameMr,
            }))
          );
        } else {
        }
      })
      .catch((error) => {
        cfcErrorCatchMethod(error, false);
      });
  };

  // getAllZones
  const getAllZones = () => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getZoneByApplicationId?applicationId=9`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllZones(
            res?.data?.map((r, i) => ({
              id: r.zoneId,
              zoneName: r.zoneName,
              zoneNameMr: r.zoneNameMr,
            }))
          );
        } else {
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // getAllWards
  const getAllWards = () => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId?moduleId=9&zoneId=${selectedZone[0]}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setAllWards(
            res?.data?.map((r, i) => ({
              id: r?.wardId,
              wardName: r?.wardName,
              wardNameMr: r?.wardNameMr,
            }))
          );
        } else {
        }
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



  const onSubmitForm = (formData) => {
    let complaintSubType =
      selectedComplaintTypes.length == 0 ? [] : selectedComplaintSubTypes;
    let ward = selectedZone.length === 0 ? [] : selectedWard;
    let area = selectedZone.length === 0 ? [] : selectedArea;
    const finalBodyForApi = {
      applicationNo:
        formData.applicationNo != "" ? formData.applicationNo : null,
      firstName: formData.firstName != "" ? formData.firstName : null,
      lastName: formData.lastName != "" ? formData.lastName : null,
      mobileNumber: formData.mobileNo != "" ? Number(formData.mobileNo) : null,
      complaintTypeIdList: selectedComplaintTypes,
      complaintSubTypeIdList: complaintSubType,
      wardList: ward,
      zoneList: selectedZone,
      areaList: area,
    };
    if (
      finalBodyForApi.applicationNo === null &&
      finalBodyForApi.firstName === null &&
      finalBodyForApi.lastName === null &&
      finalBodyForApi.mobileNumber === null &&
      finalBodyForApi.zoneList.length === 0 &&
      finalBodyForApi.complaintTypeIdList.length === 0
    ) {
      sweetAlert(
        language === "en"
          ? "Please Enter or Select atleast one field"
          : "कृपया प्रविष्ट करा किंवा किमान एक फील्ड निवडा",
        { button: language === "en" ? "Ok" : "ठीक आहे", icon: "error" }
      );
    } else {
      setIsLoading(true);
      axios
        .post(
          `${urls.GM}/trnRegisterComplaint/getListBySearchCriteria`,
          finalBodyForApi,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setIsLoading(false);
          if (res.status == 200 || res.status == 201) {
            let result = res.data?.trnRegisterComplaintList;
            if (result.length != 0) {
              setDashboardData(
                result?.map((val, i) => {
                  return {
                    id: val.id,
                    srNo: i + 1,
                    firstName: val.firstName,
                    complaintType: val.complaintType,
                    complaintTypeMr: val.complaintTypeMr,
                    citizenName: val.citizenName,
                    city: val.city,
                    complaintDescription: val.complaintDescription,
                    complaintSubType:
                      val.complaintSubType != null ? val.complaintSubType : "-",
                    complaintSubTypeMr:
                      val.complaintSubTypeMr != null
                        ? val.complaintSubTypeMr
                        : "-",
                    deptName: val.deptName,
                    deptNameMr: val.deptNameMr,
                    email: val.email,
                    mobileNumber: val.mobileNumber,
                    subDepartment: val.subDepartment,
                    subDepartmentText: val.subDepartmentText,
                    complaintStatus: val.complaintStatus,
                    grievanceDate: moment(val.createDtTm).format(
                      "DD-MM-YYYY H:mm:ss"
                    ),
                    escDate: moment(val.escDate).format("DD-MM-YYYY H:mm:ss"),
                    complaintType: val.complaintType,
                    complaintStatusText:
                      val.reopenCount > 0 && val.complaintStatusText === "Open"
                        ? "Reopen"
                        : val.complaintStatusText,
                    complaintStatusTextMr:
                      val.reopenCount > 0 &&
                      val.complaintStatusTextMr === "उघडा"
                        ? "पुन्हा उघडले"
                        : val.complaintStatusTextMr,
                    createdBy: val.createdBy,
                    applicationNo: val.applicationNo,
                  };
                })
              );
            } else {
              sweetAlert(
                language == "en" ? "Data Not Found" : "डेटा सापडला नाही",
                { button: language === "en" ? "Ok" : "ठीक आहे", icon: "error" }
              );
              setDashboardData([]);
            }
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };
  return (
    <>
      <></>
      {isLoading && <CommonLoader />}
      <Box>
        <Box
          sx={{
            display: "flex",
            padding: "30px",
            flexDirection: "column",
          }}
        >
          <Box>
            <h2 style={{ textAlign: "center", color: "#ff0000" }}>
              <b>
                {language == "en"
                  ? "Grievance Monitoring Dashboard"
                  : "तक्रारींचा डॅशबोर्ड"}
              </b>
            </h2>
          </Box>

          <Grid container style={{ display: "flex", justifyContent: "center" }}>
            {[
              {
                icon: "Menu",
                count: `${VerifiedD?.length ? VerifiedD.length : 0}`,
                name: "Resolved Grievances",
                nameMr: "निरस्त तक्रारी",
                bg: "green",
              },
              {
                icon: "Menu",
                count: `${unVerified?.length ? unVerified.length : 0}`,
                name: "Unresolved Grievances",
                nameMr: "प्रलंबित तक्रारी",
                bg: "red",
              },
              {
                icon: "Menu",
                count:
                  VerifiedD?.length || unVerified?.length
                    ? unVerified?.length + VerifiedD?.length
                    : 0,
                name: "Total Grievances",
                nameMr: "एकूण तक्रारी",
                bg: "darkblue",
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
                            color: "darkblue",
                          }}
                        >
                          {val.count}
                        </Typography>
                        {language == "en"
                          ? val.name === "Resolved Grievances" && (
                              <Link
                                style={{
                                  fontWeight: "800",
                                  color: "green",
                                  letterSpacing: "1px",
                                }}
                                onClick={() => {
                                  setSelectedCard(1);
                                }}
                                tabIndex={0}
                                component="button"
                              >
                                {val.name}
                              </Link>
                            )
                          : val.nameMr == "निरस्त तक्रारी" && (
                              <Link
                                style={{
                                  fontWeight: "800",
                                  color: "green",
                                  letterSpacing: "1px",
                                }}
                                onClick={() => {
                                  setSelectedCard(1);
                                }}
                                tabIndex={0}
                                component="button"
                              >
                                {val.nameMr}
                              </Link>
                            )}
                        {language == "en"
                          ? val.name === "Unresolved Grievances" && (
                              <Link
                                style={{
                                  fontWeight: "800",
                                  color: "red",
                                  letterSpacing: "1px",
                                }}
                                onClick={() => {
                                  setSelectedCard(2);
                                }}
                                tabIndex={0}
                                component="button"
                              >
                                {val.name}
                              </Link>
                            )
                          : val.nameMr === "प्रलंबित तक्रारी" && (
                              <Link
                                style={{
                                  fontWeight: "800",
                                  color: "red",
                                  letterSpacing: "1px",
                                }}
                                onClick={() => {
                                  setSelectedCard(2);
                                }}
                                tabIndex={0}
                                component="button"
                              >
                                {val.nameMr}
                              </Link>
                            )}

                        {language == "en"
                          ? val.name === "Total Grievances" && (
                              <Link
                                style={{
                                  fontWeight: "800",
                                  color: "darkblue",
                                  cursor: "default",
                                  letterSpacing: "1px",
                                }}
                                onClick={() => {
                                  setSelectedCard(null);
                                }}
                                tabIndex={0}
                                component="button"
                              >
                                {val.name}
                              </Link>
                            )
                          : val.nameMr === "एकूण तक्रारी" && (
                              <Link
                                style={{
                                  fontWeight: "800",
                                  cursor: "default",
                                  letterSpacing: "1px",
                                }}
                                onClick={() => {
                                  setSelectedCard(null);
                                }}
                                tabIndex={0}
                                component="button"
                              >
                                {val.nameMr}
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
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          padding: 1,
        }}
      >
        {
          <div>
            <Box>
              <Grid
                container
                style={{
                  display: "flex",
                  alignItems: "center", // Center vertically
                  alignItems: "center",
                  width: "100%",
                  height: "auto",
                  overflow: "auto",
                  color: "white",
                  fontSize: "18.72px",
                  borderRadius: 100,
                  fontWeight: 500,
                  background:
                    "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
                }}
              >
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
                    <FormattedLabel id="searchGrievance" />
                  </h3>
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    style={{
                      color: "white",
                    }}
                    aria-label="open drawer"
                    onClick={() => {
                      setVisible(!visible);
                    }}
                  >
                    {!visible && <AddIcon />}
                    {visible && <RemoveIcon />}
                  </IconButton>
                </Grid>
              </Grid>
            </Box>

            <Grid
              container
              style={{ padding: "10px" }}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              {myGrievances === false && (
                <Grid
                  item
                  xs={2}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    variant="contained"
                    endIcon={<AccountCircleIcon />}
                    type="primary"
                    onClick={() => setMyGrievances(!myGrievances)}
                    size="small"
                  >
                    {myGrievances === false && (
                      <FormattedLabel id="myGrievance" />
                    )}
                  </Button>
                </Grid>
              )}

              {myGrievances !== false && (
                <Grid
                  item
                  xs={3.5}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    variant="contained"
                    endIcon={<AccountCircleIcon />}
                    type="primary"
                    onClick={() => setMyGrievances(!myGrievances)}
                    size="small"
                  >
                    {<FormattedLabel id="grievancesBehalfOfMyDepartment" />}
                  </Button>
                </Grid>
              )}

              <Grid
                item
                xs={2}
                style={{
                  textAlign: "center",
                }}
              >
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
                  type="primary"
                  onClick={() =>
                    router.push({
                      pathname:
                        "/grievanceMonitoring/transactions/RegisterComplaint",
                    })
                  }
                  size="small"
                  style={{
                    textAlign: "center",
                  }}
                >
                  {<FormattedLabel id="raiseGrievance" />}
                </Button>
              </Grid>
            </Grid>
            {visible && (
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "1rem",
                      display: "flex",
                      alignItems: "baseline",
                    }}
                  >
                    {/** GrievanceRiseDatee */}
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        InputLabelProps={{
                          shrink: watch("applicationNo") ? true : false,
                        }}
                        id="outlined-basic"
                        label={<FormattedLabel id="applicationNo" />}
                        variant="standard"
                        {...register("applicationNo")}
                      />
                    </Grid>

                    {/** applicationNumber */}
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        InputLabelProps={{
                          shrink: watch("firstName") ? true : false,
                        }}
                        id="outlined-basic"
                        label={<FormattedLabel id="firstNameV" />}
                        variant="standard"
                        {...register("firstName")}
                      />
                    </Grid>

                    {/** complaintStatus */}
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="outlined-basic"
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("lastName") ? true : false,
                        }}
                        label={<FormattedLabel id="lastNameV" />}
                        {...register("lastName")}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="outlined-basic"
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("mobileNo") ? true : false,
                        }}
                        inputProps={{ maxLength: 10 }}
                        label={<FormattedLabel id="mobileNo" />}
                        {...register("mobileNo")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                      <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={complaintTypes}
                        disableCloseOnSelect
                        getOptionLabel={(option) =>
                          language === "en"
                            ? option.complaintTypeEn
                                ?.split(" ")
                                .map((word) => word.charAt(0))
                                .join("")
                                .toUpperCase()
                            : option.complaintTypeMr
                                ?.split(" ")
                                .map((word) => word.charAt(0))
                                .join(" ")
                        }
                        onChange={handleSelect}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              checked={selected}
                            />
                            {language === "en"
                              ? option.complaintTypeEn
                              : option.complaintTypeMr}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            variant="standard"
                            {...params}
                            label={<FormattedLabel id="complaintTypes" />}
                          />
                        )}
                      />
                    </Grid>

                    {/** complaintSubType */}

                    {selectedComplaintTypes?.length === 1 ? (
                      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <Autocomplete
                          multiple
                          variant="standard"
                          id="checkboxes-tags-demo"
                          options={complaintSubTypes}
                          disableCloseOnSelect
                          getOptionLabel={(option) =>
                            language === "en"
                              ? option.complaintSubType
                                  ?.split(" ")
                                  .map((word) => word.charAt(0))
                                  .join("")
                                  .toUpperCase()
                              : option.complaintSubTypeMr
                                  ?.split(" ")
                                  .map((word) => word.charAt(0))
                                  .join(" ")
                          }
                          onChange={handleSubSelect}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                checked={selected}
                              />
                              {language === "en"
                                ? option.complaintSubType
                                : option.complaintSubTypeMr}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              variant="standard"
                              {...params}
                              label={<FormattedLabel id="complaintSubTypes" />}
                            />
                          )}
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="outlined-basic"
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          label={<FormattedLabel id="complaintSubTypes" />}
                          value={"All"}
                          disabled
                        />
                      </Grid>
                    )}

                    {/** zone */}
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                      <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={allZones}
                        disableCloseOnSelect
                        getOptionLabel={(option) =>
                          language === "en"
                            ? option.zoneName
                                ?.split(" ")
                                .map((word) => word.charAt(0))
                                .join("")
                                .toUpperCase()
                            : option.zoneNameMr
                                ?.split(" ")
                                .map((word) => word.charAt(0))
                                .join(" ")
                        }
                        onChange={handleZoneSelect}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              checked={selected}
                            />
                            {language === "en"
                              ? option.zoneName
                              : option.zoneNameMr}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            variant="standard"
                            {...params}
                            label={<FormattedLabel id="zone" />}
                          />
                        )}
                      />
                    </Grid>

                    {/** ward */}
                    {selectedZone.length === 1 ? (
                      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <Autocomplete
                          multiple
                          id="checkboxes-tags-demo"
                          options={allWards}
                          disableCloseOnSelect
                          getOptionLabel={(option) =>
                            language === "en"
                              ? option.wardName
                                  ?.split(" ")
                                  .map((word) => word.charAt(0))
                                  .join("")
                                  .toUpperCase()
                              : option.wardNameMr
                                  ?.split(" ")
                                  .map((word) => word.charAt(0))
                                  .join(" ")
                          }
                          onChange={handleWardSelect}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                checked={selected}
                              />
                              {language === "en"
                                ? option.wardName
                                : option.wardNameMr}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              variant="standard"
                              {...params}
                              label={<FormattedLabel id="ward" />}
                            />
                          )}
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="outlined-basic"
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          label={<FormattedLabel id="ward" />}
                          value={"All"}
                          disabled
                        />
                      </Grid>
                    )}
                    {/** Area */}
                    {selectedWard.length === 1 && selectedZone.length === 1 ? (
                      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <Autocomplete
                          multiple
                          id="checkboxes-tags-demo"
                          options={areaId}
                          disableCloseOnSelect
                          getOptionLabel={(option) =>
                            language === "en"
                              ? option.areaName
                                  ?.split(" ")
                                  .map((word) => word.charAt(0))
                                  .join("")
                                  .toUpperCase()
                              : option.areaNameMr
                                  ?.split(" ")
                                  .map((word) => word.charAt(0))
                                  .join(" ")
                          }
                          onChange={handleAreaSelect}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                checked={selected}
                              />
                              {language === "en"
                                ? option.areaName
                                : option.areaNameMr}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              variant="standard"
                              {...params}
                              label={<FormattedLabel id="area" />}
                            />
                          )}
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="outlined-basic"
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          label={<FormattedLabel id="area" />}
                          value={"All"}
                          disabled
                        />
                      </Grid>
                    )}
                  </Grid>
                  {/**Buttons */}
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "10px",
                      paddingBottom: "5vh",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        style={{ borderRadius: "20px" }}
                        size="small"
                        onClick={() => {
                          setVisible(!visible);

                          setValue("applicationNo", "");
                          setValue("firstName", "");
                          setValue("lastName", "");
                          setValue("mobileNo", "");
                          setSelectedArea([]);
                          setSelectedWard([]);
                          setSelectedComplaintType([]);
                          setSelectedZone([]);
                          setSelectedComplaintSubType([]);
                          getTransactions();
                        }}
                      >
                        <FormattedLabel id="cancel" />
                      </Button>
                      <Grid
                        item
                        xs={12}
                        sm={3}
                        md={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          style={{ borderRadius: "20px" }}
                          size="small"
                        >
                          <FormattedLabel id="submit" />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            )}
          </div>
        }
      </Paper>
      <DashboardHome2 data={uIData} isDashboard={isDeptUser} />
    </>
  );
};
export default Index;

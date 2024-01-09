import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  FormControlLabel,
  Checkbox,
  InputLabel,
  MenuItem,
  Paper,
  ThemeProvider,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import trnNewApplicationSchema from "../../../../containers/schema/BsupNagarvasthiSchema/trnNewApplicationSchema.js";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import Loader from "../../../../containers/Layout/components/Loader";
import divyangData from "../divyang.json";
import bsupUserRoles from "../../../../components/bsupNagarVasthi/userRolesBSUP";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BachatGatCategorySchemes = () => {
  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(trnNewApplicationSchema),
    mode: "onChange",
  });
  const [hanadleStudent, setHanadleStudent] = useState([]);
  const [serviceId, setServiceId] = useState([]);
  const router = useRouter();
  const [zoneNames, setZoneNames] = useState([]);
  const [statusAll, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [wardNames, setWardNames] = useState([]);
  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);
  const [religionNames, setReligionNames] = useState([]);
  const [castNames, setCastNames] = useState([]);
  const [dependency, setDependency] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [bankMaster, setBankMasters] = useState([]);
  const [docUpload, setDocUpload] = useState([]);
  const [eligibilityCriteriaDetails, setEligiblityCriteriaDetails] = useState(
    []
  );
  const [statusVal, setStatusVal] = useState(null);
  const [eligiblityData, setEligiblityCriteriaData] = useState([]);
  const user = useSelector((state) => state.user.user);
  const loggedUser = localStorage.getItem("loggedInUser");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [genderDetails, setGenderDetails] = useState([]);
  const [eligiblityDocuments, setEligiblityDocuments] = useState([]);
  const [fetchDocument, setFetchDocuments] = useState([]);
  const [newSchemeDetails, setNewSchemeDetails] = useState([]);
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  const [userLst, setUserLst] = useState([]);
  const [remarkTableData, setRemarkData] = useState([]);
  const [subSchemeVal, setSubScheme] = useState();
  const [mainSchemeVal, setMainScheme] = useState();
  const [appliNo, setApplicationNo] = useState();
  const [currentStatus1, setCurrentStatus] = useState();
  const language = useSelector((state) => state.labels.language);
  const [bankDoc, setBankDoc] = useState([]);
  const [bachatgatrejectionCategories, setBachatgatrejectionCategories] =
    useState([]);
  const [rejectReason, setRejectReason] = useState();
  const [isApproveChecked, setIsApproveChecked] = useState(false);
  const [isRevertChecked, setIsRevertChecked] = useState(false);
  const [isRejectChecked, setIsRejectChecked] = useState(false);
  const [isRemarksFilled, setIsRemarksFilled] = useState(false);

  const [samuhaSanghatakRemark, setSamuhaSanghatakRemark] = useState("");
  const [deptClerkRemark, setDeptClerkRemark] = useState("");
  const [asstCommissionerRemark, setAsstCommissionerRemark] = useState("");
  const [deptyCommissionerRemark, setDeptyCommissionerRemark] = useState("");
  const headers =
    loggedUser === "citizenUser"
      ? { Userid: user?.id }
      : { Authorization: `Bearer ${user?.token}` };
  const [bachatgatApprovalCategories, setBachatgatApprovalCategories] =
    useState([]);
  const [bachatgatRevertCategories, setBachatgatRevertCategories] = useState(
    []
  );

  useEffect(() => {
    getZoneName();
    getWardNames();
    getCRAreaName();
    getCastDetails();
    getBankMasters();
    getAllStatus();
    getGenders();
    getReligionDetails();
    getRejectCategories();
  }, []);
  useEffect(() => {
    setIsRemarksFilled(
      samuhaSanghatakRemark ||
        deptClerkRemark ||
        asstCommissionerRemark ||
        deptyCommissionerRemark
    );
  }, [
    samuhaSanghatakRemark,
    deptClerkRemark,
    asstCommissionerRemark,
    deptyCommissionerRemark,
  ]);

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined)
      getBachatGatCategoryNewScheme();
  }, [router.query.id]);

  useEffect(() => {
    if (newSchemeDetails != []) {
      setBachatGatCategoryNewSchemes();
    }
  }, [
    newSchemeDetails,
    language,
    zoneNames,
    crAreaNames,
    wardNames,
    mainNames,
    subSchemeNames,
  ]);

  useEffect(() => {
    getUser();
    getMainScheme();
  }, []);

  useEffect(() => {
    if (mainSchemeVal != null && mainSchemeVal != undefined) getSubScheme();
  }, [mainSchemeVal]);

  useEffect(() => {
    getDependency();
  }, [mainSchemeVal, subSchemeVal]);

  // useEffect(() => {
  //   getCastFromReligion();
  // }, []);

  // load bachat gat reject categories
  const getRejectCategories = () => {
    axios
      .get(
        `${urls.BSUPURL}/mstRejectCategory/getAllSchemeRejectionCategories`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        // console.log("response data ====> ", r);
        // setBachatgatrejectionCategories(
        //   r.data.mstRejectCategoryDao.map((row) => ({
        //     id: row.id,
        //     rejectCat: row.rejectCat,
        //     rejectCatMr: row.rejectCatMr,
        //   }))
        // );

        setBachatgatApprovalCategories(
          r.data.mstRejectCategoryDao.map((row) => ({
            id: row.id,
            rejectCat: row.rejectCat,
            rejectCatMr: row.rejectCatMr,
            forBachatGatorScheme: row.forBachatGatorScheme,
            categoryType: row.categoryType,
          }))
        );
      });
  };

  // Function to handle checkbox changes
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    // Update checkbox state
    setIsApproveChecked(name === "approve" && checked);
    setIsRevertChecked(name === "revert" && checked);
    setIsRejectChecked(name === "reject" && checked);
  };

  const handleRemarkChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    switch (fieldName) {
      case "saSanghatakRemark":
        setSamuhaSanghatakRemark(fieldValue);
        break;
      case "deptClerkRemark":
        setDeptClerkRemark(fieldValue);
        break;
      case "asstCommissionerRemark":
        setAsstCommissionerRemark(fieldValue);
        break;
      case "deptyCommissionerRemark":
        setDeptyCommissionerRemark(fieldValue);
        break;
      default:
        break;
    }
  };
  const backButton = () => {
    if (loggedUser === "citizenUser") {
      router.push({
        pathname: "/dashboard",
      });
    } else {
      router.push({
        pathname: "/BsupNagarvasthi/transaction/schemeApplicationRenewal",
      });
    }
  };

  // get gender
  const getGenders = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      setGenderDetails(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        }))
      );
    });
  };

  // religion details
  const getReligionDetails = () => {
    axios.get(`${urls.CFCURL}/master/religion/getAll`).then((r) => {
      setReligionNames(
        r.data.religion.map((row) => ({
          id: row.id,
          religion: row.religion,
          religionMr: row.religionMr,
        }))
      );
    });
  };

  const getAllStatus = () => {
    axios
      .get(`${urls.BSUPURL}/mstStatus/getAll`, {
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
      });
  };

  // useEffect(() => {
  //   setRejectReason(hanadleStudent.toString());
  // }, [hanadleStudent]);

  useEffect(() => {
    if (isRejectChecked) {
      setRejectReason(hanadleStudent.toString());
    }
  }, [hanadleStudent]);

  useEffect(() => {
    if (isApproveChecked === true) {
      setBachatgatRevertCategories(
        bachatgatApprovalCategories.filter((obj) => obj.categoryType === "1")
      );
      setValue("saSanghatakRemark", "");
      setValue("deptClerkRemark", "");
      setValue("asstCommissionerRemark", "");
      setValue("deptyCommissionerRemark", "");
      setServiceId([]);
      setHanadleStudent([]);
    } else if (isRevertChecked === true) {
      setBachatgatRevertCategories(
        bachatgatApprovalCategories.filter((obj) => obj.categoryType === "2")
      );
      setValue("saSanghatakRemark", "");
      setValue("deptClerkRemark", "");
      setValue("asstCommissionerRemark", "");
      setValue("deptyCommissionerRemark", "");
      setServiceId([]);
      setHanadleStudent([]);
    } else if (isRejectChecked === true) {
      setBachatgatRevertCategories(
        bachatgatApprovalCategories.filter((obj) => obj.categoryType === "3")
      );
      setValue("saSanghatakRemark", "");
      setValue("deptClerkRemark", "");
      setValue("asstCommissionerRemark", "");
      setValue("deptyCommissionerRemark", "");
      setServiceId([]);
      setHanadleStudent([]);
    }
  }, [isApproveChecked, isRevertChecked, isRejectChecked]);

  const handleChange = (event, studentId, fieldName) => {
    console.log("studentId ", studentId);
    switch (fieldName) {
      case "saSanghatakRemark":
        if (studentId === "all") {
          if (event.target.checked) {
            setServiceId(
              bachatgatRevertCategories.map((student) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setSamuhaSanghatakRemark(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            let string = bachatgatRevertCategories.map(
              (student) => student.rejectCat
            );
            setValue(
              "saSanghatakRemark",
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
          } else {
            setServiceId([]);
            setHanadleStudent([]);
            setSamuhaSanghatakRemark("");
            setValue("saSanghatakRemark", "");
          }
        } else {
          let dummy = bachatgatRevertCategories.find(
            (obj) => obj.id === studentId
          )?.rejectCat;
          if (event.target.checked) {
            console.log("Dummyyyyyyyyy ", [...hanadleStudent, dummy]);
            setServiceId([...serviceId, studentId]);
            setHanadleStudent([...hanadleStudent, dummy]);
            setSamuhaSanghatakRemark(...hanadleStudent, dummy);
            setValue("saSanghatakRemark", [...hanadleStudent, dummy]);
          } else {
            console.log("uncheck ", hanadleStudent);
            setServiceId(serviceId?.filter((obj) => obj !== studentId));
            setHanadleStudent(hanadleStudent?.filter((obj) => obj !== dummy));
            setSamuhaSanghatakRemark(
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
            setValue(
              "saSanghatakRemark",
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
          }
        }
        break;
      case "deptClerkRemark":
        // setDeptClerkRemark(studentId);
        if (studentId === "all") {
          if (event.target.checked) {
            setServiceId(
              bachatgatRevertCategories.map((student) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setDeptClerkRemark(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setValue(
              "deptClerkRemark",
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
          } else {
            setServiceId([]);
            setHanadleStudent([]);
            setDeptClerkRemark("");
            setValue("deptClerkRemark", "");
          }
        } else {
          let dummy = bachatgatRevertCategories.find(
            (obj) => obj.id === studentId
          )?.rejectCat;
          if (event.target.checked) {
            setServiceId([...serviceId, studentId]);
            setHanadleStudent([...hanadleStudent, dummy]);
            setDeptClerkRemark([...hanadleStudent, dummy]);
            setValue("deptClerkRemark", [...hanadleStudent, dummy]);
          } else {
            setServiceId(serviceId?.filter((obj) => obj !== studentId));
            setHanadleStudent(hanadleStudent?.filter((obj) => obj !== dummy));
            setDeptClerkRemark(hanadleStudent?.filter((obj) => obj !== dummy));
            setValue(
              "deptClerkRemark",
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
          }
        }
        break;
      case "asstCommissionerRemark":
        // setAsstCommissionerRemark(studentId);
        if (studentId === "all") {
          if (event.target.checked) {
            setServiceId(
              bachatgatRevertCategories.map((student) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setAsstCommissionerRemark(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setValue(
              "asstCommissionerRemark",
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
          } else {
            setServiceId([]);
            setHanadleStudent([]);
            setAsstCommissionerRemark("");
            setValue("asstCommissionerRemark", "");
          }
        } else {
          let dummy = bachatgatRevertCategories.find(
            (obj) => obj.id === studentId
          )?.rejectCat;
          if (event.target.checked) {
            setServiceId([...serviceId, studentId]);
            setHanadleStudent([...hanadleStudent, dummy]);
            setAsstCommissionerRemark([...hanadleStudent, dummy]);
            setValue("asstCommissionerRemark", [...hanadleStudent, dummy]);
          } else {
            setServiceId(serviceId?.filter((obj) => obj !== studentId));
            setHanadleStudent(hanadleStudent?.filter((obj) => obj !== dummy));
            setAsstCommissionerRemark(
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
            setValue(
              "asstCommissionerRemark",
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
          }
        }
        break;
      case "deptyCommissionerRemark":
        // setDeptyCommissionerRemark(studentId);
        if (studentId === "all") {
          if (event.target.checked) {
            setServiceId(
              bachatgatRevertCategories.map((student) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setDeptyCommissionerRemark(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setValue(
              "deptyCommissionerRemark",
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
          } else {
            setServiceId([]);
            setHanadleStudent([]);
            setDeptyCommissionerRemark("");
            setValue("deptyCommissionerRemark", "");
          }
        } else {
          let dummy = bachatgatRevertCategories.find(
            (obj) => obj.id === studentId
          )?.rejectCat;
          if (event.target.checked) {
            setServiceId([...serviceId, studentId]);
            setHanadleStudent([...hanadleStudent, dummy]);
            setDeptyCommissionerRemark([...hanadleStudent, dummy]);
            setValue("deptyCommissionerRemark", [...hanadleStudent, dummy]);
          } else {
            setServiceId(serviceId?.filter((obj) => obj !== studentId));
            setHanadleStudent(hanadleStudent?.filter((obj) => obj !== dummy));
            setDeptyCommissionerRemark(
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
            setValue(
              "deptyCommissionerRemark",
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
          }
        }
        break;
      default:
        break;
    }

    // if (studentId === "all") {
    //   if (event.target.checked) {
    //     setServiceId(bachatgatRevertCategories.map((student) => student.id));
    //     setHanadleStudent(
    //       bachatgatRevertCategories.map((student) => student.rejectCat)
    //     );
    //   } else {
    //     setServiceId([]);
    //     setHanadleStudent([]);
    //   }
    // } else {
    //   if (event.target.checked) {
    //     let dummy = bachatgatRevertCategories.find(
    //       (obj) => obj.id === studentId
    //     )?.rejectCat;
    //     setServiceId([...serviceId, studentId]);
    //     setHanadleStudent([...hanadleStudent, dummy]);
    //   } else {
    //     setServiceId(serviceId?.filter((obj) => obj !== studentId));
    //     setHanadleStudent(hanadleStudent?.filter((obj) => obj !== studentId));
    //   }
    // }
  };

  // const handleChange = (event, studentId) => {
  //   if (studentId === "all") {
  //     if (event.target.checked) {
  //       setServiceId(bachatgatrejectionCategories.map((student) => student.id));
  //       setHanadleStudent(
  //         bachatgatrejectionCategories.map((student) => student.rejectCat)
  //       );
  //     } else {
  //       setServiceId([]);
  //       setHanadleStudent([]);
  //     }
  //   } else {
  //     if (event.target.checked) {
  //       let dummy = bachatgatrejectionCategories.find(
  //         (obj) => obj.id === studentId
  //       )?.rejectCat;
  //       setServiceId([...serviceId, studentId]);
  //       setHanadleStudent([...hanadleStudent, dummy]);
  //     } else {
  //       setServiceId(serviceId?.filter((obj) => obj !== studentId));
  //       setHanadleStudent(hanadleStudent?.filter((obj) => obj !== studentId));
  //     }
  //   }
  // };

  const bankDocumentCol = [
    {
      field: "id",
      headerName: "Sr No.",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "title",
      headerName: "Document Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "filenm",
      headerName: "File Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },

    {
      field: "Action",
      headerName: "View",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (record) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
                  "_blank"
                );
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];
  // table header
  const docColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "informationTitle",
      headerName: <FormattedLabel id="infoTitle" />,
      headerAlign: "center",
      align: "left",
      // flex: 1,
      width: 500,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "fileName",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
      width: 500,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },

    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      renderCell: (record) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.path}`,
                  "_blank"
                );
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  // load user
  const getUser = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`)
      .then((res) => {
        setUserLst(res?.data?.user);
      })
      .catch((err) => console.log(err));
  };

  // eligiblity criteria table header
  const eligiblityColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "infoTitle",
      headerName: <FormattedLabel id="infoTitle" />,
      headerAlign: "center",
      align: "left",
      // flex: 1,
      width: 900,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "infoDetails",
      headerName: <FormattedLabel id="answer" />,
      headerAlign: "center",
      align: "left",
      width: 150,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },
  ];

  // load cast from religion
  // const getCastFromReligion = () => {
  //   axios.get(`${urls.BSUPURL}/castCategory/getAll`).then((r) => {
  //     let data = r.data.castCategory.map((row) => ({
  //       id: row.id,
  //       cast: row.castCategory,
  //       castMr: row.castCategoryMr,
  //     }));
  //     setCastNames(data);
  //   });
  // };

  // get bachatgat category new scheme
  const getBachatGatCategoryNewScheme = () => {
    if (router.query.id) {
      setIsLoading(true);
      axios
        .get(
          `${urls.BSUPURL}/trnSchemeApplicationRenewal/getById?id=${router.query.id}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setIsLoading(false);
          setNewSchemeDetails(r.data);
        })
        .catch((err) => {
          setIsLoading(false);
          catchMethod(err);
        });
    }
  };

  // set bachatgat category on UI
  const setBachatGatCategoryNewSchemes = () => {
    let _res = newSchemeDetails;
    setMainScheme(_res.mainSchemeKey);
    setApplicationNo(_res.applicationNo);
    setEligiblityCriteriaDetails(_res.trnSchemeApplicationDataDaoList);
    setValue("applicantFirstName", _res.applicantFirstName);
    setValue("applicantMiddleName", _res.applicantMiddleName);
    setValue("applicantLastName", _res.applicantLastName);
    setValue("buildingName", _res.buildingName);
    setValue("roadName", _res.roadName);
    setValue("applicantAadharNo", _res.applicantAadharNo);
    setValue("emailId", _res.emailId);
    setValue("mobileNo", _res.mobileNo);
    setValue("benecode", _res.beneficiaryCode);
    setValue(
      "zoneKey",
      language === "en"
        ? zoneNames?.find((obj) => obj.id == _res.zoneKey)?.zoneName
          ? zoneNames?.find((obj) => obj.id == _res.zoneKey)?.zoneName
          : "-"
        : zoneNames?.find((obj) => obj.id == _res.zoneKey)?.zoneNameMr
        ? zoneNames?.find((obj) => obj.id == _res.zoneKey)?.zoneNameMr
        : "-"
    );
    setValue(
      "wardKey",
      language === "en"
        ? wardNames?.find((obj) => obj.id == _res.wardKey)?.wardName
          ? wardNames?.find((obj) => obj.id == _res.wardKey)?.wardName
          : "-"
        : wardNames?.find((obj) => obj.id == _res.wardKey)?.wardNameMr
        ? wardNames?.find((obj) => obj.id == _res.wardKey)?.wardNameMr
        : "-"
    );
    setValue("rejectReason", _res.rejectReason);

    setValue(
      "areaKey",
      language === "en"
        ? crAreaNames?.find((obj) => obj.id == _res.areaKey)?.crAreaName
          ? crAreaNames?.find((obj) => obj.id == _res.areaKey)?.crAreaName
          : "-"
        : crAreaNames?.find((obj) => obj.id == _res.areaKey)?.crAreaNameMr
        ? crAreaNames?.find((obj) => obj.id == _res.areaKey)?.crAreaNameMr
        : "-"
    );
    setValue("landmark", _res?.landmark ? _res?.landmark : "-");
    setValue("flatBuldingNo", _res?.flatBuldingNo ? _res?.flatBuldingNo : "-");
    setValue("geoCode", _res?.geoCode ? _res?.geoCode : "-");
    setValue(
      "savingAccountNo",
      _res?.savingAccountNo ? _res?.savingAccountNo : "-"
    );
    setValue(
      "saOwnerFirstName",
      _res?.saOwnerFirstName ? _res?.saOwnerFirstName : "-"
    );
    setValue(
      "saOwnerMiddleName",
      _res?.saOwnerMiddleName ? _res?.saOwnerMiddleName : "-"
    );
    setValue(
      "saOwnerLastName",
      _res?.saOwnerLastName ? _res?.saOwnerLastName : "-"
    );
    setValue("dateOfBirth", moment(_res?.dateOfBirth).format("DD/MM/YYYY"));
    setValue("remarks", _res?.remarks ? _res?.remarks : "-");
    setValue(
      "bankNameId",
      language === "en"
        ? bankMaster?.find((obj) => obj.id == _res.bankBranchKey)?.bankName
          ? bankMaster?.find((obj) => obj.id == _res.bankBranchKey)?.bankName
          : "-"
        : bankMaster?.find((obj) => obj.id == _res.bankBranchKey)?.bankNameMr
        ? bankMaster?.find((obj) => obj.id == _res.bankBranchKey)?.bankNameMr
        : "-"
    );
    setValue("castOptionKey", _res?.castOptionKey);
    setValue("ifscCode", _res.ifscCode);
    setValue("micrCode", _res.micrCode);
    setValue(
      "disabilityPercentage",
      _res?.disabilityPercentage ? _res?.disabilityPercentage : "-"
    );
    setValue(
      "disabilityDuration",
      _res?.disabilityDuration ? _res?.disabilityDuration : "-"
    );
    setValue(
      "disabilityCertificateNo",
      _res?.disabilityCertificateNo ? _res?.disabilityCertificateNo : "-"
    );
    setValue(
      "subSchemeKey",
      language === "en"
        ? subSchemeNames?.find((obj) => obj.id == _res.subSchemeKey)
            ?.subSchemeName
          ? subSchemeNames?.find((obj) => obj.id == _res.subSchemeKey)
              ?.subSchemeName
          : "-"
        : subSchemeNames?.find((obj) => obj.id == _res.subSchemeKey)
            ?.subSchemeNameMr
        ? subSchemeNames?.find((obj) => obj.id == _res.subSchemeKey)
            ?.subSchemeNameMr
        : "-"
    );
    setSubScheme(_res.subSchemeKey);
    setEligiblityDocuments(_res.trnSchemeApplicationDocumentsList);
    setValue("fromDate", _res?.fromDate ? _res?.fromDate : null);
    setValue("bankBranchKey", _res.branchName);
    setValue("toDate", _res?.toDate ? _res?.toDate : null);
    setValue(
      "schemeRenewalDate",
      _res?.schemeRenewalDate ? _res?.schemeRenewalDate : null
    );
    setValue(
      "gender",
      genderDetails?.find((obj) => {
        return obj.id == _res?.gender;
      })
        ? genderDetails.find((obj) => {
            return obj.id == _res?.gender;
          }).gender
        : "-"
    );
    setValue("age", _res?.age ? _res?.age : 0);
    setValue(
      "disabilityCertificateValidity",
      _res?.disabilityCertificateValidity
        ? _res?.disabilityCertificateValidity
        : null
    );
    setValue("paymentDate", _res.paymentDate);
    setValue("chequeNo", _res.transactionNo);
    setValue("amount", _res.amountPaid);

    setValue("religionKey", _res?.religionKey ? _res?.religionKey : null);
    setValue("casteCategory", _res?.casteCategory);
    setValue(
      "mainSchemeKey",
      mainNames?.find((obj) => obj.id == _res.mainSchemeKey)?.schemeName
        ? mainNames?.find((obj) => obj.id == _res.mainSchemeKey)?.schemeName
        : "-"
    );
    setStatusVal(_res.status);
    setValue("divyangSchemeTypeKey", _res.divyangSchemeTypeKey);
    setValue("saSanghatakRemark", _res.saSanghatakRemark);
    setValue("deptClerkRemark", _res.deptClerkRemark);
    setValue("deptyCommissionerRemark", _res.deptyCommissionerRemark);
    setValue("asstCommissionerRemark", _res.asstCommissionerRemark);
    setCurrentStatus(manageStatus(_res.status, language, statusAll));

    const bankDoc = [];
    if (_res.passbookFrontPage && _res.passbookLastPage) {
      bankDoc.push({
        id: 1,
        title: language === "en" ? "Passbook Front Page" : "पासबुकचे पहिले पान",
        documentType: "r.documentType",
        documentPath: _res.passbookFrontPage,
        filenm:
          _res.passbookFrontPage &&
          _res.passbookFrontPage.split("/").pop().split("_").pop(),
      });
      bankDoc.push({
        id: 2,
        title: language === "en" ? "Passbook Back Page" : "पासबुकचे मागील पान",
        documentType: "r.documentType",
        documentPath: _res.passbookLastPage,
        filenm:
          _res.passbookLastPage &&
          _res.passbookLastPage.split("/").pop().split("_").pop(),
      });
    } else if (_res.passbookLastPage) {
      bankDoc.push({
        id: 14,
        title: language === "en" ? "Passbook Back Page" : "पासबुकचे मागील पान",
        documentType: "r.documentType",
        documentPath: _res.passbookLastPage,
        filenm:
          _res.passbookLastPage &&
          _res.passbookLastPage.split("/").pop().split("_").pop(),
      });
    } else if (_res.passbookFrontPage) {
      bankDoc.push({
        id: 15,
        title: language === "en" ? "Passbook Front Page" : "पासबुकचे पहिले पान",
        documentPath: _res.passbookFrontPage,
        filenm:
          _res.passbookFrontPage &&
          _res.passbookFrontPage.split("/").pop().split("_").pop(),
      });
    }
    setBankDoc([...bankDoc]);
  };

  // eligiblity criteria details show on table
  useEffect(() => {
    const eData = [];

    for (var i = 0; i < dependency.length; i++) {
      if (
        dependency[i].informationTitle != "fl" &&
        eligibilityCriteriaDetails != null
      ) {
        for (var j = 0; j < eligibilityCriteriaDetails.length; j++) {
          // eligibilityCriteriaDetails && eligibilityCriteriaDetails.map((obj,index)=>{
          //   if(obj.schemesConfigDataKey===dependency[i].id){
          //     eData.push({
          //       srNo: index + 1,
          //       id: obj.id,
          //       infoTitle: dependency[i].informationTitle,
          //       infoDetails: obj.informationDetails,
          //     });
          //   }
          // })
          if (
            eligibilityCriteriaDetails[j].schemesConfigDataKey ==
            dependency[i].id
          ) {
            console.log("JJJJJJJJ ", j);
            eData.push({
              srNo: j + 1,
              id: eligibilityCriteriaDetails[j].id,
              infoTitle: dependency[i].informationTitle,
              infoDetails: eligibilityCriteriaDetails[j].informationDetails,
            });
          }
        }
      }
    }
    setEligiblityCriteriaData([...eData].sort((a, b) => a.srNo - b.srNo));
  }, [dependency, eligibilityCriteriaDetails]);

  // eligiblity document array
  useEffect(() => {
    let res = [];
    for (var i = 0; i < docUpload.length; i++) {
      for (var j = 0; j < eligiblityDocuments.length; j++) {
        if (
          eligiblityDocuments[j].schemesConfigDocumentsKey == docUpload[i].id &&
          eligiblityDocuments[j].documentPath
        ) {
          res.push({
            srNo: j + 1,
            id: eligiblityDocuments[j].schemesConfigDocumentsKey,
            informationTitle: docUpload[i].informationTitle,
            name: docUpload[i].informationTitle,
            fileName:
              eligiblityDocuments[j].documentPath &&
              eligiblityDocuments[j].documentPath
                .split("/")
                .pop()
                .split("_")
                .pop(),
            path: eligiblityDocuments[j].documentPath,
          });
          setFetchDocuments([...res]);
        }
      }
    }
  }, [docUpload, eligiblityDocuments]);

  useEffect(() => {
    setDataToTable();
  }, [newSchemeDetails, userLst]);

  // set data to table
  const setDataToTable = () => {
    const a = [];
    if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 4; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.saSanghatakRemark
              : i == 1
              ? newSchemeDetails.deptClerkRemark
              : i == 2
              ? newSchemeDetails.asstCommissionerRemark
              : newSchemeDetails.deptyCommissionerRemark,
          designation:
            i == 0
              ? "Samuh Sanghtak"
              : i == 1
              ? "Zonal Clerk"
              : i == 2
              ? "Zonal Officer"
              : "HO Clerk",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(newSchemeDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(newSchemeDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                ),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1110
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";

        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.saSanghatakRemark
              : i == 1
              ? newSchemeDetails.deptClerkRemark
              : i == 2
              ? newSchemeDetails.asstCommissionerRemark
              : "",
          designation:
            i == 0
              ? "Samuh Sanghtak"
              : i == 1
              ? "Zonal Clerk"
              : i == 2
              ? "Zonal Officer"
              : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(newSchemeDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1101
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";

        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.saSanghatakRemark
              : i == 1
              ? newSchemeDetails.deptClerkRemark
              : i == 2
              ? newSchemeDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0
              ? "Samuh Sanghtak"
              : i == 1
              ? "Zonal Clerk"
              : i == 2
              ? "HO Clerk"
              : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(newSchemeDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1100
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.saSanghatakRemark
              : i == 1
              ? newSchemeDetails.deptClerkRemark
              : "",
          designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Zonal Clerk" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1001
    else if (
      watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.saSanghatakRemark
              : i == 1
              ? newSchemeDetails.deptyCommissionerRemark
              : "",
          designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "HO Clerk" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1000
    else if (
      watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? newSchemeDetails.saSanghatakRemark : "",
          designation: i == 0 ? "Samuh Sanghtak" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
    } //    0111
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.deptClerkRemark
              : i == 1
              ? newSchemeDetails.asstCommissionerRemark
              : i == 2
              ? newSchemeDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0 ? "Zonal Clerk" : i == 1 ? "Zonal Officer" : "HO Clerk",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(newSchemeDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                ),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    } //0110
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.deptClerkRemark
              : i == 1
              ? newSchemeDetails.asstCommissionerRemark
              : "",
          designation: i == 0 ? "Zonal Clerk" : i == 1 ? "Zonal Officer" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 0101
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.deptClerkRemark
              : i == 1
              ? newSchemeDetails.deptyCommissionerRemark
              : "",
          designation: i == 0 ? "Zonal Clerk" : i == 1 ? "HO Clerk" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0100
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? newSchemeDetails.deptClerkRemark : "",
          designation: i == 0 ? "Zonal Clerk" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0011
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.asstCommissionerRemark
              : i == 1
              ? newSchemeDetails.deptyCommissionerRemark
              : "",
          designation: i == 0 ? "Zonal Officer" : "HO Clerk",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(newSchemeDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                ),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0010
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? newSchemeDetails.asstCommissionerRemark : "",
          designation: i == 0 ? "Zonal Officer" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
      // 0001
    }
    // 0001
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? newSchemeDetails.deptyCommissionerRemark : "",
          designation: i == 0 ? "HO Clerk" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    setRemarkData([...a]);
  };

  // approval section remark columns
  const approveSectionCol = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      width: 80,
    },
    {
      field: "userName",
      headerName: "Username",
      headerAlign: "center",
      align: "left",
      width: 200,
    },
    {
      field: "remark",
      headerName: "Remark",
      headerAlign: "center",
      align: "left",
      width: 900,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "remarkDate",
      headerName: "Remark Date",
      headerAlign: "center",
      align: "center",
      width: 150,
      // flex: 1,
    },
    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "center",
      align: "left",
      width: 150,
      // flex: 1,
    },
  ];

  // get zone
  const getZoneName = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        }))
      );
    });
  };

  // get ward
  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        }))
      );
    });
  };

  // getAreaName
  const getCRAreaName = () => {
    axios.get(`${urls.CfcURLMaster}/area/getAll`).then((r) => {
      setCRAreaName(
        r.data.area.map((row) => ({
          id: row.id,
          crAreaName: row.areaName,
          crAreaNameMr: row.areaNameMr,
        }))
      );
    });
  };

  // get main scheme
  const getMainScheme = () => {
    axios
      .get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setMainNames(
          r.data.mstMainSchemesList.map((row) => ({
            id: row.id,
            schemeName: row.schemeName,
            schemePrefix: row.schemePrefix,
          }))
        );
      });
  };

  // get sub scheme
  const getSubScheme = () => {
    setIsLoading(true);
    axios
      .get(
        `${urls.BSUPURL}/mstSubSchemes/getAllByMainSchemeKey?mainSchemeKey=${mainSchemeVal}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        if (r.data.mstSubSchemesList != []) {
          setSubSchemeNames(
            r.data.mstSubSchemesList.map((row) => ({
              id: row.id,
              subSchemeName: row.subSchemeName,
              subSchemeNameMr: row.subSchemeNameMr,
            }))
          );
        } else {
          setValue("subSchemeKey", "");
          setSubSchemeNames([]);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        catchMethod(err);
      });
  };

  // get dependancy(Eligiblity)
  const getDependency = () => {
    if (mainSchemeVal && subSchemeVal) {
      setIsLoading(true);
      axios
        .get(
          `${urls.BSUPURL}/mstSchemesConfigData/getAllBySchemeConfigAndSubSchemeKey?schemeConfigKey=${mainSchemeVal}&subSchemeKey=${subSchemeVal}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setIsLoading(false);
          if (r?.data?.mstSchemesConfigDataList != []) {
            setDependency(
              r?.data?.mstSchemesConfigDataList?.map((row) => ({
                id: row.id,
                informationType: row.informationType,
                informationTitle: row.informationTitle,
                informationTitleMr: row.informationTitleMr,
                schemesConfigKey: row.schemesConfigKey,
                subSchemeKey: row.subSchemeKey,
                infoSelectionData: row.infoSelectionData,
              }))
            );

            setDocUpload(
              r?.data?.mstSchemesConfigDataList
                ?.filter((obj) => obj.informationType === "fl")
                .map((row) => ({
                  id: row.id,
                  informationType: row.informationType,
                  informationTitle: row.informationTitle,
                  informationTitleMr: row.informationTitleMr,
                  schemesConfigKey: row.schemesConfigKey,
                  subSchemeKey: row.subSchemeKey,
                  documentPath:
                    eligiblityDocuments &&
                    eligiblityDocuments.find(
                      (obj) => obj.schemesConfigDocumentsKey == row.id
                    )?.documentPath,
                  uniqueId:
                    eligiblityDocuments &&
                    eligiblityDocuments.find(
                      (obj) => obj.schemesConfigDocumentsKey == row.id
                    )?.id,
                }))
            );
          } else {
            setValue("subSchemeKey", "");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          catchMethod(err);
        });
    }
  };

  // get cast details
  const getCastDetails = () => {
    axios.get(`${urls.CFCURL}/castCategory/getAll`).then((r) => {
      setCastNames(
        r.data.castCategory.map((row) => ({
          id: row.id,
          cast: row.castCategory,
          castMr: row.castCategoryMr,
        }))
      );
    });
  };

  // bank master
  const getBankMasters = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
      setBankMasters(r.data.bank);
    });
  };

  // onsubmit(update status)
  const onSubmitForm = (formData) => {
    setIsLoading(true);
    const temp = [
      {
        ...newSchemeDetails,
        saSanghatakRemark:
          watch("saSanghatakRemark") != null && watch("saSanghatakRemark") != ""
            ? watch("saSanghatakRemark").toString()
            : newSchemeDetails.saSanghatakRemark == null
            ? watch("saSanghatakRemark")
            : newSchemeDetails.saSanghatakRemark,
        deptClerkRemark:
          watch("deptClerkRemark") != null && watch("deptClerkRemark") != ""
            ? watch("deptClerkRemark").toString()
            : newSchemeDetails.deptClerkRemark == null
            ? watch("deptClerkRemark")
            : newSchemeDetails.deptClerkRemark,
        asstCommissionerRemark:
          watch("asstCommissionerRemark") != null &&
          watch("asstCommissionerRemark") != ""
            ? watch("asstCommissionerRemark").toString()
            : newSchemeDetails.asstCommissionerRemark == null
            ? watch("asstCommissionerRemark")
            : newSchemeDetails.asstCommissionerRemark,
        deptyCommissionerRemark:
          watch("deptyCommissionerRemark") != null &&
          watch("deptyCommissionerRemark") != ""
            ? watch("deptyCommissionerRemark").toString()
            : newSchemeDetails.deptyCommissionerRemark == null
            ? watch("deptyCommissionerRemark")
            : newSchemeDetails.deptyCommissionerRemark,
        isApproved:
          formData === "Save" ? true : formData === "Revert" ? false : false,
        isBenifitedPreviously: false,
        isComplete: false,
        isDraft: false,
        rejectReason: rejectReason,
        status: formData === "Reject" ? 22 : statusVal,
        applicationRenewalKey: newSchemeDetails.applicationRenewalKey,
      },
    ];

    const tempData = axios
      .post(`${urls.BSUPURL}/trnSchemeApplicationRenewal/save`, temp, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language === "en" ? "Saved!" : "जतन केले",
            text:
              language === "en"
                ? formData === "Save"
                  ? `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Approved successfully !`
                  : formData === "Revert"
                  ? `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Reverted successfully !`
                  : `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Rejected successfully !`
                : formData === "Save"
                ? `अर्ज क्रमांक ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या मंजूर केले!`
                : formData === "Revert"
                ? `अर्ज क्रमांक ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या परत केले!`
                : `अर्ज क्रमांक ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या नाकारले!`,
            icon: "success",
            showCancelButton: false,
            confirmButtonText: language === "en" ? "Ok" : "ठीक आहे",
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
            closeOnClickOutside: false, // Prevent closing on click outside
          }).then((will) => {
            if (will) {
              {
                router.push(
                  "/BsupNagarvasthi/transaction/schemeApplicationRenewal"
                );
              }
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        catchMethod(err);
      });
  };

  // accountant remark save
  const saveAccountant = () => {
    const temp = [
      {
        ...newSchemeDetails,
        isBenifitedPreviously: false,
        isComplete: true,
        isDraft: false,
        transactionNo: watch("chequeNo"),
        amountPaid: watch("amount"),
        paymentDate: watch("paymentDate"),
        applicationRenewalKey: newSchemeDetails.applicationRenewalKey,
      },
    ];
    setIsLoading(true);
    const tempData = axios
      .post(`${urls.BSUPURL}/trnSchemeApplicationRenewal/save`, temp, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert(
            language === "en" ? "Saved!" : "जतन केले!",
            formData === "Save"
              ? language === "en"
                ? `Application no ${
                    res.data.message.split("[")[1].split("]")[0]
                  } Approved Successfully !`
                : `
            अर्ज क्र ${
              res.data.message.split("[")[1].split("]")[0]
            } यशस्वीरित्या मंजूर केले!`
              : formData === "Revert"
              ? language === "en"
                ? `Application no. ${
                    res.data.message.split("[")[1].split("]")[0]
                  } Reverted successfully !`
                : `अर्ज क्र ${res.data.message.split("[")[1].split("]")[0]} 
            यशस्वीरित्या परत केले!`
              : language === "en"
              ? `Application no. ${
                  res.data.message.split("[")[1].split("]")[0]
                } Rejected Successfully !`
              : `अर्ज क्र ${
                  res.data.message.split("[")[1].split("]")[0]
                } यशस्वीरित्या नाकारले!`,
            language === "en" ? "success" : "यशस्वी"
          );
          router.push({
            pathname: "/BsupNagarvasthi/transaction/schemeApplicationRenewal",
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        catchMethod(err);
      });
  };

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        {
          button: language === "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        {
          button: language === "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        {
          button: language === "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    }
  };
  // UI
  return (
    <ThemeProvider theme={theme}>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading && <CommonLoader />}
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
          "@media (max-width: 770px)": {
            marginTop: "2rem",
          },
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
                <FormattedLabel id="titleSchemeApplicationRenewal" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Grid container spacing={2} style={{ padding: "1rem" }}>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              sx={{
                "@media (max-width: 390px)": {
                  display: "grid",
                },
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                <FormattedLabel id="applicationNo" /> :
              </label>
              <label
                style={{
                  fontSize: "18px",
                }}
              >
                {appliNo}
              </label>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={6}
              xl={6}
              sx={{
                "@media (max-width: 390px)": {
                  display: "grid",
                },
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                <FormattedLabel id="currentStatus" /> :
              </label>
              <label
                style={{
                  fontSize: "18px",
                  gap: 3,
                }}
              >
                {currentStatus1}
              </label>
            </Grid>
            {/* area name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                disabled={true}
                InputLabelProps={{ shrink: true }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-textarea"
                label={<FormattedLabel id="areaNm" />}
                multiline
                variant="standard"
                {...register("areaKey")}
                error={!!errors.areaKey}
                helperText={errors?.areaKey ? errors.areaKey.message : null}
              />
            </Grid>
            {/* Zone Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                disabled={true}
                InputLabelProps={{ shrink: true }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-textarea"
                label={<FormattedLabel id="zoneNames" />}
                multiline
                variant="standard"
                {...register("zoneKey")}
                error={!!errors.zoneKey}
                helperText={errors?.zoneKey ? errors.zoneKey.message : null}
              />
            </Grid>
            {/* Ward name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                disabled={true}
                InputLabelProps={{ shrink: true }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-textarea"
                label={<FormattedLabel id="wardname" />}
                multiline
                variant="standard"
                {...register("wardKey")}
                error={!!errors.wardKey}
                helperText={errors?.wardKey ? errors.wardKey.message : null}
              />
            </Grid>
            {/* Beneficiary Code */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="beneficiaryCode" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("benecode")}
                error={!!errors.benecode}
                helperText={errors?.benecode ? errors.benecode.message : null}
              />
            </Grid>
            {/* main shceme */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                disabled={true}
                InputLabelProps={{ shrink: true }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-textarea"
                label={<FormattedLabel id="mainScheme" />}
                multiline
                variant="standard"
                {...register("mainSchemeKey")}
                error={!!errors.mainSchemeKey}
                helperText={
                  errors?.mainSchemeKey ? errors.mainSchemeKey.message : null
                }
              />
            </Grid>
            {/* Sub Scheme Key */}
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                disabled={true}
                InputLabelProps={{ shrink: true }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-textarea"
                label={<FormattedLabel id="subScheme" />}
                multiline
                variant="standard"
                {...register("subSchemeKey")}
                error={!!errors.subSchemeKey}
                helperText={
                  errors?.subSchemeKey ? errors.subSchemeKey.message : null
                }
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box>
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
                    <FormattedLabel id="applicantDetails" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="applicantFirstName" />}
                variant="standard"
                {...register("applicantFirstName")}
                error={!!errors.applicantFirstName}
                helperText={
                  errors?.applicantFirstName
                    ? errors.applicantFirstName.message
                    : null
                }
              />
            </Grid>
            {/* Middle Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="applicantMiddleName" />}
                variant="standard"
                {...register("applicantMiddleName")}
                error={!!errors.applicantMiddleName}
                helperText={
                  errors?.applicantMiddleName
                    ? errors.applicantMiddleName.message
                    : null
                }
              />
            </Grid>
            {/* Last Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="applicantLastName" />}
                variant="standard"
                {...register("applicantLastName")}
                error={!!errors.applicantLastName}
                helperText={
                  errors?.applicantLastName
                    ? errors.applicantLastName.message
                    : null
                }
              />
            </Grid>
            {/* Gender */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="gender" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("gender")}
                error={!!errors.gender}
                helperText={errors?.gender ? errors.gender.message : null}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="flatBuildNo" />}
                variant="standard"
                {...register("flatBuldingNo")}
                error={!!errors.flatBuldingNo}
                helperText={
                  errors?.flatBuldingNo ? errors.flatBuldingNo.message : null
                }
              />
            </Grid>
            {/* Building Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="buildingNm" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("buildingName")}
                error={!!errors.buildingName}
                helperText={
                  errors?.buildingName ? errors.buildingName.message : null
                }
              />
            </Grid>
            {/* Road Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled={true}
                InputLabelProps={{ shrink: true }}
                id="standard-basic"
                label={<FormattedLabel id="roadName" />}
                variant="standard"
                {...register("roadName")}
                error={!!errors.roadName}
                helperText={errors?.roadName ? errors.roadName.message : null}
              />
            </Grid>

            {/* LandMark */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="landmark" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("landmark")}
                error={!!errors.landmark}
                helperText={errors?.landmark ? errors.landmark.message : null}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="gisgioCode" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("geoCode")}
                error={!!errors.geoCode}
                helperText={errors?.geoCode ? errors.geoCode.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="applicantAdharNo" />}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("applicantAadharNo")}
                error={!!errors.applicantAadharNo}
                helperText={
                  errors?.applicantAadharNo
                    ? errors.applicantAadharNo.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="dateOfBirth" />}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("dateOfBirth")}
                error={!!errors.dateOfBirth}
                helperText={
                  errors?.dateOfBirth ? errors.dateOfBirth.message : null
                }
              />
            </Grid>
            {/*  Age */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="age" />}
                type="number"
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("age")}
                error={!!errors.age}
                helperText={errors?.age ? errors.age.message : null}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            {/*  Mobile*/}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="mobile" />}
                variant="standard"
                {...register("mobileNo")}
                error={!!errors.mobileNo}
                helperText={errors?.mobileNo ? errors.mobileNo.message : null}
              />
            </Grid>
            {/*  Email Address */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="email" />}
                variant="standard"
                {...register("emailId")}
                error={!!errors.emailId}
                helperText={errors?.emailId ? errors.emailId.message : null}
              />
            </Grid>
            {/* Religion */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                error={errors.religionKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="religion" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={true}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      {...field}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      label="Select Auditorium"
                    >
                      {religionNames &&
                        religionNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language === "en"
                              ? auditorium.religion
                              : auditorium.religionMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="religionKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.religionKey ? errors.religionKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Caste Category */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                error={errors.casteCategory}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="castCategory" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Auditorium"
                    >
                      {castNames.length > 0 &&
                        castNames.map((auditorium, index) => {
                          return (
                            <MenuItem key={index} value={auditorium.id}>
                              {language === "en"
                                ? auditorium.cast
                                : auditorium.castMr}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  )}
                  name="casteCategory"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.casteCategory ? errors.casteCategory.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Divyang Scheme Type */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl
                error={errors.divyangSchemeTypeKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="divyangSchemeType" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={true}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Auditorium"
                    >
                      {divyangData &&
                        divyangData.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {auditorium.divyangName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="divyangSchemeTypeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.divyangSchemeTypeKey
                    ? errors.divyangSchemeTypeKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/*  Disability Percentage */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="disabilityPercent" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("disabilityPercentage")}
                error={!!errors.disabilityPercentage}
                helperText={
                  errors?.disabilityPercentage
                    ? errors.disabilityPercentage.message
                    : null
                }
                InputProps={{
                  endAdornment: "%",
                }}
              />
            </Grid>

            {/* disdability expiry date */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                variant="standard"
                sx={{
                  m: { xs: 0, md: 1 },
                  minWidth: {
                    xs: "100%",
                    xs: "100%",
                    md: "90%",
                    lg: "90%",
                    xl: "90%",
                  },
                }}
                error={!!errors.disabilityCertificateValidity}
              >
                <Controller
                  control={control}
                  name="disabilityCertificateValidity"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={true}
                        variant="standard"
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="disabilityCertExpDate" />
                          </span>
                        }
                        value={field.value}
                        onChange={(date) =>
                          field.onChange(moment(date).format("YYYY-MM-DD"))
                        }
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            sx={{
                              m: { xs: 0, md: 1 },
                              minWidth: {
                                xs: "100%",
                                xs: "100%",
                                md: "90%",
                                lg: "90%",
                                xl: "90%",
                              },
                            }}
                            {...params}
                            size="small"
                            variant="standard"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {errors?.disabilityCertificateValidity
                    ? errors.disabilityCertificateValidity.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          {
            <Grid item xs={12}>
              <Box>
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
                      <FormattedLabel id="eligibilityCriteria" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          }
          <DataGrid
            getRowHeight={() => "auto"}
            autoHeight={true}
            sx={{
              marginTop: 5,
              overflowY: "scroll",
              overflowX: "scroll",
              "& .MuiDataGrid-virtualScrollerContent": {},
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
              flexDirection: "column",
              overflowX: "scroll",
            }}
            autoWidth
            density="standard"
            pageSize={10}
            rows={eligiblityData}
            columns={eligiblityColumns}
          />
          <Grid item xs={12}>
            <Box>
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
                    <FormattedLabel id="bankDetails" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            {/* Bank Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="bankName" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("bankNameId")}
                error={!!errors.bankNameId}
                helperText={
                  errors?.bankNameId ? errors.bankNameId.message : null
                }
              />
            </Grid>
            {/* Branch Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="branchName" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("bankBranchKey")}
                error={!!errors.bankBranchKey}
                helperText={
                  errors?.bankBranchKey ? errors.bankBranchKey.message : null
                }
              />
            </Grid>
            {/* Saving Account No */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="savingAcNo" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("savingAccountNo")}
                error={!!errors.savingAccountNo}
                helperText={
                  errors?.savingAccountNo
                    ? errors.savingAccountNo.message
                    : null
                }
              />
            </Grid>
            {/* Bank IFSC Code */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="bankIFSC" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("ifscCode")}
                error={!!errors.ifscCode}
                helperText={errors?.ifscCode ? errors.ifscCode.message : null}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="bankMICR" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("micrCode")}
                error={!!errors.micrCode}
                helperText={errors?.micrCode ? errors.micrCode.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="savinAcFirstNm" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("saOwnerFirstName")}
                error={!!errors.saOwnerFirstName}
                helperText={
                  errors?.saOwnerFirstName
                    ? errors.saOwnerFirstName.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="savingAcMiddleNm" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("saOwnerMiddleName")}
                error={!!errors.saOwnerMiddleName}
                helperText={
                  errors?.saOwnerMiddleName
                    ? errors.saOwnerMiddleName.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="savingAcLastNm" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("saOwnerLastName")}
                error={!!errors.saOwnerLastName}
                helperText={
                  errors?.saOwnerLastName
                    ? errors.saOwnerLastName.message
                    : null
                }
              />
            </Grid>
          </Grid>
          {bankDoc.length != 0 && (
            <DataGrid
              getRowHeight={() => "auto"}
              autoHeight={true}
              sx={{
                marginTop: 5,
                overflowY: "scroll",
                overflowX: "scroll",
                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
                flexDirection: "column",
                overflowX: "scroll",
              }}
              autoWidth
              density="standard"
              pageSize={10}
              rowsPerPageOptions={[10]}
              rows={bankDoc}
              columns={bankDocumentCol}
            />
          )}
          {docUpload.length != 0 && (
            <Grid item xs={12}>
              <Box>
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
                      <FormattedLabel id="eligibilityDoc" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
          <DataGrid
            getRowHeight={() => "auto"}
            autoHeight={true}
            sx={{
              marginTop: 5,
              overflowY: "scroll",
              overflowX: "scroll",
              "& .MuiDataGrid-virtualScrollerContent": {},
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
              flexDirection: "column",
              overflowX: "scroll",
            }}
            autoWidth
            density="standard"
            pageSize={10}
            rowsPerPageOptions={[10]}
            rows={fetchDocument}
            columns={docColumns}
          />
          <Grid container sx={{ padding: "10px" }}></Grid>
          <Grid item xs={12}>
            <Box>
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
                    <FormattedLabel id="renewalSection" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled
                label={<FormattedLabel id="renewalRemark" />}
                variant="standard"
                multiline
                {...register("remarks")}
                inputProps={{ maxLength: 1000 }}
                InputLabelProps={{ shrink: true }}
                error={!!errors.remarks}
                helperText={errors?.remarks ? errors.remarks.message : null}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ padding: "1rem" }}></Grid>
          {((authority &&
          authority.find((val) => val != bsupUserRoles.roleAccountant)
            ? true
            : statusVal == 10 || statusVal == 9
            ? true
            : false) ||
            // (loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
            // (statusVal === 1 || statusVal === 23 || statusVal === 22) &&
            remarkTableData.length != 0) && (
            <Grid item xs={12}>
              <Box>
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
                      <FormattedLabel id="approvalSection" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}

          {
            <>
              {(loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
                (statusVal === 22 || statusVal === 1) && (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-basic"
                      label={
                        statusVal === 1 ? (
                          <FormattedLabel id="revertedReason" />
                        ) : (
                          <FormattedLabel id="rejectedReason" />
                        )
                      }
                      variant="standard"
                      inputProps={{ maxLength: 1000 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={true}
                      {...register("saSanghatakRemark")}
                      error={!!errors.saSanghatakRemark}
                      helperText={
                        errors?.saSanghatakRemark
                          ? errors.saSanghatakRemark.message
                          : null
                      }
                    />
                  </Grid>
                )}

              {statusVal === 22 && loggedUser === "citizenUser" && (
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "98%" }}
                    id="standard-basic"
                    label={<FormattedLabel id="rejectCat" />}
                    multiline
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={true}
                    {...register("rejectReason")}
                    error={!!errors.rejectReason}
                    helperText={
                      errors?.rejectCat ? errors.rejectCat.message : null
                    }
                  />{" "}
                </Grid>
              )}
            </>
          }

          {remarkTableData.length != 0 && (
            <DataGrid
              getRowHeight={() => "auto"}
              autoHeight={true}
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
                marginTop: "10px",
              }}
              density="comfortable"
              // rowHeight={50}
              rowCount={remarkTableData.length}
              pageSize={10}
              rows={remarkTableData}
              columns={approveSectionCol}
              onPageChange={(_data) => {}}
              onPageSizeChange={(_data) => {}}
            />
          )}

          <>
            {(loggedUser !== "citizenUser" || loggedUser !== "cfcUser") && (
              <Box sx={{ marginTop: "1rem" }}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    [theme.breakpoints.up("sm")]: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                >
                  {statusVal !== 15 && (
                    <>
                      {/* Checkbox for approve */}
                      {(((statusVal === 2 || statusVal === 23) &&
                        authority &&
                        authority.find(
                          (val) => val === bsupUserRoles.roleSamuhaSanghatak
                        )) ||
                        ((statusVal == 4 || statusVal == 3) &&
                          authority &&
                          authority.find(
                            (val) => val === bsupUserRoles.roleZonalClerk
                          )) ||
                        ((statusVal == 5 || statusVal == 6) &&
                          authority &&
                          authority.find(
                            (val) => val === bsupUserRoles.roleZonalOfficer
                          )) ||
                        (statusVal == 7 &&
                          authority &&
                          authority.find(
                            (val) => val === bsupUserRoles.roleHOClerk
                          ))) && (
                        <>
                          <Grid item xl={2} lg={2} md={2} sm={12} xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="approve"
                                  checked={isApproveChecked}
                                  onChange={handleCheckboxChange}
                                />
                              }
                              label={<FormattedLabel id="approvebtn" />}
                            />
                          </Grid>

                          {/* Checkbox for revert */}
                          <Grid item xl={2} lg={2} md={2} sm={12} xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="revert"
                                  checked={isRevertChecked}
                                  onChange={handleCheckboxChange}
                                />
                              }
                              label={<FormattedLabel id="revertbtn" />}
                            />
                          </Grid>

                          {/* Checkbox for reject */}
                          {(statusVal === 2 || statusVal === 23) &&
                            authority &&
                            authority.find(
                              (val) => val === bsupUserRoles.roleSamuhaSanghatak
                            ) && (
                              <Grid item xl={2} lg={2} md={2} sm={12} xs={12}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name="reject"
                                      checked={isRejectChecked}
                                      onChange={handleCheckboxChange}
                                    />
                                  }
                                  label={<FormattedLabel id="rejectBtn" />}
                                />
                              </Grid>
                            )}
                        </>
                      )}
                    </>
                  )}
                </Grid>
              </Box>
            )}

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Samuh sanghtak remark */}
              {(statusVal == 2 || statusVal == 23) &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleSamuhaSanghatak
                ) && (
                  <>
                    {/* {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (<>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                        >
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="saSanghatakRemark" />}
                            variant="standard"
                            inputProps={{ maxLength: 1000 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled={
                              statusVal != 2 && statusVal != 23
                                ? true
                                : authority &&
                                  authority.find(
                                    (val) =>
                                      val === bsupUserRoles.roleSamuhaSanghatak
                                  )
                                  ? false
                                  : true
                            }
                            {...register("saSanghatakRemark")}
                            onChange={(e) =>
                              handleRemarkChange(e, "samuhaSanghatakRemark")
                            }
                            error={!!errors.saSanghatakRemark}
                            helperText={
                              errors?.saSanghatakRemark
                                ? errors.saSanghatakRemark.message
                                : null
                            }
                          />
                        </Grid>
                        {isRejectChecked && <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                        >
                          {" "}
                          <FormControl variant="standard"
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}>
                            <InputLabel id="selectedStudents-label">
                              <FormattedLabel id="rejectCat" />
                            </InputLabel>
                            <Controller
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              name="bachatgatrejectionCategories"
                              control={control} multiline
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                  labelId="selectedStudents-label"
                                  id="selectedStudents"
                                  multiple
                                  multiline
                                  value={serviceId}
                                  onChange={(e) => {
                                    handleChange(e, e.target.value);
                                  }}
                                  renderValue={(selected) =>
                                    selected.includes("all")
                                      ? "Select All"
                                      : selected
                                        .map((id) =>
                                          language == "en"
                                            ? bachatgatrejectionCategories.find(
                                              (student) => student.id === id
                                            )?.rejectCat
                                            : bachatgatrejectionCategories.find(
                                              (student) => student.id === id
                                            )?.rejectCatMr
                                        )
                                        .join(", ")
                                  }
                                >
                                  {bachatgatrejectionCategories?.length > 0 && (
                                    <MenuItem key="all" value="all">
                                      <Checkbox
                                        checked={
                                          serviceId.length ===
                                          bachatgatrejectionCategories.length
                                        }
                                        indeterminate={
                                          serviceId.length > 0 &&
                                          serviceId.length <
                                          bachatgatrejectionCategories.length
                                        }
                                        onChange={(e) => handleChange(e, "all")}
                                      />
                                      {language == "en"
                                        ? "Select All"
                                        : "सर्व निवडा"}
                                    </MenuItem>
                                  )}

                                  {bachatgatrejectionCategories.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                      <Checkbox
                                        checked={serviceId.includes(dept.id)}
                                        onChange={(e) =>
                                          handleChange(e, dept.id)
                                        }
                                      />
                                      {language === "en"
                                        ? dept?.rejectCat
                                        : dept?.rejectCatMr}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Grid>}
                      </>)} */}

                    {/* new fields */}
                    {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "20px",
                          }}
                        >
                          <FormControl
                            variant="standard"
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          >
                            <InputLabel id="selectedStudents-label">
                              <FormattedLabel id="revertCategory" />
                            </InputLabel>
                            <Controller
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              name="bachatgatRevertCategories"
                              control={control}
                              multiline
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                  labelId="selectedStudents-label"
                                  id="selectedStudents"
                                  multiple
                                  multiline
                                  value={serviceId}
                                  onChange={(e) => {
                                    handleChange(
                                      e,
                                      e.target.value,
                                      "saSanghatakRemark"
                                    );
                                  }}
                                  renderValue={(selected) =>
                                    selected.includes("all")
                                      ? "Select All"
                                      : selected
                                          .map((id) =>
                                            language == "en"
                                              ? bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCat
                                              : bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCatMr
                                          )
                                          .join(", ")
                                  }
                                >
                                  {bachatgatRevertCategories?.length > 0 && (
                                    <MenuItem key="all" value="all">
                                      <Checkbox
                                        checked={
                                          serviceId.length ===
                                          bachatgatRevertCategories.length
                                        }
                                        indeterminate={
                                          serviceId.length > 0 &&
                                          serviceId.length <
                                            bachatgatRevertCategories.length
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            "all",
                                            "saSanghatakRemark"
                                          )
                                        }
                                      />
                                      {language == "en"
                                        ? "Select All"
                                        : "सर्व निवडा"}
                                    </MenuItem>
                                  )}

                                  {bachatgatRevertCategories?.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                      <Checkbox
                                        checked={serviceId.includes(dept.id)}
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            dept.id,
                                            "saSanghatakRemark"
                                          )
                                        }
                                      />
                                      {language === "en"
                                        ? dept?.rejectCat
                                        : dept?.rejectCatMr}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="saSanghatakRemark" />}
                            variant="standard"
                            inputProps={{ maxLength: 1000 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            multiline
                            disabled={true}
                            // disabled={
                            //   statusVal != 2 && statusVal != 23
                            //     ? true
                            //     : authority &&
                            //       authority.find(
                            //         (val) =>
                            //           val === bsupUserRoles.roleSamuhaSanghatak
                            //       )
                            //     ? false
                            //     : true
                            // }
                            {...register("saSanghatakRemark")}
                            onChange={(e) =>
                              handleRemarkChange(e, "samuhaSanghatakRemark")
                            }
                            error={!!errors.saSanghatakRemark}
                            helperText={
                              errors?.saSanghatakRemark
                                ? errors.saSanghatakRemark.message
                                : null
                            }
                          />
                        </Grid>
                      </>
                    )}
                  </>
                )}

              {/* deparment clerk remark */}
              {(statusVal == 3 || statusVal == 4) &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalClerk
                ) && (
                  <>
                    {/* {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="deptClerkRemark" />}
                          variant="standard"
                          inputProps={{ maxLength: 1000 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          {...register("deptClerkRemark")}
                          onChange={(e) =>
                            handleRemarkChange(e, "deptClerkRemark")
                          }
                          disabled={
                            statusVal != 3 && statusVal != 4
                              ? true
                              : authority &&
                                authority.find(
                                  (val) => val === bsupUserRoles.roleZonalClerk
                                )
                              ? false
                              : true
                          }
                          error={!!errors.deptClerkRemark}
                          helperText={
                            errors?.deptClerkRemark
                              ? errors.deptClerkRemark.message
                              : null
                          }
                        />
                      </Grid>
                    )} */}

                    {/* New Fields */}
                    {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "20px",
                          }}
                        >
                          <FormControl
                            variant="standard"
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          >
                            <InputLabel id="selectedStudents-label">
                              <FormattedLabel id="revertCategory" />
                            </InputLabel>
                            <Controller
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              name="bachatgatRevertCategories"
                              control={control}
                              multiline
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                  labelId="selectedStudents-label"
                                  id="selectedStudents"
                                  multiple
                                  multiline
                                  value={serviceId}
                                  onChange={(e) => {
                                    handleChange(
                                      e,
                                      e.target.value,
                                      "deptClerkRemark"
                                    );
                                  }}
                                  renderValue={(selected) =>
                                    selected.includes("all")
                                      ? "Select All"
                                      : selected
                                          .map((id) =>
                                            language == "en"
                                              ? bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCat
                                              : bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCatMr
                                          )
                                          .join(", ")
                                  }
                                >
                                  {bachatgatRevertCategories?.length > 0 && (
                                    <MenuItem key="all" value="all">
                                      <Checkbox
                                        checked={
                                          serviceId.length ===
                                          bachatgatRevertCategories.length
                                        }
                                        indeterminate={
                                          serviceId.length > 0 &&
                                          serviceId.length <
                                            bachatgatRevertCategories.length
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            "all",
                                            "deptClerkRemark"
                                          )
                                        }
                                      />
                                      {language == "en"
                                        ? "Select All"
                                        : "सर्व निवडा"}
                                    </MenuItem>
                                  )}

                                  {bachatgatRevertCategories?.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                      <Checkbox
                                        checked={serviceId.includes(dept.id)}
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            dept.id,
                                            "deptClerkRemark"
                                          )
                                        }
                                      />
                                      {language === "en"
                                        ? dept?.rejectCat
                                        : dept?.rejectCatMr}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="deptClerkRemark" />}
                            variant="standard"
                            inputProps={{ maxLength: 1000 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            multiline
                            disabled={true}
                            // disabled={
                            //   statusVal != 3 && statusVal != 4
                            //     ? true
                            //     : authority &&
                            //       authority.find(
                            //         (val) =>
                            //           val === bsupUserRoles.roleZonalClerk
                            //       )
                            //     ? false
                            //     : true
                            // }
                            {...register("deptClerkRemark")}
                            onChange={(e) =>
                              handleRemarkChange(e, "deptClerkRemark")
                            }
                            error={!!errors.deptClerkRemark}
                            helperText={
                              errors?.deptClerkRemark
                                ? errors.deptClerkRemark.message
                                : null
                            }
                          />
                        </Grid>
                      </>
                    )}
                  </>
                )}

              {/* assistant commisssioner remark */}
              {(statusVal == 5 || statusVal == 6) &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalOfficer
                ) && (
                  <>
                    {/* {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="asstCommissionerRemark" />}
                          variant="standard"
                          disabled={
                            statusVal != 5 && statusVal != 6
                              ? true
                              : authority &&
                                authority.find(
                                  (val) =>
                                    val === bsupUserRoles.roleZonalOfficer
                                )
                              ? false
                              : true
                          }
                          inputProps={{ maxLength: 1000 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          {...register("asstCommissionerRemark")}
                          onChange={(e) =>
                            handleRemarkChange(e, "asstCommissionerRemark")
                          }
                          error={!!errors.asstCommissionerRemark}
                          helperText={
                            errors?.asstCommissionerRemark
                              ? errors.asstCommissionerRemark.message
                              : null
                          }
                        />
                      </Grid>
                    )} */}

                    {/* New Fields */}
                    {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "20px",
                          }}
                        >
                          <FormControl
                            variant="standard"
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          >
                            <InputLabel id="selectedStudents-label">
                              <FormattedLabel id="revertCategory" />
                            </InputLabel>
                            <Controller
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              name="bachatgatRevertCategories"
                              control={control}
                              multiline
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                  labelId="selectedStudents-label"
                                  id="selectedStudents"
                                  multiple
                                  multiline
                                  value={serviceId}
                                  onChange={(e) => {
                                    handleChange(
                                      e,
                                      e.target.value,
                                      "asstCommissionerRemark"
                                    );
                                  }}
                                  renderValue={(selected) =>
                                    selected.includes("all")
                                      ? "Select All"
                                      : selected
                                          .map((id) =>
                                            language == "en"
                                              ? bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCat
                                              : bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCatMr
                                          )
                                          .join(", ")
                                  }
                                >
                                  {bachatgatRevertCategories?.length > 0 && (
                                    <MenuItem key="all" value="all">
                                      <Checkbox
                                        checked={
                                          serviceId.length ===
                                          bachatgatRevertCategories.length
                                        }
                                        indeterminate={
                                          serviceId.length > 0 &&
                                          serviceId.length <
                                            bachatgatRevertCategories.length
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            "all",
                                            "asstCommissionerRemark"
                                          )
                                        }
                                      />
                                      {language == "en"
                                        ? "Select All"
                                        : "सर्व निवडा"}
                                    </MenuItem>
                                  )}

                                  {bachatgatRevertCategories?.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                      <Checkbox
                                        checked={serviceId.includes(dept.id)}
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            dept.id,
                                            "asstCommissionerRemark"
                                          )
                                        }
                                      />
                                      {language === "en"
                                        ? dept?.rejectCat
                                        : dept?.rejectCatMr}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="asstCommissionerRemark" />
                            }
                            variant="standard"
                            disabled={true}
                            // disabled={
                            //   statusVal != 5 && statusVal != 6
                            //     ? true
                            //     : authority &&
                            //       authority.find(
                            //         (val) =>
                            //           val === bsupUserRoles.roleZonalOfficer
                            //       )
                            //     ? false
                            //     : true
                            // }
                            multiline
                            inputProps={{ maxLength: 1000 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            {...register("asstCommissionerRemark")}
                            onChange={(e) =>
                              handleRemarkChange(e, "asstCommissionerRemark")
                            }
                            error={!!errors.asstCommissionerRemark}
                            helperText={
                              errors?.asstCommissionerRemark
                                ? errors.asstCommissionerRemark.message
                                : null
                            }
                          />
                        </Grid>
                      </>
                    )}
                  </>
                )}

              {/* HO Clerk remark */}
              {statusVal == 7 &&
                authority &&
                authority.find((val) => val === bsupUserRoles.roleHOClerk) && (
                  <>
                    {/* {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-basic"
                          label={
                            <FormattedLabel id="deptyCommissionerRemark" />
                          }
                          variant="standard"
                          disabled={statusVal != 7 ? true : false}
                          inputProps={{ maxLength: 1000 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          {...register("deptyCommissionerRemark")}
                          onChange={(e) =>
                            handleRemarkChange(e, "deptyCommissionerRemark")
                          }
                          error={!!errors.deptyCommissionerRemark}
                          helperText={
                            errors?.deptyCommissionerRemark
                              ? errors.deptyCommissionerRemark.message
                              : null
                          }
                        />
                      </Grid>
                    )} */}

                    {/* New Fields */}
                    {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "20px",
                          }}
                        >
                          <FormControl
                            variant="standard"
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          >
                            <InputLabel id="selectedStudents-label">
                              <FormattedLabel id="revertCategory" />
                            </InputLabel>
                            <Controller
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              name="bachatgatRevertCategories"
                              control={control}
                              multiline
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                  labelId="selectedStudents-label"
                                  id="selectedStudents"
                                  multiple
                                  multiline
                                  value={serviceId}
                                  onChange={(e) => {
                                    handleChange(
                                      e,
                                      e.target.value,
                                      "deptyCommissionerRemark"
                                    );
                                  }}
                                  renderValue={(selected) =>
                                    selected.includes("all")
                                      ? "Select All"
                                      : selected
                                          .map((id) =>
                                            language == "en"
                                              ? bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCat
                                              : bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCatMr
                                          )
                                          .join(", ")
                                  }
                                >
                                  {bachatgatRevertCategories?.length > 0 && (
                                    <MenuItem key="all" value="all">
                                      <Checkbox
                                        checked={
                                          serviceId.length ===
                                          bachatgatRevertCategories.length
                                        }
                                        indeterminate={
                                          serviceId.length > 0 &&
                                          serviceId.length <
                                            bachatgatRevertCategories.length
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            "all",
                                            "deptyCommissionerRemark"
                                          )
                                        }
                                      />
                                      {language == "en"
                                        ? "Select All"
                                        : "सर्व निवडा"}
                                    </MenuItem>
                                  )}

                                  {bachatgatRevertCategories?.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                      <Checkbox
                                        checked={serviceId.includes(dept.id)}
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            dept.id,
                                            "deptyCommissionerRemark"
                                          )
                                        }
                                      />
                                      {language === "en"
                                        ? dept?.rejectCat
                                        : dept?.rejectCatMr}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="deptyCommissionerRemark" />
                            }
                            multiline
                            variant="standard"
                            // disabled={statusVal != 7 ? true : false}
                            disabled={true}
                            inputProps={{ maxLength: 1000 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            {...register("deptyCommissionerRemark")}
                            onChange={(e) =>
                              handleRemarkChange(e, "deptyCommissionerRemark")
                            }
                            error={!!errors.deptyCommissionerRemark}
                            helperText={
                              errors?.deptyCommissionerRemark
                                ? errors.deptyCommissionerRemark.message
                                : null
                            }
                          />
                        </Grid>
                      </>
                    )}
                  </>
                )}
            </Grid>
          </>

          {/* Approve  reject revert button */}
          {(((statusVal == 2 || statusVal == 23) &&
            authority &&
            authority.find(
              (val) => val === bsupUserRoles.roleSamuhaSanghatak
            )) ||
            ((statusVal == 5 || statusVal == 6) &&
              authority &&
              authority.find(
                (val) => val === bsupUserRoles.roleZonalOfficer
              )) ||
            ((statusVal == 3 || statusVal == 4) &&
              authority &&
              authority.find((val) => val === bsupUserRoles.roleZonalClerk)) ||
            (statusVal == 7 &&
              authority &&
              authority.find((val) => val === bsupUserRoles.roleHOClerk))) && (
            <Grid container sx={{ padding: "10px" }}>
              {isApproveChecked && (
                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => {
                      onSubmitForm("Save");
                    }}
                    className={commonStyles.buttonApprove}
                    // disabled={!isRemarksFilled}
                    disabled={serviceId.length > 0 ? false : true}
                    variant="contained"
                    color="success"
                    size="small"
                  >
                    <FormattedLabel id="approvebtn" />
                  </Button>
                </Grid>
              )}
              {isRevertChecked && (
                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => {
                      onSubmitForm("Revert");
                    }}
                    className={commonStyles.buttonRevert}
                    // disabled={!isRemarksFilled}
                    disabled={serviceId.length > 0 ? false : true}
                    variant="contained"
                    color="error"
                    size="small"
                  >
                    <FormattedLabel id="revertbtn" />
                  </Button>
                </Grid>
              )}

              {authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleSamuhaSanghatak
                ) && (
                  <>
                    {isRejectChecked && (
                      <Grid
                        item
                        xl={6}
                        lg={6}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          // disabled={!isRemarksFilled}
                          disabled={serviceId.length > 0 ? false : true}
                          onClick={() => {
                            onSubmitForm("Reject");
                          }}
                          className={commonStyles.buttonReject}
                          variant="contained"
                          size="small"
                          color="error"
                        >
                          <FormattedLabel id="rejectBtn" />
                        </Button>
                      </Grid>
                    )}
                  </>
                )}

              <Grid
                item
                xl={
                  !isApproveChecked && !isRevertChecked && !isRejectChecked
                    ? 12
                    : 6
                }
                lg={
                  !isApproveChecked && !isRevertChecked && !isRejectChecked
                    ? 12
                    : 6
                }
                md={
                  !isApproveChecked && !isRevertChecked && !isRejectChecked
                    ? 12
                    : 6
                }
                sm={
                  !isApproveChecked && !isRevertChecked && !isRejectChecked
                    ? 12
                    : 6
                }
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  sx={{ margin: 1 }}
                  variant="contained"
                  className={commonStyles.buttonExit}
                  color="primary"
                  size="small"
                  onClick={() => backButton()}
                >
                  <FormattedLabel id="back" />
                </Button>
              </Grid>
            </Grid>
          )}

          {/* Accountant section hide  10-08-2023 */}
          {/* {(((statusVal == 9 || statusVal == 10) &&
            authority &&
            authority?.find((val) => val === bsupUserRoles.roleAccountant)) ||
            ((loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
              statusVal === 10)) && (
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
                <FormattedLabel id="accountantSection" />
              </h2>
            </Box>
          )}

          {(((statusVal == 9 || statusVal == 10) &&
            authority &&
            authority?.find((val) => val === bsupUserRoles.roleAccountant)) ||
            ((loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
              statusVal === 10)) && (
            <Grid container spacing={2} sx={{ padding: "1rem" }}>

              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <FormControl
                  sx={{
                    m: { xs: 0, md: 1 },
                    backgroundColor: "white",
                    minWidth: "100%",
                  }}
                  error={!!errors.paymentDate}
                >
                  <Controller
                    control={control}
                    name="paymentDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled={statusVal != 9 ? true : false}
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 14 }}>
                              {<FormattedLabel id="paymentDate" required />}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              InputLabelProps={{
                                style: {
                                  fontSize: 12,
                                  marginTop: 3,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.paymentDate ? errors.paymentDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <TextField
                  sx={{
                    m: { xs: 0, md: 1 },
                    backgroundColor: "white",
                    minWidth: "100%",
                  }}
                  id="standard-basic"
                  disabled={statusVal != 9 ? true : false}
                  InputLabelProps={{ shrink: true }}
                  label={<FormattedLabel id="chequeNo" />}
                  variant="standard"
                  type="number"
                  {...register("chequeNo")}
                  error={!!errors.chequeNo}
                  helperText={errors?.chequeNo ? errors.chequeNo.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <TextField
                  sx={{
                    m: { xs: 0, md: 1 },
                    backgroundColor: "white",
                    minWidth: "100%",
                  }}
                  id="standard-basic"
                  disabled={statusVal != 9 ? true : false}
                  InputLabelProps={{ shrink: true }}
                  label={<FormattedLabel id="billAmount" />}
                  variant="standard"
                  {...register("amount")}
                  error={!!errors.amount}
                  helperText={errors?.amount ? errors.amount.message : null}
                />
              </Grid>
            </Grid>
          )}

          {statusVal == 9 &&
            authority &&
            authority.find((val) => val === bsupUserRoles.roleAccountant) && (
              <Grid container spacing={2} sx={{ padding: "1rem" }}>
                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    disabled={
                      watch("amount") &&
                      watch("chequeNo") &&
                      watch("paymentDate")
                        ? false
                        : true
                    }
                    onClick={() => {
                      saveAccountant();
                    }}
                    variant="contained"
                    color="success"
                    size="small"
                  >
                    <FormattedLabel id="approvebtn" />
                  </Button>
                </Grid>
                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => {
                      setValue("chequeNo", ""),
                        setValue("amount", ""),
                        setValue("paymentDate", "");
                    }}
                    variant="contained"
                    color="error"
                    size="small"
                  >
                    <FormattedLabel id="cancel" />
                  </Button>
                </Grid>
              </Grid>
            )} */}

          {(loggedUser === "citizenUser" ||
            (statusVal != 2 &&
              statusVal != 23 &&
              authority &&
              authority.find(
                (val) => val === bsupUserRoles.roleSamuhaSanghatak
              )) ||
            (statusVal != 5 &&
              statusVal != 6 &&
              authority &&
              authority.find(
                (val) => val === bsupUserRoles.roleZonalOfficer
              )) ||
            (statusVal != 3 &&
              statusVal != 4 &&
              authority &&
              authority.find((val) => val === bsupUserRoles.roleZonalClerk)) ||
            (statusVal != 7 &&
              authority &&
              authority.find((val) => val === bsupUserRoles.roleHOClerk))) && (
            <Grid
              item
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                sx={{ margin: 1 }}
                variant="contained"
                color="primary"
                className={commonStyles.buttonExit}
                size="small"
                onClick={() => backButton()}
              >
                <FormattedLabel id="back" />
              </Button>
            </Grid>
          )}
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default BachatGatCategorySchemes;

import { EyeFilled } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
// import Moment from 'moment';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Divider, Typography } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import updateStudentForm from "../../../../containers/schema/school/transactions/updateStudentForm";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import UploadButton from "../fileUpload/UploadButton";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import DocumentsUpload from "../../../../components/school/documentsUploadVishal";

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(updateStudentForm),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = methods;
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   setValue,
  //   watch,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(updateStudentForm),
  //   mode: "onChange",
  // });
  const userToken = useGetToken();

  let relations = [
    "Self",
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Uncle",
    "Aunt",
    "Gardian",
    "other",
  ];
  const [loading, setLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [id, setID] = useState();

  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [fetchData, setFetchData] = useState(null);

  const schoolId = watch("schoolKey");
  const classId = watch("classKey");
  const divisionId = watch("divisionKey");
  const zoneKey = watch("zoneKey");
  const wardKey = watch("wardKey");
  const religionKey = watch("religionKey");
  const academicYearId = watch("academicYearKey");
  const studentDob = watch("studentDateOfBirth");
  const lastSchoolAdmissionDate = watch("lastSchoolAdmissionDate");
  const lastSchoolLeavingDate = watch("lastSchoolLeavingDate");
  const religionId = watch("religionKey");
  const casteId = watch("casteKey");
  const [zoneKeys, setZoneKeys] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  const [religions, setReligions] = useState([]);
  const [castNames, setCastNames] = useState([]);
  const [subCastNames, setSubCastNames] = useState([]);
  const [BirthState, setBirthState] = useState([]);
  const [medium, setMedium] = useState([]);
  const [editData, setEditData] = useState({});

  const [citizenshipList] = useState([
    { id: 1, citizen: "Indian" },
    { id: 2, citizen: "Other" },
  ]);
  const [motherTongueList] = useState([
    { id: 1, motherTongue: "English" },
    { id: 2, motherTongue: "Marathi" },
    { id: 3, motherTongue: "Hindi" },
    { id: 4, motherTongue: "Other" },
  ]);

  const [readonlyFields, setReadonlyFields] = useState(false);
  const [rejectApplViewBtn, setRejectApplViewBtn] = useState(false);
  const [docView, setDocView] = useState(false);

  const [studentBirthCertificate, setStudentBirthCertificate] = useState();
  const [studentDisabilityCertificate, setstudentDisabilityCertificate] =
    useState();
  const [studentLeavingCerrtificate, setStudentLeavingCertificate] = useState();
  const [studentPhotograph, setStudentPhotograph] = useState();
  const [studentAadharCard, setStudentAadharCard] = useState();
  const [parentAadharCard, setParentAadharCard] = useState();
  const [studentLastYearMarksheet, setStudentLastYearMarksheet] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [searchFirstName, setsearchFirstName] = useState("");
  const [searchmiddleName, setsearchmiddleName] = useState("");
  const [searchLastName, setsearchLastName] = useState("");
  const [searchGRno, setsearchGRno] = useState("");
  const [studentData, setStudentData] = useState("");
  const [otherDoc1, setotherDoc1] = useState("");
  const [otherDoc2, setotherDoc2] = useState("");
  const [otherDoc3, setotherDoc3] = useState("");
  const [otherDoc4, setotherDoc4] = useState("");

  // --------------------Getting logged in authority roles -----------------------

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);

  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        console.log("r.roles", r.roles);
        console.log("userId", user?.id);
        return r;
      }
    })?.roles;
    console.log("auth0000", auth);
    setAuthority(auth);
  }, []);
  console.log("authority", authority);
  // ---------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------
  const [
    encrptphysicallyChallengedCertficateDocument,
    setEncrptphysicallyChallengedCertficateDocument,
  ] = useState(null);
  const [encrptBirthCertificateDocument, setEncrptbirthCertificateDocument] =
    useState(null);
  const [
    encrptleavingCertificateDocuemnt,
    setEncrptleavingCertificateDocuemnt,
  ] = useState(null);
  const [encrptstudentPhotograph, setEncrptstudentPhotograph] = useState(null);
  const [encrptstudentAadharCardDocument, setEncrptstudentAadharCardDocument] =
    useState(null);
  const [encrptparentAadharCardDocument, setEncrptparentAadharCardDocument] =
    useState(null);
  const [
    encrptstudentLastYearMarkSheetDocument,
    setEncrptstudentLastYearMarkSheetDocument,
  ] = useState(null);
  const [encrOtherDoc1, setEncrOtherDoc1] = useState(null);
  const [encrOtherDoc2, setEncrOtherDoc2] = useState(null);
  const [encrOtherDoc3, setEncrOtherDoc3] = useState(null);
  const [encrOtherDoc4, setEncrOtherDoc4] = useState(null);
  const [encrptDisabilityDoc, setEncrptDisabilityDoc] = useState(null);

  // ---------------------------------------------------------------------------------
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

  console.log("subCastNames", subCastNames);

  const language = useSelector((state) => state?.labels?.language);
  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  //for calculate the age of the student based on their DoB selection
  const dob = watch("studentDateOfBirth");
  useEffect(() => {
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      const age = today.getFullYear() - birthDate.getFullYear();
      let monthsDiff = today.getMonth() - birthDate.getMonth();
      setValue("studentAge", `${age} years ${monthsDiff} months`);
    }
  }, [dob, setValue]);
  // -----------------------------------------------------------------------------------

  useEffect(() => {
    setLabels(schoolLabels[language ?? "en"]);
  }, [setLabels, language]);

  const getSchoolList = () => {
    // axios.get(`${urls.SCHOOL}/mstSchool/getAll`).then((r) => {
    axios
      .get(`${urls.SCHOOL}/mstSchool/getSchoolByUserId?userId=${user?.id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setSchoolList(
          r.data?.map((row) => ({
            id: row.id,
            schoolName: row.schoolName,
            schoolNameMr: row.schoolNameMr,
          }))
        );
      })
      .catch((e) => {
        callCatchMethod(e, language);
      });
  };

  const getMedium = () => {
    if (schoolId) {
      // axios.get(`${urls.SCHOOL}/mstSchool/getAll`).then((r) => {
      axios
        .get(`${urls.SCHOOL}/mstSchool/getSchoolByUserId?userId=${user?.id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          // let schools = r?.data?.mstSchoolList;
          let schools = r?.data;
          const foundObject = schools?.find((obj) => obj.id == schoolId);
          let schoolMedArray = foundObject?.schoolMedium?.split(",");
          console.log("schoolMedArray", schoolMedArray);
          setMedium(schoolMedArray ? schoolMedArray : []);
        })
        .catch((e) => {
          callCatchMethod(e, language);
        });
    }
  };
  useEffect(() => {
    getMedium();
  }, [schoolId]);
  const getAcademicYearList = () => {
    axios
      .get(`${urls.SCHOOL}/mstAcademicYear/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setAcademicYearList(
          r.data.mstAcademicYearList.map((row) => ({
            id: row.id,
            academicYear: row.academicYear,
          }))
        );
      })
      .catch((e) => {
        callCatchMethod(e, language);
      });
  };
  useEffect(() => {
    getZoneKeys();
    getReligions();
    getCastNames();
    getSchoolList();
    getAcademicYearList();
  }, [setError, setIsOpen]);

  const getClassList = () => {
    if (schoolId === "" || schoolId === null) {
      setClassList([]);
    } else if (schoolId) {
      axios
        .get(
          `${urls.SCHOOL}/mstClass/getAllClassBySchool?schoolKey=${schoolId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setClassList(
            r.data.mstClassList.map((row) => ({
              id: row.id,
              className: row.className,
            }))
          );
        })
        .catch((e) => {
          callCatchMethod(e, language);
        });
    }
  };
  useEffect(() => {
    getClassList();
  }, [schoolId]);

  // const getDocuments = (paramData) => {
  //   console.log("111",paramData?.physicallyChallengedCertficateDocument);
  //   setStudentBirthCertificate(paramData?.studentBirthCertificate),
  //     setstudentDisabilityCertificate(paramData?.studentDisabilityCertificate),
  //     setStudentLeavingCertificate(paramData?.studentLeavingCerrtificate),
  //     setStudentPhotograph(paramData?.studentPhotograph),
  //     setStudentAadharCard(paramData?.studentAadharCard),
  //     setParentAadharCard(paramData?.parentAadharCard),
  //     setStudentLastYearMarksheet(paramData?.studentLastYearMarksheet);
  // };

  const getDivisionList = () => {
    if (
      schoolId === "" ||
      schoolId === null ||
      classId === "" ||
      classId === null
    ) {
      setDivisionList([]);
    } else if (schoolId && classId) {
      axios
        .get(
          `${urls.SCHOOL}/mstDivision/getAllDivisionByClass?schoolKey=${schoolId}&classKey=${classId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setDivisionList(
            r.data.mstDivisionList.map((row) => ({
              id: row.id,
              divisionName: row.divisionName,
            }))
          );
        })
        .catch((e) => {
          callCatchMethod(e, language);
        });
    }
  };
  useEffect(() => {
    getDivisionList();
  }, [classId, schoolId, setValue, setIsOpen, setError]);

  useEffect(() => {
    getWardKeys();
  }, [zoneKey, setValue]);
  // console.log(zoneKeys)

  // ZoneKeys
  const getZoneKeys = async () => {
    await axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //   WardKeys
  const getWardKeys = () => {
    if (zoneKey) {
      axios
        .get(
          `${
            urls.CFCURL
          }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${zoneKey}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setWardKeys(
            r.data.map((row) => ({
              id: row.id,
              wardName: row.wardName,
              wardNameMr: row.wardNameMr,
            }))
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  // getReligion
  const getReligions = () => {
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setReligions(
          r.data.religion.map((row) => ({
            id: row.id,
            religion: row.religion,
            religionMr: row.religionMr,
          }))
        );
      })
      .catch((e) => {
        callCatchMethod(e, language);
      });
  };
  const [typesOfDis, setTypesOfDis] = useState([]);
  const getDisabilityTypes = () => {
    axios
      .get(`${urls.SCHOOL}/mstDisability/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setTypesOfDis(r.data.mstDisabilityDao);
      })
      .catch((e) => {
        callCatchMethod(e, language);
      });
  };
  // console.log("bbb",typesOfDis);

  useEffect(() => {
    getDisabilityTypes();
  }, []);

  // getCastNames

  const getCastNames = () => {
    // axios.get(`${urls.BaseURL}/cast/getAll`).then((r) => {
    axios
      .get(`${urls.CFCURL}/castCategory/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setCastNames(
          r?.data?.castCategory?.map((row) => ({
            id: row.id,
            cast: row.castCategory,
            castMr: row.castCategoryMr,
          }))
          // r.data.mCast.map((row) => ({
          //   id: row.id,
          //   cast: row.cast,
          //   castMr: row.castMr,
          // }))
        );
      })
      .catch((e) => {
        callCatchMethod(e, language);
      });
  };

  // get subCastNames
  const getSubCastNames = () => {
    if (watch("casteKey")) {
      // axios.get(`${urls.BaseURL}/subCast/getAll`).then((r) => {
      axios
        .get(
          `${urls.BaseURL}/cast/getCastByCastCategory?casteCategoryId=${watch(
            "casteKey"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setSubCastNames(
            r.data.mCast.map((row) => ({
              id: row.id,
              subCast: row.cast,
              subCastMr: row.castMr,
            }))
            // r.data.subCast
            // .map((row) => ({
            //   id: row.id,
            //   subCast: row.subCast,
            //   subCastMr: row.subCastMr,

            // }))
          );
        })
        .catch((e) => {
          callCatchMethod(e, language);
        });
    }
  };
  useEffect(() => {
    getSubCastNames();
  }, [watch("casteKey")]);
  useEffect(() => {
    console.log("__photograph", watch("photograph"));
  }, [watch("photograph")]);

  useEffect(() => {
    getBirthState();
  }, [fetchData]);

  // get subCastNames
  const getBirthState = () => {
    axios
      .get(`${urls.SCHOOL}/mstState/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setBirthState(r.data.mstStateDao);
      })
      .catch((e) => {
        callCatchMethod(e, language);
      });
  };
  // console.log("rrrra",BirthState)
  //relation field start

  //search by name & GR number
  const getStudentInfoByGRNo = () => {
    console.log(
      "searched",
      searchFirstName,
      searchmiddleName,
      searchLastName,
      searchGRno
    );
    setLoading(true);
    axios
      .get(
        `${urls.SCHOOL}/mstStudent/getByGrNoOrName?grNumber=${searchGRno}&firstName=${searchFirstName}&middleName=${searchmiddleName}&lastname=${searchLastName}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        setLoading(false);
        console.log("r.data[0]", r.data[0]);
        if (r?.data?.length > 0) {
          setSlideChecked(true);
          // setStudentData(r.data[0])
          reset(r.data[0]);
          setValue(
            "relationWithAccountantHolder",
            r?.data[0]?.relationWithAccountantHolder
          );
          sethandicapchecked(r.data[0]?.isPhysicallyChallenged);
          setChecked(r.data[0]?.isLastSchoolIsApplicable);
          setstudentDisabilityCertificate(
            r.data[0]?.physicallyChallengedCertficateDocument
          );
          setStudentBirthCertificate(r.data[0]?.birthCertificateDocument);
          setStudentLeavingCertificate(r.data[0]?.leavingCertificateDocuemnt);
          setStudentPhotograph(r.data[0]?.photograph);
          setStudentAadharCard(r.data[0]?.aadharCardDocument);
          setParentAadharCard(r.data[0]?.parentAadharCardDocument);
          setStudentLastYearMarksheet(r.data[0]?.lastYearMarkSheetDocument);
          console.log("hnd", r.data[0]?.isLastSchoolIsApplicable);
          // setValue("test", 3);/
        } else {
          // sweetAlert("Not Found", "Record not Found", "error");
          sweetAlert({
            title: language === "en" ? "Not Found !" : "सापडले नाही !",
            text:
              language === "en"
                ? "Record Not found !"
                : "रेकॉर्ड सापडले नाही !",
            button: language === "en" ? "Ok !" : "ठीक आहे",
            icon: "error",
          });
        }
      })
      .catch((e) => {
        setLoading(false);
        callCatchMethod(e, language);
        // sweetAlert(
        //   "Error",
        //   e?.message ? e?.message : "Something Went Wrong",
        //   "error"
        // );
        // console.log("Eroor", e);
      });
  };
  useEffect(() => {
    console.log("aala123", watch("relationWithAccountantHolder"));
  }, [watch("relationWithAccountantHolder")]);

  // reset docs after save/cancell/edit
  const docsReset = () => {
    setstudentDisabilityCertificate(""),
      setStudentBirthCertificate(""),
      setStudentLeavingCertificate(""),
      setStudentPhotograph(""),
      setStudentAadharCard(""),
      setParentAadharCard(""),
      setStudentLastYearMarksheet("");
  };
  // get documents for edit and view buttons
  const getDocuments = (paramData) => {
    console.log("111", paramData?.physicallyChallengedCertficateDocument);
    setStudentBirthCertificate(paramData?.studentBirthCertificate),
      setstudentDisabilityCertificate(paramData?.studentDisabilityCertificate),
      setStudentLeavingCertificate(paramData?.studentLeavingCerrtificate),
      setStudentPhotograph(paramData?.studentPhotograph),
      setStudentAadharCard(paramData?.studentAadharCard),
      setParentAadharCard(paramData?.parentAadharCard),
      setStudentLastYearMarksheet(paramData?.studentLastYearMarksheet);
  };
  // Get Table - Data
  // const getStudentAdmissionMaster = (
  //   _pageSize = 10,
  //   _pageNo = 0,
  //   _sortBy = "id",
  //   _sortDir = "desc"
  // ) => {
  //   // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
  //   axios
  //     .get(
  //       `${urls.SCHOOL}/trnStudentAdmissionForm/getAllUserId?userId=${user?.id}`,
  //       {
  //         params: {
  //           pageSize: _pageSize,
  //           pageNo: _pageNo,
  //           sortBy: _sortBy,
  //           sortDir: _sortDir,
  //         },
  // headers: {
  //   Authorization: `Bearer ${userToken}`,
  // },
  //       }
  //     )
  //     .then((r) => {
  //       let result = r?.data?.trnStudentAdmissionFormList;
  //       console.log("trnStudentAdmissionFormList", r.data);
  //       let page = r?.data?.pageSize * r?.data?.pageNo;

  //       let _res = result.map((r, i) => {
  //         // let DOB = moment(r.studentDateOfBirth).format('DD-MM-YYYY')

  //         // console.log("DOBa", DOB,r.studentDateOfBirth)
  //         return {
  //           activeFlag: r.activeFlag,
  //           id: r.id,
  //           srNo: i + 1 + page,
  //           zoneKey: r.zoneKey,
  //           wardKey: r.wardKey,
  //           zoneName: r.zoneName,
  //           wardKey: r.wardKey,
  //           studentFirstName: r.studentFirstName,
  //           studentMiddleName: r.studentMiddleName,
  //           studentLastName: r.studentLastName,
  //           firstNameMr: r.firstNameMr,
  //           middleNameMr: r.middleNameMr,
  //           lastNameMr: r.lastNameMr,
  //           fatherFirstName: r.fatherFirstName,
  //           fatherMiddleName: r.fatherMiddleName,
  //           fatherLastName: r.fatherLastName,
  //           motherName: r.motherName,
  //           motherNameMr: r.motherNameMr,
  //           motherMiddleName: r.motherMiddleName,
  //           motherLastName: r.motherLastName,
  //           studentGender: r.studentGender,
  //           studentContactDetails: r.studentContactDetails,
  //           studentAadharNumber: r.studentAadharNumber,
  //           religionKey: r.religionKey,
  //           studentBirthPlace: r.studentBirthPlace,
  //           // studentDateOfBirth: moment(r.studentDateOfBirth).format('DD-MM-YYYY'),
  //           studentDateOfBirth: r.studentDateOfBirth,
  //           // studentDateOfBirth: DOB,
  //           familyPermanentAddress: r.familyPermanentAddress,
  //           parentFullName: r.parentFullName,
  //           parentEmailId: r.parentEmailId,
  //           parentAddress: r.parentAddress,
  //           fatherQualification: r.fatherQualification,
  //           fatherOccupation: r.fatherOccupation,
  //           fatherIncome: r.fatherIncome,
  //           motherQualification: r.motherQualification,
  //           motherOccupation: r.motherOccupation,
  //           motherIncome: r.motherIncome,
  //           fatherContactNumber: r.fatherContactNumber,
  //           motherContactNumber: r.motherContactNumber,
  //           colonyName: r.colonyName,
  //           parentPincode: r.parentPincode,
  //           saralId: r.saralId,
  //           isLastSchoolIsApplicable: r.isLastSchoolIsApplicable,
  //           isPhysicallyChallenged: r.isPhysicallyChallenged,
  //           lastSchoolName: r.lastSchoolName,
  //           lastSchoolAdmissionDate: r.lastSchoolAdmissionDate,
  //           lastClassAndFromWhenStudying: r.lastClassAndFromWhenStudying,
  //           lastSchoolLeavingDate: r.lastSchoolLeavingDate,
  //           studentBehaviour: r.studentBehaviour,
  //           reasonForLeavingSchool: r.reasonForLeavingSchool,
  //           casteName: r.casteName,
  //           casteKey: r.casteKey,
  //           subCastKey: r.subCastKey,
  //           subCastMr: subCastNames?.find((i) => i?.id == r.subCastKey)
  //             ?.subCastMr,
  //           subCast: subCastNames?.find((i) => i?.id == r.subCastKey)?.subCast,
  //           citizenshipName: r.citizenshipName,
  //           motherTongueName: r.motherTongueName,
  //           districtName: r.districtName,
  //           stateName: r.stateName,
  //           parentDistrictName: r.parentDistrictName,
  //           parentStateName: r.parentStateName,
  //           schoolName: r.schoolName,
  //           schoolNameMr: r.schoolNameMr,
  //           schoolKey: r.schoolKey,
  //           studentName: `${r.studentFirstName} ${r.studentMiddleName} ${r.studentLastName}`,
  //           studentNameMr: `${r.firstNameMr} ${r.middleNameMr} ${r.lastNameMr}`,
  //           studentEmail: r.studentEmail,
  //           className: r.className,
  //           classKey: r.classKey,
  //           divisionKey: r.divisionKey,
  //           academicYearKey: r.academicYearKey,
  //           admissionRegitrationNo: r.admissionRegitrationNo
  //             ? r.admissionRegitrationNo
  //             : "-",

  //           // Ac Details
  //           accountNo: r.accountNo,
  //           confirmBankAcNumber: r.confirmBankAcNumber,
  //           accountHolderName: r.accountHolderName,
  //           bankName: r.bankName,
  //           ifscCode: r.ifscCode,
  //           bankAdderess: r.bankAdderess,

  //           principalRemarksEn: r.principalRemarksEn,
  //           principalRemarksMr: r.principalRemarksMr,

  //           applicationStatus: r.applicationStatus ? r.applicationStatus : "-",
  //           Status:
  //             r.applicationStatus == "REJECTED_BY_PRINCIPAL"
  //               ? "reject"
  //               : "approve",
  //           studentGeneralRegistrationNumber:
  //             r.studentGeneralRegistrationNumber,
  //           behaviourMr: r.behaviourMr,
  //           lastSchoolNameMr: r.lastSchoolNameMr,
  //           birthPlacemr: r.birthPlacemr,
  //           reasonForLeavingSchoolMr: r.reasonForLeavingSchoolMr,

  //           // documents
  //           studentLeavingCerrtificate: r.leavingCertificateDocuemnt,
  //           studentAadharCard: r.studentAadharCardDocument,
  //           parentAadharCard: r.parentAadharCardDocument,
  //           studentLastYearMarksheet: r.studentLastYearMarkSheetDocument,
  //           studentPhotograph: r.studentPhotograph,
  //           studentBirthCertificate: r.studentBirthCertficateDocument,
  //           studentDisabilityCertificate: r.physicallyChallengedCertficateDocument,

  //           //relation with account holder
  //           relationWithAccountantHolder: r.relationWithAccountantHolder,
  //           otherRelationWithAccountantHolder: r.otherRelationWithAccountantHolder,
  //           schoolMedium: r.schoolMedium,

  //           percentageOfDisability: r.percentageOfDisability,
  //           typeOfDisability: r.typeOfDisability

  //           // divisionName: r.divisionName ? r.divisionName : `divisionKey ${r.divisionKey}`,
  //         };
  //       });
  //       console.log("Result", _res);
  //       setDataSource([..._res]);
  //       setData({
  //         rows: _res,
  //         totalRows: r.data.totalElements,
  //         rowsPerPageOptions: [10, 20, 50, 100],
  //         pageSize: r.data.pageSize,
  //         page: r.data.pageNo,
  //       });
  //     });
  // };

  //subcast filter start

  // const getSubCast = () =>{

  //   console.log("castid", subCastNames);
  //   console.log("castid", watch("casteKey"));
  //   const filteredArray = subCastNames.filter(obj => obj.cast === watch("casteKey"))

  //   // console.log("castid", filteredArray);
  // }
  // useEffect(()=>{
  //   getSubCast()
  // },[watch("casteKey")])

  //subcast filter end

  // const [selectedOption, setSelectedOption] = useState('');
  const [otherValue, setOtherValue] = useState("");

  //   const handleDropdownChange = (event) => {
  //     const selectedValue = event.target.value;
  //     setSelectedOption(selectedValue);

  //     // Clear the input field if a non-"Other" option is selected
  //     if (selectedValue !== 'other') {
  //       setOtherValue('');
  //     }
  //   };

  const handleOtherInputChange = (event) => {
    // const newValue = event.target.value;
    // setValue("relationWithAccountantHolder", newValue)
    setOtherValue(event.target.value);
  };
  console.log("valuee", otherValue);

  //relation field end
  console.log("aa", watch("relationWithAccountantHolder"));

  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };
  console.log("ccc", checked);
  const [handicapchecked, sethandicapchecked] = useState(false);

  const handleHandicapCheckboxChange = (event) => {
    sethandicapchecked(event.target.checked);
  };

  const onSubmitForm = (formData) => {
    console.log("errors", errors);
    let _body = {
      ...formData,
      studentDateOfBirth: moment(
        formData?.studentDateOfBirth,
        "DD-MM-YYYY"
      ).format("YYYY-MM-DD"),
      // attachmentDocument1: otherDoc1,
      // attachmentDocument2: otherDoc2,
      // attachmentDocument3: otherDoc3,
      // attachmentDocument4: otherDoc4,
      attachmentDocument1: encrOtherDoc1,
      attachmentDocument2: encrOtherDoc2,
      attachmentDocument3: encrOtherDoc3,
      attachmentDocument4: encrOtherDoc4,
      physicallyChallengedCertficateDocument: encrptDisabilityDoc,
    };

    // if (btnSaveText === "Save") {
    console.log("_body", _body);
    let updateBody = {
      ..._body,
      id: null,
      // activeFlag:params.,
      studentId: formData.id,

      //   physicallyChallengedCertficateDocument:
      //   encrptphysicallyChallengedCertficateDocument,
      // birthCertificateDocument: encrptBirthCertificateDocument,
      // leavingCertificateDocuemnt: encrptleavingCertificateDocuemnt,
      // studentPhotograph: encrptstudentPhotograph,
      // studentAadharCardDocument: encrptstudentAadharCardDocument,
      // parentAadharCardDocument: encrptparentAadharCardDocument,
      // studentLastYearMarkSheetDocument: encrptstudentLastYearMarkSheetDocument,

      photograph: encrptstudentPhotograph,
      birthCertificateDocument: encrptBirthCertificateDocument,
      leavingCertificateDocuemnt: encrptleavingCertificateDocuemnt,
      aadharCardDocument: encrptstudentAadharCardDocument,
      parentAadharCardDocument: encrptparentAadharCardDocument,
      studentLastYearMarkSheetDocument: encrptstudentLastYearMarkSheetDocument,
    };
    console.log("update_body", updateBody);
    setLoading(true);
    const tempData = axios
      .post(
        `${urls.SCHOOL}/trnUpdateStudentDetailsController/save`,
        updateBody,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        console.log("res---", res);
        if (res.status == 201 || res.status == 200) {
          sweetAlert({
            title: language === "en" ? "Updated !" : "अद्यतनित केले !",
            text:
              language === "en"
                ? "Record Updated successfully !"
                : "रेकॉर्ड अद्यतनित केले !",
            icon: "success",
          });
          // sweetAlert("Saved!", "Record Updated successfully !", "success");
          // setButtonInputState(false);
          // setIsOpenCollapse(false);
          // setShowTable(true);
          // setFetchData(tempData);
          // setEditButtonInputState(false);
          // setDeleteButtonState(false);
          getUpdatedData();
          docsReset();
          setSlideChecked(false);
          setsearchGRno("");
          setsearchFirstName("");
          setsearchmiddleName("");
          setsearchLastName("");
        }
      })
      .catch((e) => {
        setLoading(false);
        callCatchMethod(e, language);
        // sweetAlert(
        //   "Error",
        //   e?.message ? e?.message : "Something Went Wrong",
        //   "error"
        // );
        // console.log("Eroor", e);
      });
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setShowTable(true);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
    docsReset();
    // getUpdatedData()
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    docsReset();
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    schoolKey: "",
    zoneKey: "",
    wardKey: "",
    religionKey: "",
    casteKey: "",
    subCastKey: "",
    studentAge: "",
    classKey: "",
    divisionKey: "",
    academicYearKey: "",
    firstNameMr: "",
    studentMiddleName: "",
    middleNameMr: "",
    studentLastName: "",
    lastNameMr: "",
    fatherFirstName: "",
    fatherMiddleName: "",
    fatherLastName: "",
    motherName: "",
    motherNameMr: "",
    motherMiddleName: "",
    motherLastName: "",
    studentGender: "",
    studentContactDetails: "",
    studentEmail: "",
    studentAadharNumber: "",
    casteName: "",
    citizenshipName: "",
    motherTongueName: "",
    studentBirthPlace: "",
    birthPlacemr: "",
    stateName: "",
    districtName: "",
    familyPermanentAddress: "",
    parentFullName: "",
    parentEmailId: "",
    parentAddress: "",
    fatherQualification: "",
    fatherOccupation: "",
    fatherIncome: "",
    motherQualification: "",
    motherOccupation: "",
    motherIncome: "",
    fatherContactNumber: "",
    motherContactNumber: "",
    colonyName: "",
    parentDistrictName: "",
    parentStateName: "",
    parentPincode: "",
    lastSchoolName: "",
    lastSchoolNameMr: "",
    lastClassAndFromWhenStudying: "",
    studentBehaviour: "",
    behaviourMr: "",
    lastSchoolLeavingDate: null,
    reasonForLeavingSchool: "",
    reasonForLeavingSchoolMr: "",
    studentDateOfBirth: null,
    lastSchoolAdmissionDate: null,
    lastSchoolLeavingDate: "",
    accountNo: "",
    confirmBankAcNumber: "",
    accountHolderName: "",
    bankName: "",
    ifscCode: "",
    bankAdderess: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    id: null,
    schoolKey: "",
    zoneKey: "",
    wardKey: "",
    religionKey: "",
    casteKey: "",
    subCastKey: "",
    studentAge: "",
    classKey: "",
    divisionKey: "",
    academicYearKey: "",
    firstNameMr: "",
    studentMiddleName: "",
    middleNameMr: "",
    studentLastName: "",
    lastNameMr: "",
    fatherFirstName: "",
    fatherMiddleName: "",
    fatherLastName: "",
    motherName: "",
    motherNameMr: "",
    motherMiddleName: "",
    motherLastName: "",
    studentGender: "",
    studentContactDetails: "",
    studentEmail: "",
    studentAadharNumber: "",
    casteName: "",
    citizenshipName: "",
    studentBirthPlace: "",
    birthPlacemr: "",
    stateName: "",
    districtName: "",
    familyPermanentAddress: "",
    parentFullName: "",
    parentEmailId: "",
    parentAddress: "",
    fatherQualification: "",
    fatherOccupation: "",
    fatherIncome: "",
    motherQualification: "",
    motherOccupation: "",
    motherIncome: "",
    fatherContactNumber: "",
    motherContactNumber: "",
    colonyName: "",
    parentDistrictName: "",
    parentStateName: "",
    parentPincode: "",
    lastSchoolName: "",
    lastSchoolNameMr: "",
    lastClassAndFromWhenStudying: "",
    studentBehaviour: "",
    behaviourMr: "",
    lastSchoolLeavingDate: null,
    reasonForLeavingSchool: "",
    reasonForLeavingSchoolMr: "",
    motherTongueName: "",
    studentDateOfBirth: null,
    lastSchoolAdmissionDate: null,
    lastSchoolLeavingDate: "",
    accountNo: "",
    confirmBankAcNumber: "",
    accountHolderName: "",
    bankName: "",
    ifscCode: "",
    bankAdderess: "",
  };

  useEffect(() => {
    console.log("studentDateOfBirth1", watch("studentDateOfBirth"));
  }, [watch("studentDateOfBirth")]);

  useEffect(() => {
    console.log("errors121", errors);
  }, [errors]);

  useEffect(() => {
    console.log(
      "search",
      searchFirstName,
      searchmiddleName,
      searchLastName,
      searchGRno
    );
  }, [searchFirstName, searchmiddleName, searchLastName, searchGRno]);

  const getUpdatedData = async (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    axios
      .get(
        `${urls.SCHOOL}/trnUpdateStudentDetailsController/getAllUserId?userId=${user?.id}`,
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
            sortBy: _sortBy,
            sortDir: _sortDir,
          },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        let result = r?.data.trnUpdateStudentDetailsDao;
        console.log("nnnn", result);
        let page = r?.data?.pageSize * r?.data?.pageNo;

        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + page,
            grNumber: r.grNumber,
            remark: r.remark,
            studentName: `${r.firstName} ${r.middleName} ${r.lastName}`,
            studentNameMr: `${r.firstNameMr} ${r.middleNameMr} ${r.lastNameMr}`,
          };
        });
        console.log("Result", _res);
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        sweetAlert(
          "Error",
          e?.message ? e?.message : "Something Went Wrong",
          "error"
        );
        console.log("Eroor", e);
      });
  };
  useEffect(() => {
    getUpdatedData();
  }, []);

  const columns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      flex: 1,
    },
    {
      field: "grNumber",
      headerName: labels.studentGRnumber,
      // flex: 1,
      width: 200,
    },

    {
      field: language == "en" ? "studentName" : "studentNameMr",
      headerName: labels.studentName,
      flex: 1,
      // width: 150,
    },
    {
      field: "remark",
      headerName: labels.remark,
      flex: 1,
      // width: 150,
    },

    {
      field: "Actions",
      headerName: labels.actions,
      width: 220,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        let status = params.row.applicationStatus;
        let paramData = params.row;
        // console.log("params.row", params.row);
        return (
          <Box>
            <IconButton>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<EyeFilled />}
                onClick={() => {
                  router.push({
                    pathname: `/school/transaction/updatedForm`,
                    query: {
                      id: params.row.id,
                      docView: false,
                    },
                  });
                  console.log("params.row: ", params.row.id);
                }}
              >
                {labels.view}
              </Button>
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // view
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
          padding: 1,
          paddingBottom: "30px",
        }}
      >
        <Box
          container
          display="flex"
          justifyContent="center"
          justifyItems="center"
          padding={2}
          marginTop={2}
          sx={{
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2 style={{ marginBottom: 0 }}>{labels.updateStudentInfo}</h2>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginLeft: 5,
            marginRight: 5,
            // marginTop: 2,
            // marginBottom: 3,
            padding: 2,
            // border:1,
            // borderColor:'grey.500'
          }}
        >
          <Box p={1}>
            <Grid container sx={{ padding: "10px" }}>
              {/* first name */}
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  variant="standard"
                  label={labels.studentFirstName}
                  onChange={(e) => setsearchFirstName(e.target.value)}
                  sx={{ width: 230 }}
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{ style: { fontSize: 15 } }}
                />
              </Grid>
              {/* middleName */}
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  variant="standard"
                  label={labels.studentMiddleName}
                  // {...register("studentMiddleName")}
                  onChange={(e) => {
                    setsearchmiddleName(e.target.value);
                  }}
                  error={!!errors.studentMiddleName}
                  sx={{ width: 230 }}
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{ style: { fontSize: 15 } }}
                  helperText={
                    errors?.studentMiddleName
                      ? errors.studentMiddleName.message
                      : null
                  }
                />
              </Grid>
              {/* last name */}
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  variant="standard"
                  label={labels.studentLastName}
                  // {...register("studentLastName")}
                  onChange={(e) => setsearchLastName(e.target.value)}
                  error={!!errors.studentLastName}
                  sx={{ width: 230 }}
                  InputProps={{
                    style: { fontSize: 18 },
                  }}
                  InputLabelProps={{ style: { fontSize: 15 } }}
                  helperText={
                    errors?.studentLastName
                      ? errors.studentLastName.message
                      : null
                  }
                />
              </Grid>
            </Grid>
            <Grid
              container
              sx={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {labels.or}
            </Grid>
            {/* GR number */}
            <Grid container sx={{ display: "flex", justifyContent: "center" }}>
              <TextField
                id="standard-basic"
                variant="standard"
                label={labels.studentGRnumber}
                // {...register("studentGRnumber")}
                onChange={(e) => setsearchGRno(e.target.value)}
                error={!!errors.studentGRnumber}
                sx={{ width: 230 }}
                InputProps={{
                  style: { fontSize: 18 },
                }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                helperText={
                  errors?.studentGRnumber
                    ? errors.studentGRnumber.message
                    : null
                }
              />
            </Grid>
            {/* search button */}
            <Grid
              container
              sx={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                disabled={
                  searchGRno ||
                  (searchFirstName && searchmiddleName && searchLastName)
                    ? false
                    : true
                }
                onClick={(e) => {
                  getStudentInfoByGRNo();
                  // setSlideChecked(true);
                }}
              >
                {labels.search}
              </Button>
            </Grid>
            <Divider />
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {/* <form> */}
                <Slide
                  direction="down"
                  //have to create state
                  in={slideChecked}
                  mountOnEnter
                  unmountOnExit
                >
                  {/* Student info form */}
                  <Grid container sx={{ padding: "10px" }}>
                    {/* Zone Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel error={!!errors.zoneKey}>
                          {labels.zoneName}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="zoneKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              // error={!!errors.zoneKey}
                            >
                              {zoneKeys &&
                                zoneKeys.map((zone, index) => (
                                  <MenuItem key={index} value={zone.id}>
                                    {language == "en"
                                      ? zone?.zoneName
                                      : zone?.zoneNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        {/* <FormHelperText>{errors?.zoneKey ? errors.zoneKey.message : null}</FormHelperText> */}
                      </FormControl>
                    </Grid>
                    {/* Ward Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel error={!!errors.wardKey}>
                          {labels.wardName}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="wardKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              // error={!!errors.wardKey}
                            >
                              {wardKeys &&
                                wardKeys.map((ward, index) => (
                                  <MenuItem key={index} value={ward.id}>
                                    {language == "en"
                                      ? ward?.wardName
                                      : ward?.wardNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        {/* <FormHelperText>{errors?.wardKey ? errors.wardKey.message : null}</FormHelperText> */}
                      </FormControl>
                    </Grid>
                    {/* Select School */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel error={!!errors.schoolKey}>
                          {labels.selectSchool}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="schoolKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.schoolKey}
                            >
                              {schoolList &&
                                schoolList.map((school) => (
                                  <MenuItem key={school.id} value={school.id}>
                                    {/* {school.schoolName} */}
                                    {language == "en"
                                      ? school.schoolName
                                      : school.schoolNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.schoolKey ? errors.schoolKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* Select AY */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel error={!!errors.academicYearKey}>
                          {labels.selectAcademicYear}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="academicYearKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.academicYearKey}
                            >
                              {academicYearList &&
                                academicYearList.map((AY, index) => (
                                  <MenuItem key={index} value={AY.id}>
                                    {AY.academicYear}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.academicYearKey
                            ? errors.academicYearKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* Select Class */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel error={!!errors.classKey}>
                          {labels.selectClass}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="classKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.classKey}
                            >
                              {classList &&
                                classList.map((school, index) => (
                                  <MenuItem key={index} value={school.id}>
                                    {school.className}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.classKey ? errors.classKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Select Div */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel error={!!errors.divisionKey}>
                          {labels.selectDivision}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="divisionKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.divisionKey}
                            >
                              {divisionList &&
                                divisionList.map((div, index) => (
                                  <MenuItem key={index} value={div.id}>
                                    {div.divisionName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.divisionKey
                            ? errors.divisionKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* select medium */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel error={!!errors.schoolMedium}>
                          {labels.selectMedium}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="schoolMedium"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.schoolMedium}
                            >
                              {medium &&
                                medium.map((med, index) => (
                                  <MenuItem key={index} value={med}>
                                    {med}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.schoolMedium
                            ? errors.schoolMedium.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Divider />
                    <Grid
                      container
                      display="flex"
                      justifyContent="center"
                      justifyItems="center"
                      padding={2}
                      marginBottom={2}
                      sx={{
                        background:
                          "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        borderRadius: "6% / 100%",
                      }}
                    >
                      <Grid item>
                        <h2 style={{ marginBottom: 0 }}>
                          {labels.studentPersonalInfo}
                        </h2>
                      </Grid>
                    </Grid>
                    {/* Stude 1st Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.studentFirstName}
                        {...register("studentFirstName")}
                        required
                        error={!!errors.studentFirstName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={
                          errors?.studentFirstName
                            ? errors.studentFirstName.message
                            : null
                        }
                      /> */}

                      <Grid sx={{ width: 230 }}>
                        <Transliteration
                          _key={"firstName"}
                          label={`${labels.studentFirstName} *`}
                          fieldName={"firstName"}
                          updateFieldName={"firstNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          disabled={readonlyFields}
                          error={!!errors.firstName}
                          targetError={"firstNameMr"}
                          helperText={
                            errors?.firstName
                              ? labels.studentFirstNameReq
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                    {/* stud 2nd NAme */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <TextField
                        id="standard-basic"
                        variant="standard"
                        required
                        label={labels.studentMiddleName}
                        {...register("studentMiddleName")}
                        error={!!errors.studentMiddleName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={
                          errors?.studentMiddleName
                            ? errors.studentMiddleName.message
                            : null
                        }
                      /> */}
                      <Grid sx={{ width: 230 }}>
                        <Transliteration
                          _key={"middleName"}
                          label={`${labels.studentMiddleName} *`}
                          fieldName={"middleName"}
                          updateFieldName={"middleNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          disabled={readonlyFields}
                          error={!!errors.middleName}
                          targetError={"middleNameMr"}
                          helperText={
                            errors?.middleName
                              ? labels.studentMiddleNameReq
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                    {/* stude L Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.studentLastName}
                        {...register("studentLastName")}
                        error={!!errors.studentLastName}
                        required
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={
                          errors?.studentLastName
                            ? errors.studentLastName.message
                            : null
                        }
                      /> */}
                      <Grid sx={{ width: 230 }}>
                        <Transliteration
                          _key={"lastName"}
                          label={`${labels.studentLastName} *`}
                          fieldName={"lastName"}
                          updateFieldName={"lastNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          disabled={readonlyFields}
                          error={!!errors.lastName}
                          targetError={"lastNameMr"}
                          helperText={
                            errors?.lastName ? labels.studentLastNameReq : null
                          }
                        />
                      </Grid>
                    </Grid>
                    {/* Stude 1st NameMr */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <TextField
                        id="standard-basic"
                        variant="standard"
                        required
                        label={labels.studentFirstNameMr}
                        {...register("firstNameMr")}
                        error={!!errors.firstNameMr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={
                          errors?.firstNameMr
                            ? errors.firstNameMr.message
                            : null
                        }
                      /> */}
                      <Grid sx={{ width: 230 }}>
                        <Transliteration
                          _key={"firstNameMr"}
                          label={`${labels.studentFirstNameMr} *`}
                          fieldName={"firstNameMr"}
                          updateFieldName={"firstName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          disabled={readonlyFields}
                          error={!!errors.firstNameMr}
                          targetError={"firstName"}
                          helperText={
                            errors?.firstNameMr ? labels.firstNameMrReq : null
                          }
                        />
                      </Grid>
                    </Grid>

                    {/* stud 2nd NAmeMr */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.studentMiddleNameMr}
                        required
                        {...register("middleNameMr")}
                        error={!!errors.middleNameMr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={
                          errors?.middleNameMr
                            ? errors.middleNameMr.message
                            : null
                        }
                      /> */}

                      <Grid sx={{ width: 230 }}>
                        <Transliteration
                          _key={"middleNameMr"}
                          label={`${labels.studentMiddleName} *`}
                          fieldName={"middleNameMr"}
                          updateFieldName={"middleName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          disabled={readonlyFields}
                          error={!!errors.middleNameMr}
                          targetError={"middleName"}
                          helperText={
                            errors?.middleNameMr ? labels.middleNameMrReq : null
                          }
                        />
                      </Grid>
                    </Grid>

                    {/* stude L Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.studentLastNameMr}
                        required
                        {...register("lastNameMr")}
                        error={!!errors.lastNameMr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={
                          errors?.lastNameMr ? errors.lastNameMr.message : null
                        }
                      /> */}
                      <Grid sx={{ width: 230 }}>
                        <Transliteration
                          _key={"lastNameMr"}
                          label={`${labels.studentLastNameMr} *`}
                          fieldName={"lastNameMr"}
                          updateFieldName={"lastName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          disabled={readonlyFields}
                          error={!!errors.lastNameMr}
                          targetError={"lastName"}
                          helperText={
                            errors?.lastNameMr ? labels.lastNameMrReq : null
                          }
                        />
                      </Grid>
                    </Grid>
                    {/* Father 1st Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.fatherFirstName}
                        {...register("fatherFirstName")}
                        error={!!errors.fatherFirstName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("fatherFirstName") ? true : false,
                        }}
                        helperText={
                          errors?.fatherFirstName
                            ? errors.fatherFirstName.message
                            : null
                        }
                      />
                    </Grid>
                    {/* Father 2nd Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.fatherMiddleName}
                        {...register("fatherMiddleName")}
                        error={!!errors.fatherMiddleName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("fatherMiddleName") ? true : false,
                        }}
                        helperText={
                          errors?.fatherMiddleName
                            ? errors.fatherMiddleName.message
                            : null
                        }
                      />
                    </Grid>
                    {/* Father L Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.fatherLastName}
                        {...register("fatherLastName")}
                        error={!!errors.fatherLastName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("fatherLastName") ? true : false,
                        }}
                        helperText={
                          errors?.fatherLastName
                            ? errors.fatherLastName.message
                            : null
                        }
                      />
                    </Grid>
                    {/* Mother NAme */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherName}
                        {...register("motherName")}
                        error={!!errors.motherName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("motherName") ? true : false,
                        }}
                        helperText={
                          errors?.motherName ? errors.motherName.message : null
                        }
                      />
                    </Grid>

                    {/* mother 2nd Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherMiddleName}
                        {...register("motherMiddleName")}
                        error={!!errors.motherMiddleName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("motherMiddleName") ? true : false,
                        }}
                        helperText={
                          errors?.motherMiddleName
                            ? errors.motherMiddleName.message
                            : null
                        }
                      />
                    </Grid>
                    {/* mother L Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherLastName}
                        {...register("motherLastName")}
                        error={!!errors.motherLastName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("motherLastName") ? true : false,
                        }}
                        helperText={
                          errors?.motherLastName
                            ? errors.motherLastName.message
                            : null
                        }
                      />
                    </Grid>
                    {/* Mother NAme Mr*/}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherNameMr}
                        {...register("motherNameMr")}
                        error={!!errors.motherNameMr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("motherNameMr") ? true : false,
                        }}
                        helperText={
                          errors?.motherNameMr
                            ? errors.motherNameMr.message
                            : null
                        }
                      />
                    </Grid>
                    {/* Gender */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl disabled={readonlyFields}>
                        <FormLabel>{labels.gender}</FormLabel>

                        <Controller
                          name="gender"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <RadioGroup
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                value="M"
                                control={<Radio />}
                                label={labels.male}
                              />
                              <FormControlLabel
                                value="F"
                                control={<Radio />}
                                label={labels.female}
                              />
                              <FormControlLabel
                                value="O"
                                control={<Radio />}
                                label={labels.other}
                              />
                            </RadioGroup>
                          )}
                        />
                        <FormHelperText>
                          {errors?.gender ? errors.gender.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* Contact Details */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.mobileNumber}
                        {...register("contactDetails")}
                        error={!!errors.contactDetails}
                        sx={{ width: 230 }}
                        // type="number"
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("contactDetails") ? true : false,
                        }}
                        helperText={
                          errors?.contactDetails
                            ? errors.contactDetails.message
                            : null
                        }
                      />
                    </Grid>
                    {/* studentEmail */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.emailId}
                        {...register("studentEmailId")}
                        error={!!errors.studentEmailId}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("studentEmailId") ? true : false,
                        }}
                        helperText={
                          errors?.studentEmailId
                            ? errors.studentEmailId.message
                            : null
                        }
                      />
                    </Grid>
                    {/* Aadhar */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.aadharNumber}
                        {...register("aadharNumber")}
                        error={!!errors.aadharNumber}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("aadharNumber") ? true : false,
                        }}
                        helperText={
                          errors?.aadharNumber
                            ? errors.aadharNumber.message
                            : null
                        }
                      />
                    </Grid>
                    <Divider />
                    <Grid
                      container
                      display="flex"
                      justifyContent="center"
                      justifyItems="center"
                      padding={2}
                      marginBottom={2}
                      sx={{
                        background:
                          "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        borderRadius: "6% / 100%",
                      }}
                    >
                      <Grid item>
                        <h2 style={{ marginBottom: 0 }}>
                          {labels.studentOthInfo}
                        </h2>
                      </Grid>
                    </Grid>
                    {/* Religion */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel error={!!errors.religionKey}>
                          {labels.religion}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="religionKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.religionKey}
                            >
                              {religions &&
                                religions.map((religion, index) => (
                                  <MenuItem key={index} value={religion.id}>
                                    {language == "en"
                                      ? religion?.religion
                                      : religion?.religionMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.religionKey
                            ? errors.religionKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* Cast Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel error={!!errors.casteKey}>
                          {labels.casteName}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="casteKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.casteKey}
                            >
                              {castNames &&
                                castNames.map((cast, index) => (
                                  <MenuItem key={index} value={cast.id}>
                                    {language == "en"
                                      ? cast?.cast
                                      : cast?.castMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.casteKey ? errors.casteKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* subCast Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel error={!!errors.subCastKey}>
                          {labels.subCastName}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="subCastKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.subCastKey}
                            >
                              {subCastNames &&
                                subCastNames.map((subCast, index) => (
                                  <MenuItem key={index} value={subCast.id}>
                                    {language == "en"
                                      ? subCast?.subCast
                                      : subCast?.subCastMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.subCastKey
                            ? errors.subCastKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* CitizenShip */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel error={!!errors.citizenshipName}>
                          {labels.citizenship}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="citizenshipName"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.citizenshipName}
                            >
                              {citizenshipList &&
                                citizenshipList.map((citizen) => (
                                  <MenuItem
                                    key={citizen.id}
                                    value={citizen.citizen}
                                  >
                                    {language == "en"
                                      ? citizen?.citizen
                                      : citizen?.citizen}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.citizenshipName
                            ? errors.citizenshipName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* Mother Tongue */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel error={!!errors.motherTongueName}>
                          {labels.motherTongue}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="motherTongueName"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.motherTongueName}
                            >
                              {motherTongueList &&
                                motherTongueList.map((motherTongue) => (
                                  <MenuItem
                                    key={motherTongue.id}
                                    value={motherTongue.motherTongue}
                                  >
                                    {language == "en"
                                      ? motherTongue?.motherTongue
                                      : motherTongue?.motherTongue}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.motherTongueName
                            ? errors.motherTongueName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* Birth Place */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.birthPlace}
                        {...register("birthPlace")}
                        error={!!errors.birthPlace}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("birthPlace") ? true : false,
                        }}
                        helperText={
                          errors?.birthPlace ? errors.birthPlace.message : null
                        }
                      />
                    </Grid>
                    {/* birthPlacemr*/}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.birthPlaceMr}
                        {...register("birthPlacemr")}
                        error={!!errors.birthPlacemr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("birthPlacemr") ? true : false,
                        }}
                        helperText={
                          errors?.birthPlacemr
                            ? errors.birthPlacemr.message
                            : null
                        }
                      />
                    </Grid>
                    {/* DOB */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Controller
                        name="dateOfBirth"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disabled={readonlyFields}
                              inputFormat="DD-MM-YYYY"
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  variant="standard"
                                  fullWidth
                                  sx={{ width: 230 }}
                                  size="small"
                                  error={errors.dateOfBirth}
                                  helperText={
                                    errors.dateOfBirth
                                      ? errors.dateOfBirth.message
                                      : null
                                  }
                                />
                              )}
                              label={labels.dateOfbirth}
                              value={field.value}
                              // value={watch("studentDateOfBirth")}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("DD-MM-YYYY")
                                )
                              }
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>
                    {/* Age */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.age}
                        {...register("studentAge")}
                        error={!!errors.studentAge}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("studentAge") ? true : false,
                        }}
                        // InputLabelProps={{ style: { fontSize: 15 } }}
                        // InputLabelProps={{
                        //   shrink:
                        //     watch("studentAge") == "" || null ? false : true,
                        // }}
                      />
                    </Grid>
                    {/*birth Place State */}

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel error={!!errors.stateName}>
                          {labels.state}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="stateName"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.stateName}
                            >
                              {BirthState &&
                                BirthState.map((stateName, index) => (
                                  <MenuItem key={index} value={stateName.id}>
                                    {language == "en"
                                      ? stateName?.stateName
                                      : stateName?.stateNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.stateName ? errors.stateName.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/*birth place Dist*/}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.studentDist}
                        {...register("districtName")}
                        error={!!errors.districtName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("districtName") ? true : false,
                        }}
                        helperText={
                          errors?.districtName
                            ? errors.districtName.message
                            : null
                        }
                      />
                    </Grid>
                    <Divider />
                    <Grid
                      container
                      display="flex"
                      justifyContent="center"
                      justifyItems="center"
                      padding={2}
                      marginBottom={2}
                      sx={{
                        background:
                          "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        borderRadius: "6% / 100%",
                      }}
                    >
                      <Grid item>
                        <h2 style={{ marginBottom: 0 }}>
                          {labels.studentParentInfo}
                        </h2>
                      </Grid>
                    </Grid>

                    {/* Fam permanent add */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.permanentAddress}
                        {...register("familyPermanentAddress")}
                        error={!!errors.familyPermanentAddress}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("familyPermanentAddress")
                            ? true
                            : false,
                        }}
                        helperText={
                          errors?.familyPermanentAddress
                            ? errors.familyPermanentAddress.message
                            : null
                        }
                      />
                    </Grid>
                    {/* Parent Full Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.parentFullName}
                        {...register("parentFullName")}
                        error={!!errors.parentFullName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("parentFullName") ? true : false,
                        }}
                        helperText={
                          errors?.parentFullName
                            ? errors.parentFullName.message
                            : null
                        }
                      />
                    </Grid>
                    {/* parent Email */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.parentEmailId}
                        {...register("parentEmailId")}
                        error={!!errors.parentEmailId}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("parentEmailId") ? true : false,
                        }}
                        helperText={
                          errors?.parentEmailId
                            ? errors.parentEmailId.message
                            : null
                        }
                      />
                    </Grid>
                    {/* Parent Address */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.parentAddress}
                        {...register("parentAddress")}
                        error={!!errors.parentAddress}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("parentAddress") ? true : false,
                        }}
                        helperText={
                          errors?.parentAddress
                            ? errors.parentAddress.message
                            : null
                        }
                      />
                    </Grid>

                    {/* Father Contact Number */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.fatherMobileNumber}
                        {...register("fatherContactNumber")}
                        error={!!errors.fatherContactNumber}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("fatherContactNumber") ? true : false,
                        }}
                        helperText={
                          errors?.fatherContactNumber
                            ? errors.fatherContactNumber.message
                            : null
                        }
                      />
                    </Grid>
                    {/* Mother Contact Number */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherMobileNumber}
                        {...register("motherContactNumber")}
                        error={!!errors.motherContactNumber}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("motherContactNumber") ? true : false,
                        }}
                        helperText={
                          errors?.motherContactNumber
                            ? errors.motherContactNumber.message
                            : null
                        }
                      />
                    </Grid>

                    {/* Parent Occupation */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.fatherQualification}
                        {...register("fatherQualification")}
                        error={!!errors.fatherQualification}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("fatherQualification") ? true : false,
                        }}
                        helperText={
                          errors?.fatherQualification
                            ? errors.fatherQualification.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.fatherOccupation}
                        {...register("fatherOccupation")}
                        error={!!errors.fatherOccupation}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("fatherOccupation") ? true : false,
                        }}
                        helperText={
                          errors?.fatherOccupation
                            ? errors.fatherOccupation.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.fatherIncome}
                        {...register("fatherIncome")}
                        error={!!errors.fatherIncome}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("fatherIncome") ? true : false,
                        }}
                        helperText={
                          errors?.fatherIncome
                            ? errors.fatherIncome.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherQualification}
                        {...register("motherQualification")}
                        error={!!errors.motherQualification}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("motherQualification") ? true : false,
                        }}
                        helperText={
                          errors?.motherQualification
                            ? errors.motherQualification.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherOccupation}
                        {...register("motherOccupation")}
                        error={!!errors.motherOccupation}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("motherOccupation") ? true : false,
                        }}
                        helperText={
                          errors?.motherOccupation
                            ? errors.motherOccupation.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherIncome}
                        {...register("motherIncome")}
                        error={!!errors.motherIncome}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("motherIncome") ? true : false,
                        }}
                        helperText={
                          errors?.motherIncome
                            ? errors.motherIncome.message
                            : null
                        }
                      />
                    </Grid>

                    {/*Colony */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.colony}
                        {...register("colonyName")}
                        error={!!errors.colonyName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("colonyName") ? true : false,
                        }}
                        helperText={
                          errors?.colonyName ? errors.colonyName.message : null
                        }
                      />
                    </Grid>
                    {/*District */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.district}
                        {...register("parentDistrictName")}
                        error={!!errors.parentDistrictName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("parentDistrictName") ? true : false,
                        }}
                        helperText={
                          errors?.parentDistrictName
                            ? errors.parentDistrictName.message
                            : null
                        }
                      />
                    </Grid>
                    {/*state*/}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.state}
                        {...register("parentStateName")}
                        error={!!errors.parentStateName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("parentStateName") ? true : false,
                        }}
                        helperText={
                          errors?.parentStateName
                            ? errors.parentStateName.message
                            : null
                        }
                      />
                    </Grid>
                    {/*Pin Code*/}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.pincode}
                        {...register("parentPincode")}
                        error={!!errors.parentPincode}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("parentPincode") ? true : false,
                        }}
                        helperText={
                          errors?.parentPincode
                            ? errors.parentPincode.message
                            : null
                        }
                      />
                    </Grid>
                    <Divider />

                    <Typography style={{ marginTop: "5px" }}>
                      {language == "en"
                        ? "Applicable to enter Last School Information"
                        : "शेवटची शाळा माहिती प्रविष्ट करण्यासाठी लागू आहे?"}
                    </Typography>
                    <Checkbox
                      checked={checked}
                      onChange={handleCheckboxChange}
                      color="primary"
                      name="isLastSchoolIsApplicable"
                    />
                    {checked || watch("isLastSchoolIsApplicable") ? (
                      <>
                        <Grid
                          container
                          display="flex"
                          justifyContent="center"
                          justifyItems="center"
                          padding={2}
                          marginBottom={2}
                          sx={{
                            background:
                              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                            borderRadius: "6% / 100%",
                          }}
                        >
                          <Grid item>
                            <h2 style={{ marginBottom: 0 }}>
                              {labels.lastSchoolInfo}
                            </h2>
                          </Grid>
                        </Grid>

                        {/*saralId*/}
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            variant="standard"
                            defaultValue=""
                            label={labels.saralId}
                            {...register("saralId")}
                            error={!!errors.saralId}
                            sx={{ width: 230 }}
                            disabled={readonlyFields}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              shrink: watch("saralId") ? true : false,
                            }}
                            // helperText={
                            //   errors?.studentName ? errors.studentName.message : null
                            // }
                          />
                        </Grid>

                        {/*Last School Name*/}
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            variant="standard"
                            label={labels.lastSchoolName}
                            {...register("lastSchoolName")}
                            error={!!errors.lastSchoolName}
                            sx={{ width: 230 }}
                            disabled={readonlyFields}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              shrink: watch("lastSchoolName") ? true : false,
                            }}
                            // helperText={
                            //   errors?.studentName ? errors.studentName.message : null
                            // }
                          />
                        </Grid>
                        {/*Last School NameMr*/}
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            variant="standard"
                            label={labels.lastSchoolNameMr}
                            {...register("lastSchoolNameMr")}
                            error={!!errors.lastSchoolNameMr}
                            sx={{ width: 230 }}
                            disabled={readonlyFields}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              shrink: watch("lastSchoolNameMr") ? true : false,
                            }}
                            // helperText={
                            //   errors?.studentName ? errors.studentName.message : null
                            // }
                          />
                        </Grid>
                        {/* Last School Admission Date */}
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Controller
                            control={control}
                            name="lastSchoolAdmissionDate"
                            defaultValue=""
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  disabled={readonlyFields}
                                  renderInput={(props) => (
                                    <TextField
                                      {...props}
                                      variant="standard"
                                      fullWidth
                                      sx={{ width: 230 }}
                                      size="small"
                                      error={errors.lastSchoolAdmissionDate}
                                      helperText={
                                        errors.lastSchoolAdmissionDate
                                          ? errors.lastSchoolAdmissionDate
                                              .message
                                          : null
                                      }
                                    />
                                  )}
                                  label={labels.lastSchoolAdmissionDate}
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    )
                                  }
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </Grid>
                        {/* Last Class and from when Studying */}
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            variant="standard"
                            label={labels.lastSchoolAndFromWhenStudying}
                            {...register("lastClassAndFromWhenStudying")}
                            error={!!errors.lastClassAndFromWhenStudying}
                            sx={{ width: 230 }}
                            disabled={readonlyFields}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              shrink: watch("lastClassAndFromWhenStudying")
                                ? true
                                : false,
                            }}
                            // helperText={
                            //   errors?.studentName ? errors.studentName.message : null
                            // }
                          />
                        </Grid>
                        {/* Last School Leaving Date */}
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Controller
                            control={control}
                            name="lastSchoolLeavingDate"
                            defaultValue=""
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  disabled={readonlyFields}
                                  renderInput={(props) => (
                                    <TextField
                                      {...props}
                                      variant="standard"
                                      fullWidth
                                      sx={{ width: 230 }}
                                      size="small"
                                      error={errors.lastSchoolLeavingDate}
                                      helperText={
                                        errors.lastSchoolLeavingDate
                                          ? errors.lastSchoolLeavingDate.message
                                          : null
                                      }
                                    />
                                  )}
                                  label={labels.lastSchoolLeavingDate}
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    )
                                  }
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </Grid>
                        {/* Student Behaviour */}
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            variant="standard"
                            label={labels.studentBehaviour}
                            {...register("behaviour")}
                            error={!!errors.behaviour}
                            sx={{ width: 230 }}
                            disabled={readonlyFields}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              shrink: watch("behaviour") ? true : false,
                            }}
                            // helperText={
                            //   errors?.studentName ? errors.studentName.message : null
                            // }
                          />
                        </Grid>
                        {/* Student BehaviourMr */}
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            variant="standard"
                            label={labels.studentBehaviourMr}
                            {...register("behaviourMr")}
                            error={!!errors.behaviourMr}
                            sx={{ width: 230 }}
                            disabled={readonlyFields}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              shrink: watch("behaviourMr") ? true : false,
                            }}
                            // helperText={
                            //   errors?.studentName ? errors.studentName.message : null
                            // }
                          />
                        </Grid>
                        {/* Reason For Leaving School */}
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            variant="standard"
                            label={labels.reasonForLeavingSchool}
                            {...register("reasonForLeavingSchool")}
                            error={!!errors.reasonForLeavingSchool}
                            sx={{ width: 230 }}
                            disabled={readonlyFields}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              shrink: watch("reasonForLeavingSchool")
                                ? true
                                : false,
                            }}
                            // helperText={
                            //   // errors?.studentName ? errors.studentName.message : null
                            //  }
                          />
                        </Grid>
                        {/* Reason For Leaving School Mr */}
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            variant="standard"
                            label={labels.reasonForLeavingSchoolMr}
                            {...register("reasonForLeavingSchoolMr")}
                            error={!!errors.reasonForLeavingSchoolMr}
                            sx={{ width: 230 }}
                            disabled={readonlyFields}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              shrink: watch("reasonForLeavingSchoolMr")
                                ? true
                                : false,
                            }}
                            // helperText={
                            //   // errors?.studentName ? errors.studentName.message : null
                            //  }
                          />
                        </Grid>
                      </>
                    ) : (
                      <></>
                    )}

                    <Divider />
                    {console.log("handicapchecked", handicapchecked)}
                    <Typography style={{ marginTop: "5px" }}>
                      {language == "en" ? "Handicapped ?" : "दिव्यांग ?"}
                    </Typography>
                    <Checkbox
                      checked={handicapchecked}
                      onChange={handleHandicapCheckboxChange}
                      color="primary"
                      name="isPhysicallyChallenged"
                    />
                    {console.log("isss", watch("isPhysicallyChallenged"))}
                    {handicapchecked || watch("isPhysicallyChallenged") ? (
                      <>
                        <Grid
                          container
                          display="flex"
                          justifyContent="center"
                          justifyItems="center"
                          padding={2}
                          marginBottom={2}
                          sx={{
                            background:
                              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                            borderRadius: "6% / 100%",
                          }}
                        >
                          <Grid item>
                            <h2 style={{ marginBottom: 0 }}>
                              {labels.disabilityInfo}
                            </h2>
                          </Grid>
                        </Grid>

                        {/*type of disability*/}
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl sx={{ width: 230 }}>
                            <InputLabel error={!!errors.typeOfDisability}>
                              {labels.disabilityTypes}
                            </InputLabel>
                            <Controller
                              control={control}
                              name="typeOfDisability"
                              rules={{ required: true }}
                              defaultValue=""
                              render={({ field }) => (
                                <Select
                                  // readOnly={readonlyFields}
                                  disabled={readonlyFields}
                                  variant="standard"
                                  {...field}
                                  error={!!errors.typeOfDisability}
                                >
                                  {typesOfDis &&
                                    typesOfDis.map(
                                      (typeOfDisability, index) => (
                                        <MenuItem
                                          key={index}
                                          value={typeOfDisability.id}
                                        >
                                          {language == "en"
                                            ? typeOfDisability?.typeOfDisability
                                            : typeOfDisability?.typeOfDisabilityMr}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              )}
                            />
                            <FormHelperText>
                              {errors?.typeOfDisability
                                ? errors.typeOfDisability.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        {/*Last School Name*/}
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            variant="standard"
                            label={labels.percentageofDisability}
                            {...register("percentageOfDisability")}
                            error={!!errors.percentageOfDisability}
                            sx={{ width: 230 }}
                            disabled={readonlyFields}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{ style: { fontSize: 15 } }}
                            helperText={
                              errors?.percentageOfDisability
                                ? errors.percentageOfDisability.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={6}
                          sm={6}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Grid
                            item
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                              <label>
                                {labels.certificateOfDisability}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                            </Grid>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                              {/* <UploadButton
                                view={docView}
                                appName="TP"
                                serviceName="PARTMAP"
                                fileUpdater={setstudentDisabilityCertificate}
                                filePath={studentDisabilityCertificate}
                              /> */}
                              <DocumentsUpload
                                // error={!!errors?.studentPhotograph}
                                // appName="TP"
                                // serviceName="PARTMAP"
                                // fileUpdater={setStudentPhotograph}
                                // filePath={studentPhotograph}
                                // fileKey={'studentPhotograph'}
                                view={docView}
                                error={
                                  !!errors?.physicallyChallengedCertficateDocument
                                }
                                appName="TP"
                                serviceName="PARTMAP"
                                fileDtl={watch(
                                  "physicallyChallengedCertficateDocument"
                                )}
                                fileKey={
                                  "physicallyChallengedCertficateDocument"
                                }
                                // showDel={pageMode ? false : true}
                                showDel={true}
                                fileNameEncrypted={(path) => {
                                  setEncrptDisabilityDoc(path);
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <></>
                    )}
                    <Divider />
                    <Grid
                      container
                      display="flex"
                      justifyContent="center"
                      justifyItems="center"
                      padding={2}
                      marginBottom={2}
                      sx={{
                        background:
                          "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        borderRadius: "6% / 100%",
                      }}
                    >
                      <Grid item>
                        <h2 style={{ marginBottom: 0 }}>
                          {labels.accountDetails}
                        </h2>
                      </Grid>
                    </Grid>

                    {/* Account Number */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.accountNo}
                        {...register("accountNo")}
                        error={!!errors.accountNo}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("accountNo") ? true : false,
                        }}
                        helperText={
                          errors?.accountNo ? errors.accountNo.message : null
                        }
                      />
                    </Grid>
                    {/* confirm Account Number */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField //from-vishal
                        id="standard-basic"
                        variant="standard"
                        label={labels.confirmBankAcNumber}
                        onPaste={(e) => e.preventDefault()} //prevents from copy-paste
                        {...register("confirmBankAcNumber")}
                        error={!!errors.confirmBankAcNumber}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          autoComplete: "off", //prevents from autoSuggestions
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("confirmBankAcNumber") ? true : false,
                        }}
                        helperText={
                          errors?.confirmBankAcNumber
                            ? errors.confirmBankAcNumber.message
                            : null
                        }
                      />
                    </Grid>
                    {/* Account Holder Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.accountHolderName}
                        {...register("accountHolderName")}
                        error={!!errors.accountHolderName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("accountHolderName") ? true : false,
                        }}
                        helperText={
                          errors?.accountHolderName
                            ? errors.accountHolderName.message
                            : null
                        }
                      />
                    </Grid>
                    {/* bank Name */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.bankName}
                        {...register("bankName")}
                        error={!!errors.bankName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("bankName") ? true : false,
                        }}
                        helperText={
                          errors?.bankName ? errors.bankName.message : null
                        }
                      />
                    </Grid>
                    {/* bank ifsc Code */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.ifscCode}
                        {...register("ifscCode")}
                        error={!!errors.ifscCode}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("ifscCode") ? true : false,
                        }}
                        helperText={
                          errors?.ifscCode ? errors.ifscCode.message : null
                        }
                      />
                    </Grid>
                    {/* bank Adderess */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.bankAdderess}
                        {...register("bankAdderess")}
                        error={!!errors.bankAdderess}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("bankAdderess") ? true : false,
                        }}
                        helperText={
                          errors?.bankAdderess
                            ? errors.bankAdderess.message
                            : null
                        }
                      />
                    </Grid>
                    {/* relation */}
                    {/* <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel error={!!errors.relationWithAccountantHolder}>
                          {labels.relation}
                        </InputLabel>
                        <Controller
                            control={control}
                            name="relationWithAccountantHolder"
                          rules={{ required: true }}
                          value={watch("relationWithAccountantHolder")}
                          render={({ field }) => (
                            
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              
                              // value={field.value}
                              // onChange={(value)=>{
                              //   field.onChange(value)
                              // }}
                              error={!!errors.relationWithAccountantHolder}
                              >
                              {console.log("ccx",watch("relationWithAccountantHolder"))}
                              {
                                relations?.map((relation, index) => { 
                                  return <MenuItem key={index} value={relation.val}>
                                    {relation.val}
                                  </MenuItem>
                          })}
                            </Select>
                          )}

                        
                        />
                        <FormHelperText>
                          {errors?.relationWithAccountantHolder
                            ? errors.relationWithAccountantHolder.message
                            : null}
                        </FormHelperText>
                      </FormControl>


                    </Grid> */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{ width: 230 }}
                        // error={errors.relationWithAccountantHolder}
                        // variant="outlined"
                        // sx={{ width: "90%" }}
                        // size="small"
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          {labels.relation}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              // sx={{ minWidth: 220 }}
                              error={!!errors.relationWithAccountantHolder}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => {
                                return field.onChange(value);
                              }}
                              variant="standard"
                            >
                              {relations?.map((relation, index) => {
                                return (
                                  <MenuItem key={index} value={relation}>
                                    {relation}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                          name="relationWithAccountantHolder"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.relationWithAccountantHolder
                            ? errors.relationWithAccountantHolder.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {watch("relationWithAccountantHolder") === "other" && (
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          defaultValue=""
                          label={labels.relation}
                          // label="relationWithAccountHolder"

                          // value={otherRelationWithAccountantHolder}
                          //  onChange={handleOtherInputChange}
                          {...register("otherRelationWithAccountantHolder")}
                          error={!!errors.otherRelationWithAccountantHolder}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("otherRelationWithAccountantHolder")
                              ? true
                              : false,
                          }}
                          helperText={
                            errors?.otherRelationWithAccountantHolder
                              ? errors.otherRelationWithAccountantHolder.message
                              : null
                          }
                        />
                      )}
                    </Grid>

                    <Divider />
                    <Grid
                      container
                      display="flex"
                      justifyContent="center"
                      justifyItems="center"
                      padding={2}
                      marginBottom={2}
                      sx={{
                        background:
                          "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        borderRadius: "6% / 100%",
                      }}
                    >
                      <Grid item>
                        <h2 style={{ marginBottom: 0 }}>{labels.documents}</h2>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <label>
                          {labels.studentBirthCertificate}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        {/* <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setStudentBirthCertificate}
                          filePath={studentBirthCertificate}
                        /> */}
                        <DocumentsUpload
                          error={!!errors?.birthCertificateDocument}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileDtl={watch("birthCertificateDocument")}
                          fileKey={"birthCertificateDocument"}
                          showDel={true}
                          view={docView}
                          fileNameEncrypted={(path) => {
                            setEncrptbirthCertificateDocument(path);
                          }}
                          // showDel={pageMode ? false : true}
                          // error={!!errors?.studentBirthCertificate}
                          // appName="TP"
                          // serviceName="PARTMAP"
                          // fileUpdater={setStudentBirthCertificate}
                          // filePath={studentBirthCertificate}
                        />
                      </Grid>
                      {/* Leaving Certificate */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <label>{labels.studentSchoolLeavingCertificate}</label>
                        {/* <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setStudentLeavingCertificate}
                          filePath={studentLeavingCerrtificate}
                        /> */}
                        <DocumentsUpload
                          error={!!errors?.leavingCertificateDocuemnt}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileDtl={watch("leavingCertificateDocuemnt")}
                          fileKey={"leavingCertificateDocuemnt"}
                          showDel={true}
                          view={docView}
                          fileNameEncrypted={(path) => {
                            setEncrptleavingCertificateDocuemnt(path);
                          }}
                          // showDel={pageMode ? false : true}
                          // appName="TP"
                          // serviceName="PARTMAP"
                          // fileUpdater={setStudentLeavingCertificate}
                          // filePath={studentLeavingCerrtificate}
                        />
                      </Grid>
                      {/* Student Photograph */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <label>
                          {labels.studentPhotograph}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <DocumentsUpload
                          // error={!!errors?.studentPhotograph}
                          // appName="TP"
                          // serviceName="PARTMAP"
                          // fileUpdater={setStudentPhotograph}
                          // filePath={studentPhotograph}
                          // fileKey={'studentPhotograph'}
                          view={docView}
                          error={!!errors?.studentPhotograph}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileDtl={watch("photograph")}
                          fileKey={"photograph"}
                          // showDel={pageMode ? false : true}
                          showDel={true}
                          fileNameEncrypted={(path) => {
                            setEncrptstudentPhotograph(path);
                          }}
                        />
                        {/* <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setStudentPhotograph}
                          filePath={studentPhotograph}
                        /> */}
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      {/* Student AAdhar Card */}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <label>
                          {labels.studentAadhar}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <DocumentsUpload
                          error={!!errors?.studentAadharCardDocument}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileDtl={watch("aadharCardDocument")}
                          fileKey={"aadharCardDocument"}
                          // showDel={pageMode ? false : true}
                          showDel={true}
                          // error={!!errors?.studentAadharCard}
                          view={docView}
                          fileNameEncrypted={(path) => {
                            setEncrptstudentAadharCardDocument(path);
                          }}
                          // appName="TP"
                          // serviceName="PARTMAP"
                          // fileUpdater={setStudentAadharCard}
                          // filePath={studentAadharCard}
                        />
                        {/* <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setStudentAadharCard}
                          filePath={studentAadharCard}
                        /> */}
                      </Grid>
                      {/* Parent Aadhar Card*/}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <label>
                          {labels.parentAadhar}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <DocumentsUpload
                          error={!!errors?.parentAadharCardDocument}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileDtl={watch("parentAadharCardDocument")}
                          fileKey={"parentAadharCardDocument"}
                          // showDel={pageMode ? false : true}
                          showDel={true}
                          // error={!!errors?.parentAadharCard}
                          fileNameEncrypted={(path) => {
                            setEncrptparentAadharCardDocument(path);
                          }}
                          view={docView}
                          // appName="TP"
                          // serviceName="PARTMAP"
                          // fileUpdater={setParentAadharCard}
                          // filePath={parentAadharCard}
                        />
                        {/* <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setParentAadharCard}
                          filePath={parentAadharCard}
                        /> */}
                      </Grid>
                      {/* Student Last Year Marksheet*/}
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <label>{labels.studentLastYearMarksheet}</label>
                        <DocumentsUpload
                          error={!!errors?.studentLastYearMarkSheetDocument}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileDtl={watch("lastYearMarkSheetDocument")}
                          fileKey={"lastYearMarkSheetDocument"}
                          // showDel={pageMode ? false : true}
                          showDel={true}
                          view={docView}
                          fileNameEncrypted={(path) => {
                            setEncrptstudentLastYearMarkSheetDocument(path);
                          }}
                          // appName="TP"
                          // serviceName="PARTMAP"
                          // fileUpdater={setStudentLastYearMarksheet}
                          // filePath={studentLastYearMarksheet}
                        />
                        {/* <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setStudentLastYearMarksheet}
                          filePath={studentLastYearMarksheet}
                        /> */}
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid
                      container
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <label>{labels.attachmentDocument}</label>

                        <DocumentsUpload
                          error={!!errors?.attachmentDocument1}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileDtl={watch("attachmentDocument1")}
                          fileKey={"attachmentDocument1"}
                          // showDel={pageMode ? false : true}
                          showDel={true}
                          view={docView}
                          fileNameEncrypted={(path) => {
                            setEncrOtherDoc1(path);
                          }}
                        />

                        {/* <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setotherDoc1}
                          filePath={otherDoc1}
                        /> */}
                      </Grid>
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <label>{labels.attachmentDocument}</label>
                        <DocumentsUpload
                          error={!!errors?.attachmentDocument2}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileDtl={watch("attachmentDocument2")}
                          fileKey={"attachmentDocument2"}
                          // showDel={pageMode ? false : true}
                          showDel={true}
                          view={docView}
                          fileNameEncrypted={(path) => {
                            setEncrOtherDoc2(path);
                          }}
                        />

                        {/* <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setotherDoc2}
                          filePath={otherDoc2}
                        /> */}
                      </Grid>
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <label>{labels.attachmentDocument}</label>

                        <DocumentsUpload
                          error={!!errors?.attachmentDocument3}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileDtl={watch("attachmentDocument3")}
                          fileKey={"attachmentDocument3"}
                          // showDel={pageMode ? false : true}
                          showDel={true}
                          view={docView}
                          fileNameEncrypted={(path) => {
                            setEncrOtherDoc3(path);
                          }}
                        />

                        {/* <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setotherDoc3}
                          filePath={otherDoc3}
                        /> */}
                      </Grid>
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <label>{labels.attachmentDocument}</label>
                        <DocumentsUpload
                          error={!!errors?.attachmentDocument4}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileDtl={watch("attachmentDocument4")}
                          fileKey={"attachmentDocument4"}
                          // showDel={pageMode ? false : true}
                          showDel={true}
                          view={docView}
                          fileNameEncrypted={(path) => {
                            setEncrOtherDoc4(path);
                          }}
                        />

                        {/* <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setotherDoc4}
                          filePath={otherDoc4}
                        /> */}
                      </Grid>
                    </Grid>

                    {/* Buttons */}
                    <Divider />
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Controller
                        control={control}
                        name="dateOfOrder"
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disabled={readonlyFields}
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  required
                                  variant="standard"
                                  fullWidth
                                  sx={{ width: 230 }}
                                  size="small"
                                  error={errors.dateOfOrder}
                                  helperText={
                                    errors.dateOfOrder
                                      ? errors.dateOfOrder.message
                                      : null
                                  }
                                />
                              )}
                              label={labels.date}
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                )
                              }
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        required
                        id="standard-basic"
                        variant="standard"
                        label={labels.nameofPrderIssuancePerson}
                        {...register("nameofPrderIssuancePerson")}
                        error={!!errors.nameofPrderIssuancePerson}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                        }}
                        // helperText={
                        //   // errors?.studentName ? errors.studentName.message : null
                        //  }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        required
                        id="standard-basic"
                        variant="standard"
                        label={labels.designationOfOrderIssuancePerson}
                        {...register("designationOfOrderIssuancePerson")}
                        error={!!errors.designationOfOrderIssuancePerson}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                        }}
                        // helperText={
                        //   // errors?.studentName ? errors.studentName.message : null
                        //  }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        required
                        id="standard-basic"
                        variant="standard"
                        label={labels.remark}
                        {...register("remark")}
                        error={!!errors.remark}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                        }}
                        // helperText={
                        //   // errors?.studentName ? errors.studentName.message : null
                        //  }
                      />
                    </Grid>

                    <Grid
                      container
                      spacing={5}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "10px",
                        marginTop: "20px",
                      }}
                    >
                      <Grid item>
                        <Button
                          sx={{ marginRight: 8 }}
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          {labels.submit}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          sx={{ marginRight: 8 }}
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => {
                            cancellButton();
                            // setSlideChecked(false);
                          }}
                        >
                          {labels.clear}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => {
                            exitButton();
                            setSlideChecked(false);
                          }}
                        >
                          {labels.exit}
                        </Button>
                      </Grid>
                    </Grid>

                    <Divider />
                  </Grid>
                </Slide>
              </form>
            </FormProvider>
          </Box>
        </Box>

        <Box>
          {loading ? (
            <Loader />
          ) : (
            <>
              {showTable && (
                <DataGrid
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
                  headerName="Water"
                  getRowId={(row) => row.srNo}
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
                  // rows={studentList}
                  // columns={columns}
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
                    getUpdatedData(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getUpdatedData(_data, data.page);
                  }}
                />
              )}
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Index;

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
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(updateStudentForm),
    mode: "onChange",
  });

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
  const userToken = useGetToken();
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
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getMedium = () => {
    axios
      .get(`${urls.SCHOOL}/mstSchool/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ww", r.data.mstSchoolList);
        let schools = r.data.mstSchoolList;
        const foundObject = schools.find((obj) => obj.id === schoolId);
        // console.log("hhh",foundObject.schoolMedium);
        let schoolMedArray = foundObject?.schoolMedium?.split(",");
        setMedium(schoolMedArray);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  console.log("Medium", medium);
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
      .catch((error) => {
        callCatchMethod(error, language);
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
        .catch((error) => {
          callCatchMethod(error, language);
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
        .catch((error) => {
          callCatchMethod(error, language);
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
      .catch((error) => {
        callCatchMethod(error, language);
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
      .catch((error) => {
        callCatchMethod(error, language);
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
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    // getStudentAdmissionMaster();
  }, [fetchData]);

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
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  useEffect(() => {
    getSubCastNames();
  }, [watch("casteKey")]);

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
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  // console.log("rrrra",BirthState)
  //relation field start

  //search by name & GR number
  const getSingleUpdatedForm = (id) => {
    console.log("id", router.query.id);
    axios
      .get(
        `${urls.SCHOOL}/trnUpdateStudentDetailsController/getById?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        // console.log("urll", r.data.attachmentDocument1);
        setStudentData(r.data);
        reset(r.data);
        setValue(
          "relationWithAccountantHolder",
          r?.data?.relationWithAccountantHolder
        );
        sethandicapchecked(r.data?.isPhysicallyChallenged);
        setChecked(r.data?.isLastSchoolIsApplicable);
        setstudentDisabilityCertificate(
          r.data?.physicallyChallengedCertficateDocument
        );
        setStudentBirthCertificate(r.data?.birthCertificateDocument);
        setStudentLeavingCertificate(r.data?.leavingCertificateDocuemnt);
        setStudentPhotograph(r.data?.photograph);
        setStudentAadharCard(r.data?.aadharCardDocument);
        setParentAadharCard(r.data?.parentAadharCardDocument);
        setStudentLastYearMarksheet(r.data?.lastYearMarkSheetDocument);
        console.log("hnd", r.data?.isLastSchoolIsApplicable);
        setotherDoc1(r.data?.attachmentDocument1);
        setotherDoc2(r.data?.attachmentDocument2);
        setotherDoc3(r.data?.attachmentDocument3);
        setotherDoc4(r.data?.attachmentDocument4);
        // setValue("test", 3);/
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  useEffect(() => {
    console.log("aala123", watch("relationWithAccountantHolder"));
  }, [watch("relationWithAccountantHolder")]);

  useEffect(() => {
    if (router.query.id) {
      getSingleUpdatedForm(router.query.id);
      setDocView(router.query.docView);
    }

    console.log("router.query.id", router.query.id);
  }, [router.query.id]);

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
    console.log("111", paramData?.attachmentDocument1);
    setStudentBirthCertificate(paramData?.studentBirthCertificate),
      setstudentDisabilityCertificate(paramData?.studentDisabilityCertificate),
      setStudentLeavingCertificate(paramData?.studentLeavingCerrtificate),
      setStudentPhotograph(paramData?.studentPhotograph),
      setStudentAadharCard(paramData?.studentAadharCard),
      setParentAadharCard(paramData?.parentAadharCard),
      setStudentLastYearMarksheet(paramData?.studentLastYearMarksheet);
    setotherDoc1(paramData?.attachmentDocument1);
    setotherDoc2(paramData?.attachmentDocument2);
    setotherDoc3(paramData?.attachmentDocument3);
    setotherDoc4(paramData?.attachmentDocument4);
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

  //   const getUpdatedData = async ( _pageSize = 10,
  //     _pageNo = 0,
  //     _sortBy = "id",
  //     _sortDir = "desc") => {
  //     await axios.get(`${urls.SCHOOL}/trnUpdateStudentDetailsController/getAllUserId?userId=${user?.id}`,
  //     {
  //       params: {
  //         pageSize: _pageSize,
  //         pageNo: _pageNo,
  //         sortBy: _sortBy,
  //         sortDir: _sortDir,
  //       },
  // headers: {
  //   Authorization: `Bearer ${userToken}`,
  // },
  //     })
  //     .then((r) => {
  //       let result = r?.data.trnUpdateStudentDetailsDao;
  //       console.log("nnnn", result);
  //       let page = r?.data?.pageSize * r?.data?.pageNo;

  //       let _res = result.map((r, i) => {
  //         return {
  //           activeFlag: r.activeFlag,
  //           id: r.id,
  //           srNo: i + 1 + page,
  //           grNumber:r.grNumber,
  //           remark:r.remark,
  //           studentName: `${r.firstName} ${r.middleName} ${r.lastName}`,
  //             studentNameMr: `${r.firstNameMr} ${r.middleNameMr} ${r.lastNameMr}`,
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
  //   };
  // useEffect(()=>{
  //   getUpdatedData()
  // },[])

  // const columns = [
  //   {
  //     field: "srNo",
  //     headerName: labels.srNo,
  //     flex: 1,
  //   },
  //   {
  //     field: "grNumber",
  //     headerName: labels.studentGRnumber,
  //     // flex: 1,
  //     width: 200,
  //   },

  //   {
  //     field: language == "en" ? "studentName" : "studentNameMr",
  //     headerName: labels.studentName,
  //     flex: 1,
  //     // width: 150,
  //   },
  //   {
  //     field: "remark",
  //     headerName: labels.remark,
  //     flex: 1,
  //     // width: 150,
  //   },

  //   {
  //     field: "Actions",
  //     headerName: labels.actions,
  //     width: 220,
  //     sortable: false,
  //     disableColumnMenu: true,
  //     renderCell: (params) => {
  //       let status = params.row.applicationStatus;
  //       let paramData = params.row;
  //       console.log("params.row", params.row)
  //       return (
  //         <Box>

  //                 <IconButton>
  //                    <Button
  //                   variant="contained"
  //                   color="primary"
  //                   size="small"
  //                   startIcon={<EyeFilled />}
  //                   onClick={() => {
  //                     console.log("params.row", params.row.id);
  //                   }}
  //                 >
  //                   {labels.view}
  //                 </Button>
  //                 </IconButton>

  //         </Box>
  //       );
  //     },
  //   },
  // ];

  // view
  return (
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
          <FormProvider {...methods}>
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
                <FormControl sx={{ width: 230 }} disabled>
                  <InputLabel error={!!errors.zoneKey}>
                    {labels.zoneName}
                  </InputLabel>
                  <Controller
                    // disabled
                    control={control}
                    name="zoneKey"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        // disabled
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
                <FormControl sx={{ width: 230 }} disabled>
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
                        // readOnly
                        // disabled
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
                <FormControl sx={{ width: 230 }} disabled>
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
                        // readOnly
                        // disabled
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
                <FormControl sx={{ width: 230 }} disabled>
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
                        // readOnly
                        // disabled
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
                <FormControl sx={{ width: 230 }} disabled>
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
                        // readOnly
                        // disabled
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
                <FormControl sx={{ width: 230 }} disabled>
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
                        // readOnly
                        // disabled
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
                    {errors?.divisionKey ? errors.divisionKey.message : null}
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
                <FormControl sx={{ width: 230 }} disabled>
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
                        // readOnly
                        // disabled
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
                    {errors?.schoolMedium ? errors.schoolMedium.message : null}
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
                <TextField
                  disabled
                  id="standard-basic"
                  variant="standard"
                  label={labels.studentFirstName}
                  {...register("firstName")}
                  // name="firstName"
                  // value={watch("firstName")}
                  error={!!errors.firstName}
                  sx={{ width: 230 }}
                  // disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("firstName") ? true : false,
                  }}
                  helperText={
                    errors?.firstName ? errors.firstName.message : null
                  }
                />
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
                <TextField
                  disabled
                  id="standard-basic"
                  variant="standard"
                  value={watch("middleName")}
                  label={labels.studentMiddleName}
                  {...register("middleName")}
                  error={!!errors.middleName}
                  sx={{ width: 230 }}
                  // disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("middleName") ? true : false,
                  }}
                  helperText={
                    errors?.middleName ? errors.middleName.message : null
                  }
                />
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
                <TextField
                  disabled
                  id="standard-basic"
                  variant="standard"
                  label={labels.studentLastName}
                  {...register("lastName")}
                  // value={watch("lastName")}
                  error={!!errors.lastName}
                  sx={{ width: 230 }}
                  // disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("lastName") ? true : false,
                  }}
                  helperText={errors?.lastName ? errors.lastName.message : null}
                />
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
                <TextField
                  id="standard-basic"
                  variant="standard"
                  label={labels.studentFirstNameMr}
                  // {...register("firstNameMr")}
                  value={watch("firstNameMr")}
                  error={!!errors.firstNameMr}
                  sx={{ width: 230 }}
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("firstNameMr") ? true : false,
                  }}
                  helperText={
                    errors?.firstNameMr ? errors.firstNameMr.message : null
                  }
                />
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
                <TextField
                  id="standard-basic"
                  variant="standard"
                  label={labels.studentMiddleNameMr}
                  // {...register("middleNameMr")}
                  value={watch("middleNameMr")}
                  error={!!errors.middleNameMr}
                  sx={{ width: 230 }}
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("middleNameMr") ? true : false,
                  }}
                  helperText={
                    errors?.middleNameMr ? errors.middleNameMr.message : null
                  }
                />
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
                <TextField
                  id="standard-basic"
                  variant="standard"
                  label={labels.studentLastNameMr}
                  // {...register("lastNameMr")}
                  value={watch("lastNameMr")}
                  error={!!errors.lastNameMr}
                  sx={{ width: 230 }}
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("lastNameMr") ? true : false,
                  }}
                  helperText={
                    errors?.lastNameMr ? errors.lastNameMr.message : null
                  }
                />
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
                  // {...register("fatherFirstName")}
                  value={watch("fatherFirstName")}
                  error={!!errors.fatherFirstName}
                  sx={{ width: 230 }}
                  disabled
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
                  // {...register("fatherMiddleName")}
                  value={watch("fatherMiddleName")}
                  error={!!errors.fatherMiddleName}
                  sx={{ width: 230 }}
                  disabled
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
                  // {...register("fatherLastName")}
                  value={watch("fatherLastName")}
                  error={!!errors.fatherLastName}
                  sx={{ width: 230 }}
                  disabled
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
                  // {...register("motherName")}
                  value={watch("motherName")}
                  error={!!errors.motherName}
                  sx={{ width: 230 }}
                  disabled
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
                  // {...register("motherMiddleName")}
                  value={watch("motherMiddleName")}
                  error={!!errors.motherMiddleName}
                  sx={{ width: 230 }}
                  disabled
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
                  // {...register("motherLastName")}
                  value={watch("motherLastName")}
                  error={!!errors.motherLastName}
                  sx={{ width: 230 }}
                  disabled
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
                  // {...register("motherNameMr")}
                  value={watch("motherNameMr")}
                  error={!!errors.motherNameMr}
                  sx={{ width: 230 }}
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("motherNameMr") ? true : false,
                  }}
                  helperText={
                    errors?.motherNameMr ? errors.motherNameMr.message : null
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
                <FormControl disabled>
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
                  // {...register("contactDetails")}
                  value={watch("contactDetails")}
                  error={!!errors.contactDetails}
                  sx={{ width: 230 }}
                  // type="number"
                  disabled
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
                  // {...register("studentEmailId")}
                  value={watch("studentEmailId")}
                  error={!!errors.studentEmailId}
                  sx={{ width: 230 }}
                  disabled
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
                  // {...register("aadharNumber")}
                  value={watch("aadharNumber")}
                  error={!!errors.aadharNumber}
                  sx={{ width: 230 }}
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("aadharNumber") ? true : false,
                  }}
                  helperText={
                    errors?.aadharNumber ? errors.aadharNumber.message : null
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
                  <h2 style={{ marginBottom: 0 }}>{labels.studentOthInfo}</h2>
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
                    disabled
                    control={control}
                    name="religionKey"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        // readOnly
                        disabled
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
                    {errors?.religionKey ? errors.religionKey.message : null}
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
                    disabled
                    control={control}
                    name="casteKey"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        // readOnly
                        disabled
                        variant="standard"
                        {...field}
                        error={!!errors.casteKey}
                      >
                        {castNames &&
                          castNames.map((cast, index) => (
                            <MenuItem key={index} value={cast.id}>
                              {language == "en" ? cast?.cast : cast?.castMr}
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
                    disabled
                    control={control}
                    name="subCastKey"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        // readOnly
                        disabled
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
                    {errors?.subCastKey ? errors.subCastKey.message : null}
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
                    disabled
                    control={control}
                    name="citizenshipName"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        // readOnly
                        disabled
                        variant="standard"
                        {...field}
                        error={!!errors.citizenshipName}
                      >
                        {citizenshipList &&
                          citizenshipList.map((citizen) => (
                            <MenuItem key={citizen.id} value={citizen.citizen}>
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
                    disabled
                    control={control}
                    name="motherTongueName"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        // readOnly
                        disabled
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
                  // {...register("birthPlace")}
                  value={watch("birthPlace")}
                  error={!!errors.birthPlace}
                  sx={{ width: 230 }}
                  disabled
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
                  // {...register("birthPlacemr")}
                  value={watch("birthPlacemr")}
                  error={!!errors.birthPlacemr}
                  sx={{ width: 230 }}
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("birthPlacemr") ? true : false,
                  }}
                  helperText={
                    errors?.birthPlacemr ? errors.birthPlacemr.message : null
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
                  disabled
                  name="dateOfBirth"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled
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
                          field.onChange(moment(date).format("DD-MM-YYYY"))
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
                  // {...register("studentAge")}
                  value={watch("studentAge")}
                  error={!!errors.studentAge}
                  sx={{ width: 230 }}
                  disabled
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
                        // readOnly
                        disabled
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
                  // {...register("districtName")}
                  value={watch("districtName")}
                  error={!!errors.districtName}
                  sx={{ width: 230 }}
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("districtName") ? true : false,
                  }}
                  helperText={
                    errors?.districtName ? errors.districtName.message : null
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
                  // {...register("familyPermanentAddress")}
                  value={watch("familyPermanentAddress")}
                  error={!!errors.familyPermanentAddress}
                  sx={{ width: 230 }}
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("familyPermanentAddress") ? true : false,
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
                  // {...register("parentFullName")}
                  value={watch("parentFullName")}
                  error={!!errors.parentFullName}
                  sx={{ width: 230 }}
                  disabled
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
                  // {...register("parentEmailId")}
                  value={watch("parentEmailId")}
                  error={!!errors.parentEmailId}
                  sx={{ width: 230 }}
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("parentEmailId") ? true : false,
                  }}
                  helperText={
                    errors?.parentEmailId ? errors.parentEmailId.message : null
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
                  // {...register("parentAddress")}
                  value={watch("parentAddress")}
                  error={!!errors.parentAddress}
                  sx={{ width: 230 }}
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("parentAddress") ? true : false,
                  }}
                  helperText={
                    errors?.parentAddress ? errors.parentAddress.message : null
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
                  disabled
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
                  disabled
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
                  disabled
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
                  disabled
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
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("fatherIncome") ? true : false,
                  }}
                  helperText={
                    errors?.fatherIncome ? errors.fatherIncome.message : null
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
                  disabled
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
                  disabled
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
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("motherIncome") ? true : false,
                  }}
                  helperText={
                    errors?.motherIncome ? errors.motherIncome.message : null
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
                  disabled
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
                  disabled
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
                  disabled
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
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("parentPincode") ? true : false,
                  }}
                  helperText={
                    errors?.parentPincode ? errors.parentPincode.message : null
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
                disabled={true}
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
                      disabled
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
                      disabled
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
                      disabled
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
                            disabled
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
                                    ? errors.lastSchoolAdmissionDate.message
                                    : null
                                }
                              />
                            )}
                            label={labels.lastSchoolAdmissionDate}
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
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
                      disabled
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
                            disabled
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
                              field.onChange(moment(date).format("YYYY-MM-DD"))
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
                      disabled
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
                      disabled
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
                      disabled
                      InputProps={{
                        style: { fontSize: 18 },
                        // readOnly: readonlyFields
                      }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        shrink: watch("reasonForLeavingSchool") ? true : false,
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
                      disabled
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
                disabled={true}
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
                            // readOnly
                            disabled
                            variant="standard"
                            {...field}
                            error={!!errors.typeOfDisability}
                          >
                            {typesOfDis &&
                              typesOfDis.map((typeOfDisability, index) => (
                                <MenuItem
                                  key={index}
                                  value={typeOfDisability.id}
                                >
                                  {language == "en"
                                    ? typeOfDisability?.typeOfDisability
                                    : typeOfDisability?.typeOfDisabilityMr}
                                </MenuItem>
                              ))}
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
                      disabled
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
                        <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setstudentDisabilityCertificate}
                          filePath={studentDisabilityCertificate}
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
                  <h2 style={{ marginBottom: 0 }}>{labels.accountDetails}</h2>
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
                  disabled
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
                  disabled
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
                  disabled
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
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("bankName") ? true : false,
                  }}
                  helperText={errors?.bankName ? errors.bankName.message : null}
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
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("ifscCode") ? true : false,
                  }}
                  helperText={errors?.ifscCode ? errors.ifscCode.message : null}
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
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("bankAdderess") ? true : false,
                  }}
                  helperText={
                    errors?.bankAdderess ? errors.bankAdderess.message : null
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
                              // readOnly
                              disabled
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
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
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
                        disabled
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
                    disabled
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
              {/* Birth Certi */}
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
                <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                  <label>
                    {labels.studentBirthCertificate}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    view={docView}
                    appName="TP"
                    serviceName="PARTMAP"
                    fileUpdater={setStudentBirthCertificate}
                    filePath={studentBirthCertificate}
                  />
                </Grid>
              </Grid>
              {/* Leaving Certificate */}
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
                <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                  <label>{labels.studentSchoolLeavingCertificate}</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    view={docView}
                    appName="TP"
                    serviceName="PARTMAP"
                    fileUpdater={setStudentLeavingCertificate}
                    filePath={studentLeavingCerrtificate}
                  />
                </Grid>
              </Grid>
              {/* Student Photograph */}
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
                <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                  <label>
                    {labels.studentPhotograph}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    view={docView}
                    appName="TP"
                    serviceName="PARTMAP"
                    fileUpdater={setStudentPhotograph}
                    filePath={studentPhotograph}
                  />
                </Grid>
              </Grid>
              {/* Student AAdhar Card */}
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
                <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                  <label>
                    {labels.studentAadhar}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    view={docView}
                    appName="TP"
                    serviceName="PARTMAP"
                    fileUpdater={setStudentAadharCard}
                    filePath={studentAadharCard}
                  />
                </Grid>
              </Grid>
              {/* Parent Aadhar Card*/}
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
                <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                  <label>
                    {labels.parentAadhar}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    view={docView}
                    appName="TP"
                    serviceName="PARTMAP"
                    fileUpdater={setParentAadharCard}
                    filePath={parentAadharCard}
                  />
                </Grid>
              </Grid>
              {/* Student Last Year Marksheet*/}
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
                <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                  <label>{labels.studentLastYearMarksheet}</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    view={docView}
                    appName="TP"
                    serviceName="PARTMAP"
                    fileUpdater={setStudentLastYearMarksheet}
                    filePath={studentLastYearMarksheet}
                  />
                </Grid>
              </Grid>
              <Divider />
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
                <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                  <label>{labels.attachmentDocument}</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    view={docView}
                    appName="TP"
                    serviceName="PARTMAP"
                    fileUpdater={setotherDoc1}
                    filePath={otherDoc1}
                  />
                </Grid>
              </Grid>
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
                <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                  <label>{labels.attachmentDocument}</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    view={docView}
                    appName="TP"
                    serviceName="PARTMAP"
                    fileUpdater={setotherDoc2}
                    filePath={otherDoc2}
                  />
                </Grid>
              </Grid>
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
                <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                  <label>{labels.attachmentDocument}</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    view={docView}
                    appName="TP"
                    serviceName="PARTMAP"
                    fileUpdater={setotherDoc3}
                    filePath={otherDoc3}
                  />
                </Grid>
              </Grid>
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
                <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                  <label>{labels.attachmentDocument}</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    view={docView}
                    appName="TP"
                    serviceName="PARTMAP"
                    fileUpdater={setotherDoc4}
                    filePath={otherDoc4}
                  />
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
                        disabled
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
                          field.onChange(moment(date).format("YYYY-MM-DD"))
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
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("nameofPrderIssuancePerson") ? true : false,
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
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("designationOfOrderIssuancePerson")
                      ? true
                      : false,
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
                  disabled
                  InputProps={{
                    style: { fontSize: 18 },
                    // readOnly: readonlyFields
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    shrink: watch("remark") ? true : false,
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
                    variant="contained"
                    color="primary"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => {
                      router.push({
                        pathname: `/school/transaction/updateStudentInfo`,
                      });
                    }}
                  >
                    {labels.exit}
                  </Button>
                </Grid>
              </Grid>
              <Divider />
            </Grid>
          </FormProvider>
        </Box>
      </Box>
    </Paper>
  );
};

export default Index;

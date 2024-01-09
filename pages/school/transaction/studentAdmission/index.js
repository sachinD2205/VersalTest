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
import studentAdmissionSchema from "../../../../containers/schema/school/transactions/studentAdmissionSchema";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import UploadButton from "../fileUpload/UploadButton";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import Loader from "../../../../containers/Layout/components/Loader";
// import UploadButtonLCMS from '../../../../../components/marriageRegistration/DocumentUploadLms'
import DocumentsUpload from "../../../../components/school/documentsUploadVishal";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = (props) => {
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
  //   resolver: yupResolver(studentAdmissionSchema),
  //   mode: "onChange",
  // });

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(studentAdmissionSchema),
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
  // ---------------------------------------------------------------------------------
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
  useEffect(() => {
    console.log(
      "encrptBirthCertificateDocument",
      encrptBirthCertificateDocument
    );
  }, [encrptBirthCertificateDocument]);
  console.log("authority", authority);
  // ---------------------------------------------------------------------------------

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

  const userToken = useGetToken();
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

  // useEffect(() => {
  //   setValue("studentBirthCertificate", studentBirthCertificate);
  //   setValue("studentPhotograph", studentPhotograph);
  //   setValue("studentAadharCard", studentAadharCard);
  //   setValue("parentAadharCard", parentAadharCard);
  //   // console.log("setValuestudentBirthCertificate", studentBirthCertificate);
  //   // console.log("setValuestudentPhotograph", studentPhotograph);
  // }, [
  //   studentBirthCertificate,
  //   studentPhotograph,
  //   studentAadharCard,
  //   parentAadharCard,
  // ]);

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
            r?.data?.mstClassList?.map((row) => ({
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
      .catch((e) => {
        callCatchMethod(e, language);
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
        .catch((e) => {
          callCatchMethod(e, language);
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
    // setValue("studentDateOfBirth", params?.row?.studentDateOfBirth),
    //   setValue("studentBirthCertificate", params?.row?.studentBirthCertificate),
    //   setValue("studentDisabilityCertificate", params?.row?.studentDisabilityCertificate),
    //   setValue("studentLeavingCerrtificate", params?.row?.studentLeavingCerrtificate),
    //   setValue("studentPhotograph", params?.row?.studentPhotograph),
    //   setValue("studentAadharCard", params?.row?.studentAadharCard),
    //   setValue("parentAadharCard", params?.row?.parentAadharCard),
    //   setValue("studentLastYearMarksheet", params?.row?.studentLastYearMarksheet)
    // console.log("111", paramData?.physicallyChallengedCertficateDocument);
    // setStudentBirthCertificate(paramData?.studentBirthCertificate),
    // setstudentDisabilityCertificate(paramData?.studentDisabilityCertificate),
    // setStudentLeavingCertificate(paramData?.studentLeavingCerrtificate),
    // setStudentPhotograph(paramData?.studentPhotograph),
    // setStudentAadharCard(paramData?.studentAadharCard),
    // setParentAadharCard(paramData?.parentAadharCard),
    // setStudentLastYearMarksheet(paramData?.studentLastYearMarksheet);
  };
  // Get Table - Data
  const getStudentAdmissionMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(
        `${urls.SCHOOL}/trnStudentAdmissionForm/getAllUserId?userId=${user?.id}`,
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
        let result = r?.data?.trnStudentAdmissionFormList;
        console.log("trnStudentAdmissionFormList", r.data);
        let page = r?.data?.pageSize * r?.data?.pageNo;

        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + page,
            zoneKey: r.zoneKey,
            wardKey: r.wardKey,
            zoneName: r.zoneName,
            wardKey: r.wardKey,
            studentFirstName: r.studentFirstName,
            studentMiddleName: r.studentMiddleName,
            studentLastName: r.studentLastName,
            firstNameMr: r.firstNameMr,
            middleNameMr: r.middleNameMr,
            lastNameMr: r.lastNameMr,
            fatherFirstName: r.fatherFirstName,
            fatherMiddleName: r.fatherMiddleName,
            fatherLastName: r.fatherLastName,
            motherName: r.motherName,
            motherNameMr: r.motherNameMr,
            motherMiddleName: r.motherMiddleName,
            motherLastName: r.motherLastName,
            studentGender: r.studentGender,
            studentContactDetails: r.studentContactDetails,
            studentAadharNumber: r.studentAadharNumber,
            religionKey: r.religionKey,
            studentBirthPlace: r.studentBirthPlace,
            // studentDateOfBirth: moment(r.studentDateOfBirth).format('DD-MM-YYYY'),
            studentDateOfBirth: r.studentDateOfBirth,
            // studentDateOfBirth: DOB,
            familyPermanentAddress: r.familyPermanentAddress,
            parentFullName: r.parentFullName,
            parentEmailId: r.parentEmailId,
            parentAddress: r.parentAddress,
            fatherQualification: r.fatherQualification,
            fatherOccupation: r.fatherOccupation,
            fatherIncome: r.fatherIncome,
            motherQualification: r.motherQualification,
            motherOccupation: r.motherOccupation,
            motherIncome: r.motherIncome,
            fatherContactNumber: r.fatherContactNumber,
            motherContactNumber: r.motherContactNumber,
            colonyName: r.colonyName,
            parentPincode: r.parentPincode,
            saralId: r.saralId,
            isLastSchoolIsApplicable: r.isLastSchoolIsApplicable,
            isPhysicallyChallenged: r.isPhysicallyChallenged,
            lastSchoolName: r.lastSchoolName,
            lastSchoolAdmissionDate: r.lastSchoolAdmissionDate,
            lastClassAndFromWhenStudying: r.lastClassAndFromWhenStudying,
            lastSchoolLeavingDate: r.lastSchoolLeavingDate,
            studentBehaviour: r.studentBehaviour,
            reasonForLeavingSchool: r.reasonForLeavingSchool,
            casteName: r.casteName,
            casteKey: r.casteKey,
            subCastKey: r.subCastKey,
            subCastMr: subCastNames?.find((i) => i?.id == r.subCastKey)
              ?.subCastMr,
            subCast: subCastNames?.find((i) => i?.id == r.subCastKey)?.subCast,
            citizenshipName: r.citizenshipName,
            motherTongueName: r.motherTongueName,
            districtName: r.districtName,
            stateName: r.stateName,
            parentDistrictName: r.parentDistrictName,
            parentStateName: r.parentStateName,
            schoolName: r.schoolName,
            schoolNameMr: r.schoolNameMr,
            schoolKey: r.schoolKey,
            studentName: `${r.studentFirstName} ${r.studentMiddleName} ${r.studentLastName}`,
            studentNameMr: `${r.firstNameMr} ${r.middleNameMr} ${r.lastNameMr}`,
            studentEmail: r.studentEmail,
            className: r.className,
            classKey: r.classKey,
            divisionKey: r.divisionKey,
            academicYearKey: r.academicYearKey,
            admissionRegitrationNo: r.admissionRegitrationNo
              ? r.admissionRegitrationNo
              : "-",

            // Ac Details
            accountNo: r.accountNo,
            confirmBankAcNumber: r.confirmBankAcNumber,
            accountHolderName: r.accountHolderName,
            bankName: r.bankName,
            ifscCode: r.ifscCode,
            bankAdderess: r.bankAdderess,

            principalRemarksEn: r.principalRemarksEn,
            principalRemarksMr: r.principalRemarksMr,

            applicationStatus: r.applicationStatus ? r.applicationStatus : "-",
            Status:
              r.applicationStatus == "REJECTED_BY_PRINCIPAL"
                ? "reject"
                : "approve",
            studentGeneralRegistrationNumber:
              r.studentGeneralRegistrationNumber,
            behaviourMr: r.behaviourMr,
            lastSchoolNameMr: r.lastSchoolNameMr,
            birthPlacemr: r.birthPlacemr,
            reasonForLeavingSchoolMr: r.reasonForLeavingSchoolMr,

            // documents
            // leavingCertificateDocuemnt: r.leavingCertificateDocuemnt,
            // studentAadharCard: r.studentAadharCardDocument,
            // parentAadharCard: r.parentAadharCardDocument,
            // studentLastYearMarksheet: r.studentLastYearMarkSheetDocument,
            // studentPhotograph: r.studentPhotograph,
            // studentBirthCertificate: r.studentBirthCertficateDocument,
            // studentDisabilityCertificate:
            //   r.physicallyChallengedCertficateDocument,

            //relation with account holder
            relationWithAccountantHolder: r.relationWithAccountantHolder,
            otherRelationWithAccountantHolder:
              r.otherRelationWithAccountantHolder,
            schoolMedium: r.schoolMedium,

            percentageOfDisability: r.percentageOfDisability,
            typeOfDisability: r.typeOfDisability,
            ...r,

            // divisionName: r.divisionName ? r.divisionName : `divisionKey ${r.divisionKey}`,
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
        callCatchMethod(e, language);
        // sweetAlert(
        //   "Error",
        //   e?.message ? e?.message : "Something Went Wrong",
        //   "error"
        // );
        console.log("Eroor", e);
      });
  };

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

  //relation field start
  // const relations = ["Self", "Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Gardian", "guardian", "other"]
  let relations = [
    { id: 1, val: "Self" },
    { id: 2, val: "Father" },
    { id: 3, val: "Mother" },
    { id: 4, val: "Brother" },
    { id: 5, val: "Sister" },
    { id: 6, val: "Uncle" },
    { id: 7, val: "Aunt" },
    { id: 8, val: "Gardian" },
    { id: 9, val: "other" },
  ];

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
  // useEffect(() => {
  //   console.log("handicapchecked_________________", handicapchecked, checked);
  // }, [handicapchecked, checked]);

  const onSubmitForm = (formData) => {
    console.log("formDataa", editData);
    // console.log(
    //   "DDDDDDDDDDDDDDDDDDD",
    //   watch("studentPhotograph"),
    //   "-------------->",
    //   formData?.studentPhotograph
    // );
    // Save - DB
    let _body = {
      ...formData,
      // studentDateOfBirth: moment(
      //   formData?.studentDateOfBirth,
      //   "DD-MM-YYYY"
      // ).format("YYYY-MM-DD"),
      subCastKey: Number(formData?.subCastKey),
      // activeFlag: formData.activeFlag,
      // studentDateOfBirth: studentDob,
      academicYearKey: academicYearId,
      lastSchoolAdmissionDate,
      lastSchoolLeavingDate,
      zoneKey,
      wardKey,
      religionKey,
      schoolKey: schoolId,
      // relationWithAccountantHolder:   watch("relationWithAccountantHolder"),
      // otherRelationWithAccountantHolder: watch("relationWithAccountantHolder")

      // get school name from schoolId via schoolList
      schoolName: schoolList?.find((item) => item?.id === schoolId)?.schoolName,
      schoolNameMr: schoolList?.find((item) => item?.id === schoolId)
        ?.schoolNameMr,
      // get academiYearName from academicYearId via academicYearList
      academicYearName: academicYearList?.find(
        (item) => item?.id === academicYearId
      )?.academicYear,
      // get className from classId via classList
      className: classList?.find((item) => item?.id === classId)?.className,
      // get zoneName from zoneKey via zoneKeys
      // get wardName from wardKey via wardKeys
      zoneName: zoneKeys?.find((item) => item?.id === zoneKey)?.zoneName,
      wardName: wardKeys?.find((item) => item?.id === wardKey)?.wardName,
      casteName: castNames?.find((item) => item?.id === casteId)?.cast,
      casteNameMr: castNames?.find((item) => item?.id === casteId)?.castMr,
      religion_Name: religions?.find((item) => item?.id === religionId)
        ?.religion,
      religionNameMr: religions?.find((item) => item?.id === religionId)
        ?.religionMr,
      isLastSchoolIsApplicable: checked,
      isPhysicallyChallenged: handicapchecked,
      classKey: classId,
      divisionKey: divisionId,

      physicallyChallengedCertficateDocument:
        encrptphysicallyChallengedCertficateDocument,
      birthCertificateDocument: encrptBirthCertificateDocument,
      leavingCertificateDocuemnt: encrptleavingCertificateDocuemnt,
      studentPhotograph: encrptstudentPhotograph,
      studentAadharCardDocument: encrptstudentAadharCardDocument,
      parentAadharCardDocument: encrptparentAadharCardDocument,
      studentLastYearMarkSheetDocument: encrptstudentLastYearMarkSheetDocument,

      // percentageOfDisability:
      // typeOfDisability:
    };
    console.log("update_body", _body);

    if (btnSaveText === "Save") {
      console.log("_body", _body);
      setLoading(true);
      const tempData = axios
        .post(`${urls.SCHOOL}/trnStudentAdmissionForm/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          console.log("res---", res);
          setLoading(false);
          if (res.status == 201 || res.status == 200) {
            sweetAlert({
              title: language === "en" ? "Saved !" : "जतन केले !",
              text:
                language === "en"
                  ? "Record Saved successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले !",
              icon: "success",
            });
            // sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            // docsReset();
            setChecked(false);
            sethandicapchecked(false);
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
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      // updateBody = {
      //   ..._body,
      //   // activeFlag:params.,
      //   id: formData.id
      // }
      setLoading(true);
      axios
        .post(`${urls.SCHOOL}/trnStudentAdmissionForm/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res.status == 201) {
            formData.id
              ? sweetAlert({
                  title: language === "en" ? "Updated !" : "अद्यतनित केले !",
                  text:
                    language === "en"
                      ? "Record Updated successfully !"
                      : "रेकॉर्ड अद्यतनित केले !",
                  icon: "success",
                })
              : sweetAlert({
                  title: language === "en" ? "Saved !" : "जतन केले !",
                  text:
                    language === "en"
                      ? "Record Saved successfully !"
                      : "रेकॉर्ड यशस्वीरित्या जतन केले !",
                  icon: "success",
                });
            getStudentAdmissionMaster();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
            // docsReset();
            setChecked(false);
            sethandicapchecked(false);
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
          console.log("Eroor", e);
        });
    }
    // StatusByPrincipal
    else if (btnSaveText === "StatusByPrincipal") {
      let _isApproved = watch("Status");
      console.log("_body", _body);
      let _res = {
        // ..._body,
        id,
        isApproved:
          _isApproved == "approve"
            ? true
            : _isApproved == "reject"
            ? false
            : "",
        principalRemarksEn: _body.principalRemarksEn,
        principalRemarksMr: _body.principalRemarksMr,
        mstStudentDao: {},
      };
      console.log("_isApproved", _isApproved);
      console.log("_res", _res);
      setLoading(true);
      axios
        .post(`${urls.SCHOOL}/trnStudentAdmissionForm/updateStatus`, _res, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res.status == 201) {
            _isApproved == "approve"
              ? sweetAlert({
                  title: language === "en" ? "Approved ! " : "मंजूर !",
                  text:
                    language === "en"
                      ? "Application Approved successfully !"
                      : "अर्ज यशस्वीरित्या मंजूर झाला !",
                  icon: "success",
                })
              : sweetAlert({
                  title: language === "en" ? "Rejected ! " : "नाकारले !",
                  text:
                    language === "en"
                      ? "Application Sent Back to the Clerk successfully !"
                      : "अर्ज यशस्वीरित्या लिपिकाकडे परत पाठवला! !",
                  icon: "success",
                });
            // ? sweetAlert(
            //     "Approved!",
            //     "Application Approved successfully !",
            //     "success"
            //   )
            // : sweetAlert(
            //     "Rejected!",
            //     "Application Sent to the Clerk successfully !",
            //     "success"
            //   );
            getStudentAdmissionMaster();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
            setChecked(false);
            sethandicapchecked(false);
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
          console.log("Eroor", e);
        });
    }
  };

  useEffect(() => {
    getStudentAdmissionMaster();
  }, [fetchData]);

  useEffect(() => {
    // console.log("GGGGGGGGGGGGG", checked)
    setValue("isLastSchoolIsApplicable", checked);
  }, [checked]);

  useEffect(() => {
    setValue("isLastSchoolIsApplicable", checked);
    console.log(
      "OOOOOOOOOOOOOOOOOO",
      watch("isLastSchoolIsApplicable"),
      checked
    );
  }, [watch("isLastSchoolIsApplicable")]);

  // console.log("1111",checked);

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: language === "en" ? "Inactivate ?" : "निष्क्रिय करायचे ?",
        text:
          language === "en"
            ? "Are you sure you want to Inactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता ?",
        icon: "warning",
        buttons: {
          ok: language === "en" ? "Ok" : "ठीक आहे",
          cancel: language === "en" ? "Cancel" : "रद्द करा",
        },
        dangerMode: true,
        closeOnClickOutside: false,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === "ok") {
          setLoading(true);
          axios
            .post(`${urls.SCHOOL}/trnStudentAdmissionForm/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log("delet res", res);
              if (res.status == 201 || res.status == 200) {
                sweetAlert({
                  title: language === "en" ? "Deleted ! " : "हटवले !",
                  text:
                    language === "en"
                      ? "Record is Successfully Deleted !"
                      : "रेकॉर्ड यशस्वीरित्या हटवले आहे !",
                  icon: "success",
                });
                // swal("Record is Successfully Deleted!", {
                //   icon: "success",
                // });
                getStudentAdmissionMaster();
                setButtonInputState(false);
                // setButtonInputState(false);
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
        } else if (willDelete == null) {
          // swal("Record is Safe");
          sweetAlert({
            text: language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
          });
        }
      });
    } else {
      swal({
        title: language === "en" ? "Activate ?" : "सक्रिय करायचे?",
        text:
          language === "en"
            ? "Are you sure you want to activate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता ?",
        icon: "warning",
        buttons: {
          ok: language === "en" ? "Ok" : "ठीक आहे",
          cancel: language === "en" ? "Cancel" : "रद्द करा",
        },
        dangerMode: true,
        closeOnClickOutside: false,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === "ok") {
          setLoading(true);
          axios
            .post(`${urls.SCHOOL}/-trnStudentAdmissionForm/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log("delet res", res);
              if (res.status == 201 || res.status == 200) {
                // swal("Record is Successfully Deleted!", {
                //   icon: "success",
                // });
                sweetAlert({
                  title: language === "en" ? "Deleted ! " : "हटवले !",
                  text:
                    language === "en"
                      ? "Record is Successfully Activated !"
                      : "रेकॉर्ड यशस्वीरित्या सक्रिय आहे !",
                  icon: "success",
                });
                // getPaymentRate();
                getStudentAdmissionMaster();
                setButtonInputState(false);
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
              console.log("Eroor", e);
            });
        } else if (willDelete == null) {
          // swal("Record is Safe");
          sweetAlert({
            text: language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
          });
        }
      });
    }
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
    setChecked(false);
    sethandicapchecked(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    docsReset();
    setChecked(false);
    sethandicapchecked(false);
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
    studentFirstName: "",
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
    studentFirstName: "",
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

  const columns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      flex: 1,
    },
    {
      field: "admissionRegitrationNo",
      headerName: labels.admissionRegitrationNo,
      // flex: 1,
      width: 200,
    },
    {
      field: language == "en" ? "schoolName" : "schoolNameMr",
      headerName: labels.schoolName,
      // flex: 1,
      width: 200,
    },
    {
      field: "className",
      headerName: labels.className,
      // flex: 1,
      width: 100,
    },
    {
      field: language == "en" ? "studentName" : "studentNameMr",
      headerName: labels.studentName,
      // flex: 1,
      width: 150,
    },
    {
      field: "studentContactDetails",
      headerName: labels.mobileNumber,
      // flex: 1,
      width: 150,
    },
    {
      field: "studentEmail",
      headerName: labels.emailId,
      // flex: 1,
      width: 150,
    },
    {
      field: "studentGeneralRegistrationNumber",
      headerName: labels.studentGRnumber,
      // flex: 1,
      width: 200,
    },
    {
      field: "applicationStatus",
      headerName: labels.applicationStatus,
      // headerName: labels.emailID,
      width: 200,
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
            {/* Edit and delete accessable only clerk & admin*/}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("ENTRY")) &&
              status == "APPLICATION_CREATED" && (
                <>
                  {/* Edit */}
                  <IconButton
                    disabled={editButtonInputState}
                    onClick={() => {
                      console.log("params.row", params.row);
                      setBtnSaveText("Update");
                      // getDocuments(paramData);
                      // setStudentBirthCertificate(params.row)
                      setID(params.row.id);
                      setChecked(params?.row?.isLastSchoolIsApplicable);
                      sethandicapchecked(params?.row?.isPhysicallyChallenged);
                      setIsOpenCollapse(true);
                      setShowTable(false);
                      setSlideChecked(true);
                      setReadonlyFields(false);
                      // setButtonInputState(true);
                      reset(params.row);
                      setEditData(paramData);
                    }}
                  >
                    <EditIcon style={{ color: "#556CD6" }} />
                  </IconButton>

                  {/* Delete */}
                  <IconButton
                    disabled={editButtonInputState}
                    onClick={() => {
                      setBtnSaveText("Update");
                      setID(params.row.id), setSlideChecked(true);
                      reset(params.row);
                    }}
                  >
                    {params.row.activeFlag == "Y" ? (
                      <ToggleOnIcon
                        style={{ color: "green", fontSize: 30 }}
                        onClick={() => deleteById(params.row.id, "N")}
                      />
                    ) : (
                      <ToggleOffIcon
                        style={{ color: "red", fontSize: 30 }}
                        onClick={() => deleteById(params.row.id, "Y")}
                      />
                    )}
                  </IconButton>
                </>
              )}

            {/* Approve */}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("APPROVAL")) &&
              status == "APPLICATION_CREATED" && (
                <IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    endIcon={<CheckIcon />}
                    onClick={() => {
                      setBtnSaveText("StatusByPrincipal"),
                        setID(params.row.id),
                        getDocuments(paramData);
                      setIsOpenCollapse(true), setDocView(true);
                      setSlideChecked(true);
                      setShowTable(false), setButtonInputState(true);
                      console.log("params.row: ", params.row);
                      reset(params.row);
                      setReadonlyFields(true);
                      setChecked(params.row.isLastSchoolIsApplicable);
                      sethandicapchecked(params.row.isPhysicallyChallenged);
                    }}
                  >
                    {labels.view}
                  </Button>
                </IconButton>
              )}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("ENTRY")) &&
              status == "REJECTED_BY_PRINCIPAL" && (
                <IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<EyeFilled />}
                    onClick={() => {
                      setRejectApplViewBtn(true),
                        setID(params.row.id),
                        getDocuments(paramData);
                      setIsOpenCollapse(true), setDocView(true);
                      setSlideChecked(true);
                      setShowTable(false), setButtonInputState(true);
                      console.log("params.row: ", params.row);
                      reset(params.row);
                      setReadonlyFields(true);
                    }}
                  >
                    {labels.view}
                  </Button>
                </IconButton>
              )}
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    console.log("studentDateOfBirth1", watch("studentDateOfBirth"));
  }, [watch("studentDateOfBirth")]);

  useEffect(() => {
    console.log("errors121", errors);
  }, [errors]);

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
          <h2 style={{ marginBottom: 0 }}>{labels.studentAdmissionForm}</h2>
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
              <form onSubmit={handleSubmit(onSubmitForm)} disabled>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
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
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
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
                          <InputLabel required error={!!errors.schoolKey}>
                            {labels.selectSchool}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="schoolKey"
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
                          <FormHelperText error={!!errors.schoolKey}>
                            {errors?.schoolKey ? labels.schoolRequired : null}
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
                          <InputLabel required error={!!errors.academicYearKey}>
                            {labels.selectAcademicYear}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="academicYearKey"
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
                          <FormHelperText error={!!errors.academicYearKey}>
                            {errors?.academicYearKey
                              ? labels.academicYearRequired
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
                          <InputLabel required error={!!errors.classKey}>
                            {labels.selectClass}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="classKey"
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
                          <FormHelperText error={!!errors.classKey}>
                            {errors?.classKey ? labels.classRequired : null}
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
                          <InputLabel required error={!!errors.divisionKey}>
                            {labels.selectDivision}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="divisionKey"
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
                          <FormHelperText error={!!errors.divisionKey}>
                            {errors?.divisionKey ? labels.divReq : null}
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
                          <InputLabel required error={!!errors.schoolMedium}>
                            {labels.selectMedium}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="schoolMedium"
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
                          <FormHelperText error={!!errors.schoolMedium}>
                            {errors?.schoolMedium
                              ? labels.schoolMediumReq
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
                            _key={"studentFirstName"}
                            label={`${labels.studentFirstName} *`}
                            fieldName={"studentFirstName"}
                            updateFieldName={"firstNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={readonlyFields}
                            error={!!errors.studentFirstName}
                            targetError={"firstNameMr"}
                            helperText={
                              errors?.studentFirstName
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
                            _key={"studentMiddleName"}
                            label={`${labels.studentMiddleName} *`}
                            fieldName={"studentMiddleName"}
                            updateFieldName={"middleNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={readonlyFields}
                            error={!!errors.studentMiddleName}
                            targetError={"middleNameMr"}
                            helperText={
                              errors?.studentMiddleName
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
                            _key={"studentLastName"}
                            label={`${labels.studentLastName} *`}
                            fieldName={"studentLastName"}
                            updateFieldName={"lastNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={readonlyFields}
                            error={!!errors.studentLastName}
                            targetError={"lastNameMr"}
                            helperText={
                              errors?.studentLastName
                                ? labels.studentLastNameReq
                                : null
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
                            updateFieldName={"studentFirstName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={readonlyFields}
                            error={!!errors.firstNameMr}
                            InputLabelProps={{
                              shrink: watch("firstNameMr") ? true : false,
                            }}
                            targetError={"studentFirstName"}
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
                            updateFieldName={"studentMiddleName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={readonlyFields}
                            error={!!errors.middleNameMr}
                            targetError={"studentMiddleName"}
                            helperText={
                              errors?.middleNameMr
                                ? labels.middleNameMrReq
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
                            updateFieldName={"studentLastName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={readonlyFields}
                            error={!!errors.lastNameMr}
                            targetError={"studentLastName"}
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
                          label={`${labels.fatherFirstName} *`}
                          {...register("fatherFirstName")}
                          error={!!errors.fatherFirstName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.fatherFirstName
                              ? labels.fatherFirstNameReqAdmission
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
                          label={`${labels.fatherMiddleName} *`}
                          {...register("fatherMiddleName")}
                          error={!!errors.fatherMiddleName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.fatherMiddleName
                              ? labels.fatherMiddleNameReqAdmission
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
                          label={`${labels.fatherLastName} *`}
                          {...register("fatherLastName")}
                          error={!!errors.fatherLastName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.fatherLastName
                              ? labels.fatherLastNameReqAdmission
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
                        {/* <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherName}
                        {...register("motherName")}
                        required
                        error={!!errors.motherName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={
                          errors?.motherName ? errors.motherName.message : null
                        }
                      /> */}
                        <Grid sx={{ width: 230 }}>
                          <Transliteration
                            _key={"motherName"}
                            label={`${labels.motherName} *`}
                            fieldName={"motherName"}
                            updateFieldName={"motherNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={readonlyFields}
                            error={!!errors.motherName}
                            targetError={"motherNameMr"}
                            helperText={
                              errors?.motherName ? labels.motherNameReq : null
                            }
                          />
                        </Grid>
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
                          label={`${labels.motherMiddleName} *`}
                          {...register("motherMiddleName")}
                          error={!!errors.motherMiddleName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.motherMiddleName
                              ? labels.motherMiddleNameReq
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
                          label={`${labels.motherLastName} *`}
                          {...register("motherLastName")}
                          error={!!errors.motherLastName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.motherLastName
                              ? labels.motherLastNameReq
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
                        {/* <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherNameMr}
                        {...register("motherNameMr")}
                        required
                        error={!!errors.motherNameMr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={
                          errors?.motherNameMr
                            ? errors.motherNameMr.message
                            : null
                        }
                      /> */}
                        <Grid sx={{ width: 230 }}>
                          <Transliteration
                            _key={"motherNameMr"}
                            label={`${labels.motherNameMr} *`}
                            fieldName={"motherNameMr"}
                            updateFieldName={"motherName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={readonlyFields}
                            error={!!errors.motherNameMr}
                            targetError={"motherName"}
                            helperText={
                              errors?.motherNameMr
                                ? labels.motherNameMrReq
                                : null
                            }
                          />
                        </Grid>
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
                          <FormLabel required error={!!errors.studentGender}>
                            {labels.gender}
                          </FormLabel>
                          <Controller
                            name="studentGender"
                            control={control}
                            render={({ field }) => (
                              <RadioGroup
                                {...field}
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
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
                          <FormHelperText error={!!errors.studentGender}>
                            {errors?.studentGender
                              ? labels.studentGenderReq
                              : null}
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
                          label={`${labels.mobileNumber} *`}
                          {...register("studentContactDetails")}
                          error={!!errors.studentContactDetails}
                          sx={{ width: 230 }}
                          // type="number"
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.studentContactDetails
                              ? labels.mobileReq
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
                          label={`${labels.emailId} *`}
                          {...register("studentEmail")}
                          error={!!errors.studentEmail}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.studentEmail ? labels.emailReq : null
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
                          label={`${labels.aadharNumber} *`}
                          {...register("studentAadharNumber")}
                          error={!!errors.studentAadharNumber}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.studentAadharNumber
                              ? labels.aadharNoReq
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
                          <InputLabel required error={!!errors.religionKey}>
                            {labels.religion}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="religionKey"
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
                          <FormHelperText error={!!errors.religionKey}>
                            {errors?.religionKey ? labels.religionKeyReq : null}
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
                          <InputLabel required error={!!errors.casteKey}>
                            {labels.casteName}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="casteKey"
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
                          <FormHelperText error={!!errors.casteKey}>
                            {errors?.casteKey ? labels.casteKeyReq : null}
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
                          <InputLabel required error={!!errors.subCastKey}>
                            {labels.subCastName}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="subCastKey"
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
                          <FormHelperText error={!!errors.subCastKey}>
                            {errors?.subCastKey ? labels.subCastKeyReq : null}
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
                          <InputLabel required error={!!errors.citizenshipName}>
                            {labels.citizenship}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="citizenshipName"
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
                          <FormHelperText error={!!errors.citizenshipName}>
                            {errors?.citizenshipName
                              ? labels.citizenshipNameReq
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
                          <InputLabel
                            required
                            error={!!errors.motherTongueName}
                          >
                            {labels.motherTongue}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="motherTongueName"
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
                          <FormHelperText error={!!errors.motherTongueName}>
                            {errors?.motherTongueName
                              ? labels.motherTongueNameReq
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
                        {/* <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.birthPlace}
                        required
                        {...register("studentBirthPlace")}
                        error={!!errors.studentBirthPlace}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={
                          errors?.studentBirthPlace
                            ? errors.studentBirthPlace.message
                            : null
                        }
                      /> */}
                        <Grid sx={{ width: 230 }}>
                          <Transliteration
                            _key={"studentBirthPlace"}
                            label={`${labels.birthPlace} *`}
                            fieldName={"studentBirthPlace"}
                            updateFieldName={"birthPlacemr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={readonlyFields}
                            error={!!errors.studentBirthPlace}
                            targetError={"birthPlacemr"}
                            helperText={
                              errors?.studentBirthPlace
                                ? labels.studentBirthPlaceReq
                                : null
                            }
                          />
                        </Grid>
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
                        {/* <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.birthPlaceMr}
                        required
                        {...register("birthPlacemr")}
                        error={!!errors.birthPlacemr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={
                          errors?.birthPlacemr
                            ? errors.birthPlacemr.message
                            : null
                        }
                      /> */}
                        <Grid sx={{ width: 230 }}>
                          <Transliteration
                            _key={"birthPlacemr"}
                            label={`${labels.birthPlaceMr} *`}
                            fieldName={"birthPlacemr"}
                            updateFieldName={"studentBirthPlace"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={readonlyFields}
                            error={!!errors.birthPlacemr}
                            targetError={"studentBirthPlace"}
                            helperText={
                              errors?.birthPlacemr
                                ? labels.birthPlacemrReq
                                : null
                            }
                          />
                        </Grid>
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
                          control={control}
                          name="studentDateOfBirth"
                          defaultValue={null}
                          render={({ field: { onChange, ...props } }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disableFuture
                                label={
                                  <span className="required">
                                    {labels.dateOfbirth} *
                                  </span>
                                }
                                variant="standard"
                                inputFormat="DD/MM/YYYY"
                                disabled={readonlyFields}
                                {...props}
                                onChange={(date) =>
                                  onChange(moment(date).format("YYYY-MM-DD"))
                                }
                                // selected={fromDate}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="standard"
                                    fullWidth
                                    // fullWidth
                                    sx={{ width: 230 }}
                                    size="small"
                                    error={!!errors.studentDateOfBirth}
                                    helperText={
                                      errors.studentDateOfBirth
                                        ? labels.studentDateOfBirthReq
                                        : null
                                    }
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        {/* <Controller
                        name="studentDateOfBirth"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disabled={readonlyFields}
                              // inputFormat="DD-MM-YYYY"
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  required
                                  variant="standard"
                                  fullWidth
                                  sx={{ width: 230 }}
                                  size="small"
                                  error={errors.studentDateOfBirth}
                                  helperText={
                                    errors.studentDateOfBirth
                                      ? errors.studentDateOfBirth.message
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
                      /> */}
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
                          label={`${labels.age} *`}
                          {...register("studentAge")}
                          error={!!errors.studentAge}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          // InputLabelProps={{ style: { fontSize: 15 } }}
                          InputLabelProps={{
                            shrink:
                              watch("studentAge") == "" || null ? false : true,
                          }}
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
                          <InputLabel required error={!!errors.stateName}>
                            {labels.state}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="stateName"
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
                          <FormHelperText error={!!errors.stateName}>
                            {errors?.stateName ? labels.stateNameReq : null}
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
                          label={`${labels.studentDist} *`}
                          {...register("districtName")}
                          error={!!errors.districtName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.districtName ? labels.districtNameReq : null
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
                          label={`${labels.permanentAddress} *`}
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
                          }}
                          helperText={
                            errors?.familyPermanentAddress
                              ? labels.familyPermanentAddressReq
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
                          label={`${labels.parentFullName} *`}
                          {...register("parentFullName")}
                          error={!!errors.parentFullName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.parentFullName
                              ? labels.parentFullNameReq
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
                          label={`${labels.parentEmailId} *`}
                          {...register("parentEmailId")}
                          error={!!errors.parentEmailId}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.parentEmailId
                              ? labels.parentEmailIdReq
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
                          label={`${labels.parentAddress} *`}
                          {...register("parentAddress")}
                          error={!!errors.parentAddress}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.parentAddress
                              ? labels.parentAddressReq
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
                          label={`${labels.fatherMobileNumber} *`}
                          {...register("fatherContactNumber")}
                          error={!!errors.fatherContactNumber}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.fatherContactNumber
                              ? labels.fatherContactNumberReq
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
                          label={`${labels.motherMobileNumber} *`}
                          {...register("motherContactNumber")}
                          error={!!errors.motherContactNumber}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.motherContactNumber
                              ? labels.motherContactNumberReq
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
                          label={`${labels.fatherQualification} *`}
                          {...register("fatherQualification")}
                          error={!!errors.fatherQualification}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.fatherQualification
                              ? labels.fatherQualificationReq
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
                          label={`${labels.fatherOccupation} *`}
                          {...register("fatherOccupation")}
                          error={!!errors.fatherOccupation}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.fatherOccupation
                              ? labels.fatherOccupationReq
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
                          label={`${labels.fatherIncome} *`}
                          {...register("fatherIncome")}
                          error={!!errors.fatherIncome}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.fatherIncome ? labels.fatherIncomeReq : null
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
                          label={`${labels.motherQualification} *`}
                          {...register("motherQualification")}
                          error={!!errors.motherQualification}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.motherQualification
                              ? labels.motherQualificationReq
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
                          label={`${labels.motherOccupation} *`}
                          {...register("motherOccupation")}
                          error={!!errors.motherOccupation}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.motherOccupation
                              ? labels.motherOccupationReq
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
                          label={`${labels.motherIncome} *`}
                          {...register("motherIncome")}
                          error={!!errors.motherIncome}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.motherIncome ? labels.motherIncomeReq : null
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
                          label={`${labels.colony} *`}
                          {...register("colonyName")}
                          error={!!errors.colonyName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.colonyName ? labels.colonyNameReq : null
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
                          label={`${labels.district} *`}
                          {...register("parentDistrictName")}
                          error={!!errors.parentDistrictName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.parentDistrictName
                              ? labels.parentDistrictNameReq
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
                          label={`${labels.state} *`}
                          {...register("parentStateName")}
                          error={!!errors.parentStateName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.parentStateName
                              ? labels.parentStateNameReq
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
                          label={`${labels.pincode} *`}
                          {...register("parentPincode")}
                          error={!!errors.parentPincode}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.parentPincode
                              ? labels.parentPincodeReq
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
                        disabled={readonlyFields}
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
                              InputLabelProps={{ style: { fontSize: 15 } }}
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
                            {/* <TextField
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
                            InputLabelProps={{ style: { fontSize: 15 } }}
                            // helperText={
                            //   errors?.studentName ? errors.studentName.message : null
                            // }
                          /> */}
                            <Grid sx={{ width: 230 }}>
                              <Transliteration
                                _key={"lastSchoolName"}
                                label={`${labels.lastSchoolName} *`}
                                fieldName={"lastSchoolName"}
                                updateFieldName={"lastSchoolNameMr"}
                                sourceLang={"eng"}
                                targetLang={"mar"}
                                disabled={readonlyFields}
                                error={!!errors.lastSchoolName}
                                targetError={"lastSchoolNameMr"}
                                helperText={
                                  errors?.lastSchoolName
                                    ? errors.lastSchoolName.message
                                    : null
                                }
                              />
                            </Grid>
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
                            {/* <TextField
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
                            InputLabelProps={{ style: { fontSize: 15 } }}
                            // helperText={
                            //   errors?.studentName ? errors.studentName.message : null
                            // }
                          /> */}
                            <Grid sx={{ width: 230 }}>
                              <Transliteration
                                _key={"lastSchoolNameMr"}
                                label={labels.lastSchoolNameMr}
                                fieldName={"lastSchoolNameMr"}
                                updateFieldName={"lastSchoolName"}
                                sourceLang={"eng"}
                                targetLang={"mar"}
                                disabled={readonlyFields}
                                error={!!errors.lastSchoolNameMr}
                                targetError={"lastSchoolName"}
                                helperText={
                                  errors?.lastSchoolNameMr
                                    ? errors.lastSchoolNameMr.message
                                    : null
                                }
                              />
                            </Grid>
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
                              defaultValue={null}
                              render={({ field: { onChange, ...props } }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    disableFuture
                                    label={
                                      <span className="required">
                                        {labels.lastSchoolAdmissionDate}
                                      </span>
                                    }
                                    variant="standard"
                                    inputFormat="DD/MM/YYYY"
                                    disabled={readonlyFields}
                                    {...props}
                                    onChange={(date) =>
                                      onChange(
                                        moment(date).format("YYYY-MM-DD")
                                      )
                                    }
                                    // selected={fromDate}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="standard"
                                        fullWidth
                                        // fullWidth
                                        sx={{ width: 230 }}
                                        size="small"
                                        error={!!errors.lastSchoolAdmissionDate}
                                        helperText={
                                          errors.lastSchoolAdmissionDate
                                            ? labels.lastSchoolAdmissionDate
                                            : null
                                        }
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            {/* <Controller
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
                          /> */}
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
                              InputLabelProps={{ style: { fontSize: 15 } }}
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
                              defaultValue={null}
                              render={({ field: { onChange, ...props } }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    disableFuture
                                    label={
                                      <span className="required">
                                        {labels.lastSchoolLeavingDate}
                                      </span>
                                    }
                                    variant="standard"
                                    inputFormat="DD/MM/YYYY"
                                    disabled={readonlyFields}
                                    {...props}
                                    onChange={(date) =>
                                      onChange(
                                        moment(date).format("YYYY-MM-DD")
                                      )
                                    }
                                    // selected={fromDate}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="standard"
                                        fullWidth
                                        // fullWidth
                                        sx={{ width: 230 }}
                                        size="small"
                                        error={!!errors.lastSchoolLeavingDate}
                                        helperText={
                                          errors.lastSchoolLeavingDate
                                            ? labels.lastSchoolLeavingDate
                                            : null
                                        }
                                      />
                                    )}
                                    minDate={watch("lastSchoolAdmissionDate")}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            {/* <Controller
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
                          /> */}
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
                            {/* <TextField
                            id="standard-basic"
                            variant="standard"
                            label={labels.studentBehaviour}
                            {...register("studentBehaviour")}
                            error={!!errors.studentBehaviour}
                            sx={{ width: 230 }}
                            disabled={readonlyFields}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{ style: { fontSize: 15 } }}
                            // helperText={
                            //   errors?.studentName ? errors.studentName.message : null
                            // }
                          /> */}
                            <Grid sx={{ width: 230 }}>
                              <Transliteration
                                _key={"studentBehaviour"}
                                label={labels.studentBehaviour}
                                fieldName={"studentBehaviour"}
                                updateFieldName={"behaviourMr"}
                                sourceLang={"eng"}
                                targetLang={"mar"}
                                disabled={readonlyFields}
                                error={!!errors.studentBehaviour}
                                helperText={
                                  errors?.studentBehaviour
                                    ? errors.studentBehaviour.message
                                    : null
                                }
                              />
                            </Grid>
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
                            {/* <TextField
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
                            InputLabelProps={{ style: { fontSize: 15 } }}
                            // helperText={
                            //   errors?.studentName ? errors.studentName.message : null
                            // }
                          /> */}
                            <Grid sx={{ width: 230 }}>
                              <Transliteration
                                _key={"behaviourMr"}
                                label={labels.studentBehaviourMr}
                                fieldName={"behaviourMr"}
                                updateFieldName={"studentBehaviour"}
                                sourceLang={"mar"}
                                targetLang={"eng"}
                                disabled={readonlyFields}
                                error={!!errors.behaviourMr}
                                helperText={
                                  errors?.behaviourMr
                                    ? errors.behaviourMr.message
                                    : null
                                }
                              />
                            </Grid>
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
                            {/* <TextField
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
                            InputLabelProps={{ style: { fontSize: 15 } }}
                            // helperText={
                            //   // errors?.studentName ? errors.studentName.message : null
                            //  }
                          /> */}
                            <Grid sx={{ width: 230 }}>
                              <Transliteration
                                _key={"reasonForLeavingSchool"}
                                label={labels.reasonForLeavingSchool}
                                fieldName={"reasonForLeavingSchool"}
                                updateFieldName={"reasonForLeavingSchoolMr"}
                                sourceLang={"eng"}
                                targetLang={"mar"}
                                disabled={readonlyFields}
                                error={!!errors.reasonForLeavingSchool}
                                helperText={
                                  errors?.reasonForLeavingSchool
                                    ? errors.reasonForLeavingSchool.message
                                    : null
                                }
                              />
                            </Grid>
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
                            {/* <TextField
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
                            InputLabelProps={{ style: { fontSize: 15 } }}
                            // helperText={
                            //   // errors?.studentName ? errors.studentName.message : null
                            //  }
                          /> */}
                            <Grid sx={{ width: 230 }}>
                              <Transliteration
                                _key={"reasonForLeavingSchoolMr"}
                                label={labels.reasonForLeavingSchoolMr}
                                fieldName={"reasonForLeavingSchoolMr"}
                                updateFieldName={"reasonForLeavingSchool"}
                                sourceLang={"mar"}
                                targetLang={"eng"}
                                disabled={readonlyFields}
                                error={!!errors.reasonForLeavingSchoolMr}
                                helperText={
                                  errors?.reasonForLeavingSchoolMr
                                    ? errors.reasonForLeavingSchoolMr.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}

                      <Divider />
                      <Typography style={{ marginTop: "5px" }}>
                        {language == "en" ? "Handicapped ?" : "दिव्यांग ?"}
                      </Typography>
                      <Checkbox
                        checked={handicapchecked}
                        disabled={readonlyFields}
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
                                  {labels.certificateOfDisability} * :
                                </label>
                              </Grid>
                              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <DocumentsUpload
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
                                  showDel={!props.onlyDoc ? true : false}
                                  view={docView}
                                  fileNameEncrypted={(path) => {
                                    setEncrptphysicallyChallengedCertficateDocument(
                                      path
                                    );
                                  }}
                                  // appName="TP"
                                  // serviceName="PARTMAP"
                                  // fileUpdater={setstudentDisabilityCertificate}
                                  // filePath={studentDisabilityCertificate}
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
                          label={`${labels.accountNo} *`}
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
                          }}
                          helperText={
                            errors?.accountNo ? labels.accountNoReq : null
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
                          label={`${labels.confirmBankAcNumber} *`}
                          onPaste={(e) => e.preventDefault()} //prevents from copy-paste
                          {...register("confirmBankAcNumber")}
                          error={!!errors.confirmBankAcNumber}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            autoComplete: "off", //prevents from autoSuggestions
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.confirmBankAcNumber
                              ? labels.confirmBankAcNumberReq
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
                          label={`${labels.accountHolderName} *`}
                          {...register("accountHolderName")}
                          error={!!errors.accountHolderName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.accountHolderName
                              ? labels.accountHolderNameReq
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
                          label={`${labels.bankName} *`}
                          {...register("bankName")}
                          error={!!errors.bankName}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.bankName ? labels.bankNameReq : null
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
                          label={`${labels.ifscCode} *`}
                          {...register("ifscCode")}
                          error={!!errors.ifscCode}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.ifscCode ? labels.ifscCodeReq : null
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
                          label={`${labels.bankAdderess} *`}
                          {...register("bankAdderess")}
                          error={!!errors.bankAdderess}
                          sx={{ width: 230 }}
                          disabled={readonlyFields}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{ style: { fontSize: 15 } }}
                          helperText={
                            errors?.bankAdderess ? labels.bankAdderessReq : null
                          }
                        />
                      </Grid>
                      {/* relation */}
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
                          <InputLabel
                            error={!!errors.relationWithAccountantHolder}
                          >
                            {labels.relation} *
                          </InputLabel>
                          <Controller
                            control={control}
                            name="relationWithAccountantHolder"
                            value={watch("relationWithAccountantHolder")}
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.relationWithAccountantHolder}

                                //  onChange={handleDropdownChange}
                              >
                                {relations &&
                                  relations.map((relation, index) => (
                                    <MenuItem key={index} value={relation.val}>
                                      {relation.val}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText
                            error={!!errors.relationWithAccountantHolder}
                          >
                            {errors?.relationWithAccountantHolder
                              ? labels.relationWithAccountantHolderReq
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
                        {console.log(
                          "fffff",
                          watch("relationWithAccountantHolder")
                        )}
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
                            }}
                            helperText={
                              errors?.otherRelationWithAccountantHolder
                                ? labels.relationWithAccountantHolderReq
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
                          <h2 style={{ marginBottom: 0 }}>
                            {labels.documents}
                          </h2>
                        </Grid>
                      </Grid>
                      {/* Birth Certi */}
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
                          <label>{labels.studentBirthCertificate} *</label>
                          <DocumentsUpload
                            error={!!errors?.birthCertificateDocument}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("birthCertificateDocument")}
                            fileKey={"birthCertificateDocument"}
                            showDel={!props.onlyDoc ? true : false}
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
                          <FormHelperText
                            error={!!errors?.birthCertificateDocument}
                          >
                            {errors?.birthCertificateDocument
                              ? labels?.studentBirthCertificateReq
                              : null}
                          </FormHelperText>
                        </Grid>
                        {/* Leaving Certificate */}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <label>
                            {labels.studentSchoolLeavingCertificate}
                          </label>
                          <DocumentsUpload
                            error={!!errors?.leavingCertificateDocuemnt}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("leavingCertificateDocuemnt")}
                            fileKey={"leavingCertificateDocuemnt"}
                            showDel={!props.onlyDoc ? true : false}
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
                          <label>{labels.studentPhotograph} *</label>
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
                            fileDtl={watch("studentPhotograph")}
                            fileKey={"studentPhotograph"}
                            // showDel={pageMode ? false : true}
                            showDel={!props.onlyDoc ? true : false}
                            fileNameEncrypted={(path) => {
                              setEncrptstudentPhotograph(path);
                            }}
                          />
                          <FormHelperText error={!!errors?.studentPhotograph}>
                            {!!errors?.studentPhotograph
                              ? labels?.studentPhotographReq
                              : null}
                          </FormHelperText>
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
                          <label>{labels.studentAadhar} *</label>
                          <DocumentsUpload
                            error={!!errors?.studentAadharCardDocument}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("studentAadharCardDocument")}
                            fileKey={"studentAadharCardDocument"}
                            // showDel={pageMode ? false : true}
                            showDel={!props.onlyDoc ? true : false}
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
                          <FormHelperText
                            error={!!errors?.studentAadharCardDocument}
                          >
                            {errors?.studentAadharCardDocument
                              ? labels?.studentAadharCardReq
                              : null}
                          </FormHelperText>
                        </Grid>
                        {/* Parent Aadhar Card*/}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <label>{labels.parentAadhar} *</label>
                          <DocumentsUpload
                            error={!!errors?.parentAadharCardDocument}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("parentAadharCardDocument")}
                            fileKey={"parentAadharCardDocument"}
                            // showDel={pageMode ? false : true}
                            showDel={!props.onlyDoc ? true : false}
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
                          <FormHelperText
                            error={!!errors?.parentAadharCardDocument}
                          >
                            {errors?.parentAadharCardDocument
                              ? labels?.parentAadharCardReq
                              : null}
                          </FormHelperText>
                        </Grid>
                        {/* Student Last Year Marksheet*/}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <label>{labels.studentLastYearMarksheet}</label>
                          <DocumentsUpload
                            error={!!errors?.studentLastYearMarkSheetDocument}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("studentLastYearMarkSheetDocument")}
                            fileKey={"studentLastYearMarkSheetDocument"}
                            // showDel={pageMode ? false : true}
                            showDel={!props.onlyDoc ? true : false}
                            view={docView}
                            fileNameEncrypted={(path) => {
                              setEncrptstudentLastYearMarkSheetDocument(path);
                            }}
                            // appName="TP"
                            // serviceName="PARTMAP"
                            // fileUpdater={setStudentLastYearMarksheet}
                            // filePath={studentLastYearMarksheet}
                          />
                        </Grid>
                      </Grid>

                      {/* Buttons */}
                      <Divider />
                      {/* {readonlyFields === true ? ( */}
                      {authority?.includes("APPROVAL") || rejectApplViewBtn ? (
                        <>
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
                            <FormControl
                              variant="outlined"
                              // variant="standard"
                              size="small"
                              required
                              // sx={{ m: 1, minWidth: 120 }}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {labels.action}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    // required
                                    disabled={rejectApplViewBtn}
                                    label={labels.action}
                                    sx={{ width: 300 }}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                  >
                                    <MenuItem value="approve">
                                      {labels.approve}
                                    </MenuItem>
                                    <MenuItem value="reject">
                                      {labels.reject}
                                    </MenuItem>
                                  </Select>
                                )}
                                name="Status"
                                control={control}
                                defaultValue=""
                              />
                            </FormControl>
                          </Grid>
                          {/* principalRemarksEn */}
                          <Grid
                            item
                            xl={6}
                            lg={6}
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
                            <Grid sx={{ width: 230 }}>
                              <Transliteration
                                _key={"principalRemarksEn"}
                                label={labels.principalRemarksEn}
                                fieldName={"principalRemarksEn"}
                                updateFieldName={"principalRemarksMr"}
                                sourceLang={"eng"}
                                targetLang={"mar"}
                                disabled={rejectApplViewBtn}
                                // error={!!errors.studentFirstName}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  shrink: watch("principalRemarksEn")
                                    ? true
                                    : false,
                                }}
                                targetError={"firstNameMr"}
                                // helperText={
                                //   errors?.studentFirstName
                                //     ? labels.studentFirstNameReq
                                //     : null
                                // }
                              />
                            </Grid>

                            {/* <TextField
                            id="standard-basic"
                            variant="standard"
                            label={labels.principalRemarksEn}
                            required
                            {...register("principalRemarksEn")}
                            // error={!!errors.principalRemarksEn}
                            sx={{ width: 230 }}
                            disabled={rejectApplViewBtn}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{ style: { fontSize: 15 } }}
                          // helperText={errors?.bankAdderess ? errors.bankAdderess.message : null}
                          /> */}
                          </Grid>
                          {/* principalRemarksMr */}
                          <Grid
                            item
                            xl={6}
                            lg={6}
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
                            <Grid sx={{ width: 230 }}>
                              <Transliteration
                                _key={"principalRemarksMr"}
                                label={labels.principalRemarksMr}
                                fieldName={"principalRemarksMr"}
                                updateFieldName={"principalRemarksEn"}
                                sourceLang={"mar"}
                                targetLang={"eng"}
                                disabled={rejectApplViewBtn}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  shrink: watch("principalRemarksMr")
                                    ? true
                                    : false,
                                }}
                                // error={!!errors.studentFirstName}
                                // targetError={"firstNameMr"}
                                // helperText={
                                //   errors?.studentFirstName
                                //     ? labels.studentFirstNameReq
                                //     : null
                                // }
                              />
                            </Grid>

                            {/* <TextField
                            id="standard-basic"
                            variant="standard"
                            label={labels.principalRemarksMr}
                            required
                            {...register("principalRemarksMr")}
                            // error={!!errors.principalRemarksEn}
                            sx={{ width: 230 }}
                            disabled={rejectApplViewBtn}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{ style: { fontSize: 15 } }}
                          // helperText={errors?.bankAdderess ? errors.bankAdderess.message : null}
                          /> */}
                          </Grid>
                          {/* Bittons */}
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
                                disabled={rejectApplViewBtn}
                                type="submit"
                                sx={{ marginRight: 8 }}
                                variant="contained"
                                color="primary"
                                endIcon={<SaveIcon />}
                                // onClick={() => alert("Hello")}
                              >
                                {labels.submit}
                              </Button>
                            </Grid>
                            <Grid item>
                              <Button
                                variant="contained"
                                color="primary"
                                endIcon={<ExitToAppIcon />}
                                onClick={() => {
                                  exitButton();
                                  setRejectApplViewBtn(false);
                                  setDocView(false);
                                }}
                              >
                                {labels.exit}
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
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
                              disabled={rejectApplViewBtn}
                              sx={{ marginRight: 8 }}
                              type="submit"
                              variant="contained"
                              color="primary"
                              endIcon={<SaveIcon />}
                            >
                              {labels.submit}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              sx={{ marginRight: 8 }}
                              disabled={rejectApplViewBtn}
                              variant="contained"
                              color="primary"
                              endIcon={<ClearIcon />}
                              onClick={() => cancellButton()}
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
                                exitButton(), setRejectApplViewBtn(false);
                                setDocView(false);
                              }}
                            >
                              {labels.exit}
                            </Button>
                          </Grid>
                        </Grid>
                      )}

                      <Divider />
                    </Grid>
                  </Slide>
                )}
              </form>
            </FormProvider>
          </Box>
        </Box>
        {(authority?.includes("ADMIN_OFFICER") ||
          authority?.includes("ENTRY")) && (
          <div className={styles.addbtn}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesExit,
                });
                setEditButtonInputState(true);
                setDeleteButtonState(true);
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
                setReadonlyFields(false);
                setShowTable(false);
              }}
            >
              {labels.add}
            </Button>
          </div>
        )}
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
                    getStudentAdmissionMaster(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getStudentAdmissionMaster(_data, data.page);
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

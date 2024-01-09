import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  TextareaAutosize,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import urls from "../../../../../URLS/urls";
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import UploadButton from "../../../../../components/marriageRegistration/DocumentsUploadMB";
import HistoryComponent from "../../../../../components/marriageRegistration/HistoryComponent";
import applicantModschema from "../../../../../components/marriageRegistration/schema/applicantModschema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
import styles from "./modificationInMC.module.css";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = (props) => {
  const [modalforAprov, setmodalforAprov] = useState(false);
  const router = useRouter();
  const disptach = useDispatch();

  const methods = useForm({
    defaultValues: {
      setBackDrop: false,
      id: null,
      applicationFrom: "online",
      applicationDate: "",
      zoneKey: "",
      wardKey: "",
      atitle: "",
      afName: "",
      amName: "",
      alName: "",
      atitleMr: "",
      afNameMr: "",
      amNameMr: "",
      alNameMr: "",
      aemail: "",
      amobileNo: "",

      aflatBuildingNo: "",
      abuildingName: "",
      aroadName: "",
      alandmark: "",

      aflatBuildingNoMr: "",
      abuildingNameMr: "",
      aroadNameMr: "",
      alandmarkMr: "",

      acityName: "",
      astate: "Maharashtra",
      acityNameMr: "",
      astateMr: "महाराष्ट्र",
      apincode: "",
      marriageDate: null,
      pplaceOfMarriage: "",
      pplaceOfMarriageMr: "",

      //  religionKey: '',
      //husband/groom
      // gfName: "",
      gmName: "",
      glName: "",
      gbuildingNo: "",
      gbuildingName: "",
      groadName: "",
      glandmark: "",
      gvillageName: "",
      gcityName: "",
      gpincode: "",
      gstate: "Maharashtra",
      gstateMr: "महाराष्ट्र",
      ggender: "",
      gmobileNo: "",
      gphoneNo: "",
      gemail: "",
      gage: "",
      gstatus: "",
      greligionByBirth: "",
      greligionByAdoption: "",
      gbirthDate: null,

      gfNameMr: "",
      gmNameMr: "",
      glNameMr: "",
      gfNameMrM: "",

      //wife/bride
      bfName: "",
      bmName: "",
      blName: "",
      bbuildingNo: "",
      bbuildingName: "",
      broadName: "",
      bkandmark: "",
      bvillageName: "",
      bcityName: "",
      bpincode: "",
      bstate: "Maharashtra",
      bgender: "",
      baadharNo: "",
      bmobileNo: "",
      bphoneNo: "",
      bemail: "",
      bage: "",
      bstatus: "",
      breligionByBirth: "",
      breligionByAdoption: "",
      bbirthDate: null,

      bfNameMr: "",
      bmNameMr: "",
      blNameMr: "",

      //prist
      ptitle: "",
      pfName: "",
      pmName: "",
      plName: "",
      pbuildingNo: "",
      pbuildingName: "",
      proadName: "",
      plandmark: "",
      pvillageName: "",
      pcityName: "",
      pstate: "Maharashtra",
      pgender: "",
      paadharNo: "",
      pmobileNo: "",
      pphoneNo: "",
      pemail: "",
      page: "",
      preligionByBirth: "",
      preligionByAdoption: "",
      pbirthDate: null,
      pplaceOfMarriage: "",
      pplaceOfMarriageMr: "",

      // documents
      gageProofDocument: "",
      gresidentialProofDocument: "",
      gphoto: "",
      gthumb: "",
      bageProofDocument: "",
      bresidentialProofDocument: "",
      bphoto: "",
      bthumb: "",
      pdocument: "",
      invitationProof: "",
      inventPhoto: "",
      divorceCertificate: "",
      udeathcer: null,
      udivorcePaper: null,
      ucertiReligious: null,
      unofficialMarriageCertificate: "",

      // Photo
      religionCertificatePhoto: "",
      // dateCertificate: '',
      divorceCertificate: "",
      invitationProof: "",
      pdocument: "",
      bresidentialProofDocument: "",
      bAgeProofDocument: "",
      gresidentialProofDocument: "",
      gageProofDocument: "",
      marriageDate: null,

      copies: "",
      // witness
    },
    resolver: yupResolver(applicantModschema),
    mode: "onChange",
    criteriaMode: "all",
  });
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const user = useSelector((state) => state?.user.user);
  // const language = useSelector((state) => state?.labels.language);
  let appName = "MR";
  let serviceName = "M-MMC";
  // let applicationForm=''
  const [showAccordian, setshowAccordian] = useState(true);
  const [pageMode, setPageMode] = useState(null);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [tempData, setTempData] = useState();

  const [showData, setShowData] = useState(false);
  const [searchDetails, setSearchDetails] = useState();
  const [disabled, setDisabled] = useState(false);

  //data encryption
  const [encryptedFileNameToSend, setEncryptedFileNameToSend] = useState();
  const [encryptedGadharCardModDocument, setEncryptedGadharCardModDocument] =
    useState();
  const [
    encryptedGaddressProofModDocument,
    setEncryptedGaddressProofModDocument,
  ] = useState();
  const [encryptedBadharCardModDocument, setEncryptedBadharCardModDocument] =
    useState();
  const [
    encryptedBaddressProofModDocument,
    setEncryptedBaddressProofModDocument,
  ] = useState();
  const [
    encryptedOldMarriageCerModDocument,
    setEncryptedOldMarriageCerModDocument,
  ] = useState();

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
  const searchData = () => {
    console.log(
      "search",
      getValues("zoneKeyS"),
      getValues("wardKeyS"),
      getValues("registrationDateS"),
      getValues("mRegNoS"),
      getValues("marriageDateS"),
      getValues("marriageYearS"),
      getValues("groomFNameS"),
      getValues("groomMNameS"),
      getValues("groomLNameS"),
      getValues("brideFNameS"),
      getValues("brideMNameS"),
      getValues("brideLNameS"),
    );

    const finalBody = {
      zoneKey: getValues("zoneKeyS"),
      wardKey: getValues("wardKeyS"),
      registrationDate: getValues("registrationDateS"),
      registrationNumber: getValues("mRegNoS"),
      marriageDate: getValues("marriageDateS"),
      marriageYear: Number(getValues("marriageYearS")),
      gfName: getValues("groomFNameS"),
      gmName: getValues("groomMNameS"),
      glName: getValues("groomLNameS"),
      bfName: getValues("brideFNameS"),
      bmName: getValues("brideMNameS"),
      blName: getValues("brideLNameS"),
    };

    console.log("Search Body", finalBody);
    axios
      .post(`${urls.MR}/transaction/reIssuanceM/getreissueDetails`, finalBody, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("reissue", res.data[0]);
        if (res.status == 200) {
          // swal("Submited!", "Record Searched successfully !", "success");
          swal(
            language == "en" ? "Searched!" : "शोधले!",
            language == "en" ? "Record Found!" : "रेकॉर्ड सापडले!",
            "success",
          );
          // ("Searched!", "Record Found!", "success");
          if (res.data.length > 0) {
            setShowData(true);
            reset(res.data[0]);
            setTempData(res.data[0]);

            setSearchDetails(res.data[0]);

            setValue("marriageDateM", res.data[0].marriageDate);
            setValue("pplaceOfMarriageM", res.data[0].pplaceOfMarriage);
            setValue("pplaceOfMarriageMrM", res.data[0].pplaceOfMarriageMr);
            setValue("gtitleM", res.data[0].gtitle);
            setValue("gtitleMar", res.data[0].gtitle);
            setValue("gtitleMarM", res.data[0].gtitle);
            setValue("gfNameM", res.data[0].gfName);
            setValue("gmNameM", res.data[0].gmName);
            setValue("glNameM", res.data[0].glName);
            setValue("gtitleMrM", res.data[0].gtitleMr);
            setValue("gfNameMrM", res.data[0].gfNameMr);
            setValue("gmNameMrM", res.data[0].gmNameMr);
            setValue("glNameMrM", res.data[0].glNameMr);
            setValue("gbuildingNoM", res.data[0].gbuildingNo);
            setValue("gbuildingNameM", res.data[0].gbuildingName);
            setValue("groadNameM", res.data[0].groadName);
            setValue("glandmarkM", res.data[0].glandmark);
            setValue("gbuildingNoMrM", res.data[0].gbuildingNoMr);
            setValue("gbuildingNameMrM", res.data[0].gbuildingNameMr);
            setValue("groadNameMrM", res.data[0].groadNameMr);
            setValue("glandmarkMrM", res.data[0].glandmarkMr);
            setValue("gcityNameM", res.data[0].gcityName);
            setValue("gstateM", res.data[0].gstate);
            setValue("gcityNameMrM", res.data[0].gcityNameMr);
            setValue("gstateMrM", res.data[0].gstateMr);
            setValue("gpincodeM", res.data[0].gpincode);
            setValue("gmobileNoM", res.data[0].gmobileNo);
            setValue("gaadharNoM", res.data[0].gaadharNo);

            setValue("btitleM", res.data[0].btitle);
            setValue("btitleMar", res.data[0].btitle);
            setValue("btitleMarM", res.data[0].btitle);
            setValue("bfNameM", res.data[0].bfName);
            setValue("bmNameM", res.data[0].bmName);
            setValue("blNameM", res.data[0].blName);
            setValue("btitleMrM", res.data[0].btitleMr);
            setValue("bfNameMrM", res.data[0].bfNameMr);
            setValue("bmNameMrM", res.data[0].bmNameMr);
            setValue("blNameMrM", res.data[0].blNameMr);
            setValue("bbuildingNoM", res.data[0].bbuildingNo);
            setValue("bbuildingNameM", res.data[0].bbuildingName);
            setValue("broadNameM", res.data[0].broadName);
            setValue("blandmarkM", res.data[0].blandmark);
            setValue("bbuildingNoMrM", res.data[0].bbuildingNoMr);
            setValue("bbuildingNameMrM", res.data[0].bbuildingNameMr);
            setValue("broadNameMrM", res.data[0].broadNameMr);
            setValue("blandmarkMrM", res.data[0].blandmarkMr);
            setValue("bcityNameM", res.data[0].bcityName);
            setValue("bstateM", res.data[0].bstate);
            setValue("bcityNameMrM", res.data[0].bcityNameMr);
            setValue("bstateMrM", res.data[0].bstateMr);
            setValue("bpincodeM", res.data[0].bpincode);
            setValue("bmobileNoM", res.data[0].bmobileNo);
            setValue("baadharNoM", res.data[0].baadharNo);
            setshowAccordian(false);
            getWards(res.data[0].zoneKey);
          } else {
            swal(
              language == "en" ? "Error!" : "समस्या आहे!",
              language == "en"
                ? "Something problem with the searched Data !"
                : "शोधलेल्या डेटामध्ये काहीतरी समस्या आहे!",
              "error",

              // "Error!",
              // "Something problem with the searched Data !",
              // "error",
            );
          }
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // .catch((err) => {
    //   console.log(err.response);
    //   swal(
    //     language == "en" ? "Submited!" : "सादर केले!",
    //     language == "en"
    //       ? "Something problem with the search !"
    //       : "शोधात काहीतरी समस्या आहे!",
    //     "error",
    //   );

    //   // "Submited!", "Something problem with the search !", "error");
    // });
  };

  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setPageMode(null);
      setDisabled(true);
      console.log("enabled", router.query.pageMode);
    } else if (router.query.pageMode == "View") {
      setDisabled(true);
    } else {
      setDisabled(false);
      setPageMode(router.query.pageMode);
      console.log("disabled", router.query.pageMode);
    }
  }, []);

  useEffect(() => {
    if (
      (showData,
      router.query.pageMode == "Edit" || router.query.pageMode == "View")
      // || router.query.pageMode === "View"
    ) {
      if (
        router?.query?.id != null &&
        router?.query?.id != undefined &&
        router?.query?.id != ""
      ) {
        axios
          .get(
            `${urls.MR}/transaction/modOfMarCertificate/getapplicantById?applicationId=${router?.query?.id}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          )
          .then((resp) => {
            console.log("Modify123", resp.data);
            setTempData(resp.data);
            setShowData(true);
            reset(resp.data);
            setValue("marriageDateM", resp.data.marriageDate);
            setValue("pplaceOfMarriageM", resp.data.pplaceOfMarriage);
            setValue("pplaceOfMarriageMrM", resp.data.pplaceOfMarriageMr);
            setValue("gtitleM", resp.data.gtitle);
            setValue("gtitleMar", resp.data.gtitle);
            setValue("gtitleMarM", resp.data.gtitle);
            setValue("gfNameM", resp.data.gfName);
            setValue("gmNameM", resp.data.gmName);
            setValue("glNameM", resp.data.glName);
            setValue("gtitleMrM", resp.data.gtitleMr);
            setValue("gfNameMrM", resp.data.gfNameMr);
            setValue("gmNameMrM", resp.data.gmNameMr);
            setValue("glNameMrM", resp.data.glNameMr);
            setValue("gbuildingNoM", resp.data.gbuildingNo);
            setValue("gbuildingNameM", resp.data.gbuildingName);
            setValue("groadNameM", resp.data.groadName);
            setValue("glandmarkM", resp.data.glandmark);
            setValue("gbuildingNoMrM", resp.data.gbuildingNoMr);
            setValue("gbuildingNameMrM", resp.data.gbuildingNameMr);
            setValue("groadNameMrM", resp.data.groadNameMr);
            setValue("glandmarkMrM", resp.data.glandmarkMr);
            setValue("gcityNameM", resp.data.gcityName);
            setValue("gstateM", resp.data.gstate);
            setValue("gcityNameMrM", resp.data.gcityNameMr);
            setValue("gstateMrM", resp.data.gstateMr);
            setValue("gpincodeM", resp.data.gpincode);
            setValue("gmobileNoM", resp.data.gmobileNo);
            setValue("gaadharNoM", resp.data.gaadharNo);

            setValue("btitleM", resp.data.btitle);
            setValue("btitleMar", resp.data.btitle);
            setValue("btitleMarM", resp.data.btitle);
            setValue("bfNameM", resp.data.bfName);
            setValue("bmNameM", resp.data.bmName);
            setValue("blNameM", resp.data.blName);
            setValue("btitleMrM", resp.data.btitleMr);
            setValue("bfNameMrM", resp.data.bfNameMr);
            setValue("bmNameMrM", resp.data.bmNameMr);
            setValue("blNameMrM", resp.data.blNameMr);
            setValue("bbuildingNoM", resp.data.bbuildingNo);
            setValue("bbuildingNameM", resp.data.bbuildingName);
            setValue("broadNameM", resp.data.broadName);
            setValue("blandmarkM", resp.data.blandmark);
            setValue("bbuildingNoMrM", resp.data.bbuildingNoMr);
            setValue("bbuildingNameMrM", resp.data.bbuildingNameMr);
            setValue("broadNameMrM", resp.data.broadNameMr);
            setValue("blandmarkMrM", resp.data.blandmarkMr);
            setValue("bcityNameM", resp.data.bcityName);
            setValue("bstateM", resp.data.bstate);
            setValue("bcityNameMrM", resp.data.bcityNameMr);
            setValue("bstateMrM", resp.data.bstateMr);
            setValue("bpincodeM", resp.data.bpincode);
            setValue("bmobileNoM", resp.data.bmobileNo);
            setValue("baadharNoM", resp.data.baadharNo);

            setTemp(true);

            axios
              .get(
                `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${resp.data.trnApplicantId}`,
                {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                },
              )
              .then((rrr) => {
                reset(rrr.data);
              })
              .catch((error) => {
                callCatchMethod(error, language);
              });
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      }
    }
  }, [showData]);

  const [atitles, setatitles] = useState([]);
  const [gTitleMars, setgTitleMars] = useState([]);

  const [temp, setTemp] = useState();

  const [temp1, setTemp1] = useState();

  // Titles
  const [gTitles, setgTitles] = useState([]);

  // getTitles
  const getgTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setgTitles(
          r.data.title.map((row) => ({
            id: row.id,
            gTitle: row.title,
            //titlemr: row.titlemr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  // getTitles
  const getgTitleMars = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setgTitleMars(
          r.data.title.map((row) => ({
            id: row.id,
            gTitleMar: row.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [zoneKeys, setZoneKeys] = useState([]);
  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // wardKeys
  const [wardKeys, setWardKeys] = useState([]);

  // getWardKeys
  const getWardKeys = () => {
    axios
      .get(
        `${
          urls.CFCURL
        }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${temp1}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        setWardKeys(
          r.data.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const language = useSelector((state) => state?.labels.language);

  // Titles
  const [bTitles, setbTitles] = useState([]);

  // getTitles
  const getbTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setbTitles(
          r.data.title.map((row) => ({
            id: row.id,
            bTitle: row.title,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Titles
  const [bTitleMars, setbTitleMars] = useState([]);

  // getTitles
  const getbTitleMars = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setbTitleMars(
          r.data.title.map((row) => ({
            id: row.id,
            bTitleMar: row.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    if (temp1) getWardKeys();
  }, [temp1]);

  useEffect(() => {
    if (router.query.pageMode != "Add") setTemp1(getValues("zoneKey"));
  }, [getValues("zoneKey")]);
  useEffect(() => {
    getZoneKeys();
    getTitles();
    getgTitleMars();
    getgTitles();
    getbTitles();
    getbTitleMars();
  }, [user]);

  const getTitles = async () => {
    await axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setatitles(
          r.data.title.map((row) => ({
            id: row.id,
            title: row.title,
            titlemr: row.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // let disabled = false;

  const handleApply = () => {
    console.log("Value yeu dya: ", watch("gfName"));
    let userType;

    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      userType = 1;
    } else if (localStorage.getItem("loggedInUser") == "departmentUser") {
      userType = 3;
    } else localStorage.getItem("loggedInUser") == "cfcUser";
    {
      userType = 2;
    }
    const finalBody = {
      applicantType: userType,
      applicationFrom: "online" / "cfc",
      pageMode: null,
      createdUserId: user.id,
      zoneKey: watch("zoneKey"),
      wardKey: watch("wardKey"),
      atitle: watch("atitle"),
      afName: watch("afName"),
      afNameMr: watch("afNameMr"),
      amName: watch("amName"),
      atitleMr: watch("atitleMr"),
      amNameMr: watch("amNameMr"),
      alName: watch("alName"),
      alNameMr: watch("alNameMr"),
      aemail: watch("aemail"),
      amobileNo: watch("amobileNo"),
      aflatBuildingNo: watch("aflatBuildingNo"),
      abuildingName: watch("abuildingName"),
      aroadName: watch("aroadName"),
      alandmark: watch("alandmark"),
      acityName: watch("acityName"),
      astate: watch("astate"),
      apincode: watch("apincode"),
      aflatBuildingNoMr: watch("aflatBuildingNoMr"),
      abuildingNameMr: watch("abuildingNameMr"),
      aroadNameMr: watch("aroadNameMr"),
      alandmarkMr: watch("alandmarkMr"),
      acityNameMr: watch("acityNameMr"),
      astateMr: watch("astateMr"),
      marriageDate: watch("marriageDateM"),
      pplaceOfMarriage: watch("pplaceOfMarriageM"),
      pplaceOfMarriageMr: watch("pplaceOfMarriageMrM"),
      isApplicantGroom: tempData.isApplicantGroom,
      gtitle: watch("gtitleM"),
      gfName: watch("gfNameM"),
      gmName: watch("gmNameM"),
      glName: watch("glNameM"),
      gfNameMr: watch("gfNameMrM"),
      gmNameMr: watch("gmNameMrM"),
      glNameMr: watch("glNameMrM"),
      gbirthDate: tempData.gbirthDate,
      gage: tempData.gage,
      ggender: tempData.ggender,
      gemail: tempData.gemail,
      greligionByBirth: tempData.greligionByBirth,
      greligionByAdoption: tempData.greligionByAdoption,
      gstatusAtTimeMarriageKey: tempData.gstatusAtTimeMarriageKey,
      gbuildingNo: watch("gbuildingNoM"),
      gbuildingName: watch("gbuildingNameM"),
      groadName: watch("groadNameM"),
      glandmark: watch("glandmarkM"),
      gcityName: watch("gcityNameM"),
      gstate: watch("gstateM"),
      gbuildingNoMr: watch("gbuildingNoMrM"),
      gbuildingNameMr: watch("gbuildingNameMrM"),
      groadNameMr: watch("groadNameMrM"),
      glandmarkMr: watch("glandmarkMrM"),
      gcityNameMr: watch("gcityNameMrM"),
      gstateMr: watch("gstateMrM"),
      gpincode: watch("gpincodeM"),
      gmobileNo: watch("gmobileNoM"),
      gaadharNo: watch("gaadharNoM"),
      isApplicantBride: tempData.isApplicantBride,
      btitle: watch("btitleM"),
      bfName: watch("bfNameM"),
      bmName: watch("bmNameM"),
      blName: watch("blNameM"),
      bfNameMr: watch("bfNameMrM"),
      bmNameMr: watch("bmNameMrM"),
      blNameMr: watch("blNameMrM"),
      bbirthDate: tempData.bbirthDate,
      bage: tempData.bage,
      bgender: tempData.bgender,
      baadharNo: tempData.baadharNo,
      bemail: tempData.bemail,
      breligionByBirth: tempData.breligionByBirth,
      breligionByAdoption: tempData.breligionByAdoption,
      bstatusAtTimeMarriageKey: tempData.bstatusAtTimeMarriageKey,
      bbuildingNo: watch("bbuildingNoM"),
      bbuildingName: watch("bbuildingNameM"),
      broadName: watch("broadNameM"),
      blandmark: watch("blandmarkM"),
      bcityName: watch("bcityNameM"),
      bstate: watch("bstateM"),
      bbuildingNoMr: watch("bbuildingNoMrM"),
      bbuildingNameMr: watch("bbuildingNameMrM"),
      broadNameMr: watch("broadNameMrM"),
      blandmarkMr: watch("blandmarkMrM"),
      bcityNameMr: watch("bcityNameMrM"),
      bstateMr: watch("bstateMrM"),
      bpincode: watch("bpincodeM"),
      bmobileNo: watch("bmobileNoM"),
      baadharNo: watch("baadharNoM"),
      gageProofDocumentKey: tempData.gageProofDocumentKey,
      gidProofDocumentKey: tempData.gidProofDocumentKey,
      gresidentialDocumentKey: tempData.gresidentialDocumentKey,
      oldMarriageCerModDocument: watch("oldMarriageCerModDocument"),
      bidProofDocumentKey: tempData.bidProofDocumentKey,
      bresidentialDocumentKey: tempData.bresidentialDocumentKey,
      bresidentialDocument: watch("bresidentialDocument"),
      ustampDetail: tempData.ustampDetail,
      ustampDetailPath: tempData.ustampDetailPath,
      bageProofDocumentKey: tempData.bageProofDocumentKey,
      gaadharNo: tempData.gaadharNo,
      serviceId: 12,
      trnApplicantId: getValues("applicationId"),
      copies: getValues("copies"),

      //photo encryption
      gadharCardModDocument: encryptedGadharCardModDocument,
      gaddressProofModDocument: encryptedGaddressProofModDocument,

      badharCardModDocument: encryptedBadharCardModDocument,
      baddressProofModDocument: encryptedBaddressProofModDocument,

      oldMarriageCerModDocument: encryptedOldMarriageCerModDocument,
    };
    // if (btnSaveText === "Save") {
    axios
      .post(
        `${urls.MR}/transaction/modOfMarCertificate/saveModOfMarCertificateRegistration`,
        finalBody,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        console.log("res321", res);
        if (res.status == 200 || res.status == 201) {
          swal("Applied!", "Application Applied Successfully !", "success");

          swal(
            language == "en" ? "Applied!" : "लागू केले!",
            language == "en"
              ? "Application Applied Successfully !"
              : "अर्ज यशस्वीरित्या लागू झाला!",
            "success",
          );

          router.push({
            pathname: `/marriageRegistration/Receipts/acknowledgmentReceiptmarathi`,
            query: {
              userId: user.id,
              serviceId: 12,
              id: res?.data?.message?.split("$")[1],
            },
          });
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // }
  };

  // Address Change
  const addressChange = (e) => {
    setValue("isApplicantGroomMod", e.target.checked);
    setValue("isApplicantBrideMod", e.target.checked);

    console.log("isApplicantGroom", getValues("isApplicantGroom"));
  };

  const getById = (id) => {
    if (id != null && id != undefined && id != "") {
      axios
        .get(
          `${urls.MR}/transaction/modOfMarCertificate/getapplicantById?applicationId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((r) => {
          console.log("r.data", r.data);
          setValue("marriageDateM", r.data.marriageDate);
          setValue("pplaceOfMarriageM", r.data.pplaceOfMarriage);
          setValue("pplaceOfMarriageMrM", r.data.pplaceOfMarriageMr);
          setValue("gtitleM", r.data.gtitle);
          setValue("gtitleMar", r.data.gtitle);
          setValue("gtitleMarM", r.data.gtitle);
          setValue("gfNameM", r.data.gfName);
          setValue("gmNameM", r.data.gmName);
          setValue("glNameM", r.data.glName);
          setValue("gtitleMrM", r.data.gtitleMr);
          setValue("gfNameMrM", r.data.gfNameMr);
          setValue("gmNameMrM", r.data.gmNameMr);
          setValue("glNameMrM", r.data.glNameMr);
          setValue("gbuildingNoM", r.data.gbuildingNo);
          setValue("gbuildingNameM", r.data.gbuildingName);
          setValue("groadNameM", r.data.groadName);
          setValue("glandmarkM", r.data.glandmark);
          setValue("gbuildingNoMrM", r.data.gbuildingNoMr);
          setValue("gbuildingNameMrM", r.data.gbuildingNameMr);
          setValue("groadNameMrM", r.data.groadNameMr);
          setValue("glandmarkMrM", r.data.glandmarkMr);
          setValue("gcityNameM", r.data.gcityName);
          setValue("gstateM", r.data.gstate);
          setValue("gcityNameMrM", r.data.gcityNameMr);
          setValue("gstateMrM", r.data.gstateMr);
          setValue("gpincodeM", r.data.gpincode);
          setValue("gmobileNoM", r.data.gmobileNo);
          setValue("gaadharNoM", r.data.gaadharNo);

          setValue("btitleM", r.data.btitle);
          setValue("btitleMar", r.data.btitle);
          setValue("btitleMarM", r.data.btitle);
          setValue("bfNameM", r.data.bfName);
          setValue("bmNameM", r.data.bmName);
          setValue("blNameM", r.data.blName);
          setValue("btitleMrM", r.data.btitleMr);
          setValue("bfNameMrM", r.data.bfNameMr);
          setValue("bmNameMrM", r.data.bmNameMr);
          setValue("blNameMrM", r.data.blNameMr);
          setValue("bbuildingNoM", r.data.bbuildingNo);
          setValue("bbuildingNameM", r.data.bbuildingName);
          setValue("broadNameM", r.data.broadName);
          setValue("blandmarkM", r.data.blandmark);
          setValue("bbuildingNoMrM", r.data.bbuildingNoMr);
          setValue("bbuildingNameMrM", r.data.bbuildingNameMr);
          setValue("broadNameMrM", r.data.broadNameMr);
          setValue("blandmarkMrM", r.data.blandmarkMr);
          setValue("bcityNameM", r.data.bcityName);
          setValue("bstateM", r.data.bstate);
          setValue("bcityNameMrM", r.data.bcityNameMr);
          setValue("bstateMrM", r.data.bstateMr);
          setValue("bpincodeM", r.data.bpincode);
          setValue("bmobileNoM", r.data.bmobileNo);
          setValue("baadharNoM", r.data.baadharNo);
          let oldAppId = r.data.trnApplicantId;

          console.log(oldAppId, "oldAppId");

          let certificateIssueDateTime;

          axios
            .get(
              `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${oldAppId}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              },
            )
            .then((re) => {
              certificateIssueDateTime = re.data.certificateIssueDateTime;
              setValue("registrationDate", re.data.registrationDate);
              console.log("re.data", re.data);
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });

          reset(r.data);

          // setValue("registrationDate", registrationDate);

          setShowData(true);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  useEffect(() => {
    console.log("router?.query?.pageMode", router?.query?.pageMode);
    getById(router?.query?.applicationId);
  }, [router?.query?.pageMode == "View"]);

  // ******************* area Zone ward***************************
  const [areaDropDown, setAreaDropDown] = useState([]);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [wardDropDown, setWardDropDown] = useState([]);

  useEffect(() => {
    !router.query.id && getZones();

    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAlll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setAreaDropDown(
          res.data?.map((j) => ({
            id: j?.area,
            zone: j?.zoneId,
            ward: j?.wardId,
            area: j?.areaId,
            areaDisplayNameEn:
              j?.areaName + " - " + j?.zoneName + " - " + j?.wardName,
            areaDisplayNameMr:
              j?.areaNamemr + " - " + j?.zoneNameMr + " - " + j?.wardNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Get Zone
    router.query.id &&
      axios
        .get(`${urls.CFCURL}/master/zone/getAll`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setZoneDropDown(
            res.data.zone.map((j, i) => ({
              srNo: i + 1,
              id: j.id,
              zoneEn: j.zoneName,
              zoneMr: j.zoneNameMr,
            })),
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });

    //Get Ward
    router.query.id &&
      axios
        .get(`${urls.CFCURL}/master/ward/getAll`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setWardDropDown(
            res.data.ward.map((j, i) => ({
              srNo: i + 1,
              id: j.id,
              wardEn: j.wardName,
              wardMr: j.wardNameMr,
            })),
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
  }, []);

  const getZones = () => {
    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getZoneByApplicationId`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) =>
        setZoneDropDown(
          res.data.map((zones) => ({
            id: zones.zoneId,
            zoneEn: zones.zoneName,
            zoneMr: zones.zoneNameMr,
          })),
        ),
      )
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getWards = (zoneId) => {
    // setLoader(true)
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId`,
        {
          params: { zoneId },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        setWardDropDown(
          res.data.map((wards) => ({
            id: wards.wardId,
            wardEn: wards.wardName,
            wardMr: wards.wardNameMr,
          })),
        );
        // setLoader(false)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getAreas = (zoneId, wardId) => {
    // setLoader(true)
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId`,
        {
          params: { zoneId, wardId },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        setAreaDropDown(
          res.data.map((areas) => ({
            zone: areas?.zoneId,
            ward: areas?.wardId,
            area: areas?.areaId,
            id: areas?.areaId,
            areaDisplayNameEn:
              areas?.areaName +
              " - " +
              areas?.zoneName +
              " - " +
              areas?.wardName,
            areaDisplayNameMr:
              areas?.areaNamemr +
              " - " +
              areas?.zoneNameMr +
              " - " +
              areas?.wardNameMr,
          })),
        );
        // setLoader(false)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    console.log("errors32432", errors);
  }, [errors]);

  useEffect(() => {
    console.log(
      "color--->",
      watch("gfName") === watch("gfNameM"),
      watch("gfName"),
      watch("gfNameM"),
    );
    console.log(
      "color--->",
      watch("glName") === watch("glNameM"),
      watch("glName"),
      watch("glNameM"),
    );
  }, [watch("gfName"), watch("gfNameM"), watch("glName"), watch("glNameM")]);

  const handleColourChange = (x, y) => {
    if (watch(`${x}`)?.toString() === watch(`${y}`)?.toString()) {
      return "white";
    } else {
      return "PeachPuff";
    }
  };

  return (
    <div style={{ backgroundColor: "#F5F5F5" }}>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleApply)}>
            <ThemeProvider theme={theme}>
              <>
                {!props.preview && !props.onlyDoc && (
                  <>
                    <Paper
                      sx={{
                        marginLeft: 2,
                        marginRight: 2,
                        marginTop: 2,
                        marginBottom: 2,
                        padding: 1,
                      }}
                    >
                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            <FormattedLabel id="onlyMIMC" />
                          </h3>
                        </div>
                      </div>
                      {router?.query?.pageMode == "View" ? (
                        <>
                          <div className={styles.row}>
                            {/* <div className={styles.row}> */}
                            <TextField
                              //  disabled
                              sx={{ width: 300 }}
                              id="standard-basic"
                              disabled={true}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              // defaultValue={"abc"}
                              label={
                                <FormattedLabel id="serviceName" required />
                              }
                              variant="standard"
                              {...register("serviceName")}
                            />
                            {/* </div> */}
                            {/* <div className={styles.row}> */}
                            <FormControl sx={{ marginTop: 0 }}>
                              <Controller
                                control={control}
                                name="applicationDate"
                                defaultValue={null}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <DatePicker
                                      disabled={true}
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 14 }}>
                                          {
                                            <FormattedLabel
                                              id="applicationDate"
                                              required
                                            />
                                          }
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(date) =>
                                        field.onChange(
                                          moment(date).format("YYYY-MM-DD"),
                                        )
                                      }
                                      selected={field.value}
                                      center
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          fullWidth
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
                            </FormControl>
                            {/* </div> */}
                          </div>
                        </>
                      ) : (
                        showAccordian && (
                          <>
                            <Accordion
                              sx={{
                                marginLeft: "5vh",
                                marginRight: "5vh",
                                marginTop: "2vh",
                                marginBottom: "2vh",
                              }}
                            >
                              <AccordionSummary
                                sx={{
                                  backgroundColor: "#0070f3",
                                  color: "white",
                                  textTransform: "uppercase",
                                }}
                                expandIcon={
                                  <ExpandMoreIcon sx={{ color: "white" }} />
                                }
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                backgroundColor="#0070f3"
                              >
                                <Typography>
                                  {<FormattedLabel id="modInMC1" />}
                                  {/* 1) Filter (Registration Number *) */}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className={styles.row}>
                                  <div>
                                    <TextField
                                      //  disabled
                                      sx={{ width: 280 }}
                                      id="standard-basic"
                                      label={
                                        <FormattedLabel id="mRegNo" required />
                                      }
                                      variant="standard"
                                      {...register("mRegNoS")}
                                      // error={!!errors.aFName}
                                      // helperText={errors?.aFName ? errors.aFName.message : null}
                                    />
                                  </div>
                                  <div>
                                    <FormControl sx={{ marginTop: 0 }}>
                                      <Controller
                                        control={control}
                                        name="registrationDateS"
                                        defaultValue={null}
                                        render={({ field }) => (
                                          <LocalizationProvider
                                            dateAdapter={AdapterMoment}
                                          >
                                            <DatePicker
                                              inputFormat="DD/MM/YYYY"
                                              label={
                                                <span style={{ fontSize: 14 }}>
                                                  {
                                                    <FormattedLabel id="regDate" />
                                                  }
                                                </span>
                                              }
                                              value={field.value}
                                              onChange={(date) =>
                                                field.onChange(
                                                  moment(date).format(
                                                    "YYYY-MM-DD",
                                                  ),
                                                )
                                              }
                                              selected={field.value}
                                              center
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  size="small"
                                                  fullWidth
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
                                    </FormControl>
                                  </div>
                                  <div>
                                    <TextField
                                      // disabled
                                      sx={{ width: 230 }}
                                      id="standard-basic"
                                      label={
                                        <FormattedLabel id="marriageYear" />
                                      }
                                      //label={"Marriage Year"}
                                      variant="standard"
                                      {...register("marriageYearS")}
                                    />
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-around",
                              }}
                            >
                              <h2>
                                <FormattedLabel id="oR" />
                              </h2>
                            </div>
                            <Accordion
                              sx={{
                                marginLeft: "5vh",
                                marginRight: "5vh",
                                marginTop: "2vh",
                                marginBottom: "2vh",
                              }}
                            >
                              <AccordionSummary
                                sx={{
                                  backgroundColor: "#0070f3",
                                  color: "white",
                                  textTransform: "uppercase",
                                }}
                                expandIcon={
                                  <ExpandMoreIcon sx={{ color: "white" }} />
                                }
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                backgroundColor="#0070f3"
                              >
                                <Typography>
                                  {<FormattedLabel id="modInMC2" />}
                                  {/* 2) Filter (Zone * ,marriage date *,groomFName
                                ,groomLName ,brideFName ,brideLName) */}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className={styles.row}>
                                  <div>
                                    <FormControl
                                      variant="standard"
                                      sx={{ marginTop: 2 }}
                                      //error={!!errors.zoneKey}
                                    >
                                      <InputLabel id="demo-simple-select-standard-label">
                                        <FormattedLabel id="zone" required />
                                      </InputLabel>
                                      <Controller
                                        render={({ field }) => (
                                          <Select
                                            //sx={{ width: 230 }}
                                            value={field.value}
                                            onChange={(value) => {
                                              field.onChange(value);
                                              console.log(
                                                "Zone Key: ",
                                                value.target.value,
                                              );
                                              setTemp1(value.target.value);
                                            }}
                                            label="Zone Name *"
                                          >
                                            {zoneKeys &&
                                              zoneKeys.map((zoneKey, index) => (
                                                <MenuItem
                                                  key={index}
                                                  value={zoneKey.id}
                                                >
                                                  {/* {zoneKey.zoneKey} */}

                                                  {language == "en"
                                                    ? zoneKey?.zoneName
                                                    : zoneKey?.zoneNameMr}
                                                </MenuItem>
                                              ))}
                                          </Select>
                                        )}
                                        name="zoneKeyS"
                                        control={control}
                                        defaultValue=""
                                      />
                                      {/* <FormHelperText>
                {errors?.zoneKey ? errors.zoneKey.message : null}
              </FormHelperText> */}
                                    </FormControl>
                                  </div>
                                  <div>
                                    <FormControl
                                      variant="standard"
                                      sx={{ marginTop: 2 }}
                                      //error={!!errors.wardKey}
                                    >
                                      <InputLabel id="demo-simple-select-standard-label">
                                        <FormattedLabel id="ward" />
                                      </InputLabel>
                                      <Controller
                                        render={({ field }) => (
                                          <Select
                                            value={field.value}
                                            onChange={(value) =>
                                              field.onChange(value)
                                            }
                                            label="Ward Name *"
                                          >
                                            {wardKeys &&
                                              wardKeys.map((wardKey, index) => (
                                                <MenuItem
                                                  key={index}
                                                  value={wardKey.id}
                                                >
                                                  {/* {wardKey.wardKey} */}
                                                  {language == "en"
                                                    ? wardKey?.wardName
                                                    : wardKey?.wardNameMr}
                                                </MenuItem>
                                              ))}
                                          </Select>
                                        )}
                                        name="wardKeyS"
                                        control={control}
                                        defaultValue=""
                                      />
                                      {/* <FormHelperText>
                  {errors?.wardKey ? errors.wardKey.message : null}
                </FormHelperText> */}
                                    </FormControl>
                                  </div>
                                  <div>
                                    <FormControl sx={{ marginTop: 0 }}>
                                      <Controller
                                        control={control}
                                        name="marriageDateS"
                                        defaultValue={null}
                                        render={({ field }) => (
                                          <LocalizationProvider
                                            dateAdapter={AdapterMoment}
                                          >
                                            <DatePicker
                                              inputFormat="DD/MM/YYYY"
                                              label={
                                                <span style={{ fontSize: 14 }}>
                                                  {
                                                    <FormattedLabel
                                                      id="marriageDate"
                                                      required
                                                    />
                                                  }
                                                </span>
                                              }
                                              value={field.value}
                                              onChange={(date) =>
                                                field.onChange(
                                                  moment(date).format(
                                                    "YYYY-MM-DD",
                                                  ),
                                                )
                                              }
                                              selected={field.value}
                                              center
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  size="small"
                                                  fullWidth
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
                                    </FormControl>
                                  </div>
                                </div>

                                <div className={styles.row}>
                                  <div>
                                    <TextField
                                      //  disabled
                                      sx={{ width: 230 }}
                                      id="standard-basic"
                                      // defaultValue={"abc"}
                                      label={
                                        <FormattedLabel
                                          id="groomFName"
                                          required
                                        />
                                      }
                                      variant="standard"
                                      {...register("groomFNameS")}
                                    />
                                  </div>
                                  <div>
                                    <TextField
                                      //  disabled
                                      sx={{ width: 230 }}
                                      id="standard-basic"
                                      // defaultValue={"abc"}
                                      label={<FormattedLabel id="groomMName" />}
                                      variant="standard"
                                      {...register("groomMNameS")}
                                    />
                                  </div>
                                  <div>
                                    <TextField
                                      //  disabled
                                      sx={{ width: 230 }}
                                      id="standard-basic"
                                      // defaultValue={"abc"}
                                      label={
                                        <FormattedLabel
                                          id="groomLName"
                                          required
                                        />
                                      }
                                      variant="standard"
                                      {...register("groomLNameS")}
                                    />
                                  </div>
                                </div>
                                <div className={styles.row}>
                                  <div>
                                    <TextField
                                      //  disabled
                                      sx={{ width: 230 }}
                                      id="standard-basic"
                                      // defaultValue={"abc"}
                                      label={
                                        <FormattedLabel
                                          id="brideFName"
                                          required
                                        />
                                      }
                                      variant="standard"
                                      {...register("brideFNameS")}
                                    />
                                  </div>
                                  <div>
                                    <TextField
                                      //  disabled
                                      sx={{ width: 230 }}
                                      id="standard-basic"
                                      // defaultValue={"abc"}
                                      label={<FormattedLabel id="brideMName" />}
                                      variant="standard"
                                      {...register("brideMNameS")}
                                    />
                                  </div>
                                  <div>
                                    <TextField
                                      //  disabled
                                      sx={{ width: 230 }}
                                      id="standard-basic"
                                      // defaultValue={"abc"}
                                      label={
                                        <FormattedLabel
                                          id="brideLName"
                                          required
                                        />
                                      }
                                      variant="standard"
                                      {...register("brideLNameS")}
                                    />
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>

                            <div className={styles.row}>
                              <div>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  // disabled={validateSearch()}
                                  onClick={() => {
                                    searchData();
                                  }}
                                >
                                  {<FormattedLabel id="search" />}
                                  {/* Search */}
                                </Button>
                              </div>
                            </div>
                          </>
                        )
                      )}
                    </Paper>
                  </>
                )}
                {router.query.pageMode == "Edit" ||
                  (router.query.pageMode == "View" && (
                    <HistoryComponent
                      serviceId={12}
                      applicationId={router?.query?.id}
                    />
                  ))}
                {showData ? (
                  <Paper
                    sx={{
                      marginLeft: 2,
                      marginRight: 2,
                      marginTop: 5,
                      marginBottom: 5,
                      padding: 5,
                      // border: 1,
                      // borderColor: 'grey.500',
                    }}
                  >
                    {/* <div className={styles.details}>
                      <div className={styles.h1Tag}>
                        <h3
                          style={{
                            color: "white",
                            marginTop: "7px",
                          }}
                        >
                          <FormattedLabel id="onlyMIMC" />
                        
                        </h3>
                      </div>
                    </div> */}

                    {!props.onlyDoc && (
                      <>
                        <Accordion
                          sx={{
                            marginLeft: "5vh",
                            marginRight: "5vh",
                            marginTop: "2vh",
                            marginBottom: "2vh",
                          }}
                        >
                          <AccordionSummary
                            sx={{
                              backgroundColor: "#0070f3",
                              color: "white",
                              textTransform: "uppercase",
                            }}
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            }
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            backgroundColor="#0070f3"
                            // sx={{
                            //   backgroundColor: '0070f3',
                            // }}
                          >
                            <Typography>
                              {" "}
                              <FormattedLabel id="ApplicatDetails" />
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container style={{ marginLeft: "4vw" }}>
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={4}
                                xl={4}
                                style={{
                                  // display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <FormControl
                                  //  disabled={disable}
                                  variant="standard"
                                  // error={!!error.areaKey}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="area" />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        sx={{ width: "250px" }}
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        // @ts-ignore
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          let tempObjForZoneAndWard =
                                            areaDropDown?.find(
                                              (j) =>
                                                j?.area == value.target.value,
                                            );
                                          getWards(tempObjForZoneAndWard?.zone);
                                          setValue(
                                            "zoneKey",
                                            tempObjForZoneAndWard?.zone,
                                          );
                                          setValue(
                                            "wardKey",
                                            tempObjForZoneAndWard?.ward,
                                          );
                                        }}
                                        label="areaKey"
                                      >
                                        {areaDropDown &&
                                          areaDropDown.map((value) => (
                                            <MenuItem
                                              key={value?.id}
                                              value={
                                                //@ts-ignore
                                                value?.area
                                              }
                                            >
                                              {language == "en"
                                                ? //@ts-ignore
                                                  value?.areaDisplayNameEn
                                                : // @ts-ignore
                                                  value?.areaDisplayNameMr}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="areaKey"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {/* {error?.areaKey ? error.areaKey.message : null} */}
                                  </FormHelperText>
                                </FormControl>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={4}
                                xl={4}
                                style={{
                                  // display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <FormControl
                                  // disabled={disable}
                                  variant="standard"
                                  // error={!!error.zoneKey}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="zone" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        sx={{ width: "250px" }}
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        // @ts-ignore
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          !router.query.id &&
                                            getWards(value.target.value);
                                          !router.query.id &&
                                            setValue("wardKey", "");
                                          !router.query.id &&
                                            setValue("areaKey", "");
                                        }}
                                        label="zoneKey"
                                      >
                                        {zoneDropDown &&
                                          zoneDropDown.map((value, index) => (
                                            <MenuItem
                                              key={index}
                                              value={
                                                //@ts-ignore
                                                value?.id
                                              }
                                            >
                                              {language == "en"
                                                ? //@ts-ignore
                                                  value?.zoneEn
                                                : // @ts-ignore
                                                  value?.zoneMr}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="zoneKey"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {/* {error?.zoneKey ? error.zoneKey.message : null} */}
                                  </FormHelperText>
                                </FormControl>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={4}
                                xl={4}
                                style={{
                                  // display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <FormControl
                                  //  disabled={disable}
                                  variant="standard"
                                  // error={!!error.wardKey}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="ward" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        sx={{ width: "250px" }}
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        // @ts-ignore
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          !router.query.id &&
                                            getAreas(
                                              watch("zoneKey"),
                                              value.target.value,
                                            );
                                        }}
                                        label="wardKey"
                                      >
                                        {wardDropDown &&
                                          wardDropDown.map((value, index) => (
                                            <MenuItem
                                              key={index}
                                              value={
                                                //@ts-ignore
                                                value.id
                                              }
                                            >
                                              {language == "en"
                                                ? //@ts-ignore
                                                  value.wardEn
                                                : // @ts-ignore
                                                  value?.wardMr}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="wardKey"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {/* {error?.wardKey ? error.wardKey.message : null} */}
                                  </FormHelperText>
                                </FormControl>
                              </Grid>
                            </Grid>

                            {/* <div className={styles.row}>
                              <div>
                                <FormControl
                                  variant="standard"
                                  sx={{ marginTop: 2 }}
                                  //error={!!errors.zoneKey}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="zone" />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled
                                        //sx={{ width: 230 }}
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          console.log(
                                            "Zone Key: ",
                                            value.target.value,
                                          );
                                          setTemp1(value.target.value);
                                        }}
                                        label="Zone Name *"
                                      >
                                        {zoneKeys &&
                                          zoneKeys.map((zoneKey, index) => (
                                            <MenuItem
                                              key={index}
                                              value={zoneKey.id}
                                            >
                                             

                                              {language == "en"
                                                ? zoneKey?.zoneName
                                                : zoneKey?.zoneNameMr}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="zoneKey"
                                    control={control}
                                    defaultValue=""
                                  />
                                
                                </FormControl>
                              </div>
                              <div>
                                <FormControl
                                  variant="standard"
                                  sx={{ marginTop: 2 }}
                                  //error={!!errors.wardKey}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="ward" />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled
                                        value={field.value}
                                        onChange={(value) =>
                                          field.onChange(value)
                                        }
                                        label="Ward Name *"
                                      >
                                        {wardKeys &&
                                          wardKeys.map((wardKey, index) => (
                                            <MenuItem
                                              key={index}
                                              value={wardKey.id}
                                            >
                                             
                                              {language == "en"
                                                ? wardKey?.wardName
                                                : wardKey?.wardNameMr}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="wardKey"
                                    control={control}
                                    defaultValue=""
                                  />
                                 
                                </FormControl>
                              </div>
                            </div> */}
                            <div className={styles.row}>
                              {/* <div>
                                <FormControl
                                  variant="standard"
                                  error={!!errors.atitle}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    {<FormattedLabel id="title" required />}
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          setValue(
                                            "atitleMr",
                                            value.target.value,
                                          );
                                        }}
                                        label="Title *"
                                      >
                                        {atitles &&
                                          atitles.map((aTitle, index) => (
                                            <MenuItem
                                              key={index}
                                              value={aTitle.id}
                                            >
                                            
                                              {aTitle?.title}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="atitle"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.atitle
                                      ? errors.atitle.message
                                      : null}
                                 
                                  </FormHelperText>
                                </FormControl>
                              </div> */}

                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("afName") ? true : false) ||
                                      (router.query.afName ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="firstName" required />
                                  }
                                  // label=" Hello"
                                  variant="standard"
                                  {...register("afName")}
                                  error={!!errors.afName}
                                  helperText={
                                    errors?.afName
                                      ? errors.afName.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("amName") ? true : false) ||
                                      (router?.query?.amName ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  //label="Middle Name *"
                                  label={
                                    <FormattedLabel id="middleName" required />
                                  }
                                  variant="standard"
                                  {...register("amName")}
                                  error={!!errors.amName}
                                  helperText={
                                    errors?.amName
                                      ? errors.amName.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("alName") ? true : false) ||
                                      (router.query.alName ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  //label="Last Name *"
                                  label={
                                    <FormattedLabel id="lastName" required />
                                  }
                                  variant="standard"
                                  {...register("alName")}
                                  error={!!errors.alName}
                                  helperText={
                                    errors?.alName
                                      ? errors.alName.message
                                      : null
                                  }
                                />
                              </div>
                            </div>

                            <div className={styles.row}>
                              {/* <div>
                                <FormControl
                                  variant="standard"
                                  error={!!errors.atitleMr}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    {<FormattedLabel id="title" required />}
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled
                                        InputLabelProps={{
                                          shrink:
                                            (watch("atitleMr")
                                              ? true
                                              : false) ||
                                            (router.query.atitleMr
                                              ? true
                                              : false),
                                        }}
                                      
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          setValue(
                                            "atitle",
                                            value.target.value,
                                          );
                                        }}
                                        label="Title *"
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {atitles &&
                                          atitles.map((aTitleMr, index) => (
                                            <MenuItem
                                              key={index}
                                              value={aTitleMr.id}
                                            >
                                              {aTitleMr?.titlemr}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="atitleMr"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.atitleMr
                                      ? errors.atitleMr.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}

                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("afNameMr") ? true : false) ||
                                      (router.query.afNameMr ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="firstNamemr" required />
                                  }
                                  // label=" Hello"
                                  variant="standard"
                                  {...register("afNameMr")}
                                  error={!!errors.afNameMr}
                                  helperText={
                                    errors?.afNameMr
                                      ? errors.afNameMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("amNameMr") ? true : false) ||
                                      (router.query.amNameMr ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  //label="Middle Name *"
                                  label={
                                    <FormattedLabel
                                      id="middleNamemr"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  {...register("amNameMr")}
                                  error={!!errors.amNameMr}
                                  helperText={
                                    errors?.amNameMr
                                      ? errors.amNameMr.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("alNameMr") ? true : false) ||
                                      (router.query.alNameMr ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  //label="Last Name *"
                                  label={
                                    <FormattedLabel id="lastNamemr" required />
                                  }
                                  variant="standard"
                                  {...register("alNameMr")}
                                  error={!!errors.alNameMr}
                                  helperText={
                                    errors?.alNameMr
                                      ? errors.alNameMr.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                            <div
                              className={styles.row}
                              style={{ marginRight: "50%" }}
                            ></div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("aflatBuildingNo")
                                        ? true
                                        : false) ||
                                      (router.query.aflatBuildingNo
                                        ? true
                                        : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="flatBuildingNo"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  {...register("aflatBuildingNo")}
                                  error={!!errors.aflatBuildingNo}
                                  helperText={
                                    errors?.aflatBuildingNo
                                      ? errors.aflatBuildingNo.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("abuildingName") ? true : false) ||
                                      (router.query.abuildingName
                                        ? true
                                        : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="buildingName"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  {...register("abuildingName")}
                                  error={!!errors.abuildingName}
                                  helperText={
                                    errors?.abuildingName
                                      ? errors.abuildingName.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("aroadName") ? true : false) ||
                                      (router.query.aroadName ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="roadName" required />
                                  }
                                  variant="standard"
                                  {...register("aroadName")}
                                  error={!!errors.aroadName}
                                  helperText={
                                    errors?.aroadName
                                      ? errors.aroadName.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("alandmark") ? true : false) ||
                                      (router.query.alandmark ? true : false),
                                  }}
                                  //disabled
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="Landmark" required />
                                  }
                                  variant="standard"
                                  {...register("alandmark")}
                                  error={!!errors.alandmark}
                                  helperText={
                                    errors?.alandmark
                                      ? errors.alandmark.message
                                      : null
                                  }
                                />
                              </div>
                            </div>

                            <div className={styles.row}>
                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("aflatBuildingNoMr")
                                        ? true
                                        : false) ||
                                      (router.query.aflatBuildingNoMr
                                        ? true
                                        : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="flatBuildingNomr"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  {...register("aflatBuildingNoMr")}
                                  error={!!errors.aflatBuildingNoMr}
                                  helperText={
                                    errors?.aflatBuildingNoMr
                                      ? errors.aflatBuildingNoMr.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("abuildingNameMr")
                                        ? true
                                        : false) ||
                                      (router.query.abuildingNameMr
                                        ? true
                                        : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="buildingNamemr"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  {...register("abuildingNameMr")}
                                  error={!!errors.abuildingNameMr}
                                  helperText={
                                    errors?.abuildingNameMr
                                      ? errors.abuildingNameMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("aroadNameMr") ? true : false) ||
                                      (router.query.aroadNameMr ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="roadNamemr" required />
                                  }
                                  variant="standard"
                                  {...register("aroadNameMr")}
                                  error={!!errors.aroadNameMr}
                                  helperText={
                                    errors?.aroadNameMr
                                      ? errors.aroadNameMr.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  disabled
                                  //disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("alandmarkMr") ? true : false) ||
                                      (router.query.alandmarkMr ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="Landmarkmr" required />
                                  }
                                  variant="standard"
                                  {...register("alandmarkMr")}
                                  error={!!errors.alandmarkMr}
                                  helperText={
                                    errors?.alandmarkMr
                                      ? errors.alandmarkMr.message
                                      : null
                                  }
                                />
                              </div>
                            </div>

                            <div
                              className={
                                styles.row
                              } /* style={{ marginRight: "25%" }} */
                            >
                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("acityName") ? true : false) ||
                                      (router.query.acityName ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="cityName" required />
                                  }
                                  variant="standard"
                                  {...register("acityName")}
                                  error={!!errors.acityName}
                                  helperText={
                                    errors?.acityName
                                      ? errors.acityName.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("astate") ? true : false) ||
                                      (router.query.astate ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="State" required />}
                                  variant="standard"
                                  {...register("astate")}
                                  error={!!errors.astate}
                                  helperText={
                                    errors?.astate
                                      ? errors.astate.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("acityNameMr") ? true : false) ||
                                      (router.query.acityNameMr ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="cityNamemr" required />
                                  }
                                  variant="standard"
                                  {...register("acityNameMr")}
                                  error={!!errors.acityNameMr}
                                  helperText={
                                    errors?.acityNameMr
                                      ? errors.acityNameMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("astateMr") ? true : false) ||
                                      (router.query.astateMr ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="statemr" required />
                                  }
                                  variant="standard"
                                  {...register("astateMr")}
                                  error={!!errors.astateMr}
                                  helperText={
                                    errors?.astateMr
                                      ? errors.astateMr.message
                                      : null
                                  }
                                />
                              </div>
                            </div>

                            <div
                              className={styles.row}
                              // style={{ marginRight: "75%" }}
                            >
                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("apincode") ? true : false) ||
                                      (router.query.apincode ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="pincode" required />
                                  }
                                  variant="standard"
                                  {...register("apincode")}
                                  error={!!errors.apincode}
                                  helperText={
                                    errors?.apincode
                                      ? errors.apincode.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("aemail") ? true : false) ||
                                      (router.query.aemail ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="email" required />}
                                  variant="standard"
                                  {...register("aemail")}
                                  error={!!errors.aemail}
                                  helperText={
                                    errors?.aemail
                                      ? errors.aemail.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  disabled
                                  InputLabelProps={{
                                    shrink:
                                      (watch("amobileNo") ? true : false) ||
                                      (router.query.amobileNo ? true : false),
                                  }}
                                  // disabled={true}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="mobileNo" required />
                                  }
                                  variant="standard"
                                  {...register("amobileNo")}
                                  error={!!errors.amobileNo}
                                  helperText={
                                    errors?.amobileNo
                                      ? errors.amobileNo.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                        <Accordion
                          sx={{
                            marginLeft: "5vh",
                            marginRight: "5vh",
                            marginTop: "2vh",
                            marginBottom: "2vh",
                          }}
                        >
                          <AccordionSummary
                            sx={{
                              backgroundColor: "#0070f3",
                              color: "white",
                              textTransform: "uppercase",
                            }}
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            }
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            backgroundColor="#0070f3"
                          >
                            <Typography>
                              <FormattedLabel id="marrigeDetails" />
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="oldLabel" />
                                  {/* Old Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <FormControl
                                  sx={{ marginTop: 0 }}
                                  error={!!errors.marriageDate}
                                >
                                  <Controller
                                    control={control}
                                    name="marriageDate"
                                    defaultValue={null}
                                    render={({ field }) => (
                                      <LocalizationProvider
                                        dateAdapter={AdapterMoment}
                                      >
                                        <DatePicker
                                          disabled={true}
                                          inputFormat="DD/MM/YYYY"
                                          label={
                                            <span style={{ fontSize: 14 }}>
                                              {" "}
                                              {
                                                <FormattedLabel
                                                  id="marrigeDate"
                                                  required
                                                />
                                              }
                                            </span>
                                          }
                                          value={field.value}
                                          onChange={(date) =>
                                            field.onChange(
                                              moment(date).format("YYYY-MM-DD"),
                                            )
                                          }
                                          selected={field.value}
                                          center
                                          renderInput={(params) => (
                                            <TextField
                                              disabled={true}
                                              {...params}
                                              size="small"
                                              fullWidth
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
                                    {errors?.marriageDate
                                      ? errors.marriageDate.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  autoFocus
                                  InputLabelProps={{
                                    shrink:
                                      (watch("pplaceOfMarriage")
                                        ? true
                                        : false) ||
                                      (router.query.pplaceOfMarriage
                                        ? true
                                        : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="placeofMarriage"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  {...register("pplaceOfMarriage")}
                                  error={!!errors?.pplaceOfMarriage}
                                  helperText={
                                    errors?.pplaceOfMarriage
                                      ? errors.pplaceOfMarriage.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink:
                                      (watch("pplaceOfMarriageMr")
                                        ? true
                                        : false) ||
                                      (router.query.pplaceOfMarriageMr
                                        ? true
                                        : false),
                                  }}
                                  disabled={true}
                                  autoFocus
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="placeofMarriage1"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  {...register("pplaceOfMarriageMr")}
                                  error={!!errors?.pplaceOfMarriageMr}
                                  helperText={
                                    errors?.pplaceOfMarriageMr
                                      ? errors.pplaceOfMarriageMr.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="newLabel" />
                                  {/* New Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <FormControl
                                  sx={{ marginTop: 0 }}
                                  error={!!errors.marriageDateM}
                                >
                                  <Controller
                                    control={control}
                                    name="marriageDateM"
                                    defaultValue={null}
                                    render={({ field }) => (
                                      <LocalizationProvider
                                        dateAdapter={AdapterMoment}
                                      >
                                        <DatePicker
                                          disabled={disabled}
                                          inputFormat="DD/MM/YYYY"
                                          label={
                                            <span style={{ fontSize: 14 }}>
                                              {" "}
                                              {
                                                <FormattedLabel
                                                  id="marrigeDate"
                                                  required
                                                />
                                              }
                                            </span>
                                          }
                                          value={field.value}
                                          onChange={(date) =>
                                            field.onChange(
                                              moment(date).format("YYYY-MM-DD"),
                                            )
                                          }
                                          selected={field.value}
                                          center
                                          renderInput={(params) => (
                                            <TextField
                                              disabled={disabled}
                                              {...params}
                                              size="small"
                                              fullWidth
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
                                    {errors?.marriageDateM
                                      ? errors.marriageDateM.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div>

                              <div>
                                {/* <TextField
                                  disabled={disabled}
                                  autoFocus
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="placeofMarriage" required />}
                                  variant="standard"
                                  {...register("pplaceOfMarriageM")}
                                  error={!!errors?.pplaceOfMarriageM}
                                  helperText={
                                    errors?.pplaceOfMarriageM ? errors.pplaceOfMarriageM.message : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"pplaceOfMarriageM"}
                                  labelName={"placeofMarriage"}
                                  fieldName={"pplaceOfMarriageM"}
                                  updateFieldName={"pplaceOfMarriageMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  color={() =>
                                    handleColourChange(
                                      "pplaceOfMarriageM",
                                      "pplaceOfMarriage",
                                    )
                                  }
                                  disabled={disabled}
                                  label={
                                    <FormattedLabel
                                      id="placeofMarriage"
                                      required
                                    />
                                  }
                                  width={230}
                                  error={!!errors.pplaceOfMarriageM}
                                  helperText={
                                    errors?.pplaceOfMarriageM
                                      ? errors.pplaceOfMarriageM.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                {/* <TextField
                                  InputLabelProps={{
                                    shrink: true,
                                    // (watch('pplaceOfMarriageMrM')
                                    //   ? true
                                    //   : false) ||
                                    // (router.query.pplaceOfMarriageMrM
                                    //   ? true
                                    //   : false),
                                  }}
                                  disabled={disabled}
                                  autoFocus
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="placeofMarriage1"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  {...register("pplaceOfMarriageMrM")}
                                  error={!!errors?.pplaceOfMarriageMrM}
                                  helperText={
                                    errors?.pplaceOfMarriageMrM
                                      ? errors.pplaceOfMarriageMrM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"pplaceOfMarriageMrM"}
                                  labelName={"placeofMarriage1"}
                                  fieldName={"pplaceOfMarriageMrM"}
                                  updateFieldName={"pplaceOfMarriageM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  color={() =>
                                    handleColourChange(
                                      "pplaceOfMarriageMrM",
                                      "pplaceOfMarriageMr",
                                    )
                                  }
                                  disabled={disabled}
                                  width={230}
                                  label={
                                    <FormattedLabel
                                      id="placeofMarriage1"
                                      required
                                    />
                                  }
                                  error={!!errors.pplaceOfMarriageMrM}
                                  helperText={
                                    errors?.pplaceOfMarriageMrM
                                      ? errors.pplaceOfMarriageMrM.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                        <Accordion
                          sx={{
                            marginLeft: "5vh",
                            marginRight: "5vh",
                            marginTop: "2vh",
                            marginBottom: "2vh",
                          }}
                        >
                          <AccordionSummary
                            sx={{
                              backgroundColor: "#0070f3",
                              color: "white",
                              textTransform: "uppercase",
                            }}
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            }
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            backgroundColor="#0070f3"
                            // sx={{
                            //   backgroundColor: '0070f3',
                            // }}
                          >
                            <Typography>
                              {" "}
                              <FormattedLabel id="groomDetail" />
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div style={{ marginLeft: "25px" }}>
                              <FormControlLabel
                                // disabled={disabled ? true : getValues("isApplicantBride") ? true : false}
                                control={
                                  <Checkbox
                                    checked={
                                      getValues("isApplicantGroomMod")
                                        ? true
                                        : false
                                    }
                                  />
                                }
                                label=<Typography>
                                  <b>
                                    <FormattedLabel id="ApplicatCheck1mod" />
                                  </b>
                                </Typography>
                                onChange={(e) => {
                                  addressChange(e);
                                }}
                              />
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="oldLabel" />
                                  {/* Old Values*/}
                                </h3>
                              </div>
                            </div>

                            <div className={styles.row}>
                              {/* <div>
                                <FormControl
                                  variant="standard"
                                  error={!!errors.gtitle}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="title1" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled={true}
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          setValue(
                                            "gtitleMar",
                                            value.target.value,
                                          );
                                        }}
                                        label="Title  "
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {gTitles &&
                                          gTitles.map((gTitle, index) => (
                                            <MenuItem
                                              key={index}
                                              value={gTitle.id}
                                            >
                                              {gTitle.gTitle}

                                            
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="gtitle"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.gtitle
                                      ? errors.gtitle.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}

                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gFName") ? true : false) ||
                                    // (router.query.gFName ? true : false),
                                  }}
                                  disabled={true}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="firstName" required />
                                  }
                                  // label="First Name  "
                                  variant="standard"
                                  {...register("gfName")}
                                  error={!!errors?.gfName}
                                  helperText={
                                    errors?.gfName
                                      ? errors.gfName.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gMName") ? true : false) ||
                                    // (router.query.gMName ? true : false),
                                  }}
                                  // InputLabelProps={{ shrink: true }}
                                  disabled={true}
                                  id="standard-basic"
                                  // label="Middle Name  "
                                  label={
                                    <FormattedLabel id="middleName" required />
                                  }
                                  variant="standard"
                                  {...register("gmName")}
                                  error={!!errors.gmName}
                                  helperText={
                                    errors?.gmName
                                      ? errors.gmName.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gLName") ? true : false) ||
                                    // (router.query.gLName ? true : false),
                                  }}
                                  disabled={true}
                                  id="standard-basic"
                                  // label="Last Name  "
                                  label={
                                    <FormattedLabel id="lastName" required />
                                  }
                                  variant="standard"
                                  {...register("glName")}
                                  error={!!errors.glName}
                                  helperText={
                                    errors?.glName
                                      ? errors.glName.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="newLabel" />
                                  {/* New Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              {/* <div>
                                <FormControl
                                  variant="standard"
                                  error={!!errors.gtitleM}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="title1" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled={disabled}
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          setValue(
                                            "gtitleMarM",
                                            value.target.value,
                                          );
                                        }}
                                        label="Title  "
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {gTitles &&
                                          gTitles.map((gTitle, index) => (
                                            <MenuItem
                                              key={index}
                                              value={gTitle.id}
                                            >
                                              {gTitle.gTitle}

                                            
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="gtitleM"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.gtitleM
                                      ? errors.gtitleM.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}

                              <div>
                                {/* <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gFName") ? true : false) ||
                                    // (router.query.gFName ? true : false),
                                  }}
                                  disabled={disabled}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="firstName" required />
                                  }
                                  // label="First Name  "
                                  variant="standard"
                                  {...register("gfNameM")}
                                  error={!!errors.gfNameM}
                                  helperText={
                                    errors?.gfNameM
                                      ? errors.gfNameM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"gfNameM"}
                                  labelName={"firstName"}
                                  fieldName={"gfNameM"}
                                  // color={
                                  //   watch("gfName") === watch("gfNameM")
                                  //     ? "white"
                                  //     : "PeachPuff"
                                  // }
                                  color={() =>
                                    handleColourChange("gfNameM", "gfName")
                                  }
                                  updateFieldName={"gfNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  disabled={disabled}
                                  // disabled={false}
                                  label={
                                    <FormattedLabel id="firstName" required />
                                  }
                                  error={!!errors.gfNameM}
                                  helperText={
                                    errors?.gfNameM
                                      ? errors.gfNameM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>

                              <div>
                                {/* <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  disabled={disabled}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="middleName" required />
                                  }
                                  variant="standard"
                                  {...register("gmNameM")}
                                  error={!!errors.gmNameM}
                                  helperText={
                                    errors?.gmNameM
                                      ? errors.gmNameM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"gmNameM"}
                                  labelName={"middleName"}
                                  fieldName={"gmNameM"}
                                  updateFieldName={"gmNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange("gmNameM", "gmName")
                                  }
                                  label={
                                    <FormattedLabel id="middleName" required />
                                  }
                                  error={!!errors.gmNameM}
                                  helperText={
                                    errors?.gmNameM
                                      ? errors.gmNameM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  disabled={disabled}
                                  id="standard-basic"
                                  // label="Last Name  "
                                  label={
                                    <FormattedLabel id="lastName" required />
                                  }
                                  variant="standard"
                                  {...register("glNameM")}
                                  error={!!errors.glNameM}
                                  helperText={
                                    errors?.glNameM
                                      ? errors.glNameM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"glNameM"}
                                  labelName={"lastName"}
                                  fieldName={"glNameM"}
                                  updateFieldName={"glNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  // color={
                                  //   watch("glName")?.toString() ===
                                  //   watch("glNameM")?.toString()
                                  //     ? "PeachPuff"
                                  //     : "white"
                                  // }
                                  color={() =>
                                    handleColourChange("glNameM", "glName")
                                  }
                                  disabled={disabled}
                                  label={
                                    <FormattedLabel id="lastName" required />
                                  }
                                  error={!!errors.glNameM}
                                  helperText={
                                    errors?.glNameM
                                      ? errors.glNameM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                            </div>

                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="oldLabel" />
                                  {/* Old Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              {/* <div>
                                <FormControl
                                  variant="standard"
                                  error={!!errors.gtitleMar}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="titlemr" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled={true}
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);

                                          setValue(
                                            "gtitle",
                                            value.target.value,
                                          );
                                        }}
                                        label="Title  "
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {gTitleMars &&
                                          gTitleMars.map((gTitleMar, index) => (
                                            <MenuItem
                                              key={index}
                                              value={gTitleMar.id}
                                            >
                                              {gTitleMar.gTitleMar}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="gtitleMar"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.gtitleMar
                                      ? errors.gtitleMar.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}

                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gFNameMr") ? true : false) ||
                                    // (router.query.gFNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="प्रथम नावं  "
                                  label={
                                    <FormattedLabel id="firstNamemr" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("gfNameMr")}
                                  error={!!errors.gfNameMr}
                                  helperText={
                                    errors?.gfNameMr
                                      ? errors.gfNameMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  id="standard-basic"
                                  // label="मधले नावं  "
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gMNameMr") ? true : false) ||
                                    // (router.query.gLNameMr ? true : false),
                                  }}
                                  label={
                                    <FormattedLabel
                                      id="middleNamemr"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("gmNameMr")}
                                  error={!!errors.gmNameMr}
                                  helperText={
                                    errors?.gmNameMr
                                      ? errors.gmNameMr.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gLNameMr") ? true : false) ||
                                    // (router.query.gLNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="आडनाव  "
                                  disabled={true}
                                  label={
                                    <FormattedLabel id="lastNamemr" required />
                                  }
                                  variant="standard"
                                  {...register("glNameMr")}
                                  error={!!errors.glNameMr}
                                  helperText={
                                    errors?.glNameMr
                                      ? errors.glNameMr.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="newLabel" />
                                  {/* New Values*/}
                                </h3>
                              </div>
                            </div>

                            <div className={styles.row}>
                              {/* <div>
                                <FormControl
                                  variant="standard"
                                  error={!!errors.gtitleMarM}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="titlemr" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled={disabled}
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);

                                          setValue(
                                            "gtitleM",
                                            value.target.value,
                                          );
                                        }}
                                        label="Title  "
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {gTitleMars &&
                                          gTitleMars.map((gTitleMar, index) => (
                                            <MenuItem
                                              key={index}
                                              value={gTitleMar.id}
                                            >
                                              {gTitleMar.gTitleMar}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="gtitleMarM"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.gtitleMarM
                                      ? errors.gtitleMarM.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}

                              <div>
                                {/* <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="firstNamemr" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("gfNameMrM")}
                                  error={!!errors.gfNameMrM}
                                  helperText={
                                    errors?.gfNameMrM
                                      ? errors.gfNameMrM.message
                                      : null
                                  }
                                /> */}
                                <Transliteration
                                  _key={"gfNameMrM"}
                                  width={230}
                                  labelName={"firstNamemr"}
                                  fieldName={"gfNameMrM"}
                                  updateFieldName={"gfNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  color={() =>
                                    handleColourChange("gfNameMrM", "gfNameMr")
                                  }
                                  disabled={disabled}
                                  label={
                                    <FormattedLabel id="firstNamemr" required />
                                  }
                                  error={!!errors.gfNameMrM}
                                  helperText={
                                    errors?.gfNameMrM
                                      ? errors.gfNameMrM.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                {/* <TextField
                                  id="standard-basic"
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  label={
                                    <FormattedLabel
                                      id="middleNamemr"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("gmNameMrM")}
                                  error={!!errors.gmNameMrM}
                                  helperText={
                                    errors?.gmNameMrM
                                      ? errors.gmNameMrM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"gmNameMrM"}
                                  labelName={"middleNamemr"}
                                  fieldName={"gmNameMrM"}
                                  updateFieldName={"gmNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange("gmNameMrM", "gmNameMr")
                                  }
                                  label={
                                    <FormattedLabel
                                      id="middleNamemr"
                                      required
                                    />
                                  }
                                  width={230}
                                  error={!!errors.gmNameMrM}
                                  helperText={
                                    errors?.gmNameMrM
                                      ? errors.gmNameMrM.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gLNameMr") ? true : false) ||
                                    // (router.query.gLNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="आडनाव  "
                                  disabled={disabled}
                                  label={
                                    <FormattedLabel id="lastNamemr" required />
                                  }
                                  variant="standard"
                                  {...register("glNameMrM")}
                                  error={!!errors.glNameMrM}
                                  helperText={
                                    errors?.glNameMrM
                                      ? errors.glNameMrM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"glNameMrM"}
                                  labelName={"lastNamemr"}
                                  fieldName={"glNameMrM"}
                                  updateFieldName={"glNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange("glNameMrM", "glNameMr")
                                  }
                                  label={
                                    <FormattedLabel id="lastNamemr" required />
                                  }
                                  error={!!errors.glNameMrM}
                                  helperText={
                                    errors?.glNameMrM
                                      ? errors.glNameMrM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                            </div>

                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="oldLabel" />
                                  {/* Old Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gBuildingNo") ? true : false) ||
                                    // (router.query.gBuildingNo ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="Flat/Building No. *"
                                  label={
                                    <FormattedLabel
                                      id="flatBuildingNo"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("gbuildingNo")}
                                  error={!!errors.gbuildingNo}
                                  helperText={
                                    errors?.gbuildingNo
                                      ? errors.gbuildingNo.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gBuildingName") ? true : false) ||
                                    // (router.query.gBuildingName ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="Apartment Name"
                                  label={
                                    <FormattedLabel
                                      id="buildingName"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("gbuildingName")}
                                  error={!!errors.gbuildingName}
                                  helperText={
                                    errors?.gbuildingName
                                      ? errors.gbuildingName.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gRoadName") ? true : false) ||
                                    // (router.query.gRoadName ? true : false),
                                  }}
                                  id="standard-basic"
                                  //  label="Road Name"
                                  label={
                                    <FormattedLabel id="roadName" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("groadName")}
                                  error={!!errors.groadName}
                                  helperText={
                                    errors?.groadName
                                      ? errors.groadName.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gLandmark") ? true : false) ||
                                    // (router.query.gLandmark ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="Landmark" required />
                                  }
                                  // label="Landmark"
                                  variant="standard"
                                  disabled={true}
                                  {...register("glandmark")}
                                  error={!!errors.glandmark}
                                  helperText={
                                    errors?.glandmark
                                      ? errors.glandmark.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="newLabel" />
                                  {/* New Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  style={{
                                    background: handleColourChange(
                                      "gbuildingNoM",
                                      "gbuildingNo",
                                    ),
                                  }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gBuildingNo") ? true : false) ||
                                    // (router.query.gBuildingNo ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="Flat/Building No. *"
                                  label={
                                    <FormattedLabel
                                      id="flatBuildingNo"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("gbuildingNoM")}
                                  error={!!errors.gbuildingNoM}
                                  helperText={
                                    errors?.gbuildingNoM
                                      ? errors.gbuildingNoM.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gBuildingName") ? true : false) ||
                                    // (router.query.gBuildingName ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="Apartment Name"
                                  label={
                                    <FormattedLabel
                                      id="buildingName"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("gbuildingNameM")}
                                  error={!!errors.gbuildingNameM}
                                  helperText={
                                    errors?.gbuildingNameM
                                      ? errors.gbuildingNameM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"gbuildingNameM"}
                                  labelName={"buildingName"}
                                  fieldName={"gbuildingNameM"}
                                  updateFieldName={"gbuildingNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  color={() =>
                                    handleColourChange(
                                      "gbuildingNameM",
                                      "gbuildingName",
                                    )
                                  }
                                  disabled={disabled}
                                  label={<FormattedLabel id="buildingName" />}
                                  error={!!errors.gbuildingNameM}
                                  helperText={
                                    errors?.gbuildingNameM
                                      ? errors.gbuildingNameM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gRoadName") ? true : false) ||
                                    // (router.query.gRoadName ? true : false),
                                  }}
                                  id="standard-basic"
                                  //  label="Road Name"
                                  label={
                                    <FormattedLabel id="roadName" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("groadNameM")}
                                  error={!!errors.groadNameM}
                                  helperText={
                                    errors?.groadNameM
                                      ? errors.groadNameM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"groadNameM"}
                                  labelName={"roadName"}
                                  fieldName={"groadNameM"}
                                  updateFieldName={"groadNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  color={() =>
                                    handleColourChange(
                                      "groadNameM",
                                      "groadName",
                                    )
                                  }
                                  disabled={disabled}
                                  label={
                                    <FormattedLabel id="roadName" required />
                                  }
                                  error={!!errors.groadNameM}
                                  helperText={
                                    errors?.groadNameM
                                      ? errors.groadNameM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gLandmark") ? true : false) ||
                                    // (router.query.gLandmark ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="Landmark" required />
                                  }
                                  // label="Landmark"
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("glandmarkM")}
                                  error={!!errors.glandmarkM}
                                  helperText={
                                    errors?.glandmarkM
                                      ? errors.glandmarkM.message
                                      : null
                                  }
                                /> */}
                                <Transliteration
                                  _key={"glandmarkM"}
                                  labelName={"Landmark"}
                                  fieldName={"glandmarkM"}
                                  updateFieldName={"glandmarkMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  color={() =>
                                    handleColourChange(
                                      "glandmarkM",
                                      "glandmark",
                                    )
                                  }
                                  disabled={disabled}
                                  label={
                                    <FormattedLabel id="Landmark" required />
                                  }
                                  error={!!errors.glandmarkM}
                                  helperText={
                                    errors?.glandmarkM
                                      ? errors.glandmarkM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                            </div>

                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="oldLabel" />
                                  {/* Old Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gBuildingNoMr") ? true : false) ||
                                    // (router.query.gBuildingNoMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="Flat/Building No. *"
                                  label={
                                    <FormattedLabel
                                      id="flatBuildingNomr"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("gbuildingNoMr")}
                                  error={!!errors.gbuildingNoMr}
                                  helperText={
                                    errors?.gbuildingNoMr
                                      ? errors.gbuildingNoMr.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gBuildingNameMr") ? true : false) ||
                                    // (router.query.gBuildingNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="Apartment Name"
                                  label={
                                    <FormattedLabel
                                      id="buildingNamemr"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("gbuildingNameMr")}
                                  error={!!errors.gbuildingNameMr}
                                  helperText={
                                    errors?.gbuildingNameMr
                                      ? errors.gbuildingNameMr.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gRoadNameMr") ? true : false) ||
                                    // (router.query.gRoadNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  //  label="Road Name"
                                  label={
                                    <FormattedLabel id="roadNamemr" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("groadNameMr")}
                                  error={!!errors.groadNameMr}
                                  helperText={
                                    errors?.groadNameMr
                                      ? errors.groadNameMr.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gLandmarkMr") ? true : false) ||
                                    // (router.query.gLandmarkMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="Landmarkmr" required />
                                  }
                                  // label="Landmark"
                                  variant="standard"
                                  disabled={true}
                                  {...register("glandmarkMr")}
                                  error={!!errors.glandmarkMr}
                                  helperText={
                                    errors?.glandmarkMr
                                      ? errors.glandmarkMr.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="newLabel" />
                                  {/* New Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  style={{
                                    background: handleColourChange(
                                      "gbuildingNoMrM",
                                      "gbuildingNoMr",
                                    ),
                                  }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gBuildingNoMr") ? true : false) ||
                                    // (router.query.gBuildingNoMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="Flat/Building No. *"
                                  label={
                                    <FormattedLabel
                                      id="flatBuildingNomr"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("gbuildingNoMrM")}
                                  error={!!errors.gbuildingNoMrM}
                                  helperText={
                                    errors?.gbuildingNoMrM
                                      ? errors.gbuildingNoMrM.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gBuildingNameMr") ? true : false) ||
                                    // (router.query.gBuildingNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="Apartment Name"
                                  label={
                                    <FormattedLabel
                                      id="buildingNamemr"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("gbuildingNameMrM")}
                                  error={!!errors.gbuildingNameMrM}
                                  helperText={
                                    errors?.gbuildingNameM
                                      ? errors.gbuildingNameMrM.message
                                      : null
                                  }
                                /> */}
                                <Transliteration
                                  _key={"gbuildingNameMrM"}
                                  labelName={"buildingNamemr"}
                                  fieldName={"gbuildingNameMrM"}
                                  updateFieldName={"buildingNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  color={() =>
                                    handleColourChange(
                                      "gbuildingNameMrM",
                                      "gbuildingNameMr",
                                    )
                                  }
                                  disabled={disabled}
                                  label={<FormattedLabel id="buildingNamemr" />}
                                  error={!!errors.gbuildingNameMrM}
                                  helperText={
                                    errors?.gbuildingNameMrM
                                      ? errors.gbuildingNameMrM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gRoadNameMr") ? true : false) ||
                                    // (router.query.gRoadNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  //  label="Road Name"
                                  label={
                                    <FormattedLabel id="roadNamemr" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("groadNameMrM")}
                                  error={!!errors.groadNameMrM}
                                  helperText={
                                    errors?.groadNameMrM
                                      ? errors.groadNameMrM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"groadNameMrM"}
                                  labelName={"roadNamemr"}
                                  fieldName={"groadNameMrM"}
                                  updateFieldName={"groadNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange(
                                      "groadNameMrM",
                                      "groadNameMr",
                                    )
                                  }
                                  label={
                                    <FormattedLabel id="roadNamemr" required />
                                  }
                                  error={!!errors.groadNameMrM}
                                  helperText={
                                    errors?.groadNameMrM
                                      ? errors.groadNameMrM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gLandmarkMr") ? true : false) ||
                                    // (router.query.gLandmarkMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="Landmarkmr" required />
                                  }
                                  // label="Landmark"
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("glandmarkMrM")}
                                  error={!!errors.glandmarkMrM}
                                  helperText={
                                    errors?.glandmarkMrM
                                      ? errors.glandmarkMrM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"glandmarkMrM"}
                                  labelName={"Landmarkmr"}
                                  fieldName={"glandmarkMrM"}
                                  updateFieldName={"glandmarkM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  color={() =>
                                    handleColourChange(
                                      "glandmarkMrM",
                                      "glandmarkMr",
                                    )
                                  }
                                  disabled={disabled}
                                  label={
                                    <FormattedLabel id="Landmarkmr" required />
                                  }
                                  error={!!errors.glandmarkMrM}
                                  helperText={
                                    errors?.glandmarkMrM
                                      ? errors.glandmarkMrM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                            </div>

                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="oldLabel" />
                                  {/* Old Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gCityName") ? true : false) ||
                                    // (router.query.gCityName ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="cityName" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("gcityName")}
                                  error={!!errors.gcityName}
                                  helperText={
                                    errors?.gcityName
                                      ? errors.gcityName.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gState") ? true : false) ||
                                    // (router.query.gState ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="State" required />}
                                  // label="State *"
                                  disabled={true}
                                  variant="standard"
                                  {...register("gstate")}
                                  error={!!errors.gstate}
                                  helperText={
                                    errors?.gstate
                                      ? errors.gstate.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gCityNameMr") ? true : false) ||
                                    // (router.query.gCityNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="cityNamemr" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("gcityNameMr")}
                                  error={!!errors.gcityNameMr}
                                  helperText={
                                    errors?.gcityNameMr
                                      ? errors.gcityNameMr.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gStateMr") ? true : false) ||
                                    // (router.query.gStateMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="statemr" required />
                                  }
                                  // label="State *"
                                  disabled={true}
                                  variant="standard"
                                  {...register("gstateMr")}
                                  error={!!errors.gstateMr}
                                  helperText={
                                    errors?.gstateMr
                                      ? errors.gstateMr.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="newLabel" />
                                  {/* New Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  style={{
                                    background: handleColourChange(
                                      "gcityNameM",
                                      "gcityName",
                                    ),
                                  }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gCityName") ? true : false) ||
                                    // (router.query.gCityName ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="cityName" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("gcityNameM")}
                                  error={!!errors.gcityNameM}
                                  helperText={
                                    errors?.gcityNameM
                                      ? errors.gcityNameM.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  // style={{
                                  //   background: handleColourChange(
                                  //     "gstateM",
                                  //     "gstate",
                                  //   ),
                                  // }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gState") ? true : false) ||
                                    // (router.query.gState ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="State" required />}
                                  // label="State *"
                                  disabled={disabled}
                                  variant="standard"
                                  {...register("gstateM")}
                                  error={!!errors.gstateM}
                                  helperText={
                                    errors?.gstateM
                                      ? errors.gstateM.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  style={{
                                    background: handleColourChange(
                                      "gcityNameMrM",
                                      "gcityNameMr",
                                    ),
                                  }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gCityNameMr") ? true : false) ||
                                    // (router.query.gCityNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="cityNamemr" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("gcityNameMrM")}
                                  error={!!errors.gcityNameMrM}
                                  helperText={
                                    errors?.gcityNameMrM
                                      ? errors.gcityNameMrM.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  // style={{
                                  //   background: handleColourChange(
                                  //     "gstateMrM",
                                  //     "gstateMr",
                                  //   ),
                                  // }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gStateMr") ? true : false) ||
                                    // (router.query.gStateMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="statemr" required />
                                  }
                                  // label="State *"
                                  disabled={disabled}
                                  variant="standard"
                                  {...register("gstateMrM")}
                                  error={!!errors.gstateMrM}
                                  helperText={
                                    errors?.gstateMrM
                                      ? errors.gstateMrM.message
                                      : null
                                  }
                                />
                              </div>
                            </div>

                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="oldLabel" />
                                  {/* Old Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gPincode") ? true : false) ||
                                    // (router.query.gPincode ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="Pin Code *"
                                  label={
                                    <FormattedLabel id="pincode" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("gpincode")}
                                  error={!!errors.gpincode}
                                  helperText={
                                    errors?.gpincode
                                      ? errors.gpincode.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gMobileNo") ? true : false) ||
                                    // (router.query.gMobileNo ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="Mobile Number"
                                  label={
                                    <FormattedLabel id="mobileNo" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("gmobileNo")}
                                  error={!!errors.gmobileNo}
                                  helperText={
                                    errors?.gmobileNo
                                      ? errors.gmobileNo.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="AadharNo" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("gaadharNo")}
                                  error={!!errors.gaadharNo}
                                  helperText={
                                    errors?.gaadharNo
                                      ? errors.gaadharNo.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="newLabel" />
                                  {/* New Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  // style={{
                                  //   background: handleColourChange(
                                  //     "gpincodeM",
                                  //     "gpincode",
                                  //   ),
                                  // }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gPincode") ? true : false) ||
                                    // (router.query.gPincode ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="Pin Code *"
                                  label={
                                    <FormattedLabel id="pincode" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("gpincodeM")}
                                  error={!!errors.gpincodeM}
                                  helperText={
                                    errors?.gpincodeM
                                      ? errors.gpincodeM.message
                                      : null
                                  }
                                  inputProps={{ maxLength: 6 }}
                                />
                              </div>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("gMobileNo") ? true : false) ||
                                    // (router.query.gMobileNo ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label="Mobile Number"
                                  label={
                                    <FormattedLabel id="mobileNo" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("gmobileNoM")}
                                  error={!!errors.gmobileNoM}
                                  helperText={
                                    errors?.gmobileNoM
                                      ? errors.gmobileNoM.message
                                      : null
                                  }
                                  inputProps={{ maxLength: 10 }}
                                />
                              </div>
                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="AadharNo" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("gaadharNoM")}
                                  error={!!errors.gaadharNoM}
                                  helperText={
                                    errors?.gaadharNoM
                                      ? errors.gaadharNoM.message
                                      : null
                                  }
                                  inputProps={{ maxLength: 12 }}
                                />
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                        <Accordion
                          sx={{
                            marginLeft: "5vh",
                            marginRight: "5vh",
                            marginTop: "2vh",
                            marginBottom: "2vh",
                          }}
                        >
                          <AccordionSummary
                            sx={{
                              backgroundColor: "#0070f3",
                              color: "white",
                              textTransform: "uppercase",
                            }}
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            }
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            backgroundColor="#0070f3"
                            // sx={{
                            //   backgroundColor: '0070f3',
                            // }}
                          >
                            <Typography>
                              {" "}
                              <FormattedLabel id="brideDetails" />
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div style={{ marginLeft: "25px" }}>
                              <FormControlLabel
                                // disabled={disabled ? true : getValues("isApplicantGroom") ? true : false}

                                control={
                                  <Checkbox
                                    checked={getValues("isApplicantBrideMod")}
                                  />
                                }
                                label=<Typography>
                                  <b>
                                    {" "}
                                    <FormattedLabel id="ApplicatCheck2mod" />
                                  </b>
                                </Typography>
                                onChange={(e) => {
                                  addressChange(e);
                                }}
                              />
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="oldLabel" />
                                  {/* Old Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              {/* <div>
                                <FormControl
                                  variant="standard"
                                  error={!!errors.btitle}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                 
                                    <FormattedLabel id="title1" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled={true}
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          setValue(
                                            "btitleMar",
                                            value.target.value,
                                          );
                                        }}
                                        label="Title *"
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {bTitles &&
                                          bTitles.map((bTitle, index) => (
                                            <MenuItem
                                              key={index}
                                              value={bTitle.id}
                                            >
                                              {bTitle.bTitle}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="btitle"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.btitle
                                      ? errors.btitle.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}
                              <div>
                                <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bFName") ? true : false) ||
                                    // (router.query.bFName ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="firstName" required />
                                  }
                                  // label={<FormattedLabel id="firstName" />}
                                  disabled={true}
                                  variant="standard"
                                  {...register("bfName")}
                                  error={!!errors.bfName}
                                  helperText={
                                    errors?.bfName
                                      ? errors.bfName.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bMName") ? true : false) ||
                                    // (router.query.bMName ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label={<FormattedLabel id="middleName" />}
                                  disabled={true}
                                  label={
                                    <FormattedLabel id="middleName" required />
                                  }
                                  variant="standard"
                                  {...register("bmName")}
                                  error={!!errors.bmName}
                                  helperText={
                                    errors?.bmName
                                      ? errors.bmName.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bLName") ? true : false) ||
                                    // (router.query.bLName ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label={<FormattedLabel id="lastName" />}
                                  disabled={true}
                                  label={
                                    <FormattedLabel id="lastName" required />
                                  }
                                  variant="standard"
                                  {...register("blName")}
                                  error={!!errors.blName}
                                  helperText={
                                    errors?.blName
                                      ? errors.blName.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="newLabel" />
                                  {/* New Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              {/* <div>
                                <FormControl
                                  variant="standard"
                                  error={!!errors.btitleM}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                 
                                    <FormattedLabel id="title1" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled={disabled}
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          setValue(
                                            "btitleMarM",
                                            value.target.value,
                                          );
                                        }}
                                        label="Title *"
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {bTitles &&
                                          bTitles.map((bTitle, index) => (
                                            <MenuItem
                                              key={index}
                                              value={bTitle.id}
                                            >
                                              {bTitle.bTitle}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="btitleM"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.btitleM
                                      ? errors.btitleM.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}
                              <div>
                                {/* <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bFName") ? true : false) ||
                                    // (router.query.bFName ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="firstName" required />
                                  }
                                  // label={<FormattedLabel id="firstName" />}
                                  disabled={disabled}
                                  variant="standard"
                                  {...register("bfNameM")}
                                  error={!!errors.bfNameM}
                                  helperText={
                                    errors?.bfNameM
                                      ? errors.bfNameM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"bfNameM"}
                                  labelName={"firstName"}
                                  fieldName={"bfNameM"}
                                  updateFieldName={"bfNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange("bfNameM", "bfName")
                                  }
                                  label={
                                    <FormattedLabel id="firstName" required />
                                  }
                                  error={!!errors.bfNameM}
                                  helperText={
                                    errors?.bfNameM
                                      ? errors.bfNameM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bMName") ? true : false) ||
                                    // (router.query.bMName ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label={<FormattedLabel id="middleName" />}
                                  disabled={disabled}
                                  label={
                                    <FormattedLabel id="middleName" required />
                                  }
                                  variant="standard"
                                  {...register("bmNameM")}
                                  error={!!errors.bmNameM}
                                  helperText={
                                    errors?.bmNameM
                                      ? errors.bmNameM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"bmNameM"}
                                  labelName={"middleName"}
                                  fieldName={"bmNameM"}
                                  updateFieldName={"bmNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange("bmNameM", "bmName")
                                  }
                                  label={
                                    <FormattedLabel id="middleName" required />
                                  }
                                  error={!!errors.bmNameM}
                                  helperText={
                                    errors?.bmNameM
                                      ? errors.bmNameM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bLName") ? true : false) ||
                                    // (router.query.bLName ? true : false),
                                  }}
                                  id="standard-basic"
                                  // label={<FormattedLabel id="lastName" />}
                                  disabled={disabled}
                                  label={
                                    <FormattedLabel id="lastName" required />
                                  }
                                  variant="standard"
                                  {...register("blNameM")}
                                  error={!!errors.blNameM}
                                  helperText={
                                    errors?.blNameM
                                      ? errors.blNameM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"blNameM"}
                                  labelName={"lastName"}
                                  fieldName={"blNameM"}
                                  updateFieldName={"blNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange("blNameM", "blName")
                                  }
                                  label={
                                    <FormattedLabel id="lastName" required />
                                  }
                                  error={!!errors.blNameM}
                                  helperText={
                                    errors?.blNameM
                                      ? errors.blNameM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                            </div>

                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="oldLabel" />
                                  {/* Old Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              {/* <div>
                                <FormControl
                                  variant="standard"
                                  error={!!errors.btitleMar}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="titlemr" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled={true}
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          setValue(
                                            "btitle",
                                            value.target.value,
                                          );
                                        }}
                                        label="Title *"
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {bTitleMars &&
                                          bTitleMars.map((bTitleMar, index) => (
                                            <MenuItem
                                              key={index}
                                              value={bTitleMar.id}
                                            >
                                              {bTitleMar.bTitleMar}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="btitleMar"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.btitleMar
                                      ? errors.btitleMar.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}
                              <div>
                                <TextField
                                  id="standard-basic"
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bFNameMr") ? true : false) ||
                                    // (router.query.bFNameMr ? true : false),
                                  }}
                                  // label={<FormattedLabel id="firstNameV" />}
                                  label={
                                    <FormattedLabel id="firstNamemr" required />
                                  }
                                  disabled={true}
                                  variant="standard"
                                  {...register("bfNameMr")}
                                  error={!!errors.bfNameMr}
                                  helperText={
                                    errors?.bfNameMr
                                      ? errors.bfNameMr.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  id="standard-basic"
                                  // label={<FormattedLabel id="middleNameV" />}
                                  disabled={true}
                                  label={
                                    <FormattedLabel
                                      id="middleNamemr"
                                      required
                                    />
                                  }
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bMNameMr") ? true : false) ||
                                    // (router.query.bMNameMr ? true : false),
                                  }}
                                  variant="standard"
                                  {...register("bmNameMr")}
                                  error={!!errors.bmNameMr}
                                  helperText={
                                    errors?.bmNameMr
                                      ? errors.bmNameMr.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  id="standard-basic"
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bLNameMr") ? true : false) ||
                                    // (router.query.bLNameMr ? true : false),
                                  }}
                                  // label={<FormattedLabel id="lastNameV" />}
                                  disabled={true}
                                  label={
                                    <FormattedLabel id="lastNamemr" required />
                                  }
                                  variant="standard"
                                  {...register("blNameMr")}
                                  error={!!errors.blNameMr}
                                  helperText={
                                    errors?.blNameMr
                                      ? errors.blNameMr.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="newLabel" />
                                  {/* New Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              {/* <div>
                                <FormControl
                                  variant="standard"
                                  error={!!errors.btitleMarM}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="titlemr" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled={disabled}
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          setValue(
                                            "btitleM",
                                            value.target.value,
                                          );
                                        }}
                                        label="Title *"
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {bTitleMars &&
                                          bTitleMars.map((bTitleMar, index) => (
                                            <MenuItem
                                              key={index}
                                              value={bTitleMar.id}
                                            >
                                              {bTitleMar.bTitleMar}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="btitleMarM"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.btitleMarM
                                      ? errors.btitleMarM.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}
                              <div>
                                {/* <TextField
                                  id="standard-basic"
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bFNameMr") ? true : false) ||
                                    // (router.query.bFNameMr ? true : false),
                                  }}
                                  // label={<FormattedLabel id="firstNameV" />}
                                  label={
                                    <FormattedLabel id="firstNamemr" required />
                                  }
                                  disabled={disabled}
                                  variant="standard"
                                  {...register("bfNameMrM")}
                                  error={!!errors.bfNameMrM}
                                  helperText={
                                    errors?.bfNameMrM
                                      ? errors.bfNameMrM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"bfNameMrM"}
                                  labelName={"firstNamemr"}
                                  fieldName={"bfNameMrM"}
                                  updateFieldName={"bfNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange("bfNameMrM", "bfNameMr")
                                  }
                                  label={
                                    <FormattedLabel id="firstNamemr" required />
                                  }
                                  error={!!errors.bfNameMrM}
                                  helperText={
                                    errors?.bfNameMrM
                                      ? errors.bfNameMrM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  id="standard-basic"
                                  // label={<FormattedLabel id="middleNameV" />}
                                  disabled={disabled}
                                  label={
                                    <FormattedLabel
                                      id="middleNamemr"
                                      required
                                    />
                                  }
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bMNameMr") ? true : false) ||
                                    // (router.query.bMNameMr ? true : false),
                                  }}
                                  variant="standard"
                                  {...register("bmNameMrM")}
                                  error={!!errors.bmNameMrM}
                                  helperText={
                                    errors?.bmNameMrM
                                      ? errors.bmNameMrM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"bmNameMrM"}
                                  labelName={"middleNamemr"}
                                  fieldName={"bmNameMrM"}
                                  updateFieldName={"bmNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange("bmNameMrM", "bmNameMr")
                                  }
                                  label={
                                    <FormattedLabel
                                      id="middleNamemr"
                                      required
                                    />
                                  }
                                  error={!!errors.bmNameMrM}
                                  helperText={
                                    errors?.bmNameMrM
                                      ? errors.bmNameMrM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  id="standard-basic"
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bLNameMr") ? true : false) ||
                                    // (router.query.bLNameMr ? true : false),
                                  }}
                                  // label={<FormattedLabel id="lastNameV" />}
                                  disabled={disabled}
                                  label={
                                    <FormattedLabel id="lastNamemr" required />
                                  }
                                  variant="standard"
                                  {...register("blNameMrM")}
                                  error={!!errors.blNameMrM}
                                  helperText={
                                    errors?.blNameMrM
                                      ? errors.blNameMrM.message
                                      : null
                                  }
                                /> */}
                                <Transliteration
                                  _key={"blNameMrM"}
                                  labelName={"lastNamemr"}
                                  fieldName={"blNameMrM"}
                                  updateFieldName={"blNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange("blNameMrM", "blNameMr")
                                  }
                                  label={
                                    <FormattedLabel id="lastNamemr" required />
                                  }
                                  error={!!errors.blNameMrM}
                                  helperText={
                                    errors?.blNameMrM
                                      ? errors.blNameMrM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                            </div>

                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="oldLabel" />
                                  {/* Old Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bBuildingNo") ? true : false) ||
                                    // (router.query.bBuildingNo ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="flatBuildingNo"
                                      required
                                    />
                                  }
                                  disabled={true}
                                  variant="standard"
                                  {...register("bbuildingNo")}
                                  error={!!errors.bbuildingNo}
                                  helperText={
                                    errors?.bbuildingNo
                                      ? errors.bbuildingNo.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  //   InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bBuildingName") ? true : false) ||
                                    // (router.query.bBuildingName ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="buildingName"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("bbuildingName")}
                                  error={!!errors.bbuildingName}
                                  helperText={
                                    errors?.bbuildingName
                                      ? errors.bbuildingName.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  //  InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bRoadName") ? true : false) ||
                                    // (router.query.bRoadName ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="roadName" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("broadName")}
                                  error={!!errors.broadName}
                                  helperText={
                                    errors?.broadName
                                      ? errors.broadName.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bLandmark") ? true : false) ||
                                    // (router.query.bLandmark ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="Landmark" required />
                                  }
                                  disabled={true}
                                  variant="standard"
                                  {...register("blandmark")}
                                  error={!!errors.blandmark}
                                  helperText={
                                    errors?.blandmark
                                      ? errors.blandmark.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="newLabel" />
                                  {/* New Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bBuildingNo") ? true : false) ||
                                    // (router.query.bBuildingNo ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="flatBuildingNo"
                                      required
                                    />
                                  }
                                  disabled={disabled}
                                  variant="standard"
                                  {...register("bbuildingNoM")}
                                  error={!!errors.bbuildingNoM}
                                  helperText={
                                    errors?.bbuildingNoM
                                      ? errors.bbuildingNoM.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="buildingName"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("bbuildingNameM")}
                                  error={!!errors.bbuildingNameM}
                                  helperText={
                                    errors?.bbuildingNameM
                                      ? errors.bbuildingNameM.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  //  InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bRoadName") ? true : false) ||
                                    // (router.query.bRoadName ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="roadName" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("broadNameM")}
                                  error={!!errors.broadNameM}
                                  helperText={
                                    errors?.broadNameM
                                      ? errors.broadNameM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"broadNameM"}
                                  labelName={"roadName"}
                                  fieldName={"broadNameM"}
                                  updateFieldName={"broadNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange(
                                      "broadNameM",
                                      "broadName",
                                    )
                                  }
                                  label={
                                    <FormattedLabel id="roadName" required />
                                  }
                                  error={!!errors.broadNameM}
                                  helperText={
                                    errors?.broadNameM
                                      ? errors.broadNameM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bLandmark") ? true : false) ||
                                    // (router.query.bLandmark ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="Landmark" required />
                                  }
                                  disabled={disabled}
                                  variant="standard"
                                  {...register("blandmarkM")}
                                  error={!!errors.blandmarkM}
                                  helperText={
                                    errors?.blandmarkM
                                      ? errors.blandmarkM.message
                                      : null
                                  }
                                /> */}
                                <Transliteration
                                  _key={"blandmarkM"}
                                  labelName={"Landmark"}
                                  fieldName={"blandmarkM"}
                                  updateFieldName={"blandmarkMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange(
                                      "blandmarkM",
                                      "blandmark",
                                    )
                                  }
                                  label={
                                    <FormattedLabel id="Landmark" required />
                                  }
                                  error={!!errors.blandmarkM}
                                  helperText={
                                    errors?.blandmarkM
                                      ? errors.blandmarkM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                            </div>

                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="oldLabel" />
                                  {/* Old Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bBuildingNoMr") ? true : false) ||
                                    // (router.query.bBuildingNoMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="flatBuildingNomr"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("bbuildingNoMr")}
                                  error={!!errors.bbuildingNoMr}
                                  helperText={
                                    errors?.bbuildingNoMr
                                      ? errors.bbuildingNoMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  //   InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bBuildingNameMr") ? true : false) ||
                                    // (router.query.bBuildingNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="buildingNamemr"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("bbuildingNameMr")}
                                  error={!!errors.bbuildingNameMr}
                                  helperText={
                                    errors?.bbuildingNameMr
                                      ? errors.bbuildingNameMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  //  InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bRoadNameMr") ? true : false) ||
                                    // (router.query.bRoadNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="roadNamemr" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("broadNameMr")}
                                  error={!!errors.broadNameMr}
                                  helperText={
                                    errors?.broadNameMr
                                      ? errors.broadNameMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bLandmarkMr") ? true : false) ||
                                    // (router.query.bLandmarkMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="Landmarkmr" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("blandmarkMr")}
                                  error={!!errors.blandmarkMr}
                                  helperText={
                                    errors?.blandmarkMr
                                      ? errors.blandmarkMr.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="newLabel" />
                                  {/* New Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bBuildingNoMr") ? true : false) ||
                                    // (router.query.bBuildingNoMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="flatBuildingNomr"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("bbuildingNoMrM")}
                                  error={!!errors.bbuildingNoMrM}
                                  helperText={
                                    errors?.bbuildingNoMrM
                                      ? errors.bbuildingNoMrM.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  //   InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bBuildingNameMr") ? true : false) ||
                                    // (router.query.bBuildingNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="buildingNamemr"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("bbuildingNameMrM")}
                                  error={!!errors.bbuildingNameMrM}
                                  helperText={
                                    errors?.bbuildingNameMrM
                                      ? errors.bbuildingNameMrM.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                {/* <TextField
                                  //  InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bRoadNameMr") ? true : false) ||
                                    // (router.query.bRoadNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="roadNamemr" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("broadNameMrM")}
                                  error={!!errors.broadNameMrM}
                                  helperText={
                                    errors?.broadNameMrM
                                      ? errors.broadNameMrM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"broadNameMrM"}
                                  labelName={"roadNamemr"}
                                  fieldName={"broadNameMrM"}
                                  updateFieldName={"broadNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange(
                                      "broadNameMrM",
                                      "broadNameMr",
                                    )
                                  }
                                  label={
                                    <FormattedLabel id="roadNamemr" required />
                                  }
                                  error={!!errors.broadNameMrM}
                                  helperText={
                                    errors?.broadNameMrM
                                      ? errors.broadNameMrM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>

                              <div>
                                {/* <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bLandmarkMr") ? true : false) ||
                                    // (router.query.bLandmarkMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="Landmarkmr" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("blandmarkMrM")}
                                  error={!!errors.blandmarkMrM}
                                  helperText={
                                    errors?.blandmarkMrM
                                      ? errors.blandmarkMrM.message
                                      : null
                                  }
                                /> */}
                                <Transliteration
                                  _key={"blandmarkMrM"}
                                  labelName={"Landmarkmr"}
                                  fieldName={"blandmarkMrM"}
                                  updateFieldName={"blandmarkM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange(
                                      "blandmarkMrM",
                                      "blandmarkMr",
                                    )
                                  }
                                  label={
                                    <FormattedLabel id="Landmarkmr" required />
                                  }
                                  error={!!errors.blandmarkMrM}
                                  helperText={
                                    errors?.blandmarkMrM
                                      ? errors.blandmarkMrM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                            </div>

                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="oldLabel" />
                                  {/* Old Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  //   InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bCityName") ? true : false) ||
                                    // (router.query.bCityName ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="cityName" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("bcityName")}
                                  error={!!errors.bcityName}
                                  helperText={
                                    errors?.bcityName
                                      ? errors.bcityName.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bState") ? true : false) ||
                                    // (router.query.bState ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="State" required />}
                                  disabled={true}
                                  variant="standard"
                                  {...register("bstate")}
                                  error={!!errors.bstate}
                                  helperText={
                                    errors?.bstate
                                      ? errors.bstate.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  //   InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bCityNameMr") ? true : false) ||
                                    // (router.query.bCityNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="cityNamemr" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("bcityNameMr")}
                                  error={!!errors.bcityNameMr}
                                  helperText={
                                    errors?.bcityNameMr
                                      ? errors.bcityNameMr.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bStateMr") ? true : false) ||
                                    // (router.query.bStateMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="statemr" required />
                                  }
                                  disabled={true}
                                  variant="standard"
                                  {...register("bstateMr")}
                                  error={!!errors.bstateMr}
                                  helperText={
                                    errors?.bstateMr
                                      ? errors.bstateMr.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="newLabel" />
                                  {/* New Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                {/* <TextField
                                  //   InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bCityName") ? true : false) ||
                                    // (router.query.bCityName ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="cityName" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("bcityNameM")}
                                  error={!!errors.bcityNameM}
                                  helperText={
                                    errors?.bcityNameM
                                      ? errors.bcityNameM.message
                                      : null
                                  }
                                /> */}
                                <Transliteration
                                  _key={"bcityNameM"}
                                  labelName={"cityName"}
                                  fieldName={"bcityNameM"}
                                  updateFieldName={"bcityNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange(
                                      "bcityNameM",
                                      "bcityName",
                                    )
                                  }
                                  label={
                                    <FormattedLabel id="cityName" required />
                                  }
                                  error={!!errors.bcityNameM}
                                  helperText={
                                    errors?.bcityNameM
                                      ? errors.bcityNameM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bState") ? true : false) ||
                                    // (router.query.bState ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="State" required />}
                                  disabled={disabled}
                                  variant="standard"
                                  {...register("bstateM")}
                                  error={!!errors.bstateM}
                                  helperText={
                                    errors?.bstateM
                                      ? errors.bstateM.message
                                      : null
                                  }
                                /> */}
                                <Transliteration
                                  _key={"bstateM"}
                                  labelName={"State"}
                                  fieldName={"bstateM"}
                                  updateFieldName={"bstateMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange("bstateM", "bstate")
                                  }
                                  label={<FormattedLabel id="State" required />}
                                  error={!!errors.bstateM}
                                  helperText={
                                    errors?.bstateM
                                      ? errors.bstateM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>

                              <div>
                                {/* <TextField
                                  //   InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bCityNameMr") ? true : false) ||
                                    // (router.query.bCityNameMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="cityNamemr" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("bcityNameMrM")}
                                  error={!!errors.bcityNameMrM}
                                  helperText={
                                    errors?.bcityNameMrM
                                      ? errors.bcityNameMrM.message
                                      : null
                                  }
                                /> */}
                                <Transliteration
                                  _key={"bcityNameMrM"}
                                  labelName={"cityNamemr"}
                                  fieldName={"bcityNameMrM"}
                                  updateFieldName={"bcityNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange(
                                      "bcityNameMrM",
                                      "bcityNameMr",
                                    )
                                  }
                                  label={
                                    <FormattedLabel id="cityNamemr" required />
                                  }
                                  error={!!errors.bcityNameMrM}
                                  helperText={
                                    errors?.bcityNameMrM
                                      ? errors.bcityNameMrM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                              <div>
                                {/* <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bStateMr") ? true : false) ||
                                    // (router.query.bStateMr ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="statemr" required />
                                  }
                                  disabled={disabled}
                                  variant="standard"
                                  {...register("bstateMrM")}
                                  error={!!errors.bstateMrM}
                                  helperText={
                                    errors?.bstateMrM
                                      ? errors.bstateMrM.message
                                      : null
                                  }
                                /> */}

                                <Transliteration
                                  _key={"bstateMrM"}
                                  labelName={"statemr"}
                                  fieldName={"bstateMrM"}
                                  updateFieldName={"bstateM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  defaultValue="महाराष्ट्र"
                                  disabled={disabled}
                                  color={() =>
                                    handleColourChange("bstateMrM", "bstateMr")
                                  }
                                  label={
                                    <FormattedLabel id="statemr" required />
                                  }
                                  error={!!errors.bstateMrM}
                                  helperText={
                                    errors?.bstateMrM
                                      ? errors.bstateMrM.message
                                      : null
                                  }
                                  width={230}
                                />
                              </div>
                            </div>

                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="oldLabel" />
                                  {/* Old Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bPincode") ? true : false) ||
                                    // (router.query.bPincode ? true : false),
                                  }}
                                  id="standard-basic"
                                  disabled={true}
                                  label={
                                    <FormattedLabel id="pincode" required />
                                  }
                                  variant="standard"
                                  {...register("bpincode")}
                                  error={!!errors.bpincode}
                                  helperText={
                                    errors?.bpincode
                                      ? errors.bpincode.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink:
                                      (watch("bmobileNo") ? true : false) ||
                                      (router.query.bmobileNo ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="mobileNo" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("bmobileNo")}
                                  error={!!errors.bmobileNo}
                                  helperText={
                                    errors?.bmobileNo
                                      ? errors.bmobileNo.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink:
                                      (watch("baadharNo") ? true : false) ||
                                      (router.query.baadharNo ? true : false),
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="AadharNo" required />
                                  }
                                  variant="standard"
                                  disabled={true}
                                  {...register("baadharNo")}
                                  error={!!errors.baadharNo}
                                  helperText={
                                    errors?.baadharNo
                                      ? errors.baadharNo.message
                                      : null
                                  }
                                />
                              </div>
                            </div>
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="newLabel" />
                                  {/* New Values*/}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  // InputLabelProps={{ shrink: true }}
                                  InputLabelProps={{
                                    shrink: temp,
                                    // (watch("bPincode") ? true : false) ||
                                    // (router.query.bPincode ? true : false),
                                  }}
                                  id="standard-basic"
                                  disabled={disabled}
                                  label={
                                    <FormattedLabel id="pincode" required />
                                  }
                                  variant="standard"
                                  {...register("bpincodeM")}
                                  error={!!errors.bpincodeM}
                                  helperText={
                                    errors?.bpincodeM
                                      ? errors.bpincodeM.message
                                      : null
                                  }
                                  inputProps={{ maxLength: 6 }}
                                />
                              </div>

                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="mobileNo" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("bmobileNoM")}
                                  error={!!errors.bmobileNoM}
                                  helperText={
                                    errors?.bmobileNoM
                                      ? errors.bmobileNoM.message
                                      : null
                                  }
                                  inputProps={{ maxLength: 10 }}
                                />
                              </div>

                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="AadharNo" required />
                                  }
                                  variant="standard"
                                  disabled={disabled}
                                  {...register("baadharNoM")}
                                  error={!!errors.baadharNoM}
                                  helperText={
                                    errors?.baadharNoM
                                      ? errors.baadharNoM.message
                                      : null
                                  }
                                  inputProps={{ maxLength: 12 }}
                                />
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </>
                    )}
                    {!props.preview && (
                      <>
                        <Accordion
                          sx={{
                            marginLeft: "5vh",
                            marginRight: "5vh",
                            marginTop: "2vh",
                            marginBottom: "2vh",
                          }}
                        >
                          <AccordionSummary
                            sx={{
                              backgroundColor: "#0070f3",
                              color: "white",
                              textTransform: "uppercase",
                            }}
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            }
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            backgroundColor="#0070f3"
                          >
                            <Typography>
                              {" "}
                              <FormattedLabel id="documentsUpload" />
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {watch("isApplicantGroomMod") == true && (
                              <>
                                <div className={styles.details}>
                                  <div className={styles.h1Tag}>
                                    <h3
                                      style={{
                                        color: "white",
                                        marginTop: "7px",
                                      }}
                                    >
                                      <FormattedLabel id="gDoc" />
                                    </h3>
                                  </div>
                                </div>
                                <div className={styles.row}>
                                  <div style={{ marginTop: "20px" }}>
                                    <Typography>
                                      {" "}
                                      <FormattedLabel id="adharcard" />
                                    </Typography>

                                    <UploadButton
                                      appName={appName}
                                      serviceName={serviceName}
                                      fileDtl={getValues(
                                        "gadharCardModDocument",
                                      )}
                                      fileKey={"gadharCardModDocument"}
                                      showDel={pageMode ? false : true}
                                      fileNameEncrypted={(path) => {
                                        // handleGetName(path);
                                        setEncryptedGadharCardModDocument(path);
                                      }}
                                      // showDel={true}
                                    />
                                  </div>

                                  <div style={{ marginTop: "20px" }}>
                                    <Typography>
                                      {" "}
                                      <FormattedLabel id="AdressPrf" />
                                    </Typography>
                                    <UploadButton
                                      appName={appName}
                                      serviceName={serviceName}
                                      fileDtl={getValues(
                                        "gaddressProofModDocument",
                                      )}
                                      fileKey={"gaddressProofModDocument"}
                                      showDel={pageMode ? false : true}
                                      fileNameEncrypted={(path) => {
                                        // handleGetName(path);
                                        setEncryptedGaddressProofModDocument(
                                          path,
                                        );
                                      }}
                                      // showDel={true}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                            {watch("isApplicantBrideMod") == true && (
                              <>
                                <div className={styles.details}>
                                  <div className={styles.h1Tag}>
                                    <h3
                                      style={{
                                        color: "white",
                                        marginTop: "7px",
                                      }}
                                    >
                                      <FormattedLabel id="bDoc" />
                                      {/* Bride Documents*/}
                                    </h3>
                                  </div>
                                </div>
                                <div className={styles.row}>
                                  <div style={{ marginTop: "20px" }}>
                                    <Typography>
                                      {" "}
                                      <FormattedLabel id="adharcard" />
                                    </Typography>

                                    <UploadButton
                                      appName={appName}
                                      serviceName={serviceName}
                                      fileDtl={getValues(
                                        "badharCardModDocument",
                                      )}
                                      fileKey={"badharCardModDocument"}
                                      showDel={pageMode ? false : true}
                                      fileNameEncrypted={(path) => {
                                        // handleGetName(path);
                                        setEncryptedBadharCardModDocument(path);
                                      }}
                                      // showDel={true}
                                    />
                                  </div>

                                  <div style={{ marginTop: "20px" }}>
                                    <Typography>
                                      {" "}
                                      <FormattedLabel id="AdressPrf" />
                                    </Typography>
                                    <UploadButton
                                      appName={appName}
                                      serviceName={serviceName}
                                      fileDtl={getValues(
                                        "baddressProofModDocument",
                                      )}
                                      fileKey={"baddressProofModDocument"}
                                      showDel={pageMode ? false : true}
                                      fileNameEncrypted={(path) => {
                                        // handleGetName(path);
                                        setEncryptedBaddressProofModDocument(
                                          path,
                                        );
                                      }}
                                      // showDel={true}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                            <div className={styles.details}>
                              <div className={styles.h1Tag}>
                                <h3
                                  style={{
                                    color: "white",
                                    marginTop: "7px",
                                  }}
                                >
                                  <FormattedLabel id="oldMC" required />
                                  {/* Old Marriage Certificate */}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.rowM}>
                              <div style={{ marginTop: "20px" }}>
                                <Typography>
                                  <FormattedLabel id="oldMC" required />
                                </Typography>
                                <UploadButton
                                  appName={appName}
                                  serviceName={serviceName}
                                  fileDtl={getValues(
                                    "oldMarriageCerModDocument",
                                  )}
                                  fileKey={"oldMarriageCerModDocument"}
                                  showDel={pageMode ? false : true}
                                  fileNameEncrypted={(path) => {
                                    // handleGetName(path);
                                    setEncryptedOldMarriageCerModDocument(path);
                                  }}
                                  // showDel={true}
                                />
                                <FormHelperText
                                  error={!!errors?.oldMarriageCerModDocument}
                                >
                                  {errors?.oldMarriageCerModDocument
                                    ? errors?.oldMarriageCerModDocument?.message
                                    : null}
                                </FormHelperText>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </>
                    )}
                    {!props.preview && !props.onlyDoc && (
                      <>
                        <div className={styles.btn}>
                          {router?.query?.pageMode != "View" ? (
                            <>
                              <div className={styles.btn1}>
                                <Button
                                  // type="submit"
                                  variant="contained"
                                  color="success"
                                  endIcon={<SaveIcon />}
                                  onClick={() => {
                                    // alert("kiti copy hawi ahe");
                                    setmodalforAprov(true);
                                  }}
                                >
                                  {<FormattedLabel id="save" />}
                                </Button>{" "}
                              </div>

                              <div className={styles.btn1}>
                                <Button
                                  variant="contained"
                                  color="error"
                                  endIcon={<ExitToAppIcon />}
                                  // onClick={() => exitButton()}
                                  onClick={() => {
                                    swal({
                                      title: "Exit?",
                                      text: "Are you sure you want to exit this Record ? ",
                                      icon: "warning",
                                      buttons: true,
                                      dangerMode: true,
                                    }).then((willDelete) => {
                                      if (willDelete) {
                                        swal("Record is Successfully Exit!", {
                                          icon: "success",
                                        });
                                        router.push(`/dashboard`);
                                      } else {
                                        swal("Record is Safe");
                                      }
                                    });
                                  }}
                                >
                                  {<FormattedLabel id="exit" />}
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className={styles.btn1}>
                                <Button
                                  variant="contained"
                                  color="error"
                                  endIcon={<ExitToAppIcon />}
                                  // onClick={() => exitButton()}
                                  onClick={() => {
                                    swal({
                                      title: "Exit?",
                                      text: "Are you sure you want to exit this Record ? ",
                                      icon: "warning",
                                      buttons: true,
                                      dangerMode: true,
                                    }).then((willDelete) => {
                                      if (willDelete) {
                                        swal("Record is Successfully Exit!", {
                                          icon: "success",
                                        });
                                        router.push(
                                          `/marriageRegistration/transactions/modificationInMarriageCertificate`,
                                        );
                                      } else {
                                        swal("Record is Safe");
                                      }
                                    });
                                  }}
                                >
                                  {<FormattedLabel id="exit" />}
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </Paper>
                ) : (
                  ""
                )}
              </>
            </ThemeProvider>
            <div className={styles.model}>
              <Modal
                open={modalforAprov}
                //onClose={clerkApproved}
                onCancel={() => {
                  setmodalforAprov(false);
                }}
              >
                <div className={styles.boxRemark}>
                  <div className={styles.titlemodelremarkAprove}>
                    <Typography
                      className={styles.titleOne}
                      variant="h6"
                      component="h2"
                      color="#f7f8fa"
                      style={{ marginLeft: "25px" }}
                    >
                      {/* <FormattedLabel id="remarkModel" /> */}
                      Number of copies
                    </Typography>
                    <IconButton>
                      <CloseIcon
                        onClick={
                          () => setmodalforAprov(false)
                          // router.push(
                          //   `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/`
                          // )
                        }
                      />
                    </IconButton>
                  </div>

                  <div
                    className={styles.btndate}
                    style={{ marginLeft: "150px" }}
                  >
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={2}
                      placeholder="Enter the number of copies"
                      style={{ width: 200 }}
                      // onChange={(e) => {
                      //   setRemark(e.target.value)
                      // }}
                      // name="remark"
                      {...register("copies")}
                    />
                  </div>

                  <div className={styles.btnappr}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                      // onClick={async () => {
                      //   remarks("APPROVE");
                      // }}
                      onClick={() => {
                        setTimeout(() => {
                          handleApply();
                        }, 100);
                      }}
                    >
                      <FormattedLabel id="save" />
                    </Button>

                    <Button
                      variant="contained"
                      endIcon={<CloseIcon />}
                      color="error"
                      onClick={() => {
                        setmodalforAprov(false);
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Index;

import { yupResolver } from "@hookform/resolvers/yup";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import {
  Accordion,
  AccordionSummary,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import UploadButton from "../../../../../components/marriageRegistration/DocumentsUploadMB";
import HistoryComponent from "../../../../../components/marriageRegistration/HistoryComponent";
import modOfboardschema from "../../../../../components/marriageRegistration/schema/modOfboardschema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
import styles from "./modificationInMBR.module.css";
// import AreaWardZoneMapping from "../../components/marriageRegistration/AreaWardZpneMapping/AreaWardZpneMapping";
import sweetAlert from "sweetalert";

const Index = (props) => {
  console.log("rrrrrr111", props);
  const disptach = useDispatch();
  let appName = "MR";
  let serviceName = "M-MMBC";
  let applicationFrom = "online";
  const [document, setDocument] = useState([]);
  const [pageMode, setPageMode] = useState(null);
  const [disable, setDisable] = useState(false);
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(modOfboardschema),
    mode: "onChange",
    defaultValues: {
      id: null,
      wardKey: "",
      zoneKey: "",
      atitle: "",
      afName: "",
      amName: "",
      alName: "",
      afNameMr: "",
      amNameMr: "",
      alNameMr: "",
      omNameM: "",

      aCflatBuildingNo: "",
      aCbuildingName: "",
      aCroadName: "",
      aCLandmark: "",
      aCCityName: "",
      aCPincode: "",

      aPflatBuildingNo: "",
      aPbuildingName: "",
      aProadName: "",
      aPLandmark: "",
      aPCityName: "",
      aPPincode: "",

      marriageBoardName: "",
      genderKey: "",
      bflatBuildingNo: "",
      bbuildingName: "",
      broadName: "",
      blandmark: "",
      bpincode: "",
      aadhaarNo: "",
      mobile: "",
      emailAddress: "",
      city: "",
      // validityOfMarriageBoardRegistration: null,
      remarks: "",
      serviceCharges: "",
      applicationAcceptanceCharges: "",
      applicationNumber: "",

      aCflatBuildingNoMr: "",
      aCbuildingNameMr: "",
      aCroadNameMr: "",
      aCLandmarkMr: "",
      aCCityNameMr: "",
      oemail: "",
      omobileNo: "",
      //marathi permanent

      aPflatBuildingNoMr: "",
      aPbuildingNameMr: "",
      aProadNameMr: "",
      aPLandmarkMr: "",
      aPCityNameMr: "",

      //marathi board

      marriageBoardNameMr: "",
      bflatBuildingNoMr: "",
      bbuildingNameMr: "",
      broadNameMr: "",
      blandmarkMr: "",
      cityMr: "",
      applicationNumber: "",

      boardHeadPersonPhotoMod: "",
      boardOrganizationPhotoMod: "",
      panCardMod: "",
      aadharCardMod: "",
      rationCardMod: "",
      electricityBillMod: "",
      otherDocMod: "",
      resolutionOfBoardMod: "",
      receiptOfPaymentOfpropertyTaxMod: "",
      agreemenyCopyOfPropertyMod: "",
      oldBoardCertificateMod: "",
      charitableMod: "",
    },
  });
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;
  const user = useSelector((state) => state?.user.user);
  const [flagSearch, setFlagSearch] = useState(false);
  const [temp, setTemp] = useState();
  const [temp1, setTemp1] = useState();
  const [tempData, setTempData] = useState();
  const [loader, setLoader] = useState(false);
  const [showAccordian, setshowAccordian] = useState(true);
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  // const [zoneKeys, setZoneKeys] = useState([]);
  useEffect(() => {
    let pageMode = router.query.pageMode;
    if (pageMode === "Add") {
      setPageMode(null);
      console.log("enabled", pageMode);
      setDisable(true);
    } else if (pageMode === "Edit") {
      setPageMode(pageMode);
      setDisable(false);
    } else if (pageMode === "View") {
      setPageMode(pageMode);
      setDisable(true);
    } else {
      setDisable(false);
      setPageMode(pageMode);
      console.log("disabled", pageMode);
    }
  }, []);

  const logedInUser = localStorage.getItem("loggedInUser");
  // const validateSearch = () => {
  //   if (watch('mBoardRegName') === '' || watch('mBoardRegName') === undefined) {
  //     return true
  //   }
  // }

  // useEffect(() => {
  //   console.log("54354", getValues("mRegNo"));
  // }, [flagSearch]);

  // const getById = (id) => {
  //   axios
  //     .get(
  //       `${urls.MR}/transaction/modOfMarBoardCertificate/getapplicantById?applicationId=${id}`,
  //     )
  //     .then((r) => {
  //       console.log("r.data", r.data);

  //       let oldAppId = r.data.trnApplicantId;

  //       console.log(oldAppId, "oldAppId getbyId");

  //       let certificateIssueDateTime;
  //       {
  //         if (router?.query?.pageMode != "Edit") {
  //       axios
  //         .get(
  //           `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${oldAppId}`,
  //         )
  //         .then((re) => {
  //           certificateIssueDateTime = re.data.certificateIssueDateTime;
  //           setValue("registrationDate", re.data.registrationDate);
  //           setValue("registrationNumber", re.data.registrationNumber);
  //           console.log("re.data", re.data);
  //         });

  //           reset(r.data);
  //           setValue(
  //             "boardOrganizationPhotoMod",
  //             r.data.boardOrganizationPhotoMod,
  //           );
  //           setValue("identityProofMod", r.data.identityProofMod);
  //           setValue("residentialProofMod", r.data.residentialProofMod);
  //         }
  //       }

  //       setValue("registrationDate", certificateIssueDateTime);

  //       setFlagSearch(true);
  //     });
  // };

  // useEffect(() => {
  //   if (props.photos && props.onlyDoc) {
  //     setValue(
  //       "boardOrganizationPhotoMod",
  //       props.photos.boardOrganizationPhotoMod,
  //     );
  //     setValue("identityProofMod", props.photos.identityProofMod);
  //     setValue("residentialProofMod", props.photos.residentialProofMod);
  //   }
  // }, [
  //   watch("boardOrganizationPhotoMod"),
  //   watch("identityProofMod"),
  //   watch("residentialProofMod"),
  // ]);

  // console.log("qqqqqqqqq",watch("boardOrganizationPhotoMod"));

  // useEffect(() => {
  //   if(router?.query?.pageMode == "View"){
  //     console.log("router?.query?.pageMode", router?.query?.pageMode);
  //     getById(router?.query?.applicationId);
  //   }
  // }, [router?.query?.pageMode]);
  console.log("logedInUser", logedInUser);
  const handleSearch = () => {
    let bodyForApi = {
      boardName: watch("mBoardRegName") || watch("mBoardRegNameF"),
      registrationDate: watch("marriageBoardRegistrationDate"),
      registrationYear:
        watch("marriageBoardRegisterationYear") !== ""
          ? watch("marriageBoardRegisterationYear")
          : null,
      registrationNumber: watch("mBoardRegNo"),
    };

    axios
      .post(
        `${urls.MR}/transaction/marriageBoardRegistration/getBySearchParams`,
        bodyForApi,
        // allvalues,
      )
      .then((resp) => {
        if (resp.status == 200) {
          swal(
            language == "en" ? "Searched!" : "शोधले!",
            language == "en" ? "Record Found!" : "रेकॉर्ड सापडले!",
            "success",
          );
          setTempData(resp.data);
          reset(resp.data);
          getWards(resp.data.zoneKey);
          setValue("otitleM", resp.data.otitle);
          setValue("ofNameM", resp.data.ofName);
          setValue("omNameM", resp.data.omName);
          setValue("olNameM", resp.data.olName);

          setValue("otitlemrM", resp.data.otitlemr);
          setValue("ofNameMrM", resp.data.ofNameMr);
          setValue("omNameMrM", resp.data.omNameMr);
          setValue("olNameMrM", resp.data.olNameMr);

          setValue("oflatBuildingNoM", resp.data.oflatBuildingNo);
          setValue("obuildingNameM", resp.data.obuildingName);
          setValue("oroadNameM", resp.data.oroadName);
          setValue("olandmarkM", resp.data.olandmark);
          setValue("ocityNameM", resp.data.ocityName);
          setValue("ostateM", resp.data.ostate);

          setValue("oflatBuildingNoMrM", resp.data.oflatBuildingNoMr);
          setValue("obuildingNameMrM", resp.data.obuildingNameMr);
          setValue("oroadNameMrM", resp.data.oroadNameMr);
          setValue("olandmarkMrM", resp.data.olandmarkMr);
          setValue("ocityNameMrM", resp.data.ocityNameMr);
          setValue("ostateMrM", resp.data.ostateMr);
          setValue("oemailM", resp.data.oemail);
          setValue("omobileNoM", resp.data.omobileNo);

          //board
          setValue("marriageBoardNameM", resp.data.marriageBoardName);
          setValue("marriageBoardNameMrM", resp.data.marriageBoardNameMr);
          setValue("bflatBuildingNoM", resp.data.bflatBuildingNo);
          setValue("bbuildingNameM", resp.data.bbuildingName);
          setValue("broadNameM", resp.data.broadName);
          setValue("blandmarkM", resp.data.blandmark);
          setValue("cityM", resp.data.city);
          setValue("bpincodeM", resp.data.bpincode);
          setValue("bLatitudeM", resp.data.blatitude);
          setValue("bLongitudeM", resp.data.blongitude);

          setValue("bflatBuildingNoMrM", resp.data.bflatBuildingNoMr);
          setValue("bbuildingNameMrM", resp.data.bbuildingNameMr);
          setValue("broadNameMrM", resp.data.broadNameMr);
          setValue("blandmarkMrM", resp.data.blandmarkMr);
          setValue("cityMrM", resp.data.cityMr);
          setValue("aadhaarNoM", resp.data.aadhaarNo);
          setValue("boardOrganizationPhoto", resp.data.boardOrganizationPhoto);

          setFlagSearch(true);
          setshowAccordian(false);
        }
      })
      .catch((error) => {
        console.log("133", error);
        swal("Error!", error?.response?.data?.message, "error");
      });
  };

  useEffect(() => {
    if (
      router.query.pageMode == "Edit" ||
      router.query.pageMode == "View" ||
      router.query.pageMode == "DOCUMENT CHECKLIST" ||
      router.query.pageMode == "DOCUMENT CHECKLIST"
    ) {
      // reset(router.query)
      axios
        .get(
          `${urls.MR}/transaction/modOfMarBoardCertificate/getapplicantById?applicationId=${router?.query?.id}`,
        )
        .then((resp) => {
          // if(router?.query?.pageMode!="View"){
          // console.log("useEffect1111");
          axios
            .get(
              `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${resp.data.trnApplicantId}`,
            )
            .then((rrr) => {
              // if(router?.query?.pageMode == "Edit"){
              reset(rrr.data);
              console.log("setFlag", resp.data);
              setFlagSearch(true);
              setValue("otitleM", resp.data.otitle);
              setValue("ofNameM", resp.data.ofName);
              setValue("omNameM", resp.data.omName);
              setValue("olNameM", resp.data.olName);

              setValue("otitlemrM", resp.data.otitlemr);
              setValue("ofNameMrM", resp.data.ofNameMr);
              setValue("omNameMrM", resp.data.omNameMr);
              setValue("olNameMrM", resp.data.olNameMr);

              setValue("oflatBuildingNoM", resp.data.oflatBuildingNo);
              setValue("obuildingNameM", resp.data.obuildingName);
              setValue("oroadNameM", resp.data.oroadName);
              setValue("olandmarkM", resp.data.olandmark);
              setValue("ocityNameM", resp.data.ocityName);
              setValue("ostateM", resp.data.ostate);

              setValue("oflatBuildingNoMrM", resp.data.oflatBuildingNoMr);
              setValue("obuildingNameMrM", resp.data.obuildingNameMr);
              setValue("oroadNameMrM", resp.data.oroadNameMr);
              setValue("olandmarkMrM", resp.data.olandmarkMr);
              setValue("ocityNameMrM", resp.data.ocityNameMr);
              setValue("ostateMrM", resp.data.ostateMr);
              setValue("omobileNoM", resp.data.omobileNo);
              setValue("oemailM", resp.data.oemail);

              //board
              setValue("marriageBoardNameM", resp.data.marriageBoardName);
              setValue("marriageBoardNameMrM", resp.data.marriageBoardNameMr);
              setValue("bflatBuildingNoM", resp.data.bflatBuildingNo);
              setValue("bbuildingNameM", resp.data.bbuildingName);
              setValue("broadNameM", resp.data.broadName);
              setValue("blandmarkM", resp.data.blandmark);
              setValue("cityM", resp.data.city);
              setValue("bpincodeM", resp.data.bpincode);
              setValue("bLatitudeM", resp.data.blatitude);
              setValue("bLongitudeM", resp.data.blongitude);

              setValue("bflatBuildingNoMrM", resp.data.bflatBuildingNoMr);
              setValue("bbuildingNameMrM", resp.data.bbuildingNameMr);
              setValue("broadNameMrM", resp.data.broadNameMr);
              setValue("blandmarkMrM", resp.data.blandmarkMr);
              setValue("cityMrM", resp.data.cityMr);
              setValue("aadhaarNoM", resp.data.aadhaarNo);
              setValue("identityProofMod", resp.data.identityProofMod);
              setValue("residentialProofMod", resp.data.residentialProofMod);
              setValue(
                "boardOrganizationPhotoMod",
                resp.data.boardOrganizationPhotoMod,
              );
              setValue("oldBoardCertificate", resp.data.oldBoardCertificate);
              setValue(
                "boardHeadPersonPhotoMod",
                resp.data.boardHeadPersonPhotoMod,
              );
              setValue(
                "boardOrganizationPhotoMod",
                resp.data.boardOrganizationPhotoMod,
              );
              setValue("panCardMod", resp.data.panCardMod);
              setValue("aadharCardMod", resp.data.aadharCardMod);
              setValue("rationCardMod", resp.data.rationCardMod);
              setValue("electricityBillMod", resp.data.electricityBillMod);
              setValue("otherDocMod", resp.data.otherDocMod);
              setValue("resolutionOfBoardMod", resp.data.resolutionOfBoardMod);
              setValue(
                "receiptOfPaymentOfpropertyTaxMod",
                resp.data.receiptOfPaymentOfpropertyTaxMod,
              );
              setValue(
                "agreemenyCopyOfPropertyMod",
                resp.data.agreemenyCopyOfPropertyMod,
              );
              setValue(
                "oldBoardCertificateMod",
                resp.data.oldBoardCertificateMod,
              );
              setValue("charitableMod", resp.data.charitableMod);
              // setValue("otitleM", rrr.data.otitle);
              // setValue("ofNameM", rrr.data.ofName);
              // setValue("omNameM", rrr.data.omName);
              // setValue("olNameM", rrr.data.olName);

              // setValue("otitlemrM", rrr.data.otitlemr);
              // setValue("ofNameMrM", rrr.data.ofNameMr);
              // setValue("omNameMrM", rrr.data.omNameMr);
              // setValue("olNameMrM", rrr.data.olNameMr);

              // setValue("oflatBuildingNoM", rrr.data.oflatBuildingNo);
              // setValue("obuildingNameM", rrr.data.obuildingName);
              // setValue("oroadNameM", rrr.data.oroadName);
              // setValue("olandmarkM", rrr.data.olandmark);
              // setValue("ocityNameM", rrr.data.ocityName);
              // setValue("ostateM", rrr.data.ostate);

              // setValue("oflatBuildingNoMrM", rrr.data.oflatBuildingNoMr);
              // setValue("obuildingNameMrM", rrr.data.obuildingNameMr);
              // setValue("oroadNameMrM", rrr.data.oroadNameMr);
              // setValue("olandmarkMrM", rrr.data.olandmarkMr);
              // setValue("ocityNameMrM", rrr.data.ocityNameMr);
              // setValue("ostateMrM", rrr.data.ostateMr);

              // // board
              // setValue("marriageBoardNameM", rrr.data.marriageBoardName);
              // setValue("marriageBoardNameMrM", rrr.data.marriageBoardNameMr);
              // setValue("bflatBuildingNoM", rrr.data.bflatBuildingNo);
              // setValue("bbuildingNameM", rrr.data.bbuildingName);
              // setValue("broadNameM", rrr.data.broadName);
              // setValue("blandmarkM", rrr.data.blandmark);
              // setValue("cityM", rrr.data.city);
              // setValue("bpincodeM", rrr.data.bpincode);

              // setValue("bflatBuildingNoMrM", rrr.data.bflatBuildingNoMr);
              // setValue("bbuildingNameMrM", rrr.data.bbuildingNameMr);
              // setValue("broadNameMrM", rrr.data.broadNameMr);
              // setValue("blandmarkMrM", rrr.data.blandmarkMr);
              // setValue("cityMrM", rrr.data.cityMr);
              // setValue("aadhaarNoM", rrr.data.aadhaarNo);
              // }else{
              // reset(rrr.data);
              // }
              // }
            });
          // }

          // setValue("identityProofMod", resp.data.identityProofMod);
          // setValue("residentialProofMod", resp.data.residentialProofMod);
          // setValue("boardOrganizationPhotoMod", resp.data.boardOrganizationPhotoMod);
        });
    }
  }, [router.query.pageMode]);
  // const [areaNames, setAreaNames] = useState([]);

  // const getAreas = async () => {
  //   await axios
  //     .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAlll`)
  //     .then((r) => {
  //       setAreaNames(r.data);
  //     });
  // };
  // // getZoneKeys
  // const getZoneKeys = () => {
  //   //setValues("setBackDrop", true);
  //   axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
  //     setZoneKeys(
  //       r.data.zone.map((row) => ({
  //         id: row.id,
  //         zoneName: row.zoneName,
  //         zoneNameMr: row.zoneNameMr,
  //       })),
  //     );
  //   });
  // };

  // wardKeys
  const [wardKeys, setWardKeys] = useState([]);

  // // getWardKeys
  const getWardKeys = async () => {
    await axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardKeys(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        })),
      );
    });
  };

  const [atitles, setatitles] = useState([]);

  const getTitles = async () => {
    await axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setatitles(
        r.data.title.map((row) => ({
          id: row.id,
          atitle: row.title,
          // titlemr: row.titlemr,
        })),
      );
    });
  };

  const [TitleMrs, setTitleMrs] = useState([]);

  const getTitleMr = async () => {
    await axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setTitleMrs(
        r.data.title.map((row) => ({
          id: row.id,
          atitlemr: row.titleMr,
        })),
      );
    });
  };

  // useEffect(() => {
  //   if (router.query.pageMode != "Add") setTemp1(getValues("zoneKey"));
  // }, [getValues("zoneKey")]);

  // useEffect(() => {
  //   if (router.query.pageMode != "View") setTemp(true);
  // }, [router.query.pageMode]);

  useEffect(() => {
    // getZoneKeys();
    // getWardKeys();
    getTitleMr();
    getTitles();
    // getAreas();
  }, [temp]);

  // useEffect(() => {
  //   if (router.query.pageMode != "Add" && watch("zoneKey")) getWardKeys();
  // }, [watch("zoneKey")]);

  useEffect(() => {
    // if (router.query.pageMode === 'EDIT' || router.query.pageMode === 'View') {
    //   reset(router.query)
    // }
    console.log("user123", user);
    setValue("atitle", user.title);
    setValue("afName", user.firstName);
    setValue("amName", user.middleName);
    setValue("alName", user.surname);
    setValue("afNameMr", user.firstNamemr);
    setValue("amNameMr", user.middleNamemr);
    setValue("alNameMr", user.surnamemr);
    setValue("genderKey", user.gender);
    // setValue("emailAddress", user.emailID);
    // setValue("mobile", user.mobile);

    setValue("aflatBuildingNo", user.cflatBuildingNo);
    setValue("abuildingName", user.cbuildingName);
    setValue("aroadName", user.croadName);
    setValue("alandmark", user.clandmark);
    setValue("apincode", user.cpinCode);
    setValue("acityName", user.cCity);
    setValue("astate", user.cState);

    setValue("aflatBuildingNoMr", user.cflatBuildingNoMr);
    setValue("abuildingNameMr", user.cbuildingNameMr);
    setValue("aroadNameMr", user.croadNameMr);
    setValue("alandmarkMr", user.clandmarkMr);
    setValue("acityNameMr", user.cCityMr);
    setValue("astateMr", user.cStateMr);
    setValue("aemail", user.emailID);
    setValue("amobileNo", user.mobile);
  }, [user]);

  // useEffect(() => {
  //   let ID;
  //   console.log("Simple useEffect");
  //   axios
  //     .get(
  //       `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${router.query.id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       },
  //     )
  //     .then((resp) => {
  //       console.log("Modify123", resp);
  //       reset(resp.data);
  //       setValue("otitleM", resp.data.otitle);
  //       setValue("ofNameM", resp.data.ofName);
  //       setValue("omNameM", resp.data.omName);
  //       setValue("olNameM", resp.data.olName);
  //       // setValue("wardKey", resp.data.wardKey);

  //       setValue("otitlemrM", resp.data.otitlemr);
  //       setValue("ofNameMrM", resp.data.ofNameMr);
  //       setValue("omNameMrM", resp.data.omNameMr);
  //       setValue("olNameMrM", resp.data.olNameMr);

  //       setValue("oflatBuildingNoM", resp.data.oflatBuildingNo);
  //       setValue("obuildingNameM", resp.data.obuildingName);
  //       setValue("oroadNameM", resp.data.oroadName);
  //       setValue("olandmarkM", resp.data.olandmark);
  //       setValue("ocityNameM", resp.data.ocityName);
  //       setValue("ostateM", resp.data.ostate);

  //       setValue("oflatBuildingNoMrM", resp.data.oflatBuildingNoMr);
  //       setValue("obuildingNameMrM", resp.data.obuildingNameMr);
  //       setValue("oroadNameMrM", resp.data.oroadNameMr);
  //       setValue("olandmarkMrM", resp.data.olandmarkMr);
  //       setValue("ocityNameMrM", resp.data.ocityNameMr);
  //       setValue("ostateMrM", resp.data.ostateMr);
  //       setValue("oemailM", resp.data.oemail);
  //       setValue("omobileNoM", resp.data.omobileNo);

  //       //board
  //       setValue("marriageBoardNameM", resp.data.marriageBoardName);
  //       setValue("marriageBoardNameMrM", resp.data.marriageBoardNameMr);
  //       setValue("bflatBuildingNoM", resp.data.bflatBuildingNo);
  //       setValue("bbuildingNameM", resp.data.bbuildingName);
  //       setValue("broadNameM", resp.data.broadName);
  //       setValue("blandmarkM", resp.data.blandmark);
  //       setValue("cityM", resp.data.city);
  //       setValue("bpincodeM", resp.data.bpincode);

  //       setValue("bflatBuildingNoMrM", resp.data.bflatBuildingNoMr);
  //       setValue("bbuildingNameMrM", resp.data.bbuildingNameMr);
  //       setValue("broadNameMrM", resp.data.broadNameMr);
  //       setValue("blandmarkMrM", resp.data.blandmarkMr);
  //       setValue("cityMrM", resp.data.cityMr);
  //       setValue("aadhaarNoM", resp.data.aadhaarNo);
  //       // setValue("mobile", resp.data.mobile);
  //       // setValue("emailAddress", resp.data.emailAddress);

  //       setTemp(true);
  //     });
  // }, [router.query]);

  useEffect(() => {
    console.log("errors:", disable);
    // console.log("boardOPhoto",watch('boardOrganizationPhotoMod'));
    // console.log("boardOPhotoOG",watch('boardOrganizationPhoto'));
  }, []);

  useEffect(() => {
    console.log("boardOPhoto:", watch("boardOrganizationPhotoMod"));
  }, [watch("boardOrganizationPhotoMod")]);

  //save

  const handleApply = () => {
    console.log("Booodddyyy", watch());
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
      applicationFrom: "online",
      pageMode: null,
      createdUserId: user.id,
      zoneKey: watch("zoneKey"),
      wardKey: watch("wardKey"),
      isPersonOrgansation: watch("isPersonOrgansation"),
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

      otitle: watch("otitleM"),
      ofName: watch("ofNameM"),
      omName: watch("omNameM"),
      olName: watch("olNameM"),

      otitlemr: watch("otitlemrM"),
      ofNameMr: watch("ofNameMrM"),
      omNameMr: watch("omNameMrM"),
      olNameMr: watch("olNameMrM"),

      oflatBuildingNo: watch("oflatBuildingNoM"),
      obuildingName: watch("obuildingNameM"),
      oroadName: watch("oroadNameM"),
      olandmark: watch("olandmarkM"),
      ocityName: watch("ocityNameM"),
      ostate: watch("ostateM"),

      oflatBuildingNoMr: watch("oflatBuildingNoMrM"),
      obuildingNameMr: watch("obuildingNameMrM"),
      oroadNameMr: watch("oroadNameMrM"),
      olandmarkMr: watch("olandmarkMrM"),
      ocityNameMr: watch("ocityNameMrM"),
      ostateMr: watch("ostateMrM"),
      omobileNo: watch("omobileNoM"),
      oemail: watch("oemailM"),

      //board

      marriageBoardName: watch("marriageBoardNameM"),
      marriageBoardNameMr: watch("marriageBoardNameMrM"),
      bflatBuildingNo: watch("bflatBuildingNoM"),
      bbuildingName: watch("bbuildingNameM"),
      broadName: watch("broadNameM"),
      blandmark: watch("blandmarkM"),
      city: watch("cityM"),
      bpincode: watch("bpincodeM"),
      blongitude: watch("bLongitudeM"),
      blatitude: watch("bLatitudeM"),

      bflatBuildingNoMr: watch("bflatBuildingNoMrM"),
      bbuildingNameMr: watch("bbuildingNameMrM"),
      broadNameMr: watch("broadNameMrM"),
      blandmarkMr: watch("blandmarkMrM"),
      cityMr: watch("cityMrM"),
      aadhaarNo: watch("aadhaarNoM"),
      serviceId: 15,
      trnApplicantId: getValues("applicationId"),

      // boardOrganizationPhotoMod: temp.boardOrganizationPhotoMod,
      // otherDoc: temp.otherDoc,
      // otherDoc: temp.otherDoc,
      // boardOrganizationPhoto: watch("boardOrganizationPhoto"),
      // residentialProof: watch("residentialProof"),
      // identityProof: watch("identityProof"),

      // oldBoardCertificate: watch("oldBoardCertificate"),
      registrationNumber: watch("registrationNumber"),
      // boardOrganizationPhotoMod: watch("boardOrganizationPhotoMod"),
      // residentialProofMod: watch("residentialProofMod"),
      // identityProofMod: watch("identityProofMod"),
      // charitable: watch("charitable"),

      boardHeadPersonPhotoMod: watch("boardOrganizationPhotoMod"),
      boardOrganizationPhotoMod: watch("panCardMod"),
      panCardMod: watch("aadharCardMod"),
      aadharCardMod: watch("aadharCardMod"),
      rationCardMod: watch("rationCardMod"),
      electricityBillMod: watch("electricityBillMod"),
      otherDocMod: watch("otherDocMod"),
      resolutionOfBoardMod: watch("resolutionOfBoardMod"),
      receiptOfPaymentOfpropertyTaxMod: watch(
        "receiptOfPaymentOfpropertyTaxMod",
      ),
      agreemenyCopyOfPropertyMod: watch("agreemenyCopyOfPropertyMod"),
      oldBoardCertificateMod: watch("oldBoardCertificateMod"),
      charitableMod: watch("charitableMod"),
    };
    const finalBodyEdit = {
      applicantType: userType,
      applicationFrom: "online",
      activeFlag: "Y",
      id: router.query.id,
      pageMode: null,
      createdUserId: user.id,
      zoneKey: watch("zoneKey"),
      wardKey: watch("wardKey"),
      isPersonOrgansation: watch("isPersonOrgansation"),

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

      otitle: watch("otitleM"),
      ofName: watch("ofNameM"),
      omName: watch("omNameM"),
      olName: watch("olNameM"),

      otitlemr: watch("otitlemrM"),
      ofNameMr: watch("ofNameMrM"),
      omNameMr: watch("omNameMrM"),
      olNameMr: watch("olNameMrM"),

      oflatBuildingNo: watch("oflatBuildingNoM"),
      obuildingName: watch("obuildingNameM"),
      oroadName: watch("oroadNameM"),
      olandmark: watch("olandmarkM"),
      ocityName: watch("ocityNameM"),
      ostate: watch("ostateM"),

      oflatBuildingNoMr: watch("oflatBuildingNoMrM"),
      obuildingNameMr: watch("obuildingNameMrM"),
      oroadNameMr: watch("oroadNameMrM"),
      olandmarkMr: watch("olandmarkMrM"),
      ocityNameMr: watch("ocityNameMrM"),
      ostateMr: watch("ostateMrM"),

      //board

      marriageBoardName: watch("marriageBoardNameM"),
      marriageBoardNameMr: watch("marriageBoardNameMrM"),
      bflatBuildingNo: watch("bflatBuildingNoM"),
      bbuildingName: watch("bbuildingNameM"),
      broadName: watch("broadNameM"),
      blandmark: watch("blandmarkM"),
      city: watch("cityM"),
      bpincode: watch("bpincodeM"),
      blongitude: watch("bLongitudeM"),
      blatitude: watch("bLatitudeM"),
      bflatBuildingNoMr: watch("bflatBuildingNoMrM"),
      bbuildingNameMr: watch("bbuildingNameMrM"),
      broadNameMr: watch("broadNameMrM"),
      blandmarkMr: watch("blandmarkMrM"),
      cityMr: watch("cityMrM"),
      aadhaarNo: watch("aadhaarNoM"),
      serviceId: 15,
      trnApplicantId: getValues("id"),
      registrationNumber: watch("registrationNumber"),

      // oldBoardCertificate: watch("oldBoardCertificate"),
      // charitable: watch("charitable"),
      // boardOrganizationPhotoMod: temp.boardOrganizationPhotoMod,
      // otherDoc: temp.otherDoc,
      // otherDoc: temp.otherDoc,
      // boardOrganizationPhoto: watch("boardOrganizationPhoto"),
      // residentialProof: watch("residentialProof"),
      // identityProof: watch("identityProof"),
      // boardOrganizationPhotoMod: tempData.boardOrganizationPhotoMod,
      // residentialProofMod: tempData.residentialProofMod,

      boardHeadPersonPhotoMod: watch("boardOrganizationPhotoMod"),
      boardOrganizationPhotoMod: watch("panCardMod"),
      panCardMod: watch("aadharCardMod"),
      aadharCardMod: watch("aadharCardMod"),
      rationCardMod: watch("rationCardMod"),
      electricityBillMod: watch("electricityBillMod"),
      otherDocMod: watch("otherDocMod"),
      resolutionOfBoardMod: watch("resolutionOfBoardMod"),
      receiptOfPaymentOfpropertyTaxMod: watch(
        "receiptOfPaymentOfpropertyTaxMod",
      ),
      agreemenyCopyOfPropertyMod: watch("agreemenyCopyOfPropertyMod"),
      oldBoardCertificateMod: watch("oldBoardCertificateMod"),
      charitableMod: watch("charitableMod"),
    };
    setLoader(true);
    console.log("Booodddyyy", finalBodyEdit);
    {
      router?.query?.pageMode == "Edit"
        ? axios
            .post(
              `${urls.MR}/transaction/modOfMarBoardCertificate/saveModOfMarBoardCertificate`,
              finalBodyEdit,
            )
            .then((res) => {
              console.log("res321", res);
              if (res.status == 200 || res.status == 201) {
                setLoader(false);
                // swal(
                //   "Applied!",
                //   "Application Applied Successfully !",
                //   "success",
                // );

                swal(
                  language == "en" ? "Applied!" : "लागू केले !",
                  language == "en"
                    ? "Application Applied Successfully !"
                    : "अर्ज यशस्वीरित्या लागू झाला!",
                  "success",
                );
                router.push({
                  pathname: `/dashboard`,
                  // query: {
                  //   userId: user.id,
                  //   serviceId: 15,
                  //   id: res?.data?.message?.split("$")[1],
                  // },
                });
              }
            })
            .catch((err) => {
              console.log(err.response);
              swal(
                language == "en" ? "Submited!" : "सादर केले!",
                language == "en"
                  ? "Something problem with the search !"
                  : "शोधात काहीतरी समस्या आहे!",
                "error",
              );
            })
        : axios
            .post(
              `${urls.MR}/transaction/modOfMarBoardCertificate/saveModOfMarBoardCertificate`,
              finalBody,
            )
            .then((res) => {
              setLoader(false);
              console.log("res321", res);
              if (res.status == 200 || res.status == 201) {
                swal(
                  language == "en" ? "Applied!" : "लागू केले !",
                  language == "en"
                    ? "Application Applied Successfully !"
                    : "अर्ज यशस्वीरित्या लागू झाला!",
                  "success",
                );
                router.push({
                  pathname: `/marriageRegistration/Receipts/acknowledgmentReceiptmarathi`,
                  query: {
                    userId: user.id,
                    serviceId: 15,
                    id: res?.data?.message?.split("$")[1],
                  },
                });
              }
            })
            .catch((err) => {
              console.log(err.response);
              // swal(
              //   "Submitted!",
              //   "Something problem with the search !",
              //   "error",
              // );

              swal(
                language == "en" ? "Submited!" : "सादर केले!",
                language == "en"
                  ? "Something problem with the search !"
                  : "शोधात काहीतरी समस्या आहे!",
                "error",
              );
            });
    }
  };

  // useEffect(() => {
  //   console.log("kay mhantay", errors);
  // }, [errors]);
  // console.log("kay mhanta1", user);

  const handleClear = () => {
    {
      setValue("otitleM", "");
    }
    {
      setValue("otitlemrM", "");
    }
    {
      setValue("ofNameM", "");
    }
    {
      setValue("ofNameMrM", "");
    }
    {
      setValue("omNameM", "");
    }
    {
      setValue("omNameMrM", "");
    }
    {
      setValue("olNameM", "");
    }
    {
      setValue("olNameMrM", "");
    }
    {
      setValue("oflatBuildingNoM", "");
    }
    {
      setValue("oflatBuildingNoMrM", "");
    }
    {
      setValue("obuildingNameM", "");
    }
    {
      setValue("obuildingNameMrM", "");
    }
    {
      setValue("oroadNameM", "");
    }
    {
      setValue("oroadNameMrM", "");
    }
    {
      setValue("olandmarkM", "");
    }
    {
      setValue("olandmarkMrM", "");
    }
    {
      setValue("ocityNameM", "");
    }
    {
      setValue("ocityNameMrM", "");
    }
    {
      setValue("ostateM", "");
    }
    {
      setValue("ostateMrM", "");
    }
    {
      setValue("marriageBoardNameM", "");
    }
    {
      setValue("marriageBoardNameMrM", "");
    }
    {
      setValue("bflatBuildingNoM", "");
    }
    {
      setValue("bflatBuildingNoMrM", "");
    }
    {
      setValue("bbuildingNameM", "");
    }
    {
      setValue("bbuildingNameMrM", "");
    }
    {
      setValue("broadNameM", "");
    }
    {
      setValue("broadNameMrM", "");
    }
    {
      setValue("blandmarkM", "");
    }
    {
      setValue("blandmarkMrM", "");
    }
    {
      setValue("cityM", "");
    }
    {
      setValue("cityMrM", "");
    }
    {
      setValue("bpincodeM", "");
    }
    {
      setValue("aadhaarNoM", "");
    }
    {
      setValue("omobileNoM", "");
    }
    {
      setValue("oemailM", "");
    }
  };
  // const setWardZoneBasedOnArrray = () => {

  //   if (watch("areaKey") != null) {
  //     let anotherFind = areaNames?.find(
  //       (data) => data?.uniqueId == watch("areaKey"),
  //     );
  //     console.log("filteredArrayZone1212", anotherFind);
  //     setValue("zoneKey", anotherFind?.zoneId);
  //     setValue("wardKey", anotherFind?.wardId);
  //   } else {
  //     setValue("zoneKey", null);
  //     setValue("wardKey", null);
  //   }
  // };

  useEffect(() => {
    console.log("erors223", errors);
  }, [errors]);
  // ******************* area Zone ward***************************

  const [areaDropDown, setAreaDropDown] = useState([]);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [wardDropDown, setWardDropDown] = useState([]);

  useEffect(() => {
    !router.query.id && getZones();

    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAlll`)
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
              j?.areaNameMr + " - " + j?.zoneNameMr + " - " + j?.wardNameMr,
          })),
        );
      });

    //Get Zone
    router.query.id &&
      axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
        setZoneDropDown(
          res.data.zone.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            zoneEn: j.zoneName,
            zoneMr: j.zoneNameMr,
          })),
        );
      });

    //Get Ward
    router.query.id &&
      axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
        setWardDropDown(
          res.data.ward.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            wardEn: j.wardName,
            wardMr: j.wardNameMr,
          })),
        );
      });
  }, []);

  const getZones = () => {
    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getZoneByApplicationId`)
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
        swal(
          language == "en" ? "Error!" : "समस्या आहे!",
          language == "en" ? "Something went wrong !" : "काहीतरी चूक झाली!",
          "error",
        );
        setLoader(false);
      });
  };
  const getWards = (zoneId) => {
    setLoader(true);
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId`,
        { params: { zoneId } },
      )
      .then((res) => {
        setWardDropDown(
          res.data.map((wards) => ({
            id: wards.wardId,
            wardEn: wards.wardName,
            wardMr: wards.wardNameMr,
          })),
        );
        setLoader(false);
      })
      .catch((error) => {
        swal(
          language == "en" ? "Error!" : "समस्या आहे!",
          language == "en" ? "Something went wrong !" : "काहीतरी चूक झाली!",
          "error",
        );
        setLoader(false);
      });
  };

  const getAreas = (zoneId, wardId) => {
    setLoader(true);
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId`,
        { params: { zoneId, wardId } },
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
        setLoader(false);
      })
      .catch((error) => {
        swal(
          language == "en" ? "Error!" : "समस्या आहे!",
          language == "en" ? "Something went wrong !" : "काहीतरी चूक झाली!",
          "error",
        );
        setLoader(false);
      });
  };

  // return1
  return (
    <>
      {" "}
      {loader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh", // Adjust itasper requirement.
          }}
        >
          <Paper
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "50%",
              padding: 8,
            }}
            elevation={8}
          >
            <CircularProgress color="success" />
          </Paper>
        </div>
      ) : (
        <div>
          {!props.preview && !props.onlyDoc && (
            <>
              {console.log("odosadasd", getValues("wardKey"))}
              <Paper
                sx={{
                  marginLeft: 5,
                  marginRight: 2,
                  marginTop: 5,
                  marginBottom: 2,
                  padding: 1,
                  border: 1,
                  borderColor: "grey.500",
                }}
              >
                <>
                  <div className={styles.details}>
                    <div className={styles.h1Tag}>
                      <h3
                        style={{
                          color: "white",
                          marginTop: "7px",
                        }}
                      >
                        {<FormattedLabel id="onlyMMBR" />}
                      </h3>
                    </div>
                  </div>
                  {router?.query?.pageMode == "Edit" && (
                    <HistoryComponent
                      serviceId={15}
                      applicationId={router?.query?.id}
                    />
                  )}

                  {/* filter */}
                  {router?.query?.pageMode == "View" ||
                  router?.query?.pageMode == "Edit" ? (
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
                            <FormattedLabel id="registrationNumber" required />
                          }
                          variant="standard"
                          {...register("registrationNumber")}
                        />
                        {/* </div> */}
                        {/* <div className={styles.row}> */}
                        <FormControl sx={{ marginTop: 0 }}>
                          <Controller
                            control={control}
                            name="registrationDate"
                            defaultValue={null}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  disabled={true}
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 14 }}>
                                      {
                                        <FormattedLabel
                                          id="registrationDate"
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
                              backgroundColor: "#278bff",
                              color: "white",
                              textTransform: "uppercase",
                            }}
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            }
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            backgroundColor="#278bff"
                          >
                            <Typography>
                              {" "}
                              {language == "en"
                                ? "1) Marriage Board Reg Number *"
                                : "1) विवाह मंडळ नोंदणी क्रमांक *"}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel
                                      id="registerationNo"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  {...register("mBoardRegNo")}
                                />
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                        <div style={{ textAlign: "center" }}>
                          <Typography variant="h6">OR</Typography>
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
                              backgroundColor: "#278bff",
                              color: "white",
                              textTransform: "uppercase",
                            }}
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            }
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            backgroundColor="#278bff"
                            // sx={{
                            //   backgroundColor: '0070f3',
                            // }}
                          >
                            <Typography>
                              {" "}
                              {language == "en"
                                ? "2) Marriage Board Registration Name * ,Marriage Board Registration Date *"
                                : "2) विवाह मंडळ नोंदणी नाव *, विवाह मंडळ नोंदणी तारीख *"}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  //  disabled
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="mbrName" required />
                                  }
                                  // label={"Marriage Board Reg Name"}
                                  variant="standard"
                                  defaultValue={null}
                                  {...register("mBoardRegNameF")}
                                  name="mBoardRegNameF"
                                  // error={!!errors.aFName}
                                  // helperText={errors?.aFName ? errors.aFName.message : null}
                                />
                              </div>
                              <div style={{ marginTop: "10px" }}>
                                <FormControl sx={{ marginTop: 0 }}>
                                  <Controller
                                    control={control}
                                    name="marriageBoardRegistrationDate"
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
                                                  id="mbrDate"
                                                  required
                                                />
                                              }
                                              {/* Marriage Board Reg Date */}
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
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                        <div style={{ textAlign: "center" }}>
                          <Typography variant="h6">OR</Typography>
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
                              backgroundColor: "#278bff",
                              color: "white",
                              textTransform: "capitalize",
                            }}
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            }
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            backgroundColor="#278bff"
                          >
                            <Typography>
                              {" "}
                              {language == "en"
                                ? "3) MARRIAGE BOARD REGISTRATION NAME* , MARRIAGE BOARD REGISTRATION YEAR *"
                                : "3) विवाह मंडळ नोंदणी नाव *, विवाह मंडळ नोंदणी वर्ष *"}{" "}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="mbrName" required />
                                  }
                                  variant="standard"
                                  {...register("mBoardRegName")}
                                  name="mBoardRegName"
                                />
                              </div>

                              <div>
                                <TextField
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="mbrYear" required />
                                  }
                                  variant="standard"
                                  {...register(
                                    "marriageBoardRegisterationYear",
                                  )}
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
                              onClick={() => {
                                handleSearch();
                              }}
                            >
                              {<FormattedLabel id="search" />}
                            </Button>
                          </div>
                        </div>
                      </>
                    )
                  )}
                </>
              </Paper>
            </>
          )}

          {flagSearch ? (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleApply)}>
                <ThemeProvider theme={theme}>
                  <Paper
                    sx={{
                      marginLeft: 5,
                      marginRight: 2,
                      marginTop: 2,
                      marginBottom: 5,
                      padding: 1,
                      border: 1,
                      borderColor: "grey.500",
                    }}
                  >
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
                              border: "1px solid white",
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
                              <FormattedLabel id="ApplicatDetails" />
                            </Typography>
                          </AccordionSummary>

                          <AccordionDetails>
                            <Grid
                              container
                              // xs={12}
                              // sm={12}
                              // md={12}
                              // style={{
                              //   display: "flex",
                              //   justifyContent: "center",
                              //   alignItems: "center",
                              // }}
                            >
                              <Grid
                                container
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                xl={3}
                                style={{
                                  // display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <FormControl
                                  disabled={disable}
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
                                container
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                xl={3}
                                style={{
                                  // display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <FormControl
                                  disabled={disable}
                                  variant="standard"
                                  error={!!errors.zoneKey}
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
                                    {errors?.zoneKey
                                      ? errors.zoneKey.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </Grid>
                              <Grid
                                container
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                xl={3}
                                style={{
                                  // display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <FormControl
                                  disabled={disable}
                                  variant="standard"
                                  error={!!errors.wardKey}
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
                                          // !router.query.id &&
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
                                    {errors?.wardKey
                                      ? errors.wardKey.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </Grid>
                              {/* <AreaWardZoneMapping /> */}
                              {/* <Grid
                                container
                                xs={12}
                                sm={12}
                                md={6}
                                lg={4}
                                xl={4}
                                style={{
                                  //   display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <div>
                                  <FormControl
                                    variant="standard"
                                    // sx={{ marginTop: 1 }}
                                    error={!!errors.areaKey}
                                    disabled={disable}
                                  >
                                    <Controller
                                      //! Sachin_😴
                                      name="areaKey"
                                      control={control}
                                      defaultValue={null}
                                      render={({ field: { onChange, value } }) => (
                                        <Autocomplete

                                          id="controllable-states-demo"
                                          variant="standard"
                                          onChange={(event, newValue) => {
                                            setValue("uniqueId", newValue?.uniqueId);
                                            onChange(newValue ? newValue?.uniqueId : null);
                                            setWardZoneBasedOnArrray();
                                          }}
                                          value={
                                            areaNames?.find((data) => data?.uniqueId === value) ||
                                            null
                                          }
                                          options={areaNames} //! api Data
                                          getOptionLabel={(areaName) =>
                                            language == "en"
                                              ? areaName?.areaName +
                                              " - " +
                                              areaName?.zoneName +
                                              " - " +
                                              areaName?.wardName
                                              : areaName?.areaNameMr +
                                              " - " +
                                              areaName?.zoneNameMr +
                                              " -" +
                                              areaName?.wardNameMr
                                          }
                                          //! Display name the Autocomplete
                                          renderInput={(params) => (
                                            <TextField

                                              variant="standard"
                                              sx={{
                                                m: { xs: 0, md: 1 },
                                                minWidth: "100%",
                                              }}
                                              {...params}
                                              label={language == "en" ? "Area Name" : "Area Name"}
                                            />
                                          )}
                                        />
                                      )}
                                    />
                                  </FormControl>
                                </div>
                              </Grid>
                              <Grid
                                container
                                xs={12}
                                sm={12}
                                md={6}
                                lg={4}
                                xl={4}
                                style={{
                                  // display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <div>
                                  <FormControl
                                    variant="standard"
                                    sx={{ marginTop: 1 }}
                                    error={!!errors.zoneKey}
                                  >
                                    <InputLabel id="demo-simple-select-standard-label">
                                      <FormattedLabel id="zone" required />
                                    </InputLabel>
                                    <Controller
                                      render={({ field }) => (
                                        <Select
                                          disabled={disable}
                                          autoFocus
                                          value={field.value}
                                          onChange={(value) => {
                                            field.onChange(value);

                                            setTemp(value.target.value);
                                          }}
                                          label="Zone Name *"
                                        >
                                          {zoneKeys &&
                                            zoneKeys.map((zoneKey, index) => (
                                              <MenuItem key={index} value={zoneKey.id}>
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
                                    <FormHelperText>
                                      {errors?.zoneKey ? errors.zoneKey.message : null}
                                    </FormHelperText>
                                  </FormControl>
                                </div>
                              </Grid>
                              <Grid
                                container
                                xs={12}
                                sm={12}
                                md={6}
                                lg={4}
                                xl={4}
                                style={{
                                  // display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <div>
                                  <FormControl
                                    variant="standard"
                                    sx={{ marginTop: 1 }}
                                    error={!!errors.wardKey}
                                  >
                                    <InputLabel id="demo-simple-select-standard-label">
                                      <FormattedLabel id="ward" required />
                                    </InputLabel>
                                    <Controller
                                      render={({ field }) => (
                                        <Select
                                          disabled={disable}
                                          value={field.value}
                                          onChange={(value) => field.onChange(value)}
                                          label="Ward Name *"
                                        >
                                          {wardKeys &&
                                            wardKeys.map((wardKey, index) => (
                                              <MenuItem key={index} value={wardKey.id}>
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
                                    <FormHelperText>
                                      {errors?.wardKey ? errors.wardKey.message : null}
                                    </FormHelperText>
                                  </FormControl>
                                </div>
                              </Grid> */}
                              <Grid
                                container
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                xl={3}
                                style={{
                                  // display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <div>
                                  <FormControl
                                    sx={{
                                      width: "230px",
                                      marginTop: "7px",
                                    }}
                                    variant="standard"
                                    error={!!errors.isPersonOrgansation}
                                  >
                                    {/* <FormControl> */}
                                    <InputLabel>
                                      {language == "en"
                                        ? "Board Type"
                                        : "बोर्ड प्रकार"}
                                    </InputLabel>
                                    <Controller
                                      name="isPersonOrgansation"
                                      control={control}
                                      defaultValue=""
                                      render={({ field }) => (
                                        <Select {...field} disabled={disable}>
                                          <MenuItem value={"individual"}>
                                            {language == "en"
                                              ? "Individual"
                                              : "वैयक्तीक "}
                                          </MenuItem>
                                          <MenuItem value={"organisation"}>
                                            {language == "en"
                                              ? "Organisation"
                                              : "विश्वस्त संस्था  "}
                                          </MenuItem>
                                          {/* <MenuItem value="option3">Option 4</MenuItem> */}
                                        </Select>
                                      )}
                                    />
                                    <FormHelperText>
                                      {errors?.isPersonOrgansation
                                        ? errors.isPersonOrgansation.message
                                        : null}
                                    </FormHelperText>
                                  </FormControl>
                                </div>
                              </Grid>
                            </Grid>
                            {/* <div className={styles.wardZone}>
                          <div>
                            <FormControl
                              variant="standard"
                              sx={{ marginTop: 2 }}
                              error={!!errors.zoneKey}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="zone" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    disabled={disable}
                                    //sx={{ width: 230 }}
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      console.log(
                                        "Zone Key: ",
                                        value.target.value,
                                      );
                                      setTemp(value.target.value);
                                    }}
                                    label="Zone Name  "
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
                              <FormHelperText>
                                {errors?.zoneKey
                                  ? errors.zoneKey.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </div>
                          <div className={styles.wardZone}>
                            <FormControl
                              variant="standard"
                              sx={{ marginTop: 2 }}
                              error={!!errors.wardKey}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="ward" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    disabled={disable}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label="Ward Name "
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
                              <FormHelperText>
                                {errors?.wardKey
                                  ? errors.wardKey.message
                                  : null}
                              </FormHelperText>
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
                                    <FormattedLabel id="title1" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled={disable}
                                        // disabled
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        label="Title  "
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {atitles &&
                                          atitles.map((atitle, index) => (
                                            <MenuItem key={index} value={atitle.id}>
                                              {atitle.atitle}
                                              
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="atitle"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.atitle ? errors.atitle.message : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}

                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    // margin: "250px",
                                  }}
                                  _key={"afName"}
                                  width={250}
                                  labelName={"afName"}
                                  fieldName={"afName"}
                                  updateFieldName={"afNameMr"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"afNameMr"}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="firstName" required />
                                  }
                                  error={!!errors.afName}
                                  helperText={
                                    errors?.afName
                                      ? errors.afName.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            // disabled={true}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="firstName" required />}
                            // label="First Name *"
                            rule={{ required: true }}
                            variant="standard"
                            {...register("afName")}
                            error={!!errors.afName}
                            helperText={errors?.afName ? errors.afName.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    // margin: "250px",
                                  }}
                                  width={250}
                                  _key={"amName"}
                                  labelName={"amName"}
                                  fieldName={"amName"}
                                  updateFieldName={"amNameMr"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"amNameMr"}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="middleName" required />
                                  }
                                  error={!!errors.amName}
                                  helperText={
                                    errors?.amName
                                      ? errors.amName.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            // disabled={true}
                            //  disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="Middle Name *"
                            label={<FormattedLabel id="middleName" required />}
                            variant="standard"
                            {...register("amName")}
                            error={!!errors.amName}
                            helperText={errors?.amName ? errors.amName.message : null}
                          /> */}
                              </div>
                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    // margin: "250px",
                                  }}
                                  width={250}
                                  _key={"alName"}
                                  labelName={"alName"}
                                  fieldName={"alName"}
                                  updateFieldName={"alNameMr"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"alNameMr"}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="lastName" required />
                                  }
                                  error={!!errors.alName}
                                  helperText={
                                    errors?.alName
                                      ? errors.alName.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            // disabled={true}
                            // disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="Last Name *"
                            label={<FormattedLabel id="lastName" required />}
                            variant="standard"
                            {...register("alName")}
                            error={!!errors.alName}
                            helperText={errors?.alName ? errors.alName.message : null}
                          /> */}
                              </div>
                            </div>

                            <div className={styles.row}>
                              {/* <div>
                                <FormControl
                                  variant="standard"
                                  error={!!errors.atitlemr}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="titlemr" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled={disable}
                                        // disabled
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        label="Title  "
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {TitleMrs &&
                                          TitleMrs.map((atitlemr, index) => (
                                            <MenuItem
                                              key={index}
                                              value={atitlemr.id}
                                            >
                                              {atitlemr.atitlemr}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="atitlemr"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.atitlemr
                                      ? errors.atitlemr.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}

                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    // margin: "250px",
                                  }}
                                  width={250}
                                  _key={"afNameMr"}
                                  labelName={"afNameMr"}
                                  fieldName={"afNameMr"}
                                  updateFieldName={"afName"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"afName"}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="firstNamemr" required />
                                  }
                                  error={!!errors.afNameMr}
                                  helperText={
                                    errors?.afNameMr
                                      ? errors.afNameMr.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            // disabled={true}
                            //  disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="प्रथम नावं *"
                            label={<FormattedLabel id="firstNamemr" required />}
                            // label=" Hello"
                            variant="standard"
                            {...register("afNameMr")}
                            error={!!errors.afNameMr}
                            helperText={errors?.afNameMr ? errors.afNameMr.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    // margin: "250px",
                                  }}
                                  width={250}
                                  _key={"amNameMr"}
                                  labelName={"amNameMr"}
                                  fieldName={"amNameMr"}
                                  updateFieldName={"amName"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"amName"}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel
                                      id="middleNamemr"
                                      required
                                    />
                                  }
                                  error={!!errors.amNameMr}
                                  helperText={
                                    errors?.amNameMr
                                      ? errors.amNameMr.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            // disabled={true}
                            //  disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            //label="Middle Name *"
                            label={<FormattedLabel id="middleNamemr" required />}
                            // label="मधले नावं *"
                            variant="standard"
                            {...register("amNameMr")}
                            error={!!errors.amNameMr}
                            helperText={errors?.amNameMr ? errors.amNameMr.message : null}
                          /> */}
                              </div>
                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    // margin: "250px",
                                  }}
                                  width={250}
                                  _key={"alNameMr"}
                                  labelName={"alNameMr"}
                                  fieldName={"alNameMr"}
                                  updateFieldName={"alName"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"alName"}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="lastNamemr" required />
                                  }
                                  error={!!errors.alNameMr}
                                  helperText={
                                    errors?.alNameMr
                                      ? errors.alNameMr.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            // disabled={true}
                            // disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            //label="Last Name *"
                            label={<FormattedLabel id="lastNamemr" required />}
                            // label="आडनाव *"
                            variant="standard"
                            {...register("alNameMr")}
                            error={!!errors.alNameMr}
                            helperText={errors?.alNameMr ? errors.alNameMr.message : null}
                          /> */}
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
                                  {<FormattedLabel id="Addrees" />}
                                </h3>
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  disabled={disable}
                                  // disabled={true}
                                  //  disabled
                                  InputLabelProps={{
                                    shrink: watch("aflatBuildingNo")
                                      ? true
                                      : false,
                                  }}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="flatBuildingNo" />}
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
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"abuildingName"}
                                  labelName={"abuildingName"}
                                  fieldName={"abuildingName"}
                                  updateFieldName={"abuildingNameMr"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"abuildingNameMr"}
                                  width={250}
                                  // disabled={disabled}
                                  label={<FormattedLabel id="buildingName" />}
                                  error={!!errors.abuildingName}
                                  helperText={
                                    errors?.abuildingName
                                      ? errors.abuildingName.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            // disabled={true}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingName" required />}
                            variant="standard"
                            {...register("abuildingName")}
                            error={!!errors.abuildingName}
                            helperText={errors?.abuildingName ? errors.abuildingName.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"aroadName"}
                                  labelName={"aroadName"}
                                  fieldName={"aroadName"}
                                  updateFieldName={"aroadNameMr"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"aroadNameMr"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="roadName" required />
                                  }
                                  error={!!errors.aroadName}
                                  helperText={
                                    errors?.aroadName
                                      ? errors.aroadName.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            // disabled={true}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" required />}
                            variant="standard"
                            {...register("aroadName")}
                            error={!!errors.aroadName}
                            helperText={errors?.aroadName ? errors.aroadName.message : null}
                          /> */}
                              </div>
                            </div>
                            <div className={styles.row3}>
                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"alandmark"}
                                  labelName={"alandmark"}
                                  fieldName={"alandmark"}
                                  updateFieldName={"alandmarkMr"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"alandmarkMr"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="Landmark" required />
                                  }
                                  error={!!errors.alandmark}
                                  helperText={
                                    errors?.alandmark
                                      ? errors.alandmark.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            // disabled={true}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmark" required />}
                            variant="standard"
                            {...register("alandmark")}
                            error={!!errors.alandmark}
                            helperText={errors?.alandmark ? errors.alandmark.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"acityName"}
                                  labelName={"acityName"}
                                  fieldName={"acityName"}
                                  updateFieldName={"acityNameMr"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"acityNameMr"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="cityName" required />
                                  }
                                  error={!!errors.acityName}
                                  helperText={
                                    errors?.acityName
                                      ? errors.acityName.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityName" required />}
                            variant="standard"
                            {...register("acityName")}
                            error={!!errors.acityName}
                            helperText={errors?.acityName ? errors.acityName.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"astate"}
                                  labelName={"astate"}
                                  fieldName={"astate"}
                                  updateFieldName={"astateMr"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"astateMr"}
                                  width={250}
                                  // disabled={disabled}
                                  label={<FormattedLabel id="State" required />}
                                  error={!!errors.astate}
                                  helperText={
                                    errors?.astate
                                      ? errors.astate.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            //  disabled
                            // disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="State" required />}
                            variant="standard"
                            {...register("astate")}
                            error={!!errors.astate}
                            helperText={errors?.astate ? errors.astate.message : null}
                          /> */}
                              </div>
                            </div>

                            {/* marathi Adress */}

                            <div className={styles.row}>
                              <div>
                                <TextField
                                  disabled={disable}
                                  // disabled={true}
                                  InputLabelProps={{
                                    shrink: watch("aflatBuildingNoMr")
                                      ? true
                                      : false,
                                  }}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="flatBuildingNomr" />
                                  }
                                  variant="standard"
                                  //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                                  //  value={pflatBuildingNo}
                                  // onChange={(e) => setValue(e.target.pflatBuildingNo)}
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
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"abuildingNameMr"}
                                  labelName={"abuildingNameMr"}
                                  fieldName={"abuildingNameMr"}
                                  updateFieldName={"abuildingName"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"abuildingName"}
                                  width={250}
                                  // disabled={disabled}
                                  label={<FormattedLabel id="buildingNamemr" />}
                                  error={!!errors.abuildingNameMr}
                                  helperText={
                                    errors?.abuildingNameMr
                                      ? errors.abuildingNameMr.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            // disabled={true}
                            //  disabled
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingNamemr" required />}
                            variant="standard"
                            {...register("abuildingNameMr")}
                            error={!!errors.abuildingNameMr}
                            helperText={errors?.abuildingNameMr ? errors.abuildingNameMr.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"aroadNameMr"}
                                  labelName={"aroadNameMr"}
                                  fieldName={"aroadNameMr"}
                                  updateFieldName={"aroadName"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"aroadNameMr"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="roadNamemr" required />
                                  }
                                  error={!!errors.aroadNameMr}
                                  helperText={
                                    errors?.aroadNameMr
                                      ? errors.aroadNameMr.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            // disabled={true}
                            //  disabled
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadNamemr" required />}
                            // label="गल्लीचे नाव"
                            variant="standard"
                            {...register("aroadNameMr")}
                            error={!!errors.aroadNameMr}
                            helperText={errors?.aroadNameMr ? errors.aroadNameMr.message : null}
                          /> */}
                              </div>
                            </div>
                            <div className={styles.row3}>
                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"alandmarkMr"}
                                  labelName={"alandmarkMr"}
                                  fieldName={"alandmarkMr"}
                                  updateFieldName={"alandmark"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"alandmark"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="Landmarkmr" required />
                                  }
                                  error={!!errors.alandmarkMr}
                                  helperText={
                                    errors?.alandmarkMr
                                      ? errors.alandmarkMr.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            //  disabled
                            // disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmarkmr" required />}
                            // label="जमीन चिन्ह"
                            variant="standard"
                            {...register("alandmarkMr")}
                            error={!!errors.alandmarkMr}
                            helperText={errors?.alandmarkMr ? errors.alandmarkMr.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"acityNameMr"}
                                  labelName={"acityNameMr"}
                                  fieldName={"acityNameMr"}
                                  updateFieldName={"acityName"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"acityName"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="cityNamemr" required />
                                  }
                                  error={!!errors.acityNameMr}
                                  helperText={
                                    errors?.acityNameMr
                                      ? errors.acityNameMr.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            //  disabled
                            // disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityNamemr" required />}
                            // label="शहराचे नाव"
                            variant="standard"
                            {...register("acityNameMr")}
                            error={!!errors.acityNameMr}
                            helperText={errors?.acityNameMr ? errors.acityNameMr.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"astateMr"}
                                  labelName={"astateMr"}
                                  fieldName={"astateMr"}
                                  updateFieldName={"astate"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"astate"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="statemr" required />
                                  }
                                  error={!!errors.astateMr}
                                  helperText={
                                    errors?.astateMr
                                      ? errors.astateMr.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            // disabled={true}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="statemr" required />}
                            variant="standard"
                            {...register("astateMr")}
                            error={!!errors.astateMr}
                            helperText={errors?.astateMr ? errors.astateMr.message : null}
                          /> */}
                              </div>
                            </div>
                            <div className={styles.row}>
                              <div>
                                <TextField
                                  disabled={disable}
                                  // disabled={true}
                                  //  disabled
                                  InputLabelProps={{ shrink: true }}
                                  sx={{ width: 250 }}
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
                                  disabled={disable}
                                  // disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  InputLabelProps={{
                                    shrink: watch("amobileNo") ? true : false,
                                  }}
                                  label={
                                    <FormattedLabel id="mobileNo" required />
                                  }
                                  variant="standard"
                                  // value={pageType ? router.query.mobile : ''}
                                  //
                                  {...register("amobileNo")}
                                  error={!!errors.amobileNo}
                                  helperText={
                                    errors?.amobileNo
                                      ? errors.amobileNo.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={disable}
                                  // disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  InputLabelProps={{
                                    shrink: watch("aemail") ? true : false,
                                  }}
                                  label={<FormattedLabel id="email" required />}
                                  variant="standard"
                                  //  value={pageType ? router.query.emailAddress : ''}
                                  //
                                  {...register("aemail")}
                                  error={!!errors.aemail}
                                  helperText={
                                    errors?.aemail
                                      ? errors.aemail.message
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
                              border: "1px solid white",
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
                              <FormattedLabel id="OwnerDetails" />
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
                              {/* <div>
                                <FormControl
                                  variant="standard"
                                  error={!!errors.otitle}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="title1" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled={true}
                                        // disabled
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        label="Title  "
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {atitles &&
                                          atitles.map((atitle, index) => (
                                            <MenuItem key={index} value={atitle.id}>
                                              {atitle.atitle}
                                              
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="otitle"
                                    control={control}
                                    defaultValue="Mr"
                                  />
                                  <FormHelperText>
                                    {errors?.otitle ? errors.otitle.message : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}

                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="firstName" required />
                                  }
                                  // label="First Name *"
                                  variant="standard"
                                  {...register("ofName")}
                                  error={!!errors.ofName}
                                  helperText={
                                    errors?.ofName
                                      ? errors.ofName.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  // label="Middle Name *"
                                  label={
                                    <FormattedLabel id="middleName" required />
                                  }
                                  variant="standard"
                                  {...register("omName")}
                                  error={!!errors.omName}
                                  helperText={
                                    errors?.omName
                                      ? errors.omName.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  // disabled
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  // label="Last Name *"
                                  label={
                                    <FormattedLabel id="lastName" required />
                                  }
                                  variant="standard"
                                  {...register("olName")}
                                  error={!!errors.olName}
                                  helperText={
                                    errors?.olName
                                      ? errors.olName.message
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
                                  error={!!errors.otitleM}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="title1" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled={disable}
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        label="Title  "
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {atitles &&
                                          atitles.map((atitle, index) => (
                                            <MenuItem key={index} value={atitle.id}>
                                              {atitle.atitle}
                                             
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="otitleM"
                                    control={control}
                                    defaultValue="Mr"
                                  />
                                  <FormHelperText>
                                    {errors?.otitleM
                                      ? errors.otitleM.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}

                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"ofNameM"}
                                  labelName={"ofNameM"}
                                  fieldName={"ofNameM"}
                                  updateFieldName={"ofNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"ofNameMrM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="firstName" required />
                                  }
                                  error={!!errors.ofNameM}
                                  helperText={
                                    errors?.ofNameM
                                      ? errors.ofNameM.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="firstName" required />}
                            // label="First Name *"
                            variant="standard"
                            {...register("ofNameM")}
                            error={!!errors.ofNameM}
                            helperText={errors?.ofNameM ? errors.ofNameM.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"omNameM"}
                                  labelName={"omNameM"}
                                  fieldName={"omNameM"}
                                  updateFieldName={"omNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"omNameMrM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="middleName" required />
                                  }
                                  error={!!errors.omNameM}
                                  helperText={
                                    errors?.omNameM
                                      ? errors.omNameM.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="Middle Name *"
                            label={<FormattedLabel id="middleName" required />}
                            variant="standard"
                            {...register("omNameM")}
                            error={!!errors.omNameM}
                            helperText={errors?.omNameM ? errors.omNameM.message : null}
                          /> */}
                              </div>
                              <div>
                                <Transliteration
                                  disabled={disable}
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"olNameM"}
                                  labelName={"olNameM"}
                                  fieldName={"olNameM"}
                                  updateFieldName={"olNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"olNameMrM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="lastName" required />
                                  }
                                  error={!!errors.olNameM}
                                  helperText={
                                    errors?.olNameM
                                      ? errors.olNameM.message
                                      : null
                                  }
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            // disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="Last Name *"
                            label={<FormattedLabel id="lastName" required />}
                            variant="standard"
                            {...register("olNameM")}
                            error={!!errors.olNameM}
                            helperText={errors?.olNameM ? errors.olNameM.message : null}
                          /> */}
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
                                  error={!!errors.otitlemr}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="titlemr" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled={true}
                                        // disabled
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        label="Title  "
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {TitleMrs &&
                                          TitleMrs.map((atitlemr, index) => (
                                            <MenuItem
                                              key={index}
                                              value={atitlemr.id}
                                            >
                                              {atitlemr.atitlemr}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="otitlemr"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.otitlemr
                                      ? errors.otitlemr.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}

                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  // label="प्रथम नावं *"
                                  label={
                                    <FormattedLabel id="firstNamemr" required />
                                  }
                                  // label=" Hello"
                                  variant="standard"
                                  {...register("ofNameMr")}
                                  error={!!errors.ofNameMr}
                                  helperText={
                                    errors?.ofNameMr
                                      ? errors.ofNameMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  //label="Middle Name *"
                                  label={
                                    <FormattedLabel
                                      id="middleNamemr"
                                      required
                                    />
                                  }
                                  // label="मधले नावं *"
                                  variant="standard"
                                  {...register("omNameMr")}
                                  error={!!errors.omNameMr}
                                  helperText={
                                    errors?.omNameMr
                                      ? errors.omNameMr.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  // disabled
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  //label="Last Name *"
                                  label={
                                    <FormattedLabel id="lastNamemr" required />
                                  }
                                  // label="आडनाव *"
                                  variant="standard"
                                  {...register("olNameMr")}
                                  error={!!errors.olNameMr}
                                  helperText={
                                    errors?.olNameMr
                                      ? errors.olNameMr.message
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
                                  error={!!errors.otitlemrM}
                                  sx={{ marginTop: 2 }}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="titlemr" required />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        disabled={disable}
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        label="Title  "
                                        id="demo-simple-select-standard"
                                        labelId="id='demo-simple-select-standard-label'"
                                      >
                                        {TitleMrs &&
                                          TitleMrs.map((atitlemr, index) => (
                                            <MenuItem
                                              key={index}
                                              value={atitlemr.id}
                                            >
                                              {atitlemr.atitlemr}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    )}
                                    name="otitlemrM"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.otitlemrM
                                      ? errors.otitlemrM.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div> */}

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"ofNameMrM"}
                                  labelName={"ofNameMrM"}
                                  fieldName={"ofNameMrM"}
                                  updateFieldName={"omNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"omNameM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="firstNamemr" required />
                                  }
                                  error={!!errors.ofNameMrM}
                                  helperText={
                                    errors?.ofNameMrM
                                      ? errors.ofNameMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="प्रथम नावं *"
                            label={<FormattedLabel id="firstNamemr" required />}
                            // label=" Hello"
                            variant="standard"
                            {...register("ofNameMrM")}
                            error={!!errors.ofNameMrM}
                            helperText={errors?.ofNameMrM ? errors.ofNameMrM.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"omNameMrM"}
                                  labelName={"omNameMrM"}
                                  fieldName={"omNameMrM"}
                                  updateFieldName={"omNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"omNameM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel
                                      id="middleNamemr"
                                      required
                                    />
                                  }
                                  error={!!errors.omNameMrM}
                                  helperText={
                                    errors?.omNameMrM
                                      ? errors.omNameMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            //label="Middle Name *"
                            label={<FormattedLabel id="middleNamemr" required />}
                            // label="मधले नावं *"
                            variant="standard"
                            {...register("omNameMrM")}
                            error={!!errors.omNameMrM}
                            helperText={errors?.omNameMrM ? errors.omNameMrM.message : null}
                          /> */}
                              </div>
                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"olNameMrM"}
                                  labelName={"olNameMrM"}
                                  fieldName={"olNameMrM"}
                                  updateFieldName={"olNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"olNameM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel
                                      id="middleNamemr"
                                      required
                                    />
                                  }
                                  error={!!errors.olNameMrM}
                                  helperText={
                                    errors?.olNameMrM
                                      ? errors.olNameMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            // disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            //label="Last Name *"
                            label={<FormattedLabel id="lastNamemr" required />}
                            // label="आडनाव *"
                            variant="standard"
                            {...register("olNameMrM")}
                            error={!!errors.olNameMrM}
                            helperText={errors?.olNameMrM ? errors.olNameMrM.message : null}
                          /> */}
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
                                  {/* {<FormattedLabel id="Addrees" />} */}
                                  {language == "en"
                                    ? "Owner Address:"
                                    : "मालकाचा पत्ता:"}
                                </h3>
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
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled

                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="flatBuildingNo" />}
                                  variant="standard"
                                  //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                                  //  value={pflatBuildingNo}
                                  // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                                  {...register("oflatBuildingNo")}
                                  error={!!errors.oflatBuildingNo}
                                  helperText={
                                    errors?.oflatBuildingNo
                                      ? errors.oflatBuildingNo.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled

                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="buildingName" />}
                                  variant="standard"
                                  {...register("obuildingName")}
                                  error={!!errors.obuildingName}
                                  helperText={
                                    errors?.obuildingName
                                      ? errors.obuildingName.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled

                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="roadName" required />
                                  }
                                  variant="standard"
                                  {...register("oroadName")}
                                  error={!!errors.oroadName}
                                  helperText={
                                    errors?.oroadName
                                      ? errors.oroadName.message
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
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled

                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="flatBuildingNo" />}
                                  variant="standard"
                                  //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                                  //  value={pflatBuildingNo}
                                  // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                                  {...register("oflatBuildingNoM")}
                                  error={!!errors.oflatBuildingNoM}
                                  helperText={
                                    errors?.oflatBuildingNoM
                                      ? errors.oflatBuildingNoM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"obuildingNameM"}
                                  labelName={"obuildingNameM"}
                                  fieldName={"obuildingNameM"}
                                  updateFieldName={"obuildingNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"obuildingNameMrM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={<FormattedLabel id="buildingName" />}
                                  error={!!errors.obuildingNameM}
                                  helperText={
                                    errors?.obuildingNameM
                                      ? errors.obuildingNameM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingName" required />}
                            variant="standard"
                            {...register("obuildingNameM")}
                            error={!!errors.obuildingNameM}
                            helperText={errors?.obuildingNameM ? errors.obuildingNameM.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"oroadNameM"}
                                  labelName={"oroadNameM"}
                                  fieldName={"oroadNameM"}
                                  updateFieldName={"oroadNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"oroadNameMrM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="roadName" required />
                                  }
                                  error={!!errors.oroadNameM}
                                  helperText={
                                    errors?.oroadNameM
                                      ? errors.oroadNameM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" required />}
                            variant="standard"
                            {...register("oroadNameM")}
                            error={!!errors.oroadNameM}
                            helperText={errors?.oroadNameM ? errors.oroadNameM.message : null}
                          /> */}
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
                            <div className={styles.row3}>
                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled

                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="Landmark" required />
                                  }
                                  variant="standard"
                                  {...register("olandmark")}
                                  error={!!errors.olandmark}
                                  helperText={
                                    errors?.olandmark
                                      ? errors.olandmark.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled

                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="cityName" required />
                                  }
                                  variant="standard"
                                  {...register("ocityName")}
                                  error={!!errors.ocityName}
                                  helperText={
                                    errors?.ocityName
                                      ? errors.ocityName.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled

                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="State" required />}
                                  variant="standard"
                                  {...register("ostate")}
                                  error={!!errors.ostate}
                                  helperText={
                                    errors?.ostate
                                      ? errors.ostate.message
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
                            <div className={styles.row3}>
                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"olandmarkM"}
                                  labelName={"olandmarkM"}
                                  fieldName={"olandmarkM"}
                                  updateFieldName={"olandmarkMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"olandmarkMrM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="Landmark" required />
                                  }
                                  error={!!errors.olandmarkM}
                                  helperText={
                                    errors?.olandmarkM
                                      ? errors.olandmarkM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmark" required />}
                            variant="standard"
                            {...register("olandmarkM")}
                            error={!!errors.olandmarkM}
                            helperText={errors?.olandmarkM ? errors.olandmarkM.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"ocityNameM"}
                                  labelName={"ocityNameM"}
                                  fieldName={"ocityNameM"}
                                  updateFieldName={"ocityNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"ocityNameMrM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="cityName" required />
                                  }
                                  error={!!errors.ocityNameM}
                                  helperText={
                                    errors?.ocityNameM
                                      ? errors.ocityNameM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityName" required />}
                            variant="standard"
                            {...register("ocityNameM")}
                            error={!!errors.ocityNameM}
                            helperText={errors?.ocityNameM ? errors.ocityNameM.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"ostateM"}
                                  labelName={"ostateM"}
                                  fieldName={"ostateM"}
                                  updateFieldName={"ostateMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"ostateMrM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={<FormattedLabel id="State" required />}
                                  error={!!errors.ostateM}
                                  helperText={
                                    errors?.ostateM
                                      ? errors.ostateM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="State" required />}
                            variant="standard"
                            {...register("ostateM")}
                            error={!!errors.ostateM}
                            helperText={errors?.ostateM ? errors.ostateM.message : null}
                          /> */}
                              </div>
                            </div>

                            {/* marathi Adress */}
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
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled

                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="flatBuildingNomr" />
                                  }
                                  // label="फ्लॅट नंबर"
                                  variant="standard"
                                  //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                                  //  value={pflatBuildingNo}
                                  // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                                  {...register("oflatBuildingNoMr")}
                                  error={!!errors.oflatBuildingNoMr}
                                  helperText={
                                    errors?.oflatBuildingNoMr
                                      ? errors.oflatBuildingNoMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled

                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="buildingNamemr" />}
                                  // label="अपार्टमेंट नाव"
                                  variant="standard"
                                  {...register("obuildingNameMr")}
                                  error={!!errors.obuildingNameMr}
                                  helperText={
                                    errors?.obuildingNameMr
                                      ? errors.obuildingNameMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled

                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="roadNamemr" required />
                                  }
                                  // label="गल्लीचे नाव"
                                  variant="standard"
                                  {...register("oroadNameMr")}
                                  error={!!errors.oroadNameMr}
                                  helperText={
                                    errors?.oroadNameMr
                                      ? errors.oroadNameMr.message
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
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled

                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="flatBuildingNomr" />
                                  }
                                  // label="फ्लॅट नंबर"
                                  variant="standard"
                                  //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                                  //  value={pflatBuildingNo}
                                  // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                                  {...register("oflatBuildingNoMrM")}
                                  error={!!errors.oflatBuildingNoMrM}
                                  helperText={
                                    errors?.oflatBuildingNoMrM
                                      ? errors.oflatBuildingNoMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"obuildingNameMrM"}
                                  labelName={"obuildingNameMrM"}
                                  fieldName={"obuildingNameMrM"}
                                  updateFieldName={"obuildingNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"obuildingNameM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={<FormattedLabel id="buildingNamemr" />}
                                  error={!!errors.obuildingNameMrM}
                                  helperText={
                                    errors?.obuildingNameMrM
                                      ? errors.obuildingNameMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingNamemr" required />}
                            // label="अपार्टमेंट नाव"
                            variant="standard"
                            {...register("obuildingNameMrM")}
                            error={!!errors.obuildingNameMrM}
                            helperText={errors?.obuildingNameMrM ? errors.obuildingNameMrM.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"oroadNameMrM"}
                                  labelName={"oroadNameMrM"}
                                  fieldName={"oroadNameMrM"}
                                  updateFieldName={"oroadNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"oroadNameM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="roadNamemr" required />
                                  }
                                  error={!!errors.oroadNameMrM}
                                  helperText={
                                    errors?.oroadNameMrM
                                      ? errors.oroadNameMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadNamemr" required />}
                            // label="गल्लीचे नाव"
                            variant="standard"
                            {...register("oroadNameMrM")}
                            error={!!errors.oroadNameMrM}
                            helperText={errors?.oroadNameMrM ? errors.oroadNameMrM.message : null}
                          /> */}
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

                            <div className={styles.row3}>
                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled

                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="Landmarkmr" required />
                                  }
                                  // label="जमीन चिन्ह"
                                  variant="standard"
                                  {...register("olandmarkMr")}
                                  error={!!errors.olandmarkMr}
                                  helperText={
                                    errors?.olandmarkMr
                                      ? errors.olandmarkMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  //  disabled

                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="cityNamemr" required />
                                  }
                                  // label="शहराचे नाव"
                                  variant="standard"
                                  {...register("ocityNameMr")}
                                  error={!!errors.ocityNameMr}
                                  helperText={
                                    errors?.ocityNameMr
                                      ? errors.ocityNameMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  InputLabelProps={{
                                    shrink: temp,
                                  }}
                                  sx={{ width: 230 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="statemr" required />
                                  }
                                  variant="standard"
                                  {...register("ostateMr")}
                                  error={!!errors.ostateMr}
                                  helperText={
                                    errors?.ostateMr
                                      ? errors.ostateMr.message
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

                            <div className={styles.row3}>
                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"olandmarkMrM"}
                                  labelName={"olandmarkMrM"}
                                  fieldName={"olandmarkMrM"}
                                  updateFieldName={"olandmarkM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"olandmarkM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="Landmarkmr" required />
                                  }
                                  error={!!errors.olandmarkMrM}
                                  helperText={
                                    errors?.olandmarkMrM
                                      ? errors.olandmarkMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmarkmr" required />}
                            // label="जमीन चिन्ह"
                            variant="standard"
                            {...register("olandmarkMrM")}
                            error={!!errors.olandmarkMrM}
                            helperText={errors?.olandmarkMrM ? errors.olandmarkMrM.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"ocityNameMrM"}
                                  labelName={"ocityNameMrM"}
                                  fieldName={"ocityNameMrM"}
                                  updateFieldName={"ocityNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"ocityNameM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="cityNamemr" required />
                                  }
                                  error={!!errors.ocityNameMrM}
                                  helperText={
                                    errors?.ocityNameMrM
                                      ? errors.ocityNameMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityNamemr" required />}
                            // label="शहराचे नाव"
                            variant="standard"
                            {...register("ocityNameMrM")}
                            error={!!errors.ocityNameMrM}
                            helperText={errors?.ocityNameMrM ? errors.ocityNameMrM.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"ostateMrM"}
                                  labelName={"ostateMrM"}
                                  fieldName={"ostateMrM"}
                                  updateFieldName={"ostateM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"ostateM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="statemr" required />
                                  }
                                  error={!!errors.ostateMrM}
                                  helperText={
                                    errors?.ostateMrM
                                      ? errors.ostateMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="statemr" required />}
                            variant="standard"
                            {...register("ostateMrM")}
                            error={!!errors.ostateMrM}
                            helperText={errors?.ostateMrM ? errors.ostateMrM.message : null}
                          /> */}
                              </div>
                            </div>

                            {/* <div className={styles.row}>
                    <div>
                      <TextField
                        disabled={true}
                        InputLabelProps={{
                          shrink: temp,
                        }}
                        //  disabled

                        sx={{ width: 250 }}
                        id="standard-basic"
                        label={<FormattedLabel id="pincode" required />}
                        variant="standard"
                        {...register('opincode')}
                        error={!!errors.opincode}
                        helperText={
                          errors?.opincode ? errors.opincode.message : null
                        }
                      />
                    </div>
                    <div>
                      <TextField
                        disabled={true}
                        InputLabelProps={{
                          shrink: temp,
                        }}
                        sx={{ width: 250 }}
                        id="standard-basic"
                        label={<FormattedLabel id="mobileNo" required />}
                        variant="standard"
                        // value={pageType ? router.query.mobile : ''}
                        //
                        {...register('omobileNo')}
                        error={!!errors.omobileNo}
                        helperText={
                          errors?.omobileNo ? errors.omobileNo.message : null
                        }
                      />
                    </div>

                    <div>
                      <TextField
                        disabled={true}
                        InputLabelProps={{
                          shrink: temp,
                        }}
                        sx={{ width: 250 }}
                        id="standard-basic"
                        label={<FormattedLabel id="email" required />}
                        variant="standard"
                        //  value={pageType ? router.query.emailAddress : ''}
                        //
                        {...register('oemail')}
                        error={!!errors.oemail}
                        helperText={
                          errors?.oemail ? errors.oemail.message : null
                        }
                      />
                    </div>
                  </div> */}
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
                              border: "1px solid white",
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
                              <FormattedLabel id="boardDetail" />
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
                            <div className={styles.row2}>
                              <div>
                                <TextField
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  InputLabelProps={{
                                    shrink: watch("marriageBoardName")
                                      ? true
                                      : false,
                                  }}
                                  label={
                                    <FormattedLabel id="boardName" required />
                                  }
                                  variant="standard"
                                  {...register("marriageBoardName")}
                                  error={!!errors.marriageBoardName}
                                  helperText={
                                    errors?.marriageBoardName
                                      ? errors.marriageBoardName.message
                                      : null
                                  }
                                />
                              </div>
                              <div>
                                <TextField
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  InputLabelProps={{
                                    shrink: watch("marriageBoardNameMr")
                                      ? true
                                      : false,
                                  }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="boardNamemr" required />
                                  }
                                  // label="विवाह मंडळचे नाव "
                                  variant="standard"
                                  // value={pageType ? router.query.marriageBoardName : ''}

                                  {...register("marriageBoardNameMr")}
                                  error={!!errors.marriageBoardNameMr}
                                  helperText={
                                    errors?.marriageBoardNameMr
                                      ? errors.marriageBoardNameMr.message
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

                            <div className={styles.row2}>
                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"marriageBoardNameM"}
                                  labelName={"marriageBoardNameM"}
                                  fieldName={"marriageBoardNameM"}
                                  updateFieldName={"marriageBoardNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"marriageBoardNameMrM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="boardName" required />
                                  }
                                  error={!!errors.marriageBoardNameM}
                                  helperText={
                                    errors?.marriageBoardNameM
                                      ? errors.marriageBoardNameM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="boardName" required />}
                            variant="standard"
                            {...register("marriageBoardNameM")}
                            error={!!errors.marriageBoardNameM}
                            helperText={errors?.marriageBoardNameM ? errors.marriageBoardNameM.message : null}
                          /> */}
                              </div>
                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"marriageBoardNameMrM"}
                                  labelName={"marriageBoardNameMrM"}
                                  fieldName={"marriageBoardNameMrM"}
                                  updateFieldName={"marriageBoardNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"marriageBoardNameM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="boardNamemr" required />
                                  }
                                  error={!!errors.marriageBoardNameMrM}
                                  helperText={
                                    errors?.marriageBoardNameMrM
                                      ? errors.marriageBoardNameMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="boardNamemr" required />}
                            // label="विवाह मंडळचे नाव "
                            variant="standard"
                            // value={pageType ? router.query.marriageBoardName : ''}

                            {...register("marriageBoardNameMrM")}
                            error={!!errors.marriageBoardNameMrM}
                            helperText={
                              errors?.marriageBoardNameMrM ? errors.marriageBoardNameMrM.message : null
                            }
                          /> */}
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
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="flatBuildingNo" />}
                                  variant="standard"
                                  //value={pageType ? router.query.flatBuildingNo : ''}
                                  InputLabelProps={{
                                    shrink: watch("bflatBuildingNo")
                                      ? true
                                      : false,
                                  }}
                                  {...register("bflatBuildingNo")}
                                  error={!!errors.bflatBuildingNo}
                                  helperText={
                                    errors?.bflatBuildingNo
                                      ? errors.bflatBuildingNo.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="buildingName" />}
                                  variant="standard"
                                  // value={pageType ? router.query.buildingName : ''}
                                  InputLabelProps={{
                                    shrink: watch("bbuildingName")
                                      ? true
                                      : false,
                                  }}
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
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="roadName" required />
                                  }
                                  variant="standard"
                                  // value={pageType ? router.query.roadName : ''}
                                  InputLabelProps={{
                                    shrink: watch("broadName") ? true : false,
                                  }}
                                  {...register("broadName")}
                                  error={!!errors.broadName}
                                  helperText={
                                    errors?.broadName
                                      ? errors.broadName.message
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
                                  InputLabelProps={{
                                    shrink: watch("bflatBuildingNoM")
                                      ? true
                                      : false,
                                  }}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="flatBuildingNo" />}
                                  variant="standard"
                                  //value={pageType ? router.query.flatBuildingNo : ''}

                                  {...register("bflatBuildingNoM")}
                                  error={!!errors.bflatBuildingNoM}
                                  helperText={
                                    errors?.bflatBuildingNoM
                                      ? errors.bflatBuildingNoM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"bbuildingNameM"}
                                  labelName={"bbuildingNameM"}
                                  fieldName={"bbuildingNameM"}
                                  updateFieldName={"bbuildingNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"bbuildingNameMrM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={<FormattedLabel id="buildingName" />}
                                  error={!!errors.bbuildingNameM}
                                  helperText={
                                    errors?.bbuildingNameM
                                      ? errors.bbuildingNameM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingName" required />}
                            variant="standard"
                            // value={pageType ? router.query.buildingName : ''}

                            {...register("bbuildingNameM")}
                            error={!!errors.bbuildingNameM}
                            helperText={errors?.bbuildingNameM ? errors.bbuildingNameM.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"broadNameM"}
                                  labelName={"broadNameM"}
                                  fieldName={"broadNameM"}
                                  updateFieldName={"broadNameMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"broadNameMrM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="roadName" required />
                                  }
                                  error={!!errors.broadNameM}
                                  helperText={
                                    errors?.broadNameM
                                      ? errors.broadNameM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" required />}
                            variant="standard"
                            // value={pageType ? router.query.roadName : ''}

                            {...register("broadNameM")}
                            error={!!errors.broadNameM}
                            helperText={errors?.broadNameM ? errors.broadNameM.message : null}
                          /> */}
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
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="Landmark" required />
                                  }
                                  variant="standard"
                                  // value={pageType ? router.query.landmark : ''}
                                  InputLabelProps={{
                                    shrink: watch("blandmark") ? true : false,
                                  }}
                                  {...register("blandmark")}
                                  error={!!errors.blandmark}
                                  helperText={
                                    errors?.blandmark
                                      ? errors.blandmark.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="cityName" required />
                                  }
                                  variant="standard"
                                  //   value={pageType ? router.query.city : ''}
                                  InputLabelProps={{
                                    shrink: watch("city") ? true : false,
                                  }}
                                  {...register("city")}
                                  error={!!errors.city}
                                  helperText={
                                    errors?.city ? errors.city.message : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="pincode" required />
                                  }
                                  variant="standard"
                                  //  value={pageType ? router.query.pincode : ''}
                                  InputLabelProps={{
                                    shrink: watch("bpincode") ? true : false,
                                  }}
                                  {...register("bpincode")}
                                  error={!!errors.bpincode}
                                  helperText={
                                    errors?.bpincode
                                      ? errors.bpincode.message
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
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"blandmarkM"}
                                  labelName={"blandmarkM"}
                                  fieldName={"blandmarkM"}
                                  updateFieldName={"blandmarkMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"blandmarkMrM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="Landmark" required />
                                  }
                                  error={!!errors.blandmarkM}
                                  helperText={
                                    errors?.blandmarkM
                                      ? errors.blandmarkM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmark" required />}
                            variant="standard"
                            // value={pageType ? router.query.landmark : ''}

                            {...register("blandmarkM")}
                            error={!!errors.blandmarkM}
                            helperText={errors?.blandmarkM ? errors.blandmarkM.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"cityM"}
                                  labelName={"cityM"}
                                  fieldName={"cityM"}
                                  updateFieldName={"cityMrM"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  targetError={"cityMrM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="cityName" required />
                                  }
                                  error={!!errors.cityM}
                                  helperText={
                                    errors?.cityM ? errors.cityM.message : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityName" required />}
                            variant="standard"
                            //   value={pageType ? router.query.city : ''}

                            {...register("cityM")}
                            error={!!errors.cityM}
                            helperText={errors?.cityM ? errors.cityM.message : null}
                          /> */}
                              </div>

                              <div>
                                <TextField
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="pincode" required />
                                  }
                                  variant="standard"
                                  //  value={pageType ? router.query.pincode : ''}
                                  InputLabelProps={{
                                    shrink: watch("bpincodeM") ? true : false,
                                  }}
                                  {...register("bpincodeM")}
                                  error={!!errors.bpincodeM}
                                  helperText={
                                    errors?.bpincodeM
                                      ? errors.bpincodeM.message
                                      : null
                                  }
                                  disabled={disable}
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
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="flatBuildingNomr" />
                                  }
                                  // label="फ्लॅट नंबर"
                                  variant="standard"
                                  //value={pageType ? router.query.flatBuildingNo : ''}
                                  InputLabelProps={{
                                    shrink: watch("bflatBuildingNoMr")
                                      ? true
                                      : false,
                                  }}
                                  {...register("bflatBuildingNoMr")}
                                  error={!!errors.bflatBuildingNoMr}
                                  helperText={
                                    errors?.bflatBuildingNoMr
                                      ? errors.bflatBuildingNoMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="buildingNamemr" />}
                                  // label="अपार्टमेंट नाव"
                                  variant="standard"
                                  // value={pageType ? router.query.buildingName : ''}
                                  InputLabelProps={{
                                    shrink: watch("bbuildingNameMr")
                                      ? true
                                      : false,
                                  }}
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
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="roadNamemr" required />
                                  }
                                  // label="गल्लीचे नाव"
                                  variant="standard"
                                  // value={pageType ? router.query.roadName : ''}
                                  InputLabelProps={{
                                    shrink: watch("broadNameMr") ? true : false,
                                  }}
                                  {...register("broadNameMr")}
                                  error={!!errors.broadNameMr}
                                  helperText={
                                    errors?.broadNameMr
                                      ? errors.broadNameMr.message
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
                                  InputLabelProps={{
                                    shrink: watch("bflatBuildingNoMrM")
                                      ? true
                                      : false,
                                  }}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="flatBuildingNomr" />
                                  }
                                  variant="standard"
                                  {...register("bflatBuildingNoMrM")}
                                  error={!!errors.bflatBuildingNoMrM}
                                  helperText={
                                    errors?.bflatBuildingNoMrM
                                      ? errors.bflatBuildingNoMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"bbuildingNameMrM"}
                                  labelName={"bbuildingNameMrM"}
                                  fieldName={"bbuildingNameMrM"}
                                  updateFieldName={"bbuildingNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"bbuildingNameM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={<FormattedLabel id="buildingNamemr" />}
                                  error={!!errors.bbuildingNameMrM}
                                  helperText={
                                    errors?.bbuildingNameMrM
                                      ? errors.bbuildingNameMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingNamemr" required />}
                            // label="अपार्टमेंट नाव"
                            variant="standard"
                            // value={pageType ? router.query.buildingName : ''}

                            {...register("bbuildingNameMrM")}
                            error={!!errors.bbuildingNameMrM}
                            helperText={errors?.bbuildingNameMrM ? errors.bbuildingNameMrM.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"broadNameMrM"}
                                  labelName={"broadNameMrM"}
                                  fieldName={"broadNameMrM"}
                                  updateFieldName={"broadNameM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"broadNameM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="roadNamemr" required />
                                  }
                                  error={!!errors.broadNameMrM}
                                  helperText={
                                    errors?.broadNameMrM
                                      ? errors.broadNameMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadNamemr" required />}
                            // label="गल्लीचे नाव"
                            variant="standard"
                            // value={pageType ? router.query.roadName : ''}

                            {...register("broadNameMrM")}
                            error={!!errors.broadNameMrM}
                            helperText={errors?.broadNameMrM ? errors.broadNameMrM.message : null}
                          /> */}
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
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="Landmarkmr" required />
                                  }
                                  // label="जमीन चिन्ह"
                                  variant="standard"
                                  // value={pageType ? router.query.landmark : ''}
                                  InputLabelProps={{
                                    shrink: watch("blandmarkMr") ? true : false,
                                  }}
                                  {...register("blandmarkMr")}
                                  error={!!errors.blandmarkMr}
                                  helperText={
                                    errors?.blandmarkMr
                                      ? errors.blandmarkMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="cityNamemr" required />
                                  }
                                  // label="शहराचे नाव"
                                  variant="standard"
                                  //   value={pageType ? router.query.city : ''}
                                  InputLabelProps={{
                                    shrink: watch("cityMr") ? true : false,
                                  }}
                                  {...register("cityMr")}
                                  error={!!errors.cityMr}
                                  helperText={
                                    errors?.cityMr
                                      ? errors.cityMr.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="AadharNo" required />
                                  }
                                  variant="standard"
                                  // value={pageType ? router.query.aadhaarNo : ''}
                                  InputLabelProps={{
                                    shrink: watch("aadhaarNo") ? true : false,
                                  }}
                                  {...register("aadhaarNo")}
                                  error={!!errors.aadhaarNo}
                                  helperText={
                                    errors?.aadhaarNo
                                      ? errors.aadhaarNo.message
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
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"blandmarkMrM"}
                                  labelName={"blandmarkMrM"}
                                  fieldName={"blandmarkMrM"}
                                  updateFieldName={"blandmarkM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"blandmarkM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="Landmarkmr" required />
                                  }
                                  error={!!errors.blandmarkMrM}
                                  helperText={
                                    errors?.blandmarkMrM
                                      ? errors.blandmarkMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmarkmr" required />}
                            // label="जमीन चिन्ह"
                            variant="standard"
                            // value={pageType ? router.query.landmark : ''}

                            {...register("blandmarkMrM")}
                            error={!!errors.blandmarkMrM}
                            helperText={errors?.blandmarkMrM ? errors.blandmarkMrM.message : null}
                          /> */}
                              </div>

                              <div>
                                <Transliteration
                                  style={{
                                    backgroundColor: "white",
                                    margin: "250px",
                                  }}
                                  _key={"cityMrM"}
                                  labelName={"cityMrM"}
                                  fieldName={"cityMrM"}
                                  updateFieldName={"cityM"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  targetError={"cityM"}
                                  width={250}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="cityNamemr" required />
                                  }
                                  error={!!errors.cityMrM}
                                  helperText={
                                    errors?.cityMrM
                                      ? errors.cityMrM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                                {/* <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityNamemr" required />}
                            // label="शहराचे नाव"
                            variant="standard"
                            //   value={pageType ? router.query.city : ''}

                            {...register("cityMrM")}
                            error={!!errors.cityMrM}
                            helperText={errors?.cityMrM ? errors.cityMrM.message : null}
                          /> */}
                              </div>

                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: watch("aadhaarNoM") ? true : false,
                                  }}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="AadharNo" required />
                                  }
                                  variant="standard"
                                  // value={pageType ? router.query.aadhaarNo : ''}

                                  {...register("aadhaarNoM")}
                                  error={!!errors.aadhaarNoM}
                                  helperText={
                                    errors?.aadhaarNoM
                                      ? errors.aadhaarNoM.message
                                      : null
                                  }
                                  disabled={disable}
                                />
                              </div>
                            </div>
                            {/* ***************************hhhhhh************************* */}
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
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="mobileNo" required />
                                  }
                                  // label="जमीन चिन्ह"
                                  variant="standard"
                                  // value={pageType ? router.query.landmark : ''}
                                  InputLabelProps={{
                                    shrink: watch("omobileNo") ? true : false,
                                  }}
                                  {...register("omobileNo")}
                                  error={!!errors.omobileNo}
                                  helperText={
                                    errors?.omobileNo
                                      ? errors.omobileNo.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: watch("oemail") ? true : false,
                                  }}
                                  disabled={true}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="email" required />}
                                  // label="शहराचे नाव"
                                  variant="standard"
                                  //   value={pageType ? router.query.city : ''}

                                  {...register("oemail")}
                                  error={!!errors.oemail}
                                  helperText={
                                    errors?.oemail
                                      ? errors.oemail.message
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
                                  disabled={disable}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={
                                    <FormattedLabel id="mobileNo" required />
                                  }
                                  // label="जमीन चिन्ह"
                                  variant="standard"
                                  // value={pageType ? router.query.landmark : ''}
                                  InputLabelProps={{
                                    shrink: watch("omobileNoM") ? true : false,
                                  }}
                                  {...register("omobileNoM")}
                                  error={!!errors.omobileNoM}
                                  helperText={
                                    errors?.omobileNoM
                                      ? errors.omobileNoM.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  disabled={disable}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="email" required />}
                                  // label="शहराचे नाव"
                                  variant="standard"
                                  //   value={pageType ? router.query.city : ''}
                                  InputLabelProps={{
                                    shrink: watch("oemailM") ? true : false,
                                  }}
                                  {...register("oemailM")}
                                  error={!!errors.oemailM}
                                  helperText={
                                    errors?.oemailM
                                      ? errors.oemailM.message
                                      : null
                                  }
                                />
                              </div>
                            </div>

                            {/* name */}
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
                                    shrink: watch("blatitude") ? true : false,
                                  }}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="bLatitude" />}
                                  // label={"Latitude"}
                                  variant="standard"
                                  inputProps={{ maxLength: 10 }}
                                  // value={pageType ? router.query.bLatitude  : ''}
                                  disabled={disable}
                                  {...register("blatitude")}
                                  error={!!errors.blatitude}
                                  helperText={
                                    errors?.blatitude
                                      ? errors.blatitude.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: watch("blongitude") ? true : false,
                                  }}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="bLongitude" />}
                                  // label={"Longitude"}
                                  variant="standard"
                                  //  value={pageType ? router.query.bLongitude  : ''}
                                  disabled={disable}
                                  {...register("blongitude")}
                                  error={!!errors.blongitude}
                                  helperText={
                                    errors?.blongitude
                                      ? errors.blongitude.message
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
                                  InputLabelProps={{
                                    shrink: watch("bLatitudeM") ? true : false,
                                  }}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="bLatitude" />}
                                  // label={"Latitude"}
                                  variant="standard"
                                  inputProps={{ maxLength: 10 }}
                                  // value={pageType ? router.query.bLatitudeM  : ''}
                                  disabled={disable}
                                  {...register("bLatitudeM")}
                                  error={!!errors.bLatitudeM}
                                  helperText={
                                    errors?.bLatitudeM
                                      ? errors.bLatitudeM.message
                                      : null
                                  }
                                />
                              </div>

                              <div>
                                <TextField
                                  InputLabelProps={{
                                    shrink: watch("bLongitudeM") ? true : false,
                                  }}
                                  sx={{ width: 250 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="bLongitude" />}
                                  // label={"Longitude"}
                                  variant="standard"
                                  //  value={pageType ? router.query.bLongitudeM  : ''}
                                  disabled={disable}
                                  {...register("bLongitudeM")}
                                  error={!!errors.bLongitudeM}
                                  helperText={
                                    errors?.bLongitudeM
                                      ? errors.bLongitudeM.message
                                      : null
                                  }
                                />
                              </div>
                            </div>

                            {/* <div className={styles.row}>
                          <div>
                            <TextField
                              disabled={true}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="mobileNo" required />}
                              variant="standard"
                              name="mobile"
                              // value={pageType ? router.query.mobile : ''}
                              InputLabelProps={{
                                shrink: watch("mobile") ? true : false,
                              }}
                              {...register("mobile")}
                              error={!!errors.mobile}
                              helperText={
                                errors?.mobile ? errors.mobile.message : null
                              }
                            />
                          </div>

                          <div>
                            <TextField
                              disabled={true}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="email" required />}
                              variant="standard"
                              name="emailAddress"
                              //  value={pageType ? router.query.emailAddress : ''}
                              InputLabelProps={{
                                shrink: watch("emailAddress") ? true : false,
                              }}
                              {...register("emailAddress")}
                              error={!!errors.emailAddress}
                              helperText={
                                errors?.emailAddress
                                  ? errors.emailAddress.message
                                  : null
                              }
                            />
                          </div>
                        </div> */}
                          </AccordionDetails>
                        </Accordion>
                      </>
                    )}
                    {console.log("ererter", props.preview)}
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
                              border: "1px solid white",
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
                              <FormattedLabel id="docFormat" />
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {/* <table style={{
                              // marginTop: " 20px",
                              marginLeft: "10vw", borderCollapse: "collapse", width: "80%",
                              border: "2px solid #000"
                            }}>

                              <tr>
                                <td style={{
                                  textAlign: "left",
                                  // padding: "5px",
                                  border: "2px solid #000"
                                }}>1</td>
                                <td style={{
                                  textAlign: "left",
                                  // padding: "5px",
                                  border: "2px solid #000"
                                }}><Typography>
                                    {language == "en"
                                      ? "Board / Organization PhotoCopy"
                                      : "मंडळ/संस्था फोटोकॉपी"}{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Typography></td>
                                <td style={{
                                  textAlign: "left",
                                  // padding: "5px",
                                  border: "2px solid #000"
                                }}>
                                  <UploadButton
                                    error={!!errors?.boardOrganizationPhotoMod}
                                    appName={appName}
                                    serviceName={serviceName}
                                    fileDtl={getValues("boardOrganizationPhotoMod")}
                                    fileKey={"boardOrganizationPhotoMod"}
                                    showDel={pageMode == 'View' ? false : true}

                                  />
                                  <FormHelperText
                                    error={!!errors?.boardOrganizationPhotoMod}
                                  >
                                    {errors?.boardOrganizationPhotoMod
                                      ? errors?.boardOrganizationPhotoMod?.message
                                      : null}
                                  </FormHelperText>

                                </td>
                              </tr>
                              <tr>
                                <td style={{
                                  textAlign: "left",
                                  // padding: "5px",
                                  border: "2px solid #000"
                                }}>2</td>
                                <td style={{
                                  textAlign: "left",
                                  // padding: "5px",
                                  border: "2px solid #000"
                                }}> <Typography>
                                    {language == "en"
                                      ? "Residential proof"
                                      : "निवासी पुरावा"}{" "}<span style={{ color: "red" }}>*</span>
                                  </Typography></td>
                                <td style={{
                                  textAlign: "left",
                                  // padding: "5px",
                                  border: "2px solid #000"
                                }}>
                                  <UploadButton
                                    error={!!errors?.residentialProofMod}
                                    appName={appName}
                                    serviceName={serviceName}
                                    fileDtl={getValues("residentialProofMod")}
                                    fileKey={"residentialProofMod"}
                                    showDel={pageMode == 'View' ? false : true}


                                  />
                                  <FormHelperText
                                    error={!!errors?.residentialProofMod}
                                  >
                                    {errors?.residentialProofMod
                                      ? errors?.residentialProofMod?.message
                                      : null}
                                  </FormHelperText>

                                </td>
                              </tr>
                              <tr>
                                <td style={{
                                  textAlign: "left",
                                  // padding: "5px",
                                  border: "2px solid #000"
                                }}>3</td>
                                <td style={{
                                  textAlign: "left",
                                  // padding: "5px",
                                  border: "2px solid #000"
                                }}> <Typography>
                                    {language == "en"
                                      ? "Identity proof"
                                      : "ओळखीचा पुरावा"}{" "}<span style={{ color: "red" }}>*</span>
                                  </Typography></td>
                                <td style={{
                                  textAlign: "left",
                                  // padding: "5px",
                                  border: "2px solid #000"
                                }}>
                                  <UploadButton
                                    error={!!errors?.identityProofMod}
                                    appName={appName}
                                    serviceName={serviceName}
                                    fileDtl={getValues("identityProofMod")}
                                    fileKey={"identityProofMod"}
                                    showDel={pageMode == 'View' ? false : true}


                                  />
                                  <FormHelperText error={!!errors?.identityProofMod}>
                                    {errors?.identityProofMod
                                      ? errors?.identityProofMod?.message
                                      : null}
                                  </FormHelperText>
                                </td>
                              </tr>

                            </table> */}
                            <table className={styles.doctable}>
                              <tr>
                                <th className={styles.docTh}>
                                  {" "}
                                  <Typography>
                                    {" "}
                                    {language == "en"
                                      ? "Document Name"
                                      : "दस्तऐवजाचे नाव"}
                                  </Typography>
                                </th>
                                <th className={styles.docTh}>
                                  {" "}
                                  <Typography>
                                    {" "}
                                    {language == "en" ? "Document" : "दस्तऐवज"}
                                  </Typography>
                                </th>
                              </tr>
                              <tr>
                                {/* <td className={styles.docTd}>1</td> */}
                                <td className={styles.docTd}>
                                  {" "}
                                  <Typography>
                                    {" "}
                                    {
                                      <FormattedLabel
                                        id="boardheadphoto"
                                        required
                                      />
                                    }
                                  </Typography>
                                </td>
                                <td className={styles.docTd}>
                                  {" "}
                                  <UploadButton
                                    error={!!errors?.boardHeadPersonPhotoMod}
                                    appName={appName}
                                    serviceName={serviceName}
                                    fileDtl={getValues(
                                      "boardHeadPersonPhotoMod",
                                    )}
                                    fileKey={"boardHeadPersonPhotoMod"}
                                    showDel={pageMode == "View" ? false : true}
                                  />
                                  <FormHelperText
                                    error={!!errors?.boardHeadPersonPhotoMod}
                                  >
                                    {errors?.boardHeadPersonPhotoMod
                                      ? errors?.boardHeadPersonPhotoMod?.message
                                      : null}
                                  </FormHelperText>
                                </td>
                              </tr>
                              <tr>
                                {/* <td className={styles.docTd}>2</td> */}
                                <td className={styles.docTd}>
                                  {" "}
                                  <Typography>
                                    {
                                      <FormattedLabel
                                        id="boardorgphotocpy"
                                        required
                                      />
                                    }
                                  </Typography>
                                </td>
                                <td className={styles.docTd}>
                                  {" "}
                                  <UploadButton
                                    error={!!errors?.boardOrganizationPhotoMod}
                                    appName={appName}
                                    serviceName={serviceName}
                                    fileDtl={getValues(
                                      "boardOrganizationPhotoMod",
                                    )}
                                    fileKey={"boardOrganizationPhotoMod"}
                                    showDel={pageMode == "View" ? false : true}
                                  />
                                  <FormHelperText
                                    error={!!errors?.boardOrganizationPhotoMod}
                                  >
                                    {errors?.boardOrganizationPhotoMod
                                      ? errors?.boardOrganizationPhotoMod
                                          ?.message
                                      : null}
                                  </FormHelperText>
                                </td>
                              </tr>
                              <tr>
                                {/* <td className={styles.docTd}>3</td> */}
                                <td className={styles.docTd}>
                                  {" "}
                                  <Typography>
                                    {" "}
                                    {<FormattedLabel id="panCard" required />}
                                  </Typography>
                                </td>
                                <td className={styles.docTd}>
                                  <UploadButton
                                    error={!!errors?.panCardMod}
                                    appName={appName}
                                    serviceName={serviceName}
                                    fileDtl={getValues("panCardMod")}
                                    fileKey={"panCardMod"}
                                    showDel={pageMode == "View" ? false : true}
                                  />
                                  <FormHelperText error={!!errors?.panCardMod}>
                                    {errors?.panCardMod
                                      ? errors?.panCardMod?.message
                                      : null}
                                  </FormHelperText>
                                </td>
                              </tr>
                              <tr>
                                {/* <td className={styles.docTd}>4</td> */}
                                <td className={styles.docTd}>
                                  <Typography>
                                    {" "}
                                    {<FormattedLabel id="adharcard" required />}
                                  </Typography>
                                </td>
                                <td className={styles.docTd}>
                                  {" "}
                                  <UploadButton
                                    error={!!errors?.aadharCardMod}
                                    appName={appName}
                                    serviceName={serviceName}
                                    fileDtl={getValues("aadharCardMod")}
                                    fileKey={"aadharCardMod"}
                                    showDel={pageMode == "View" ? false : true}
                                  />
                                  <FormHelperText
                                    error={!!errors?.aadharCardMod}
                                  >
                                    {errors?.aadharCardMod
                                      ? errors?.aadharCardMod?.message
                                      : null}
                                  </FormHelperText>
                                </td>
                              </tr>
                              {/* {getValues("rationCardMod") && ( */}
                              {(watch("rationCardMod") &&
                                logedInUser != "citizenUser") ||
                                (!watch("rationCardMod") &&
                                  logedInUser == "citizenUser" && (
                                    <tr>
                                      {/* <td className={styles.docTd}>5</td> */}
                                      <td className={styles.docTd}>
                                        <Typography>
                                          {" "}
                                          {<FormattedLabel id="rationcard" />}
                                        </Typography>
                                      </td>
                                      <td className={styles.docTd}>
                                        {" "}
                                        <UploadButton
                                          appName={appName}
                                          serviceName={serviceName}
                                          fileDtl={getValues("rationCardMod")}
                                          fileKey={"rationCardMod"}
                                          showDel={
                                            pageMode == "View" ? false : true
                                          }
                                        />
                                      </td>
                                    </tr>
                                  ))}
                              {/* )} */}
                              {/* {getValues("electricityBillMod") && ( */}
                              {(watch("electricityBillMod") &&
                                logedInUser != "citizenUser") ||
                                (!watch("electricityBillMod") &&
                                  logedInUser == "citizenUser" && (
                                    <tr>
                                      {/* <td className={styles.docTd}>6</td> */}
                                      <td className={styles.docTd}>
                                        {" "}
                                        <Typography>
                                          {<FormattedLabel id="electrbill" />}
                                        </Typography>
                                      </td>
                                      <td className={styles.docTd}>
                                        <UploadButton
                                          appName={appName}
                                          serviceName={serviceName}
                                          fileDtl={getValues(
                                            "electricityBillMod",
                                          )}
                                          fileKey={"electricityBillMod"}
                                          showDel={
                                            pageMode == "View" ? false : true
                                          }
                                        />
                                      </td>
                                    </tr>
                                  ))}
                              {/* )} */}
                              {/* {getValues("otherDocMod") && ( */}
                              {(watch("otherDocMod") &&
                                logedInUser != "citizenUser") ||
                                (!watch("otherDocMod") &&
                                  logedInUser == "citizenUser" && (
                                    <tr>
                                      {/* <td className={styles.docTd}>7</td> */}
                                      <td className={styles.docTd}>
                                        <Typography>
                                          {" "}
                                          {
                                            <FormattedLabel id="OtherDocument" />
                                          }
                                        </Typography>
                                      </td>
                                      <td className={styles.docTd}>
                                        <UploadButton
                                          appName={appName}
                                          serviceName={serviceName}
                                          fileDtl={getValues("otherDocMod")}
                                          fileKey={"otherDocMod"}
                                          showDel={
                                            pageMode == "View" ? false : true
                                          }
                                        />
                                      </td>
                                    </tr>
                                  ))}
                              {/* )} */}
                              {/* {getValues("resolutionOfBoardMod") && ( */}
                              {(watch("resolutionOfBoardMod") &&
                                logedInUser != "citizenUser") ||
                                (!watch("resolutionOfBoardMod") &&
                                  logedInUser == "citizenUser" && (
                                    <tr>
                                      {/* <td className={styles.docTd}>8</td> */}
                                      <td className={styles.docTd}>
                                        <Typography>
                                          {/* {" "}
                              {<FormattedLabel id="OtherDocument" />} */}
                                          {language == "en"
                                            ? "Resolution of the Board"
                                            : "मंडळाचा ठराव"}
                                        </Typography>
                                      </td>
                                      <td className={styles.docTd}>
                                        <UploadButton
                                          appName={appName}
                                          serviceName={serviceName}
                                          fileDtl={getValues(
                                            "resolutionOfBoardMod",
                                          )}
                                          fileKey={"resolutionOfBoardMod"}
                                          showDel={
                                            pageMode == "View" ? false : true
                                          }
                                        />
                                      </td>
                                    </tr>
                                  ))}
                              {/* )} */}
                              {/* {getValues("receiptOfPaymentOfpropertyTaxMod") && ( */}
                              {(watch("receiptOfPaymentOfpropertyTaxMod") &&
                                logedInUser != "citizenUser") ||
                                (!watch("receiptOfPaymentOfpropertyTaxMod") &&
                                  logedInUser == "citizenUser" && (
                                    <tr>
                                      {/* <td className={styles.docTd}>9</td> */}
                                      <td className={styles.docTd}>
                                        <Typography>
                                          {/* {" "}
                              {<FormattedLabel id="OtherDocument" />} */}
                                          {language == "en"
                                            ? "Receipt of payment of property tax"
                                            : " मालमत्ता कर भरल्याची पावती "}
                                        </Typography>
                                      </td>
                                      <td className={styles.docTd}>
                                        <UploadButton
                                          appName={appName}
                                          serviceName={serviceName}
                                          fileDtl={getValues(
                                            "receiptOfPaymentOfpropertyTaxMod",
                                          )}
                                          fileKey={
                                            "receiptOfPaymentOfpropertyTaxMod"
                                          }
                                          showDel={
                                            pageMode == "View" ? false : true
                                          }
                                        />
                                      </td>
                                    </tr>
                                  ))}
                              {/* )} */}
                              {/* {getValues("agreemenyCopyOfPropertyMod") && ( */}
                              {(watch("agreemenyCopyOfPropertyMod") &&
                                logedInUser != "citizenUser") ||
                                (!watch("agreemenyCopyOfPropertyMod") &&
                                  logedInUser == "citizenUser" && (
                                    <tr>
                                      {/* <td className={styles.docTd}>10</td> */}
                                      <td className={styles.docTd}>
                                        <Typography>
                                          {/* {" "}
                              {<FormattedLabel id="OtherDocument" />} */}
                                          {language == "en"
                                            ? "Agreement copy & Extract of Property"
                                            : "कराराची प्रत आणि मालमत्तेचा उतारा "}
                                        </Typography>
                                      </td>
                                      <td className={styles.docTd}>
                                        <UploadButton
                                          appName={appName}
                                          serviceName={serviceName}
                                          fileDtl={getValues(
                                            "agreemenyCopyOfPropertyMod",
                                          )}
                                          fileKey={"agreemenyCopyOfPropertyMod"}
                                          showDel={
                                            pageMode == "View" ? false : true
                                          }
                                        />
                                      </td>
                                    </tr>
                                  ))}
                              {/* )} */}
                              <tr>
                                {/* <td className={styles.docTd}>11</td> */}
                                <td className={styles.docTd}>
                                  <Typography>
                                    {/* {" "}
                              {<FormattedLabel id="OtherDocument" />} */}
                                    {language == "en"
                                      ? "Old Marriage Board Certificate"
                                      : "जुने विवाह मंडळाचे प्रमाणपत्र"}
                                    <span style={{ color: "red" }}>*</span>
                                  </Typography>
                                </td>
                                <td className={styles.docTd}>
                                  <UploadButton
                                    error={!!errors?.oldBoardCertificateMod}
                                    appName={appName}
                                    serviceName={serviceName}
                                    fileDtl={getValues(
                                      "oldBoardCertificateMod",
                                    )}
                                    fileKey={"oldBoardCertificateMod"}
                                    showDel={pageMode == "View" ? false : true}
                                  />
                                  <FormHelperText
                                    error={!!errors?.oldBoardCertificateMod}
                                  >
                                    {errors?.oldBoardCertificateMod
                                      ? errors?.oldBoardCertificateMod?.message
                                      : null}
                                  </FormHelperText>
                                </td>
                              </tr>
                              {watch("isPersonOrgansation") ==
                                "organisation" && (
                                <tr>
                                  {/* <td className={styles.docTd}>10</td> */}
                                  <td className={styles.docTd}>
                                    <Typography>
                                      {/* {" "}
                              {<FormattedLabel id="OtherDocument" />} */}
                                      {language == "en"
                                        ? "Organization copy"
                                        : "संस्था कॉपी"}
                                    </Typography>
                                  </td>
                                  <td className={styles.docTd}>
                                    <UploadButton
                                      appName={appName}
                                      serviceName={serviceName}
                                      fileDtl={getValues("charitableMod")}
                                      fileKey={"charitableMod"}
                                      showDel={
                                        pageMode == "View" ? false : true
                                      }
                                    />
                                  </td>
                                </tr>
                              )}
                            </table>
                            {/* <div style={{ marginTop: "7vh",marginLeft:"7vh" }}> */}
                            {/* <Grid container>
                          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <Typography>
                              {language == "en"
                                ? "Board / Organization PhotoCopy"
                                : "मंडळ/संस्था फोटोकॉपी"}{" "}
                                <span style={{color:"red"}}>*</span>
                            </Typography>
                          
                            </Grid>
                          
<Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <UploadButton   
                              error={!!errors?.boardOrganizationPhotoMod}
                              appName={appName}
                              serviceName={serviceName}
                              fileDtl={getValues("boardOrganizationPhotoMod")}
                              fileKey={"boardOrganizationPhotoMod"}
                              showDel={pageMode=='View' ? false : true}

                            />
                            <FormHelperText
                              error={!!errors?.boardOrganizationPhotoMod}
                            >
                              {errors?.boardOrganizationPhotoMod
                                ? errors?.boardOrganizationPhotoMod?.message
                                : null}
                            </FormHelperText>
                   
                          </Grid>
                                </Grid>                          
                          <Grid container>
                          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>

                            <Typography>
                              {language == "en"
                                ? "Residential proof"
                                : "निवासी पुरावा"}{" "}<span style={{color:"red"}}>*</span>
                            </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <UploadButton
                              error={!!errors?.residentialProofMod}
                              appName={appName}
                              serviceName={serviceName}
                              fileDtl={getValues("residentialProofMod")}
                              fileKey={"residentialProofMod"}
                              showDel={pageMode=='View' ? false : true}

                          
                            />
                            <FormHelperText
                              error={!!errors?.residentialProofMod}
                            >
                              {errors?.residentialProofMod
                                ? errors?.residentialProofMod?.message
                                : null}
                            </FormHelperText>
                            </Grid>
                            </Grid> 
                          <Grid container>
                          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <Typography>
                              {language == "en"
                                ? "Identity proof"
                                : "ओळखीचा पुरावा"}{" "}<span style={{color:"red"}}>*</span>
                            </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <UploadButton
                              error={!!errors?.identityProofMod}
                              appName={appName}
                              serviceName={serviceName}
                              fileDtl={getValues("identityProofMod")}
                              fileKey={"identityProofMod"}
                              showDel={pageMode=='View' ? false : true}

                            
                            />
                            <FormHelperText error={!!errors?.identityProofMod}>
                              {errors?.identityProofMod
                                ? errors?.identityProofMod?.message
                                : null}
                            </FormHelperText>
                        
                          </Grid>
                          </Grid> */}
                            {/* </div> */}
                          </AccordionDetails>{" "}
                        </Accordion>
                      </>
                    )}
                    {!props.preview && !props.onlyDoc && (
                      <div className={styles.btn}>
                        {router?.query?.pageMode != "View" ? (
                          <>
                            <div className={styles.btn1}>
                              <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                endIcon={<SaveIcon />}
                              >
                                {<FormattedLabel id="apply" />}
                              </Button>{" "}
                            </div>
                            {/* {logedInUser == "citizenUser" ? (
                              <>
                                <div className={styles.btn1}>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleClear}
                                  >
                                    {<FormattedLabel id="clear" />}
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <></>
                            )} */}

                            <div className={styles.btn1}>
                              <Button
                                variant="contained"
                                color="primary"
                                // disabled={validateSearch()}

                                onClick={() => {
                                  const textAlert =
                                    language == "en"
                                      ? "Are you sure you want to exit this Record ? "
                                      : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?";
                                  const title =
                                    language == "en" ? "Exit ! " : "बाहेर पडा!";
                                  swal({
                                    title: title,
                                    text: textAlert,
                                    icon: "warning",
                                    buttons: true,
                                    dangerMode: true,
                                  }).then((willDelete) => {
                                    if (willDelete) {
                                      language == "en"
                                        ? sweetAlert({
                                            title: "Exit!",
                                            text: "Record is Successfully Exit!!",
                                            icon: "success",
                                            button: "Ok",
                                          })
                                        : sweetAlert({
                                            title: "बाहेर पडा!",
                                            text: "रेकॉर्ड यशस्वीरित्या बाहेर पडा!",
                                            icon: "success",
                                            button: "Ok",
                                          });
                                      if (logedInUser == "citizenUser") {
                                        router.push(`/dashboard`);
                                      } else {
                                        router.push(
                                          `/marriageRegistration/transactions/modificationInMarriageBoardRegisteration`,
                                        );
                                      }
                                      //   swal("Record is Successfully Exit!", {
                                      //     icon: "success",
                                      //   });
                                      //   handleExit();
                                    } else {
                                      language == "en"
                                        ? sweetAlert({
                                            title: "Cancel!",
                                            text: "Record is Successfully Cancel!!",
                                            icon: "success",
                                            button: "Ok",
                                          })
                                        : sweetAlert({
                                            title: "रद्द केले!",
                                            text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                                            icon: "success",
                                            button: "ओके",
                                          });
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
                                  const textAlert =
                                    language == "en"
                                      ? "Are you sure you want to exit this Record ? "
                                      : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?";
                                  const title =
                                    language == "en" ? "Exit ! " : "बाहेर पडा!";
                                  swal({
                                    title: title,
                                    text: textAlert,
                                    icon: "warning",
                                    buttons: true,
                                    dangerMode: true,
                                  }).then((willDelete) => {
                                    if (willDelete) {
                                      language == "en"
                                        ? sweetAlert({
                                            title: "Exit!",
                                            text: "Record is Successfully Exit!!",
                                            icon: "success",
                                            button: "Ok",
                                          })
                                        : sweetAlert({
                                            title: "बाहेर पडा!",
                                            text: "रेकॉर्ड यशस्वीरित्या बाहेर पडा!",
                                            icon: "success",
                                            button: "Ok",
                                          });
                                      router.push(`/dashboard`);
                                    } else {
                                      // swal("Record is Safe");
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
                    )}
                  </Paper>
                </ThemeProvider>
              </form>
            </FormProvider>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

export default Index;

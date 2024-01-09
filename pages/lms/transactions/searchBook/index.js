import {
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  IconButton,
  Box,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "../../masters/libraryCompetativeMaster/view.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
// import schema from "./schema";
import axios from "axios";
import urls from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import theme from "../../../../theme";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { DataGrid } from "@mui/x-data-grid";
import swal from "sweetalert";
import LmsHeader from "../../../../components/lms/lmsHeader";
import * as yup from "yup";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// import { newBookRequestSchema } from "../../../../../components/lms/schema/newBookRequestSchema";

const Index = () => {
  const [btnSaveText, setBtnSaveText] = useState("search");
  const [id, setID] = useState();
  const [bookTypeData, setBookTypeData] = useState([]);
  const [allLibraryList, setAllLibraryList] = useState([]);
  const [bookClassifications, setBookClassification] = useState([]);
  const [bookSubTypeData, setBookSubType] = useState([]);
  const [languages, setLanguages] = useState([
    { id: 1, language: "English", label: "इंग्रजी" },
    { id: 2, language: "Marathi", label: "मराठी" },
    { id: 3, language: "Hindi", label: "हिंदी" },
    // { id: 1, language: "English" },
    // { id: 2, language: "Marathi" },
    // { id: 3, language: "Hindi" },
  ]);
  const [libraryKeys, setLibraryKeys] = useState([]);
  const router = useRouter();
  let applicationFrom = "Web";
  const user = useSelector((state) => state?.user.user);
  const [searchList, setSearchList] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.user.user.token);

  const language = useSelector((state) => state?.labels.language);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 0,
  });

  // schema - validation
  let schema = yup.object().shape({
    bookName: yup
      .string()
      .required(
        language == "en"
          ? "Book Name Is Required !!!"
          : "पुस्तकाचे नाव आवश्यक आहे !!!"
      )
      .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  });

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [zoneKeys, setZoneKeys] = useState([]);
  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      .catch((err) => {
        swal(
          language == "en" ? "Error!" : "त्रुटी!",
          language == "en"
            ? "Somethings Wrong, Zones not Found!"
            : "काहीतरी चुकीचे आहे, झोन सापडले नाहीत!",
          "error"
        );
      });
  };

  const getLibraryKeys = () => {
    //setValues("setBackDrop", true);
    if (watch("zoneKey")) {
      axios
        .get(
          `${urls.LMSURL}/libraryMaster/getLibraryByZoneKey?zoneKey=${watch(
            "zoneKey"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          setLibraryKeys(
            r.data.libraryMasterList.map((row) => ({
              id: row.id,
              // zoneName: row.zoneName,
              libraryName: row.libraryName,
              libraryNameMr: row.libraryNameMr,
            }))
          );
        })
        .catch((err) => {
          swal(
            language == "en" ? "Error!" : "त्रुटी!",
            language == "en"
              ? "Somethings Wrong, Zones not Found!"
              : "काहीतरी चुकीचे आहे, झोन सापडले नाहीत!",
            "error"
          );
        });
    }
  };

  useEffect(() => {
    if (watch("bookType")) {
      axios
        .get(`${urls.LMSURL}/bookSubTypeMaster/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          setBookSubType(
            r.data.bookSubTypeMasterList.map((r) => ({
              id: r.id,
              bookType: r.bookType,
              bookSubtype: r.bookSubtype,
            }))
          );
        });
    }
  }, [watch("bookType")]);

  const getBookClassifications = () => {
    axios
      .get(`${urls.LMSURL}/bookClassificationMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        let result = r.data.bookClassificationList;
        console.log("result", result);

        setBookClassification(
          result.map((r, i) => {
            return {
              // r.data.map((r, i) => ({
              activeFlag: r.activeFlag,
              id: r.id,
              srNo: i + 1,
              bookClassification: r.bookClassification,
              status: r.activeFlag === "Y" ? "Active" : "Inactive",
            };
          })
        );
      });
  };

  const getBookTypeData = () => {
    axios
      .get(`${urls.LMSURL}/bookTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setBookTypeData(
          r.data.bookTypeMasterList.map((r) => ({
            id: r.id,
            bookType: r.bookType,
          }))
        );
      });
  };
  const getAllLibraryAndComp = () => {
    axios
      .get(`${urls.LMSURL}/libraryMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("getAllLibraryAndComp", r);
        setAllLibraryList(
          r?.data?.libraryMasterList?.map((r) => ({
            id: r.id,
            libraryName: r.libraryName,
            libraryNameMr: r.libraryNameMr,
          }))
        );
      })
      .catch((e) => {
        catchExceptionHandlingMethod(e, language);
      });
  };
  // ------------commeted on 22/12/2023 morning 10 Am--------------------------
  // const onSubmitForm = (formData) => {
  //   setLoading(true);
  //   // const finalBodyForApi = {
  //   //     ...formData,
  //   //     applicationFrom,
  //   // };

  //   const bodyForApi = {
  //     ...formData,
  //     // applicationFrom,
  //     // serviceId: 91,
  //     // createdUserId: user?.id,
  //     // applicationStatus: 'APPLICATION_CREATED',
  //   };

  //   console.log("savebody", bodyForApi);

  //   const dynamicPayload = {};

  //   for (const [key, value] of Object.entries(bodyForApi)) {
  //     if (value !== "") {
  //       dynamicPayload[key] = value;
  //     }
  //   }

  //   console.log("dynamicPayload", dynamicPayload);

  //   axios
  //     // .post(`${urls.LMSURL}/bookMaster/searchBook`, bodyForApi, {
  //     .post(`${urls.LMSURL}/bookMaster/findBook`, dynamicPayload, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => {
  //       setLoading(false);
  //       console.log("resp", res);
  //       if (res?.status == 200) {
  //         // swal(
  //         //   language == "en" ? "Searched!" : "शोधले!",
  //         //   language == "en"
  //         //     ? "Record Found successfully!"
  //         //     : "रेकॉर्ड यशस्वीरित्या सापडला!",
  //         //   "success"
  //         // );
  //         // router.push({
  //         //     pathname: `/dashboard`,

  //         // })
  //         // let temp = res?.data?.message;
  //         // router.push({
  //         //     pathname: `/lms/transactions/newBookRequest/acknowledgmentReceipt`,
  //         //     query: {
  //         //         id: Number(temp.split(':')[1]),
  //         //     },
  //         // })
  //         if (res?.data?.length > 0) {
  //           swal(
  //             language == "en" ? "Searched!" : "शोधले!",
  //             language == "en"
  //               ? "Record Found successfully!"
  //               : "रेकॉर्ड यशस्वीरित्या सापडला!",
  //             "success"
  //           );
  //           // let temp = res?.data?.bookMasterList.map((r, i) => ({
  //           let temp = res?.data?.map((r, i) => ({
  //             id: r.id,
  //             srNo: i + 1,
  //             author: r.author ?? "-",
  //             barcode: r.barcode,
  //             bookClassification: r.bookClassification,

  //             bookName: r.bookName ?? "-",
  //             bookNameMr: r.bookNameMr ?? "-",
  //             // bookName1: bookTypeData?.find((obj) => obj?.id === r.bookName)
  //             //   ?.bookName,
  //             bookType: r.bookType,
  //             bookSubType: r.bookSubType,
  //             language:
  //               languages.find((language) => r.language == language.id)
  //                 ?.language ?? "-",
  //             languageMr:
  //               languages.find((language) => r.language == language.id)
  //                 ?.label ?? "-",
  //             // language: r.language,
  //             // languageName: bookTypeData?.find((obj) => obj?.id === r.language)
  //             //   ?.language,
  //             bookEdition: r.bookEdition ?? "-",
  //             bookPrice: r.bookPrice ?? "-",
  //             publication: r.publication ?? "-",
  //             bookSize: r.bookSize,
  //             numberOfPages: r.numberOfPages,
  //             // publicationName: bookTypeData?.find(
  //             //   (obj) => obj?.id === r.publication
  //             // )?.publication,
  //             // shelfCatlogSection: r.shelfCatlogSection,
  //             // shelfCatlogSectionName: bookTypeData?.find(
  //             //   (obj) => obj?.id === r.shelfCatlogSection
  //             // )?.shelfCatlogSection,
  //             // shelfNo: r.shelfNo,
  //             // shelfNoName: bookTypeData?.find((obj) => obj?.id === r.shelfNo)
  //             //   ?.shelfNo,
  //             activeFlag: r.activeFlag,
  //             purchaseType: r.purchaseType,
  //             totalAvailableBookCopy: r.totalAvailableBookCopy,
  //             totalBooksCopy: r.totalBooksCopy,
  //             zoneName:
  //               zoneKeys?.find((zone) => zone.id == r.zoneKey)?.zoneName ?? "-",
  //             zoneNameMr:
  //               zoneKeys?.find((zone) => zone.id == r.zoneKey)?.zoneNameMr ??
  //               "-",
  //             libraryName:
  //               allLibraryList?.find((library) => library.id == r.libraryKey)
  //                 ?.libraryName ?? "-",
  //             libraryNameMr:
  //               allLibraryList?.find((library) => library.id == r.libraryKey)
  //                 ?.libraryNameMr ?? "-",
  //             status: r.activeFlag === "Y" ? "Active" : "Inactive",
  //           }));
  //           setSearchList(temp);
  //         } else {
  //           sweetAlert({
  //             title: language === "en" ? "Not Found !! " : "आढळले नाही !!",
  //             text:
  //               language === "en" ? "Book Not Found !" : "पुस्तक सापडले नाही!",
  //             icon: "info",
  //             button: language === "en" ? "Ok" : "ठीक आहे",
  //           });
  //           setSearchList([]);
  //         }
  //         // console.log("aala re", res?.data?.bookMasterList);
  //       }
  //     })
  //     .catch((err) => {
  //       setSearchList([]);
  //       setLoading(false);
  //       catchExceptionHandlingMethod(err, language);
  //       // swal("Error!", "Somethings Wrong Book not Found!", "error");
  //       // sweetAlert({
  //       //   title: language === "en" ? "Not Found !! " : "आढळले नाही !!",
  //       //   text:
  //       //     language === "en"
  //       //       ? "Something Wrong !! Book not Found !"
  //       //       : "काहीतरी चुकीचे !! पुस्तक सापडले नाही!",
  //       //   icon: "error",
  //       //   button: language === "en" ? "Ok" : "ठीक आहे",
  //       // });
  //     });
  //   // Save - DB
  //   // axios
  //   //     .post(
  //   //         `${urls.LMSURL}/bookMaster/save`,
  //   //         finalBodyForApi
  //   //     )
  //   //     .then((res) => {
  //   //         if (res.status == 201) {
  //   //             formData.id
  //   //                 ? sweetAlert("Updated!", "Record Updated successfully !", "success")
  //   //                 : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //   //             getTableData();
  //   //             // setButtonInputState(false);
  //   //             // setIsOpenCollapse(true);
  //   //             // setEditButtonInputState(false);
  //   //             // setDeleteButtonState(false);

  //   //             setButtonInputState(false);
  //   //             setSlideChecked(false);
  //   //             setIsOpenCollapse(false);
  //   //             setEditButtonInputState(false);
  //   //             setDeleteButtonState(false);
  //   //         }
  //   //     });
  // };
  // ------------commeted on 22/12/2023 morning 10 Am--------------------------
  const onSubmitForm = (
    formData
    // _pageSize = 10,
    // _pageNo = 0,
    // _sortBy = "id",
    // _sortDir = "desc"
  ) => {
    setLoading(true);
    // const bodyForApi = {
    //   ...formData,
    // };
    console.log("formDatapageSize", formData?.pageSize);

    axios
      .get(
        `${urls.LMSURL}/bookMaster/bookSearchV1?pageNo=${
          formData?.pageNo ?? 0
        }&pageSize=${
          formData?.pageSize ?? 10
        }&sortBy=id&sortDir=ASC&bookName=${watch("bookName")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        console.log("resp", res);
        if (res?.status == 200) {
          if (res?.data?.bookMasterList?.length > 0) {
            if (
              formData?.pageSize === undefined &&
              formData?.pageNo === undefined
            ) {
              swal(
                language == "en" ? "Searched!" : "शोधले!",
                language == "en"
                  ? "Record Found successfully!"
                  : "रेकॉर्ड यशस्वीरित्या सापडला!",
                "success"
              );
            } else {
            }
            let page = res?.data?.pageSize * res?.data?.pageNo;
            let temp = res?.data?.bookMasterList?.map((r, i) => ({
              id: r.id,
              srNo: i + 1 + page,
              author: r.author ?? "-",
              barcode: r.barcode,
              bookClassification: r.bookClassification,

              bookName: r.bookName ?? "-",
              bookNameMr: r.bookNameMr ?? "-",
              // bookName1: bookTypeData?.find((obj) => obj?.id === r.bookName)
              //   ?.bookName,
              bookType: r.bookType,
              bookSubType: r.bookSubType,
              language:
                languages.find((language) => r.language == language.id)
                  ?.language ?? "-",
              languageMr:
                languages.find((language) => r.language == language.id)
                  ?.label ?? "-",
              // language: r.language,
              // languageName: bookTypeData?.find((obj) => obj?.id === r.language)
              //   ?.language,
              bookEdition: r.bookEdition ?? "-",
              bookPrice: r.bookPrice ?? "-",
              publication: r.publication ?? "-",
              bookSize: r.bookSize,
              numberOfPages: r.numberOfPages,
              // publicationName: bookTypeData?.find(
              //   (obj) => obj?.id === r.publication
              // )?.publication,
              // shelfCatlogSection: r.shelfCatlogSection,
              // shelfCatlogSectionName: bookTypeData?.find(
              //   (obj) => obj?.id === r.shelfCatlogSection
              // )?.shelfCatlogSection,
              // shelfNo: r.shelfNo,
              // shelfNoName: bookTypeData?.find((obj) => obj?.id === r.shelfNo)
              //   ?.shelfNo,
              activeFlag: r.activeFlag,
              purchaseType: r.purchaseType,
              totalAvailableBookCopy: r.totalAvailableBookCopy,
              totalBooksCopy: r.totalBooksCopy,
              zoneName:
                zoneKeys?.find((zone) => zone.id == r.zoneKey)?.zoneName ?? "-",
              zoneNameMr:
                zoneKeys?.find((zone) => zone.id == r.zoneKey)?.zoneNameMr ??
                "-",
              libraryName:
                allLibraryList?.find((library) => library.id == r.libraryKey)
                  ?.libraryName ?? "-",
              libraryNameMr:
                allLibraryList?.find((library) => library.id == r.libraryKey)
                  ?.libraryNameMr ?? "-",
              status: r.activeFlag === "Y" ? "Active" : "Inactive",
            }));
            // setSearchList(temp);
            setData({
              rows: temp,
              totalRows: res.data.totalElements,
              // totalRows: 10,
              rowsPerPageOptions: [10, 20, 50, 100],
              pageSize: res?.data?.pageSize,
              page: res?.data?.pageNo,
            });
          } else {
            sweetAlert({
              title: language === "en" ? "Not Found !! " : "आढळले नाही !!",
              text:
                language === "en" ? "Book Not Found !" : "पुस्तक सापडले नाही!",
              icon: "info",
              button: language === "en" ? "Ok" : "ठीक आहे",
            });
            setSearchList([]);
            setData({
              ...data,
              rows: [],
            });
          }
          // console.log("aala re", res?.data?.bookMasterList);
        }
      })
      .catch((err) => {
        setSearchList([]);
        setLoading(false);
        catchExceptionHandlingMethod(err, language);
        // swal("Error!", "Somethings Wrong Book not Found!", "error");
        // sweetAlert({
        //   title: language === "en" ? "Not Found !! " : "आढळले नाही !!",
        //   text:
        //     language === "en"
        //       ? "Something Wrong !! Book not Found !"
        //       : "काहीतरी चुकीचे !! पुस्तक सापडले नाही!",
        //   icon: "error",
        //   button: language === "en" ? "Ok" : "ठीक आहे",
        // });
      });
  };

  const exitButton = () => {
    sweetAlert({
      title: language === "en" ? "Exit ? " : "बाहेर पडायचे ?",
      text:
        language === "en"
          ? "Are you sure you want to exit this Record ? "
          : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता ?",
      icon: "warning",
      buttons: {
        ok: language === "en" ? "Ok" : "ठीक आहे",
        cancel: language === "en" ? "Cancel" : "रद्द करा",
      },
      dangerMode: false,
      closeOnClickOutside: false,
    }).then((will) => {
      if (will) {
        swal({
          text:
            language === "en"
              ? "Successfully Exited !"
              : "यशस्वीरित्या बाहेर पडलो !",
          icon: "success",
          button: language === "en" ? "Ok" : "ठीक आहे",
        });
        reset({
          ...resetValuesExit,
        });
        // router.push(`/dashboard`);
        if (localStorage.getItem("loggedInUser") == "citizenUser") {
          router.push(`/dashboard`);
        } else if (localStorage.getItem("loggedInUser") == "cfcUser") {
          router.push(`/CFC_Dashboard`);
        } else {
          // router.push(`/lms/transactions/searchBook`);
          router.push(`/lms/dashboard`);
        }
      } else {
        swal({
          text: language === "en" ? "Record is Safe " : "रेकॉर्ड सुरक्षित आहे",
          icon: "success",
          button: language === "en" ? "Ok" : "ठीक आहे",
        });
      }
    });
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    setData({
      rows: [],
      totalRows: 0,
      rowsPerPageOptions: [10, 20, 50, 100],
      pageSize: 10,
      page: 0,
    });
  };

  const resetValuesCancell = {
    bookClassification: "",
    language: "",
    bookName: "",
    publication: "",
    author: "",
    bookEdition: "",
    bookType: "",
    bookSubType: "",
    libraryKey: "",
  };

  const resetValuesExit = {
    bookClassification: "",
    language: "",
    bookName: "",
    publication: "",
    author: "",
    bookEdition: "",
    bookType: "",
    bookSubType: "",
    libraryKey: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // flex: 3,
      width: 60,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "bookClassificationName",
    //   headerName: "Book Classification",
    //   flex: 3,
    // },
    // {
    //   field: "bookCategoryName",
    //   headerName: "Book Category",
    //   //type: "number",
    //   flex: 3,
    // },
    // {
    //   field: "bookSubCategoryName",
    //   headerName: "Book Sub Category",
    //   // type: "number",
    //   flex: 3,
    // },
    // {
    //   field: "languageName",
    //   headerName: "Language",
    //   // type: "number",
    //   flex: 3,
    // },
    {
      field: language === "en" ? "bookName" : "bookNameMr",
      // headerName: "Book Name",
      headerName: <FormattedLabel id="bookName" />,
      align: "center",
      headerAlign: "center",
      // type: "number",
      // flex: 3,
      // width: 100,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: language === "en" ? "zoneName" : "zoneNameMr",
      // headerName: "Book Name",
      headerName: <FormattedLabel id="zone" />,
      align: "center",
      headerAlign: "center",
      // type: "number",
      // flex: 3,
      // width: 80,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: language === "en" ? "libraryName" : "libraryNameMr",
      // headerName: "Book Name",
      headerName: <FormattedLabel id="libraryCSC" />,
      align: "center",
      headerAlign: "center",
      // type: "number",
      // flex: 3,
      // width: 225,
      flex: 2,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "publication",
      // headerName: "Publication",
      headerName: <FormattedLabel id="publication" />,
      align: "center",
      headerAlign: "center",
      // type: "number",
      // flex: 3,
      // width: 100,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "author",
      // headerName: "Author",
      headerName: <FormattedLabel id="author" />,
      align: "center",
      headerAlign: "center",
      // type: "number",
      // flex: 3,
      // width: 100,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    // {
    //   field: "bookEdition",
    //   // headerName: "Book Edition",
    //   headerName: <FormattedLabel id="bookEdition" />,
    //   //type: "number",
    //   // flex: 3,
    //   width: 125,
    //   renderCell: (params) => (
    //     <Tooltip title={params.value}>
    //       <span className="csutable-cell-trucate">{params.value}</span>
    //     </Tooltip>
    //   ),
    // },
    // {
    //   field: "purchaseType",
    //   // headerName: "Language",
    //   headerName: <FormattedLabel id="purchaseType" />,
    //   //type: "number",
    //   // flex: 3,
    //   width: 125,
    //   renderCell: (params) => (
    //     <Tooltip title={params.value}>
    //       <span className="csutable-cell-trucate">{params.value}</span>
    //     </Tooltip>
    //   ),
    // },
    // {
    //   field: "bookClassification",
    //   // headerName: "Book Classification",
    //   headerName: <FormattedLabel id="bookClassification" />,
    //   //type: "number",
    //   // flex: 3,
    //   width: 150,
    //   renderCell: (params) => (
    //     <Tooltip title={params.value}>
    //       <span className="csutable-cell-trucate">{params.value}</span>
    //     </Tooltip>
    //   ),
    // },
    // {
    //   field: "bookType",
    //   // headerName: "Book Type",
    //   headerName: <FormattedLabel id="bookType" />,
    //   //type: "number",
    //   // flex: 3,
    //   width: 100,
    //   renderCell: (params) => (
    //     <Tooltip title={params.value}>
    //       <span className="csutable-cell-trucate">{params.value}</span>
    //     </Tooltip>
    //   ),
    // },
    // {
    //   field: "bookSubType",
    //   // headerName: "Book Sub Type",
    //   headerName: <FormattedLabel id="bookSubType" />,
    //   //type: "number",
    //   // flex: 3,
    //   renderCell: (params) => (
    //     <Tooltip title={params.value}>
    //       <span className="csutable-cell-trucate">{params.value}</span>
    //     </Tooltip>
    //   ),
    // },
    {
      field: "bookPrice",
      // headerName: "Book Price",
      headerName: <FormattedLabel id="bookPrice" />,
      align: "center",
      headerAlign: "center",
      //type: "number",
      // flex: 3,
      // width: 100,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: language === "en" ? "language" : "languageMr",
      // headerName: "Language",
      headerName: <FormattedLabel id="language" />,
      align: "center",
      headerAlign: "center",
      //type: "number",
      // flex: 3,
      // width: 100,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "totalAvailableBookCopy",
      // headerName: "Total Books Copy",
      headerName: <FormattedLabel id="totalAvailableBookCopy" />,
      align: "center",
      headerAlign: "center",
      //type: "number",
      // flex: 3,
      // width: 125,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    // {
    //   field: "totalBooksCopy",
    //   // headerName: "Total Books Copy",
    //   headerName: <FormattedLabel id="totalBooksCopy" />,
    //   //type: "number",
    //   // flex: 3,
    //   // width: 125,
    //   flex: 1,
    //   renderCell: (params) => (
    //     <Tooltip title={params.value}>
    //       <span className="csutable-cell-trucate">{params.value}</span>
    //     </Tooltip>
    //   ),
    // },
    // {
    //   field: "bookSize",
    //   // headerName: "Total Books Copy",
    //   headerName: <FormattedLabel id="bookSize" />,
    //   //type: "number",
    //   // flex: 3,
    //   width: 150,
    //   renderCell: (params) => (
    //     <Tooltip title={params.value}>
    //       <span className="csutable-cell-trucate">{params.value}</span>
    //     </Tooltip>
    //   ),
    // },
    // {
    //   field: "numberOfPages",
    //   // headerName: "Total Books Copy",
    //   headerName: <FormattedLabel id="noOfPages" />,
    //   //type: "number",
    //   // flex: 3,
    //   width: 125,
    //   renderCell: (params) => (
    //     <Tooltip title={params.value}>
    //       <span className="csutable-cell-trucate">{params.value}</span>
    //     </Tooltip>
    //   ),
    // },
    // {
    //   field: "shelfNoName",
    //   headerName: "Shelf No.",
    //   //type: "number",
    //   flex: 3,
    // },
    // {
    //   field: "shelfCatlogSectionName",
    //   headerName: "Shelf Catlog Section",
    //   //type: "number",
    //   flex: 3,
    // },
    // {
    //   field: "barcode",
    //   // headerName: "Barcode",
    //   headerName: <FormattedLabel id="barcode" />,
    //   //type: "number",
    //   // flex: 3,
    //   width: 100,
    //   renderCell: (params) => (
    //     <Tooltip title={params.value}>
    //       <span className="csutable-cell-trucate">{params.value}</span>
    //     </Tooltip>
    //   ),
    // },
    // {
    //     field: "actions",
    //     // headerName: "Actions",
    //     headerName: <FormattedLabel id="actions" />,
    //     width: 120,
    //     sortable: false,
    //     disableColumnMenu: true,
    //     renderCell: (params) => {
    //         return (
    //             <>
    //                 <IconButton
    //                     disabled={editButtonInputState}
    //                     onClick={() => {
    //                         setBtnSaveText("update")
    //                         setID(params.row.id)
    //                         setIsOpenCollapse(true)
    //                         setSlideChecked(true);
    //                         setButtonInputState(true);
    //                         console.log("params.row: ", params.row);
    //                         reset(params.row);
    //                         setValue('zoneKey', zoneKeys?.find((zone) => zone.zoneName == params.row.zoneName)?.id)
    //                         setValue('libraryKey', tempLibraryKeys?.find((library) => library.libraryName == params.row.libraryName)?.id)
    //                         setValue('language', languages?.find((language) => language.language == params.row.language)?.id)

    //                     }}
    //                 >
    //                     <EditIcon />
    //                 </IconButton>
    //                 {/* <IconButton
    //           disabled={deleteButtonInputState}
    //           onClick={() => deleteById(params.id)}
    //         >
    //           {params.row.activeFlag == "Y" ? (
    //             <ToggleOnIcon
    //               style={{ color: "green", fontSize: 30 }}
    //               onClick={() => deleteById(params.id, "N")}
    //             />
    //           ) : (
    //             <ToggleOffIcon
    //               style={{ color: "red", fontSize: 30 }}
    //               onClick={() => deleteById(params.id, "Y")}
    //             />
    //           )}            </IconButton> */}
    //                 <IconButton
    //                     disabled={editButtonInputState}
    //                     onClick={() => {
    //                         setBtnSaveText("Update"),
    //                             setID(params.row.id),
    //                             //   setIsOpenCollapse(true),
    //                             setSlideChecked(true);
    //                         // setButtonInputState(true);
    //                         console.log("params.row: ", params.row);
    //                         reset(params.row);
    //                     }}
    //                 >
    //                     {params.row.activeFlag == "Y" ? (
    //                         <ToggleOnIcon
    //                             style={{ color: "green", fontSize: 30 }}
    //                             onClick={() => deleteById(params.id, "N")}
    //                         />
    //                     ) : (
    //                         <ToggleOffIcon
    //                             style={{ color: "red", fontSize: 30 }}
    //                             onClick={() => deleteById(params.id, "Y")}
    //                         />
    //                     )}
    //                 </IconButton>

    //             </>
    //         );
    //     },
    // },
  ];

  useEffect(() => {
    if (watch("zoneKey")) {
      getLibraryKeys();
    }
  }, [watch("zoneKey")]);

  useEffect(() => {
    getBookClassifications();
    getBookTypeData();
    getAllLibraryAndComp();
    getLibraryKeys();
    getZoneKeys();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <ThemeProvider theme={theme}>
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
            <LmsHeader labelName="searchBook" />

            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* <Grid
                  container
                  spacing={2}
                  columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                  style={{ justifyContent: "center", marginTop: "1vh" }}
                  columns={16}
                >
                  <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                    <div>
                      <FormControl
                        variant="standard"
                        sx={{ marginTop: 2, width: "100%" }}
                        error={!!errors.zoneKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="zone" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
                              // disabled={disable}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                                console.log("Zone Key: ", value.target.value);
                                // setTemp(value.target.value)
                              }}
                              label="Zone Name  "
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
                  <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                    <div>
                      <FormControl
                        variant="standard"
                        sx={{ marginTop: 2, width: "100%" }}
                        error={!!errors.libraryKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="libraryCSC" required />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
                              // disabled={disable}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                                // setTemp(value.target.value)
                              }}
                              // label="Library/Competitive Study Centre"
                              label={
                                <FormattedLabel id="libraryCSC" required />
                              }
                            >
                              {libraryKeys &&
                                libraryKeys.map((libraryKey, index) => (
                                  <MenuItem key={index} value={libraryKey.id}>
                                    {language == "en"
                                      ? libraryKey?.libraryName
                                      : libraryKey?.libraryNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="libraryKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.libraryKey
                            ? errors.libraryKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid> */}

                  <Grid
                    container
                    spacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                    style={{ justifyContent: "center", marginTop: "1vh" }}
                    columns={16}
                  >
                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      {/* <FormControl
                            variant="standard"
                            sx={{ m: 1, width: "100%" }}
                            error={!!errors.bookName}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Book Name *
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Book Name"
                                >
                                  {bookTypeData &&
                                    bookTypeData.map((bookName, index) => (
                                      <MenuItem key={index} value={bookName.id}>
                                        {bookName.bookName}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="bookName"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.bookName ? errors.bookName.message : null}
                            </FormHelperText>
                          </FormControl> */}

                      <TextField
                        sx={{ m: 1, width: "100%" }}
                        id="standard-basic"
                        // label="Book Name"
                        label={<FormattedLabel id="bookName" required />}
                        variant="standard"
                        {...register("bookName")}
                        error={!!errors.bookName}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: watch("bookName") ? true : false,
                          // ||(router.query.bookName ? true : false),
                        }}
                        helperText={
                          errors?.bookName ? errors.bookName.message : null
                        }
                      />
                    </Grid>
                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      {/* <FormControl
                            variant="standard"
                            sx={{ m: 1, width: "100%" }}
                            error={!!errors.publication}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Publication *
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Publication"
                                >
                                  {bookTypeData &&
                                    bookTypeData.map((publication, index) => (
                                      <MenuItem
                                        key={index}
                                        value={publication.id}
                                      >
                                        {publication.publication}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="publication"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.publication
                                ? errors.publication.message
                                : null}
                            </FormHelperText>
                          </FormControl> */}
                      <TextField
                        sx={{ m: 1, width: "100%" }}
                        id="standard-basic"
                        // label="Publication"
                        label={<FormattedLabel id="publication" />}
                        variant="standard"
                        {...register("publication")}
                        error={!!errors.publication}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: watch("publication") ? true : false,
                          // ||(router.query.publication ? true : false),
                        }}
                        helperText={
                          errors?.publication
                            ? errors.publication.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, width: "100%" }}
                        error={!!errors.language}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Language */}
                          {<FormattedLabel id="language" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              // label="Language"
                              label={<FormattedLabel id="language" />}
                            >
                              {languages &&
                                languages.map((lang, index) => (
                                  <MenuItem key={index} value={lang.id}>
                                    {language === "en"
                                      ? lang.language
                                      : lang?.label}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="language"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.language ? errors.language.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                    style={{ justifyContent: "center", marginTop: "1vh" }}
                    columns={16}
                  >
                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, width: "100%" }}
                        error={!!errors.bookClassification}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Book Classification */}
                          {<FormattedLabel id="bookClassification" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              // label="Book Classification"
                              label={<FormattedLabel id="bookClassification" />}
                            >
                              {bookClassifications &&
                                bookClassifications.map(
                                  (bookClassification, index) => (
                                    <MenuItem
                                      key={index}
                                      value={
                                        bookClassification.bookClassification
                                      }
                                    >
                                      {bookClassification.bookClassification}
                                    </MenuItem>
                                  )
                                )}
                            </Select>
                          )}
                          name="bookClassification"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.bookClassification
                            ? errors.bookClassification.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, width: "100%" }}
                        error={!!errors.bookType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Book Type */}
                          {<FormattedLabel id="bookType" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              // label="Book Type"
                              label={<FormattedLabel id="bookType" />}
                            >
                              {bookTypeData &&
                                bookTypeData.map((bookType, index) => (
                                  <MenuItem
                                    key={index}
                                    value={bookType.bookType}
                                  >
                                    {bookType.bookType}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="bookType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.bookType ? errors.bookType.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, width: "100%" }}
                        error={!!errors.bookSubType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Book Sub Type */}
                          {<FormattedLabel id="bookSubType" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              // label="Book Sub Type"
                              label={<FormattedLabel id="bookSubType" />}
                            >
                              {bookSubTypeData &&
                                bookSubTypeData.map((bookSubType, index) => (
                                  <MenuItem
                                    key={index}
                                    value={bookSubType.bookSubtype}
                                  >
                                    {bookSubType.bookSubtype}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="bookSubType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.bookSubType
                            ? errors.bookSubType.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                    style={{ justifyContent: "center", marginTop: "1vh" }}
                    columns={16}
                  >
                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      <TextField
                        sx={{ m: 1, width: "100%" }}
                        id="standard-basic"
                        // label="Author"
                        label={<FormattedLabel id="author" />}
                        variant="standard"
                        {...register("author")}
                        error={!!errors.author}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: watch("author") ? true : false,
                          // ||(router.query.author ? true : false),
                        }}
                        helperText={
                          errors?.author ? errors.author.message : null
                        }
                      />
                    </Grid>

                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      <TextField
                        sx={{ m: 1, width: "100%" }}
                        id="standard-basic"
                        // label="Book Edition"
                        label={<FormattedLabel id="bookEdition" />}
                        variant="standard"
                        {...register("bookEdition")}
                        error={!!errors.bookEdition}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: watch("bookEdition") ? true : false,
                          // ||(router.query.bookEdition ? true : false),
                        }}
                        helperText={
                          errors?.bookEdition
                            ? errors.bookEdition.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>

                  {/* <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        style={{ justifyContent: "center", marginTop: "1vh" }}
                        columns={16}
                      >
                        
                      </Grid> */}

                  <div className={styles.btn}>
                    <div className={styles.btn1}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        size="small"
                        endIcon={<SaveIcon />}
                      >
                        {/* {btnSaveText} */}
                        {<FormattedLabel id={btnSaveText} />}
                      </Button>{" "}
                    </div>
                    <div className={styles.btn1}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        {/* Clear */}
                        {<FormattedLabel id="clear" />}
                      </Button>
                    </div>
                    <div className={styles.btn1}>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        {/* Exit */}
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </div>
                  </div>
                </form>
                <DataGrid
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
                  // autoHeight={true}
                  // rowHeight={50}
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
                    console.log("onPageChange", _data);
                    // onSubmitForm(data.pageSize, _data);
                    onSubmitForm({ pageNo: _data, pageSize: data?.pageSize });
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("onPageSizeChange", _data);
                    // updateData("page", 1);
                    // onSubmitForm(_data, data.page);
                    onSubmitForm({ pageSize: _data });
                  }}
                />
                {/* <DataGrid
                  autoHeight
                  sx={{
                    // marginLeft: 5,
                    // marginRight: 5,
                    // marginTop: 5,
                    // marginBottom: 5,

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
                  rows={searchList}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  //checkboxSelection
                /> */}
              </FormProvider>
            </div>
          </Paper>
        </ThemeProvider>
      )}
    </>
  );
};
export default Index;

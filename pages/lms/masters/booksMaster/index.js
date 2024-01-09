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
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import styles from "../libraryCompetativeMaster/view.module.css";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Slide } from "@mui/material";
import { TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import urls from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import theme from "../../../../theme";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import Loader from "../../../../containers/Layout/components/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import LmsHeader from "../../../../components/lms/lmsHeader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import * as yup from "yup";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const BooksMaster = () => {
  const [btnSaveText, setBtnSaveText] = useState("save");
  const languagee = useSelector((state) => state?.labels?.language);

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

  const [dataSource, setDataSource] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [bookTypeData, setBookTypeData] = useState([]);
  const [bookClassifications, setBookClassification] = useState([]);
  const [bookSubTypeData, setBookSubType] = useState([]);
  const [languages, setLanguages] = useState([
    { id: 1, language: "English" },
    { id: 2, language: "Marathi" },
    { id: 3, language: "Hindi" },
  ]);
  const [purchaseTypes, setPurchaseTypes] = useState([
    { id: 1, purchaseType: "Donated" },
    { id: 2, purchaseType: "Purchased" },
  ]);
  const [libraryKeys, setLibraryKeys] = useState([]);
  const language1 = useSelector((state) => state?.labels.language);
  const [zoneKeys, setZoneKeys] = useState([]);
  const [tempLibraryKeys, setTempLibraryKeys] = useState([]);
  const [bookConditionList, setBookConditionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = useSelector((state) => state.user.user.token);

  // schema - validation
  let schema = yup.object().shape({
    bookClassification: yup
      .string()
      .nullable()
      .required(
        language1 == "en"
          ? "Book Classification is Required !!!"
          : "पुस्तकांचे वर्गीकरण आवश्यक आहे !!!"
      ),
    zoneKey: yup
      .string()
      .nullable()
      .required(
        language1 == "en" ? "Zone is Required !!!" : "झोन आवश्यक आहे !!!"
      ),
    libraryKey: yup
      .string()
      .nullable()
      .required(
        language1 == "en"
          ? "Library/Competitive Study Centre is Required !!!"
          : "लायब्ररी/स्पर्धात्मक अभ्यास केंद्र आवश्यक आहे !!!"
      ),
    language: yup
      .string()
      .required(
        language1 == "en" ? "Language is Required !!!" : "भाषा आवश्यक आहे !!!"
      ),
    bookName: yup
      .string()
      .required(
        language1 == "en"
          ? "Book Name is Required !!!"
          : "पुस्तकाचे नाव आवश्यक आहे !!!"
      ),
    publication: yup
      .string()
      .required(
        language1 == "en"
          ? "Publication is Required !!!"
          : "प्रकाशन आवश्यक आहे !!!"
      ),
    author: yup
      .string()
      .required(
        language1 == "en" ? "Author is Required  !!!" : "लेखक आवश्यक आहे !!!"
      ),
    bookEdition: yup
      .string()
      .required(
        language1 == "en"
          ? "Book Edition is Required !!!"
          : "पुस्तक आवृत्ती आवश्यक आहे !!!"
      ),
    bookPrice: yup
      .string()
      .required(
        language1 == "en"
          ? "Book Price is Required !!!"
          : "पुस्तकाची किंमत आवश्यक आहे !!!"
      )
      .matches(/^[0-9]+$/, "Only numbers are allowed for this field"),
    totalBooksCopy: yup
      .string()
      .required(
        language1 == "en"
          ? "Total Books Copy is Required !!!"
          : "एकूण पुस्तकांची प्रत आवश्यक आहे !!!"
      )
      .matches(/^[0-9]+$/, "Only numbers are allowed for this field"),
  });

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    getBookClassifications();
    getBookTypeData();
    getZoneKeys();
    getTempLibraryKeys();
    getBookCondition();
  }, []);

  const getTempLibraryKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.LMSURL}/libraryMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setTempLibraryKeys(
          r.data.libraryMasterList.map((row) => ({
            id: row.id,
            // zoneName: row.zoneName,
            // zoneNameMr: row.zoneNameMr,
            libraryName: row.libraryName,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, languagee);
      });
  };

  useEffect(() => {
    if (watch("zoneKey")) {
      getLibraryKeys();
    }
  }, [watch("zoneKey")]);

  useEffect(() => {
    if (tempLibraryKeys.length > 0) {
      getTableData();
    }
  }, [tempLibraryKeys.length > 0]);

  const getLibraryKeys = () => {
    //setValues("setBackDrop", true);
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
            // zoneNameMr: row.zoneNameMr,
            libraryName: row.libraryName,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, languagee);
      });
  };

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
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, languagee);
      });
  };

  // useEffect(() => {
  //   getTableData();

  // }, [bookTypeData]);

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
        })
        .catch((error) => {
          // setLoading(false);
          callCatchMethod(error, languagee);
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
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, languagee);
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
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, languagee);
      });
  };

  const getBookCondition = () => {
    axios
      .get(`${urls.LMSURL}/bookCondition/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setBookConditionList(
          r.data?.bookConditionDaoList.map((r) => ({
            id: r.id,
            bookConditionEng: r.bookConditionEng,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, languagee);
      });
  };

  const getBookSubType = () => {};

  const getTableData = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.LMSURL}/bookMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: "id",
          sortDir: "dsc",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        console.log("bookmaster", res.data);
        console.log("zone", zoneKeys, tempLibraryKeys);

        let _res = res.data?.bookMasterList.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          author: r.author,
          barcode: r.barcode,
          bookClassification: r.bookClassification,
          bookCondition: r.bookCondition,
          bookName: r.bookName,
          // bookName1: bookTypeData?.find((obj) => obj?.id === r.bookName)
          //   ?.bookName,
          bookType: r.bookType,
          bookSubType: r.bookSubType,
          language: languages.find((language) => r.language == language.id)
            ?.language,
          // language: r.language,
          // languageName: bookTypeData?.find((obj) => obj?.id === r.language)
          //   ?.language,
          bookEdition: r.bookEdition,
          bookPrice: r.bookPrice,
          publication: r.publication,
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
          totalBooksCopy: r.totalBooksCopy,
          zoneName: zoneKeys?.find((zone) => zone.id == r.zoneKey)?.zoneName,
          libraryName: tempLibraryKeys?.find(
            (library) => library.id == r.libraryKey
          )?.libraryName,
          status: r.activeFlag === "Y" ? "Active" : "Inactive",
        }));
        setDataSource({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, languagee);
      });
  };

  const onSubmitForm = (formData) => {
    setLoading(true);
    const finalBodyForApi = {
      ...formData,
      totalAvailableBookCopy: formData?.totalBooksCopy,
    };

    console.log("savebody", finalBodyForApi);
    // Save - DB
    axios
      .post(`${urls.LMSURL}/bookMaster/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          setLoading(false);
          formData.id
            ? sweetAlert(
                language1 == "en" ? "Updated!" : "अपडेट केले",
                language1 == "en"
                  ? "Record Updated successfully !"
                  : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                "success"
              )
            : sweetAlert(
                language1 === "en" ? "Saved!" : "जतन केले!",
                language1 === "en"
                  ? "Record Saved successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                "success"
              );
          getTableData();
          // setButtonInputState(false);
          // setIsOpenCollapse(true);
          // setEditButtonInputState(false);
          // setDeleteButtonState(false);

          setButtonInputState(false);
          setSlideChecked(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, languagee);
      });
  };

  const deleteById = (value, _activeFlag) => {
    setLoading(true);
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("active", body);
    // swal({
    //   title: "Delete?",
    //   text: "Are you sure you want to delete this Record ? ",
    //   icon: "warning",
    //   buttons: true,
    //   dangerMode: true,
    // }).then((willDelete) => {
    //   if (willDelete) {
    //     axios
    //       // .delete(
    //       //   `${urls.LMSURL}/bookMaster/delete/${value}`
    //       // )
    //       .post(`${urls.LMSURL}/bookClassificationMaster/save`, body)
    //       .then((res) => {
    //         if (res.status == 226) {
    //           swal("Record is Successfully Deleted!", {
    //             icon: "success",
    //           });
    //           setButtonInputState(false);
    //           getTableData();
    //         }
    //       });
    //   } else {
    //     swal("Record is Safe");
    //   }
    // });
    if (_activeFlag === "N") {
      swal({
        title: language1 == "en" ? "Inactivate?" : "निष्क्रिय करा?",
        text:
          language1 == "en"
            ? "Are you sure you want to inactivate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.LMSURL}/bookMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                setLoading(false);
                swal(
                  language1 == "en"
                    ? "Record is Successfully Inactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                setButtonInputState(false);
                getTableData();
              }
            })
            .catch((error) => {
              setLoading(false);
              callCatchMethod(error, languagee);
            });
        } else if (willDelete == null) {
          setLoading(false);
          swal(language1 == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
        }
      });
    } else {
      swal({
        title: language1 == "en" ? "Activate?" : "सक्रिय करा?",
        text:
          language1 == "en"
            ? "Are you sure you want to activate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.LMSURL}/bookMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                setLoading(false);
                swal(
                  language1 == "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                setButtonInputState(false);
                getTableData();
              }
            })
            .catch((error) => {
              setLoading(false);
              callCatchMethod(error, languagee);
            });
        } else if (willDelete == null) {
          swal(language1 == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
          setLoading(false);
        }
      });
    }
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  useEffect(() => {
    console.log("bookCondition", watch("bookCondition"));
  }, [watch("bookCondition")]);

  const resetValuesCancell = {
    numberOfPages: "",
    zoneKey: "",
    purchaseType: "",
    libraryKey: "",
    bookClassification: "",
    language: "",
    bookName: "",
    bookCondition: "",
    publication: "",
    author: "",
    bookEdition: "",
    bookPrice: "",
    totalBooksCopy: "",
    // shelfNo: "",
    // shelfCatlogSection: "",
    barcode: "",
    bookType: "",
    bookSubType: "",
    bookSize: "",
  };

  const resetValuesExit = {
    numberOfPages: "",
    zoneKey: "",
    purchaseType: "",
    libraryKey: "",
    bookClassification: "",
    language: "",
    bookName: "",
    bookCondition: "",
    publication: "",
    author: "",
    bookEdition: "",
    bookPrice: "",
    totalBooksCopy: "",
    // shelfNo: "",
    // shelfCatlogSection: "",
    barcode: "",
    bookType: "",
    bookSubType: "",
    bookSize: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      // headerName: <FormattedLabel id="srNo" />,
      headerName: languagee === "en" ? "Sr.No" : "अनुक्रमांक",
      // width: 60,
      flex: 0.5,
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
      field: "zoneName",
      // headerName: "Book Name",
      // headerName: <FormattedLabel id="zone" />,
      headerName: languagee === "en" ? "Zone" : "झोन",
      // type: "number",
      // flex: 5,
      // width: 80,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "libraryName",
      // headerName: "Book Name",
      // headerName: <FormattedLabel id="libraryCSC" />,
      headerName:
        languagee === "en"
          ? "Library/Competitive Study Centre"
          : "ग्रंथालय/स्पर्धात्मक अभ्यास केंद्र",
      // type: "number",
      // flex: 15,
      // width: 225,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "bookName",
      // headerName: "Book Name",
      // headerName: <FormattedLabel id="bookName" />,
      headerName: languagee === "en" ? "Book Name" : "पुस्तकाचे नाव",
      // type: "number",
      // flex: 5,
      // width: 100,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    // {
    //   field: "publication",
    //   // headerName: "Publication",
    //   headerName: <FormattedLabel id="publication" />,
    //   // type: "number",
    //   // flex: 5,
    //   width: 100,
    //   renderCell: (params) => (
    //     <Tooltip title={params.value}>
    //       <span className="csutable-cell-trucate">{params.value}</span>
    //     </Tooltip>
    //   ),
    // },
    {
      field: "author",
      // headerName: "Author",
      // headerName: <FormattedLabel id="author" />,
      headerName: languagee === "en" ? "Author" : "लेखक",
      // type: "number",
      // flex: 5,
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
    //   // flex: 10,
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
    {
      field: "bookClassification",
      // headerName: "Book Classification",
      // headerName: <FormattedLabel id="bookClassification" />,
      headerName:
        languagee === "en" ? "Book Classification" : "पुस्तक वर्गीकरण",
      //type: "number",
      // flex: 3,
      // width: 150,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
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
    //   width: 125,
    //   // flex: 3,
    //   renderCell: (params) => (
    //     <Tooltip title={params.value}>
    //       <span className="csutable-cell-trucate">{params.value}</span>
    //     </Tooltip>
    //   ),
    // },
    // {
    //   field: "bookCondition",
    //   // headerName: "Book Sub Type",
    //   headerName: <FormattedLabel id="bookConditionEn" />,
    //   //type: "number",
    //   // flex: 3,
    //   width: 125,
    //   renderCell: (params) => (
    //     <Tooltip title={params.value}>
    //       <span className="csutable-cell-trucate">{params.value}</span>
    //     </Tooltip>
    //   ),
    // },
    {
      field: "bookPrice",
      // headerName: "Book Price",
      // headerName: <FormattedLabel id="bookPrice" />,
      headerName: languagee === "en" ? "Book Price" : "पुस्तकाची किंमत",
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
      field: "language",
      // headerName: "Language",
      // headerName: <FormattedLabel id="language" />,
      headerName: languagee === "en" ? "Language" : "भाषा",
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
      field: "totalBooksCopy",
      // headerName: "Total Books Copy",
      // headerName: <FormattedLabel id="totalBooksCopy" />,
      headerName:
        languagee === "en" ? "Total Books Copy" : "एकूण पुस्तकांच्या प्रती",
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
    {
      field: "actions",
      // headerName: "Actions",
      // headerName: <FormattedLabel id="actions" />,
      headerName: languagee === "en" ? "Actions" : "क्रिया",
      // width: 120,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update");
                setID(params.row.id);
                setIsOpenCollapse(true);
                setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
                setValue(
                  "zoneKey",
                  zoneKeys?.find((zone) => zone.zoneName == params.row.zoneName)
                    ?.id
                );
                setValue(
                  "libraryKey",
                  tempLibraryKeys?.find(
                    (library) => library.libraryName == params.row.libraryName
                  )?.id
                );
                setValue(
                  "language",
                  languages?.find(
                    (language) => language.language == params.row.language
                  )?.id
                );
              }}
            >
              <EditIcon />
            </IconButton>
            {/* <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.id)}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Paper
        elevation={8}
        variant="contained"
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
          <BreadcrumbComponent />
        </Box>
        <LmsHeader labelName="booksMaster" />
        {loading ? (
          <Loader />
        ) : (
          <>
            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
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
                            error={!!errors.zoneKey}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="zone" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    console.log(
                                      "Zone Key: ",
                                      value.target.value
                                    );
                                    // setTemp(value.target.value)
                                  }}
                                  label="Zone Name  "
                                >
                                  {zoneKeys &&
                                    zoneKeys.map((zoneKey, index) => (
                                      <MenuItem key={index} value={zoneKey.id}>
                                        {/*  {zoneKey.zoneKey} */}

                                        {language1 == "en"
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
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            sx={{ m: 1, width: "100%" }}
                            error={!!errors.libraryKey}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="libraryCSC" required />
                              {/* Library/Competitive Study Centre */}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    console.log(
                                      "Zone Key: ",
                                      value.target.value
                                    );
                                    // setTemp(value.target.value)
                                  }}
                                  // label="Library/Competitive Study Centre "
                                  label={
                                    <FormattedLabel id="libraryCSC" required />
                                  }
                                >
                                  {libraryKeys &&
                                    libraryKeys.map((libraryKey, index) => (
                                      <MenuItem
                                        key={index}
                                        value={libraryKey.id}
                                      >
                                        {/*  {zoneKey.zoneKey} */}

                                        {/* {language == 'en'
                                                                                    ? libraryKey?.libraryName
                                                                                    : libraryKey?.libraryNameMr} */}
                                        {libraryKey?.libraryName}
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
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            sx={{ m: 1, width: "100%" }}
                            error={!!errors.purchaseType}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {/* Book Type */}
                              {<FormattedLabel id="purchaseType" />}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  // label="Book Type"
                                  label={<FormattedLabel id="purchaseType" />}
                                >
                                  {purchaseTypes &&
                                    purchaseTypes.map((purchaseType, index) => (
                                      <MenuItem
                                        key={index}
                                        value={purchaseType.purchaseType}
                                      >
                                        {purchaseType.purchaseType}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="purchaseType"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.purchaseType
                                ? errors.purchaseType.message
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
                          <FormControl
                            variant="standard"
                            sx={{ m: 1, width: "100%" }}
                            error={!!errors.bookClassification}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {/* Book Classification */}
                              {
                                <FormattedLabel
                                  id="bookClassification"
                                  required
                                />
                              }
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  // label="Book Classification"
                                  label={
                                    <FormattedLabel id="bookClassification" />
                                  }
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
                                          {
                                            bookClassification.bookClassification
                                          }
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
                              {errors?.bookType
                                ? errors.bookType.message
                                : null}
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
                                    bookSubTypeData.map(
                                      (bookSubType, index) => (
                                        <MenuItem
                                          key={index}
                                          value={bookSubType.bookSubtype}
                                        >
                                          {bookSubType.bookSubtype}
                                        </MenuItem>
                                      )
                                    )}
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
                          <FormControl
                            variant="standard"
                            sx={{ m: 1, width: "100%" }}
                            error={!!errors.language}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {/* Language */}
                              {<FormattedLabel id="language" required />}
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
                                    languages.map((language, index) => (
                                      <MenuItem key={index} value={language.id}>
                                        {language.language}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="language"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.language
                                ? errors.language.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
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
                          <FormControl
                            variant="standard"
                            sx={{ m: 1, width: "100%" }}
                            error={!!errors.bookCondition}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {/* Book Type */}
                              {<FormattedLabel id="bookConditionEn" />}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  // label="Book Type"
                                  label={
                                    <FormattedLabel id="bookConditionEn" />
                                  }
                                >
                                  {bookConditionList &&
                                    bookConditionList.map(
                                      (bookCondition, index) => (
                                        <MenuItem
                                          key={index}
                                          value={bookCondition.bookConditionEng}
                                        >
                                          {bookCondition.bookConditionEng}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              )}
                              name="bookCondition"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.bookCondition
                                ? errors.bookCondition.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      {watch("bookCondition") == "Lost" ? (
                        <Grid
                          container
                          spacing={2}
                          columnSpacing={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 12,
                            xl: 12,
                          }}
                          style={{ justifyContent: "center", marginTop: "1vh" }}
                          columns={16}
                        >
                          <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                            <Controller
                              name="fineStatus"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <RadioGroup
                                    {...field}
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    defaultValue="Fine Not Paid"
                                  >
                                    <FormControlLabel
                                      value="Fine Paid"
                                      control={<Radio />}
                                      label={<FormattedLabel id="finePaid" />}
                                    />
                                    <FormControlLabel
                                      value="Fine Not Paid"
                                      control={<Radio />}
                                      label={
                                        <FormattedLabel id="fineNotPaid" />
                                      }
                                    />
                                  </RadioGroup>
                                </>
                              )}
                            />
                          </Grid>
                          {watch("fineStatus") == "Fine Paid" ? (
                            <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                              <TextField
                                sx={{ m: 1, width: "100%" }}
                                id="standard-basic"
                                // label="Publication"
                                label={<FormattedLabel id="fineAmount" />}
                                variant="standard"
                                {...register("fineAmount")}
                                error={!!errors.fineAmount}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  //true
                                  shrink: watch("fineAmount") ? true : false,
                                  // ||(router.query.publication ? true : false),
                                }}
                                helperText={
                                  errors?.fineAmount
                                    ? errors.fineAmount.message
                                    : null
                                }
                              />
                            </Grid>
                          ) : (
                            ""
                          )}
                        </Grid>
                      ) : (
                        ""
                      )}
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
                            label={<FormattedLabel id="publication" required />}
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
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            id="standard-basic"
                            // label="Author"
                            label={<FormattedLabel id="author" required />}
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
                            label={<FormattedLabel id="bookEdition" required />}
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
                            // label="Book Price"
                            label={<FormattedLabel id="bookPrice" required />}
                            variant="standard"
                            {...register("bookPrice")}
                            error={!!errors.bookPrice}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink: watch("bookPrice") ? true : false,
                              // ||(router.query.bookPrice ? true : false),
                            }}
                            helperText={
                              errors?.bookPrice
                                ? errors.bookPrice.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            id="standard-basic"
                            // label="Total Books Copy"
                            label={
                              <FormattedLabel id="totalBooksCopy" required />
                            }
                            variant="standard"
                            {...register("totalBooksCopy")}
                            error={!!errors.totalBooksCopy}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink: watch("totalBooksCopy") ? true : false,
                              // ||(router.query.totalBooksCopy ? true : false),
                            }}
                            helperText={
                              errors?.totalBooksCopy
                                ? errors.totalBooksCopy.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            id="standard-basic"
                            // label="Book Edition"
                            label={<FormattedLabel id="bookSize" />}
                            variant="standard"
                            {...register("bookSize")}
                            error={!!errors.bookSize}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink: watch("bookSize") ? true : false,
                              // ||(router.query.bookEdition ? true : false),
                            }}
                            helperText={
                              errors?.bookSize ? errors.bookSize.message : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            id="standard-basic"
                            // label="Book Edition"
                            label={<FormattedLabel id="noOfPages" />}
                            variant="standard"
                            {...register("numberOfPages")}
                            error={!!errors.numberOfPages}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink: watch("numberOfPages") ? true : false,
                              // ||(router.query.bookEdition ? true : false),
                            }}
                            helperText={
                              errors?.numberOfPages
                                ? errors.numberOfPages.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            id="standard-basic"
                            // label="Barcode"
                            label={<FormattedLabel id="barcode" />}
                            variant="standard"
                            {...register("barcode")}
                            error={!!errors.barcode}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink: watch("barcode") ? true : false,
                              // ||(router.query.barcode ? true : false),
                            }}
                            helperText={
                              errors?.barcode ? errors.barcode.message : null
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

                      <Grid
                        container
                        style={{
                          padding: "10px",
                        }}
                      >
                        <Grid
                          item
                          xs={4}
                          sx={{
                            display: "flex",
                            justifyContent: "end",
                          }}
                        >
                          <Button
                            type="submit"
                            size="small"
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {/* {btnSaveText} */}
                            {<FormattedLabel id={btnSaveText} />}
                          </Button>{" "}
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
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
                        </Grid>
                        <Grid item xs={4}>
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
                        </Grid>
                      </Grid>

                      <div className={styles.btn}>
                        <div className={styles.btn1}></div>
                        <div className={styles.btn1}></div>
                        <div className={styles.btn1}></div>
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </Slide>
            )}

            <div className={styles.addbtn}>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                type="primary"
                size="small"
                disabled={buttonInputState}
                onClick={() => {
                  reset({
                    ...resetValuesExit,
                  });
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  setBtnSaveText("save");
                  setButtonInputState(true);
                  setSlideChecked(true);
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                {/* Add{" "} */}
                {<FormattedLabel id="add" />}
              </Button>
            </div>

            <DataGrid
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
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
              rowCount={dataSource.totalRows}
              rowsPerPageOptions={dataSource.rowsPerPageOptions}
              page={dataSource.page}
              pageSize={dataSource.pageSize}
              rows={dataSource.rows}
              columns={columns}
              onPageChange={(_data) => {
                getBookClassifications(dataSource.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getBookClassifications(_data, dataSource.page);
              }}
              // rows={dataSource}
              // pageSize={5}
              // rowsPerPageOptions={[5]}
              //checkboxSelection
            />
          </>
        )}
      </Paper>
    </>
  );
};
export default BooksMaster;

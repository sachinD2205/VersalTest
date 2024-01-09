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
} from "@mui/material";
import { Paper } from "@mui/material";
import { DataGrid, GridCell, GridRow, GridToolbar } from "@mui/x-data-grid";
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { FormHelperText } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../containers/schema/libraryManagementSystem/magazinesNewspaperMaster";
import axios from "axios";
import urls from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import theme from "../../../../theme";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import Loader from "../../../../containers/Layout/components/Loader";
import LmsHeader from "../../../../components/lms/lmsHeader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const MagazinesNewspaperMaster = () => {
  const [btnSaveText, setBtnSaveText] = useState("save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [languages, setLanguages] = useState([
    { id: 1, language: "English" },
    { id: 2, language: "Marathi" },
  ]);
  const [magazineNewspaperTypes, setMagazineNewspaperType] = useState([]);

  const [loading, setLoading] = useState(false);
  const language1 = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const languagee = useSelector((state) => state.labels.language);
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
  // schema - validation
  let schema = yup.object().shape({
    magazineName: yup
      .string()
      .nullable()
      .required(
        language1 == "en"
          ? "Newspaper Name is Required !!!"
          : "वृत्तपत्रचे नाव आवश्यक आहे !!!"
      ),
    magazineSubCategory: yup
      .string()
      .nullable()
      .required(
        language1 == "en"
          ? "Magazines/Newspaper Sub Category Name is Required !!!"
          : "मासिके/वृत्तपत्र उप श्रेणीचे नाव आवश्यक आहे !!!"
      ),
    supplierName: yup
      .string()
      .required(
        language1 == "en"
          ? "Supplier Name is Required !!!"
          : "पुरवठादाराचे नाव आवश्यक आहे !!!"
      ),
    contactNumber: yup
      .string()
      .required(
        language1 == "en"
          ? "Contact Number is Required !!!"
          : "संपर्क क्रमांक आवश्यक आहे !!!"
      )
      .matches(
        /^[0-9]+$/,
        language1 == "en"
          ? "Must be only digits !!!"
          : "फक्त अंक असणे आवश्यक आहे !!!"
      )
      .min(
        10,
        language1 == "en"
          ? "Mobile Number must be 10 number"
          : "मोबाईल क्रमांक 10 क्रमांकाचा असावा !!!"
      )
      .max(
        10,
        language1 == "en"
          ? "Mobile Number must be 10 number"
          : "मोबाईल नंबर 10 वरील नंबरवर वैध नाही !!!"
      ),
    language: yup
      .string()
      .required(
        language1 == "en" ? "Language is Required !!!" : "भाषा आवश्यक आहे !!!"
      ),
    remark: yup
      .string()
      .required(
        language1 == "en" ? "Remark is Required !!!" : "टिप्पणी आवश्यक आहे !!!"
      ),
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

  useEffect(() => {
    getLanguageTypes();
    getMagazineNewspaperType();
  }, []);

  const getMagazineNewspaperType = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.LMSURL}/magazineNewspaperType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        let _res = r?.data?.magazineNewspaperTypeMasterDaoList?.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,
            magazineNewspaperTypeName: r.magazineNewspaperTypeName,

            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setMagazineNewspaperType(_res);
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, languagee);
      });
    // .catch((err) => {
    //   swal(
    //     language1 == "en" ? "Error!" : "त्रुटी?",
    //     language1 == "en"
    //       ? "Somethings Wrong Magazine/Newspaper Type not Found!"
    //       : "काहीतरी चुकीचे आहे, मासिक/वृत्तपत्राचा प्रकार सापडला नाही!",
    //     "error"
    //   );
    // });
  };

  useEffect(() => {
    getTableData();
  }, [languages, magazineNewspaperTypes]);

  const getLanguageTypes = () => {
    // axios.get(`${urls.BaseURL}/mstBookType/getBookTypeData`).then((r) => {
    //   setLanguages(
    //     r.data.map((row) => ({
    //       id: row.id,
    //       language: row.language,
    //     }))
    //   );
    // });
  };

  const getTableData = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.LMSURL}/magazineNewspaperMaster/getAll`, {
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
        console.log(res);
        setDataSource(
          res.data.masterMagazineNewspaperList.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            magazineName: r.magazineName,
            magazineSubCategory: r.magazineSubCategory,
            language: r.language,
            // languageName: languages?.find((obj) => obj?.id === r.language)
            //   ?.language,
            supplierName: r.supplierName,
            contactNumber: r.contactNumber,
            price: r.price,
            quantity: r.quantity,
            remark: r.remark,
            magazineNewspaperType: magazineNewspaperTypes.find(
              (magazineNewspaperType) =>
                magazineNewspaperType.id == r.magazineTypeKey
            )?.magazineNewspaperTypeName,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            activeFlag: r.activeFlag,
          }))
        );
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, languagee);
      });
  };

  const onSubmitForm = (formData) => {
    setLoading(true);
    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      price: Number(formData.price),
    };

    console.log("formdata", finalBodyForApi);
    // Save - DB
    axios
      .post(`${urls.LMSURL}/magazineNewspaperMaster/save`, finalBodyForApi, {
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

  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(
  //           `${urls.LMSURL}/magazineNewspaperMaster/delete/${value}`
  //         )
  //         .then((res) => {
  //           if (res.status == 226) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             setButtonInputState(false);
  //             getTableData();
  //           }
  //         });
  //     } else {
  //       swal("Record is Safe");
  //     }
  //   });
  // };

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
            .post(`${urls.LMSURL}/magazineNewspaperMaster/save`, body, {
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
          swal(language1 == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
          setLoading(false);
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
            .post(`${urls.LMSURL}/magazineNewspaperMaster/save`, body, {
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

  const resetValuesCancell = {
    magazineName: "",
    magazineSubCategory: "",
    language: "",
    supplierName: "",
    contactNumber: "",
    remark: "",
    quantity: "",
    price: "",
  };

  const resetValuesExit = {
    magazineName: "",
    magazineSubCategory: "",
    language: "",
    supplierName: "",
    contactNumber: "",
    remark: "",
    quantity: "",
    price: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      // headerName: "Sr.No",
      // headerName: <FormattedLabel id="srNo" />,
      headerName: languagee === "en" ? "Sr.No" : "अनुक्रमांक",
      flex: 1,
    },
    {
      field: "magazineName",
      // headerName: "Magazines/Newspaper Name",
      // headerName: <FormattedLabel id="magazinesNewspaperName" />,
      headerName:
        languagee === "en"
          ? "Magazines/Newspaper Name"
          : "मासिके/वृत्तपत्रांचे नाव",
      flex: 1,
    },
    {
      field: "magazineSubCategory",
      // headerName: "Magazines/Newspaper Sub Category Name",
      // headerName: <FormattedLabel id="magazinesNewspaperSubCategory" />,
      headerName:
        languagee === "en"
          ? "Magazines/Newspaper Sub Category Name"
          : "मासिके/वृत्तपत्र उपवर्गाचे नाव",
      //type: "number",
      flex: 1,
    },
    {
      field: "magazineNewspaperType",
      // headerName: "Language",
      // headerName: <FormattedLabel id="magazineNewspaperType" />,
      headerName:
        languagee === "en" ? "Magazine/Newspaper Type" : "वृत्तपत्र प्रकार",
      //type: "number",
      flex: 1,
    },
    {
      field: "language",
      // headerName: "Language",
      // headerName: <FormattedLabel id="language" />,
      headerName: languagee === "en" ? "Language" : "भाषा",
      //type: "number",
      flex: 1,
    },
    {
      field: "supplierName",
      // headerName: "Supplier Name",
      // headerName: <FormattedLabel id="supplierName" />,
      headerName: languagee === "en" ? "Supplier Name" : "पुरवठादाराचे नाव",
      //type: "number",
      flex: 1,
    },
    {
      field: "contactNumber",
      // headerName: "Contact Number",
      // headerName: <FormattedLabel id="contactNumber" />,
      headerName: languagee === "en" ? "Contact Number" : "संपर्क क्रमांक",
      //type: "number",
      flex: 1,
    },
    {
      field: "price",
      // headerName: "Contact Number",
      // headerName: <FormattedLabel id="price" />,
      headerName: languagee === "en" ? "Price" : "किंमत",
      //type: "number",
      flex: 1,
    },
    {
      field: "quantity",
      // headerName: "Contact Number",
      // headerName: <FormattedLabel id="quantity" />,
      headerName: languagee === "en" ? "Quantity" : "प्रमाण",
      //type: "number",
      flex: 1,
    },
    {
      field: "remark",
      // headerName: "Remark",
      // headerName: <FormattedLabel id="remark" />,
      headerName: languagee === "en" ? "Remarks" : "टिप्पणी",
      //type: "number",
      flex: 2,
    },

    {
      field: "actions",
      // headerName: "Actions",
      // headerName: <FormattedLabel id="actions" />,
      headerName: languagee === "en" ? "Actions" : "क्रिया",
      // width: 120,
      flex: 2,
      align: "right",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row);
              }}
            >
              <EditIcon />
            </IconButton>
            {/* <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.id)}
            >
              <DeleteIcon />
            </IconButton> */}

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
          <BreadcrumbComponent />
        </Box>
        <LmsHeader labelName="magazineNewspaperMaster" />

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
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            id="standard-basic"
                            // label="Magazines/Newspaper Name"
                            label={
                              <FormattedLabel
                                id="magazinesNewspaperName"
                                required
                              />
                            }
                            variant="standard"
                            InputLabelProps={{
                              shrink: watch("magazineName") ? true : false,
                            }}
                            {...register("magazineName")}
                            error={!!errors.magazineName}
                            helperText={
                              errors?.magazineName
                                ? errors.magazineName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            id="standard-basic"
                            // label="Magazines/Newspaper Sub Category Name"
                            label={
                              <FormattedLabel
                                id="magazinesNewspaperSubCategory"
                                required
                              />
                            }
                            variant="standard"
                            {...register("magazineSubCategory")}
                            InputLabelProps={{
                              shrink: watch("magazineSubCategory")
                                ? true
                                : false,
                            }}
                            error={!!errors.magazineSubCategory}
                            helperText={
                              errors?.magazineSubCategory
                                ? errors.magazineSubCategory.message
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
                                      <MenuItem
                                        key={index}
                                        value={language.language}
                                      >
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
                            error={!!errors.magazineTypeKey}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {/* Language */}
                              {<FormattedLabel id="magazineNewspaperType" />}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  // label="Language"
                                  label={
                                    <FormattedLabel id="magazineNewspaperType" />
                                  }
                                >
                                  {magazineNewspaperTypes &&
                                    magazineNewspaperTypes.map(
                                      (magazineNewspaperType, index) => (
                                        <MenuItem
                                          key={index}
                                          value={magazineNewspaperType.id}
                                        >
                                          {
                                            magazineNewspaperType.magazineNewspaperTypeName
                                          }
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              )}
                              name="magazineTypeKey"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.magazineTypeKey
                                ? errors.magazineTypeKey.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            id="standard-basic"
                            // label="Supplier Name"
                            label={
                              <FormattedLabel id="supplierName" required />
                            }
                            variant="standard"
                            {...register("supplierName")}
                            InputLabelProps={{
                              shrink: watch("supplierName") ? true : false,
                            }}
                            error={!!errors.supplierName}
                            helperText={
                              errors?.supplierName
                                ? errors.supplierName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            id="standard-basic"
                            // label="Quantity"
                            label={<FormattedLabel id="quantity" />}
                            variant="standard"
                            {...register("quantity")}
                            InputLabelProps={{
                              shrink: watch("quantity") ? true : false,
                            }}
                            error={!!errors.quantity}
                            helperText={
                              errors?.quantity ? errors.quantity.message : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            id="standard-basic"
                            // label="Price"
                            label={<FormattedLabel id="price" />}
                            variant="standard"
                            {...register("price")}
                            InputLabelProps={{
                              shrink: watch("price") ? true : false,
                            }}
                            error={!!errors.price}
                            helperText={
                              errors?.price ? errors.price.message : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            id="standard-basic"
                            // label="Contact Number"
                            label={
                              <FormattedLabel id="contactNumber" required />
                            }
                            variant="standard"
                            {...register("contactNumber")}
                            InputLabelProps={{
                              shrink: watch("contactNumber") ? true : false,
                            }}
                            error={!!errors.contactNumber}
                            helperText={
                              errors?.contactNumber
                                ? errors.contactNumber.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            id="standard-basic"
                            // label="Remark"
                            label={<FormattedLabel id="remark" required />}
                            variant="standard"
                            {...register("remark")}
                            InputLabelProps={{
                              shrink: watch("remark") ? true : false,
                            }}
                            error={!!errors.remark}
                            helperText={
                              errors?.remark ? errors.remark.message : null
                            }
                          />
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "end" }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {/* {btnSaveText} */}
                            {<FormattedLabel id={btnSaveText} />}
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "center" }}
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
                  // printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  // csvOptions: { disableToolbarButton: true },
                },
              }}
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
              rows={dataSource}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              //checkboxSelection
            />
          </>
        )}
      </Paper>
    </>
  );
};
export default MagazinesNewspaperMaster;

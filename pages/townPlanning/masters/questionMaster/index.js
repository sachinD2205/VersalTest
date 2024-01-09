import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import * as yup from "yup";
import urls from "../../../../URLS/urls";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../view.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  let schema = yup.object().shape({
    questionEng: yup
      .string()
      .nullable()
      .required("Question Eng is Required !!!"),
    questionMr: yup
      .string()
      .nullable()
      .required("Question Mar is Required !!!"),
    // questionType: yup.string().required(" Question Type is Required !!"),
    answerType: yup.string().nullable().required(" Answer Type is Required !!"),
    checklistType: yup
      .string()
      .nullable()
      .required("CheckList Type is Required !!"),
    // application: yup
    //   .string()
    //   .nullable()
    //   .required(" Application Name is Required !!"),
    serviceId: yup.string().nullable().required(" Service Name is Required !!"),
  });

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {},
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const {
    fields: answersofQuestions,
    append: appendParentAnswers,
    remove: removeParentAnswers,
  } = useFieldArray({
    control,
    name: "answersofQuestions",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);

  const [answersofQuestionsInRow, setAnswersofQuestionsInRow] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const answerTypeData = [
    "Select",
    "Text",
    "Number",
    "Radio",
    "File",
    "Email",
    "URL",
    "Date",
  ];

  const checkListTypeData = ["Mandatory", "Optional"];

  const funcForConditions = () => {
    if (watch("answerType") == "Select") {
      return watch("answerType") == "Select";
    } else if (watch("answerType") == "Radio") {
      return watch("answerType") == "Radio";
    }
  };
  useEffect(() => {
    removeParentAnswers(answersofQuestions);
  }, [watch("answerType")]);
  // RENDERDERING FORMS //
  const parentQuestions = (
    <>
      <Grid
        container
        sx={{
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // gap: 5,
        }}
      >
        <Grid
          item
          xs={12}
          sm={5.5}
          md={5.5}
          lg={5.5}
          xl={5.5}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Transliteration
            variant={"standard"}
            _key={"questionEng"}
            labelName={"questionEng"}
            fieldName={"questionEng"}
            updateFieldName={"questionMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            label={<FormattedLabel id="questionEn" required />}
            error={!!errors.questionEng}
            helperText={errors?.questionEng ? errors.questionEng.message : null}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={5.5}
          md={5.5}
          lg={5.5}
          xl={5.5}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Transliteration
            variant={"standard"}
            _key={"questionMr"}
            labelName={"questionMr"}
            fieldName={"questionMr"}
            updateFieldName={"questionEng"}
            sourceLang={"mar"}
            targetLang={"eng"}
            label={<FormattedLabel id="questionMr" required />}
            error={!!errors.questionMr}
            helperText={errors?.questionMr ? errors.questionMr.message : null}
          />
        </Grid>
      </Grid>
      <Grid
        container
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* NEWLY ADDED BY ANSARI */}
        <Grid
          item
          xs={12}
          sm={funcForConditions() ? 12 : 4}
          md={funcForConditions() ? 12 : 4}
          lg={funcForConditions() ? 12 : 4}
          xl={funcForConditions() ? 12 : 4}
          sx={{
            display: "flex",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: 1,
            // marginBottom: "20px",
          }}
        >
          <FormControl
            variant="standard"
            sx={{ width: "250px" }}
            error={!!errors.answerType}
            size="small"
          >
            <InputLabel id="demo-simple-select-outlined-label">
              <FormattedLabel id="answerType" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="answerType" />}
                >
                  {answerTypeData &&
                    answerTypeData.map((type, index) => (
                      <MenuItem key={index} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="answerType"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.answerType ? errors.answerType.message : null}
            </FormHelperText>
          </FormControl>

          {/* FOR SELECT FIELD  */}
          {funcForConditions() && (
            <>
              {answersofQuestions?.map((item, index) => {
                return (
                  <>
                    <TextField
                      type="text"
                      id="outlined-basic"
                      label={<FormattedLabel id="answer" />}
                      variant="standard"
                      {...register(`answersofQuestions[${index}].answer`)}
                      defaultValue={item.answer}
                    />
                    <IconButton onClick={() => removeParentAnswers(index)}>
                      <DeleteIcon style={{ color: "red" }} />
                    </IconButton>
                    {/* <Button size="small" color="error">
                    </Button> */}
                  </>
                );
              })}

              {watch("answerType") == "Radio" &&
              answersofQuestions?.length >= 2 ? (
                <IconButton
                  disabled
                  onClick={() =>
                    appendParentAnswers({
                      answer: "",
                    })
                  }
                >
                  <AddBoxIcon />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() =>
                    appendParentAnswers({
                      answer: "",
                    })
                  }
                >
                  <AddBoxIcon style={{ color: "#556CD6" }} />
                </IconButton>
              )}
            </>
          )}
        </Grid>

        {/* NEWLY ADDED BY ANSARI */}

        <Grid xs={12} sm={4} md={4} lg={4} xl={4} item>
          <FormControl
            variant="standard"
            sx={{ width: "250px" }}
            error={!!errors.serviceId}
            size="small"
          >
            <InputLabel id="demo-simple-select-outlined-label">
              <FormattedLabel id="serviceName" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="serviceName" />}
                >
                  {services &&
                    services.map((service, index) => (
                      <MenuItem key={index} value={service.id}>
                        {service.service}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="serviceId"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.serviceId ? errors.serviceId.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid xs={12} sm={4} md={4} lg={4} xl={4} item>
          <FormControl
            variant="standard"
            sx={{ width: "250px" }}
            error={!!errors.checkListType}
            size="small"
          >
            <InputLabel id="demo-simple-select-outlined-label">
              <FormattedLabel id="checkListType" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="checkListType" />}
                >
                  {checkListTypeData &&
                    checkListTypeData.map((type, index) => (
                      <MenuItem key={index} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="checklistType"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.checkListType ? errors.checkListType.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
  // RENDERDERING FORMS //

  useEffect(() => {
    getServiceMaster();
  }, []);

  useEffect(() => {
    getQuestionMaster();
  }, [applications, services]);

  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);

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

  const getServiceMaster = () => {
    axios
      .get(
        `${urls.BaseURL}/service/getAllServiceByApplication?applicationId=3`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        setServices(
          r.data.service.map((row) => ({
            id: row.id,
            service: row.serviceName,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Table - Data
  const getQuestionMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc",
  ) => {
    axios
      .get(`${urls.TPURL}/master/siteVisitQuestions/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let result = res?.data?.siteVisitQuestionsDaoList;
        console.log("ssssssss", result);
        let _res = result.map((r, i) => {
          return {
            id: r.id,
            srNo: i + 1,
            questionEng: r.questionEng,
            questionMr: r.questionMr,
            // questionType: r.questionType,
            answerType: r.answerType,
            checklistType: r.checklistType,
            serviceId: r.serviceId,
            serviceName: services.find((obj) => obj?.id === r.serviceId)
              ?.service,
            // application: r.application,
            activeFlag: r.activeFlag,
            // //////////////////////////
            answersofQuestions: r.answersofQuestions,
            subQuestions: r.subQuestions,
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const editRecord = (rows) => {
    console.log("Edit cha data:", rows);
    setBtnSaveText("Update"),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true);
    reset(rows);
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/question/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });

                getQuestionMaster();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/question/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });

                getQuestionMaster();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
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
    setEditButtonInputState(false);
    setDeleteButtonState(false);
    setAnswersofQuestionsInRow(null);
    setEditMode(false);
    // removeParentAnswers(answersofQuestions)
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    questionEng: "",
    questionMr: "",
    // questionType: "",
    answerType: "",
    application: null,
    serviceId: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    questionEng: "",
    questionMr: "",
    // questionType: "",
    answerType: "",
    application: null,
    serviceId: null,
    id: null,
  };

  useEffect(() => {
    if (answersofQuestionsInRow) {
      setValue("answersofQuestions", answersofQuestionsInRow);
    }
  }, [answersofQuestionsInRow]);

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "questionEng",
      headerName: <FormattedLabel id="questionEn" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "questionMr",
      headerName: <FormattedLabel id="questionMr" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "answerType",
      headerName: <FormattedLabel id="answerType" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "serviceName",
      headerName: <FormattedLabel id="serviceName" />,
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.4,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.activeFlag == "Y" ? (
              <IconButton
                disabled={editButtonInputState}
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setSlideChecked(true);
                  setButtonInputState(true);
                  console.log(":a90", params.row);
                  reset(params.row);
                  setAnswersofQuestionsInRow(params?.row?.answersofQuestions);
                  setEditMode(true);
                }}
              >
                <Tooltip title="Edit">
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              </IconButton>
            ) : (
              <Tooltip sx={{ margin: "8px" }}>
                <EditIcon style={{ color: "gray" }} disabled={true} />
              </Tooltip>
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
                setButtonInputState(true);
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
        );
      },
    },
  ];

  // OnSubmit Form
  const onSubmitForm = (data) => {
    let payloadBody = {
      ...data,
      serviceId: +data?.serviceId,
      answersofQuestions: data?.answersofQuestions?.map((answerObj) => ({
        answer: answerObj?.answer,
      })),
      subQuestions: data?.subQuestions?.map((subQuestion) => ({
        ...subQuestion,
        id: null,
        answersofSubQuestions: subQuestion?.answersofSubQuestions?.map(
          (answerObj) => ({ answer: answerObj?.answer }),
        ),
      })),
    };
    console.log(":A1", payloadBody);
    axios
      .post(`${urls.TPURL}/master/siteVisitQuestions/save`, payloadBody, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "questionEng") {
                setError("questionEng", { message: x.code });
              } else if (x.field == "questionMr") {
                setError("questionMr", { message: x.code });
              }
            });
          } else {
            data.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success",
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getQuestionMaster();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setAnswersofQuestionsInRow(null);
            setEditMode(false);
          }
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // View
  return (
    <Paper elevation={2} style={{ margin: "3%px", padding: "2%" }}>
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
          <FormattedLabel id="questionMaster" />
        </h2>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <Grid>
                {/* PARENT QUESTIONS FORM */}
                {/* {parentQuestions} */}
                {/* PARENT QUESTIONS FORM */}
                {/* <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <Box
                    sx={{
                      background: "#556cd6",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "30%",
                      height: "auto",
                      overflow: "auto",
                      padding: "0.1%",
                      color: "white",
                      fontSize: 15,
                      fontWeight: 350,
                      borderRadius: 100,
                      letterSpacing: "2px",
                    }}
                  >
                    <strong>
                      <FormattedLabel id="subQuestions" />
                    </strong>
                  </Box>
                </Grid> */}
                {/* CHILD QUESTIONS FORM */}
                {/* <ChildQuestions
                  errors={errors}
                  control={control}
                  answerTypeData={answerTypeData}
                  services={services}
                  checkListTypeData={checkListTypeData}
                  watch={watch}
                  register={register}
                  reset={reset}
                  editMode={editMode}
                /> */}
                {/* CHILD QUESTIONS FORM */}

                <Grid
                  container
                  sx={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    // gap: 5,
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={5.5}
                    md={5.5}
                    lg={5.5}
                    xl={5.5}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Transliteration
                      variant={"standard"}
                      _key={"questionEng"}
                      labelName={"questionEng"}
                      fieldName={"questionEng"}
                      updateFieldName={"questionMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="questionEn" required />}
                      error={!!errors.questionEng}
                      helperText={
                        errors?.questionEng ? errors.questionEng.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={5.5}
                    md={5.5}
                    lg={5.5}
                    xl={5.5}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Transliteration
                      variant={"standard"}
                      _key={"questionMr"}
                      labelName={"questionMr"}
                      fieldName={"questionMr"}
                      updateFieldName={"questionEng"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      label={<FormattedLabel id="questionMr" required />}
                      error={!!errors.questionMr}
                      helperText={
                        errors?.questionMr ? errors.questionMr.message : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {/* NEWLY ADDED BY ANSARI */}
                  <Grid
                    item
                    xs={12}
                    sm={funcForConditions() ? 12 : 4}
                    md={funcForConditions() ? 12 : 4}
                    lg={funcForConditions() ? 12 : 4}
                    xl={funcForConditions() ? 12 : 4}
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      flexWrap: "wrap",
                      gap: 1,
                      // marginBottom: "20px",
                    }}
                  >
                    <FormControl
                      variant="standard"
                      sx={{ width: "250px" }}
                      error={!!errors.answerType}
                      size="small"
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="answerType" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="answerType" />}
                          >
                            {answerTypeData &&
                              answerTypeData.map((type, index) => (
                                <MenuItem key={index} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="answerType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.answerType ? errors.answerType.message : null}
                      </FormHelperText>
                    </FormControl>

                    {/* FOR SELECT FIELD  */}
                    {funcForConditions() && (
                      <>
                        {answersofQuestions?.map((item, index) => {
                          return (
                            <>
                              <TextField
                                type="text"
                                id="outlined-basic"
                                label={<FormattedLabel id="answer" />}
                                variant="standard"
                                {...register(
                                  `answersofQuestions[${index}].answer`,
                                )}
                                defaultValue={item.answer}
                              />
                              <IconButton
                                onClick={() => removeParentAnswers(index)}
                              >
                                <DeleteIcon style={{ color: "red" }} />
                              </IconButton>
                              {/* <Button size="small" color="error">
                    </Button> */}
                            </>
                          );
                        })}

                        {watch("answerType") == "Radio" &&
                        answersofQuestions?.length >= 2 ? (
                          <IconButton
                            disabled
                            onClick={() =>
                              appendParentAnswers({
                                answer: "",
                              })
                            }
                          >
                            <AddBoxIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() =>
                              appendParentAnswers({
                                answer: "",
                              })
                            }
                          >
                            <AddBoxIcon style={{ color: "#556CD6" }} />
                          </IconButton>
                        )}
                      </>
                    )}
                  </Grid>

                  {/* NEWLY ADDED BY ANSARI */}

                  <Grid xs={12} sm={4} md={4} lg={4} xl={4} item>
                    <FormControl
                      variant="standard"
                      sx={{ width: "250px" }}
                      error={!!errors.serviceId}
                      size="small"
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="serviceName" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="serviceName" />}
                          >
                            {services &&
                              services.map((service, index) => (
                                <MenuItem key={index} value={service.id}>
                                  {service.service}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="serviceId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.serviceId ? errors.serviceId.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid xs={12} sm={4} md={4} lg={4} xl={4} item>
                    <FormControl
                      variant="standard"
                      sx={{ width: "250px" }}
                      error={!!errors.checkListType}
                      size="small"
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="checkListType" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="checkListType" />}
                          >
                            {checkListTypeData &&
                              checkListTypeData.map((type, index) => (
                                <MenuItem key={index} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="checklistType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.checkListType
                          ? errors.checkListType.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid
                  container
                  className={styles.feildres}
                  sx={{ padding: "10px" }}
                >
                  <Grid
                    item
                    xs={4}
                    sx={{ display: "flex", justifyContent: "end" }}
                  >
                    <Button
                      size="medium"
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      <FormattedLabel
                        id={btnSaveText == "Save" ? "save" : "update"}
                      />
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      size="medium"
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      color="error"
                      size="medium"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Slide>
          )}
        </form>
      </FormProvider>

      <Grid
        container
        sx={{
          padding: "25px",
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          size="large"
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
          }}
          sx={{ fontWeight: "bold" }}
        >
          <FormattedLabel id="add" />
        </Button>
      </Grid>

      <Box style={{ overflowX: "scroll", display: "flex" }}>
        <DataGrid
          sx={{
            backgroundColor: "white",
            // overflowY: "scroll",

            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },

            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          getRowId={(row) => row.srNo}
          density="compact"
          autoHeight={true}
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
            getQuestionMaster(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            // updateData("page", 1);
            getQuestionMaster(_data, data.page);
          }}
        />
      </Box>
    </Paper>
  );
};

export default Index;

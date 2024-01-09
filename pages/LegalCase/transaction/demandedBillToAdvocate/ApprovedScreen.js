import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const ApprovedScreen = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [advocateNames, setAdvocateNames] = useState([]);
  const [caseMainTypes, setCaseMainTypes] = useState([]);
  const [caseSubTypes, setcaseSubTypes] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [slideChecked, setSlideChecked] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [newData, setNewData] = useState();
  const [caseNo, setCaseNo] = useState();
  const [caseType, setCasType] = useState();
  const [caseSubType, setCasSubType] = useState();
  const [payment, setPayment] = useState();
  const [paidAmount, setPaidAmount] = useState();
  const [billAmount, setBillAmount] = useState();
  const [pendingAmount, setPendingAmount] = useState();
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

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

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 1 },
    // { field: "courtNo", headerName: "Court No", flex: 1 },
    {
      field: "caseNo",

      headerName: <FormattedLabel id="courtCaseNo" />,
      flex: 1,
    },

    {
      field: "caseType",
      // field: language === "en" ? "caseMainTypeEn" : "caseMainTypeMr",

      headerName: <FormattedLabel id="caseType" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "caseSubType",
      // field: language === "en" ? "subType" : "caseSubTypeMr",

      headerName: <FormattedLabel id="caseSubType" />,
      flex: 1,
    },
    {
      field: "billAmount",

      headerName: <FormattedLabel id="billAmount" />,
      flex: 1,
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              // disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                // console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton>
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  // onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  // onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const exitButton = () => {
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
  };

  const user = useSelector((state) => state.user.user.userDao);

  // useEffect(() => {
  //   getAdvocateName();
  // }, [courtNames]);

  useEffect(() => {
    getcaseMainTypes();
    getcaseNumber();

    getCaseSubTypes();
  }, []);

  // get Case Type

  const getcaseMainTypes = () => {
    axios
      .get(`${urls.LCMSURL}/master/caseMainType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCaseMainTypes(
          res.data.caseMainType.map((r, i) => ({
            id: r.id,
            // caseMainType: r.caseMainType,
            caseMainType: r.caseMainType,
            caseMainTypeMr: r.caseMainTypeMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Case Sub Type

  const getCaseSubTypes = () => {
    axios
      .get(`${urls.LCMSURL}/master/caseSubType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setcaseSubTypes(
          res.data.caseSubType.map((r, i) => ({
            id: r.id,
            // caseMainType: r.caseMainType,
            subType: r.subType,
            caseSubTypeMr: r.caseSubTypeMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // getAdvocateName
  const getAdvocateName = () => {
    axios
      .get(`${urls.LCMSURL}/master/advocate/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAdvocateNames(
          res.data.advocate.map((r, i) => ({
            id: r.id,
            advocateName: r.firstName + " " + r.middleName + " " + r.lastName,

            advocateNameMr:
              r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Departments Namede
  const [departmentNames, setDepartmentNames] = useState([]);

  const getDepartmentName = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartmentNames(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            department: r.departmentMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Court Name

  const [courtNames, setCourtNames] = useState([]);
  const getCourtName = () => {
    axios
      .get(`${urls.LCMSURL}/master/court/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCourtNames(
          res.data.court.map((r, i) => ({
            id: r.id,
            courtName: r.courtName,
            courtMr: r.courtMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Court Case No
  const [caseNumbers, setCaseNumbers] = useState([]);
  const getcaseNumber = () => {
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCaseNumbers(
          res.data.newCourtCaseEntry.map((r, i) => ({
            id: r.id,
            caseNumber: r.caseNumber,
            // courtMr: r.courtMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };
  const [courtCaseEntries, setCourtCaseEntries] = useState([]);
  const [selectedCaseEntry, setSelectedCaseEntry] = useState([]);

  const handleChange = (val) => {
    let selCourtCaseEntries = courtCaseEntries.find((c) => c.id === val);
    setSelectedCaseEntry(selCourtCaseEntries);
    setValue("caseMainType", selCourtCaseEntries.caseMainType);
    setValue("caseSubType", selCourtCaseEntries.subType);
    setValue("payment", selCourtCaseEntries.fixAmount);
    setValue("paidAmount", selCourtCaseEntries.paidAmount);
    // setValue("billAmount",selCourtCaseEntries.billAmount)
  };

  const onSubmitForm = () => {
    // console.log(
    //   "Data",
    //   payment,
    //   caseNo,
    //   caseType,
    //   caseSubType,
    //   paidAmount,
    //   billAmount,
    //   pendingAmount,
    // );

    setDataSource({
      caseNo: caseNo,
      caseType: caseType,
      caseSubType: caseSubType,
      payment: payment,
      paidAmount: paidAmount,
      billAmount: billAmount,
      pendingAmount: pendingAmount,
    });
  };

  useEffect(() => {
    if (user) {
      axios
        .get(
          `${urls.LCMSURL}/transaction/newCourtCaseEntry/getCourtCaseEntryByAdvocateId?advocateId=${user.advocateId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setCourtCaseEntries(res.data.newCourtCaseEntry);
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          style={{
            display: "flex",
            paddingTop: "10px",
            marginTop: "20px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <Typography
            style={{
              display: "flex",
              marginLeft: "100px",
              color: "white",
            }}
          >
            <h2>
              <FormattedLabel id="approvalScreen" />
            </h2>
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmitForm)}>
          {/* {isOpenCollapse && ( */}
          {/* <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              > */}
          <Grid container style={{ marginLeft: 70, padding: "10px" }}>
            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <FormControl
                sx={{ width: "55%" }}
                size="small"
                variant="standard"
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="courtCaseNo" />
                </InputLabel>

                {/* <Controller
                        render={({ field }) => ( */}
                <Select
                  disabled={router?.query?.pageMode === "View"}
                  // value={field.value}
                  onChange={(e) => setCaseNo(e.target.value)}
                  label={<FormattedLabel id="courtCaseNo" />}
                >
                  {caseNumbers &&
                    caseNumbers.map((caseNumber, index) => (
                      <MenuItem key={index} value={caseNumber.id}>
                        {caseNumber?.caseNumber}
                      </MenuItem>
                    ))}
                </Select>
                {/* )} */}
                {/* // name="caseNo"
                        control={control}
                        defaultValue=""
                      /> */}
              </FormControl>
            </Grid>

            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 120 }}
                error={!!errors.caseMainType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="caseType" />}
                </InputLabel>
                {/* <Controller
                        render={({ field }) => ( */}
                <Select
                  sx={{ width: 250 }}
                  // value={field.value}
                  // onChange={(value) => field.onChange(value)}
                  onChange={(e) => setCasType(e.target.value)}
                  label={<FormattedLabel id="caseType" />}
                >
                  {caseMainTypes &&
                    caseMainTypes.map((caseMainType, index) => (
                      <MenuItem
                        key={index}
                        // @ts-ignore
                        value={caseMainType.id}
                      >
                        {/* {title.title} */}
                        {language == "en"
                          ? caseMainType?.caseMainType
                          : caseMainType?.caseMainTypeMr}
                      </MenuItem>
                    ))}
                </Select>
                {/* )} */}
                {/* // name="caseMainType"
                        control={control}
                        defaultValue=""
                      /> */}
                <FormHelperText>
                  {errors?.caseMainType ? errors.caseMainType.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Case Sub Type */}

            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 120 }}
                error={!!errors.caseMainType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="caseSubType" />}
                </InputLabel>
                {/* <Controller
                        render={({ field }) => ( */}
                <Select
                  sx={{ width: 250 }}
                  // value={field.value}
                  // onChange={(value) => field.onChange(value)}
                  onChange={(e) => setCasSubType(e.target.value)}
                  label={<FormattedLabel id="caseSubType" />}
                >
                  {caseSubTypes &&
                    caseSubTypes.map((subType, index) => (
                      <MenuItem
                        key={index}
                        // @ts-ignore
                        value={subType.id}
                      >
                        {/* {title.title} */}
                        {language == "en"
                          ? subType?.subType
                          : subType?.caseSubTypeMr}
                      </MenuItem>
                    ))}
                </Select>
                {/* )} */}
                {/* // name="caseSubType"
                        control={control}
                        defaultValue=""
                      /> */}
                {/* <FormHelperText>
                                {errors?.caseMainType
                                  ? errors.caseMainType.message
                                  : null}
                              </FormHelperText> */}
              </FormControl>
            </Grid>

            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                //// required
                disabled={router?.query?.pageMode === "View"}
                id="standard-basic"
                label={<FormattedLabel id="caseFees" />}
                variant="standard"
                // {...register("payment")}
                value={payment}
                onChange={(e) => setPayment(e.target.value)}

                // InputLabelProps={{
                //   shrink: //true
                //     (watch("firstName") ? true : false) ||
                //     (router.query.firstName ? true : false),
                // }}
                // value={this.state.value}
                // onChange={this.setPayment}
              />
            </Grid>

            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                //// required
                disabled={router?.query?.pageMode === "View"}
                id="standard-basic"
                label={<FormattedLabel id="paidFees" />}
                variant="standard"
                // {...register("paidAmount")}
                // InputLabelProps={{
                //   shrink: //true
                //     (watch("firstName") ? true : false) ||
                //     (router.query.firstName ? true : false),
                // }}
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
              />
            </Grid>

            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                //// required
                disabled={router?.query?.pageMode === "View"}
                id="standard-basic"
                label={<FormattedLabel id="feesAmount" />}
                variant="standard"
                // {...register("billAmount")}
                // InputLabelProps={{
                //   shrink: //true
                //     (watch("title") ? true : false) ||
                //     (router.query.title ? true : false),
                // }}
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
              />
            </Grid>

            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                //// required
                disabled={router?.query?.pageMode === "View"}
                id="standard-basic"
                // label="Pending Amount"
                label={<FormattedLabel id="pendingFees" />}
                variant="standard"
                // {...register("pendingAmount")}
                // InputLabelProps={{
                //   shrink: //true
                //     (watch("title") ? true : false) ||
                //     (router.query.title ? true : false),
                // }}
                value={pendingAmount}
                onChange={(e) => setPendingAmount(e.target.value)}
              />
            </Grid>

            {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}></Grid> */}

            {/* Approval Bill Amount */}

            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                //// required
                disabled={router?.query?.pageMode === "View"}
                id="standard-basic"
                // label="Approval Bill Amount"
                label={<FormattedLabel id="approvalFeesAmount" />}
                variant="standard"
                // {...register("pendingAmount")}
                // InputLabelProps={{
                //   shrink: //true
                //     (watch("title") ? true : false) ||
                //     (router.query.title ? true : false),
                // }}
                value={pendingAmount}
                onChange={(e) => setPendingAmount(e.target.value)}
              />
            </Grid>

            {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <Button
                      // sx={{ marginRight: 8 }}
                      // type="submit"
                      onClick={(e) => {
                        onSubmitForm(e);
                      }}
                      variant="contained"
                      color="primary"
                      endIcon={<SaveIcon />}
                    >
                      Save
                    </Button>
                  </Grid>
  
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      Exit
                    </Button>
                  </Grid> */}
          </Grid>

          {/* For button */}
          {/* </Slide> */}
          {/* )} */}
        </form>
      </ThemeProvider>

      {/* <Button
          variant="contained"
          endIcon={<AddIcon />}
          // type='primary'
          disabled={buttonInputState}
          onClick={() => {
            setButtonInputState(true);
            setSlideChecked(true);
            setIsOpenCollapse(!isOpenCollapse);
          }}
        >
          <FormattedLabel id="add" />
        </Button> */}

      {console.log("dataSource", dataSource)}
    </>
  );
};

export default ApprovedScreen;

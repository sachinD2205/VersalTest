import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import { Button, Grid, Stack, TextField, ThemeProvider } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import BuildingUseSchema from "../../../components/fireBrigadeSystem/provisionalBuildingNoc/BuildingUseSchema";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
// import { demandBillDetailsSchema } from "../../../../containers/schema/LegalCaseSchema/demandedBillToAdvocateSchema";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import theme from "../../../theme.js";
import urls from "../../../URLS/urls";
// import ApplicantDetails from "./ApplicantDetails";

const ApplicantDetail = () => {
  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(demandBillDetailsSchema),
    resolver: yupResolver(BuildingUseSchema),
  });

  // const methods = useFormContext();

  // const methods = useForm

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   setValue,
  //   getValues,
  //   watch,
  //   formState: { errors },
  // } = useFormContext();
  const router = useRouter();
  const token = useSelector((state) => state.user.user.token);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [advocateNames, setAdvocateNames] = useState([]);
  const [caseMainTypes, setCaseMainTypes] = useState([]);
  const [caseSubTypes, setcaseSubTypes] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [slideChecked, setSlideChecked] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [dataSource1, setDataSource1] = useState([]);
  const [data, setData] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [newData, setNewData] = useState();
  const [caseNo, setCaseNo] = useState();
  const [caseType, setCasType] = useState();
  const [caseSubType, setCasSubType] = useState();
  const [payment, setPayment] = useState();
  const [paidFees, setPaidAmount] = useState();
  const [feesAmount, setBillAmount] = useState();
  const [pendingFees, setPendingAmount] = useState();
  const [courtCaseEntries, setCourtCaseEntries] = useState([]);
  const [selectedCaseEntry, setSelectedCaseEntry] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [courtNames, setCourtNames] = useState([]);
  const [departmentNames, setDepartmentNames] = useState([]);
  const user = useSelector((state) => state.user.user.userDao);
  const [temp, setTemp] = useState([]);
  const [caseNumbers, setCaseNumbers] = useState([]);
  const [paymentRates, setPaymentRates] = useState([]);
  const [filterDataSource, setFilterDataSource] = useState([]);
  const [caseNoCount, setCaseNoCount] = useState([0]);
  let newArray = [];

  // Exit
  const exitButton = () => {
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
  };

  /* Case Number  - Court Case Number*/
  const getcaseNumber = () => {
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
        console.log("dsdf", res.data.newCourtCaseEntry);
        setTemp(res.data.newCourtCaseEntry);
        setCaseNumbers(
          res.data.newCourtCaseEntry.map((r, i) => ({
            id: r.id,
            caseNumber: r.caseNumber,
          }))
        );
      });
  };

  /* Case Type  - Case Main Type*/
  const getcaseMainTypes = () => {
    axios.get(`${urls.LCMSURL}/master/caseMainType/getAll`).then((res) => {
      console.log("dsdf34", res.data.caseMainType);
      setCaseMainTypes(
        res.data.caseMainType.map((r, i) => ({
          id: r.id,
          caseMainType: r.caseMainType,
          caseMainTypeMr: r.caseMainTypeMr,
        }))
      );
    });
  };

  /* Case Sub Type */
  const getCaseSubTypes = () => {
    axios.get(`${urls.LCMSURL}/master/caseSubType/getAll`).then((res) => {
      setcaseSubTypes(
        res.data.caseSubType.map((r, i) => ({
          id: r.id,
          // caseMainType: r.caseMainType,
          subType: r.subType,
          caseSubTypeMr: r.caseSubTypeMr,
        }))
      );
    });
  };

  /** Payment Rate Master */
  const getPaymentRateMaster = () => {
    axios.get(`${urls.LCMSURL}/master/paymentRate/getAll`).then((res) => {
      setPaymentRates(res.data.paymentRate);
    });
  };

  /* Based on casenumber set casemaintype and casesubtype*/
  useEffect(() => {
    // alert("dfkd");
    temp.find((data) => {
      if (data?.id == watch("caseNumber")) {
        setValue("caseMainType", data?.caseMainType);

        console.log("data?.caseMainType", data?.caseMainType);

        setValue(
          "caseMainTypeMar",
          caseMainTypes.find((filterData) => {
            return filterData?.id == data?.caseMainType;
          })?.caseMainTypeMr
        );

        setValue(
          "caseMainTypeEng",
          caseMainTypes.find((filterData) => {
            console.log("212", filterData);
            return filterData?.id == data?.caseMainType;
          })?.caseMainType
        );

        setValue(
          "caseSubTypeMar",
          caseSubTypes.find((filterData) => {
            console.log("filterData", filterData);
            return filterData?.id == data?.subType;
          })?.caseSubTypeMr
        );

        setValue(
          "caseSubTypeEng",
          caseSubTypes.find((filterData) => {
            return filterData?.id == data?.subType;
          })?.subType
        );

        setValue("caseSubType", data?.subType);
        setValue("paidFees", "0");

        return;
      }
    });
  }, [watch("caseNumber")]);

  /* Case Fees --> Based On CaseMainType and CaseSubType set Case Fees */
  useEffect(() => {
    console.log("5454", watch("caseSubType"), watch("caseMainType"));

    paymentRates?.find((data) => {
      if (
        data?.caseType == watch("caseMainType") &&
        data?.caseSubType == watch("caseSubType")
      ) {
        setValue("caseFees", data.rate);
        return;
      } else {
        setValue("caseFees", "0");
      }
    });
  }, [watch("caseMainType"), watch("caseSubType")]);

  /** Pending Fees ---> Calculate based on caseFees - PaidFees  */
  useEffect(() => {
    console.log(
      "pending Amount",
      watch("caseFees"),
      watch("paidFees"),
      watch("feesAmount")
    );

    let pendingFees =
      watch("caseFees") - watch("paidFees") - watch("feesAmount");

    if (pendingFees != null || pendingFees != undefined || pendingFees != NaN) {
      console.log("34534543534", pendingFees);
      // alert("dsf");
      setValue("pendingFees", pendingFees);
    } else if (pendingFees == "0") {
      console.log("000000039324", pendingFees);
      setValue("pendingFees", "0");
    } else {
      setValue("pendingFees", "0");
    }
  }, [watch("caseFees"), watch("paidFees"), watch("feesAmount")]);

  useEffect(() => {
    getcaseNumber();
    getcaseMainTypes();
    getCaseSubTypes();
    getPaymentRateMaster();
  }, []);

  useEffect(() => {
    console.log("ale ka errors", errors);
  }, [errors]);

  const columns = [
    {
      field: "srNo",
      id: 1,
      headerName: <FormattedLabel id="srNo" />,
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    {
      field: "ownerName",
      headerName: "Owner Name",
      flex: 1,
      id: 2,
    },
    {
      field: "emailId",
      headerName: "Email ID",
      flex: 1,
      id: 2,
    },
    {
      field: "firmName",
      headerName: "Firm Name",
      flex: 1,
      id: 2,
    },
    {
      field: "mobileNo",
      headerName: "Mobile No.",
      flex: 1,
      id: 2,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      id: 2,
    },
    // {
    //   field: language == "en" ? "caseMainTypeEng" : "caseMainTypeMar",
    //   id: 3,
    //   headerName: <FormattedLabel id="caseType" />,
    //   //type: "number",
    //   flex: 1,
    // },

    // {
    //   field: language === "en" ? "caseSubTypeEng" : "caseSubTypeMar",
    //   id: 4,
    //   headerName: <FormattedLabel id="caseSubType" />,
    //   flex: 1,
    // },
    // {
    //   field: "caseFees",
    //   id: 5,
    //   headerName: "Case Fees",
    //   flex: 1,
    //   // field: language === "en" ? "subType" : "caseSubTypeMr",
    // },
    // {
    //   field: "feesAmount",
    //   id: 5,
    //   headerName: <FormattedLabel id="feesAmount" />,
    //   flex: 1,
    // },

    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 120,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Box>
    //         <IconButton
    //           // disabled={editButtonInputState}
    //           onClick={() => {
    //             setBtnSaveText("Update"),
    //               setID(params.row.id),
    //               // setIsOpenCollapse(true),
    //               // setSlideChecked(true);
    //               // setButtonInputState(true);
    //               console.log("params.row: ", params.row);
    //             reset(params.row);
    //           }}
    //         >
    //           <EditIcon style={{ color: "#556CD6" }} />
    //         </IconButton>

    //         <IconButton>
    //           {params.row.activeFlag == "Y" ? (
    //             <ToggleOnIcon
    //               style={{ color: "green", fontSize: 30 }}
    //               // onClick={() => deleteById(params.id, "N")}
    //             />
    //           ) : (
    //             <ToggleOffIcon
    //               style={{ color: "red", fontSize: 30 }}
    //               // onClick={() => deleteById(params.id, "Y")}
    //             />
    //           )}
    //         </IconButton>
    //       </Box>
    //     );
    //   },
    // },
  ];

  // Submit
  const onSubmitForm = () => {
    console.log(
      "as kas chalel bhavdya",
      moment(getValues("paymentDate")).format("YYYY-MM-DD")
    );

    // if (errors == {}) {
    //   alert("jinkalas na bhava");
    // }
    // alert("jinkalas na bhava");

    const caseNumber = getValues("caseNumber");
    const caseMainType = getValues("caseMainType");
    const caseMainTypeMar = getValues("caseMainTypeMar");
    const caseMainTypeEng = getValues("caseMainTypeEng");
    const caseSubType = getValues("caseSubType");
    const caseSubTypeEng = getValues("caseSubTypeEng");
    const caseSubTypeMar = getValues("caseSubTypeMar");
    const caseFees = getValues("caseFees");
    const paidFees = getValues("paidFees");
    const feesAmount = getValues("feesAmount");
    const pendingFees = getValues("pendingFees");
    const paymentDate = moment(getValues("paymentDate")).format("YYYY-MM-DD");

    if (
      (caseNumber != "" || caseNumber != null) &&
      (caseMainType != "" || caseMainType != null)
    ) {
      //   alert("ghavala re bhava ");
      console.log("data");
    }

    let data = {
      caseNumber: caseNumber,
      caseMainType: caseMainType,
      caseMainTypeMar: caseMainTypeMar,
      caseMainTypeEng: caseMainTypeEng,
      caseSubType: caseSubType,
      caseSubTypeEng: caseSubTypeEng,
      caseSubTypeMar: caseSubTypeMar,
      caseFees: caseFees,
      paidFees: paidFees,
      feesAmount: feesAmount,
      pendingFees: pendingFees,
      paymentDate: paymentDate,
    };

    // if (dataSource1.length == 0) {
    //   let data1 = JSON.parse(localStorage.getItem("billDetail"));
    //   setDataSource1([data]);
    // } else if (
    //   dataSource1.length == 0 ||
    //   localStorage.getItem("billDetails") !== null
    // )
    // {
    //   let data1 = JSON.parse(localStorage.getItem("billDetail"));
    //   setDataSource1([data, data1]);
    // }

    console.log("data123", dataSource1, localStorage.getItem("billDetail"));
    if (
      dataSource1.length == 0 ||
      localStorage.getItem("billDetail") !== null
    ) {
      // let data1 = JSON.parse(localStorage.getItem("billDetail"));
      setDataSource1([...dataSource, data]);
    } else {
      setDataSource1([...dataSource1, data]);
    }

    if (caseNoCount.length != 0) {
      setCaseNoCount([...caseNoCount, caseNumber]);
    } else {
      setCaseNoCount([caseNumber]);
    }

    setValue("caseNumber");
    setValue("caseMainType");
    setValue("caseMainTypeMr");
    setValue("caseMainTypeEng");
    setValue("caseSubType");
    setValue("caseSubTypeMar");
    setValue("caseSubTypeEng");
    setValue("caseFees");
    setValue("paidFees");
    setValue("feesAmount");
    setValue("pendingFees");
    setValue("paymentDate", moment.now());
  };

  useEffect(() => {
    console.log("caseNoCount", caseNoCount);
  }, [caseNoCount]);

  // useEffect - Testin
  useEffect(() => {
    console.log("dataSource **", dataSource1);
    if (dataSource1.length == 0) {
      // console.log("alert");
      setDataSource([]);
    } else {
      setDataSource(
        dataSource1?.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
          };
        })
      );
    }
  }, [dataSource1]);

  useEffect(() => {
    if (dataSource.length !== 0) {
      localStorage.setItem("billDetail", JSON.stringify(dataSource));
    }
  }, [dataSource]);

  useEffect(() => {
    if (localStorage.getItem("billDetail") !== null) {
      console.log("jsonparse", localStorage.getItem("billDetail"));
      setDataSource(JSON.parse(localStorage.getItem("billDetail")));
    }
  }, []);

  useEffect(() => {
    console.log("formState", errors);
  }, [errors]);

  // View
  return (
    <>
      <ThemeProvider theme={theme}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid container style={{ marginLeft: 70, padding: "10px" }}>
              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
              >
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="firmName" />}
                    variant="standard"
                    // key={groupDetails.id}
                    {...register("firmName")}
                    error={!!errors.firmName}
                    helperText={
                      errors?.firmName ? errors.firmName.message : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    id="standard-basic"
                    // label={<FormattedLabel id="ownerName" />}
                    label="Owner First Name"
                    variant="standard"
                    {...register("ownerName")}
                    error={!!errors.ownerName}
                    helperText={
                      errors?.ownerName ? errors.ownerName.message : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    id="standard-basic"
                    // label={<FormattedLabel id="ownerMiddleName" />}
                    label="Owner Middle Name"
                    variant="standard"
                    {...register("ownerMiddleName")}
                    error={!!errors.ownerMiddleName}
                    helperText={
                      errors?.ownerMiddleName
                        ? errors.ownerMiddleName.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    id="standard-basic"
                    // label={<FormattedLabel id="ownerLastName" />}
                    label="Owner Last Name"
                    variant="standard"
                    {...register("ownerLastName")}
                    error={!!errors.ownerLastName}
                    helperText={
                      errors?.ownerLastName
                        ? errors.ownerLastName.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    id="standard-basic"
                    // label={<FormattedLabel id="ownerNameMr" />}
                    label="Owner First Name (In Marathi)"
                    variant="standard"
                    {...register("ownerNameMr")}
                    error={!!errors.ownerNameMr}
                    helperText={
                      errors?.ownerNameMr ? errors.ownerNameMr.message : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    id="standard-basic"
                    // label={<FormattedLabel id="ownerMiddleNameMr" />}
                    label="Owner Middle Name (In Marathi)"
                    variant="standard"
                    {...register("ownerMiddleNameMr")}
                    error={!!errors.ownerMiddleNameMr}
                    helperText={
                      errors?.ownerMiddleNameMr
                        ? errors.ownerMiddleNameMr.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    id="standard-basic"
                    // label={<FormattedLabel id="ownerLastNameMr" />}
                    label="Owner Last Name (In Marathi)"
                    variant="standard"
                    {...register("ownerLastNameMr")}
                    error={!!errors.ownerLastNameMr}
                    helperText={
                      errors?.ownerLastNameMr
                        ? errors.ownerLastNameMr.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="mobileNo" />}
                    variant="standard"
                    {...register("mobileNo")}
                    // type="number"
                    error={!!errors.mobileNo}
                    helperText={
                      errors?.mobileNo ? errors.mobileNo.message : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="emailId" />}
                    variant="standard"
                    {...register("emailId")}
                    error={!!errors.emailId}
                    helperText={errors?.emailId ? errors.emailId.message : null}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
              >
                {/* <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="workingSiteOnsitePersonMobileNo" />}
            variant="standard"
            // type="number"
            {...register("workingSiteOnsitePersonMobileNo")}
            error={!!errors.workingSiteOnsitePersonMobileNo}
            helperText={
              errors?.workingSiteOnsitePersonMobileNo
                ? errors.workingSiteOnsitePersonMobileNo.message
                : null
            }
          />
        </Grid> */}

                <Grid item xs={4} className={styles.feildres}></Grid>
                {/* <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="firmName" />}
                    variant="standard"
                    // key={groupDetails.id}
                    {...register("firmName")}
                    error={!!errors.firmName}
                    helperText={
                      errors?.firmName ? errors.firmName.message : null
                    }
                  />
                </Grid> */}
              </Grid>
            </Grid>
            {/* <Grid item xs={12} sm={12} lg={4} md={4} xl={4}>
              <Stack
                direction="row"
                style={{
                  display: "flex",
                  justifyContent: "right",
                  marginRight: "7vh",
                }}
              >
                <Button
                  endIcon={<AddIcon />}
                  // type='submit'
                  onClick={onSubmitForm}
                  // onClick={() => {
                  //   setButtonInputState(true);
                  //   setSlideChecked(true);
                  //   setIsOpenCollapse(!isOpenCollapse);
                  // }}
                >
                  Add Owner Details
                </Button>
              </Stack>
            </Grid> */}
          </form>
        </FormProvider>
      </ThemeProvider>
      {/***
      <Button
        variant='contained'
        endIcon={<AddIcon />}
        // type='primary'
        disabled={buttonInputState}
        onClick={() => {
          setButtonInputState(true);
          setSlideChecked(true);
          setIsOpenCollapse(!isOpenCollapse);
        }}
      >
        <FormattedLabel id='add' />
      </Button>
 */}
      {/* <div style={{ margin: "30px" }}>
        <DataGrid
          disableColumnFilter
          disableColumnSelector
          // disableToolbarButton
          disableDensitySelector
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              printOptions: { disableToolbarButton: true },
              // disableExport: true,
              // disableToolbarButton: true,
              csvOptions: { disableToolbarButton: true },
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
          columns={columns}
          rows={dataSource}
          pageSize={5}
          rowsPerPageOptions={[5]}
          // checkboxSelection
          getRowId={(row) => row.srNo}
        />
      </div> */}
    </>
  );
};

export default ApplicantDetail;

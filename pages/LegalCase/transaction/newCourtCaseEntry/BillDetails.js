import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, TextField } from "@mui/material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Controller, FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const BillDetails = () => {
  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(demandBillDetailsSchema),
  });
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [dataSource, setDataSource] = useState([]);
  const [dataSource1, setDataSource1] = useState([]);
  const [paymentRates, setPaymentRates] = useState([]);
  const [courtCaseEntryData, setCourtCaseEntryData] = useState([]);
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
  // columns
  const columns = [
    {
      field: "srNo",
      id: 1,
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    {
      field: "caseNumber",
      headerName: <FormattedLabel id="courtCaseNo" />,
      flex: 1,
      id: 2,
    },
    {
      field: language == "en" ? "caseMainTypeEng" : "caseMainTypeMar",
      id: 3,
      headerName: <FormattedLabel id="caseType" />,
      //type: "number",
      flex: 1,
    },

    {
      field: language === "en" ? "caseSubTypeEng" : "caseSubTypeMar",
      id: 4,
      headerName: <FormattedLabel id="caseSubType" />,
      flex: 1,
    },
    {
      field: "feesAmount" !== null ? "feesAmount" : "",
      id: 6,
      headerName: <FormattedLabel id="feesAmount" />,
      flex: 1,
    },

    // {
    //   field: "approvalAmount" !== null ? "approvalAmount" : "",
    //   id: 7,
    //   headerName: <FormattedLabel id="approvalFeesAmount" />,
    //   // hide: approvalAmountTableState,
    //   flex: 1,
    // },
    // {
    //   headerName: <FormattedLabel id="paidFees" />,
    //   field: "paidFees" !== null ? "paidFees" : "",
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
  ];

  /** Payment Rate Master */
  useEffect(() => {
    const getPaymentRateMaster = () => {
      axios
        .get(`${urls.LCMSURL}/master/paymentRate/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setPaymentRates(res.data.paymentRate);
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    };
    getPaymentRateMaster();
  }, []);

  // // useEffect - Testin
  useEffect(() => {
    if (dataSource1.length == 0) {
      setDataSource([]);
    } else {
      setDataSource(
        dataSource1?.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
            caseNumberName: r.caseNumber,
          };
        })
      );
    }
  }, [dataSource1]);

  useEffect(() => {
    if (dataSource?.length !== 0) {
      localStorage.setItem("billDetail", JSON.stringify(dataSource));
    }
  }, [dataSource]);

  useEffect(() => {
    if (localStorage.getItem("billDetail") !== "null") {
      setDataSource(JSON.parse(localStorage.getItem("billDetail")));
    }
    if (localStorage.getItem("newCourtCaseEntry") !== "null") {
      setCourtCaseEntryData(
        JSON.parse(localStorage.getItem("newCourtCaseEntry"))
      );
    }
  }, []);

  console.log("courtCaseEntryData", courtCaseEntryData);

  const [disabledButtonInputState, setDisabledButtonInputState] =
    useState(false);

  useEffect(() => {
    if (
      localStorage.getItem("disabledButtonInputState") == "true" ||
      localStorage.getItem("pageMode" == "View")
    ) {
      setDisabledButtonInputState(true);
    }
  }, []);

  useEffect(() => {
    setValue("caseMainTypeId", courtCaseEntryData?.caseMainType);
    setValue("caseSubTypeId", courtCaseEntryData?.subType);
    // caseNumber

    let pendingAmount = courtCaseEntryData?.pendingAmount;
    // caseNumber
    let caseNumber = courtCaseEntryData?.caseNumber;
    let caseFees = paymentRates?.find(
      (item) => item?.caseSubType === getValues("caseSubTypeId")
    )?.rate;
    // let A = dataSource?.find((item) => item?.caseSubType === getValues("caseSubTypeId"))?.pendingFees;
    let totalPaidFees = dataSource?.reduce(
      (total, obj) => total + obj?.paidFees,
      0
    );
    let totalPendingFees = caseFees - totalPaidFees;

    if (
      totalPendingFees == "" ||
      totalPendingFees == null ||
      totalPendingFees == undefined ||
      // totalPendingFees == NaN
      totalPendingFees == 0
    ) {
      setValue("pendingFees", 0);
    } else {
      // setValue("pendingFees", totalPendingFees);
      setValue("pendingFees", pendingAmount);
    }
    // setValue("pendingFees", totalPendingFees);
    // console.log("totalPendingFees", totalPendingFees);

    // pendingAmount
    // console.log("pendingAmount", pendingAmount);

    setValue("caseFees", caseFees);
  }, [paymentRates, courtCaseEntryData]);

  // View
  return (
    <>
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#556CD6",

          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 20,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "50px",
          marginRight: "75px",
          borderRadius: 100,
        }}
      >
        <strong style={{ display: "flex", justifyContent: "center" }}>
          <FormattedLabel id="paymentDetails" />
        </strong>
      </div>

      <Grid container style={{ marginLeft: 70, padding: "10px" }}>
        {/* case Fees */}
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <TextField
            // disabled={disabledButtonInputState}
            disabled
            label={<FormattedLabel id="caseFees" />}
            {...register("caseFees")}
            error={!!errors?.caseFees}
            helperText={errors?.caseFees ? errors?.caseFees?.message : null}
            InputLabelProps={{
              shrink: watch("caseFees") == "" || null ? false : true,
            }}
          />
        </Grid>
        {/* pending fees */}
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <TextField
            // disabled={disabledButtonInputState}
            disabled
            defaultValue={""}
            label={<FormattedLabel id="pendingFees" />}
            {...register("pendingFees")}
            error={!!errors?.pendingFees}
            helperText={
              errors?.pendingFees ? errors?.pendingFees?.message : null
            }
            InputLabelProps={{
              shrink: watch("pendingFees") == "" || null ? false : true,
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
      <div style={{ margin: "30px" }}>
        {/* <DataGrid
          getRowId={(row) => row.srNo}
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
        /> */}
      </div>
    </>
  );
};

export default BillDetails;

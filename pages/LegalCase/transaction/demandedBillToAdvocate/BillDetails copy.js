import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TableContainer,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  demandBillAdvocateDetailsSchema1,
  demandBillDetailsSchema,
  demandBillDetailsSchema1,
} from "../../../../containers/schema/LegalCaseSchema/demandedBillToAdvocateSchema";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Documents from "./Document";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const BillDetails = () => {
  /** Author - Sachin Durge */

  // const [dataValidation,setDataValidation]= useState(demandBillDetailsSchema)
  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(demandBillAdvocateDetailsSchema1),
  });

  // destructure methods form methods
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = methods;

  const [billDetailsDailog, setBillDetailsDailog] = useState(false);
  const billDetailsDailogOpen = () => setBillDetailsDailog(true);
  const billDetailsDailogClose = () => setBillDetailsDailog(false);
  const router = useRouter();
  const token = useSelector((state) => state.user.user.token);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [advocateNames, setAdvocateNames] = useState([]);
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
  const [temp, setTemp] = useState([]);
  const [caseMainTypes, setCaseMainTypes] = useState([]);
  const [billDetails, setBillDetails] = useState([]);

  const [caseSubTypes, setcaseSubTypes] = useState([]);
  const [caseNumbers, setCaseNumbers] = useState([]);
  const [paymentRates, setPaymentRates] = useState([]);
  const [filterDataSource, setFilterDataSource] = useState([]);
  const [caseNoCount, setCaseNoCount] = useState([0]);
  const [billDetailComponent, setBillDetailComponent] = useState(true);
  const [approvalAmountInputState, setApprovalAmountInputState] =
    useState(true);
  const [caseNumbers1, setCaseNumbers1] = useState([]);
  const [approvalAmountDisabledState, setApprovalAmountDisabledState] =
    useState(false);

  const [paidAmountInputState, setPaidAmountInputState] = useState(true);
  const [billDetailId, setBillDetailId] = useState();
  const [billDetailsData, setBillDetailsData] = useState([]);
  const [isApprovedbillButtonDisable, setIsApprovedbillButtonDisable] =
    useState(true);
  let newArray = [];
  // table hide buttons
  const [approvalAmountTableState, setApprovalAmountTableState] =
    useState(true);
  const [paidAmountTableState, setPaidAmountTableState] = useState(true);
  const [
    demandedBillTableActionButtonInputState,
    setDemandedBillTableActionButtonInputState,
  ] = useState(true);
  const [authority, setAuthority] = useState();
  const user = useSelector((state) => state?.user?.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
    console.log("authority", auth);
  }, []);

  // Document  Preview Dailog - ===================>
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false);
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true);
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false);
  const [docRows, setDocRows] = useState([]);

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

  // useEffect(() => {
  //   if (authority?.includes("ADMIN")) {
  //     let advData = JSON.parse(localStorage.getItem("advDetails"));
  //     axios
  //       .get(
  //         `${urls.LCMSURL}/transaction/newCourtCaseEntry/getCourtCaseEntryByAdvocateId?advocateId=${advData?.id}`,

  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         setTemp(res.data.newCourtCaseEntry);
  //         console.log("newDatadfd", res?.data?.newCourtCaseEntry);
  //         setCaseNumbers(
  //           res?.data?.newCourtCaseEntry?.map((r, i) => ({
  //             id: r.id,
  //             caseNumber: r.caseNumber,
  //           }))
  //         );
  //       });
  //   } else {
  //     getcaseNumber();
  //   }
  // }, [localStorage.getItem("advDetails" != null), authority]);

  /* Case Number  - Court Case Number*/
  const getcaseNumber = () => {
    let advId;
    if (authority?.includes("ADMIN")) {
      let advData = JSON.parse(localStorage.getItem("advDetails"));
      advId = advData?.id;
    } else {
      // alert("user.advocateId", user.advocateId);
      advId = user?.userDao?.advocateId;
    }
    if (advId !== null || advId !== undefined) {
      // alert("BillDetails");
      axios
        .get(
          `${urls.LCMSURL}/transaction/newCourtCaseEntry/getCourtCaseEntryByAdvocateId?advocateId=${advId}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setTemp(res.data.newCourtCaseEntry);
          console.log("newDatadfd", res?.data?.newCourtCaseEntry);
          setCaseNumbers(
            res?.data?.newCourtCaseEntry?.map((r, i) => ({
              id: r.id,
              caseNumber: r.caseNumber,
            }))
          );
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  };
  useEffect(() => {
    getcaseNumber();
  }, [localStorage.getItem("advDetails" !== null), authority]);

  /* Case Type  - Case Main Type*/
  const getCaseNumberAll = () => {
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log("res1234", res);
        setCaseNumbers1(
          res.data.newCourtCaseEntry.map((r, i) => ({
            id: r.id,
            caseNumber: r.caseNumber,
            // AdvocateName2: r.AdvocateName2,
            advocateName: r.advocateName,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Bill No and Bill Date
  const getBillDetails = (advocateName) => {
    axios
      .get(
        `${urls.LCMSURL}/transaction/demandedBillAndPaymentToAdvocate/getBillDetailsByAdvocateId?advId=${advocateName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("90000", res?.data);

        setBillDetails(
          res.data.demandedBillAndPaymentToAdvocate?.map((r, i) => ({
            id1: r.id,

            createDtTm: r.createDtTm,
            createDtTm: moment(r.createDtTm).format("DD-MM-YYYY"), // Format createDtTm as DD-MM-YYYY

            // formattedDate: moment(r.createDtTm).format("DD-MM-YY"),

            // createDtTm: moment(r.createDtTm).format("YYYY-MM-DD"),

            // caseMainType: r.caseMainType,
            // caseMainTypeMr: r.caseMainTypeMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getBillDetails();
  }, []);

  /* Case Type  - Case Main Type*/
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

  /* Case Sub Type */
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

  /** Payment Rate Master */
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

  /* Based on casenumber set casemaintype and casesubtype*/
  useEffect(() => {
    temp.find((data) => {
      if (data?.id == watch("caseNumber")) {
        setValue("caseMainType", data?.caseMainType);

        setValue(
          "caseMainTypeMar",
          caseMainTypes.find((filterData) => {
            return filterData?.id == data?.caseMainType;
          })?.caseMainTypeMr
        );

        setValue(
          "caseMainTypeEng",
          caseMainTypes.find((filterData) => {
            return filterData?.id == data?.caseMainType;
          })?.caseMainType
        );

        setValue(
          "caseSubTypeMar",
          caseSubTypes.find((filterData) => {
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
        // setValue("paidFees", "0");

        return;
      }
    });
  }, [watch("caseNumber")]);

  /* Case Fees --> Based On CaseMainType and CaseSubType set Case Fees */
  useEffect(() => {
    paymentRates?.find((data) => {
      if (
        data?.caseMainTypeId == watch("caseMainType") &&
        data?.caseSubType == watch("caseSubType")
      ) {
        console.log("caseType and case Main Type Match", data.rate);
        setValue("caseFees", data?.rate);
        setValue("feesAmount", 0);
      }
    });
  }, [watch("caseSubType")]);

  /** Pending Fees ---> Calculate based on caseFees - PaidFees  */
  useEffect(() => {
    let pendingFees;

    if (
      watch("caseFees") == 0 ||
      watch("caseFees") == "" ||
      watch("caseFees") == null ||
      watch("caseFees") == undefined ||
      watch("caseFees") == NaN
    ) {
      setValue("caseFees");
      console.log("feesAmount3434", watch("feesAmount"));
    } else if (
      watch("feesAmount") == 0 ||
      watch("feesAmount") == "" ||
      watch("feesAmount") == null ||
      watch("feesAmount") == undefined ||
      watch("feesAmount") == NaN
    ) {
      setValue("feesAmount");
      console.log("feesAmount", watch("feesAmount"));
      pendingFees = watch("caseFees") - watch("paidFees");
    } else {
      console.log("feesAmount123", watch("feesAmount"));
      pendingFees = watch("caseFees") - watch("paidFees") - watch("feesAmount");
    }

    /** set updated pending fees */
    if (
      pendingFees != null ||
      pendingFees != undefined ||
      pendingFees != NaN ||
      pendingFees != 0 ||
      pendingFees != ""
    ) {
      setValue("pendingFees", pendingFees);
    }
  }, [watch("caseFees"), watch("paidFees"), watch("feesAmount")]);

  useEffect(() => {
    // getcaseNumber();
    getcaseMainTypes();
    getCaseSubTypes();
    getCaseNumberAll();
    getPaymentRateMaster();

    if (localStorage.getItem("approvalAmountInputState") == "false") {
      setApprovalAmountInputState(false);
    } else {
      setApprovalAmountInputState(true);
    }

    if (localStorage.getItem("paidAmountInputState") == "false") {
      setPaidAmountInputState(false);
    } else if (localStorage.getItem("paidAmountInputState") == "true") {
      setPaidAmountInputState(true);
    } else {
      setPaidAmountInputState(true);
    }

    /** Table Action Button */
    if (
      localStorage.getItem("demandedBillTableActionButtonInputState") == "true"
    ) {
      setDemandedBillTableActionButtonInputState(true);
    } else if (
      localStorage.getItem("demandedBillTableActionButtonInputState") == "false"
    ) {
      setDemandedBillTableActionButtonInputState(false);
    } else {
      setDemandedBillTableActionButtonInputState(false);
    }

    /** Approval Amount Cols */
    if (localStorage.getItem("approvalAmountTableState") == "true") {
      setApprovalAmountTableState(true);
    } else {
      setApprovalAmountTableState(false);
    }

    /** Paid Amount Cols */
    if (localStorage.getItem("paidAmountTableState") == "true") {
      setPaidAmountTableState(true);
    } else {
      setPaidAmountTableState(false);
    }

    if (localStorage.getItem("approvalAmountDisabledState") == "true") {
      setApprovalAmountDisabledState(true);
    } else {
      setApprovalAmountDisabledState(false);
    }
  }, []);

  useEffect(() => {
    console.log("approvalAmountDisabledState", approvalAmountDisabledState);
  }, [approvalAmountDisabledState]);

  useEffect(() => {
    console.log("paidAmountInputState", paidAmountInputState);
  }, [
    approvalAmountTableState,
    paidAmountInputState,
    approvalAmountInputState,
    paidAmountTableState,
    demandedBillTableActionButtonInputState,
  ]);

  const [feesAmt, setFeesAmt] = useState();

  console.log("feesAmt", feesAmt);

  useEffect(() => {
    if (billDetailId) {
      axios
        .get(
          `${urls.LCMSURL}/transaction/billDetail/getCasesByBillNo?billNo=${billDetailId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          // setFeesAmt(res?.data?.feesAmount);
          res?.data?.billDetail?.map((r, i) => ({
            // console.log("setBillDetailsData", res?.data?.billDetail);
            // setFeesAmt(r.feesAmount)
          }));

          setFeesAmt(
            res?.data?.billDetail?.map((r, i) => ({
              amount: r.feesAmount,
            }))
          );

          setBillDetailsData(
            res?.data?.billDetail?.map((r, i) => ({
              id: r.id,
              srNo: i + 1,
              ...r,
            }))
          );
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  }, [billDetailId]);

  useEffect(() => {
    console.log("billDetailsData", billDetailsData);
  }, [billDetailsData]);

  const _docsColumns = [
    {
      field: "srNo",
      // id: 1,
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    {
      field: "originalFileName",
      // id: 1,
      headerName: "File Name",
      flex: 1,
    },
    {
      field: "attachedNameEn",
      // id: 1,
      headerName: "Uploaded By",
      flex: 1,
    },
    {
      headerName: "Action",
      width: 350,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <Box>
            <IconButton>
              <Button
                variant="contained"
                endIcon={<VisibilityIcon />}
                size="small"
                onClick={() => {
                  console.log("filepath", record.row.filePath);
                  window.open(
                    `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                    "_blank"
                  );
                }}
              >
                View Document
              </Button>
            </IconButton>
          </Box>
        );
      },
    },
  ];
  const columns = [
    {
      field: "srNo",
      // id: 1,
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    {
      // field: "id",
      field:
        authority?.includes("BILL_RAISED") || authority?.includes("ADMIN")
          ? "feesAmount"
          : "id",
      // headerName: "Bill No",
      headerName:
        authority?.includes("BILL_RAISED") || authority?.includes("ADMIN")
          ? "Fees Amount"
          : "Bill No",
      flex: 1,
      // id: 2,
    },
    {
      field: "createDtTm",
      // id: 3,
      headerName: "Bill Date",
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
      //type: "number",
      flex: 1,
    },
    {
      // field:
      hide: demandedBillTableActionButtonInputState,
      headerName: <FormattedLabel id="actions" />,
      width: 350,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton>
              <Button
                variant="contained"
                endIcon={<VisibilityIcon />}
                size="small"
                onClick={() => {
                  // reset(record.row);
                  // setValue("serviceName", record.row.serviceId);
                  console.log("_documents", params?.row?.attachments);
                  let _docs = params?.row?.attachments?.map((items, i) => {
                    return {
                      ...items,
                      srNo: i + 1,
                      id: items.id,
                    };
                  });
                  // localStorage.setItem("_attachments", JSON.stringify(_docs));
                  console.log("_docs", _docs);
                  setDocRows(_docs);
                  documentPreviewDailogOpen();
                }}
              >
                View Document
              </Button>
            </IconButton>
            {/** Action Button */}
            <IconButton>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  billDetailsDailogOpen();
                  console.log("params?.row?ldf", params?.row);
                  reset(params?.row);
                  setBillDetailId(params?.row?.id);
                  setValue("srNo", params?.row?.srNo);
                  setValue("id", params?.row?.id);

                  authority?.includes("BILL_APPROVAL")
                    ? setIsApprovedbillButtonDisable(false)
                    : setIsApprovedbillButtonDisable(
                        isApprovedbillButtonDisable
                      );
                  // localStorage.setItem(
                  //   "billDetailId",
                  //   JSON.stringify(params?.row?.id)
                  // );
                }}
              >
                Action
              </Button>
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const handleCellValueChange = (params) => {
    // const updatedData = [...billDetailsData];
    if (params?.value) {
      setIsApprovedbillButtonDisable(false);
    } else {
      setIsApprovedbillButtonDisable(true);
    }
    const rowIndex = params.id - 1;
    const rowId = params.id;
    // console.log("rowId", rowId);
    console.log("vvvvvv", rowId, params?.value);

    let updatedData;

    // updatedData for HOD approval
    if (authority?.includes("BILL_APPROVAL")) {
      updatedData = billDetailsData?.map((i) => {
        if (i?.id === rowId) {
          return {
            ...i,
            approvalAmount: params.value,
            paidFees: params.value,
          };
        } else {
          return i;
        }
      });
    } else {
      updatedData = billDetailsData?.map((i) => {
        if (i?.id === rowId) {
          return {
            ...i,
            approvalAmount: params.value,
          };
        } else {
          return i;
        }
      });
    }

    setBillDetailsData(updatedData);
    console.log("updatedDataForTest", updatedData);

    // if (updatedData[rowId]) {
    //   updatedData[rowId][params.field] = params.value;
    //   setBillDetailsData(updatedData);
    // }
  };

  useEffect(() => {
    console.log("isApprovedbillButtonDisable", isApprovedbillButtonDisable);
  }, [isApprovedbillButtonDisable]);

  const billDetailColumns = [
    {
      field: "srNo",
      // id: 1,
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.3,
    },
    {
      field: "caseNumber",
      headerName: "Court Case No",
      flex: 1,
      // id: 2,
    },
    {
      field: "caseMainType",
      // id: 3,
      headerName: "Case Type",
      //type: "number",
      flex: 1,
    },
    {
      field: "caseSubType",
      // id: 4,
      headerName: "Case Sub-Type",
      //type: "number",
      flex: 1,
    },
    {
      field: "caseFees",
      // id: 5,
      headerName: "Case Fees",
      //type: "number",
      flex: 1,
    },
    {
      field: "feesAmount",
      // id: 6,
      headerName: "Fees Amount",
      //type: "number",
      flex: 1,
    },
    {
      field: "pendingFees",
      // id: 7,
      headerName: "Pending Fees",
      //type: "number",
      flex: 1,
    },
    {
      // field: "createDtTm",
      field: "paymentDate",
      // id: 8,
      headerName: "Bill Created Date and Time",
      //type: "number",
      flex: 1,
    },
    // {
    //   field: "approvalAmount",
    //   id: 9,
    //   headerName: "Approval Amount By Clerk",
    //   flex: 1,
    //   // editable: true,
    //   editable: authority?.includes("ACCOUNTANT") ? false : true,
    //   valueGetter: (params) => params?.row?.approvalAmount,
    //   renderCell: (params) => {
    //     return (
    //       <TextField placeholder='Enter amount' value={params.value || ""} />
    //     );
    //   },
    // },
    {
      field: "approvalAmount",
      // id: 9,
      headerName: "Approval Amount By Clerk",
      flex: 2,
      editable: authority?.includes("ACCOUNTANT") ? false : true,
      valueGetter: (params) => params?.row?.approvalAmount,
      renderCell: (params) => {
        const handleChange = (event) => {
          const inputValue = event.target.value;
          if (inputValue === "" || parseFloat(inputValue) > 20) {
            // Update the value in the row
            const updatedRow = {
              ...params.row,
              approvalAmount: inputValue,
            };

            // Update the row in the Data Grid
            params.api.updateRows([updatedRow]);

            // Optionally, you can also exit the cell edit mode
            params.api.setCellMode(params.id, params.field, "view");
          }
        };

        return (
          <TextField
            placeholder="Enter amount"
            value={params.value || ""}
            onChange={handleChange}
            error={
              params.value !== "" &&
              parseFloat(params.value) <= params?.row?.feesAmount
            }
            helperText={
              params.value !== "" &&
              parseFloat(params.value) <= params?.row?.feesAmount
                ? `Amount must be greater than ${params?.row?.feesAmount}`
                : null
            }
          />
        );
      },
    },
  ];

  // const userColumns = () => {
  //   let billDetailColumnskk;
  //   if (authority?.includes("BILL_SUBMISSION")) {
  //     return billDetailColumns;
  //   } else if (authority?.includes("BILL_APPROVAL")) {
  //     billDetailColumnskk = billDetailColumns?.filter(
  //       (column) => column.caseMainType !== "caseMainType"
  //     );
  //     return billDetailColumnskk;
  //   }
  // };

  useEffect(() => {
    console.log("dataSource", dataSource);
  }, [dataSource]);

  // Add Bill Details on Submit
  const addBillDetailsOnSubmit = () => {
    if (watch("caseNumber") == "" || watch("caseNumber") == undefined) {
      setError("caseNumber", { message: "case number is required" });
    }

    const caseNumber = watch("caseNumber");
    const caseNumberName = caseNumbers.find((data) => {
      if (data?.id == watch("caseNumber")) {
        return data?.caseNumber;
      }
    })?.caseNumber;

    const caseMainType = watch("caseMainType");
    const caseMainTypeMar = watch("caseMainTypeMar");
    const caseMainTypeEng = watch("caseMainTypeEng");
    const caseSubType = watch("caseSubType");
    const caseSubTypeEng = watch("caseSubTypeEng");
    const caseSubTypeMar = watch("caseSubTypeMar");
    const caseFees = watch("caseFees");
    const paidFees = watch("paidFees");
    const feesAmount = watch("feesAmount");
    const pendingFees = watch("pendingFees");
    const activeFlag = watch("activeFlag");
    const paymentDate = moment(watch("paymentDate")).format("YYYY-MM-DD");

    let data = {
      // caseNumber: caseNumber,
      caseNumber: caseNumberName,
      caseNumberName: caseNumberName,
      caseMainType: caseMainType,
      caseMainTypeMar: caseMainTypeMar,
      caseMainTypeEng: caseMainTypeEng,
      caseSubType: caseSubType,
      caseSubTypeEng: caseSubTypeEng,
      caseSubTypeMar: caseSubTypeMar,
      caseFees: caseFees,
      paidFees: paidFees,
      feesAmount: feesAmount,
      activeFlag: activeFlag,
      pendingFees: pendingFees,
      paymentDate: paymentDate,
      // srN,
      srNo: (dataSource[dataSource?.length - 1]?.srNo ?? 0) + 1,
    };

    if (
      dataSource1.length == 0 ||
      localStorage.getItem("billDetail") !== null ||
      localStorage.getItem("billDetail") !== undefined
    ) {
      // let data1 = JSON.parse(localStorage.getItem("billDetail"));
      setDataSource([...dataSource, data]);
    } else {
      setDataSource1([...dataSource1, data]);
    }

    if (caseNoCount.length != 0) {
      setCaseNoCount([...caseNoCount, caseNumber]);
    } else {
      setCaseNoCount([caseNumber]);
    }

    setValue("caseNumber", null);
    setValue("caseNumberName", null);
    setValue("caseMainType", "");
    setValue("caseMainTypeMr", "");
    setValue("caseMainTypeEng", "");
    setValue("caseSubType", "");
    setValue("caseSubTypeMar", "");
    setValue("caseSubTypeEng", "");
    setValue("caseFees", "");
    setValue("paidFees", "");
    setValue("feesAmount", "");
    setValue("pendingFees", "");
    setValue("activeFlag", "");
    setValue("paymentDate", moment.now());

    localStorage.setItem("billDetail", JSON.stringify([...dataSource, data]));
    // localStorage.setItem("billDetail", JSON.stringify([data]));
  };

  // Submit Form 1
  const onSubmitForm1 = () => {
    // console.log("dataaa", data);
    // const approvedAmountUpdatedData = {
    //   id: getValues("id"),
    //   caseNumber: getValues("caseNumber"),
    //   caseMainType: getValues("caseMainType"),
    //   caseMainTypeMar: getValues("caseMainTypeMar"),
    //   caseMainTypeEng: getValues("caseMainTypeEng"),
    //   caseSubType: getValues("caseSubType"),
    //   caseSubTypeEng: getValues("caseSubTypeEng"),
    //   caseSubTypeMar: getValues("caseSubTypeMar"),
    //   caseFees: getValues("caseFees"),
    //   paidFees: getValues("paidFees"),
    //   feesAmount: getValues("feesAmount"),
    //   pendingFees: getValues("pendingFees"),
    //   approvalAmount: getValues("approvalAmount"),
    //   srNo: getValues("srNo"),
    //   activeFlag: "Y",
    //   paymentDate: moment(getValues("paymentDate")).format("YYYY-MM-DD"),
    // };

    // let updatedDataSource = dataSource.filter((data, index) => {
    //   if (data.id != approvedAmountUpdatedData.id) {
    //     return data;
    //   }
    // });

    // setDataSource([...updatedDataSource, approvedAmountUpdatedData]);
    // setDataSource();
    localStorage.setItem("billDetailInside", JSON.stringify(billDetailsData));
    localStorage.setItem("billDetailId", JSON.stringify(billDetailId));
    console.log("billDetailId", billDetailId);
    // localStorage.setItem("billDetail", [
    //   // ...updatedDataSource,
    //   billDetailsData,
    // ]);

    billDetailsDailogClose();
  };

  // useEffect - Testin
  useEffect(() => {
    if (dataSource1.length == 0) {
      setDataSource([]);
    } else {
      console.log("ffffff", dataSource1);
      setDataSource(
        dataSource1?.map((r, i) => {
          return {
            id: r.id,
            srNo: i + 1,
            ...r,
          };
        })
      );
    }
  }, [dataSource1]);

  // useEffect(() => {
  //   if (dataSource?.length !== 0 && authority?.includes("ADMIN")) {
  //     localStorage.setItem("billDetail", JSON.stringify(dataSource));
  //   }
  // }, [dataSource]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("billDetail")) !== null) {
      console.log("localData", JSON.parse(localStorage.getItem("billDetail")));
      setDataSource(
        JSON.parse(localStorage.getItem("billDetail"))?.map((data, i) => {
          console.log("1010", data.attachments);
          return {
            srNo: i + 1,
            id: data?.id,
            // createDtTm: moment(data?.createDtTm).format("DD-MM-YYYY"),
            createDtTm: data?.createDtTm,
            // createDtTm: moment(data?.createDtTm, "YYYY-MM-DD").format(
            //   "DD-MM-YYYY"
            // ),
            ...data,
          };
        })
      );

      // if (JSON.parse(localStorage.getItem("billDetail")) !== null) {
      //   const localStorageData = JSON.parse(localStorage.getItem("billDetail"));

      //   const mappedData = localStorageData.map((data, i) => ({
      //     attachments: data.attachments,
      //   }));

      //   setDataSource(mappedData);
      // }
    }
    if (localStorage.getItem("billDetailComponent") == "false") {
      setBillDetailComponent(false);
    } else {
      setBillDetailComponent(true);
    }
  }, [localStorage.getItem("billDetail")]);

  useEffect(() => {
    console.log("billDetails", billDetails);
  }, [billDetails]);

  // useEffect(()=> {

  // },[dataValidation])

  // View
  return (
    <>
      {/** Document Preview Dailog - OK */}
      <Dialog
        fullWidth
        maxWidth={"xl"}
        open={documentPreviewDialog}
        onClose={() => documentPreviewDailogClose()}
      >
        <Paper sx={{ p: 2 }}>
          <CssBaseline />
          <DialogTitle>
            <Grid container>
              <Grid
                item
                xs={6}
                sm={6}
                lg={6}
                xl={6}
                md={6}
                sx={{
                  display: "flex",
                  alignItem: "left",
                  justifyContent: "left",
                }}
              >
                Document Previewbbbb
              </Grid>
              <Grid
                item
                xs={1}
                sm={2}
                md={4}
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <IconButton
                  aria-label="delete"
                  sx={{
                    marginLeft: "530px",
                    backgroundColor: "primary",
                    ":hover": {
                      bgcolor: "red", // theme.palette.primary.main
                      color: "white",
                    },
                  }}
                >
                  <CloseIcon
                    sx={{
                      color: "black",
                    }}
                    onClick={() => {
                      documentPreviewDailogClose();
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>

          <DataGrid
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
            // density="compact"
            // getRowId={(row) => row.id}
            getRowId={(row) => row.srNo}
            autoHeight
            scrollbarSize={17}
            pageSize={5}
            rowsPerPageOptions={[5]}
            // pagination
            // paginationMode="server"
            // hideFooter={true}
            rows={docRows}
            columns={_docsColumns}
            // onPageChange={(_data) => {}}
            // onPageSizeChange={(_data) => {}}
          />

          {/* <DialogContent
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Documents props="Viewss" />
          </DialogContent> */}

          <DialogTitle>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                size="small"
                variant="contained"
                // onClick={() => alert("dsf")}

                onClick={documentPreviewDailogClose}
              >
                Exit
              </Button>
            </Grid>
          </DialogTitle>
        </Paper>
      </Dialog>

      <div
        style={{
          backgroundColor: "#0084ff",
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
      <ThemeProvider theme={theme}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(addBillDetailsOnSubmit)}>
            {billDetailComponent && (
              <>
                <Grid container style={{ marginLeft: 70, padding: "10px" }}>
                  {/* Case Number  - Court Case Number*/}
                  {/* <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      sx={{ marginTop: "2" }}
                      error={!!errors?.caseNumber}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="courtCaseNo" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="courtCaseNo" />}
                          >
                            {caseNumbers &&
                              caseNumbers 

                              
      .slice() 
      .sort((a, b) => a.caseNumber.localeCompare(b.caseNumber)) 


                              
                              
                              ?.map((data, index) => (
                                <MenuItem key={index} value={data?.id}>
                                  {data?.caseNumber}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="caseNumber"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.caseNumber
                          ? errors?.caseNumber?.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}

                  {/* case Number with Autocomplete  */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    {console.log("test", errors)}
                    <FormControl
                      sx={{ marginTop: "2" }}
                      error={!!errors?.caseNumber}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* <FormattedLabel id="courtCaseNo" /> */}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Autocomplete
                            options={caseNumbers}
                            getOptionLabel={(option) => option?.caseNumber}
                            value={
                              caseNumbers.find(
                                (option) => option?.id === field.value
                              ) || null
                            }
                            onChange={(event, value) =>
                              field.onChange(value?.id || "")
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={<FormattedLabel id="courtCaseNo" />}
                                error={!!errors?.caseNumber}
                                helperText={
                                  errors?.caseNumber
                                    ? errors?.caseNumber?.message
                                    : null
                                }
                              />
                            )}
                          />
                        )}
                        name="caseNumber"
                        control={control}
                        defaultValue=""
                      />
                      {/* <FormHelperText>
                        {errors?.caseNumber
                          ? errors?.caseNumber?.message
                          : null}
                      </FormHelperText> */}
                    </FormControl>
                  </Grid>

                  {/* Case Type  - Case Main Type*/}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      sx={{ marginTop: "2" }}
                      error={!!errors?.caseMainType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="caseType" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={true}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="caseType" />}
                          >
                            {caseMainTypes &&
                              caseMainTypes.map((caseMainType, index) => (
                                <MenuItem key={index} value={caseMainType?.id}>
                                  {language == "en"
                                    ? caseMainType?.caseMainType
                                    : caseMainType?.caseMainTypeMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="caseMainType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.caseMainType
                          ? errors?.caseMainType?.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Case Sub Type */}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      sx={{ marginTop: "2" }}
                      error={!!errors?.caseSubType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="caseSubType" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={true}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="caseSubType" />}
                          >
                            {caseSubTypes &&
                              caseSubTypes?.map((subType, index) => (
                                <MenuItem key={index} value={subType?.id}>
                                  {language == "en"
                                    ? subType?.subType
                                    : subType?.caseSubTypeMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="caseSubType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.caseSubType
                          ? errors?.caseSubType?.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Case Fees */}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      disabled={router?.query?.pageMode === "View"}
                      label={<FormattedLabel id="caseFees" />}
                      InputLabelProps={{
                        shrink: watch("caseFees") == "" || null ? false : true,
                      }}
                      {...register("caseFees")}
                      error={!!errors?.caseFees}
                      helperText={
                        errors?.caseFees ? errors?.caseFees?.message : null
                      }
                    />
                  </Grid>

                  {/** Fees Amount */}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      InputLabelProps={{
                        shrink:
                          watch("feesAmount") == "" || null ? false : true,
                      }}
                      disabled={router?.query?.pageMode === "View"}
                      label={<FormattedLabel id="feesAmount" />}
                      {...register("feesAmount")}
                      error={!!errors?.feesAmount}
                      helperText={
                        errors?.feesAmount ? errors?.feesAmount?.message : null
                      }
                    />
                  </Grid>
                  {/* Pending Fees*/}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      InputLabelProps={{
                        shrink:
                          watch("pendingFees") == "" || null ? false : true,
                      }}
                      disabled={router?.query?.pageMode === "View"}
                      defaultValue={""}
                      label={<FormattedLabel id="pendingFees" />}
                      {...register("pendingFees")}
                      error={!!errors?.pendingFees}
                      helperText={
                        errors?.pendingFees
                          ? errors?.pendingFees?.message
                          : null
                      }
                    />
                  </Grid>
                  {/* Payment Date*/}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      sx={{ marginTop: 0 }}
                      error={!!errors?.paymentDate}
                    >
                      <Controller
                        control={control}
                        name="paymentDate"
                        defaultValue={moment.now()}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                              disabled={true}
                              hidden={true}
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16, marginTop: 0 }}>
                                  Bill Created Date and Time
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
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
                      <FormHelperText>
                        {errors?.paymentDate
                          ? errors?.paymentDate?.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Approvoed Amount Fees */}
                  {approvalAmountInputState && (
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                      <TextField
                        disabled={router?.query?.pageMode === "View"}
                        // label={<FormattedLabel id='approvalAmount' />}
                        label="Approved Amount"
                        {...register("approvalAmount")}
                        error={!!errors?.approvalAmount}
                        helperText={
                          errors?.approvalAmount
                            ? errors?.approvalAmount?.message
                            : null
                        }
                      />
                    </Grid>
                  )}

                  {/* Paid Fees */}
                  {paidAmountInputState && (
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                      <TextField
                        disabled={router?.query?.pageMode === "View"}
                        label={<FormattedLabel id="paidFees" />}
                        {...register("paidFees")}
                        error={!!errors?.paidFees}
                        helperText={
                          errors?.paidFees ? errors?.paidFees?.message : null
                        }
                      />
                    </Grid>
                  )}
                </Grid>

                <Grid item xs={12} sm={12} lg={4} md={4} xl={4}>
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
                      onClick={addBillDetailsOnSubmit}
                    >
                      Add Bill Details
                    </Button>
                  </Stack>
                </Grid>
              </>
            )}
          </form>
        </FormProvider>
      </ThemeProvider>

      <div style={{ margin: "30px" }}>
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
          rows={dataSource ? dataSource : []}
          pageSize={5}
          rowsPerPageOptions={[5]}
          // checkboxSelection
          getRowId={(row) => row.srNo}
          // getRowId={(row) => row.id}
        />
      </div>
      {/** Bill Details Dailog - OK */}
      <Dialog
        fullWidth
        maxWidth={"lg"}
        open={billDetailsDailog}
        onClose={() => billDetailsDailogClose()}
      >
        <Paper>
          <CssBaseline />
          <DialogTitle>
            <Grid container>
              <Grid
                item
                xs={6}
                sm={6}
                lg={6}
                xl={6}
                md={6}
                sx={{
                  display: "flex",
                  alignItem: "left",
                  justifyContent: "left",
                }}
              >
                Bill Details
              </Grid>

              <Grid
                item
                xs={1}
                sm={2}
                md={4}
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <IconButton
                  aria-label="delete"
                  sx={{
                    marginLeft: "530px",
                    backgroundColor: "primary",
                    ":hover": {
                      bgcolor: "red", // theme.palette.primary.main
                      color: "white",
                    },
                  }}
                >
                  <CloseIcon
                    sx={{
                      color: "black",
                    }}
                    onClick={() => {
                      billDetailsDailogClose();
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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
              columns={billDetailColumns}
              // columns={userColumns()}
              rows={billDetailsData ? billDetailsData : []}
              onCellEditCommit={handleCellValueChange}
              pageSize={5}
              rowsPerPageOptions={[5]}
              // checkboxSelection
              // getRowId={(row) => row.srNo}
              // getRowId={(row) => row.id}
            />
          </DialogContent>
        </Paper>
        <div>
          <Stack
            direction="row"
            spacing={5}
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <Button
              // type="submit"
              variant="contained"
              onClick={onSubmitForm1}
              disabled={
                authority?.includes("ACCOUNTANT")
                  ? false
                  : isApprovedbillButtonDisable
              }
              // onClick={billDetailsDailogClose}
            >
              Approve
            </Button>
            <Button variant="contained" onClick={billDetailsDailogClose}>
              Exit
            </Button>
          </Stack>
        </div>
      </Dialog>
    </>
  );
};

export default BillDetails;

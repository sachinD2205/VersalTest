import { yupResolver } from "@hookform/resolvers/yup";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InIcon from "@mui/icons-material/Input";
import OutIcon from "@mui/icons-material/Output";
import SaveIcon from "@mui/icons-material/Save";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Slide,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  DatePicker,
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import swal from "sweetalert";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import styles from '../../../../pages/marriageRegistration/transactions/newMarriageRegistration/scrutiny/view.module.css'
import styles from "../../../../styles/lms/[bookIssueReturn]view.module.css";
import urls from "../../../../URLS/urls";
// import { bookIssueSchema } from '../../../../containers/schema/libraryManagementSystem/transaction/bookIssueReturn'
import theme from "../../../../theme";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Loader from "../../../../containers/Layout/components/Loader";
import LmsHeader from "../../../../components/lms/lmsHeader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const DepartmentalProcess = () => {
  const [btnSaveText, setBtnSaveText] = useState("save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapseIssue, setIsOpenCollapseIssue] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const [libraryIdsList, setLibraryIdsList] = useState([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState(null);
  const [membersList, setMembersList] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [booksAvailableList, setBooksAvailableList] = useState([]);
  const [selectedIssueBookId, setSelectedIssueBookId] = useState(null);
  const [issueDate, setIssueDate] = useState(new Date());
  const [formMode, setFormMode] = useState(null);

  const [booksMasterList, setBooksMasterList] = useState([]);
  const [returnBooksAvailableList, setReturnBooksAvailableList] = useState([]);
  const [remark, setRemark] = useState("");
  const [memberName, setMemberName] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [tempId, setTempId] = useState();
  const [_membershipNo, _setMembershipNo] = useState();

  const [issueBookBtn, setIssueBookBtn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
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

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 0,
  });

  useEffect(() => {
    setAllLibrariesList();
    getAllBooks();
  }, []);

  const getAllBooks = () => {
    setLoading(true);
    // const url = urls.LMSURL + '/bookMaster/getAll'
    const url =
      urls.LMSURL + "/bookMaster/getAllAvailableBook?librarianId=" + user.id;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        if (!response.data || !response.data.bookMasterList) {
          throw new Error(
            language === "en" ? "Books Not Found !!" : "पुस्तके आढळले नाही !!"
          );
        }
        setBooksMasterList(response.data.bookMasterList);
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });
  };

  const setAllLibrariesList = () => {
    setLoading(true);
    // const url = urls.LMSURL + "/libraryMaster/getAll";
    axios
      .get(
        `${urls.LMSURL}/libraryMaster/getAllLibraryByUserKey?userKey=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        if (response.status !== 200) {
          throw new Error(
            language === "en"
              ? "Error getting libraries !!"
              : "लायब्ररी मिळवण्यात त्रुटी !!"
          );
        }
        if (
          !response.data ||
          !response.data.libraryMasterList ||
          response.data.libraryMasterList.length === 0
        ) {
          throw new Error(
            language === "en"
              ? "No libraries found !!"
              : "कोणतीही लायब्ररी आढळली नाही !!"
          );
        }
        setLibraryIdsList(
          response.data.libraryMasterList.sort((a, b) => a.id - b.id)
        );
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });
    // .catch((err) => {
    //   setLoading(false);
    //   console.error(err);
    //   swal(err.message, { icon: "error" });
    // });
  };

  const setMembersListByLibraryId = (library) => {
    setLoading(true);
    setSelectedLibraryId(library);
    if (!library) {
      setLoading(false);
      swal(
        language == "en"
          ? "No library selected"
          : "कोणतीही लायब्ररी निवडली नाही",
        { icon: "warning" }
      );
      return;
    }
    const url =
      urls.LMSURL +
      "/libraryMemberMaster/getAllMemberByLibraryId?libraryId=" +
      library.id;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        // if (
        //   !response.data ||
        //   !response.data.libraryMemberMasterList ||
        //   response.data.libraryMemberMasterList.length === 0
        // ) {
        //   throw new Error('Members not found for the library')
        // }
        setMembersList(response.data.libraryMemberMasterList);
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });
    // .catch((err) => {
    //   setLoading(false);
    //   console.error(err);
    //   swal(err.message, { icon: "error" });
    // });
  };

  const getAllAvailableBooks = () => {
    setLoading(true);
    const url =
      urls.LMSURL + "/bookMaster/getAllAvailableBook?librarianId=" + user.id;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        // if (
        //   !response.data ||
        //   !response.data.bookMasterList ||
        //   response.data.bookMasterList.length === 0
        // ) {
        //   throw new Error('No books found')
        // }
        setBooksAvailableList(response?.data?.bookMasterList);
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });
    // .catch((err) => {
    //   setLoading(false);
    //   console.error(err);
    //   swal(err.message, { icon: "error" });
    // });
  };

  useEffect(() => {
    if (memberName && watch("membershipNo")) {
      console.log("yetoy");
      getReturnBooksByMemberId();
    }
  }, [memberName]);

  const getReturnBooksByMemberId = (member) => {
    setLoading(true);
    setReturnBooksAvailableList([]);
    setSelectedMemberId(member);
    const url =
      urls.LMSURL +
      "/trnBookIssueReturn/getAllIssueBookToMember?membershipNo=" +
      watch("membershipNo");
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        setReturnBooksAvailableList(response.data.trnBookIssueReturnList);
        if (response?.data?.trnBookIssueReturnList?.length > 0) {
          setButtonInputState(true);
          setIssueBookBtn(true);
        } else {
          setButtonInputState(false);
          setIssueBookBtn(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });
    // .catch((err) => {
    //   console.error(err);
    //   setLoading(false);
    //   swal(err.message, { icon: "error" });
    // });
  };

  const submitTransaction = async () => {
    setLoading(true);
    let url = "";
    const payload = {
      libraryMasterKey: +selectedLibraryId.id,
      // libraryMemberMasterKey: selectedMemberId.id,
      // libraryMemberName: selectedMemberId.libraryMemberFirstName,
      membershipNo: watch("membershipNo"),
      bookMasterKey: +selectedIssueBookId.id,
      bookName: selectedIssueBookId.bookName,
      status: formMode,
      issuedAt: null,
      returnedAt: null,
      issueRemark: null,
      returnRemark: null,
      fine: 0,
      bookLostStatus: "",
      bookLostRemark: "",
      bookLostAt: null,
      createdUserId: 1,
      updateDtTm: null,
      updateUserid: 1,
      version: 1,
    };
    if (formMode === "I") {
      // setLoading(false);
      payload.issuedAt = issueDate.toISOString();
      payload.issueRemark = remark;
      url = urls.LMSURL + "/trnBookIssueReturn/save";
      return axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else if (formMode == "L") {
      setLoading(false);
      console.log("selectedIssueBookId", selectedIssueBookId, formMode);

      // url = urls.LMSURL + '/trnBookIssueReturn/markBookAsLost?id=' + selectedIssueBookId.id
      // return axios.post(url)
    } else {
      // setLoading(false);
      // payload.returnedAt = issueDate.toISOString()
      // payload.returnRemark = remark
      console.log("selectedIssueBookId", selectedIssueBookId, formMode);
      // url = urls.LMSURL + '/trnBookIssueReturn/delete/'+selectedIssueBookId.id
      url =
        urls.LMSURL +
        "/trnBookIssueReturn/calculateFineOfIssueBook?id=" +
        selectedIssueBookId.id;
      return axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    // setLoading(false);
    console.log("Payload:", payload);
    // return axios.post(url, payload)
  };

  const returnBook = ({ id, bookName }) => {
    setSelectedIssueBookId({ id, bookName });
    setEditButtonInputState(true);
    setDeleteButtonState(true);
    setBtnSaveText("Return");
    setFormMode("R");
    setButtonInputState(true);
    setSlideChecked(true);
    setIsOpenCollapseIssue(true);
    document
      .querySelector("#paper-top")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // const lostBook = ({ id, bookName }) => {
  //   // setSelectedIssueBookId({ id, bookName })
  //   setTempId(id);
  //   setSelectedIssueBookId(
  //     booksAvailableList.find((item) => item.bookName == bookName)
  //   );
  //   setEditButtonInputState(true);
  //   setDeleteButtonState(true);
  //   setBtnSaveText("Lost");
  //   setFormMode("L");
  //   setButtonInputState(true);
  //   setSlideChecked(true);
  //   setIsOpenCollapseIssue(true);
  //   document
  //     .querySelector("#paper-top")
  //     ?.scrollIntoView({ behavior: "smooth" });
  // };
  // const lostBook = ({ id, bookName }) => {
  const lostBook = (params) => {
    setLoading(true);
    axios
      .get(`${urls.LMSURL}/bookMaster/getById?id=${params?.bookMasterKey}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        console.log("_response", response);
        setTempId(params?.id);
        setSelectedIssueBookId(response?.data);
        setEditButtonInputState(true);
        setDeleteButtonState(true);
        setBtnSaveText("Lost");
        setFormMode("L");
        setButtonInputState(true);
        setSlideChecked(true);
        setIsOpenCollapseIssue(true);
        document
          .querySelector("#paper-top")
          ?.scrollIntoView({ behavior: "smooth" });
      })
      .catch((err) => {
        setLoading(false);
        catchExceptionHandlingMethod(err, language);
      });
    // ----------------------------------------------
  };

  const issueBook = () => {
    setEditButtonInputState(true);
    setDeleteButtonState(true);
    setBtnSaveText("Issue");
    setFormMode("I");
    setButtonInputState(true);
    setSlideChecked(true);
    setIsOpenCollapseIssue(true);
    setIssueBookBtn(true);
  };

  useEffect(() => {
    if (selectedIssueBookId) {
      console.log("Book selected", booksAvailableList, selectedIssueBookId);
      reset(selectedIssueBookId);
      setValue("membershipNo", _membershipNo);
    }
  }, [selectedIssueBookId]);

  const submit = () => {
    // if (
    //   !selectedLibraryId ||
    //   // !selectedMemberId ||
    //   !selectedIssueBookId ||
    //   !issueDate
    // ) {
    //   swal('Please enter all details', { icon: 'warning' })
    //   return
    // }
    setLoading(true);
    if (formMode == "L") {
      console.log("formMode LL yes");
      console.log("aala re", selectedIssueBookId);
      setLoading(false);
      router.push({
        pathname: `/lms/transactions/bookIssueReturn/PaymentCollection`,
        query: {
          temp: selectedIssueBookId.bookPrice,
          id: tempId ? tempId : selectedIssueBookId.id,
          membershipNo: watch("membershipNo"),
          memberName: memberName,
          remark: remark,
        },
      });
    } else {
      submitTransaction()
        .then((resp) => {
          // setLoading(false);
          console.log("aala re", formMode, resp);
          if (formMode == "R") {
            if (resp.data.isFinePending) {
              setLoading(false);
              swal(
                language == "en" ? "Fine Pending!" : "दंड प्रलंबित!",
                language == "en"
                  ? "Please Collect Fine!"
                  : "कृपया दंड गोळा करा!",
                "success"
              );

              router.push({
                pathname: `/lms/transactions/bookIssueReturn/PaymentCollectionReturn`,
                query: {
                  temp: resp?.data?.fine,
                  id: tempId ? tempId : selectedIssueBookId.id,
                  membershipNo: watch("membershipNo"),
                  memberName: memberName,
                  remark: remark,
                },
              });
            } else {
              // setLoading(true);
              let pl = {};
              let url =
                urls.LMSURL +
                "/trnBookIssueReturn/bookReturn?id=" +
                selectedIssueBookId.id;

              axios
                .post(url, pl, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((res) => {
                  setLoading(false);
                  console.log("generate", res);
                  if (res.status == 201 || res.status == 200) {
                    swal(
                      language == "en" ? "Saved!" : "जतन केले!",
                      language == "en"
                        ? "Record Saved successfully!"
                        : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                      "success"
                    );
                    // router.push({
                    //     pathname: `/dashboard`,
                    // })
                    let temp = res?.data?.message;
                    swal(
                      language == "en"
                        ? `Book successfully Returned.`
                        : "पुस्तक यशस्वीरित्या परत केले.",
                      {
                        icon: "success",
                      }
                    );

                    resetBookIssueForm(false);

                    setValue("membershipNo", "");
                    setMemberName();
                  }
                });
            }
          } else {
            setLoading(false);
            resetBookIssueForm(false);
            language == "en"
              ? swal(
                  `Book successfully ${
                    formMode === "I"
                      ? "issued"
                      : formMode === "L"
                      ? "lost"
                      : "returned"
                  }.`,
                  {
                    icon: "success",
                  }
                )
              : swal(
                  `पुस्तक यशस्वीरित्या ${
                    formMode === "I"
                      ? "जारी"
                      : formMode === "L"
                      ? "हरवले"
                      : "परत आले"
                  }.`,
                  {
                    icon: "success",
                  }
                );
            setValue("membershipNo", "");
            setMemberName();
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error("yetoy", err);
          if (err?.response.data.status == 409) {
            swal(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Membership Expired ! Please Renew..",
              { icon: "error" }
            );
          } else {
            swal(err?.message, { icon: "error" });
          }
        });
    }
  };

  const bookIssueForm = useForm({
    // resolver: yupResolver(bookIssueSchema),
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = bookIssueForm;
  const columns = [
    {
      field: "bookName",
      // headerName: 'Book Name',
      headerAlign: "center",
      headerName: <FormattedLabel id="bookName" />,
      flex: 1,
      align: "center",
      // width: 480,
    },
    {
      field: "issuedAt",
      // headerName: 'Issued At',
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="issuedAt" />,
      // width: 200,
      flex: 0.5,
    },
    {
      field: "actions",
      // headerName: 'Actions',
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "260px",
            }}
          >
            <Button
              onClick={() => {
                returnBook(params.row);
              }}
              size="small"
              style={{ display: "flex", gap: 10, width: "100px" }}
            >
              <InIcon />
              <FormattedLabel id="Return" />
            </Button>
            <Button
              onClick={() => {
                lostBook(params.row);
              }}
              size="small"
              style={{ display: "flex", gap: 10, width: "120px" }}
            >
              <InIcon />
              <FormattedLabel id="bookLost" />
            </Button>
          </div>
        );
      },
    },
  ];

  const resetBookIssueForm = (modalState, formModeType) => {
    setIssueBookBtn(true);
    console.log("11", modalState, formModeType);
    bookIssueForm.reset({});
    setEditButtonInputState(modalState);
    setDeleteButtonState(modalState);
    if (formModeType !== undefined) {
      setBtnSaveText(formModeType === "I" ? "Issue" : "Return");
      setFormMode(formModeType);
    }
    // setButtonInputState(modalState);
    setSlideChecked(modalState);
    setIsOpenCollapseIssue(modalState);
    setSelectedLibraryId("");
    setSelectedIssueBookId("");
    setSelectedMemberId("");
    setMembersList([]);
    setBooksAvailableList([]);
    setReturnBooksAvailableList([]);
    setIssueDate(null);
    setRemark("");
    setValue("membershipNo", null);
    setMemberName();
    setIsOpenCollapseIssue(false);
    setButtonInputState(false);
    _setMembershipNo(null);
    setShowHistory(false);
    setData({
      rows: [],
      totalRows: 0,
      rowsPerPageOptions: [10, 20, 50, 100],
      pageSize: 10,
      page: 0,
    });
  };

  const getMembershipDetails = () => {
    setLoading(true);
    _setMembershipNo(watch("membershipNo"));
    if (watch("membershipNo") && selectedLibraryId?.id) {
      const url =
        urls.LMSURL +
        "/libraryMembership/getByMembershipNoAndLibraryKey?membershipNo=" +
        watch("membershipNo") +
        "&libraryKey=" +
        selectedLibraryId?.id;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          if (Object.keys(response?.data).length !== 0) {
            setMemberName(response.data.applicantName);
            setStartDate(response.data.startDate);
            setEndDate(response.data.endDate);
            setIssueDate(new Date());
            setIssueBookBtn(false);

            getIssueReturnHistory();
            setShowHistory(true);
          } else {
            setMemberName();
            setStartDate();
            setEndDate();
            setIssueDate();
            setIssueBookBtn(true);
          }
        })
        .catch((err) => {
          setLoading(false);
          // swal(err.response.data.message, { icon: "error" });

          sweetAlert({
            text: err?.response?.data?.message,
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
            dangerMode: false,
            closeOnClickOutside: false,
          }).then((will) => {
            if (will) {
              console.error(err);
              setValue("membershipNo", "");
              setSelectedLibraryId(null);
              setMemberName();
              setStartDate();
              setEndDate();
              setIssueDate();
              setIssueBookBtn(true);
            }
          });
        });
    } else {
      setLoading(false);
      // swal("Both fiels are required!", { icon: "warning" });
      swal({
        // title: language === "en" ? "Saved " : "जतन केले",
        text:
          language === "en"
            ? "Please Enter All Values"
            : "कृपया सर्व मूल्ये प्रविष्ट करा",
        icon: "warning",
        button: language === "en" ? "Ok" : "ठीक आहे",
        dangerMode: false,
        closeOnClickOutside: false,
      });
      setMemberName();
      setStartDate();
      setEndDate();
      setIssueDate();
      setIssueBookBtn(true);
    }
  };

  // get getIssueReturnHistory

  const getIssueReturnHistory = (formData) => {
    if (watch("membershipNo")) {
      setLoading(true);
      console.log("formDatapageSize", formData?.pageSize);
      axios
        .get(
          `${urls.LMSURL}/trnBookIssueReturn/getAllIssueBookHistory?pageNo=${
            formData?.pageNo ?? 0
          }&pageSize=${
            formData?.pageSize ?? 10
          }&sortBy=id&sortDir=DESC&membershipNo=${watch("membershipNo")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          console.log("issueReturnHistory", res?.data?.trnBookIssueReturnList);
          if (res?.status == 200) {
            if (res?.data?.trnBookIssueReturnList?.length > 0) {
              let page = res?.data?.pageSize * res?.data?.pageNo;
              let temp = res?.data?.trnBookIssueReturnList?.map((r, i) => ({
                ...r,
                srNo: i + 1 + page,
                issuedAt: r?.issuedAt
                  ? moment(r.issuedAt).format("DD/MM/YYYY")
                  : "-",
                returnedAt:
                  r?.status === "I"
                    ? "Return Pending"
                    : r?.status === "L"
                    ? "Book Lost"
                    : moment(r.returnedAt).format("DD/MM/YYYY"),
              }));
              setData({
                rows: temp,
                totalRows: res?.data?.totalElements,
                rowsPerPageOptions: [10, 20, 50, 100],
                pageSize: res?.data?.pageSize,
                page: res?.data?.pageNo,
              });
            }
          }
        })
        .catch((err) => {
          setLoading(false);
          catchExceptionHandlingMethod(err, language);
        });
    }
  };

  const historyColumns = [
    {
      field: "srNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      align: "center",
    },
    {
      field: "bookName",
      headerAlign: "center",
      headerName: <FormattedLabel id="bookName" />,
      flex: 1,
      align: "center",
    },
    {
      field: "issuedAt",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="issuedAt" />,
      flex: 1,
      // valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "returnedAt",
      // headerName: 'Issued At',
      headerAlign: "center",
      align: "center",
      headerName: language === "en" ? "Returned at" : "परत आले",
      // width: 200,
      flex: 1,
      // valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
  ];
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ThemeProvider theme={theme}>
          <Paper
            sx={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
              padding: 1,
            }}
            id="paper-top"
          >
            <Box>
              <BreadcrumbComponent />
            </Box>
            <LmsHeader labelName="bookIssueReturnTitle" />
            {loading ? (
              <Loader />
            ) : (
              <>
                <Grid
                  container
                  style={{
                    padding: "10px",
                  }}
                >
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Autocomplete
                      sx={{ width: "90%" }}
                      // label="Library ID *"
                      label={<FormattedLabel id="libraryCSC" />}
                      disabled={isOpenCollapseIssue}
                      disablePortal
                      options={libraryIdsList}
                      value={selectedLibraryId || ""}
                      onChange={(_e, id) => {
                        setMembersListByLibraryId(id);
                        if (id) {
                          getAllAvailableBooks();
                        }
                      }}
                      getOptionLabel={({ libraryName }) => libraryName || ""}
                      isOptionEqualToValue={(opt, sel) => {
                        return opt.id === sel.id;
                      }}
                      renderOption={(props, option) => (
                        <span {...props}>{option.libraryName}</span>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{ width: "90%" }}
                          label={<FormattedLabel id="libraryCSC" required />}
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}
                  >
                    <TextField
                      InputLabelProps={{
                        shrink: watch("membershipNo") ? true : false,
                      }}
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="membershipNo" required />}
                      // label="Membership No"

                      variant="standard"
                      {...register("membershipNo")}
                      error={!!errors.membershipNo}
                      helperText={
                        errors?.membershipNo
                          ? errors.membershipNo.message
                          : null
                      }
                    />
                    {console.log(",", watch("membershipNo"))}
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}
                  >
                    <Button
                      variant="contained"
                      endIcon={<OutIcon />}
                      size="small"
                      type="primary"
                      disabled={buttonInputState}
                      onClick={() => {
                        getMembershipDetails();
                        // getIssueReturnHistory();
                        // setShowHistory(true);
                      }}
                    >
                      {/* Search Member */}
                      {<FormattedLabel id="searchMember" />}
                    </Button>
                  </Grid>
                  {/* <Grid item xl={8} lg={8} md={8} sm={16} xs={16}>
                <Autocomplete
                  sx={{ m: 1 }}
                  label="Member *"
                  disabled={membersList.length === 0 || isOpenCollapseIssue}
                  disablePortal
                  options={membersList}
                  value={selectedMemberId}
                  onChange={(_e, id) => {
                    // getReturnBooksByMemberId(id)
                  }}
                  getOptionLabel={(opt) => {
                    if (!opt) {
                      return ''
                    }
                    const {
                      libraryMemberFirstName,
                      libraryMemberLastName,
                    } = opt
                    return libraryMemberFirstName + ' ' + libraryMemberLastName
                  }}
                  isOptionEqualToValue={(opt, sel) => opt.id === sel.id}
                  renderOption={(props, option) => (
                    <span {...props}>
                      {option.libraryMemberFirstName +
                        ' ' +
                        option.libraryMemberLastName}
                    </span>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Choose a member" />
                  )}
                />
              </Grid> */}
                </Grid>
                {memberName && (
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        disabled
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{ width: "90%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="memberName" required />}
                        // label="Member Name"
                        variant="standard"
                        value={memberName}
                        // error={!!errors.membershipNo}
                        // helperText={
                        //   errors?.membershipNo ? errors.membershipNo.message : null
                        // }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{ width: "90%" }}
                        error={!!errors.startDate}
                      >
                        <Controller
                          control={control}
                          name="startDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disabled
                                // maxDate={new Date()}
                                // disabled={disable}
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 14 }}>
                                    {" "}
                                    {/* Membership Start Date */}
                                    {<FormattedLabel id="startDate" />}
                                  </span>
                                }
                                value={startDate}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    // disabled={disabled}
                                    sx={{ width: "90%" }}
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
                          {errors?.startDate ? errors.startDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{ width: "90%" }}
                        error={!!errors.endDate}
                      >
                        <Controller
                          control={control}
                          name="endDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disabled
                                // maxDate={new Date()}
                                // disabled={disable}
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 14 }}>
                                    {" "}
                                    {/* Membership Start Date */}
                                    {<FormattedLabel id="endDate" />}
                                  </span>
                                }
                                value={endDate}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    // disabled={disabled}
                                    {...params}
                                    size="small"
                                    fullWidth
                                    sx={{ width: "90%" }}
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
                          {errors?.endDate ? errors.endDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}

                {isOpenCollapseIssue && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <div>
                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            {/* {btnSaveText} Form */}
                            {<FormattedLabel id={btnSaveText} />}{" "}
                            {<FormattedLabel id="form" />}
                          </h3>
                        </div>
                      </div>
                      <FormProvider {...bookIssueForm.methods}>
                        <form>
                          <Grid container style={{ padding: "10px" }}>
                            {formMode === "I" || formMode == "L" ? (
                              <Grid
                                item
                                xl={4}
                                lg={4}
                                md={4}
                                sm={12}
                                xs={12}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Autocomplete
                                  sx={{ width: "90%" }}
                                  label="Book *"
                                  // disabled={booksAvailableList.length === 0}
                                  disabled={
                                    booksAvailableList.length === 0 ||
                                    formMode == "L"
                                  }
                                  disablePortal
                                  options={booksAvailableList}
                                  value={selectedIssueBookId}
                                  onChange={(_e, id) => {
                                    setSelectedIssueBookId(id);
                                  }}
                                  getOptionLabel={({ bookName }) =>
                                    bookName || ""
                                  }
                                  isOptionEqualToValue={(opt, sel) =>
                                    opt.id === sel.id
                                  }
                                  renderOption={(props, option) => (
                                    <span {...props}>{option.bookName}</span>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      sx={{ width: "90%" }}
                                      // label="Choose a book"
                                      label={<FormattedLabel id="chooseBook" />}
                                    />
                                  )}
                                />
                              </Grid>
                            ) : (
                              ""
                            )}
                            <Grid
                              item
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              xl={4}
                              lg={4}
                              md={4}
                              sm={12}
                              xs={12}
                            >
                              <DesktopDatePicker
                                sx={{ width: "90%" }}
                                label={
                                  language === "en"
                                    ? `Date of ${btnSaveText} *`
                                    : ` ${
                                        btnSaveText === `Lost`
                                          ? `हरवले`
                                          : btnSaveText === `Issue`
                                          ? `जारी`
                                          : btnSaveText === `Return`
                                          ? `परत`
                                          : { btnSaveText }
                                      } ची तारीख *`
                                }
                                // Return Lost Issue
                                variant="standard"
                                inputFormat="DD/MM/YYYY"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    sx={{ width: "90%" }}
                                  />
                                )}
                                onChange={(value) => {
                                  setIssueDate(value.toDate());
                                }}
                                value={issueDate}
                              />
                            </Grid>
                            <Grid
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              item
                              xl={4}
                              lg={4}
                              md={4}
                              sm={12}
                              xs={12}
                            >
                              <TextField
                                value={remark}
                                // label="Remark"
                                label={<FormattedLabel id="remark" />}
                                sx={{ width: "90%" }}
                                onChange={(e) => {
                                  setRemark(e.target.value);
                                }}
                              />
                            </Grid>
                          </Grid>
                          {selectedIssueBookId &&
                          (formMode == "I" || formMode == "L") ? (
                            <>
                              <div className={styles.details}>
                                <div className={styles.h1Tag}>
                                  <h3
                                    style={{
                                      color: "white",
                                      marginTop: "7px",
                                    }}
                                  >
                                    {/* Book Details */}
                                    {<FormattedLabel id="bookDetails" />}
                                  </h3>
                                </div>
                              </div>

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
                                style={{ marginTop: "1vh", marginLeft: "1vh" }}
                                columns={12}
                              >
                                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                                  <TextField
                                    disabled
                                    id="standard-basic"
                                    // label="Book Classification"
                                    label={
                                      <FormattedLabel id="bookClassification" />
                                    }
                                    variant="standard"
                                    {...register("bookClassification")}
                                    error={!!errors.bookClassification}
                                    InputLabelProps={{
                                      style: { fontSize: 15 },
                                      //true
                                      shrink: watch("bookClassification")
                                        ? true
                                        : false,
                                      // ||(router.query.bookName ? true : false),
                                    }}
                                    helperText={
                                      errors?.bookClassification
                                        ? errors.bookClassification.message
                                        : null
                                    }
                                  />
                                </Grid>
                                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                                  <TextField
                                    disabled
                                    id="standard-basic"
                                    // label="Book Type"
                                    label={<FormattedLabel id="bookType" />}
                                    variant="standard"
                                    {...register("bookType")}
                                    error={!!errors.bookType}
                                    InputLabelProps={{
                                      style: { fontSize: 15 },
                                      //true
                                      shrink: watch("bookType") ? true : false,
                                      // ||(router.query.bookName ? true : false),
                                    }}
                                    helperText={
                                      errors?.bookType
                                        ? errors.bookType.message
                                        : null
                                    }
                                  />
                                </Grid>
                                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                                  <TextField
                                    disabled
                                    id="standard-basic"
                                    // label="Book Sub Type"
                                    label={<FormattedLabel id="bookSubType" />}
                                    variant="standard"
                                    {...register("bookSubType")}
                                    error={!!errors.bookSubType}
                                    InputLabelProps={{
                                      style: { fontSize: 15 },
                                      //true
                                      shrink: watch("bookSubType")
                                        ? true
                                        : false,
                                      // ||(router.query.bookName ? true : false),
                                    }}
                                    helperText={
                                      errors?.bookSubType
                                        ? errors.bookSubType.message
                                        : null
                                    }
                                  />
                                </Grid>
                              </Grid>
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
                                style={{ marginTop: "1vh", marginLeft: "1vh" }}
                                columns={12}
                              >
                                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                                  <TextField
                                    disabled
                                    id="standard-basic"
                                    // label="Publication"
                                    label={<FormattedLabel id="publication" />}
                                    variant="standard"
                                    {...register("publication")}
                                    error={!!errors.publication}
                                    InputLabelProps={{
                                      style: { fontSize: 15 },
                                      //true
                                      shrink: watch("publication")
                                        ? true
                                        : false,
                                      // ||(router.query.bookName ? true : false),
                                    }}
                                    helperText={
                                      errors?.publication
                                        ? errors.publication.message
                                        : null
                                    }
                                  />
                                </Grid>
                                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                                  <TextField
                                    disabled
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
                                      // ||(router.query.bookName ? true : false),
                                    }}
                                    helperText={
                                      errors?.author
                                        ? errors.author.message
                                        : null
                                    }
                                  />
                                </Grid>
                                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                                  <TextField
                                    disabled
                                    id="standard-basic"
                                    // label="Book Edition"
                                    label={<FormattedLabel id="bookEdition" />}
                                    variant="standard"
                                    {...register("bookEdition")}
                                    error={!!errors.bookEdition}
                                    InputLabelProps={{
                                      style: { fontSize: 15 },
                                      //true
                                      shrink:
                                        watch("bookEdition") ||
                                        watch("bookEdition") == "0"
                                          ? true
                                          : false,
                                      // ||(router.query.bookName ? true : false),
                                    }}
                                    helperText={
                                      errors?.bookEdition
                                        ? errors.bookEdition.message
                                        : null
                                    }
                                  />
                                </Grid>
                              </Grid>
                              <Grid container style={{ padding: "10px" }}>
                                <Grid
                                  item
                                  xl={4}
                                  lg={4}
                                  md={4}
                                  sm={12}
                                  xs={12}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <TextField
                                    disabled
                                    id="standard-basic"
                                    // label="Book Price"
                                    label={<FormattedLabel id="bookPrice" />}
                                    variant="standard"
                                    {...register("bookPrice")}
                                    error={!!errors.bookPrice}
                                    InputLabelProps={{
                                      style: { fontSize: 15 },
                                      //true
                                      shrink:
                                        watch("bookPrice") ||
                                        watch("bookPrice") == "0"
                                          ? true
                                          : false,
                                      // ||(router.query.bookName ? true : false),
                                    }}
                                    helperText={
                                      errors?.bookPrice
                                        ? errors.bookPrice.message
                                        : null
                                    }
                                  />
                                </Grid>
                                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                                  <TextField
                                    disabled
                                    id="standard-basic"
                                    // label="Available Books Copy"
                                    label={
                                      <FormattedLabel id="totalAvailableBookCopy" />
                                    }
                                    variant="standard"
                                    {...register("totalAvailableBookCopy")}
                                    error={!!errors.totalAvailableBookCopy}
                                    InputLabelProps={{
                                      style: { fontSize: 15 },
                                      //true
                                      shrink:
                                        watch("totalAvailableBookCopy") ||
                                        watch("totalAvailableBookCopy") == "0"
                                          ? true
                                          : false,
                                      // ||(router.query.bookName ? true : false),
                                    }}
                                    helperText={
                                      errors?.totalAvailableBookCopy
                                        ? errors.totalAvailableBookCopy.message
                                        : null
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </>
                          ) : (
                            ""
                          )}
                          <div className={styles.btn}>
                            <div className={styles.btn1}>
                              <Button
                                onClick={() => submit()}
                                type="button"
                                size="small"
                                variant="contained"
                                color="success"
                                endIcon={<SaveIcon />}
                              >
                                {/* {btnSaveText} */}
                                {<FormattedLabel id={btnSaveText} />}
                              </Button>
                            </div>
                            <div className={styles.btn1}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                endIcon={<ClearIcon />}
                                onClick={() => resetBookIssueForm(true)}
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
                                onClick={() => resetBookIssueForm(false)}
                              >
                                {/* Exit */}
                                {<FormattedLabel id="exit" />}
                              </Button>
                            </div>
                          </div>
                        </form>
                      </FormProvider>
                    </div>
                  </Slide>
                )}
                <div className={styles.addbtn}>
                  <Button
                    variant="contained"
                    endIcon={<OutIcon />}
                    size="small"
                    type="primary"
                    disabled={issueBookBtn}
                    onClick={() => {
                      issueBook();
                    }}
                  >
                    {/* Issue */}
                    {<FormattedLabel id="issue" />}
                  </Button>
                </div>
                {(returnBooksAvailableList?.length !== 0 ||
                  returnBooksAvailableList?.length < 0) && (
                  <DataGrid
                    autoHeight
                    rowHeight={60}
                    sx={{
                      marginLeft: 3,
                      marginRight: 3,
                      marginTop: 3,
                      marginBottom: 3,
                      overflowY: "scroll",
                      overflowX: "scroll",

                      "& .MuiDataGrid-virtualScrollerContent": {},
                      "& .MuiDataGrid-columnHeadersInner": {
                        backgroundColor: "#556CD6",
                        color: "white",
                      },

                      "& .MuiDataGrid-cell:hover": {
                        color: "primary.main",
                      },
                    }}
                    rows={returnBooksAvailableList.map((item) => ({
                      ...item,
                      issuedAt: moment(item.issuedAt).format("DD/MM/YYYY"),
                    }))}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                  />
                )}
                {showHistory && (
                  <>
                    <LmsHeader
                      labelName="bookIssueReturnHistory"
                      showBackBtn={false}
                    />
                    <DataGrid
                      autoHeight
                      sx={{
                        marginTop: 2,
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
                      rowCount={data.totalRows}
                      rowsPerPageOptions={data.rowsPerPageOptions}
                      page={data.page}
                      pageSize={data.pageSize}
                      rows={data.rows}
                      columns={historyColumns}
                      onPageChange={(_data) => {
                        console.log("onPageChange", _data);
                        getIssueReturnHistory({
                          pageNo: _data,
                          pageSize: data?.pageSize,
                        });
                      }}
                      onPageSizeChange={(_data) => {
                        console.log("onPageSizeChange", _data);
                        // updateData("page", 1);
                        // onSubmitForm(_data, data.page);
                        getIssueReturnHistory({ pageSize: _data });
                      }}
                    />
                  </>
                )}
              </>
            )}
          </Paper>
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
};
export default DepartmentalProcess;

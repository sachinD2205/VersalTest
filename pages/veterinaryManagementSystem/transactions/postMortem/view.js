import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "./postMortem.module.css";

import Title from "../../../../containers/VMS_ReusableComponents/Title";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import UploadButton from "../../../../containers/reuseableComponents/UploadButton";
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import sweetAlert from "sweetalert";
import URLs from "../../../../URLS/urls";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import { TimePicker } from "@mui/x-date-pickers";
import { useSelector } from "react-redux";
import { Add, Clear, Delete, ExitToApp, Save } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import PostMortemPreview from "./PostMortemPreview";

const View = () => {
  // @ts-ignore
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  const [animalDropDown, setAnimalDropDown] = useState([]);
  const [formOptions, setFormOptions] = useState({
    historyOfIllness: false,
    blood: false,
    urine: false,
    discharge: false,
    biopsy: false,
  });

  const [disableState, setDisableState] = useState(false);

  const [showButtons, setShowButtons] = useState(true);
  const [actionField, setActionField] = useState(false);
  const [remarkField, setRemarkField] = useState(false);

  const [dynamicSchema, setDynamicSchema] = useState({});

  const [currentFile, setCurrentFile] = useState("");
  const [files, setFiles] = useState([]);

  const [openPreview, setOpenPreview] = useState(false);
  const [finalData, setFinalData] = useState({});

  const optionStyle = {
    fontSize: "medium",
    // opacity: !!router.query.id ? 0.5 : 1,
    opacity: disableState ? 0.5 : 1,
  };

  const roles = useSelector((state) =>
    // @ts-ignore
    state?.user?.user?.menus?.find(
      (menu) =>
        menu.id == Number(localStorage.getItem("selectedMenuFromDrawer"))
    )
  )?.roles;

  const schema = yup.object().shape({
    ...dynamicSchema,
  });

  const {
    control,
    watch,
    reset,
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (
      (roles?.includes("ADMINISTRATIVE_OFFICER") &&
        ["APPROVE_BY_CURATOR", "REJECTED_BY_CURATOR"].includes(
          watch("applicationStatus")
        )) ||
      (roles?.includes("ENTRY") &&
        [
          "APPLICATION_CREATED",
          "APPROVE_BY_CURATOR",
          "REJECTED_BY_CURATOR",
        ].includes(watch("applicationStatus"))) ||
      (roles?.includes("APPROVAL") &&
        [
          "APPROVE_BY_CURATOR",
          "REVERT_BY_CURATOR",
          "REJECTED_BY_CURATOR",
        ].includes(watch("applicationStatus")))
    ) {
      setShowButtons(false);
    }

    //Disabling fields
    if (
      [
        "APPLICATION_CREATED",
        "APPROVE_BY_CURATOR",
        "REJECTED_BY_CURATOR",
      ].includes(watch("applicationStatus")) ||
      (roles?.includes("ENTRY") &&
        ["APPLICATION_CREATED"].includes(watch("applicationStatus"))) ||
      (roles?.includes("APPROVAL") &&
        ["REVERT_BY_CURATOR"].includes(watch("applicationStatus")))
    ) {
      setDisableState(true);
    }

    //Conditional rendering action field
    if (
      (roles?.includes("ADMINISTRATIVE_OFFICER") &&
        ["APPLICATION_CREATED"].includes(watch("applicationStatus"))) ||
      (roles?.includes("APPROVAL") &&
        ["APPLICATION_CREATED"].includes(watch("applicationStatus")))
    ) {
      setActionField(true);
    }

    //Conditional rendering remark field
    !!watch("applicationStatus") && setRemarkField(true);

    setDynamicSchema(
      roles?.includes("APPROVAL") ||
        (roles?.includes("ADMINISTRATIVE_OFFICER") &&
          ["APPLICATION_CREATED"].includes(watch("applicationStatus")))
        ? {
            action: yup
              .string()
              .required(
                language === "en"
                  ? "Please select an action."
                  : "कृपया एखादी क्रिया निवडा."
              )
              .typeError(
                language === "en"
                  ? "Please select an action."
                  : "कृपया एखादी क्रिया निवडा"
              ),
            curatorRemark: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter a remark."
                  : "कृपया एक शेरा प्रविष्ट करा."
              )
              .typeError(
                language === "en"
                  ? "Please enter a remark."
                  : "कृपया एक शेरा प्रविष्ट करा"
              ),
          }
        : {
            dateOfPostMortem: yup
              .date()
              .required(
                language === "en"
                  ? "Please select date of application"
                  : "कृपया अर्जाची तारीख निवडा"
              )
              .typeError(
                language === "en"
                  ? "Please select date of application"
                  : "कृपया अर्जाची तारीख निवडा"
              ),
            timeOfPostMortem: yup
              .string()
              .required(
                language === "en"
                  ? "Please select time of application"
                  : "कृपया अर्जाची वेळ निवडा"
              )
              .typeError(
                language === "en"
                  ? "Please select time of application"
                  : "कृपया अर्जाची वेळ निवडा"
              ),
            zooAnimalKey: yup
              .number()
              .required(
                language === "en"
                  ? "Please select an animal"
                  : "कृपया एक प्राणी निवडा"
              )
              .typeError(
                language === "en"
                  ? "Please select an animal"
                  : "कृपया एक प्राणी निवडा"
              ),
            scientificName: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter scientific name"
                  : "कृपया वैज्ञानिक नाव प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? "Please enter scientific name"
                  : "कृपया वैज्ञानिक नाव प्रविष्ट करा"
              )
              .matches(
                /^[A-Za-z\u0900-\u097F\s]+$/,
                language === "en"
                  ? "Must be only english or marathi characters"
                  : "फक्त इंग्लिश किंवा मराठी शब्द "
              ),
            personalName: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter personal name"
                  : "कृपया वैयक्तिक नाव प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? "Please enter personal name"
                  : "कृपया वैयक्तिक नाव प्रविष्ट करा"
              )
              .matches(
                /^[A-Za-z\u0900-\u097F\s]+$/,
                language === "en"
                  ? "Must be only english or marathi characters"
                  : "फक्त इंग्लिश किंवा मराठी शब्द "
              ),
            age: yup
              .string()
              .required(
                language === "en" ? `Please enter age` : "कृपया वय प्रविष्ट करा"
              )
              .typeError(
                language === "en" ? `Please enter age` : "कृपया वय प्रविष्ट करा"
              ),
            dateOfDeath: yup
              .date()
              .required(
                language === "en"
                  ? "Please select date of application"
                  : "कृपया मृत्यूची तारीख निवडा"
              )
              .typeError(
                language === "en"
                  ? "Please select date of death"
                  : "कृपया मृत्यूची तारीख निवडा"
              ),
            timeOfDeath: yup
              .string()
              .required(
                language === "en"
                  ? "Please select time of death"
                  : "कृपया मृत्यूची वेळ निवडा"
              )
              .typeError(
                language === "en"
                  ? "Please select time of death"
                  : "कृपया मृत्यूची वेळ निवडा"
              ),
            placeOfDeath: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter place of death"
                  : "कृपया मृत्यूच्या ठिकाणी प्रवेश करा"
              )
              .typeError(
                language === "en"
                  ? "Please enter place of death"
                  : "कृपया मृत्यूच्या ठिकाणी प्रवेश करा"
              )
              .matches(
                /^[A-Za-z\u0900-\u097F\s]+$/,
                language === "en"
                  ? "Must be only english or marathi characters"
                  : "फक्त इंग्लिश किंवा मराठी शब्द "
              ),
            animalDescription: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter general description of animal"
                  : "कृपया प्राण्याचे सामान्य वर्णन प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? "Please enter general description of animal"
                  : "कृपया प्राण्याचे सामान्य वर्णन प्रविष्ट करा"
              ),
            animalWeight: yup
              .string()
              .required(
                language === "en"
                  ? `Please enter animal's weight`
                  : "कृपया प्राण्याचे वजन प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? `Please enter animal's weight`
                  : "कृपया प्राण्याचे वजन प्रविष्ट करा"
              )
              .matches(
                /^[0-9\s]+$/,
                language === "en"
                  ? "Please enter only numbers"
                  : "कृपया फक्त संख्या प्रविष्ट करा"
              ),
            animalGender: yup
              .string()
              .required(
                language === "en"
                  ? `Please select sex of animal`
                  : "कृपया प्राण्याचे लिंग निवडा"
              )
              .typeError(
                language === "en"
                  ? `Please select sex of animal`
                  : "कृपया प्राण्याचे लिंग निवडा"
              ),
            historyOfIllness: yup.string().when("historyOfIllnessState", {
              is: true,
              then: yup
                .string()
                .required(
                  language === "en"
                    ? "Please enter history of illness"
                    : "कृपया आजारपणाचा इतिहास प्रविष्ट करा"
                )
                .typeError(
                  language === "en"
                    ? "Please enter history of illness"
                    : "कृपया आजारपणाचा इतिहास प्रविष्ट करा"
                ),
              otherwise: yup.string().nullable(),
            }),
            headAndNeck: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter head and neck description"
                  : "कृपया डोके आणि मानेचे वर्णन प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? "Please enter head and neck description"
                  : "कृपया डोके आणि मानेचे वर्णन प्रविष्ट करा"
              ),
            thoraxAndThoracicCavity: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter thorax and thoracic cavity description"
                  : "कृपया थोरॅक्स आणि थोरॅसिक पोकळीचे वर्णन प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? "Please enter thorax and thoracic cavity description"
                  : "कृपया थोरॅक्स आणि थोरॅसिक पोकळीचे वर्णन प्रविष्ट करा"
              ),
            abdomenAndAbdominalCavity: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter abdomen and abdominal cavity description"
                  : "कृपया उदर आणि उदर पोकळीचे वर्णन प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? "Please enter abdomen and abdominal cavity description"
                  : "कृपया उदर आणि उदर पोकळीचे वर्णन प्रविष्ट करा"
              ),
            pelvicGirdle: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter pelvic girdle description"
                  : "कृपया पेल्विक गर्डल वर्णन प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? "Please enter pelvic girdle description"
                  : "कृपया पेल्विक गर्डल वर्णन प्रविष्ट करा"
              ),
            limbs: yup
              .string()
              .required(
                language === "en"
                  ? `Please enter limbs' description`
                  : "कृपया अवयवांचे वर्णन प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? `Please enter limbs' description`
                  : "कृपया अवयवांचे वर्णन प्रविष्ट करा"
              ),
            otherExaminationOrObservation: yup
              .string()
              .required(
                language === "en"
                  ? `Please enter other examination/observation details`
                  : "कृपया इतर परीक्षा/निरीक्षण तपशील प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? `Please enter other examination/observation details`
                  : "कृपया इतर परीक्षा/निरीक्षण तपशील प्रविष्ट करा"
              ),
            blood: yup.string().when("bloodState", {
              is: true,
              then: yup
                .string()
                .required(
                  language === "en"
                    ? "Please enter blood test details"
                    : "कृपया रक्त चाचणी तपशील प्रविष्ट करा"
                )
                .typeError(
                  language === "en"
                    ? "Please enter blood test details"
                    : "कृपया रक्त चाचणी तपशील प्रविष्ट करा"
                ),
              otherwise: yup.string().nullable(),
            }),
            urine: yup.string().when("urineState", {
              is: true,
              then: yup
                .string()
                .required(
                  language === "en"
                    ? "Please enter urine test details"
                    : "कृपया मूत्र चाचणी तपशील प्रविष्ट करा"
                )
                .typeError(
                  language === "en"
                    ? "Please enter urine test details"
                    : "कृपया मूत्र चाचणी तपशील प्रविष्ट करा"
                ),
              otherwise: yup.string().nullable(),
            }),
            discharge: yup.string().when("dischargeState", {
              is: true,
              then: yup
                .string()
                .required(
                  language === "en"
                    ? "Please enter discharge test details"
                    : "कृपया डिस्चार्ज चाचणी तपशील प्रविष्ट करा"
                )
                .typeError(
                  language === "en"
                    ? "Please enter discharge test details"
                    : "कृपया डिस्चार्ज चाचणी तपशील प्रविष्ट करा"
                ),
              otherwise: yup.string().nullable(),
            }),
            biopsy: yup.string().when("biopsyState", {
              is: true,
              then: yup
                .string()
                .required(
                  language === "en"
                    ? "Please enter biopsy test details"
                    : "कृपया बायोप्सी चाचणी तपशील प्रविष्ट करा"
                )
                .typeError(
                  language === "en"
                    ? "Please enter biopsy test details"
                    : "कृपया बायोप्सी चाचणी तपशील प्रविष्ट करा"
                ),
              otherwise: yup.string().nullable(),
            }),
            opinion: yup.string(),
            disposalInstruction: yup
              .string()
              .required(
                language === "en"
                  ? `Please enter disposal instructions`
                  : "कृपया विल्हेवाट लावण्याच्या सूचना प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? `Please enter disposal instructions`
                  : "कृपया विल्हेवाट लावण्याच्या सूचना प्रविष्ट करा"
              ),
          }
    );
  }, [watch("applicationStatus"), language]);

  useEffect(() => {
    //Get Zoo Animals
    axios
      .get(`${URLs.VMS}/mstZooAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setAnimalDropDown(res.data?.mstZooAnimalList);
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });

    !!router.query.id &&
      axios
        .get(`${URLs.VMS}/trnPostMortem/getById`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { id: router.query.id },
        })
        .then((res) => {
          reset({
            ...res.data,
            timeOfDeath:
              moment(new Date()).format("YYYY-MM-DD") +
              "T" +
              res?.data?.timeOfDeath,
            timeOfPostMortem:
              moment(new Date()).format("YYYY-MM-DD") +
              "T" +
              res?.data?.timeOfPostMortem,
          });
          setFormOptions({
            historyOfIllness: res.data?.historyOfIllness,
            blood: res.data?.blood,
            urine: res.data?.urine,
            discharge: res.data?.discharge,
            biopsy: res.data?.biopsy,
          });
          setFiles(
            res.data?.attachment?.map((j) => ({
              id: j?.id,
              fileAttachmentPath: j?.fileAttachmentPath,
              fileType: j?.fileType,
            }))
          );
        })
        .catch((error) => catchExceptionHandlingMethod(error, language));
  }, []);

  useEffect(() => {
    console.log("fileee: ", files);
  }, [files]);

  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 70,
    },
    {
      headerClassName: "cellColor",

      field: "fileType",
      align: "center",

      headerAlign: "center",
      headerName: <FormattedLabel id="beforeAfter" />,
      width: 125,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "fileAttachmentPath",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="file" />,
      width: 125,
      flex: 1,
      renderCell: (params) => {
        return (
          <UploadButton
            appName="VMS"
            serviceName="PetLicense"
            filePath={params.row?.fileAttachmentPath}
            fileUpdater={() => {}}
            view
            readOnly
            onlyImage
          />
        );
      },
    },
    {
      headerClassName: "cellColor",

      field: "action",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 80,
      hide: disableState,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{
                color: "red",
              }}
              onClick={() =>
                setFiles(files?.filter((j) => j?.id != params.row.id))
              }
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];

  const addImages = () => {
    setFiles((prev) => [
      ...prev,
      {
        id: !!files?.find((obj) => obj.id == files?.length + 1)
          ? files?.length + 2
          : files?.length + 1,
        fileType: watch("fileType"),
        fileAttachmentPath: currentFile,
      },
    ]);

    setValue("fileType", "");
    setCurrentFile("");
  };

  const clearData = () => {
    if (
      roles?.includes("APPROVAL") ||
      (roles?.includes("ADMINISTRATIVE_OFFICER") &&
        ["APPLICATION_CREATED"].includes(watch("applicationStatus")))
    ) {
      reset({
        ...getValues(),
        action: "",
        curatorRemark: "",
      });
    } else {
      reset({
        curatorRemark: watch("curatorRemark"),
        dateOfPostMortem: null,
        timeOfPostMortem: null,
        zooAnimalKey: "",
        scientificName: "",
        personalName: "",
        age: "",
        dateOfDeath: null,
        timeOfDeath: null,
        placeOfDeath: "",
        animalDescription: "",
        historyOfIllness: "",
        headAndNeck: "",
        thoraxAndThoracicCavity: "",
        abdomenAndAbdominalCavity: "",
        pelvicGirdle: "",
        limbs: "",
        otherExaminationOrObservation: "",
        blood: "",
        urine: "",
        discharge: "",
        biopsy: "",
        opinion: "",
        disposalInstruction: "",
        animalWeight: "",
        animalGender: "",
      });
    }
  };

  const dataToModal = (data) => {
    const isScrutiny =
      roles?.includes("APPROVAL") ||
      (roles?.includes("ADMINISTRATIVE_OFFICER") &&
        ["APPLICATION_CREATED"].includes(watch("applicationStatus")));

    const bodyForAPI = isScrutiny
      ? {
          id: watch("id"),
          action: data?.action,
          role: "CURATOR",
          curatorRemark: data?.curatorRemark,
        }
      : {
          ...data,
          dateOfPostMortem: moment(data?.dateOfPostMortem).format("YYYY-MM-DD"),
          timeOfPostMortem: moment(data?.timeOfPostMortem).format("HH:mm:ss"),
          dateOfDeath: moment(data?.dateOfDeath).format("YYYY-MM-DD"),
          timeOfDeath: moment(data?.timeOfDeath).format("HH:mm:ss"),
          attachment: files?.map((obj) => ({
            fileAttachmentPath: obj?.fileAttachmentPath,
            fileType: obj?.fileType,
          })),
        };

    if (bodyForAPI?.attachment?.length == 0) {
      sweetAlert({
        title: language == "en" ? "Warning" : "चेतावणी",
        text:
          language == "en"
            ? "Cannot save without any files. Please upload images"
            : "फाइल जोडल्या शिवाय जतन करू शकत नाही. कृपया प्रतिमा जोडा",
        icon: "warning",
        buttons: ["Cancel", "Ok"],
      });
    } else {
      setFinalData(bodyForAPI, isScrutiny);
      setOpenPreview(true);
    }
  };

  const finalSubmit = (bodyForAPI, isScrutiny) => {
    console.log("reportData: ", bodyForAPI);

    // const isScrutiny =
    //   roles?.includes("APPROVAL") ||
    //   (roles?.includes("ADMINISTRATIVE_OFFICER") &&
    //     ["APPLICATION_CREATED"].includes(watch("applicationStatus")));

    // const bodyForAPI = isScrutiny
    //   ? {
    //       id: watch("id"),
    //       action: data?.action,
    //       role: "CURATOR",
    //       curatorRemark: data?.curatorRemark,
    //     }
    //   : {
    //       ...data,
    //       dateOfPostMortem: moment(data?.dateOfPostMortem).format("YYYY-MM-DD"),
    //       timeOfPostMortem: moment(data?.timeOfPostMortem).format("HH:mm:ss"),
    //       dateOfDeath: moment(data?.dateOfDeath).format("YYYY-MM-DD"),
    //       timeOfDeath: moment(data?.timeOfDeath).format("HH:mm:ss"),
    //       attachment: files?.map((obj) => ({
    //         fileAttachmentPath: obj?.fileAttachmentPath,
    //         fileType: obj?.fileType,
    //       })),
    //     };

    // if (bodyForAPI?.attachment?.length == 0) {
    //   sweetAlert({
    //     title: language == "en" ? "Warning" : "चेतावणी",
    //     text:
    //       language == "en"
    //         ? "Cannot save without any files. Please upload images"
    //         : "फाइल जोडल्या शिवाय जतन करू शकत नाही. कृपया प्रतिमा जोडा",
    //     icon: "warning",
    //     buttons: ["Cancel", "Ok"],
    //   });
    // } else {
    //   sweetAlert({
    //     title: language == "en" ? "Confirmation" : "पुष्टी",
    //     text:
    //       language == "en"
    //         ? "Are you sure you want to save the data?"
    //         : "तुमची खात्री आहे की तुम्ही डेटा जतन करू इच्छिता",
    //     icon: "warning",
    //     buttons: ["Cancel", "Save"],
    //   }).then((ok) => {
    //     if (ok) {
    //       axios
    //         .post(
    //           `${URLs.VMS}/trnPostMortem/${
    //             isScrutiny ? "saveApprove" : "save"
    //           }`,
    //           bodyForAPI,
    //           {
    //             headers: {
    //               Authorization: `Bearer ${userToken}`,
    //             },
    //           }
    //         )
    //         .then((res) => {
    //           if (res.status == 200 || res.status == 201) {
    //             sweetAlert(
    //               language == "en" ? "Saved" : "जतन केले",
    //               bodyForAPI?.id
    //                 ? language == "en"
    //                   ? "Data updated successfully"
    //                   : "डेटा यशस्वीरित्या अपडेट केला"
    //                 : language == "en"
    //                 ? "Data saved successfully"
    //                 : "डेटा यशस्वीरित्या डेटा जतन केला",
    //               "success"
    //             );
    //             router.push(
    //               `/veterinaryManagementSystem/transactions/postMortem`
    //             );
    //           }
    //         })
    //         .catch((error) => catchExceptionHandlingMethod(error, language));
    //     }
    //   });
    // }

    sweetAlert({
      title: language == "en" ? "Confirmation" : "पुष्टी",
      text:
        language == "en"
          ? "Are you sure you want to save the data?"
          : "तुमची खात्री आहे की तुम्ही डेटा जतन करू इच्छिता",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        axios
          .post(
            `${URLs.VMS}/trnPostMortem/${isScrutiny ? "saveApprove" : "save"}`,
            bodyForAPI,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              sweetAlert(
                language == "en" ? "Saved" : "जतन केले",
                bodyForAPI?.id
                  ? language == "en"
                    ? "Data updated successfully"
                    : "डेटा यशस्वीरित्या अपडेट केला"
                  : language == "en"
                  ? "Data saved successfully"
                  : "डेटा यशस्वीरित्या डेटा जतन केला",
                "success"
              );
              router.push(
                `/veterinaryManagementSystem/transactions/postMortem`
              );
            }
          })
          .catch((error) => catchExceptionHandlingMethod(error, language));
      }
    });
  };

  useEffect(() => {
    !router.query.id && setValue("dateOfDeath", null);
  }, [watch("dateOfPostMortem")]);

  return (
    <>
      <Head>
        <title>Post Mortem Report</title>
      </Head>
      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id="postMortemReport" />} />
        <form onSubmit={handleSubmit(dataToModal)}>
          <div className={styles.wrapped}>
            <Paper className={styles.container}>
              <FormControl
                error={!!error.dateOfPostMortem}
                style={{ marginTop: 3 }}
              >
                {/* @ts-ignore */}
                <Controller
                  control={control}
                  name="dateOfPostMortem"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        disabled={disableState}
                        disableFuture
                        inputFormat="dd/MM/yyyy"
                        label={
                          <FormattedLabel id="dateOfPostMortem" required />
                        }
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: 250 }}
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            error={!!error.dateOfPostMortem}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {error?.dateOfPostMortem
                    ? error.dateOfPostMortem.message
                    : null}
                </FormHelperText>
              </FormControl>
              <FormControl error={!!error.timeOfPostMortem}>
                {/* @ts-ignore */}
                <Controller
                  control={control}
                  name="timeOfPostMortem"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        disabled={disableState}
                        label={
                          <FormattedLabel id="timeOfPostMortem" required />
                        }
                        value={field.value}
                        onChange={(time) => {
                          field.onChange(time);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            sx={{ width: 250 }}
                            error={!!error.timeOfPostMortem}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {error?.timeOfPostMortem
                    ? error.timeOfPostMortem.message
                    : null}
                </FormHelperText>
              </FormControl>
              <FormControl
                disabled={disableState}
                variant="standard"
                error={!!error.zooAnimalKey}
              >
                <InputLabel>
                  <FormattedLabel id="zooAnimal" required />
                </InputLabel>
                {/* @ts-ignore */}
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: 250 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="zooAnimalKey"
                    >
                      {animalDropDown &&
                        animalDropDown.map((value, index) => (
                          <MenuItem key={index} value={value.id}>
                            {language == "en"
                              ? value?.animalNameEn
                              : value?.animalNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="zooAnimalKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {error?.zooAnimalKey ? error.zooAnimalKey.message : null}
                </FormHelperText>
              </FormControl>
              <TextField
                disabled={disableState}
                sx={{ width: 250 }}
                label={<FormattedLabel id="scientificName" required />}
                variant="standard"
                {...register("scientificName")}
                InputLabelProps={{ shrink: !!watch("scientificName") }}
                error={!!error.scientificName}
                helperText={
                  error?.scientificName ? error.scientificName.message : null
                }
              />
              <TextField
                disabled={disableState}
                sx={{ width: 250 }}
                label={<FormattedLabel id="personalName" required />}
                variant="standard"
                {...register("personalName")}
                InputLabelProps={{ shrink: !!watch("personalName") }}
                error={!!error.personalName}
                helperText={
                  error?.personalName ? error.personalName.message : null
                }
              />
              <TextField
                disabled={disableState}
                sx={{ width: 250 }}
                label={<FormattedLabel id="age" required />}
                variant="standard"
                {...register("age")}
                InputLabelProps={{ shrink: !!watch("age") }}
                error={!!error.age}
                helperText={error?.age ? error.age.message : null}
              />
              <FormControl error={!!error.dateOfDeath} style={{ marginTop: 3 }}>
                {/* @ts-ignore */}
                <Controller
                  control={control}
                  name="dateOfDeath"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        disabled={disableState}
                        maxDate={
                          !!watch("dateOfPostMortem")
                            ? new Date(watch("dateOfPostMortem"))
                            : new Date()
                        }
                        // disableFuture
                        inputFormat="dd/MM/yyyy"
                        // label={<FormattedLabel id='dateOfBirth' />}
                        label={<FormattedLabel id="dateOfDeath" required />}
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: 250 }}
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            error={!!error.dateOfDeath}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {error?.dateOfDeath ? error.dateOfDeath.message : null}
                </FormHelperText>
              </FormControl>
              <FormControl style={{ marginTop: 4 }} error={!!error.timeOfDeath}>
                {/* @ts-ignore */}
                <Controller
                  control={control}
                  name="timeOfDeath"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        disabled={disableState}
                        // label={<FormattedLabel id='timeOfBirth' required />}
                        label={<FormattedLabel id="timeOfDeath" required />}
                        value={field.value}
                        onChange={(time) => {
                          field.onChange(
                            moment(time).format("YYYY-MM-DDTHH:mm")
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            sx={{ width: 250 }}
                            error={!!error.timeOfDeath}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {error?.timeOfDeath ? error.timeOfDeath.message : null}
                </FormHelperText>
              </FormControl>
              <TextField
                disabled={disableState}
                sx={{ width: 250 }}
                // label={<FormattedLabel id='placeOfBirth' required />}
                label={<FormattedLabel id="placeOfDeath" required />}
                variant="standard"
                {...register("placeOfDeath")}
                InputLabelProps={{ shrink: !!watch("placeOfDeath") }}
                error={!!error.placeOfDeath}
                helperText={
                  error?.placeOfDeath ? error.placeOfDeath.message : null
                }
              />
              <TextField
                disabled={disableState}
                sx={{ width: 250 }}
                label={<FormattedLabel id="animalDescription" required />}
                variant="standard"
                {...register("animalDescription")}
                InputLabelProps={{ shrink: !!watch("animalDescription") }}
                error={!!error.animalDescription}
                helperText={
                  error?.animalDescription
                    ? error.animalDescription.message
                    : null
                }
              />
              <TextField
                disabled={disableState}
                sx={{ width: 250 }}
                label={<FormattedLabel id="animalWeight" required />}
                variant="standard"
                {...register("animalWeight")}
                InputLabelProps={{ shrink: !!watch("animalWeight") }}
                error={!!error.animalWeight}
                helperText={
                  error?.animalWeight ? error.animalWeight.message : null
                }
              />
              <FormControl error={!!error?.animalGender}>
                <Controller
                  name="animalGender"
                  control={control}
                  defaultValue={null}
                  render={({ field: { onChange, value } }) => (
                    // render={({ field }) => (
                    <Autocomplete
                      variant="standard"
                      id="controllable-states-demo"
                      sx={{ width: 250 }}
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.value : null);
                      }}
                      value={
                        [
                          { value: "Male", nameEn: "Male", nameMr: "पुरुष" },
                          {
                            value: "Female",
                            nameEn: "Female",
                            nameMr: "स्त्री",
                          },
                        ]?.find((data) => data?.value == value) || null
                      }
                      options={[
                        { value: "Male", nameEn: "Male", nameMr: "पुरुष" },
                        { value: "Female", nameEn: "Female", nameMr: "स्त्री" },
                      ]}
                      getOptionLabel={(obj) =>
                        obj[language == "en" ? "nameEn" : "nameMr"]
                      }
                      renderInput={(params) => (
                        <TextField
                          error={!!error?.animalGender}
                          fullWidth
                          {...params}
                          label={<FormattedLabel id="sex" required />}
                          variant="standard"
                        />
                      )}
                      disabled={!!router.query.id}
                    />
                  )}
                />
                <FormHelperText>
                  {error?.animalGender ? error?.animalGender?.message : null}
                </FormHelperText>
              </FormControl>

              <div className={styles.optionsField}>
                <span style={optionStyle}>
                  <FormattedLabel id="historyOfIllness" />?
                </span>
                <Checkbox
                  name="karan"
                  disabled={disableState}
                  checked={
                    formOptions?.historyOfIllness || !!watch("historyOfIllness")
                  }
                  onChange={(e) => {
                    !e.target.checked && setValue("historyOfIllness", null);
                    setFormOptions((prev) => ({
                      ...prev,
                      historyOfIllness: e.target.checked,
                    }));
                    setValue("historyOfIllnessState", e.target.checked);
                  }}
                />

                <TextField
                  disabled={!formOptions?.historyOfIllness || disableState}
                  sx={{ width: "100%" }}
                  label={<FormattedLabel id="yesThen" />}
                  variant="standard"
                  {...register("historyOfIllness")}
                  InputLabelProps={{ shrink: !!watch("historyOfIllness") }}
                  error={!!error.historyOfIllness}
                  helperText={
                    error?.historyOfIllness
                      ? error.historyOfIllness.message
                      : null
                  }
                />
              </div>
              <b
                style={{
                  fontSize: "medium",
                  textTransform: "uppercase",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <FormattedLabel id="fileUpload" />
              </b>
              {!disableState && (
                <div className={styles.imageUpload}>
                  <FormControl variant="standard" error={!!error.fileType}>
                    <InputLabel>
                      <FormattedLabel id="beforeAfter" />
                    </InputLabel>
                    {/* @ts-ignore */}
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 175 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="fileType"
                        >
                          <MenuItem key={1} value={"Before"}>
                            {language == "en" ? "Before" : "अगोदर"}
                          </MenuItem>
                          <MenuItem key={2} value={"After"}>
                            {language == "en" ? "After" : "नंतर"}
                          </MenuItem>
                        </Select>
                      )}
                      name="fileType"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {error?.fileType ? error.fileType.message : null}
                    </FormHelperText>
                  </FormControl>
                  <div>
                    <UploadButton
                      appName="VMS"
                      serviceName="PetLicense"
                      label={<FormattedLabel id="postMortemImage" required />}
                      filePath={currentFile}
                      fileUpdater={setCurrentFile}
                      onlyImage
                    />
                    <label style={{ color: "red" }}>
                      <FormattedLabel id="fileSizeImageOnly" />
                    </label>
                  </div>
                  <Button
                    variant="contained"
                    onClick={() => addImages()}
                    disabled={!watch("fileType") || !currentFile}
                    endIcon={<Add />}
                  >
                    <FormattedLabel id="add" />
                  </Button>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  width: "100%",
                }}
              >
                <DataGrid
                  autoHeight
                  sx={{
                    marginTop: "10px",
                    maxWidth: "45%",

                    "& .cellColor": {
                      backgroundColor: "#1976d2",
                      color: "white",
                    },
                  }}
                  rows={files
                    ?.filter((j) => j?.fileType == "Before")
                    .map((obj, i) => ({ ...obj, srNo: i + 1 }))}
                  //@ts-ignore
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                  hideFooter
                />
                <DataGrid
                  autoHeight
                  sx={{
                    marginTop: "10px",
                    maxWidth: "45%",

                    "& .cellColor": {
                      backgroundColor: "#1976d2",
                      color: "white",
                    },
                  }}
                  rows={files
                    ?.filter((j) => j?.fileType == "After")
                    .map((obj, i) => ({ ...obj, srNo: i + 1 }))}
                  //@ts-ignore
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                  hideFooter
                />
              </div>
            </Paper>
            <Paper className={styles.container}>
              <div className={styles.subTitle}>
                <FormattedLabel id="organWiseDescription" />
              </div>
              <TextField
                disabled={disableState}
                sx={{ width: "100%" }}
                label={<FormattedLabel id="headAndNeck" required />}
                variant="standard"
                {...register("headAndNeck")}
                InputLabelProps={{ shrink: !!watch("headAndNeck") }}
                error={!!error.headAndNeck}
                helperText={
                  error?.headAndNeck ? error.headAndNeck.message : null
                }
              />
              <TextField
                disabled={disableState}
                sx={{ width: "100%" }}
                label={<FormattedLabel id="thoraxAndThoracicCavity" required />}
                variant="standard"
                {...register("thoraxAndThoracicCavity")}
                InputLabelProps={{ shrink: !!watch("thoraxAndThoracicCavity") }}
                error={!!error.thoraxAndThoracicCavity}
                helperText={
                  error?.thoraxAndThoracicCavity
                    ? error.thoraxAndThoracicCavity.message
                    : null
                }
              />
              <TextField
                disabled={disableState}
                sx={{ width: "100%" }}
                label={
                  <FormattedLabel id="abdomenAndAbdominalCavity" required />
                }
                variant="standard"
                {...register("abdomenAndAbdominalCavity")}
                InputLabelProps={{
                  shrink: !!watch("abdomenAndAbdominalCavity"),
                }}
                error={!!error.abdomenAndAbdominalCavity}
                helperText={
                  error?.abdomenAndAbdominalCavity
                    ? error.abdomenAndAbdominalCavity.message
                    : null
                }
              />
              <TextField
                disabled={disableState}
                sx={{ width: "100%" }}
                label={<FormattedLabel id="pelvicGirdle" required />}
                variant="standard"
                {...register("pelvicGirdle")}
                InputLabelProps={{ shrink: !!watch("pelvicGirdle") }}
                error={!!error.pelvicGirdle}
                helperText={
                  error?.pelvicGirdle ? error.pelvicGirdle.message : null
                }
              />
              <TextField
                disabled={disableState}
                sx={{ width: "100%" }}
                label={<FormattedLabel id="limbs" required />}
                variant="standard"
                {...register("limbs")}
                InputLabelProps={{ shrink: !!watch("limbs") }}
                error={!!error.limbs}
                helperText={error?.limbs ? error.limbs.message : null}
              />
              <TextField
                disabled={disableState}
                sx={{ width: "100%" }}
                label={
                  <FormattedLabel id="otherExaminationOrObservation" required />
                }
                variant="standard"
                {...register("otherExaminationOrObservation")}
                InputLabelProps={{
                  shrink: !!watch("otherExaminationOrObservation"),
                }}
                error={!!error.otherExaminationOrObservation}
                helperText={
                  error?.otherExaminationOrObservation
                    ? error.otherExaminationOrObservation.message
                    : null
                }
              />
              <b style={{ fontSize: "medium", textTransform: "uppercase" }}>
                <FormattedLabel id="biologicalTests" />
              </b>
              <div className={styles.optionsField}>
                <span style={optionStyle}>
                  <FormattedLabel id="blood" />?
                </span>
                <Checkbox
                  disabled={disableState}
                  checked={formOptions?.blood || !!watch("blood")}
                  onChange={(e) => {
                    !e.target.checked && setValue("blood", null);
                    setFormOptions((prev) => ({
                      ...prev,
                      blood: e.target.checked,
                    }));
                    setValue("bloodState", e.target.checked);
                  }}
                />

                <TextField
                  disabled={!formOptions?.blood || disableState}
                  sx={{ width: "100%" }}
                  label={<FormattedLabel id="yesThen" />}
                  variant="standard"
                  {...register("blood")}
                  InputLabelProps={{ shrink: !!watch("blood") }}
                  error={!!error.blood}
                  helperText={error?.blood ? error.blood.message : null}
                />
              </div>
              <div className={styles.optionsField}>
                <span style={optionStyle}>
                  <FormattedLabel id="urine" />?
                </span>
                <Checkbox
                  disabled={disableState}
                  checked={formOptions?.urine || !!watch("urine")}
                  onChange={(e) => {
                    !e.target.checked && setValue("urine", null);
                    setFormOptions((prev) => ({
                      ...prev,
                      urine: e.target.checked,
                    }));
                    setValue("urineState", e.target.checked);
                  }}
                />

                <TextField
                  disabled={!formOptions?.urine || disableState}
                  sx={{ width: "100%" }}
                  label={<FormattedLabel id="yesThen" />}
                  variant="standard"
                  {...register("urine")}
                  InputLabelProps={{ shrink: !!watch("urine") }}
                  error={!!error.urine}
                  helperText={error?.urine ? error.urine.message : null}
                />
              </div>
              <div className={styles.optionsField}>
                <span style={optionStyle}>
                  <FormattedLabel id="discharge" />?
                </span>
                <Checkbox
                  disabled={disableState}
                  checked={formOptions?.discharge || !!watch("discharge")}
                  onChange={(e) => {
                    !e.target.checked && setValue("discharge", null);
                    setFormOptions((prev) => ({
                      ...prev,
                      discharge: e.target.checked,
                    }));
                    setValue("dischargeState", e.target.checked);
                  }}
                />

                <TextField
                  disabled={!formOptions?.discharge || disableState}
                  sx={{ width: "100%" }}
                  label={<FormattedLabel id="yesThen" />}
                  variant="standard"
                  {...register("discharge")}
                  InputLabelProps={{ shrink: !!watch("discharge") }}
                  error={!!error.discharge}
                  helperText={error?.discharge ? error.discharge.message : null}
                />
              </div>
              <div className={styles.optionsField}>
                <span style={optionStyle}>
                  <FormattedLabel id="biopsy" />?
                </span>
                <Checkbox
                  disabled={disableState}
                  checked={formOptions?.biopsy || !!watch("biopsy")}
                  onChange={(e) => {
                    !e.target.checked && setValue("biopsy", null);
                    setFormOptions((prev) => ({
                      ...prev,
                      biopsy: e.target.checked,
                    }));
                    setValue("biopsyState", e.target.checked);
                  }}
                />

                <TextField
                  disabled={!formOptions?.biopsy || disableState}
                  sx={{ width: "100%" }}
                  label={<FormattedLabel id="yesThen" />}
                  variant="standard"
                  {...register("biopsy")}
                  InputLabelProps={{ shrink: !!watch("biopsy") }}
                  error={!!error.biopsy}
                  helperText={error?.biopsy ? error.biopsy.message : null}
                />
              </div>
              <TextField
                disabled={disableState}
                sx={{ width: "100%" }}
                label={<FormattedLabel id="opinionIfAny" />}
                variant="standard"
                {...register("opinion")}
                InputLabelProps={{ shrink: !!watch("opinion") }}
                error={!!error.opinion}
                helperText={error?.opinion ? error.opinion.message : null}
              />
              <TextField
                disabled={disableState}
                sx={{ width: "100%" }}
                label={<FormattedLabel id="disposalInstruction" required />}
                variant="standard"
                {...register("disposalInstruction")}
                InputLabelProps={{ shrink: !!watch("disposalInstruction") }}
                error={!!error.disposalInstruction}
                helperText={
                  error?.disposalInstruction
                    ? error.disposalInstruction.message
                    : null
                }
              />
            </Paper>
            {remarkField && (
              <Paper
                className={styles.container}
                style={{ justifyContent: "space-evenly" }}
              >
                {actionField && (
                  <FormControl variant="standard" error={!!error.action}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="actions" />
                    </InputLabel>
                    {/* @ts-ignore */}
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 200 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          // @ts-ignore
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="action"
                        >
                          <MenuItem key={1} value={"APPROVE"}>
                            {language === "en" ? "Approve" : "मंजूर"}
                          </MenuItem>
                          {/* <MenuItem key={3} value={'revert'}>
                            {language === 'en' ? 'Revert' : 'मागे'}
                          </MenuItem>
                          <MenuItem key={2} value={'reject'}>
                            {language === 'en' ? 'Reject' : 'नामंजूर'}
                          </MenuItem> */}
                        </Select>
                      )}
                      name="action"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {error?.action ? error.action.message : null}
                    </FormHelperText>
                  </FormControl>
                )}
                <TextField
                  sx={{ width: actionField ? "75%" : "100%" }}
                  disabled={
                    !["APPLICATION_CREATED"].includes(
                      watch("applicationStatus")
                    ) || roles?.includes("ENTRY")
                  }
                  label={<FormattedLabel id="curatorRemark" required />}
                  variant="standard"
                  {...register("curatorRemark")}
                  InputLabelProps={{ shrink: !!watch("curatorRemark") }}
                  error={!!error.curatorRemark}
                  helperText={
                    error?.curatorRemark ? error.curatorRemark.message : null
                  }
                />
              </Paper>
            )}
          </div>
          <div className={styles.buttons}>
            {showButtons && (
              <>
                <Button
                  variant="contained"
                  endIcon={<Save />}
                  color="success"
                  type="submit"
                >
                  <FormattedLabel id="save" />
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<Clear />}
                  color="error"
                  onClick={() => clearData()}
                >
                  <FormattedLabel id="clear" />
                </Button>
              </>
            )}

            <Button
              variant="contained"
              endIcon={<ExitToApp />}
              color="error"
              onClick={() => router.back()}
            >
              <FormattedLabel id="exit" />
            </Button>
          </div>
        </form>
        <Modal open={openPreview}>
          <>
            <PostMortemPreview data={finalData} />
          </>
          <center style={{ marginTop: 20 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => finalSubmit(finalData)}
            >
              <FormattedLabel id="save" />
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenPreview(false)}
              style={{ marginLeft: 50 }}
            >
              <FormattedLabel id="cancel" />
            </Button>
          </center>
        </Modal>
      </Paper>
    </>
  );
};

export default View;

const Modal = ({ open, children }) => {
  useEffect(() => {
    document.body.setAttribute(
      "style",
      `overflow: ${open ? "hidden" : "auto"}`
    );
  }, [open]);

  return (
    <div>
      {open && (
        <div className={styles.modalWrapper} style={{ opacity: open ? 1 : 0 }}>
          <div className={styles.modal}>{children}</div>
        </div>
      )}
    </div>
  );
};

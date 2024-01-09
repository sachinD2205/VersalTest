import { Delete, Visibility } from "@mui/icons-material";
import { Button, IconButton, Paper, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import urls from "../../../URLS/urls";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../util/commonErrorUtil";
import DocumentUploadTableSachinCSS from "./DocumentUploadTableSachin.module.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  DecryptData,
  EncryptData,
} from "../../../components/common/EncryptDecrypt";
//todo --- Sachin_Durge :🤯
//! Note -- for hide delete and uplaod button apply follwing
// setValue("documentUploadButtonSachinInputState",false); //!for Document upload button hide
// setValue("documentUploadSachinDeleteButtonInputState",false); //! !forDelte Button Hide
const Index = (props) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext({
    criteriaMode: "all",
    mode: "onChange",
  });
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const logedInUser = localStorage.getItem("loggedInUser");
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    console.log("dataurl", dataurl);
    if (dataurl) {
      var arr = dataurl?.split(","),
        mime = arr[0]?.match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
    }

    return new File([u8arr], filename, { type: mime });
  };
  const getFileFromUrl = (url, name, defaultType = "image/jpeg") => {
    // const response = await fetch(url);
    // const data = await response.blob();
    // const temp = new File([data], name, {
    //   type: data.type || defaultType,
    // });
    // const temp = await blobToImage(data)
    console.log("datadata", url);

    var temp = dataURLtoFile(url, name);

    return temp;
  };

  // handleFileUpload
  const handleFileUpload = (e) => {
    console.log('e', e)
    setValue("loadderState", true);

    const allowedFileTypes = [
      "application/pdf",
      // "audio/*",
      // "video/*",
      "audio/mpeg", // for audio files
      "video/mp4", // for video files
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/png",
    ];
    // const maxFileSize = 26214400; // 2MB
    const maxFileSize = 25 * 1024 * 1024; // 25MB

    const file = e.target.files[0];
      //! extension only
      const fileExtension = file?.name?.split(".")[file?.name?.split(".").length - 1];
      //! without extension
      const fileNameWithoutExtension = file?.name?.split("." + fileExtension)[0];
      //! regex --- letter/numbers/hypens/underscore
      const fileNameRegex = /^[a-zA-Z0-9_\s\u0900-\u097F]+$/;
      // const fileNameRegex = /^[a-zA-Z0-9_-]+$/;
      if(fileNameRegex.test(fileNameWithoutExtension)){
    if (
      file &&
      allowedFileTypes.includes(file.type) &&
      file.size <= maxFileSize 
    ) {
      let formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("appName", "GM");
      formData.append("serviceName", "GM-CMPL");

      // api
      axios
        .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            let tempUploadedData = {
              filePath: res?.data?.filePath,
              documentType: res?.data?.extension.split(".")[1].toUpperCase(),
              attachedDate: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"),
              attachedDate1:
                logedInUser === "departmentUser"
                  ? moment(new Date()).format("DD-MM-YYYY HH:mm:ss")
                  : moment(new Date()).format("DD-MM-YYYY"),
              originalFileName: res?.data?.fileName.split(".")[0].toUpperCase(),
              activeFlag: "Y",
            };
            setValue("currentDocument", tempUploadedData);
            setValue("loadderState", false);
            toast.success(
              language == "en"
                ? "File uploaded successfully"
                : "फाइल यशस्वीरित्या अपलोड झाली",
              {
                position: toast.POSITION.TOP_RIGHT,
              }
            );
          } else {
            setValue("loadderState", false);
            let fileInput = document.getElementById("fileInputSachin");
            fileInput.value = "";
            toast.error(
              language == "en" ? "File not uploaded" : "फाइल अपलोड केली नाही",
              {
                position: toast.POSITION.TOP_RIGHT,
              }
            );
          }
        })
        .catch((err) => {
          let fileInput = document.getElementById("fileInputSachin");
          fileInput.value = "";
          setValue("loadderState", false);
          // toast.error(
          //   language == "en" ? "File not uploaded" : "फाइल अपलोड केली नाही",
          //   {
          //     position: toast.POSITION.TOP_RIGHT,
          //   }
          // );
          cfcErrorCatchMethod(err, true);
        });
    } else {
      setValue("loadderState", false);
      let fileInput = document.getElementById("fileInputSachin");
      fileInput.value = "";
      swal(
        language == "en"
          ? "Invalid file type or size. File type must be PDF, audio, video, JPG, JPEG, GIF, and size should not exceed 25MB."
          : "अवैध फाइल प्रकार किंवा आकार. फाइल प्रकार PDF, ऑडियो, व्हिडिओ, JPG, JPEG, GIF हे असावे लागतात आणि आकार 25MB पेक्षा जास्त असू नये.",
        { icon: "error", button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  }else{
    setValue("loadderState", false);
      let fileInput = document.getElementById("fileInputSachin");
      fileInput.value = "";
    swal({
      text:
        language == "en"
          ? "The file name can only contain letters, numbers, hyphens, and underscores. Special characters are not allowed"
          : "फाइलचे नाव किव्हा अक्षर, अंक, हायफन आणि अंडरस्कोरच्या प्रकारे असावे. विशेष वर्णांकीत नको",
      icon: "error",
      buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
    });
  }
  };

  const getFilePreview = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r?.data?.mimeType == "application/pdf") {
          const byteCharacters = atob(r?.data?.fileName);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const newTab = window.open();
          newTab.location.href = url;
        }
        // for img
        else if (r?.data?.mimeType == "image/jpeg") {
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
        } else if (r?.data?.mimeType == "video/mp4") {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
        <html>
          <body style="margin: 0;">
            <video width="100%" height="100%" controls>
              <source src="${dataUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </body>
        </html>
      `);
        } else if (r?.data?.mimeType == "audio/mpeg") {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
  <html>
    <body style="margin: 0;">
      <audio controls>
        <source src="${dataUrl}" type="audio/mpeg">
        Your browser does not support the audio tag.
      </audio>
    </body>
  </html>
`);
        } else {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          console.log("dataUrl", dataUrl);
          const newTab = window.open();
          newTab.document.write(`
              <html>
                <body style="margin: 0;">
                  <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
                </body>
              </html>
            `);
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // Delete
  const deleteFileUpload = async (filePath) => {
    swal({
      title: language == "en" ? "Delete ?" : "हटवा ?",
      text:
        language == "en"
          ? "Are you sure you want to delete the file ?"
          : "तुम्हाला खात्री आहे की तुम्ही फाइल हटवू इच्छिता ?",
      icon: "warning",
      buttons: true,
      buttons: [
        language == "en" ? "Cancel" : "रद्द करा",
        language == "en" ? "OK" : "ठीक आहे",
      ],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        
        setValue("loadderState", true);
        let Document = watch("uploadedDocumentAll").find((data) => {
          return data?.filePath == filePath;
        });
        // deletedDocument
        let deletedDocument = {
          filePath: Document?.filePath,
          documentType: Document?.documentType,
          attachedDate: Document?.attachedDate,
          attachedDate1: Document?.attachedDate1,
          originalFileName: Document?.originalFileName,
          activeFlag: "N",
        };

        if (
          watch("uploadedDocumentAll") != null &&
          watch("uploadedDocumentAll") != undefined &&
          watch("uploadedDocumentAll") != "" &&
          watch("uploadedDocumentAll").length != 0
        ) {
          let filterDeletedDocument = watch("uploadedDocumentAll")?.filter(
            (data) => data?.filePath != filePath
          );
          setValue("uploadedDocumentAll", [
            ...filterDeletedDocument,
            deletedDocument,
          ]);
        } else {
          setValue("uploadedDocumentAll", [deletedDocument]);
        }
        setValue("loadderState", false);
        swal(
          language == "en"
            ? "File Deleted Successfully!"
            : "फाइल यशस्वीरित्या हटवली!",
          { icon: "success", button: language === "en" ? "Ok" : "ठीक आहे" }
        );
      } else {
        swal(language == "en" ? "File is Safe!" : "फाइल सुरक्षित आहे!", {
          icon: "success",
          button: language === "en" ? "Ok" : "ठीक आहे",
        });
      }
    });
  };

  // DocumentUploadTableSachinColumns
  const DocumentUploadTableSachinColumns = [
    {
      field: "originalFileName",
      headerName: language == "en" ? "Original File Name" : "मूळ फाइल नाव",
      headerAlign: "center",
      align: "left",
      // flex: 1,
      width: "250",
    },
    {
      field: "transactionType",
      headerName: language == "en" ? "Action" : "कृती",
      headerAlign: "center",
      align: "left",
      flex: 1,
      width: "250",
    },
    {
      field: "documentType",
      headerName: language == "en" ? "File Type" : "दस्तऐवजाचा प्रकार",
      headerAlign: "center",
      align: "left",
      flex: 1,
      width: "250",
    },
    {
      field: "attachedDate1",
      headerName:
        language == "en" ? "Document Attached Date" : "दस्तऐवज संलग्न तारीख",
      headerAlign: "center",
      align: "left",
      flex: 1,
      width: "250",
    },
    {
      field: "Action",
      headerName: language == "en" ? "View" : "पहा",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: "50",
      renderCell: (record) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <IconButton
              color="primary"
              onClick={async () => {
                getFilePreview(record?.row?.filePath);
              }}
            >
              <Visibility />
            </IconButton>
            {watch("documentUploadSachinDeleteButtonInputState") != false ? (
              <IconButton
                color="error"
                onClick={() => deleteFileUpload(record?.row?.filePath)}
              >
                <Delete />
              </IconButton>
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setValue("loadderState", false);
  }, []);

  useEffect(() => {
    if (
      watch("currentDocument") != null &&
      watch("currentDocument") != undefined &&
      watch("currentDocument") != ""
    )
      if (
        watch("uploadedDocumentAll") != null &&
        watch("uploadedDocumentAll") != undefined &&
        watch("uploadedDocumentAll") != "" &&
        watch("uploadedDocumentAll").length != 0
      ) {
        setValue("uploadedDocumentAll", [
          ...watch("uploadedDocumentAll"),
          watch("currentDocument"),
        ]);
        setValue("currentDocument", null);
      } else {
        setValue("uploadedDocumentAll", [watch("currentDocument")]);
        setValue("currentDocument", null);
      }
  }, [watch("currentDocument")]);

  useEffect(() => {
    console.log("uploadedDocumentAll", watch("uploadedDocumentAll"));
    if (
      watch("uploadedDocumentAll") != null &&
      watch("uploadedDocumentAll") != undefined &&
      watch("uploadedDocumentAll") != "" &&
      watch("uploadedDocumentAll").length != 0
    ) {
      let DocumentUploaded = watch("uploadedDocumentAll");

      let withSrNoDocumentUploaded = DocumentUploaded?.map((data, index) => {
        console.log("tempUploadedData data ", data);
        let attachedDate1 = data.attachedDate1;
        if (!attachedDate1) {
          attachedDate1 =
            logedInUser === "departmentUser"
              ? moment(data.attachedDate).format("DD-MM-YYYY HH:mm:ss")
              : moment(data.attachedDate).format("DD-MM-YYYY");
        }

        return {
          ...data,
          attachedDate1,
          srNo: index + 1,
        };
      });
      console.log("tempUploadedData", withSrNoDocumentUploaded);
      setValue("documentUploadTable", withSrNoDocumentUploaded);
    } else {
      setValue("documentUploadTable", []);
    }
  }, [watch("uploadedDocumentAll")]);

  useEffect(() => {
    if (
      watch("documentUploadTable") != null &&
      watch("documentUploadTable") != undefined &&
      watch("documentUploadTable") != "" &&
      watch("documentUploadTable").length != 0
    ) {
      let activeFlagYDocument = watch("documentUploadTable").filter(
        (data) => data?.activeFlag == "Y"
      );
      console.log(
        "activeFlagYDocument ",
        activeFlagYDocument.map((temp) => {
          if (temp.transactionType === "ROC") {
            return { ...temp, transactionType: "Reopen" };
          } else if (temp.transactionType === "RC") {
            return { ...temp, transactionType: "Register" };
          } else if (temp.transactionType === "CC") {
            return { ...temp, transactionType: "Close" };
          }
        })
      );
      setValue(
        "documentUploadTableActiveFlagY",
        activeFlagYDocument.map((temp) => {
          if (temp.transactionType === "ROC") {
            return { ...temp, transactionType: "Reopen" };
          } else if (temp.transactionType === "RC") {
            return { ...temp, transactionType: "Register" };
          } else if (temp.transactionType === "CC") {
            return { ...temp, transactionType: "Close" };
          } else {
            return { ...temp, transactionType: "" };
          }
        })
      );
    } else {
      setValue("documentUploadTableActiveFlagY", []);
    }
  }, [watch("documentUploadTable")]);

  // View
  return (
    <>
      {watch("loadderState") && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            position: "fixed",
            zIndex: "9999",
            top: 0,
            left: 0,
          }}
        >
          <Paper
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "50%",
              padding: 8,
            }}
            elevation={8}
          >
            <CircularProgress color="success" />
          </Paper>
        </div>
      )}

      {/** UploadButton */}

      <div className={DocumentUploadTableSachinCSS.UploadButtonPoisition}>
        {props.isButton && (
          <>
            <div>
              <b
                style={{
                  textAlign: "center",
                  color: "red",
                  marginRight: "4px",
                }}
              >
                {language === "en"
                  ? "Attachment size should be less than or equal to 25mb"
                  : "संलग्नक आकार 25mb पेक्षा कमी किंवा समान असावा"}
              </b>
              <p>
                {language === "en"
                  ? "(Documents Attachments pdf/audio/video/jpeg/jpg/gif/png"
                  : "(दस्तऐवज संलग्नक pdf/audio/video/jpeg/jpg/gif/png)"}
              </p>
            </div>
            <div>
              <Button
                startIcon={<FileUploadIcon />}
                variant="contained"
                size="small"
                component="label"
                type="button"
                style={{ zIndex: 0 }}
              >
                <input
                  type="file"
                  id="fileInputSachin"
                  onChange={(e) => {
                    handleFileUpload(e);
                  }}
                  hidden
                />
                {language == "en" ? "Document Upload" : "दस्तऐवज अपलोड करा"}
              </Button>
            </div>
          </>
        )}
      </div>

      <div className={DocumentUploadTableSachinCSS.UploadTextPoisition}>
        <DataGrid
          getRowId={(data) => data?.srNo}
          sx={{
            overflowY: "scroll",
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },

            "& .MuiDataGrid-cell:hover": {},
          }}
          autoHeight
          disableSelectionOnClick
          //rows
          rows={
            watch("documentUploadTableActiveFlagY") != null &&
            watch("documentUploadTableActiveFlagY") != undefined &&
            watch("documentUploadTableActiveFlagY") != ""
              ? watch("documentUploadTableActiveFlagY")
              : []
          }
          columns={DocumentUploadTableSachinColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
    </>
  );
};

export default Index;

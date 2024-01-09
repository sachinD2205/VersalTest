import { Delete, Visibility } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UploadButton from "./UploadButton";

import {
  addDocumentToLocalStorage,
  getDocumentFromLocalStorage,
  removeDocumentToLocalStorage,
} from "../../../components/redux/features/GrievanceMonitoring/grievanceMonitoring";
import urls from "../../../URLS/urls";
import FileTable from "./FileUpload";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../util/commonErrorUtil";
import {
  DecryptData,
  EncryptData,
} from "../../../components/common/EncryptDecrypt";

const Documents = (props) => {
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  /////////////////////////////////////////////////////
  const [bsupDocuments, setbsupDocuments] = useState([]);
  /////////////////////////////////////////////////////

  const [uploading, setUploading] = useState(false);
  const [mainFiles, setMainFiles] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();
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

  const getFilePreview = (filePath) => {
    console.log("filePath", filePath);
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
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
        } else {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
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

  // Columns
  const columns = [
    {
      field: "originalFileName",
      headerName: "FileName",

      // minWidth: 50,
      // maxWidth: 180,
      headerAlign: "center",
      align: "center",
      // flex: 1,
      minWidth: 350,
      // renderCell: (record) => {
      //   console.log(":50", record)
      //   let naming = record.value.substring(
      //     record.value.lastIndexOf("__") + 2,
      //     record.value.length
      //   )
      //   return <div>{naming}</div>
      // },
    },
    // {
    //   field: "documentType",
    //   headerName: "File Type",
    //   headerAlign: "center",
    //   align: "center",
    //   flex: 1,
    // },
    {
      field: "fileType",
      headerName: "File Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },

    // {
    //   field: "userName",
    //   headerName: "Uploaded By",
    //   // field: language === "en" ? "attachedNameEn" : "attachedNameMr",
    //   headerAlign: "center",
    //   align: "center",
    //   flex: 1,
    // },
    // {
    //   field: "attachedDate",
    //   headerName: "Attached Date",

    //   headerAlign: "center",
    //   align: "center",
    //   flex: 1,
    // },
    {
      field: "Action",
      headerName: "Actions",
      // <FormattedLabel id="actionns" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (record) => {
        console.log("record?.row?.attachmentName", record.row);
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
                getFilePreview(record?.row?.documentPath);
              }}
            >
              <Visibility />
            </IconButton>

            {/* {buttonInputStateNew && (
              <IconButton color="error" onClick={() => discard(record.row)}>
                <Delete />
              </IconButton>
            )} */}
            {/* 
            <IconButton color="error" onClick={() => discard(record.row)}>
              <Delete />
            </IconButton> */}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (getDocumentFromLocalStorage("bsupDocuments") !== null) {
      setbsupDocuments(getDocumentFromLocalStorage("bsupDocuments"));
    }
  }, []);

  useEffect(() => {
    console.log("additionalFiles1: ", [...mainFiles, ...additionalFiles]);
    setbsupDocuments([...mainFiles, ...additionalFiles]);

    addDocumentToLocalStorage("bsupDocuments", [...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    setButtonInputStateNew(props?.buttonInputStateNew);
    console.log("document props :", props);
  }, [props]);

  useEffect(() => {}, [buttonInputStateNew]);

  useEffect(() => {
    setAdditionalFiles(
      props?.file.map((val) => {
        return val;
      }),
    );
    setAttachedFile(
      props?.file.map((val) => {
        return val;
      }),
    );
  }, [props]);

  return (
    <>
      <Paper
        style={{
          // marginLeft: "15vh",
          // marginRight: "17vh",
          marginTop: "2vh",
          marginBottom: "5vh",
        }}
        elevation={4}
      >
        <FileTable
          appName="BSUP-Scheme" //Module Name
          serviceName={"BSUP-BachatgatRegistration"} //Transaction Name
          fileName={attachedFile} //State to attach file
          filePath={setAttachedFile} // File state upadtion function
          newFilesFn={setAdditionalFiles} // File data function
          columns={columns} //columns for the table
          rows={bsupDocuments} //state to be displayed in table
          uploading={setUploading}
          buttonInputStateNew={buttonInputStateNew}
        />
      </Paper>
    </>
  );
};

export default Documents;

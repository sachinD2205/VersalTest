import { Delete, Visibility } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UploadButton from "./UploadButton";
import { EncryptData,DecryptData } from "../../../components/common/EncryptDecrypt";
import {
  addDocumentToLocalStorage,
  getDocumentFromLocalStorage,
  removeDocumentToLocalStorage,
} from "../../../components/redux/features/GrievanceMonitoring/grievanceMonitoring";
import urls from "../../../URLS/urls";
import FileTable from "./FileUpload";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const Documents = (props) => {
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [GrievanceRelatedDocuments, setGrievanceRelatedDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [mainFiles, setMainFiles] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();
  const logedInUser = localStorage.getItem("loggedInUser");
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const headers = { Authorization: `Bearer ${userToken}` };
  // Delete
  const discard = async (props) => {
    console.log("propsDelete", props);
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
        axios
          .delete(`${urls.CFCURL}/file/discard?filePath=${props.documentPath}`, {
            headers: headers,
          })
          .then((res) => {
            if (res.status == 200) {
              let attachement = getDocumentFromLocalStorage(
                "GrievanceRelatedDocuments"
              )
                ?.filter((a) => a?.documentPath != props.documentPath)
                ?.map((a) => a);
                console.log("attachement",attachement)
              setAdditionalFiles(attachement);
              removeDocumentToLocalStorage("GrievanceRelatedDocuments");
              addDocumentToLocalStorage(
                "GrievanceRelatedDocuments",
                attachement
              );
              swal(
                language == "en"
                  ? "File Deleted Successfully!"
                  : "फाइल यशस्वीरित्या हटवली!",
                { icon: "success" }
              );
            } else {
              swal("Something went wrong..!!!");
            }
          });
      }
    });
  };
  const getFilePreview = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
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
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const newTab = window.open();
          newTab.location.href = url;
        }
        // for img
       else if (r?.data?.mimeType == "image/jpeg") {
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
        }else {
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
      .catch((error) => {
        console.log("CatchPreviewApi", error)
      });
  }

  // Columns
  const columns = [
    {
      field: "originalFileName",
      headerName: <FormattedLabel id="originalFileName" />,
      headerAlign: "center",
      align: "center",
      minWidth: 350,
    },
    {
      field: "documentType",
      headerName: <FormattedLabel id="fileType" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "attachedDate",
      headerName: <FormattedLabel id="attachedDate" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actionns" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (record) => {
        console.log("record?.row?.attachmentName", record);
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
              onClick={() => {
                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
                //   "_blank"
                // );
                getFilePreview(record?.row?.filePath)
              }}
            >
              <Visibility />
            </IconButton>

            <IconButton color="error" onClick={() => discard(record.row)}>
              <Delete />
            </IconButton>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (getDocumentFromLocalStorage("GrievanceRelatedDocuments") !== null) {
    }
  }, []);

  useEffect(() => {
    setGrievanceRelatedDocuments([...mainFiles, ...additionalFiles]);

    addDocumentToLocalStorage("GrievanceRelatedDocuments", [
      ...mainFiles,
      ...additionalFiles,
    ]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    setButtonInputStateNew(props?.buttonInputStateNew);
  }, [props]);

  useEffect(() => {}, [buttonInputStateNew]);

  return (
    <>
      <Paper
        style={{
          marginTop: "2vh",
          marginBottom: "5vh",
        }}
        elevation={4}
      >
        <FileTable
          appName="GM" //Module Name
          serviceName={"GM-CMPL"} //Transaction Name
          fileName={attachedFile} //State to attach file
          filePath={setAttachedFile} // File state upadtion function
          newFilesFn={setAdditionalFiles} // File data function
          columns={columns} //columns for the table
          rows={GrievanceRelatedDocuments} //state to be displayed in table
          uploading={setUploading}
          buttonInputStateNew={buttonInputStateNew}
        />
      </Paper>
    </>
  );
};

export default Documents;

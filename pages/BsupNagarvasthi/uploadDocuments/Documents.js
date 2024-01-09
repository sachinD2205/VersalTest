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
} from "../../../components/bsupNagarVasthi/LocalStorageFunctions/bsupDoc";
import urls from "../../../URLS/urls";
import FileTable from "./FileUpload";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../util/commonErrorUtil";
import { DecryptData,EncryptData } from "../../../components/common/EncryptDecrypt";

const Documents = (props) => {
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [bsupDocuments, setbsupDocuments] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [mainFiles, setMainFiles] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();

  const user = useSelector((state) => state.user.user);

  const headers = { Authorization: `Bearer ${user.token}` };

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

  // Delete
  const discard = async (props) => {
    swal({
      title: "Delete?",
      text:
        language === "en"
          ? "Are you sure you want to delete the file ? "
          : "तुम्हाला नक्की फाइल हटवायची आहे का ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.CFCURL}file/discardEncrypted?filePath=${props.documentPath}`,
            { headers: headers }
          )
          .then((res) => {
            if (res.status == 200) {
              let attachement = getDocumentFromLocalStorage("bsupDocuments")
                ?.filter((a) => a?.documentPath != props.documentPath)
                ?.map((a) => a);
              setAdditionalFiles(attachement);
              addDocumentToLocalStorage("bsupDocuments", attachement);
              swal(
                language === "en"
                  ? "File Deleted Successfully!"
                  : "फाइल यशस्वीरित्या हटवली!",
                { icon: "success" }
              );
            } else {
              swal(
                language === "en"
                  ? "Something went wrong!"
                  : "काहीतरी चूक झाली!"
              );
            }
          })
          .catch((err) => {
            cfcErrorCatchMethod(err, true);
          });
      }
    });
  };
  // const discard = async (props) => {
  //   swal({
  //     title: "Delete?",
  //     text:
  //       language === "en"
  //         ? "Are you sure you want to delete the file ? "
  //         : "तुम्हाला नक्की फाइल हटवायची आहे का ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(
  //           `${urls.CFCURL}/file/discard?filePath=${props.documentPath}`,
  //           { headers: headers }
  //         )
  //         .then((res) => {
  //           if (res.status == 200) {
  //             let attachement = getDocumentFromLocalStorage("bsupDocuments")
  //               ?.filter((a) => a?.documentPath != props.documentPath)
  //               ?.map((a) => a);
  //             setAdditionalFiles(attachement);
  //             addDocumentToLocalStorage("bsupDocuments", attachement);
  //             swal(
  //               language === "en"
  //                 ? "File Deleted Successfully!"
  //                 : "फाइल यशस्वीरित्या हटवली!",
  //               { icon: "success" }
  //             );
  //           } else {
  //             swal(
  //               language === "en"
  //                 ? "Something went wrong!"
  //                 : "काहीतरी चूक झाली!"
  //             );
  //           }
  //         })
  //         .catch((err) => {
  //           cfcErrorCatchMethod(err, true);
  //         });
  //     }
  //   });
  // };

  // const getFilePreview = (filePath) => {
  //   const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
  //   axios
  //     .get(url, {
  //       headers: headers,
  //     })
  //     .then((r) => {
  //       if (r?.data?.mimeType == "application/pdf") {
  //         const byteCharacters = atob(r?.data?.fileName);
  //         const byteNumbers = new Array(byteCharacters.length);
  //         for (let i = 0; i < byteCharacters.length; i++) {
  //           byteNumbers[i] = byteCharacters.charCodeAt(i);
  //         }
  //         const byteArray = new Uint8Array(byteNumbers);
  //         const blob = new Blob([byteArray], { type: "application/pdf" });
  //         const url = URL.createObjectURL(blob);
  //         const newTab = window.open();
  //         newTab.location.href = url;
  //       }
  //       // for img
  //       else if (r?.data?.mimeType == "image/jpeg") {
  //         const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
  //         const newTab = window.open();
  //         newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
  //       } else {
  //         const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
  //         const newTab = window.open();
  //         newTab.document.write(`
  //           <html>
  //             <body style="margin: 0;">
  //               <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
  //             </body>
  //           </html>
  //         `);
  //       }
  //     })
  //     .catch((err) => {
  //       cfcErrorCatchMethod(err, true);
  //     });
  // };

  const getFilePreview = (filePath) => {
    console.log("filePath", filePath);
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
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
      minWidth: 350,
    },
    {
      field: "documentType",
      headerName: <FormattedLabel id="fileType" />,
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "attachedDate",
      headerName: <FormattedLabel id="attachedDate" />,

      headerAlign: "center",
      align: "center",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      flex: 1,
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
                getFilePreview(record?.row?.documentPath);
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
    if (getDocumentFromLocalStorage("bsupDocuments") !== null) {
      setbsupDocuments(getDocumentFromLocalStorage("bsupDocuments"));
    }
  }, []);

  useEffect(() => {
    console.log("additionalFiles1: ", [...mainFiles, ...additionalFiles]);
    setbsupDocuments([...mainFiles, ...additionalFiles]);

    addDocumentToLocalStorage("bsupDocuments", [
      ...mainFiles,
      ...additionalFiles,
    ]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    setButtonInputStateNew(props?.buttonInputStateNew);
    console.log("document props :", attachedFile);
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
          appName={props.appName} //Module Name
          serviceName={props.serviceName} //Transaction Name
          fileName={attachedFile} //State to attach file
          filePath={setAttachedFile} // File state upadtion function
          newFilesFn={setAdditionalFiles} // File data function
          columns={columns} //columns for the table
          rows={bsupDocuments}
          uploading={setUploading}
          buttonInputStateNew={buttonInputStateNew}
        />
      </Paper>
    </>
  );
};

export default Documents;

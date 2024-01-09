import { Delete, Visibility } from "@mui/icons-material";
import { IconButton, Paper, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import FileTableNotice from "../../FileUpload/FileTableNotice";
import { useRouter } from "next/router";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { saveAs } from "file-saver";
import Loader from "../../../../containers/Layout/components/Loader";

import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";

const Documents = (props) => {
  const [attachedFile, setAttachedFile] = useState("");
  const [activeFlag, setActiveFlag] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [noticeAttachment, setNoticeAttachment] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [mainFiles, setMainFiles] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();
  const [noticeAttachmentFiltered, setNoticeAttachmentFiltered] = useState();
  const [deleteButtonInputState, setDeleteButtonInputState] = useState(true);
  const router = useRouter();
  const token = useSelector((state) => state.user.user.token);
  const [loading, setLoading] = useState(false);

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

  //view----------------------------------------------------------------
  // const viewFile = (filePath) => {
  //   console.log("filePath", filePath);
  //   if (filePath?.includes(".pdf")) {
  //     setLoading(true);
  //     const url = `${urls.CFCURL}/file/preview?filePath=${filePath}`;
  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         responseType: "arraybuffer",
  //       })
  //       .then((response) => {
  //         setLoading(false);
  //         if (response && response.data instanceof ArrayBuffer) {
  //           const pdfBlob = new Blob([response.data], {
  //             type: "application/pdf",
  //           });
  //           const pdfUrl = URL.createObjectURL(pdfBlob);

  //           const newTab = window.open();
  //           newTab.document.body.innerHTML = `<iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0"></iframe>`;
  //         } else {
  //           console.error("Invalid or missing data in the response");
  //         }
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         callCatchMethod(error, language);
  //       });
  //   } else if (filePath?.includes(".csv")) {
  //     setLoading(true);
  //     const url = `${urls.CFCURL}/file/previewNew?filePath=${filePath}`;

  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         setLoading(false);
  //         console.log("Excel API Response:", response);
  //         console.log("Excel API Response Data:", response.data.fileName);

  //         const excelBase64 = response.data.fileName;

  //         const data = base64ToArrayBuffer(excelBase64);

  //         const excelBlob = new Blob([data], {
  //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //         });

  //         saveAs(excelBlob, "NewDoc.csv");
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         callCatchMethod(error, language);
  //       });
  //   } else if (filePath?.includes(".xlsx")) {
  //     setLoading(true);
  //     const url = `${urls.CFCURL}/file/previewNew?filePath=${filePath}`;

  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         setLoading(false);
  //         console.log("Excel API Response:", response);
  //         console.log("Excel API Response Data:", response.data.fileName);

  //         const excelBase64 = response.data.fileName;

  //         const data = base64ToArrayBuffer(excelBase64);

  //         const excelBlob = new Blob([data], {
  //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //         });

  //         saveAs(excelBlob, "Vishaypatra.xlsx");
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         callCatchMethod(error, language);
  //       });
  //   } else {
  //     setLoading(true);
  //     const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((r) => {
  //         setLoading(false);
  //         console.log(
  //           "ImageApi21312",
  //           `data:image/png;base64,${r?.data?.fileName}`
  //         );
  //         const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
  //         const newTab = window.open();
  //         // newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
  //         newTab.document.body.innerHTML = `<img src="${imageUrl}" style="width: 100vw; height: 100vh; object-fit: scale-down ;" />`;
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         callCatchMethod(error, language);
  //       });
  //   }
  // };

  // New

  const viewFile = (filePath) => {
    // alert("aaaya");
    console.log("filePath", filePath);

    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);

    const newFilePath = DecryptPhoto?.split(".").pop().toLowerCase();

    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);

    if (newFilePath === "pdf") {
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          console.log(r?.data, "doccheck32423");
          setLoading(false);
          // if (response && response.data instanceof ArrayBuffer) {
          //   const pdfBlob = new Blob([response.data], {
          //     type: "application/pdf",
          //   });
          //   const pdfUrl = URL.createObjectURL(pdfBlob);

          //   const newTab = window.open();
          //   newTab.document.body.innerHTML = `<iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0"></iframe>`;
          // } else {
          //   console.error("Invalid or missing data in the response");
          // }

          // New
          if (
            r?.data?.mimeType == "application/xlxs" ||
            r?.data?.mimeType == "text/csv" ||
            r?.data?.mimeType ==
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            const excelBase64 = r?.data?.fileName;

            const data = base64ToArrayBuffer(excelBase64);

            const excelBlob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            saveAs(excelBlob, "FileName.xlsx");
          } else {
            // alert("pdf elsesss");
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
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else if (newFilePath === "csv") {
      // alert("CSV");
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          console.log("Excel API Response:", response);
          console.log("Excel API Response Data:", response.data.fileName);

          const excelBase64 = response.data.fileName;

          const data = base64ToArrayBuffer(excelBase64);

          const excelBlob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(excelBlob, "NewDoc.csv");
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else if (newFilePath === "xlsx") {
      // alert("xlsx");
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          console.log("Excel API Response:", response);
          console.log("Excel API Response Data:", response.data.fileName);

          const excelBase64 = response.data.fileName;

          const data = base64ToArrayBuffer(excelBase64);

          const excelBlob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(excelBlob, "Spreadsheetml.xlsx");
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else {
      // alert("else");
      setLoading(true);
      const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          // alert("then");
          setLoading(false);
          console.log(
            "ImageApi21312",
            `data:image/png;base64,${r?.data?.fileName}`
          );
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          // alert("imageUrl");
          const newTab = window.open();
          // alert("window");
          // newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
          newTab.document.body.innerHTML = `<img src="${imageUrl}"/>`;
        })
        .catch((error) => {
          // alert("error");
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };

  //
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  };

  const discard = async (props) => {
    //

    const discardDecryptPhoto = DecryptData(
      "passphraseaaaaaaaaupload",
      props?.filePath
    );
    const discardFilePath = EncryptData(
      "passphraseaaaaaaadiscard",
      discardDecryptPhoto
    );

    //
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.CFCURL}/file/discardEncrypted?filePath=${discardFilePath}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              // Active Flag Y
              let attachementY = JSON.parse(
                localStorage.getItem("noticeAttachment")
              )
                ?.filter((a) => a?.filePath != props.filePath)
                ?.map((a) => a);

              // Active Flag N
              let attachementDark = JSON.parse(
                localStorage.getItem("noticeAttachment")
              )
                ?.filter((a) => a?.filePath == props.filePath)
                ?.map((a) => a);

              // add active Flag N
              let attachementN = attachementDark.map((data, index) => {
                return {
                  ...data,
                  activeFlag: "N",
                };
              });

              let attachement = [...attachementY, ...attachementN];

              let attachementWithSrNo = attachement.map((data, index) => {
                return {
                  ...data,
                  srNo: index + 1,
                };
              });

              console.log("attachementN", attachementWithSrNo);

              setAdditionalFiles(attachementWithSrNo);
              localStorage.removeItem("noticeAttachment");
              localStorage.setItem(
                "noticeAttachment",
                JSON.stringify(attachementWithSrNo)
              );
              swal("File Deleted Successfully!", { icon: "success" });
            } else {
              swal("Something went wrong..!!!");
            }
          })
          ?.catch((err) => {
            console.log("err", err);
            callCatchMethod(err, language);
          });
      } else {
        swal("File is Safe");
      }
    });
  };

  // Columns
  const columns = [
    {
      headerName: <FormattedLabel id="fileName" />,
      field: "originalFileName",
      // width: 300,
      flex: 0.7,
    },
    {
      headerName: <FormattedLabel id="fileType" />,
      field: "extension",
      width: 140,
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      flex: 1,
      // width: 300,
    },
    {
      // field:
      headerName: <FormattedLabel id="actions" />,
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            {/** viewButton */}
            <IconButton
              color="primary"
              onClick={() => {
                viewFile(record?.row?.filePath);

                // console.log("record.row.filePath", record.row.filePath);
                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                //   "_blank"
                // );
              }}
            >
              <Visibility />
            </IconButton>
            {/** deleteButton */}
            {deleteButtonInputState && (
              <IconButton
                color="error"
                disabled={router?.query?.pageMode === "_VIEW" ? true : false}
                onClick={() => discard(record.row)}
              >
                <Delete />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  // ----------------- useEffect -----------

  useEffect(() => {
    if (localStorage.getItem("noticeAttachment") !== null) {
      setAdditionalFiles(JSON.parse(localStorage.getItem("noticeAttachment")));
    }
    // delete
    if (localStorage.getItem("deleteButtonInputState") == "true") {
      setDeleteButtonInputState(true);
    } else if (localStorage.getItem("deleteButtonInputState") == "false") {
      setDeleteButtonInputState(false);
    }
  }, []);

  useEffect(() => {}, [deleteButtonInputState]);

  useEffect(() => {}, [noticeAttachment, mainFiles, additionalFiles]);

  useEffect(() => {
    console.log("object", [...mainFiles, ...additionalFiles]);
    setNoticeAttachment([...mainFiles, ...additionalFiles]);
    localStorage.setItem(
      "noticeAttachment",
      JSON.stringify([...mainFiles, ...additionalFiles])
    );
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    setButtonInputStateNew(props?.buttonInputStateNew);
  }, [props]);

  useEffect(() => {}, [buttonInputStateNew]);

  useEffect(() => {
    if (noticeAttachment != null || noticeAttachment != undefined) {
      let dataSourceFiltered = noticeAttachment.filter((data) => {
        if (data?.activeFlag == "Y") {
          return data;
        }
      });
      console.log("dataSourceFiltered", dataSourceFiltered);
      setNoticeAttachmentFiltered(dataSourceFiltered);
    }
  }, [noticeAttachment]);

  useEffect(() => {}, [noticeAttachmentFiltered]);

  // view
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div
            style={{
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
              {/* <FormattedLabel id="document" /> */}
              <Typography>
                {/* Document Upload- Please Ensure File Size is Below 10MB */}
                <FormattedLabel id="documentUploadWithMSG" />
              </Typography>
            </strong>
          </div>
          <Paper
            style={{
              marginLeft: "15vh",
              marginRight: "17vh",
              marginTop: "5vh",
              marginBottom: "5vh",
            }}
            elevation={0}
          >
            {/** FileTableComponent **/}
            <FileTableNotice
              appName="LCMS" //Module Name
              serviceName={"L-Notice"} //Transaction Name
              fileName={attachedFile} //State to attach file
              filePath={setAttachedFile} // File state upadtion function
              activeFlag={setActiveFlag}
              newFilesFn={setAdditionalFiles} // File data function
              columns={columns} //columns for the table
              rows={
                noticeAttachmentFiltered == undefined ||
                noticeAttachmentFiltered == ""
                  ? []
                  : noticeAttachmentFiltered
              }
              uploading={setUploading}
              buttonInputStateNew={buttonInputStateNew}
            />
          </Paper>
        </>
      )}
    </>
  );
};

export default Documents;

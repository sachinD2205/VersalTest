import { Add, Delete } from "@mui/icons-material";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import style from "./upload.module.css";
import axios from "axios";
import urls from "../../URLS/urls";
import swal from "sweetalert";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../util/util";
import { useGetToken } from "../../containers/reuseableComponents/CustomHooks";
import { saveAs } from "file-saver";
import Loader from "../../containers/Layout/components/Loader";

const UploadButton = (props) => {
  const [filePath, setFilePath] = useState(null);
  const [deletedFile, setDeletedFile] = useState(null);
  const language = useSelector((state) => state.labels.language);

  const [loading, setLoading] = useState(false);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const userToken = useGetToken();
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

  useEffect(() => {}, [props]);
  useEffect(() => {
    if (props?.fileName) {
      setFilePath(props?.fileName);
    }
  }, [props?.fileName]);

  const handleFile = async (e) => {
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("appName", props?.appName);
    formData.append("serviceName", props?.serviceName);
    axios
      .post(`${urls.CFCURL}/file/upload`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setFilePath(r.data.filePath);
        props?.filePath(r.data.filePath);
      })
      .catch((err) => {
        swal(
          language === "en" ? "Error!" : "त्रुटी!",
          language === "en"
            ? "Enter valid File Format !"
            : "वैध फाइल स्वरूप प्रविष्ट करा!",
          "error",
          { button: language === "en" ? "Ok" : "ठीक आहे" }
        );
      });
  };

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName?.split("__");
    return fileNamee[1];
  }

  //view----------------------------------------------------------------
  const viewFile = (filePath) => {
    console.log("filePath", filePath);
    if (filePath?.includes(".pdf")) {
      setLoading(true);
      const url = `${urls.CFCURL}/file/preview?filePath=${filePath}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          responseType: "arraybuffer",
        })
        .then((response) => {
          setLoading(false);
          if (response && response.data instanceof ArrayBuffer) {
            const pdfBlob = new Blob([response.data], {
              type: "application/pdf",
            });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const newTab = window.open();
            newTab.document.body.innerHTML = `<iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0"></iframe>`;
          } else {
            console.error("Invalid or missing data in the response");
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
          // catchExceptionHandlingMethod(error, language);
        });
    } else if (filePath?.includes(".csv")) {
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
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
          // callCatchMethod(error, language);
          catchExceptionHandlingMethod(error, language);
        });
    } else if (filePath?.includes(".xlsx")) {
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
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

          saveAs(excelBlob, "Vishaypatra.xlsx");
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else {
      setLoading(true);
      const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          setLoading(false);
          console.log(
            "ImageApi21312",
            `data:image/png;base64,${r?.data?.fileName}`
          );
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          const newTab = window.open();
          // newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
          newTab.document.body.innerHTML = `<img src="${imageUrl}" style="width: 100vw; height: 100vh; object-fit: scale-down ;" />`;
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  };
  // ------------------------------------------------------------------------

  const discard = async (e, filePath) => {
    swal({
      title: language == "en" ? "Delete?" : "हटवा?",
      text:
        language == "en"
          ? "Are you sure you want to delete the file ? "
          : "तुम्हाला नक्की फाइल हटवायची आहे का ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${urls.CFCURL}/file/discard?filePath=${filePath}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null),
                setDeletedFile(filePath),
                props?.filePath(null);
              swal(
                language == "en"
                  ? "File Deleted Successfully!"
                  : "फाइल यशस्वीरित्या हटवली!",
                { icon: "success" }
              );
            } else {
              swal(
                language == "en"
                  ? "Something went wrong..!!!"
                  : "काहीतरी चूक झाली..!!!"
              );
            }
          });
      } else {
        swal(language == "en" ? "File is Safe" : "फाइल सुरक्षित आहे");
      }
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={style.align}>
          <label className={style.uploadButton}>
            {!filePath && (
              <>
                <Add
                  color="secondary"
                  sx={{
                    width: 30,
                    height: 30,
                    border: "1.4px dashed #9c27b0",
                    marginRight: 1.5,
                  }}
                />
                <input
                  type="file"
                  onChange={(e) => {
                    handleFile(e);
                  }}
                  hidden
                />
              </>
            )}
            {filePath ? (
              <a
                // href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
                // target="__blank"
                onClick={() => {
                  viewFile(filePath);
                }}
              >
                {showFileName(filePath)}
                {/* <Button><FormattedLabel id="view"/></Button> */}
              </a>
            ) : (
              <span className={style.fileName}>
                <FormattedLabel id="attachFile" />
              </span>
            )}
          </label>
          {filePath && !props.disabled ? (
            <IconButton
              onClick={(e) => {
                discard(
                  e,
                  filePath
                ); /* setFilePath(null),props.filePath(null),discardFile() */
              }}
            >
              <Delete color="error" />
            </IconButton>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};
export default UploadButton;

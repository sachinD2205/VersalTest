import axios from "axios";
import React, { useEffect, useState } from "react";
import sweetAlert from "sweetalert";
import URLs from "../../../../URLS/urls";
import { useForm, useFormContext } from "react-hook-form";

import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import Loader from "../../../../containers/Layout/components/Loader";
import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";

const UploadButton = ({
  appName,
  serviceName,
  label,
  filePath,
  fileUpdater,
  view,
  fileKey,
  onlyImage = false,
  onlyPDF = false,
  imageAndPDF = false,
}) => {
  const methods = useForm();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    clearErrors,
    formState: { errors },
  } = methods;

  // const methods = useFormContext()
  // const {
  //   control,
  //   register,
  //   setValue,
  //   getValues,
  //   clearErrors,
  //   reset,
  //   formState: { errors },
  // } = methods

  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const userToken = useGetToken();

  const imageFormats = ["image/jpeg", "image/jpg", "image/png"];

  // --------------------Getting logged in authority roles -----------------------

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        //   console.log("r.roles", r.roles);
        return r;
      }
    })?.roles;
    //   console.log("auth0000", auth);
    setAuthority(auth);
  }, []);
  //   console.log("authority", authority);
  // -------------------------------------------------------------------
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

  const fileUpload = (fileData) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("file", fileData);
    axios
      .post(
        `${URLs.CFCURL}/file/upload?appName=${appName}&serviceName=${serviceName}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        setLoading(false);
        if (r.status === 200) {
          fileUpdater(r?.data?.filePath);
          // clearErrors(filePath);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        swal(
          "Error!",
          "File should be in proper format or size should be below 10Mb!",
          "error"
        );
      });
  };

  const handleFile = (event) => {
    console.log("FILE SIZE: ", event.target.files[0]);

    if (event.target.files) {
      if (onlyPDF) {
        if (event.target.files[0].type == "application/pdf") {
          fileUpload(event.target.files[0]);
          console.log("Only pdf uploader");
        } else {
          sweetAlert(
            "Error!",
            "Please upload PDF files with size less than 2MB!",
            "error"
          );
        }
      } else if (onlyImage) {
        if (imageFormats.includes(event.target.files[0].type)) {
          fileUpload(event.target.files[0]);
          console.log("Only image uploader");
        } else {
          sweetAlert(
            "Error!",
            "Please upload JPEG/JPG/PNG files with size less than 2MB!",
            "error"
          );
        }
      } else if (imageAndPDF) {
        if (
          event.target.files[0].type == "application/pdf" ||
          imageFormats.includes(event.target.files[0].type)
        ) {
          fileUpload(event.target.files[0]);
          console.log("Image and PDF uploader");
        } else {
          sweetAlert(
            "Error!",
            "Please upload JPEG/JPG/PNG/PDF files with size less than 2MB!",
            "error"
          );
        }
      } else {
        console.log("All uploader");
        fileUpload(event.target.files[0]);
      }
    }
  };

  const viewFile = (filePath) => {
    setLoading(true);
    console.log("filePath123", filePath);
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);

    const url = `${URLs.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setLoading(false);
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
        // const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
        // const newTab = window.open();
        // newTab.document.body.innerHTML = `<img src="${imageUrl}"  width="100%" height="100%"/>`;
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        setLoading(false);
        callCatchMethod(error, language);
      });
  };

  // const viewFile = (filePath) => {
  //   const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);

  //   const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);

  //   console.log("DecryptPhoto", DecryptPhoto);
  //   console.log("ciphertext", ciphertext);

  //   // if (filePath?.includes(".pdf")) {
  //   if (DecryptPhoto?.includes(".pdf")) {
  //     setLoading(true);
  //     const url = `${URLs.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${userToken}`,
  //         },
  //       })
  //       .then((response) => {
  //         setLoading(false);
  //         const dataUrl = `data:${response?.data?.mimeType};base64,${response?.data?.fileName}`;
  //         const newTab = window.open();
  //         newTab.document.write(`
  //                               <html>
  //                                 <body style="margin: 0;">
  //                                   <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
  //                                 </body>
  //                               </html>
  //                             `);
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         catchExceptionHandlingMethod(error, language);
  //       });
  //     // const url = `${URLs.CFCURL}/file/preview?filePath=${filePath}`;
  //     // axios
  //     //   .get(url, {
  //     //     headers: {
  //     //       Authorization: `Bearer ${userToken}`,
  //     //     },
  //     //     responseType: "arraybuffer",
  //     //   })
  //     //   .then((response) => {
  //     //     setLoading(false);
  //     //     if (response && response.data instanceof ArrayBuffer) {
  //     //       const pdfBlob = new Blob([response.data], {
  //     //         type: "application/pdf",
  //     //       });
  //     //       const pdfUrl = URL.createObjectURL(pdfBlob);

  //     //       const newTab = window.open();
  //     //       newTab.document.body.innerHTML = `<iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0"></iframe>`;
  //     //     } else {
  //     //       console.error("Invalid or missing data in the response");
  //     //     }
  //     //   })
  //     //   .catch((error) => {
  //     //     setLoading(false);
  //     //     // console.error("Error fetching or displaying PDF:", error);
  //     //     callCatchMethod(error, language);
  //     //   });
  //   } else {
  //     setLoading(true);
  //     // const url = ` ${URLs.CFCURL}/file/previewNew?filePath=${filePath}`;
  //     const url = `${URLs.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${userToken}`,
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

  return (
    <div
    // style={{ display: "flex", flexDirection: "column" }}
    >
      {loading ? (
        <Loader />
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: 20,
              width: "max-content",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "medium", fontWeight: "bold" }}>
              {label} :
            </span>
            {!filePath &&
              view === false &&
              (authority?.includes("ADMIN_OFFICER") ||
                authority.includes("ENTRY")) && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Add
                    sx={{
                      width: 30,
                      height: 30,
                      border: "1.5px dashed #1976d2",
                      color: "#1976d2",
                      marginRight: 1.5,
                    }}
                  />

                  <input
                    id="uploadButton"
                    type="file"
                    onChange={(e) => {
                      // @ts-ignore
                      if (e.target.files[0]) {
                        // @ts-ignore
                        if (e.target.files[0].size > 2097152) {
                          sweetAlert(
                            "Error!",
                            "Please upload file (PDF/JPG/JPEG/PNG) with size less than 2MB !",
                            "error"
                          );
                          e.target.value = "";
                        } else {
                          handleFile(e);
                        }
                      }
                    }}
                    hidden
                  />
                  <span
                    style={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      fontSize: 12,
                      color: "#1976d2",
                    }}
                  >
                    {language === "en" ? "Add File" : "फाइल जोडा"}
                  </span>
                </div>
              )}
            {filePath && (
              <div>
                <Button
                  variant="contained"
                  style={{ marginBottom: 2 }}
                  onClick={() => {
                    viewFile(filePath);
                    // window.open(
                    //   `${URLs.CFCURL}/file/preview?filePath=${filePath}`,
                    //   "_blank"
                    // );
                  }}
                >
                  {language === "en" ? "Preview" : "पूर्वावलोकन"}
                </Button>
                {!view && authority.includes("ENTRY") && (
                  <IconButton
                    onClick={() => {
                      axios
                        .delete(
                          `${URLs.CFCURL}/file/discard?filePath=${filePath}`,
                          {
                            headers: {
                              Authorization: `Bearer ${userToken}`,
                            },
                          }
                        )
                        .then((res) => {
                          if (res.status === 200) {
                            fileUpdater("");
                          }
                        })
                        .catch((error) => {
                          callCatchMethod(error, language);
                        });
                    }}
                  >
                    <Delete color="error" />
                  </IconButton>
                )}
              </div>
            )}
          </label>
        </div>
      )}
    </div>
  );
};

export default UploadButton;

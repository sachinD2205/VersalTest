import axios from "axios";
import React, { useEffect, useState } from "react";
import sweetAlert from "sweetalert";
import URLs from "../../../../URLS/urls";

import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { DecryptData, EncryptData } from "../../../../components/common/EncryptDecrypt";


const UploadButton = (
  // appName,
  // serviceName,
  // label,
  // filePath,
  // fileUpdater,
  // fileNameEncrypted,
  // view,
  // onlyImage = false,
  // onlyPDF = false,
  // imageAndPDF = false,
  props
) => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const imageFormats = ["image/jpeg", "image/jpg", "image/png"];

  // --------------------Getting logged in authority roles -----------------------

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const userToken = useGetToken();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // const [filePathNew, setFilePathNew] = useState(filePath);
  const [filePathEncrypted, setFilePathEncrypted] = useState(null);
  const [filePath, setFilePath] = useState(null);
  useEffect(() => {
    if (props?.fileName) {
      setFilePath(props?.fileName);
    }
  }, [props?.fileName]);
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
useEffect(()=>{
 console.log("props.filePath",props);
},[props.filePath])
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

  const fileUpload = (fileData) => {
    let formData = new FormData();
    formData.append("file", fileData);
    formData.append("appName", props.appName);
    // formData.append("appName", "TEST");
    // formData.append("serviceName", "TEST");
    formData.append("serviceName", props.serviceName);
    console.log("formData1231",formData);
    axios
      .post(`${URLs.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r.status === 200) {
        const plaintext = DecryptData(
          "passphraseaaaaaaaaupload",
          r?.data?.filePath
        );
        setFilePath(plaintext);
          props.fileUpdater(plaintext);
          setFilePathEncrypted(r?.data?.filePath);
          // props?.filePath(r?.data?.filePath)
          props.fileUpdater(r?.data?.filePath)
          props.fileNameEncrypted(r?.data?.filePath);
          
          // setValue(r?.data?.filePath)
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const handleFile = (event) => {
    console.log("FILE SIZE: ", event.target.files[0]);

    if (event.target.files) {
      if (props.onlyPDF) {
        if (event.target.files[0].type == "application/pdf") {
          fileUpload(event.target.files[0]);
          console.log("Only pdf uploader");
        } else {
          sweetAlert("Error!", "Please upload PDF files with size less than 2MB!", "error");
        }
      } else if (props.onlyImage) {
        if (imageFormats.includes(event.target.files[0].type)) {
          fileUpload(event.target.files[0]);
          console.log("Only image uploader");
        } else {
          sweetAlert("Error!", "Please upload JPEG/JPG/PNG files with size less than 2MB!", "error");
        }
      } else if (props.imageAndPDF) {
        if (
          event.target.files[0].type == "application/pdf" ||
          imageFormats.includes(event.target.files[0].type)
        ) {
          fileUpload(event.target.files[0]);
          console.log("Image and PDF uploader");
        } else {
          sweetAlert("Error!", "Please upload JPEG/JPG/PNG/PDF files with size less than 2MB!", "error");
        }
      } else {
        console.log("All uploader");
        fileUpload(event.target.files[0]);
      }
    }
  };

  // getFilePreview
  const getFilePreview = async (filePath) => {
    // console.log("plaintext",filePath);

    const DecryptPhoto = await DecryptData(
      "passphraseaaaaaaaaupload",
      filePath
    );

    const ciphertext = await EncryptData(
      "passphraseaaaaaaapreview",
      DecryptPhoto
    );


    console.log("plaintext", DecryptPhoto);
    if (DecryptPhoto?.includes(".pdf")) {
      // setLoading(true);
      // const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
      // axios
      //   .get(url, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //     responseType: "arraybuffer",
      //   })
      //   .then((response) => {
      //     setLoading(false);
      //     if (response && response.data instanceof ArrayBuffer) {
      //       const pdfBlob = new Blob([response.data], {
      //         type: "application/pdf",
      //       });
      //       const pdfUrl = URL.createObjectURL(pdfBlob);

      //       const newTab = window.open();
      //       newTab.document.body.innerHTML = `<iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0"></iframe>`;
      //     } else {
      //       console.error("Invalid or missing data in the response");
      //     }
      //   })
      //   .catch((error) => {
      //     setLoading(false);
      //     // console.error("Error fetching or displaying PDF:", error);
      //     catchExceptionHandlingMethod(error, language);
      //   });
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          // setLoading(false)
          const dataUrl = `data:${response?.data?.mimeType};base64,${response?.data?.fileName}`
          const newTab = window.open()
          newTab.document.write(`
                                <html>
                                  <body style="margin: 0;">
                                    <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
                                  </body>
                                </html>
                              `)
        })
        .catch((error) => {
          // setLoading(false)
          callCatchMethod(error, language)
        })
    } else {
      // setLoading(true);
      const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          // setLoading(false);
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
          // setLoading(false);
          // console.log("CatchPreviewApi", error);
          catchExceptionHandlingMethod(error, language);
          // callCatchMethod(error, language);
        });
    }
  };
    const deleteFile = (filePath)=>{
  console.log("filePath11", filePath)

  const ciphertext = EncryptData("passphraseaaaaaaadiscard", filePath);
  axios.delete(`${URLs.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`,{
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  }).then((res) => {
    if (res.status === 200) {
      props.fileUpdater("");
    }
  });
}
  return (
    <div
    // style={{ display: "flex", flexDirection: "column" }}
    >
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
          {/* <span style={{ fontSize: "medium", fontWeight: "bold" }}>{label} :</span> */}
          {!props.filePath && (
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
                        "error",
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
          {props.filePath && (
            <div>
              <Button
                variant="contained"
                style={{ marginBottom: 2 }}
                // onClick={() => {
                //   window.open(`${URLs.CFCURL}/file/preview?filePath=${filePath}`, "_blank");
                // }}
                onClick={() =>
                  getFilePreview(props.filePath)
                }
                
              >
                {language === "en" ? "Preview" : "पूर्वावलोकन"}
              </Button>
              {!props.view && (
                <IconButton
                  onClick={() => { deleteFile(props.filePath)}}
                >
                  <Delete color="error" />
                </IconButton>
             )} 
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default UploadButton;

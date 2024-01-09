import { Add, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import swal from "sweetalert";
import urls from "../../URLS/urls";
import { useGetToken } from "../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../util/util";
import style from "../fileUpload/upload.module.css";
import { DecryptData, EncryptData } from "../common/EncryptDecrypt";

const UploadButtonOP = (props) => {
  const language = useSelector((state) => state?.labels?.language);
  const userToken = useGetToken();
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

  // const methods = useForm();
  const {
    control,
    register,
    setValue,
    getValues,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  //file upload
  const [filePath, setFilePath] = useState(null);
  const [filePathEncrypted, setFilePathEncrypted] = useState(null);
  const [deletedFile, setDeletedFile] = useState(null);
  // const [fileKey,setFileKey]=useState(null);

  useEffect(() => {
    console.log("props.fileKey->>>>>>>", props?.fileKey);
    console.log("props.showDel->>>>>>>", props?.showDel);
  }, []);

  useEffect(() => {}, [props]);
  useEffect(() => {
    if (props?.fileName) {
      setFilePath(props?.fileName);
    }
  }, [props?.fileName]);

  // useEffect(() => {
  //   console.log("props.filePath <->", props?.fileDtl);
  //   if (props?.fileDtl) {
  //     setFilePath(props.fileDtl);
  //   }
  // }, [props?.fileDtl]);

  useEffect(() => {
    console.log("props88888888888", props?.fileDtl);
    if (props?.fileDtl) {
      // const data =
      // ("C:,var,pcmcerp,docs,MR,MBR,15_12_2023_12_25_34__Screenshot (6).png");

      console.log("sdfdsf32432", props?.fileDtl);

      if (props?.fileDtl.split(":")[0] == ["C"]) {
        const plaintext = EncryptData(
          "passphraseaaaaaaapreview",
          props?.fileDtl,
        );
        setFilePath(plaintext);
      } else {
        setFilePath(props?.fileDtl);

        // const plaintext = EncryptData(
        //   "passphraseaaaaaaadiscard",
        //   props.fileDtl,
        // );

        // console.log("plainText34324", plaintext);

        // console.log(props.fileDtl, "sdfdsf");
        // const DecryptPhoto = DecryptData(
        //   "passphraseaaaaaaaaupload",
        //   props.fileDtl,
        // );
        // console.log(" ", DecryptPhoto);
        // console.log("plainTextsdfsdfsdf", props?.fileDtl);
      }

      // setFilePath(data);
      // setFilePath(props?.fileDtl);
    }
  }, [props?.fileDtl]);

  let user = useSelector((state) => state.user.user);

  const handleFile = async (e) => {
    if (
      e.target.files[0].type == "image/jpeg" ||
      e.target.files[0].type == "image/png" ||
      e.target.files[0].type == "application/pdf" ||
      e.target.files[0].type == "text/csv"
    ) {
      if (e.target.files[0].size < 10485760) {
        setValue("loadderState", true);
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("appName", props.appName);
        formData.append("serviceName", props.serviceName);

        axios
          // .post(`${urls.CFCURL}/file/upload`, formData, {
          .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((r) => {
            if (r?.status == "200" || r?.status == "201") {
              console.log("departmentUpload+++", f);
              let f = r?.data?.filePath;
              if (f) {
                // const plaintext1 = DecryptData("passphraseaaaaaaaaupload", f);
                // const plaintext = EncryptData("passphraseaaaaaaapreview", f);

                const plaintext = f;
                // const plaintext = EncryptData()

                console.log("plainText", plaintext);
                setFilePath(plaintext);
                props?.fileNameEncrypted(r?.data?.filePath);
                setValue(props.fileKey, plaintext);
                setFilePathEncrypted(r?.data?.filePath);
                setValue("loadderState", true);
                clearErrors(props.fileKey);
                // props.filePath(plaintext);
                // props?.filePath(plaintext);
                toast.success(
                  language == "en"
                    ? "Document Uploaded Successfully !!!"
                    : "दस्तऐवज यशस्वीरित्या अपलोड केले",
                  {
                    autoClose: "1000",
                    position: toast.POSITION.TOP_RIGHT,
                  },
                );
              } else if (r?.status == "500") {
                console.log("r?.data", r?.data);
                console.log("r?.status", r?.status);
                setValue("loadderState", false);
                toast.error("Please Upload Valid Document !!!", {
                  autoClose: "1000",
                  position: toast.POSITION.TOP_RIGHT,
                });
              }
            }
          });
      } else {
        swal(
          language == "en"
            ? "File size should not exceed 10 MB"
            : "फाइलचा आकार 10 मेगाबाइटपेक्षा जास्त नसावा",
          { icon: "error" },
        );
      }
    } else {
      swal(
        language == "en"
          ? "Please Upload Valid Type File !"
          : "कृपया वैध प्रकार फाइल अपलोड करा !",
        language == "en"
          ? "Allowed file types are JPEG, PNG, and PDF only."
          : "केवळ JPEG, PNG आणि PDF हे फाइल प्रकार अपलोड करण्यास अनुमती आहे",
      );
    }
  };

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName.split("__");
    return fileNamee[1];
  }

  // discard
  // const discard = async (e) => {
  //   const textAlert =
  //     language == "en"
  //       ? "Are you sure you want to delete the file ? "
  //       : "तुम्हाला खात्री आहे की तुम्ही फाइल हटवू इच्छिता?";
  //   const title = language == "en" ? "Delete?" : "हटवायचे?";

  //   sweetAlert({
  //     title: title,
  //     text: textAlert,
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       // const ciphertext = EncryptData("passphraseaaaaaaadiscard", filePath);
  //       console.log("filePath", filePath);

  //       axios
  //         .delete(`${urls.CFCURL}/file/discardEncrypted?filePath=${filePath}`, {
  //           headers: {
  //             Authorization: `Bearer ${user.token}`,
  //           },
  //         })
  //         .then((res) => {
  //           if (res.status == 200) {
  //             if (res?.data?.status == "SUCCESS") {
  //               setFilePath(null),
  //                 setDeletedFile(filePath),
  //                 setValue(props.fileKey, null);
  //               swal(
  //                 language == "en"
  //                   ? "File Deleted Successfully!"
  //                   : "फाइल यशस्वीरित्या हटवली!",
  //                 { icon: "success" },
  //               );
  //             }
  //           } else {
  //             swal("Something went wrong..!!!");
  //           }
  //         });
  //     } else {
  //       swal("File is Safe");
  //     }
  //   });
  // };
  const discard = async (e) => {
    const ciphertext = EncryptData("passphraseaaaaaaadiscard", filePath);
    const url = `${urls.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`;

    swal({
      title: language == "en" ? "Delete?" : "हटवायचे?",
      text:
        language == "en"
          ? "are you sure you want to delete the file ? "
          : "तुम्हाला खात्री आहे की तुम्ही फाइल हटवू इच्छिता?",
      icon: "warning",
      buttons: {
        cancel: language == "en" ? "Cancel" : "रद्द करा",
        confirm: language == "en" ? "OK" : "ठीक आहे",
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setValue("loadderState", true);
        axios
          .delete(url, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            setValue("loadderState", false);
            if (res.status == 200) {
              setFilePath(null), props.filePath(null);
              language == "en"
                ? swal("File Deleted Successfully!", {
                    icon: "success",
                    buttons: { ok: "OK" },
                  })
                : swal("फाइल यशस्वीरित्या हटवली!", {
                    icon: "success",
                    buttons: { ok: "ठीक आहे" },
                  });
            }
          })
          .catch((error) => {
            setValue("loadderState", false);
            // callCatchMethod(error, language);
            // console.log("zoneNameApiCallError", error);
          });
      } else {
        language == "en"
          ? swal("File is safe", { icon: "info", buttons: { ok: "OK" } })
          : swal("फाइल सुरक्षित आहे", {
              icon: "info",
              buttons: { ok: "ठीक आहे" },
            });
      }
    });
  };
  // filePreview
  const getFilePreview = (filePath) => {
    console.log("filePath2342", filePath);
    // const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", filePath);

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("rrr", r);
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
      .catch((error) => {
        console.log("CatchPreviewApi", error);
      });
  };
  // const getFilePreview = (filePath) => {
  //   console.log("filePath123", filePath);
  //   const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
  //   // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
  //   axios
  //     .get(url, {
  //       headers: {
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     })
  //     .then((r) => {
  //       const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
  //       const newTab = window.open();
  //       newTab.document.write(`
  //         <html>
  //           <body style="margin: 0;">
  //             <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
  //           </body>
  //         </html>
  //       `);
  //     })
  //     .catch((error) => {
  //       console.log("CatchPreviewApi", error);
  //       callCatchMethod(error, language);
  //     });
  // };

  // view
  return (
    <>
      {/* (
      <Loader />) : ( */}
      <>
        <div className={style.align}>
          <label className={style.uploadButton}>
            {!filePath && props.showDel === true && (
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
              <span
                style={{ color: "blue" }}
                // onClick={() => getFilePreview(filePathEncrypted)}
                onClick={() => {
                  if (filePath) {
                    console.log("filePath", filePath);
                    getFilePreview(
                      DecryptData("passphraseaaaaaaaaupload", filePath),
                    );
                  }
                }}
              >
                {console.log("flilePath324------", filePath)}
                {
                  showFileName(
                    DecryptData("passphraseaaaaaaaaupload", filePath),
                  )
                  // ,
                }
              </span>
            ) : props?.showDel == true ? (
              <span className={style.fileName}>
                {" "}
                <FormattedLabel id="addFile" />
              </span>
            ) : (
              <span className={style.fileName} />
            )}
          </label>
          {filePath && props.showDel == true && (
            <IconButton
              onClick={(e) => {
                discard(e);
              }}
            >
              <Delete color="error" />
            </IconButton>
          )}
        </div>
      </>
      {/* ) */}
    </>
  );
};
export default UploadButtonOP;

import { Add, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import swal from "sweetalert";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import { DecryptData, EncryptData } from "../common/EncryptDecrypt";
import style from "../fileUpload/upload.module.css";
const UploadButtonOP = (props) => {
  const language = useSelector((state) => state?.labels?.language);
  // const methods = useForm();

  const methods = useFormContext();
  const {
    control,
    register,
    setValue,
    getValues,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = methods;

  const [filePath, setFilePath] = useState(null);
  const [filePathEncrypted, setFilePathEncrypted] = useState(null);
  const [deletedFile, setDeletedFile] = useState(null);

  // const [fileKey,setFileKey]=useState(null);

  useEffect(() => {
    console.log("props.fileKey->>>>>>>", props?.fileKey);
    console.log("props.showDel->>>>>>>", props?.showDel);
  }, []);

  // useEffect(() => {
  //   console.log("props.filePath <->", props?.fileDtl);
  //   if (props?.fileDtl) {
  //     setFilePath(props.fileDtl);
  //   }
  // }, [props?.fileDtl]);

  useEffect(() => {
    console.log("props.filePath <->", props?.fileDtl);
    if (props?.fileDtl) {
      // const data =
      // ("C:,var,pcmcerp,docs,MR,MBR,15_12_2023_12_25_34__Screenshot (6).png");

      console.log(
        "sdfdsf32432ewrewr",
        !(props?.fileDtl.split("")[props?.fileDtl.split("").length - 1] == "="),
      );

      if (
        !(props?.fileDtl.split("")[props?.fileDtl.split("").length - 1] == "=")
      ) {
        //! notEncrypted

        // alert("sdfsd");
        setFilePath(props?.fileDtl);
      } else {
        const plaintext = EncryptData(
          "passphraseaaaaaaadiscard",
          props.fileDtl,
        );
        const DecryptPhoto = DecryptData(
          "passphraseaaaaaaaaupload",
          props.fileDtl,
        );
        console.log("plainTextsdfsdfsdf", props?.fileDtl);
        setFilePath(DecryptPhoto);
      }

      // setFilePath(data);
      // setFilePath(props?.fileDtl);
    }
  }, [props?.fileDtl]);

  let user = useSelector((state) => state.user.user);

  useEffect(() => {
    console.log("boardOrganizationPhoto34", watch("boardOrganizationPhoto"));
  }, [watch("boardOrganizationPhoto")]);
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
              let f = r.data.filePath;
              console.log("documentUpload---board all type document", f);
              if (f) {
                const plaintext = DecryptData("passphraseaaaaaaaaupload", f);
                console.log("plainText", plaintext);
                setFilePath(plaintext);
                props?.fileNameEncrypted(r?.data?.filePath);
                setValue(props.fileKey, plaintext);
                setFilePathEncrypted(r.data.filePath);
                clearErrors(props.fileKey);

                // props.filePath(plaintext);
                // setValue(props.fileKey, plaintext);
                // setFilePathEncrypted(r.data.filePath);
                // clearErrors(props.fileKey);

                // props?.fileNameEncrypted(r?.data?.filePath);
                console.log(props.fileKey, "=>>>>>", plaintext);
                // console.log(props.fileKey, f)
                setValue("loadderState", true);
                toast.success("Document Uploaded Successfully !!!", {
                  autoClose: "1000",
                  position: toast.POSITION.TOP_RIGHT,
                });
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

  const discard = async (e) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const ciphertext = EncryptData("passphraseaaaaaaadiscard", filePath);
        axios
          // .delete(`${urls.CFCURL}/file/discard?filePath=${filePath}`)
          .delete(
            `${urls.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          )
          .then((res) => {
            if (res.status == 200) {
              if (res?.data?.status == "SUCCESS") {
                setFilePath(null),
                  setDeletedFile(filePath),
                  props?.filePath(null);
                setValue(props.fileKey, null);
                swal(
                  language == "en"
                    ? "File Deleted Successfully!"
                    : "फाइल यशस्वीरित्या हटवली!",
                  { icon: "success" },
                );
              } else {
                swal(
                  language == "en"
                    ? "Something went wrong!"
                    : "काहीतरी चूक झाली",
                  { icon: "error" },
                );
              }
            } else {
              swal(
                language == "en"
                  ? "Something went wrong..!!!"
                  : "काहीतरी चूक झाली..!!!",
              );
            }
          })
          .catch((err) => console.log("err", err));
      } else {
        swal(language == "en" ? "File is Safe" : "फाइल सुरक्षित आहे");
      }
    });
  };

  const getFilePreview = (filePath) => {
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

  return (
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
          // <a
          //   href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
          //   target="__blank"
          // >
          //   {showFileName(filePath)}
          // </a>
          <span
            style={{ color: "blue" }}
            onClick={() => {
              if (filePath) {
                console.log("filePath", filePath);
                getFilePreview(filePath);
              }
            }}
          >
            {showFileName(filePath)}
          </span>
        ) : props?.showDel == true ? (
          <span className={style.fileName}>
            {/* Upload File */}
            <FormattedLabel id="UploadFile" />
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
  );
};
export default UploadButtonOP;

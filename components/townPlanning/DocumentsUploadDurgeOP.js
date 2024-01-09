import { Add, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import swal from "sweetalert";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import style from "../fileUpload/upload.module.css";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../util/util";
import { DecryptData, EncryptData } from "../common/EncryptDecrypt";

const UploadButtonOP = (props) => {
  //catch
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
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels?.language);

  // const methods = useForm();
  const {
    control,
    register,
    setValue,
    getValues,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useFormContext();

  const [filePath, setFilePath] = useState(null);
  // const [fileKey,setFileKey]=useState(null);

  const handleFile = async (e) => {
    let formData = new FormData();
    // console.log("Ye yyyyy",  e.target.files[0]);
    let gggg = e?.target?.files[0]?.type?.split("/");
    console.log("gggggggg", gggg);
    if (gggg.length > 0 && !gggg.includes("image")) {
      console.log("TRUEEEEE", e.target.files[0]);
      setError(props?.fileKey, "G");

      swal(
        "Unsupported file type !",
        "Upload File format must be image(jpg,jpeg,png,bmp,gif)",
        "error",
      );
      // alert("Ghri Ja");
    } else {
      formData.append("file", e.target.files[0]);
      formData.append("appName", props.appName);
      formData.append("serviceName", props.serviceName);
      console.log("sdfsfdgvdfv",formData);
      axios
        // .post(`${urls.CFCURL}/file/upload`, formData, {
        .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          
        // const plaintext = DecryptData(
        //   "passphraseaaaaaaaaupload",
        //   r?.data?.filePath
        // );

        // console.log("Decrypted:",r, plaintext);
        // setFilePath(plaintext);
        // setFilePathEncrypted(r?.data?.filePath);
        // props?.filePath(plaintext);
        // props?.fileNameEncrypted(r?.data?.filePath);

          let f = r.data.filePath;
          // setFilePath(f);
          // props.filePath(f);
          setValue(props.fileKey, f);
          console.log("tpfilepath", f, props.fileKey);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  function showFileName(fileName) {
    console.log("ppFilename",fileName);
    const DecryptfilePath = DecryptData("passphraseaaaaaaaaupload", fileName);
    let fileNamee = [];
    fileNamee = DecryptfilePath?.split("__");
    return fileNamee ? fileNamee[1] : null;
  }
  const getFilePreview = (filePath) => {

    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);

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
  const discard = async (e) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      console.log("Deleteeeee",watch(props.fileKey))
      if (willDelete) {
        const ciphertext = EncryptData("passphraseaaaaaaadiscard", watch(props.fileKey));

        console.log("ciphertext", ciphertext);
        axios
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
              // setFilePath(null),
              setValue(props.fileKey, null);
              swal("File Deleted Successfully!", { icon: "success" });
            } else {
              swal("Something went wrong..!!!");
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      } else {
        swal("File is Safe");
      }
    });
  };

  useEffect(() => {
    console.log("props.fileKey->>>>>>>", props?.fileKey);
    console.log("props.showDel->>>>>>>", props?.showDel);
  }, []);

  useEffect(() => {
    console.log("props.filePath <->", props?.fileDtl);
    if (
      props?.fileDtl != null &&
      props?.fileDtl != undefined &&
      props?.fileDtl != ""
    ) {
      // setFilePath(props.fileDtl);
      setValue(props.fileKey, props.fileDtl);
    }
  }, [props?.fileDtl]);

  useEffect(() => {
    console.log(watch(props.fileKey), "filepath---->tp");
  }, [watch(props.fileKey)]);

  return (
    <div className={style.align}>
      <label className={style.uploadButton}>
        {watch(props.fileKey) == null ? (
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
            <span className={style.fileName}>
              {" "}
              <FormattedLabel id="fileUpload" />
            </span>
          </>
        ) : (
          <>
            {/* <a
              href={`${urls.CFCURL}/file/preview?filePath=${watch(
                props.fileKey,
              )}`}
              target="__blank"
            >
              {showFileName(watch(props.fileKey))}
            </a> */}
            <span
            style={{ color: "blue" }}
            onClick={() => getFilePreview(watch(props.fileKey))}
          >
             {showFileName(watch(props.fileKey))}
          </span>
          </>
        )}
      </label>

      {watch(props.fileKey) && props.showDel == true && (
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

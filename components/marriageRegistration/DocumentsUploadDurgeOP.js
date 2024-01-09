import { Add, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import swal from "sweetalert";
import style from "../fileUpload/upload.module.css";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import { lang } from "moment";
import { useSelector } from "react-redux";
import { DecryptData, EncryptData } from "../common/EncryptDecrypt";

const UploadButtonOP = (props) => {
  // const methods = useForm();
  const {
    control,
    register,
    setValue,
    getValues,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const [filePath, setFilePath] = useState(null);
  // const [fileKey,setFileKey]=useState(null);
  const [filePathEncrypted, setFilePathEncrypted] = useState(null);
  useEffect(() => {
    console.log("props.fileKey->>>>>>>", props?.fileKey);
    console.log("props.showDel->>>>>>>", props?.showDel);
  }, []);

  useEffect(() => {
    console.log("props.filePath <->", props?.fileDtl);
    if (props?.fileDtl) {
      setFilePath(props.fileDtl);
    }
  }, [props?.fileDtl]);
  const language = useSelector((state) => state?.labels.language);
  let user = useSelector((state) => state.user.user);



  const handleFile = async (e) => {
    let formData = new FormData();
    console.log("Ye yyyyy", e.target.files[0]);
    let gggg = e?.target?.files[0]?.type?.split("/");
    console.log("gggggggg", gggg);
    if (gggg.length > 0 && !gggg.includes("image")) {
      console.log("TRUEEEEE", e.target.files[0]);
      setError(props?.fileKey, "G");
      {
        language == "en"
          ? swal(
              "Unsupported file type !",
              "Upload File format must be image(jpg,jpeg,png,bmp,gif)",
              "error",
            )
          : swal(
              "असमर्थित फाइल प्रकार!",
              "अपलोड फाइलचे स्वरूप प्रतिमा (jpg,jpeg,png,bmp,gif) असणे आवश्यक आहे",
              "त्रुटी",
            );
      }

      // alert("Ghri Ja");
    } else {
      formData.append("file", e.target.files[0]);
      formData.append("appName", props.appName);
      formData.append("serviceName", props.serviceName);
      axios
        .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          // let f = r.data.filePath;
          // setFilePath(f);
          // // props.filePath(f);
          // setValue(props.fileKey, f);



          const plaintext =null ;

          //!  encrypted 
          if(!(r?.data?.filePath?.split("")[r?.data?.filePath?.split("").length - 1] == "=")){
            plaintext = DecryptData(
              "passphraseaaaaaaaaupload",
              r?.data?.filePath
              );
          }else{
            plaintext = r?.data?.filePath;
          }


          //  plaintext = DecryptData(
          //   "passphraseaaaaaaaaupload",
          //   r?.data?.filePath
          //   );
            
            console.log("Decrypted:", plaintext);
            setFilePath(plaintext);
            setFilePathEncrypted(r?.data?.filePath);
            // props?.fileDtl(plaintext);
            props.fileNameEncrypted(r?.data?.filePath);
            // setValue("props.fileDtl",r?.data?.filePath)
            clearErrors(props.fileKey);
          });
        }
      };
      
      function showFileName(fileName) {
    console.log("fileNamesdfsdf:", fileName);
    const plaintext = DecryptData(
      "passphraseaaaaaaaaupload",
      fileName
      );
    let fileNamee = [];
    fileNamee = plaintext.split("__");
    return fileNamee[1];
  }

  const discard = async (e) => {
    const textAlert =
      language == "en"
        ? "Are you sure you want to delete the file ? "
        : "तुम्हाला खात्री आहे की तुम्ही फाइल हटवू इच्छिता?";
    const title = language == "en" ? "Delete ?" : "हटवायचे ?";
    swal({
      title: title,
      text: textAlert,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const ciphertext = EncryptData("passphraseaaaaaaadiscard", filePath);

        console.log("ciphertext", filePath);
        axios
          // .delete(`${urls.CFCURL}/file/discard?filePath=${filePath}`, {
          .delete(
            `${urls.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null), setValue(props.fileKey, null);
              {
                language == "en"
                  ? swal("File Deleted Successfully!", { icon: "success" })
                  : swal("फाइल यशस्वीरित्या हटवली!", { icon: "success" });
              }
            } else {
              {
                language == "en"
                  ? swal("Something went wrong..!!!")
                  : swal("काहीतरी चूक झाली..!!!");
              }
            }
          });
      } else {
        {
          language == "en" ? swal("File is Safe") : swal("फाइल सुरक्षित आहे");
        }
      }
    });
  };
  const getFilePreview = (filePath) => {
console.log("qqqqqqqqqqqqqqq",filePath);
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
           onClick={() => getFilePreview(filePath)}
         >
           {showFileName(filePath)}
         </span>
        ) : props?.showDel == true ? (
          <span className={style.fileName}>
            {" "}
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

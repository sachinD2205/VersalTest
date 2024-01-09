import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import style from "./uploadButtonHawker.module.css";
import axios from "axios";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks"
import { DecryptData, EncryptData } from "../../../components/common/EncryptDecrypt"


const UploadButton = (props) => {
  const [filePath, setFilePath] = useState(null);
  const userToken = useGetToken();

  // filePreview -- pass filepath as props
  const getFilePreview = (filePath) => {
    console.log("filePath123", filePath);


    if (filePath != null && filePath != undefined && filePath != "") {
      // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
      const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
      const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;



      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
          <html>
            <body style="margin: 0;">
              <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
            </body>
          </html>
        `);
        })
        .catch((error) => {
          console.log("CatchPreviewApi", error)
          callCatchMethod(error, language);
        });
    }
  }


  //! ==================> useEffect

  useEffect(() => {
    console.log("props.filePath <->", props);
    if (props?.fileName) {
      setFilePath(props.fileName);
    }
  }, [props?.fileName]);

  // view
  return (
    <div className={style.align}>
      <label className={style.uploadButton}>
        {!filePath && (
          <span>{<FormattedLabel id="fileNotUploaded" />}</span>
        )}
        {filePath ? (

          <span
            style={{ color: "blue" }}
            onClick={() =>
              getFilePreview(filePath)
            }
          >
            <Button variant="contained" color="primary">
              {<FormattedLabel id="view" />}
            </Button>
          </span>

        ) : (
          <h1></h1>
        )}
      </label>
    </div>
  );
};
export default UploadButton;

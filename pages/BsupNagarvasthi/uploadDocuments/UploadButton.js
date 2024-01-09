import { FileUpload } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import style from "../../LegalCase";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../util/commonErrorUtil";

const UploadButton = (props) => {
  const [filePath, setFilePath] = useState("");
  const language = useSelector((state) => state.labels.language);

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

  const handleFile = (e) => {
      const file = e.target.files[0];
      const MAX_FILE_SIZE = 2048;

      const allowedFileTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
  
      //! extension only
      const fileExtension =
        file?.name?.split(".")[file?.name?.split(".").length - 1];
      //! without extension
      const fileNameWithoutExtension = file?.name?.split("." + fileExtension)[0];
      //! regex --- letter/numbers/hypens/underscore
      const fileNameRegex = /^[a-zA-Z0-9_\s\u0900-\u097F]+$/;
      // const fileNameRegex = /^[a-zA-Z0-9_-]+$/;
      if (fileNameRegex.test(fileNameWithoutExtension)) {
        if (file && allowedFileTypes.includes(file.type)) {
          const fileSizeKiloBytes = e.target.files[0].size / 1024;
          if (fileSizeKiloBytes > MAX_FILE_SIZE) {
            sweetAlert(
              language == "en" ? "Error!" : "त्रुटी!",
              language == "en"
                ? "File size exceeds maximum limit 2 MB"
                : "फाइल खूप मोठी आहे, कमाल फाइल आकार 2MB आहे",
              "error"
            );
          } else {
      props.modalState(false);
      props.uploading(true);
      let formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("appName", null);
      formData.append("serviceName", props.serviceName);

      axios
        // .post(`${urls.CFCURL}/file/upload`, formData, { headers: headers })
        .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
          headers: headers,
        })
        .then((r) => {
          setFilePath(r.data.filePath);
          props.filePath(r.data);
          props.handleClose();
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, true);
        });
    }
  } else {
    sweetAlert(
      language == "en" ? "Error!" : "त्रुटी!",
      language == "en"
        ? "File format not accepted!"
        : "फाइल स्वरूप स्वीकारले नाही!",
      "error"
    );
  }
} else {
  sweetAlert({
    text:
      language == "en"
        ? "The file name can only contain letters, numbers, hyphens, and underscores. Special characters are not allowed"
        : "फाइलचे नाव किव्हा अक्षर, अंक, हायफन आणि अंडरस्कोरच्या प्रकारे असावे. विशेष वर्णांकीत नको",
    icon: "error",
    buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
  });
}
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        marginTop: "20px",
        gap: 20,
      }}
    >
      <label className={style.uploadButton}>
        {!filePath && (
          <div>
            <Button
              endIcon={<FileUpload />}
              variant="contained"
              component="label"
              size="small"
            >
              <FormattedLabel id="upload" />
              <input
                type="file"
                onChange={(e) => {
                  handleFile(e);
                }}
                hidden
              />
            </Button>
          </div>
        )}
      </label>
    </div>
  );
};
export default UploadButton;

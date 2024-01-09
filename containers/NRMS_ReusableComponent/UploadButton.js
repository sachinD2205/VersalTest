import React from "react";
import axios from "axios";
// import FormattedLabel from "./FormattedLabel";
import URLs from "../../URLS/urls";
import sweetAlert from "sweetalert";

import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useSelector } from "react-redux";

const UploadButton = ({ appName, serviceName, label, filePath, fileUpdater, view = false }) => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const handleFile = (event) => {
    if (event.target.files) {
      console.log("FILE SIZE: ", event.target.files[0]);
      let formData = new FormData();
      formData.append("file", event.target.files[0]);
      axios
        .post(`${URLs.CFCURL}/file/uploadAllTypeOfFile?appName=${appName}&serviceName=${serviceName}`, formData)
        .then((r) => {
          if (r.status === 200) {
            fileUpdater(r.data.filePath);
          }
        });
    }
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: 20,
            // flexDirection: 'column',
            // rowGap: 10,
            width: "max-content",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "medium", fontWeight: "bold" }}>{label} :</span>
          {!filePath && (
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
                // required
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
                {/* {<FormattedLabel id="addFile" />} */}
                {language === "en" ? "Add File" : "फाइल जोडा"}
              </span>
            </div>
          )}
          {filePath && (
            <div>
              <Button
                variant="contained"
                onClick={() => {
                  window.open(`${URLs.CFCURL}/file/preview?filePath=${filePath}`, "_blank");
                }}
              >
                {/* {<FormattedLabel id="preview" />} */}
                {language === "en" ? "Preview" : "पूर्वावलोकन"}
              </Button>
              {!view && (
                <IconButton
                  onClick={() => {
                    axios.delete(`${URLs.CFCURL}/file/discard?filePath=${filePath}`).then((res) => {
                      if (res.status === 200) {
                        fileUpdater("");
                      }
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
    </>
  );
};

export default UploadButton;

import axios from "axios";
import React, { useEffect, useState } from "react";
import sweetAlert from "sweetalert";
import URLs from "../../../../URLS/urls";

import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const UploadButton = ({
  appName,
  serviceName,
  label,
  filePath,
  fileUpdater,
  view,
  onlyImage = false,
  onlyPDF = false,
  imageAndPDF = false,
}) => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const imageFormats = ["image/jpeg", "image/jpg", "image/png"];

  // --------------------Getting logged in authority roles -----------------------

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
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
        if (r.status === 200) {
          fileUpdater(r.data.filePath);
        }
      }).catch((error) => {
        callCatchMethod(error, language);
      })
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
                  window.open(
                    `${URLs.CFCURL}/file/preview?filePath=${filePath}`,
                    "_blank"
                  );
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
                      })
                  }}
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

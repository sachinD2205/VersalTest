import { Add, Delete } from "@mui/icons-material";
import { useEffect } from "react";
import { IconButton } from "@mui/material";
import { React, useState } from "react";
// import style from "../FileUpload/upload.module.css";
import styles from "../../../../styles/LegalCase_Styles/opinion.module.css";

import axios from "axios";
import urls from "../../../../URLS/urls";

import { catchExceptionHandlingMethod } from "../../../../util/util";

const UploadButton = (props) => {
  const [filePath, setFilePath] = useState(null);
  const language = useSelector((state) => state.labels.language);

  const token = useSelector((state) => state.user.user.token);

  // Handle cathch method to display Error sweetalert
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
    console.log("props.filePath <->", props);
    if (props?.fileName) {
      setFilePath(props.fileName);
    }
  }, [props?.fileName]);

  const handleFile = async (e) => {
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("appName", props.appName);
    formData.append("serviceName", props.serviceName);
    axios
      .post(`${urls.CFCURL}/file/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setFilePath(r.data.filePath);
        props.filePath(r.data.filePath);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
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
        axios
          .delete(`${urls.CFCURL}/file/discard?filePath=${filePath}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null),
                props.filePath(null),
                swal("File Deleted Successfully!", { icon: "success" });
            } else {
              swal("Something went wrong..!!!");
            }
          })
          ?.catch((err) => {
            console.log("err", err);
            callCatchMethod(err, language);
          });
      } else {
        swal("File is Safe");
      }
    });
  };

  return (
    <div className={style.align}>
      <label className={style.uploadButton}>
        {!filePath && (
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
          <a
            href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
            target="__blank"
          >
            {showFileName(filePath)}
          </a>
        ) : (
          <span className={style.fileName}>Add File</span>
        )}
      </label>
      {filePath && (
        <IconButton
          onClick={(e) => {
            discard(
              e
            ); /* setFilePath(null),props.filePath(null),discardFile() */
          }}
        >
          <Delete color="error" />
        </IconButton>
      )}
    </div>
  );
};
export default UploadButton;

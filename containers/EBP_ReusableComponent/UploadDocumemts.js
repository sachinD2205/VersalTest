import { Add, Delete } from "@mui/icons-material";
import { useEffect } from "react";
import { IconButton } from "@mui/material";
import { React, useState } from "react";
import style from "../FileUpload/upload.module.css";
import axios from "axios";

const UploadButton = (props) => {
  const [filePath, setFilePath] = useState(null);

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
      .post(`http://localhost:8090/cfc/api/file/upload`, formData)
      .then((r) => {
        setFilePath(r.data.filePath);
        props.filePath(r.data.filePath);
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
          .delete(
            `http://localhost:8090/cfc/api/file/discard?filePath=${filePath}`
          )
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null),
                props.filePath(null),
                swal("File Deleted Successfully!", { icon: "success" });
            } else {
              swal("Something went wrong..!!!");
            }
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
            href={`http://localhost:8090/cfc/api/file/preview?filePath=${filePath}`}
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

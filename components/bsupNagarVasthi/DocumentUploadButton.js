import { Button, IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import urls from "../../URLS/urls"
// import "./App.css";
import DeleteIcon from "@mui/icons-material/Delete";
import urls from "../../URLS/urls";

const MAX_COUNT = 5;

const UploadButtonBsup = () => {
  let filePath = {};
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);
  // const [filePath, setfilePath] = useState("");
  const [filesAfterUpload, setFilesAfterUpload] = useState([]);
  const [allFiles, setAllFiles] = useState(
    JSON.parse(localStorage.getItem("UploadedDoc"))
      ? [...JSON.parse(localStorage.getItem("UploadedDoc"))]
      : [],
  );

  // useEffect(() => {
  //   setAllFiles([...JSON.parse(localStorage.getItem("UploadedDoc")),])
  // }, [localStorage.getItem("UploadedDoc")])

  const handleUploadFiles = (files) => {
    console.log(":20", files);
    const uploaded = [...uploadedFiles];
    let limitExceeded = false;

    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) {
          setFileLimit(true);
        }
        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) {
      setUploadedFiles(uploaded);
    }
  };

  ///////////////////////////////////////////////////////////////
  const handleFileEvent = (e) => {
    console.log(":30", e.target.files[0]);
    var path = window.URL.createObjectURL(e.target.files[0]);
    console.log(":40", path);
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
    console.log(":241");
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("appName", "BSUP-Scheme");
    formData.append("serviceName", "BSUP-BachatgatRegistration");
    formData.append("locale", "en");

    // for file preview ---- `http://103.132.2.83:9003/gm/apifile/previewNew`

    axios
      .post(
        // `http://122.15.104.76:9012/bsup/api/file/upload`,
        `${urls.CFCURL}/file/upload`,
        formData,
      )
      .then((res) => {
        console.log(":120", res?.data.filePath);
        setFilesAfterUpload([...filesAfterUpload, res?.data]);
        setAllFiles([...allFiles, res?.data]);
        localStorage.setItem("UploadedDoc", JSON.stringify([...allFiles, res?.data]));
      });
  };

  // useEffect(() => {
  //   console.log(":20", filesAfterUpload)
  // }, [filesAfterUpload])

  ////////////////////////////////////////////////////////////////////////

  let previewFunction = (fileName1) => {
    alert("File in preview");
    console.log(":1111", fileName1);
    let filterPathName = JSON.parse(localStorage.getItem("UploadedDoc"))?.filter(
      (obj) => obj.fileName === fileName1.fileName,
    );
    window.open(
      `${urls.CFCURL}/file/preview?filePath=${filterPathName[0].filePath}`,
      // `http://122.15.104.76:9012/bsup/api/file/preview?filePath=${filterPathName[0].filePath}`,
      { locale: "en" },
      "_blank",
    );
  };

  //////////////////////////////////////////////////////////////////////////
  let deleteFunction = (fileName1) => {
    console.log(":410", fileName1);
    let filterPathName = JSON.parse(localStorage.getItem("UploadedDoc"))?.filter(
      (obj) => obj.fileName === fileName1.fileName,
    );
    let formDataDiscard = new FormData();
    formDataDiscard.append("appName", "BSUP-Scheme");
    formDataDiscard.append("serviceName", "BSUP-BachatgatRegistration");
    formDataDiscard.append("locale", "en");
    axios
      // .delete(`http://103.132.2.83:9003/gm/api/file/discard?filePath=${filterPathName[0].filePath}`)
      .delete(
        // `http://122.15.104.76:9012/bsup/api/file/discard?filePath=${filterPathName[0].filePath}`,
        `${urls.CFCURL}/file/discard?filePath=${filterPathName[0].filePath}`,
        formDataDiscard,
      )
      .then((res) => {
        if (res.status === 200) {
          alert("deletedFile");
          let filterAfterDelete = JSON.parse(localStorage.getItem("UploadedDoc"))?.filter(
            (obj) => obj.fileName !== fileName1.fileName,
          );

          localStorage.setItem("UploadedDoc", JSON.stringify(filterAfterDelete));
          // localStorage.setItem(
          //   "UploadedDoc",
          //   JSON.stringify([...filterAfterDelete])
          // )
          setAllFiles(JSON.parse(localStorage.getItem("UploadedDoc")));
        }
      });
  };

  // Columns
  const columns = [
    // {
    //   field: "documentKey",
    //   headerName: "Document Id",
    //   width: 100,
    //   // flex: 1,
    // },

    {
      field: "documentType",
      headerName: "fileType",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    // {
    //   field: "userName",
    //   headerName: "Uploaded By",
    //   // field: language === "en" ? "attachedNameEn" : "attachedNameMr",
    //   headerAlign: "center",
    //   align: "center",
    //   flex: 1,
    // },
    {
      field: "attachedDate",
      headerName: "attachment",
      // field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "Action",
      headerName: "actions",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (record) => {
        console.log("record?.row?.attachmentName", record);
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => {
                // console.log("record.row.filePath", record.row.filePath)
                window.open(`${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`, "_blank");
              }}
            >
              <Visibility />
            </IconButton>

            <IconButton color="error" onClick={() => discard(record.row)}>
              <Delete />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <div
      style={{
        paddingTop: "20px",
      }}
    >
      <div
        style={{
          paddingTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
        }}
      >
        <Button
          component="label"
          variant="contained"
          style={{
            width: "160px",
            height: "40px",
          }}
        >
          <input
            type="file"
            id="fileUpload"
            multiple
            accept="application/pdf,image/*"
            onChange={(e) => handleFileEvent(e)}
            disabled={fileLimit}
            hidden
          />
          Upload Files
        </Button>
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* UploadedDoc */}
        {allFiles?.map((file, i) => (
          <div>
            <Button
              component="label"
              variant="contained"
              size="small"
              sx={{ marginLeft: "20px" }}
              onClick={() => previewFunction(file)}
            >
              {i + 1} : {file.fileName}
            </Button>
            <IconButton onClick={() => deleteFunction(file)}>
              <DeleteIcon style={{ color: "red" }} />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadButtonBsup;

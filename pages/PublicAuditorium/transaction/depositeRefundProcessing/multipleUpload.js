import { Button, IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import urls from "../../URLS/urls"
// import "./App.css";
import DeleteIcon from "@mui/icons-material/Delete";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const MAX_COUNT = 5;

const MultipleUpload = ({ files, setFiles }) => {
  let filePath = {};
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);
  // const [filePath, setfilePath] = useState("");
  const [filesAfterUpload, setFilesAfterUpload] = useState([]);
  const [allFiles, setAllFiles] = useState(
    JSON.parse(localStorage.getItem("UploadedDoc"))
      ? [...JSON.parse(localStorage.getItem("UploadedDoc"))]
      : []
  );

  const token = useSelector((state) => state.user.user.token);
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
    formData.append("appName", "GM");
    formData.append("serviceName", "GM-CMPL");
    // formData.append("appName", "PABBM");
    // formData.append("serviceName", "PABBM-DRPBA");

    // for file preview ---- `http://122.15.104.76:9090/cfc/cfc/apifile/previewNew`

    axios
      .post(`${urls.CFCURL}/file/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(":120", res?.data.filePath);
        setFilesAfterUpload([...filesAfterUpload, res?.data]);
        setAllFiles([...allFiles, res?.data]);
        localStorage.setItem(
          "UploadedDoc",
          JSON.stringify([...allFiles, res?.data])
        );
        console.log("All Files", allFiles, setFilesAfterUpload);
        setFiles([...allFiles, res?.data]);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // useEffect(() => {
  //   console.log(":20", filesAfterUpload)
  // }, [filesAfterUpload])

  ////////////////////////////////////////////////////////////////////////
  let previewFunction = (fileName1) => {
    console.log(":1111", fileName1);
    let filterPathName = JSON.parse(
      localStorage.getItem("UploadedDoc")
    )?.filter((obj) => obj.fileName === fileName1.fileName);
    window.open(
      //   `http://122.15.104.76:9090/cfc/cfc/api/file/preview?filePath=${filterPathName[0].filePath}`,
      `${urls.CFCURL}/file/preview?filePath=${filterPathName[0].filePath}`,
      "_blank"
    );
  };
  //////////////////////////////////////////////////////////////////////////
  let deleteFunction = (fileName1) => {
    console.log(":410", fileName1);
    let filterPathName = JSON.parse(
      localStorage.getItem("UploadedDoc")
    )?.filter((obj) => obj.fileName === fileName1.fileName);
    axios
      //   .delete(`http://122.15.104.76:9090/cfc/cfc/api/file/discard?filePath=${filterPathName[0].filePath}`)
      .delete(
        `${urls.CFCURL}/file/discard?filePath=${filterPathName[0].filePath}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          let filterAfterDelete = JSON.parse(
            localStorage.getItem("UploadedDoc")
          )?.filter((obj) => obj.fileName !== fileName1.fileName);

          localStorage.setItem(
            "UploadedDoc",
            JSON.stringify(filterAfterDelete)
          );
          // localStorage.setItem(
          //   "UploadedDoc",
          //   JSON.stringify([...filterAfterDelete])
          // )
          setAllFiles(JSON.parse(localStorage.getItem("UploadedDoc")));
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  ///////////////////////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   alert("allFilesvvvvvvv")
  // })

  return (
    <div style={{ width: "100%" }}>
      <div>
        <Button component="label" variant="contained" size="small">
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
          marginTop: "10px",
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

export default MultipleUpload;

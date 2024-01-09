import { Add, Delete } from "@mui/icons-material";
import { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import style from "./upload.module.css";
import axios from "axios";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/labels/modules/ebpLabels"
import { useSelector } from "react-redux";

const UploadButton = (props) => {
  const [filePath, setFilePath] = useState(props.fileName);
  const language = useSelector((state) => state.labels.language);
  // console.log("document", props)

  useEffect(() => {
    if (props?.fileName) {
      setFilePath(props.fileName);
    }
  }, [props?.fileName]);

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error"
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error"
      );
    } else if(err.message === "Request failed with status code 500") {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Please select only PDF, JPG & PNG format file!" : "कृपया फक्त PDF, JPG आणि PNG फॉरमॅट फाइल निवडा!",
        "error"
      );
    } 
    else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error"
      );
    }
  };

  const handleFile = async (e) => {
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("appName", props.appName);
    formData.append("serviceName", props.serviceName);
    axios.post(`${urls.CFCURL}/file/upload`, formData).then((r) => {
      console.log("uploaded document", r.data);
      setFilePath(r.data.filePath);
      props.filePath(r.data.filePath);
    }).catch((err)=>{
      catchMethod(err)
    })
  };

  

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName?.split("__");
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
          .delete(`${urls.CFCURL}/file/discard?filePath=${filePath}`)
          .then((res) => {
            if (res.data.status == "SUCCESS") {
              setFilePath(null), props.filePath(null);
              swal("File Deleted Successfully!", { icon: "success" });
            } else {
              swal("Something went wrong..!!!");
            }
          });
          // props?.id ? props?.handleDeleteDocument(props?.id) : props?.handleDeleteDocument()
          
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
              color='secondary'
              sx={{
                width: 30,
                height: 30,
                border: "1.4px dashed #9c27b0",
                marginRight: 1.5,
              }}
            />
            <input
              disabled={props?.mode === "View"}
              type='file'
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
            target='__blank'
          >
            <Button variant="contained" size="small">  {language == "en" ? "View" : "पहा"} </Button>
          </a>
        ) : (
          <span className={style.fileName}>  {language == "en" ? "Upload" : "अपलोड करा"}      </span>
        )}
      </label>
      {
        props?.mode !== "View" ? filePath &&  (
          <IconButton
            onClick={(e) => {
              discard(
                e,
              ); /* setFilePath(null),props.filePath(null),discardFile() */
            }}
          >
            <Delete color='error' />
          </IconButton>
        )
        :""
      }
      
    </div>
  );
};
export default UploadButton;

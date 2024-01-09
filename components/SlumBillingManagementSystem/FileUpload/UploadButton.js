import { FileUpload } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import style from "../../../styles/LegalCase_Styles/upload.module.css";
import { useSelector } from "react-redux";
const UploadButton = (props) => {
  const [filePath, setFilePath] = useState("");
  const [fileName, setFileName] = useState("");
  const user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state.labels.language);
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
  useEffect(() => {
    if (props?.fileName) {
      setFilePath(props.fileName);
    }
  }, [props?.fileName]);


  useEffect(() => {
    props.filePath(filePath);
  }, [filePath]);

  const handleFile = (e) => {
    if (e.target.files) {
      // Apply the register function to the hidden file input field
      const file = e.target.files[0];
      console.log("FILE SIZE: ", file);
      if (!/\.(pdf|jpe?g|png)$/i.test(file.name)) {
        swal(
          language==='en'?"Error!":"त्रुटी!",
          language==='en'?"Invalid file format. Only .pdf, .jpg, .png files are accepted.":"अवैध फाइल स्वरूप. फक्त .pdf, .jpg, .png फाइल्स स्वीकारल्या जातात.",
          "error"
        );
        return;
      }
      else if (file.size > 2097152) {
        swal(
          language==='en'?"Error!":"त्रुटी!",
          language==='en'?"Please upload a file with size less than 2MB!":"कृपया 2MB पेक्षा कमी आकाराची फाइल अपलोड करा!",
          "error"
        );
        return;
      }else{
      props.modalState(false);
      props.uploading(true);
      let formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("appName", props.appName);
      formData.append("serviceName", props.serviceName);
      formData.append("fileName", 'fileName');
      console.log('fileName', fileName)
      axios
        .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            // serviceId: selectedMenuFromDrawer,
          },
        })
        .then((r) => {
          setFilePath(r.data.filePath);
          props.filePath(r.data);
          props.handleClose();
        }).catch((err)=>{
          cfcErrorCatchMethod(err,true)
        });
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* {!filePath && (
        <TextField
          sx={{
            width: 200,
            // marginBottom: '5px'
          }}
          onChange={(e) => {
            setFileName(e.target.value);
            console.log('e.target.value', e.target.value)
            // props.setFileLabel(e.target.value)
          }}
          id="standard-basic"
          label={<FormattedLabel id="fileName" />}
          variant="standard"
          value={fileName}
        />
      )} */}
      <label className={style.uploadButton}>
        {!filePath && (
          // <div
          //   style={{ display: "flex", alignItems: "center" }}
          //   onClick={() => {
          //     if (!fileName) {
          //       swal({
          //         text:language==='en'? "Please enter file name first ":"कृपया प्रथम फाइल नाव प्रविष्ट करा",
          //         icon: "warning",
          //       });
          //     }
          //   }}
          // >
            <Button
              startIcon={<FileUpload />}
              variant="contained"
              component="label"
              size="small"
            >
              <FormattedLabel id="upload" />
              <input
                // disabled={!fileName ? true : false}
                type="file"
                onChange={(e) => {
                  handleFile(e);
                }}
                hidden
              />
            </Button>
            
         
          // </div>
        )}
      </label>
    </div>
  );
};
export default UploadButton;

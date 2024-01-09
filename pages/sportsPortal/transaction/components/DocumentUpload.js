import { Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import UploadButton from "../../../../containers/SP_ReusableComponent/FileUpload/UploadButton";
import URLS from "../../../../URLS/urls";

const DocumentUpload = () => {
  const [fileName, setFileName] = useState(null);
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();

  let appName = "SP";
  let serviceName = "SP-SPORTSBOOKING";

  // getBase64 ===
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "documents", // unique name for your Field Array
  });

  const handleFile1 = async (e, labelName) => {
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios
      .post(
        `${URLS.CFCURL}
/file/upload?appName=${appName}&serviceName=${serviceName}`,
        formData,
      )
      .then((r) => {
        if (r.status === 200) {
          if (labelName === "panCardPhoto") {
            setValue("panCardPhoto", r.data.filePath);
          } else if (labelName == "affadavitPhoto") {
            setValue("affadavitPhoto", r.data.filePath);
          } else if (labelName == "otherDocumentPhoto") {
            setValue("otherDocumentPhoto", r.data.filePath);
          } else if (labelName == "photo") {
            setValue("photo", r.data.filePath);
          }
        } else {
          sweetAlert("Error");
        }
      });
  };

  return (
    <>
      {/* <div className={styles.row}>
        <Typography variant="h6" sx={{ marginTop: 1 }}>
          Document Upload
        </Typography>
      </div> */}

      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
        }}
      >
        <strong>
          <FormattedLabel id="documentUpload" />
        </strong>
      </div>
      <Grid
        container
        sx={{
          marginLeft: 5,
          marginTop: 5,
          marginBottom: 5,
          align: "center",
        }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography>
            <strong>{<FormattedLabel id="aadharCard" />}</strong>
          </Typography>
          <UploadButton
            Change={(e) => {
              handleFile1(e, "aadharCardPhoto");
              //setValue("aadharCardPhoto", e.target.files[0]);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography>
            {/* <strong>{<FormattedLabel id="photo" />}</strong> */}
            <strong>Photo</strong>
          </Typography>
          <UploadButton
            Change={(e) => {
              handleFile1(e, "photo");
              // setValue("panCardPhoto", e.target.files[0]);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography>
            <strong>{<FormattedLabel id="panCard" />}</strong>
          </Typography>
          <UploadButton
            Change={(e) => {
              handleFile1(e, "panCardPhoto");
              // setValue("panCardPhoto", e.target.files[0]);
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 0 }}>
          <Typography>
            <strong>{<FormattedLabel id="otherDocumentPhoto" />}</strong>
          </Typography>
          <UploadButton
            Change={(e) => {
              handleFile1(e, "otherDocumentPhoto");
              //setValue("otherDocumentPhoto", e.target.files[0]);
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DocumentUpload;

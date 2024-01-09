import { Grid, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import axios from "axios"
import React, { useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import UploadButton from "../../../../components/propertyTax/FileUpload/UploadButton"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"

const useStyles = makeStyles({
  blue: {
    color: "blue",
  },
})

const DocumentsUpload = () => {
  const classes = useStyles()
  const [fileName, setFileName] = useState(null)
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext()

  let appName = "HMS"
  let serviceName = "H-IssuanceofHawkerLicense"

  // getBase64 ===
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "documents", // unique name for your Field Array
  })

  const handleFile1 = async (e, labelName) => {
    let formData = new FormData()
    formData.append("file", e.target.files[0])
    axios
      .post(
        `http://localhost:8090/cfc/api/file/upload?appName=${appName}&serviceName=${serviceName}`,
        formData
      )
      .then((r) => {
        if (r.status === 200) {
          if (labelName === "panCardPhoto") {
            setValue("panCardPhoto", r.data.filePath)
          } else if (labelName === "rationCardPhoto") {
            setValue("rationCardPhoto", r.data.filePath)
          } else if (labelName == "disablityCertificatePhoto") {
            setValue("disablityCertificatePhoto", r.data.filePath)
          } else if (labelName == "affadavitPhoto") {
            setValue("affadavitPhoto", r.data.filePath)
          } else if (labelName == "otherDocumentPhoto") {
            setValue("otherDocumentPhoto", r.data.filePath)
          }
        } else {
          sweetAlert("Error")
        }
      })
  }

  return (
    <>
      {/**
      <div className={styles.row}>
        <Typography variant='h6' sx={{ marginTop: 1 }}>
          <strong> Document Upload</strong>
        </Typography>
      </div>
     */}{" "}
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
          <Typography variant="subtitle2">
            <strong>
              <FormattedLabel id="adharCard" />
            </strong>
          </Typography>
          <UploadButton
            Change={(e) => {
              handleFile1(e, "aadharCardPhoto")
              //setValue("aadharCardPhoto", e.target.files[0]);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            <strong>
              <FormattedLabel id="panCard" />
            </strong>
          </Typography>
          <UploadButton
            Change={(e) => {
              handleFile1(e, "panCardPhoto")
              // setValue("panCardPhoto", e.target.files[0]);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            <strong>
              <FormattedLabel id="rationCard" />
            </strong>
          </Typography>
          <UploadButton
            Change={(e) => {
              handleFile1(e, "rationCardPhoto")
              // setValue("rationCardPhoto", e.target.files[0]);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            <strong>
              <FormattedLabel id="disablityCretificatePhoto" />
            </strong>
          </Typography>
          <UploadButton
            Change={(e) => {
              handleFile1(e, "disablityCertificatePhoto")
              //setValue("disablityCertificatePhoto", e.target.files[0]);
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 4 }}>
          <Typography variant="subtitle2">
            <strong>
              <FormattedLabel id="otherDocumentPhoto" />
            </strong>
          </Typography>
          <UploadButton
            Change={(e) => {
              handleFile1(e, "otherDocumentPhoto")
              //setValue("otherDocumentPhoto", e.target.files[0]);
            }}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={2} xl={1} sx={{ marginTop: 4 }}>
          <Typography variant="subtitle2">
            <strong>
              <FormattedLabel id="affidaviteOnRS100StampAttachement" />
            </strong>
          </Typography>
          <UploadButton
            Change={(e) => {
              handleFile1(e, "affadavitPhoto")
              //setValue("affadavitPhoto", e.target.files[0]);
            }}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default DocumentsUpload

import React from "react"
import axios from "axios"
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel"
import URLs from "../../URLS/urls"
import sweetAlert from "sweetalert"

import { Add, Delete } from "@mui/icons-material"
import { Button, IconButton } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"

const UploadButton = (props) => {
  const handleDocumentButton = () => {
    sweetAlert({
      title: "Are you sure?",
      text: "If you clicked yes you can upload your Documents otherwise not!",
      icon: "warning",
      buttons: ["Cancle", "Yes"],
      dangerMode: false,
    }).then((willDelete) => {
      if (willDelete) {
        sweetAlert("Your Documents is uploaded")
      } else {
        sweetAlert("Your Action is Retrieved")
      }
    })
  }

  const handleFile = (event) => {
    // sweetAlert("Your Documents is uploaded")
    if (event.target.files) {
      console.log("FILE SIZE: ", event.target.files[0])
      let formData = new FormData()
      formData.append("file", event.target.files[0])
      console.log(":51", formData.name)
      axios
        .post(
          `${URLs.CFCURL}/file/upload?appName=${props.appName}&serviceName=${props.serviceName}`,
          formData
        )
        .then((r) => {
          if (r.status === 200) {
            props.fileUpdater(r.data.filePath)
          }
        })
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "88%",
          justifyContent: "flex-start",
          alignItems: "center",
          border: "1px solid #454545",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: 20,
            // flexDirection: 'column',
            // rowGap: 10,
            padding: "5px 5px",
            width: "max-content",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "small", fontWeight: "bold" }}>
            {props.label} :{" "}
            {/* {props.filePath.substring(
              53,
              props.filePath.lastIndexOf(".").length
              // props.filePath.firstIndexOf("__")
            )} */}
            {/* {props.filePath} */}
            {props.filePath.substring(
              props.filePath.lastIndexOf("__") + 2,
              props.filePath.length
            )}
          </span>
          {!props.filePath && (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* <Add
                  sx={{
                    width: 30,
                    height: 30,
                    border: "1.5px dashed #1976d2",
                    color: "#1976d2",
                    marginRight: 1.5,
                  }}
                /> */}

                <input
                  id="uploadButton"
                  type="file"
                  multiple
                  onChange={(e) => {
                    // @ts-ignore
                    console.log(":42", e)
                    if (e.target.files[0]) {
                      // @ts-ignore
                      if (e.target.files[0].size > 2097152) {
                        sweetAlert(
                          "Error!",
                          "Please upload file (PDF/JPG/JPEG/PNG) with size less than 2MB !",
                          "error"
                        )
                        e.target.value = ""
                      } else {
                        handleFile(e)
                      }
                    }
                  }}
                  required
                  hidden
                />

                <span
                  style={{
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    fontSize: 12,
                    color: "#1976d2",
                    background: "#1976D2",
                    color: "white",
                    // paddingTop: "6px",
                    // paddingBottom: "6px",
                    // paddingLeft: "8px",
                    // paddingRight: "8px",
                    padding: "6px 10px 6px 10px",
                    borderRadius: "20px",
                  }}
                >
                  {/* {<FormattedLabel id="addFile" />} */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      // width: "10%",
                    }}
                  >
                    Upload Document <CloudUploadIcon />
                  </div>
                </span>

                {/* <span
                  style={{
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    fontSize: 12,
                    color: "#1976d2",
                    // background: "#1976D2",
                    // color: "white",
                  }}
                >
                  Upload Doc
                </span> */}
              </div>
            </>
          )}
          {props.filePath && (
            <div>
              {/* <span>{props.filePath.substring(1, 50).split(" ", 3)}</span> */}
              <span>{props?.filePath?.fileName}</span>

              <Button
                variant="contained"
                onClick={() => {
                  window.open(
                    `${URLs.CFCURL}/file/preview?filePath=${props.filePath}`,
                    "_blank"
                  ),
                    console.log(":50", props.filePath)
                }}
                size="small"
              >
                {/* {<FormattedLabel id="preview" />} */}
                VIEW
              </Button>

              <IconButton
                onClick={() => {
                  axios
                    .delete(
                      `${URLs.CFCURL}/file/discard?filePath=${props.filePath}`
                    )
                    .then((res) => {
                      if (res.status === 200) {
                        props.fileUpdater("")
                      }
                    })
                }}
              >
                <Delete color="error" />
              </IconButton>
            </div>
          )}
        </label>
      </div>
    </>
  )
}

export default UploadButton

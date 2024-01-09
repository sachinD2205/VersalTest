import React, { useEffect, useState } from "react"
import axios from "axios"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel"
import URLs from "../../../URLS/urls"
import sweetAlert from "sweetalert"
import { Add, Delete } from "@mui/icons-material"
import { Button, IconButton } from "@mui/material"
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../util/util"
import { useSelector } from "react-redux"
import {
  DecryptData,
  EncryptData,
} from "../../../components/common/EncryptDecrypt"
import Loader from "../../../containers/Layout/components/Loader"
const PrapatraUpload = ({
  appName,
  serviceName,
  label,
  filePath,
  fileUpdater,
  view = false,
  setLoading,
  originalName,
  showFileOnEditName,
}) => {
  const [fileNameOrig, setFileNameOrig] = useState(null)
  const [fileExtension, setFileExtension] = useState(null)
  const [encryptedFilePath, setEncryptedFilePath] = useState(null)

  const [loader, setLoader] = useState(false)

  const language = useSelector((state) => state?.labels.language)
  const [catchMethodStatus, setCatchMethodStatus] = useState(false)
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language)
        setCatchMethodStatus(false)
      }, [0])
      setCatchMethodStatus(true)
    }
  }

  const userToken = useGetToken()

  const handleFile = (event) => {
    if (event.target.files) {
      console.log("FILE SIZE: ", event.target.files[0])
      let formData = new FormData()
      formData.append("file", event.target.files[0])
      formData.append("appName", appName)
      formData.append("serviceName", serviceName)
      setLoading(true)
      setLoader(true)
      axios
        .post(`${URLs.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (r.status === 200) {
            setLoader(false)
            fileUpdater(r?.data?.filePath)
            setFileNameOrig(r?.data?.fileName)
            originalName(r?.data?.fileName)

            setLoading(false)
          } else {
            sweetAlert("Something went wrong!")
            setLoading(false)
            setLoader(false)
          }
        })
        .catch((error) => {
          setLoader(false)
          callCatchMethod(error, language)
        })
    }
  }

  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64)
    const length = binaryString.length
    const bytes = new Uint8Array(length)

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    return bytes.buffer
  }

  useEffect(() => {
    if (filePath) {
      const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath)

      setFileExtension(DecryptPhoto?.split(".").pop().toLowerCase())

      const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto)

      setEncryptedFilePath(ciphertext)
    }
  }, [filePath])

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        {loader ? (
          <Loader />
        ) : (
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
            {!filePath && !view && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Add
                  sx={{
                    width: 20,
                    height: 20,
                    border: "1.5px dashed #1976d2",
                    color: "#1976d2",
                    marginRight: 1.5,
                  }}
                />
                <input
                  id="uploadButton"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      if (e.target.files[0].size > 20 * 1024 * 1024) {
                        sweetAlert(
                          "Error!",
                          "Please upload file (.xlxs) with size upto 20MB !",
                          "error"
                        )
                        e.target.value = ""
                      } else if (
                        e.target.files[0]?.type ===
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                        e.target.files[0]?.type === "application/xlxs"
                        // e.target.files[0]?.type === "application/vnd.ms-excel" ||
                      ) {
                        console.log(":a1", e.target.files[0]?.type)
                        handleFile(e)
                      } else {
                        sweetAlert(
                          "Error!",
                          "You can only upload excel(.xlxs) files",
                          "error"
                        )
                        e.target.value = ""
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
                  {<FormattedLabel id="addFile" />}
                </span>
              </div>
            )}
            {filePath && (
              <div>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (fileExtension === "xlsx") {
                      const url = `${URLs.CFCURL}/file/previewNewEncrypted?filePath=${encryptedFilePath}`

                      axios
                        .get(url, {
                          headers: {
                            Authorization: `Bearer ${userToken}`,
                          },
                        })
                        .then((response) => {
                          console.log("Excel API Response:", response)
                          console.log(
                            "Excel API Response Data:",
                            response.data.fileName
                          )

                          const excelBase64 = response.data.fileName

                          const data = base64ToArrayBuffer(excelBase64)

                          const excelBlob = new Blob([data], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                          })

                          // saveAs(excelBlob, "Prapatra.xlsx")
                          saveAs(
                            excelBlob,
                            `${
                              fileNameOrig !== null
                                ? fileNameOrig
                                : showFileOnEditName
                            }`
                          )
                        })
                        .catch((error) => {
                          console.log(":a2", error)
                          callCatchMethod(error, language)
                        })
                    }
                  }}
                  size="small"
                >
                  {fileNameOrig !== null
                    ? fileNameOrig
                    : showFileOnEditName !== null
                    ? showFileOnEditName
                    : "FileName is not Available"}
                </Button>
                {!view && (
                  <IconButton
                    onClick={() => {
                      const DecryptPhoto = DecryptData(
                        "passphraseaaaaaaaaupload",
                        filePath
                      )

                      const ciphertext = EncryptData(
                        "passphraseaaaaaaadiscard",
                        DecryptPhoto
                      )
                      setLoader(true)
                      axios
                        .delete(
                          `${URLs.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`,
                          {
                            headers: {
                              Authorization: `Bearer ${userToken}`,
                            },
                          }
                        )
                        .then((res) => {
                          if (res.status === 200) {
                            setLoader(false)
                            fileUpdater("")
                            originalName("")
                          }
                        })
                        .catch((error) => {
                          setLoader(false)
                          callCatchMethod(error, language)
                        })
                    }}
                  >
                    <Delete color="error" />
                  </IconButton>
                )}
              </div>
            )}
            {!filePath && (
              <span style={{ cursor: "text" }}>
                {language == "en"
                  ? "No File Uploaded!"
                  : "कोणतीही फाइल अपलोड केलेली नाही!"}
              </span>
            )}
          </label>
        )}
      </div>
    </>
  )
}

export default PrapatraUpload

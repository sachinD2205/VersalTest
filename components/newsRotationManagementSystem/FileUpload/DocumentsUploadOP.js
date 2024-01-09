import { Add, Delete } from "@mui/icons-material"
import { Button, IconButton } from "@mui/material"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useForm, useFormContext } from "react-hook-form"
import swal from "sweetalert"
import style from "./upload.module.css"
import urls from "../../../URLS/urls"
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks"
import { saveAs } from "file-saver"
import { DecryptData, EncryptData } from "../../common/EncryptDecrypt"

const UploadButtonOP = (props) => {
  // const methods = useForm();
  const {
    control,
    register,
    setValue,
    getValues,
    reset,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const [filePath, setFilePath] = useState(null)
  const [encryptedFilePath, setEncryptedFilePath] = useState(null)
  // const [fileExtensionNew, setFileExtensionNew] = useState(null)
  const [fileNameToShow, setFileNameToShow] = useState(null)
  // const [fileKey,setFileKey]=useState(null);

  const userToken = useGetToken()

  useEffect(() => {
    console.log("props.fileKey->>>>>>>", props?.fileKey)
    console.log("props.showDel->>>>>>>", props?.showDel)
  }, [])

  useEffect(() => {
    console.log("props.filePath <->", props?.fileDtl)
    if (props?.fileDtl) {
      setFilePath(props?.fileDtl)
      // setFileNameToShow(props?.fileDtl)
    }
  }, [props?.fileDtl])

  const handleFile = async (e) => {
    let extension =
      e.target.files[0].name.substring(
        e.target.files[0].name.lastIndexOf(".") + 1,
        e.target.files[0].name.length
      ) || e.target.files[0].name
    let size = e.target.files[0].size
    let flagForFileType = false
    let flagForSize = false

    console.log("extension", extension)
    console.log("e.target.files[0].size", size)

    if (size < 15728640) {
      flagForSize = true
      if (
        [
          "docx",
          "doc",
          "xlsx",
          "xlsm",
          "xlsb",
          "xls",
          "jpeg",
          "jpg",
          "png",
        ].includes(extension) &&
        props.fileKey == "advirtiseMentInDocx"
      ) {
        flagForFileType = true
      } else if (
        ["pdf"].includes(extension) &&
        props.fileKey == "advirtiseMentInPdf"
      ) {
        flagForFileType = true
      } else {
        if (
          props.fileKey != "advirtiseMentInDocx" &&
          props.fileKey != "advirtiseMentInPdf"
        ) {
          flagForFileType = true
        } else {
          console.log("props.fileKey-->", props.fileKey)
          console.log("extension-->", extension)
          console.log("size-->", size)
        }
      }
    }
    console.log("flagForFileType , flagForSize", flagForFileType, flagForSize)
    if (flagForFileType && flagForSize) {
      let formData = new FormData()

      formData.append("file", e.target.files[0])
      formData.append("appName", props.appName)
      formData.append("serviceName", props.serviceName)
      axios
        .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          let f = r.data.filePath

          let fileName = r.data.fileName
          setFilePath(f)

          setFileNameToShow(fileName)

          // props.filePath(f);
          setValue(props.fileKey, f)
          clearErrors(props.fileKey)
        })
    } else {
      if (!flagForFileType) {
        swal("Invalid File Type!!!")
      } else if (!flagForSize) {
        swal("File Size should be less than 15MB!!!")
      } else if (!flagForFileType && !flagForSize) {
        swal("Invalid File Type And File Size should be less than 15MB!!!")
      }
    }
  }

  // function showFileName(fileName) {
  //   alert("aaaya")

  //   console.log(":a2", fileName)
  //   let fileNamee = []
  //   fileNamee = fileName.split("__")
  //   return fileNamee[1]
  // }

  const discard = async (e) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath)

        const ciphertext = EncryptData("passphraseaaaaaaadiscard", DecryptPhoto)

        axios
          .delete(
            `${urls.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null), setValue(props.fileKey, null)
              swal("File Deleted Successfully!", { icon: "success" })
            } else {
              swal("Something went wrong..!!!")
            }
          })
      } else {
        swal("File is Safe")
      }
    })
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  useEffect(() => {
    if (filePath) {
      const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath)

      // setFileExtensionNew(DecryptPhoto?.split(".").pop().toLowerCase())

      const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto)

      setEncryptedFilePath(ciphertext)
    }
  }, [filePath])

  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64)
    const length = binaryString.length
    const bytes = new Uint8Array(length)

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    return bytes.buffer
  }

  const filePreviewFunction = (res, fileNameArray, mimeType) => {
    if (res === ".xlsx" || res === ".xls") {
      const data = base64ToArrayBuffer(fileNameArray)
      const excelBlob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      saveAs(excelBlob, "Document.xlsx")
    } else if (res === ".docx") {
      const data = base64ToArrayBuffer(fileNameArray)
      const excelBlob = new Blob([data], {
        type: "application / vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
      saveAs(excelBlob, "Document.docx")
    } else if (res === ".pdf") {
      const dataUrl = `data:${mimeType};base64,${fileNameArray}`
      const newTab = window.open()
      newTab.document.write(`
                          <html>
                            <body style="margin: 0;">
                              <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
                            </body>
                          </html>
                        `)
    } else {
      const imageUrl = `data:image/png;base64,${fileNameArray}`
      const newTab = window.open()
      newTab.document.body.innerHTML = `<img src="${imageUrl}" />`
    }
  }

  return (
    <div className={style.align}>
      <label className={style.uploadButton}>
        {!filePath && props.showDel === true && (
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
                handleFile(e)
              }}
              hidden
            />
          </>
        )}
        {filePath ? (
          <Button
            onClick={() => {
              axios
                .get(
                  `${urls.CFCURL}/file/previewNewEncrypted?filePath=${encryptedFilePath}`,
                  {
                    headers: {
                      Authorization: `Bearer ${userToken}`,
                    },
                  }
                )
                .then((res) => {
                  console.log(":aw", res)
                  filePreviewFunction(
                    res?.data?.extension,
                    res?.data?.fileName,
                    res?.data?.mimeType
                  )
                })
            }}
            color="success"
            variant={fileNameToShow ? "" : "contained"}
            size="small"
          >
            {fileNameToShow ? fileNameToShow : "View"}
          </Button>
        ) : props?.showDel == true ? (
          <span className={style.fileName}>Upload File</span>
        ) : (
          <span className={style.fileName} />
        )}
      </label>
      {filePath && props.showDelBtn == true && (
        <IconButton
          onClick={(e) => {
            discard(e)
          }}
        >
          <Delete color="error" />
        </IconButton>
      )}
    </div>
  )
}
export default UploadButtonOP

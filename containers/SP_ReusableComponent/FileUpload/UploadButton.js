import { Add, Delete } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import FormattedLabel from '../../reuseableComponents/FormattedLabel'
import style from '../FileUpload/upload.module.css'

const UploadButton = ({ Change }) => {
  const [file, setFile] = useState(null)

  function openBase64NewTab(base64Pdf) {
    var blob = base64toBlob(base64Pdf)
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, 'pdfBase64.pdf')
    } else {
      const blobUrl = URL.createObjectURL(blob)
      window.open(blobUrl)
    }
  }

  function base64toBlob(base64Data) {
    const sliceSize = 1024
    const byteCharacters = atob(base64Data)
    const bytesLength = byteCharacters.length
    const slicesCount = Math.ceil(bytesLength / sliceSize)
    const byteArrays = new Array(slicesCount)
    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize
      const end = Math.min(begin + sliceSize, bytesLength)
      const bytes = new Array(end - begin)
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0)
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes)
    }
    return new Blob(byteArrays, { type: 'application/pdf' })
  }

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })

  // discardFile = () => {
  //   axios.post(`http://localhost:8098/lc/api/notice/discard?${file.name}`)
  // }

  async function Main() {
    let filee = await toBase64(file)
    if (file.type != 'application/pdf') {
      var image = new Image()
      image.src = filee
      var w = window.open('')
      w.document.write(image.outerHTML)
    } else {
      let pdfWindow = window.open('')
      // openBase64NewTab(filee);
      // window.open("data:application/octet-stream;charset=utf-16le;base64,"+filee);
      pdfWindow.document.write(
        "<iframe width='100%' height='100%' src={" + filee + "'></iframe>",
      )
    }
  }

  return (
    <div className={style.align}>
      <label className={style.uploadButton}>
        {!file && (
          <>
            <Add
              color="secondary"
              sx={{
                width: 30,
                height: 30,
                border: '1.4px dashed #9c27b0',
                marginRight: 1.5,
              }}
            />

            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0])
                Change(e)
              }}
              hidden
            />
          </>
        )}
        {file ? (
          <span
            onClick={() => {
              Main()
            }}
            className={style.fileName}
          >
            {file.name}
          </span>
        ) : (
          <span className={style.fileName}>
            {' '}
            {<FormattedLabel id="Addfile" />}
          </span>
        )}
      </label>
      {file && (
        <IconButton
          onClick={() => {
            setFile(null) /* discardFile() */
          }}
        >
          <Delete color="error" />
        </IconButton>
      )}
    </div>
  )
}
export default UploadButton

import { Add, Delete } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import swal from 'sweetalert'
import style from './upload.module.css'
import urls from '../../../URLS/urls'

const UploadButtonOP = (props) => {
  // const methods = useForm();
  const {
    control,
    register,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useFormContext()

  const [filePath, setFilePath] = useState(null)
  // const [fileKey,setFileKey]=useState(null);

  useEffect(() => {
    console.log('props.fileKey->>>>>>>', props?.fileKey)
    console.log('props.showDel->>>>>>>', props?.showDel)
  }, [])

  useEffect(() => {
    console.log('props.filePath <->', props?.fileDtl)
    if (props?.fileDtl) {
      setFilePath(props.fileDtl)
    }
  }, [props?.fileDtl])

  const handleFile = async (e) => {
    let formData = new FormData()
    formData.append('file', e.target.files[0])
    formData.append('appName', props.appName)
    formData.append('serviceName', props.serviceName)
    axios.post(`${urls.CFCURL}/file/uploadAllTypeOfFile`, formData).then((r) => {
      let f = r.data.filePath
      setFilePath(f)
      // props.filePath(f);
      setValue(props.fileKey, f)
    })
  }

  function showFileName(fileName) {
    let fileNamee = []
    fileNamee = fileName.split('__')
    return fileNamee[1]
  }

  const discard = async (e) => {
    swal({
      title: 'Delete?',
      text: 'Are you sure you want to delete the file ? ',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${urls.CFCURL}/file/discard?filePath=${filePath}`)
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null), setValue(props.fileKey, null)
              swal('File Deleted Successfully!', { icon: 'success' })
            } else {
              swal('Something went wrong..!!!')
            }
          })
      } else {
        swal('File is Safe')
      }
    })
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
                border: '1.4px dashed #9c27b0',
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
          <a
            href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
            target="__blank"
          >
            {showFileName(filePath)}
          </a>
        ) : props?.showDel == true ? (
          <span className={style.fileName}>Upload File</span>
        ) : (
          <span className={style.fileName} />
        )}
      </label>
      {filePath && props.showDel == true && (
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

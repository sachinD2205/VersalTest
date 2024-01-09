import { Add, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import swal from "sweetalert";
import style from "./fileUploadStyle/upload.module.css";
import urls from "../../../URLS/urls";
import Camera from '../../../pages/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/Camera'
import * as htmlToImage from 'html-to-image';

const UploadButtonThumbOP = (props) => {
  // const methods = useForm();
  const {
    register,
    reset,
    watch,
    getValues,
    setValue,
    handleSubmit,
    control,
    formState: { errors: errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
  });

  const [showCamera, setShowCamera] = useState(false)
  const blobToImage = (blob) => {
    return new Promise(resolve => {
      const url = URL.createObjectURL(blob)
      let img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve(img)
      }
      img.src = url
    })
  }

  const dataURLtoFile = (dataurl, filename) => {
    console.log('dataurl', dataurl)
    if (dataurl) {
      var arr = dataurl?.split(','),
        mime = arr[0]?.match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
    }

    return new File([u8arr], filename, { type: mime });
  }
  const getFileFromUrl = (url, name, defaultType = 'image/jpeg') => {
    // const response = await fetch(url);
    // const data = await response.blob();
    // const temp = new File([data], name, {
    //   type: data.type || defaultType,
    // });
    // const temp = await blobToImage(data)
    console.log("datadata", url);

    var temp = dataURLtoFile(url, name)

    return temp;

  }

  const imageCallback = (imgsrc) => {

    console.log('imgsrc', imgsrc);
    handleFile(imgsrc)
    // setValue('gPhoto', imgsrc)

  }

  const refreshCamera = () => {
    setFilePath(null)

  }
  const closeCamera = (val) => {
    setShowCamera(false);
    // setFilePath(null)

  }

  const [filePath, setFilePath] = useState(null);
  // const [fileKey,setFileKey]=useState(null);

  useEffect(() => {
    console.log("props.fileKey->>>>>>>", props?.fileKey);
    console.log("props.showDel->>>>>>>", props?.showDel);
  }, []);

  useEffect(() => {
    console.log("props.filePath <->", props?.fileDtl);
    if (props?.fileDtl) {
      setFilePath(props.fileDtl);
    }
  }, [props?.fileDtl]);

  const handleFile1 = () => {
    setShowCamera(true);
  }

  const handleFile = (imgsrc) => {
    let formData = new FormData();
    console.log("tempimg", imgsrc)
    formData.append("file", getFileFromUrl(imgsrc, props.fileName));
    formData.append("appName", props.appName);
    formData.append("serviceName", props.serviceName);
    axios
      .post(`${urls.CFCURL}/file/upload`, formData)
      .then((r) => {
        let f = r.data.filePath;
        setFilePath(f);
        // props.filePath(f);
        setValue(props.fileKey, f);
      });

  };

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName.split("__");
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
          .delete(
            `${urls.CFCURL}/file/discard?filePath=${filePath}`
          )
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null), setValue(props.fileKey, null);
              swal("File Deleted Successfully!", { icon: "success" });
            } else {
              swal("Something went wrong..!!!");
            }
          });
      } else {
        swal("File is Safe");
      }
    });
  };

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
              onClick={() => handleFile1()}
            />

            Capture

            {/* <input
              type="file"
              onChange={(e) => {
                handleFile(e);
              }}
              hidden
            /> */}

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
          <span className={style.fileName}>Capture</span>
        ) : (
          <span className={style.fileName} />
        )}

      </label>
      {filePath && props.showDel == true && (
        <IconButton
          onClick={(e) => {
            discard(e);
          }}
        >
          <Delete color="error" />
        </IconButton>
      )}
      {showCamera ? (
        <Camera imageCallback={imageCallback} closeCamera={closeCamera} refreshCamera={refreshCamera} />
      ) : ''}
    </div>
  );
};
export default UploadButtonThumbOP;

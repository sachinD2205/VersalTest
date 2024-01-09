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
import style from "./uploadButtonHawker.module.css";
import axios from "axios";
import urls from "../../../URLS/urls";
import swal from "sweetalert";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../containers/Layout/components/Loader";
import { useForm } from "react-hook-form";

const UploadButtonHawker = (props) => {
  const [filePath, setFilePath] = useState(null);

  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });

  // destructure values from methods
  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = methods;
  // useEffect
  useEffect(() => {
    console.log("sachin", props);
  }, [props]);

  // useEffect
  useEffect(() => {
    console.log("props.filePath <->", props);
    setFilePath(props?.fileName);
    if (props?.fileName) {
    }
  }, [props?.fileName]);

  // file Upload
  const handleFile = async (e) => {
    setValue("loadderState", true);
    let formData = new FormData();
    formData.append("file", e?.target?.files[0]);
    formData.append("appName", props?.appName);
    formData.append("serviceName", props?.serviceName);

    axios
      .post(`${urls.CFCURL}/file/upload`, formData)
      .then((res) => {
        // try {
        if (res?.status == "200" || res?.status == "201") {
          setFilePath(res?.data?.filePath);
          props.filePath(res?.data?.filePath);
          setValue("loadderState", false);
          toast.success("Document Uploaded Successfully !!!", {
            autoClose: "1000",
            position: toast.POSITION.TOP_RIGHT,
          });

          // swal({
          //   title: "Document Upload",
          //   text: "Document Uploaded Successfully !!!",
          //   icon: "success",
          // });
        } else if (res?.status == "500") {
          console.log("res?.data", res?.data);
          console.log("res?.status", res?.status);
          setValue("loadderState", false);
          toast.error("Please Upload Valid Document !!!", {
            autoClose: "1000",
            position: toast.POSITION.TOP_RIGHT,
          });

          // swal({
          //   title: "Please Upload Valid Document",
          //   text: " hello else if!!!",
          //   icon: "error",
          // });
        } else if (res?.status == "400") {
          console.log("res?.data", res?.data);
          console.log("res?.status", res?.status);
          setValue("loadderState", false);
          toast.error("Please Upload Valid Document !!!", {
            autoClose: "1000",
            position: toast.POSITION.TOP_RIGHT,
          });
          // swal({
          //   title: "Please Upload Valid Document",
          //   text: " hello  400 else if!!!",
          //   icon: "error",
          // });
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        toast.error("Please Upload Valid Document !!!", {
          autoClose: "1000",
          position: toast.POSITION.TOP_RIGHT,
        });
        // swal({
        //   title: "Please Upload Valid Document",
        //   text: " file not more than 2mb and valid format document !!!",
        //   icon: "error",
        // });
        console.log("error500", error?.response);
        console.log("error504", error?.response?.data);
        console.log("error505", error?.response?.data?.message);
        console.log("error501", error);
        console.log("error502", error?.data?.response);
        console.log("error503", error?.data?.response?.data);
      });
  };

  // shwoFileName
  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName?.split("__");
    return fileNamee[1];
  }

  // delete file
  const discard = async (e) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setValue("loadderState", true);
        axios
          .delete(`${urls.CFCURL}/file/discard?filePath=${filePath}`)
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null), props.filePath(null);
              setValue("loadderState", false);
              swal("File Deleted Successfully!", { icon: "success" });
            } else {
              setValue("loadderState", false);
              swal("Something went wrong..!!!");
            }
          });
      } else {
        swal("File is Safe");
      }
    });
  };

  //view
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <>
          <div className={style.align1}>
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
                    id='uploadButtonHawkerWithoutAdd'
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
                  target='__blank'>
                  {showFileName(filePath)}
                </a>
              ) : (
                <span className={style.fileName}>Add File</span>
              )}
            </label>
            {filePath && (
              <IconButton
                onClick={(e) => {
                  discard(
                    e,
                  ); /* setFilePath(null),props.filePath(null),discardFile() */
                }}>
                <Delete color='error' />
              </IconButton>
            )}
          </div>
        </>
      )}
    </>
  );
};
export default UploadButtonHawker;

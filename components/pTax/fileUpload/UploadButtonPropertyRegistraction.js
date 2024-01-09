import { Add, Delete } from "@mui/icons-material";
import {
  Button,
  IconButton
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { catchExceptionHandlingMethod } from "../../.././util/util";
import urls from "../../../URLS/urls";
import Loader from "../../../containers/Layout/components/Loader";
import { useApplicantType, useGetToken, useLoggedInUser, useUser } from "../../../containers/reuseableComponents/CustomHooks";
import style from "../styles/PropertyRegistractionDocumentUpload.module.css";
import { DecryptData, EncryptData } from "../../../components/common/EncryptDecrypt"

const UploadButtonPropertyRegistraction = (props) => {
  const { allData: { row: { documentId, filePath, fileName } } } = props;
  const language = useSelector((state) => state?.labels?.language);
  const userToken = useGetToken()
  const user = useUser()
  const loggedInUser = useLoggedInUser()
  const applicantType = useApplicantType()
  const userID = useSelector(
    (state) => state?.user?.user?.id
  );
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };


  const handleFile = async (e) => {
    setValue("loadderState", true);

    const url = `${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`;

    console.log("file342", e?.target?.files[0])

    let formData = new FormData();
    formData.append("file", e?.target?.files[0]);
    formData.append("appName", props?.appName);
    formData.append("serviceName", props?.serviceName);


    //! extension only
    const fileExtension = e?.target?.files[0]?.name?.split(".")[e?.target?.files[0]?.name?.split(".").length - 1];
    //! without extension
    const fileNameWithoutExtension = e?.target?.files[0]?.name?.split("." + fileExtension)[0];
    //! regex --- letter/numbers/hypens/underscore
    const fileNameRegex = /^[a-zA-Z0-9_-]+$/;

    //! check file type
    if (
      e?.target?.files[0]?.type == "image/jpeg" ||
      e?.target?.files[0]?.type == "image/png" ||
      e?.target?.files[0]?.type == "application/pdf"
    ) {
      //! check fileName
      if (fileNameRegex.test(fileNameWithoutExtension)) {

        //! check file size 
        if (e.target.files[0].size < 10485760) {
          // upload api
          axios
            .post(url, formData, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
            )
            .then((res) => {
              if (res?.status == "200" || res?.status == "201") {


                console.log("redf324234", documentId, res?.data)

                let updatedFieldObject = watch("documents")?.find((data) => data?.documentId == documentId);
                let withoutUpdatedFieldObject = watch("documents")?.filter((data) => data?.documentId != documentId);
                let updatedObject = {
                  ...updatedFieldObject,
                  filePath: res?.data?.filePath,
                  fileName: res?.data?.fileName
                }


                const tempData = [...withoutUpdatedFieldObject, updatedObject];
                console.log("32432324", tempData);
                const sortedData = tempData?.sort((a, b) => a?.srNo - b?.srNo);

                setValue("documents", sortedData)
                console.log("5465464654654", sortedData)
                console.log("updatedFieldObjectwithoutUpdatedFieldObject", updatedFieldObject, updatedObject)


                const data = savePropertyRegistraction();
                console.log("data3643634634", data)

                data?.then(() => {
                  setValue("loadderState", false);
                  language == "en"
                    ? toast.success("Document Uploaded Successfully !!!", {
                      autoClose: "1000",
                      position: toast.POSITION.TOP_RIGHT,
                    })
                    : toast.success("दस्तऐवज यशस्वीरित्या अपलोड केले !!!", {
                      autoClose: "1000",
                      position: toast.POSITION.TOP_RIGHT,
                    });
                }).catch((error) => {
                  setValue("loadderState", false);
                  callCatchMethod(error, language);
                })

                console.log("3243266dffd", data)



              }
            })
            .catch((error) => {
              console.log('3454353466', error)
              setValue("loadderState", false);
              callCatchMethod(error, language);
            });
          // upload api end
        }
        //! file size error
        else {
          setValue("loadderState", false);
          swal({
            text:
              language == "en"
                ? "File size should not exceed 10 MB"
                : "फाइलचा आकार १० मेगाबाइटपेक्षा जास्त नसावा",
            icon: "error",
            buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
          });
          var inputElement = document.getElementById("file");
          inputElement.value = "";
        }
      }
      //! file Name error
      else {
        setValue("loadderState", false);
        swal({
          title:
            language == "en"
              ? "Oops!"
              : "अरे!",
          text:
            language == "en"
              ? "The file name can only contain letters, numbers, hyphens, and underscores. Special characters are not allowed"
              : "फाइलचे नाव किव्हा अक्षर, अंक, हायफन आणि अंडरस्कोरच्या प्रकारे असावे. विशेष वर्णांकीत नको",
          icon: "error",
          buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
        });
        var inputElement = document.getElementById("file");
        inputElement.value = "";
      }
    }
    //! file type error
    else {
      setValue("loadderState", false);
      swal({
        title:
          language == "en"
            ? "Please Upload Valid Type File!"
            : "कृपया वैध प्रकार फाइल अपलोड करा!",
        text:
          language == "en"
            ? "Allowed file types are JPEG, PNG, and PDF only."
            : "केवळ JPEG, PNG आणि PDF हे फाइल प्रकार अपलोड करण्यास अनुमती आहे",
        icon: "error",
        buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
      });
      var inputElement = document.getElementById("file");
      inputElement.value = "";
    }
  };


  // delete file
  const discard = async () => {


    if (filePath != null && filePath != undefined && filePath != "") {



      const ciphertext = EncryptData("passphraseaaaaaaadiscard", filePath);
      const url = `${urls.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`;

      swal({
        title: language == "en" ? "Delete?" : "हटवायचे?",
        text:
          language == "en"
            ? "are you sure you want to delete the file ? "
            : "तुम्हाला खात्री आहे की तुम्ही फाइल हटवू इच्छिता?",
        icon: "warning",
        buttons: {
          cancel: language == "en" ? "Cancel" : "रद्द करा",
          confirm: language == "en" ? "OK" : "ठीक आहे",
        },
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          setValue("loadderState", true);
          axios
            .delete(url, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
            )
            .then((res) => {

              console.log("data6756756", res?.data)
              setValue("loadderState", false);

              let updatedFieldObject = watch("documents")?.find((data) => data?.documentId == documentId);
              let withoutUpdatedFieldObject = watch("documents")?.filter((data) => data?.documentId != documentId);
              let updatedObject = {
                ...updatedFieldObject,
                filePath: res?.data?.filePath,
                fileName: res?.data?.fileName
              }

              const tempData = [...withoutUpdatedFieldObject, updatedObject];
              const sortedData = tempData?.sort((a, b) => a?.srNo - b?.srNo);

              setValue("documents", sortedData)
              console.log("5465464654654", sortedData)
              console.log("updatedFieldObjectwithoutUpdatedFieldObject", updatedFieldObject, updatedObject)



              const data = savePropertyRegistraction();
              data?.then(() => {
                setValue("loadderState", false);
                language == "en"
                  ? swal("File Deleted Successfully!", {
                    icon: "success",
                    buttons: { ok: "OK" },
                  })
                  : swal("फाइल यशस्वीरित्या हटवली!", {
                    icon: "success",
                    buttons: { ok: "ठीक आहे" },
                  });
              }).catch((language) => {
                setValue("loadderState", false);
                callCatchMethod(error, language);
              })


            })
            .catch((error) => {
              setValue("loadderState", false);
              callCatchMethod(error, language);
              console.log("zoneNameApiCallError", error);
            });
        } else {
          language == "en"
            ? swal("File is safe", { icon: "info", buttons: { ok: "OK" } })
            : swal("फाइल सुरक्षित आहे", {
              icon: "info",
              buttons: { ok: "ठीक आहे" },
            });
        }
      });

    }

  };

  // filePreview -- pass filepath as props
  const getFilePreview = (filePath) => {
    console.log("filePath123", filePath);


    if (filePath != null && filePath != undefined && filePath != "") {

      // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
      const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
      const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`


      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
          <html>
            <body style="margin: 0;">
              <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
            </body>
          </html>
        `);
        })
        .catch((error) => {
          console.log("CatchPreviewApi", error)
          callCatchMethod(error, language);
        });
    }

  }


  const savePropertyRegistraction = async () => {

    const url = `${urls.PTAXURL}/transaction/property/saveV1`;


    const finalBodyApi = {
      ...watch(),
      status: watch("status") != null && watch("status") != undefined && watch("status") != "" ? watch("status") : "DRAFT",
      activeFlag: "Y",
      serviceId: 140,
      createdUserId: userID,
      applicantType: applicantType,
      id: watch("id") != null && watch("id") != undefined && watch("id") != null ? watch("id") : null,
    };



    await axios
      .post(url, finalBodyApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res) {
          console.log("response", res?.data?.message.split("@")[1]);
          const id = null;
          setValue("propertyRegistractionId", res?.data?.message.split("@")[1]);
        }
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));

  }

  // ! ==================> useEffects ===============>
  // useEffect
  useEffect(() => {
    console.log("sachin 💛", documentId, fileName, filePath);
  }, [documentId]);


  //view
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <div className={style.align}>
          <label className={style.uploadButton}>
            {!filePath ? (
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
                  id="file"
                  onChange={(e) => {
                    handleFile(e);
                  }}
                  hidden
                />
              </>
            ) : <></>}
            {filePath ? (
              <>
                {!watch("disabledFieldInputState") ?
                  <span
                    style={{ color: "blue" }}
                    onClick={() =>
                      getFilePreview(filePath)
                    }
                  >
                    {fileName}
                  </span>
                  :
                  <span
                    style={{ color: "blue" }}
                    onClick={() =>
                      getFilePreview(filePath)
                    }
                  >
                    {fileName}
                  </span>}

              </>

            ) : (
              <span className={style.fileName}>Add File</span>
            )}
          </label>
          {filePath && (
            <>
              {!watch("disabledFieldInputState") ?
                <IconButton
                  onClick={(e) => {
                    discard(
                      e
                    );
                  }}
                >
                  <Delete color="error" />
                </IconButton>
                : <>
                </>
              }
            </>
          )}
        </div>
      )}
    </>
  );
};
export default UploadButtonPropertyRegistraction;

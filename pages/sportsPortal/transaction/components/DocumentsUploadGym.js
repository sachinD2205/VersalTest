import { FormHelperText, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import UploadButton from "../../../../components/fileUpload/UploadButton";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

// Documents Upload
const Document = () => {
  // UseForm Context
  const {
    control,
    register,
    reset,
    watch,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  // { resolver: yupResolver(schema) }

  const [aadharCard, setaadharCard] = useState(null);
  const [medicalCertificate, setmedicalCertificate] = useState(null);
  const [idCard, setIdcard] = useState(null);
  const [companyCard, setCompanyCard] = useState(null);
  const [panCard, setpanCard] = useState(null);
  const [otherDocumentPhoto, setotherDocumentPhoto] = useState(null);
  const [type, setType] = useState();

  // @ First UseEffect
  useEffect(() => {
    console.log("medicalCertificate34324", watch("medicalCertificate"));
    if (watch("aadharCard") != null) {
      setaadharCard(watch("aadharCard"));
    }
    if (watch("medicalCertificate") != null) {
      setmedicalCertificate(watch("medicalCertificate"));
    }
    if (watch("companyCard") != null) {
      setCompanyCard(watch("companyCard"));
    }
    if (watch("panCard") != null) {
      setpanCard(watch("panCard"));
    }
    if (watch("otherDocumentPhoto") != null) {
      setotherDocumentPhoto(watch("otherDocumentPhoto"));
    }
    if (watch("idCard") != null) {
      setIdcard(watch("idCard"));
    }
  }, []);

  // @ Second UseEffect
  useEffect(() => {
    console.log("ky yet ahe watch mde", watch("applicantType"));
    setType(watch("applicantType"));
    // setValue("aadharCard", aadharCard);
    // clearErrors("aadharCard");
    setValue("idCard", idCard);
    clearErrors("idCard");
    setValue("companyCard", companyCard);
    clearErrors("companyCard");
    setValue("panCard", panCard);
    clearErrors("companyCard");
    setValue("otherDocumentPhoto", otherDocumentPhoto);
    clearErrors("otherDocumentPhoto");
    setValue("medicalCertificate", medicalCertificate);
    clearErrors("medicalCertificate");
  }, [panCard, otherDocumentPhoto, companyCard, idCard, medicalCertificate]);

  useEffect(() => {
    setValue("aadharCard", aadharCard);
    clearErrors("aadharCard");
  }, [aadharCard]);
  useEffect(() => {
    console.log("675", getValues("medical"));
  }, []);
  // useEffect(() => {
  //   setValue("medicalCertificate", medicalCertificate);
  //   clearErrors("medicalCertificate");
  // }, [medicalCertificate]);

  // view
  return (
    <>
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
          display: "flex",
          justifyContent: "center",
        }}
      >
        Documents Upload
      </div>
      <Grid
        container
        sx={{
          marginTop: 5,
          marginBottom: 5,
          paddingLeft: "50px",
          align: "center",
        }}
      >
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            <strong>{<FormattedLabel id="photo" required />}</strong>
          </Typography>
          <UploadButton
            error={!!errors?.photo}
            appName="SP"
            serviceName="SP-SPORTSBOOKING"
            filePath={setotherDocumentPhoto}
            fileName={otherDocumentPhoto}
          />
          <FormHelperText error={!!errors?.photo}>
            {errors?.photo ? errors?.photo?.message : null}
          </FormHelperText>
        </Grid> */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            <strong>{<FormattedLabel id="photo" required />}</strong>
          </Typography>
          <UploadButton
            error={!!errors?.idCard}
            appName="SP"
            serviceName="SP-SPORTSBOOKING"
            filePath={setIdcard}
            fileName={idCard}
          />
          <FormHelperText error={!!errors?.idCard}>
            {errors?.idCard ? errors?.idCard?.message : null}
          </FormHelperText>
        </Grid>
        {/* Aadhar Card */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            <strong>{<FormattedLabel id="aadharCard" required />}</strong>
          </Typography>
          <div>
            <UploadButton
              error={!!errors?.aadharCard}
              appName="SP"
              serviceName="SP-SPORTSBOOKING"
              filePath={setaadharCard}
              fileName={aadharCard}
              // fileData={aadhaarCardPhotoData}
            />
            <FormHelperText error={!!errors?.aadharCard}>
              {errors?.aadharCard ? errors?.aadharCard?.message : null}
            </FormHelperText>
          </div>
        </Grid>

        {/* Medical Document*/}

        {/* {watch("medical") === "valid" && ( */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            <strong>
              {<FormattedLabel id="medicalCertificate" required />}
            </strong>
          </Typography>
          <div>
            <UploadButton
              error={!!errors?.medicalCertificate}
              appName="SP"
              serviceName="SP-SPORTSBOOKING"
              filePath={setmedicalCertificate}
              fileName={medicalCertificate}
              // fileData={aadhaarCardPhotoData}
            />
            <FormHelperText error={!!errors?.medicalCertificate}>
              {errors?.medicalCertificate
                ? errors?.medicalCertificate?.message
                : null}
            </FormHelperText>
          </div>
        </Grid>
        {/* )} */}

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            <strong>{<FormattedLabel id="panCard" />}</strong>
            {/* Pan Card */}
          </Typography>
          <UploadButton
            error={!!errors?.panCard}
            appName="SP"
            serviceName="SP-SPORTSBOOKING"
            filePath={setpanCard}
            fileName={panCard}
          />
          <FormHelperText error={!!errors?.panCard}>
            {errors?.panCard ? errors?.panCard?.message : null}
          </FormHelperText>
        </Grid>

        {/* //////////////////////////////////////////////////////////////////////////////////////////////// */}

        {/* Company ID Card */}

        {type === 6 && (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Typography variant="subtitle2">
              <strong>{<FormattedLabel id="companyCard" required />}</strong>
            </Typography>
            <div>
              <UploadButton
                error={!!errors?.companyCard}
                appName="SP"
                serviceName="SP-SPORTSBOOKING"
                filePath={setCompanyCard}
                fileName={companyCard}
                // fileData={aadhaarCardPhotoData}
              />
              <FormHelperText error={!!errors?.companyCard}>
                {errors?.companyCard ? errors?.companyCard?.message : null}
              </FormHelperText>
            </div>
          </Grid>
        )}

        {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      </Grid>
    </>
  );
};
export default Document;

// import { Grid, Typography } from '@mui/material'
// import React, { useState } from 'react'
// import { useFieldArray, useFormContext } from 'react-hook-form'
// import UploadButton from '../../../../containers/SP_ReusableComponent/FileUpload/UploadButton'
// // import { convertBase } from "../../FileUpload/convertToBase.js";
// import axios from 'axios'
// import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
// import URLS from '../../../../URLS/urls'

// const DocumentsUpload = () => {
//   const [fileName, setFileName] = useState(null)
//   const {
//     control,
//     register,
//     reset,
//     getValues,
//     setValue,
//     formState: { errors },
//   } = useFormContext()

//   let appName = 'SP'
//   let serviceName = 'SP-SPORTSBOOKING'

//   // getBase64 ===
//   function getBase64(file) {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader()
//       reader.readAsDataURL(file)
//       reader.onload = () => resolve(reader.result)
//       reader.onerror = (error) => reject(error)
//     })
//   }

//   const { fields } = useFieldArray({
//     control, // control props comes from useForm (optional: if you are using FormContext)
//     name: 'documents', // unique name for your Field Array
//   })

//   const handleFile1 = async (e, labelName) => {
//     let formData = new FormData()
//     formData.append('file', e.target.files[0])
//     axios
//       .post(
//         `${URLS.CFCURL}/file/upload?appName=${appName}&serviceName=${serviceName}`,
//         formData,
//       )
//       .then((r) => {
//         if (r.status === 200) {
//           if (labelName === 'panCardPhoto') {
//             setValue('panCardPhoto', r.data.filePath)
//           } else if (labelName == 'affadavitPhoto') {
//             setValue('affadavitPhoto', r.data.filePath)
//           } else if (labelName == 'otherDocumentPhoto') {
//             setValue('otherDocumentPhoto', r.data.filePath)
//           }
//         } else {
//           sweetAlert('Error')
//         }
//       })
//   }

//   return (
//     <>
//       <div
//         style={{
//           backgroundColor: '#0084ff',
//           color: 'white',
//           fontSize: 19,
//           marginTop: 30,
//           marginBottom: 30,
//           padding: 8,
//           paddingLeft: 30,
//           marginLeft: '40px',
//           marginRight: '65px',
//           borderRadius: 100,
//         }}
//       >
//         <strong>
//           <FormattedLabel id="documentUpload" />
//         </strong>
//       </div>
//       <Grid
//         container
//         sx={{
//           marginLeft: 5,
//           marginTop: 5,
//           marginBottom: 5,
//           align: 'center',
//         }}
//       >
//         <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//           <Typography>
//             <strong>{<FormattedLabel id="aadharCard" />}</strong>
//           </Typography>
//           <UploadButton
//             Change={(e) => {
//               handleFile1(e, 'aadharCardPhoto')
//               //setValue("aadharCardPhoto", e.target.files[0]);
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//           <Typography>
//             <strong>{<FormattedLabel id="panCard" />}</strong>
//           </Typography>
//           <UploadButton
//             Change={(e) => {
//               handleFile1(e, 'panCardPhoto')
//               // setValue("panCardPhoto", e.target.files[0]);
//             }}
//           />
//         </Grid>

//         <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 0 }}>
//           <Typography>
//             <strong>{<FormattedLabel id="otherDocumentPhoto" />}</strong>
//           </Typography>
//           <UploadButton
//             Change={(e) => {
//               handleFile1(e, 'otherDocumentPhoto')
//               //setValue("otherDocumentPhoto", e.target.files[0]);
//             }}
//           />
//         </Grid>
//       </Grid>
//     </>
//   )
// }

// export default DocumentsUpload

// import { FormHelperText, Grid, Typography } from "@mui/material";
// import React, { useState } from "react";
// import { useFieldArray, useFormContext } from "react-hook-form";
// import UploadButton from "../../../../containers/SP_ReusableComponent/FileUpload/UploadButton";
// // import { convertBase } from "../../FileUpload/convertToBase.js";
// import axios from "axios";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import URLS from "../../../../URLS/urls";

// const DocumentsUpload = () => {
//   const [fileName, setFileName] = useState(null);
//   const {
//     control,
//     register,
//     reset,
//     getValues,
//     setValue,
//     clearErrors,
//     formState: { errors },
//   } = useFormContext();

//   let appName = "SP";
//   let serviceName = "SP-SPORTSBOOKING";

//   // getBase64 ===
//   function getBase64(file) {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   }

//   const { fields } = useFieldArray({
//     control, // control props comes from useForm (optional: if you are using FormContext)
//     name: "documents", // unique name for your Field Array
//   });

//   const handleFile1 = async (e, labelName) => {
//     let formData = new FormData();
//     formData.append("file", e.target.files[0]);
//     axios
//       .post(
//         `${URLS.CFCURL}/file/upload?appName=${appName}&serviceName=${serviceName}`,
//         formData
//       )
//       .then((r) => {
//         if (r.status === 200) {
//           if (labelName === "panCard") {
//             setValue("panCard", r.data.filePath);
//             clearErrors("panCard");
//           } else if (labelName == "aadharCard") {
//             setValue("aadharCard", r.data.filePath);
//             clearErrors("aadharCard");
//           } else if (labelName == "otherDocumentPhoto") {
//             setValue("otherDocumentPhoto", r.data.filePath);
//             clearErrors("otherDocumentPhoto");
//           } else if (labelName == "passportPhoto") {
//             setValue("passportPhoto", r.data.filePath);
//             clearErrors("passportPhoto");
//           }
//         } else {
//           sweetAlert("Error");
//         }
//       });
//   };

//   return (
//     <>
//       <div
//         style={{
//           backgroundColor: "#0084ff",
//           color: "white",
//           fontSize: 19,
//           marginTop: 30,
//           marginBottom: 30,
//           padding: 8,
//           paddingLeft: 30,
//           marginLeft: "40px",
//           marginRight: "65px",
//           borderRadius: 100,
//         }}
//       >
//         <strong>
//           <FormattedLabel id="documentUpload" />
//         </strong>
//       </div>
//       <Grid
//         container
//         sx={{
//           marginLeft: 5,
//           marginTop: 5,
//           marginBottom: 5,
//           align: "center",
//         }}
//       >
//         <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 0 }}>
//           <Typography error={!!errors?.passportPhoto}>
//             <strong>{<FormattedLabel id="photo" required />}</strong>{" "}
//           </Typography>

//           <UploadButton
//             error={!!errors?.passportPhoto}
//             Change={(e) => {
//               handleFile1(e, "passportPhoto");
//             }}
//           />
//           <FormHelperText error={!!errors?.passportPhoto}>
//             {errors?.passportPhoto ? errors?.passportPhoto?.message : null}
//           </FormHelperText>
//         </Grid>
//         <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//           <Typography error={!!errors?.aadharCard}>
//             <strong>{<FormattedLabel id="aadharCard" required />}</strong>{" "}
//           </Typography>

//           <UploadButton
//             error={!!errors?.aadharCard}
//             Change={(e) => {
//               handleFile1(e, "aadharCard");
//             }}
//           />
//           <FormHelperText error={!!errors?.aadharCard}>
//             {errors?.aadharCard ? errors?.aadharCard?.message : null}
//           </FormHelperText>
//         </Grid>
//         <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//           <Typography>
//             <strong>{<FormattedLabel id="panCard" />}</strong>
//           </Typography>
//           <UploadButton
//             Change={(e) => {
//               handleFile1(e, "panCard");
//               // setValue("panCardPhoto", e.target.files[0]);
//             }}
//           />
//         </Grid>
//       </Grid>
//     </>
//   );
// };

// export default DocumentsUpload;

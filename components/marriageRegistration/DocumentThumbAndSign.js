import { FormControl, FormHelperText, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import schema from "../../components/marriageRegistration/schema/photothumb";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import Fingerprint from "../common/fingerPrint";
import UploadButtonThumbOP from "./DocumentsUploadThumbOP";
import styles from "./documentUpload.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { Image } from "antd";
import axios from "axios";
import urls from "../../URLS/urls";
import { useGetToken } from "../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../util/util";
import { DecryptData, EncryptData } from "../common/EncryptDecrypt";

const Index = (props) => {
  const router = useRouter();
  let appName = "MR";
  let serviceName = "M-NMR";
  let pageMode = router?.query?.pageMode;
  const [gbase64String, setGBase64String] = React.useState("");
  const [gfingerPrintImg, setGFingerPrintImg] = React.useState("");
  const [bbase64String, setBBase64String] = React.useState("");
  const [bfingerPrintImg, setBFingerPrintImg] = React.useState("");
  const [w1base64String, setW1Base64String] = React.useState("");
  const [w1fingerPrintImg, setW1FingerPrintImg] = React.useState("");
  const [w2base64String, setW2Base64String] = React.useState("");
  const [w2fingerPrintImg, setW2FingerPrintImg] = React.useState("");
  const [w3base64String, setW3Base64String] = React.useState("");
  const [w3fingerPrintImg, setW3FingerPrintImg] = React.useState("");

  useEffect(() => {
    console.log("router?.query?.pageMode", router?.query?.pageMode);
  }, []);

  useEffect(() => {
    console.log("3432423", gfingerPrintImg);
    setValue("gthumb", gfingerPrintImg);
  }, [gfingerPrintImg]);

  useEffect(() => {
    setValue("bthumb", bfingerPrintImg);
  }, [bfingerPrintImg]);

  useEffect(() => {
    setValue("wfThumb", w1fingerPrintImg);
  }, [w1fingerPrintImg]);

  useEffect(() => {
    setValue("wsThumb", w2fingerPrintImg);
  }, [w2fingerPrintImg]);

  useEffect(() => {
    setValue("wtThumb", w3fingerPrintImg);
  }, [w3fingerPrintImg]);

  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useFormContext({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      gphoto: null,
    },
  });
  const userToken = useGetToken();
  const [gPhoto, setGPhoto] = useState();
  const [gThumb, setGThumb] = useState();

  const [bPhoto, setBPhoto] = useState();
  const [bThumb, setBThumb] = useState();

  const [wfPhoto, setWFPhoto] = useState();
  const [wfThumb, setWFThumb] = useState();

  const [wsPhoto, setWSPhoto] = useState();
  const [wsThumb, setWSThumb] = useState();

  const [wtPhoto, setWTPhoto] = useState();
  const [wtThumb, setWTThumb] = useState();

  const [data, setData] = useState();
  const language = useSelector((state) => state?.labels.language);
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

  // document Encryption
  const [encryptedGphoto, setEncryptedGphoto] = useState();
  const [encryptedBphoto, setEncryptedBphoto] = useState();
  const [encryptedWfPhoto, setEncryptedWfPhoto] = useState();
  const [encryptedWsPhoto, setEncryptedWsPhoto] = useState();
  const [encryptedWtPhoto, setEncryptedWtPhoto] = useState();
  //document encryption thumb
  const [encryptedGthumb, setEncryptedGthumb] = useState();
  const [encryptedBthumb, setEncryptedBthumb] = useState();
  //docdument
  const user = useSelector((state) => state?.user);
  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "documents", // unique name for your Field Array
  });

  // onSubmit
  const onSubmit = (event) => {
    event.preventDefault();
  };

  // getById

  const getapplicantById = () => {
    axios
      .get(
        `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${router?.query?.applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      )
      .then((res) => {
        console.log("res324324", res?.data);
        if (res?.data?.gphoto) {
          getGPhoto(res?.data?.gphoto);
        }
        if (res?.data?.gthumb) {
          getGThumb(res?.data?.gthumb);
        }
        if (res?.data?.bphoto) {
          getBPhoto(res?.data?.bphoto);
        }
        if (res?.data?.bthumb) {
          getBThumb(res?.data?.bthumb);
        }
        if (res?.data?.wfPhoto) {
          getWFPhoto(res?.data?.wfPhoto);
        }
        if (res?.data?.wfThumb) {
          getWFThumb(res?.data?.wfThumb);
        }
        //2
        if (res?.data?.wsPhoto) {
          getWSPhoto(res?.data?.wsPhoto);
        }
        if (res?.data?.wsThumb) {
          getWSThumb(res?.data?.wsThumb);
        }
        //3
        if (res?.data?.wtPhoto) {
          getWTPhoto(res?.data?.wtPhoto);
        }
        if (res?.data?.wtThumb) {
          getWTThumb(res?.data?.wtThumb);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //!----------------------------------------------------------------------------------------

  // gphoto
  const getGPhoto = (filePath) => {
    console.log("filePath123", filePath);

    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
    const plaintext = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", plaintext);

    console.log(filePath, plaintext, ciphertext, "kljk000");

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ImageApi21312", r?.data);
        setGPhoto(r?.data?.fileName);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        callCatchMethod(error, language);
      });
  };

  // gThmbh
  const getGThumb = (filePath) => {
    console.log("filePath123", filePath);

    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
    const plaintext = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", plaintext);

    console.log(filePath, plaintext, ciphertext, "kljk000");

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ImageApi21312", r?.data);
        setGThumb(r?.data?.fileName);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        callCatchMethod(error, language);
      });
  };

  //gphoto
  const getBPhoto = (filePath) => {
    console.log("filePath123", filePath);

    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
    const plaintext = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", plaintext);

    console.log(filePath, plaintext, ciphertext, "kljk000");

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ImageApi21312", r?.data);
        setBPhoto(r?.data?.fileName);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        callCatchMethod(error, language);
      });
  };

  // bthumb
  const getBThumb = (filePath) => {
    console.log("filePath123", filePath);

    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
    const plaintext = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", plaintext);

    console.log(filePath, plaintext, ciphertext, "kljk000");

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ImageApi21312", r?.data);
        setBThumb(r?.data?.fileName);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        callCatchMethod(error, language);
      });
  };

  //witness
  // witness1
  const getWFPhoto = (filePath) => {
    console.log("filePath123", filePath);

    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
    const plaintext = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", plaintext);

    console.log(filePath, plaintext, ciphertext, "kljk000");

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ImageApi21312", r?.data);
        setWFPhoto(r?.data?.fileName);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        callCatchMethod(error, language);
      });
  };

  // gThmbh
  const getWFThumb = (filePath) => {
    console.log("filePath123", filePath);

    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
    const plaintext = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", plaintext);

    console.log(filePath, plaintext, ciphertext, "kljk000");

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ImageApi21312", r?.data);
        setWFThumb(r?.data?.fileName);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        callCatchMethod(error, language);
      });
  };

  //witness 2

  const getWSPhoto = (filePath) => {
    console.log("filePath123", filePath);

    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
    const plaintext = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", plaintext);

    console.log(filePath, plaintext, ciphertext, "kljk000");

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ImageApi21312", r?.data);
        setWSPhoto(r?.data?.fileName);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        callCatchMethod(error, language);
      });
  };

  // gThmbh
  const getWSThumb = (filePath) => {
    console.log("filePath123", filePath);

    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
    const plaintext = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", plaintext);

    console.log(filePath, plaintext, ciphertext, "kljk000");

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ImageApi21312", r?.data);
        setWSThumb(r?.data?.fileName);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        callCatchMethod(error, language);
      });
  };

  //witness 3
  // witness1
  const getWTPhoto = (filePath) => {
    console.log("filePath123", filePath);

    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
    const plaintext = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", plaintext);

    console.log(filePath, plaintext, ciphertext, "kljk000");

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ImageApi21312", r?.data);
        setWTPhoto(r?.data?.fileName);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        callCatchMethod(error, language);
      });
  };

  // gThmbh
  const getWTThumb = (filePath) => {
    console.log("filePath123", filePath);

    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
    const plaintext = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", plaintext);

    console.log(filePath, plaintext, ciphertext, "kljk000");

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ImageApi21312", r?.data);
        setWTThumb(r?.data?.fileName);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        callCatchMethod(error, language);
      });
  };

  //!----------------------------
  useEffect(() => {
    console.log("gphoto12121", errors);
  }, [errors]);

  useEffect(() => {
    getapplicantById();
  }, [router?.query]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className={styles.small}>
          <h4
            style={{
              marginLeft: "40px",
              color: "red",
              fontStyle: "italic",
              marginTop: "25px",
            }}
          >
            {/* {<FormattedLabel id="onlyMHR" />} */}
          </h4>
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {" "}
                {/* {<FormattedLabel id="documentsUpload" />} */}
                {/* Document Upload on clerk screen */}
                {<FormattedLabel id="documentsUpload" />}
              </h3>

              <h5
                style={{
                  color: "white",
                  marginTop: "10px",
                  marginLeft: "5px",
                }}
              >
                {<FormattedLabel id="docFormat" />}
              </h5>
            </div>
          </div>
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "6px",
                }}
              >
                {<FormattedLabel id="groomDetail" />}
              </h3>
            </div>
          </div>
          <div className={styles.row2} style={{ marginLeft: "160px" }}>
            <div className={styles.srow2}>
              {router?.query?.role === "DOCUMENT_VERIFICATION" && (
                <FormControl
                  variant="standard"
                  // sx={{ marginTop: }}
                  error={!!errors.gphoto}
                >
                  <Typography>
                    <FormattedLabel id="GPhoto" />
                  </Typography>
                  {/* <UploadButton
                  appName={appName}
                  serviceName={serviceName}
                  fileDtl={getValues("gphoto")}
                  fileKey={"gphoto"}
                  showDel={
                    pageMode != "APPLICATION VERIFICATION" ? false : true
                  }
                />
                <FormHelperText error={!!errors?.gphoto}>
                  {errors?.gphoto ? errors?.gphoto?.message : null}
                </FormHelperText>
                <span style={{ marginLeft: "8vh" }}>
                  <b>OR</b>
                </span> */}

                  <UploadButtonThumbOP
                    error={!!errors?.gphoto}
                    appName={appName}
                    fileName={"gphoto.png"}
                    serviceName={serviceName}
                    // fileDtl={encryptedGphoto}
                    fileDtl={getValues("gphoto")}
                    fileKey={"gphoto"}
                    fileNameEncrypted={(path) => {
                      setEncryptedGphoto(path);
                    }}
                    showDel={
                      pageMode != "APPLICATION VERIFICATION" ? false : true
                    }
                  />
                  <FormHelperText error={!!errors?.gphoto}>
                    {errors?.gphoto ? errors?.gphoto?.message : null}
                  </FormHelperText>
                </FormControl>
              )}
              {router?.query?.role === "FINAL_APPROVAL" && (
                <>
                  <Typography>
                    <FormattedLabel id="GPhoto" />
                  </Typography>

                  <Image
                    src={`data:image/png;base64,${gPhoto}`}
                    // src={`this?.props?.data?.gphoto`}
                    // src={`${urls.CFCURL}/file/preview?filePath=${watch(
                    //   "gphoto",
                    // )}`}
                    alt="Groom Photo"
                    height={90}
                    width={80}
                  />
                </>
              )}
            </div>
            <div className={styles.srow2}>
              <Typography>
                {" "}
                <FormattedLabel id="Gthumb" />{" "}
              </Typography>
              {/* <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("gthumb")}
                fileKey={"gthumb"}
                showDel={pageMode != "APPLICATION VERIFICATION" ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span> */}
              {router?.query?.role === "DOCUMENT_VERIFICATION" && (
                <Fingerprint
                  base64String={gbase64String}
                  setFingerPrintImg={setGFingerPrintImg}
                  setBase64String={setGBase64String}
                  appName={appName}
                  serviceName={serviceName}
                  fileNameEncrypted={(path) => {
                    setEncryptedGthumb(path);
                  }}
                />
              )}
              {router?.query?.role === "FINAL_APPROVAL" && (
                <>
                  <Image
                    src={`data:image/png;base64,${gThumb}`}
                    alt="Groom Thumb"
                    height={90}
                    width={80}
                  />
                </>
              )}
            </div>
          </div>
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {<FormattedLabel id="brideDetails" />}
              </h3>
            </div>
          </div>
          <div className={styles.row2} style={{ marginLeft: "160px" }}>
            <div className={styles.srow2}>
              <Typography>
                {" "}
                <FormattedLabel id="Bphoto" />{" "}
              </Typography>
              {/* <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("bphoto")}
                fileKey={"bphoto"}
                showDel={pageMode != "APPLICATION VERIFICATION" ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span> */}
              {router?.query?.role === "DOCUMENT_VERIFICATION" && (
                <FormControl
                  variant="standard"
                  // sx={{ marginTop: }}
                  error={!!errors.bphoto}
                >
                  <UploadButtonThumbOP
                    error={!!errors?.bphoto}
                    appName={appName}
                    fileName={"bphoto.png"}
                    serviceName={serviceName}
                    fileDtl={getValues("bphoto")}
                    fileKey={"bphoto"}
                    fileNameEncrypted={(path) => {
                      setEncryptedBphoto(path);
                    }}
                    showDel={
                      pageMode != "APPLICATION VERIFICATION" ? false : true
                    }
                  />
                  <FormHelperText error={!!errors?.bphoto}>
                    {errors?.bphoto ? errors?.bphoto?.message : null}
                  </FormHelperText>
                </FormControl>
              )}
              {router?.query?.role === "FINAL_APPROVAL" && (
                <>
                  <Image
                    src={`data:image/png;base64,${bPhoto}`}
                    alt="Groom Photo"
                    height={90}
                    width={80}
                  />
                </>
              )}
            </div>
            <div className={styles.srow2}>
              <Typography>
                {" "}
                <FormattedLabel id="Bthumb" />{" "}
              </Typography>
              {/* <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("bthumb")}
                fileKey={"bthumb"}
                showDel={pageMode != "APPLICATION VERIFICATION" ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span> */}
              {router?.query?.role === "DOCUMENT_VERIFICATION" && (
                <Fingerprint
                  base64String={bbase64String}
                  setFingerPrintImg={setBFingerPrintImg}
                  setBase64String={setBBase64String}
                  appName={appName}
                  serviceName={serviceName}
                  fileNameEncrypted={(path) => {
                    setEncryptedBthumb(path);
                  }}
                />
              )}
              {router?.query?.role === "FINAL_APPROVAL" && (
                <>
                  <Image
                    src={`data:image/png;base64,${bThumb}`}
                    alt="Bride Thumb"
                    height={90}
                    width={80}
                  />
                </>
              )}
            </div>
          </div>{" "}
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {<FormattedLabel id="witnessDetails" />}
              </h3>
            </div>
          </div>
          <div className={styles.row2} style={{ marginLeft: "160px" }}>
            <div className={styles.srow2}>
              <Typography>
                <FormattedLabel id="witnessphto1" />
              </Typography>
              {/* <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wfPhoto")}
                fileKey={"wfPhoto"}
                showDel={pageMode != "APPLICATION VERIFICATION" ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span> */}
              {router?.query?.role === "DOCUMENT_VERIFICATION" && (
                <UploadButtonThumbOP
                  appName={appName}
                  fileName={"wfPhoto.png"}
                  serviceName={serviceName}
                  fileDtl={getValues("wfPhoto")}
                  fileKey={"wfPhoto"}
                  fileNameEncrypted={(path) => {
                    setEncryptedWfPhoto(path);
                  }}
                  showDel={
                    pageMode != "APPLICATION VERIFICATION" ? false : true
                  }
                />
              )}
              {router?.query?.role === "FINAL_APPROVAL" && (
                <>
                  <Image
                    // src={`this?.props?.data?.gphoto`}
                    src={`data:image/png;base64,${wfPhoto}`}
                    alt="Groom Photo"
                    height={90}
                    width={80}
                  />
                </>
              )}
            </div>
            <div className={styles.srow2}>
              <Typography>
                {" "}
                <FormattedLabel id="witnessthumb1" />
              </Typography>
              {/* <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wfThumb")}
                fileKey={"wfThumb"}
                showDel={pageMode != "APPLICATION VERIFICATION" ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span> */}
              {router?.query?.role === "DOCUMENT_VERIFICATION" && (
                <Fingerprint
                  base64String={w1base64String}
                  setFingerPrintImg={setW1FingerPrintImg}
                  setBase64String={setW1Base64String}
                  appName={appName}
                  serviceName={serviceName}
                />
              )}
              {router?.query?.role === "FINAL_APPROVAL" && (
                <>
                  <Image
                    // src={`this?.props?.data?.gphoto`}
                    src={`data:image/png;base64,${wfThumb}`}
                    alt="Witness 1 Thumb"
                    height={90}
                    width={80}
                  />
                </>
              )}
            </div>
          </div>
          <div className={styles.row2} style={{ marginLeft: "160px" }}>
            <div className={styles.srow2}>
              <Typography>
                {" "}
                <FormattedLabel id="witnessphto2" />
              </Typography>
              {/* <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wsPhoto")}
                fileKey={"wsPhoto"}
                showDel={pageMode != "APPLICATION VERIFICATION" ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span> */}
              {router?.query?.role === "DOCUMENT_VERIFICATION" && (
                <UploadButtonThumbOP
                  appName={appName}
                  fileName={"wsPhoto.png"}
                  serviceName={serviceName}
                  fileDtl={getValues("wsPhoto")}
                  fileKey={"wsPhoto"}
                  fileNameEncrypted={(path) => {
                    setEncryptedWsPhoto(path);
                  }}
                  showDel={
                    pageMode != "APPLICATION VERIFICATION" ? false : true
                  }
                />
              )}
              {router?.query?.role === "FINAL_APPROVAL" && (
                <>
                  <Image
                    // src={`this?.props?.data?.gphoto`}
                    src={`data:image/png;base64,${wsPhoto}`}
                    alt="Groom Photo"
                    height={90}
                    width={80}
                  />
                </>
              )}
            </div>
            <div className={styles.srow2}>
              <Typography>
                {" "}
                <FormattedLabel id="witnessthumb2" />{" "}
              </Typography>
              {/* <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wsThumb")}
                fileKey={"wsThumb"}
                showDel={pageMode != "APPLICATION VERIFICATION" ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span> */}
              {router?.query?.role === "DOCUMENT_VERIFICATION" && (
                <Fingerprint
                  base64String={w2base64String}
                  setFingerPrintImg={setW2FingerPrintImg}
                  setBase64String={setW2Base64String}
                  appName={appName}
                  serviceName={serviceName}
                />
              )}
              {router?.query?.role === "FINAL_APPROVAL" && (
                <>
                  <Image
                    // src={`this?.props?.data?.gphoto`}
                    src={`data:image/png;base64,${wsThumb}`}
                    alt="Witness 2 Thumb"
                    height={90}
                    width={80}
                  />
                </>
              )}
            </div>
          </div>
          <div className={styles.row2} style={{ marginLeft: "160px" }}>
            <div className={styles.srow2}>
              <Typography>
                {" "}
                <FormattedLabel id="witnessphto3" />
              </Typography>
              {/* <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wtPhoto")}
                fileKey={"wtPhoto"}
                showDel={pageMode != "APPLICATION VERIFICATION" ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span> */}
              {router?.query?.role === "DOCUMENT_VERIFICATION" && (
                <UploadButtonThumbOP
                  appName={appName}
                  fileName={"wtPhoto.png"}
                  serviceName={serviceName}
                  fileDtl={getValues("wtPhoto")}
                  fileKey={"wtPhoto"}
                  fileNameEncrypted={(path) => {
                    setEncryptedWtPhoto(path);
                  }}
                  showDel={
                    pageMode != "APPLICATION VERIFICATION" ? false : true
                  }
                />
              )}{" "}
              {router?.query?.role === "FINAL_APPROVAL" && (
                <>
                  <Image
                    // src={`this?.props?.data?.gphoto`}
                    src={`data:image/png;base64,${wtPhoto}`}
                    alt="Groom Photo"
                    height={90}
                    width={80}
                  />
                </>
              )}
            </div>
            <div className={styles.srow2}>
              <Typography>
                {" "}
                <FormattedLabel id="witnessthumb3" />{" "}
              </Typography>
              {/* <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wtThumb")}
                fileKey={"wtThumb"}
                showDel={pageMode != "APPLICATION VERIFICATION" ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span> */}
              {router?.query?.role === "DOCUMENT_VERIFICATION" && (
                <Fingerprint
                  base64String={w3base64String}
                  setFingerPrintImg={setW3FingerPrintImg}
                  setBase64String={setW3Base64String}
                  appName={appName}
                  serviceName={serviceName}
                />
              )}
              {router?.query?.role === "FINAL_APPROVAL" && (
                <>
                  <Image
                    // src={`this?.props?.data?.gphoto`}
                    src={`data:image/png;base64,${wtThumb}`}
                    alt="Witness 3 Thumb"
                    height={90}
                    width={80}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Index;

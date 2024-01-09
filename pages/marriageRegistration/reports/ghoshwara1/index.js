import { Button, Paper } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import ReportLayout from "../NewReportLayout";
import styles from "./goshwara.module.css";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import Image from "next/image";
import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";
const Ghoshwara1 = () => {
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
  const {
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm();
  let router = useRouter();
  const [data, setData] = useState(null);
  let user = useSelector((state) => state.user.user);
  //photo
  const userToken = useGetToken();
  const [gPhoto, setGPhoto] = useState();
  const [gThumb, setGThumb] = useState();

  const [bPhoto, setBPhoto] = useState();
  const [bThumb, setBThumb] = useState();

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
        console.log("ImageApi213109092", r?.data?.fileName);
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
        console.log("ImageApibphoto33", r?.data.fileName);
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
  useEffect(() => {
    axios
      .get(
        `${
          urls.MR
        }/transaction/prime/getApplicationByServiceIdApplicationId?applicationId=${localStorage.getItem(
          "applicationId",
        )}&serviceId=${localStorage.getItem("serviceId")}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        console.log("r.data", r.data);
        setData(r.data);
        if (r?.data?.gphoto) {
          getGPhoto(r?.data?.gphoto);
        }
        if (r?.data?.gthumb) {
          getGThumb(r?.data?.gthumb);
        }
        if (r?.data?.bphoto) {
          getBPhoto(r?.data?.bphoto);
        }
        if (r?.data?.bthumb) {
          getBThumb(r?.data?.bthumb);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    router.push("/marriageRegistration/dashboard");
  };

  // view
  return (
    <div>
      <div>
        <center>
          <h1>गोषवारा भाग १</h1>
        </center>
      </div>
      <div style={{ padding: 10 }}>
        <Button
          variant="contained"
          type="primary"
          style={{ float: "right" }}
          onClick={handlePrint}
        >
          print
        </Button>
        <Button onClick={backToHomeButton} variant="contained" type="primary">
          back To home
        </Button>
      </div>
      <div style={{ marginLeft: "5%" }}>
        <ReportLayout
          centerHeader
          centerData
          // rows={table}
          // columns={columnsPetLicense}
          columnLength={10}
          componentRef={componentRef}
          showDates
          date={{
            from: moment(watch("fromDate")).format("DD-MM-YYYY"),
            to: moment(watch("toDate")).format("DD-MM-YYYY"),
          }}
          deptName={{
            en: "Library Management System",
            mr: "पशुवैद्यकीय व्यवस्थापन प्रणाली",
          }}
          reportName={{
            en: "गोषवारा भाग १",
            mr: "गोषवारा भाग १",
          }}
        >
          <ComponentToPrint
            data={data}
            gPhoto={gPhoto}
            gThumb={gThumb}
            bPhoto={bPhoto}
            bThumb={bThumb}
          />
        </ReportLayout>
      </div>

      {/* <ComponentToPrint data={data} ref={componentRef} /> */}
    </div>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div>
        <Paper>
          <table className={styles.report}>
            <tr className={styles.trroww}>
              <td colSpan={2}>
                <b>
                  विवाह निबंधक कार्यालय : {this?.props?.data?.zone?.zoneNameMr}{" "}
                </b>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <h1>गोषवारा भाग १</h1>
              </th>
            </tr>
            <tr>
              <td>
                <b>
                  &nbsp;विवाह नोंदणी क्रमांक:{" "}
                  {this?.props?.data?.registrationNumber}{" "}
                </b>
              </td>
              <td className={styles.trrow}>
                <b>दिनांक : {this?.props?.data?.marriageDate} </b>
              </td>
            </tr>
          </table>
          <table className={styles.data}>
            <tr>
              <th style={{ width: "50%" }}>वराची माहीती </th>
              <th style={{ width: "25%" }}>छायाचित्र </th>
              <th style={{ width: "25%" }}>अंगठ्याचा ठसा</th>
            </tr>
            <tr>
              <td>
                &nbsp;नावं: {this?.props?.data?.gfNameMr}{" "}
                {this?.props?.data?.gmNameMr} {this?.props?.data?.glNameMr}
                <br></br>
                &nbsp;वय : {this?.props?.data?.gage}
                <br></br>
                &nbsp;पत्ता : {this?.props?.data?.gcityNameMr}
                <br></br>
                &nbsp;सही :<br></br>
              </td>
              <td
                style={{
                  padding: "1.5vh",
                }}
                className={styles.tdcard}
              >
                <div
                  className="photo"
                  style={{
                    backgroundColor: "beige",
                    width: "100px",
                    height: "100px",
                  }}
                >
                  <Image
                    src={`data:image/png;base64,${this?.props?.gPhoto}`}
                    // src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.gphoto}`}
                    alt="Groom Photo"
                    // styles={{marginRight:"100px"}}
                    height={100}
                    width={120}
                  />
                </div>
              </td>

              <td
                style={{
                  padding: "1.5vh",
                }}
              >
                <div
                  className="thumb"
                  style={{
                    backgroundColor: "beige",
                    width: "100px",
                    height: "100px",
                    marginLeft: "7.2vw",
                  }}
                >
                  <Image
                    // src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.gthumb}`}
                    src={`data:image/png;base64,${this?.props?.gThumb}`}
                    alt="groom thumb"
                    // styles={{marginRight:"100px"}}
                    height={100}
                    width={120}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th style={{ width: "50%" }}>वधूची माहीती </th>
              <th style={{ width: "25%" }}>छायाचित्र </th>
              <th style={{ width: "25%" }}>अंगठ्याचा ठसा</th>
            </tr>
            <tr>
              <td>
                &nbsp;नावं: {this?.props?.data?.bfNameMr}{" "}
                {this?.props?.data?.bmNameMr} {this?.props?.data?.blNameMr}
                <br></br>
                &nbsp;वय : {this?.props?.data?.bage}
                <br></br>
                &nbsp;पत्ता : {this?.props?.data?.bcityNameMr}
                <br></br>
                &nbsp;सही :<br></br>
              </td>
              <td
                style={{
                  padding: "1.5vh",
                }}
                className={styles.tdcard}
              >
                <div
                  className="photo"
                  style={{
                    backgroundColor: "beige",
                    width: "100px",
                    height: "100px",
                  }}
                >
                  <Image
                    src={`data:image/png;base64,${this?.props?.bPhoto}`}
                    alt="Bride Photo"
                    // styles={{marginRight:"100px"}}
                    height={100}
                    width={120}
                  />
                </div>
              </td>

              <td
                style={{
                  padding: "1.5vh",
                }}
              >
                <div
                  className="thumb"
                  style={{
                    backgroundColor: "beige",
                    width: "100px",
                    height: "100px",
                    marginLeft: "7.2vw",
                  }}
                >
                  <Image
                    src={`data:image/png;base64,${this?.props?.bThumb}`}
                    alt="bride thumb"
                    // styles={{marginRight:"100px"}}
                    height={100}
                    width={120}
                  />
                </div>
              </td>
            </tr>
          </table>
          <table className={styles.report}>
            <tr>
              <td>
                {" "}
                <b>&nbsp;दिनांक : {this?.props?.data?.applicationDate} </b>
              </td>
            </tr>
            <tr className={styles.trrowf}>
              <td colSpan={2} style={{ paddingRight: "50px" }}>
                {" "}
                <b>
                  विवाह निबंधक <br></br> {this?.props?.data?.zone?.zoneNameMr}{" "}
                </b>
              </td>
            </tr>
          </table>
        </Paper>
      </div>
    );
  }
}

// class ComponentToPrint extends React.Component {
//   render() {
//     return (
//       <div style={{ padding: '13px' }}>
//         <div className="report">
//           <Card>
//             <table className={styles.report}>
//               <tr>
//                 <th colspan="2">गोषवारा भाग १</th>
//               </tr>
//               <tr>
//                 <td>विवाह निबंधक कार्यालय :</td>
//                 <td>विवाह नोंदणी क्रमांक:</td>
//               </tr>
//             </table>

//             <table className={styles.report_table}>
//               <thead>
//                 <tr>
//                   <th colSpan={14}>
//                     <h3>
//                       <b>गोषवारा भाग १ </b>
//                     </h3>

//                     <Row>
//                       <Col span={18}></Col>
//                       <Col span={4}>
//                         {' '}
//                         <h3>
//                           {' '}
//                           <b>विवाह निबंधक कार्यालय : </b>
//                         </h3>
//                       </Col>
//                     </Row>

//                     <Row>
//                       <Col span={1}></Col>
//                       <Col span={4}>
//                         {' '}
//                         <h3>
//                           {' '}
//                           <b>विवाह नोंदणी क्रमांक: </b>
//                         </h3>
//                       </Col>
//                     </Row>
//                   </th>
//                 </tr>

//                 <tr>
//                   <th colSpan="22">
//                     {/* <Row>
//                       <Col span={4}>
//                         <h3>
//                           <b>वराची माहीती :</b>
//                         </h3>
//                       </Col>
//                       <Col span={8}></Col>
//                       <Col span={4}>
//                         <h3>
//                           <b>छायाचित्र :</b>
//                         </h3>
//                       </Col>

//                       <Col span={2}></Col>
//                       <Col span={3}>
//                         <h3>
//                           <b>अंगठ्याचा ठसा :</b>
//                         </h3>
//                       </Col>
//                     </Row> */}

//                     <tr>
//                       <th>वराची माहीती</th>

//                       <th>छायाचित्र</th>
//                       <th>अंगठ्याचा ठसा</th>
//                     </tr>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>
//                     <th colSpan="22">
//                       <Row>
//                         <Card>
//                           <table className={styles.goshwara}>
//                             <tr>
//                               <th>वराची माहीती</th>
//                               <th>छायाचित्र</th>
//                               <th>अंगठ्याचा ठसा</th>
//                             </tr>
//                             <tr>
//                               <td>
//                                 नावं:<br></br>
//                                 वय :<br></br>
//                                 पत्ता :<br></br>
//                                 सही :<br></br>
//                               </td>
//                               <td>
//                                 <Card
//                                   style={{
//                                     height: 200,
//                                     width: 150,
//                                     background: 'yellow',
//                                   }}
//                                 ></Card>
//                               </td>
//                               <td>
//                                 <Card
//                                   style={{
//                                     height: 200,
//                                     width: 150,
//                                     background: 'yellow',
//                                   }}
//                                 ></Card>
//                               </td>
//                             </tr>
//                           </table>
//                         </Card>

//                         {/* <td>
//                           नावं:<br></br>
//                           वय :<br></br>
//                           पत्ता :<br></br>
//                           सही :<br></br>
//                         </td>
//                         <td>
//                           <Card
//                             style={{
//                               height: 250,
//                               width: 150,
//                               background: 'yellow',
//                             }}
//                           ></Card>
//                         </td> */}
//                       </Row>

//                       {/* <Row>
//                         <Col style={{ padding: '10px' }}>वय :</Col>
//                       </Row>
//                       <Row>
//                         <Col style={{ padding: '10px' }}>पत्ता :</Col>
//                       </Row>
//                       <Row>
//                         <Col style={{ padding: '10px' }}>सही :</Col>
//                       </Row> */}
//                     </th>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>
//                     <th colSpan="35">
//                       <Col xl={30}></Col>
//                       <Col xl={8}>
//                         <Card
//                           style={{
//                             height: 250,
//                             width: 150,
//                             background: 'yellow',
//                           }}
//                         ></Card>
//                       </Col>

//                       <Row>
//                         <Col style={{ padding: '10px' }}>नावं:</Col>
//                       </Row>
//                       <Row>
//                         <Col style={{ padding: '10px' }}>वय :</Col>
//                       </Row>
//                       <Row>
//                         <Col style={{ padding: '10px' }}>पत्ता :</Col>
//                       </Row>
//                       <Row>
//                         <Col style={{ padding: '10px' }}>सही :</Col>
//                       </Row>
//                     </th>
//                   </td>
//                 </tr>
//               </tbody>
//               <tfoot>
//                 <tr>
//                   <td colSpan={14}>
//                     <Row>
//                       <Col span={7}>
//                         <b>दिनांक</b>
//                       </Col>

//                       <Col span={9}></Col>
//                       <Col span={7}>
//                         {' '}
//                         <b>
//                           विवाह निबंधक <br></br>फ क्षेत्रिय कार्यालय
//                         </b>
//                       </Col>
//                     </Row>
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </Card>
//         </div>
//       </div>
//     )
//   }
// }

export default Ghoshwara1;

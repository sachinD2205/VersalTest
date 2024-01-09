import { Button } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import router from "next/router";
import styles from "../goshwara.module.css";
import axios from "axios";
// import urls from "../../../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";
import { ToWords } from "to-words";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

// pages/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt/index.js
// import urls from '../../../../../../URLS/urls'

const Index = ({
  connectionData,
  usageType,
  ownership,
  slumName,
  villageName,
  componentRef,
}) => {
  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const [dataa, setDataa] = useState(null);
  const [selectedObject, setSelectedObject] = useState();
  const [work, setWork] = useState();
  const [dataSource, setdataSource] = useState({});
  const [typeATotalAmount, settypeATotalAmount] = useState();
  const [typeBTotalAmount, settypeBTotalAmount] = useState();
  const [TotalAmount, setTotalAmount] = useState();

  const [bTypeCharge, setBTypeCharge] = useState({});
  const [aTypeChargesDaoList, setATypeChargesDaoList] = useState([]);
  const [totalLengthForRateChart, setTotalLengthForRateChart] = useState(0);
  const [totalAmountForRateChart, setTotalAmountForRateChart] = useState(0);
  const [natureofExcavation, setnatureofExcavation] = useState([]);
  const [roadType, setRoadType] = useState();
  const language = useSelector((store) => store.labels.language);
  const user = useSelector((state) => state.user.user);
  const userToken = useGetToken();
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
  //   let approvalData = useSelector((state) => state.user.setApprovalOfNews)
  let approvalId = router?.query?.id;
  useEffect(() => {
    // getWard();
    // getAllTableData();
    // getDepartment();
    // getRotationGroup();
    // getRotationSubGroup();
    // getNewsPaper();
    // getDate();
  });
  console.log("connectionData", ownership);
  useEffect(() => {
    let res = dataSource;
    console.log("payyyyyy", res);
    // setValue("applicationNo", res ? res?.applicationNumber : "-");
    // setValue("applicationDetails", res ? res?.trnLoiDao?.loiNo : "-");
    // // setValue("companyName", res ? res?.companyName : "-");
    // setValue(
    //   "applicantNameAdd",
    //   res ? `${res?.firstName} ${res?.middleName} ${res?.lastName}` : "-"
    // );
    settypeATotalAmount(res?.trnLoiDao?.typeATotalAmount);
    settypeBTotalAmount(res?.trnLoiDao?.typeBTotalAmount);
    setTotalAmount(res?.trnLoiDao?.finalTotalAmount);
  }, [dataSource]);

  // get nature of excavation
  const getNatureOfExcavation = () => {
    axios.get(`${urls.RENPURL}/mstNatureOfExcavation/getAll`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      // console.log("mstNatureOfExcavation", r);
      let result = r.data.mstNatureOfExcavationDaoList;
      // console.log("mstNatureOfExcavation", result);
      setnatureofExcavation(result);
    })
    .catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // get road type
  const getRoadType = () => {
    axios
      .get(`${urls.RENPURL}/mstRoadType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        let result = r.data.mstRoadTypeList;
        setRoadType(result);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //get details

  const getApplicationData = (id) => {
    console.log("aaaaaa", id);
    if (id) {
      axios
        .get(
          `${urls.RENPURL}/trnExcavationRoadCpmpletion/getDataById?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          let result = r.data;

          setdataSource(result);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  const getRateChargeCalculation = (id) => {
    if (router.query.id) {
      axios
        .get(
          `${urls.RENPURL}/mstRateCharge/getRateByExcavationRoadCpmpletionId/?id=${id}`,{
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          console.log(
            "getRateByExcavationRoadCpmpletionId",
            r.data.mstATypeChargesDaoList
          );
          console.log(
            "getRateByExcavationRoadCpmpletionId",
            r.data.mstBTypeCharge
          );
          setATypeChargesDaoList(r?.data?.mstATypeChargesDaoList);
          setBTypeCharge(r?.data?.mstBTypeCharge);
          // let result = r.data.mstNatureOfExcavationDaoList;
          // console.log("mstNatureOfExcavation", result);
          // setnatureofExcavation(result)
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  console.log("ddddddddddd", dataSource);
  useEffect(() => {
    getNatureOfExcavation();
    getRoadType();
    getApplicationData(router.query.id);
    getRateChargeCalculation(router.query.id);
  }, [router.query.id]);
  useEffect(() => {
    if (
      aTypeChargesDaoList?.length > 0 &&
      aTypeChargesDaoList != undefined &&
      aTypeChargesDaoList != null
    ) {
      let totalLength = 0;
      let totalAmount = 0;
      for (let item of aTypeChargesDaoList) {
        console.log("item121", item);
        totalLength += item?.lengthOfRoad;
        totalAmount += item?.amount;
      }
      setTotalLengthForRateChart(totalLength);
      setTotalAmountForRateChart(totalAmount);
    }
  }, [aTypeChargesDaoList]);

  //print start
  const componentRef1 = useRef();
  const handleGenerateButton1 = useReactToPrint({
    content: () => componentRef1.current,
  });
  //print end
  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser111", loggedInUser);
  // view
  return (
    <>
      <div>
        <ComponentToPrintOfficialNotesheet
          connectionData={connectionData}
          language="mr"
          slumName={slumName}
          usageType={usageType}
          ownership={ownership}
          villageName={villageName}
          ref={componentRef1}
          aTypeChargesDaoList={aTypeChargesDaoList}
          bTypeCharge={bTypeCharge}
          typeATotalAmount={typeATotalAmount}
          typeBTotalAmount={typeBTotalAmount}
          TotalAmount={TotalAmount}
          totalLengthForRateChart={totalLengthForRateChart}
          totalAmountForRateChart={totalAmountForRateChart}
          dataSource={dataSource}
          natureofExcavation={natureofExcavation}
          roadType={roadType}
        />
      </div>
      <br />

      <div className={styles.btn}>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={handleGenerateButton1}
        >
          print
        </Button>

        {/* <Button
                    variant="contained"
                    sx={{ size: '23px' }}
                    type="primary"
                >
                    Digital Signature
                </Button> */}

        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            if (loggedInUser == "citizenUser") {
              router.push(`/dashboard`);
            } else {
              router.back();
              // router.push(
              //   `/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails`
              // );
            }
          }}
        >
          Exit
        </Button>
      </div>
    </>
  );
};

class ComponentToPrintOfficialNotesheet extends React.Component {
  render() {
    const toWords = new ToWords({ localeCode: "mr-IN" });
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return (
      <>
        {/* <div className={styles.main}> */}

        <div className={styles.small}>
          {/* <div className={styles.head}>
        <h1>LOI GENERATION</h1>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
      </p>
      </div> */}
          {/* <div className={styles.one}>
              
              <div className={styles.logoLOI}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div className={styles.middleLOI} styles={{ paddingTop: "15vh", marginTop: "20vh" }}>
               
                <div className={styles.add8}>
                  <div className={styles.add}>
                    <h3>
                      <b>Service Name</b>
                    </h3>
                    <h5>
                     
                      <b>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </b>
                    </h5>
                  
                  </div>

                  <div className={styles.add1}>
                    <h3>
                      <b>Address</b>
                    </h3>
                    <h5>
                      <b>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </b>
                    </h5>
                    
                  </div>
                </div>
              </div>
             
            </div> */}
          <div
            className={styles.one}
            style={{ marginLeft: "80px", marginRight: "80px" }}
          >
            <div className={styles.logo}>
              <div>
                <img src="/logo.png" alt="" height="150vh" width="150vw" />
              </div>
            </div>
            <div>
              <h2 style={{ marginTop: "50px", marginLeft: "80px" }}>
                <FormattedLabel id="pcmc" />
                <br></br>
                <FormattedLabel id="subHead" />
                {/* मुंबई प्रांतिक महानगरपालिका अधिनियम १९४९, कलमे ४३९/४४०, ४४२/४७९ */}
                <br />
                <h4 style={{ marginTop: "40px", marginLeft: "30px" }}>
                  <FormattedLabel id="DemandNoteGeneration" />
                </h4>
              </h2>
            </div>
          </div>

          <div
            style={{
              marginLeft: "80px",
              marginRight: "80px",
              marginTop: "40px",
            }}
          >
            <b>प्रति, <br></br>
            {this.props.dataSource.companyNameMr}</b>
            {/* मे. महाराष्ट्र नॅचरल गॅस लि. <br></br> 
                            प्लॉट क्र. पहिला मजला, ए ब्लॉक, 27. <br></br>
                             पी. व्यापारी संकुल एल.एम.पी.एम. <br></br> 
                             पी.बस डेपोजवळ.टी.एम. <br></br> 
                             नरवीर तानाजी वाडी ५- पुणे, शिवाजीनगर.<br></br><br></br>यांस<br></br> */}
            {/* <div style={{ marginBottom: "50px" }}>
              <table className={styles.table} style={{ marginTop: "30px" }}>
                <tr className={styles.tr}>
                  <th className={styles.th}>अ.क्र.</th>
                  <th className={styles.th}>कामाचा तपशिल</th>
                  <th className={styles.th}>येणे रक्कम (रुपये)</th>
                </tr>
                <tr>
                  <td className={styles.th}>१ </td>
                  <td className={styles.th}>
                    डांबरी रस्ता काटकोनात खोदाई (पुर्ण जाडी){" "}
                  </td>
                  <td className={styles.th}>{this.props.typeATotalAmount}/-</td>
                </tr>
                <tr>
                  <td className={styles.th}>२ </td>
                  <td className={styles.th}>मनपा अधिभार </td>
                  <td className={styles.th}>{this.props.typeBTotalAmount}/-</td>
                </tr>
                <tr>
                  <td className={styles.th}></td>
                  <td className={styles.th}>एकूण रक्कम रुपये</td>
                  <td className={styles.th}>{this.props.TotalAmount}/-</td>
                </tr>
              </table>
            </div> */}
            <div style={{ marginBottom: "50px" }}>
              <table className={styles.table} style={{ marginTop: "30px" }}>
                <tr className={styles.tr}>
                  <th className={styles.th}>
                    {this.props.language == "en" ? "Sr.No" : "अ.क्र."}
                  </th>
                  {/* <th className={styles.th}>{this.props.language == "en"?"Chainage":"चेनेज"}</th> */}
                  <th className={styles.th}>
                    {this.props.language == "en"
                      ? "Road Type"
                      : "रस्त्याचा प्रकार"}
                  </th>
                  <th className={styles.th}>
                    {this.props.language == "en"
                      ? "Length(meter)"
                      : "लांबी(मीटर)"}
                  </th>
                  <th className={styles.th}>
                    {this.props.language == "en"
                      ? "Other excavation charges (Rs. per m)"
                      : "रस्ता खोदाईचे शुल्क (र.रु. प्रति मी.)"}
                  </th>
                  <th className={styles.th}>
                    {this.props.language == "en"
                      ? "Total Amount(Rs.)"
                      : "एकूण र.रु."}
                  </th>
                </tr>

                <tr>
                  <td colspan="2">
                    <b>
                      {this.props.language == "en"
                        ? "Type A: Charges for road rehabilitation"
                        : "प्रकार अ: रस्ता पुर्ववत करण्यासाठीचे शुल्क"}
                    </b>
                  </td>
                </tr>

                {this.props.aTypeChargesDaoList &&
                  this.props.aTypeChargesDaoList.map((item, index) => (
                    <>
                      <tr>
                        <td className={styles.th}>{index + 1} </td>
                        {/* <td className={styles.th}>{item.roadTypeKey}</td> */}
                        <td className={styles.th}>
                          {this.props.language == "en"
                            ? this.props.roadType?.find(
                                (data) => data?.id == item.roadTypeKey
                              )?.roadTypeName
                            : this.props.roadType?.find(
                                (data) => data?.id == item.roadTypeKey
                              )?.roadTypeNameMr}
                        </td>
                        <td className={styles.th}>{item.lengthOfRoad}</td>
                        <td className={styles.th}>{item.rate}/-</td>
                        <td className={styles.th}>{item.amount}/-</td>
                      </tr>
                    </>
                  ))}
                <tr>
                  <td className={styles.th}></td>
                  <td className={styles.th}>
                    <b>
                      {this.props.language == "en"
                        ? "Total Length"
                        : "एकूण लांबी"}
                    </b>{" "}
                  </td>
                  <td className={styles.th}>
                    {this.props.totalLengthForRateChart}
                  </td>
                  <td className={styles.th}>
                    <b>
                      {this.props.language == "en"
                        ? "Total Amount(Rs.)"
                        : "एकूण र.रु."}
                    </b>
                  </td>
                  <td className={styles.th}>
                    {" "}
                    {this.props.totalAmountForRateChart}/-
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <b>
                      {this.props.language == "en"
                        ? "Type B: Municipality Surcharge"
                        : "प्रकार ब:  मनपा अधिभार"}
                    </b>{" "}
                  </td>
                </tr>
                <tr>
                  <td className={styles.th}></td>
                  <td className={styles.th}>
                    {this.props.language == "en"
                      ? this.props.natureofExcavation?.find(
                          (data) =>
                            data?.id ==
                            this.props.bTypeCharge?.natureOfExcavation
                        )?.nameEng
                      : this.props.natureofExcavation?.find(
                          (data) =>
                            data?.id ==
                            this.props.bTypeCharge?.natureOfExcavation
                        )?.nameMr}
                  </td>
                  <td className={styles.th}>
                    {this.props.bTypeCharge?.lengthOfExcavation}
                  </td>
                  <td className={styles.th}>
                    {this.props.bTypeCharge?.rate}/-
                  </td>
                  <td className={styles.th}>
                    {this.props.bTypeCharge?.amount}/-
                  </td>
                </tr>
                <tr>
                  <td className={styles.th}></td>
                  <td className={styles.th}> </td>
                  <td className={styles.th}></td>
                  <td className={styles.th}>
                    <b>
                      {this.props.language == "en"
                        ? "Total Amount(Type A + Type B)"
                        : "एकूण र.रु.(टाइप A + टाइप B)"}
                    </b>
                  </td>
                  <td className={styles.th}>
                    {" "}
                    {this.props.totalAmountForRateChart +
                      this.props.bTypeCharge?.amount}
                    /-
                  </td>
                </tr>
              </table>
            </div>
           <b> <FormattedLabel id="date" /> :</b>{" "}
            {/* {this.props.dataSource.loiGenrationDate} */}
           {moment(this.props.dataSource.loiGenrationDate).format('DD/MM/YYYY')}
            <br></br>
            <b><FormattedLabel id="applicationNo" /> :</b>{" "}
            {this.props.dataSource.applicationNumber}
            <div
              className={styles.contact}
              style={{ marginTop: "100px", marginBottom: "250px" }}
            >
              {/* <button>upload</button><br></br> */}
              <b>कार्यकारी अभियंता</b>
              <br></br>
              <b>व क्षेत्रीय कार्यालय (स्थापत्य)</b>
              <br></br>
              <b>पिंपरी चिंचवड महानगरपालिका</b>
            </div>
            <h2 style={{ marginTop: "300px" }}>
              <b>शर्ती -</b>
            </h2>
            १) सदरहू रक्कम महानगरपालिकेच्या कार्यालयामध्ये बिल पावल्यापासुन १५
            दिवसाच्या आत भरावी. तसे केल्यास मागणीची नोटीस केली जाईल व
            त्याबद्दलची फी द्यावी लागेल. नोटीस पावल्यापासून १५ दिवसांत रक्कम
            नोटीसीच्या फी सहीत भरावी, तशी न भरल्यास ती वसुल करण्या करिता जप्तीचे
            वॉरंट फी व इतर खर्च तुम्हापासून भरुन घेतला जाईल.<br></br>
            २) वर मागितलेल्या मागणीचे नोटीस पोहचल्यापासून १५ दिवसाचे आंत नोटीसीत
            लिहीलेली रक्कम भरल्याबद्दल काही योग्य कारण असेल तर इकडे लेखी कळवावे.
            <br></br>३) अगर म्युनिसिपल अॅक्टचे कलम ११० प्रमाणे मा. सिटी
            मॅजिस्टेट यांजकडे अपिल करावे.
            <br></br>४) वर लिहिल्याप्रमाणे केलेल्या अपिलाची सुनावणी व निकाल खाली
            लिहिल्याप्रमाणे तजविज केल्याशिवाय होणार नाहीत. म्हणजेच -<br></br>अ)
            कलम १०४ पोटकलम ३ यांत फर्मावलेली नोटीस पोहचल्यापासून १५ दिवसाच्या आत
            अपिल दाखल केले पाहिजे.
            <br></br>ब) महापालिकेची मागणी केली आहे ती रक्कम न देणेच्या कारणांचा
            अर्ज महानगरपालिकेच्याकायद्यात सांगितल्याप्रमाणे योग्य मुदतीत केला
            पाहिजे.
            <br></br>क) ज्या रक्कमेची महानगरपालिकेने मागणी केली आहे. ती रक्कम
            महानगरपालिकेकडे कार्यालयात अनामत ठेवली पाहिजे.
            <br></br>५) साल अखेर असल्यामुळे मार्च महिन्याच्या १५ तारखेपर्यंतच
            डिपॉझिटपैकी खर्च वजा जाता राहिलेली रक्कम परत देण्यात येईल. रक्कम न
            नेल्यास एप्रिलमध्ये अदा केली जाईल.
          </div>

          {/* <div className={styles.sub} style={{ marginLeft: "80px", marginRight: "80px" }}>
              <h3>Subject : </h3>
              <p style={{ marginLeft: "10px"}}> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              
            </div>
            <div className={styles.box} style={{ marginLeft: "80px", marginRight: "80px" }}>
             
              <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              
            </div> */}
        </div>
        {/* </div> */}
      </>
    );
  }
}

export default Index;

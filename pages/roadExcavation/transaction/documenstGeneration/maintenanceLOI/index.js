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
    const [dataSource, setdataSource] = useState({});
    const [TotalAmount, setTotalAmount] = useState();
    const [natureofExcavation, setnatureofExcavation] = useState([]);
    const [applicationData, setApplicationData] = useState();
    const language = useSelector((store) => store.labels.language);
    const user = useSelector((state) => state.user.user);
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
    useEffect(() => {
        let res = dataSource;
        console.log("payyyyyy", res);
        setTotalAmount(res?.amount);
    }, [dataSource]);
    const userToken = useGetToken();
    // get nature of excavation
    const getNatureOfExcavation = () => {
        axios.get(`${urls.RENPURL}/mstNatureOfExcavation/getAll`,{
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }).then((r) => {
            let result = r.data.mstNatureOfExcavationDaoList;
            setnatureofExcavation(result);
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
                    `${urls.RENPURL}/mstRateCharge/getRateMSCB?id=${id}`,{
                        headers: {
                          Authorization: `Bearer ${userToken}`,
                        },
                      }
                )
                .then((r) => {
                    console.log("sdfsdf111", r.data);
                    let result = r.data;
                    setdataSource(result);
                })
                .catch((error) => {
                    callCatchMethod(error, language);
                  });
        }
    };
    const getSingleApplicationData = (id) => {
        console.log("hgghyg", id);
        if (id) {
          axios
            .get(`${urls.RENPURL}/nocPermissionForMaintenance/getById?id=${id}`, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
            .then((r) => {
                let result = r.data;
                console.log("aaaa1",result);
                setApplicationData(result)
            })
            .catch((error) => {
                callCatchMethod(error, language);
              });
        }
      };
    console.log("ddddddddddd", dataSource);
    useEffect(() => {
        getNatureOfExcavation();
        getSingleApplicationData(router.query.id)
        getApplicationData(router.query.id);
    }, [router.query.id]);

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

                    language="mr"
                    ref={componentRef1}
                    TotalAmount={TotalAmount}
                    dataSource={dataSource}
                    natureofExcavation={natureofExcavation}
                    applicationData={applicationData}
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

        console.log("datasoirce", this?.props?.applicationData?.companyNameMr)
        return (
            <>
                <div className={styles.small}>
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
                            marginTop: "80px",
                        }}
                    >
                        <b>प्रति, <br></br>
                            {this?.props?.applicationData?.companyNameMr}
                            </b>

                        <div style={{ marginBottom: "50px" }}>
                            <table className={styles.table} style={{ marginTop: "30px" }}>
                                <tr className={styles.tr}>

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
                                    <td className={styles.th}>
                                        {this.props.language == "en"
                                            ? this.props.natureofExcavation?.find(
                                                (data) =>
                                                    data?.id ==
                                                    this?.props?.dataSource?.natureOfExcavationMaintnance
                                            )?.nameEng
                                            : this.props.natureofExcavation?.find(
                                                (data) =>
                                                    data?.id ==
                                                    this?.props?.dataSource?.natureOfExcavationMaintnance
                                            )?.nameMr}
                                    </td>

                                    <td className={styles.th}>
                                        {this?.props?.dataSource?.lengthOfRoadMaintenance}
                                    </td>
                                    <td className={styles.th}>
                                        100/-
                                    </td>
                                    <td className={styles.th}>
                                        {this?.props?.dataSource?.amount}/-
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <b> <FormattedLabel id="date" /> :</b>{" "}
                        {/* {this.props.dataSource.loiGenrationDate} */}
                        {moment(this.props.dataSource.loiGenrationDate).format('DD/MM/YYYY')}
                        <br></br>
                        <b><FormattedLabel id="applicationNo" /> :</b>{" "}
                        {router.query.applicationNumber}
                        <div
                            className={styles.contact}
                            style={{ marginTop: "50px", marginBottom: "50px" }}
                        >
                            {/* <button>upload</button><br></br> */}
                            <b>कार्यकारी अभियंता</b>
                            <br></br>
                            <b>व क्षेत्रीय कार्यालय (स्थापत्य)</b>
                            <br></br>
                            <b>पिंपरी चिंचवड महानगरपालिका</b>
                        </div>
                        <h2 >
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

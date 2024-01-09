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
import { useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

// pages/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt/index.js
// import urls from '../../../../../../URLS/urls'

const Index = ({ connectionData, usageType, ownership, slumName, villageName, componentRef }) => {
    const backToHomeButton = () => {
        history.push({ pathname: "/homepage" });
    };
    
    const [totalLength,setTotalLength]= useState(0)
  const [totalAmount,setTotalAmount]=useState(0)
  const [finalAmount,setfinalAmount]=useState(0)
  const [bTypeCharge, setBTypeCharge] = useState({});
  const [aTypeChargesDaoList, setATypeChargesDaoList] = useState([]);
  const language = useSelector((store) => store.labels.language);
  const [natureofExcavation, setnatureofExcavation] = useState([]);
  const [roadType, setRoadType] = useState()
  const [dataSource, setdataSource] = useState({})
  const userToken = useGetToken();
    //   let approvalData = useSelector((state) => state.user.setApprovalOfNews)
    let approvalId = router?.query?.id;
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

    const getNatureOfExcavation = () => {
        axios
          .get(`${urls.RENPURL}/mstNatureOfExcavation/getAll`,{
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            // console.log("mstNatureOfExcavation", r);
            let result = r.data.mstNatureOfExcavationDaoList;
            // console.log("mstNatureOfExcavation", result);
            setnatureofExcavation(result)
      
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      };

      const getApplicationData = (id) => {
        console.log("aaaaaa", id);
        if (id) {
          axios
            .get(
              `${urls.RENPURL}/trnExcavationRoadCpmpletion/getDataById?id=${id}`,{
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
      console.log("ddddddddd11dd",dataSource);

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
    //print start
    const componentRef1 = useRef();
  const handleGenerateButton1 = useReactToPrint({
    content: () => componentRef1.current,
  });

    //print end
    const user = useSelector((state) => state.user.user);

  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser",loggedInUser);
  const getRateChargeCalculation = (id) => {
    if(router.query.id){
  
      axios
      .get(`${urls.RENPURL}/mstRateCharge/getRateByExcavationRoadCpmpletionId/?id=${id}`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("getRateByExcavationRoadCpmpletionId", r.data.mstATypeChargesDaoList);
        console.log("getRateByExcavationRoadCpmpletionId", r.data.mstBTypeCharge);
        setATypeChargesDaoList(r?.data?.mstATypeChargesDaoList)
        setBTypeCharge(r?.data?.mstBTypeCharge)
        // let result = r.data.mstNatureOfExcavationDaoList;
        // console.log("mstNatureOfExcavation", result);
        // setnatureofExcavation(result)
        
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    }
  };
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
  }
 

  useEffect(() => {
    getRoadType()
  }, [])
  
  useEffect(()=>{
    getNatureOfExcavation()
    getApplicationData(router.query.id)
    getRateChargeCalculation(router.query.id)
  },[router.query.id])
  useEffect(()=> {
    if(aTypeChargesDaoList.length> 0 &&aTypeChargesDaoList != undefined && aTypeChargesDaoList !=null ){
      let totalLength =0;
      let totalAmount=0;
      for(let item of aTypeChargesDaoList){
        console.log("item121",item)
        totalLength += item?.lengthOfRoad;
        totalAmount += item?.amount;
      }
      setTotalLength(totalLength);
      setTotalAmount(totalAmount);
    }
  
  
  },[aTypeChargesDaoList])
  useEffect(()=>{
    // if(totalAmount&&bTypeCharge){
  console.log("bTypeCharge.amount",bTypeCharge?.amount,totalAmount);
  setfinalAmount(totalAmount+bTypeCharge?.amount)
  // }
  },[totalAmount,bTypeCharge])

    // view
    return (
        <>
            <div>
                <ComponentToPrintOfficialNotesheet
                    connectionData={connectionData}
                    slumName={slumName}
                    usageType={usageType}
                    ownership={ownership}
                    villageName={villageName}
                    ref={componentRef1}
                    language={language}
                    aTypeChargesDaoList={aTypeChargesDaoList}
                    totalAmount={totalAmount}
                    totalLength={totalLength}
                    bTypeCharge={bTypeCharge}
                    natureofExcavation={natureofExcavation}
                    roadType={roadType}
                    dataSource={dataSource}
                />
            </div>
            <br />

            <div className={styles.btn}>
                <Button
                    variant="contained"
                    sx={{ size: '23px' }}
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
                        if(loggedInUser=="citizenUser"){

                            router.push(`/dashboard`);
                        }else{
                            router.push(`/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails`);

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

                <div className={styles.main}>
                <div >

                    <div >

                        <div className={styles.one} style={{ marginLeft: "80px", marginRight: "80px" }}>

                            <div className={styles.logo}>
                                <div>
                                    <img src="/logo.png" alt="" height="100vh" width="100vw" />
                                </div>


                            </div>
                            <div><h2 style={{ marginTop: "80px" }}>Permission Letter <br></br>परवानगी पत्र</h2></div>
                            <div className={styles.middleLOI} styles={{ paddingTop: "15vh", marginTop: "20vh" }}>

                                <div className={styles.add8}>
                                    <div className={styles.add} style={{paddingLeft:"10px"}}>
                                       
                                        <div>
                                          
                                            <b>पिंपरी चिंचवड महानगरपालिका व क्षेत्रीय कार्यालय (स्थापत्य) क्र. जा. बक्षे/स्था/काअ/०५/२७/२०२१ दि २/०२/२०२१</b>
                                        </div>

                                    </div>

                                    
                                </div>
                            </div>

                        </div>
                       



                        <div style={{ margin: "80px", }}>
                            <b>प्रति, <br></br>
                            {this.props.dataSource.companyNameMr}
                            {/* मे. महाराष्ट्र नॅचरल गॅस लि. <br></br> 
                            प्लॉट क्र. पहिला मजला, ए ब्लॉक, 27. <br></br>
                             पी. व्यापारी संकुल एल.एम.पी.एम. <br></br> 
                             पी.बस डेपोजवळ.टी.एम. <br></br> 
                             नरवीर तानाजी वाडी ५- पुणे, शिवाजीनगर. */}
                             </b><br></br>
                                <div  style={{ marginTop: "30px", }}>

                             <b>विषय :- क्षेत्रिय कार्यालयातील प्रभाग क्र.१७ मध्ये चिंचवड भागातील प्रेमलोक पार्क बिजलीनगर परिसरात गॅस पाईप लाईन टाकणेसाठी मे. महाराष्ट्र नॅचरल गॅस लि   . यांना रस्ता खोदाईस परवानगी देणेबाबत. (लांबी- ३५८८ र.मी)</b>
                                </div>
                                <div  style={{ marginTop: "30px", }}>
                                    <b>संदर्भ- १) मे. महाराष्ट्र नॅचरल गॅस लि. यांचेकडील पत्र क्र.MNGL/PCMC/SP/PNG-20/04, दि. 02/11/2020 चे पत्र.<br></br>
                                     २) मा. आयुक्त यांचे दि. आदेश क्र. स्था/शअ/तां/४/१०७/२०२० दि. १६/०६/२०२०<br></br>
                                        ३) परिपत्रक जा.क्र. स्था/शअ/तां/४/१०७/२०२० दि. ०६/०५/२०२०<br></br>
                                    ४) मा. अति. आयुक्त १ यांचे कडील दि. १२/११/२०२० रोजीचा मंजूर प्रस्ताव<br></br>
                                    ५) इकडील पत्र/Demand Note क्र.जा. बक्षे/स्था/काअ/०५/७२/२०२० दि.०८/१२/२०२०<br></br>
                                     ६) मे. महाराष्ट्र नॅचरल गॅस लि., यांनी पिंपरी चिंचवड मनपा मध्ये भरलेली पावती क्र. R/37दि. २४/१२/२०२०</b>
                                </div>
                                <div  style={{ marginTop: "30px", }}>
                                    <b>महाशय,<br></br>
                                    पिंपरी चिंचवड महानगरपालिका हद्दीतील प्रभाग क्रमध्ये चिंचवड भागातील प्रेमलोक पार्क १७., बिजलीनगर परिसरात (नकाशात दर्शविल्याप्रमाणे लांबी :- ३५८८.०० र. मी.) गॅस पाईप लाईन टाकणे करिता संदर्भिय पत्र क्र. १ अन्वये परवानगी मागितलेली आहे.<br></br>
                                    गॅस पाईप लाईन टाकणेसाठी या रस्ते खोदाईपैकी सोबतच्या नकाशाप्रमाणे व क्षेत्रीय कार्यालय, स्थापत्य विभागाच्या अखत्यारीत रस्त्यांवरील लांबी ३५८८.०० मीटर इतकी आहे. वरील संदर्भ क्र. २ चे मान्य प्रस्तावानुसार पिंपरी चिंचवड महानगरपालिका कार्यक्षेत्रातमे. महाराष्ट्र नॅचरल गॅस लि. यांना गॅस पाईप लाईन टाकणेसाठी धोरणास मान्यता मिळालेली आहे. 
                                    याकामी मे. महाराष्ट्र नॅचरल गॅस लि. कडून अधिभार व सुपरव्हिजन चार्जेस भरून घेण्याचे धोरण आहे.<br></br>
                                    वरील बाबी व प्रचलित अटी शर्तीसह संदर्भ क्र. ४ नुसार विषयांकित रस्तेखोदाईचे कार्यालयीन प्रस्तावास मा. सह शहर अभियंता यांनी मान्यता दिलेली आहे.<br></br>
                                    सदर रस्ता खोदाईकामी मनपा धोरणानुसार अधिभार व सुपरव्हिजन चार्जेसचे एकूण शुल्क र रु.१,०७,६४,०००/- (अक्षरी र.रु. एक कोटी सात लाख चौसष्ट हजार फक्त ( इतके संदर्भिय क्र. ५ Demand Note अन्वये भरणे बाबत कळविणेत आले होते. 
                                    त्यानुसार मे. महाराष्ट्र नॅचरल गॅस लि. यांनी संदर्भिय क्र. ६ अन्वये सामान्य पावती क्र. R/37 दि. २४/१२/२०२० अन्वये अर.रु. १,०७,६४,०००/- (अक्षरी र.रु. एक कोटी सात लाख चौसष्ट हजार फक्त ) मनपा कोषागारात जमा केलेबाबत पावतीसादर केलेली आहे.<br></br>
                                    अति.आयुक्त मा. स्थापत्य विभाग, यांनी संदर्भिय क्र. ४ अन्वये रस्ते खोदाई प्रस्तावास मान्यता दिलेली असून आपणास खालील अटीस अधिन राहून व नकाशात दर्शविलेल्या ठिकाणी रस्ता खोदाईस परवानगी देणेत येत आहे. सदर नियोजित कामाची एकूण लांबी ३५८८ रनिंग मी. असून, कामाची मुदत परवानगी पत्राच्या दिनांकापासून १५ मे २०२१ पर्यंत राहील.</b>
                                </div>
                           
                            <div >
                            <table className={styles.table} style={{ marginTop: "30px", }}>
                                    <tr className={styles.tr}>
                                        <th className={styles.th}>{this.props.language == "en"?"Sr.No":"अ.क्र."}</th>
                                        {/* <th className={styles.th}>{this.props.language == "en"?"Chainage":"चेनेज"}</th> */}
                                        <th className={styles.th}>{this.props.language == "en"?"Road Type":"रस्त्याचा प्रकार"}</th>
                                        <th className={styles.th}>{this.props.language == "en"?"Length(meter)":"लांबी(मीटर)"}</th>
                                        <th className={styles.th}>{this.props.language == "en"?"Other excavation charges (Rs. per m)":"रस्ता खोदाईचे शुल्क (र.रु. प्रति मी.)"}</th>
                                        <th className={styles.th}>{this.props.language == "en"?"Total Amount(Rs.)":"एकूण र.रु."}</th>
                                        
                                    </tr>
                                    
                                    <tr>
                                    <td colspan="2"><b>{this.props.language == "en"?"Type : A Charges for road rehabilitation":"प्रकार: अ रस्ता पुर्ववत करण्यासाठीचे शुल्क"}</b></td>


                                   </tr>

                                


                                        {
                                          this.props.aTypeChargesDaoList && this.props.aTypeChargesDaoList.map((item,index)=>
                                          
                                          <>

                                           
                                    <tr>
                                           <td className={styles.th}>{index+1} </td>
                                        {/* <td className={styles.th}>{item.roadTypeKey}</td> */}
                                        <td className={styles.th}>{this.props.language=="en"?this.props.roadType?.find((data)=>data?.id == item.roadTypeKey)?.roadTypeName:this.props.roadType?.find((data)=>data?.id == item.roadTypeKey)?.roadTypeNameMr}</td>
                                        <td className={styles.th}>{item.lengthOfRoad}</td>
                                        <td className={styles.th}>{item.rate}/-</td>
                                        <td className={styles.th}>{item.amount}/-</td>
                                    </tr>
                                    
                                          </>)
                                        }
                                        <tr>
                                    <td className={styles.th}></td>
                                    <td className={styles.th} ><b>{this.props.language == "en"?"Total Length":"एकूण लांबी"}</b> </td>
                                    <td className={styles.th}>{this.props.totalLength}</td>
                                    <td className={styles.th} ><b>{this.props.language == "en"?"Total Amount(Rs.)":"एकूण र.रु."}</b></td>
                                    <td className={styles.th}> {this.props.totalAmount}/-</td>
                                    </tr>
                                   <tr>
                                    <td colspan="2"><b>{this.props.language == "en"?"Type : B Municipality Surcharge":"प्रकार: ब  मनपा अधिभार"}</b> </td>
                                   </tr>
                                          <tr>
                                          <td className={styles.th}></td>
                                        <td className={styles.th}>{this.props.language == "en"?this.props.natureofExcavation?.find((data)=>data?.id == this.props.bTypeCharge?.natureOfExcavation)?.nameEng : this.props.natureofExcavation?.find((data)=>data?.id ==this.props.bTypeCharge?.natureOfExcavation)?.nameMr}</td>
                                        <td className={styles.th}>{this.props.bTypeCharge.lengthOfExcavation}</td>
                                        <td className={styles.th}>{this.props.bTypeCharge.rate}/-</td>
                                        <td className={styles.th}>{this.props.bTypeCharge.amount}/-</td>
                                          </tr>
                                          <tr>
                                    <td className={styles.th}></td>
                                    <td className={styles.th} > </td>
                                    <td className={styles.th}></td>
                                    <td className={styles.th} ><b>{this.props.language == "en"?"Total Amount(Type A + Type B)":"एकूण र.रु.(टाइप A + टाइप B)"}</b></td>
                                    <td className={styles.th}> {this.props.totalAmount+this.props.bTypeCharge?.amount}/-</td>
                                    </tr>

                                         
                                   
                                </table>
                            </div>
                                <div  style={{ marginTop: "30px", }}>
                                    <b>अटी -<br></br>

१. प्रत्यक्ष कामाला सुरुवात करण्यापूर्वी रस्त्याखाली असलेल्या सेवा वाहिन्यांचे सर्वेक्षण करुन प्रत्यक्ष कामाला सुरुवात करावी. मे. महाराष्ट्र नॅचरल गॅस लि. यांनी भुमिगत विद्युत लाईन रस्त्याच्या पृष्ठभागापासून कमीत कमी एक मीटर खोल टाकण्यात यावी, जेणे करुन रस्त्याचे काम करताना केवलला इजा पोहचणार नाही.

<br></br>२. मे. महाराष्ट्र नॅचरल गॅस लि. यांनी विद्युत लाईनटाकणेसाठी रस्ता खोदाई करताना मनपा, इतर शासकीय, अर्धशासकीय, खाजगी संस्थेच्या किंवा व्यक्तीगत सेवा वाहिन्यांचे नुकसान केल्यास त्याबाबतची संपूर्ण जबाबदारी मे. महाराष्ट्र नॅचरल गॅस लि. यांची राहिल व सदर सेवावाहिन्यांची दुरुस्ती केल्यानंतरच पुढील कामाला सुरुवात करता येईल. रहदारी संबंधी आवश्यक ती दक्षता घेणेची (सुचना फलक, दक्षता फलक लावणे इ.) जबाबदारी मे. महाराष्ट्र नॅचरल गॅस लि. यांची राहील.
 तसेच फलकावर जबाबदार अधिकाऱ्याचे नाव, पत्ता व संपर्काचा फोन नंबर असणे आवश्यक आहे.

<br></br>३. तसेच सदरचे काम करताना कोणत्याही प्रकारचा अपघात झालेस त्याची संपुर्ण जबाबदारी मे महाराष्ट्र नॅचरल गॅस लि. याची राहील.
<br></br>४. परवानगी पत्राची एक प्रत ज्या ठिकाणी खोदकाम चालु आहे, तेथील जबाबदार व्यक्तीकडे असणे आवश्यक आहे.

<br></br>५. खोदाई करणे पुर्वी म.न.पा.चे जलनिःसारण विभाग पाणी पुरवठा विभाग, विद्युत विभाग, इविभागांशी संपर्क साधावा व त्यांचेकडुन "ना हरकत दाखला" घ्यावा. सदर विभागांचे लाईन्सचे नुकसान झाले त्याची जबाबदारी मे महाराष्ट्र नॅचरल गॅस लि. यांची राहील.

<br></br>६. सदर काम करताना मा. आयुक्त यांचे सुचनेनुसार फुटपाथ व डांबरी रस्ता कमीतकमी खोदण्यात यावा. त्यादृष्टीने स्थापत्य विभागाशी वेळोवेळी समन्वय ठेवावा. तसेच प्रत्यक्ष काम सुरु करणेपूर्वी पिंपरी  चिंचवड महानगरपालिकेच्या अभियंतांच्या/प्रकल्प नियोजन सल्लागार यांच्या मार्गदर्शनाखाली काम करणे बंधनकारक राहील व महानगरपालिकेच्या अभियंत्या रस्त्याच्या बांधकामाचे सोईचे दृष्टीने सेवावाहिन्या मार्गामध्ये बदल करणे आवश्यक वाटल्यास सदरचा बदल करणे आपणावर बंधनकारक राहील.
<br></br>७. तसेच प्रत्यक्ष काम करताना कंपनीने वाढीव क्षेत्रफळ वापरल्यास मे. महाराष्ट्र नॅचरल गॅस लि. यांनी मनपाच्या प्रचलित दरानुसार वाढीव क्षेत्रफळाचे वाढीव रकम मनपाच्या कोषागारात डिमांड ड्राफ्ट स्वरुपात ८ दिवसांत भरणे अनिवार्य राहील.

<br></br>८. काम केल्यानंतर खोदलेल्या रस्त्याचे चर व्यवस्थित बुजवुन घेण्याची जबाबदारी मे. महाराष्ट्र नॅचरल गॅस लि. यांची राहील व जर रस्ता पूर्ववत करण्याचे काम मनपा विनिर्देशाप्रमाणे झाले नाही तर रस्ता पूर्ववत करण्याचे शुल्क महाराष्ट्र मेट्रो रेल कार्पोरेशन लि. यांस देय असणाऱ्या रकमेतून वसूल करण्यात येईन. तसेच खोदकामातील जादा मटेरीयल आजुबाजुला न पसरता व्यवस्थितपणे वाहून नेण्याची व्यवस्था मे. महाराष्ट्र नॅचरल गॅस यांनी करावी.

<br></br>
९.सदर कामा अंतर्गत बांधण्यात येणारे चेंबरचे कव्हर हेवी डयुटी असावे व त्याबाबत संबंधित प्रभागाचे कार्यकारी यांची मान्यता (Approval) घेणेत यावी. भविष्यात चेंबर्सची दुरुस्तीची कामे मे.महाराष्ट्र नॅचरल गॅस लि. यांच्यामार्फत म.न.पाच्या पूर्व परवानगीने करण्यात यावी.
<br></br>१०. पिंपरी चिंचवड म.न.पा स आवश्यक वाटेल तेंव्हा मे. महाराष्ट्र नॅचरल गॅस लि. यांना स्वखर्चाने सेवा वाहिनी कोणत्याही प्रकारची नुकसान भरपाई न मागता ती काढून घेणे बंधनकारक राहील.

<br></br>११. मे. महाराष्ट्र नॅचरल गॅस लि. यांची सेवा वाहिनी लेव्हल भविष्यात होणा-या रस्त्याच्या लेव्हलशी सुसंगत असावी. अन्यथा केबलचे नुकसान झाल्यास म.न.पा ची जबाबदारी राहणार नाही.
<br></br>१२. योग्य नियोजन करून सदरचे काम कार्यकारी अभियंता - स्थापत्य व क्षेत्रिय कार्यालय यांनी प्रस्तावित केलेनुसार कामाची मुदतपरवानगी दिलेपासून १५ मे २०२१ पर्यंत राहील अन्यथा खोदाई काम बुजवून टाकणेत येईल व होणा-या नुकसानीस म.न.पा जबाबदार राहणार नाही. तसेच मुदतीत काम पुर्ण न केल्यास सदरची परवानगी रद्द समजली जाईन व मे. महाराष्ट्र नॅचरल गॅस लि. यांना पुन्हा नव्याने रीतसर परवानगी घ्यावी लागेल.
<br></br>१३. ज्या ठिकाणी रोड क्रॉसिंग करणार आहे त्या ठिकाणी शक्यतो Horizontal Bore करून व पाईप टाकुन क्रॉसिंग करावे अथवा अस्तित्वातील डक्ट मधून करावे.
<br></br> १४.रस्ता खोदाई सुरू करणे पूर्वी वाहतुक पोलिसांची परवानगी घ्यावी व परवानगीची एक प्रत मनपाच्या स्थापत्य विभागाच्या संबंधित कार्यकारी अभियंता व इकडील कार्याकारी अभियंता यांची पूर्व परवानगी घेणेत यावी व तशी परवानगीची एक प्रत इकडील कार्यालयाकडे देणेत यावी,

त्याचप्रमाणे परिपत्रक क्र.स्था/श.अ./तो/२/२७८/२००९ दि. ७/०९/२००९ नुसार रस्त्यावर खोदकाम करताना सुरक्षिततेसाठी खालील बाबींची पूर्तता केल्यास व त्याची पडताळणी केल्यानंतर प्रत्यक्ष खोदकाम करणे आवश्यक आहे.
<br></br>
१५. वाहतुक सावधानतेचा फलक (Safety Cautionary Board)
<br></br>
१६. वाहतुक वळविणेसंबंधीचा फलक (Traffic Diversion Board)
<br></br>
१७. संपूर्ण खोदकामाभोवती लोखंडी कडे (Complete Barricading at work)
<br></br>
१८. विद्युत ब्ब्निकर्स दिवे बसविणे (Light Blinkers at night)
<br></br>
१९. सर्व बोर्डस व दिशादर्शक फलकासाठी रिट्रो रिल्फेक्टीव्ह पेन्टचाच वापर करावा..
<br></br>
२०. सकाळी / संध्याकाळी गर्दीच्या वेळी (Peak Hrs) ट्रैफिक सुरक्षितपणे हाताळणेसाठी ट्रॅफीक वॉर्डन नेमण्यात यावा.
<br></br>
२१. वरील प्रमाणे सर्व नियम कामाचे संपुर्ण दिवसांसाठी (Work Period) काटेकोरपणे पाळणे आवश्यक आहे.
<br></br>
२२. माहिती फलक व दिशादर्शक फलकांसाठी भारतीय रस्ते परिषदेचे (Indian Roads Congress ) नियम व

मार्गदर्शक तत्त्वांची अंमलबजावणी आवश्यक आहे.
{/* <br></br>२२. काम करण्याच्या ठिकाणी कामाच्या माहितीबाबत फलक लावणेत येवून त्यामध्ये कामाचे नाव, कामाची मुदत एजन्सीचे नाव, एकूण रस्ता खोदाई करणेत येणारे अंतर, कामाचे ठिकाण, संबधित एजन्सीच्या प्रतिनिधीचे नाव व मोबाईल नंबर व त्या प्रभागातील कनिष्ठ अभियंत्याचे नाव व मोबाईल नंबर इत्यादी माहितीचा समावेश असावा. तसेच फलक प्रत्येक दिवशी काम सुरु होणाऱ्या ठिकाणी ते त्या दिवशीच्या काम पूर्ण होणाऱ्या ठिकाणी तसेच किमान ४.०० मी. अंतरावर असावा.
<br></br>२३. काम सुरु करणेपूर्वी संपूर्ण खोदाईचा बार चार्ट परवानगी धारक संस्था यांनी संबंधित कार्यकारी अभियंता (स्थापत्य) यांना सादर करावा
<br></br>२४. वहातुक पोलीस विभागाकडून परवाना घेणेत येऊन, सदर परवान्याची प्रत संबंधित कार्यकारी अभियंता (स्थापत्य) यांच्या कार्यालयाकडे सादर करणे बंधनकारक राहील.
<br></br>२५. खोदाई काम सुरु करणेपूर्वी महाराष्ट्र नॅचरल गॅस (MNGL). एम. एस. ई. बी., बी. एस. एन. एल. तसेच एम. आय. डी. सी. यांना संबंधित हीत परवाना सादर करून त्याची पोहोच संबंधित कार्यकारी अभियंता स्थापत्य विभागात देणे बंधनकारक राहील. (सदरची बाब त्यांनी त्याचे सेवा वाहिनीची खोदाई काम चालू असताना दक्षता घेणे आवश्यक आहे.)
<br></br>२६. ज्या एजन्सीला खोदाई कामाची परवानगी दिली आहे त्यांनी कामाचे फोटो व चलचित्र(Video Shooting) खोदाई काम सुरु करणे अगोदर तसेच खोदाई चालू असताना व बुजविनेनंतर काढणे आवश्यक आहे व त्याच्या प्रती स्थापत्य विभागाम काम पूर्ण झालेनंतर सादर करणे बंधनकारक राहील.
<br></br>२७.काम पूर्ण झालेनंतर परवानगी पत्राप्रमाणे काम झाल्याचा, संबधित स्थापत्य कार्यकारी अभियंता यांनी प्रमाणित केलेला दाखला नस्तीबद्ध करणे बंधकारक राहील.
<br></br>२८. दिलेल्या परवानगी व्यतिरिक्त जादा खोदाई आढळल्यास वाढीव खोदाईस दुप्पट दराने दंड आकारून त्याची वसुली करणेत येईल.
<br></br>२९. सदर रस्ता खोदाईचे काम हे वाहतूक परवान्या प्रमाणे दिलेल्या वेळेत करावे. */}
<br></br>२३. आपणास विषयांकीत ठिकाणी आपल्या मागणीनुसार व संबंधित क्षेत्रिय कार्यालयाचे कार्यकारी अभियंता यांनी
प्रस्तावित केलेनुसार भुमिगत सेवा वाहिनी टाकण्यासाठी महापालिकेच्या ताब्यात असलेल्या जागेतून खोदाई करण्याची परवानगी देण्यात येत आहे. महापालिकेच्या मालकीच्या जागेव्यतिरीक्त खाजगी जागेतून खोदाई
केल्यामुळे वाद उत्पन्न झाल्यास त्याची जबाबदारी महापालिकेची राहणार नाही.
<br></br>२४. भविष्यात मनपामार्फत ठरविणेत येणारे रस्ता खोदाई शुल्क / भाड्याबाबतचे धोरण मे. महाराष्ट्र नॅचरल गॅस लि. यांना बंधनकारक राहील.
<br></br>२५. प्रत्यक्ष काम संपल्यानंतर प्रस्तावित केलेनुसार संबंधित कंपनीने विषयांकीत काम पूर्ण केले असून त्या व्यतिरीक्त जादा मोजमापाचे काम केलेले नाही याबाबतचा दाखला संबंधित विभागाने मा. आयुक्त यांचेकडे सादर करणे
आवश्यक आहे.
<br></br>
<br></br>   मा. अति. आयुक्त - १ यांनी विषयांकित ठिकाणी रस्ते खोदाई करण्यास संदर्भिय ४ च्या प्रस्तावानुसार मान्यता दिलेली आहे. त्यानुसार मे. महामेट्रो पुणे. यांच्याकडून रितसर रस्ता खोदाई अधिभार रक्कम स्विकारून परवानगी देण्यात येत आहे.
<br></br>
<br></br>विषयांकित कामाची मुदत परवानगी पत्राच्या दिनांकापासून १५ मे २०२१ पर्यंत असून, जर सदरचे काम या मुदतीत पूर्ण न झालेस काम तत्काळ बंद करून रस्ता पूर्ववत करून रहदारीस उपलब्ध करून द्यावयाची जबाबदारी आपणावर आहे व अपूर्ण राहिलेले काम या विभागाशी पत्रव्यवहार करून फेरपरवानगी घेऊन पूर्ण करावयाचे आहे. सदरचे काम पूर्ण झालेनंतर तसे लेखी \ व \ स्वरुपात संबधित स्थापत्य विभागास कळविणेत यावे.
<br></br>
<br></br>सोबत :- विषयांकित कामाची नकाशाची प्रत
</b>
                                         </div>

                                    
                                   

                                <div className={styles.contact} style={{ marginTop: "80px" }}>
                                    
                                    <b>कार्यकारी अभियंता</b><br></br>
                                    <b>व क्षेत्रीय कार्यालय (स्थापत्य)</b><br></br>
                                    <b>पिंपरी चिंचवड महानगरपालिका</b>
                                </div>

                        <div  style={{ marginTop: "30px", }}>
                                    <b>
                                    प्रतः १) मा. सह शहर अभियंता, स्थापत्य विभाग- यांना माहितीसाठी सविनय सादर,
                                    <br></br>2) मा. कार्यकारी अभियंता - स्थापत्य ड क्षेत्रिय कार्यालय यांना माहितीसाठी व परिपत्रक क्र. स्था/श.अ/तां/२/०२/२०१०, दि.०१/०१/२०१० चे अंमलबजावणी व पुढील कार्यवाहीसाठी..
                                    <br></br>३) मा. कार्यकारी अभियंता, जलनि:सारण विभाग

                                    <br></br>४) मा. कार्यकारी अभियंता, पाणीपुरवठा विभाग

                                    <br></br>५) मा. कार्यकारी अभियंता, विद्युत विभाग

                                    <br></br>६) मा. पोलीस उप-आयुक्त, वाहतूक शाखा

                                    <br></br>७) सन्मा. नगरसदस्य श्री/सौ. ................................
                                    </b>
                                    </div>
                        </div>


                    </div>
                </div>
                </div>
            </>
        );
    }
}

export default Index;

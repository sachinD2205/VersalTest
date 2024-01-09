import { Button, Card } from "@mui/material";
import axios from "axios";
import router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import styles from "../acknowledgmentReceipt/view.module.css";
//
const Index = (props) => {
  const componentRef = useRef(null);
  const languageS = useSelector((state) => state?.labels.language);
  const [dataReservation, setDataReservation] = useState([]);
  const [dataGat, setDataGat] = useState([]);
  const [village, setDataVillage] = useState([]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    getValues,
    getFieldValue,
    formState: { errors },
  } = useFormContext();
  useEffect(() => {}, []);
  console.log("router.query11", props);
  const reservationDetailsFilter = () => {
    axios.get(`${urls.TPURL}/reservationDetail/getAll`).then((resp) => {
      setDataReservation(resp.data.reservationDetail);
      // console.log("viewEditMode11", resp.data.reservationDetail)
    });
  };
  const gatFilter = () => {
    axios.get(`${urls.TPURL}/master/mstGat/getAll`).then((resp) => {
      setDataGat(resp.data);
      // console.log("viewEditMode11", resp.data)
    });
  };
  const villageFilter = () => {
    axios.get(`${urls.TPURL}/master/village/getAll`).then((resp) => {
      setDataVillage(resp.data.village);
      console.log("viewEditMode11", resp.data.village);
    });
  };
  useEffect(() => {
    reservationDetailsFilter();
    gatFilter();
    villageFilter();
  }, []);
  console.log("21", watch("zoneId"));
  return (
    <>
      <div>
        <ComponentToPrint
          ref={componentRef}
          languageS={languageS}
          data={watch()}
          dataReservation={dataReservation}
          dataGat={dataGat}
          village={village}
        />
      </div>
      <div className={styles.btn}>
        <Button variant="contained" type="primary" onClick={handlePrint}>
          print
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Exit
        </Button>
      </div>
    </>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    // let gat = JSON.parse(this?.props?.data?.gatNo)
    let gat = this?.props?.data?.gatNo;
    // let villagearr = JSON.parse(this?.props?.data?.villageName)
    let villagearr = this?.props?.data?.villageName;
    const filteredGat = this?.props?.dataGat?.mstGat?.filter((item) =>
      gat?.includes(item?.id),
    );
    const filteredVillage = this?.props?.village.filter((item) =>
      villagearr?.includes(item?.id),
    );

    console.log("3333", this?.props?.data);
    return (
      <div className={styles.mainn}>
        {/* {console.log("sdzfsdf1",isArray(gat))}
       
        {console.log("sdzfsdf2",this.props.dataGat.mstGat)} */}
        {/* {
          this.props.dataGat.mstGat
          .find((obj)=>this.props.data.Data.gatNo.map((i)=>{i.id==obj.id}
          ).gatNameEn)
        } */}
        <div className={styles.main}>
          <Card>
            <div className={styles.smain}>
              {this.props.languageS == "en" ? (
                <div>
                  <h1 style={{ marginLeft: "90px" }}>APPENDIX-"T"</h1>
                  <h3>FORM FOR DEVELOPMENT RIGHT CERTIFICATE</h3>
                  <p style={{ marginLeft: "70px" }}>
                    <b>(Under Reg.No.11.2 of UDCPR)</b>
                  </p>
                </div>
              ) : (
                <div>
                  <h1 style={{ marginLeft: "60px" }}>
                    <b>परिशिष्ट-"टी"</b>
                  </h1>
                  <h3>
                    <b>फॉर्म फॉर डेव्हलपमेंट राइट सर्टिफिकेट</b>
                  </h3>
                  <p style={{ marginLeft: "30px" }}>
                    <b>(UDCPR च्या Reg.No.11.2 अंतर्गत)</b>
                  </p>
                </div>
              )}
            </div>

            {this.props.languageS == "en" ? (
              <div>
                <div className={styles.info}>
                  <h3>From: {this.props.data.applicantNameEn} </h3>
                  <h3>Address: {this.props.data.applicantAddressEn}</h3>
                  <h3>
                    To,<br></br>
                    The Municipal Commissioner,<br></br>
                    Pimpari-Chichwad Municipal Corporation.
                  </h3>
                  <h3>Sir/Madam, </h3>
                  <h3>
                    I/We,intend to surrender the our land of sanctioned
                    Development plan for the reservation no{" "}
                    <b>
                      {
                        this.props.dataReservation?.find(
                          (obj) => obj.id == this.props.data.reservationNo,
                        )?.landReservationNo
                      }
                    </b>
                    ,Designations <b>Garden</b>, on my/our land bearing plot
                    no/Revenue sy. no/Gat no/Khasara no{" "}
                    <b>{filteredGat?.map((item) => item?.gatNameEn + ", ")} </b>
                    of mauje{" "}
                    <b>
                      {filteredVillage?.map((item) => item?.villageName + ", ")}{" "}
                    </b>{" "}
                    under the Regulations no. 11.2 of the UDCPR.
                  </h3>
                  <h3>
                    {" "}
                    I/We, here by request that, the land affected by the
                    reservations may be taken over by the planning authority &
                    "Developments Rigths Certificate" in lieu there of may be
                    issued to me/us.
                  </h3>
                </div>
                <div
                  style={{
                    marginTop: "60px",
                    textAlign: "right",
                    marginRight: "60px",
                  }}
                >
                  <h3>Yours faithfully</h3>
                  <h3 style={{ marginTop: "30px" }}>Signiture of the Owner</h3>
                  <h3>
                    <b>{this.props.data.applicantNameEn} </b>
                  </h3>
                </div>
              </div>
            ) : (
              <div>
                <div className={styles.info}>
                  <h3>प्रेषक: {this.props.data?.Data?.applicantNameMr}</h3>
                  <h3>पत्ता: {this.props.data?.Data?.applicantAddressMr}</h3>
                  <h3>
                    प्रति,<br></br>
                    मनपा आयुक्त,<br></br>
                    पिंपरी-चिचवड महानगरपालिका.
                  </h3>
                  <h3>सर/मॅडम, </h3>
                  <h3>
                    आमची मंजूर विकासाची जमीन सरेंडर करण्याचा मानस आहे आरक्षण
                    क्रमांक GRD65566, पदनाम उद्यानासाठी योजना, माझ्या/आमच्या
                    जमिनीवर आधारित भूखंड क्रमांक/महसूल sy वर. क्रमांक/गट
                    क्रमांक/खसारा क्रमांक १२ मौजे गावातील, UDCPR चे विनियम क्र.
                    11.2.
                  </h3>
                  <h3>
                    मी/आम्ही येथे विनंती करतो की, आरक्षणामुळे बाधित जमीन घेतली
                    जाऊ शकते त्याऐवजी नियोजन प्राधिकरण आणि "विकास अधिकार
                    प्रमाणपत्र" द्वारे मला/आम्हाला जारी केली जावी.
                  </h3>
                </div>
                <div
                  style={{
                    marginTop: "60px",
                    textAlign: "right",
                    marginRight: "60px",
                  }}
                >
                  <h3>तुमचा विश्वासू</h3>
                  <h3 style={{ marginTop: "30px" }}>मालकाची स्वाक्षरी</h3>
                  <h3>
                    <b>हर्षल पाटील</b>
                  </h3>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }
}

export default Index;

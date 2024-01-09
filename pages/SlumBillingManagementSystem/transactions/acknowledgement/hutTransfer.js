import React, { useEffect, useRef, useState } from "react";
import styles from "./acknowledgement.module.css";
import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { Button, Card } from "@mui/material";
import urls from "../../../../URLS/urls";
import axios from "axios";
import moment from "moment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";

const Index = () => {
  const componentRef = useRef(null);
  const router = useRouter();
  const logedInUser = localStorage.getItem("loggedInUser");
  let user = useSelector((state) => state.user.user);
  const [data, setData] = useState(null);
  const [selectedHutData, setSelectedHutData] = useState(null);
  const [hutOwnerData, setHutOwnerData] = useState(null);
  const [slumData, setSlumData] = useState({});
  const [areaData, setAreaData] = useState({});
  const [zoneData, setZoneData] = useState({});
  const [villageData, setVillageData] = useState({});
  const [cityData, setCityData] = useState({});
  const language = useSelector((store) => store.labels.language);
  const [isLoading, setIsLoading] = useState(false);
  const headers = { Authorization: `Bearer ${user?.token}` };
  const cityDropDown = [
    {
      id: 1,
      cityEn: "Pimpri",
      cityMr: "पिंपरी",
    },
    {
      id: 2,
      cityEn: "Chinchwad",
      cityMr: "चिंचवड",
    },
    {
      id: 3,
      cityEn: "Bhosari",
      cityMr: "भोसरी",
    },
  ];
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  let loggedInUser = localStorage.getItem("loggedInUser");
  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language === "en"
        ? "Hut Transfer Acknowldgement"
        : "झोपडी हस्तांतरण पोचपावती",
  });

  useEffect(() => {
    if (data?.hutKey != null) {
      getHutData();
    }
  }, [data]);

  useEffect(() => {
    if(selectedHutData!=null){
    getSlumData(selectedHutData?.slumKey);
    getAreaData(selectedHutData?.areaKey);
    getZoneData(selectedHutData?.zoneKey);
    getVillageData(selectedHutData?.villageKey);
    getCityData(selectedHutData?.cityKey);
    }
  }, [selectedHutData]);

  const getSlumData = (slumKey) => {
    axios
      .get(`${urls.SLUMURL}/mstSlum/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstSlumList;
        let slum = result && result.find((each) => each.id == slumKey);
        setSlumData(slum);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getAreaData = (areaKey) => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.area;
        let area = result && result.find((each) => each.id == areaKey);
        setAreaData(area);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
      });
  };

  const getZoneData = (zoneKey) => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let result = res.data.zone;
        let zone = result && result.find((each) => each.id == zoneKey);
        setZoneData(zone);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
      });
  };

  const getVillageData = (villageKey) => {
    axios
      .get(`${urls.SLUMURL}/master/village/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.village;
        let village = result && result.find((each) => each.id == villageKey);
        setVillageData(village);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getCityData = (cityKey) => {
    let city = cityDropDown && cityDropDown.find((city) => city.id == cityKey);
    setCityData(city);
  };

  const getHutData = () => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getById?id=${data?.hutKey}`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data;
        // let selectedHut = result && result.find((obj) => obj.id == selectedId);
        let hutOwner =
          result &&
          result.mstHutMembersList.find((obj) => obj.headOfFamily === "Yes");
        setHutOwnerData(hutOwner);
        setSelectedHutData(result);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (router.query.id != undefined && router.query.id != null) {
      setIsLoading(true);
      axios
        .get(
          `${urls.SLUMURL}/trnTransferHut/search/applicationNumber?applicationNumber=${router.query.id}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setIsLoading(false);
          setData(r.data);
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  }, [router.query.id]);

;

  return (
    <>
      {isLoading && <CommonLoader />}
      <div>
        <ComponentToPrint
          data={data}
          language={language}
          slumData={slumData}
          areaData={areaData}
          zoneData={zoneData}
          villageData={villageData}
          cityData={cityData}
          ref={componentRef}
          selectedHutData={selectedHutData}
          hutOwnerData={hutOwnerData}
        />
      </div>
      <div className={styles.btn} style={{ margin: "10px" }}>
      <Button
          type="primary"
          size="small"
          variant="contained"
          color="error"
          onClick={() => {
            if(loggedInUser==='citizenUser'){
              router.push("/dashboard");
            }else if(loggedInUser==='cfcUser'){
              router.push("/CFC_Dashboard");
            }
          }}
        >
          <FormattedLabel id="exit" />
        </Button>
        <Button
          variant="contained"
          type="primary"
          color="primary"
          size="small"
          onClick={handlePrint}
        >
          <FormattedLabel id="print" />
        </Button>
        
      </div>
    </>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className={styles.mainn}>
        <div className={styles.main}>
          <div className={styles.one}>
            <div className={styles.logo}>
              <div>
                <img src="/logo.png" alt="" height="100vh" width="100vw" />
              </div>
            </div>
            <div
              className={styles.middle}
              styles={{ paddingTop: "15vh", marginTop: "20vh" }}
            >
              <h1>
                <b>
                  <FormattedLabel id="pimpariChinchwadMaha" />
                </b>
              </h1>
            </div>
            <div className={styles.logo1}>
              <img
                src="/smartCityPCMC.png"
                alt=""
                height="100vh"
                width="100vw"
              />
            </div>
          </div>
          <div>
            <h2 className={styles.heading}>
              <b>
                <FormattedLabel id="appAcknowldgement" />
              </b>
            </h2>
          </div>
          <div>
            <Card>
              <div className={styles.info}>
                <h3>
                  <FormattedLabel id="ackDear" />,{" "}
                  {this.props.language === "en" && (
                    <b>
                      {this?.props?.data?.proposedOwnerFirstName +
                        " " +
                        this?.props?.data?.proposedOwnerMiddleName +
                        " " +
                        this?.props?.data?.proposedOwnerLastName}
                    </b>
                  )}
                  {this.props.language === "mr" && (
                    <b>
                      {this?.props?.data?.proposedOwnerFirstNameMr +
                        " " +
                        this?.props?.data?.proposedOwnerMiddleNameMr +
                        " " +
                        this?.props?.data?.proposedOwnerLastNameMr}
                    </b>
                  )}
                </h3>
                <h3>
                  <FormattedLabel id="ackpcmcthanku" />
                </h3>
                <h3>
                  <FormattedLabel id="ackHutTransferShortDesc" />
                </h3>
              </div>
            </Card>

            <div>
              <h2 className={styles.heading}>
                <FormattedLabel id="ackApplicationSummery" />
              </h2>
            </div>
            <Card>
              <div className={styles.summ}>
                <div>
                  <div className={styles.labelValue}>
                    <h3 className={styles.label}>
                      <b>
                        <FormattedLabel id="applicationNo" />:
                      </b>
                    </h3>
                    <h3 className={styles.value}>
                      {this?.props?.data?.applicationNo}
                    </h3>
                  </div>
                  {this?.props?.data?.acknowledgementNo !== null && (
                    <div className={styles.labelValue}>
                      <h3 className={styles.label}>
                        <b>
                          <FormattedLabel id="acknowledgementNo" />:
                        </b>
                      </h3>
                      <h3 className={styles.value}>
                        {this?.props?.data?.acknowledgementNo}
                      </h3>
                    </div>
                  )}
                  <div className={styles.labelValue}>
                    <h3 className={styles.label}>
                      <b>
                        <FormattedLabel id="applicantName" />:
                      </b>
                    </h3>
                    <h3 className={styles.value}>
                      {this.props.language === "en" && (
                        <b>
                          {this?.props?.data?.proposedOwnerFirstName +
                            " " +
                            this?.props?.data?.proposedOwnerMiddleName +
                            " " +
                            this?.props?.data?.proposedOwnerLastName}
                        </b>
                      )}
                      {this.props.language === "mr" && (
                        <b>
                          {this?.props?.data?.proposedOwnerFirstNameMr +
                            " " +
                            this?.props?.data?.proposedOwnerMiddleNameMr +
                            " " +
                            this?.props?.data?.proposedOwnerLastNameMr}
                        </b>
                      )}
                    </h3>
                  </div>
                  <div className={styles.labelValue}>
                    <h3 className={styles.label}>
                      <b>
                        <FormattedLabel id="dateofApplication" />:
                      </b>
                    </h3>
                    <h3 className={styles.value}>
                      {moment(this?.props?.data?.applicationDate).format(
                        "DD-MM-YYYY"
                      )}
                    </h3>
                  </div>
                  <div className={`${styles.labelValue} ${styles.address}`}>
                    <h3 className={styles.label}>
                      <b>
                        <FormattedLabel id="address" />:
                      </b>
                    </h3>
                    <div className={styles.value}>
                      {this.props.language === "en" && (
                        <h3>
                          {`${this?.props?.slumData?.slumName}, 
                        ${this?.props?.areaData?.areaName}, 
                        ${this?.props?.zoneData?.zoneName}, 
                        ${this?.props?.villageData?.villageName}, 
                        `}{" "}
                        </h3>
                      )}
                      {this.props.language === "mr" && (
                        <h3>
                          {`${this?.props?.slumData?.slumNameMr}, 
                        ${this?.props?.areaData?.areaNameMr}, 
                        ${this?.props?.zoneData?.zoneNameMr}, 
                        ${this?.props?.villageData?.villageNameMr}, 
                        `}{" "}
                        </h3>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <div className={styles.query}>
              <h4>
                <FormattedLabel id="ackplzContactNearestOperator" />
              </h4>
            </div>

            <div className={styles.foot}>
              <div className={styles.add}>
                <h5>
                  <FormattedLabel id="pimpariChinchwadMaha" />
                </h5>
                <h5>
                  {" "}
                  <FormattedLabel id="ackpcmcAddress" />
                </h5>
              </div>
              <div className={styles.add1}>
                <h5>
                  <FormattedLabel id="ackPcmcphNo" />
                </h5>
              </div>
              <div className={styles.foot}>
                <div
                  className={styles.logo1}
                  style={{
                    marginLeft: "5vh",
                  }}
                >
                  <img
                    src="/slumqrcode.png"
                    alt=""
                    height="100vh"
                    width="100vw"
                  />
                </div>
                <div
                  className={styles.logo1}
                  style={{
                    marginLeft: "5vh",
                    marginRight: "5vh",
                  }}
                >
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;

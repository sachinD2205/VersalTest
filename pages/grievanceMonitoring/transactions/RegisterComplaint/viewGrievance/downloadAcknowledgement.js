import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {  Button,  Card } from "@mui/material";
import axios from "axios";
import moment from "moment";
import router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import sweetAlert from "sweetalert";
import urls from "../../../../../URLS/urls";
import styles from "../viewGrievance/acknowledgement.module.css";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../util/commonErrorUtil";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";

// ToPrin
const ToPrint = () => {
  const {
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(),
  });
  const logedInUser = localStorage.getItem("loggedInUser");
  const [villages, setVillages] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [allWards, setAllWards] = useState([]);
  const language = useSelector((state) => state?.labels?.language);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const componentRef = useRef(null);
  let user = useSelector((state) => state.user.user);
  const headers ={ Authorization: `Bearer ${user?.token}` };
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language == "en" ? "Grievane Acknowledgement" : '"तक्रारीची पावती"',
  });

  // getAllZones
  const getAllZones = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`, {
      headers: headers,
    }).then((res) => {
      setAllZones(
        res?.data?.zone?.map((r, i) => ({
          id: r.id,
          zoneName: r.zoneName,
          zoneNameMr: r.zoneNameMr,
        }))
      );
    }).catch((err)=>{
      cfcErrorCatchMethod(err,true);
    });
  };

  // getAllWards
  const getAllWards = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`, {
      headers: headers,
    }).then((res) => {
      setAllWards(
        res?.data?.ward?.map((r, i) => ({
          id: r.id,
          wardName: r.wardName,
          wardNameMr: r.wardNameMr,
        }))
      );
    }).catch((err)=>{
      cfcErrorCatchMethod(err,true);
    });
  };

  // getVillages
  const getVillages = () => {
    axios.get(`${urls.CFCURL}/master/village/getAll`, {
      headers: headers,
    }).then((res) => {
      setVillages(
        res?.data?.village?.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          villageNameEn: r.villageName,
          villageNameMr: r.villageNameMr,
        }))
      );
    }).catch((err)=>{
      cfcErrorCatchMethod(err,true);
    });
  };

  // getAllAmenities
  const getAllAmenities = () => {
    setIsLoading(true);
    axios
      .get(
        `${
          urls.GM
        }/trnRegisterComplaint/getByApplicationId?applicationNo=${router?.query?.id?.replaceAll(
          "+",
          "%2b"
        )}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        if (res?.status === 200 || res?.status === 201) {
          let result = res?.data;
          setData(result);
          setValue(
            "grievanceRaiseDate",logedInUser==='departmentUser'?
            moment(result.createDtTm).format("DD-MM-YYYY HH:mm:ss"):
            moment(result.createDtTm).format("DD-MM-YYYY")
          );
          setValue("grievanceId", result.applicationNo);
          setValue(
            "fullName",
            result.firstName + " " + result.middleName + " " + result.surname
          );
          setValue("complaintStatusText", result.complaintStatusText);
          setValue("deptName", result.deptName);
          setValue("subDepartmentText", result.subDepartmentText);
          setValue("complaintType", result.complaintType);
          setValue("complaintSubType", result.complaintSubType);
          setValue("board", result.location);
          setValue("subject", result.subject);
          setValue("complaintDescription", result.complaintDescription);
          setValue("complaintDescription", result?.complaintDescription);
          setValue("officeLocation", result?.officeLocation);
          setValue("zoneKey", result?.zoneKey);
          setValue("wardKey", result?.wardKey);
          setValue("subject", result?.subject);
          setValue("subjectMr", result?.subjectMr ? result?.subjectMr : "");
          setValue(
            "complaintDescriptionMr",
            result?.complaintDescriptionMr ? result?.complaintDescriptionMr : ""
          );
          setValue("villageKey", result?.villageKey);
          setValue("uploadedDocumentAll", result?.trnAttacheDocumentDtos);
        } else {
          sweetAlert(
            language == "en" ? "Something Went Wrong!" : "काहीतरी चूक झाली!",
            { button: language == "en" ? "Ok" : "ठीक आहे" }
          );
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err,false);
      });
  };

  useEffect(() => {
    getAllZones();
    getAllWards();
    getVillages();
  }, []);

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined)
      getAllAmenities();
  }, [villages, allZones, allWards, router.query.id]);

  // view
  return (
    <>
      {isLoading && <CommonLoader />}
     <div>
        <ComponentToPrint data={data} ref={componentRef} language={language} logedInUser={logedInUser} />
      </div>
      <div className={styles.btn}>
        <Button
          type="button"
          variant="contained"
          color="error"
          startIcon={<ArrowBackIcon />}
          size="small"
          onClick={() => {
            {
              logedInUser === "departmentUser" &&
                router.push({
                  pathname: "/grievanceMonitoring/dashboards/deptUserDashboard",
                });
            }
            {
              logedInUser === "citizenUser" &&
                router.push({
                  pathname:
                    "/grievanceMonitoring/dashboards/citizenUserDashboard",
                });
            }
            {
              logedInUser === "cfcUser" &&
                router.push({
                  pathname: "/grievanceMonitoring/dashboards/cfcUserDashboard",
                });
            }
          }}
        >
          <FormattedLabel id="backToDashboard" />
        </Button>
        <Button variant="contained" type="primary" onClick={handleToPrint}>
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
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </div>
            </div>
            <div
              className={styles.one}
              styles={{
                paddingTop: "15vh",
                marginTop: "20vh",
                display: "flex",
              }}
            >
              <h1>
                <b>
                  <FormattedLabel id="pimpariChinchwadMaha" />
                </b>
              </h1>
            </div>
            <div className={styles.logo1}>
              <img src="/logo.png" alt="" height="100vh" width="100vw" />
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
                  <FormattedLabel id="ackDear1" />
                </h3>
                <h3>
                  <b>
                    {this?.props?.language == "en"
                      ? `${this?.props?.data?.firstName} ${this?.props?.data?.middleName} ${this?.props?.data?.surname}`
                      : `${this?.props?.data?.firstNameMr} ${this?.props?.data?.middleNameMr} ${this?.props?.data?.surnameMr}`}{" "}
                  </b>
                </h3>
                <h3>
                  <FormattedLabel id="ackpcmcthanku" />
                </h3>
                <h3>
                  <FormattedLabel id="ackshortDesc" />
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
                      <FormattedLabel id="applicationNo" />:
                    </h3>
                    <h3 className={styles.value}>
                      {this?.props?.data?.applicationNo}
                    </h3>
                  </div>
                  <div className={styles.labelValue}>
                    <h3 className={styles.label}>
                      <FormattedLabel id="applicantName" />:
                    </h3>
                    <h3 className={styles.value}>
                      <b>
                        {this?.props?.language == "en"
                          ? `${this?.props?.data?.firstName} ${this?.props?.data?.middleName} ${this?.props?.data?.surname}`
                          : `${this?.props?.data?.firstNameMr} ${this?.props?.data?.middleNameMr} ${this?.props?.data?.surnameMr}`}{" "}
                      </b>
                    </h3>
                  </div>
                  <div className={styles.labelValue}>
                    <h3 className={styles.labelAddress}>
                      <FormattedLabel id="dateofApplication" />:
                    </h3>
                    <h3 className={styles.value}>
                      {this.props?.logedInUser  ==='departmentUser'? moment(this?.props?.data?.createDtTm).format(
                        "DD-MM-YYYY HH:mm:ss"
                      ):
                      moment(this?.props?.data?.createDtTm).format(
                        "DD-MM-YYYY"
                      )}
                    </h3>
                  </div>
                  <div className={`${styles.labelValue} ${styles.address}`}>
                    <h3 className={styles.labelAddress}>
                      <FormattedLabel id="address" />:
                    </h3>
                    <div className={styles.value}>
                      {this.props.language === "en" && (
                        <h3>
                          {this?.props?.data?.houseNo}
                          {", "}
                          {this?.props?.data?.buildingNo}
                          {", "}
                          {this?.props?.data?.roadName}
                          {", "}
                          {this?.props?.data?.area}
                          {", "}
                          {this?.props?.data?.location}
                          {", "}
                          {this?.props?.data?.city}
                          {", "}
                          {this?.props?.data?.pincode}
                        </h3>
                      )}
                      {this.props.language === "mr" && (
                        <h3>
                          {this?.props?.data?.houseNoMr}
                          {", "}
                          {this?.props?.data?.buildingNoMr}
                          {", "}
                          {this?.props?.data?.roadNameMr}
                          {", "}
                          {this?.props?.data?.areaMr}
                          {", "}
                          {this?.props?.data?.locationMr}
                          {", "}
                          {this?.props?.data?.cityMr}
                          {", "}
                          {this?.props?.data?.pincode}
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
                  {" "}
                  <FormattedLabel id="ackpcmcAddress" />
                </h5>
              </div>
              <div className={styles.add1}>
                <h5>
                  <FormattedLabel id="ackPcmcphNo" />
                </h5>
              </div>
              <div
                className={styles.logo1}
                style={{
                  marginLeft: "5vh",
                }}
              >
                <img src="/gmqrcode.png" alt="" height="100vh" width="100vw" />
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
    );
  }
}
export default ToPrint;

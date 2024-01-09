import React, { useEffect, useRef, useState } from "react";
import styles from "./acknowledgement.module.css";
import router, { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { Button, Card } from "@mui/material";
import urls from "../../../URLS/urls";
import axios from "axios";
import moment from "moment";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import commonStyles from "../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../util/commonErrorUtil";

const Index = () => {
  const router = useRouter();
  const logedInUser = localStorage.getItem("loggedInUser");
  let user = useSelector((state) => state.user.user);

  const [data, setData] = useState(null);
  const componentRef = useRef(null);
  const language = useSelector((state) => state.labels.language);

  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);

  const headers = { Authorization: `Bearer ${user?.token}` };

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

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
    documentTitle: "new document",
  });

  useEffect(() => {
    if (
      router.query.id != null &&
      router.query.id != undefined &&
      router.query.id != ""
    ) {
      callApiOnApplicationNo();
    }
  }, [router.query.id]);

  useEffect(() => {
    getAllMainSchemes();
    getAllSubSchemes();
  }, []);

  const getAllMainSchemes = () => {
    axios
      .get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
        headers: headers,
      })
      .then(async (r) => {
        let result = r.data.mstMainSchemesList;

        let _res =
          result &&
          result.map((r, i) => {
            return {
              id: r.id,
              schemeName: r.schemeName ? r.schemeName : "-",
            };
          });
        // mainschemeList = _res;
        setMainNames([..._res]);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getAllSubSchemes = () => {
    axios
      .get(`${urls.BSUPURL}/mstSubSchemes/getAll`, {
        headers: headers,
      })
      .then(async (r) => {
        let result = r.data.mstSubSchemesList;
        let _res =
          result &&
          result.map((r, i) => {
            return {
              id: r.id,
              subSchemeName: r.subSchemeName ? r.subSchemeName : "-",
            };
          });
        // subschemeList = _res;
        await setSubSchemeNames(_res);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const callApiOnApplicationNo = () => {
    if (router.query.trn == "R") {
      axios
        .get(
          `${urls.BSUPURL}/trnBachatgatRegistration/getByApplicationNo?applicationNo=${router.query.id}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          //   debugger;
          let scheme =
            mainNames &&
            mainNames.find((obj) => obj.id == r.data.mainSchemeKey);
          setData({ ...r.data, scheme: scheme });
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else if (router.query.trn == "C") {
      axios
        .get(
          `${urls.BSUPURL}/trnBachatgatCancellation/getByApplicationNo?applicationNo=${router.query.id}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setData(r.data);
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else if (router.query.trn == "N") {
      axios
        .get(
          `${urls.BSUPURL}/trnSchemeApplicationNew/getByApplicationNo?applicationNo=${router.query.id}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setData(r.data);
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else if (router.query.trn == "M") {
      axios
        .get(
          `${urls.BSUPURL}/trnBachatgatRegistration/getByApplicationNo?applicationNo=${router.query.id}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setData(r.data);
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else if (router.query.trn == "BRN") {
      axios
        .get(
          `${urls.BSUPURL}/trnBachatgatRenewal/getByApplicationNo?applicationNo=${router.query.id}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setData(r.data);
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else if (router.query.trn == "NR") {
      axios
        .get(
          `${urls.BSUPURL}/trnSchemeApplicationRenewal/getByApplicationNo?applicationNo=${router.query.id}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setData(r.data);
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  return (
    <>
      <div>
        <ComponentToPrint
          data={data}
          logedInUser={logedInUser}
          user={user}
          language={language}
          ref={componentRef}
        />
      </div>
      <div className={styles.btn}>
        <Button
          type="primary"
          variant="contained"
          // className={commonStyles.buttonExit}
          color="error"
          size="small"
          onClick={() => {
            // if (router.query.trn == "R") {
            //   router.push("/BsupNagarvasthi/transaction/bachatgatRegistration");
            // } else if (router.query.trn == "C") {
            //   router.push("/BsupNagarvasthi/transaction/bachatGatCancellation");
            // } else if (router.query.trn == "N") {
            //   router.push(
            //     "/BsupNagarvasthi/transaction/newApplicationScheme/list"
            //   );
            // } else if (router.query.trn == "M") {
            //   router.push("/BsupNagarvasthi/transaction/bachatgatModification");
            // } else if (router.query.trn == "BRN") {
            //   router.push("/BsupNagarvasthi/transaction/bachatgatRenewal");
            // } else if (router.query.trn == "NR") {
            //   router.push(
            //     "/BsupNagarvasthi/transaction/schemeApplicationRenewal"
            //   );
            // }
            router.push("/dashboard");
          }}
        >
          <FormattedLabel id="exit" />
        </Button>
        <Button
          variant="contained"
          // className={commonStyles.buttonPrint}
          type="primary"
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
  state = {
    zoneNames: [],
    wardNames: [],
    schemeNames: [],
    subSchemeNames: [],
    user: {},
  };

  componentDidMount() {
    this.getZoneName();
    this.getWardNames();
    this.getAllMainSchemes();
    this.getAllSubSchemes();
  }

  getZoneName = () => {
    const { logedInUser, user } = this.props;

    const headers = { Authorization: `Bearer ${this.props.user?.token}` };
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((r) => {
        this.setState({
          zoneNames: r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          })),
        });
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  getWardNames = () => {
    const { logedInUser, user } = this.props;

    const headers = { Authorization: `Bearer ${this.props.user?.token}` };
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: headers,
      })
      .then((r) => {
        this.setState({
          wardNames: r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          })),
        });
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  getAllMainSchemes = () => {
    const { logedInUser, user } = this.props;

    const headers = { Authorization: `Bearer ${this.props.user?.token}` };

    axios
      .get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
        headers: headers,
      })
      .then(async (response) => {
        this.setState({
          schemeNames: response.data.mstMainSchemesList.map((item) => ({
            id: item.id,
            schemeName: item.schemeName,
          })),
        });
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  getAllSubSchemes = (_pageSize = 10, _pageNo = 0) => {
    const { logedInUser, user } = this.props;

    const headers = { Authorization: `Bearer ${this.props.user?.token}` };

    axios
      .get(`${urls.BSUPURL}/mstSubSchemes/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: null,
        },
        headers: headers,
      })
      .then(async (response) => {
        this.setState({
          subSchemeNames: response.data.mstSubSchemesList.map((item) => ({
            id: item.id,
            subSchemeName: item.subSchemeName ? item.subSchemeName : "-",
          })),
        });
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };
  render() {
    const { zoneNames, wardNames, schemeNames, subSchemeNames } = this.state;
    const { data } = this.props;
    console.log("data ", data);
    const zoneName = zoneNames.find(
      (zone) => zone.id === data?.zoneKey
    )?.zoneName;
    const wardName = wardNames.find(
      (ward) => ward.id === data?.wardKey
    )?.wardName;
    const schemeName = schemeNames.find(
      (scheme) => scheme.id === data?.mainSchemeKey
    )?.schemeName;

    const subSchemeName = subSchemeNames.find(
      (subScheme) => subScheme.id === data?.subSchemeKey
    )?.subSchemeName;

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
                  <b>
                    {this.props?.language === "en" &&
                      this?.props?.data?.applicantFirstName +
                        " " +
                        this?.props?.data?.applicantMiddleName +
                        " " +
                        this?.props?.data?.applicantLastName}
                    {this.props?.language === "mr" &&
                      this?.props?.data?.applicantFirstNameMr +
                        " " +
                        this?.props?.data?.applicantMiddleNameMr +
                        " " +
                        this?.props?.data?.applicantLastNameMr}
                  </b>
                </h3>
                <h3>
                  <FormattedLabel id="ackpcmcthanku" />
                </h3>
                <h3>
                  <FormattedLabel id="ackshortDesc1" />
                  {router.query.trn == "R" && (
                    <FormattedLabel id="ackshortDesc2" />
                  )}

                  {router.query.trn == "C" && (
                    <FormattedLabel id="bachatgatCancellation" />
                  )}

                  {router.query.trn == "N" && (
                    <FormattedLabel id="titleNewApplicationSchemes" />
                  )}

                  {router.query.trn == "M" && (
                    <FormattedLabel id="bachatgatModification" />
                  )}
                  {router.query.trn == "BRN" && (
                    <FormattedLabel id="bachatgatrenewal" />
                  )}

                  {router.query.trn == "NR" && (
                    <FormattedLabel id="titleSchemeApplicationRenewal" />
                  )}

                  <FormattedLabel id="ackshortDesc3" />
                </h3>
              </div>
            </Card>

            <div>
              <h2 className={styles.heading}>
                <FormattedLabel id="ackApplicationSummery" />
              </h2>
            </div>
            <Card>
              {/* <h2 className={styles.summary}>Application Summary</h2> */}
              <div className={styles.summ}>
                <div className={styles.roww}>
                  <div className={styles.labelValue}>
                    <h3 className={styles.label}>
                      <FormattedLabel id="applicationNo" />:
                    </h3>
                    <h3 className={styles.value}>
                      {this?.props?.data?.applicationNo}
                    </h3>
                  </div>

                  {(router.query.trn == "N" || router.query.trn == "RN") && (
                    <div className={styles.labelValue}>
                      <h3 className={styles.label}>
                        <FormattedLabel id="schemeNameT" />:
                      </h3>
                      <h3 className={styles.value}>
                        {schemeName === undefined ? "-" : schemeName}
                      </h3>
                    </div>
                  )}

                  {(router.query.trn == "N" || router.query.trn == "RN") && (
                    <div className={styles.labelValue}>
                      <h3 className={styles.label}>
                        <FormattedLabel id="subSchemeNameT" />:
                      </h3>
                      <h3 className={styles.value}>
                        {subSchemeName === undefined ? "-" : subSchemeName}
                      </h3>
                    </div>
                  )}

                  {(router.query.trn == "N" || router.query.trn == "RN") && (
                    <div className={styles.labelValue}>
                      <h3 className={styles.label}>
                        <FormattedLabel id="aadharNo" />:
                      </h3>
                      <h3 className={styles.value}>
                        {this?.props?.data?.applicantAadharNo}
                      </h3>
                    </div>
                  )}

                  {(router.query.trn == "N" || router.query.trn == "RN") && (
                    <div className={styles.labelValue}>
                      <h3 className={styles.label}>
                        <FormattedLabel id="mobile" />:
                      </h3>
                      <h3 className={styles.value}>
                        {this?.props?.data?.mobileNo}
                      </h3>
                    </div>
                  )}

                  <div className={styles.labelValue}>
                    <h3 className={styles.label}>
                      <FormattedLabel id="applicantName" />:
                    </h3>
                    <h3 className={styles.value}>
                      {this.props?.language === "en" &&
                        this?.props?.data?.applicantFirstName +
                          " " +
                          this?.props?.data?.applicantMiddleName +
                          " " +
                          this?.props?.data?.applicantLastName}
                      {this.props?.language === "mr" &&
                        this?.props?.data?.applicantFirstNameMr +
                          " " +
                          this?.props?.data?.applicantMiddleNameMr +
                          " " +
                          this?.props?.data?.applicantLastNameMr}
                    </h3>
                  </div>
                  {router.query.trn == "R" && (
                    <>
                      {" "}
                      <div className={styles.labelValue}>
                        <h3 className={styles.label}>
                          <FormattedLabel id="presidentName" />:
                        </h3>
                        <h3 className={styles.value}>
                           { this?.props?.data?.presidentFirstName +
                              " " +
                              this?.props?.data?.presidentMiddleName +
                              " " +
                              this?.props?.data?.presidentLastName}
                        </h3>
                      </div>
                      <div className={styles.labelValue}>
                        <h3 className={styles.label}>
                          <FormattedLabel id="bachatgatName" />:
                        </h3>
                        <h3 className={styles.value}>
                          {
                            this?.props?.data?.bachatgatName}
                        </h3>
                      </div>
                    </>
                  )}

                  <div className={styles.labelValue}>
                    <h3 className={styles.label}>
                      <FormattedLabel id="zoneNames" />:
                    </h3>
                    <h3 className={styles.value}>{zoneName}</h3>
                  </div>

                  <div className={styles.labelValue}>
                    <h3 className={styles.label}>
                      <FormattedLabel id="wardname" />:
                    </h3>
                    <h3 className={styles.value}>{wardName}</h3>
                  </div>

                  <div className={styles.labelValue}>
                    <h3 className={styles.label}>
                      <FormattedLabel id="dateofApplication" />:
                    </h3>
                    <h3
                      className={styles.value}
                      // style={{
                      //   marginTop: "1rem",
                      // }}
                    >
                      {moment(this?.props?.data?.createDtTm).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )}
                    </h3>
                  </div>

                  <div className={styles.labelValue}>
                    <h3 className={styles.label}>
                      <FormattedLabel id="address" />:
                    </h3>
                    <h3 className={styles.value}>
                      {this?.props?.data?.flatBuldingNo} {", "}
                      {this?.props?.data?.buildingName} {", "}
                      {this?.props?.data?.roadName} {"," }{" "}
                      {this?.props?.data?.landmark} {"."}
                    </h3>
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
              <div
                className={styles.logo1}
                style={{
                  marginLeft: "5vh",
                }}
              >
                <img
                  src="/bsupqrcode.png"
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
    );
  }
}

export default Index;

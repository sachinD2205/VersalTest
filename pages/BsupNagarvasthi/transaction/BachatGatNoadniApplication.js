import React, { useEffect, useRef, useState } from "react";
import styles from "./bachatgatnodani.module.css";
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

const Index = ({ dataAbc, onClose }) => {
  console.log("dataAbc", dataAbc);

  const router = useRouter();
  const logedInUser = localStorage.getItem("loggedInUser");
  let user = useSelector((state) => state.user.user);

  const [data, setData] = useState(null);
  const componentRef = useRef(null);
  const language = useSelector((state) => state.labels.language);

  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [tableData, setTableData] = useState([]);

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

  useEffect(() => {
    let sortedData = dataAbc?.trnBachatgatRegistrationMembersList?.map(
      (data, index) => {
        return {
          srNo: index + 1,
          ...data,
        };
      }
    );

    console.log("withSrDaywiseData", sortedData);

    setTableData(sortedData);
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      onClose();
    },
    onAfterPrint: () => {
      onClose();
    },
    documentTitle: "new document",
  });

  useEffect(() => {
    handlePrint();
  }, []);

  return (
    <>
      {console.log("tableData_", tableData)}
      <div>
        <ComponentToPrint
          data={dataAbc}
          logedInUser={logedInUser}
          tableData={tableData}
          user={user}
          language={language}
          ref={componentRef}
        />
      </div>
      <div className={styles.btn}>
        <Button
          type="primary"
          variant="contained"
          color="error"
          size="small"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          <FormattedLabel id="exit" />
        </Button>
        <Button
          variant="contained"
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
      });
  };
  render() {
    let language = this?.props?.language;
    const { zoneNames, wardNames, schemeNames, subSchemeNames } = this.state;
    const { data } = this.props;
    console.log("data ", data);
    let sortedData = data.trnBachatgatRegistrationMembersList?.map(
      (data, index) => {
        return {
          srNo: index + 1,
          ...data,
        };
      }
    );
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
          <div className={styles.logo}>
            <div styles={{ paddingBottom: "15vh", marginbottom: "10vh" }}>
              <img src="/logo.png" alt="" height="100vh" width="100vw" />
            </div>
          </div>
          <div className={styles.one}>
            <div
              className={styles.middle}
              styles={{ paddingTop: "15vh", marginTop: "10vh" }}
            >
              <h4 className={styles.titleText}>
                <b>पिंपरी चिंचवड महानगरपालिका</b>
              </h4>
              <h4 className={styles.titleText}>
                <b>समाज विकास विभाग</b>
              </h4>
              <h4 className={styles.titleTextUndrLine}>
                <b>" महिला व बालकल्याण योजना "</b>
              </h4>
              <h4 className={styles.titleTextUndrLine}>
                <b>महिला बचत गटाची नोंदणी करणेबाबत अर्जाचा नमुना</b>
              </h4>
            </div>
          </div>
          <div>
            <Card>
              <div className={styles.info}>
                <h4>प्रति,</h4>
                <h5>मा. उप.आयुक्त,</h5>
                <h5>समाज विकास विभाग</h5>
              </div>
            </Card>
            <Card>
              <div className={styles.summ}>
                <div className={styles.roww}>
                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>1. बचतगटाचे संपूर्ण नाव</h5>
                    <h5 className={styles.dash}>:-</h5>
                    <h5 className={styles.value}>
                      {this?.props?.data?.bachatgatName}
                    </h5>
                  </div>

                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>2. बचत गटाचा संपूर्ण पत्ता</h5>
                    <h5 className={styles.dash}>:-</h5>
                    <h5 className={styles.value}>
                      {this?.props?.data?.flatBuldingNo} {","}{" "}
                      {this?.props?.data?.buildingName} {","}{" "}
                      {this?.props?.data?.roadName} {","}{" "}
                      {this?.props?.data?.landmark} {"."}
                    </h5>
                  </div>

                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>3. बचत गट अध्यक्षांचे नाव</h5>
                    <h5 className={styles.dash}>:-</h5>
                    <h5 className={styles.value}>
                      {this.props?.language === "en" &&
                        this?.props?.data?.presidentFirstName +
                          " " +
                          this?.props?.data?.presidentMiddleName +
                          " " +
                          this?.props?.data?.presidentLastName}
                      {this.props?.language === "mr" &&
                        this?.props?.data?.presidentFirstNameMr +
                          " " +
                          this?.props?.data?.presidentMiddleNameMr +
                          " " +
                          this?.props?.data?.presidentLastNameMr}
                    </h5>
                  </div>

                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>4. पत्ता</h5>
                    <h5 className={styles.dash}>:-</h5>
                    <h5 className={styles.value}>
                      {this?.props?.data?.flatBuldingNo} {","}{" "}
                      {this?.props?.data?.buildingName} {","}{" "}
                      {this?.props?.data?.roadName} {","}{" "}
                      {this?.props?.data?.landmark} {"."}
                    </h5>
                  </div>

                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>5. दूरध्वनी क्रमांक</h5>
                    <h5 className={styles.dash}>:-</h5>
                    <h5 className={styles.value}>
                      {this?.props?.data?.landlineNo}
                    </h5>
                  </div>

                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>6. मोबाईल क्रमांक</h5>
                    <h5 className={styles.dash}>:-</h5>
                    <h5 className={styles.value}>
                      {this?.props?.data?.mobileNo}
                    </h5>
                  </div>

                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>
                      7. ज्या राष्ट्रीयकृत बँकेत खाते आहे त्या बँकेचे नाव
                    </h5>
                    <h5 className={styles.dash}>:-</h5>
                    <h5 className={styles.value}>
                      {this?.props?.data?.bankName}
                    </h5>
                  </div>

                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>8. बचतगट खाते क्रमांक</h5>
                    <h5 className={styles.dash}>:-</h5>
                    <h5 className={styles.value}>
                      {this?.props?.data?.accountNo}
                    </h5>
                  </div>

                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>
                      9. बचतगट खाते सुरु केल्याचा दिनांक
                    </h5>
                    <h5 className={styles.dash}>:-</h5>
                    <h5 className={styles.value}>
                      {moment(this?.props?.data?.startDate).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )}
                    </h5>
                  </div>
                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>
                      10. बचतगटातील महिलांनी प्रशिक्षण घेतले आहे का ?
                    </h5>
                    <h5 className={styles.dash}>:-</h5>
                    <h5 className={styles.value}>
                      {this?.props?.data?.questionFirstOption === "true"
                        ? "होय"
                        : "नाही"}
                    </h5>
                  </div>
                  {this?.props?.data?.questionFirstOption === "true" ? (
                    <>
                      <div className={styles.labelValue}>
                        <h5 className={styles.value}>होय असल्यास</h5>
                      </div>
                      <div className={styles.labelValue}>
                        <h5 className={styles.value}>
                          {this?.props?.data?.questionFirstAns}
                        </h5>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>
                      11. बचतगट कोणता व्यवसाय करतो का ?
                    </h5>
                    <h5 className={styles.dash}>:-</h5>
                    <h5 className={styles.value}>
                      {this?.props?.data?.questionSecondOption === "true"
                        ? "होय"
                        : "नाही"}
                    </h5>
                  </div>
                  {this?.props?.data?.questionSecondOption === "true" ? (
                    <>
                      <div className={styles.labelValue}>
                        <h5 className={styles.value}>होय असल्यास</h5>
                      </div>
                      <div className={styles.labelValue}>
                        <h5 className={styles.value}>
                          {this?.props?.data?.questionSecondAns}
                        </h5>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>
                      12. बचतगटातील महिला वैयक्तिक व्यवसाय करतात का ?
                    </h5>
                    <h5 className={styles.dash}>:-</h5>
                    <h5 className={styles.value}>
                      {this?.props?.data?.questionThirdOption === "true"
                        ? "होय"
                        : "नाही"}
                    </h5>
                  </div>
                  {this?.props?.data?.questionThirdOption === "true" ? (
                    <>
                      <div className={styles.labelValue}>
                        <h5 className={styles.value}>होय असल्यास</h5>
                      </div>
                      <div className={styles.labelValue}>
                        <h5 className={styles.value}>
                          {this?.props?.data?.questionThirdAns}
                        </h5>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>13. सभासद संख्या</h5>
                    <h5 className={styles.dash}>:-</h5>
                    <h5 className={styles.value}>
                      {this?.props?.data?.totalMembersCount}
                    </h5>
                  </div>

                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>
                      14. प्रभागाचे नाव (अ/य/क/इ/ई/फ./ग/ह)
                    </h5>
                    <h5 className={styles.dash}>:-</h5>
                    <h5>{this?.props?.data?.wardName}</h5>
                  </div>

                  <div className={styles.labelValue}>
                    <h5 className={styles.label}>15. निवडणूक वॉर्ड क्रमांक</h5>
                    <h5 className={styles.dash}>:-</h5>-
                  </div>

                  <div>
                    <h5 className={styles.label}>
                      आमच्या बचत गटातील कोणीही सदस्य इतर कोणत्याही गटात सदस्य
                      नाहीत, बंद झालेल्या बचतगटातील अथवा अस्तित्वात असलेल्या इतर
                      कोणत्याही बचतगटातील सभासद आमचे बचतगटात सभासद नाहीत. तरी
                      आमच्या अर्जाचा विचार घेऊन बचत गटाची नोंदणी
                      महानगरपालिकेमार्फत करण्यात यावी ही नम्र विनंती.
                    </h5>
                  </div>

                  <div className={styles.bachathatSign}>
                    <h5 className={styles.label}>स्वाक्षरी</h5>
                    <h5 className={styles.label}>
                      (संघटिका) (सहसंघटिका) (हिशोब तपासणीस)
                    </h5>
                  </div>

                  <div className={styles.topSpacingForDate}>
                    <div className={styles.labelValue}>
                      <h5 className={styles.label}>दिनांक:</h5>
                    </div>

                    <div className={styles.labelValue}>
                      <h5 className={styles.label}>सोबत:</h5>
                    </div>

                    <div className={styles.labelValue}>
                      <h5>१) बचत गटाचे पासबुकची झेरॉक्स</h5>
                    </div>

                    <div className={styles.labelValue}>
                      <h5>२) बचतगट सदस्यांची विहित नमुन्यातील माहिती</h5>
                    </div>

                    <div>
                      <hr className={styles.hrDottedLine}></hr>{" "}
                    </div>

                    <div className={styles.titleText}>
                      <h4 className={styles.Table1Header}>* पोहोच *</h4>
                    </div>

                    <div>
                      <h4>
                        आपल्या {this?.props?.data?.bachatgatName} बचतगटाची
                        नोंदणी महानगरपालिकेमार्फत करण्यात आली असून आपला नोंदणी
                        क्रमांक {this?.props?.data?.applicationNo} हा आहे. सदर
                        नोंदणी महानगरपालिकेच्या कार्यालयीन कामकाजामाठी करण्यात
                        आली असून त्याचा उपयोग / वापर अन्य कोणत्याही कारणासाठी
                        करणे अनुज्ञेय नाही.
                      </h4>
                    </div>

                    <div className={styles.bachathatDate}>
                      <h3 className={styles.topSpacingForDate}>
                        दिनांक:05/12/2023
                      </h3>
                    </div>

                    <div className={styles.bachathatLipik}>
                      <h3 className={styles.topSpacingForDate}>लिपीक</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.titleText}>
                <h4 className={styles.Table1Header}>
                  {this?.props?.data?.bachatgatName} महिला बचतगट
                </h4>
              </div>
              <div className={styles.summ}>
                <table className={styles.table}>
                  <tbody>
                    <tr>
                      <td className={styles.Table1Header} colSpan={8}>
                        * सदस्यांची माहिती *
                      </td>
                    </tr>
                    <tr>
                      <td
                        className={`${styles.TableTd} ${styles.TableTh}`}
                        colSpan={1}
                      >
                        अ.क्र.
                      </td>
                      <td
                        className={`${styles.TableTd} ${styles.TableTh}`}
                        colSpan={1}
                      >
                        नाव
                      </td>

                      <td
                        className={`${styles.TableTd} ${styles.TableTh}`}
                        colSpan={1}
                      >
                        पत्ता
                      </td>
                      <td
                        className={`${styles.TableTd} ${styles.TableTh}`}
                        colSpan={1}
                      >
                        आधार ओळख क्रमांक
                      </td>
                      <td
                        className={`${styles.TableTd} ${styles.TableTh}`}
                        colSpan={1}
                      >
                        स्वाक्षरी
                      </td>
                    </tr>
                    {sortedData &&
                      sortedData.map((data, index) => (
                        <>
                          <tr>
                            <td className={styles.TableTd} colSpan={1}>
                              {data?.srNo}
                            </td>
                            <td className={styles.TableTd} colSpan={1}>
                              {data?.fullName}
                            </td>

                            <td className={styles.TableTd} colSpan={1}>
                              {data?.address}
                            </td>
                            <td className={styles.TableTd} colSpan={1}>
                              {data?.aadharNumber}
                            </td>
                            <td className={styles.TableTd} colSpan={1}></td>
                          </tr>
                        </>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.bachathatSign}>
                <h3 className={styles.topSpacingForSign}>
                  बचतगट अध्‍यक्षांची स्‍वाक्षरी / शिक्का
                </h3>
              </div>
              <div className={styles.bachathatSign}>
                <h5 className={styles.topSpacingFortip}>
                  टीप:- सदर अर्जाची प्रिंट काढून त्यावर स्वाक्षरी करून तो अर्ज
                  सही शिक्या सहित व बँक पासबुक ची साक्षांतिक प्रत सुद्धा
                  अर्जासोबत अपलोड करण्यात यावी हि विनंती
                </h5>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;

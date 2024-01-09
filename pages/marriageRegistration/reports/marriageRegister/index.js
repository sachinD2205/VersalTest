import { Button } from "@mui/material";
import { Image } from "antd";
import axios from "axios";
import router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import styles from "./printForm.module.css";
const Index = () => {
  const userToken = useGetToken();
  const [gPhoto, setGPhoto] = useState();
  const [bPhoto, setBPhoto] = useState();
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
  const methods = useForm({
    // criteriaMode: 'all',
    // resolver: yupResolver(dataValidation),
    // mode: 'onChange',
  });
  const {
    reset,
    method,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const componentRef = useRef(null);
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels.language);
  const [allData, setAllData] = useState("");
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  ////
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
  // 8888888****************************************************

  const [data, setData] = useState(null);

  useEffect(() => {
    let applicationId;
    let serviceId;
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId;
    } else if (localStorage.getItem("applicationId")) {
      applicationId = localStorage.getItem("applicationId");
    } else if (router?.query?.id) {
      applicationId = router?.query?.id;
    }

    if (router?.query?.serviceId) {
      serviceId = router?.query?.serviceId;
    } else if (localStorage.getItem("serviceId")) {
      serviceId = localStorage.getItem("serviceId");
    }
    axios
      .get(
        // `${urls.MR}/transaction/marriageCertificate/getMCBySIdAndId?applicationId=${applicationId}&serviceId=${serviceId}`,
        `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        console.log("r.data11", r.data);
        setData({ ...r.data, token: user?.token });
        getGPhoto(r?.data?.gphoto);
        getBPhoto(r?.data?.bphoto);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, [router?.query?.applicationId, router?.query?.serviceId, user?.token]);

  // 8888888****************************************************
  const [religions, setReligions] = useState([]);

  // getReligion
  const getReligions = () => {
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setReligions(
          r.data.religion.map((row) => ({
            id: row.id,
            religion: row.religion,
            religionMr: row.religionMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  // Status at time mR
  const [witnessRelations, setwitnessRelations] = useState([]);

  // getStatus at time mR
  const getwitnessRelations = () => {
    axios
      .get(`${urls.MR}/master/relation/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setwitnessRelations(
          r.data.relation.map((row) => ({
            id: row.id,
            relation: row.relation,
            relationMar: row.relationMar,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  //Mr Status
  const [gStatusAtTimeMarriageKeys, setgStatusAtTimeMarriageKeys] = useState(
    [],
  );

  const getgStatusAtTimeMarriageKeys = () => {
    axios
      .get(`${urls.MR}/master/maritalstatus/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setgStatusAtTimeMarriageKeys(
          r.data.maritalStatus.map((row) => ({
            id: row.id,
            statusDetails: row.statusDetails,
            statusDetailsMar: row.statusDetailsMar,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //       ====================>
  useEffect(() => {
    getReligions();
    getwitnessRelations();
    getgStatusAtTimeMarriageKeys();
  }, []);

  const [document, setDocument] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${urls.CFCURL}/master/serviceWiseChecklist/getAllByServiceId?serviceId=10`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        setDocument(r.data.serviceWiseChecklist);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  console.log("allDatadocument", document);
  return (
    <>
      <div>
        <ComponentToPrint
          ref={componentRef}
          data={data}
          // religions={religions}
          witnessRelations={witnessRelations}
          // gStatusAtTimeMarriageKeys={gStatusAtTimeMarriageKeys}
          // document={document}
          gPhoto={gPhoto}
          bPhoto={bPhoto}
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
    console.log(
      "this.stateeeeee",
      this.props.data,
      this.props.witnessRelations,
    );
    const data = this.props.data;
    const witnessRelations = this.props.witnessRelations;
    return (
      <div className={styles.report}>
        {/* Marriage Information */}
        <div className={styles.titleContainer}>
          <div className={styles.titleItem}>
            <div className={styles.head1}>
              <b>Marriage Information</b>
            </div>
            <div className={styles.head2}>
              <b>Marriage Date:-</b>
              {data?.marriageDate}
            </div>
            <div className={styles.head2}>
              <b>Registration Date:-</b>
              {data?.applicationDate}
            </div>
            <div className={styles.head2}>
              <b>Marriage Place:-</b>
              {data?.pplaceOfMarriage}
            </div>
            <div className={styles.head2}>
              <b>Reg No:-</b>
              {data?.registrationNumber}
            </div>
          </div>

          <div className={styles.titleItem}>
            <div className={styles.head1}>
              <b>Priest Information</b>
            </div>
            <div className={styles.head2}>
              <b>Priest Name:-</b>
              {data?.pfName} {data?.plName}
            </div>
            <div className={styles.head2}>
              <b>Priest Address:-</b>
              {data?.pbuildingNo} {data?.pbuildingName} {data?.proadName}{" "}
              {data?.plandmark}, {data?.pcityName}
            </div>
            <div className={styles.head2}>
              <b>Priest Age:-</b>
              {data?.page}
            </div>
          </div>
        </div>

        {/* 2n Row */}
        <div className={styles.titleContainer}>
          <div className={styles.titleItem}>
            <div className={styles.head1}>
              <b>Groom Information</b>
            </div>
            <div className={styles.head2}>
              <b>Groom Name:-</b>
              {data?.gfName?.toUpperCase() + " "}
              {data?.gmName && data?.gmName?.toUpperCase() + " "}
              {data?.glName?.toUpperCase()}{" "}
            </div>
            <div className={styles.head2}>
              <b>Groom Address:-</b>
              {data?.gbuildingNo && data?.gbuildingNo + ", "}
              {data?.gbuildingName && data?.gbuildingName?.toUpperCase() + ", "}
              {data?.groadName && data?.groadName?.toUpperCase() + " "}

              {data?.glandmark && data?.glandmark?.toUpperCase() + ", "}
              {data?.gcityName && data?.gcityName?.toUpperCase() + ", "}
              {data?.gpincode && data?.gpincode}
            </div>
            <div className={styles.head2}>
              <b>Groom Age:-</b> {data?.gage}
            </div>
            <div className={styles.head2}>
              <b>Groom Mobile No:- </b>
              {data?.gmobileNo}
            </div>

            <div className={styles.photos}>
              <div className={styles.oneB}>
                {/* <b>Photos:-</b> */}
                <br />{" "}
                <Image
                  src={`data:image/png;base64,${this?.props?.gPhoto}`}
                  // src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.gphoto}`}
                  alt="Groom Photo"
                  height={90}
                  width={80}
                ></Image>
              </div>
            </div>
          </div>

          <div className={styles.titleItem}>
            <div className={styles.head1}>
              <b>Bridegroom Information</b>
            </div>
            <div className={styles.head2}>
              <b>Bridegroom Name:-</b>
              {data?.bfName?.toUpperCase() + " "}
              {data?.bmName && data?.bmName?.toUpperCase() + " "}
              {data?.blName?.toUpperCase()}{" "}
            </div>
            <div className={styles.head2}>
              <b>Bridegroom Address:- </b>
              {data?.bbuildingNo && data?.bbuildingNo + ", "}
              {data?.bbuildingName && data?.bbuildingName?.toUpperCase() + ", "}
              {data?.broadName && data?.broadName?.toUpperCase() + " "}

              {data?.blandmark && data?.blandmark?.toUpperCase() + ", "}
              {data?.bcityName && data?.bcityName?.toUpperCase() + ", "}
              {data?.bpincode && data?.bpincode}
            </div>
            <div className={styles.head2}>
              <b>Bridegroom Age:-</b> {data?.bage}
            </div>
            <div className={styles.head2}>
              <b>Bridegroom Mobile No:-</b> {data?.bmobileNo}
            </div>
            <div className={styles.photos}>
              <div className={styles.oneB}>
                {/* <b>Photos:-</b><br/> */}
                <Image
                  src={`data:image/png;base64,${this?.props?.bPhoto}`}
                  // src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.bphoto}`}
                  alt="Bride Photo"
                  height={90}
                  width={80}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3rd Row  */}
        <div className={styles.headWitness}>
          <b>Witness Information</b>
        </div>
        <div className="center-table">
          <table className={styles.tableMain}>
            <tr>
              <th>Witness Name</th>
              <th>Witness Address</th>
              <th>Witness Age</th>
              <th>Witness Relation</th>
            </tr>
            {data?.witnesses.map((item) => (
              <tr key={item.id}>
                <td className={styles.tabletd}>
                  {item?.witnessFName} {item?.witnessMName} {item?.witnessLName}
                </td>
                <td className={styles.tabletd}>{item?.witnessAddressC}</td>
                <td className={styles.tabletd}>{item?.witnessAge}</td>
                <td className={styles.tabletd}>
                  {
                    witnessRelations?.find(
                      (x) => item?.witnessRelation === x.id,
                    )?.relation
                  }{" "}
                </td>
              </tr>
            ))}
          </table>
        </div>
        <hr className="solid"></hr>
        {/* Marathi Information */}

        <div className={styles.titleContainer}>
          <div className={styles.titleItem}>
            <div className={styles.head1}>
              <b>लग्नाची महिती</b>
            </div>
            <div className={styles.head2}>
              <b>विवाह दिनांक नोंदणी :- </b> {data?.marriageDate}
            </div>
            <div className={styles.head2}>
              <b>विवाह स्थळ:-</b> {data?.pplaceOfMarriageMr}
            </div>
          </div>

          <div className={styles.titleItem}>
            <div className={styles.head1}>
              <b>पुरोहितांची माहिती</b>
            </div>
            <div className={styles.head2}>
              <b>पुरोहिताचे नाव:-</b> {data?.pfName} {data?.plName}
            </div>
            <div className={styles.head2}>
              <b>पुरोहिताचा पत्ता :-</b> {data?.pbuildingNo}{" "}
              {data?.pbuildingName} {data?.proadName} {data?.plandmark},{" "}
              {data?.pcityName}
            </div>
            <div className={styles.head2}>
              <b>पुरोहिताचे वय:-</b> {data?.page}
            </div>
          </div>
        </div>
        {/*  */}

        <div className={styles.titleContainer}>
          <div className={styles.titleItem}>
            <div className={styles.head1}>
              <b>वराची माहिती</b>
            </div>
            <div className={styles.head2}>
              <b>वराचे नाव :- </b>
              {data?.gfNameMr + " "}
              {data?.gmNameMr && data?.gmNameMr + " "}
              {data?.glNameMr + " "}
            </div>
            <div className={styles.head2}>
              <b>वराचा पत्ता :-</b>
              {data?.gbuildingNo && data?.gbuildingNo + ", "}
              {data?.gbuildingNameMr && data?.gbuildingNameMr + ", "}
              {data?.groadNameMr && data?.groadNameMr + " "}

              {data?.glandmarkMr && data?.glandmarkMr + ", "}
              {data?.gcityNameMr && data?.gcityNameMr + ", "}
              {data?.gpincode && data?.gpincode}
            </div>
            <div className={styles.head2}>
              <b>वराचे वय :- </b>
              {data?.gage}
            </div>

            <div className={styles.head2}>
              <b>वराचा संपर्क क्र :-</b>
              {data?.gmobileNo}
            </div>
          </div>

          <div className={styles.titleItem}>
            <div className={styles.head1}>
              <b>वधूची माहिती</b>
            </div>
            <div className={styles.head2}>
              <b>वधूचे नाव :-</b>
              {data?.bfNameMr + " "}
              {data?.bmNameMr && data?.bmNameMr + " "}
              {data?.blNameMr}{" "}
            </div>
            <div className={styles.head2}>
              <b>वधूचा पत्ता :-</b>{" "}
              {data?.bbuildingNo && data?.bbuildingNo + ", "}
              {data?.bbuildingNameMr && data?.bbuildingNameMr + ", "}
              {data?.broadNameMr && data?.broadNameMr + " "}
              {data?.blandmarkMr && data?.blandmarkMr + ", "}
              {data?.bcityNameMr && data?.bcityNameMr + ", "}
              {data?.bpincode && data?.bpincode}
            </div>
            <div className={styles.head2}>
              <b>वधूचे वय:-</b>
              {data?.bage}
            </div>
            <div className={styles.head2}>
              <b>वधूचा संपर्क क्र.:-</b>
              {data?.bmobileNo}
            </div>
          </div>
        </div>

        {/*  */}
        <div className={styles.headWitness}>
          <b>साक्षीदाराची माहिती</b>
        </div>
        <div className="center-table">
          <table className={styles.tableMain}>
            <tr>
              <th>साक्षीदाराचे नाव</th>
              <th>साक्षीदाराचा पत्ता</th>
              <th>साक्षीदाराचे वय</th>
              <th>नाते</th>
            </tr>
            {data?.witnesses.map((item) => (
              <tr key={item.id}>
                <td className={styles.tabletd}>
                  {item?.witnessFNameMr} {item?.witnessMNameMr}{" "}
                  {item?.witnessLNameMr}
                </td>
                <td className={styles.tabletd}>{item?.witnessAddressCMar}</td>
                <td className={styles.tabletd}>{item?.witnessAge}</td>
                <td className={styles.tabletd}>
                  {
                    witnessRelations.find((x) => item?.witnessRelation === x.id)
                      .relationMar
                  }{" "}
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    );
  }
}
export default Index;

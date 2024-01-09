import { Button, Paper } from '@mui/material'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import urls from '../../../../URLS/urls'
import styles from './goshwara.module.css'
// url http://localhost:4001/marriageRegistration/reports/marriageCertificate/marriageCertificateReport
// Marriage Certificate Form
const Index = () => {
  const router = useRouter()
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const [dataa, setDataa] = useState()
  useEffect(() => {
    console.log('router.query', router.query)
    let applicationId
    if (router.query) {
      if (router?.query?.applicationId) {
        applicationId = router?.query?.applicationId
      } else if (router?.query?.id) {
        applicationId = router?.query?.id
      }
      axios
        .get(
          `${urls.MR}/transaction/marriageBoardCertificate/getMCBySIdAndId?applicationId=${applicationId}&serviceId=${router.query.serviceId}`,
          // `${urls.MR}/transaction/prime/getApplicationByServiceIdApplicationId?applicationId=${applicationId}&serviceId=${router.query.serviceId}`,
        )
        .then((r) => {
          console.log('r.data', r.data)

          setDataa(r.data)
        })
    }
  }, [])

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' })
  }
  return (
    <div>
      <Paper>
        <div>
          <center>
            <h1>Marriage Board Certificate</h1>
          </center>
        </div>

        <>
          <div>
            <ComponentToPrint ref={componentRef} dataa={dataa} />
          </div>
          <br />

          <div className={styles.btn}>
            <Button
              variant="contained"
              sx={{ size: '23px' }}
              type="primary"
              onClick={handlePrint}
            >
              print
            </Button>
            <Button
              sx={{ width: '250px' }}
              type="primary"
              variant="contained"
              onClick={() => {
                router.push(
                  '/marriageRegistration/transactions/boardRegistrations/scrutiny',
                )
              }}
            >
              Exit
            </Button>
          </div>
        </>
      </Paper>
    </div>
  )
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div>
          <div>
            <Paper>
              <table className={styles.report} style={{ marginLeft: '50px' }}>
                <tr>
                  <div className={styles.main}>
                    <div className={styles.two} style={{ marginLeft: '70vh' }}>
                      <img
                        src="/logoCer.jpg"
                        alt="Maharashtra Logo"
                        height={200}
                        width={150}
                      ></img>
                    </div>
                    <div className={styles.three}>
                      <img
                        src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.dataa?.boardHeadPersonPhoto}`}
                        alt="Applicant photo"
                        height={200}
                        width={200}
                      ></img>
                    </div>
                  </div>
                </tr>
                <tr>
                  <center style={{ lineHeight: '0.9' }}>
                    <h1>
                      <b>महाराष्ट्र शासन</b>
                    </h1>
                    <h3>(राजपत्र ,मे २०,१९९९)</h3>
                    <h3>नमुना ' ब '</h3>
                    <h3>
                      <b>
                        विवाह मंडळ नोंदणी / नोंदणीचे नुतनीकरण केल्याचे
                        प्रमाणपत्र
                      </b>
                    </h3>{' '}
                    <h3>(पहा कलम ५ (२) आणि ४ व नियम ३ पहा)</h3>
                  </center>
                </tr>
              </table>

              <table className={styles.report} style={{ marginLeft: '50px' }}>
                <tr>
                  <div className={styles.data1}>
                    <td>
                      <label>
                        <h3 style={{ margin: '10vh' }}>
                          प्रमाणित करण्यातयेतेकी,नमुना "अ" मध्ये सादर केलेल्या
                          अर्जानुसार नाव :{' '}
                          <b>
                            {' '}
                            {this?.props?.dataa?.afNameMr + ' '}{' '}
                            {this?.props?.dataa?.amNameMr + ' '}
                            {this?.props?.dataa?.alNameMr}{' '}
                          </b>
                          राहणार{' '}
                          <b>
                            {this?.props?.dataa?.aflatBuildingNoMr}{' '}
                            {this?.props?.dataa?.abuildingNameMr}
                            {this?.props?.dataa?.aroadNameMr} {','}
                            {this?.props?.dataa?.alandmarkMr} {','}
                            {this?.props?.dataa?.acityNameMr} {','}
                            {this?.props?.dataa?.astateMr} {','}{' '}
                            {this?.props?.dataa?.apincode}{' '}
                          </b>
                          येथे नोंदणीकृत कार्यालय असलेल्या{' '}
                          <b>
                            {this?.props?.dataa?.bflatBuildingNoMr}{' '}
                            {this?.props?.dataa?.bbuildingNameMr}
                            {this?.props?.dataa?.broadNameMr} {','}
                            {this?.props?.dataa?.blandmarkMr} {','}
                            {this?.props?.dataa?.cityMr} {','}
                            {this?.props?.dataa?.astateMr} {','}{' '}
                            {this?.props?.dataa?.aPincode}{' '}
                          </b>
                          विवाह मंडळाची महाराष्ट्र विवाह मंडळाचे विनियमन आणि
                          विवाह नोंदणी अधिनियम ,<br />
                          १९९८ या मधील तरतुदीनुसार आणि मागील पानावरील अटी व
                          शर्ती मधून राहून , सन २०१६ चे विवाह मंडळ नोंदणी /
                          नुतनीकरण रजिस्टर <br />
                          अनुक्रमांक :{' '}
                          <b>
                            {' ' + this?.props?.dataa?.registrationNumber}
                          </b>{' '}
                          वर दिनांक :{' '}
                          <b>
                            {' '}
                            {' ' +
                              moment(
                                this?.props?.dataa?.applicationDate,
                                'YYYY-MM-DD',
                              ).format('DD-MM-YYYY')}
                          </b>
                          {/* <b>{' ' + this?.props?.dataa?.applicationDate}</b>{' '} */}
                          रोजी मी नोंदणी केली आहे.
                          <br />
                          सदर प्रमाणपत्र :{' '}
                          <b>
                            {' ' +
                              this?.props?.dataa
                                ?.validityOfMarriageBoardRegistration}
                          </b>{' '}
                          पर्यत ग्राह्य आहे . कार्यालयाचा पत्ता :{' '}
                          <b>
                            {this?.props?.dataa?.marriageBoardNameMr}
                            {', '}
                            {this?.props?.dataa?.bflatBuildingNoMr}
                            {', '}
                            {this?.props?.dataa?.bbuildingNameMr} {', '}
                            {this?.props?.dataa?.broadNameMr} {','}
                            {this?.props?.dataa?.blandmarkMr} {','}
                            {this?.props?.dataa?.cityMr} {','}
                            {this?.props?.dataa?.astateMr} {','}{' '}
                            {this?.props?.dataa?.apincode}{' '}
                          </b>
                          . हे विवाह मंडळाचे नोंदणीकृत कार्यालय राहील.
                          <br />
                        </h3>
                      </label>
                    </td>
                  </div>
                </tr>
              </table>
              <table className={styles.report} style={{ marginLeft: '50px' }}>
                <tr>
                  <td style={{ padding: '5vh 5vh 5vh 10vh' }}>
                    {' '}
                    <b>
                      ठिकाण :<b>चिंचवड ,पुणे ४११०३३</b>
                    </b>
                    <br />
                    <b>
                      दिनांक :
                      <b>
                        {' '}
                        {' ' +
                          moment(
                            this?.props?.data?.applicationDate,
                            'YYYY-MM-DD',
                          ).format('DD-MM-YYYY')}
                      </b>
                      {/* <b>{' ' + this?.props?.dataa?.applicationDate}</b>{' '} */}
                    </b>
                  </td>
                </tr>
                {this?.props?.dataa?.applicationStatus ==
                'CERTIFICATE_ISSUED' ? (
                  <tr className={styles.trrowf}>
                    <td
                      colSpan={2}
                      style={{ paddingRight: '5vh', paddingBottom: '5vh' }}
                    >
                      {' '}
                      <b>Document Digitally Verified</b>
                      <img
                        src="/verified.png"
                        alt="Verified Logo"
                        height={50}
                        width={50}
                      ></img>
                    </td>
                  </tr>
                ) : (
                  ''
                )}
                <tr className={styles.trrowf}>
                  <td
                    colSpan={2}
                    style={{ paddingRight: '5vh', paddingBottom: '5vh' }}
                  >
                    {' '}
                    <b>
                      विवाह निबंधक <br></br>{' '}
                      {this?.props?.dataa?.zone?.zoneNameMr}
                      <br />
                      पिंपरी चिंचवड महानगरपलिका <br />
                      चिंचवड,पुणे.४११०३३
                    </b>
                  </td>
                </tr>
              </table>
            </Paper>
            <Paper
              sx={{
                border: 1,
                borderColor: 'grey.500',
              }}
            >
              <table className={styles.report} style={{ marginLeft: '50px' }}>
                <h2
                  style={{
                    marginLeft: '75vh',
                    marginTop: '5vh',
                    marginBottom: '5vh',
                  }}
                >
                  <b>( अटी व शर्ती )</b>
                </h2>
                <div
                  style={{
                    marginLeft: '10vh',
                    marginTop: '5vh',
                    marginRight: '5vh',
                  }}
                >
                  <h3>
                    १) सदरचे प्रमाणपत्र मंडळाच्या कार्यालात दर्शनी भागावर
                    प्रदर्शित करावे.
                  </h3>

                  <h3>
                    2) सदर प्रमाणपत्र दिल्याच्या दिनांकापासून दोन वर्षाकरीता वैध
                    राहील. प्रत्येक दोन वर्षांने त्याचे नुतनीकरण मुदत
                    समाप्तीपूर्वी आठ दिवस अगोदर करावे लागेल. नोंदणीचे व नूतनीकरण
                    करण्याची फी र.रु.२०००/- (पहा अधिसूचना क्रमांक विनोंका.
                    २००७/९३८/प्र.क्र.२३७/ कु.क .२, दि. १ नोव्हेंबर २००७) आकारले
                    जाईल परंतु त्यावेळेस प्रत्यक्षात नियमानुसार जी फी देय आहे,ती
                    भरणे बंधनकारक राहील. तक्रार करता येणार नाही.
                  </h3>

                  <h3
                    style={{
                      marginTop: '10px',
                    }}
                  >
                    3)प्रमाणपत्रात नेमुन दिलेल्या ठिकाणावरच विवाह मंडळाने आपले
                    कामकाज चालवावे.
                  </h3>

                  <h3
                    style={{
                      marginTop: '10px',
                    }}
                  >
                    4) या अधिनियमात / नियमात वेळोवेळी होणारे बदल / दुरुस्ती
                    बंदनकारक राहतील.
                  </h3>

                  <h3
                    style={{
                      marginTop: '10px',
                    }}
                  >
                    5) या कायदयातील कोणत्याही तरतुदीचा भंग केल्यास रु. ५०००/-
                    दंड किंवा ६ महिने कारावास भोगावा लागेल किंवा दोन्ही शिक्षा
                    एकाच वेळी भोगाव्या लागतील.
                  </h3>

                  <h3
                    style={{
                      marginTop: '10px',
                    }}
                  >
                    6) कोणतेही विवाह मंडळ, विवाह मंडळ म्हणून असलेले आपले काम
                    पोट-कलम (२) खाली देण्यात आलेल्या प्रमाणपत्रामध्ये
                    विनिर्दिष्ट करण्यात आलेले आपले नोंदणीकृत कार्यालय किंवा जागा
                    या अतिरिक्त अन्यत्र करणार नाही,{' '}
                    <b>
                      संबंधित विवाह मंडळाची नोंदणी फक्त त्या कार्यक्षेत्रापुरती
                      असल्याने, कार्यक्षेत्राबाहेर त्यांना काम करता येणार नाही.
                    </b>
                  </h3>

                  <h3
                    style={{
                      marginTop: '10px',
                    }}
                  >
                    7)मंडळाने वरीलपैकी कोणत्याही अटीचा भंग केल्यास विवाह मंडळाची
                    नोंदणी रदद करण्यात येईल.
                  </h3>
                  {this?.props?.dataa?.applicationStatus ==
                  'CERTIFICATE_ISSUED' ? (
                    <tr className={styles.trrowf}>
                      <td colSpan={2} style={{ paddingBottom: '5vh' }}>
                        {' '}
                        <b>Document Digitally Verified</b>
                        <img
                          src="/verified.png"
                          alt="Verified Logo"
                          height={50}
                          width={50}
                        ></img>
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  <tr className={styles.trrowf}>
                    <td colSpan={2}>
                      {' '}
                      <b>
                        विवाह निबंधक <br></br>{' '}
                        {this?.props?.dataa?.zone?.zoneNameMr}
                        <br />
                        पिंपरी चिंचवड महानगरपलिका <br />
                        चिंचवड,३३
                      </b>
                    </td>
                  </tr>
                  <h4
                    style={{
                      marginTop: '5vh',
                      marginBottom: '5vh',
                    }}
                  >
                    या प्रमाणपत्राचे दि.{' '}
                    <b>
                      {' '}
                      {' ' +
                        moment(
                          this?.props?.data
                            ?.validityOfMarriageBoardRegistration,
                          'YYYY-MM-DD',
                        ).format('DD-MM-YYYY')}
                    </b>
                    {/* <b>
                      {' ' +
                        this?.props?.dataa?.validityOfMarriageBoardRegistration}
                    </b>{' '} */}
                    पर्यत नाविनीकरण करण्यात आलेले आहे.
                    <br />
                    (पावती क्रमांक :{' '}
                    {' ' + this?.props?.dataa?.payment?.receiptNo} दिनांक- :
                    {' ' + this?.props?.dataa?.payment?.receiptDate}
                    {/* <b>{' ' + this?.props?.dataa?.applicationDate}</b> */},
                    रू. <b>{' ' + this?.props?.dataa?.payment?.amount} </b>)
                    {/* this?.props?.dataa?.loi?.amount */}
                  </h4>

                  <tr>
                    <td style={{ padding: '0vh' }}>
                      {' '}
                      <b>
                        ठिकाण :<b>चिंचवड ,पुणे ४११०३३</b>
                      </b>
                      <br />
                      <b>
                        दिनांक :
                        <b>{' ' + this?.props?.dataa?.applicationDate}</b>{' '}
                      </b>
                    </td>
                  </tr>
                  {this?.props?.dataa?.applicationStatus ==
                  'CERTIFICATE_ISSUED' ? (
                    <tr className={styles.trrowf}>
                      <td colSpan={2} style={{ paddingBottom: '5vh' }}>
                        {' '}
                        <b>Document Digitally Verified</b>
                        <img
                          src="/verified.png"
                          alt="Verified Logo"
                          height={50}
                          width={50}
                        ></img>
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  <tr className={styles.trrowf}>
                    <td
                      colSpan={2}
                      style={{
                        paddingBottom: '5vh',
                      }}
                    >
                      {' '}
                      <b>
                        विवाह निबंधक <br></br>{' '}
                        {this?.props?.dataa?.zone?.zoneNameMr}
                        <br />
                        पिंपरी चिंचवड महानगरपलिका <br />
                        चिंचवड,पुणे.४११०३३
                      </b>
                    </td>
                  </tr>
                </div>
              </table>
            </Paper>
          </div>
        </div>
      </>
    )
  }
}

export default Index

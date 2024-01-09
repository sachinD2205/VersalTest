import { Button } from '@mui/material'

import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

import router from 'next/router'
import styles from './goshwara.module.css'
const Index = () => {
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' })
  }

  // view
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} />
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
          type="primary"
          variant="contained"
          onClick={() => {
            router.push('/marriageRegistration/dashboard')
          }}
        >
          Exit
        </Button>
      </div>
    </>
  )
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div className={styles.middle}>
                <h2>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h2>
                {/* <h4>
                  {' '}
                  <b>मुंबई पुणे महामार्ग ,</b> <b>पिंपरी पुणे 411-018</b>
                </h4> */}

                <h4>
                  {' '}
                  <b>महाराष्ट्र, भारत</b>
                </h4>
              </div>
              <div className={styles.logo}>
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
                <b>पावती</b>
                <h5>
                  (महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८)
                </h5>
              </h2>
            </div>

            <div className={styles.two}>
              <div className={styles.date3}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: '40px' }}>
                    {' '}
                    <b>पावती क्रमांक :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    <b>{router.query.receiptNo}</b>
                  </h4>
                </div>
                <div className={styles.date3}>
                  <h4>
                    {' '}
                    <b>दिनांक :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    <b>{router.query.receiptDate}</b>
                  </h4>
                </div>

                <div className={styles.date2}>
                  <h4>
                    {' '}
                    <b>वेळ :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    {router?.query?.receiptTime}
                  </h4>
                </div>
              </div>
              {/* <div className={styles.date3}>
                <div className={styles.date3}>
                  <h4>
                    {" "}
                    <b>वर : </b>
                  </h4>
                  <h4 style={{ marginLeft: "10px" }}>
                    {router.query.gFName + " "} {router.query.gMName + " "}
                    {router.query.gLName}
                  </h4>
                </div>

                <div className={styles.date2}>
                  <h4>
                    {" "}
                    <b>वधु :</b>
                  </h4>
                  <h4 style={{ marginLeft: "10px" }}>
                    {router.query.bFName + " "}
                    {router.query.bMName + " "}
                    {router.query.bLName}
                  </h4>
                </div>
              </div> */}
              <div className={styles.date4} style={{ marginTop: '2vh' }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: '40px' }}>
                    <b>अर्जाचा क्रमांक :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    {router.query.applicationNumber}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: '2vh' }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: '40px' }}>
                    {' '}
                    <b>अर्जाचा दिनांक : </b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    {router.query.applicationDate}
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: '2vh' }}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: '40px' }}>
                    {' '}
                    <b>अर्जदाराच नाव : </b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    {router.query.applicantNameMr}
                  </h4>
                </div>
              </div>

              {/* <div className={styles.date2}>
                <h4 style={{ marginLeft: '40px' }}>
                  {' '}
                  <b>पावती क्रमांक :</b>
                </h4>{' '}
              </div> */}

              <p>
                <h5 style={{ marginLeft: '25px' }}>
                  <b>
                    पुढीलप्रमाणे फी मिळाली :-
                    <br />
                    ५(२) विवाह शास्त्रोक्त पद्धतीने झालेल्याच्या दिनांक:{' '}
                    {router.query.marriageDate} विवाह नोंदणीकृत आकारण्यात येणारे
                    विवाह नोंदणी शुल्क
                    <br />
                  </b>
                  <b>एकूण फी</b> &nbsp;
                  <b>
                    {Number(router?.query?.serviceCharge) +
                      Number(router?.query?.penaltyCharge)}
                  </b>
                  <b>
                    <br />
                    {router.query.serviceNameMr} या सेवेसाठी नागरिक सेवा
                    पोर्टलवर तुमची रक्कम प्राप्त झाली आहे. <br />
                    पिंपरी चिंचवड महानगरपलिका विभागीय कार्यालय आपल्यासेवेस तत्पर
                    आहे ,धन्यवाद.!!
                  </b>
                </h5>
              </p>
              {/* <div className={styles.date1}>
              <div className={styles.date}>
                <h4>विभाग:</h4>
                <h4>अर्जाचा क्रमांक : </h4>{' '}
                <h4> :{router?.query?.applicationNumber}</h4>
                <h4>अर्जदाराच नाव : </h4>
                <h4> : {router.query.applicantName}</h4>
                <h4>अर्ज केलेली दिनांक :</h4>
                <h4> : {router.query.applicationDate}</h4>
                <h4>अर्जदाराचा पत्ता : </h4>
              </div> */}

              <div>
                {/* <h3> :{router?.query?.applicationNumber}</h3>
                <h3> : {router.query.applicantName}</h3>
                <h3> : {router.query.applicationDate}</h3> */}
                {/* <h3>
                  : {router.query.aflatBuildingNo}{' '}
                  {router.query.abuildingName}
                  <br></br>
                  {router.query.aroadName} {','}
                  {router.query.aLandmark} {','}
                  <br></br>
                  {router.query.aCityName} {','}
                  {router.query.aState}{' '}
                </h3> */}
              </div>
              {/* </div> */}
              {/* <div>
              <h2 className={styles.heading}>Help</h2>
            </div> */}
              <hr />

              <div className={styles.add}>
                <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                <h5> महाराष्ट्र, भारत</h5>
              </div>

              <div className={styles.add1}>
                <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Index

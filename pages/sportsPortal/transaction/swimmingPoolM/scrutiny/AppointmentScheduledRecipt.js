import { Button } from '@mui/material'

import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

import router from 'next/router'
import styles from './AppointmentScheduleRecipt.module.css'
const AppointmentScheduledReipt = () => {
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const backToHomeButton = () => {
    router.push({ pathname: '/homepage' })
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
            router.push(
              '/marriageRegistration/transactions/newMarriageRegistration/scrutiny',
            )
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
                <h3>
                  <b>पिंपरी चिंचवड महानगरपलिका</b>
                </h3>
                <h4>
                  {' '}
                  <b>मुंबई पुणे महामार्ग ,</b> <b>पिंपरी पुणे 411-018</b>
                </h4>

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
                <b>अपॉइंटमेंट बुकिंग</b>
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
                    <b>टोकेन क्रमांक :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    <b>{router?.query?.tokenNo}</b>
                  </h4>
                </div>
                <div className={styles.date3}>
                  <h4>
                    {' '}
                    <b>दिनांक :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    <b>{router?.query?.appointmentDate}</b>
                  </h4>
                </div>

                <div className={styles.date2}>
                  <h4>
                    {' '}
                    <b>वेळ :</b>
                  </h4>{' '}
                  <h4 style={{ marginLeft: '10px' }}>
                    {router?.query?.appointmentFromTime} -{' '}
                    {router?.query?.appointmentToTime}
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
                    {router?.query?.applicationNumber}
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
                    {router?.query?.applicationDate}
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
                    {router?.query?.applicantName}
                  </h4>
                </div>
              </div>

              {/* <div className={styles.date2}>
                <h4 style={{ marginLeft: '40px' }}>
                  {' '}
                  <b>पावती क्रमांक :</b>
                </h4>{' '}
              </div> */}

              <div style={{ marginTop: '2vh', marginLeft: '5vh' }}>
                <h4>
                  <b>प्रिय {router?.query?.applicantName} ,</b>
                  <b>
                    <br />
                    तुमचा {router?.query?.serviceNameMr} अर्ज प्राप्त झाला आहे
                    आणि मंजुरी साठी प्रलंबित आहे
                    <br />
                  </b>
                  <b>
                    {' '}
                    अपॉइंटमेंट तारीख आणि अपॉइंटमेंट स्लॉट वेळ :{' '}
                    {router?.query?.appointmentDate}{' '}
                    {router?.query?.appointmentFromTime} -{' '}
                    {router?.query?.appointmentToTime}
                  </b>{' '}
                  &nbsp;
                  <b>
                    <br />
                    कृपया सर्व चेकलिस्त दस्तऐवजांची मूळ हार्ड कॉपी{' '}
                    {router?.query?.zoneAddress} येथे सोबत ठेवा
                  </b>
                  <b>
                    <br />
                    {router?.query?.serviceNameMr} या सेवेसाठी नागरिक सेवा
                    पोर्टलवर तुमची अपॉइंटमेंट बुक झाली आहे. <br />
                    पिंपरी चिंचवड महानगरपलिका विभागीय कार्यालय आपल्यासेवेस तत्पर
                    आहे ,धन्यवाद.!!
                  </b>
                </h4>
              </div>
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

export default AppointmentScheduledReipt

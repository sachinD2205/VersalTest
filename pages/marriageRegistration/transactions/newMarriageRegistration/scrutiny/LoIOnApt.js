import { Button } from '@mui/material'

import router from 'next/router'
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import styles from './LoiOnAptRecipt.module.css'

const Index = () => {
  const componentRef = useRef(null)

  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'new document',
  })

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
            swal({
              title: 'Exit?',
              text: 'Are you sure you want to exit this Record ? ',
              icon: 'warning',
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                swal('Record is Successfully Exit!', {
                  icon: 'success',
                })
                router.push('/dashboard')
              } else {
                swal('Record is Safe')
              }
            })
          }}
          // onClick={() => {
          //   router.push('/dashboard')
          // }}
        >
          Exit
        </Button>
      </div>
    </>
  )
}

// class component To Print
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
                <h5>
                  <b>
                    (नागरी व प्रशासकीय सेवेसाठी आयएसओ 9001:2008 प्रमाणपत्र
                    प्राप्त संस्था)
                  </b>
                </h5>
                <h4>
                  {' '}
                  <b>
                    ब-क्षेत्रिय कार्यालय, लोकमान्य हॉस्पीटल जवळ, चिंचवड
                    रेल्वेगेट समोर, चिंचवड, पुणे-३३.
                  </b>
                </h4>
                <h4>
                  {' '}
                  <b>
                    Email- bward@pcmcindia.gov.in Website- www.pcmcindia.gov.in
                  </b>
                </h4>
                <h4>
                  {' '}
                  <b>दुरध्वनी क्रमांक - ०२०-२७३५०१५२</b>
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
              {/* <h2 className={styles.heading}>
                <b>सूचना पत्रक</b>
              </h2> */}
              <hr />
            </div>

            <div className={styles.date}>
              <h4>अर्जाचा क्रमांक : </h4>
              <h4>अर्ज केलेली दिनांक :</h4>
            </div>
            <div className={styles.two}>
              <p>
                <b>
                  <h3>प्रति , </h3>
                  <br></br> &ensp; श्री. सुहास हरी पुलकर्णी, <br />
                  भातोषी हौसिंग सोसायटी, ए/२ दुसरा मजला, <br />
                  हॉटेल समाधान समोर, पडवळ आळी,
                  <br /> चिंचवड, पुणे ४११०३३.
                  {/* <br></br> &ensp; तुमच्याकडे new marrige reg या सेवेसाठी नागरिक
                  सेवा पोर्टलवर कृपया तुमची रक्कम निश्चित करा <br />
                  आणि खालील लिंक वापरून लागू केलेल्या सेवेची रक्कम/शुल्क भरा.
                  <br />
                  <Link href="#">येथे click करा</Link> किंवा जवळील पिंपरी चिंचवड
                  महानगरपलिका विभागीय कार्यालयाला भेट द्या .<br></br> */}
                </b>
              </p>

              <div className={styles.date}>
                <div className={styles.date}>
                  <h4>विषय:नवीन विवाह नोंदणी करणेबाबत.</h4>
                </div>

                {/* <div>
                  <h3> :{router?.query?.applicationNumber}</h3>
                  <h3> : {router.query.applicantName}</h3>
                  <h3> : {router.query.applicationDate}</h3>
                  <h3>
                    : {router.query.aflatBuildingNo}{' '}
                    {router.query.abuildingName}
                    <br></br>
                    {router.query.aroadName} {','}
                    {router.query.aLandmark} {','}
                    <br></br>
                    {router.query.aCityName} {','}
                    {router.query.aState}{' '}
                  </h3>
                </div> */}
              </div>

              <p>
                <b>
                  <h3>महाशय , </h3>
                  <br></br> &ensp; विवाह नोंदणी अधिनियम १९९८ अन्वये आपले नवीन
                  विवाह नोंदणी दिनांक १२/०७/२०२२ रोजी करणेत आली आहे .विवाह
                  <br />
                  नोंदणी प्रमाणपत्राची पुढील प्रक्रिया करण्यात येत आहे. आपण
                  दिनांक १४/०७/२०२२ रोजी नवीन विवाह नोंदणी प्रमाणपत्रसाठी
                  <br />
                  लागणारे दस्तऐवज आणि साक्षीदार सोबत येऊन क्षेत्रीय कार्यालयात
                  दुपारी २.१५ वाजता हजर रहावे.
                </b>
              </p>

              <hr />

              <div className={styles.add}>
                <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                <h5> महाराष्ट्र, भारत</h5>
              </div>

              <div className={styles.add1}>
                <h5>
                  विवाह निबंधक तथा जेष्ठ वैद्यकीय अधिकारी <br /> क्षेत्रीय
                  कार्यालय चिंचवड, पुणे - ३३
                </h5>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Index

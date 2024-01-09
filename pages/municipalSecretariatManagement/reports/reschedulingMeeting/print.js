import React, { useRef } from 'react'
import Head from 'next/head'
// import router from 'next/router'
import styles from './view.module.css'

import { Paper, Button } from '@mui/material'
import { ExitToApp } from '@mui/icons-material'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import PrintIcon from '@mui/icons-material/Print'
import { useReactToPrint } from 'react-to-print'

const Print = () => {
  const componentRef = useRef(null)
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Meeting rescheduled',
    // onAfterPrint: () => alert('Print success'),
  })
  return (
    <>
      <Head>
        <title>Reports - Rescheduling Meeting</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.row}>
          <Button
            variant='contained'
            endIcon={<PrintIcon />}
            onClick={handleToPrint}
          >
            <FormattedLabel id='print' />
          </Button>
          <Button variant='contained' color='error' endIcon={<ExitToApp />}>
            <FormattedLabel id='back' />
          </Button>
        </div>
        <div className={styles.reportWrapper} ref={componentRef}>
          <div className={styles.heading}>
            <span>पिंपरी चिंचवड महानगरपालिका, पिंपरी १८ </span>
            <span>नोटीस</span>
          </div>

          <p className={styles.description}>
            {
              'पिंपरी चिंचवड महानगरपालिका दिनांक २.०० वाजताची मा. महापालिका सभा (कार्यपत्रिका क्रमांक ६७) गुरुवार दिनांक १७/०३/२०२२ रोजी दुपारी २.०० वाजेपर्यंत तहकूब करणेत आलेली आहे. तरी सन्मा.सदस्यांनी याची नोंद घेवून ठरलेल्या दिवशी व वेळी ऑनलाईन पद्धतीने उपस्थित रहावे ही विनंती'
            }
          </p>

          <div className={styles.signatureWrapper}>
            <div className={styles.signature}>
              <span
                style={{
                  height: 50,
                  width: 150,
                  padding: '2%',
                  marginBottom: '5%',
                  border: '1px solid black',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Sign here
              </span>
              <span>{'( उल्हास बबनराव जगताप )'}</span>
              <span>
                <strong>नगरसचिव</strong>
              </span>
              <span>पिंपरी चिंचवड महानगरपालिका</span>
              <span>पिंपरी - १८</span>
            </div>
          </div>
          <div className={styles.endDetails}>
            <span>पिंपरी चिंचवड महानगरपालिका</span>
            <span>पिंपरी - १८. नगरसचिव कार्यालय</span>
            <span>क्र. नस/४/कवि/२९३/२०२०</span>
            <span>दिनांक : ०२/०२/२०२३</span>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipLeft}>प्रत :</span>
            <div className={styles.tipRight}>
              <span>{'१) कार्यालयीन नोटीस बोर्ड'}</span>
              <span>{'२) सुरक्षा विभाग'}</span>
            </div>
          </div>
        </div>
      </Paper>
    </>
  )
}

export default Print

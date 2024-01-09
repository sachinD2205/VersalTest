import React, { useRef, useEffect, useState } from 'react'
import Head from 'next/head'
import router from 'next/router'
import { Button, Paper } from '@mui/material'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import { ExitToApp, Print } from '@mui/icons-material'
import { useReactToPrint } from 'react-to-print'
import moment from 'moment'
import URLs from '../../../URLS/urls'
import axios from 'axios'
import { useGetToken } from '../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../util/util'
import { useSelector } from 'react-redux'

const Index = () => {
  const receiptType = ['कार्यालयाची प्रत', 'ग्राहकाची प्रत']
  const language = useSelector((state) => state.labels.language)
  const userToken = useGetToken()

  const componentRef = useRef(null)
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Case Paper Receipt',
  })

  const [receiptData, setReceiptData] = useState({
    receiptNo: '',
    casePaperNo: '',
  })

  useEffect(() => {
    //Get Data
    axios
      .get(
        `${URLs.VMS}/${
          router.query.service == 'opd'
            ? 'trnAnimalTreatment'
            : 'trnAnimalTreatmentIpd'
        }/getById`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { id: router.query.id },
        }
      )
      .then((res) => {
        console.log('Case Paper Data: ', res.data)
        setReceiptData({
          receiptNo: res.data.receiptNo,
          casePaperNo: res.data.casePaperNo,
        })
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  return (
    <>
      <Head>
        <title>Case Paper Receipt</title>
      </Head>

      <Paper style={{ padding: '3%' }}>
        <div ref={componentRef}>
          {receiptType.map((obj, i) => (
            <div key={i} style={{ padding: '1% 8%' }}>
              <h3 style={{ textAlign: 'center' }}>{obj}</h3>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <h2 style={{ fontWeight: 'bold' }}>
                  पिंपरी-चिंचवड महानगरपालिका
                </h2>
                <h3 style={{ fontWeight: 'bold' }}>पिंपरी - ४११ ०१८</h3>
                <h3 style={{ fontWeight: 'bold' }}>पशु बाह्य रुग्ण विभाग</h3>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4>
                  {router.query.service == 'opd' ? 'OPD' : 'IPD'} पावती क्रं. :
                  <span style={{ marginLeft: 20 }}>
                    {receiptData.receiptNo}
                  </span>
                </h4>
                <h4>
                  दिनांक :
                  <span style={{ marginLeft: 20 }}>
                    {moment(new Date()).format('DD / MM / YYYY')}
                  </span>
                </h4>
              </div>
              <h4>
                केस पेपर नं. :{' '}
                <span style={{ marginLeft: 20 }}>
                  {receiptData.casePaperNo}
                </span>
              </h4>
              <h4>
                केस पेपर फी :{' '}
                <span style={{ marginLeft: 20, fontSize: 'larger' }}>
                  रु. २०/-
                </span>
              </h4>
              <h4>
                (नवीन तसेच जुना) रक्कम{' '}
                <span style={{ fontWeight: 'bold', fontSize: 'larger' }}>
                  रु. वीस
                </span>{' '}
                रोख मिळाले
              </h4>
              <div
                style={{
                  marginTop: 50,
                  marginBottom: '3vh',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <h4>वसूल करणार्याची सही</h4>
              </div>
              {receiptType.length - 1 != i && (
                <hr style={{ border: '1px dashed' }} />
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: '2vh',
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
          <Button
            variant='contained'
            endIcon={<Print />}
            onClick={handleToPrint}
          >
            <FormattedLabel id='print' />
          </Button>
          <Button
            variant='outlined'
            color='error'
            endIcon={<ExitToApp />}
            onClick={() => {
              router.back()
            }}
          >
            <FormattedLabel id='exit' />
          </Button>
        </div>
      </Paper>
    </>
  )
}

export default Index

import React, { useRef, useEffect, useState } from 'react'
import Head from 'next/head'
import router from 'next/router'
import Image from 'next/image'
import styles from '../paymentSlip.module.css'

import URLs from '../../../../URLS/urls'

import { Button, Paper } from '@mui/material'
import { ExitToApp, Print } from '@mui/icons-material'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { useReactToPrint } from 'react-to-print'
import moment from 'moment'
import axios from 'axios'
import { useSelector } from 'react-redux'
import sweetAlert from 'sweetalert'
import Title from '../../../../containers/VMS_ReusableComponents/Title'
import { useGetToken } from '../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../util/util'

const Index = () => {
  const componentRef = useRef(null)
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Pet License Payment Slip',
  })

  const userToken = useGetToken()

  const converter = require('number-to-words')

  // @ts-ignore
  const printByNameDao =
    useSelector((state) => state?.user?.user?.userDao) ??
    useSelector((state) => state.user.user)
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  // @ts-ignore
  const isDeptUser = useSelector(
    (state) => state?.user?.user?.userDao?.deptUser
  )

  const [fiscalYear, setFiscalYear] = useState('')
  const [applicationDetails, setApplicationDetails] = useState({})
  const [petBreeds, setPetBreeds] = useState([
    {
      id: 1,
      breedNameEn: '',
      breedNameMr: '',
      petAnimalKey: '',
    },
  ])
  const [bankName, setBankName] = useState([
    {
      id: 1,
      bankNameEn: '',
      bankNameMr: '',
      branchNameEn: '',
      branchNameMr: '',
    },
  ])

  useEffect(() => {
    let currentYear = Number(moment(new Date()).format('YYYY'))
    setFiscalYear(`${currentYear}-${currentYear + 1}`)
    // setFiscalYear(`${currentYear}-${currentYear + 1 - 2000}`);

    //Get Bank
    axios
      .get(`${URLs.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setBankName(
          res.data.bank.map((j) => ({
            id: j.id,
            bankNameEn: j.bankName,
            bankNameMr: j.bankNameMr,
            branchNameEn: j.branchName,
            branchNameMr: j.branchNameMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get Pet Breeds
    axios
      .get(`${URLs.VMS}/mstAnimalBreed/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setPetBreeds(
          res.data.mstAnimalBreedList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            breedNameEn: j.breedNameEn,
            breedNameMr: j.breedNameMr,
            petAnimalKey: j.petAnimalKey,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  useEffect(() => {
    if (router.query.id && bankName) {
      axios
        .get(`${URLs.VMS}/trnAnimalTreatment/getById`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { id: router.query.id },
        })
        .then((res) => {
          setApplicationDetails({
            ...res.data,
            ownerFullNameEn:
              res.data?.firstName +
              ' ' +
              res.data?.middleName +
              ' ' +
              res.data?.lastName,
            ownerFullNameMr:
              res.data?.firstNameMr +
              ' ' +
              res.data?.middleNameMr +
              ' ' +
              res.data?.lastNameMr,
            paymentDao: {
              ...res.data.paymentDao,
              bankNameEn: bankName?.find(
                (obj) => obj.id == res.data.paymentDao?.bankName
              )?.bankNameEn,
              bankNameMr: bankName?.find(
                (obj) => obj.id == res.data.paymentDao?.bankName
              )?.bankNameMr,
            },
            animalBreed: petBreeds.find(
              (obj) => obj.id === res.data.animalBreedKey
            )?.breedNameEn,
          })
        })
        .catch((error) => {
          console.log('error: ', error)
          catchExceptionHandlingMethod(error, language)
        })
    }
  }, [petBreeds, bankName])

  return (
    <>
      <Head>
        <title>Pet License Payment Slip</title>
      </Head>
      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='opdHeading' />} />

        <div className={styles.paymentWrapper} ref={componentRef}>
          <div className={styles.officeCopy}>
            <div className={styles.header}>
              <Image src={'/qrcode1.png'} width={60} height={60} />
              <div className={styles.centerHeader}>
                <h1>
                  <FormattedLabel id='pcmc' />
                </h1>
                <div className={styles.row}>
                  <div style={{ display: 'flex', columnGap: 10 }}>
                    <label style={{ fontWeight: 'bold' }}>
                      <FormattedLabel id='fiscalYear' />:
                    </label>
                    <span>{fiscalYear}</span>
                  </div>
                </div>
              </div>
              <Image src={'/logo.png'} width={70} height={70} />
            </div>

            <table className={styles.tableWrap}>
              <tr className={styles.tableRow}>
                <td
                  className={styles.tableData1}
                  style={{ textAlign: 'center' }}
                  colSpan={5}
                >
                  <FormattedLabel id='officeCopy' />
                </td>
              </tr>

              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='receiptNo' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='date' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='relatedTo' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='cfcRefNo' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='cfcCounterNo' />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>
                    {' '}
                    {
                      // @ts-ignore
                      applicationDetails?.paymentDao?.receiptNo
                    }
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {moment(
                      // @ts-ignore
                      applicationDetails?.applicationDate
                    ).format('DD-MM-YYYY')}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === 'en'
                      ? 'Veterinary Management System'
                      : 'पशुवैद्यकीय व्यवस्थापन प्रणाली'}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>{applicationDetails?.paymentDao?.cfcCode}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>{applicationDetails?.paymentDao?.counterNo}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='receivedFrom' />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{applicationDetails?.paymentDao?.payerName}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='serviceName' />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>
                    {language === 'en'
                      ? 'Opd Registration'
                      : 'बाह्यरुग्ण विभाग नोंदणी'}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='narration' />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>
                    {language === 'en'
                      ? 'Regarding Opd Registration Fee'
                      : 'बाह्यरुग्ण विभाग नोंदणी शुल्क'}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='address' />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>
                    {applicationDetails?.ownerAddress}

                    {/* {
                      // @ts-ignore
                      applicationDetails.addrFlatOrHouseNo
                    }
                    {", "}
                    {
                      // @ts-ignore
                      applicationDetails.addrBuildingName
                    }
                    {", "}
                    {
                      // @ts-ignore
                      applicationDetails.detailAddress
                    } */}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='paymentMode' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='rupees' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='bankName' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='chequeNo' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='chequeDate' />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>
                    {
                      // @ts-ignore
                      applicationDetails?.paymentDao?.paymentType
                    }
                  </span>
                </td>
                <td className={styles.tableData2}>
                  {/* <span>{language === "en" ? "₹ 75.00" : "₹ ७५.००"}</span> */}
                  <span>₹ {applicationDetails?.paymentDao?.amount}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === 'en'
                      ? // @ts-ignore
                        applicationDetails?.paymentDao?.bankNameEn
                      : // @ts-ignore
                        applicationDetails?.paymentDao?.bankNameMr}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  {/* <span>01/02/2023</span> */}
                </td>
                <td className={styles.tableData2}>
                  {/* <span>State Bank of India</span> */}
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='referenceNo' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='date' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='details' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='payableAmount' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='receivedAmount' />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>
                    {
                      // @ts-ignore
                      applicationDetails?.casePaperNo
                    }
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>{moment(new Date()).format('DD-MM-YYYY')}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === 'en'
                      ? 'Opd bill payment'
                      : 'ओपीडी बिल पेमेंट'}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  {/* <span>{language === "en" ? "₹ 75.00" : "₹ ७५.००"}</span> */}
                  <span>₹ {applicationDetails?.paymentDao?.amount}</span>

                  <br />
                </td>
                <td className={styles.tableData2}>
                  {/* <span>{language === "en" ? "₹ 75.00" : "₹ ७५.००"}</span> */}
                  <span>₹ {applicationDetails?.paymentDao?.amount}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='payableAmount' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='rebateAmount' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='advanceAmount' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='actualPayableAmount' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='receivedAmount' />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  {/* <label> {language === "en" ? "₹ 75.00" : "₹ ७५.००"}</label> */}
                  <span>₹ {applicationDetails?.paymentDao?.amount}</span>
                </td>
                <td className={styles.tableData2}>
                  {/* <label>Rebate Amount/सूट रक्कम</label> */}
                </td>
                <td className={styles.tableData2}>
                  {/* <label>Advance Amount/आगाऊ रक्कम</label> */}
                </td>
                <td className={styles.tableData2}>
                  {/* <label> {language === "en" ? "₹ 75.00" : "₹ ७५.००"}</label> */}
                  <span>₹ {applicationDetails?.paymentDao?.amount}</span>
                </td>
                <td className={styles.tableData2}>
                  {/* <label> {language === "en" ? "₹ 75.00" : "₹ ७५.००"}</label> */}
                  <span>₹ {applicationDetails?.paymentDao?.amount}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1} colSpan={1}>
                  <label>{<FormattedLabel id='totalAmount' />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  {/* <label> {language === "en" ? "₹ 75.00" : "₹ ७५.००"}</label> */}
                  <span>₹ {applicationDetails?.paymentDao?.amount}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='amountInWords' />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span style={{ textTransform: 'capitalize' }}>
                    {converter.toWords(
                      applicationDetails?.paymentDao?.amount ?? 0
                    )}{' '}
                    rupees
                  </span>
                </td>
                <td className={styles.tableData1} colSpan={3}>
                  <label style={{ marginBottom: 100 }}>
                    {<FormattedLabel id='receiverSignature' />}:
                  </label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='remark' />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {
                      // @ts-ignore
                      applicationDetails.scrutinyRemark
                    }
                  </span>
                </td>
                <td className={styles.tableData3} rowSpan={3} colSpan={2}></td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='printDateAndTime' />}: </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{moment(new Date()).format('DD-MM-YYYY HH:mm')}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='printBy' />}: </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {useSelector(
                      (state) =>
                        // @ts-ignore
                        state?.user?.user?.userDao
                    )
                      ? language === 'en'
                        ? printByNameDao.firstNameEn +
                          ' ' +
                          printByNameDao.middleNameEn +
                          ' ' +
                          printByNameDao.lastNameEn
                        : printByNameDao?.firstNameMr +
                          ' ' +
                          printByNameDao?.middleNameMr +
                          ' ' +
                          printByNameDao?.lastNameMr
                      : language === 'en'
                      ? printByNameDao.firstName +
                        ' ' +
                        printByNameDao.middleName +
                        ' ' +
                        printByNameDao.surname
                      : printByNameDao.firstNamemr +
                        ' ' +
                        printByNameDao.middleNamemr +
                        ' ' +
                        printByNameDao.surnamemr}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <div className={styles.divider}></div>
          <div className={styles.customerCopy}>
            <div className={styles.header}>
              <Image src={'/qrcode1.png'} width={60} height={60} />
              <div className={styles.centerHeader}>
                <h1>
                  <FormattedLabel id='pcmc' />
                </h1>
                <div className={styles.row}>
                  <div style={{ display: 'flex', columnGap: 10 }}>
                    <label style={{ fontWeight: 'bold' }}>
                      <FormattedLabel id='fiscalYear' />:
                    </label>
                    <span>{fiscalYear}</span>
                  </div>
                </div>
              </div>
              <Image src={'/logo.png'} width={70} height={70} />
            </div>

            <table className={styles.tableWrap}>
              <tr className={styles.tableRow}>
                <td
                  className={styles.tableData1}
                  style={{ textAlign: 'center' }}
                  colSpan={5}
                >
                  <FormattedLabel id='customerCopy' />
                </td>
              </tr>

              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='receiptNo' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='date' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='relatedTo' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='cfcRefNo' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='cfcCounterNo' />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>
                    {' '}
                    {
                      // @ts-ignore
                      applicationDetails?.paymentDao?.receiptNo
                    }
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {moment(
                      // @ts-ignore
                      applicationDetails?.applicationDate
                    ).format('DD-MM-YYYY')}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === 'en'
                      ? 'Veterinary Management System'
                      : 'पशुवैद्यकीय व्यवस्थापन प्रणाली'}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span></span>
                </td>
                <td className={styles.tableData2}>
                  <span></span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='receivedFrom' />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>{applicationDetails?.paymentDao?.receivedFrom}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='serviceName' />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>
                    {language === 'en'
                      ? 'Opd Registration'
                      : 'बाह्यरुग्ण विभाग नोंदणी'}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='narration' />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>
                    {language === 'en'
                      ? 'Regarding Opd Registration Fee'
                      : 'बाह्यरुग्ण विभाग नोंदणी शुल्क'}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='address' />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  <span>
                    {applicationDetails?.ownerAddress}

                    {/* {
                      // @ts-ignore
                      applicationDetails.addrFlatOrHouseNo
                    }
                    {", "}
                    {
                      // @ts-ignore
                      applicationDetails.addrBuildingName
                    }
                    {", "}
                    {
                      // @ts-ignore
                      applicationDetails.detailAddress
                    } */}
                  </span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='paymentMode' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='rupees' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='bankName' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='chequeNo' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='chequeDate' />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>
                    {
                      // @ts-ignore
                      applicationDetails?.paymentDao?.paymentType
                    }
                  </span>
                </td>
                <td className={styles.tableData2}>
                  {/* <span>{language === "en" ? "₹ 75.00" : "₹ ७५.००"}</span> */}
                  <span>₹ {applicationDetails?.paymentDao?.amount}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {
                      // @ts-ignore
                      applicationDetails?.paymentDao?.bankName
                    }
                  </span>
                </td>
                <td className={styles.tableData2}>
                  {/* <span>01/02/2023</span> */}
                </td>
                <td className={styles.tableData2}>
                  {/* <span>State Bank of India</span> */}
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='referenceNo' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='date' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='details' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='payableAmount' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='receivedAmount' />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  <span>
                    {
                      // @ts-ignore
                      applicationDetails?.casePaperNo
                    }
                  </span>
                </td>
                <td className={styles.tableData2}>
                  <span>{moment(new Date()).format('DD-MM-YYYY')}</span>
                </td>
                <td className={styles.tableData2}>
                  <span>
                    {language === 'en'
                      ? 'Opd bill payment'
                      : 'ओपीडी बिल पेमेंट'}
                  </span>
                </td>
                <td className={styles.tableData2}>
                  {/* <span>{language === "en" ? "₹ 75.00" : "₹ ७५.००"}</span> */}
                  <span>₹ {applicationDetails?.paymentDao?.amount}</span>

                  <br />
                </td>
                <td className={styles.tableData2}>
                  {/* <span>{language === "en" ? "₹ 75.00" : "₹ ७५.००"}</span> */}
                  <span>₹ {applicationDetails?.paymentDao?.amount}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='payableAmount' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='rebateAmount' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='advanceAmount' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='actualPayableAmount' />}</label>
                </td>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='receivedAmount' />}</label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData2}>
                  {/* <label> {language === "en" ? "₹ 75.00" : "₹ ७५.००"}</label> */}
                  <span>₹ {applicationDetails?.paymentDao?.amount}</span>
                </td>
                <td className={styles.tableData2}>
                  {/* <label>Rebate Amount/सूट रक्कम</label> */}
                </td>
                <td className={styles.tableData2}>
                  {/* <label>Advance Amount/आगाऊ रक्कम</label> */}
                </td>
                <td className={styles.tableData2}>
                  {/* <label> {language === "en" ? "₹ 75.00" : "₹ ७५.००"}</label> */}
                  <span>₹ {applicationDetails?.paymentDao?.amount}</span>
                </td>
                <td className={styles.tableData2}>
                  {/* <label> {language === "en" ? "₹ 75.00" : "₹ ७५.००"}</label> */}
                  <span>₹ {applicationDetails?.paymentDao?.amount}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1} colSpan={1}>
                  <label>{<FormattedLabel id='totalAmount' />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={4}>
                  {/* <label> {language === "en" ? "₹ 75.00" : "₹ ७५.००"}</label> */}
                  <span>₹ {applicationDetails?.paymentDao?.amount}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='amountInWords' />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span style={{ textTransform: 'capitalize' }}>
                    {converter.toWords(
                      applicationDetails?.paymentDao?.amount ?? 0
                    )}{' '}
                    rupees{' '}
                  </span>
                </td>
                <td className={styles.tableData1} colSpan={3}>
                  <label style={{ marginBottom: 100 }}>
                    {<FormattedLabel id='receiverSignature' />}:
                  </label>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='remark' />}:</label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {
                      // @ts-ignore
                      applicationDetails.scrutinyRemark
                    }
                  </span>
                </td>
                <td className={styles.tableData3} rowSpan={3} colSpan={2}></td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='printDateAndTime' />}: </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>{moment(new Date()).format('DD-MM-YYYY HH:mm')}</span>
                </td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={styles.tableData1}>
                  <label>{<FormattedLabel id='printBy' />}: </label>
                </td>
                <td className={styles.tableData3} colSpan={2}>
                  <span>
                    {useSelector((state) => state?.user?.user?.userDao)
                      ? language === 'en'
                        ? printByNameDao.firstNameEn +
                          ' ' +
                          printByNameDao.middleNameEn +
                          ' ' +
                          printByNameDao.lastNameEn
                        : printByNameDao?.firstNameMr +
                          ' ' +
                          printByNameDao?.middleNameMr +
                          ' ' +
                          printByNameDao?.lastNameMr
                      : language === 'en'
                      ? printByNameDao.firstName +
                        ' ' +
                        printByNameDao.middleName +
                        ' ' +
                        printByNameDao.surname
                      : printByNameDao.firstNamemr +
                        ' ' +
                        printByNameDao.middleNamemr +
                        ' ' +
                        printByNameDao.surnamemr}
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className={styles.buttons}>
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
              isDeptUser
                ? router.push(
                    `/veterinaryManagementSystem/transactions/opd/clerk`
                  )
                : router.push(`/dashboard`)
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

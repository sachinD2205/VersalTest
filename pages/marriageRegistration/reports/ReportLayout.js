import React from 'react'
import Image from 'next/image'
// import styles from '../../styles/reusableComponents/ReportsLayout.module.css'
import styles from './ReportsLayout.module.css'
import { useSelector } from 'react-redux'
import moment from 'moment'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
// import FormattedLabel from './FormattedLabel'

const Index = ({
  date = { from: '', to: '' },
  centerHeader = false,
  centerData = false,
  showDates = false,
  columns = [],
  rows = [],
  customReportName = { en: '', mr: '' },
  customDeptName = { en: '', mr: '' },
  columnLength = 0,
  children = <></>,
  extraRows = <></>,
  componentRef,
  style = {},
}) => {
  // @ts-ignore
  const language = useSelector((state) => state?.labels?.language)

  const printedBy = useSelector((state) =>
    // @ts-ignore
    state?.user?.user?.userDao
      ? language === 'en'
        ? // @ts-ignore
          state?.user?.user?.userDao?.firstNameEn +
          ' ' +
          // @ts-ignore
          state?.user?.user?.userDao?.middleNameEn +
          ' ' +
          // @ts-ignore
          state?.user?.user?.userDao?.lastNameEn
        : // @ts-ignore
          state?.user?.user?.userDao?.firstNameMr +
          ' ' +
          // @ts-ignore
          state?.user?.user?.userDao?.middleNameMr +
          ' ' +
          // @ts-ignore
          state?.user?.user?.userDao?.lastNameMr
      : language === 'en'
      ? // @ts-ignore
        state?.user?.user?.firstName +
        ' ' +
        // @ts-ignore
        state?.user?.user?.middleName +
        ' ' +
        // @ts-ignore
        state?.user?.user?.surname
      : // @ts-ignore
        state?.user?.user?.firstNamemr +
        ' ' +
        // @ts-ignore
        state?.user?.user?.middleNamemr +
        ' ' +
        // @ts-ignore
        state?.user?.user?.surnamemr
  )
  const reportName = useSelector((state) =>
    // @ts-ignore
    state?.user?.user?.menus?.find(
      (menu) =>
        menu.id == Number(localStorage.getItem('selectedMenuFromDrawer'))
    )
  )

  const deptName = useSelector((state) =>
    // @ts-ignore
    state?.user?.user?.applications?.find(
      // @ts-ignore
      (dept) => dept.id == state?.user?.selectedApplicationId
    )
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.subWrapper} style={style} ref={componentRef}>
        <div>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <td
                  colSpan={columns.length > 1 ? columns.length : columnLength}
                >
                  {/* Header */}
                  <div className={styles.row}>
                    <Image
                      src='/logo.png'
                      alt='PCMC Logo'
                      width={80}
                      height={80}
                      objectFit='contain'
                    />
                    <div className={styles.middleHeader}>
                      <h2>
                        {language == 'en'
                          ? 'Pimpri-Chinchwad Municipal Corporation'
                          : 'पिंपरी चिंचवड महानगरपालिका'}
                      </h2>

                      <h3>
                        {language == 'en'
                          ? 'Mumbai-Pune Road, Pimpri - 411018'
                          : 'मुंबई-पुणे रोड, पिंपरी - ४११ ०१८'}
                      </h3>
                    </div>
                    <Image
                      src='/smartCityPCMC.png'
                      alt='Pimpri Smart City'
                      width={110}
                      height={60}
                      objectFit='contain'
                    />
                  </div>

                  {/* Sub-Header 1 */}
                  <div className={styles.subHeader}>
                    <h3>
                      {language == 'en' ? 'Department Name' : 'विभागाचे नाव'}:{' '}
                      <b>
                        {/* {language == 'en'
                          ? deptName?.applicationNameEng ?? ''
                          : deptName?.applicationNameMr ?? ''} */}
                        {language == 'en'
                          ? customDeptName.en != ''
                            ? customDeptName.en
                            : deptName?.applicationNameEng
                          : customDeptName.mr != ''
                          ? customDeptName.mr
                          : deptName?.applicationNameMr}
                      </b>
                    </h3>
                    <h3>
                      {language == 'en' ? 'Report Name' : 'अहवालाचे नाव'}:{' '}
                      <b>
                        {language == 'en'
                          ? customReportName.en != ''
                            ? customReportName.en
                            : reportName?.menuNameEng
                          : customReportName.mr != ''
                          ? customReportName.mr
                          : reportName?.menuNameMr}
                      </b>
                    </h3>
                  </div>

                  {/* Sub-Header 2 */}
                  {showDates && (
                    <div className={styles.row}>
                      <h3>
                        {language == 'en' ? 'From Date' : 'या तारखेपासून'}:{' '}
                        <b>{date.from}</b>
                      </h3>
                      <h3>
                        {language == 'en' ? 'To Date' : 'या तारखेपर्यंत'}:{' '}
                        <b>{date.to}</b>
                      </h3>
                    </div>
                  )}
                </td>
              </tr>
            </thead>
            <div className={styles.tableBody}>
              {columns.length == 0 ? (
                <>{children}</>
              ) : (
                <tbody>
                  <tr className={styles.tableHeaders}>
                    {columns.map((obj, i) => (
                      <td
                        key={i}
                        style={{
                          textAlign: centerHeader ? 'center' : 'start',
                          width: obj.width,
                          maxWidth: obj.width,
                        }}
                      >
                        {obj.formattedLabel ? (
                          <FormattedLabel id={obj.formattedLabel} />
                        ) : (
                          obj.headerName
                        )}
                      </td>
                    ))}
                  </tr>
                  {rows.length == 0 ? (
                    <tr>
                      <td
                        className={styles.tableData}
                        colSpan={
                          columns.length > 1 ? columns.length : columnLength
                        }
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        {language == 'en' ? 'No Data' : 'माहिती उपलब्ध नाही'}
                      </td>
                    </tr>
                  ) : (
                    <>
                      {rows.map((rowData, index) => (
                        <tr key={index}>
                          {columns.map((column) => (
                            <td
                              className={styles.tableData}
                              style={{
                                textAlign: centerData ? 'center' : 'start',
                              }}
                            >
                              {rowData[column.field] ?? ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {extraRows}
                    </>
                  )}
                </tbody>
              )}
            </div>

            <tfoot className={styles.tableFooter}>
              <tr>
                <td
                  className={styles.row}
                  colSpan={columns.length > 1 ? columns.length : columnLength}
                >
                  {/* Footer */}
                  <h3>
                    {language == 'en' ? 'Printed By' : 'छापनार्याचे नाव'}:{' '}
                    <b>{printedBy}</b>
                  </h3>

                  <h3>
                    {language == 'en'
                      ? 'Print Date and Time'
                      : 'छापतांना तारीख आणि वेळ'}
                    : <b>{moment(new Date()).format('DD-MM-YYYY HH:mm')}</b>
                  </h3>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Index

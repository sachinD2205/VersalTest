import React, { useEffect, useState } from 'react'
import styles from '../../depositRefundProcess/deposit.module.css'
import { useLanguage } from '../../../../../containers/reuseableComponents/CustomHooks'
import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import { Button, TextField } from '@mui/material'

const Index = ({
  tableData,
  applicationSearchFn,
  pagination = { size: [5, 10], pages: 1 },
  showFooter = false,
  showHeader = false,
}) => {
  const language = useLanguage()

  const [pageCount, setPageCount] = useState(pagination?.size[0])
  const [applicationNo, setApplicationNo] = useState('')

  const [showTableData, setShowTableData] = useState([])

  useEffect(() => {
    //Sets Table Data
    setShowTableData(
      tableData?.filter((obj, i) =>
        !!applicationNo
          ? obj?.applicationNumber?.includes(applicationNo)
          : showFooter
          ? i < pageCount
          : obj
      )
    )
  }, [tableData, pageCount, applicationNo])

  return (
    <>
      <table className={styles.table}>
        <tbody>
          {showHeader && (
            <tr>
              <td colSpan={5}>
                <div className={styles.searchBar}>
                  <FormattedLabel id='searchByApplicationNumber' bold />
                  <b>:</b>
                  <TextField
                    sx={{ width: 325 }}
                    variant='standard'
                    placeholder='Enter application number'
                    onChange={(e) => {
                      setApplicationNo(e.target.value)
                    }}
                  />
                </div>
              </td>
            </tr>
          )}
          <tr>
            <th style={{ width: 100 }}>
              <FormattedLabel id='srNo' />
            </th>
            <th style={{ width: 250 }}>
              <FormattedLabel id='applicationNumber' />
            </th>
            <th style={{ width: 250 }}>
              <FormattedLabel id='serviceName' />
            </th>
            <th style={{ width: 175 }}>
              <FormattedLabel id='amount' />
            </th>
            <th>
              <FormattedLabel id='action' />
            </th>
          </tr>
          {showTableData?.length > 0 ? (
            showTableData?.map((j, i) => (
              <tr>
                <td
                  style={{
                    textAlign: 'center',
                    width: 75,
                  }}
                >
                  {i + 1}
                </td>
                <td
                  style={{
                    width: 250,
                  }}
                >
                  {j?.applicationNumber}
                </td>
                <td
                  style={{
                    width: 450,
                  }}
                >
                  {language == 'en' ? j?.serviceName : j?.serviceNameMr}
                </td>
                <td
                  style={{
                    width: 225,
                    fontWeight: !!j?.amount ? 'inherit' : 'bold',
                  }}
                >
                  {language == 'en'
                    ? j?.amount
                      ? 'Rs. ' + j?.amount
                      : 'No Amount Found'
                    : j?.amount
                    ? '₹. ' + j?.amount
                    : 'कोणतीही रक्कम आढळली नाही'}
                </td>
                <td>
                  <Button
                    variant='contained'
                    onClick={() =>
                      applicationSearchFn({
                        applicationNumber: j?.applicationNumber,
                      })
                    }
                  >
                    <FormattedLabel id='viewApplication' />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                <FormattedLabel id='noApplicationsFound' bold />
              </td>
            </tr>
          )}
          {showFooter && (
            <tr>
              <td colSpan={5} className={styles.pagination}>
                <b>
                  <FormattedLabel id='showFirst' />
                </b>
                <select
                  className={styles.size}
                  onChange={(e) => {
                    setPageCount(e.target.value)
                  }}
                >
                  {pagination?.size?.map((count) => (
                    <option value={count}>{count}</option>
                  ))}
                </select>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

export default Index

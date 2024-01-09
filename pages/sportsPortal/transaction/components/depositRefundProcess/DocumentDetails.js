import React, { useEffect } from 'react'
import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import { useForm } from 'react-hook-form'
import styles from '../../depositRefundProcess/deposit.module.css'

import { useLanguage } from '../../../../../containers/reuseableComponents/CustomHooks'
import UploadButton from '../../../../../containers/reuseableComponents/UploadButton'

const DocumentDetails = ({ data }) => {
  const language = useLanguage()

  const { reset } = useForm({
    criteriaMode: 'all',
  })

  useEffect(() => {
    reset(data)
  }, [data])

  return (
    <>
      <div className={styles.subTitle}>
        <FormattedLabel id='documentDetails' />
      </div>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th style={{ width: 100 }}>
              <FormattedLabel id='srNo' />
            </th>
            <th style={{ width: 500 }}>
              <FormattedLabel id='documentName' />
            </th>
            <th>
              <FormattedLabel id='action' />
            </th>
          </tr>
          {data?.attachmentList?.length > 0 ? (
            data?.attachmentList?.map((doc, i) => (
              <tr key={doc?.id}>
                <td
                  style={{
                    textAlign: 'center',
                    width: 75,
                  }}
                >
                  {i + 1}
                </td>
                <td style={{ width: 400 }}>
                  {language == 'en'
                    ? doc?.documentChecklistEn
                    : doc?.documentChecklistMr}
                </td>
                <td>
                  <UploadButton
                    appName='SP'
                    serviceName='SP-SPORTSBOOKING'
                    filePath={doc?.filePath}
                    fileUpdater={() => {}}
                    readOnly
                    view
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>
                <FormattedLabel id='noFileFound' bold />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

export default DocumentDetails

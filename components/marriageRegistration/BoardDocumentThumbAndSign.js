//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/cleark/applicationDtlAndDoc
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import styles from './documentUpload.module.css'

const Index = () => {
  const router = useRouter()
  let appName = 'MR'
  let serviceName = 'M-MBR'
  let pageMode = router?.query?.pageMode

  useEffect(() => {
    console.log('router?.query?.pageMode', router?.query?.pageMode)
  }, [])

  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useFormContext({
    defaultValues: {
      gPhoto: null,
    },
  })

  //docdument
  const user = useSelector((state) => state?.user)

  // const { fields } = useFieldArray({
  // control, // control props comes from useForm (optional: if you are using FormContext)
  // name: 'documents', // unique name for your Field Array
  // })

  return (
    <>
      <form /* onSubmit={handleSubmit(onSubmitForm)} */>
        <div className={styles.small}>
          <h4
            style={{
              marginLeft: '40px',
              color: 'red',
              fontStyle: 'italic',
              marginTop: '25px',
            }}
          >
            {/* {<FormattedLabel id="onlyMHR" />} */}
          </h4>
          {/* <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: 'white',
                  marginTop: '7px',
                }}
              >
                {<FormattedLabel id="documentsUpload" />}
              </h3>

              <h5
                style={{
                  color: 'white',
                  marginTop: '10px',
                  marginLeft: '5px',
                }}
              >
                {<FormattedLabel id="docFormat" />}
              </h5>
            </div>
          </div> */}
          {/* <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: 'white',
                  marginTop: '6px',
                }}
              >
                Photo and Thumb Upload
              </h3>
            </div>
          </div>
          <div className={styles.row2} style={{ marginLeft: '160px' }}>
            <div className={styles.srow2}>
              <Typography>Board's Head Person Photo</Typography>
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues('boardHeadPersonPhoto')}
                fileKey={'boardHeadPersonPhoto'}
                // showDel={true}
                showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
            </div>
            <div className={styles.srow2}>
              <Typography> Board's Head Person Thumb Impression</Typography>
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues('boardHeadPersonThumbImpression')}
                fileKey={'boardHeadPersonThumbImpression'}
                // showDel={true}
                showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
            </div>
          </div> */}
        </div>
      </form>
    </>
  )
}

export default Index

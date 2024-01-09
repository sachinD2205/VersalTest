import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import sweetAlert from 'sweetalert'

import newLabels from './newLabels'

const FormattedLabel = ({
  id,
  required = false,
  bold = false,
  textCase = '',
}) => {
  const router = useRouter()
  const path = router.asPath.split('/')

  // @ts-ignore
  const language = useSelector((state) => state?.labels.language)

  const [value, setValue] = useState('')

  useEffect(() => {
    findLabel()
  }, [language, id])

  function findLabel() {
    if (newLabels[path[1]]) {
      setValue(newLabels[path[1]][language][id])
    } else {
      sweetAlert(
        'Error',
        'The module you are working upon is not registered in the labels file or named incorrectly which may result in improper displaying of english/marathi labels.  Please check and try again.',
        'error'
      )
    }
  }
  return (
    <>
      <span
        style={{
          fontWeight: bold ? 'bold' : 'inherit',
          textTransform: !!textCase ? textCase : 'none',
        }}
      >
        {value + ' '}
      </span>
      {required && <span style={{ color: 'red', fontWeight: 'bold' }}>*</span>}
    </>
  )
}

export default FormattedLabel

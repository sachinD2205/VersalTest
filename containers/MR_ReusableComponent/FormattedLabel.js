import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

const FormattedLabel = ({ id }) => {
  const router = useRouter()
  // @ts-ignore
  const labels = useSelector((state) => state?.labels.labels)
  // @ts-ignore
  const language = useSelector((state) => state?.labels.language)

  const path = router.asPath.split('/')[2]

  const [value, setValue] = useState('')

  useEffect(() => {
    FindLabel()
  }, [language])

  function FindLabel() {
    labels.forEach((element) => {
      if (element.lang === language) {
        if (element.formType === path) {
          setValue(element[id])
        }
      }
    })
  }

  return <>{value}</>
}

export default FormattedLabel

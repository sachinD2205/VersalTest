import React from 'react'
import SiteVisit from "../../../../components/pTax/components/SiteVisit"
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ThemeProvider } from '@mui/material';
import theme from "../../../../theme"

const Index = () => {
  const methods = useForm({
    resolver: yupResolver(),
    defaultValues: {}
  })
  const {
    register,
    getValues,
    setValue,
    clearErrors,
    trigger,
    handleSubmit,
    methos,
    watch,
    reset,
    formState: { errors },
  } = methods



  const handleNext = () => {

  }

  //! useEffects 




  //! view  ===================> 
  return (
    <div>
      <ThemeProvider theme={theme}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleNext)}>
            <SiteVisit />
          </form >
        </FormProvider>
      </ThemeProvider>
    </div>
  )
}

export default Index
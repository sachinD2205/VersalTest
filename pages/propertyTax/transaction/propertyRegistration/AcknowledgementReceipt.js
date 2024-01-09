import React from 'react'
import AcknowledementReceipt from "../components/AcknowledementReceipt"
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleNext)}>
          <AcknowledementReceipt />
        </form >
      </FormProvider>
    </div>

  )
}

export default Index
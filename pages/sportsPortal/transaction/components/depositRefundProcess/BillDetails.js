import React, { useEffect } from 'react'
import router from 'next/router'
import { FormControl, FormHelperText, TextField } from '@mui/material'
import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import { Controller, useForm } from 'react-hook-form'
import styles from '../../depositRefundProcess/deposit.module.css'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useLanguage } from '../../../../../containers/reuseableComponents/CustomHooks'

const BillDetails = ({ data, sendBackRemark }) => {
  const language = useLanguage()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    // resolver: yupResolver(schema),
  })

  useEffect(() => {
    reset({
      billDate: data?.paymentCollection?.receiptDate,
    })
  }, [data])

  return (
    <>
      <div className={styles.subTitle}>
        <FormattedLabel id='billDetails' />
      </div>
      <div
        className={styles.fieldsWrapper}
        style={{ justifyContent: 'space-between', padding: '0px 20px' }}
      >
        {/* <TextField
          disabled
          sx={{ width: 250 }}
          label={<FormattedLabel id="notesheetOrReferenceNo" />}
          // @ts-ignore
          variant="standard"
          {...register("notesheetOrReferenceNo")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("notesheetOrReferenceNo"),
          }}
          error={!!error.notesheetOrReferenceNo}
          helperText={
            error?.notesheetOrReferenceNo
              ? error.notesheetOrReferenceNo.message
              : null
          }
        /> */}

        <FormControl error={!!error.billDate}>
          <Controller
            control={control}
            name='billDate'
            defaultValue={null}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  disableFuture
                  disabled
                  inputFormat='dd/MM/yyyy'
                  label={<FormattedLabel id='billDate' />}
                  value={field.value}
                  onChange={(date) => {
                    field.onChange(date)
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: 250 }}
                      {...params}
                      size='small'
                      fullWidth
                      variant='standard'
                      error={!!error.billDate}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />
          <FormHelperText>
            {error?.billDate ? error.billDate.message : null}
          </FormHelperText>
        </FormControl>
        {data?.updateAccess && (
          <TextField
            sx={{ width: 600 }}
            label={<FormattedLabel id='remark' />}
            // @ts-ignore
            variant='standard'
            {...register('remark')}
            onChange={(e) => {
              sendBackRemark(e.target.value)
            }}
            InputLabelProps={{
              shrink: !!router.query.id || !!watch('remark'),
            }}
            error={!!error.remark}
            helperText={
              error?.remark
                ? language == 'en'
                  ? 'Please enter a remark'
                  : 'कृपया शेरा प्रविष्ट करा'
                : null
            }
            required
          />
        )}
      </div>
    </>
  )
}

export default BillDetails

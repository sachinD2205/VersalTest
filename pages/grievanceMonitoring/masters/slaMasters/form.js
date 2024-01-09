import { yupResolver } from '@hookform/resolvers/yup'
import ClearIcon from '@mui/icons-material/Clear'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SaveIcon from '@mui/icons-material/Save'
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Paper,
  Select,
  TextField,
} from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import sweetAlert from 'sweetalert'
import urls from '../../../../URLS/urls'

import styles from '../complaintTypeMasters/view.module.css'
const Form = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    // resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const [btnSaveText, setBtnSaveText] = useState('Save')
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [businessTypes, setBusinessTypes] = useState([])
  const router = useRouter()
  const [activeStep, setActiveStep] = useState()
  const [checked, setChecked] = useState(true)
  //   const steps = getSteps();
  const dispach = useDispatch()

  const editRecord = (rows) => {
    setBtnSaveText('Update'),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true)
    reset(rows)
  }

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // const fromDate = new Date(fromData.fromDate).toISOString();
    // const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      //   fromDate,
      //   toDate,
    }
    if (btnSaveText === 'Save') {
      axios
        .post(
          `${urls.BaseURL}/businessSubType/saveBusinessSubType`,
          finalBodyForApi,
        )
        .then((res) => {
          if (res.status == 201) {
            sweetAlert('Saved!', 'Record Saved Successfully !', 'success')
            getBusinesSubType()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })
    } else if (btnSaveText === 'Update') {
      axios
        .post(
          `${urls.BaseURL}/businessSubType/saveBusinessSubType`,
          finalBodyForApi,
        )
        .then((res) => {
          if (res.status == 201) {
            sweetAlert('Updated!', 'Record Updated Successfully !', 'success')
            getBusinesSubType()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })
    }
  }

  const deleteById = (value) => {
    swal({
      title: 'Delete?',
      text: 'Are You Sure You Want To Delete This Record ? ',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.BaseURL}/businessSubType/discardBusinessSubType/${value}`,
          )
          .then((res) => {
            if (res.status == 226) {
              swal('Record Is Successfully Deleted!', {
                icon: 'success',
              })
              setButtonInputState(false)
              //getcast();
            }
          })
      } else {
        swal('Record Is Safe')
      }
    })
  }

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    subject: '',
    description: '',
    id: null,
  }

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    complaintType: '',
    businessSubType: '',
    businessSubTypePrefix: '',
    remark: '',
    id: null,
  }
  const handleNext = (data) => {
    dispach(addIsssuanceofHawkerLicense(data))
    console.log(data)
    if (activeStep == steps.length - 1) {
      fetch('https://jsonplaceholder.typicode.com/comments')
        .then((data) => data.json())
        .then((res) => {
          console.log(res)
          setActiveStep(activeStep + 1)
        })
    } else {
      setActiveStep(activeStep + 1)
    }
  }

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }
  // View
  return (
    <>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        {/* {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >  */}

        <div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className={styles.small}>
                <div className={styles.row}>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: 120 }}
                      error={!!errors.complaintType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Department Name
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Department Name"
                          >
                            {/* {departmentNames &&
                                    departmentNames.map((departmentName, index) => (
                                      <MenuItem
                                        key={index}
                                        value={departmentName.id}
                                      >
                                        {departmentName.departmentName}
                                      </MenuItem>
                                    ))} */}
                          </Select>
                        )}
                        name="departmentName"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.departmentName
                          ? errors.departmentName.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: 120 }}
                      error={!!errors.subDepartmentName}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Sub Department Name
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Sub Department Name"
                          >
                            {/* {subDepartmentNames &&
                                    subDepartmentNames.map((subDepartmentName, index) => (
                                      <MenuItem
                                        key={index}
                                        value={subDepartmentName.id}
                                      >
                                        {subDepartmentName.subDepartmentName}
                                      </MenuItem>
                                    ))} */}
                          </Select>
                        )}
                        name="subDepartmentName"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.subDepartmentName
                          ? errors.subDepartmentName.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: 120 }}
                      error={!!errors.complaintType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Complaint Type
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Complaint Name"
                          >
                            {/* {complaintTypes &&
                                    complaintTypes.map((complaintType, index) => (
                                      <MenuItem
                                        key={index}
                                        value={complaintType.id}
                                      >
                                        {complaintType.complaintType}
                                      </MenuItem>
                                    ))} */}
                          </Select>
                        )}
                        name="complaintType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.complaintType
                          ? errors.complaintType.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: 120 }}
                      error={!!errors.complaintSubType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Complaint Sub Type
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Complaint Sub Type"
                          >
                            {/* {complaintSubTypes &&
                                    complaintSubTypes.map((complaintSubType, index) => (
                                      <MenuItem
                                        key={index}
                                        value={complaintSubType.id}
                                      >
                                        {complaintSubType.complaintSubType}
                                      </MenuItem>
                                    ))} */}
                          </Select>
                        )}
                        name="complaintSubType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.complaintSubType
                          ? errors.complaintSubType.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: 120 }}
                      error={!!errors.zone}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Zone
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Complaint Name"
                          >
                            {/* {zones &&
                                    zones.map((zone, index) => (
                                      <MenuItem
                                        key={index}
                                        value={zone.id}
                                      >
                                        {zone.zone}
                                      </MenuItem>
                                    ))} */}
                          </Select>
                        )}
                        name="zone"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.zone ? errors.zone.message : null}
                      </FormHelperText>
                    </FormControl>
                  </div>

                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: 120 }}
                      error={!!errors.ward}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Ward
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Ward"
                          >
                            {/* {wards &&
                                    wards.map((ward, index) => (
                                      <MenuItem
                                        key={index}
                                        value={ward.id}
                                      >
                                        {ward.ward}
                                      </MenuItem>
                                    ))} */}
                          </Select>
                        )}
                        name="ward"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.ward ? errors.ward.message : null}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: 120 }}
                      error={!!errors.employeeName}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Employee Name
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Employee Name"
                          >
                            {/* {employeeNames &&
                                    employeeNames.map((employeeName, index) => (
                                      <MenuItem
                                        key={index}
                                        value={employeeName.id}
                                      >
                                        {employeeName.employeeName}
                                      </MenuItem>
                                    ))} */}
                          </Select>
                        )}
                        name="employeeName"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.employeeName
                          ? errors.employeeName.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: 120 }}
                      error={!!errors.designation}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Designation
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Designation"
                          >
                            {/* {designations &&
                                    designations.map((designation, index) => (
                                      <MenuItem
                                        key={index}
                                        value={designation.id}
                                      >
                                        {designation.designation}
                                      </MenuItem>
                                    ))} */}
                          </Select>
                        )}
                        name="designation"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.designation
                          ? errors.designation.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <TextField
                      required
                      autoFocus
                      type="number"
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Days allocation to employee"
                      variant="standard"
                      {...register('daysAllocation')}
                      error={!!errors.daysAllocation}
                      helperText={
                        errors?.daysAllocation
                          ? errors.daysAllocation.message
                          : null
                      }
                    />
                  </div>
                  <div>
                    <TextField
                      required
                      autoFocus
                      sx={{ width: 250 }}
                      type="text"
                      id="standard-basic"
                      label="Employee scrutiny level"
                      variant="standard"
                      {...register('scrutinyLevel')}
                      error={!!errors.scrutinyLevel}
                      helperText={
                        errors?.scrutinyLevel
                          ? errors.scrutinyLevel.message
                          : null
                      }
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <TextField
                      required
                      autoFocus
                      sx={{ width: 250 }}
                      type="text"
                      id="standard-basic"
                      label="Scrutiny labels"
                      variant="standard"
                      {...register('scrutinyLabels')}
                      error={!!errors.scrutinyLabels}
                      helperText={
                        errors?.scrutinyLabels
                          ? errors.scrutinyLabels.message
                          : null
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={styles.btn}>
                <br />
                <br />
                <Button
                  sx={{ marginRight: 4 }}
                  type="submit"
                  variant="contained"
                  color="success"
                  endIcon={<SaveIcon />}
                >
                  {btnSaveText}
                </Button>{' '}
                <Button
                  sx={{ marginRight: 4 }}
                  variant="contained"
                  color="primary"
                  endIcon={<ClearIcon />}
                  onClick={() => cancellButton()}
                >
                  Clear
                </Button>
                <Button
                  sx={{ marginRight: 4 }}
                  variant="contained"
                  color="error"
                  endIcon={<ExitToAppIcon />}
                  onClick={() => {
                    router.push({
                      pathname:
                        '/grievanceMonitoring/masters/complaintSubTypeMasters/',
                    })
                  }}
                >
                  Exit
                </Button>
                {/* <Button
                       
                  variant='contained'
                  color='primary'
                  // onClick={handleNext}
                  type='submit'
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>       */}
              </div>
            </form>
          </FormProvider>
        </div>
        {/* </Slide> */}
        {/* )} */}
        {/* <div className={styles.addbtn}>
  <Button
     variant="contained"
     endIcon={<AddIcon />}
     type="primary"
     disabled={buttonInputState}
     onClick={() => {
       reset({
         ...resetValuesExit,
       });
       setEditButtonInputState(true);
       setDeleteButtonState(true);
       setBtnSaveText("Save");
       setButtonInputState(true);
       setSlideChecked(true);
       setIsOpenCollapse(!isOpenCollapse);
     }}
   >
     Add{" "}
   </Button>
 </div>  */}
      </Paper>
      {/* </BasicLayout> */}
    </>
  )
}

export default Form

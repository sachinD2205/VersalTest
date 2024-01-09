import { yupResolver } from '@hookform/resolvers/yup'
import ClearIcon from '@mui/icons-material/Clear'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
// import { GoogleApiWrapper, Map, Marker } from 'google-maps-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import sweetAlert from 'sweetalert'
// import { addIsssuanceofHawkerLicense } from '../../../../components/redux/features/isssuanceofHawkerLicenseSlice'
import UploadButton from '../../components/marriageRegistration/DocumentsUploadMB'
import urls from '../../URLS/urls'
import styles from '../../components/grievanceMonitoring/styles/view.module.css'
import { Map } from '@mui/icons-material'
const ComplaintDetails = () => {
  let documentsUpload = null
  let appName = 'MR'
  let serviceName = 'M-MBR'
  let applicationFrom = 'Web'
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext({
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
  // const steps = getSteps();
  const dispach = useDispatch()
  const [mediaNames, setMediaNames] = useState([])
  const [latitude, setLatitude] = useState()
  const [longitude, setLongitude] = useState()
  const [name, setName] = useState('React')
  const [showText, setShowText] = useState(false)
  const [showButton, setShowButton] = useState(true)

  useEffect(() => {
    getMediaNames()
    // locateButtons();
    // navigator.geolocation.getCurrentPosition(locateButtons);
  }, [])

  const locateButtons = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude)
      setLongitude(position.coords.longitude)
      // setShowText(true);
    })
  }
  const showDiv = () => {
    setShowText(true)
    setShowButton(false)
    locateButtons()
  }
  const getMediaNames = () => {
    axios.get(`${urls.BaseURL}/mediaMaster/getMediaMasterData`).then((res) => {
      setMediaNames(
        res.data.map((r, i) => ({
          mediaId: r.id,
          srNo: i + 1,
          mediaName: r.mediaName,
          prefix: r.prefix,
        })),
      )
    })
  }

  const handleFile1 = async (e, labelName) => {
    let formData = new FormData()
    formData.append('file', e.target.files[0])
    axios
      .post(
        `http://localhost:8090/cfc/api/file/upload?appName=${appName}&serviceName=${serviceName}`,
        formData,
      )
      .then((r) => {
        if (r.status == 200) {
          console.log(r.data)
          console.log(r.data.filePath)
          if (labelName === 'documentsUpload') {
            console.log('File path sapadala Ka---?>', r.data.filePath)
            setValue('documentsUpload', r.data.filePath)
          }
        } else {
          sweetAlert('Error')
        }
      })
  }
  const editRecord = (rows) => {
    setBtnSaveText('Update'),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true)
    reset(rows)
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
    fromDate: null,
    toDate: null,
    businessType: '',
    businessSubType: '',
    businessSubTypePrefix: '',
    remark: '',
  }

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    businessType: '',
    businessSubType: '',
    businessSubTypePrefix: '',
    remark: '',
    id: null,
  }
  const mapStyles = {
    width: 200,
    height: 160,
    position: 'static',
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
      <div>
        <div className={styles.small}>
          <div className={styles.row}>
            <div>
              <TextField
                autoFocus
                sx={{ width: 250 }}
                id="standard-basic"
                label="Subject"
                variant="standard"
                {...register('subject')}
                error={!!errors.subject}
                helperText={errors?.subject ? errors.subject.message : null}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <label>Complaint Description</label>
              <br />
              <TextField
                multiline
                minRows={2}
                maxRows={2}
                style={{ width: 250, resize: 'vertical', overflow: 'auto' }}
                autoFocus
                sx={{ width: 250 }}
                maxlength="50"
                id="standard-basic"
                // label="Complaint Description"
                variant="outlined"
                {...register('complaintDescription')}
                error={!!errors.complaintDescription}
                helperText={
                  errors?.complaintDescription
                    ? errors.complaintDescription.message
                    : null
                }
              />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <FormControl
                variant="standard"
                sx={{ minWidth: 120 }}
                error={!!errors.mediaName}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Media
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: 250 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Media"
                    >
                      {mediaNames &&
                        mediaNames.map((mediaName, index) => (
                          <MenuItem key={index} value={mediaName.mediaId}>
                            {mediaName.mediaName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="mediaId"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.mediaName ? errors.mediaName.message : null}
                </FormHelperText>
              </FormControl>
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <Typography> Upload Image/Document</Typography>
              <UploadButton
                Change={(e) => {
                  handleFile1(e, 'documentsUpload')
                }}
                {...register('documentsUpload')}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <TextField
                autoFocus
                sx={{ width: 250 }}
                id="standard-basic"
                label="Location"
                variant="standard"
                {...register('location')}
                error={!!errors.location}
                helperText={errors?.location ? errors.location.message : null}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div>
              <TextField
                autoFocus
                sx={{ width: 250 }}
                id="standard-basic"
                label="GIS Location"
                variant="standard"
                {...register('gISLocation')}
                error={!!errors.gISLocation}
                helperText={
                  errors?.gISLocation ? errors.gISLocation.message : null
                }
              />

              {/* <div className={styles.btn}> */}
              <br />
              <br />
              {showText ? (
                <div>
                  {/* <Map
                    google={google}
                    zoom={10}
                    style={mapStyles}
                    center={{
                      lat: latitude,
                      lng: longitude,
                    }}
                    // zoom={locations.length === 1 ? 18 : 13}
                    disableDefaultUI={true}
                  >
                    {latitude && (
                      <Marker
                        name={'This is test name'}
                        position={{ lat: latitude, lng: longitude }}
                      />
                    )}
                  </Map> */}
                </div>
              ) : null}

              {showButton ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => showDiv()}
                >
                  Locate
                </Button>
              ) : null}
              {/* </div> */}
            </div>
          </div>
        </div>

        <div className={styles.row}></div>

        <div className={styles.btn}>
          <br />
          <br />

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
                  '/grievanceMonitoring/transactions/newGrievanceRegistration/',
              })
            }}
          >
            Exit
          </Button>
        </div>
      </div>
    </>
  )
}

export default ComplaintDetails
// export default GoogleApiWrapper({
//   apiKey: 'AIzaSyAR6BqYhU-1TrnmRLDWbdOG9alpejmePss',
// })(ComplaintDetails)

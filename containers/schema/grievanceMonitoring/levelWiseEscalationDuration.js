import * as yup from "yup"
import FormattedLabel from "../../reuseableComponents/FormattedLabel"

// schema - validation
let levelWiseEscalationDuration = yup.object().shape({
  level: yup.string().required(<FormattedLabel id='totalLevelsValidation'/>),
  selectedOption: yup.string().required(<FormattedLabel id='selectOptReq'/>),
})

export default levelWiseEscalationDuration

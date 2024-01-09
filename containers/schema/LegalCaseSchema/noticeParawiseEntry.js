import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";


// Concern Department Clerk 
const  parawiseEntryConcernClerk ={
  // issueNo
  issueNo: yup.string().required(<FormattedLabel id="issueNumberValidation" />),

   
  answerInEnglish: yup.string().matches(
    // /^[aA-zZ\s]*$/
    /^[a-zA-Z0-9 .]*$/

    , "Must be only english characters / फक्त इंग्लिश शब्द ").required(
      <FormattedLabel id="enterRemarks" />

    ),


    // answerInMarathi
    answerInMarathi: yup.string().matches(
      // /^[aA-zZ\s]*$/
      /^[\u0900-\u097F0-9\s.]*$/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
  
      ). required(
        <FormattedLabel id="enterRemarks" />
      ),

      


      
    

  };

  export let parawiseRequestLcConcernClerk1 = yup.object().shape({
    parawiseRequestDao: yup.array().of(yup.object().shape(parawiseEntryConcernClerk)),
  });










 

  



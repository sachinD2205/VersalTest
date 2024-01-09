import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let refundDepositSchema = yup.object().shape({
  libraryKey: yup.string().required(<FormattedLabel id="selectLibrary" />),
  membershipNo: yup.string().required(<FormattedLabel id="membershipNo" />),
  bankAccountHolderName: yup
    .string()
    .required(<FormattedLabel id="enterBankAccountHolderName" />),
  // bankaAccountNo: yup.string().required(<FormattedLabel id="enterBankAccountNo" />),
  bankaAccountNo: yup
    .string()
    .required(<FormattedLabel id="enterBankAccountNo" />)
    .matches(
      /^[0-9]{6,20}$/,
      "Invalid Bank account number / अवैध बँक खाते क्रमांक"
    ),
  typeOfBankAccount: yup
    .string()
    .required(<FormattedLabel id="selectBankAccount" />),
  bankNameId: yup.string().required(<FormattedLabel id="selectBankName" />),
  bankAddress: yup.string().required(<FormattedLabel id="enterBankAddress" />),
  ifscCode: yup
    .string()
    .matches(
      /^[A-Z]{4}0[A-Z0-9]{6}$/,
      "Invalid IFSC code. It should have the format: ABCD0123456 / अवैध IFSC कोड. त्याचे स्वरूप असावे: ABCD0123456"
    )
    .required(<FormattedLabel id="enterBankIFSC" />),
  micrCode: yup.string().required(<FormattedLabel id="enterBankMICR" />),
});

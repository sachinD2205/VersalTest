import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let newBookRequestSchema = yup.object().shape({

    zoneKey: yup.string().required(<FormattedLabel id="selectZone" />),
    libraryKey: yup.string().required(<FormattedLabel id="selectLibrary" />),
    bookName: yup.string().required(<FormattedLabel id="enterBookName" />),
    publication: yup.string(),
    language: yup.string(),
    bookClassification: yup.string(),
    bookType: yup.string(),
    bookSubType: yup.string(),
    author: yup.string(),
    bookEdition: yup.string(),
    // publication: yup.string().required(<FormattedLabel id="enterPublication" />),
    // language: yup.string().required(<FormattedLabel id="selectLanguage" />),
    // bookClassification: yup.string().required(<FormattedLabel id="selectBookClassification" />),
    // bookType: yup.string().required(<FormattedLabel id="selectBookType" />),
    // bookSubType: yup.string().required(<FormattedLabel id="selectBookSubType" />),
    // author: yup.string().required(<FormattedLabel id="authorenterAuthor" />),
    // bookEdition: yup.string().required(<FormattedLabel id="enterBookEdition" />),


})
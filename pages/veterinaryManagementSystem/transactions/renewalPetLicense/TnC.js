import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "./vet.module.css";
import URLs from "../../../../URLS/urls";

import FormControl from "@mui/material/FormControl";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Autocomplete,
  Button,
  Checkbox,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import axios from "axios";
import { ExitToApp } from "@mui/icons-material";
import { sortByAsc } from "../../../../containers/reuseableComponents/Sorter";
import Breadcrumb from "../../../../components/common/BreadcrumbComponent";
import Title from "../../../../containers/VMS_ReusableComponents/Title";
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const userToken = useGetToken();

  const [TnC, setTnC] = useState(false);
  const [pet, setPet] = useState("");
  const [petAnimal, setPetAnimal] = useState([]);
  const [loader, setLoader] = useState(false);

  let petSchema = yup.object().shape({
    petAnimalKey: yup.number().required("Please select a pet"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    // @ts-ignore
    methods,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(petSchema),
  });

  useEffect(() => {
    setLoader(true);
    //Get Pet Animals
    axios
      .get(`${URLs.VMS}/mstPetAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setPetAnimal(() => {
          sortByAsc(res.data.mstPetAnimalList, "nameEn");
          return res.data.mstPetAnimalList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            nameEn: j.nameEn,
            nameMr: j.nameMr,
          }));
        });
        setLoader(false);
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);

        setLoader(false);
      });
  }, []);

  const finalSubmit = (data) => {
    router.push({
      pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/application/view`,
      query: { petAnimal: data.petAnimalKey },
    });
  };

  return (
    <>
      <Head>
        <title>Pet License - Terms and Condition</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        {loader && <Loader />}
        <Title titleLabel={<FormattedLabel id="renewalPetLicense" />} />

        <form onSubmit={handleSubmit(finalSubmit)}>
          <div className={styles.row} style={{ justifyContent: "center" }}>
            {/* <FormControl variant='standard' error={!!error.petAnimalKey}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='petAnimal' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '250px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => {
                      setPet(
                        petAnimal.find((obj) => obj.id === value.target.value)
                          ?.nameEn + ''
                      )
                      field.onChange(value)
                    }}
                    label='petAnimalKey'
                  >
                    {petAnimal &&
                      petAnimal.map((obj) => (
                        <MenuItem key={1} value={obj.id}>
                          {language === 'en' ? obj.nameEn : obj.nameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='petAnimalKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.petAnimalKey ? error.petAnimalKey.message : null}
              </FormHelperText>
            </FormControl> */}
            <FormControl error={!!error?.petAnimalKey}>
              <Controller
                name="petAnimalKey"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  // render={({ field }) => (
                  <Autocomplete
                    variant="standard"
                    id="controllable-states-demo"
                    sx={{ width: 250 }}
                    onChange={(event, newValue) => {
                      onChange(newValue ? newValue?.id : null);
                      setPet(
                        petAnimal.find((obj) => obj?.id === newValue?.id)
                          ?.nameEn
                      );
                    }}
                    value={petAnimal?.find((data) => data?.id == value) || null}
                    options={petAnimal}
                    getOptionLabel={(obj) =>
                      obj[language == "en" ? "nameEn" : "nameMr"]
                    }
                    renderInput={(params) => (
                      <TextField
                        multiline
                        fullWidth
                        {...params}
                        label={<FormattedLabel id="petAnimal" />}
                        variant="standard"
                      />
                    )}
                    disabled={!!router.query.id}
                  />
                )}
              />
              <FormHelperText>
                {error?.petAnimalKey ? error?.petAnimalKey?.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          {pet && (
            <>
              <div className={styles.row}>
                <label className={styles.subHeader}>
                  {language === "en" ? "Terms and Condition" : "नियम व अटी"}
                </label>
              </div>
              {pet == "Dog" && language === "en" && (
                <div className={styles.terms}>
                  <h4>
                    Citizens coming to obtain pet license will be required to
                    follow all general terms , conditions and rules as follows.
                  </h4>
                  1. The legal term of this license is one year from the date of
                  issue of the license and it shall be mandatory to renew it
                  annually.
                  <br /> 2. It shall be mandatory to renew it within 15 days
                  after expiry of License after that penalty of 10 will be
                  levied annually.
                  <br /> 3. License will be issued subject to terms and
                  conditions after payment of fees decided by Hon&#39;ble
                  Municipal Commissioner from time to time.
                  <br /> 4. The license holder shall carry the license obtained
                  with him and shall produce the same on demand by the
                  Hon&#39;ble Municipal Commissioner or the authorized officer
                  appointed by him.
                  <br /> 5. If a dog to which a license has been issued is found
                  to have been bitten or scratched by a fox or any other animal
                  suspected to have been bitten, the holder of such license
                  shall report the matter in writing. The veterinary department
                  of Chinchwad Municipal Corporation should be informed
                  immediately.
                  <br /> 6. If a licensed dog is known or suspected to be
                  neutered, if it has been bitten or scratched by a dog, fox or
                  other animal suspected of being neutered, the licensee shall
                  produce the dog himself for examination at the Veterinary
                  Hospital or alternatively The licensee shall at his own cost
                  keep the said dog under the supervision of the animal clinic
                  for such period as may be necessary.
                  <br /> 7. If the veterinary officer is of the opinion that the
                  dog which has been licensed and is crushed, further action
                  will be taken by the municipality.
                  <br /> 8. Rabies vaccination of dogs shall remain compulsory.
                  <br /> 9. The license holder should not let the dog loose in
                  public places or on the road. Also, if the license holder
                  feels that the dog is likely to cause injury to others, he
                  should take care to muzzle the said dog.
                  <br /> 10. In terms of public health and environment, the
                  license holder should take care that his dog does not create
                  any kind of dirt, otherwise according to Hon&#39;ble Municipal
                  Assembly Resolution No. 728 dated 18/11/2021, the dog owner
                  will be charged Rs. 500 Only) so much penalty will be imposed
                  . <br />
                  11. Do not leave your dog (unchained) in public places,
                  crowded and traffic places, in public gardens. Also, you
                  should take care not to disturb the citizens by barking or
                  running over them and biting them. <br />
                  12. The rules and provisions of the Bombay Provincial M.N.P.
                  Act, 1949, Chapter Appendix 14 Rule 22 including Section 386
                  (1) of the Dog Tax Bye-law shall remain binding on license
                  holders.
                  <br /> 13. No person shall keep a dog unless he obtains a
                  license under the Bombay Provincial Municipal Act, 1949
                  Chapter Appendix 14 Rule 22 (1) (a). But if the license has
                  been obtained and not renewed, the person concerned will be
                  deemed to have kept a dog without a license and be liable to
                  penal action under the said rule.
                  <br /> 14. After obtaining the said licence, if a complaint is
                  received by the PCMC on the grounds of human health and public
                  hygiene, the PCMC reserves the right to take appropriate
                  action
                </div>
              )}
              {pet == "Dog" && language !== "en" && (
                <div className={styles.terms}>
                  <h3>
                    पाळीव प्राणी परवाना काढण्यासाठी येणा-या नागरिकांना खालील
                    प्रमाणे सर्व साधारण अटी,शर्ती व नियम पाळणे बंधनकारक राहील.
                  </h3>
                  {/* <b>
                    पाळीव प्राणी परवाना सर्व साधारण अटी,नियम व शर्ती पाळीव प्राणी परवाना सर्व साधारण अटी,नियम
                    व शर्ती खालील प्रमाणे राहतील.
                  </b> */}
                  <div>
                    1. या परवान्याची कायदेशीर मुदत परवाना प्राप्त झाले पासुन एक
                    वर्षापुरती असून तो दरसाल नुतनीकरण करणे बंधनकारक राहील.
                    <br /> 2. या परवान्याची कायदेशीर मुदत संपल्यानंतर 15 दिवसाचे
                    आत नुतनीकरण करणे बंधनकारक राहील, अन्यथा 10 रु. दंड आकारण्यात
                    येइल.
                    <br /> 3. मा.महापालिका आयुक्त यांनी वेळोवेळी ठरविलेले शुल्क
                    अदा केल्यानंतर अटी व शर्तीस अधीन राहुन परवाना देण्यात येईल.
                    <br />
                    4. परवाना धारकाने प्राप्त परवाना सोबत बाळगणे आवश्यक राहील व
                    तो मा.महापालिका आयुक्त किंवा त्यांनी नेमणुक केलेल्या
                    प्राधिकृत अधिका-याने मागणी करताच सादर करणे आवश्यक राहील.
                    <br /> 5. ज्या श्वानास परवाना दिलेला आहे तो श्वान पिसाळलेला
                    आहे अगर तो पिसाळलेला असल्याचा संशय आलेला आहे अशा श्वानाचा
                    कोल्ह्याने अगर इतर जनावराने चावा घेतला आहे अगर ओरबाडले आहे
                    असे माहित झाले आहे अगर तशी समजूत होण्याजोगे कारण घडले आहे तर
                    अशा परवाना धारकाने सदर बाबीची लेखी खबर पिंपरी चिंचवड
                    महानगरपालिकेचे पशुवैद्यकीय विभागास सत्वर दिली पाहिजे.
                    <br /> 6. परवाना दिलेला श्वान पिसाळलेला आहे याची माहिती झाली
                    आहे अगर तसा संशय आलेला आहे अगर त्यास पिसाळलेल्या अगर
                    पिसाळलेल्याचा संशय असलेल्या श्वानाने, कोल्ह्याने अगर इतर
                    जनावराने चावा घेतला आहे अगर त्यास ओरबाडले आहे तर त्या
                    श्वानाचा परवाना धारकाने स्वतः पशुवैद्यकिय रुगणालय येथे
                    तपासणीकामी हजर करणे किंवा विकल्पेकरून परवाना धारकास त्याच्या
                    इच्छेनुसार त्याच्या खर्चाने सदर कुत्र्यास जरूर त्या कालावधी
                    पर्यंत जनावरांच्या दवाखान्यात देखरेखीखाली ठेवावे लागेल.
                    <br /> 7. ज्या श्वानास परवाना दिलेला आहे आणि तो पिसाळलेला
                    आहे असे पशुवैद्यकीय अधिकारी यांचे मत झाल्यास मनपामार्फत
                    पुढील कार्यवाही करण्यात येईल.
                    <br /> 8. श्वानास रेबीज लसीकरण करणे बंधनकारक राहील.
                    <br /> 9. परवाना धारकाने सार्वजनिक ठिकाणी अगर रस्त्यावर
                    श्वानास मोकळे सोडता कामा नये.तसेच सदर श्वानापासून इतरांना
                    दुखापत होण्याची शक्यता परवाना धारकास वाटत असल्यास सदर
                    श्वानास त्याने मुस्के घालण्याची दक्षता घेतली पाहिजे.
                    <br /> 10. सार्वजनिक आरोग्याचे व पर्यावरणाचे दृष्टीने आपल्या
                    श्वानामुळे कुठल्याही प्रकारची घाण निर्माण होणार नाही याची
                    परवाना धारकाने दक्षता घ्यावी अन्यथा मा. महापालिका सभा ठराव
                    क्र.७२८ दि.१८/११/२०२१ अन्वये श्वान मालकास र.रु ५००/- (अक्षरी
                    रक्कम रुपये पाचशे फक्त) इतका दंड आकारण्यात येईल .<br /> 11.
                    सार्वजनिक ठिकाणी, गर्दीचे आणि रहदारीचे ठिकाणी, सार्वजनिक
                    बागेमध्ये आपला श्वान साखळी व्यतिरिक्त (मोकळा)सोडू नये. तसेच
                    नागरिकांना भुंकण्याचा किंवा अंगावर धावून जाण्याचा,चावण्याचा
                    उपद्रव होणार नाही याची खबरदारी घ्यावी.
                    <br /> 12. मुंबई प्रांतिक म.न.पा. अधिनियम १९४९,प्रकरण
                    परिशिष्ट १४ नियम २२ सह कलम ३८६ (१)सह कुत्र्य वरील कर उपविधी
                    यामधील नियम व तरतुदी परवाना धारकांवर बंधनकारक राहतील.
                    <br /> 13. कोणत्याही व्यक्तीने मुंबई प्रांतिक महापालिका
                    अधिनियम १९४९ प्रकरण परिशिष्ट १४ नियम २२ (१)(अ) अन्वये परवाना
                    प्राप्त केल्याशिवाय श्वान पाळू नये. परंतू परवाना घेतला असेल
                    आणि त्याचे नुतनीकरण केले नसल्यास विना परवाना श्वान पाळला आहे
                    असे समजण्यात येऊन उक्त नियमानुसार दंडात्मक कारवाईस संबंधित
                    व्यक्ती पात्र राहील.
                    <br /> 14. सदरचा परवाना घेतल्यानंतर मानवी आरोग्यास तसेच
                    सार्वजनिक स्वच्छतेच्या कारणावरून म.न.पा.कडे तक्रार प्राप्त
                    झाल्यास तक्रारीचे गांभीर्य लक्षात घेऊन योग्य ती कारवाई करणे
                    आणि/किंवा दिलेला परवाना रद्द करण्याचे अधिकार म.न.पा. ने
                    राखून ठेवले आहेत.
                  </div>
                </div>
              )}

              {pet == "Cat" && language === "en" && (
                <div className={styles.terms}>
                  1. The legal term of this license is one year from the date of
                  issue of the license and it shall be mandatory to renew it
                  annually.
                  <br /> 2. It shall be mandatory to renew it within 15 days
                  after expiry of License after that penalty of 10 will be
                  levied annually.
                  <br /> 3. License will be issued subject to terms and
                  conditions after payment of fees decided by Hon&#39;ble
                  Municipal Commissioner from time to time.
                  <br /> 4. The license holder shall carry the license obtained
                  with him and shall produce the same on demand by the
                  Hon&#39;ble Municipal Commissioner or the authorized officer
                  appointed by him.
                  <br /> 5. Rabies vaccination of cats will remain mandatory.{" "}
                  <br />
                  6. The license holder should not let the cat loose in the
                  public place or on the road. Also, care should be taken to
                  ensure that the said cat does not hurt others.
                  <br /> 7. In terms of public health and environment, the
                  license holder should ensure that his cat does not create any
                  kind of pollution.
                  <br /> 8. Care should be taken that there is no nuisance from
                  the cat.
                  <br /> 9. The rules and provisions contained in Section 386
                  (1) of the Bombay Provincial M.P. Act, 1949, Chapter Appendix
                  14 Rule 22 shall remain binding on the license holders. <br />
                  10. No person shall keep a cat unless he obtains a license
                  under Bombay Provincial Municipal Act 1949 Chapter Appendix 14
                  Rule 22 (1) (a). But if the license has been obtained and not
                  renewed, the concerned person will be deemed to have kept a
                  cat without a license and will be eligible for action under
                  the said rule.
                  <br /> 11. After obtaining the said license, if a complaint is
                  received by the PCMC on the grounds of human health and public
                  hygiene, the PCMC reserves the right to take appropriate
                  action and/or cancel the license and levy a fee as mentioned
                  in the said case, keeping in mind the seriousness of the
                  complaint. Online licensing of cats should be allowed subject
                  to terms and conditions.
                </div>
              )}
              {pet == "Cat" && language !== "en" && (
                <div className={styles.terms}>
                  1. या परवान्याची कायदेशीर मुदत परवाना प्राप्त झाले पासुन एक
                  वर्षापुरती असून तो दरसाल नुतनीकरण करणे बंधनकारक राहील. <br />{" "}
                  2. या परवान्याची कायदेशीर मुदत संपल्यानंतर 15 दिवसाचे आत
                  नुतनीकरण करणे बंधनकारक राहील, अन्यथा 10 रु. दंड आकारण्यात
                  येइल.
                  <br /> 3. मा.महापालिका आयुक्त यांनी वेळोवेळी ठरविलेले शुल्क
                  अदा केल्यानंतर अटी व शर्तीस अधीन राहुन परवाना देण्यात येईल.
                  <br /> 4. परवाना धारकाने प्राप्त परवाना सोबत बाळगणे आवश्यक
                  राहील व तो मा.महापालिका आयुक्त किंवा त्यांनी नेमणुक केलेल्या
                  प्राधिकृत अधिका-याने मागणी करताच सादर करणे आवश्यक राहील.{" "}
                  <br />
                  5. मांजरास रेबीज लसीकरण करणे बंधनकारक राहील.
                  <br /> 6. परवाना धारकाने सार्वजनिक ठिकाणी अगर रस्त्यावर मांजर
                  मोकळे सोडता कामा नये.तसेच सदर मांजरापासुन इतरांना दुखापत होणार
                  नाही यांची दक्षता घेण्यात यावी.
                  <br /> 7. सार्वजनिक आरोग्याचे व पर्यावरणाचे दृष्टीने आपल्या
                  मांजरीमुळे कुठल्याही प्रकारची घाण निर्माण होणार नाही याची
                  परवाना धारकाने दक्षता घ्यावी.
                  <br /> 8. मांजरापासुन कोणत्याही प्रकारचा उपद्रव होणार नाही
                  यांची दक्षता घेण्यात यावी.मुंबई प्रांतिक म.न.पा. अधिनियम
                  १९४९,प्रकरण परिशिष्ट १४ नियम २२ सह कलम ३८६ (१)यामधील नियम व
                  तरतुदी परवाना धारकांवर बंधनकारक राहतील.
                  <br /> 9. कोणत्याही व्यक्तीने मुंबई प्रांतिक महापालिका अधिनियम
                  १९४९ प्रकरण परिशिष्ट १४ नियम २२ (१)(अ) अन्वये परवाना प्राप्त
                  केल्याशिवाय मांजर पाळू नये. परंतू परवाना घेतला असेल आणि त्याचे
                  नुतनीकरण केले नसल्यास विना परवाना मांजर पाळले आहे,असे समजण्यात
                  येऊन उक्त नियमानुसार कारवाईस संबंधित व्यक्ती पात्र राहील.{" "}
                  <br />
                  10. सदरचा परवाना घेतल्यानंतर मानवी आरोग्यास तसेच सार्वजनिक
                  स्वच्छतेच्या कारणावरून म.न.पा.कडे तक्रार प्राप्त झाल्यास
                  तक्रारीचे गांभीर्य लक्षात घेऊन योग्य ती कारवाई करणे आणि /
                  किंवा दिलेला परवाना रद्द करण्याचे अधिकार म.न.पा.ने राखून उक्त
                  नमुद केलेप्रमाणे शुल्क आकारुन अटी व शर्तीस अधीन राहुन मांजरास
                  ऑनलाईन पध्दतीने परवाना देणेस मान्यता असावी.
                </div>
              )}
              {/* {pet == "Dog" && (
                <div className={styles.terms}>
                  <label>
                    Citizens coming to obtain pet license will be required to follow all general terms ,
                    conditions and rules as follows.
                  </label>
                  <ol>
                    <li>
                      The legal term of this license is one year from the date of issue of the license and it
                      shall be mandatory to renew it annually.
                    </li>
                    <li>
                      License will be issued subject to terms and conditions after payment of fees decided by
                      Hon'ble Municipal Commissioner from time to time.
                    </li>
                    <li>
                      The license holder shall carry the license obtained with him and shall produce the same
                      on demand by the Hon'ble Municipal Commissioner or the authorized officer appointed by
                      him.
                    </li>
                    <li>
                      If a dog to which a license has been issued is found to have been bitten or scratched by
                      a fox or any other animal suspected to have been bitten, the holder of such license
                      shall report the matter in writing. The veterinary department of Chinchwad Municipal
                      Corporation should be informed immediately.
                    </li>
                    <li>
                      If a licensed dog is known or suspected to be neutered, if it has been bitten or
                      scratched by a dog, fox or other animal suspected of being neutered, the licensee shall
                      produce the dog himself for examination at the Veterinary Hospital or alternatively The
                      licensee shall at his own cost keep the said dog under the supervision of the animal
                      clinic for such period as may be necessary.
                    </li>
                    <li>
                      If the veterinary officer is of the opinion that the dog which has been licensed and is
                      crushed, further action will be taken by the municipality.
                    </li>
                    <li>Rabies vaccination of dogs shall remain compulsory.</li>
                    <li>
                      The license holder should not let the dog loose in public places or on the road. Also,
                      if the license holder feels that the dog is likely to cause injury to others, he should
                      take care to muzzle the said dog.
                    </li>
                    <li>
                      In terms of public health and environment, the license holder should take care that his
                      dog does not create any kind of dirt, otherwise according to Hon'ble Municipal Assembly
                      Resolution No. 728 dated 18/11/2021, the dog owner will be charged Rs. Only) so much
                      penalty will be imposed .
                    </li>
                    <li>
                      Do not leave your dog (unchained) in public places ,crowded and traffic places , in
                      public gardens . Also, you should take care not to disturb the citizens by barking or
                      running over them and biting them.
                    </li>
                    <li>
                      The rules and provisions of the Bombay Provincial M.N.P. Act, 1949 ,Chapter Appendix 14
                      Rule 22 including Section 386 (1) of the Dog Tax Bye-law shall remain binding on license
                      holders.
                    </li>
                    <li>
                      No person shall keep a dog unless he obtains a license under the Bombay Provincial
                      Municipal Act, 1949 Chapter Appendix 14 Rule 22 (1 )( a). But if the license has been
                      obtained and not renewed, the person concerned will be deemed to have kept a dog without
                      a license and be liable to penal action under the said rule.
                    </li>
                    <li>
                      . After obtaining the said licence, if a complaint is received by the MNP on the grounds
                      of human health and public hygiene, the MNP reserves the right to take appropriate
                      action and/or cancel the license given considering the seriousness of the complaint.
                      have been retained by
                    </li>
                  </ol>
                </div>
              )} */}
              {/* {pet == "Cat" && (
                <div className={styles.terms}>
                  <ol>
                    <li>
                      The legal term of this license is one year from the date of issue of the license and it
                      shall be mandatory to renew it annually.
                    </li>
                    <li>
                      License will be issued subject to terms and conditions after payment of fees decided by
                      Hon'ble Municipal Commissioner from time to time.
                    </li>
                    <li>
                      The license holder shall carry the license obtained with him and shall produce the same
                      on demand by the Hon'ble Municipal Commissioner or the authorized officer appointed by
                      him.
                    </li>
                    <li>Rabies vaccination of cats will remain mandatory.</li>
                    <li>
                      The license holder should not let the cat loose in the public place or on the road.
                      Also, care should be taken to ensure that the said cat does not hurt others.
                    </li>
                    <li>
                      In terms of public health and environment, the license holder should ensure that his cat
                      does not create any kind of pollution.
                    </li>
                    <li>Care should be taken that there is no nuisance from the cat.</li>
                    <li>
                      The rules and provisions contained in Section 386 (1) of the Bombay Provincial M.P. Act,
                      1949 ,Chapter Appendix 14 Rule 22 shall remain binding on the license holders.
                    </li>
                    <li>
                      No person shall keep a cat unless he obtains a license under Bombay Provincial Municipal
                      Act 1949 Chapter Appendix 14 Rule 22 (1 )( a). But if the license has been obtained and
                      not renewed, the concerned person will be deemed to have kept a cat without a license
                      and will be eligible for action under the said rule.
                    </li>
                    <li>
                      After obtaining the said licence, if a complaint is received by the MNP on the grounds
                      of human health and public hygiene, the MNP reserves the right to take appropriate
                      action and/or cancel the license and levy a fee as mentioned in the said case, keeping
                      in mind the seriousness of the complaint. Online licensing of cats should be allowed
                      subject to terms and conditions.
                    </li>
                  </ol>
                </div>
              )} */}
              <div
                className={styles.row}
                style={{ justifyContent: "center", columnGap: 10 }}
              >
                <Checkbox
                  onChange={() => {
                    setTnC(!TnC);
                  }}
                />
                <span>
                  {language === "en"
                    ? "I have read and agreed to all the terms and conditions"
                    : "मी सर्व नियम व अटी वाचल्या आहेत आणि त्यांच्याशी सहमत आहे"}
                </span>
              </div>
              <div
                className={styles.row}
                style={{ justifyContent: "space-evenly" }}
              >
                <Button
                  disabled={!TnC}
                  variant="contained"
                  color="success"
                  type="submit"
                >
                  <FormattedLabel id="agreeAndNext" />
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  endIcon={<ExitToApp />}
                  onClick={() => {
                    router.back();
                  }}
                >
                  <FormattedLabel id="back" />
                </Button>
              </div>
            </>
          )}
        </form>
      </Paper>
    </>
  );
};

export default Index;

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Checkbox, FormControlLabel, Button, Grid, Typography, Select, InputLabel, FormControl, MenuItem } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { db, storage } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from "../LoginContext";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../../css/tarjous.css"

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


function TarjouspyyntoForm() {
  const { handleSubmit, control, watch, reset } = useForm();
  const [success, setSuccess] = useState(false)
  const [file, setFile] = useState([]);
  const isCompany = watch("isCompany");
  const [progress, setProgress] = useState(0); // Track upload progress
  const [urls, setUrls] = useState([]); // Track uploaded file URLs
  const navigate = useNavigate()
  const { t } = useTranslation();

  const fNameRef = useRef(sessionStorage.getItem("firstName") || "");
  const lNameRef = useRef(sessionStorage.getItem("lastName") || "");
  const phoneRef = useRef(sessionStorage.getItem("phoneNumber") || "");
  const emailRef = useRef(sessionStorage.getItem("email") || "");
  const addressRef = useRef(sessionStorage.getItem("address") || "");



  const getSessionStorageValues = () => {
    const filteredData = {}

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key);

      // Filter out null or undefined values
      if (value !== null && value !== undefined) {
        filteredData[key] = value;
      }
    }

    console.log("filteredData: ", filteredData)
    return filteredData
  };

  let firstName, lastName, phone, email;

  let storedValues = []
  // Prefill the form when the component mounts
  useEffect(() => {
    reset(); // Prefill the form with the stored values
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      // Tallenna lomaketiedot Firestoreen
      const docRef = await addDoc(collection(db, "tarjouspyynto"), {
        arrived: new Date().toLocaleDateString(),
        firstname: data.firstName || "",
        lastname: data.lastName || "",
        address: data.address || "",
        phone: data.phoneNumber || "",
        email: data.email || "",
        message: data.message || "",
        isCompany: data.isCompany,
        area: data.ala || "",
        yTunnus: data.yTunnus || "",
        status: false,
        files: urls
      });

      reset(); // Tyhjennä lomake
      setFile(null); // Tyhjennä tiedosto
      navigate('/thanks')
    } catch (error) {
      console.error("Virhe tallennuksessa: ", error);
      alert("Tarjouspyynnön tallennuksessa tapahtui virhe.");
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files) return;

    // Iterate over files and upload each one
    Array.from(files).forEach((file) => {
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track the upload progress (percentage)
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setProgress(progress);
          if (progress === 100) {
            setSuccess(true)
          } // Update the progress state if needed
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        async () => {
          // Get the download URL once the upload is complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUrls((prevUrls) => [...prevUrls, downloadURL]); // Add URL to state
          console.log("File available at", downloadURL);
        }
      );
    });
  }

  return (
    
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="tarjouspyynto-content">
          <Controller
            name="isCompany"
            control={control}
            defaultValue={false}            
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} />}
                label="Yritys"                
              />
            )}
          />

          <Controller
            name="ala"
            control={control}
            defaultValue="kayttoapua"
            fullWidth={true}
            render={({ field }) => (
              <FormControl>
                <Select
                  sx={{ width: '100%', fontWeight: 'bold', fontSize: '1rem', marginLeft: '1rem', marginBottom: "1rem" }}
                  labelId="ala-label"
                  {...field}
                  label="Aihe"

                  InputLabelProps={{
                    style: { fontSize: '2rem', fontWeight: 'bold' }, // Adjust the font size of the label
                  }}
                >
                  <MenuItem value="koodausta">Koodausta</MenuItem>
                  <MenuItem value="testausta">Testausta</MenuItem>
                  <MenuItem value="jarjestelma">Asennuksia/ylläpitoja/konfigurointeja</MenuItem>
                  <MenuItem value="kayttoapua">Käyttöapua</MenuItem>
                  <MenuItem value="projektimanageraus">Projektin hallintaa</MenuItem>
                  <MenuItem value="tuotehallintaa">Tuotehallintaa/backlogs</MenuItem>
                  <MenuItem value="muuta">Määrittele alimmassa laatikossa</MenuItem>
                </Select><InputLabel id="ala-label">Aihe</InputLabel>
              </FormControl>
            )}
          />

          {isCompany && (
            <Controller
              name="yTunnus"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="medium"
                  label="Y-tunnus"                  
                  required={isCompany}                                    
                  InputLabelProps={{
                    sx: {
                      fontSize: '18px', // Adjust the label font size
                    },
                  }}    
                />
              )}
            />

          )}


          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField {...field}  label="Etunimi" required
                InputLabelProps={{
                  style: { fontSize: '1rem', fontWeight: 'bold' }, // Adjust the font size of the label
                }}
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  marginLeft: '1rem'
                }}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Sukunimi" required size="large" defaultValue={lNameRef.current}
                InputLabelProps={{
                  style: { fontSize: '1rem', fontWeight: 'bold' }, // Adjust the font size of the label
                }}
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  marginLeft: '1rem'
                }}

              />
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Osoite" defaultValue={addressRef.current} required size="large"
                InputLabelProps={{
                  style: { fontSize: '1rem', fontWeight: 'bold' }, // Adjust the font size of the label
                }}
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  marginLeft: '1rem'
                }}

              />
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Puhelinnumero" defaultValue={phoneRef.current} required
                InputLabelProps={{
                  style: { fontSize: '1rem', fontWeight: 'bold' }, // Adjust the font size of the label
                }}
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  marginLeft: '1rem'
                }}

              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField {...field} defaultValue={emailRef.current} label="Sähköposti" size="medium"
                InputLabelProps={{
                  style: { fontSize: '1rem', fontWeight: 'bold' }, // Adjust the font size of the label
                }}
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  marginLeft: '1rem'
                }}

              />
            )}
          />

          <div>
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <TextareaAutosize
                  {...field}
                  minRows={5}
                  minCols={200}
                  inputProps={{
                    style: {
                      fontWeight: 'bold', fontSize: '1rem'
                    },
                  }}
                  InputLabelProps={{
                    className: 'input-bold',
                  }}
                  placeholder="Määrittele tähän mahdollisimman tarkasti työ, aikataulutoiveesi, materiaalitarve jne"
                  style={{ marginLeft: '1rem', marginTop: "0.5rem", width: "400px", padding: "1rem", fontSize: '1rem' }}
                />
              )}
            />
          </div>


          <div className="tarjouspyynto-napit">
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              color={success ? "success" : "primary"} // Change to success color when upload completes
              disabled={progress > 0 && progress < 100} // Disable button during upload
              size="large"
            >
              {t('files')}
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileUpload}
                multiple
              />
            </Button>

            <Button type="submit" variant="contained" color="primary" size="large">
              {t('lahetaTarjous')}
            </Button>
          </div>
        </div>
      </form>
    
  );
}

export default TarjouspyyntoForm;

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Checkbox, FormControlLabel, Button, Grid, Typography } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { db, storage } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function TarjouspyyntoForm() {
  const { handleSubmit, control, watch, reset } = useForm();
  const [file, setFile] = useState(null);
  const isCompany = watch("isCompany");


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
    return filteredData
  };

  let storedValues = []
  // Prefill the form when the component mounts
  useEffect(() => {
    storedValues = getSessionStorageValues();
    reset(storedValues); // Prefill the form with the stored values
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      // Tallenna lomaketiedot Firestoreen
      const docRef = await addDoc(collection(db, "tarjouspyynto"), {
        name: data.name || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        message: data.message || "",
        isCompany: data.isCompany,
        yTunnus: data.yTunnus || "",
        status: false,
      });

      // Jos kuva on ladattu, tallenna se Firebase Storageen
      if (file) {
        const storageRef = ref(storage, `Tarjouspyynto/${docRef.id}_${file.name}`);
        await uploadBytes(storageRef, file);
        alert("Tarjouspyyntö ja kuva tallennettu onnistuneesti!");
      } else {
        alert("Tarjouspyyntö tallennettu onnistuneesti!");
      }

      reset(); // Tyhjennä lomake
      setFile(null); // Tyhjennä tiedosto
    } catch (error) {
      console.error("Virhe tallennuksessa: ", error);
      alert("Tarjouspyynnön tallennuksessa tapahtui virhe.");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Tarjouspyyntölomake</Typography>
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        {isCompany && (
          <Grid item xs={12}>
            <Controller
              name="yTunnus"
              control={control}
              render={({ field }) => (
                <TextField                  
                  {...field}
                  fullWidth
                  label="Y-tunnus"
                  required={isCompany}
                />
              )}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control} 
            value = {storedValues.name}     
            InputLabelProps={{
              shrink: storedValues.name !== "", // Forces label to shrink if there's a value
            }}                
            render={({ field }) => (
              <TextField {...field} fullWidth label="Nimi" required />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="address"
            value = {storedValues.address}
            InputLabelProps={{
              shrink: storedValues.address !== "", // Forces label to shrink if there's a value
            }}      

            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Osoite" required />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="phone"
            control={control}
            value = {storedValues.phone}
            InputLabelProps={{
              shrink: storedValues.phone !== "", // Forces label to shrink if there's a value
            }}      

            render={({ field }) => (
              <TextField {...field} fullWidth label="Puhelinnumero" required />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="email"
            control={control}
            value = {storedValues.email}
            InputLabelProps={{
              shrink: storedValues.email !== "", // Forces label to shrink if there's a value
            }}      

            render={({ field }) => (
              <TextField {...field} fullWidth label="Sähköposti" />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <TextareaAutosize
                {...field}
                minRows={4}
                placeholder="Viesti"
                style={{ width: "100%", padding: "8px" }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <input type="file" onChange={handleFileChange} />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Tallenna
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default TarjouspyyntoForm;

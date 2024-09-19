import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import "../index.css"


export default function Contact() {
  function linkedIn() {
    window.open("https://www.linkedin.com/in/jouni-riimala-04330", "_blank");
  }

  function fb() {
    window.open("https://www.facebook.com/jriimala", "_blank");
  }

  function insta() {
    window.open("https://www.instagram.com/jriimala/", "_blank");
  }

  const contactText =
    "Excellent, pls call me (+358 45 2385 888) and let's discuss or at minimum send me the email from the above mail icon.";
   
  return (
    <>
      <hr></hr>
      <p></p>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'start',
          '& > *': {
            m: 1,
          },
        }}
      >
        <div className='contact-card'>
          {contactText}
          <p></p>

        </div>
      </Box>
    </>
  );
}

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

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
    "Excellent, let's start with the email so send me an email to jriimala@gmail.com and lets take it from there.";
  const socialText = "Checkout my social media pages"

  return (
    <div className="contact-card">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
          "& > *": {
            m: 1,
          },
        }}
      >        
        <div className = "contact-info">
            {contactText}
        </div>
        <ButtonGroup variant="outlined" aria-label="outlined button group" className = "socialButtons">
          <IconButton>
            <FacebookIcon onClick={fb}/>
          </IconButton>
          <IconButton>
            <InstagramIcon onClick={insta}/>
          </IconButton>
          <IconButton>
            <LinkedInIcon onClick={linkedIn} />
          </IconButton>
        </ButtonGroup>
      </Box>
    </div>
  );
}

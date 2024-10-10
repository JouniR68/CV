import React from 'react';
import { Container, Typography, Box, List, ListItem } from '@mui/material';

const Letter = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <Typography variant="h4" gutterBottom>
          Technical Project Manager - Passionate about Web Development
        </Typography>
        <Typography variant="body1" paragraph>
          Hello!<p></p>I'm a dedicated technical project manager with a strong passion for software development, 
          especially in web development. My technical skills lie in React, Node.js, JavaScript, CSS, and HTML, 
          and I’m experienced with Material-UI for building responsive and visually appealing interfaces.
        </Typography>
        <Typography variant="body1" paragraph>
          
        </Typography>
        <Typography variant="body1" paragraph>
          I'm proficient in Git for version control and adaptable to any version control system your team 
          might prefer. I've actively contributed to several training repositories on 
          <a href="https://github.com/JouniR68" target="_blank" rel="noopener noreferrer"> GitHub</a>, 
          where I continue to refine my skills and explore new technologies.
        </Typography>
        <Typography variant="body1" paragraph>
          In my most recent project, I worked on creating a License Management System for Vivago. The application 
          was developed using React for the frontend, Node.js for the backend, and PostgreSQL as the database. 
          We used Sequelize to manage database interactions, ensuring a seamless and efficient data flow. 
          After rigorous testing, the deployment was successfully completed via a Git pipeline to the Azure 
          environment, with Azure management handled by a subcontractor.
        </Typography>
        <Typography variant="body1" paragraph>
          My background includes extensive experience in managing both the technical and logistical aspects of 
          projects, and I thrive in roles that allow me to combine my project management skills with hands-on 
          development work. I’m excited about future opportunities in web development and eager to make an 
          impactful contribution to my next team.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Thank you for your consideration. I'm open to any role within web development so 
        </Typography>
      </Box>
    </Container>
  );
};

export default Letter;

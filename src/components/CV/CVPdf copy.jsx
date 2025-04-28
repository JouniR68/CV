import React from 'react';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import data from "../../../data/datapkg.json"

export const generatePDF = () => {
    const doc = new jsPDF();

    // Add the header
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(18);
    doc.text('Jouni Riimala, CV', 14, 20);
    doc.setFontSize(11);
    //doc.text(`Date: ${currentDate}`, 160, 20);
    doc.text(`Hands on project manager / sw development mgr`, 14, 25);

    doc.setFontSize(16);
    doc.text('Profile', 14, 40);
    // Extract person details, with the first item being the Photo, and rest of the details for the table
    const person = data.profile.map(p => [
        [p.Name, p.Phone, p.Email, p.Location], // Main details in one row
        [{ content: 'Description: ' + p.Description, colSpan: 3 }] // Description in a separate row, spanning columns
    ]);

    const imageData = data.profile[0].Photo; // Ensure the base64 string is correct

    // Coordinates for the image
    const startY = 45;
    const marginX = 14;

    // Add the image to the PDF
    //const imageData = person[0][0]; // Extract the base64 image from the person array (Photo field)
    if (imageData) {
        doc.addImage(imageData, 'JPEG', marginX, startY, 30, 30); // X, Y, width, height
    }

    //"summary": "Yli 20 vuoden kokemus ohjelmistokehityksestä, järjestelmien käyttöönotosta ja projektinhallinnasta. \nTyöskennellyt monipuolisissa rooleissa, kuten tutkimus- ja kehityspäällikkönä, projektipäällikkönä ja DevOps-insinöörinä. Viimeisimpänä toiminut Research and Development Managerina.\n\nOlen Tekninen projektipäällikkö, jolla on vahva käsitys ohjelmistokehityksen menetelmistä, työkaluista ja ketteristä prosesseista. Syvällinen ymmärrys ohjelmistosuunnittelun käytännöistä ja kokemusta monialaisten tiimien johtamisesta, projektien elinkaaren hallinnasta ja korkealaatuisten tuotteiden oikea-aikaisen toimituksen varmistamisesta.\n\nOsaamiset: Projektinhallinta, Tuoteomistajan tehtävät (työkaluina JIRA, Confluence) ja Web-kehitys"

    doc.setFontSize(11);
    doc.text(data.summary, 14, 85);

    const personDetails = [
        [data.profile[0].Name, data.profile[0].Phone, data.profile[0].Email, data.profile[0].Location],
        [{ content: 'Description: ' + data.profile[0].Description, colSpan: 3 }]
    ];

    const reasons = data.hire.map(e => [
        `${e.why}\n\n${e.why1}\n\n${e.why2}\n\n${e.why3}\n\n${e.why4}\n\n${e.why5}`
      ]);
    doc.setFontSize(16);
    doc.text('Reasons to get in touch', 14, 135);

    doc.autoTable({
        startY: 145,
        head: [['Main reasons']],
        body: reasons,
    });


    doc.addPage()
    // Add Work History section
    doc.setFontSize(16);
    doc.text('Work History', 14, 40);
    const workhistory = data.workhistory.map((w) => [
        w.Company,
        w.Duration,
        w.Roles,
        w.Locations,
        w.Info
    ]);

    doc.autoTable({
        startY: 50,
        head: [['Company', 'Duration', 'Roles', 'Locations', 'Info']],
        body: workhistory,
    });

    doc.addPage()

    doc.text('Tech Competencies', 14, 30);
    doc.setFontSize(12);
    doc.text('Subset from competences below.Additionally I have solid experience with', 14, 40);
    doc.text("configuring, deploying, and troubleshooting development/test systems.", 14, 45);

    // Mapping data from JSON file for each category
    const programming = data.tech[0].Programming;
    const database = data.tech[0].Database;
    const tools = data.tech[0].Tools;
    const methods = data.tech[0].Methods;

    // Determine the maximum number of rows needed
    const maxLength = Math.max(programming.length, database.length, tools.length, methods.length);

    // Pad arrays to same length with empty strings
    const padArray = (arr, length) => {
      const padded = [...arr];
      while (padded.length < length) {
        padded.push('');
      }
      return padded;
    };

    const progPad = padArray(programming, maxLength);
    const dbPad = padArray(database, maxLength);
    const toolsPad = padArray(tools, maxLength);
    const methodsPad = padArray(methods, maxLength);

    // Combine into rows
    const combinedBody = [];
    for (let i = 0; i < maxLength; i++) {
      combinedBody.push([
        progPad[i],
        dbPad[i],
        toolsPad[i],
        methodsPad[i]
      ]);
    }

    // Render the autoTable with headers
    doc.autoTable({
      startY: 50,
      head: [['Programming', 'Database', 'Tools', 'Methods']],
      body: combinedBody,
    });
    doc.addPage()
    // Add Education section
    const education = data.education.map((e) => [e.Item, e.When, e.Topics, e.Degree])

    doc.setFontSize(16);
    doc.text('Education', 14, 30);

    doc.autoTable({
        startY: 40,
        head: [['Training', 'When', 'Topics', 'Degree / Certification']],
        body: education,
    });

    // Add Footer
    doc.setFontSize(11);
    doc.text('Contact: jriimala@gmail.com | Phone: +358 45 23 85 888', 14, 285);

    // Save the PDF
    doc.save('CurriculumVitae.pdf');
};



const CurriculumVitae = () => {

    return (
        <div>
            <Button variant="contained" color="primary" onClick={generatePDF}>
                Lataa CV
            </Button>
        </div>
    );
};

export default CurriculumVitae;

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
    doc.text(`Date: ${currentDate}`, 160, 20);

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

    const personDetails = [
        [data.profile[0].Name, data.profile[0].Phone, data.profile[0].Email, data.profile[0].Location],
        [{ content: 'Description: ' + data.profile[0].Description, colSpan: 3 }]
    ];

    // Now render the table, skipping the photo since it's already shown
    doc.autoTable({
        startY: 80,
        body: personDetails, // Use the flattened array for the body
        columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 50 }, 2: { cellWidth: 50 } }, // Adjust column widths if needed
    });


    // Add Work History section
    doc.setFontSize(16);
    doc.text('Work History', 14, 125);
    const workhistory = data.workhistory.map((w) => [
        w.Company,
        w.Duration,
        w.Roles,
        w.Locations,
        w.Info
    ]);

    doc.autoTable({
        startY: 130,
        head: [['Company', 'Duration', 'Roles', 'Locations', 'Info']],
        body: workhistory,
    });

    doc.text('Competencies', 14, 200);

    // Mapping data from JSON file for each category
    const programming = data.tech[0].Programming.map(p => [p]); // Assuming each competency is a string
    const database = data.tech[0].Database.map(d => [d]);
    const tools = data.tech[0].Tools.map(t => [t]);
    const methods = data.tech[0].Methods.map(m => [m]);

    // Preparing the final body by combining arrays and adding section titles
    const combinedBody = [];

    // Add Programming section
    combinedBody.push([{ content: 'Programming (* = used in work)', colSpan: 1, styles: { halign: 'left', fillColor: [220, 220, 220] } }]);
    combinedBody.push(...programming);

    // Add Database section
    combinedBody.push([])
    combinedBody.push([{ content: 'Databases', colSpan: 1, styles: { halign: 'left', fillColor: [220, 220, 220] } }]);
    combinedBody.push(...database);

    // Add Tools section
    combinedBody.push([])
    combinedBody.push([{ content: 'Tools', colSpan: 1, styles: { halign: 'left', fillColor: [220, 220, 220] } }]);
    combinedBody.push(...tools);

    // Add Methods section
    combinedBody.push([])
    combinedBody.push([{ content: 'Methods', colSpan: 1, styles: { halign: 'left', fillColor: [220, 220, 220] } }]);
    combinedBody.push(...methods);

    // Render the autoTable with the combined body
    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 20,
        body: combinedBody,
    });

    // Add Education section
    const education = data.education.map((e) => [e.Item, e.When, e.Topics, e.Degree])

    doc.setFontSize(16);
    doc.text('Education', 14, doc.autoTable.previous.finalY + 10);

    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 20,
        head: [['Training', 'When', 'Topics', 'Degree / Certification']],
        body: education,
    });

    /* Add Roles that Appeal to You
    doc.setFontSize(16);
    const appealingRoles = data.looking.map(l => [l])
    doc.text('Appealing roles', 14, 320);
    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 40,            
        body: appealingRoles,
    });
    */
    // Add Footer
    doc.setFontSize(11);
    doc.text('Contact: jr@softa-apu.com | Phone: +358452385888', 14, 285);

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

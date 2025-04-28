import React from 'react';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import data from "../../../data/datapkg.json"

export const generatePDF = () => {
    const doc = new jsPDF();

    // === Configurable font sizes and margins ===
    const marginX = 30;
    const baseFontSize = 14;
    const headingFontSize = 18;
    const subHeadingFontSize = 16;

    const currentDate = new Date().toLocaleDateString();

    // === Header ===
    doc.setFontSize(headingFontSize);
    doc.text('Jouni Riimala, CV', marginX, 20);
    doc.setFontSize(baseFontSize);
    doc.text(`Hands on project manager / sw development mgr`, marginX, 28);

    // === Profile Section ===
    doc.setFontSize(subHeadingFontSize);
    doc.text('Profile', marginX, 40);

    const imageData = data.profile[0].Photo;
    const startY = 45;

    if (imageData) {
        doc.addImage(imageData, 'JPEG', marginX, startY, 40, 40); // Bigger for visibility
    }

    doc.setFontSize(baseFontSize);
    doc.text(data.summary, marginX, 95, { maxWidth: 170 }); // Allow wrapping

    // === Reasons Section ===
    const reasons = data.hire.map(e => [
        `${e.why}\n\n${e.why1}\n\n${e.why2}\n\n${e.why3}\n\n${e.why4}\n\n${e.why5}`
    ]);

    doc.setFontSize(subHeadingFontSize);
    doc.text('Reasons to get in touch', marginX, 170);

    doc.autoTable({
        startY: 180,
        head: [['Main reasons']],
        body: reasons,
        styles: {
            fontSize: 12,
            cellPadding: 4,
        },
        columnStyles: {
            0: { cellWidth: 'wrap' },
        }
    });

    // === Work History ===
    doc.addPage();
    doc.setFontSize(subHeadingFontSize);
    doc.text('Work History', marginX, 30);

    const workhistory = data.workhistory.map((w) => [
        `${w.Company}\n${w.Roles}\n${w.Locations}`,
        w.Duration,
        w.Info
    ]);

    doc.autoTable({
        startX:marginX,
        startY: 40,
        head: [['Company & Role', 'Duration', 'Info']],
        body: workhistory,
        styles: {
            fontSize: 12,
            cellPadding: 3,
        },
        columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 40 },
            2: { cellWidth: 70 }
        }
    });

    // === Tech Competencies ===
    doc.addPage();
    doc.setFontSize(subHeadingFontSize);
    doc.text('Tech Competencies', marginX, 30);

    doc.setFontSize(baseFontSize);
    doc.text('Subset from competences below. Additionally I have solid experience with configuring, deploying, and troubleshooting development/test systems.', marginX, 40, { maxWidth: 170 });

    const programming = data.tech[0].Programming;
    const database = data.tech[0].Database;
    const tools = data.tech[0].Tools;
    const methods = data.tech[0].Methods;

    const maxLength = Math.max(programming.length, database.length, tools.length, methods.length);
    const padArray = (arr, length) => {
        const padded = [...arr];
        while (padded.length < length) {
            padded.push('');
        }
        return padded;
    };

    const combinedBody = [];
    const progPad = padArray(programming, maxLength);
    const dbPad = padArray(database, maxLength);
    const toolsPad = padArray(tools, maxLength);
    const methodsPad = padArray(methods, maxLength);

    for (let i = 0; i < maxLength; i++) {
        combinedBody.push([
            progPad[i],
            dbPad[i],
            toolsPad[i],
            methodsPad[i]
        ]);
    }

    doc.autoTable({
        startY: 60,
        head: [['Programming', 'Database', 'Tools', 'Methods']],
        body: combinedBody,
        styles: {
            fontSize: 12,
            cellPadding: 3,
        }
    });

    // === Education Section ===
    doc.addPage();
    doc.setFontSize(subHeadingFontSize);
    doc.text('Education', marginX, 30);

    const education = data.education.map((e) => [e.Item, e.When, e.Topics, e.Degree]);

    doc.autoTable({
        startY: 40,
        head: [['Training', 'When', 'Topics', 'Degree / Certification']],
        body: education,
        styles: {
            fontSize: 12,
            cellPadding: 3,
        }
    });

    // === Footer ===
    doc.setFontSize(baseFontSize);
    doc.text('Contact: jriimala@gmail.com | Phone: +358 45 23 85 888', marginX, 285);

    // === Save the PDF ===
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
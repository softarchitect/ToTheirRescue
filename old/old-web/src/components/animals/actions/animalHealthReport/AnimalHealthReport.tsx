/* eslint-disable prefer-template */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
import { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { usePDF } from 'react-to-pdf';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Col, Row, Table, Typography,
} from 'antd';
import Cookies from 'universal-cookie';

import './AnimalHealthReport.less';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import { apiCall } from 'src/shared/api/apiWrapper';
import { formatStringDateByCountry, getAge } from 'src/utils/common';
import { LoadingOutlined } from '@ant-design/icons';

const { Title } = Typography;
const cssPrefix = 'animal_health_report';

export const AnimalHealthReport: FC<any> = ({ permissions, selectedAnimal }) => {
  const abc = JSON.parse(localStorage.getItem('rescueDetails') || '');
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(true);
  const [animalHealthReport, setAnimalHealthReport] = useState<any>(null);
  const [artifacts, setArtifacts] = useState([]);
  const [imageView, setImageView] = useState('');

  const cookies = new Cookies();
  const { tenantId } = cookies.get('loginDetails');

  const getAnimalHealthReport = (animalId: any) => apiCall(`report/get-animal-health-report?animalId=${animalId}`, 'GET', {})
    .then((resp: any) => {
      if (resp?.status === 200) {
        setAnimalHealthReport(resp?.data?.data);
        console.log(resp?.data?.data, '---------++==|||');
        return resp?.data?.data;
      }
      return {};
    });

  const renderTextCustom = (data: any) => {
    const {
      doc, text, fontSize, pageWidth, color, font, x, y,
    } = data;

    doc.setFont(undefined, font || 'normal');
    doc.setFontSize(fontSize);

    const textWidth = doc.getTextWidth(text);
    const xPosition = (pageWidth - textWidth) / 2;

    doc.setTextColor(color);
    doc.text(text, x || xPosition, y);
  };

  const renderLargeText = (data: any) => {
    const {
      doc, text, fontSize, pageWidth, color, font, x, y,
    } = data;

    // Define the margin and max width for wrapping text
    const margin = x;
    const maxWidth = 160; // Width for text to break at
    doc.setFont(undefined, font || 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(color);

    // Split the long text into an array of lines that fit within the maxWidth
    const lines = doc.splitTextToSize(text, maxWidth);

    // Add the wrapped text to the PDF at position (x, y)
    doc.text(lines, margin, y);
  };

  const renderProcedureRow = (data: any) => {
    const {
      doc, text, fontSize, pageWidth, color, font, x, y, procedureDetail,
    } = data;

    let previousTableEndY = doc.autoTable.previous.finalY;

    if (previousTableEndY > 263) {
      doc.addPage();
      previousTableEndY = 4;
    }

    doc.setFillColor('#D7D7D7'); // Background color rgb(242, 242, 242)
    doc.rect(6, previousTableEndY + 6.3, 195, 7.5, 'F'); // Rectangle with fill

    renderTextCustom({
      doc,
      text,
      color: '#828282',
      fontSize: 11,
      pageWidth,
      x: 8,
      y: previousTableEndY + 11,
    });

    // Past Vaccinations Table Data (Dynamic Length)
    const pastVaccinationData2 = [
      ['Action Date', 'Type', 'Clinic', 'Vet', 'Result'],
      [
        formatStringDateByCountry(procedureDetail?.actionDate, localStorage.getItem('countryCode')),
        procedureDetail?.kind,
        procedureDetail?.clinic || 'dsd',
        procedureDetail?.practitioner,
        procedureDetail?.result,
      ],
    ];

    // Create Past Vaccinations Table dynamically based on Y-position of first table
    autoTable(doc, {
      startY: previousTableEndY + 6, // Start the next table 10 units after the first table
      head: [],
      body: pastVaccinationData2.slice(1),
      theme: 'striped',
      margin: { top: 10, left: 34, right: 20 },
      // styles: { lineWidth: 2 },
      headStyles: {
        fillColor: '#E5E5E5',
        textColor: '#A8A8A8',
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 25, halign: 'center', cellPadding: { top: 2, bottom: 2 } },
        1: { cellWidth: 35, halign: 'center', cellPadding: { top: 2, bottom: 2 } },
        2: { cellWidth: 35, halign: 'center', cellPadding: { top: 2, bottom: 2 } },
        3: { cellWidth: 35, halign: 'center', cellPadding: { top: 2, bottom: 2 } },
        4: { cellWidth: 40, halign: 'center', cellPadding: { top: 2, bottom: 2 } },
      },
    });
    const previousTableEndYTwo = doc.autoTable.previous.finalY;
    procedureDetail?.microchipNumber && autoTable(doc, {
      startY: previousTableEndYTwo, // Start the next table 10 units after the first table
      // head: pastVaccinationData2.slice(0, 1),
      body: [[`Microchip Number: ${procedureDetail?.microchipNumber}`]],
      theme: 'striped',
      margin: { top: 10, left: 34, right: 20 },
      // styles: { lineWidth: 2 },
      headStyles: {
        fillColor: '#E5E5E5',
        textColor: '#A8A8A8',
      },
      columnStyles: {
        0: { cellWidth: 170, cellPadding: [1, 3] },
      },
    });
    const previousTableEndYThree = doc.autoTable.previous.finalY;
    procedureDetail?.notes && autoTable(doc, {
      startY: previousTableEndYThree, // Start the next table 10 units after the first table
      // head: pastVaccinationData2.slice(0, 1),
      body: [[`Notes: ${procedureDetail?.notes}`]],
      theme: 'striped',
      // styles: { lineWidth: 2 },
      margin: { top: 10, left: 34, right: 20 },
      headStyles: {
        fillColor: '#E5E5E5',
        textColor: '#A8A8A8',
      },
      columnStyles: {
        0: { cellWidth: 170, cellPadding: [1, 3] },
      },
    });
  };

  const renderHealthNotes = (data: any) => {
    const {
      doc, text, fontSize, pageWidth, color, font, x, y, noteDetail,
    } = data;

    let previousTableEndY = doc.autoTable.previous.finalY;

    if (previousTableEndY > 261) {
      doc.addPage();
      previousTableEndY = 4;
    }

    doc.setFillColor('#D7D7D7'); // Background color rgb(242, 242, 242)
    doc.rect(6, previousTableEndY + 6.2, 195, 7.5, 'F'); // Rectangle with fill

    renderTextCustom({
      doc,
      text,
      color: '#828282',
      fontSize: 11,
      pageWidth,
      x: 8,
      y: previousTableEndY + 11,
    });

    // Past Vaccinations Table Data (Dynamic Length)
    const notesData = [
      [`${formatStringDateByCountry(noteDetail?.actionDate, localStorage.getItem('countryCode'))}`, `${noteDetail?.notes}.`],
    ];

    // Create Past Vaccinations Table dynamically based on Y-position of first table
    autoTable(doc, {
      startY: previousTableEndY + 6, // Start the next table 10 units after the first table
      // head: [['Notes', '']],
      headStyles: {
        fillColor: '#E5E5E5',
        textColor: '#A8A8A8',
      },
      body: notesData.slice(0),
      theme: 'striped',
      margin: { top: 10, left: 34, right: 20 },
      columnStyles: {
        0: { cellWidth: 30, cellPadding: { left: 5, top: 2, bottom: 2 } },
        1: { cellWidth: 140, cellPadding: { left: 5, top: 2, bottom: 2 } },
      },
    });
  };

  const renderSoapsNotes = (data: any) => {
    const {
      doc, text, fontSize, pageWidth, color, font, x, y, soapDetail,
    } = data;

    let previousTableEndY = doc.autoTable.previous.finalY;

    if (previousTableEndY > 261) {
      doc.addPage();
      previousTableEndY = 4;
    }

    doc.setFillColor('#D7D7D7'); // Background color rgb(242, 242, 242)
    doc.rect(6, previousTableEndY + 6.3, 195, 7.5, 'F'); // Rectangle with fill

    renderTextCustom({
      doc,
      text,
      color: '#828282',
      fontSize: 11,
      pageWidth,
      x: 8,
      y: previousTableEndY + 11,
    });

    const pastVaccinationData4 = [
      [formatStringDateByCountry(soapDetail?.actionDate, localStorage.getItem('countryCode'))],
      [`Subjective: ${soapDetail?.subjective}`],
      [`Objective: ${soapDetail?.objective}`],
      [`Assessment: ${soapDetail?.assessment}`],
      [`Plan: ${soapDetail?.soapPlan}`],
    ];

    autoTable(doc, {
      startY: previousTableEndY + 6, // Start the next table 10 units after the first table
      // head: [['SOAPs']],
      headStyles: {
        fillColor: '#E5E5E5',
        textColor: '#A8A8A8',
      },
      body: pastVaccinationData4.slice(0),
      theme: 'striped',
      margin: { top: 11, left: 34, right: 20 },
      columnStyles: {
        0: { cellWidth: 170, fillColor: '#F5F5F5', cellPadding: [1, 3] },
      },
    });
  };

  const generateReport = (reportData: any, index: any) => {
    // eslint-disable-next-line new-cap
    const doc: any = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    doc.setProperties({
      title: `${reportData?.animalReport?.animalName} Health Report`,
    });

    // Header Section
    renderTextCustom({
      doc,
      text: reportData?.tenantReport?.name || 'To Their Rescue',
      color: '#525252',
      fontSize: 18,
      pageWidth,
      y: 30,
      font: 'bold',
    });

    // Sub-header Information
    renderTextCustom({
      doc,
      text: reportData?.tenantReport?.street || 'PO Box 10983',
      color: '#121212',
      fontSize: 12,
      pageWidth,
      y: 36,
    });

    renderTextCustom({
      doc,
      text: `${reportData?.tenantReport?.city} ${reportData?.tenantReport?.state} ${reportData?.tenantReport?.zip} ${reportData?.tenantReport?.phone}` || 'Southport, Canada, 28461, 345343453453453',
      color: '#121212',
      fontSize: 12,
      pageWidth,
      y: 41,
    });

    renderTextCustom({
      doc,
      text: 'Animal Health Report',
      color: '#121212',
      fontSize: 16,
      pageWidth,
      y: 55,
    });

    doc.setFillColor('#F5F5F5'); // Background color rgb(242, 242, 242)
    doc.rect(20, 65, 110, 20, 'F'); // Rectangle with fill

    // Image (Image URL)
    const imgUrl = reportData?.animalReport?.artifactAttachment;
    if (imgUrl) {
      doc.addImage(imgUrl, 'JPEG', 20, 65, 20, 20);
    }

    // Animal Information
    doc.setFontSize(13);
    doc.text(`${reportData?.animalReport?.animalName} | ID NO: ${reportData?.animalReport?.animalId}`, 44, 73);
    doc.text(`${reportData?.animalReport?.breed} | ${reportData?.animalReport?.sex} | ${getAge(reportData?.animalReport?.birthDate)}`, 44, 79);

    renderTextCustom({
      doc,
      text: 'Chronic Condition',
      color: '#121212',
      fontSize: 14,
      pageWidth,
      y: 100,
    });

    doc.setFillColor('#F5F5F5'); // Background color rgb('#F5F5F5')
    doc.rect(20, 105, 170, 15, 'F'); // Rectangle with fill

    renderLargeText({
      doc,
      text: reportData?.chronicConditonReport?.chronicCondition,
      color: '#525252',
      fontSize: 11,
      pageWidth,
      x: 24,
      y: 112,
    });

    renderTextCustom({
      doc,
      text: 'Diet',
      color: '#121212',
      fontSize: 14,
      pageWidth,
      y: 132,
    });

    doc.setFillColor('#F5F5F5'); // Background color rgb('#F5F5F5')
    doc.rect(20, 137, 170, 15, 'F'); // Rectangle with fill

    // Split the long text into an array of lines that fit within the maxWidth
    renderLargeText({
      doc,
      text: reportData?.dietReport?.diet || 'None',
      color: '#525252',
      fontSize: 11,
      pageWidth,
      x: 24,
      y: 143.5,
    });

    // Reminders Section
    renderTextCustom({
      doc,
      text: 'Reminders',
      color: '#121212',
      fontSize: 14,
      pageWidth,
      y: 100 + 67,
    });

    const reminderReport = reportData?.reminderReports;
    const reminderData: any = [['Due Date', '']];
    reminderReport?.forEach((report: any) => {
      reminderData.push([formatStringDateByCountry(report?.dueDate, localStorage.getItem('countryCode')), report?.kind]);
    });

    // Reminder Table Data (Dynamic Length)
    // const reminderData = [
    //   ['Due Date', ''],
    //   ['30 May 1995', 'Rabies Vaccination'],
    //   ['30 May 1995', 'Rabies Vaccination'],
    //   ['30 May 1995', 'Rabies Vaccination'],
    //   ['15 Jun 1996', 'Deworming'],
    //   ['10 Oct 1997', 'Annual Checkup'],
    //   // Add more rows as necessary
    // ];

    // Create Reminders Table
    doc.setFontSize(12);
    autoTable(doc, {
      startY: 172,
      // head: reminderData.slice(0, 1),
      body: reminderData.slice(1),
      theme: 'striped',
      margin: { top: 10, left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 85, halign: 'center' },
        1: { cellWidth: 85 },
      },
    });

    // Calculate Y position after the first table
    const firstTableEndY = doc.autoTable.previous.finalY;

    renderTextCustom({
      doc,
      text: 'Past Vaccinations',
      color: '#121212',
      fontSize: 14,
      pageWidth,
      y: firstTableEndY + 15,
    });

    const vaccinationReport = reportData?.vaccinationReports;
    const pastVaccinationData: any = [['Date', 'Vaccination', 'Clinic', 'Practitioner', 'Tag No.', 'MFG', 'S.N']];
    vaccinationReport?.forEach((report: any) => {
      pastVaccinationData.push([formatStringDateByCountry(report?.actionDate, localStorage.getItem('countryCode')), report?.vaccinationKind, report?.clinic, report?.practitioner, report?.tagNumber, report?.manufacturer, report?.serialNo]);
    });

    // Past Vaccinations Table Data (Dynamic Length)
    // const pastVaccinationData = [
    //   ['Vaccination', 'Date', 'Clinic', 'Practitioner'],
    //   ['Rabies', '4/11/2024', 'Cilinic ABC', 'Dr. Robert'],
    //   ['Rabies', '4/11/2024', 'Cilinic ABC', 'Dr. Robert'],
    //   ['Rabies', '4/11/2024', 'Cilinic ABC', 'Dr. Robert'],
    //   ['Rabies', '4/11/2024', 'Cilinic ABC', 'Dr. Robert'],
    //   ['Rabies', '4/11/2024', 'Cilinic ABC', 'Dr. Robert'],
    //   ['Rabies', '4/11/2024', 'Cilinic ABC', 'Dr. Robert'],
    //   ['Rabies', '4/11/2024', 'Cilinic ABC', 'Dr. Robert'],
    //   ['Rabies', '4/11/2024', 'Cilinic ABC', 'Dr. Robert'],
    // ];

    // Create Past Vaccinations Table dynamically based on Y-position of first table
    autoTable(doc, {
      startY: firstTableEndY + 20, // Start the next table 10 units after the first table
      head: pastVaccinationData.slice(0, 1),
      body: pastVaccinationData.slice(1),
      theme: 'striped',
      margin: { top: 10, left: 6, right: 20 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30 },
        4: { cellWidth: 19 },
        5: { cellWidth: 25 },
        6: { cellWidth: 30 },
      },
    });

    // Calculate Y position after the second table
    const secondTableEndY = doc.autoTable.previous.finalY;

    renderTextCustom({
      doc,
      text: 'Health Cronology',
      color: '#121212',
      fontSize: 14,
      pageWidth,
      y: secondTableEndY + 15,
    });

    autoTable(doc, {
      startY: secondTableEndY + 18, // Start the next table 10 units after the first table
      // head: pastVaccinationData2.slice(0, 1),
      body: [],
      theme: 'striped',
      margin: { top: 0, left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 30 },
      },
    });

    const healthCronology = reportData?.healthChronologyReports;

    healthCronology?.forEach((item: any) => {
      if (item?.tableName === 'Animal Procedure') {
        renderProcedureRow({
          doc,
          procedureDetail: item,
          text: 'Procedure',
          color: '#F5F5F5',
          fontSize: 14,
          pageWidth,
          y: secondTableEndY + 15,
        });
      } else if (item?.tableName === 'Health Note') {
        renderHealthNotes({
          doc,
          noteDetail: item,
          text: 'Health Notes',
          color: '#F5F5F5',
          fontSize: 14,
          pageWidth,
          y: secondTableEndY + 15,
        });
      } else if (item?.tableName === 'SOAP') {
        renderSoapsNotes({
          doc,
          soapDetail: item,
          text: 'SOAPs',
          color: '#F5F5F5',
          fontSize: 14,
          pageWidth,
          y: secondTableEndY + 15,
        });
      }
    });

    // doc.setFillColor('#F5F5F5'); // Background color rgb(242, 242, 242)
    // doc.rect(20, secondTableEndY + 20, 170, 15, 'F'); // Rectangle with fill

    // renderTextCustom({
    //   doc,
    //   text: 'Procedure :',
    //   color: '#828282',
    //   fontSize: 12,
    //   pageWidth,
    //   x: 22,
    //   y: secondTableEndY + 26,
    // });

    // Past Vaccinations Table Data (Dynamic Length)
    // const pastVaccinationData2 = [
    //   ['Action Date', 'Type', 'Clinic', 'Vet'],
    //   ['30 May 1995', 'Cleaning', 'ABC Hospital', 'Dr Robert'],
    // ];
    // I was getting ready to ask a couple of people to try it but thought I better try it out first.

    // Create Past Vaccinations Table dynamically based on Y-position of first table
    // autoTable(doc, {
    //   startY: secondTableEndY + 27, // Start the next table 10 units after the first table
    //   // head: pastVaccinationData2.slice(0, 1),
    //   body: pastVaccinationData2.slice(1),
    //   theme: 'striped',
    //   margin: { top: 10, left: 20, right: 20 },
    //   columnStyles: {
    //     0: { cellWidth: 30, halign: 'center' },
    //     1: { cellWidth: 45 },
    //     2: { cellWidth: 45 },
    //     3: { cellWidth: 50 },
    //   },
    // });

    // const fourTableEndY = doc.autoTable.previous.finalY;

    // doc.setFillColor('#F5F5F5'); // Background color rgb(242, 242, 242)
    // doc.rect(20, fourTableEndY + 4, 170, 15, 'F'); // Rectangle with fill

    // renderTextCustom({
    //   doc,
    //   text: 'SOAPs :',
    //   color: '#828282',
    //   fontSize: 12,
    //   pageWidth,
    //   x: 22,
    //   y: fourTableEndY + 10,
    // });

    // const pastVaccinationData4 = [
    //   ['30 May 1995', 'Subjective', 'Objective', 'Assessment'],
    // ];

    // autoTable(doc, {
    //   startY: fourTableEndY + 11, // Start the next table 10 units after the first table
    //   // head: pastVaccinationData2.slice(0, 1),
    //   body: pastVaccinationData4.slice(0),
    //   theme: 'striped',
    //   margin: { top: 10, left: 20, right: 20 },
    //   columnStyles: {
    //     0: { cellWidth: 30, halign: 'center' },
    //     1: { cellWidth: 40 },
    //     2: { cellWidth: 45 },
    //     3: { cellWidth: 45 },
    //   },
    // });

    // const fiveTableEndY = doc.autoTable.previous.finalY;

    // doc.setFillColor('#F5F5F5'); // Background color rgb(242, 242, 242)
    // doc.rect(20, fiveTableEndY + 4, 170, 25, 'F'); // Rectangle with fill

    // renderTextCustom({
    //   doc,
    //   text: 'Prescription :',
    //   color: '#828282',
    //   fontSize: 12,
    //   pageWidth,
    //   x: 22,
    //   y: fiveTableEndY + 10,
    // });

    // renderLargeText({
    //   doc,
    //   text: 'Pracetamol - 20 mg, Albendazole - 30 mg, Azihthromycin - 400mg',
    //   color: '#525252',
    //   fontSize: 10.5,
    //   pageWidth,
    //   x: 25,
    //   y: fiveTableEndY + 16,
    // });

    // renderLargeText({
    //   doc,
    //   text: 'Cilinic : ABC Cilinic, Vetnerian : Dr. Robert',
    //   color: '#525252',
    //   fontSize: 10.5,
    //   pageWidth,
    //   x: 25,
    //   y: fiveTableEndY + 21,
    // });

    // Create Past Vaccinations Table dynamically based on Y-position of first table
    // autoTable(doc, {
    //   startY: fiveTableEndY + 11, // Start the next table 10 units after the first table
    //   // head: pastVaccinationData2.slice(0, 1),
    //   body: pastVaccinationData5.slice(0),
    //   theme: 'striped',
    //   margin: { top: 10, left: 20, right: 20 },
    //   columnStyles: {
    //     0: { cellWidth: 60 },
    //     1: { cellWidth: 60 },
    //     2: { cellWidth: 50 },
    //   },
    // });

    // Save the generated PDF as a Blob
    const pdfBlob = doc.output('blob');

    const currPageHeight = doc.internal.pageSize.getHeight();
    const totalPages = doc.internal.getNumberOfPages();
    const pageHeight = currPageHeight * totalPages;

    // Render the PDF in an iframe
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const renderFrame: any = document?.getElementById(`pdf - i - frame - ${reportData?.animalReport?.id}`);
    if (renderFrame) {
      renderFrame.title = 'abc';
      renderFrame.style.height = `${pageHeight * 3.92}px`;
      renderFrame.control = true;
      renderFrame.src = `${pdfUrl}`;
    }
    if (selectedAnimal?.animalDetails?.length === index + 1) {
      setReportLoading(false);
    }
    // Optionally, you can add another table, or further content dynamically
    // For example, if you want to add a third table, you can use secondTableEndY to calculate its position

    // Save the document as a PDF
    // doc.save('animal_health_report.pdf');
  };

  useEffect(() => {
    if (uploadImageLoading) {
      return;
    }
    const data = {};
    apiCall(`artifact-attachment/get-allartifact-by-animalid/${selectedAnimal?.ids?.[0]}?tenantId=${tenantId}`, 'GET', data)
      .then((resp: any) => {
        if (resp?.status === 200) {
          setArtifacts(resp?.data?.data?.artifactAttachments);
        }
      });
  }, [uploadImageLoading]);

  useEffect(() => {
    const filterArtifact: any = artifacts?.filter((user: any) => user.publicityRank === 1 && user.attachmentType === 'Photo');
    setImageView(filterArtifact?.[0]?.blobUrl);
  }, [artifacts]);

  useEffect(() => {
    setReportLoading(true);
    selectedAnimal?.animalDetails?.forEach((detail: any, index: any) => {
      getAnimalHealthReport(detail?.id).then((reportData: any) => {
        const animalHealthReportData = reportData;
        animalHealthReportData.animalReport.artifactAttachment = detail?.artifactAttachment?.blobUrl;
        generateReport(animalHealthReportData, index);
      });
    });
  }, []);

  if (!permissions?.animals?.actions?.animal_health_report) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      {reportLoading && (
        <Row justify="center" align="middle" style={{ height: '76vh', overflowY: 'scroll' }}>
          <div style={{ padding: '0px 10px' }}>Generating Report</div>
          <LoadingOutlined />
        </Row>
      )}
      <Row justify="center" style={{ height: reportLoading ? '0px' : '76vh', overflowY: 'scroll' }}>
        {selectedAnimal?.ids?.map((id: any) => <iframe title="animal report" id={`pdf - i - frame - ${id}`} width="800px" />)}
      </Row>
      {/* <Row justify="end" style={{ padding: '0px 0px', width: '800px' }}>
        <Button className="ftr-button-secondary-dashed" onClick={() => generateReport()}>Download PDF</Button>
      </Row>
      <Row className="custom-scrollbar" justify="center" style={{ overflowY: 'scroll', height: '70vh' }}>
        <Row justify="center" ref={targetRef} style={{ padding: '10px', width: '800px' }}>
          <div
            className={`${ cssPrefix }__header - row`}
            style={{
              border: '1px solid #444444',
              padding: '20px',
              width: '100%',
            }}
          >
            <Row
              justify="center"
              style={{
                margin: '4px 0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#525252',
              }}
            >
              {abc?.name}
            </Row>
            <Row justify="center">
              {abc?.street}
            </Row>
            <Row justify="center">
              {abc?.city}
              {', '}
              {abc?.countryName}
              {', '}
              {abc?.zip}
              {', '}
              {abc?.phone}
            </Row>
            <Row
              justify="center"
              style={{
                padding: '20px 0px',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              Animal Health Report
            </Row>
            <AnimalDetailCard isAttachment incomingImageView={imageView} animalDetails={selectedAnimal?.animalDetails} />
            <div style={{ border: '1px solid #848484', margin: '20px 0px', padding: '20px' }}>
              <Row
                justify="center"
                style={{
                  padding: '0px',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                Reminders
              </Row>
              <br />
              <Row style={{ backgroundColor: '#E2E2E2', padding: '4px 10px' }}>
                <Col span={11}>
                  Due Date
                </Col>
                <Col span={2}>-</Col>
                <Col span={11}>
                  Vaccination Record
                </Col>
              </Row>
              {['', '', '', '', '']?.map((data: any) => (
                <Row style={{ padding: '4px 10px' }}>
                  <Col span={11}>
                    30 May 1995
                  </Col>
                  <Col span={2}>-</Col>
                  <Col span={11}>
                    Rabies Vaccination
                  </Col>
                </Row>
              ))}
            </div>
            <div style={{ border: '1px solid #848484', margin: '20px 0px', padding: '20px' }}>
              <Row
                justify="center"
                style={{
                  padding: '0px',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                Past Vaccination
              </Row>
              <br />
              <Row style={{ backgroundColor: '#E2E2E2', padding: '4px 10px' }}>
                <Col span={11}>
                  Due Date
                </Col>
                <Col span={2}>-</Col>
                <Col span={11}>
                  Vaccination Record
                </Col>
              </Row>
              {['', '', '', '', '']?.map((data: any) => (
                <Row style={{ padding: '4px 10px' }}>
                  <Col span={11}>
                    30 May 1995
                  </Col>
                  <Col span={2}>-</Col>
                  <Col span={11}>
                    Rabies Vaccination
                  </Col>
                </Row>
              ))}
            </div>
            <div style={{ border: '1px solid #848484', margin: '20px 0px', padding: '20px' }}>
              <Row
                justify="center"
                style={{
                  padding: '0px',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                Health Cronology
              </Row>
              <br />
              <Row style={{ backgroundColor: '#E2E2E2', padding: '4px 10px' }}>
                <Col span={11}>
                  Due Date
                </Col>
                <Col span={2}>-</Col>
                <Col span={11}>
                  Vaccination Record
                </Col>
              </Row>
              {['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']?.map((data: any) => (
                <Row style={{ padding: '4px 10px' }}>
                  <Col span={11}>
                    30 May 1995
                  </Col>
                  <Col span={2}>-</Col>
                  <Col span={11}>
                    Rabies Vaccination
                  </Col>
                </Row>
              ))}
            </div>
            <div style={{ border: '1px solid #848484', margin: '20px 0px', padding: '20px' }}>
              <Row
                justify="center"
                style={{
                  padding: '0px',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                Health Cronology
              </Row>
              <br />
              <Row style={{ backgroundColor: '#E2E2E2', padding: '4px 10px' }}>
                <Col span={11}>
                  Due Date
                </Col>
                <Col span={2}>-</Col>
                <Col span={11}>
                  Vaccination Record
                </Col>
              </Row>
              {['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']?.map((data: any) => (
                <Row style={{ padding: '4px 10px' }}>
                  <Col span={11}>
                    30 May 1995
                  </Col>
                  <Col span={2}>-</Col>
                  <Col span={11}>
                    Rabies Vaccination
                  </Col>
                </Row>
              ))}
            </div>
          </div>
        </Row>
      </Row> */}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  selectedAnimal: state.common.selectedAnimal,
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(AnimalHealthReport);

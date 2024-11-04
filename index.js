import dotenv from 'dotenv';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
dotenv.config();

const ACCESS_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FILE_ID;
const FRAME_ID = "1:2"; // Replace with your actual frame ID

async function fetchImageUrl() {
  const response = await axios.get(`https://api.figma.com/v1/images/${FILE_KEY}`, {
    headers: {
      'X-Figma-Token': ACCESS_TOKEN,
    },
    params: {
      ids: FRAME_ID,
      scale: 1, // Adjust as necessary
    },
  });
  return response.data.images[FRAME_ID];
}

async function downloadImage(imageUrl) {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  return response.data;
}

async function createPdf(imageBuffer) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([1440, 1024]); // Set page size to 1440 x 1024

  const image = await pdfDoc.embedPng(imageBuffer);
  
  // Scale the image to fit the page
  const imageDims = image.scale(1);
  
  // Draw the image centered on the page
  page.drawImage(image, {
    x: (page.getWidth() - imageDims.width) / 2,
    y: (page.getHeight() - imageDims.height) / 2,
    width: imageDims.width,
    height: imageDims.height,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('output.pdf', pdfBytes);
}

async function main() {
  try {
    const imageUrl = await fetchImageUrl();
    console.log('Image URL:', imageUrl);
    const imageBuffer = await downloadImage(imageUrl);
    
    await createPdf(imageBuffer);
    console.log('PDF created successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();

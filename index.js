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
      scale: 2,
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
  const page = pdfDoc.addPage();

  // Directly embed as PNG
  const image = await pdfDoc.embedPng(imageBuffer);
  
  const { width, height } = image.scale(1);

  page.drawImage(image, {
    x: 0,
    y: page.getHeight() - height,
    width,
    height,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('output.pdf', pdfBytes);
}

async function main() {
  try {
    const imageUrl = await fetchImageUrl();
    console.log('Image URL:', imageUrl); // Log the image URL
    const imageBuffer = await downloadImage(imageUrl);
    
    await createPdf(imageBuffer);
    console.log('PDF created successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();

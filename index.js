import dotenv from 'dotenv';
import fetch from 'node-fetch';


dotenv.config();

// Your Figma API token and file ID
const FIGMA_API_TOKEN = process.env.FIGMA_TOKEN;
const FILE_ID = process.env.FILE_ID;

async function fetchFileData() {
    const response = await fetch(`https://api.figma.com/v1/files/${FILE_ID}`, {
        method: 'GET',
        headers: {
            'X-Figma-Token': FIGMA_API_TOKEN,
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching file data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

async function exportImages(nodeIds) {
    const response = await fetch(`https://api.figma.com/v1/images/${FILE_ID}?ids=${nodeIds}&scale=2&format=png`, {
        method: 'GET',
        headers: {
            'X-Figma-Token': FIGMA_API_TOKEN,
        },
    });

    if (!response.ok) {
        throw new Error(`Error exporting images: ${response.statusText}`);
    }

    const imagesData = await response.json();
    return imagesData;
}

async function run() {
    try {
        // Step 1: Fetch file data
        const fileData = await fetchFileData();
        console.log('File Data:', fileData);

        
        const nodeIds = '1:2'; 

        // Step 3: Export images
        const images = await exportImages(nodeIds);
        console.log('Exported Images:', images);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

run();

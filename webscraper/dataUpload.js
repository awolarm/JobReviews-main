// scripts/uploadReviews.js
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent directory
config({ path: join(__dirname, '..', '.env') });

import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';

const prisma = new PrismaClient();

async function uploadReviews() {
  try {
    // Read the JSON file
    const data = await readFile('reviews.json', 'utf-8');
    const reviews = JSON.parse(data);
    
    // Insert reviews into database
    const result = await prisma.review.createMany({
      data: reviews.map(review => ({
        title: review.title,
        description: review.description,
        company: review.company,
        createdAt: review.date,
        location: review.location,
        role: review.role
      })),
      skipDuplicates: true, 
    });
    
    console.log(`Successfully uploaded ${result.count} reviews`);
    
  } catch (error) {
    console.error('Error uploading reviews:', error);
  } finally {
    await prisma.$disconnect();
  }
}

uploadReviews();
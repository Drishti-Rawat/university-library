import dummyBooks from '@/dummyBooks.json'
import { books } from './schema';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http';

config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle({ client: sql })

// For server-side uploads, you need to use the regular ImageKit JavaScript SDK
// not the @imagekit/next which is primarily for client-side components
// Install: npm install imagekit
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: 'public_ZSugEeyXP1ylgqzVKxnB4yVAGyg=',
  urlEndpoint: 'https://ik.imagekit.io/vgzj47psc',
  privateKey: 'private_hZz/gsRwazatqSkOiN8D7q8oBI4=',
});

const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string,
) => {
  try {
    console.log(`Uploading ${fileName} to ${folder}...`);
   
    const response = await imagekit.upload({
      file: url, // Can be a URL, base64, or buffer
      fileName: fileName,
      folder: folder,
      useUniqueFileName: true,
      tags: ["seeded-content"],
    });
   
    console.log(`✅ Successfully uploaded: ${fileName}`);
    return response.url;
  } catch (error) {
    console.error(`❌ Error uploading ${fileName}:`, error);
    throw error;
  }
};

const seed = async () => {
  console.log("Seeding database...");
  try {
    for (const book of dummyBooks) {
      const coverUrl = await uploadToImageKit(
        book.coverUrl, 
        `${book.title}.jpg`, 
        "/books/covers"
      );
      
      const videoUrl = await uploadToImageKit(
        book.videoUrl, 
        `${book.title}.mp4`, 
        "/books/videos"
      );
      
      await db.insert(books).values({
        ...book, 
        coverUrl, 
        videoUrl
      });
    }
    console.log("Database seeded successfully!");
  } catch (error) {
    console.log("Error seeding data", error);
  }
}

seed()
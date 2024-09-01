// server.js (Node.js/Express)
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// เชื่อมต่อฐานข้อมูลเมื่อเริ่มต้น
client.connect().catch(err => {
  console.error('Failed to connect to the database', err);
  process.exit(1);
});

export async function POST(req) {
  try {
    const { r, g, b } = await req.json(); // รับค่า RGB จากคำขอ

    if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
      await client.query(`
        INSERT INTO "yod060" ("command", "r", "g", "b", "date")
        VALUES ($1, $2, $3, $4, NOW())
      `, ['RGB_ON', r, g, b]);

      console.log("RGB control command stored in the database");

      const result = await client.query(`
        SELECT "command", "r", "g", "b", "date"
        FROM "yod060"
        ORDER BY "date" DESC
        LIMIT 1
      `);

      return new Response(JSON.stringify({
        message: 'RGB control command stored successfully',
        latestCommand: result.rows[0],
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Invalid RGB values' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Error storing RGB command:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

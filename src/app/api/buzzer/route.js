// src/app/api/buzzer/route.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("sslmode=require"),
});

export async function POST(request) {
  try {
    const { note } = await request.json();

    if (!note || !['C', 'D', 'E', 'F', 'G', 'A', 'B'].includes(note)) {
      return new Response(JSON.stringify({ error: 'Invalid note' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update the Playnot column in the yod060 table
    const query = 'UPDATE yod060 SET Playnot = $1 WHERE id = $2 RETURNING *';
    const values = [note, 87]; // 87 เป็น ID ของแถวที่คุณต้องการอัปเดต
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'No rows updated' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating Buzzer command:', error);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// src/app/api/buzzer/route.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("sslmode=require"),
});

// ฟังก์ชัน POST เพื่ออัพเดต Playnot ในฐานข้อมูล
export async function POST(request) {
  try {
    const { note } = await request.json();

    if (!note || !['C', 'D', 'E', 'F', 'G', 'A', 'B'].includes(note)) {
      return new Response(JSON.stringify({ error: 'Invalid note' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ตรวจสอบว่ามีแถวที่ id = 87 หรือไม่
    const checkQuery = 'SELECT id FROM yod060 WHERE id = $1';
    const checkValues = [87];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rowCount === 0) {
      // ถ้าไม่มีแถวที่ id = 87 ให้แทรกแถวใหม่
      const insertQuery = 'INSERT INTO yod060 (id, Playnot) VALUES ($1, $2)';
      const insertValues = [87, note];
      await pool.query(insertQuery, insertValues);
    } else {
      // ถ้ามีแถวที่ id = 87 อยู่แล้ว ให้อัพเดต Playnot
      const updateQuery = 'UPDATE yod060 SET Playnot = $1 WHERE id = $2 RETURNING *';
      const updateValues = [note, 87];
      const updateResult = await pool.query(updateQuery, updateValues);

      if (updateResult.rowCount === 0) {
        return new Response(JSON.stringify({ error: 'No rows updated' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
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

// ฟังก์ชัน GET เพื่อดึง Playnot จากฐานข้อมูล
export async function GET() {
  try {
    const result = await pool.query('SELECT Playnot FROM yod060 WHERE id = $1', [87]);

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'No record found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ note: result.rows[0].playnot }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

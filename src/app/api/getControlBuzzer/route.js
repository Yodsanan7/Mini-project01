// src/app/api/receiveData/route.js
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export async function POST(request) {
  try {
      const { command } = await request.json();
      if (command !== 'BUZZER_ON' && command !== 'OFF') {
          throw new Error('Invalid status');
      }

      const res = await client.query(
          'UPDATE "yod060" SET buzzer_status = $1 WHERE id = $2 RETURNING *',
          [command, 87] // ใช้ `1` เป็น ID ของแถวที่ต้องการอัปเดต หากมีหลายแถวให้ปรับเป็น ID ที่ต้องการ
      );

      if (res.rowCount === 0) {
          throw new Error('No rows updated');
      }

      return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
      });
  } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
      });
  }
}
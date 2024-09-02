import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Initialize and manage the database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Create a connection manager that only connects if not already connected
async function dbConnect() {
  if (!client._connected) {
    await client.connect();
    client._connected = true; // Set a flag to indicate the connection is established
  }
  return client;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let client;
    try {
      // Connect to the database
      client = await dbConnect();
      
      const command = req.body.command;  // Get the command from the request body

      // Insert the command into the database
      await client.query(`
        INSERT INTO "yod060" ("command", "date")
        VALUES ($1, NOW())
      `, [command]);

      console.log(`Control command (${command}) stored in the database`);

      // Return a success response
      res.status(200).json({ message: `Control command (${command}) received` });
    } catch (error) {
      console.error('Error in control route:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      // Ensure the database client is closed
      if (client) {
        await client.end();
      }
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

"use client";

import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Dashboard() {
  const [loadingBuzzer, setLoadingBuzzer] = useState(false);
  const [buzzerError, setBuzzerError] = useState(null);

  async function sendNoteToBuzzer(note) {
    setLoadingBuzzer(true);
    setBuzzerError(null);

    try {
      const response = await fetch('/api/buzzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An error occurred');
      }

      alert(`Note ${note} sent successfully`);
    } catch (error) {
      setBuzzerError(error.message);
    } finally {
      setLoadingBuzzer(false);
    }
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.heading}>Buzzer Control</h1>

      <div className={styles.buzzerControls}>
        <h2>Control Buzzer</h2>
        <div>
          {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(note => (
            <button
              key={note}
              onClick={() => sendNoteToBuzzer(note)}
              disabled={loadingBuzzer}
            >
              {loadingBuzzer ? 'Sending...' : `Play Note ${note}`}
            </button>
          ))}
        </div>
        {buzzerError && <p>{buzzerError}</p>}
      </div>
    </div>
  );
}

"use client"; // This makes the component a Client Component

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import Logo from '../../public/logo.png';
import styles from '../app/nav.module.css'; 

const updateLEDStatus = async (command, setLEDStatus) => {
  try {
    const response = await fetch('/api/getControlCommand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    const data = await response.json();

    if (data.success) {
      setLEDStatus(command); // Update LED status
      console.log(`สถานะ LED อัพเดตเป็น: ${command}`); // ตรวจสอบสถานะใน console
      alert(`คำสั่งอัพเดตเป็น ${command}`);
    } else {
      alert('การอัพเดตคำสั่งล้มเหลว');
    }
  } catch (error) {
    console.error('Error updating Command:', error);
    alert('เกิดข้อผิดพลาดในการอัพเดตคำสั่ง');
  }
};

const Navbar = () => {
  const [ledStatus, setLEDStatus] = useState('OFF'); // เริ่มต้นด้วย OFF

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className={`navbar-brand ${styles.navbarBrand}`} href="./">
            <Image src={Logo} alt="Project Logo" width={60} height={60} className="d-inline-block align-text-top" />
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link active ${styles.navLink}`} aria-current="page" href="./">แดชบอร์ด</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${styles.navLink}`} href="/History">ประวัติ</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  การควบคุม
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <button className="dropdown-item btn btn-primary" type="button" onClick={() => updateLEDStatus('RGB_ON', setLEDStatus)}>
                      เปิดไฟ
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item btn btn-secondary" type="button" onClick={() => updateLEDStatus('BUZZER_ON', setLEDStatus)}>
                      เสียงเตือน
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item btn btn-danger" type="button" onClick={() => updateLEDStatus('OFF', setLEDStatus)}>
                      ปิด
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* แสดงสถานะ LED */}
      <div className={styles.ledStatusContainer}>
        <p>สถานะปัจจุบัน: {ledStatus}</p> {/* แสดงสถานะปัจจุบัน */}
        {ledStatus === 'RGB_ON' && <div className={`alert alert-success ${styles.ledOn}`}>ไฟเปิดอยู่</div>}
        {ledStatus === 'BUZZER_ON' && <div className={`alert alert-warning ${styles.buzzerOn}`}>เสียงเตือนเปิดอยู่</div>}
        {ledStatus === 'OFF' && <div className={`alert alert-secondary ${styles.ledOff}`}>ไฟปิดอยู่</div>}
      </div>
    </>
  );
};

export default Navbar;

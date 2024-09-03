"use client"; // นี้ทำให้คอมโพเนนต์เป็น Client Component

import Link from "next/link";
import Image from "next/image";
import Logo from '../../public/logo.png';
import styles from '../app/nav.module.css'; 

const updateLEDStatus = async (command) => {
  try {
    const response = await fetch('/api/getControlCommand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command}),
    });

    const data = await response.json();

    console.log('ข้อมูลที่ตอบกลับ:', data);  // เพิ่มการตรวจสอบข้อมูลที่ได้รับ
    if (data.success) {
      alert(`อัปเดตคำสั่งเป็น ${command} เรียบร้อยแล้ว`);
    } else {
      alert('ไม่สามารถอัปเดตคำสั่งได้');
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตคำสั่ง:', error);
    alert('เกิดข้อผิดพลาดในการอัปเดตคำสั่ง');
  }
};

const updateBuzzer = async (command) => {
  try {
    const response = await fetch('/api/getControlBuzzer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command}),
    });

    const data = await response.json();

    console.log('ข้อมูลที่ตอบกลับ:', data);  // เพิ่มการตรวจสอบข้อมูลที่ได้รับ
    if (data.success) {
      alert(`อัปเดตคำสั่งเป็น ${command} เรียบร้อยแล้ว`);
    } else {
      alert('ไม่สามารถอัปเดตคำสั่งได้');
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตคำสั่ง:', error);
    alert('เกิดข้อผิดพลาดในการอัปเดตคำสั่ง');
  }
};

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className={`navbar-brand ${styles.navbarBrand}`} href="./">
          <Image src={Logo} alt="โลโก้โปรเจกต์" width={60} height={60} className="d-inline-block align-text-top mr-1" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="สลับการนำทาง">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link active ${styles.navLink}`} aria-current="page" href="./">แดชบอร์ด</Link>
            </li>
          </ul>
          <form className="d-flex">
            <button type="button" className="btn btn-outline-success me-md-2" onClick={() => updateLEDStatus('RGB_ON')}>เปิดไฟ</button>
            <button type="button" className="btn btn-outline-danger" onClick={() => updateLEDStatus('OFF')}>ปิด</button>
            <button type="button" className="btn btn-outline-success me-md-2" onClick={() => updateBuzzer('BUZZER_ON')}>เปิด BUZZER</button>
            <button type="button" className="btn btn-outline-danger" onClick={() => updateBuzzer('OFF')}>ปิด BUZZER</button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

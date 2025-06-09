import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaPhone, FaEnvelope } from "react-icons/fa";
import { Helmet } from "react-helmet";
import "../../Styles/ContactUs.css";
import API_BASE_URL from "../Constant";

export default function ContactUsCom() {
  const [adminInfo, setAdminInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}AdminInfo/get-admin-info`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("فشل تحميل بيانات التواصل");
        const data = await response.json();
        setAdminInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInfo();
  }, []);

  return (
    <div className="contact-wrapper">
      <Helmet>
        <title>تواصل معنا - سوق البلد</title>
        <meta
          name="description"
          content="تواصل معنا في سوق البلد - نحن هنا للإجابة على جميع استفساراتك."
        />
      </Helmet>

      <h1 className="contact-heading">📬 تواصل معنا</h1>

      {loading ? (
        <div className="loading">⏳ جاري التحميل...</div>
      ) : error ? (
        <div className="error">❌ {error}</div>
      ) : (
        <div className="contact-grid">
          {adminInfo.map((info, i) => (
            <div className="contact-card-modern" key={i}>
              <h3>فريق الدعم</h3>

              <div className="contact-item">
                <FaWhatsapp className="icon whatsapp" />
                {info.whatsAppNumber ? (
                  <a
                    href={`https://wa.me/${info.whatsAppNumber}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    واتساب: {info.whatsAppNumber}
                  </a>
                ) : (
                  "واتساب غير متاح"
                )}
              </div>

              <div className="contact-item">
                <FaPhone className="icon phone" />
                {info.callNumber ? (
                  <a href={`tel:${info.callNumber}`}>
                    اتصل بنا: {info.callNumber}
                  </a>
                ) : (
                  "رقم الهاتف غير متاح"
                )}
              </div>

              <div className="contact-item">
                <FaEnvelope className="icon email" />
                {info.email ? (
                  <a href={`mailto:${info.email}`}>
                    بريد إلكتروني: {info.email}
                  </a>
                ) : (
                  "البريد غير متاح"
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="contact-footer-modern">
        &copy; 2025 سوق البلد - جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}

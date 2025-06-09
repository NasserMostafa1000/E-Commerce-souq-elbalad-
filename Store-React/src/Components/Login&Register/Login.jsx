import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../../Styles/Login.css";
import API_BASE_URL, { SiteName } from "../Constant.js";
import WebSiteLogo from "../../../public/WebsiteLogo/WebsiteLogo.jsx";

export default function Login() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { path } = location.state || "/";
  const [fbLoaded, setFbLoaded] = useState(false);

  useEffect(() => {
    // تحميل SDK
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        setFbLoaded(true);
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.onload = () => {
        window.FB.init({
          appId: "1224098806172369",
          cookie: true,
          version: "v19.0",
        });
        setFbLoaded(true);
      };
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleFacebookLogin = () => {
    if (!fbLoaded || !window.FB) return setMessage("فشل تحميل Facebook SDK");

    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const token = response.authResponse.accessToken;
          console.log(token);
          handleLogin({
            token,
            authProvider: "Facebook",
          });
        } else {
          setMessage("تم إلغاء تسجيل الدخول عبر فيسبوك");
          setMessageType("error");
        }
      },
      { scope: "email,public_profile" }
    );
  };

  const handleLogin = async ({
    email = null,
    password = null,
    token = null,
    authProvider,
  }) => {
    try {
      const res = await fetch(`${API_BASE_URL}Users/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          token: token,
          authProvider: authProvider,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("token", data.token);
        path ? navigate(`${path}`) : navigate("/");
        setMessage("تم تسجيل الدخول بنجاح!");
        OpenSignalConnection();
        setMessageType("success");
      } else {
        setMessage(data.message || "فشل تسجيل الدخول. الرجاء المحاولة مجدداً.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  const handleOnlineStoreLogin = (e) => {
    e.preventDefault();
    handleLogin({
      email: Email,
      password: Password,
      authProvider: "Online Store",
    });
  };

  // ✅ تسجيل الدخول باستخدام Google
  const handleGoogleLoginSuccess = (response) => {
    const token = response.credential;
    handleLogin({ token, authProvider: "Google" });
  };

  const handleGoogleLoginFailure = () => {
    setMessage("فشل تسجيل الدخول باستخدام Google.");
    setMessageType("error");
  };

  return (
    <div className="login-container">
      <Helmet>
        <title>تسجيل الدخول |{SiteName} </title>
        <meta
          name="description"
          content="سجل دخولك الان لكي تتمكن من تجربه كامله للتسوق من منزلك من خلال متجرنا الاكتروني"
        />
      </Helmet>
      <div>
        <WebSiteLogo width={200} height={100} />
      </div>
      {message && <p className={`message ${messageType}`}>{message}</p>}
      <form onSubmit={handleOnlineStoreLogin}>
        <div>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px" }}
          >
            البريد الإلكتروني
          </label>
          <input
            style={{ backgroundColor: "darkgray" }}
            type="email"
            id="email"
            name="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل بريدك الإلكتروني"
            required
            autoComplete="email" // السماح باللصق والنسخ
          />
        </div>

        <div style={{ marginTop: "2rem" }}>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "5px" }}
          >
            كلمة المرور
          </label>
          <input
            style={{ backgroundColor: "darkgray" }}
            type="password"
            id="password"
            name="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة المرور"
            required
            autoComplete="current-password"
          />
          <p>
            <Link to="/forgot-password">هل نسيت كلمة المرور؟</Link>
          </p>
        </div>

        <button type="submit" style={{ marginTop: "2rem" }}>
          تسجيل الدخول
        </button>
        <span>
          <strong>👇 سجل دخول لدينا بنقره واحده عن طريق جوجل👇</strong>
        </span>

        <div className="social-buttons-container">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
            useOneTap
          />
        </div>
        <span>
          <strong>👇أو عن طريق فيسبوك👇</strong>
        </span>
        <button
          onClick={handleFacebookLogin}
          style={{
            display: "flex",

            justifyContent: "center",
            backgroundColor: "#1877F2",
            color: "white",
            padding: "10px 16px",
            width: "59%",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            gap: "10px",
            alignItems: "center",
            marginLeft: "80px",
            marginTop: "1rem",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#165EBD")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#1877F2")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M22.676 0H1.326C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.326 24H12.82v-9.294H9.692V11.01h3.128V8.414c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.764v2.314h3.587l-.467 3.696h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.676 0z" />
          </svg>
          تسجيل الدخول عبر فيسبوك
        </button>

        <div className="login-links">
          <p>
            تسجيل حساب في سوق البلد
            <Link to="/register" style={{ color: "blue" }}>
              سجل الآن
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

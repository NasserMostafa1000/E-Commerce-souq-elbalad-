import React, { useState, useEffect } from "react";
import API_BASE_URL from "../Constant"; // تأكد من ضبط المسار الصحيح
import "../../Styles/ContactUs.css"; // ملف التنسيق الخاص بالمكون
import { FaWhatsapp, FaPhone, FaEnvelope } from "react-icons/fa";
import "../../Styles/Home.css";
import { Helmet } from "react-helmet";

export default function ContactUs() {
  const [adminInfo, setAdminInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAdminInfo() {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}AdminInfo/get-admin-info`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("فشل في جلب بيانات الإدارة");
        }
        const data = await response.json();
        setAdminInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminInfo();
  }, []);

  return (
    <div className="about-contact-container">
      <Helmet>
        <title>من نحن | سوق البلد - أفضل تجربة تسوق إلكتروني</title>

        {/* وصف لمحركات البحث */}
        <meta
          name="description"
          content="تعرف على سوق البلد، منصتك الموثوقة للتجارة الإلكترونية في مصر. اكتشف رؤيتنا، سياستنا في الشحن والإرجاع، والتزامنا براحة العملاء. تواصل معنا بسهولة عبر الهاتف أو الواتساب."
        />
        <meta
          name="keywords"
          content="من نحن, سوق البلد, تواصل معنا, دعم العملاء, سياسة الإرجاع, تسوق إلكتروني, التجارة الإلكترونية, سوق مصر"
        />
        <meta name="author" content="سوق البلد" />

        {/* OG لفيسبوك وواتساب */}
        <meta
          property="og:title"
          content="من نحن | سوق البلد - منصتك للتسوق بثقة"
        />
        <meta
          property="og:description"
          content="سوق البلد يقدّم لك تجربة تسوق إلكتروني موثوقة، شحن فوري، سياسة إرجاع عادلة، وتواصل مباشر مع فريق الدعم."
        />
        <meta
          property="og:url"
          content="https://souq-elbalad.netlify.app/Contact"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://souq-elbalad.netlify.app/SouqLogo.png"
        />

        {/* تويتر كارد */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="من نحن | سوق البلد - أفضل تجربة تسوق إلكتروني"
        />
        <meta
          name="twitter:description"
          content="تعرف على قصة سوق البلد وخدماتنا الفريدة. اتصل بنا بسهولة واطلب الآن بثقة."
        />
        <meta
          name="twitter:image"
          content="https://souq-elbalad.netlify.app/SouqLogo.png"
        />
      </Helmet>

      {/* قسم "من نحن" */}
      <section className="about-section">
        <h1 className="about-title">من نحن</h1>
        <p className="about-description">
          🌟 مرحباً بكم في منصتنا الرائدة في عالم التجارة الإلكترونية! نحن في
          سوق البلد نؤمن أن تجربة التسوق لا تكتمل إلا بتوفير الراحة والثقة
          والسرعة للعميل، لذلك قمنا ببناء منظومة متكاملة تتيح لك: 🚚 توصيل فوري
          في نفس اليوم بمجرد إتمام طلبك على موقعنا، نقوم على الفور بشراء المنتج
          وشحنه إليك خلال ساعات قليلة، لتصلك مشترياتك في نفس اليوم أينما كنت
          داخل المدينة — بكل سرعة وأمان. ✅ احترام سياسة الإرجاع العادل نحن
          نحترم حقوق عملائنا كما نحترم شركائنا من البائعين، لذلك نلتزم بسياسة
          إرجاع مرنة في الحالات التالية: إذا كان المنتج لا يعمل أو فيه خلل
          مصنعي. إذا لم يكن المنتج هو المطلوب أو لا يحمل نفس العلامة التجارية
          المذكورة. إذا كان المنتج منتهي الصلاحية. إذا تم استلامه مفتوحًا أو غير
          مغلف بشكل سليم. كل ما عليك هو التواصل معنا من{" "}
          <span>
            <a href="/contact">هنا</a>
          </span>
          ، وسنقوم باتخاذ اللازم فورًا لضمان رضاك الكامل. 🛒 الطلب في أي وقت
          منصتنا تعمل على مدار الساعة — يمكنك تقديم طلبك في أي وقت من اليوم،
          وسنقوم بمعالجته وشراء المنتج مباشرة بعد تأكيدك، ثم نشحنه فورًا إلى
          عنوانك. 🤝 التزامنا تجاهك نحن لا نحتفظ بالمنتجات في مخازننا لفترات
          طويلة، بل نشتريها حسب الطلب لضمان حصولك على منتج حديث، موثوق، وبجودة
          ممتازة. كما نحرص دائمًا على التعامل مع موردين موثوقين، لضمان جودة
          المنتجات وأصالة العلامات التجارية. 📞 في حال وجود أي استفسار أو
          ملاحظات، لا تتردد في التواصل مع فريق خدمة العملاء الخاص بنا، نحن هنا
          لخدمتك. مع تحيات فريق سوق البلد - حيث تبدأ تجربة التسوق بثقة وتنتهي
          برضا.
        </p>
      </section>

      {/* قسم "تواصل معنا" */}
      <section className="contact-section">
        <h2 className="contact-title"> تواصل مع خدمه العملاء ألأن</h2>
        {loading ? (
          <div className="contact-loading">جاري التحميل...</div>
        ) : error ? (
          <div className="contact-error">خطأ: {error}</div>
        ) : (
          <div className="contact-cards">
            {adminInfo.map((info, index) => (
              <div key={index} className="contact-card">
                <p>
                  <strong>واتساب:</strong>{" "}
                  {info.whatsAppNumber ? (
                    <a
                      href={`https://wa.me/${info.whatsAppNumber.replace(
                        /[^0-9]/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-link"
                    >
                      <FaWhatsapp size={24} className="icon" />
                      اضغط هنا لارسال رساله عبر واتساب
                    </a>
                  ) : (
                    "غير متوفر"
                  )}
                </p>
                <p>
                  <strong>هاتف:</strong>{" "}
                  {info.callNumber ? (
                    <a
                      href={`tel:${info.callNumber.replace(/[^0-9]/g, "")}`}
                      className="phone-link"
                    >
                      <FaPhone size={24} className="icon" />
                      اضغط هنا لاأتصال بنا الأن
                    </a>
                  ) : (
                    "غير متوفر"
                  )}
                </p>
                <p>
                  <strong style={{ direction: "ltr" }}>البريد:</strong>{" "}
                  {info.email ? (
                    <a href={`mailto:${info.email}`} className="email-link">
                      <FaEnvelope
                        size={24}
                        className="icon"
                        style={{ marginRight: "8px" }}
                      />
                      {info.email}
                    </a>
                  ) : (
                    "غير متوفر"
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
      <footer className="contact-footer">
        حقوق النشر © 2025 - جميع الحقوق محفوظة
      </footer>
    </div>
  );
}

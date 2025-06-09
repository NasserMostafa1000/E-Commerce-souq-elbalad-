import React from "react";
import { Helmet } from "react-helmet";
import { SiteName } from "../Constant";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Helmet>
        <title>من نحن - {SiteName}</title>
        <meta
          name="description"
          content={`تعرف على خدمات وسياستنا في ${SiteName} - توصيل سريع، دعم دائم، وسياسة إرجاع عادلة، هدفنا راحتك وثقتك.`}
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`من نحن - ${SiteName}`} />
        <meta
          property="og:description"
          content="اكتشف المزيد عن رؤيتنا، مميزاتنا، ودعمنا المستمر لك في سوق البلد."
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_AR" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main
        dir="rtl"
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-gray-800"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          من نحن
        </h1>

        <section className="mb-8 text-lg leading-loose">
          <p>
            نحن في{" "}
            <strong className="text-red-600 font-semibold">{SiteName}</strong>{" "}
            نؤمن أن <span className="font-bold text-gray-900">راحة العميل</span>{" "}
            تأتي أولاً، لذلك نعمل على{" "}
            <span className="text-red-600 font-semibold">توصيل سريع</span>،
            <span className="font-semibold">دعم دائم</span>، و
            <strong>سياسة إرجاع عادلة</strong>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-3">مميزاتنا:</h2>
          <ul className="list-disc pr-6 space-y-2 text-base">
            <li>
              <strong className="text-red-600">طلب على مدار الساعة</strong> —
              يمكنك الطلب متى شئت، وسنبدأ المعالجة فورًا.
            </li>
            <li>
              <strong>شراء مباشر</strong> للمنتجات بعد تأكيد الطلب دون تأخير.
            </li>
            <li>
              <span className="text-red-600 font-semibold">
                توصيل في نفس اليوم
              </span>{" "}
              داخل المدينة خلال ساعات فقط.
            </li>
            <li>
              سياسة إرجاع مرنة تشمل:
              <ul className="list-disc pr-6 mt-2 text-sm space-y-1 text-gray-700">
                <li>منتج غير مطابق أو منتهي الصلاحية.</li>
                <li>منتج مفتوح أو تالف عند التسليم.</li>
                <li>اختلاف في العلامة التجارية أو الوصف.</li>
              </ul>
            </li>
            <li>
              <strong>نحترم حقوق</strong> كل من العميل والبائع، ونسعى للعدالة.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-3">دعم العملاء:</h2>
          <p className="text-base leading-relaxed">
            في <span className="font-semibold text-red-600">{SiteName}</span>{" "}
            لدينا فريق دعم يعمل <strong>طوال اليوم</strong> للإجابة على
            استفساراتك ومساعدتك خطوة بخطوة. يمكنك التواصل معنا عبر{" "}
            <span className="font-bold">البريد الإلكتروني</span> أو{" "}
            <span className="font-bold">الهاتف</span> أو{" "}
            <span className="font-bold">الواتساب</span>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-700 mb-3">رؤيتنا:</h2>
          <p className="text-base leading-relaxed">
            أن نصبح <strong className="text-red-600">الوجهة الأولى</strong>{" "}
            للتجارة الإلكترونية في العالم العربي، عبر{" "}
            <span className="font-semibold">الشفافية</span>،{" "}
            <span className="font-semibold">السرعة</span>، و
            <strong>احترام العميل</strong> في كل خطوة.
          </p>
        </section>

        <div className="text-center">
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-medium text-lg py-2 px-8 rounded-full transition duration-300"
            onClick={() => (window.location.pathname = "/")}
          >
            تصفّح المنتجات الآن
          </button>
        </div>
      </main>
    </div>
  );
}

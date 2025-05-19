import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet"; // استيراد Helmet لضبط SEO
import { useLocation, useNavigate } from "react-router-dom";
import getDeliveryDate, {
  playNotificationSound,
  SendSignalMessageForOrders,
  startConnection,
} from "../utils.js";
import AddressSelector from "./AddressSelector.jsx";
import "../../Styles/PurchaseOperationDetails.css";
import PhoneNumberModal from "./PhoneModel.jsx";
import OrderSummary from "./PurchaseSummray.jsx";
import OrderActions from "./PurchasesAction.jsx";
import {
  fetchAddresses,
  fetchShipOrderInfo,
  fetchClientPhone,
  postOrder,
  postOrderDetails,
  PostListOfOrdersDetails,
} from "./api.js";
import SuccessForm from "./SuccessForm.jsx";
import { SiteName } from "../Constant.js";

export default function PurchaseOperationDetails() {
  const [ShipPrice, SetShiPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [UserTransactionNum, SetUserTransactionNum] = useState("");
  const [addresses, setAddresses] = useState({});
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [AdminTransactionNum, SetAdminTransactionNum] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [transactionImage, setTransactionImage] = useState(null);
  const [newAddress, setNewAddress] = useState({
    governorate: "",
    city: "",
    street: "",
  });
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [message, setMessage] = useState(""); // رسالة الحالة أو الخطأ
  const [showSuccessForm, setShowSuccessForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const Products = location.state?.Product;
  const isBuyDisabled =
    (!UserTransactionNum && paymentMethod === "online") ||
    (!transactionImage && paymentMethod === "online") ||
    Object.keys(addresses).length === 0;
  const productPrice = Array.isArray(Products)
    ? Products.reduce((sum, p) => sum + p.unitPrice * p.quantity, 0)
    : Products.unitPrice * Products.quantity;

  const finalPrice =
    paymentMethod === "cod"
      ? productPrice + ShipPrice + 30
      : productPrice + ShipPrice;
  useEffect(() => {
    const _fetchAddresses = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const Jsonresponse = await fetchAddresses(token);
        const fetchedAddresses = Jsonresponse.addresses;
        if (Object.keys(fetchedAddresses).length > 0) {
          setAddresses(fetchedAddresses);
          setSelectedAddressId(Object.keys(fetchedAddresses)[0]);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error.message);
      }
    };
    _fetchAddresses();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [message]);

  useEffect(() => {
    const _fetchShipOrderInfo = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!addresses[selectedAddressId]) return;
        const Governorate = addresses[selectedAddressId].split("-")[0];
        const JsonResponse = await fetchShipOrderInfo(token, Governorate);
        SetAdminTransactionNum(JsonResponse.transactionNumber);
        SetShiPrice(JsonResponse.shipPrice);
      } catch (error) {
        console.error(error.message);
      }
    };
    _fetchShipOrderInfo();
  }, [selectedAddressId, addresses]);

  useEffect(() => {
    const _fetchClientPhone = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const JsonResponse = await fetchClientPhone(token);
        setClientPhone(JsonResponse.phoneNumber);
      } catch (error) {
        setShowPhoneModal(true);
      } finally {
        setLoading(false);
      }
    };
    _fetchClientPhone();
  }, []);

  function CreateOrderDetails(OrderId) {
    return {
      productDetailsId: Products.productDetailsId,
      quantity: Products.quantity,
      unitPrice: Products.unitPrice,
      orderId: OrderId,
    };
  }

  async function HandleBuyClick() {
    setPurchaseLoading(true);
    const token = sessionStorage.getItem("token");

    const orderData = {
      address: addresses[selectedAddressId],
      totalPrice: finalPrice,
      ShippingCoast: ShipPrice,
      paymentMethodId: paymentMethod === "cod" ? 2 : 1,
      transactionNumber:
        paymentMethod === "online" ? UserTransactionNum.toString() : "",
    };

    try {
      const OrderId = await postOrder(token, orderData);
      await startConnection();
      await SendSignalMessageForOrders("new Order" + OrderId);

      if (Array.isArray(Products) && Products.length > 1) {
        await PostListOfOrdersDetails(OrderId, token, Products);
      } else {
        const orderDetails = CreateOrderDetails(OrderId);
        if (orderDetails) {
          await postOrderDetails(token, OrderId, orderDetails);
        }
      }
      playNotificationSound();
      setMessage(
        "✅ تم الطلب بنجاح! يمكنك متابعة طلبك في قسم طلباتي، ولأي خدمة أخرى يمكنك التواصل مع الدعم الفني من خلال قسم تواصل معنا"
      );
      // عرض نموذج النجاح
      setShowSuccessForm(true);
    } catch (error) {
      console.error("❌ خطأ أثناء إتمام الطلب:", error);
      setMessage("❌ حدث خطأ أثناء إتمام الطلب. الرجاء المحاولة مرة أخرى.");
    } finally {
      setPurchaseLoading(false);
    }
  }

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="purchase-container" dir="rtl">
      <Helmet>
        <title>تفاصيل الطلب | {SiteName} </title>
        <meta
          name="description"
          content="تفاصيل الطلب في موقع تابع طلبك وتواصل مع الدعم الفني."
        />
      </Helmet>

      {showSuccessForm && (
        <SuccessForm
          message={message}
          onClose={() => setShowSuccessForm(false)}
        />
      )}

      {message && !showSuccessForm && (
        <div
          className={`global-message ${
            message.startsWith("✅") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      <h1 className="highlighted-title">تفاصيل الطلب</h1>

      <AddressSelector
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        setSelectedAddressId={setSelectedAddressId}
        setShowAddAddressModal={setShowAddAddressModal}
        showAddAddressModal={showAddAddressModal}
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        setAddresses={setAddresses}
      />

      <div className="invoice-row">
        <span className="invoice-label">هاتفك للاتصال:</span>
        <a
          onClick={() => setShowPhoneModal(true)}
          className="invoice-value link"
        >
          {clientPhone}
        </a>
      </div>

      <h3 className="section-title">تفاصيل الشحنة</h3>
      <OrderSummary Products={Products} ShipPrice={ShipPrice} />

      <div className="invoice-row">
        <span className="invoice-label">شحن إلى:</span>
        <span className="invoice-value">{addresses[selectedAddressId]}</span>
      </div>

      <div className="invoice-row">
        <span className="invoice-label">الموعد النهائي للاستلام:</span>
        <span className="invoice-value">{getDeliveryDate()}</span>
      </div>

      <div className="payment-methods">
        <h3 className="section-title">طرق الدفع</h3>
        <label className="payment-option">
          <input
            type="radio"
            value="online"
            checked={paymentMethod === "online"}
            onChange={() => setPaymentMethod("online")}
          />
          الدفع الإلكتروني
        </label>
        {paymentMethod === "online" && (
          <div className="payment-details">
            <strong>حول الفلوس هنا: {AdminTransactionNum}</strong>
          </div>
        )}
        <label className="payment-option">
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          الدفع عند الاستلام
        </label>
        {paymentMethod === "cod" && (
          <div className="payment-details">
            <img
              src="/Icons/الدفع-عند-الاستلام.ico"
              alt="Cash on Delivery"
              title="Cash on Delivery"
              className="cod-icon"
            />
            <div className="tax-row">
              <span>ضريبة الدفع عند الاستلام:</span>
              <strong>٣٠ جنيه</strong>
            </div>
          </div>
        )}
      </div>

      {paymentMethod === "online" && (
        <OrderActions
          UserTransactionNum={UserTransactionNum}
          SetUserTransactionNum={SetUserTransactionNum}
          setTransactionImage={setTransactionImage}
        />
      )}

      {paymentMethod === "online" && (
        <div className="note">
          <h2>ملحوظة</h2>
          <p>
            يجب تحويل المبلغ المستحق بالكامل إلى هذا الرقم قبل الضغط على زر شراء{" "}
            <strong>{AdminTransactionNum}</strong> وإن كان المبلغ المستحق أقل أو
            أكثر من المطلوب فسيتم رد الأموال تلقائيًا على نفس الرقم في غضون 24
            ساعة.
          </p>
        </div>
      )}

      {showPhoneModal && (
        <PhoneNumberModal
          setShowPhoneModal={setShowPhoneModal}
          setClientPhone={setClientPhone}
          newPhoneNumber={newPhoneNumber}
          setNewPhoneNumber={setNewPhoneNumber}
        />
      )}

      <div className="final-price">
        السعر النهائي:
        <strong>{finalPrice} جنيه</strong>
      </div>

      {!isBuyDisabled && (
        <button
          className="save-btn"
          onClick={HandleBuyClick}
          disabled={isBuyDisabled}
        >
          اتمام
        </button>
      )}

      {purchaseLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

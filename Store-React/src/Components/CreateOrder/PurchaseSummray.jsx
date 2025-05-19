import "../../styles/PurchaseOperationDetails.css"; // ✅ يخرج من مجلد Orders ثم من components ثم يدخل styles
import { GetUserNameFromToken } from "../utils";

export default function OrderSummary({ Products, ShipPrice }) {
  return (
    <div>
      <h4>
        اسم المستلم :
        <strong style={{ color: " #2a9d8f" }}>
          {GetUserNameFromToken(sessionStorage.getItem("token"))}{" "}
        </strong>
      </h4>
      <h4 style={{ color: "black" }}>
        سعر الشحنة:
        <strong style={{ color: " #2a9d8f" }}> {Products.totalPrice} </strong>
      </h4>
      <h4 style={{ color: ShipPrice === 0 ? "red" : "black" }}>
        سعر الشحن لمحافظتك هو
        <strong style={{ color: " #2a9d8f" }}>
          {" "}
          {ShipPrice !== 0 ? `${ShipPrice}` : "يرجى اختيار العنوان أولاً"}
        </strong>
      </h4>

      <h4 style={{ color: ShipPrice === 0 ? "red" : "black" }}>
        {ShipPrice === 0 ? (
          "يرجى اختيار العنوان لحساب السعر النهائي"
        ) : (
          <>
            السعر النهائي:{" "}
            <strong style={{ color: " #2a9d8f" }}>
              {Products.totalPrice + ShipPrice}
            </strong>
          </>
        )}
      </h4>
    </div>
  );
}

import { egyptianGovernorates } from "../../Components/utils";
import { handleAddAddress } from "./api.js";

export default function AddressSelector({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  setShowAddAddressModal,
  showAddAddressModal,
  newAddress,
  setNewAddress,
  setAddresses,
}) {
  const HandleSaveClick = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("لم يتم العثور على التوكن، الرجاء تسجيل الدخول.");
      return;
    }
    try {
      const addressId = await handleAddAddress(token, {
        governorate: newAddress.governorate,
        city: newAddress.city,
        street: newAddress.street,
      });

      if (!addressId)
        throw new Error("❌ فشل في الحصول على ID العنوان الجديد!");
      setAddresses((prevAddresses) => ({
        ...prevAddresses,
        [addressId]: `${newAddress.governorate}- مدينه ${newAddress.city} شارع ${newAddress.street}`,
      }));

      setSelectedAddressId(addressId);
      setShowAddAddressModal(false);
      setNewAddress({ governorate: "", city: "", street: "" });
    } catch (error) {
      console.error("❌ خطأ أثناء إضافة العنوان:", error.message);
      alert(`⚠️ خطأ: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h4 className="text-lg font-semibold text-gray-800">العنوان المختار</h4>

      {Object.keys(addresses).length > 0 ? (
        <select
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right focus:border-blue-500 focus:outline-none"
          value={selectedAddressId}
          onChange={(e) => setSelectedAddressId(e.target.value)}
        >
          {Object.entries(addresses).map(([id, address]) => (
            <option key={id} value={id}>
              {address}
            </option>
          ))}
        </select>
      ) : (
        <button className="text-red-500 text-sm">
          👇 لا توجد عناوين متاحة، قم بإضافة عنوان الآن 👇
        </button>
      )}

      <div>
        <button
          href="#"
          className="text-bold-600 hover:underline text-sm"
          onClick={(e) => {
            e.preventDefault();
            setShowAddAddressModal(true);
          }}
        >
          + أضف عنوانًا جديدًا
        </button>
      </div>

      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-gray-800 text-center">
              إضافة عنوان جديد
            </h3>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                المحافظة:
              </label>
              <select
                value={newAddress.governorate}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    governorate: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="">اختر محافظة</option>
                {egyptianGovernorates.map((governorate, index) => (
                  <option key={index} value={governorate}>
                    {governorate}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-medium text-gray-700">
                المدينة:
              </label>
              <input
                type="text"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />

              <label className="block text-sm font-medium text-gray-700">
                الشارع:
              </label>
              <input
                type="text"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-between space-x-2">
              <button
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
                onClick={HandleSaveClick}
              >
                حفظ العنوان
              </button>
              <button
                className="flex-1 bg-gray-300 text-gray-800 rounded-lg py-2 hover:bg-gray-400 transition"
                onClick={() => setShowAddAddressModal(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

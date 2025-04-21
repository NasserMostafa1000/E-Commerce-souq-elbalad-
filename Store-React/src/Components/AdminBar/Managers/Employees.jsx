import { useEffect, useState } from "react";
import API_BASE_URL from "../../Constant";
import "../../../Styles/AdminOrders.css"; // استيراد التنسيق

export default function Employees() {
  const [managers, setManagers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newManager, setNewManager] = useState({
    email: "",
    fullName: "",
    password: "",
    role: "General Manager",
  });
  const [errorMessage, setErrorMessage] = useState(""); // حالة لتخزين الأخطاء

  // جلب التوكن من sessionStorage
  const token = sessionStorage.getItem("token");

  // تحميل بيانات المديرين عند فتح الصفحة
  useEffect(() => {
    fetchManagers();
  }, []);

  async function fetchManagers() {
    try {
      setErrorMessage(""); // إعادة ضبط رسالة الخطأ
      const response = await fetch(`${API_BASE_URL}Users/get-Employees`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل في تحميل البيانات");
      }

      const data = await response.json();
      console.log(data);
      setManagers(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function addManager() {
    try {
      setErrorMessage("");

      const endpoint =
        newManager.role === "General Manager"
          ? `${API_BASE_URL}Users/PostManager`
          : newManager.role === "Shipping Man"
          ? `${API_BASE_URL}Users/PostShippingMan`
          : newManager.role === "Cashier Man"
          ? `${API_BASE_URL}Users/PostCashierMan`
          : `${API_BASE_URL}Users/PostTechnicalSupport`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emailOrAuthId: newManager.email,
          password: newManager.password,
          firstName: newManager.fullName.split(" ")[0],
          secondName:
            (newManager.fullName.split(" ")[1] ?? "") +
            " " +
            (newManager.fullName.split(" ")[2] ?? "") +
            " " +
            (newManager.fullName.split(" ")[3] ?? ""),
          AuthProvider: "online Store",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل في إضافة المدير");
      }

      setShowModal(false);
      fetchManagers();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function deleteManager(email) {
    try {
      setErrorMessage(""); // إعادة ضبط رسالة الخطأ
      const response = await fetch(
        `${API_BASE_URL}Users/RemoveEmployee?email=${email}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل في حذف المدير");
      }

      fetchManagers();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      <h2 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-lg">
        {" "}
        إدارة الموظفين
      </h2>
      <div className="container mx-auto p-6">
        {/* عرض رسالة الخطأ إن وجدت */}
        {errorMessage && (
          <div className="mb-4 p-2 bg-red-500 text-white text-center rounded">
            {errorMessage}
          </div>
        )}

        {/* جدول عرض المديرين */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">الأسم الكامل</th>
              <th className="border p-2">الإيميل</th>
              <th className="border p-2">الدور</th>
              <th className="border p-2">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager, index) => (
              <tr key={index} className="border" style={{ color: "black" }}>
                <td className="border p-2">{manager.fullName}</td>
                <td className="border p-2">{manager.email}</td>
                <td className="border p-2">{manager.roleName}</td>
                <td className="border p-2 text-center">
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => deleteManager(manager.email)}
                    style={{ backgroundColor: "red" }}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* زر فتح النافذة المنبثقة لإضافة مدير جديد */}
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setShowModal(true)}
        >
          إضافة موظف جديد
        </button>

        {/* النافذة المنبثقة لإدخال بيانات المدير الجديد */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-xl font-bold mb-4 text-center">
                إضافة مدير جديد
              </h3>
              <div className="mb-4">
                <label className="block mb-1 text-right font-semibold">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newManager.fullName}
                  onChange={(e) =>
                    setNewManager({ ...newManager, fullName: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-right font-semibold">
                  البريد الإلكتروني:
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  value={newManager.email}
                  onChange={(e) =>
                    setNewManager({ ...newManager, email: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-right font-semibold">
                  كلمة المرور:
                </label>
                <input
                  type="password"
                  className="w-full p-2 border rounded"
                  value={newManager.password}
                  onChange={(e) =>
                    setNewManager({ ...newManager, password: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-right font-semibold">
                  اختر الدور:
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={newManager.role}
                  onChange={(e) =>
                    setNewManager({ ...newManager, role: e.target.value })
                  }
                >
                  <option value="General Manager">مدير عام</option>
                  <option value="Technical support">دعم فني</option>
                  <option value="Cashier Man">كاشير</option>
                  <option value="Shipping Man">سائق شحن</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                  onClick={() => setShowModal(false)}
                >
                  إلغاء
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={addManager}
                >
                  إضافة
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

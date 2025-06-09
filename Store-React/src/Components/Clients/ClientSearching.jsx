import React, { useEffect, useState } from "react";
import "../../Styles/AdminOrders.css";
import API_BASE_URL from "../Constant";

export default function ClientSearching() {
  const [searchLogs, setSearchLogs] = useState([]);
  const [topSearches, setTopSearches] = useState([]);
  const [filterTerm, setFilterTerm] = useState("");
  const [filterTop, setFilterTop] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");

  const fetchAllSearches = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}SearchLogs/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("خطأ في جلب البيانات");
      const data = await response.json();
      setSearchLogs(data);
    } catch (error) {
      alert("حدث خطأ أثناء جلب السجلات");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopSearches = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}SearchLogs/top`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("خطأ في جلب البيانات");
      const data = await response.json();

      const transformed =
        data && typeof data === "object" && !Array.isArray(data)
          ? Object.entries(data).map(([key, value]) => ({
              searchKeyWord: key,
              searchCount: value,
            }))
          : Array.isArray(data)
          ? data
          : [];

      setTopSearches(transformed);
    } catch (error) {
      alert("حدث خطأ أثناء جلب أكثر الكلمات بحثاً");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterTop) {
      fetchTopSearches();
    } else {
      fetchAllSearches();
    }
  }, [filterTop]);

  const filteredLogs = searchLogs.filter((log) => {
    const term = filterTerm.trim().toLowerCase();
    if (!term) return true;
    return (log.searchKeyWord || "").toLowerCase().includes(term);
  });

  return (
    <div className="admin-orders-container" style={{ padding: "20px" }}>
      <h2 style={{ color: "black" }}>سجل عمليات البحث</h2>

      <div style={{ marginBottom: "10px" }}>
        <label style={{ color: "black", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={filterTop}
            onChange={() => setFilterTop((prev) => !prev)}
          />{" "}
          عرض أكثر الكلمات بحثاً
        </label>
      </div>

      {!filterTop && (
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="فلتر حسب كلمة البحث..."
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            style={{ padding: "5px", width: "300px" }}
          />
        </div>
      )}

      {loading ? (
        <p style={{ color: "black" }}>جاري التحميل...</p>
      ) : filterTop ? (
        <table className="orders-table" style={{ color: "black", width: "100%" }}>
          <thead>
            <tr>
              <th>كلمة البحث</th>
              <th>عدد مرات البحث</th>
            </tr>
          </thead>
          <tbody>
            {topSearches.length === 0 ? (
              <tr>
                <td colSpan="2">لا توجد بيانات</td>
              </tr>
            ) : (
              topSearches.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.searchKeyWord}</td>
                  <td>{item.searchCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <table className="orders-table" style={{  color: "black", width: "100%" }}>
          <thead>
            <tr  >
              <th>رقم العميل</th>
              <th>كلمة البحث</th>
              <th>اسم العميل</th>
              <th>تاريخ البحث</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="4">لا توجد بيانات</td>
              </tr>
            ) : (
              filteredLogs.map((log, idx) => (
                <tr key={idx}>
                  <td>{log.clientId || "-"}</td>
                  <td>{log.searchKeyWord}</td>
                  <td>
                    {log.clientFullName && log.clientFullName.trim()
                      ? log.clientFullName.trim()
                      : "غير معروف"}
                  </td>
                  <td>
                    {log.searchDate === "0001-01-01T00:00:00"
                      ? "-"
                      : new Date(log.searchDate).toLocaleDateString("ar-EG", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

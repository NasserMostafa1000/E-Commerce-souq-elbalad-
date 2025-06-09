import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import "../../Styles/NavBar.css";
import API_BASE_URL from "../Constant";

export default function SearchBar({ onSearch, searchType = "products" }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return; // لا ترسل بحث فارغ

    const token = sessionStorage.getItem("token");
    console.log("Token:", token);

    try {
      const response = await fetch(
        `${API_BASE_URL}searchlogs/add?searchTerm=${encodeURIComponent(
          searchQuery
        )}`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorData = await response.text();
        console.error("خطأ من السيرفر:", errorData);
      }
    } catch (error) {
      console.error("فشل تسجيل البحث:", error);
    } finally {
      onSearch(searchQuery); // استدعاء البحث بالواجهة بأي حال
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder={
          searchType === "products" ? " ماذا تبحث عن " : "ابحث برقم الطلب"
        }
        className="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
          }
        }}
      />
      <FiSearch size={22} className="search-icon" onClick={handleSearch} />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "../../Styles/CategoryItem.css";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const navigate = useNavigate();
  const [shuffledCategories, setShuffledCategories] = useState([]);

  const handleSearch = (query) => {
    navigate("/FindProducts", { state: { searchQuery: query } });
  };

  const categories = [
    {
      name: "تسوق أحدث موديلات الأحذية",
      query: "أحذية",
      image: "/ProjectImages/shoes.jpg",
    },
    {
      name: "أدوات المطبخ",
      query: "مطبخ",
      image: "/ProjectImages/Kitchen tools.jpg",
    },
    {
      name: "أدوات التنظيف",
      query: "أدوات تنظيف",
      image: "/ProjectImages/cleaning Tools.jpg",
    },
    {
      name: "سيارات",
      query: "سيارات",
      image: "/ProjectImages/CollectionOfCars.jpg",
    },
    {
      name: "هواتف",
      query: "هواتف",
      image: "/ProjectImages/Phones.jpg",
    },
    {
      name: "ساعات",
      query: "ساعات",
      image: "/ProjectImages/Collection Of Watches.jpg",
    },
    {
      name: "أجهزة منزلية",
      query: "أجهزة منزلية",
      image: "/ProjectImages/kitchen Machines.png",
    },
    {
      name: "مستحضرات تجميل",
      query: "مستحضرات تجميل",
      image: "/ProjectImages/makeup.jpg",
    },
    {
      name: "معدات صناعية",
      query: "معدات صناعية",
      image: "/ProjectImages/معدات صناعيه.jpg",
    },
    {
      name: "أدوية",
      query: "أدوية",
      image: "/ProjectImages/medicines.jpg",
    },
  ];

  // دالة لتبديل ترتيب المصفوفة
  const shuffleArray = (array) => {
    const result = [...array];
    for (let i = result.length / 2; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  useEffect(() => {
    setShuffledCategories(shuffleArray(categories));
  }, []);

  return (
    <div className="Categories-container">
      <h1 className="Categories-title">ماذا تبحث </h1>
      <div className="Categories-items">
        {shuffledCategories.map((item, index) => (
          <div
            key={index}
            className="Category-item"
            onClick={() => handleSearch(item.query)}
          >
            <div className="Category-name">{item.name}</div>
            <img className="Category-image" src={item.image} alt={item.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

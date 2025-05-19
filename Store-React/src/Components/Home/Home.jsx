import React, { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import NavBar from "./Nav";
import ProductItem from "../Products/ProductItem.jsx";
import API_BASE_URL, { SiteName } from "../Constant.js";
import CategoryItems from "./CategoryItems.jsx";
import "../../Styles/Home.css";
import { getRoleFromToken } from "../utils.js";
import ContactUs from "./ContactUs.jsx";
import WebSiteLogo from "../../../public/WebsiteLogo/WebsiteLogo.jsx";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [Discountproducts, setDiscountProducts] = useState([]);
  const [clothesProducts, setClothesProducts] = useState([]);
  const [DiscountProductsPage, setDiscountProductsPage] = useState(1);
  const [ProductsPage, setProductsPage] = useState(1);
  const [ClothesPage, setClothesPage] = useState(1);
  const [hasMoreDisCountProducts, setHasMoreDiscountProducts] = useState(true);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [hasMoreClothes, setHasMoreClothes] = useState(true);
  const [loadingClothes, setLoadingClothes] = useState(false);
  const [LoadingProducts, setloadingProducts] = useState(false);
  const [loadingDiscountProducts, setloadingDiscountProducts] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOtherProducts = async () => {
    if (!hasMoreProducts || LoadingProducts) return; // ✅ التصحيح هنا
    setloadingProducts(true); // هذه صح
    try {
      const response = await fetch(
        `${API_BASE_URL}Product/GetAllProductsWithLimit?page=${ProductsPage}&limit=10`
      );
      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      if (data.length === 0) setHasMoreProducts(false);
      else {
        setProducts((prev) => [...prev, ...data]);
        setProductsPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching other products:", error);
    } finally {
      setloadingProducts(false);
    }
  };

  const fetchDiscountProducts = async () => {
    if (!hasMoreDisCountProducts || loadingDiscountProducts) return;
    setloadingDiscountProducts(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}Product/GetDiscountProducts?page=${DiscountProductsPage}&limit=10`
      );
      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      if (data.length === 0) setHasMoreDiscountProducts(false);
      else {
        setDiscountProducts((prev) => [...prev, ...data]);
        setDiscountProductsPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching discount products:", error);
    } finally {
      setloadingDiscountProducts(false);
    }
  };

  const fetchClothesProducts = async () => {
    if (!hasMoreClothes || loadingClothes) return;
    setLoadingClothes(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}Product/GetProductsWhereInClothesCategory?page=${ClothesPage}&limit=10`
      );
      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      if (data.length === 0) setHasMoreClothes(false);
      else {
        setClothesProducts((prev) => [...prev, ...data]);
        setClothesPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching clothes products:", error);
    } finally {
      setLoadingClothes(false);
    }
  };

  const handleScroll = useCallback((ref, fetchMore) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    const isRtl = getComputedStyle(ref.current).direction === "rtl";

    // Handle RTL scroll detection
    const isAtEnd = isRtl
      ? scrollLeft <= 10
      : scrollLeft + clientWidth >= scrollWidth - 10;

    if (isAtEnd) fetchMore();
  }, []);
  useEffect(() => {
    fetchDiscountProducts();
    fetchClothesProducts();
    fetchOtherProducts();
  }, []);
  const DiscountProductsRef = useRef(null);
  const ProductsRef = useRef(null);
  const clothesRef = useRef(null);
  useEffect(() => {
    const DiscountProductsDiv = DiscountProductsRef.current;
    const productsDiv = ProductsRef.current;
    const clothesDiv = clothesRef.current;

    const DiscountProductsScrollHandler = () =>
      handleScroll(DiscountProductsRef, fetchDiscountProducts);
    const clothesScrollHandler = () =>
      handleScroll(clothesRef, fetchClothesProducts);
    const productsScrollHandler = () =>
      handleScroll(ProductsRef, fetchOtherProducts);

    if (DiscountProductsDiv)
      DiscountProductsDiv.addEventListener(
        "scroll",
        DiscountProductsScrollHandler
      );
    if (clothesDiv) clothesDiv.addEventListener("scroll", clothesScrollHandler);
    if (productsDiv)
      productsDiv.addEventListener("scroll", productsScrollHandler);

    return () => {
      if (DiscountProductsDiv)
        DiscountProductsDiv.removeEventListener(
          "scroll",
          DiscountProductsScrollHandler
        );
      if (clothesDiv)
        clothesDiv.removeEventListener("scroll", clothesScrollHandler);
      if (productsDiv)
        productsDiv.removeEventListener("scroll", productsScrollHandler);
    };
  }, [
    handleScroll,
    fetchDiscountProducts,
    fetchClothesProducts,
    fetchOtherProducts,
  ]);

  function handleProductClick(product) {
    navigate(`/productDetails/${product.productId}`, {
      state: { product },
      replace: true,
    });
  }

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "grey",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontSize: "36px",
            color: "black",
            margin: "0 0 20px",
          }}
        >
          سوق البلد يرحب بكم
        </h2>
        <WebSiteLogo width={200} height={100} />
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>الصفحه الرئيسيه - {SiteName} </title>
        <meta
          name="description"
          content="   يمكنك تسوق منتجات بأفضل جوده وأفضل ماركات عالميه يتحدث عنها البشر , مع خصومات تصل الي خمسون بالمائة"
        />
      </Helmet>
      <NavBar />
      <img
        src="/ProjectImages/Discounts.jpg"
        alt="Discounts"
        style={{ width: "100%", height: "40vh" }}
      />

      <h1 className="discount-title">
        <span>%60</span> تسوق منتجات مع خصومات تصل إلى
      </h1>

      <div className="products-container" ref={DiscountProductsRef}>
        {Discountproducts.map((product) => (
          <div
            onClick={() => handleProductClick(product)}
            key={product.productId}
          >
            <ProductItem
              product={product}
              CurrentRole={getRoleFromToken(sessionStorage.getItem("token"))}
            />
          </div>
        ))}
      </div>

      <CategoryItems />
      <h1 className="discount-title">تسوق احدث موديلات الملابس</h1>

      {clothesProducts.length === 0 && loadingClothes ? (
        <p style={{ textAlign: "center" }}>جارٍ تحميل منتجات الملابس...</p>
      ) : (
        <div className="products-container" ref={clothesRef}>
          {clothesProducts.length > 0 ? (
            clothesProducts.map((product) => (
              <div
                onClick={() => handleProductClick(product)}
                key={product.productId}
              >
                <ProductItem
                  product={product}
                  CurrentRole={getRoleFromToken(
                    sessionStorage.getItem("token")
                  )}
                />
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>لا توجد منتجات للملابس حاليا.</p>
          )}
        </div>
      )}

      <CategoryItems />

      <h1 className="discount-title"> منتجات {SiteName} </h1>

      {products.length === 0 && LoadingProducts ? (
        <p style={{ textAlign: "center" }}>جارٍ تحميل المنتجات ...</p>
      ) : (
        <div className="products-container" ref={ProductsRef}>
          {products.length > 0 ? (
            products.map((product) => (
              <div
                onClick={() => handleProductClick(product)}
                key={product.productId}
              >
                <ProductItem
                  product={product}
                  CurrentRole={getRoleFromToken(
                    sessionStorage.getItem("token")
                  )}
                />
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>لا توجد منتجات حاليا.</p>
          )}
        </div>
      )}

      <ContactUs />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API_BASE_URL, {
  ServerPath,
  SiteName,
} from "../../Components/Constant.js";
import "../../Styles/productDetails.css";
import "../../Styles/BtnAddToCart.css";

import BtnAddToCart from "../Cart/BtnAddToCart.jsx";
import getDeliveryDate, { SendSignalMessageForOrders } from "../utils.js";
import NavBar from "../Home/Nav.jsx";

export default function ProductDetails() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [Img, setImg] = useState("");
  const [loading, setLoading] = useState(!product);
  const [Colors, setColors] = useState([]);
  const [DetailsId, setDetailsId] = useState(0);
  const [CurrentColor, setCurrentColor] = useState("");
  const [Sizes, setSizes] = useState([]);
  const [CurrentSize, setCurrentSize] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [Quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${API_BASE_URL}Product/GetProductById?ID=${Number(id)}`
          );
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          setProduct(data);
          setAvailableQuantity(data.quantity);
          setDetailsId(data.productDetailsId);
          setImg(data.productImage);
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      setImg(product?.productImage || "");
      setLoading(false);
    }
  }, []);
  const GetDetailsOfCurrentSizeAndColor = async () => {
    if (!product) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}Product/GetDetailsBy?ProductId=${Number(
          product?.productId
        )}&ColorName=${CurrentColor}&SizeName=${CurrentSize}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setAvailableQuantity(data.quantity);
      setDetailsId(data.productDetailsId);
      setImg(data.image);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  function CurrentProduct() {
    const Price =
      product?.discountPercentage === 0
        ? product?.productPrice
        : product?.priceAfterDiscount;
    return {
      productDetailsId: DetailsId,
      quantity: Quantity,
      unitPrice: Price,
      totalPrice: Price * Quantity,
    };
  }
  const handlBuyClick = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setMessage("يجب تسجيل الدخول لمتابعة عملية الشراء.");
      navigate("/Login", { state: { path: `/ProductDetails/${id}` } });

      return;
    }
    const Product = CurrentProduct();
    navigate("/PurchaseDetails", { state: { Product } });
  };
  useEffect(() => {
    if (!product) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}Product/GetProductDetailsById?Id=${product?.productId}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCurrentColor(data.color);
        setDetailsId(data.productDetailsId);
        setCurrentSize(data.size);
        setAvailableQuantity(data.quantity);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchColorsAndSizes = async () => {
      try {
        const sizesResponse = await fetch(
          `${API_BASE_URL}Product/GetSizesByProductId?productId=${product?.productId}`
        );
        if (!sizesResponse.ok) throw new Error("Network response was not ok");
        const sizesData = await sizesResponse.json();
        setSizes(sizesData);
        if (sizesData.length === 1) setCurrentSize(sizesData[0]);

        const colorsResponse = await fetch(
          `${API_BASE_URL}Product/GetColorsByProductId?productId=${product?.productId}`
        );
        if (!colorsResponse.ok) throw new Error("Network response was not ok");
        const colorsData = await colorsResponse.json();
        setColors(colorsData);
        if (colorsData.length === 1) setCurrentColor(colorsData[0]);
      } catch (error) {
        console.error("Error fetching colors and sizes:", error);
      }
    };

    fetchProducts();
    fetchColorsAndSizes();
  }, [product]);
  useEffect(() => {
    const fetchDetails = async () => {
      if (!CurrentSize) return;
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}Product/GetColorsBelongsToSpecificSize?ProductId=${product?.productId}&SizeName=${CurrentSize}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setColors(data);
        if (data.length === 1) setCurrentColor(data[0]);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [CurrentSize, CurrentColor]);
  useEffect(() => {
    if (CurrentColor) {
      GetDetailsOfCurrentSizeAndColor();
    }
  }, [CurrentSize, CurrentColor]);

  useEffect(() => {
    const middleY = window.innerHeight / 2;
    window.scrollTo({
      top: middleY + 500,
      behavior: "smooth",
    });
  });
  if (loading) return <div>جاري التحميل...</div>;

  const availability = (
    <div className={availableQuantity === 0 ? "out-of-stock" : "in-stock"}>
      {availableQuantity === 0 ? (
        <span style={{ color: "red" }}>غير متوفر حالياً</span>
      ) : (
        <>
          <span style={{ color: "green" }}>متوفر في المخزون</span>
          <span style={{ color: availableQuantity < 10 ? "red" : "green" }}>
            ({availableQuantity})
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className="product-details-wrapper">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product?.productName,
            image: [`${ServerPath}${Img}`],
            description: product?.moreDetails,
            sku: product?.productId,
            offers: {
              "@type": "Offer",
              url: window.location.href,
              priceCurrency: "EGP",
              price:
                product?.discountPercentage === 0
                  ? product?.productPrice
                  : product?.priceAfterDiscount,
              availability:
                availableQuantity > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          })}
        </script>

        <title>
          {product?.productName || "منتج"} | {SiteName}
        </title>
        <meta
          name="description"
          content={`${product?.productName} - ${product?.moreDetails}. متاح الآن على ${SiteName}. اكتشف المزيد من المنتجات المميزة بأفضل الأسعار.`}
        />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product?.productName} />
        <meta property="og:description" content={product?.moreDetails} />
        <meta property="og:image" content={`${ServerPath}${Img}`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content={SiteName} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product?.productName} />
        <meta name="twitter:description" content={product?.moreDetails} />
        <meta name="twitter:image" content={`${ServerPath}${Img}`} />
      </Helmet>

      <NavBar />
      {availableQuantity > 0 && (
        <>
          {message && (
            <div
              className="fixed-message"
              style={{ backgroundColor: "red", color: "black" }}
            >
              {message}
            </div>
          )}
        </>
      )}

      <div className="image-container">
        <img
          src={ServerPath + Img}
          alt={product?.productName}
          className="product-img"
        />
      </div>

      <div className="product-info-wrapper">
        <h2> {product?.productName}</h2>
        <span style={{ color: "black" }}>
          سعر المنتج:{" "}
          {product?.discountPercentage === 0
            ? product?.productPrice
            : product?.priceAfterDiscount}{" "}
          جنيه
        </span>
        {availability}
        <div className="product-info-text">
          <p style={{ color: "red" }}>
            قم بتحديد الكميه والمقاس (ان وجد) قبل اتمام الشراء او الاضافه الي
            السله{" "}
          </p>
          <div>
            اللون:
            {Colors.length === 1 ? (
              <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                {CurrentColor}
              </span>
            ) : (
              <select
                value={CurrentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
              >
                {Colors.map((color, index) => (
                  <option key={index} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            )}
          </div>
          {Sizes.length > 0 && Sizes[0] !== null && (
            <div>
              المقاس:
              {Sizes.length === 1 ? (
                <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                  {CurrentSize}
                </span>
              ) : (
                <select
                  value={CurrentSize}
                  onChange={(e) => setCurrentSize(e.target.value)}
                >
                  {Sizes.map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          <div>
            الكميه :
            <input
              type="number"
              min="1"
              max={availableQuantity}
              value={Quantity}
              onChange={(e) =>
                setQuantity(Math.min(e.target.value, availableQuantity))
              }
            />
          </div>
          <div>تفاصيل: {product?.moreDetails || "لا توجد تفاصيل إضافية"}</div>
        </div>
      </div>

      {availableQuantity > 0 && (
        <div className="cart-actions">
          <button
            className="add-to-cart-btn"
            style={{ backgroundColor: "green", width: "180px" }}
            onClick={handlBuyClick}
          >
            شراء الآن
          </button>
          <BtnAddToCart
            className="add-to-cart-btn"
            productDetailsId={DetailsId}
            Quantity={Quantity}
          />
        </div>
      )}
    </div>
  );
}

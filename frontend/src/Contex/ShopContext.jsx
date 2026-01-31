import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);
const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

// Automatic Environment Detection
const getBackendUrl = () => {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:4000";
  }
  return "https://shopper-backend-wheat.vercel.app";
};

// Universal Image Healer: Forcefully repairs any broken image path to point to our detected backend
const getNormalizedImageUrl = (url) => {
  if (!url) return url;
  if (url.startsWith("data:")) return url; // Base64 is fine
  
  const backendBaseUrl = getBackendUrl();
  let filename = "";
  
  // Extract filename from ANY format (URL, Windows path, Linux path)
  if (url.includes("://")) {
    try {
      filename = url.replace(/\\/g, '/').split("/").pop();
    } catch (e) {
      filename = url;
    }
  } else {
    filename = url.replace(/\\/g, '/').split("/").pop();
  }
  
  return `${backendBaseUrl}/images/${filename}`;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(() => {
    const backendUrl = getBackendUrl();
    console.log("Detecting backend URL:", backendUrl);
    
    fetch(backendUrl + "/allproducts")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        // Normalize images on frontend as a fallback
        const normalizedData = data.map(item => ({
          ...item,
          image: getNormalizedImageUrl(item.image)
        }));
        setAll_product(normalizedData);
      })
      .catch((err) => console.error("Failed to fetch all products:", err));

    if (localStorage.getItem("auth-token")) {
      fetch(backendUrl + "/getcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setCartItems(data))
        .catch((err) => console.error("Failed to fetch cart:", err));
    }
  }, []);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    const backendUrl = getBackendUrl();
    if (localStorage.getItem("auth-token")) {
      fetch(backendUrl + "/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    const backendUrl = getBackendUrl();
    if (localStorage.getItem("auth-token")) {
      fetch(backendUrl + "/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalAmount += cartItems[item];
      }
    }
    return totalAmount;
  };
  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;

import React, { useState } from "react";
import "./Addproduct.css";
import upload_area from "../../assets/upload_area.svg";

const Addproduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    old_price: "",
    new_price: "",
  });

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  // Automatic Environment Detection
  const getBackendUrl = () => {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:4000";
    }
    return "https://shopper-backend-wheat.vercel.app";
  };

  const add_product = async () => {
    const backendUrl = getBackendUrl();
    let product = { ...productDetails };

    let formData = new FormData();
    formData.append("product", image);

    if (!image) {
      alert("Please select an image first");
      return;
    }

    try {
      const uploadResp = await fetch(backendUrl + "/upload", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      
      if (!uploadResp.ok) {
        throw new Error(`Upload Failed: ${uploadResp.status} ${uploadResp.statusText}`);
      }

      const uploadData = await uploadResp.json();
      
      if (uploadData.success) {
        // IMPORTANT: Only save the filename in the database to keep it environment-neutral
        let finalImageUrl = uploadData.image_url;
        if (!finalImageUrl.startsWith("data:") && finalImageUrl.includes("://")) {
            finalImageUrl = finalImageUrl.split("/").pop();
        }
        let product = { ...productDetails, image: finalImageUrl };
        
        const addResp = await fetch(backendUrl + "/addproduct", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        });

        if (!addResp.ok) {
          throw new Error(`Add Product Failed: ${addResp.status} ${addResp.statusText}`);
        }

        const addData = await addResp.json();
        
        if (addData.success) {
          alert("Product Added Successfully");
          // Clear form
          setProductDetails({
            name: "",
            image: "",
            category: "women",
            old_price: "",
            new_price: "",
          });
          setImage(false);
        } else {
          alert("Error: " + (addData.error || "Unknown server error"));
        }
      } else {
        alert("Upload Error: " + (uploadData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Operation Error:", error);
      alert("CRITICAL ERROR: " + error.message + "\n\nTip: If on Vercel, very large images (> 4MB) might fail due to platform limits.");
    }
  };
  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>product title</p>
        <input
          type="text"
          value={productDetails.name}
          onChange={changeHandler}
          name="name"
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            type="text"
            value={productDetails.old_price}
            onChange={changeHandler}
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            type="text"
            value={productDetails.new_price}
            onChange={changeHandler}
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          name="category"
          value={productDetails.category}
          onChange={changeHandler}
          className="add-product-selector"
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt="upload-area"
            className="addproduct-thumbnail-img"
          />
        </label>
        <input
          type="file"
          id="file-input"
          name="image"
          onChange={imageHandler}
          hidden
        />
      </div>
      <button className="addproduct-btn" onClick={() => add_product()}>
        ADD
      </button>
    </div>
  );
};

export default Addproduct;

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

  const add_product = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://shopper-backend-wheat.vercel.app";
    let product = { ...productDetails };

    let formData = new FormData();
    formData.append("product", image);

    try {
      const uploadResp = await fetch(backendUrl + "/upload", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      const uploadData = await uploadResp.json();
      
      if (uploadData.success) {
        // Use a copy of productDetails to avoid state issues
        let product = { ...productDetails, image: uploadData.image_url };
        
        const addResp = await fetch(backendUrl + "/addproduct", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        });
        const addData = await addResp.json();
        
        if (addData.success) {
          alert("Product Added Successfully");
        } else {
          alert("Failed to Add Product: " + (addData.error || "Unknown error"));
        }
      } else {
        alert("Image Upload Failed: " + (uploadData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred. Check your connection or file size.");
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

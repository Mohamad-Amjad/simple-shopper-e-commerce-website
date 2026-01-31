import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  // Automatic Environment Detection
  const getBackendUrl = () => {
    if (window.location.hostname === "localhost") return "http://localhost:4000";
    return "https://shopper-backend-wheat.vercel.app";
  };

  const fetchData = async () => {
    const backendUrl = getBackendUrl();
    await fetch(backendUrl + "/allproducts")
      .then((res) => res.json())
      .then((data) => {
        // Aggressive Frontend Heal
        const normalizedData = data.map((item) => {
          if (!item.image || item.image.startsWith("data:")) return item;
          const filename = item.image.replace(/\\/g, '/').split("/").pop();
          return { ...item, image: `${backendUrl}/images/${filename}` };
        });
        setAllProducts(normalizedData);
      });
  };

  const remove_product = async (id) => {
    const backendUrl = getBackendUrl();
    await fetch(backendUrl + '/removeproduct', {
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-type':'application/json'
      },
      body:JSON.stringify({id:id})
    })
    await fetchData();
  };
  useEffect(()=>{
    fetchData();
  },[]);
  if(allProducts.length===0)
    return <h1 style={{margin:'30px 100px'}}>List is Empty</h1>
    return (
      <div className="list-product">
        <h1>All Products List</h1>
        <div className="listproduct-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Old Price</p>
          <p>New Price</p>
          <p>Category</p>
          <p>Remove</p>
        </div>
        <div className="listproduct-allproducts">
          <hr />
          {allProducts.map((product)=>{
            return(<div key={product.id}>
              <div className="listproduct-format-main listproduct-format">
                <img src={product.image} alt="product-image" className="listproduct-product-icon" />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img src={cross_icon} onClick={()=>remove_product(product.id)} alt="remove-cross-icon" className="listproduct-remove-icon" />
              </div>
              <hr/>
              </div>
            )
          })}
        </div>
      </div>
    )
  
};

export default ListProduct;

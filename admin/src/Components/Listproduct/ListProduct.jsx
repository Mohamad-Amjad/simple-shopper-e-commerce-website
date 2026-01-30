import React, { useEffect, useState } from "react";
import "./Listproduct.css";
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allProducts, setAllProduct] = useState([]);

  const fetchData = async () => {
    await fetch("http://localhost:4000/allproducts")
      .then((res) => res.json())
      .then((data) => setAllProduct(data));
  };

  const remove_data=async(id)=>{
    await fetch('http://localhost:4000/removeproduct',{
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
                <img src={cross_icon} onClick={()=>remove_data(product.id)} alt="remove-cross-icon" className="listproduct-remove-icon" />
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

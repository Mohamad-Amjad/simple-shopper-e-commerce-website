import React, { useEffect, useState } from "react";
import "./popular.css";
import Item from "../Item/Item";

const Popular = () => {
  const [data_product,setData_product]=useState([]);

  useEffect(() => {
    const backendUrl = process.env.REACT_APP_API_URL || "https://shopper-backend-wheat.vercel.app";
    fetch(backendUrl + "/popularinmen")
      .then((res) => res.json())
      .then((data) => setData_product(data))
      .catch((err) => console.error("Failed to fetch popular items:", err));
  }, []);;
  return (
    <div className="popular">
      <h1>POPULAR IN MEN</h1>
      <hr />
      <div className="popular-item">
        {data_product.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;

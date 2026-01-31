import React, { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../Item/Item";

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);

  useEffect(() => {
    // Automatic Environment Detection
    const getBackendUrl = () => {
      if (window.location.hostname === "localhost") return "http://localhost:4000";
      return "https://shopper-backend-wheat.vercel.app";
    };

    const backendUrl = getBackendUrl();
    fetch(backendUrl + "/newcollections")
      .then((res) => res.json())
      .then((data) => {
        // Aggressive Frontend Heal
        const normalizedData = data.map(item => {
          if (!item.image || item.image.startsWith("data:")) return item;
          const filename = item.image.replace(/\\/g, '/').split("/").pop();
          return { ...item, image: `${backendUrl}/images/${filename}` };
        });
        setNew_collection(normalizedData);
      })
      .catch((err) => console.error("Failed to fetch new collections:", err));
  }, []);
  
  if(new_collection.length===0)
    return <></>
  return (
    <div className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NewCollections;

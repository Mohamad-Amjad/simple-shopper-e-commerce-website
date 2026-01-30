import React, { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../Item/Item";

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL+"/newcollections")
      .then((res) => res.json())
      .then((data) => setNew_collection(data));
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
              id={item._id}
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

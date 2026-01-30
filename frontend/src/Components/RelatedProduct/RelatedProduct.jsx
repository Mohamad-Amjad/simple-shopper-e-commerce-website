import React, { useContext } from 'react'
import './RelatedProduct.css';
import { ShopContext } from '../../Contex/ShopContext';
import Item from '../Item/Item';

const RelatedProduct = () => {
  const { all_product } = useContext(ShopContext);
  // Simple logic: Show first 4 products, or randomize. 
  // Ideally filtering by category, but context doesn't pass category here easily without props.
  // Let's just show a slice for now to match "Popular" behavior or pass props later.
  const related = all_product.slice(0, 4);

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {related.map((item,i)=>{
            return <Item
            key={i}
            id={item._id} /* Switching to _id for robust routing */
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default RelatedProduct

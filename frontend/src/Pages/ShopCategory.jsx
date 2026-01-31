import React,{useContext} from 'react';
import '../Pages/CSS/ShopCategory.css'
import {ShopContext} from '../Contex/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const {all_product}=useContext(ShopContext);

  if(all_product.length===0)
  {
    return(<div style={{display:'flex',justifyContent:'center',margin:'50px 0px'}}>
      <h1 style={{fontSize:'30px',fontWeight:'500'}}>Nothing found</h1>
    </div>) 
  }
  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-12</span>out of 36 products
        </p>
        <div className="shopcategory-sort">
          <p>Sort by </p><img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className="shopcategory-products">
      {all_product.map((item,i)=>{
        if(props.category===item.category){
          return( <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />)
        }
        else{
          return null;
        }
      })}
      </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  )
}

export default ShopCategory

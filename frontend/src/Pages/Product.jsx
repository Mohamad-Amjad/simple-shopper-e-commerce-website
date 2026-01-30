import React,{useContext} from "react";
import { ShopContext } from '../Contex/ShopContext';
import { useParams } from 'react-router-dom';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProduct from "../Components/RelatedProduct/RelatedProduct";

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const product = all_product.find((e) => e._id === productId);
  return (
  <div>
    
    <ProductDisplay product={product}/>
    <DescriptionBox/>
    <RelatedProduct/>
  </div>);
};

export default Product;

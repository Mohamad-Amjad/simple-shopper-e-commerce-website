import React, { useContext, useRef, useState } from 'react'
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Contex/ShopContext';
import navbar_dropdown from '../Assets/nav_dropdown.png';

const Navbar = () => {
  const [menu,setMenu]=useState("");
  const {getTotalCartItems}=useContext(ShopContext);
  const menuRef=useRef();

  const dropdown_toggle=(e)=>{
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };
  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt='logo'/>
      <p className=''>SHOPPER</p>
      </div>
      <img src={navbar_dropdown} alt="" className='nav-dropdown' onClick={dropdown_toggle}/>
      <ul ref={menuRef} className="nav-menu">
        <li onClick={()=>setMenu("shop")}><Link to={'/'}>Shop</Link> {menu==="shop" || menu===''?<hr/>:<></>}</li>
        <li onClick={()=>setMenu("men")}><Link to={'/mens'}>Men</Link> {menu==="men"?<hr/>:<></>}</li>
        <li onClick={()=>setMenu("women")}><Link to={'/womens'}>Women</Link> {menu==="women"?<hr/>:<></>}</li>
        <li onClick={()=>setMenu("kids")}><Link to={'/kids'}>Kids</Link> {menu==="kids"?<hr/>:<></>}</li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token')?
        <button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>:
        <Link to={'/login'}><button>Login</button></Link>
      }
        <Link to={'/cart'}><img src={cart_icon} alt='cart-icon'/></Link>
        <div className='nav-cart-count'>{getTotalCartItems()}</div>
      </div>
    </div>
  )
}

export default Navbar

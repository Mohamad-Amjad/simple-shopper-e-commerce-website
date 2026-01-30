import './App.css';
import Navbar from './Components/navbar/Navbar.jsx';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Shop from './Pages/Shop.jsx';
import ShopCategory from './Pages/ShopCategory.jsx';
import Product from './Pages/Product.jsx';
import Cart from './Pages/Cart.jsx';
import LoginSignup from './Pages/LoginSignup.jsx';
import Footer from './Components/Footer/Footer.jsx';
import Man_banner from './Components/Assets/banner_mens.png';
import Women_banner from './Components/Assets/banner_women.png';
import Kids_banner from './Components/Assets/banner_kids.png';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/mens' element={<ShopCategory banner={Man_banner} category='men'/>}/>
        <Route path='/womens' element={<ShopCategory banner={Women_banner} category='women'/>}/>
        <Route path='/kids' element={<ShopCategory banner={Kids_banner} category='kid'/>}/>
        <Route path='/product' element={<Product/>}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
      </Routes>
       <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;

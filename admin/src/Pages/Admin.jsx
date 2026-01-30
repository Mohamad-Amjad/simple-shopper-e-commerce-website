import React from 'react';
import './Admin.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import AddProduct from '../Components/Addproduct/Addproduct';
import ListProduct from '../Components/Listproduct/ListProduct';

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>
      {/* Wrap routed content in a container */}
      <div>
        <Routes>
          <Route path='/addproduct' element={<AddProduct/>}/>
          <Route path='/listproduct' element={<ListProduct/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default Admin;

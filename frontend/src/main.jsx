import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Route,RouterProvider ,createRoutesFromElements } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux'
import store from './redux/store.js';

//auth
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import CheckUser from './pages/Auth/CheckUser.jsx';

import Profile from './pages/User/Profile.jsx';

//private route
import PrivateRoute from './components/PrivateRoute.jsx';

import './index.css';

//adMIN ROUTES
import AdminRoute from './pages/Admin/AdminRoute.jsx';
import UserList from './pages/Admin/UserList.jsx'
import CategoryList from './pages/Admin/CategoryList.jsx';
import ProductList from './pages/Admin/ProductList.jsx';
import AllProducts from './pages/Admin/AllProducts.jsx';
import ProductUpdate from './pages/Admin/ProductUpdate.jsx';
import ProductDetails from './pages/Products/ProductDetails.jsx';
import Home from './Home.jsx';
 
const router= createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
       <Route path='/login' element={<Login />} />
       <Route path='/check' element={<CheckUser />} />
       <Route path='/register' element={<Register />} />
        <Route index={true} path='/' element={<Home/>}/>
        {/* <Route path="/favorite" element={<Favorites />} /> */}
      <Route path="/product/:id" element={<ProductDetails />} />

        <Route path='' element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />}/>
        </Route>

      {/* admin routes */}
        <Route path='/admin' element={<AdminRoute />}>
          <Route path='userlist' element={<UserList />} />
          <Route path='categorylist' element={<CategoryList />}/>
          <Route path='productlist' element={<ProductList/>} />
          <Route path='productlist/:pageNumber' element={<ProductList/>} />
          <Route path='allproductslist' element={<AllProducts/>}/>
          <Route path='product/update/:_id' element={<ProductUpdate/>} />

        </Route>
    </Route>
        
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
)

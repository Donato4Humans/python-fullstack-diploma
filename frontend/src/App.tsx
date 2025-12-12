import React from 'react';
import './App.css';

import {router} from "./router/router";
import {HeaderComponent} from "./components/header/HeaderComponent";
import { FooterComponent } from './components/footer/FooterComponent';
import {RouterProvider} from "react-router-dom";

function App() {
  return (
        <div className={'chat-app'}>
           <HeaderComponent/>
           <RouterProvider router={router}/>
           <FooterComponent/>
        </div>
  );
}

export default App;

import {BrowserRouter, Routes, Route} from "react-router-dom"
import { Web3Provider } from "./context/Web3Context.jsx"
import Home from "./pages/Home.jsx"
import Marketplace from "./pages/Marketplace.jsx"

export default function App(){

  return(
    <Web3Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/marketplace" element={<Marketplace/>}/>
        </Routes>
      </BrowserRouter>
    </Web3Provider>
  )
}
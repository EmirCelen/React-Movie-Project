import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Category from "./pages/Category";
import SearchResults from "./pages/SearchResults";
import Detail from "./pages/Detail";


function App() {
  return (
    <Router>
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:genreId" element={<Category />} />
          <Route path="/tv/:genreId" element={<Category />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/movie/:id" element={<Detail />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App

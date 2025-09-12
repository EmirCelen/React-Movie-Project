
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Category from "./pages/Category";
import SearchResults from "./pages/SearchResults";
import Detail from "./pages/Detail";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import MyList from './pages/Mylist';
import { MyListProvider } from "./context/MyListContext";
import Newpopular from "./pages/Newpopular";



function App() {
  return (
    <AuthProvider>
      <MyListProvider>
        <Router>
          <div className="bg-black min-h-screen text-white">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies-genre/:genreId" element={<Category />} />
              <Route path="/tv-genre/:genreId" element={<Category />} />
              <Route path="/popular" element={<Newpopular />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/movie/:id" element={<Detail type="movie" />} />
              <Route path="/tv/:id" element={<Detail type="tv" />} />
              <Route path="/mylist" element={<MyList />} />
            </Routes>
          </div>
        </Router>
      </MyListProvider>
    </AuthProvider>
  );
}
export default App

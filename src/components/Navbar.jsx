import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import tmdb from "../api/tmdb";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [movieGenres, setMovieGenres] = useState([]);
    const [tvGenres, setTvGenres] = useState([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const movieRes = await tmdb.get("/genre/movie/list");
                const tvRes = await tmdb.get("/genre/tv/list");
                setMovieGenres(movieRes.data.genres);
                setTvGenres(tvRes.data.genres);
            } catch (err) {
                console.error("Error fetching genres", err);
            }
        };
        fetchGenres();
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-black bg-opacity-80" : "bg-transparent"
                }`}
        >
            <div className="flex items-center justify-between max-w-[1400px] mx-auto px-[60px] py-3">
                {/* Logo */}
                <Link to="/">
                    <img
                        src="/src/assets/logo.png"
                        alt="MoMovie Logo"
                        className="h-8 object-contain"
                    />
                </Link>

                {/* Menü */}
                <div className="flex space-x-6 text-white">
                    <Link to="/">Home</Link>
                    <Dropdown title="Movies" items={movieGenres} type="movies-genre" />
                    <Dropdown title="TV Shows" items={tvGenres} type="tv-genre" />
                    <Link to="/popular">New & Popular</Link>
                    <Link to="/mylist">My List</Link>
                </div>

                {/* Sağ taraf */}
                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative flex items-center">
                        <MagnifyingGlassIcon
                            className={`h-5 w-5 text-gray-400 absolute left-2 pointer-events-none transition-opacity duration-300 ${searchOpen ? "opacity-100" : "opacity-0"
                                }`}
                        />

                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                const val = e.target.value;
                                setQuery(val);
                                if (val.trim()) navigate(`/search?q=${val}`);
                            }}
                            placeholder="Titles, people, genres"
                            className={`bg-black text-white border border-white rounded transition-all duration-300 pl-8 pr-2 py-1 w-0 opacity-0 ${searchOpen ? "w-64 opacity-100" : ""
                                }`}
                        />
                        <button
                            onClick={() => setSearchOpen((prev) => !prev)}
                            className="ml-2 text-white"
                        >
                            {searchOpen ? "✖" : <MagnifyingGlassIcon className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Profil / Login */}
                    {token ? (
                        <div className="relative">
                            <div className="w-8 h-8 bg-gray-500 rounded-full cursor-pointer"></div>
                            <button
                                onClick={logout}
                                className="absolute top-10 right-0 bg-black text-white px-3 py-1 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="text-white font-semibold">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

// Dropdown Component
const Dropdown = ({ title, items, type }) => (
    <div className="relative group">
        <span className="cursor-pointer">{title} ▾</span>
        <div className="absolute left-0 mt-2 w-48 bg-black bg-opacity-90 rounded-md shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible invisible transition-all duration-300 z-50">
            <ul className="py-2">
                {items.map((genre) => (
                    <li key={genre.id}>
                        <Link
                            to={`/${type}/${genre.id}`}
                            className="block px-4 py-2 hover:bg-gray-700"
                        >
                            {genre.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

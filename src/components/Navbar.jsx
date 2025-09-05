import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import tmdb from "../api/tmdb";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [movieGenres, setMovieGenres] = useState([]);
    const [tvGenres, setTvGenres] = useState([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
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

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${query}`);
            setQuery("");
            setSearchOpen(false);
        }
    };

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
                    <Dropdown title="Movies" items={movieGenres} type="movies" />
                    <Dropdown title="TV Shows" items={tvGenres} type="tv" />
                    <Link to="/popular">New & Popular</Link>
                    <Link to="/mylist">My List</Link>
                </div>

                {/* Sağ taraf */}
                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative flex items-center">
                        {/* Search Icon (inside input) */}
                        <MagnifyingGlassIcon
                            className={`h-5 w-5 text-gray-400 absolute left-2 pointer-events-none transition-opacity duration-300 ${searchOpen ? "opacity-100" : "opacity-0"
                                }`}
                        />

                        {/* Input */}
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Titles, people, genres"
                            className={`bg-black text-white border border-white rounded transition-all duration-300 pl-8 pr-2 py-1 w-0 opacity-0 ${searchOpen ? "w-64 opacity-100" : ""
                                }`}
                        />

                        {/* Toggle Button */}
                        <button
                            onClick={() => setSearchOpen((prev) => !prev)}
                            className="ml-2 text-white"
                        >
                            {searchOpen ? "✖" : <MagnifyingGlassIcon className="h-5 w-5" />}
                        </button>
                    </div>


                    {/* Bildirim */}
                    <div className="relative cursor-pointer">
                        <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white rounded-full px-1.5">
                            5
                        </span>
                        🔔
                    </div>

                    {/* Profil */}
                    <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
                </div>
            </div>
        </nav>
    );
}

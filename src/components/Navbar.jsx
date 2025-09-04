import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import tmdb from "../api/tmdb";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [movieGenres, setMovieGenres] = useState([]);
    const [tvGenres, setTvGenres] = useState([]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 🎬 TMDB'den genre listelerini çek
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
            className={`fixed w-full top-0 z-50 transition-colors duration-500 ${scrolled ? "bg-black bg-opacity-80" : "bg-transparent"
                }`}
        >
            <div className="flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-red-600">
                    MovieApp
                </Link>

                {/* Menü */}
                <div className="flex space-x-6">
                    <Link to="/">Home</Link>

                    {/* Movies Dropdown */}
                    <div className="relative group">
                        <span className="cursor-pointer">Movies ▾</span>
                        <div className="absolute left-0 mt-2 w-48 bg-black bg-opacity-90 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition duration-300 z-50">
                            <ul className="py-2">
                                {movieGenres.map((genre) => (
                                    <li key={genre.id}>
                                        <Link
                                            to={`/movies/${genre.id}`}
                                            className="block px-4 py-2 hover:bg-gray-700"
                                        >
                                            {genre.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* TV Shows Dropdown */}
                    <div className="relative group">
                        <span className="cursor-pointer">TV Shows ▾</span>
                        <div className="absolute left-0 mt-2 w-48 bg-black bg-opacity-90 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition duration-300 z-50">
                            <ul className="py-2">
                                {tvGenres.map((genre) => (
                                    <li key={genre.id}>
                                        <Link
                                            to={`/tv/${genre.id}`}
                                            className="block px-4 py-2 hover:bg-gray-700"
                                        >
                                            {genre.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>


                    <Link to="/popular">New & Popular</Link>
                    <Link to="/mylist">My List</Link>
                    <Link to="/search">Search</Link>
                </div>

                {/* Profil simgesi */}
                <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
            </div>
        </nav>
    );
}

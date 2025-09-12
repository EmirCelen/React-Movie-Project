import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import tmdb from "../api/tmdb";
import MovieCard from "../components/MovieCard";

export default function Category() {
    const { genreId } = useParams();
    const location = useLocation();
    const isTV = location.pathname.includes("/tv");

    const [items, setItems] = useState([]);
    const [genreName, setGenreName] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMovies = async (pageNum) => {
        try {
            setLoading(true);
            setError(null);

            const endpoint = isTV ? "/discover/tv" : "/discover/movie";
            const res = await tmdb.get(endpoint, {
                params: { with_genres: genreId, page: pageNum },
            });

            if (res.data.results.length > 0) {
                setItems((prev) => [...prev, ...res.data.results]);
            } else {
                setHasMore(false);
            }

            // Genre adı sadece ilk sayfada çekilsin
            if (pageNum === 1) {
                const genreEndpoint = isTV ? "/genre/tv/list" : "/genre/movie/list";
                const genreRes = await tmdb.get(genreEndpoint);
                const found = genreRes.data.genres.find((g) => g.id == genreId);
                setGenreName(found ? found.name : "Unknown");
            }
        } catch (err) {
            console.error("Category fetch error:", err);
            setError("An error occurred while loading the data.");
        } finally {
            setLoading(false);
        }
    };

    // Genre değiştiğinde resetle
    useEffect(() => {
        setItems([]);
        setPage(1);
        setHasMore(true);
        fetchMovies(1);
    }, [genreId, isTV]);

    // Scroll listener
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 200 >=
                document.documentElement.scrollHeight
            ) {
                if (hasMore && !loading) {
                    setPage((prev) => prev + 1);
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading]);

    // Page state değişince yeni sayfa getir
    useEffect(() => {
        if (page > 1) {
            fetchMovies(page);
        }
    }, [page]);

    return (
        <div className="pt-20 px-6 text-white">
            <h1 className="text-3xl font-bold mb-6">
                {isTV ? "TV Shows" : "Movies"} - {genreName}
            </h1>

            {error && <p className="text-red-500">{error}</p>}

            {items.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {items.map((item) => (
                        <MovieCard key={item.id} movie={item} />
                    ))}
                </div>
            ) : !loading ? (
                <p>No results found.</p>
            ) : null}

            {loading && (
                <p className="text-center text-gray-400 mt-6">Loading...</p>
            )}
        </div>
    );
}

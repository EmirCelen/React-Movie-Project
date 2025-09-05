import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import tmdb from "../api/tmdb";
import MovieCard from "../components/MovieCard";

export default function SearchResults() {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q");

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await tmdb.get(`/search/movie?query=${query}`);
                setResults(res.data.results);
            } catch (err) {
                console.error("Search error:", err);
                setError("Arama sırasında bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query]);

    return (
        <div className="pt-20 px-6">
            <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>

            {loading && <p className="text-gray-400">Aranıyor...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                results.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {results.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <p>Sonuç bulunamadı.</p>
                )
            )}
        </div>
    );
}

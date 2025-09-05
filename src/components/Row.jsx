import { useEffect, useState } from "react";
import tmdb from "../api/tmdb";
import MovieCard from "./MovieCard";

export default function Row({ title, fetchUrl }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await tmdb.get(fetchUrl);
                setMovies(res.data.results);
            } catch (err) {
                console.error("Row fetch error:", err);
                setError("An error occurred while loading the data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [fetchUrl]);

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">{title}</h2>

            {loading && <p className="text-gray-400">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="flex space-x-4 overflow-x-auto overflow-y-visible no-scrollbar pb-4">
                    {movies.map((m) => (
                        <MovieCard key={m.id} movie={m} />
                    ))}
                </div>
            )}
        </div>
    );
}

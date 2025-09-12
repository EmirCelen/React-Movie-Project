import { useEffect, useState } from "react";
import tmdb from "../api/tmdb";
import MovieCard from "../components/MovieCard";

export default function NewPopular() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const trending = await tmdb.get("/trending/all/week");
                const topRated = await tmdb.get("/movie/top_rated");
                // İkisini birleştiriyoruz
                setMovies([...trending.data.results, ...topRated.data.results]);
            } catch (err) {
                console.error("Failed to load New & Popular", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <p className="text-white text-center mt-20">Loading...</p>;
    }

    return (
        <div className="pt-20 px-10 text-white">
            <h2 className="text-3xl font-bold mb-6">New & Popular</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}

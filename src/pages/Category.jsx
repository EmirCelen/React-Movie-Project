import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import tmdb from "../api/tmdb";
import MovieCard from "../components/MovieCard";

export default function Category() {
    const { genreId } = useParams();
    const location = useLocation();
    const isTV = location.pathname.includes("/tv"); // tv mi movie mi anlamak için

    const [items, setItems] = useState([]);
    const [genreName, setGenreName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // TV mi Movie mi ona göre endpoint
                const endpoint = isTV
                    ? `/discover/tv?with_genres=${genreId}`
                    : `/discover/movie?with_genres=${genreId}`;

                const res = await tmdb.get(endpoint);
                setItems(res.data.results);

                // Genre adını bulmak için TMDB genres endpoint
                const genreEndpoint = isTV ? "/genre/tv/list" : "/genre/movie/list";
                const genreRes = await tmdb.get(genreEndpoint);
                const found = genreRes.data.genres.find((g) => g.id == genreId);
                setGenreName(found ? found.name : "Unknown");
            } catch (err) {
                console.error("Category fetch error:", err);
                setError("An error occurred while loading the data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [genreId, isTV]);

    return (
        <div className="pt-20 px-6">
            <h1 className="text-3xl font-bold mb-6">
                {isTV ? "TV Shows" : "Movies"} - {genreName}
            </h1>


            {loading && <p className="text-gray-400">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}


            {!loading && !error && (
                items.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {items.map((item) => (
                            <MovieCard key={item.id} movie={item} />
                        ))}
                    </div>
                ) : (
                    <p>Sonuç bulunamadı.</p>
                )
            )}
        </div>
    );
}

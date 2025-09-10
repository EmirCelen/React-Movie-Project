import { useEffect, useState } from "react";
import axios from "axios";

export default function MyList() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                // Backend’den movieId listesi çek
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/mylist`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // TMDB’den film detaylarını çek
                const tmdbKey = import.meta.env.VITE_TMDB_READ_TOKEN;
                const requests = data.map((item) =>
                    axios.get(`https://api.themoviedb.org/3/movie/${item.movieId}`, {
                        headers: { Authorization: `Bearer ${tmdbKey}` },
                    })
                );

                const results = await Promise.all(requests);
                setMovies(results.map((r) => r.data));
            } catch (err) {
                console.error(err);
            }
        };

        fetchList();
    }, []);

    return (
        <div className="pt-20 px-10 text-white">
            <h2 className="text-3xl font-bold mb-6">My List</h2>
            {movies.length === 0 ? (
                <p>No movies in your list yet.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {movies.map((movie) => (
                        <div key={movie.id} className="bg-gray-900 rounded-lg shadow-lg">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-72 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold">{movie.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

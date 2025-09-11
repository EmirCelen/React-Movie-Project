import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useMyList } from "../context/MyListContext";
import MovieCard from "../components/MovieCard";

export default function MyList() {
    const { token } = useAuth();
    const { myList, fetchMyList } = useMyList();
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        if (token) {
            fetchMyList();
        }
    }, [token]);

    useEffect(() => {
        const fetchMovies = async () => {
            if (!myList.length) {
                setMovies([]);
                return;
            }

            try {
                const tmdbKey = import.meta.env.VITE_TMDB_READ_TOKEN;

                const requests = myList.map((item) =>
                    axios.get(`https://api.themoviedb.org/3/movie/${item.movieId}`, {
                        headers: { Authorization: `Bearer ${tmdbKey}` },
                    })
                );

                const results = await Promise.all(requests);
                setMovies(results.map((r) => r.data));
            } catch (err) {
                console.error("Failed to fetch TMDB movies", err);
            }
        };

        fetchMovies();
    }, [myList]);

    if (!token) {
        return (
            <div className="pt-20 px-10 text-white">
                <h2 className="text-2xl">Please log in to see your list.</h2>
            </div>
        );
    }

    return (
        <div className="pt-20 px-10 text-white">
            <h2 className="text-3xl font-bold mb-6">My List</h2>

            {movies.length === 0 ? (
                <p>No movies in your list yet.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}

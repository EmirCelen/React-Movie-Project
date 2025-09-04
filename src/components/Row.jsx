import { useEffect, useState } from "react";
import tmdb from "../api/tmdb";
import MovieCard from "./MovieCard";

export default function Row({ title, fetchUrl }) {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await tmdb.get(fetchUrl);
            console.log("API RESULT for", title, res.data.results); // 🔍 kontrol
            setMovies(res.data.results);
        };
        fetchData();
    }, [fetchUrl]);

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">{title}</h2>

            {/* HORIZONTAL SCROLL AREA */}
            <div className="flex space-x-4 overflow-x-auto overflow-y-visible scrollbar-hide pb-4">
                {movies.map((m) => (
                    <MovieCard key={m.id} movie={m} />
                ))}
            </div>
        </div>
    );
}

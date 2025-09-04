import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import tmdb from "../api/tmdb";
import MovieCard from "../components/MovieCard";

export default function TvCategory() {
    const { genreId } = useParams();
    const [shows, setShows] = useState([]);
    const [genreName, setGenreName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // TV verilerini çek
                const res = await tmdb.get(`/discover/tv?with_genres=${genreId}`);
                setShows(res.data.results);

                // Genre adını çek
                const genreRes = await tmdb.get("/genre/tv/list");
                const found = genreRes.data.genres.find((g) => g.id == genreId);
                setGenreName(found ? found.name : "Unknown");
            } catch (err) {
                console.error("Error fetching TV shows", err);
            }
        };
        fetchData();
    }, [genreId]);

    return (
        <div className="pt-20 px-6">
            <h1 className="text-2xl font-bold mb-6">TV Shows - {genreName}</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">

                {shows.map((show) => (
                    <MovieCard key={show.id} movie={show} />
                ))}
            </div>
        </div>
    );
}

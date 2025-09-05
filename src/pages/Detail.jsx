import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import tmdb from "../api/tmdb";

export default function Detail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [credits, setCredits] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await tmdb.get(`/movie/${id}`);
                setMovie(res.data);

                const videoRes = await tmdb.get(`/movie/${id}/videos`);
                const trailerVideo = videoRes.data.results.find(v => v.type === "Trailer");
                setTrailer(trailerVideo);

                const creditRes = await tmdb.get(`/movie/${id}/credits`);
                setCredits(creditRes.data.cast);
            } catch (err) {
                console.error("Detail fetch error:", err);
            }
        };
        fetchData();
    }, [id]);

    if (!movie) return <p className="text-center mt-20">Yükleniyor...</p>;

    const imageBase = "https://image.tmdb.org/t/p/original";

    return (
        <div className="pt-20 px-6 text-white">
            {/* Film başlık + görsel */}
            <div className="flex flex-col md:flex-row gap-8">
                <img
                    src={movie.poster_path ? imageBase + movie.poster_path : "/no-image.jpg"}
                    alt={movie.title}
                    className="w-64 rounded-lg"
                />
                <div>
                    <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
                    <p className="mb-4">{movie.overview}</p>
                    <p>📅 Release: {movie.release_date}</p>
                    <p>⭐ Rating: {movie.vote_average?.toFixed(1)}</p>
                </div>
            </div>

            {/* Trailer */}
            {trailer && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Trailer</h2>
                    <iframe
                        width="100%"
                        height="500"
                        src={`https://www.youtube.com/embed/${trailer.key}`}
                        title="Trailer"
                        allowFullScreen
                        className="rounded-lg"
                    ></iframe>
                </div>
            )}

            {/* Oyuncular */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {credits.slice(0, 12).map(actor => (
                        <div key={actor.id} className="text-center">
                            <img
                                src={actor.profile_path ? imageBase + actor.profile_path : "/no-image.jpg"}
                                alt={actor.name}
                                className="w-24 h-32 object-cover rounded-lg mx-auto mb-2"
                            />
                            <p className="text-sm">{actor.name}</p>
                            <p className="text-xs text-gray-400">as {actor.character}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

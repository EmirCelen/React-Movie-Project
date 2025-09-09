import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import tmdb from "../api/tmdb";
import { FaRegCalendarAlt, FaClock, FaGlobeAmericas, FaStar } from "react-icons/fa";

export default function Detail({ type = "movie" }) {
    const { id } = useParams();
    console.log("id", id);
    const [item, setItem] = useState(null);      // movie yerine item dedim (film/dizi olabilir)
    const [trailer, setTrailer] = useState(null);
    const [credits, setCredits] = useState([]);
    const [similar, setSimilar] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ana detay
                const res = await tmdb.get(`/${type}/${id}`);
                setItem(res.data);

                // Videolar
                const videoRes = await tmdb.get(`/${type}/${id}/videos`);
                const trailerVideo = videoRes.data.results.find(v => v.type === "Trailer");
                setTrailer(trailerVideo);

                // Ekip bilgisi
                const creditRes = await tmdb.get(`/${type}/${id}/credits`);
                setCredits(creditRes.data.crew);

                // Benzer içerikler
                const similarRes = await tmdb.get(`/${type}/${id}/similar`);
                setSimilar(similarRes.data.results);
            } catch (err) {
                console.error("Detail fetch error:", err);
            }
        };
        fetchData();
    }, [id, type]);

    if (!item) return <p className="text-center mt-20">Yükleniyor...</p>;

    const imageBase = "https://image.tmdb.org/t/p/original";

    return (
        <div className="text-white">
            {/* Hero Section */}
            <div
                className="relative h-[70vh] bg-cover bg-center mt-12"
                style={{
                    backgroundImage: `url(${imageBase}${item.backdrop_path})`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end h-full px-6 pb-10 gap-6">
                    {/* Poster */}
                    <img
                        src={item.poster_path ? imageBase + item.poster_path : "/no-image.jpg"}
                        alt={item.title || item.name}
                        className="w-40 md:w-60 rounded-lg shadow-lg"
                    />

                    {/* Info Section */}
                    <div className="text-center md:text-left max-w-2xl">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            {item.title || item.name}
                        </h1>
                        <p className="mb-6 text-gray-300">{item.overview}</p>

                        {/* Meta Infos */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6">
                            {/* Yayın yılı */}
                            <span className="flex items-center gap-2">
                                <FaRegCalendarAlt />{" "}
                                {item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]}
                            </span>

                            {/* Süre */}
                            {item.runtime && (
                                <span className="flex items-center gap-2">
                                    <FaClock /> {item.runtime} min
                                </span>
                            )}
                            {item.episode_run_time?.length > 0 && (
                                <span className="flex items-center gap-2">
                                    <FaClock /> {item.episode_run_time[0]} min
                                </span>
                            )}

                            {/* Ülke */}
                            {item.production_countries?.length > 0 && (
                                <span className="flex items-center gap-2">
                                    <FaGlobeAmericas /> {item.production_countries[0].name}
                                </span>
                            )}
                            {item.origin_country?.length > 0 && (
                                <span className="flex items-center gap-2">
                                    <FaGlobeAmericas /> {item.origin_country[0]}
                                </span>
                            )}

                            {/* Rating */}
                            <span className="flex items-center gap-2">
                                <FaStar className="text-yellow-500" /> {item.vote_average?.toFixed(1)}
                            </span>
                        </div>

                        {/* Genres */}
                        {item.genres?.length > 0 && (
                            <div className="mb-4 text-sm text-gray-300">
                                <span className="font-bold">Genres: </span>
                                {item.genres.map(g => g.name).join(", ")}
                            </div>
                        )}

                        {/* Crew Infos */}
                        <p className="mb-1">
                            <span className="font-bold">Director:</span>{" "}
                            {credits.find(c => c.job === "Director")?.name || "N/A"}
                        </p>
                        <p className="mb-1">
                            <span className="font-bold">Writer:</span>{" "}
                            {credits.find(c => c.job === "Writer" || c.job === "Screenplay")?.name || "N/A"}
                        </p>
                        <p>
                            <span className="font-bold">Producer:</span>{" "}
                            {credits.find(c => c.job === "Producer")?.name || "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Trailer */}
            {trailer && (
                <div className="mt-10 px-6">
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

            {/* Cast */}
            <div className="mt-10 px-6">
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4">
                    {credits
                        .filter(c => c.known_for_department === "Acting")
                        .slice(0, 15)
                        .map(actor => (
                            <div key={actor.id} className="flex-shrink-0 w-32 text-center">
                                <img
                                    src={actor.profile_path ? imageBase + actor.profile_path : "/no-image.jpg"}
                                    alt={actor.name}
                                    className="w-32 h-40 object-cover rounded-lg mx-auto mb-2"
                                />
                                <p className="text-sm font-semibold">{actor.name}</p>
                                <p className="text-xs text-gray-400">as {actor.character}</p>
                            </div>
                        ))}
                </div>
            </div>

            {/* Similar */}
            {similar.length > 0 && (
                <div className="mt-10 px-6">
                    <h2 className="text-2xl font-bold mb-4">Similar {type === "movie" ? "Movies" : "TV Shows"}</h2>
                    <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4">
                        {similar.slice(0, 10).map(sim => (
                            <div
                                key={sim.id}
                                className="flex-shrink-0 w-32 cursor-pointer"
                                onClick={() => window.open(`/${type}/${sim.id}`, "_blank")}
                            >
                                <img
                                    src={sim.poster_path ? imageBase + sim.poster_path : "/no-image.jpg"}
                                    alt={sim.title || sim.name}
                                    className="w-32 h-48 object-cover rounded-lg mb-2"
                                />
                                <p className="text-sm font-semibold">{sim.title || sim.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

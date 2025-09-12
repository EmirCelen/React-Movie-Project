import { useEffect, useState } from "react";
import tmdb from "../api/tmdb";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


export default function Banner() {
    const [movie, setMovie] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerKey, setTrailerKey] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        if (showTrailer && movie) {
            const fetchTrailer = async () => {
                try {
                    const tmdbKey = import.meta.env.VITE_TMDB_READ_TOKEN;
                    const { data } = await axios.get(
                        `https://api.themoviedb.org/3/movie/${movie.id}/videos`,
                        { headers: { Authorization: `Bearer ${tmdbKey}` } }
                    );
                    const trailer = data.results.find(
                        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
                    );
                    setTrailerKey(trailer ? trailer.key : null);
                } catch (err) {
                    console.error("Failed to load trailer", err);
                }
            };
            fetchTrailer();
        }
    }, [showTrailer, movie]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await tmdb.get("/trending/all/week");
            const randomMovie =
                res.data.results[Math.floor(Math.random() * res.data.results.length)];
            setMovie(randomMovie);
        };
        fetchData();
    }, []);

    if (!movie) return null;

    const imageBase = "https://image.tmdb.org/t/p/original";

    return (
        <header
            className="relative h-[60vh] md:h-[80vh] text-white flex flex-col justify-end p-6 bg-cover bg-center -mt-10"
            style={{
                backgroundImage: `url(${imageBase}${movie.backdrop_path})`,
            }}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-10 inset-x-0 flex flex-col items-center text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {movie.title || movie.name}
                </h1>
                <p className="max-w-2xl mb-6">{movie.overview}</p>

                <div className="flex space-x-4">
                    <button
                        onClick={() => setShowTrailer(true)}
                        className="bg-white  px-4 py-2 rounded font-bold hover:bg-gray-200"
                    >
                        Play
                    </button>
                    <button
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        className="bg-gray-700 bg-opacity-70 text-white px-4 py-2 rounded font-bold hover:bg-gray-600"
                    >
                        More Info
                    </button>
                </div>
            </div>

            {/* Trailer Modal */}
            <AnimatePresence>
                {showTrailer && trailerKey && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative w-full max-w-4xl"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <button
                                onClick={() => setShowTrailer(false)}
                                className="absolute -top-10 right-0 text-white text-3xl"
                            >
                                ✖
                            </button>
                            <iframe
                                className="w-full aspect-video rounded-lg shadow-lg"
                                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                                title="Trailer"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </header>

    );
}

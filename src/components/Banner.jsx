import { useEffect, useState } from "react";
import tmdb from "../api/tmdb";

export default function Banner() {
    const [movie, setMovie] = useState(null);

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

            <div className="relative z-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    {movie.title || movie.name}
                </h1>
                <p className="max-w-xl text-sm md:text-base mb-6 line-clamp-3">
                    {movie.overview}
                </p>
                <div className="flex space-x-4">
                    <button className="bg-white px-4 py-2 rounded font-bold hover:bg-gray-300 transition">
                        Play
                    </button>

                    <button className="bg-gray-700 px-4 py-2 rounded font-bold">
                        More Info
                    </button>
                </div>
            </div>
        </header>

    );
}

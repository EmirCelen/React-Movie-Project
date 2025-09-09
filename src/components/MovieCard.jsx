import { useState } from "react";

export default function MovieCard({ movie }) {
    const imageBase = "https://image.tmdb.org/t/p/w500";
    const [hovered, setHovered] = useState(false);
    const handleClick = () => {
        const type = movie.media_type || (movie.title ? "movie" : "tv");
        window.open(`/${type}/${movie.id}`, "_blank");
    };


    return (
        <div
            onClick={handleClick}
            className="relative min-w-[150px] md:min-w-[200px] cursor-pointer transform transition-transform hover:scale-110 rounded-lg overflow-hidden"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <img
                src={movie.poster_path ? imageBase + movie.poster_path : "/no-image.jpg"}
                alt={movie.title || movie.name}
                className="w-full h-full object-cover"
            />

            {hovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white p-3 flex flex-col justify-end rounded-lg transition-opacity">
                    <h3 className="text-sm font-bold mb-2">
                        {movie.title || movie.name}
                    </h3>
                    <p className="text-xs line-clamp-3 mb-2">{movie.overview}</p>
                    <span className="text-xs">⭐ {movie.vote_average.toFixed(1)}</span>
                </div>
            )}
        </div>
    );
}

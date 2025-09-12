import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import tmdb from "../api/tmdb";
import MovieCard from "../components/MovieCard";

export default function SearchResults() {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q");
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchMovies = async (pageNum) => {
        try {
            const res = await tmdb.get("/search/movie", {
                params: { query, page: pageNum },
            });

            if (res.data.results.length > 0) {
                setMovies((prev) => [...prev, ...res.data.results]);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Failed to fetch search results", err);
        }
    };

    useEffect(() => {
        // Yeni query geldiğinde resetle
        setMovies([]);
        setPage(1);
        setHasMore(true);
        if (query) fetchMovies(1);
    }, [query]);

    useEffect(() => {
        if (page > 1) fetchMovies(page);
    }, [page]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 200 >=
                document.documentElement.scrollHeight
            ) {
                if (hasMore) setPage((prev) => prev + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore]);

    return (
        <div className="pt-20 px-10 text-white">
            <h2 className="text-3xl font-bold mb-6">
                Search results for: {query}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
            {!hasMore && <p className="text-center mt-6">No more results.</p>}
        </div>
    );
}

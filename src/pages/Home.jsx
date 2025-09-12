import Row from "../components/Row";
import Banner from "../components/Banner";

export default function Home() {
    return (
        <div className="pt-20 px-6">
            <Banner />
            <Row title="Trending Now" fetchUrl="/trending/all/week" />
            <Row title="Top Rated" fetchUrl="/movie/top_rated" />
            <Row title="Action Movies" fetchUrl="/discover/movie?with_genres=28" />
            <Row title="Comedy Movies" fetchUrl="/discover/movie?with_genres=35" />
            <Row title="Drama Movies" fetchUrl="/discover/movie?with_genres=18" />
            <Row title="Horror Movies" fetchUrl="/discover/movie?with_genres=27" />
            <Row title="Romance Movies" fetchUrl="/discover/movie?with_genres=10749" />
            <Row title="Documentaries" fetchUrl="/discover/movie?with_genres=99" />

        </div>
    );
}

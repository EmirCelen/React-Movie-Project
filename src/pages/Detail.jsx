import { useParams } from "react-router-dom";

export default function Detail() {
    const { id } = useParams();

    return (
        <div className="pt-20 px-6">
            <h1 className="text-2xl font-bold">Detail Page - Movie ID: {id}</h1>
        </div>
    );
}

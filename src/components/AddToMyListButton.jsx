import { useState } from "react";
import axios from "axios";
import { FaPlus, FaCheck } from "react-icons/fa6";

export default function AddToMyListButton({ movieId }) {
    const [added, setAdded] = useState(false);

    const handleAdd = async (e) => {
        e.stopPropagation(); // Kart tıklamasını engelle
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please log in first");
                return;
            }

            await axios.post(
                `${import.meta.env.VITE_API_URL}/mylist`,
                { movieId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAdded(true); // ✅ ikon değişsin
        } catch (err) {
            console.error(err);
            alert("Could not add movie");
        }
    };

    return (
        <div
            onClick={handleAdd}
            className="absolute top-4 right-2 bg-black/30 hover:bg-opacity-80 p-1 rounded-full cursor-pointer"
        >
            {added ? (
                <FaCheck size={18} className="text-green-400" />
            ) : (
                <FaPlus size={18} className="text-white" />
            )}
        </div>
    );
}

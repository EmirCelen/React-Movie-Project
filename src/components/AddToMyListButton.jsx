import { FaPlus, FaCheck } from "react-icons/fa6";
import { useMyList } from "../context/MyListContext";

export default function AddToMyListButton({ movieId, mediaType }) {
    const { myList, addToMyList, removeFromMyList } = useMyList();

    const isAdded = myList.some((item) => item.movieId === movieId);

    const handleClick = (e) => {
        e.stopPropagation();
        if (isAdded) {
            removeFromMyList(movieId, mediaType);
        } else {
            addToMyList(movieId, mediaType);
        }
    };

    return (
        <div
            onClick={handleClick}
            className="absolute top-5 right-2 bg-black/50 hover:bg-opacity-80 p-1 rounded-full cursor-pointer"
        >
            {isAdded ? (
                <FaCheck size={18} className="text-green-400" />
            ) : (
                <FaPlus size={18} className="text-white" />
            )}
        </div>
    );
}

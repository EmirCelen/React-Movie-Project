// src/context/MyListContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const MyListContext = createContext();

export function MyListProvider({ children }) {
    const { token } = useAuth();
    const [myList, setMyList] = useState([]);


    useEffect(() => {
        if (token) {
            fetchMyList();   // 🔹 login olduktan hemen sonra listeyi çek
        } else {
            setMyList([]);   // 🔹 logout olunca listeyi boşalt
        }
    }, [token]);

    const fetchMyList = async () => {
        if (!token) return;
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/mylist`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMyList(data);
        } catch (err) {
            console.error("Failed to fetch my list", err);
        }
    };

    const addToMyList = async (movieId) => {
        if (!token) return alert("Please login first");
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/mylist`,
                { movieId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchMyList();
        } catch (err) {
            console.error("Failed to add movie", err);
        }
    };

    const removeFromMyList = async (movieId) => {
        if (!token) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/mylist/${movieId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchMyList();
        } catch (err) {
            console.error("Failed to remove movie", err);
        }
    };

    return (
        <MyListContext.Provider value={{ myList, setMyList, fetchMyList, addToMyList, removeFromMyList }}>
            {children}
        </MyListContext.Provider>
    );
}

export const useMyList = () => useContext(MyListContext);

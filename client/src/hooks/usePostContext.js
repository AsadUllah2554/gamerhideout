
import { useContext } from "react";
import { PostContext } from "../context/postContext";

export const useUserContext = () => { 
    const context = useContext(PostContext)

    if (!context) {
        throw Error(
            "useUserContext must be used within a PostContextProvider"
        )
    }
    return context
}
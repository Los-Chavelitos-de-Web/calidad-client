import Cookies from "js-cookie";
import { useJwt } from "react-jwt";

export const usePayload = () => {
    const token = Cookies.get("authToken");
    const { decodedToken, isExpired } = useJwt(token || "");

    const loading = !decodedToken && token && !isExpired;

    if (!token) {
        return {
            loading: false,
            error: "No estás autenticado.",
            authToken: null,
            email: null,
            username: null,
            role: null,
            userId: null,
        };
    }

    if (isExpired) {
        Cookies.remove("authToken");
        return {
            loading: false,
            error: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.",
            authToken: null,
            email: null,
            username: null,
            role: null,
            userId: null,
        };
    }

    if (loading) {
        return {
            loading: true,
            error: null,
            authToken: null,
            email: null,
            username: null,
            role: null,
            userId: null,
        };
    }

    const { username, role, userId, email } = decodedToken;

    return {
        loading: false,
        authToken: token,
        username,
        role,
        email,
        userId,
        error: null,
    };
};

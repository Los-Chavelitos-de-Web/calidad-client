import Cookies from "js-cookie";
import { useJwt } from "react-jwt";

export const usePayload = () => {
  const token = Cookies.get("authToken");
  const { decodedToken, isExpired } = useJwt(token || "");

  const loading = !decodedToken && token && !isExpired;

  // Caso: No hay token en cookies
  if (!token) {
    return {
      loading: false,
      error: "No estás autenticado.",
      authToken: null,
      email: null,
      username: null,
      dni: null,
      role: null,
      userId: null,
    };
  }

  // Caso: Token expirado
  if (isExpired) {
    Cookies.remove("authToken");
    return {
      loading: false,
      error: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.",
      authToken: null,
      email: null,
      username: null,
      dni: null,
      role: null,
      userId: null,
    };
  }

  // Caso: Aún decodificando
  if (loading) {
    return {
      loading: true,
      error: null,
      authToken: null,
      email: null,
      username: null,
      dni: null,
      role: null,
      userId: null,
    };
  }

  // Extraer datos del token
  const { username, role, userId, email, dni } = decodedToken;

  return {
    loading: false,
    authToken: token,
    username,
    role,
    email,
    dni,
    userId,
    error: null,
  };
};

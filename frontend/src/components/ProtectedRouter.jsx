import { React, useEffect, useState } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { Navigate } from "react-router-dom";
import Api from "../services/Api";
import { jwtDecode } from "jwt-decode";



export function ProtectedRouter({ children, allowedRoles }) {
    const [isAuthorized, setIsAuthorized] = useState(null)


    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN)
            const res = await Api.post('/account/token/refresh/', { refresh: refreshToken })
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
                return
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error.message);
            setIsAuthorized(false);
        }
    }

    const getRoleFromDecoded = (decoded) => {
        // Try common claim locations for role
        return (
            decoded?.role ||
            decoded?.user?.role ||
            decoded?.claims?.role ||
            decoded?.["custom:role"] ||
            null
        );
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;
        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
                const role = getRoleFromDecoded(decoded);
                if (role && allowedRoles.includes(role)) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } else {
                setIsAuthorized(true);
            }
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}
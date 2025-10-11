import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { guestUidArr } from "../constants";
import { useAppSelector } from "../store/storeHooks";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { loggedInUser } = useAppSelector(store => store.user);
    if (loggedInUser?.uid && !guestUidArr.includes(loggedInUser.uid)) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedRoute;

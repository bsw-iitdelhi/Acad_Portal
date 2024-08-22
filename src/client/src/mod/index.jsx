import React from "react";
import { Route,Routes } from "react-router-dom";
import Mentors from "./Mentor";
import Dashboard from "./dashboard";
import SignIn from "./Auth";

export default function Mod() {
    return (
        <Routes>
            <Route path="login" element={<SignIn/>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/" element={<Dashboard />} />
        </Routes>
    );
}
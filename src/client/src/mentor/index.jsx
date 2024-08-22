import React from "react";
import { Route, Routes } from "react-router-dom";
import SignIn from "./Auth";
import Dashboard from "./Dashboard";
import MarkAttendance from "./MarkAttendance";
import FloatOpportunity from "./FloatOppurtunity";
import Profile from "./profile/Profile";

export default function Mentor() {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mark_attendance" element={<MarkAttendance />} />
      <Route path="/float_opportunity" element={<FloatOpportunity />} />
      <Route path="/profile" element={<Profile />} />
      {/* <Route path="raise_queries" element={< />} /> */}
      {/* <Route path="view_queries/:qid" element={< />} /> */}
      {/* <Route path="query_feedback" element={<= />} /> */}
      {/* <Route path="update_queries/:qid" element={<= />} /> */}
    </Routes>
  );
}

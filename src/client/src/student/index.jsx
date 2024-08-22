import { Route, Routes, useNavigate } from "react-router-dom";
import StudentProfile from "./profile";
import StudentQueries from "./raise_query";
import ViewQueries from "./view_queries";
import QueryFeedback from "./query_feedback";
import UpdateQueries from "./update_queries";
import { login, logout } from "../store/authSlice";
import StudentDashboard from "./dashboard";
import { useSelector } from "react-redux";

export default function Student() {
  // const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//   if (!isAuthenticated) {
//     navigate("/");
//   }
  return (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
      <Route path="profile" element={<StudentProfile />} />
      <Route path="raise_queries" element={<StudentQueries />} />
      <Route path="view_queries/:qid" element={<ViewQueries />} />
      <Route path="query_feedback" element={<QueryFeedback />} />
      <Route path="update_queries/:qid" element={<UpdateQueries />} />
    </Routes>
  );
}

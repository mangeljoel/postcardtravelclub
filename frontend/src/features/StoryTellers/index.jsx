import { useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import MentorDashboard from "./MentorDashboard";
import CreatorDashboard from "./CreatorDashboard";
import EicDashboard from "./EicDashboard";

const StoryTellers = ({ role }) => {
    switch (role) {
        case "admin":
            return <AdminDashboard />;
        case "mentor":
            return <MentorDashboard />;
        case "creator":
            return <CreatorDashboard />;
        case "eic":
            return <EicDashboard />;
    }
};

export default StoryTellers;

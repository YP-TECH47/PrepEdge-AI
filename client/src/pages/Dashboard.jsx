import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from "axios";
import InterviewList from "../components/InterviewList";

export default function Dashboard() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                if (!auth.currentUser) {
                    setLoading(false);
                    return;
                }
                const token = await auth.currentUser.getIdToken();
                const response = await axios.get("/api/interview", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInterviews(response.data);
            } catch (err) {
                console.error("Failed to fetch interviews:", err);
                setError("Could not load your interviews. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                fetchInterviews();
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [auth]);

    if (loading) return <div className="text-center p-8">Loading your interviews...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Your Dashboard</h1>
                <Link to="/interview/setup" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                    + New Interview
                </Link>
            </div>
            <InterviewList interviews={interviews} />
        </div>
    );
}
import './App.css';
import {LabelTabs} from "./component/LabelTabs.tsx";
import {ApprovalLists} from "./pages/ApprovalLists.tsx";
import {Route, Routes, useNavigate} from "react-router-dom";
import {TeamLists} from "./pages/TeamLists.tsx";
import {useEffect} from "react";


function App() {

    const navigate = useNavigate()

    useEffect(() => {
        if (location.pathname === "/app" || location.pathname === "/") {
            navigate("/app/lists")
        }
    }, [location.pathname])

    return (
        <>
            <Routes>
                <Route path="app" element={<LabelTabs />}>
                    <Route path="lists" element={<ApprovalLists />} />
                    <Route path="teams" element={<TeamLists />} />
                </Route>
            </Routes>
            {/*<ApprovalLists />*/}
        </>
    );
}

export default App;

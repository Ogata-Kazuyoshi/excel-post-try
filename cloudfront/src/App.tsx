import './App.css';
import {HeaderComponent} from "./component/HeaderComponent.tsx";
import {Route, Routes, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {TeamAreaPage} from "./pages/TeamAreaPage.tsx";
import {UpdateListsPage} from "./pages/UpdateListsPage.tsx";
import {ApprovalListPage} from "./pages/ApprovalListPage.tsx";


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
                <Route path="app" element={<HeaderComponent />}>
                    <Route path="lists" element={<ApprovalListPage />} />
                    <Route path="teams" element={<TeamAreaPage />} />
                    <Route path="updateLists" element={<UpdateListsPage />} />
                </Route>
            </Routes>
            {/*<ApprovalLists />*/}
        </>
    );
}

export default App;

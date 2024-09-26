import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {StyledEngineProvider} from "@mui/material";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <StyledEngineProvider injectFirst>
            <App />
        </StyledEngineProvider>
    </BrowserRouter>
)

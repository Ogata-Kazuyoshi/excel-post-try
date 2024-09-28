import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {StyledEngineProvider} from "@mui/material";
import {RecoilRoot} from "recoil";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <StyledEngineProvider injectFirst>
            <RecoilRoot>
                <App />
            </RecoilRoot>
        </StyledEngineProvider>
    </BrowserRouter>
)

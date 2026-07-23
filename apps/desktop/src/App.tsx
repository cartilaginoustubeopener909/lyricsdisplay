import React from 'react';
import {LyricsView} from "@/view/LyricsView";
import {HashRouter, Route, Routes} from "react-router";
import {SettingsView} from "@/view/SettingsView";

import './index.css'

const App: React.FC = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<LyricsView/>}/>
                <Route path="settings" element={<SettingsView/>}/>
            </Routes>
        </HashRouter>
    );
};

export default App;
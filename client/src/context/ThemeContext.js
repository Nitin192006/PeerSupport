import React, { createContext, useState, useEffect } from 'react';
import { defaultTheme } from '../theme/default'; // Importing local default

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [activeTheme, setActiveTheme] = useState('default');

    // Logic: Inject JSON values directly into the browser's CSS Variables
    const injectTheme = (themeVariables) => {
        const root = document.documentElement;
        Object.keys(themeVariables).forEach((key) => {
            root.style.setProperty(key, themeVariables[key]);
        });
    };

    // On App Start: Load Default Theme
    useEffect(() => {
        // 1. Check if user has a saved theme ID in localStorage
        const savedThemeId = localStorage.getItem('appTheme');

        // 2. If valid saved theme exists, we would fetch its data here.
        // For now, we load the default to ensure the app works immediately.
        injectTheme(defaultTheme);

    }, []);

    // Exposed function for the "Store" or "Settings" page to use later
    const applyTheme = (themeData) => {
        injectTheme(themeData);
        if (themeData.id) {
            localStorage.setItem('appTheme', themeData.id);
            setActiveTheme(themeData.id);
        }
    };

    return (
        <ThemeContext.Provider value={{ activeTheme, applyTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};n
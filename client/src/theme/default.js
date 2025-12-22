// This file defines the "Base Design Elements" for the default theme.
// It maps specific styles to the CSS variables defined in index.css.
// This version uses ASSET PATHS (Images) in the public folder.

export const defaultTheme = {
    // --- APP BACKGROUND ---
    // Points to a file in client/public/assets/ui/
    "--app-bg": "url('/assets/ui/background.png')",
    "--app-backdrop": "blur(0px)", // Increase blur for glass effects

    // --- PANEL / CARD ELEMENTS ---
    // Uses an image texture for panels (e.g., a glass texture or paper texture)
    "--panel-bg": "url('/assets/ui/panel_texture.png')",
    "--panel-border": "1px solid rgba(255,255,255,0.1)",
    "--panel-radius": "16px", // Matches the curve of your asset
    "--panel-shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",

    // --- BUTTON ELEMENTS ---
    // Uses a button sprite or texture image
    "--btn-primary-bg": "url('/assets/ui/button_primary.png')",
    "--btn-primary-border": "none",
    "--btn-radius": "12px",
    "--btn-font": "system-ui, sans-serif",

    // --- INTERACTIVE ASSETS ---
    "--icon-active-color": "#f43f5e",

    // --- TYPOGRAPHY ---
    "--font-main": "system-ui, sans-serif",
    "--text-color": "#f8fafc"
};
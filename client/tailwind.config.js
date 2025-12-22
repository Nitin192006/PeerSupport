/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // DYNAMIC THEME MAP
                // We map Tailwind utility classes to CSS Variables.
                // Example: className="bg-skin-base" will use whatever value is in --color-bg-base
                skin: {
                    base: 'var(--color-bg-base)',         // Main Background
                    card: 'var(--color-bg-card)',         // Card/Panel Background
                    primary: 'var(--color-primary)',      // Main Action Color (Buttons)
                    secondary: 'var(--color-secondary)',  // Accents (Icons, borders)
                    text: 'var(--color-text-main)',       // Main Text
                    muted: 'var(--color-text-muted)',     // Secondary Text
                    accent: 'var(--color-accent)',        // Special highlights
                }
            },
            fontFamily: {
                header: ['var(--font-header)'],
                body: ['var(--font-body)'],
            },
            backgroundImage: {
                'skin-pattern': 'var(--bg-pattern)',
            }
        },
    },
    plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "var(--border)",
                input: "var(--border)",
                ring: "var(--primary)",
                background: "var(--bg)",
                foreground: "var(--text)",
                surface: "var(--surface)",
                primary: {
                    DEFAULT: "var(--primary)",
                    glow: "var(--primary-glow)",
                    foreground: "var(--text)",
                },
                success: "var(--success)",
                warning: "var(--warning)",
                danger: "var(--danger)",
                muted: {
                    DEFAULT: "var(--surface)",
                    foreground: "var(--text-muted)",
                },
            },
            borderRadius: {
                card: "var(--radius-card)",
                btn: "var(--radius-btn)",
                input: "var(--radius-input)",
            }
        },
    },
    plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Kept the same token names as the original theme so components
        // didn't need rewriting — only the hex values changed.
        espresso: "#0F172A", // near-black navy — primary text & buttons
        ivory: "#FFFFFF", // page background
        sand: "#E2E8F0", // light borders / muted panels
        brass: "#2563EB", // primary accent (electric blue)
        brassLight: "#60A5FA", // secondary accent / hover blue
        oxblood: "#DC2626", // sale tags, errors, destructive actions
        slateink: "#475569", // secondary text
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.2em",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};

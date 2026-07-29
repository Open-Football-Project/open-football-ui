import { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },

      colors: {
        secondary: {
          DEFAULT: colors.neutral[200],
          hover: colors.neutral[300],
          border: colors.neutral[400],
          text: colors.neutral[500],
          dark: colors.neutral[800],
          "dark-hover": colors.neutral[900],
        },

        brand: {
          card: "#1E1E1E",
          navbar: "#181818",
          darkBg: "#121212",
          overlay: "rgba(0,0,0,0.7)",
          blueo: "rgb(9, 6, 31)",
          gridblue: "rgba(20, 33, 68, 1)",
          blueintense: "#0f2150ff",
          royalblue: "#0d2769ff",
          royalblue_old: "#153483",
          orange: "#FF6B00",
          orangeo: "rgb(192, 55, 13)",
          danger: "#D50000",
          awayred: "#c20202",
          red: "#ff4848",
          yellow: "#ffc61a",
          yellowa: "#d4bb6f",
          success: "#00C853",
          verdef: "rgb(1, 22, 1)",
          green: "#6faa54",
          greena: "#051610",
          aqua: "#0b6860ff",
          aqualight: "#85f1e8ff",
          grayint: "rgb(7, 18, 24)",
          gray: "#2b2d42",
          bluelight: "#AEE8FF",
          purple: "#d793f7ff",
          cream: "#ffb274ff",
          rose: "#c46d8eff",
          roseint: "#771840ff",
          dona: "#bdaeaaff",
          lightGray: "#B0B0B0",
          white: "#FFFFFF",
        },

        darkText: "#E4E4E4",
        darkerText: "#121212",
        lightText: "#222222",
        lightBg: "#FFFFFF",
        lighterBg: "#E4E4E4",
      },
    },
  },
  plugins: [
    function ({ addBase }: any) {
      addBase({
        'input[type="date"]::-webkit-calendar-picker-indicator': {
          filter:
            "invert(79%) sepia(91%) saturate(741%) hue-rotate(2deg) brightness(106%) contrast(103%)", // 👈 hace yellow el ícono del calendario
        },
      });
    },
  ],
};

export default config;

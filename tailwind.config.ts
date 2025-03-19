import daisyui from "daisyui";

export default {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "night", "cyberpunk", "corporate", "synthwave", "retro", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"] ,
  },
};

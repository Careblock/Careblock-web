const withMT = require('@material-tailwind/react/utils/withMT');

/** @type {import('tailwindcss').Config} */
export default withMT({
    content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
    theme: {
        colors: { primary: '#1976d2' },
        extend: {},
    },
    plugins: [],
});

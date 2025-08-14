import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [
          tailwindcss({
            content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
            // ...other options
          }),
        ],
      },
    },
  },
  plugins: [pluginReact()],
});

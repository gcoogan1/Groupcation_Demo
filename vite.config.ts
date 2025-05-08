import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import tsconfigPaths from 'vite-tsconfig-paths'
import Checker from 'vite-plugin-checker';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths(), process.env.SKIP_TS === 'true' ? null : Checker({ typescript: true })],
  optimizeDeps: {
    include: ['@mui/material', '@mui/icons-material', '@mui/lab'],
  },
})

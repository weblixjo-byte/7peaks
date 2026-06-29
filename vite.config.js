import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projectManagement: resolve(__dirname, 'project-management.html'),
        securityConsultancy: resolve(__dirname, 'security-consultancy.html'),
        penetrationTesting: resolve(__dirname, 'penetration-testing.html'),
        grcServices: resolve(__dirname, 'grc-services.html'),
        about: resolve(__dirname, 'about.html'),
        careers: resolve(__dirname, 'careers.html'),
        contact: resolve(__dirname, 'contact.html'),
      }
    }
  }
});

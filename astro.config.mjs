import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mrgeos.github.io',
  base: '/GEOGLYF',
  trailingSlash: 'always',
  build: { format: 'directory' },
});

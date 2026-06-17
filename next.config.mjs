import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const onGoogleDrive =
  projectDir.includes('CloudStorage') && projectDir.includes('GoogleDrive');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow phone/tablet on same Wi‑Fi to load dev assets (HMR, etc.)
  allowedDevOrigins: ['192.168.1.189', '192.168.1.190'],

  turbopack: {
    root: projectDir,
  },

  experimental: {
    // Default true in Next 16; heavy FS cache on Drive worsens hangs.
    turbopackFileSystemCacheForDev: false,
  },

  webpack: (config, { dev }) => {
    if (dev && onGoogleDrive) {
      // Google Drive FUSE often misses native file events.
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;

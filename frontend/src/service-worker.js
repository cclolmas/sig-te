import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// Precache assets
precacheAndRoute(self.__WB_MANIFEST);

// IndexedDB setup for failed POST requests
const queue = new BackgroundSyncPlugin('offline-queue', {
  maxRetentionTime: 24 * 60, // Retry for up to 24 hours
});

// Centralized utility functions
function isApiPath(url, paths) {
  return paths.some((path) => url.pathname.startsWith(path));
}

// Handle POST requests to specific API endpoints
const apiPaths = ['/api/attendance', '/api/occurrences'];
registerRoute(
  ({ url }) => isApiPath(url, apiPaths),
  new NetworkOnly({ plugins: [queue] }),
  'POST'
);

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

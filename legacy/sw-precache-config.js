/**
 * @license
 * Copyright (c) 2016 The GDG Spain Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://gdg.es/LICENSE.txt
 */

/* eslint-env node */

module.exports = {
  staticFileGlobs: [
    'bower_components/webcomponentsjs/webcomponents-lite.min.js',
    'images/**/*',
    'index.html',
    'manifest.json'
  ],
  navigateFallback: 'index.html',
  navigateFallbackWhitelist: [/^(?!.*\.html$|\/data\/).*/],
  runtimeCaching: [
    {
      urlPattern: /\/data\/images\/.*/,
      handler: 'cacheFirst',
      options: {
        cache: {
          maxEntries: 50,
          name: 'items-cache'
        }
      }
    }
  ]
};

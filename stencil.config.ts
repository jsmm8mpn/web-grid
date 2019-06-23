import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'web-grid',
  globalStyle: 'src/global/app.css',

  copy: [
    { src: 'global' }
  ]

  // outputTargets:[
  //   {
  //     type: 'dist'
  //   },
  //   {
  //     type: 'www',
  //     serviceWorker: null
  //   }
  // ],

};

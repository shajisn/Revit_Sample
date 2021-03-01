const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
  const files = [
    './dist/bimexport/runtime-es2015.0dae8cbc97194c7caed4.js',
    './dist/bimexport/runtime-es5.0dae8cbc97194c7caed4.js',
    './dist/bimexport/polyfills-es5.7c12bb310e6ac239416f.js',
    './dist/bimexport/polyfills-es2015.362046d9623764128870.js',
    './dist/bimexport/main-es2015.3477ced6979c8634222d.js',
    './dist/bimexport/main-es5.3477ced6979c8634222d.js',
    './dist/bimexport/oidc-client.min.js'
  ]
  await fs.ensureDir('bimexport')
  await concat(files, 'bimexport/bimexport.js');
  await fs.copyFile('./dist/bimexport/styles.ea7c9d4d21bc535c5391.css', 'bimexport/styles.ea7c9d4d21bc535c5391.css');
  await fs.copyFile('./dist/bimexport/favicon.ico', 'bimexport/favicon.ico');
  await fs.copyFile('./dist/bimexport/fontawesome-webfont.1e59d2330b4c6deb84b3.ttf', 'bimexport/fontawesome-webfont.1e59d2330b4c6deb84b3.ttf');
  await fs.copyFile('./dist/bimexport/fontawesome-webfont.8b43027f47b20503057d.eot', 'bimexport/fontawesome-webfont.8b43027f47b20503057d.eot');
  await fs.copyFile('./dist/bimexport/fontawesome-webfont.20fd1704ea223900efa9.woff2', 'bimexport/fontawesome-webfont.20fd1704ea223900efa9.woff2');
  await fs.copyFile('./dist/bimexport/fontawesome-webfont.c1e38fd9e0e74ba58f7a.svg', 'bimexport/fontawesome-webfont.c1e38fd9e0e74ba58f7a.svg');
  await fs.copyFile('./dist/bimexport/fontawesome-webfont.f691f37e57f04c152e23.woff', 'bimexport/fontawesome-webfont.f691f37e57f04c152e23.woff');
  await fs.copyFile('./dist/bimexport/oidc-client.min.js', 'bimexport/oidc-client.min.js');
  await fs.copyFile('./dist/bimexport/3rdpartylicenses.txt', 'bimexport/3rdpartylicenses.txt');
  await fs.copyFile('./dist/bimexport/signin-callback.html', 'bimexport/signin-callback.html');
  await fs.copyFile('./dist/bimexport/silent-callback.html', 'bimexport/silent-callback.html');
})()

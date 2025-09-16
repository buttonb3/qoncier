const fs = require('fs');
const path = require('path');

console.log('Building web app for Vercel deployment...');

// Create dist directory if it doesn't exist
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
  console.log('Created dist directory');
}

// Copy the index.html to dist
fs.copyFileSync('./index.html', './dist/index.html');
console.log('Copied index.html to dist');

// Copy the web entry point as bundle.js
fs.copyFileSync('./index.web.js', './dist/bundle.js');
console.log('Copied index.web.js to dist/bundle.js');

// Copy global.css to dist
if (fs.existsSync('./global.css')) {
  fs.copyFileSync('./global.css', './dist/global.css');
  console.log('Copied global.css to dist');
}

// Create a simple package.json for the dist directory
const packageJson = {
  "name": "qoncier-web",
  "version": "1.0.0",
  "main": "bundle.js",
  "scripts": {
    "start": "python3 -m http.server 8080"
  }
};

fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));
console.log('Created package.json for dist');

console.log('Web build completed successfully!');
console.log('Files created in ./dist directory:');
console.log('- index.html');
console.log('- bundle.js');
console.log('- global.css');
console.log('- package.json');
console.log('');
console.log('You can now deploy the dist directory to Vercel!');
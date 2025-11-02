const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Building Vue project...');
execSync('vue-cli-service build', { stdio: 'inherit' });

const distDir = path.join(__dirname, 'dist');
const htaccessPath = path.join(distDir, '.htaccess');

const htaccessContent = `
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  RewriteRule . /index.html [L]
</IfModule>
`;

console.log('📝 Creating .htaccess in dist/...');
fs.writeFileSync(htaccessPath, htaccessContent);

console.log('✅ Build finished successfully!');

const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Dashboard colors to replace pastel ones
content = content.replace(/pastel-purple/g, '[#4F7CFF]');
content = content.replace(/pastel-blue/g, 'cyan-400');
content = content.replace(/pastel-pink/g, '[#6EA8FF]');

// Other fixes
content = content.replace(/pastel-violet/g, '[#4F7CFF]');

// Also fix some specific bg colors if needed, but the main text and borders were using the pastel colors.
// Replace any `text-shadow-glow` with a valid shadow if it doesn't exist, but it's in globals.css.

fs.writeFileSync('app/page.tsx', content);
console.log('Done replacing colors in app/page.tsx!');

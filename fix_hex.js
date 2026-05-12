const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

content = content.replace(/#d0bcff/g, '#4F7CFF'); // pastel purple -> blue
content = content.replace(/#ffb4e1/g, '#6EA8FF'); // pastel pink -> light blue
content = content.replace(/#b4e4ff/g, '#22d3ee'); // pastel blue -> cyan
content = content.replace(/#0d0c12/g, '#05070C'); // old bg -> new bg
content = content.replace(/#13121b/g, '#090C15'); // old surface -> new surface

fs.writeFileSync('app/page.tsx', content);
console.log('Fixed hardcoded hex colors!');

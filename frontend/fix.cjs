const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/soumy/OneDrive/Desktop/HTML/EMS/frontend/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
for (const f of files) {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  
  // Replace weird encoding bytes back to correct utf-8 string if needed
  content = content.replace(/â€¢/g, '•');
  content = content.replace(/â‚¹/g, '₹');
  content = content.replace(/â€”/g, '—');
  content = content.replace(/â”€â”€/g, '──');
  content = content.replace(/\?\$\{/g, '₹${');
  
  if (f === 'Landing.jsx') {
    content = content.replace(/<Link\s+to=\{`\/event\/\$\{event\._id\}`\}\s+className="px-3\.5 py-1\.5 rounded-full/g, '<span className="px-3.5 py-1.5 rounded-full');
    content = content.replace(/Tickets\s*<\/Link>/g, 'Tickets</span>');
  }
  
  fs.writeFileSync(p, content, 'utf8');
}
console.log('Fixed encodings and links');

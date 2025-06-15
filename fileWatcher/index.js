require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const clipboardy = require('clipboardy').default;

// Get environment variables
const ASSET_PATH = process.env.ASSET_PATH;
const BASE_PATH = process.env.BASE_PATH;
const PORT = process.env.PORT;

if (!ASSET_PATH) {
  console.error('ASSET_PATH environment variable is not set');
  process.exit(1);
}

if (!BASE_PATH) {
  console.error('BASE_PATH environment variable is not set');
  process.exit(1);
}

console.log(`Watching for new files in ${ASSET_PATH} ...`);

// Watch for file additions in the ASSET_PATH directory
fs.watch(ASSET_PATH, (eventType, filename) => {
  // 'rename' event is triggered when a file is added or removed.
  if (eventType === 'rename' && filename) {
    const sourcePath = path.join(ASSET_PATH, filename);
    // Check if the file exists (exists means it was added)
    fs.access(sourcePath, fs.constants.F_OK, (err) => {
      if (!err) {
        // Generate new path using current date and a uuid v4, preserving file extension.
        const now = new Date();
        const yyyy = now.getFullYear().toString();
        const mm = (now.getMonth() + 1).toString().padStart(2, '0');
        const id = uuidv4();
        const ext = path.extname(filename);
        const destDir = path.join(BASE_PATH, yyyy, mm);
        // Ensure destination directory exists.
        fs.mkdir(destDir, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating directory:', err);
            return;
          }
          const destPath = path.join(destDir, `${id}${ext}`);
          // Move the file
          fs.rename(sourcePath, destPath, (err) => {
            if (err) {
              console.error('Error moving file:', err);
            } else {
              console.log(`File moved to: ${destPath}`);
              // Generate the endpoint URL (remove the leading dot from ext)
              const fileExt = ext.startsWith('.') ? ext.slice(1) : ext;
              const endpoint = `e.z:${PORT}/?mm=${mm}&yyyy=${yyyy}&id=${id}&fileExt=${fileExt}`;
              // Prefix with http: and wrap with Markdown image syntax
              const markdown = `![](http:${endpoint})`;
              // Copy the markdown string to the clipboard using the synchronous API
              try {
                clipboardy.writeSync(markdown);
                console.log(`Copied endpoint to clipboard: ${markdown}`);
              } catch (err) {
                console.error('Failed to copy to clipboard:', err);
              }
            }
          });
        });
      }
    });
  }
});
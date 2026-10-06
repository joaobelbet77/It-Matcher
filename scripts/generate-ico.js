const fs = require('fs');
const path = require('path');

// Simple script to copy the svg or generate a standard ico/png
// Let's create a simple 32x32 RGBA bitmap encoded into a valid ICO file
const width = 32;
const height = 32;

// ICO Header: 6 bytes
// ICONDIR: idReserved (2 bytes, 0), idType (2 bytes, 1 for ICO), idCount (2 bytes, 1)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);

// BITMAPINFOHEADER: 40 bytes
const biSize = 40;
const biWidth = width;
const biHeight = height * 2; // In ICO, height is doubled (image + mask)
const biPlanes = 1;
const biBitCount = 32; // 32-bit RGBA
const biCompression = 0; // BI_RGB
const imageSize = width * height * 4;
const maskRowSize = Math.ceil(width / 32) * 4;
const maskSize = maskRowSize * height;
const biSizeImage = imageSize + maskSize;

const bmpHeader = Buffer.alloc(40);
bmpHeader.writeUInt32LE(biSize, 0);
bmpHeader.writeInt32LE(biWidth, 4);
bmpHeader.writeInt32LE(biHeight, 8);
bmpHeader.writeUInt16LE(biPlanes, 12);
bmpHeader.writeUInt16LE(biBitCount, 14);
bmpHeader.writeUInt32LE(biCompression, 16);
bmpHeader.writeUInt32LE(biSizeImage, 20);

// Draw pixels (Bottom-Up format in BMP)
// Blue Target: Background #2563eb (R:37, G:99, B:235), Rings: White #ffffff
const pixelData = Buffer.alloc(imageSize);
const centerX = 15.5;
const centerY = 15.5;

for (let y = 0; y < height; y++) {
  // BMP is bottom-up, so actual visual Y is (height - 1 - y)
  const vy = height - 1 - y;
  for (let x = 0; x < width; x++) {
    const dx = x - centerX;
    const dy = vy - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    let r = 0, g = 0, b = 0, a = 0;
    
    // Rounded box or circle background
    // Check if inside rounded square of radius 14 with corner radius 6
    const insideBox = (Math.abs(dx) <= 14 && Math.abs(dy) <= 14);
    
    if (dist <= 15) {
      // Base Blue: #2563eb (BGRA: B=235, G=99, R=37, A=255)
      b = 235; g = 99; r = 37; a = 255;
      
      // Outer ring: dist between 9.5 and 12.5 -> White
      if (dist >= 9.5 && dist <= 12.5) {
        b = 255; g = 255; r = 255; a = 255;
      }
      // Middle ring: dist between 4.5 and 7.5 -> White
      else if (dist >= 4.5 && dist <= 7.5) {
        b = 255; g = 255; r = 255; a = 255;
      }
      // Center bullseye: dist <= 2.5 -> White
      else if (dist <= 2.5) {
        b = 255; g = 255; r = 255; a = 255;
      }
    }

    const offset = (y * width + x) * 4;
    pixelData[offset] = b;     // Blue
    pixelData[offset + 1] = g; // Green
    pixelData[offset + 2] = r; // Red
    pixelData[offset + 3] = a; // Alpha
  }
}

const maskData = Buffer.alloc(maskSize, 0); // 1-bit mask (all 0 for 32-bit alpha)

const imageData = Buffer.concat([bmpHeader, pixelData, maskData]);

// ICONDIRENTRY: 16 bytes
const dirEntry = Buffer.alloc(16);
dirEntry.writeUInt8(width, 0);        // Width
dirEntry.writeUInt8(height, 1);       // Height
dirEntry.writeUInt8(0, 2);            // Color count (0 for 32-bit)
dirEntry.writeUInt8(0, 3);            // Reserved
dirEntry.writeUInt16LE(1, 4);         // Color planes
dirEntry.writeUInt16LE(32, 6);        // Bits per pixel
dirEntry.writeUInt32LE(imageData.length, 8); // Image size in bytes
dirEntry.writeUInt32LE(6 + 16, 12);   // Image offset (Header + 1 Entry = 22 bytes)

const icoFile = Buffer.concat([header, dirEntry, imageData]);

const targetPath = path.join(__dirname, '..', 'public', 'favicon.ico');
fs.writeFileSync(targetPath, icoFile);
console.log('Successfully generated public/favicon.ico (' + icoFile.length + ' bytes)');

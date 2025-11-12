# Week 8: Day 1 - Node.js Fundamentals

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** JavaScript Fundamentals

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Understand Node.js architecture
- ✅ Work with modules & imports
- ✅ Handle file system operations
- ✅ Work with streams
- ✅ Use npm packages

---

## 1️⃣ What is Node.js?

### Node.js Basics

```javascript
// Node.js = JavaScript runtime outside browser
// Can run JavaScript on servers/computers
// Built on Chrome's V8 engine

// Key differences from browser:
// ✅ Can access file system
// ✅ Can create servers
// ✅ Can run background processes
// ✅ No DOM (it's backend!)
// ❌ No window object
// ❌ No document object
// ❌ Can't make cross-origin requests
```

### Node.js vs Browser JavaScript

```javascript
// BROWSER - Has window object
window.location.href // Can access browser
document.getElementById('app') // Can access DOM
fetch('http://example.com') // CORS restrictions

// NODE.JS - Has process & global
process.env.NODE_ENV // Can read environment
require('fs') // Can read files
const { readFileSync } = require('fs');
readFileSync('/path/to/file') // Can access files anywhere
```

### Event Loop in Node.js

```
Single-threaded event-driven architecture:

Libuv (C library) handles:
├─ File system events
├─ Network events
├─ Timers
└─ Thread pool for heavy work

Order of execution:
1. Timers (setTimeout, setInterval)
2. Pending callbacks
3. Idle, prepare
4. Poll (I/O operations)
5. Check (setImmediate)
6. Close callbacks
```

---

## 2️⃣ Modules & Require

### CommonJS Modules (Traditional)

```javascript
// math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };

// app.js
const math = require('./math');
console.log(math.add(5, 3)); // 8
console.log(math.subtract(5, 3)); // 2
```

### Export Styles

```javascript
// Export individual functions
module.exports.add = (a, b) => a + b;
module.exports.subtract = (a, b) => a - b;

// Or export object
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// Or export class
class Calculator {
  add(a, b) { return a + b; }
}
module.exports = Calculator;

// Usage
const Calculator = require('./calculator');
const calc = new Calculator();
```

### Import/Export (ES Modules)

```javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export default Calculator;

// app.js
import { add, subtract } from './math.js';
import Calculator from './math.js';

// In package.json, add "type": "module"
{
  "type": "module"
}
```

### Built-in Modules

```javascript
// fs - File system
const fs = require('fs');
const content = fs.readFileSync('file.txt', 'utf-8');

// path - Path utilities
const path = require('path');
const filePath = path.join(__dirname, 'files', 'data.txt');

// http - Create servers
const http = require('http');
const server = http.createServer((req, res) => {
  res.write('Hello World');
  res.end();
});

// events - Event emitter
const EventEmitter = require('events');
const emitter = new EventEmitter();
emitter.emit('event-name', data);

// util - Utility functions
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
```

---

## 3️⃣ File System Operations

### Reading Files

```javascript
const fs = require('fs');

// Synchronous (blocks code - use rarely!)
const content = fs.readFileSync('file.txt', 'utf-8');
console.log(content);

// Callback (traditional)
fs.readFile('file.txt', 'utf-8', (err, content) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(content);
});

// Promises
const fs = require('fs').promises;
async function readData() {
  try {
    const content = await fs.readFile('file.txt', 'utf-8');
    console.log(content);
  } catch (err) {
    console.error(err);
  }
}

readData();
```

### Writing Files

```javascript
const fs = require('fs').promises;

// Write (overwrites)
await fs.writeFile('output.txt', 'Hello World', 'utf-8');

// Append
await fs.appendFile('log.txt', 'New log entry\n', 'utf-8');

// Write multiple
const data = JSON.stringify({ name: 'John', age: 30 });
await fs.writeFile('data.json', data, 'utf-8');
```

### Directory Operations

```javascript
const fs = require('fs').promises;
const path = require('path');

// Create directory
await fs.mkdir('my-folder', { recursive: true });

// Read directory
const files = await fs.readdir('my-folder');
console.log(files); // ['file1.txt', 'file2.txt']

// Check if file exists
const stat = await fs.stat('file.txt');
console.log(stat.isFile()); // true
console.log(stat.size); // file size

// Delete file
await fs.unlink('file.txt');

// Delete directory
await fs.rmdir('empty-folder');

// Delete recursively
await fs.rm('folder-with-files', { recursive: true });
```

### File Paths

```javascript
const path = require('path');

// Get filename
path.basename('/home/user/documents/file.txt'); // 'file.txt'

// Get directory
path.dirname('/home/user/documents/file.txt'); // '/home/user/documents'

// Get extension
path.extname('/home/user/documents/file.txt'); // '.txt'

// Join paths
path.join('/home', 'user', 'documents', 'file.txt');

// Resolve absolute path
path.resolve('file.txt'); // '/current/working/directory/file.txt'

// Relative path
path.relative('/home/user', '/home/user/documents/file.txt'); // 'documents/file.txt'

// __dirname and __filename
console.log(__dirname); // Current directory
console.log(__filename); // Current file path
```

---

## 4️⃣ Streams

### Why Streams?

```javascript
// ❌ Without streams - load entire file in memory
const fs = require('fs');
const content = fs.readFileSync('large-file.txt');
console.log(content); // 500MB file = 500MB memory!

// ✅ With streams - process in chunks
const stream = fs.createReadStream('large-file.txt');
stream.on('data', (chunk) => {
  console.log(`Received chunk of ${chunk.length} bytes`);
});

// Only loads chunks at a time (~64KB default)
```

### Read Stream

```javascript
const fs = require('fs');

const readStream = fs.createReadStream('file.txt', {
  encoding: 'utf-8',
  highWaterMark: 16 * 1024 // 16KB chunks
});

readStream.on('data', (chunk) => {
  console.log(`Received: ${chunk.length} bytes`);
  // Process chunk
});

readStream.on('end', () => {
  console.log('Finished reading');
});

readStream.on('error', (err) => {
  console.error(err);
});
```

### Write Stream

```javascript
const fs = require('fs');

const writeStream = fs.createWriteStream('output.txt');

writeStream.write('First line\n');
writeStream.write('Second line\n');
writeStream.write('Third line\n');

writeStream.end(() => {
  console.log('Finished writing');
});

// Or pipe from read to write
fs.createReadStream('input.txt')
  .pipe(fs.createWriteStream('output.txt'));
```

### Transform Stream

```javascript
const { Transform } = require('stream');
const fs = require('fs');

const uppercase = new Transform({
  transform(chunk, encoding, callback) {
    const transformed = chunk.toString().toUpperCase();
    callback(null, transformed);
  }
});

fs.createReadStream('input.txt')
  .pipe(uppercase)
  .pipe(fs.createWriteStream('output.txt'));
```

---

## 5️⃣ Process & Environment

### Process Information

```javascript
// Process arguments
console.log(process.argv); 
// node app.js arg1 arg2
// ['node', 'app.js', 'arg1', 'arg2']

// Environment variables
console.log(process.env.NODE_ENV);
console.log(process.env.HOME);

// Process ID
console.log(process.pid);

// Memory usage
console.log(process.memoryUsage());
// {
//   rss: 29056000,      // Resident set size
//   heapTotal: 6037504,
//   heapUsed: 4025000,
//   external: 123000
// }

// CPU usage
console.log(process.cpuUsage());
```

### Environment Variables

```bash
# .env file
DATABASE_URL=mongodb://localhost:27017
API_KEY=secret123
NODE_ENV=development

# Load with dotenv
npm install dotenv
```

```javascript
// Load .env file
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.API_KEY;

// Default values
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
```

### Command Line Arguments

```bash
# Running command
node app.js --name John --age 30

# Parse arguments
const args = process.argv.slice(2);
// ['--name', 'John', '--age', '30']
```

```javascript
// Better: use yargs library
npm install yargs

const yargs = require('yargs');

const argv = yargs
  .option('name', {
    alias: 'n',
    describe: 'User name',
    type: 'string'
  })
  .option('age', {
    alias: 'a',
    describe: 'User age',
    type: 'number'
  })
  .argv;

console.log(argv.name); // John
console.log(argv.age);  // 30
```

---

## 📝 Practice Exercises

### Exercise 1: File Operations
Create script to read JSON file and pretty-print output

### Exercise 2: Stream Large File
Process a large CSV file line by line using streams

### Exercise 3: CLI Tool
Create command-line tool that accepts arguments and options

### Exercise 4: Module System
Create module structure with multiple files using imports/exports

---

## ✅ Summary

- **Node.js** runs JavaScript on servers
- **Modules** organize code reusable
- **File system** access files and directories
- **Streams** handle large data efficiently
- **Environment** variables configure applications
- **Process** information for monitoring

---

## 🔗 Next Steps

**Tomorrow (Day 2):** Express Framework & Routing  
**Continue Learning:** Master backend development!

// Functions
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Generics
function getById<T>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// Union types
type Status = 'active' | 'inactive' | 'pending';

// Intersection
interface Admin extends User {
  permissions: string[];
}
```

## ✅ Checkpoint

- [ ] Understand TypeScript basics
- [ ] Can write types
- [ ] Know interfaces
- [ ] Understand generics

**Next:** TypeScript with React! 🚀


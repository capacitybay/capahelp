const fs = require('fs/promises');
let path = require('path');
let filePath = path.join(__dirname, 'countries.json');
async function example() {
  try {
    const data = await fs.readFile(filePath, { encoding: 'utf8' });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
example();

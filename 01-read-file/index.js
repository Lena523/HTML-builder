const path = require('path');
const fs = require('fs');
const output = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf8');
output.on('data', data => {console.log(data.toString());});
output.on ( "end" , ( ) => {output.close()});

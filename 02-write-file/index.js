const fs = require('fs'); 
const path = require('path'); 
const textPath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(textPath);
process.stdout.write('Hi! Please write something...\n');
process.stdin.on('data', data =>{
 if(data.toString().trim() === 'exit'){
  closeFile();
 }
 output.write(data);
});

process.on('SIGINT', closeFile);

function closeFile(){
  process.stdout.write('\nSee you next time!');
  process.exit();
}



const path = require('path');
const fs = require("fs").promises;
fs.readdir(path.join(__dirname, 'secret-folder'),{
withFileTypes:true
}).then(files =>{
  files.forEach(file =>{
   if(!file.isDirectory()){
    const filePath = path.join(__dirname, 'secret-folder', file.name);
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath);
    fs
    .stat(filePath)
    .then(res =>{
     console.log(`${fileName.replace(ext, '')} - ${ext.replace('.', '')} - ${Number(res.size)}b`);
    });
   }
  });
});

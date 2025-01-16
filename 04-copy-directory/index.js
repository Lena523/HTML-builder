const fs = require('fs');
const path = require('path');
const myPath = path.join(__dirname, 'files');
(function copyFolder() {
  fs.mkdir(
    path.join(__dirname, 'filies-copy'),
    {
      recursive: true,
    },
    (err) => {
      if (err) {
        throw new Error('Folder already exists');
      }
      console.log('Folder successfully created');
    },
  );
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    if (err) console.log(err);
    else {
      const currentPath = path.join(__dirname, 'filies-copy');
      console.log(currentPath);
      files.forEach((file) => {
        fs.copyFile(
          path.join(myPath, file),
          path.join(currentPath, file),
          (err) => {
            console.log(path.join(myPath, file));
            if (err) throw err;
            console.log('Copied');
          },
        );
      });
    }
  });
})();

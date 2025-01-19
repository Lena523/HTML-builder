const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const dist = path.join(__dirname, 'project-dist');
const stylePath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const output = fs.createWriteStream(path.join(dist, 'style.css'));

(function createMainFolder() {
  fs.mkdir(
    path.join(__dirname, 'project-dist'),
    {
      recursive: true,
    },
    (err) => {
      if (err) {
        throw new Error('Folder already exists');
      }
    },
  );
})();

(function createMarkup() {
  const input = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  const output = fs.createWriteStream(path.join(dist, 'index.html'));
  let str = '';
  input.on('data', (data) => {
    str = data.toString();

    function mapper(elem) {
      return `{{${elem}}}`;
    }
    function mapper2(elem) {
      return `${elem}`;
    }

    const componentsPath = path.join(__dirname, 'components');
    fs.readdir(componentsPath, { withFileTypes: true }, (err, data) => {
      if (err) throw err;
      const temps = [];
      const temps2 = [];
      data.forEach((temp) => {
        let fileName = temp.name.match(/([\w]*\.)*/)[0].replace('.', '');
        temps.push(mapper(fileName));
        temps2.push(mapper2(fileName + '.html'));
      });

      for (let i = 0; i < temps.length; i += 1) {
        fs.readFile(path.join(componentsPath, temps2[i]), (err, data) => {
          if (err) {
            return console.log(err);
          }
          str = str.replace(temps[i], data);
          if (i === temps.length - 1) {
            output.write(str);
          }
        });
      }
    });
  });
  copyAssets(assetsPath, path.join(dist, 'assets'));
})();

fsPromises.readdir(stylePath).then(async (files) => {
  files.forEach(async (file) => {
    const filePath = path.join(stylePath, file);
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath);
    if (ext === '.css') {
      const input = fs.createReadStream(path.join(stylePath, fileName));
      input.on('data', (data) => {
        output.write(data.toString() + '\n');
      });
    }
  });
});

(function createAssetsFolder() {
  fs.mkdir(
    path.join(dist, 'assets'),
    {
      recursive: true,
    },
    (err) => {
      if (err) {
        throw new Error('Folder already exists');
      }
    },
  );
})();

async function copyAssets(dir, dest) {
  await fsPromises.readdir(dir, { withFileTypes: true }).then((files) => {
    files.forEach(async (file) => {
      if (file.isDirectory()) {
        const absDirPath = path.join(dir, file.name);
        const destPath = path.join(dest, file.name);
        copyAssets(absDirPath, destPath);
      } else {
        fs.mkdir(
          dest,
          {
            recursive: true,
          },
          (err) => {
            if (err) {
              throw new Error('Mistake!');
            }
          },
        );
        fsPromises.copyFile(
          path.join(dir, file.name),
          path.join(dest, file.name),
        );
      }
    });
  });
}

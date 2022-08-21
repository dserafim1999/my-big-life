import { map } from 'async';

const ALLOWED_EXTENSIONS = /^(gpx)$|^(life)$/;

function loadFiles (files, cb, error) {
  map(files, (file) => {
    const extension = file.name.split('.').pop();
    
    if (ALLOWED_EXTENSIONS.test(extension)) {
      let reader = new FileReader();

      reader.readAsText(file);
      reader.onloadend = () => {
      cb({
          name: file.name,
          data: reader.result
        })
      }
    } else {
      error();
    }
  });
}

export default loadFiles;

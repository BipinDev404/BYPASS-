const AdmZip = require('adm-zip');

function build() {
  try {
    const zip = new AdmZip();
    zip.addLocalFolder('./extension');
    zip.writeZip('./public/bypass-extension.zip');
    console.log('Successfully created bypass-extension.zip in /public');
  } catch (err) {
    console.error('Error creating zip:', err);
    process.exit(1);
  }
}

build();

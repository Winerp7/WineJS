//const fs = require('fs');
import path from 'path';

console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');
console.log(path.join(__dirname, '../../../slave_fix_shrink.img/')); // /Users/jens/Projects/Uni/Azure/wineJS/dist/util



const { withMountedDisk } = require('ext2fs');
const { FileDisk, withOpenFile } = require('file-disk');
const { promisify } = require('util');

// /etc/rc.local
const hello = async function main() {
  console.log("sup");
  const diskImage = '/Users/jens/Projects/Uni/Azure/slave_fix_shrink.img';
  const offset = 272629760;
  //const offset = 272629760;  // offset of the ext partition you want to mount in that disk image
  try {
    await withOpenFile(diskImage, 'r', async (handle) => {
      const disk = new FileDisk(handle);
      await withMountedDisk(disk, offset, async (fs) => {
        const readdir = promisify(fs.readdir);
        console.log('🤣🤣🤣🤣🤣🤣🤣', readdir);
        // List files
        //console.log('readdir etc ', await readdir('/etc'));
        let arr = await readdir('etc');
        arr.forEach(element => {
          console.log(element);
        });

        // let readFile = promisify(fs.readFile);
        // console.log('readFile', await readFile('/etc/pip.conf', 'utf8'));

        console.log('curr dir', process.cwd());

        let open = promisify(fs.open);
        console.log('open: ', await open(fs.open('/etc/pip.conf', 'r', function (err, f) {
          if (err) {
            return console.error(err);
          }
          console.log('Content: ', f);
          console.log("File opened!!!");
        })));

        //await fs.trim();
        // Show discarded regions
        //console.log('discarded', disk.getDiscardedChunks());
        // Show ranges of useful data aligned to 1MiB
        //console.log('ranges', await disk.getRanges(1024 ** 2));




      });
    });
  } catch (error) {
    console.error(error);
  }
};

hello();

console.log('SLUT 🙂🙂🙂🙂🙂🙂🙂🙂🙂🙂');








// console.log('🔔 am i reading this?');

// fs.readFile('/volumes/boot/config.txt', 'utf8', function (err: any, data: any) {
//   if (err) {
//     return console.log(err);
//   }
//   console.log(data);
// });




// console.log('🔥🔥🔥🔥🔥🔥🔥');

// fs.readFile('/etc/hosts', 'utf8', function (err: any, data: any) {
//   if (err) {
//     return console.log(err);
//   }
//   console.log(data);
// });

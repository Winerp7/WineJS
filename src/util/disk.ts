//const fs = require('fs');
import path from 'path';

console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');
console.log(path.join(__dirname, '../../../slave_fix_shrink.img/')); // /Users/jens/Projects/Uni/Azure/wineJS/dist/util



const filedisk = require('file-disk');
const { promisify } = require('util');


let hej = filedisk.withOpenFile('/Users/jens/Projects/Uni/Azure/slave_fix_shrink.img', 'r+', async (handle) => {
  const disk = new filedisk.FileDisk(handle);
  console.log('disk: ', disk);

  

  // get file size
  const size = await disk.getCapacity();
  console.log("size:", size);
  const buf = Buffer.alloc(1024);
  // read `buf.length` bytes starting at 0 from the file into `buf`
  const { bytesRead, buffer } = await disk.read(buf, 0, buf.length, 0);
  console.log(typeof(buffer));
  console.log(buffer);
  console.log('bRead', buffer.toString('utf8', 0, 1024));
  // // write `buffer` into file starting at `buffer.length` (in the file)
  // await disk.write(buf, 0, buf.length, buf.length);
  // // flush
  // await disk.flush();
});




console.log(hej);
hej;

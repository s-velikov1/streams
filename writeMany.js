const fs = require('node:fs/promises');
const { performance } = require('node:perf_hooks');

// (async () => {
//     const t0 = performance.now();
//     const fileHandle = await fs.open('test.txt', 'w');

//     const stream = fileHandle.createWriteStream();

//     for (let i = 0; i < 1000000; i++) {
//         const buff = Buffer.from(` ${i} `, 'utf-8');
//         stream.write(buff);
//     }
//     const t1 = performance.now();
//     console.log(`time execution: ${(t1 - t0) / 1000}`)
// })()

(async () => {
    const t0 = performance.now();
    const fileHandle = await fs.open('test.txt', 'w');

    const stream = fileHandle.createWriteStream();

    console.log(stream.writableHighWaterMark);
    
    // const buff = Buffer.alloc(16383, 10);
    // console.log(stream.write(buff));
    // console.log(stream.write(Buffer.alloc(1, 'a')));

    // stream.on('drain', () => {
    //     console.log('We are now safe to write more!');
    // });
    let i = 0;

    const writeMany = () => {
        while (i < 1000000) {
            const buff = Buffer.from(` ${i} `, 'utf-8');
            
            // this is our last write
            if (i === 999999) {
                return stream.end(buff);
            }

            if (!stream.write(buff)) {
                break;
            }
            
            i++
        }
    }

    writeMany();

    // resume our loop once our stream's internal buffer is emptied
    stream.on('drain', () => {
        writeMany();
    })
    stream.on('finish', () => {
        fileHandle.close();
        const t1 = performance.now();
        console.log(`time execution: ${(t1 - t0) / 1000}`)
    })

})()


// My versions: 
// (async () => {
//     const t0 = performance.now();

//     const fd = await fs.open('version6.txt', 'w');
//     // console.log(fd)

//     const start = 0;
//     const end = 10;

//     let offset = 0;

//     const buff = Buffer.alloc(4096, 0, 'utf-8');
//     console.log(Buffer.byteLength('1000000 '))
//     for (let i = start; i < end; i++) {
//         if (i === end - 1) {
//             await fd.write(buff, offset);
//         }

//         if (offset + Buffer.byteLength(` ${i} `) >= buff.length) {
//             await fd.write(buff, offset);
            
//             offset = 0;
//         }

//         buff.write(` ${i} `, offset);
//         offset += Buffer.byteLength(` ${i} `);
//     }

//     const t1 = performance.now();
//     console.log(`time execution: ${(t1 - t0) / 1000}`)
// })()
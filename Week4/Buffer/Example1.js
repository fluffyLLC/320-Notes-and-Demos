

const buff1 = Buffer.from("hello");

//a buffer is a byte array

console.log(buff1);//will output in hexidecimle

const buff2 = Buffer.from([255]);//ff

const buff3 = Buffer.from([1000]);//gets shrunkated

const buff4 = Buffer.from([0,255,32]);

const buff5 = Buffer.alloc(10); //10 bytes of allocated memory


buff5.writeUInt8(255, 3);
buff5.writeUInt16BE(1024, 5); //Big-Endian notation writes left-to-right

var val = buff5.readUInt8(5);

console.log(val);

console.log(buff5);



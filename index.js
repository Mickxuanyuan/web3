const crypto = require("crypto");
// 可自定义的 key 和 iv（保持 32 字节 key、16 字节 iv）
const KEY = crypto.randomBytes(32); // 256-bit 密钥
const IV = crypto.randomBytes(16); // 128-bit 初始化向量，保证同一个key也能加密出不同的结果

function encryptHex(hexString) {
  //创建一个 AES 加密器对象
  const cipher = crypto.createCipheriv("aes-256-cbc", KEY, IV);
  //   把 update() 和 final() 输出的两个 Buffer 合并在一起，得到完整密文。
  const encrypted = Buffer.concat([
    // 把你的 hex 字符串转成二进制 Buffer 然后 对数据分块进行加密。。
    cipher.update(Buffer.from(hexString, "hex")),
    // 关闭加密流，并输出最后一块加密数据。
    cipher.final(),
  ]);
  //   把加密后的二进制密文 转成 hex 字符串并返回。
  return encrypted.toString("hex");
}

// ------- HEX 数据解密：输入 hex → 输出 hex -------
function decryptHex(hexString) {
    //创建一个 AES 解密器对象
  const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, IV);
  //   把你的 hex 字符串转成二进制 Buffer 然后 对数据分块进行解密。
  const decrypted = Buffer.concat([
    // 关闭解密流，并输出最后一块解密数据。
    decipher.update(Buffer.from(hexString, "hex")),
    decipher.final(),
  ]);
  //   把解密后的二进制明文 转成 hex 字符串并返回。
  return decrypted.toString("hex");
}

// 测试
const originalHex = "A1B2C3D4FFEE1234";
const encrypted = encryptHex(originalHex);
const decrypted = decryptHex(encrypted);

console.log("原文 HEX:", originalHex);
console.log("加密 HEX:", encrypted);
console.log("解密 HEX:", decrypted);

// 原文 HEX: A1B2C3D4FFEE1234
// 加密 HEX: 11fe02ba6332decd59c1a08210b8e05d
// 解密 HEX: a1b2c3d4ffee1234

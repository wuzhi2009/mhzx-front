import CryptoJS from "crypto-js";
/**
 * 明文AES加密函数
 * @param {String} plainText 需要加密的明文
 * @returns {String} 加密后的密文字符串
 */
export function aesEncrypt(plainText, key) {
    // 如果传入的明文未定义，则直接返回
    if (!plainText) {
      return plainText;
    }
    var utf8Key = CryptoJS.enc.Utf8.parse(key);
    // 使用AES算法、CBC模式和PKCS#7填充对明文进行加密
    const encryptedData = CryptoJS.AES.encrypt(plainText, utf8Key, {
      // iv: iv, // 使用上面定义的IV
      mode: CryptoJS.mode.ECB, // 加密模式设置为CBC
      padding: CryptoJS.pad.Pkcs7, // 填充方式设置为PKCS#7
    });
    // 将加密后的对象转换为字符串形式返回
    return encryptedData.toString();
  }
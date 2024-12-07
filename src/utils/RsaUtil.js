import JSEncrypt from "jsencrypt";
import CryptoJS from "crypto-js";
// 前端RSA加密密钥
const publicKey = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANp6aa+YNyty4L/DWG6nnjYspjzl870P+6+brobEnS+EiW/3PaL6FhFo8TaVDE4FN4qLZ67ngORALs/0zU0cW+kCAwEAAQ==";
// 前端RSA解密密钥
const privateKey = "MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAmc3CuPiGL/LcIIm7zryCEIbl1SPzBkr75E2VMtxegyZ1lYRD+7TZGAPkvIsBcaMs6Nsy0L78n2qh+lIZMpLH8wIDAQABAkEAk82Mhz0tlv6IVCyIcw/s3f0E+WLmtPFyR9/WtV3Y5aaejUkU60JpX4m5xNR2VaqOLTZAYjW8Wy0aXr3zYIhhQQIhAMfqR9oFdYw1J9SsNc+CrhugAvKTi0+BF6VoL6psWhvbAiEAxPPNTmrkmrXwdm/pQQu3UOQmc2vCZ5tiKpW10CgJi8kCIFGkL6utxw93Ncj4exE/gPLvKcT+1Emnoox+O9kRXss5AiAMtYLJDaLEzPrAWcZeeSgSIzbL+ecokmFKSDDcRske6QIgSMkHedwND1olF8vlKsJUGK3BcdtM8w4Xq7BpSBwsloE="

/**
 * rsa加密
 * @param {*} txt 
 * @returns 
 */
export function rsaEncrypt(txt) {
    // 加密前先进行base64编码
    txt = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(txt));
    const encryption = new JSEncrypt();
    encryption.setPublicKey(publicKey); // 设置公钥
    return encryption.encrypt(txt); // 对数据进行加密
}

/**
 * rsa解密
 * @param {*} txt 
 * @returns 
 */
export function rsaDecrypt(txt) {
    const encryption = new JSEncrypt();
    encryption.setPrivateKey(privateKey); // 设置私钥
    return encryption.decrypt(txt); // 对数据进行解密
}
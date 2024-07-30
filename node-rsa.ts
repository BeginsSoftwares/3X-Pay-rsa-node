import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

// Caminho para os arquivos de chave privada e pública
const privateKeyPath = path.join(__dirname, ".", "private_key.pem");
const publicKeyPath = path.join(__dirname, ".", "public_key_teste.pem");

// Ler o conteúdo da chave privada e pública a partir dos arquivos
const privateKeyPem = fs.readFileSync(privateKeyPath, "utf8");
const publicKeyPem = fs.readFileSync(publicKeyPath, "utf8");

// Dados que serão assinados
const bodyData = {
  transaction: {
    key: "11111111111",
    amount: 2.11,
    callback_url: "https://enu74s7tvngo.x.pipedream.net/",
    external_id: "12312312",
    pixType: "CPF",
  },
};

/**
 * Função para assinar dados usando uma chave privada
 * @param data - Dados a serem assinados
 * @param privateKeyPem - Chave privada em formato PEM
 * @returns Assinatura em base64
 */
function signData(data: any, privateKeyPem: string): string {
  try {
    // Converter os dados para uma string JSON
    const dataString = JSON.stringify(data);

    // Criar um objeto SHA-256 para a assinatura
    const sign = crypto.createSign("SHA256");

    // Atualizar o objeto SHA-256 com os dados
    sign.update(dataString);
    sign.end();

    // Assinar os dados usando a chave privada
    const signature = sign.sign(privateKeyPem, "base64");

    return signature;
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
}

/**
 * Função para verificar a assinatura usando uma chave pública
 * @param data - Dados originais
 * @param signature - Assinatura a ser verificada
 * @param publicKeyPem - Chave pública em formato PEM
 * @returns Booleano indicando se a assinatura é válida
 */
function verifySignature(
  data: any,
  signature: string,
  publicKeyPem: string
): boolean {
  try {
    // Converter os dados para uma string JSON
    const dataString = JSON.stringify(data);

    // Criar um objeto SHA-256 para a verificação
    const verify = crypto.createVerify("SHA256");

    // Atualizar o objeto SHA-256 com os dados
    verify.update(dataString);
    verify.end();

    // Verificar a assinatura usando a chave pública
    const isVerified = verify.verify(publicKeyPem, signature, "base64");

    return isVerified;
  } catch (error) {
    console.error("Verification error:", error);
    throw error;
  }
}

// Assinar os dados
const encryptedData = signData(bodyData, privateKeyPem);

// Verificar a assinatura
const isValid = verifySignature(bodyData, encryptedData, publicKeyPem);
console.log("isValid", isValid);

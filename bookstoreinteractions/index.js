import { ethers, Wallet } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();
import bookStore from "./ABI/BookStore.json" assert { type: "json" };

const createContractInstanceOnEthereum = (contractAddress, contractAbi) => {
  try {
    const alchemyApiKey = process.env.ALCHEMY_API_KEY_SEPOLIA;
    const provider = new ethers.AlchemyProvider("sepolia", alchemyApiKey);
    console.log("provider", provider);

    const privateKey = process.env.WALLET_PRIVATE_KEY;
    const wallet = new Wallet(privateKey, provider);

    const contract = new ethers.Contract(contractAddress, contractAbi, wallet);
    console.log(contract);

    return contract;
  } catch (error) {
    console.log(error);
  }
};

const contractAddress = "0xFE7475a0A2b98b187492FBD7BD54dfdD04E9008F";
const contractOnETH = createContractInstanceOnEthereum(
  contractAddress,
  bookStore.abi
);

const addBookToContract = async (bookId, title, author, price, stock) => {
  try {
    const txResponse = await contractOnETH.addBook(
      bookId,
      title,
      author,
      price,
      stock
    );
    console.log(txResponse.hash);
    console.log(`https://sepolia.etherscan.io/tx/${txResponse.hash}`);
  } catch (error) {
    console.error(error);
  }
};

const bookDetails = {
  bookId: 1,
  title: "Harry Potter",
  author: "J.K. Rowling",
  price: 10,
  stock: 100,
};

const _bookId = 1;
const getBook = async () => {
  try {
    const books = await contractOnETH.getBooks(_bookId);
    console.log(books);
  } catch (error) {
    console.error(error);
  }
};

// create public and private key
// const createEthereumAccount = async () => {
//   try {
//     const privateKey = ethers.SigningKey(id("some-secret-1"));
//     const wallet = new ethers.BaseWallet(privateKey);
//     console.log("Wallet Address:", wallet.address);
//     console.log("Private Key:", wallet.privateKey);
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

// 0x7531491c6101330ea2d4cFc2728117D62E01d42F

(async () => {
  //   await createEthereumAccount();
  // await addBookToContract(3, "Harry Potter", "J.K. Rowling", 10, 100)
  // await getBook()
})();

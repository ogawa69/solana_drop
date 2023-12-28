import web3 from 'web3'
import {ADDRESS_SOL, ADDRESS_EVM, PRIVATE_KEY_EVM} from './config'

const getTokensPrice = async (fromToken, fromChain, toToken, toChain, amount, slippage = 0.3) => {
    try {
        const res = await fetch(`
        https://price-api.mayan.finance/v3/quote?amountIn=${amount}&fromToken=${fromToken}&fromChain=${fromChain}&toToken=${toToken}&toChain=${toChain}&slippage=${slippage}`)
        
        if (res.ok) {
            return res.json()
        }
    } catch (e) {
        console.log('Не удалось получить цену токенов. Ошибка: ' + e.message)
    }
}

const getBNBBalance = async (walletAddress, clientBNB) => {
  try {
    const balance = await clientBNB.eth.getBalance(walletAddress);
    const balanceInBNB = clientBNB.utils.fromWei(balance, 'ether');
    console.log('Баланс BNB:', balanceInBNB);

    return balance
  } catch (error) {
    console.error('Ошибка при получении баланса:', error);
  }
}

const approveUSDTOnBsc = async (amount, clientBNB) => {
  const contractAddress = '0x55d398326f99059ff775485246999027b3197955';
  const spenderAddress = '0xf3f04555f8fda510bfc77820fd6eb8446f59e72d';

  try {
    const usdtContractAbi = [{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
    const usdtContract = new web3.eth.Contract(usdtContractAbi, contractAddress);
    console.log('tuta')
    const transfer = usdtContract.methods.transfer(toAddress, amount);

    const gasPrice = await clientBNB.eth.getGasPrice();
    const nonce = await clientBNB.eth.getTransactionCount(ADDRESS_EVM);
    const gasLimit = 300000; // Лимит газа для транзакции

    const rawTx = {
      from: ADDRESS_EVM,
      to: contractAddress,
      gasPrice: gasPrice,
      gas: gasLimit,
      nonce: nonce,
      data: encodedABI,
    };

    const signedTx = await clientBNB.eth.accounts.signTransaction(rawTx, PRIVATE_KEY_EVM);
    const receipt = await clientBNB.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Транзакция успешно выполнена. Receipt:', receipt);
  } catch (error) {
    console.error('Ошибка при отправке апрува:', error);
  }
}

const transferFromBSC = async (privateKey, clientBNB) => {

    try {
    const contract = clientBNB.eth.Contract(contractAbi, contractAddress);

    const transaction = contract.methods[methodName](...methodArgs);
    const encodedTransaction = transaction.encodeABI();
    
    const gasPrice = await clientBNB.eth.getGasPrice();
    const nonce = await clientBNB.eth.getTransactionCount(fromAddress);
  
    const signedTransaction = await clientBNB.eth.accounts.signTransaction(
      {
        to: contractAddress,
        data: encodedTransaction,
        gasPrice,
        nonce,
      },
      privateKey
    );
  
    const receipt = await clientBNB.eth.sendSignedTransaction(signedTransaction.rawTransaction);
  
    console.log('Транзакция успешно отправлена. Хэш:', receipt.transactionHash);
    } catch (e) {
        console.log('Ошибка отправки транзакции в BSC: ' + e.message)
    }
}

(async () => {
    const clientBNB = new web3('https://rpc.ankr.com/bsc')

    const balance = await getBNBBalance(ADDRESS_EVM, clientBNB)
    
    try {
        if (balance > 0) {
            const tokensPrice = await getTokensPrice('0x55d398326f99059ff775485246999027b3197955', 'bsc', 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', 'solana', '100')
            
            const approve = approveUSDTOnBsc(clientBNB.utils.toWei(7, 'ether'), clientBNB)
            
        }
        
    } catch (err) {
        console.log(err)
    }
    
    
})()
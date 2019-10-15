import Web3 from "web3";
import { Transaction } from "ethereumjs-tx";
import Config from "./config";
import User from "../models/user";
import UserRepository from "../repositories/userRepository";
import WalletHelper from "../helpers/walletHelper";
import FaceRequest from "../models/faceRequest";
import FaceRequestContractRepository from "../repositories/faceRequestContractRepository";
import UserHasNoBalance from "../exceptions/user/userHasNoBalance";
import i18next from "i18next";

class MultisignatureContract {
    static readonly ABI = [
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "owners",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "name": "isOwner",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "address"
            }
          ],
          "name": "confirmations",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "transactions",
          "outputs": [
            {
              "name": "destination",
              "type": "address"
            },
            {
              "name": "value",
              "type": "uint256"
            },
            {
              "name": "data",
              "type": "bytes"
            },
            {
              "name": "executed",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "transactionCount",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "state",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "digicusToken",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "MAX_OWNER_COUNT",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "required",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "name": "_token",
              "type": "address"
            },
            {
              "name": "_owners",
              "type": "address[]"
            },
            {
              "name": "_required",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": true,
              "name": "transactionId",
              "type": "uint256"
            }
          ],
          "name": "Confirmation",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": true,
              "name": "transactionId",
              "type": "uint256"
            }
          ],
          "name": "Revocation",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "transactionId",
              "type": "uint256"
            }
          ],
          "name": "Submission",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "transactionId",
              "type": "uint256"
            }
          ],
          "name": "Execution",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "transactionId",
              "type": "uint256"
            }
          ],
          "name": "ExecutionFailure",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Deposit",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "OwnerAddition",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "OwnerRemoval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "required",
              "type": "uint256"
            }
          ],
          "name": "RequirementChange",
          "type": "event"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "destination",
              "type": "address"
            },
            {
              "name": "value",
              "type": "uint256"
            },
            {
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "submitTransaction",
          "outputs": [
            {
              "name": "transactionId",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "transactionId",
              "type": "uint256"
            },
            {
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "confirmTransaction",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [],
          "name": "cancelfirmation",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "transactionId",
              "type": "uint256"
            }
          ],
          "name": "executeTransaction",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "transactionId",
              "type": "uint256"
            }
          ],
          "name": "isConfirmed",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "transactionId",
              "type": "uint256"
            }
          ],
          "name": "getConfirmationCount",
          "outputs": [
            {
              "name": "count",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "pending",
              "type": "bool"
            },
            {
              "name": "executed",
              "type": "bool"
            }
          ],
          "name": "getTransactionCount",
          "outputs": [
            {
              "name": "count",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getOwners",
          "outputs": [
            {
              "name": "",
              "type": "address[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "transactionId",
              "type": "uint256"
            }
          ],
          "name": "getConfirmations",
          "outputs": [
            {
              "name": "_confirmations",
              "type": "address[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "from",
              "type": "uint256"
            },
            {
              "name": "to",
              "type": "uint256"
            },
            {
              "name": "pending",
              "type": "bool"
            },
            {
              "name": "executed",
              "type": "bool"
            }
          ],
          "name": "getTransactionIds",
          "outputs": [
            {
              "name": "_transactionIds",
              "type": "uint256[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }
      ];

    static readonly byteCode: string = "0x60806040523480156200001157600080fd5b506040516200223c3803806200223c833981018060405281019080805190602001909291908051820192919060200180519060200190929190505050600082518260328211158015620000645750818111155b801562000072575060008114155b801562000080575060008214155b15156200008c57600080fd5b600092505b8451831015620001c757600360008685815181101515620000ae57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161580156200013d5750600085848151811015156200011a57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1614155b15156200014957600080fd5b60016003600087868151811015156200015e57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550828060010193505062000091565b8460049080519060200190620001df9291906200023b565b50836005819055506000600781905550856000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050505062000310565b828054828255906000526020600020908101928215620002b7579160200282015b82811115620002b65782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550916020019190600101906200025c565b5b509050620002c69190620002ca565b5090565b6200030d91905b808211156200030957600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600101620002d1565b5090565b90565b611f1c80620003206000396000f300608060405260043610610107576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063025e7c271461010c5780632f54bf6e146101795780633411c81c146101d4578063547415251461023957806360f247b514610288578063784547a7146102d55780638b51d13f1461031a5780639ace38c21461035b578063a0e67e2b14610446578063a8abe69a146104b2578063b5dc40c314610556578063b77bf600146105d8578063c19d93fb14610603578063c64274741461062e578063d3dec60f146106d5578063d74f8edd1461072c578063dc8452cd14610757578063ee22610b14610782578063f871ecfd146107af575b600080fd5b34801561011857600080fd5b50610137600480360381019080803590602001909291905050506107c6565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561018557600080fd5b506101ba600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610804565b604051808215151515815260200191505060405180910390f35b3480156101e057600080fd5b5061021f60048036038101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610824565b604051808215151515815260200191505060405180910390f35b34801561024557600080fd5b50610272600480360381019080803515159060200190929190803515159060200190929190505050610853565b6040518082815260200191505060405180910390f35b34801561029457600080fd5b506102d360048036038101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506108e7565b005b3480156102e157600080fd5b5061030060048036038101908080359060200190929190505050610cf8565b604051808215151515815260200191505060405180910390f35b34801561032657600080fd5b5061034560048036038101908080359060200190929190505050610ddd565b6040518082815260200191505060405180910390f35b34801561036757600080fd5b5061038660048036038101908080359060200190929190505050610ea8565b604051808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018060200183151515158152602001828103825284818151815260200191508051906020019080838360005b838110156104085780820151818401526020810190506103ed565b50505050905090810190601f1680156104355780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b34801561045257600080fd5b5061045b610f9d565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b8381101561049e578082015181840152602081019050610483565b505050509050019250505060405180910390f35b3480156104be57600080fd5b506104ff600480360381019080803590602001909291908035906020019092919080351515906020019092919080351515906020019092919050505061102b565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b83811015610542578082015181840152602081019050610527565b505050509050019250505060405180910390f35b34801561056257600080fd5b50610581600480360381019080803590602001909291905050506111af565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156105c45780820151818401526020810190506105a9565b505050509050019250505060405180910390f35b3480156105e457600080fd5b506105ed6113ec565b6040518082815260200191505060405180910390f35b34801561060f57600080fd5b506106186113f2565b6040518082815260200191505060405180910390f35b34801561063a57600080fd5b506106bf600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506113f8565b6040518082815260200191505060405180910390f35b3480156106e157600080fd5b506106ea61154f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561073857600080fd5b50610741611574565b6040518082815260200191505060405180910390f35b34801561076357600080fd5b5061076c611579565b6040518082815260200191505060405180910390f35b34801561078e57600080fd5b506107ad6004803603810190808035906020019092919050505061157f565b005b3480156107bb57600080fd5b506107c4611956565b005b6004818154811015156107d557fe5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60036020528060005260406000206000915054906101000a900460ff1681565b60026020528160005260406000206020528060005260406000206000915091509054906101000a900460ff1681565b600080600090505b6006548110156108e05783801561089357506001600082815260200190815260200160002060030160009054906101000a900460ff16155b806108c757508280156108c657506001600082815260200190815260200160002060030160009054906101000a900460ff165b5b156108d3576001820191505b808060010191505061085b565b5092915050565b600033600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561094257600080fd5b8360006001600083815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415151561099f57600080fd5b84336002600083815260200190815260200160002060008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151515610a0b57600080fd5b600094505b600480549050851015610ba857600260008881526020019081526020016000206000600487815481101515610a4157fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515610b9b573373ffffffffffffffffffffffffffffffffffffffff16600486815481101515610ae057fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610b96576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f6e656564206279206f726465722e00000000000000000000000000000000000081525060200191505060405180910390fd5b610ba8565b8480600101955050610a10565b60008673ffffffffffffffffffffffffffffffffffffffff16118015610c185750600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16155b15610c3957610c2686611aae565b6005600081548092919060010191905055505b60016002600089815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550863373ffffffffffffffffffffffffffffffffffffffff167f4a504a94899432a9846e1aa406dceb1bcfd538bb839071d49d1e5e23f5be30ef60405160405180910390a3610cef8761157f565b50505050505050565b6000806000809150600090505b600480549050811015610dd557600260008581526020019081526020016000206000600483815481101515610d3657fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615610db5576001820191505b600554821415610dc85760019250610dd6565b8080600101915050610d05565b5b5050919050565b600080600090505b600480549050811015610ea257600260008481526020019081526020016000206000600483815481101515610e1657fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615610e95576001820191505b8080600101915050610de5565b50919050565b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806001015490806002018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610f805780601f10610f5557610100808354040283529160200191610f80565b820191906000526020600020905b815481529060010190602001808311610f6357829003601f168201915b5050505050908060030160009054906101000a900460ff16905084565b6060600480548060200260200160405190810160405280929190818152602001828054801561102157602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610fd7575b5050505050905090565b6060806000806006546040519080825280602002602001820160405280156110625781602001602082028038833980820191505090505b509250600091506006548710151561107a5760065496505b600090505b600654811015611121578580156110b757506001600082815260200190815260200160002060030160009054906101000a900460ff16155b806110eb57508480156110ea57506001600082815260200190815260200160002060030160009054906101000a900460ff165b5b15611114578083838151811015156110ff57fe5b90602001906020020181815250506001820191505b808060010191505061107f565b8787036040519080825280602002602001820160405280156111525781602001602082028038833980820191505090505b5093508790505b868110156111a457828181518110151561116f57fe5b906020019060200201518489830381518110151561118957fe5b90602001906020020181815250508080600101915050611159565b505050949350505050565b6060806000806004805490506040519080825280602002602001820160405280156111e95781602001602082028038833980820191505090505b50925060009150600090505b6004805490508110156113365760026000868152602001908152602001600020600060048381548110151561122657fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615611329576004818154811015156112ad57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1683838151811015156112e657fe5b9060200190602002019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250506001820191505b80806001019150506111f5565b816040519080825280602002602001820160405280156113655781602001602082028038833980820191505090505b509350600090505b818110156113e457828181518110151561138357fe5b90602001906020020151848281518110151561139b57fe5b9060200190602002019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050808060010191505061136d565b505050919050565b60065481565b60075481565b600033600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561145357600080fd5b61145e858585611cd1565b915061146b8260006108e7565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663475a9fa930866040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b15801561152f57600080fd5b505af1158015611543573d6000803e3d6000fd5b50505050509392505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b603281565b60055481565b600033600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615156115da57600080fd5b82336002600083815260200190815260200160002060008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561164557600080fd5b846001600082815260200190815260200160002060030160009054906101000a900460ff1615151561167657600080fd5b61167f86610cf8565b1561194e5760016000878152602001908152602001600020945060018560030160006101000a81548160ff02191690831515021790555061179b8560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600087600201805460018160011615610100020316600290049050886002018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156117915780601f1061176657610100808354040283529160200191611791565b820191906000526020600020905b81548152906001019060200180831161177457829003601f168201915b5050505050611e24565b15611902576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8660000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1687600101546040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b15801561188c57600080fd5b505af11580156118a0573d6000803e3d6000fd5b505050506040513d60208110156118b657600080fd5b810190808051906020019092919050505050857f33e13ecb54c3076d8e8bb8c2881800a4d972b792045ffae98fdf46df365fed7560405160405180910390a2600160078190555061194d565b857f526441bb6c1aba3c9a4a6ca1d6545da9c2333c8c48343ef398eb858d72b7923660405160405180910390a260008560030160006101000a81548160ff0219169083151502179055505b5b505050505050565b60008033600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615156119b257600080fd5b60009250600091505b6006548210156119ed5760016000838152602001908152602001600020600101548301925081806001019250506119bb565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166342966c68846040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b158015611a7d57600080fd5b505af1158015611a91573d6000803e3d6000fd5b505050503073ffffffffffffffffffffffffffffffffffffffff16ff5b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515611b0657600080fd5b80600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151515611b6057600080fd5b8160008173ffffffffffffffffffffffffffffffffffffffff1614151515611b8757600080fd5b60016004805490500160055460328211158015611ba45750818111155b8015611bb1575060008114155b8015611bbe575060008214155b1515611bc957600080fd5b6001600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555060048590806001815401808255809150509060018203906000526020600020016000909192909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550508473ffffffffffffffffffffffffffffffffffffffff167ff39e6e1eb0edcf53c221607b54b00cd28f3196fed0a24994dc308b8f611b682d60405160405180910390a25050505050565b60008360008173ffffffffffffffffffffffffffffffffffffffff1614151515611cfa57600080fd5b60065491506080604051908101604052808673ffffffffffffffffffffffffffffffffffffffff168152602001858152602001848152602001600015158152506001600084815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550602082015181600101556040820151816002019080519060200190611dba929190611e4b565b5060608201518160030160006101000a81548160ff0219169083151502179055509050506001600660008282540192505081905550817fc0ba8fe4b176c1714197d43b9cc6bcf797a4a7461c5fe8d0ef6e184ae7601e5160405160405180910390a2509392505050565b6000806040516020840160008287838a8c6187965a03f19250505080915050949350505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611e8c57805160ff1916838001178555611eba565b82800160010185558215611eba579182015b82811115611eb9578251825591602001919060010190611e9e565b5b509050611ec79190611ecb565b5090565b611eed91905b80821115611ee9576000816000905550600101611ed1565b5090565b905600a165627a7a723058203207e34b36393d59a93326976349bf75340e066f87957345f06f1008a2fa781f0029";

    static deployContract = async (coordinator: User, nextUserId: number, faceRequest: FaceRequest) => {
        const web3 = new Web3(Config.get("INFURA_PROJECT_URL", 'https://ropsten.infura.io/v3/015647b81e8d46c3a0e68bc0279641c7'));
        let contract = new web3.eth.Contract(MultisignatureContract.ABI);

        const userWallet = await UserRepository.findWalletById(coordinator.id);
        const nextWallet = await UserRepository.findWalletById(nextUserId);
        if (userWallet === null || nextWallet === null) {
            throw new Error('Coordinator doesn\'t have wallet');
        }
        // check if unes has balance to deploy contract
        const balance = await web3.eth.getBalance(userWallet.address);
        const gasLimit = Config.get("GAS_LIMIT", 6612388);
        if (gasLimit > parseInt(balance)) {
            throw new UserHasNoBalance(400, 364, i18next.t('userWalletAddressHasNoBalance', { address: userWallet.address }));
        }
        let nonce = await web3.eth.getTransactionCount(userWallet.address, "pending");
        let nonceHex = web3.utils.toHex(nonce);
        let contractData = contract.deploy({
            data: MultisignatureContract.byteCode,
            arguments: [
                Config.get("DIGICUS_ADDRESS", "0x34e03064f017f9b5a903807a28e9aa72f41b8920"),
                [userWallet.address, nextWallet.address],
                2
            ]
        });
        let gasPrice = await web3.eth.getGasPrice();
        let gasPriceHex = web3.utils.toHex(gasPrice);
        let gasLimitHex = web3.utils.toHex(6612388);
        let rawTx = {
            nonce: nonceHex,
            from: userWallet.address,
            gasLimit: gasLimitHex,
            gasPrice: gasPriceHex,
            data: contractData.encodeABI()
        };
        const tx = new Transaction(rawTx, { chain: 'ropsten' });
        let privateKey = await WalletHelper.getWallPrivate(userWallet, coordinator);
        let privateBuffer = new Buffer(privateKey, 'hex');
        tx.sign(privateBuffer);
        const serializedTx = tx.serialize();
        return web3.eth.sendSignedTransaction('0x' + serializedTx.toString("hex")).on('transactionHash', function (hash) {
            // set into request contracts
            FaceRequestContractRepository.setRequestContract(faceRequest.id, hash);
        });
    }
}

export default MultisignatureContract;
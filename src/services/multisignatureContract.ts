import Web3 from "web3";
import { Transaction } from "ethereumjs-tx";
import Config from "./config";
import User from "../models/user";
import UserRepository from "../repositories/userRepository";
import WalletHelper from "../helpers/walletHelper";
import FaceRequest from "../models/faceRequest";
import FaceRequestContractRepository from "../repositories/faceRequestContractRepository";

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
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "addOwner",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "removeOwner",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "owner",
                    "type": "address"
                },
                {
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "replaceOwner",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_required",
                    "type": "uint256"
                }
            ],
            "name": "changeRequirement",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
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
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getSender",
            "outputs": [
                {
                    "name": "sender",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];

    static readonly byteCode: string = "0x60806040523480156200001157600080fd5b5060405162002ad638038062002ad6833981018060405281019080805190602001909291908051820192919060200180519060200190929190505050600082518260328211158015620000645750818111155b801562000072575060008114155b801562000080575060008214155b15156200008c57600080fd5b600092505b8451831015620001c757600360008685815181101515620000ae57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161580156200013d5750600085848151811015156200011a57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1614155b15156200014957600080fd5b60016003600087868151811015156200015e57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550828060010193505062000091565b8460049080519060200190620001df9291906200023b565b50836005819055506000600781905550856000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050505062000310565b828054828255906000526020600020908101928215620002b7579160200282015b82811115620002b65782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550916020019190600101906200025c565b5b509050620002c69190620002ca565b5090565b6200030d91905b808211156200030957600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600101620002d1565b5090565b90565b6127b680620003206000396000f30060806040526004361061013e576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063025e7c2714610143578063173825d9146101b05780632f54bf6e146101f35780633411c81c1461024e57806354741525146102b35780635e01eb5a1461030257806360f247b5146103595780637065cb48146103a6578063784547a7146103e95780638b51d13f1461042e5780639ace38c21461046f578063a0e67e2b1461055a578063a8abe69a146105c6578063b5dc40c31461066a578063b77bf600146106ec578063ba51a6df14610717578063c19d93fb14610744578063c64274741461076f578063d3dec60f14610816578063d74f8edd1461086d578063dc8452cd14610898578063e20056e6146108c3578063ee22610b14610926578063f871ecfd14610953575b600080fd5b34801561014f57600080fd5b5061016e6004803603810190808035906020019092919050505061096a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101bc57600080fd5b506101f1600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506109a8565b005b3480156101ff57600080fd5b50610234600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c5f565b604051808215151515815260200191505060405180910390f35b34801561025a57600080fd5b5061029960048036038101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c7f565b604051808215151515815260200191505060405180910390f35b3480156102bf57600080fd5b506102ec600480360381019080803515159060200190929190803515159060200190929190505050610cae565b6040518082815260200191505060405180910390f35b34801561030e57600080fd5b50610317610d42565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561036557600080fd5b506103a460048036038101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610d4a565b005b3480156103b257600080fd5b506103e7600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061115b565b005b3480156103f557600080fd5b506104146004803603810190808035906020019092919050505061137e565b604051808215151515815260200191505060405180910390f35b34801561043a57600080fd5b5061045960048036038101908080359060200190929190505050611463565b6040518082815260200191505060405180910390f35b34801561047b57600080fd5b5061049a6004803603810190808035906020019092919050505061152e565b604051808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018060200183151515158152602001828103825284818151815260200191508051906020019080838360005b8381101561051c578082015181840152602081019050610501565b50505050905090810190601f1680156105495780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b34801561056657600080fd5b5061056f611623565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156105b2578082015181840152602081019050610597565b505050509050019250505060405180910390f35b3480156105d257600080fd5b5061061360048036038101908080359060200190929190803590602001909291908035151590602001909291908035151590602001909291905050506116b1565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b8381101561065657808201518184015260208101905061063b565b505050509050019250505060405180910390f35b34801561067657600080fd5b5061069560048036038101908080359060200190929190505050611835565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156106d85780820151818401526020810190506106bd565b505050509050019250505060405180910390f35b3480156106f857600080fd5b50610701611a72565b6040518082815260200191505060405180910390f35b34801561072357600080fd5b5061074260048036038101908080359060200190929190505050611a78565b005b34801561075057600080fd5b50610759611b50565b6040518082815260200191505060405180910390f35b34801561077b57600080fd5b50610800600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611b56565b6040518082815260200191505060405180910390f35b34801561082257600080fd5b5061082b611cad565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561087957600080fd5b50610882611cd2565b6040518082815260200191505060405180910390f35b3480156108a457600080fd5b506108ad611cd7565b6040518082815260200191505060405180910390f35b3480156108cf57600080fd5b50610924600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611cdd565b005b34801561093257600080fd5b5061095160048036038101908080359060200190929190505050612010565b005b34801561095f57600080fd5b506109686123e7565b005b60048181548110151561097957fe5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515610a0257600080fd5b81600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515610a5b57600080fd5b6000600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600091505b600160048054905003821015610be0578273ffffffffffffffffffffffffffffffffffffffff16600483815481101515610aee57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610bd3576004600160048054905003815481101515610b4c57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600483815481101515610b8657fe5b9060005260206000200160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610be0565b8180600101925050610ab8565b6001600481818054905003915081610bf891906126b9565b506004805490506005541115610c1757610c16600480549050611a78565b5b8273ffffffffffffffffffffffffffffffffffffffff167f8001553a916ef2f495d26a907cc54d96ed840d7bda71e73194bf5a9df7a76b9060405160405180910390a2505050565b60036020528060005260406000206000915054906101000a900460ff1681565b60026020528160005260406000206020528060005260406000206000915091509054906101000a900460ff1681565b600080600090505b600654811015610d3b57838015610cee57506001600082815260200190815260200160002060030160009054906101000a900460ff16155b80610d225750828015610d2157506001600082815260200190815260200160002060030160009054906101000a900460ff165b5b15610d2e576001820191505b8080600101915050610cb6565b5092915050565b600030905090565b600033600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515610da557600080fd5b8360006001600083815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151515610e0257600080fd5b84336002600083815260200190815260200160002060008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151515610e6e57600080fd5b600094505b60048054905085101561100b57600260008881526020019081526020016000206000600487815481101515610ea457fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515610ffe573373ffffffffffffffffffffffffffffffffffffffff16600486815481101515610f4357fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610ff9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f6e656564206279206f726465722e00000000000000000000000000000000000081525060200191505060405180910390fd5b61100b565b8480600101955050610e73565b60008673ffffffffffffffffffffffffffffffffffffffff1611801561107b5750600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16155b1561109c576110898661115b565b6005600081548092919060010191905055505b60016002600089815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550863373ffffffffffffffffffffffffffffffffffffffff167f4a504a94899432a9846e1aa406dceb1bcfd538bb839071d49d1e5e23f5be30ef60405160405180910390a361115287612010565b50505050505050565b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615156111b357600080fd5b80600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151561120d57600080fd5b8160008173ffffffffffffffffffffffffffffffffffffffff161415151561123457600080fd5b600160048054905001600554603282111580156112515750818111155b801561125e575060008114155b801561126b575060008214155b151561127657600080fd5b6001600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555060048590806001815401808255809150509060018203906000526020600020016000909192909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550508473ffffffffffffffffffffffffffffffffffffffff167ff39e6e1eb0edcf53c221607b54b00cd28f3196fed0a24994dc308b8f611b682d60405160405180910390a25050505050565b6000806000809150600090505b60048054905081101561145b576002600085815260200190815260200160002060006004838154811015156113bc57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161561143b576001820191505b60055482141561144e576001925061145c565b808060010191505061138b565b5b5050919050565b600080600090505b6004805490508110156115285760026000848152602001908152602001600020600060048381548110151561149c57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161561151b576001820191505b808060010191505061146b565b50919050565b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806001015490806002018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156116065780601f106115db57610100808354040283529160200191611606565b820191906000526020600020905b8154815290600101906020018083116115e957829003601f168201915b5050505050908060030160009054906101000a900460ff16905084565b606060048054806020026020016040519081016040528092919081815260200182805480156116a757602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001906001019080831161165d575b5050505050905090565b6060806000806006546040519080825280602002602001820160405280156116e85781602001602082028038833980820191505090505b50925060009150600654871015156117005760065496505b600090505b6006548110156117a75785801561173d57506001600082815260200190815260200160002060030160009054906101000a900460ff16155b80611771575084801561177057506001600082815260200190815260200160002060030160009054906101000a900460ff165b5b1561179a5780838381518110151561178557fe5b90602001906020020181815250506001820191505b8080600101915050611705565b8787036040519080825280602002602001820160405280156117d85781602001602082028038833980820191505090505b5093508790505b8681101561182a5782818151811015156117f557fe5b906020019060200201518489830381518110151561180f57fe5b906020019060200201818152505080806001019150506117df565b505050949350505050565b60608060008060048054905060405190808252806020026020018201604052801561186f5781602001602082028038833980820191505090505b50925060009150600090505b6004805490508110156119bc576002600086815260200190815260200160002060006004838154811015156118ac57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16156119af5760048181548110151561193357fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16838381518110151561196c57fe5b9060200190602002019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250506001820191505b808060010191505061187b565b816040519080825280602002602001820160405280156119eb5781602001602082028038833980820191505090505b509350600090505b81811015611a6a578281815181101515611a0957fe5b906020019060200201518482815181101515611a2157fe5b9060200190602002019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505080806001019150506119f3565b505050919050565b60065481565b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515611ad057600080fd5b6004805490508160328211158015611ae85750818111155b8015611af5575060008114155b8015611b02575060008214155b1515611b0d57600080fd5b826005819055507fa3f1ee9126a074d9326c682f561767f710e927faa811f7a99829d49dc421797a836040518082815260200191505060405180910390a1505050565b60075481565b600033600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515611bb157600080fd5b611bbc85858561253f565b9150611bc9826000610d4a565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663475a9fa930866040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b158015611c8d57600080fd5b505af1158015611ca1573d6000803e3d6000fd5b50505050509392505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b603281565b60055481565b6000600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515611d3757600080fd5b82600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515611d9057600080fd5b82600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151515611dea57600080fd5b600092505b600480549050831015611ed3578473ffffffffffffffffffffffffffffffffffffffff16600484815481101515611e2257fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611ec65783600484815481101515611e7957fe5b9060005260206000200160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550611ed3565b8280600101935050611def565b6000600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506001600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508473ffffffffffffffffffffffffffffffffffffffff167f8001553a916ef2f495d26a907cc54d96ed840d7bda71e73194bf5a9df7a76b9060405160405180910390a28373ffffffffffffffffffffffffffffffffffffffff167ff39e6e1eb0edcf53c221607b54b00cd28f3196fed0a24994dc308b8f611b682d60405160405180910390a25050505050565b600033600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561206b57600080fd5b82336002600083815260200190815260200160002060008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615156120d657600080fd5b846001600082815260200190815260200160002060030160009054906101000a900460ff1615151561210757600080fd5b6121108661137e565b156123df5760016000878152602001908152602001600020945060018560030160006101000a81548160ff02191690831515021790555061222c8560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600087600201805460018160011615610100020316600290049050886002018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156122225780601f106121f757610100808354040283529160200191612222565b820191906000526020600020905b81548152906001019060200180831161220557829003601f168201915b5050505050612692565b15612393576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8660000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1687600101546040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b15801561231d57600080fd5b505af1158015612331573d6000803e3d6000fd5b505050506040513d602081101561234757600080fd5b810190808051906020019092919050505050857f33e13ecb54c3076d8e8bb8c2881800a4d972b792045ffae98fdf46df365fed7560405160405180910390a260016007819055506123de565b857f526441bb6c1aba3c9a4a6ca1d6545da9c2333c8c48343ef398eb858d72b7923660405160405180910390a260008560030160006101000a81548160ff0219169083151502179055505b5b505050505050565b60008033600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561244357600080fd5b60009250600091505b60065482101561247e57600160008381526020019081526020016000206001015483019250818060010192505061244c565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166342966c68846040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b15801561250e57600080fd5b505af1158015612522573d6000803e3d6000fd5b505050503073ffffffffffffffffffffffffffffffffffffffff16ff5b60008360008173ffffffffffffffffffffffffffffffffffffffff161415151561256857600080fd5b60065491506080604051908101604052808673ffffffffffffffffffffffffffffffffffffffff168152602001858152602001848152602001600015158152506001600084815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506020820151816001015560408201518160020190805190602001906126289291906126e5565b5060608201518160030160006101000a81548160ff0219169083151502179055509050506001600660008282540192505081905550817fc0ba8fe4b176c1714197d43b9cc6bcf797a4a7461c5fe8d0ef6e184ae7601e5160405160405180910390a2509392505050565b6000806040516020840160008287838a8c6187965a03f19250505080915050949350505050565b8154818355818111156126e0578183600052602060002091820191016126df9190612765565b5b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061272657805160ff1916838001178555612754565b82800160010185558215612754579182015b82811115612753578251825591602001919060010190612738565b5b5090506127619190612765565b5090565b61278791905b8082111561278357600081600090555060010161276b565b5090565b905600a165627a7a7230582043e162e3c785d59f30e1f927aeea936ab93e4536481c3f2452dac4d6767e67740029";

    static deployContract = async (coordinator: User, nextUserId: number, faceRequest: FaceRequest) => {
        try {
            const web3 = new Web3(Config.get("INFURA_PROJECT_URL", 'https://ropsten.infura.io/v3/015647b81e8d46c3a0e68bc0279641c7'));
            let contract = new web3.eth.Contract(MultisignatureContract.ABI);

            const userWallet = await UserRepository.findWalletById(coordinator.id);
            const nextWallet = await UserRepository.findWalletById(nextUserId);
            if (userWallet===null || nextWallet===null) {
                throw new Error('Coordinator does\'t have wallet');
            }
            let nonce = await web3.eth.getTransactionCount(userWallet.address, "pending");
            let nonceHex = web3.utils.toHex(nonce);
            let contractData = contract.deploy({
                data: MultisignatureContract.byteCode,
                arguments: [
                    Config.get("DIGICUS_ADDRESS", "0x34e03064f017f9b5a903807a28e9aa72f41b8920"), 
                    [ userWallet.address, nextWallet.address], 
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
            return web3.eth.sendSignedTransaction('0x' + serializedTx.toString("hex")).on('transactionHash', function(hash){
                // set into request contracts
                console.log("HASH", hash);
                FaceRequestContractRepository.setRequestContract(faceRequest.id, hash);
              });
        } catch (error) {
            console.log(error);
        }
    }
}

export default MultisignatureContract;
let web3;
let contract;
let account;

// ABI iš Truffle build
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "student",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "employer",
          "type": "address"
        }
      ],
      "name": "AccessGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "student",
          "type": "address"
        }
      ],
      "name": "DiplomaIssued",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "student",
          "type": "address"
        }
      ],
      "name": "DiplomaRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "student",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "course",
          "type": "string"
        }
      ],
      "name": "GradeSubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "student",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "university",
          "type": "address"
        }
      ],
      "name": "StudentEnrolled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "university",
          "type": "address"
        }
      ],
      "name": "UniversityRegistered",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "accessPermissions",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "diplomas",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isValid",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "university",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "issueDate",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "grades",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "students",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isEnrolled",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "university",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "totalCredits",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "hasDiploma",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "universities",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isRegistered",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "registerUniversity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_student",
          "type": "address"
        }
      ],
      "name": "enrollStudent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_student",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_course",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_credits",
          "type": "uint256"
        }
      ],
      "name": "submitGrade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_student",
          "type": "address"
        }
      ],
      "name": "issueDiploma",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_employer",
          "type": "address"
        }
      ],
      "name": "grantAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_student",
          "type": "address"
        }
      ],
      "name": "verifyDiploma",
      "outputs": [
        {
          "internalType": "bool",
          "name": "valid",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "university",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "issueDate",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_student",
          "type": "address"
        }
      ],
      "name": "revokeDiploma",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
const contractAddress = "0xB2061de97432Ae887c4A9E44876973db4f7E8810"; // deployed contract address

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);

        document.getElementById('connectWallet').onclick = async () => {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            document.getElementById('account').innerText = "Connected: " + account;

            contract = new web3.eth.Contract(contractABI, contractAddress);
        };
    } else {
        alert("MetaMask not detected!");
    }

    // Register university
    document.getElementById('registerUniversity').onclick = async () => {
        const name = document.getElementById('uniName').value;
        await contract.methods.registerUniversity(name).send({ from: account });
        alert("University registered!");
    };

    // Enroll student
    document.getElementById('enrollStudent').onclick = async () => {
        const student = document.getElementById('studentAddress').value;
        await contract.methods.enrollStudent(student).send({ from: account });
        alert("Student enrolled!");
    };

    // Verify diploma
    document.getElementById('verifyDiploma').onclick = async () => {
        const student = document.getElementById('verifyAddress').value;
        try {
            const result = await contract.methods.verifyDiploma(student).call({ from: account });
            document.getElementById('verificationResult').innerText = 
                `Valid: ${result.valid}, University: ${result.university}, Issued: ${new Date(result.issueDate*1000)}`;
        } catch(err) {
            alert("Access denied or invalid student");
        }
    };
});

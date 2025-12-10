let web3;
let contract;
let account;

const contractAddress = "0xB2061de97432Ae887c4A9E44876973db4f7E8810"; 

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

    async function init() {
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
        document.getElementById('account').innerText = "Connected: " + account;
        contract = new web3.eth.Contract(contractABI, contractAddress);
        subscribeEvents();
      } else {
        alert("MetaMask not detected!");
      }
    }

    async function registerUniversity() {
      const name = document.getElementById("uniName").value;
      try {
        const tx = await contract.methods.registerUniversity(name).send({ from: account });
        console.log("University registered:", tx);
        alert("University registered! Check Etherscan for tx: " + tx.transactionHash);
      } catch (err) {
        console.error(err);
      }
    }

    async function enrollStudent() {
      const student = document.getElementById("studentAddress").value;
      try {
        const tx = await contract.methods.enrollStudent(student).send({ from: account });
        console.log("Student enrolled:", tx);
        alert("Student enrolled! Check Etherscan for tx: " + tx.transactionHash);
      } catch (err) {
        console.error(err);
      }
    }

    async function issueDiploma() {
      const student = document.getElementById("studentDiploma").value;
      try {
        const tx = await contract.methods.issueDiploma(student).send({ from: account });
        console.log("Diploma issued:", tx);
        alert("Diploma issued! Check Etherscan for tx: " + tx.transactionHash);
      } catch (err) {
        console.error(err);
      }
    }

    async function verifyDiploma() {
      const student = document.getElementById("verifyStudent").value;
      try {
        const result = await contract.methods.verifyDiploma(student).call({ from: account });
        document.getElementById("verifyResult").innerText =
          `Valid: ${result.valid}\nUniversity: ${result.university}\nIssued: ${new Date(result.issueDate * 1000)}`;
      } catch (err) {
        console.error(err);
        document.getElementById("verifyResult").innerText = "Error: " + err.message;
      }
    }

    function subscribeEvents() {
      contract.events.allEvents({ fromBlock: 0 })
      .on('data', event => {
        const logs = document.getElementById("eventLogs");
        logs.textContent += JSON.stringify(event, null, 2) + "\n";
      })
      .on('error', console.error);
    }

    window.addEventListener('load', init);
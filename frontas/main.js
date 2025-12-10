let web3;
let contract;
let account;

const contractAddress = "0x3966325230b48b195AD2E0B49279e714D313b2de"; 

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
  if (!window.ethereum) {
    alert("MetaMask not detected!");
    return;
  }

  web3 = new Web3(window.ethereum);
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0];

  contract = new web3.eth.Contract(contractABI, contractAddress);

  document.getElementById("account").innerText = account;
  updateBalance();
  detectRole();
}

async function updateBalance() {
  const balWei = await web3.eth.getBalance(account);
  const balEth = web3.utils.fromWei(balWei, "ether");
  document.getElementById("balance").innerText = Number(balEth).toFixed(4);
}

async function detectRole() {
  let role = "Unregistered User";
  let isUniversity = false;
  let isStudent = false;

  const uni = await contract.methods.universities(account).call();
  if (uni.isRegistered) {
    role = "University";
    isUniversity = true;
  }

  const student = await contract.methods.students(account).call();
  if (student.isEnrolled) {
    role = "Student";
    isStudent = true;
  }

  // Show role
  const badge = document.getElementById("roleBadge");
  badge.style.display = "inline-block";
  badge.innerText = role;

  // Adjust permissions
  document.getElementById("btnRegister").disabled = !(!isUniversity);
  document.getElementById("btnEnroll").disabled = !isUniversity;
  document.getElementById("btnIssue").disabled = !isUniversity;
}

function logEvent(msg) {
  const el = document.getElementById("eventLogs");
  el.textContent += msg + "\n";
  el.scrollTop = el.scrollHeight;
}

// CONTRACT CALLS

async function registerUniversity() {
  const name = document.getElementById("uniName").value;

  const tx = await contract.methods
    .registerUniversity(name)
    .send({ from: account });

  logEvent("UniversityRegistered tx: " + tx.transactionHash);
  detectRole();
}

async function enrollStudent() {
  const student = document.getElementById("studentAddress").value;

  const tx = await contract.methods
    .enrollStudent(student)
    .send({ from: account });

  logEvent("StudentEnrolled tx: " + tx.transactionHash);
}

async function issueDiploma() {
  const student = document.getElementById("studentDiploma").value;

  const tx = await contract.methods
    .issueDiploma(student)
    .send({ from: account });

  logEvent("DiplomaIssued tx: " + tx.transactionHash);
}

async function verifyDiploma() {
  const student = document.getElementById("verifyStudent").value;

  try {
    const d = await contract.methods
      .verifyDiploma(student)
      .call({ from: account });

    document.getElementById("verifyResult").textContent =
      `Valid: ${d.valid}\nUniversity: ${d.university}\nDate: ${new Date(d.issueDate * 1000).toLocaleString()}`;

  } catch (err) {
    document.getElementById("verifyResult").textContent = "ACCESS DENIED";
  }
}

window.addEventListener("load", init);
let web3;
let contract;
let currentAccount = null;

const contractAddress = "0xF0b206ca4A37304E0649A1D6f2bd3299FEC405A5";

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
          "internalType": "bytes32",
          "name": "courseHash",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "credits",
          "type": "uint256"
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
          "name": "lecturer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "university",
          "type": "address"
        }
      ],
      "name": "LecturerAdded",
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
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
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
        },
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "courseCredits",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
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
        },
        {
          "internalType": "bytes32",
          "name": "diplomaHash",
          "type": "bytes32"
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
      "name": "lecturers",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "university",
          "type": "address"
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
          "internalType": "address",
          "name": "_university",
          "type": "address"
        },
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
          "name": "_lecturer",
          "type": "address"
        }
      ],
      "name": "addLecturer",
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
          "internalType": "bytes32",
          "name": "_courseHash",
          "type": "bytes32"
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
        },
        {
          "internalType": "bytes32",
          "name": "_diplomaHash",
          "type": "bytes32"
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
        },
        {
          "internalType": "bytes32",
          "name": "diplomaHash",
          "type": "bytes32"
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

function setStatus(msg) {
  document.getElementById("status").innerText = "Status: " + msg;
}

async function connectWallet() {
  if (!window.ethereum) return alert("MetaMask not detected");

  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  currentAccount = accounts[0];

  web3 = new Web3(window.ethereum);
  contract = new web3.eth.Contract(contractABI, contractAddress);

  const bal = await web3.eth.getBalance(currentAccount);
  walletInfo.innerText =
    `Wallet: ${currentAccount}\nBalance: ${web3.utils.fromWei(bal)} ETH`;

  setStatus("Connected");
  updateRoleUI();
  subscribeEvents();
}

/* ========== ROLE DETECTION ========== */

async function updateRoleUI() {
  [
    sectionAdmin,
    sectionUniversity,
    sectionLecturer,
    sectionStudent,
    sectionEmployer
  ].forEach(s => s.style.display = "none");

  const roleEl = document.getElementById("role");

  // ADMIN
  const owner = await contract.methods.owner().call();
  if (currentAccount.toLowerCase() === owner.toLowerCase()) {
    roleEl.textContent = "Role: Admin";
    sectionAdmin.style.display = "block";
    return;
  }

  // UNIVERSITY
  const uni = await contract.methods.universities(currentAccount).call();
  if (uni.isRegistered) {
    roleEl.textContent = `Role: University – ${uni.name}`;
    sectionUniversity.style.display = "block";
    return;
  }

  // LECTURER
  const lecturer = await contract.methods.lecturers(currentAccount).call();
  if (lecturer.isActive) {
    const uniInfo = await contract.methods.universities(lecturer.university).call();
    roleEl.textContent = `Role: Lecturer – ${uniInfo.name}`;
    sectionLecturer.style.display = "block";
    return;
  }

  // STUDENT
  const student = await contract.methods.students(currentAccount).call();
  if (student.isEnrolled) {
    const uniInfo = await contract.methods.universities(student.university).call();
    roleEl.textContent = `Role: Student – ${uniInfo.name}`;
    sectionStudent.style.display = "block";
    await loadStudentStatus();
    return;
  }

  // EMPLOYER / GUEST
  roleEl.textContent = "Role: Employer / Guest";
  sectionEmployer.style.display = "block";
}

async function loadStudentStatus() {
  const s = await contract.methods.students(currentAccount).call();

  const statusEl = document.getElementById("studentStatus");

  if (!s.isEnrolled) {
    statusEl.textContent = "❌ You are not enrolled.";
    return;
  }

  if (s.hasDiploma) {
    statusEl.textContent = "🎓 Diploma status: ISSUED";
    statusEl.style.color = "#22c55e";
  } else {
    statusEl.textContent = `📘 Diploma status: NOT ISSUED (Credits: ${s.totalCredits}/180)`;
    statusEl.style.color = "#facc15";
  }
}


/* ========== EVENTS (CLEAN LOGS) ========== */

function subscribeEvents() {
  const log = document.getElementById("eventLogs");
  log.textContent = "";

  contract.events.allEvents({ fromBlock: "latest" })
    .on("data", e => {
      let msg = `[${e.event}] `;
      const r = e.returnValues;

      if (r.student) msg += `student=${r.student} `;
      if (r.university) msg += `university=${r.university} `;
      if (r.employer) msg += `employer=${r.employer}`;

      log.textContent += msg + "\n";
    });
}


/* ========== ADMIN ========== */

async function onAdminRegisterUniversity() {
  await contract.methods
    .registerUniversity(adminUniversityAddress.value, adminUniversityName.value)
    .send({ from: currentAccount });

  alert("University registered");
}

/* ========== UNIVERSITY ========== */

async function onAddLecturer() {
  await contract.methods
    .addLecturer(lecturerAddress.value)
    .send({ from: currentAccount });

  alert("Lecturer added");
}

async function onEnrollStudent() {
  await contract.methods
    .enrollStudent(studentAddress.value)
    .send({ from: currentAccount });

  alert("Student enrolled");
}

async function onIssueDiploma() {
  const hash = web3.utils.keccak256(diplomaHash.value);
  await contract.methods
    .issueDiploma(issueStudent.value, hash)
    .send({ from: currentAccount });

  alert("Diploma issued");
}

async function onRevokeDiploma() {
  await contract.methods
    .revokeDiploma(revokeStudent.value)
    .send({ from: currentAccount });

  alert("Diploma revoked");
}

/* ========== LECTURER ========== */

async function onSubmitGrade() {
  const courseHash = web3.utils.keccak256(courseName.value);

  await contract.methods
    .submitGrade(
      gradeStudent.value,
      courseHash,
      Number(courseCredits.value)
    )
    .send({ from: currentAccount });

  alert("Grade submitted");
}

/* ========== STUDENT ========== */

async function onGrantAccess() {
  await contract.methods
    .grantAccess(employerAddress.value)
    .send({ from: currentAccount });

  alert("Access granted");
}

/* ========== EMPLOYER ========== */

async function onVerifyDiploma() {
  const r = await contract.methods
    .verifyDiploma(verifyStudent.value)
    .call({ from: currentAccount });

  verifyResult.textContent =
    `Valid: ${r.valid}\n` +
    `University: ${r.university}\n` +
    `Issued: ${new Date(r.issueDate * 1000).toLocaleString()}\n` +
    `Diploma hash: ${r.diplomaHash}`;
}

/* ========== BINDINGS ========== */

window.onload = () => {
  btnConnect.onclick = connectWallet;

  btnAdminRegisterUniversity.onclick = onAdminRegisterUniversity;

  btnAddLecturer.onclick = onAddLecturer;
  btnEnrollStudent.onclick = onEnrollStudent;
  btnIssueDiploma.onclick = onIssueDiploma;
  btnRevokeDiploma.onclick = onRevokeDiploma;

  btnSubmitGrade.onclick = onSubmitGrade;

  btnGrantAccess.onclick = onGrantAccess;
  btnVerifyDiploma.onclick = onVerifyDiploma;

};
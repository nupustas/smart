let web3;
let contract;
let currentAccount = null;

const contractAddress = "0x3966325230b48b195AD2E0B49279e714D313b2de";

const contractABI = [ /* your ABI, unchanged */ 
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "address", "name": "student", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "employer", "type": "address" }
    ],
    "name": "AccessGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": false, "internalType": "address", "name": "student", "type": "address" }],
    "name": "DiplomaIssued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": false, "internalType": "address", "name": "student", "type": "address" }],
    "name": "DiplomaRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "address", "name": "student", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "course", "type": "string" }
    ],
    "name": "GradeSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "address", "name": "student", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "university", "type": "address" }
    ],
    "name": "StudentEnrolled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": false, "internalType": "address", "name": "university", "type": "address" }],
    "name": "UniversityRegistered",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "accessPermissions",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "diplomas",
    "outputs": [
      { "internalType": "bool", "name": "isValid", "type": "bool" },
      { "internalType": "address", "name": "university", "type": "address" },
      { "internalType": "uint256", "name": "issueDate", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "name": "grades",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "students",
    "outputs": [
      { "internalType": "bool", "name": "isEnrolled", "type": "bool" },
      { "internalType": "address", "name": "university", "type": "address" },
      { "internalType": "uint256", "name": "totalCredits", "type": "uint256" },
      { "internalType": "bool", "name": "hasDiploma", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "universities",
    "outputs": [
      { "internalType": "bool", "name": "isRegistered", "type": "bool" },
      { "internalType": "string", "name": "name", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }],
    "name": "registerUniversity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_student", "type": "address" }],
    "name": "enrollStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_student", "type": "address" },
      { "internalType": "string", "name": "_course", "type": "string" },
      { "internalType": "uint256", "name": "_credits", "type": "uint256" }
    ],
    "name": "submitGrade",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_student", "type": "address" }],
    "name": "issueDiploma",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_employer", "type": "address" }],
    "name": "grantAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_student", "type": "address" }],
    "name": "verifyDiploma",
    "outputs": [
      { "internalType": "bool", "name": "valid", "type": "bool" },
      { "internalType": "address", "name": "university", "type": "address" },
      { "internalType": "uint256", "name": "issueDate", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [{ "internalType": "address", "name": "_student", "type": "address" }],
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
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    currentAccount = accounts[0] || null;
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);

    if (currentAccount) {
      const balanceWei = await web3.eth.getBalance(currentAccount);
      const balanceEth = web3.utils.fromWei(balanceWei, "ether");

      document.getElementById("walletInfo").innerText =
        `Wallet: ${currentAccount}\nBalance: ${Number(balanceEth).toFixed(4)} ETH`;
      setStatus("Connected to MetaMask (Sepolia).");
    } else {
      document.getElementById("walletInfo").innerText = "Wallet: -\nBalance: -";
      setStatus("No account selected.");
    }

    updateRoleUI();
    subscribeEvents();
  } catch (err) {
    console.error(err);
    setStatus("Failed to connect wallet.");
  }
}

function subscribeEvents() {
  if (!contract) return;
  const logsEl = document.getElementById("eventLogs");
  logsEl.textContent = "";

  contract.events
    .allEvents({ fromBlock: "latest" })
    .on("data", (event) => {
      logsEl.textContent += JSON.stringify(event, null, 2) + "\n\n";
    })
    .on("error", (err) => {
      console.error("Event error:", err);
    });
}

// --- Button handlers ---

async function onRegisterUniversity() {
  const name = document.getElementById("uniName").value.trim();
  if (!name) return alert("Enter university name");
  try {
    setStatus("Sending transaction: registerUniversity...");
    const tx = await contract.methods.registerUniversity(name).send({ from: currentAccount });
    alert("University registered! Tx: " + tx.transactionHash);
    setStatus("University registered.");
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
    setStatus("registerUniversity failed.");
  }
}

async function onEnrollStudent() {
  const student = document.getElementById("studentAddress").value.trim();
  if (!web3.utils.isAddress(student)) return alert("Invalid student address");
  try {
    setStatus("Sending transaction: enrollStudent...");
    const tx = await contract.methods.enrollStudent(student).send({ from: currentAccount });
    alert("Student enrolled! Tx: " + tx.transactionHash);
    setStatus("Student enrolled.");
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
    setStatus("enrollStudent failed.");
  }
}

async function onSubmitGrade() {
  const student = document.getElementById("gradeStudent").value.trim();
  const course = document.getElementById("courseName").value.trim();
  const credits = document.getElementById("courseCredits").value.trim();

  if (!web3.utils.isAddress(student)) return alert("Invalid student address");
  if (!course) return alert("Enter course name");
  if (!credits || Number(credits) <= 0) return alert("Enter valid credits");

  try {
    setStatus("Sending transaction: submitGrade...");
    const tx = await contract.methods
      .submitGrade(student, course, Number(credits))
      .send({ from: currentAccount });
    alert("Grade submitted! Tx: " + tx.transactionHash);
    setStatus("Grade submitted.");
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
    setStatus("submitGrade failed.");
  }
}

async function onIssueDiploma() {
  const student = document.getElementById("issueStudent").value.trim();
  if (!web3.utils.isAddress(student)) return alert("Invalid student address");
  try {
    setStatus("Sending transaction: issueDiploma...");
    const tx = await contract.methods.issueDiploma(student).send({ from: currentAccount });
    alert("Diploma issued! Tx: " + tx.transactionHash);
    setStatus("Diploma issued.");
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
    setStatus("issueDiploma failed.");
  }
}

async function onRevokeDiploma() {
  const student = document.getElementById("revokeStudent").value.trim();
  if (!web3.utils.isAddress(student)) return alert("Invalid student address");
  try {
    setStatus("Sending transaction: revokeDiploma...");
    const tx = await contract.methods.revokeDiploma(student).send({ from: currentAccount });
    alert("Diploma revoked! Tx: " + tx.transactionHash);
    setStatus("Diploma revoked.");
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
    setStatus("revokeDiploma failed.");
  }
}

async function onGrantAccess() {
  const employer = document.getElementById("employerAddress").value.trim();
  if (!web3.utils.isAddress(employer)) return alert("Invalid employer address");
  try {
    setStatus("Sending transaction: grantAccess...");
    const tx = await contract.methods.grantAccess(employer).send({ from: currentAccount });
    alert("Access granted! Tx: " + tx.transactionHash);
    setStatus("Access granted.");
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
    setStatus("grantAccess failed.");
  }
}

async function onVerifyDiploma() {
  const student = document.getElementById("verifyStudent").value.trim();
  if (!web3.utils.isAddress(student)) return alert("Invalid student address");
  try {
    setStatus("Calling: verifyDiploma...");
    const result = await contract.methods.verifyDiploma(student).call({ from: currentAccount });
    const text =
      `valid: ${result.valid}\n` +
      `university: ${result.university}\n` +
      `issueDate (unix): ${result.issueDate}\n` +
      `issueDate (human): ${new Date(Number(result.issueDate) * 1000).toLocaleString()}`;
    document.getElementById("verifyResult").textContent = text;
    setStatus("verifyDiploma OK.");
  } catch (err) {
    console.error(err);
    document.getElementById("verifyResult").textContent = "Error: " + err.message;
    setStatus("verifyDiploma failed (likely access not granted).");
  }
}

async function onLoadStudentInfo() {
  const student = document.getElementById("infoStudent").value.trim();
  if (!web3.utils.isAddress(student)) return alert("Invalid student address");
  try {
    setStatus("Reading: students mapping...");
    const s = await contract.methods.students(student).call();
    const text =
      `isEnrolled: ${s.isEnrolled}\n` +
      `university: ${s.university}\n` +
      `totalCredits: ${s.totalCredits}\n` +
      `hasDiploma: ${s.hasDiploma}`;
    document.getElementById("studentInfo").textContent = text;
    setStatus("Student info loaded.");
  } catch (err) {
    console.error(err);
    document.getElementById("studentInfo").textContent = "Error: " + err.message;
    setStatus("load student info failed.");
  }
}

// --- ROLES ---

const UNIVERSITY_ADDR = "0x467C0e375F746aECA61C3B1C268770aDc838A2Fb".toLowerCase();
const STUDENT_ADDR    = "0xA4c29A4F14E93d18303Fe64b7ea9A3597CAd5c14".toLowerCase();
const EMPLOYER_ADDR   = "0xC33467Ab22C720EB0604F0B225145ab543E7A1B9".toLowerCase();

function updateRoleUI() {
  const roleEl = document.getElementById("role");

  const uniSection = document.getElementById("sectionUniversity");
  const stuSection = document.getElementById("sectionStudent");
  const empSection = document.getElementById("sectionEmployer");

  // hide all
  uniSection.style.display = "none";
  stuSection.style.display = "none";
  empSection.style.display = "none";

  const acc = currentAccount?.toLowerCase();
  if (!acc) {
    roleEl.textContent = "Role: -";
    return;
  }

  if (acc === UNIVERSITY_ADDR) {
    roleEl.textContent = "Role: University";
    uniSection.style.display = "block";
  } else if (acc === STUDENT_ADDR) {
    roleEl.textContent = "Role: Student";
    stuSection.style.display = "block";
  } else if (acc === EMPLOYER_ADDR) {
    roleEl.textContent = "Role: Employer";
    empSection.style.display = "block";
  } else {
    roleEl.textContent = "Role: (Not registered role)";
  }
}

// --- Setup ---

window.addEventListener("load", () => {
  document.getElementById("btnConnect").addEventListener("click", connectWallet);
  document.getElementById("btnRegisterUniversity").addEventListener("click", onRegisterUniversity);
  document.getElementById("btnEnrollStudent").addEventListener("click", onEnrollStudent);
  document.getElementById("btnSubmitGrade").addEventListener("click", onSubmitGrade);
  document.getElementById("btnIssueDiploma").addEventListener("click", onIssueDiploma);
  document.getElementById("btnRevokeDiploma").addEventListener("click", onRevokeDiploma);
  document.getElementById("btnGrantAccess").addEventListener("click", onGrantAccess);
  document.getElementById("btnVerifyDiploma").addEventListener("click", onVerifyDiploma);
  document.getElementById("btnLoadStudent").addEventListener("click", onLoadStudentInfo);

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", async (accounts) => {
      currentAccount = accounts[0] || null;
      if (!currentAccount) {
        document.getElementById("walletInfo").innerText = "Wallet: -\nBalance: -";
        setStatus("No account selected.");
        updateRoleUI();
        return;
      }
      if (!web3) web3 = new Web3(window.ethereum);
      const balanceWei = await web3.eth.getBalance(currentAccount);
      const balanceEth = web3.utils.fromWei(balanceWei, "ether");
      document.getElementById("walletInfo").innerText =
        `Wallet: ${currentAccount}\nBalance: ${Number(balanceEth).toFixed(4)} ETH`;
      setStatus("Account changed.");
      updateRoleUI();
    });
  }
});

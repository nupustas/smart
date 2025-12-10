const Diploma = artifacts.require("DiplomaVerification");

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function safeCall(fn, retry = 5) {
  while (retry > 0) {
    try {
      return await fn();
    } catch (err) {
      if (String(err.message).includes("rate") || err.code === -32029) {
        console.log(` RPC rate limited, retrying... (${retry})`);
        await delay(1500);
        retry--;
      } else {
        throw err;
      }
    }
  }
  throw new Error("RPC limit exceeded repeatedly");
}

module.exports = async function (callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const [owner, student, employer] = accounts;

    const logBalance = async (addr, label) => {
      const balance = await safeCall(() => web3.eth.getBalance(addr));
      console.log(`${label}: ${web3.utils.fromWei(balance, "ether")} ETH`);
      await delay(300);
    };

    console.log("Deploying DiplomaVerification contract...");
    const contract = await Diploma.new({ from: owner, gas: 5000000 });
    console.log("Contract deployed at:", contract.address);

    await logBalance(owner, "Owner balance");

    console.log("\n--- TEST 1: Register University ---");
    let tx = await safeCall(() => contract.registerUniversity("My University", { from: owner }));
    console.log("UniversityRegistered tx:", tx.tx);
    console.log("Etherscan link: https://sepolia.etherscan.io/tx/" + tx.tx);

    console.log("\n--- TEST 2: Enroll Student ---");
    tx = await safeCall(() => contract.enrollStudent(student, { from: owner }));
    console.log("StudentEnrolled tx:", tx.tx);
    console.log("Etherscan link: https://sepolia.etherscan.io/tx/" + tx.tx);

    console.log("\n--- TEST 3: Submit Grades ---");
    const courses = [
      { name: "Blockchain 101", credits: 60 },
      { name: "Solidity 201", credits: 60 },
      { name: "DApps 301", credits: 60 },
    ];

    for (let c of courses) {
      tx = await safeCall(() => contract.submitGrade(student, c.name, c.credits, { from: owner }));
      console.log(`GradeSubmitted tx for ${c.name}:`, tx.tx);
    }

    console.log("\n--- TEST 4: Issue Diploma ---");
    tx = await safeCall(() => contract.issueDiploma(student, { from: owner }));
    console.log("DiplomaIssued tx:", tx.tx);

    console.log("\n--- TEST 5: Grant Access to Employer ---");
    tx = await safeCall(() => contract.grantAccess(employer, { from: student }));
    console.log("AccessGranted tx:", tx.tx);

    console.log("\n--- TEST 6: Verify Diploma as Employer ---");
    const diploma = await safeCall(() => contract.verifyDiploma(student, { from: employer }));
    console.log("Verified Diploma:", diploma);

    console.log("\n--- TEST 7: Revoke Diploma ---");
    tx = await safeCall(() => contract.revokeDiploma(student, { from: owner }));
    console.log("DiplomaRevoked tx:", tx.tx);

    callback();
  } catch (err) {
    console.error("TEST FAILED:", err);
    callback(err);
  }
};

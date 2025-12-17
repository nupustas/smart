const Diploma = artifacts.require("DiplomaVerification");

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function safeCall(fn, retry = 5) {
  while (retry > 0) {
    try {
      return await fn();
    } catch (err) {
      if (String(err.message).includes("rate") || err.code === -32029) {
        console.log(`RPC rate limited, retrying... (${retry})`);
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

    // ROLE MAP
    const admin     = accounts[0]; // system owner
    const university = accounts[1];
    const lecturer  = accounts[2];
    const student   = accounts[3];
    const employer  = accounts[4];

    const contract = await Diploma.deployed();

    console.log("Contract address:", contract.address);

    const logBalance = async (addr, label) => {
      const bal = await web3.eth.getBalance(addr);
      console.log(`${label}: ${web3.utils.fromWei(bal, "ether")} ETH`);
      await delay(300);
    };

    await logBalance(admin, "Admin balance");
    await logBalance(university, "University balance");

    /* ================== TEST 1 ================== */
    console.log("\n--- TEST 1: Admin registers University ---");
    let tx = await safeCall(() =>
      contract.registerUniversity(university, "My University", {
        from: admin,
        gas: 300000
      })
    );
    console.log("UniversityRegistered:", tx.tx);

    /* ================== TEST 2 ================== */
    console.log("\n--- TEST 2: University adds Lecturer ---");
    tx = await safeCall(() =>
      contract.addLecturer(lecturer, {
        from: university,
        gas: 200000
      })
    );
    console.log("LecturerAdded:", tx.tx);

    /* ================== TEST 3 ================== */
    console.log("\n--- TEST 3: University enrolls Student ---");
    tx = await safeCall(() =>
      contract.enrollStudent(student, {
        from: university,
        gas: 200000
      })
    );
    console.log("StudentEnrolled:", tx.tx);

    /* ================== TEST 4 ================== */
    console.log("\n--- TEST 4: Lecturer submits Grades ---");

    const courses = [
      { name: "Blockchain 101", credits: 60 },
      { name: "Solidity 201", credits: 60 },
      { name: "DApps 301", credits: 60 }
    ];

    for (const c of courses) {
      const courseHash = web3.utils.keccak256(c.name);

      tx = await safeCall(() =>
        contract.submitGrade(
          student,
          courseHash,
          c.credits,
          {
            from: lecturer,
            gas: 300000
          }
        )
      );

      console.log(`GradeSubmitted (${c.name}):`, tx.tx);
      await delay(1000);
    }

    /* ================== TEST 5 ================== */
    console.log("\n--- TEST 5: University issues Diploma ---");

    const diplomaHash = web3.utils.keccak256(
      "Diploma PDF hash placeholder"
    );

    tx = await safeCall(() =>
      contract.issueDiploma(
        student,
        diplomaHash,
        {
          from: university,
          gas: 300000
        }
      )
    );
    console.log("DiplomaIssued:", tx.tx);

    /* ================== TEST 6 ================== */
    console.log("\n--- TEST 6: Student grants access to Employer ---");
    tx = await safeCall(() =>
      contract.grantAccess(employer, {
        from: student,
        gas: 150000
      })
    );
    console.log("AccessGranted:", tx.tx);

    /* ================== TEST 7 ================== */
    console.log("\n--- TEST 7: Employer verifies Diploma ---");
    const result = await safeCall(() =>
      contract.verifyDiploma.call(
        student,
        { from: employer }
      )
    );

    console.log("Verified Diploma:");
    console.log("  Valid:", result.valid);
    console.log("  University:", result.university);
    console.log("  Issue date:", new Date(result.issueDate * 1000).toISOString());
    console.log("  Diploma hash:", result.diplomaHash);

    /* ================== TEST 8 ================== */
    console.log("\n--- TEST 8: University revokes Diploma ---");
    tx = await safeCall(() =>
      contract.revokeDiploma(
        student,
        {
          from: university,
          gas: 200000
        }
      )
    );
    console.log("DiplomaRevoked:", tx.tx);

    callback();
  } catch (err) {
    console.error("TEST FAILED:", err);
    callback(err);
  }
};

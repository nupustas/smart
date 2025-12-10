const DiplomaVerification = artifacts.require("DiplomaVerification");

contract("DiplomaVerification", (accounts) => {
  const owner = accounts[0];
  const university = accounts[1];
  const student = accounts[2];
  const employer = accounts[3];

  let contractInstance;

  beforeEach(async () => {
    contractInstance = await DiplomaVerification.new({ from: owner });
  });

  it("Deploy and set owner correctly", async () => {
    const storedOwner = await contractInstance.owner();
    assert.equal(storedOwner, owner, "Owner was not set correctly");
  });

  it("Register a university", async () => {
    await contractInstance.registerUniversity("VU", { from: university });
    const uni = await contractInstance.universities(university);

    assert.equal(uni.isRegistered, true, "University not registered");
    assert.equal(uni.name, "VU", "University name incorrect");
  });

  it("Enroll a student", async () => {
    await contractInstance.registerUniversity("VU", { from: university });
    await contractInstance.enrollStudent(student, { from: university });

    const s = await contractInstance.students(student);

    assert.equal(s.isEnrolled, true, "Student not enrolled");
    assert.equal(s.university, university, "Wrong university assigned");
  });

  it("Submit a grade and increase credits", async () => {
    await contractInstance.registerUniversity("VU", { from: university });
    await contractInstance.enrollStudent(student, { from: university });

    await contractInstance.submitGrade(student, "Blockchain", 6, { from: university });

    const s = await contractInstance.students(student);
    const grade = await contractInstance.grades(student, "Blockchain");

    assert.equal(grade, true, "Grade not recorded");
    assert.equal(s.totalCredits.toNumber(), 6, "Credits not added");
  });

  it("Issue a diploma after 180 credits", async () => {
    await contractInstance.registerUniversity("VU", { from: university });
    await contractInstance.enrollStudent(student, { from: university });

    await contractInstance.submitGrade(student, "Course1", 100, { from: university });
    await contractInstance.submitGrade(student, "Course2", 80, { from: university });

    await contractInstance.issueDiploma(student, { from: university });

    const d = await contractInstance.diplomas(student);

    assert.equal(d.isValid, true, "Diploma not issued");
    assert.equal(d.university, university, "Wrong university in diploma");
  });

  it("Grant access to employer", async () => {
    await contractInstance.registerUniversity("VU", { from: university });
    await contractInstance.enrollStudent(student, { from: university });

    await contractInstance.submitGrade(student, "Course1", 180, { from: university });
    await contractInstance.issueDiploma(student, { from: university });

    await contractInstance.grantAccess(employer, { from: student });

    const access = await contractInstance.accessPermissions(student, employer);
    assert.equal(access, true, "Access not granted");
  });

  it("Employer can verify diploma", async () => {
    await contractInstance.registerUniversity("VU", { from: university });
    await contractInstance.enrollStudent(student, { from: university });

    await contractInstance.submitGrade(student, "Course1", 180, { from: university });
    await contractInstance.issueDiploma(student, { from: university });

    await contractInstance.grantAccess(employer, { from: student });

    const result = await contractInstance.verifyDiploma(student, { from: employer });

    assert.equal(result.valid, true, "Diploma invalid");
    assert.equal(result.university, university, "Wrong university");
  });

  it("University can revoke diploma", async () => {
    await contractInstance.registerUniversity("VU", { from: university });
    await contractInstance.enrollStudent(student, { from: university });

    await contractInstance.submitGrade(student, "Course1", 180, { from: university });
    await contractInstance.issueDiploma(student, { from: university });

    await contractInstance.revokeDiploma(student, { from: university });

    const d = await contractInstance.diplomas(student);
    assert.equal(d.isValid, false, "Diploma not revoked");
  });

  it("Should NOT allow issuing diploma without enough credits", async () => {
    await contractInstance.registerUniversity("VU", { from: university });
    await contractInstance.enrollStudent(student, { from: university });

    try {
      await contractInstance.issueDiploma(student, { from: university });
      assert.fail("Diploma issued without enough credits");
    } catch (error) {
      assert(error.message.includes("Not enough credits"));
    }
  });

  it("Should NOT allow employer to verify without access", async () => {
    await contractInstance.registerUniversity("VU", { from: university });
    await contractInstance.enrollStudent(student, { from: university });

    await contractInstance.submitGrade(student, "Course1", 180, { from: university });
    await contractInstance.issueDiploma(student, { from: university });

    try {
      await contractInstance.verifyDiploma(student, { from: employer });
      assert.fail("Verification allowed without access");
    } catch (error) {
      assert(error.message.includes("Access not granted"));
    }
  });
});

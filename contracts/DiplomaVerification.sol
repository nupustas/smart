// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DiplomaVerification {

    /* ================== SISTEMOS ADMINISTRATORIUS ================== */

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not system owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /* ================== STRUKTUROS ================== */

    struct University {
        bool isRegistered;
        string name;
    }

    struct Lecturer {
        bool isActive;
        address university;
    }

    struct Student {
        bool isEnrolled;
        address university;
        uint256 totalCredits;
        bool hasDiploma;
    }

    struct Diploma {
        bool isValid;
        address university;
        uint256 issueDate;
        bytes32 diplomaHash; // dokumento hash
    }

    /* ================== SAUGYKLOS ================== */

    mapping(address => University) public universities;
    mapping(address => Lecturer) public lecturers;
    mapping(address => Student) public students;

    mapping(address => mapping(bytes32 => uint256)) public courseCredits; 
    // student => courseHash => credits

    mapping(address => Diploma) public diplomas;
    mapping(address => mapping(address => bool)) public accessPermissions;
    // student => employer => access

    /* ================== IVYKIAI ================== */

    event UniversityRegistered(address university, string name);
    event LecturerAdded(address lecturer, address university);
    event StudentEnrolled(address student, address university);
    event GradeSubmitted(address student, bytes32 courseHash, uint256 credits);
    event DiplomaIssued(address student);
    event DiplomaRevoked(address student);
    event AccessGranted(address student, address employer);

    /* ================== 1. UNIVERSITETO REGISTRACIJA ================== */

    function registerUniversity(address _university, string memory _name)
        public
        onlyOwner
    {
        require(!universities[_university].isRegistered, "Already registered");

        universities[_university] = University({
            isRegistered: true,
            name: _name
        });

        emit UniversityRegistered(_university, _name);
    }

    /* ================== 2. DESTYTOJO PRISKYRIMAS ================== */

    function addLecturer(address _lecturer) public {
        require(universities[msg.sender].isRegistered, "Only university allowed");

        lecturers[_lecturer] = Lecturer({
            isActive: true,
            university: msg.sender
        });

        emit LecturerAdded(_lecturer, msg.sender);
    }

    /* ================== 3. STUDENTO REGISTRACIJA ================== */

    function enrollStudent(address _student) public {
        require(universities[msg.sender].isRegistered, "Only university allowed");
        require(!students[_student].isEnrolled, "Already enrolled");

        students[_student] = Student({
            isEnrolled: true,
            university: msg.sender,
            totalCredits: 0,
            hasDiploma: false
        });

        emit StudentEnrolled(_student, msg.sender);
    }

    /* ================== 4. PAZYMIU IVEDIMAS ================== */

    function submitGrade(
        address _student,
        bytes32 _courseHash,
        uint256 _credits
    ) public {
        Lecturer memory l = lecturers[msg.sender];

        require(l.isActive, "Not lecturer");
        require(l.university == students[_student].university, "Wrong university");
        require(courseCredits[_student][_courseHash] == 0, "Already submitted");

        courseCredits[_student][_courseHash] = _credits;
        students[_student].totalCredits += _credits;

        emit GradeSubmitted(_student, _courseHash, _credits);
    }

    /* ================== 5. DIPLOMO ISDAVIMAS ================== */

    function issueDiploma(address _student, bytes32 _diplomaHash) public {
        require(universities[msg.sender].isRegistered, "Only university");
        require(students[_student].university == msg.sender, "Wrong university");
        require(students[_student].totalCredits >= 180, "Not enough credits");
        require(!students[_student].hasDiploma, "Already issued");

        students[_student].hasDiploma = true;

        diplomas[_student] = Diploma({
            isValid: true,
            university: msg.sender,
            issueDate: block.timestamp,
            diplomaHash: _diplomaHash
        });

        emit DiplomaIssued(_student);
    }

    /* ================== 6. PRIEIGOS SUTEIKIMAS ================== */

    function grantAccess(address _employer) public {
        require(students[msg.sender].hasDiploma, "No diploma");
        accessPermissions[msg.sender][_employer] = true;

        emit AccessGranted(msg.sender, _employer);
    }

    /* ================== 7. DIPLOMO PATIKRA ================== */

    function verifyDiploma(address _student)
        public
        view
        returns (
            bool valid,
            address university,
            uint256 issueDate,
            bytes32 diplomaHash
        )
    {
        require(accessPermissions[_student][msg.sender], "Access denied");

        Diploma memory d = diplomas[_student];
        return (d.isValid, d.university, d.issueDate, d.diplomaHash);
    }

    /* ================== 8. DIPLOMO ATSUKIMAS ================== */

    function revokeDiploma(address _student) public {
        require(universities[msg.sender].isRegistered, "Only university");
        require(diplomas[_student].isValid, "Already revoked");

        diplomas[_student].isValid = false;
        emit DiplomaRevoked(_student);
    }
}

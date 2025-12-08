pragma solidity ^0.8.0;

contract DiplomaVerification {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not system owner");
        _;
    }

    /*STRUKTŪROS*/

    struct University {
        bool isRegistered;
        string name;
    }

    struct Student {
        bool isEnrolled;
        address university;
        uint totalCredits;
        bool hasDiploma;
    }

    struct Diploma {
        bool isValid;
        address university;
        uint issueDate;
    }

    /*SAUGYKLOS */

    mapping(address => University) public universities;
    mapping(address => Student) public students;
    mapping(address => mapping(string => bool)) public grades; // student => course => passed
    mapping(address => Diploma) public diplomas;
    mapping(address => mapping(address => bool)) public accessPermissions; // student => employer => access

    /*ĮVYKIAI (EVENTS)*/

    event UniversityRegistered(address university);
    event StudentEnrolled(address student, address university);
    event GradeSubmitted(address student, string course);
    event DiplomaIssued(address student);
    event DiplomaRevoked(address student);
    event AccessGranted(address student, address employer);

    /*1. UNIVERSITETO REGISTRACIJA */

    function registerUniversity(string memory _name) public {
        require(!universities[msg.sender].isRegistered, "Already registered");

        universities[msg.sender] = University({
            isRegistered: true,
            name: _name
        });

        emit UniversityRegistered(msg.sender);
    }

    /*2. STUDENTO REGISTRACIJA*/

    function enrollStudent(address _student) public {
        require(universities[msg.sender].isRegistered, "Only university can enroll");
        require(!students[_student].isEnrolled, "Student already enrolled");

        students[_student] = Student({
            isEnrolled: true,
            university: msg.sender,
            totalCredits: 0,
            hasDiploma: false
        });

        emit StudentEnrolled(_student, msg.sender);
    }

    /*3. PAŽYMIO PATEIKIMAS */

    function submitGrade(address _student, string memory _course, uint _credits) public {
        require(universities[msg.sender].isRegistered, "Only university staff allowed");
        require(students[_student].isEnrolled, "Student not enrolled");
        require(!grades[_student][_course], "Already submitted");

        grades[_student][_course] = true;
        students[_student].totalCredits += _credits;

        emit GradeSubmitted(_student, _course);
    }

    /*4. DIPLOMO IŠDAVIMAS*/

    function issueDiploma(address _student) public {
        require(universities[msg.sender].isRegistered, "Only university can issue");
        require(students[_student].isEnrolled, "Student not enrolled");
        require(students[_student].totalCredits >= 180, "Not enough credits");
        require(!students[_student].hasDiploma, "Already has diploma");

        students[_student].hasDiploma = true;

        diplomas[_student] = Diploma({
            isValid: true,
            university: msg.sender,
            issueDate: block.timestamp
        });

        emit DiplomaIssued(_student);
    }

    /* 5. PRIEIGOS SUTEIKIMAS DARBDAVIUI*/

    function grantAccess(address _employer) public {
        require(students[msg.sender].hasDiploma, "No diploma");
        accessPermissions[msg.sender][_employer] = true;

        emit AccessGranted(msg.sender, _employer);
    }

    /* 6. DIPLOMO PATIKRA */

    function verifyDiploma(address _student) public view returns (
        bool valid,
        address university,
        uint issueDate
    ) {
        require(accessPermissions[_student][msg.sender], "Access not granted");

        Diploma memory d = diplomas[_student];

        return (d.isValid, d.university, d.issueDate);
    }

    /*7. DIPLOMO ATŠAUKIMAS */

    function revokeDiploma(address _student) public {
        require(universities[msg.sender].isRegistered, "Only university allowed");
        require(diplomas[_student].isValid, "Already revoked");

        diplomas[_student].isValid = false;

        emit DiplomaRevoked(_student);
    }

}

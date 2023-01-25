pragma solidity ^0.8.13;

contract idee {
    address public admin = msg.sender;

    // Check if admin
    function checkAdmin(address _aId) public view returns(bool) {
        bool flag = false;
        if (admin == _aId) {
            flag = true;
        }
        return flag;
    }

    // Check if the healthcare institution exists
    function checkInstitution(address _hiId) public view returns(uint){
        uint flag = 0; // 0 = account not registered before
        for (uint i = 1 ; i <= hiCount; i++){
            if (hiList[i].hiId == _hiId) {
                flag = hiList[i].status;
            }
        }
        return flag;
    }

    // Check if the business exists
    function checkBusiness(address _bId) public view returns(uint){
        uint flag = 0;
        for (uint i = 1 ; i <= bCount; i++){
            if (bList[i].bId == _bId) {
                flag = bList[i].status;
            }
        }
        return flag;
    }

    // Check if the migrant exists
    function checkMigrant(address _mId) public view returns(bool){
        bool flag = false;
        for (uint i = 1 ; i <= mCount; i++){
            if(mList[i].mId == _mId){
                flag = true;
                break;
            }
        }
        return flag;
    }

    // Check if the local exists
    function checkLocal(address _lId) public view returns(bool){
        bool flag = false;
        for (uint i = 1 ; i <= lCount; i++){
            if(lList[i].lId == _lId){
                flag = true;
                break;
            }
        }
        return flag;
    }

    // Get 'count' of healthcare institution
    function institutionCount(address _hiId) public view returns(uint){
        uint count = 0; 
        for (uint i = 1 ; i <= hiCount; i++){
            if (hiList[i].hiId == _hiId) {
                count = i;
            }
        }
        return count;
    }

    // Get 'count' of business
    function businessCount(address _bId) public view returns(uint){
        uint count = 0; 
        for (uint i = 1 ; i <= bCount; i++){
            if (bList[i].bId == _bId) {
                count = i;
            }
        }
        return count;
    }

    // MODELS AND THE RESPECTIVE MAPPINGS
    // Model a Healthcare Institution
    struct HealthcareInstitution{
        address hiId;
        string name;
        string website;
        uint status; // 1 = not verified yet, 2 = rejected, 3 = verified, 4 = deactivated
    }
    // Get All Healthcare Institutions
    mapping (uint => HealthcareInstitution) public hiList;
    uint public hiCount;

    // Model a Business
    struct Business{
        address bId;
        string name;
        string website;
        uint status; // 1 = not verified yet, 2 = rejected, 3 = verified, 4 = deactivated
    }
    // Get All Businesses
    mapping (uint => Business) public bList;
    uint public bCount;

    // Model a Migrant
    struct Migrant{
        address mId;
        string name;
        string nationality;
        string gender;
        string identificationNo;
        string dob;
    }
    // Get All Migrants
    mapping (uint => Migrant) public mList;
    // Get Migrant's details
    mapping (address => Migrant) public mDetail;
    uint public mCount;

    // Model a Local
    struct Local{
        address lId;
        string name;
        string nationality;
        string gender;
        string identificationNo;
        string dob;
    }
    // Get All Locals
    mapping (uint => Local) public lList;
    // Get Local's details
    mapping (address => Local) public lDetail;
    uint public lCount;


    // Model transaction
    struct Transaction{
        string date;
        string description;
        uint amount;
        bool types; // true if debit, false if credit
    }
    // Admin transaction history
    mapping (address => mapping(uint => Transaction)) public transactionHistory;

    // Transaction count
    mapping (address => uint) public transactionCount;

    // User's wallet balance
    mapping (address => uint) public balance;

    // Debit/Credit & Transaction history
    function createTransaction(address _senderAddress, address _receiverAddress, string memory _date, string memory _description, uint _amount) public {
        // Deduct/Credit balances
        balance[_senderAddress] -= _amount;
        balance[_receiverAddress] += _amount;
        // Retrieve transaction count for sender/receiver
        transactionCount[_senderAddress] += 1;
        transactionCount[_receiverAddress] += 1;
        uint sCount = transactionCount[_senderAddress];
        uint rCount = transactionCount[_receiverAddress];
        // Write transaction history for sender
        transactionHistory[_senderAddress][sCount] = Transaction(_date, _description, _amount, false);
        transactionHistory[_receiverAddress][rCount] = Transaction(_date, _description, _amount, true);
    }

    function sendMoney(address _address, string memory _date, string memory _description, uint _amount) public {
        balance[_address] += _amount;
        transactionCount[_address] += 1;
        uint count = transactionCount[_address];
        transactionHistory[_address][count] = Transaction(_date, _description, _amount, true);
    }

    function withdrawMoney(address _address, string memory _date, string memory _description, uint _amount) public {
        balance[_address] -= _amount;
        transactionCount[_address] += 1;
        uint count = transactionCount[_address];
        transactionHistory[_address][count] = Transaction(_date, _description, _amount, false);
    }

    // REGISTER/CREATION/ADD FUNCTIONS
    // Register a Healthcare Institution
    function registerHI(address _hiId, string memory _name, string memory _website) public {
        uint flag = checkInstitution(_hiId);
        if (flag == 0) {
            hiCount++;
            hiList[hiCount] = HealthcareInstitution(_hiId, _name, _website, 1);
        } else {
            uint count = institutionCount(_hiId);
            hiList[count] = HealthcareInstitution(_hiId, _name, _website, 1);
        }
    }

    // Register a Business
    function registerBusiness(address _bId, string memory _name, string memory _website) public {
        uint flag = checkBusiness(_bId);
        if (flag == 0) {
            bCount++;
            bList[bCount] = Business(_bId, _name, _website, 1);
        } else {
            uint count = businessCount(_bId);
            bList[count] = Business(_bId, _name, _website, 1);
        }
    }

    // Register a Migrant
    function registerMigrant(address _mId, string memory _name, string memory _nationality, string memory _gender, string memory _identificationNo, string memory _dob) public {
        mCount++;
        mList[mCount] = Migrant(_mId, _name, _nationality, _gender, _identificationNo, _dob);
        mDetail[_mId] = Migrant(_mId, _name, _nationality, _gender, _identificationNo, _dob);
    }

    // Register a Local
    function registerLocal(address _lId, string memory _name, string memory _nationality, string memory _gender, string memory _identificationNo, string memory _dob) public {
        lCount++;
        lList[lCount] = Local(_lId, _name, _nationality, _gender, _identificationNo, _dob);
        lDetail[_lId] = Local(_lId, _name, _nationality, _gender, _identificationNo, _dob);
    }


    // GET FUNCTIONS
    // Get All Healthcare Institutions
    function getHiList(uint _hiCount) view public returns(address hiId, string memory name, string memory website) {
        return(hiList[_hiCount].hiId, hiList[_hiCount].name, hiList[_hiCount].website);
    }

    // Get All Businesses
    function getbList(uint _bCount) view public returns(address bId, string memory name, string memory website) {
        return(bList[_bCount].bId, bList[_bCount].name, bList[_bCount].website);
    }

    // Get All Migrants
    function getmList(uint _mCount) view public returns(address mId, string memory name, string memory nationality, string memory gender, string memory identificationNo, string memory dob) {
        return(mList[_mCount].mId, mList[_mCount].name, mList[_mCount].nationality, mList[_mCount].gender, mList[_mCount].identificationNo, mList[_mCount].dob);
    }

    // Get Migrant's Details
    function getmDetail(address _mId) view public returns(address mId, string memory name, string memory nationality, string memory gender, string memory identificationNo, string memory dob) {
        return(mDetail[_mId].mId, mDetail[_mId].name, mDetail[_mId].nationality, mDetail[_mId].gender, mDetail[_mId].identificationNo, mDetail[_mId].dob);
    }

    // Get All Locals
    function getlList(uint _lCount) view public returns(address lId, string memory name, string memory nationality, string memory gender, string memory identificationNo, string memory dob) {
        return(lList[_lCount].lId, lList[_lCount].name, lList[_lCount].nationality, lList[_lCount].gender, lList[_lCount].identificationNo, lList[_lCount].dob);
    }

    // Get Local's Details
    function getlDetail(address _lId) view public returns(address lId, string memory name, string memory nationality, string memory gender, string memory identificationNo, string memory dob) {
        return(lDetail[_lId].lId, lDetail[_lId].name, lDetail[_lId].nationality, lDetail[_lId].gender, lDetail[_lId].identificationNo, lDetail[_lId].dob);
    }

    // Get transaction
    function getTransaction(address _tId, uint _tCount) view public returns(string memory date, string memory description, uint amount, bool types) {
        return(transactionHistory[_tId][_tCount].date, transactionHistory[_tId][_tCount].description, transactionHistory[_tId][_tCount].amount, transactionHistory[_tId][_tCount].types);
    }


    // Update functions
    // Admin update healthcare institution status
    function updateHI(address _hiId, string memory _name, string memory _website, uint _status) public {
        uint count = institutionCount(_hiId);
        hiList[count] = HealthcareInstitution(_hiId, _name, _website, _status);
    }

    // Admin update business status
    function updateBusiness(address _bId, string memory _name, string memory _website, uint _status) public {
        uint count = businessCount(_bId);
        bList[count] = Business(_bId, _name, _website, _status);
    }

    constructor() public {
        balance[msg.sender] = 500;
    }
}

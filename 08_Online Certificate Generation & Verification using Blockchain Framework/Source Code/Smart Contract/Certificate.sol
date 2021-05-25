pragma solidity ^0.6.0;

// Start of Contract
contract Certapp {
    // Variables where the data of certificates will be stored
    mapping(string => string) public certificates;
    address owner;

    // To set the owner of the smart contract for Verification.
    constructor() public {
        owner = msg.sender;
    }
    
    // This allows only the owner to update the data to BlockChain
    modifier conditions {
        require(msg.sender == owner, 'Unauthorized');
        _;
    }

    // New Certificate generation function
    function newCert(string memory _keys, string memory _certs) public conditions {
        certificates[_keys] = _certs;
    }
    
    // Delete Certificate function
    function deleteCert(string memory _keys) public conditions {
        certificates[_keys] = "";
    }
}

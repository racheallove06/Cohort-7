// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract TodoRoles {
    mapping(address => bool) public admins;
    mapping(address => bool) public users;

    modifier onlyAdmin() {
        require(admins[msg.sender], "Not an admin");
        _;
    }

    modifier onlyUser() {
        require(users[msg.sender] || admins[msg.sender], "Not a user");
        _;
    }

    constructor() {
        // Assign the contract deployer as an initial admin
        admins[msg.sender] = true;
    }

    // Add functions to assign roles if needed
    function addAdmin(address _admin) public onlyAdmin {
        admins[_admin] = true;
    }

    function addUser(address _user) public onlyAdmin {
        users[_user] = true;
    }
}

contract TodoManager is TodoRoles {
    struct Todo {
        string title;
        bool completed;
        uint256 deadline;
        string category;
        address assignedTo;
    }

    Todo[] public todos;

    event TodoCreated(uint256 indexed id, string title, uint256 deadline, string category);

    function createTodo(string calldata _title, uint256 _deadline, string calldata _category, address _assignedTo) public onlyUser {
        require(_assignedTo != address(0), "Assigned address cannot be zero");
        
        Todo memory newTodo = Todo({
            title: _title,
            completed: false,
            deadline: _deadline,
            category: _category,
            assignedTo: _assignedTo
        });

        todos.push(newTodo);
        emit TodoCreated(todos.length - 1, _title, _deadline, _category);
    }

    function getTodo(uint256 _index) public view returns (string memory title, bool completed, uint256 deadline, string memory category, address assignedTo) {
        require(_index < todos.length, "Todo index out of bounds");
        Todo storage todo = todos[_index];
        return (todo.title, todo.completed, todo.deadline, todo.category, todo.assignedTo);
    }
}

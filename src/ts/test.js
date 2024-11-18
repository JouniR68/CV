"use strict";
var _a;
let id = 5;
let company = "Google";
let isPublished = true;
let ids = [1, 2, 3, 4, 5];
let x = "pedrobot";
let xArr = ["pedro", 0, true, { key: "value" }];
const employee = {
    employeeId: 123,
    startDate: new Date(),
    name: "John Doe",
    department: "IT"
};
employee.name = "Jessica";
console.log(employee); // { employeeId: 222, startDate: 2023-08-15T17:45:00.000Z, name: 'Jessica', department: 'IT' }
class StorageContainer {
    constructor() {
        this.contents = [];
    }
    addItem(item) {
        this.contents.push(item);
    }
    getItem(index) {
        return this.contents[index];
    }
}
const usernames = new StorageContainer();
usernames.addItem("pedro");
usernames.addItem("juan");
usernames.addItem("maria");
console.log((_a = usernames.getItem(1)) === null || _a === void 0 ? void 0 : _a.toUpperCase()); // "JUAN
const friendsCount = new StorageContainer();
friendsCount.addItem(23);
friendsCount.addItem(50);
console.log(friendsCount.getItem(1));
//unauthorized access, user doesn't exist, wrong credentials
var LoginError;
(function (LoginError) {
    LoginError["Unauthorized"] = "Unauthorized";
    LoginError["NoUser"] = "user doesn't exist";
    LoginError["WrongCredentials"] = "wrong credentials";
    LoginError["internalError"] = "internal error";
})(LoginError || (LoginError = {}));
const printErrorMsg = (error) => {
    if (error === LoginError.Unauthorized) {
        console.log(LoginError.Unauthorized);
    }
    else if (error === LoginError.NoUser) {
        console.log(LoginError.NoUser);
    }
    else if (error === LoginError.WrongCredentials) {
        console.log(LoginError.WrongCredentials);
    }
    else if (error === LoginError.internalError) {
        console.log(LoginError.internalError);
    }
};
printErrorMsg(LoginError.WrongCredentials);
const printId = (id) => {
    console.log("id: ", id);
};
const signContract = (employee) => {
    console.log("Contract signed for employee with by: ", employee.name + " with email: ", employee.email);
};
signContract({ id: 1, email: "jriim@gmail.com", name: "Jouni", creditScore: 750 });
const user = {
    id: 2,
    name: "Jouni",
    greet(message) {
        console.log(`Hello, ${message}`);
    }
};
printId(1234);
user.greet("Jouni the man!");
if (!user.age) {
    console.log("No age of the user provided");
}
else {
    console.log(user);
}
const concatenateValues = (a, b) => {
    return a + b;
};
console.log(concatenateValues("Jouni", "Riimala"));
console.log(concatenateValues("55", "0"));

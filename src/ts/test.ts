let id: number = 5;
let company: string = "Google";
let isPublished: boolean = true;

let ids: number[] = [1, 2, 3, 4, 5];
let x: any = "pedrobot";
let xArr: any[] = ["pedro", 0, true, { key: "value" }];


interface Employer {
    readonly employeeId: number;
    readonly startDate: Date;
    name: string;
    department: string;
}


const employee: Employer = {
    employeeId: 123,
    startDate: new Date(),
    name: "John Doe",
    department: "IT"
}

employee.name = "Jessica"


console.log(employee); // { employeeId: 222, startDate: 2023-08-15T17:45:00.000Z, name: 'Jessica', department: 'IT' }







class StorageContainer<T> {
    private contents: T[]


    constructor() {
        this.contents = [];
    }

    addItem(item: T): void {
        this.contents.push(item);
    }


    getItem(index: number): T | undefined {
        return this.contents[index];
    }
}


const usernames = new StorageContainer<string>();
usernames.addItem("pedro");
usernames.addItem("juan");
usernames.addItem("maria");
console.log(usernames.getItem(1)?.toUpperCase()); // "JUAN



const friendsCount = new StorageContainer<number>();
friendsCount.addItem(23);
friendsCount.addItem(50);
console.log(friendsCount.getItem(1));


//unauthorized access, user doesn't exist, wrong credentials

enum LoginError {
    Unauthorized = "Unauthorized",
    NoUser = "user doesn't exist",
    WrongCredentials = "wrong credentials",
    internalError = "internal error"
}

const printErrorMsg = (error: LoginError) => {
    if (error === LoginError.Unauthorized) {
        console.log(LoginError.Unauthorized);
    } else if (error === LoginError.NoUser) {
        console.log(LoginError.NoUser);
    } else if (error === LoginError.WrongCredentials) {
        console.log(LoginError.WrongCredentials);
    } else if (error === LoginError.internalError) {
        console.log(LoginError.internalError);
    }
}

printErrorMsg(LoginError.WrongCredentials);


type IDFiedlType = string | number


const printId = (id: IDFiedlType) => {
    console.log("id: ", id);
}

interface UserInterface {
    id: number;
    name: string;
    age?: number;
    greet(message: string): void;
}

interface BusinessPartner {
    name: string;
    creditScore: number;
}

interface UserIdentity {
    id: number;
    email: string;
}

type Employee = UserIdentity & BusinessPartner;


const signContract = (employee: Employee) => {
    console.log("Contract signed for employee with by: ", employee.name + " with email: ", employee.email);
}

signContract({ id: 1, email: "jriim@gmail.com", name: "Jouni", creditScore: 750 })

const user: UserInterface = {
    id: 2,
    name: "Jouni",
    greet(message) {
        console.log(`Hello, ${message}`);
    }
}

printId(1234)

user.greet("Jouni the man!");

if (!user.age) {
    console.log("No age of the user provided");
} else { console.log(user) }



const concatenateValues = (a: string, b: string): string => {
    return a + b;
}

console.log(concatenateValues("Jouni", "Riimala"))
console.log(concatenateValues("55", "0"))


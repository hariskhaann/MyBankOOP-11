import { faker } from "@faker-js/faker"
import chalk from "chalk"
import inquirer from "inquirer"


class Customer {
    firstName: string
    lastName: string
    age: number
    gender: string
    mobNumber: number
    accNumber: number

    constructor (fname:string,lName:string,age:number,gender:string,mob:number,acc:number){
        this.firstName = fname
        this.lastName = lName
        this.age = age
        this.gender = gender
        this.mobNumber = mob
        this.accNumber = acc
    }
}

interface BankAccount {
    accNumber : number,
    balance : number,
}

class Bank {
    customer : Customer[] = []
    account : BankAccount[] = []

    addCustomer(obj:Customer){
        this.customer.push(obj)
    }

    addAccountNumber(obj:BankAccount){
        this.account.push(obj);
    }
    transaction(accObj: BankAccount){
        let NewAccounts = this.account.filter(acc => acc.accNumber !==accObj.accNumber)
        this.account = [...NewAccounts, accObj]
    }

}

let myBank = new Bank();

for(let i:number = 1; i<3; i++){
    let fName = faker.person.firstName('male')
    let lName = faker.person.lastName()
    let num = parseInt(faker.phone.number("3#########"))
    const cus = new Customer(fName,lName,25*i,"male",num,1000+i)
    myBank.addCustomer(cus);
    myBank.addAccountNumber({accNumber: cus.accNumber,balance:100 * i})

}

async function bankService(Bank:Bank) {
    do{let service = await inquirer.prompt({
        type:"list",
        name:"select",
        message:"Please select the Service",
        choices:["View Balance", "Cash Withdraw", "Cash Deposit"]
    });
    if (service.select == "View Balance"){
        let res = await inquirer.prompt({
            type:"input",
            name:"num",
            message:"Please enter your account number",
        });
        let account = myBank.account.find((acc)=>acc.accNumber == res.num)
        if(!account){
            console.log(chalk.red.bold("Invalid Account Number"))
        }
        if (account){
            let name = myBank.customer.find((item)=>item.accNumber==account?.accNumber)
            console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} your accaount balance is ${chalk.bold.blue("$",account.balance)}`)
        }
    }
    if (service.select == "Cash Withdraw"){
        let res = await inquirer.prompt({
            type:"input",
            name:"num",
            message:"Please enter your account number",
        });
        let account = myBank.account.find((acc)=>acc.accNumber == res.num)
        if(!account){
            console.log(chalk.red.bold("Invalid Account Number"))
        }
        if (account){
            let ans = await inquirer.prompt({
                type:"number",
                message:"Please enter your amount",
                name:"rupee"
            })
            if(ans.rupee > account.balance){
                console.log(chalk.red.bold("Balance not Available"))
            }
            let newBalance = account.balance - ans.rupee;

            Bank.transaction({accNumber:account.accNumber,balance:newBalance})
            
        }
    }
    if (service.select == "Cash Deposit"){
        let res = await inquirer.prompt({
            type:"input",
            name:"num",
            message:"Please enter your account number",
        });
        let account = myBank.account.find((acc)=>acc.accNumber == res.num)
        if(!account){
            console.log(chalk.red.bold("Invalid Account Number"))
        }
        if (account){
            let ans = await inquirer.prompt({
                type:"number",
                message:"Please enter your amount",
                name:"rupee"
            })
            let newBalance = account.balance + ans.rupee;

            Bank.transaction({accNumber:account.accNumber,balance:newBalance})
            
        }
    }}
    while(true)
}

bankService(myBank);

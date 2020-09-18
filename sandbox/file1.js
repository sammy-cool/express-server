// use the name variable 
// console.log(name) 
const name = require('./file2')
const greet = require('./file3')
const { firstName, lastName } = require('./file4')

console.log(name)
console.log(greet())
console.log(firstName, lastName)

// use the greet function
// greet() 
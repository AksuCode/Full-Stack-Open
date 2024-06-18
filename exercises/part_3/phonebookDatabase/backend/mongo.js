const mongoose = require('mongoose')

const processArgLen = process.argv.length

if (!(processArgLen===3 || processArgLen===5)) {
    console.log('give password, name and phonenumber as arguments \n or \ngive password as argument to get all entries')
    process.exit(1)
}

const password = process.argv[2]

const name = process.argv[3]
const number = process.argv[4]

const url =
`mongodb+srv://parsaviherio:${password}@cluster0.qbrzjq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (processArgLen===5) {

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })

} else {

    Person.find({}).then(result => {
        result.forEach(p => {
            console.log(p)
        })
        mongoose.connection.close()
    })

}
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
        .then(result => {
            console.log('connected to MongoDB')
        })
        .catch(error => {
            console.log('error connecting to MongoDB:', error.message)
        })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function(v) {
                const numbParts = v.split('-')

                if (numbParts.length != 2) return false
                if (numbParts[0].length < 2 || 3 < numbParts[0].length) return false
                if (isNaN(numbParts[0])) return false
                if (isNaN(numbParts[1])) return false

                return true
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
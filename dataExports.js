
const mongoose = require("mongoose")
const assert = require("assert")
const uri =
    "mongodb://dbSICT:sictK18@anonymous-shard-00-01-app1j.mongodb.net:27017/weather" +
    "-chat-bot?ssl=true&replicaSet=anonymous-shard-0&authSource=admin"


// connection 
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    assert.equal(null, err)
    const callback = () => {
        db.close()
    }
    exportData(db, callback)
})


const exportData = (db, callback) => {
    const collection = db.collection('mailbox')
    collection.find({}, { projection: { _id: 0, text: 1, type: 1 } }).toArray((err, result) => {
        assert.equal(err, null)
        console.log(result)
        return result
    })
    callback()
}
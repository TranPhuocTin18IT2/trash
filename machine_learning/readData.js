module.exports.findData = (db,assert) => {
    const collection = db.collection('mailbox')
    collection.find({}, {projection: {text: 1, type: 1}}).toArray((err, docs) => {
        assert.equal(err, null)
        return docs
    })
    db.close()
}
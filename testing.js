const Model = require('./models/mailbox')
Model.find(function (err, docs) {
    console.log(docs)
})
// let sample = [
//     new Model({
//         text:'ghê ha',
//         type:'praise'
//     }),
//     new Model({
//         text:'giỏi vậy',
//         type:'praise'
//     }),
//     new Model({
//         text:'thông minh thật',
//         type:'praise'
//     }),
//     new Model({
//         text:'tài ghê chưa',
//         type:'praise'
//     }),
//     new Model({
//         text:'Khôn như mi quê ta đầy',
//         type:'praise'
//     }),
//     new Model({
//         text:'giỏi quá',
//         type:'praise'
//     }),
//     new Model({
//         text:'làm tốt lắm',
//         type:'praise'
//     })
// ]
// sample.forEach(item=>{
//     item.save((err, Model)=>{
//         if (err) return console.error(err);
//         console.log(Model.name + " saved to weather_box collection.");
//     });
// })




// const predict = require('./machine_learning/prediction')
// let test = 'thời tiết hôm mai nay thế nào' +
//     ' cc :))))'
// const result = async (test) => {
//     let rs = await predict.predictions(test)
//     console.log(rs)
// }
// result(test)


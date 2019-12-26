const test = require('./predict')
const train = require('./training')
const tf = require('@tensorflow/tfjs-node')
let text = ' Cảm ơn'
// let data = test.matrixWeights(text)
// console.log('matrix',test.matrixWeights(text))
// async function prediction() {
//   let loadmodel = await tf.loadLayersModel('file://model/model.json')
//   await loadmodel.weights.forEach(element => {
//     console.log(element.name, element.shape)
//   })
//   let pridictTensor = loadmodel.predict(tf.tensor2d(data)).argMax(1).dataSync(0);
//   console.log(train.types[pridictTensor])
//     return train.types[pridictTensor]
// }
// prediction()
console.log(text.toLowerCase())
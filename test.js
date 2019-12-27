const test = require('./predict')
const train = require('./training')
const tf = require('@tensorflow/tfjs-node')
let text = 'xin chao'
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
// console.log(train.dictionary)
const check = (msg) =>{
    let split = test.cleanMsg(msg).split(' ')
    console.log(split)
    let count = 0 
    for(let i in split) { 
        train.dictionary.forEach(j =>{
           switch (split[i]) {
              case j:
                  console.log(split[i])
                  count++
                  break
              default:
                  break;
           }
        })
    }
    if(count<1) return false
    return true
}

console.log(check(text))
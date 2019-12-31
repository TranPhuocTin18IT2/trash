const fs = require('fs')
const path = require('path')
// thử viện tách từ
const vntk = require('vntk')
// phương thức tách từ
const tokenizer = vntk.wordTokenizer()
// đọc file lưu stopword
let ReadStopWordFile = fs.readFileSync(path.join(__dirname, './stopwords.txt'), 'utf8')
let arayStopWords = ReadStopWordFile.split()
// doc file du lieu train
let data = fs.readFileSync('./dataInput.json','utf8')
// let mailbox = require('../models/mailbox')
// console.log(JSON.stringify(data))
// parser data json
let words = JSON.parse(data)
// băt đầu tạo mảng từ điển
let dictionary = new Array()
// mảng chứa mảng các từ trong mỗi câu
let lsWordOfData = new Array()
//mảng chứa các mảng ma trận trọng số cho các câu data
let arrayMatrixWeights = new Array()
let vectors = new Array()
//mảng lưu các loại lớp
let types = new Array()
//mảng lưu giá trị type của câu dữ liệu
let typeVals = new Array()
let typesInput =new Array()
let totalInputs = 0
// hàm làm sạch câu
module.exports.clean_string = (str) => {
    // regex loai bo cac ky tu dac biet
    let reqex = /[^()_+\-=\[\]{};':"\\|!@#$%^&*,.<>\/?*~]+/gi
    let newstr = str.match(reqex)
    let te = ''
    let news = ''
    for (let i in newstr) // duyệt qua mảng newstr
        news = news + newstr[i]
    for (let i in arayStopWords) // duyệt qua file stopwords.txt
    {
        let re1 = new RegExp('\w*' + arayStopWords[i], 'gi');
        te = news.replace(re1, '');
    }
    // tách  từ
    let splitWord = tokenizer.tag(te, 'text')
    return splitWord
}
let arrayUnique = (array) => {
    let arr = array.concat()
    for (let i = 0; i < arr.length; ++i)
        for (let j = i + 1; j < arr.length; ++j) {
            if (arr[i] === arr[j])
                arr.splice(j--, 1)
        }
    return arr
}
// đếm số từ trong câu
module.exports.create_Dictionary = () =>{
    for (let i in words) {
        // clean
        let cleanString = this.clean_string(words[i].text)
        // tạo mảng chứa từ trong mỗi câu
        let textParser = cleanString.split(' ')
        lsWordOfData.push(textParser)
        dictionary = arrayUnique(dictionary.concat(textParser))
    }
    totalInputs = lsWordOfData.length
    // console.log(totalInputs)
    return dictionary
}
module.exports.ls_Word_Data = () => {
    this.create_Dictionary()
    return lsWordOfData
}
module.exports.countWords = (arrStrs) => {
    return arrStrs.length
}
module.exports.totalInputs = () => {
    return totalInputs
}
module.exports.weight_matrix = () => {
    for (let i in lsWordOfData) {
        let worDict_i = new Map();
        for (let j in dictionary) {
            worDict_i.set(dictionary[j], 0);
        }

        for (let word of lsWordOfData[i]) {
            //cập nhật lại trọng số là số lần xuất hiện của từ trong câu
            let index = worDict_i.get(word);
            index += 1;
            worDict_i.set(word, index);
        }
        let tong_so_tu_trong_cau = this.countWords(lsWordOfData[i]);

        for (let word of lsWordOfData[i]) {
            //cập nhật lại trọng số là TF-IDF của từ trong câu
            let index = worDict_i.get(word)
            //tính TF
            let tf = index / tong_so_tu_trong_cau
            //tính IDF
            //-tìm số câu chứa word
            let count = 0
            for (let w of lsWordOfData) {
                for (let j of w) {
                    if (word === j) count++
                }
            }
            //-IDF = số câu / sô câu có từ word;
            let idf = totalInputs / count
            worDict_i.set(word, Number((tf * idf).toFixed(2)))

        }
        arrayMatrixWeights.push(worDict_i)
    }
    return arrayMatrixWeights
}

module.exports.create_vectors = (wm) => {
    for (let maps of wm) {
        let maptoArray = [...maps.values()]
        vectors.push(maptoArray)
    }
    return vectors
}
module.exports.typeList = () =>{
    for (let type of words) {
        typeVals.push(type.type)
    }
    types = [...new Set(typeVals)]
    return types
}
module.exports.fill_types = (types) => {
    typeVals.map((item) => {
        typesInput.push(types.indexOf(item))
    })
    return typesInput
}
// console.log(this.fill_types())

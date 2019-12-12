const ctrl = require('../controller/index');
module.exports = (app) =>{
    app.get('/',ctrl.index);
    app.get('/webhook',ctrl.getMessage);
    app.post('/webhook',ctrl.postMessage);
}

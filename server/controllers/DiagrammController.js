const diagramm = require('../models/diagramm')

const moduleName = 'DiagrammContoller';

module.exports = {

  getDiagData(req, res) {

    console.info('req.params', req.params);

    try {
      console.log(moduleName, `get getDiagData `, `request begin`)
      diagramm.getDiagData(req.params['machine_id'], req.params['extCode'], req.params['extParam'], req.params['dtBeg'], req.params['dtEnd'])
        .then(resolve => {
          res.send(resolve)
        })
        .catch(reject => {
          console.log(moduleName, `reject`, reject)
          res.status(500);
          res.send({ message: reject });
        })
    } catch (err) {
      console.log(moduleName, `ERROR`, err)
      res.status(500).send({ message: `Ошибка получения данных!` });
    }
  },  

  getDates(req, res) {

    if (!req.body) {
      res.status(400);
      res.send({ message: `Переданы пустые данные для сохранения!` });
      return;
    }

    console.info(moduleName, 'getDates begin', req.body);

    try {
      diagramm.getDates(req.body)
        .then(resolve => {
          console.log(moduleName, 'getDates result', resolve.length);
          res.send(resolve)
        })
        .catch(reject => {
          res.status(500);
          res.send({ message: reject });
        })
    } catch (err) {
      console.log(moduleName, `ERROR`, err)
      res.status(500).send({ message: `Ошибка получения данных!` });
    }

  },  


}
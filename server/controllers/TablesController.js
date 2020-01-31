const tables = require('../models/tables')

const moduleName = 'TablesController';

module.exports = {

  getAll(req, res) {

    try {
      console.log(moduleName, `get all`, `request begin`)
      tables.getTables()
        .then(resolve => {
          res.send(resolve)
        })
        .catch(reject => {
          res.status(500);
          res.send({ message: reject });
        })
    } catch (err) {
      console.log(moduleName, `ERROR`, err)
      res.status(500).send({ message: `Ошибка получения данных!`});
    }
  },

  getById(req, res, next) {

    console.info('req.params[id]', req.params['id']);

    if (!req.params['id']) {
      next();
      return;
    }

    try {
      console.log(moduleName, `get by id`, ` request begin`)
      tables.getById(req.params['id'])
        .then(resolve => {
          res.send(resolve)
        })
        .catch(reject => {
          res.status(500).send({ message: reject });
        })
    } catch (err) {
      console.log(moduleName, `ERROR`, err)
      res.status(500).send({ message:`Ошибка получения данных!`});
    }
  },

  delTable(req, res) {

    if (!req.params['id']) {
      res.status(400).send({ message: `Для удаления записи необходимо передать её идентификатор!` });
      return;
    }

    console.info(moduleName, `delTable`, req.params['id']);

    try {
      tables.delTable(req.params['id'])
        .then(resolve => {          
          res.send(resolve)          
        })
        .catch(reject => {          
          //res.status(500);
          res.status(500).send({ message: reject });
        })
    } catch (err) {
      console.log(moduleName, `ERROR`, err)
      res.status(500).send({ message: `Ошибка получения данных!`});
    }


  },

  saveTable(req, res) {

    if (!req.body) {
      res.status(400);
      res.send({ message: `Переданы пустые данные для сохранения!` });
      return;
    }

    console.info(moduleName, 'saveTable begin', req.body);

    try {
      tables.saveTable(req.body)
        .then(resolve => {
          console.log(moduleName, 'saveTable result', resolve);
          res.send(resolve)
        })
        .catch(reject => {
          res.status(500);
          res.send({ message: reject });
        })
    } catch (err) {
      console.log(moduleName, `ERROR`, err)
      res.status(500).send(`Ошибка получения данных!`);
    }

  }

}

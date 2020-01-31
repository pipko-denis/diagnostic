const params = require('../models/params')

const moduleName = 'ParamsController';

module.exports = {

  getParamsByTable(req, res) {

    console.info('req.params[id]', req.params['table_id']);

    try {
      console.log(moduleName, `get Params By Table `, `request begin`)
      params.getParamsByTable(req.params['table_id'])
        .then(resolve => {
          res.send(resolve)
        })
        .catch(reject => {
          res.status(500);
          res.send({ message: reject });
        })
    } catch (err) {
      console.log(moduleName, `ERROR`, err)
      res.status(500).send({ message:`Ошибка получения данных!`});
    }
  },

  getParamsByTableName(req, res){
    console.info('req.params[name]', req.params['name']);

    try {
      console.log(moduleName, `get Params By Table Name`, `request begin`)
      params.getParamsByTableName(req.params['name'], req.params['isdt'])
        .then(resolve => {
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

  getById(req, res, next) {

    console.info('req.params[id]', req.params['id']);

    if (!req.params['id']) {
      next();
      return;
    }

    try {
      console.log(moduleName, `get by id`, ` request begin`)
      params.getById(req.params['id'])
        .then(resolve => {
          res.send(resolve)
        })
        .catch(reject => {
          res.status(500);
          res.send({ message: reject });
        })
    } catch (err) {
      console.log(moduleName, `ERROR`, err)
      res.status(500).send({ message:`Ошибка получения данных!`});
    }
  },

  delParam(req, res) {

    if (!req.params['id']) {
      res.status(400);
      res.send({ message: `Для удаления записи необходимо передать её идентификатор!` });
      return;
    }

    console.info(moduleName, `delParam`, req.body);

    try {
      params.delParam(req.params['id'])
        .then(resolve => {
          res.send(resolve)
        })
        .catch(reject => {
          res.status(500).send({ message: reject });
        })
    } catch (err) {
      console.log(moduleName, `ERROR`, err)
      res.status(500).send({ message: `Ошибка получения данных!`});
    }


  },

  saveParam(req, res) {

    if (!req.body) {
      res.status(400);
      res.send({ message: `Переданы пустые данные для сохранения!` });
      return;
    }

    
    if (!req.params['table_id']) {
      res.status(400);
      res.send({ message: `Переданы пустые данные для сохранения!` });
      return;
    }

    console.info(moduleName, 'saveParam begin', req.body);

    try {
      params.saveParam(req.body, req.params['table_id'])
        .then(resolve => {
          console.log(moduleName, 'saveParam result', resolve);
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

  }

}

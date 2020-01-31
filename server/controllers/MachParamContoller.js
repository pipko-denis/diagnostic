const machparams = require('../models/machparams')

const moduleName = 'MachParamContoller';

module.exports = {

  getParamsByMachineType(req, res) {

    console.info('req.params[type_id]', req.params['type_id']);

    try {
      console.log(moduleName, `get MachParams By machTypeId `, `request begin`)
      machparams.getParamsByMachineType(req.params['type_id'])
        .then(resolve => {
          res.send(resolve)
          console.info("sending resolve", resolve);
        })
        .catch(reject => {
          console.info("status 500");
          res.status(500);
          res.send({ message: reject });
        })
    } catch (err) {
      console.info("status 500 catch")
      console.log(moduleName, `ERROR`, err)
      res.status(500).send({ message: `Ошибка получения данных!` });
    }
  },

  getAllParams(req, res) {


    try {
      console.log(moduleName, `get MachParams ALL `)
      machparams.getAllParams()
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

  getParamsByMachine(req, res) {

    console.info('req.params[machine_id]', req.params['machine_id']);

    try {
      console.log(moduleName, `get MachParams By machId `, `request begin`)
      machparams.getParamsByMachine(req.params['machine_id'])
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

  getParamsForDiag(req, res) {

    console.info('req.params[machine_id]', req.params['machine_id']);

    try {
      console.log(moduleName, `get ParamsForDiag By machId `, `request begin`)
      machparams.getParamsForDiag(req.params['machine_id'])
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

  getDiagData(req, res) {

    console.info('req.params', req.params);

    try {
      console.log(moduleName, `get getDiagData `, `request begin`)
      machparams.getDiagData(req.params['machine_id'], req.params['extCode'], req.params['extParam'], req.params['dtBeg'], req.params['dtEnd'])
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

  delMachParam(req, res) {

    if (!req.params['id']) {
      res.status(400);
      res.send({ message: `Для удаления записи необходимо передать её идентификатор!` });
      return;
    }

    console.info(moduleName, `delMachParam`, req.body);

    try {
      machparams.delMachParam(req.params['id'])
        .then(resolve => {
          res.send(resolve)
        })
        .catch(reject => {
          res.status(500).send({ message: reject });
        })
    } catch (err) {
      console.log(moduleName, `ERROR`, err)
      res.status(500).send({ message: `Ошибка получения данных!` });
    }

  },


  saveParam(req, res) {

    if (!req.body) {
      res.status(400);
      res.send({ message: `Переданы пустые данные для сохранения!` });
      return;
    }

    console.info(moduleName, 'saveParam begin', req.body);

    try {
      machparams.saveParam(req.body)
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
      res.status(500).send({ message: `Ошибка получения данных!` });
    }

  },


  saveParamMachine(req, res) {

    if (!req.body) {
      res.status(400);
      res.send({ message: `Переданы пустые данные для сохранения!` });
      return;
    }

    
    if (!req.params['machine_id']) {
      res.status(400);
      res.send({ message: `Необходимо передать идентификатор машины!` });
      return;
    }

    console.info(moduleName, 'saveParam begin', req.body);

    try {
      machparams.saveParamMachine(req.body, req.params['machine_id'])
        .then(resolve => {
          console.log(moduleName, 'saveParamMachine result', resolve);
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

  saveParamType(req, res) {

    if (!req.body) {
      res.status(400);
      res.send({ message: `Переданы пустые данные для сохранения!` });
      return;
    }


    if (!req.params['type_id']) {
      res.status(400);
      res.send({ message: `Необходимо передать идентификатор машины!` });
      return;
    }

    console.info(moduleName, 'saveParam begin', req.body);

    try {
      machparams.saveParamType(req.body, req.params['type_id'])
        .then(resolve => {
          console.log(moduleName, 'saveParamType result', resolve);
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

  }    

}
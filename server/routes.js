const paramsController = require('./controllers/ParamsController');
const tablesController = require('./controllers/TablesController');
const dictsController = require('./controllers/DictsController');
const machParamContoller = require('./controllers/MachParamContoller');

module.exports = app => {
  app.get('/status', (req, res) => {
    console.log(new Date().toLocaleString(), 'get status');
    res.send({
      message: 'get status from node'
    });
  });

  app.get('/tables/', tablesController.getAll);

//  app.get('/tables/:id', tablesController.getById);

  app.post('/tables/', tablesController.saveTable)

  app.delete('/tables/:id', tablesController.delTable)

  ////////////////////////////////////////////////////////////////////
  app.get('/params/by_table/:table_id', paramsController.getParamsByTable);

  app.get('/params/by_table_name/:name/:isdt', paramsController.getParamsByTableName);

  app.post('/params/by_table/:table_id', paramsController.saveParam);

  app.get('/params/by_id/:id', paramsController.getById);  
 
// app.post('/params/', paramsController.saveParam)

  app.delete('/params/:id', paramsController.delParam)
////////////////////////////////////////////////////////////////////////

  app.get('/machparam/all/', machParamContoller.getAllParams);

  app.get('/machparam/machine/:machine_id', machParamContoller.getParamsByMachine);

  app.get('/machparam/type/:type_id', machParamContoller.getParamsByMachineType);

  app.get('/machparam/diag/:machine_id', machParamContoller.getParamsForDiag);  

  app.get('/machparam/data/:machine_id/:extCode/:extParam/:dtBeg/:dtEnd', machParamContoller.getDiagData);    

  app.post('/machparam/', machParamContoller.saveParam);

  app.post('/machparam/machine/:machine_id', machParamContoller.saveParamMachine);

  app.post('/machparam/type/:type_id', machParamContoller.saveParamType);

  app.delete('/machparam/:id', machParamContoller.delMachParam)

////////////////////////////////////////////////////////////////////////

  app.get('/dicts/machines', dictsController.getMachines)

  app.get('/dicts/machine_types', dictsController.getMachinesTypes)

  app.get('/dicts/machines_by_type', dictsController.getMachinesByType)

  app.get('/dicts/meas_units', dictsController.getMeasUnits)

  app.get('/dicts/library', dictsController.getLibrary)


  app.post('/test/', dictsController.postTest)

};

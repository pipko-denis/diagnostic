const dicts = require('../models/dicts')

const moduleName = 'DictsController';

module.exports = {

  getMachines(req, res) {

    try {
      console.log(moduleName, `getMachines request begin`)
      dicts.getMachines()
        .then(resolve => {
          res.send(resolve)
        })
        .catch(reject => {
          res.status(500).send({ message: reject });
        })
    } catch (err) {
      console.log(moduleName, `ERROR`, err);
      res.status(500).send({ message: `Ошибка получения данных!`});
    }
  },

  getMachinesByType(req, res) {

    try {
      console.log(moduleName, `getMachinesByType request begin`)
      dicts.getMachinesByType()
        .then(resolve => {
          res.send(resolve)
        })
        .catch(reject => {
          res.status(500).send({ message: reject });
        })
    } catch (err) {
      console.log(moduleName, `ERROR`, err);
      res.status(500).send({ message: `Ошибка получения данных!`});
    }
  },

  getMachinesTypes(req, res) {

    try {
      console.log(moduleName, `getMachinesTypes request begin`)
      dicts.getMachinesTypes()
        .then(resolve => {
          res.send(resolve)
        })
        .catch(reject => {
          res.status(500).send({ message: reject });
        })
    } catch (err) {
      console.log(moduleName, `ERROR`, err);
      res.status(500).send({ message: `Ошибка получения данных!`});
    }
  },

  postTest(req, res){
    try {
      console.log(`BODY`, req.body)      
      //console.log(`HEADERS`,req.headers)      
      //console.log(`HEADERS`, req)    
      res.status(200).send({ message: "Data received about " + req.body.ID_ });
    } catch (err) {
      console.log(moduleName, `ERROR`, err);
      res.status(500).send({ message: `Ошибка получения данных!` });
    }    
  },

  getMeasUnits(req, res) {

    try {
      console.log(moduleName, `getMeasUnits request begin`)
      dicts.getMeasUnits()
        .then(resolve => {
          res.send(resolve)
        })
        .catch(reject => {
          res.status(500).send({ message: reject });
        })
    } catch (err) {
      console.log(moduleName, `ERROR`, err);
      res.status(500).send({ message: `Ошибка получения данных!`});
    }
  },


  getLibrary(req, res) {

    try {
      console.log(moduleName, `getLibrary request begin`)

      let responce = [
        {
          name: "tables", fields: [
            { title_eng: 'id', title_rus: 'ID' },
            { title_eng: 'group_name', title_rus: 'Наименование группы' },
            { title_eng: 'tbl_name', title_rus: 'Наименование таблицы SQL' },
            { title_eng: 'ext_code', title_rus: 'Номер пакета(устар.)' },
            { title_eng: 'dt_field', title_rus: 'Поле с датой SQL' },
          ]
        },
        {
          name: "params", fields: [
            { title_eng: 'id', title_rus: 'ID' },
            { title_eng: 'diag_table_id', title_rus: 'Идентификатор таблицы' },
            { title_eng: 'ext_param', title_rus: 'Параметр внутри пакета (устар.)' },
            { title_eng: 'field_name', title_rus: 'Наименование поля SQL' },
            { title_eng: 'descr', title_rus: 'Описание поля' },
          ]
        },
        {
          name: "machines", fields: [
            { title_eng: 'id', title_rus: 'ID' },
            { title_eng: 'machine_id', title_rus: 'Идентификатор машины' },
            { title_eng: 'tip_id', title_rus: 'Идентификатор типа машины' },
            { title_eng: 'diag_table_param_id', title_rus: 'Идентификатор таблицы' },
            { title_eng: 'name', title_rus: 'Наименование параметра' },
            { title_eng: 'dim_id', title_rus: 'Идентификатор единицы измерения' },
            { title_eng: 'coef_a', title_rus: 'Коэффициент a (qx2+ax+b)' },
            { title_eng: 'coef_b', title_rus: 'Коэффициент b (qx2+ax+b)' },
            { title_eng: 'coef_q', title_rus: 'Коэффициент q (qx2+ax+b)' },
            { title_eng: 'min_acc_val', title_rus: 'Минимально допустимое' },
            { title_eng: 'acc_val', title_rus: 'Оптимальное значение' },
            { title_eng: 'max_acc_val', title_rus: 'Максимально допустимое' },
            { title_eng: 'presc', title_rus: 'Округление' },
            { title_eng: 'notify_over', title_rus: 'Уведомлять о превышении' },
            { title_eng: 'notify_under', title_rus: 'Уведомлять о падении' },
            { title_eng: 'description', title_rus: 'Доп. описание' },
            { title_eng: 'min_val', title_rus: 'Минимально-возможное значение(устар)' },
            { title_eng: 'max_val', title_rus: 'Максимально-возможное значение(устар)' },
          ]
        },
        {
          name: "dicts_machines", fields: [
            { title_eng: 'id', title_rus: 'ID' },
            { title_eng: 'cur_imei', title_rus: 'Текущий IMEI' },
            { title_eng: 'tip', title_rus: 'Идентификатор типа ПС' },
            { title_eng: 'type', title_rus: 'Тип ПС' },
            { title_eng: 'modification', title_rus: 'Модификация' },
            { title_eng: 'zav_nomer', title_rus: 'Заводской номер' },
            { title_eng: 'nomer_8zn', title_rus: 'Восьмизначный номер СПС' },
            { title_eng: 'espul_id', title_rus: 'ID ЕСПУЛ' },
            { title_eng: 'classification', title_rus: 'Классификация' },
            { title_eng: 'predpr', title_rus: 'Идентификатор предприятия' },
            { title_eng: 'shortname', title_rus: 'Предприятие-владелец' },
            { title_eng: 'last_loc_id', title_rus: 'ID последнего перемещения' },
            { title_eng: 'last_loc_gps_datetime', title_rus: 'Дата последнего перемещения' },
            { title_eng: 'detail', title_rus: 'Флаг детализации' },
          ]
        },

        {
          name: "dicts_meas_units", fields: [
            { title_eng: 'id', title_rus: 'ID' },
            { title_eng: 'dim_name', title_rus: 'Наименование' },
            { title_eng: 'dim_name_short', title_rus: 'Наименование сокращенное' },
          ]
        },

        {
          name: "dicts_machine_types", fields: [
            { title_eng: 'id', title_rus: 'ID' },
            { title_eng: 'type', title_rus: 'Тип машины' },
            { title_eng: 'modification', title_rus: 'Модификация' },
            { title_eng: 'developer', title_rus: 'Производитель' },
            { title_eng: 'category', title_rus: 'Категория' },
            { title_eng: 'descript', title_rus: 'Описание' },
            { title_eng: 'classification', title_rus: 'Классификация типов машин' },
            { title_eng: 'espul_code', title_rus: 'Код ЕС ПУЛ' },
          ]
        }

      ];
      res.send(responce);

    } catch (err) {
      console.log(moduleName, `ERROR`, err);
      res.status(500).send({ message: `Ошибка получения данных!`});
    }
  },

}

const { pool } = require('./pool');
const params = require('../models/params')

module.exports.getTables = function () {
  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query('select id, group_name, tbl_name, ext_code, dt_field from public.askr_diag_table order by group_name;')
        .then(res => {
          client.release();
          console.log('getTables row count', res.rowCount);
          if (res.rowCount === 0) {
            console.error("Ни одной записи по указанному параметру не найдено!");
            reject("Ни одной записи по указанному параметру не найдено!");
          } else {
            resolve(res.rows);
          }
        })
        .catch(e => {
          client.release();
          console.error('getTables query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });
};

module.exports.getById = function (id) {

  console.log('id', id, typeof (id));

  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query('select id, group_name, tbl_name, ext_code, dt_field from public.askr_diag_table Where id = $1;', [id])
        .then(res => {
          client.release();
          console.log('Tables getById row count', res.rowCount);
          if (res.rowCount === 0) {
            console.error("Ни одной записи по указанному параметру не найдено!");
            reject("Ни одной записи по указанному параметру не найдено!");
          } else {
            resolve(res.rows[0]);
          }
        })
        .catch(e => {
          client.release();
          console.error('Tables getById query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });
};

module.exports.delTable = function (id) {

  console.info('delTable', id);

  //.query('delete from public.askr_diag_tablde Where id = $1;', [table_id])

  return new Promise(function (resolve, reject) {


    try {
      params.getParamsCountByTable(id)
        .then(resolveInterm => {
          console.log('delTable params check', resolveInterm);
          //
          if (!resolveInterm) {
            reject("Ошибка при проверке привязанных к таблице параметров! Не удалось получить список параметров.");
          } else {
            if (resolveInterm > 0) {
              console.log('delTable check params', resolveInterm);
              reject("Удаление таблицы запрещено! К таблице привязны параметры (" + resolveInterm + " шт.)");
            } else {

              console.log('delTable check params succsess', resolveInterm);
              // УДАЛЕНИЕ ТАБЛИЦЫ НАЧАЛО
              pool.connect().then(client => {
                client
                  .query('delete from public.askr_diag_table Where id = $1;', [id])
                  .then(res => {
                    client.release();
                    console.log('delTable', res.rowCount, res.command);
                    resolve({ rowCount: res.rowCount });
                  })
                  .catch(e => {
                    client.release();
                    console.error('delTable query error', e.message, e.stack);
                    reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
                  });
              });
              // УДАЛЕНИЕ ТАБЛИЦЫ КОНЕЦ

            }
          }
          //

        })
        .catch(e => {
          console.log('delTable getParamsByTable e:', e);
          reject("Ошибка при проверке привязанных к таблице параметров e: " + e.message + "!");
        })
    } catch (err) {
      console.log('delTable getParamsByTable err:', err);
      reject("Ошибка при проверке привязанных к таблице параметров err: " + err.message + "!");
    }



  });

};

module.exports.saveTable = function (data) {

  console.info('saveTable data:', data);

  let qText = ``;
  let params = [data.group_name, data.tbl_name, data.ext_code, data.dt_field];
  if (!data.id) {
    qText = `INSERT INTO public.askr_diag_table(group_name, tbl_name, ext_code, dt_field) VALUES ( $1, $2, $3, $4) RETURNING id,group_name, tbl_name, ext_code, dt_field;`;

  } else {
    qText = `UPDATE public.askr_diag_table SET group_name=$1, tbl_name=$2, ext_code=$3, dt_field=$4 WHERE id = $5 RETURNING id,group_name, tbl_name, ext_code, dt_field;`;
    params.push(data.id);
  }

  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query(qText, params)
        .then(res => {
          client.release();
          console.log('saveTable', res.rows[0], res.command);
          if (res.rowCount === 0) {
            console.error("Ни одной записи по указанному параметру не найдено!");
            reject("Ни одной записи по указанному параметру не найдено!");
          } else {
            resolve(res.rows[0]);
          }
        })
        .catch(e => {
          client.release();
          console.error('saveTable query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });  
};

module.exports.getTableUserName = function (name) {
  console.log('getTableUserName tableName = ' + name);

  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query(" SELECT obj_description(to_regclass('public." + name +"'), 'pg_class'),(select max(ext_code)+1 from public.askr_diag_table) as ext_code;")
        .then(res => {
          client.release();
          console.log('getTableUserName row count', res.rowCount);
          resolve(res.rows);
        })
        .catch(e => {
          client.release();
          console.error('getTableUserName query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });
};

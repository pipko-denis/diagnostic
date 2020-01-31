const { pool } = require('./pool');

module.exports.getParamsByTable = function (id) {
  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query('SELECT id, diag_table_id, ext_param, field_name, descr, extra_where, isdiscrete, ds_param_type	FROM public.askr_diag_table_params Where diag_table_id = $1;', [id])
        .then(res => {
          client.release();
          console.log('getParamsByTable row count', res.rowCount);
          resolve(res.rows);
          /*
          if (res.rowCount === 0) {
            console.error("Ни одной записи по указанному параметру не найдено!");
            reject("Ни одной записи по указанному параметру не найдено!");
          } else {
            resolve(res.rows);
          }
          */
        })
        .catch(e => {
          client.release();
          console.error('getParamsByTable query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });
};



module.exports.getParamsByTableName = function (name,isdt) {
  console.log('getParamsByTableName tableName = ' + name + ' isdt = '+ isdt)
  console.log(((isdt == "true") ? " AND (cols.data_type like '%timestamp%');" : " AND NOT (cols.data_type IN ('character varying','USER-DEFINED','timestamp without time zone'));"))

  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query(
          " SELECT cols.data_type, cols.column_name, (SELECT pg_catalog.col_description(c.oid, cols.ordinal_position::int) "+
          " FROM pg_catalog.pg_class c "+
          " WHERE c.oid = (SELECT CAST(CAST(('\"' || cols.table_name || '\"') as regclass) as oid)) "+
          " AND c.relname = cols.table_name) AS column_comment "+
          " FROM information_schema.columns cols WHERE cols.table_catalog = 'askr' AND cols.table_name = '" + name + "' AND cols.table_schema = 'public' "+
          ((isdt == "true") ? " AND (cols.data_type like '%timestamp%');" : " AND NOT (cols.data_type IN ('character varying','USER-DEFINED','timestamp without time zone'));")
          )
        .then(res => {
          client.release();
          console.log('getParamsByTableName row count', res.rowCount);
          resolve(res.rows);
          /*
          if (res.rowCount === 0) {
            console.error("Ни одной записи по указанному параметру не найдено!");
            reject("Ни одной записи по указанному параметру не найдено!");
          } else {
            resolve(res.rows);
          }
          */
        })
        .catch(e => {
          client.release();
          console.error('getParamsByTableName query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });
};



module.exports.getParamsCountByTable = function (id) {
  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query('SELECT COUNT(id) as cnt FROM public.askr_diag_table_params Where diag_table_id = $1;', [id])
        .then(res => {
          client.release();
          console.log('getParamsCountByTable row count', res.rowCount);
            resolve(res.rows[0].cnt);
        })
        .catch(e => {
          client.release();
          console.error('getParamsCountByTable query error', e.message, e.stack);
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
        .query('select id, diag_table_id, ext_param, field_name, descr, extra_where, isdiscrete	FROM public.askr_diag_table_params Where id = $1;', [id])
        .then(res => {
          client.release();
          console.log('Params getById row count', res.rowCount);
          if (res.rowCount === 0) {
            console.error("Ни одной записи по указанному параметру не найдено!");
            reject("Ни одной записи по указанному параметру не найдено!");
          } else {
            resolve(res.rows[0]);
          }
        })
        .catch(e => {
          client.release();
          console.error('Params getById query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });
};

module.exports.delParam = function (id) {

  console.info('delParam', id);

  //.query('delete from public.askr_diag_tablde Where id = $1;', [table_id])

  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query('delete from public.askr_diag_table_params Where id = $1;', [id])
        .then(res => {
          client.release();
          console.log('Params delTable', res.rowCount, res.command);
          resolve({ rowCount: res.rowCount });
        })
        .catch(e => {
          client.release();
          console.error('Params del query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });

};

module.exports.saveParam = function (data, table_id) {

  console.info('saveParam data:', data);

  let qText = ``;
  let params = [table_id/*data.diag_table_id*/, data.ext_param, data.field_name, data.descr, data.extra_where, data.isdiscrete, data.ds_param_type];
  if (!data.id) {
    qText = `INSERT INTO public.askr_diag_table_params(diag_table_id, ext_param, field_name, descr, extra_where, isdiscrete, ds_param_type) VALUES ( $1, $2, $3, $4, $5, $6, $7) RETURNING id,diag_table_id, ext_param, field_name, descr, extra_where, isdiscrete, ds_param_type ;`;

  } else {
    qText = `UPDATE public.askr_diag_table_params SET diag_table_id=$1, ext_param=$2, field_name=$3, descr=$4, extra_where=$5 , isdiscrete=$6, ds_param_type=$7  WHERE id = $8 RETURNING id,diag_table_id, ext_param, field_name, descr, extra_where, isdiscrete, ds_param_type;`;
    params.push(data.id);
  }

  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query(qText, params)
        .then(res => {
          client.release();
          console.log('saveParam', res.rows[0], res.command);
          if (res.rowCount === 0) {
            console.error("Ни одной записи по указанному параметру не найдено!");
            reject("Ни одной записи по указанному параметру не найдено!");
          } else {
            resolve(res.rows[0]);
          }
        })
        .catch(e => {
          client.release();
          console.error('saveParam query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });

};

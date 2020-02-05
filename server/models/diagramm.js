const { pool } = require('./pool');

module.exports.getDiagData = function (machine_id, extCode, extParam, dtBeg, dtEnd) {
  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      console.log("query begin", "SELECT dt,val,cycl_dt , to_char(cycl_dt, 'DD-MM-YYYY HH24:MI:SS') as cycl_dt2,uin,uout /**/  FROM public.askr_cycles_diag_by_period_machine (" + machine_id + "," + extCode + "," + extParam + ", '" + dtBeg + "','" + dtEnd + "');")
      client
        .query("SELECT dt,val,cycl_dt as cycl_dt2, to_char(cycl_dt, 'DD-MM-YYYY HH24:MI:SS') as cycl_dt,uin,uout /**/  FROM public.askr_cycles_diag_by_period_machine (" + machine_id + "," + extCode + "," + extParam + ", '" + dtBeg + "','" + dtEnd + "');")
        .then(res => {
          client.release();
          console.log('getDiagData row count', res.rowCount);
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
          console.error('getDiagData query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });
};


module.exports.getDates = function (params) {
  return new Promise(function (resolve, reject) {
    //resolve({ mess: "params received", parms: params});
    /*
    let req = "with cte as ( select null as dt, null as name ";
    params.tables.forEach(element => {
      req += " union all select distinct cast(" + element.dt + " as date) as dt,'" + element.name + "' as name from public." + element.name +" Where imei = "+params.imei
    });

    req += "),    cte1 as (select dt,name from cte order by name, dt)  select to_jsonb(array_agg(cte1)) from cte1;"

    resolve(req);
    */
    
    pool.connect().then(client => {
      console.log("query begin", "select distinct cast(" + params.dt + " as date) as dt  from public." + params.name + " Where imei = " + params.imei + " order by dt;")
      client
        .query("select distinct cast(cast(" + params.dt + " as date) as character varying) as dt  from public." + params.name + " Where imei = " + params.imei + " order by dt;")
        .then(res => {
          client.release();
          console.log('getDiagData row count', res.rowCount);
          resolve(res.rows);
          
            // if (res.rowCount === 0) {
            //   console.error("Ни одной записи по указанному параметру не найдено!");
            //   reject("Ни одной записи по указанному параметру не найдено!");
            // } else {
            //   resolve(res.rows);
            // }
            
        })
        .catch(e => {
          client.release();
          console.error('getDiagData query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
    
  });
};
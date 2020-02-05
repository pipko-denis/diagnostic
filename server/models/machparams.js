const { pool } = require('./pool');


module.exports.copyParamsByMachineAndType = function (from_id,from_tip,to_id,to_tip) {
  return new Promise(function (resolve, reject) {    
    if (!from_tip){
      console.error('Model copyParamsByMachineAndType error', 'Не указан исходный тип СПС');
      reject("Ошибка при обработке запроса : Не указан исходный тип СПС!");      
    }
    if (!to_tip) {
      console.error('Model copyParamsByMachineAndType error', 'Не указан конечный тип СПС');
      reject("Ошибка при обработке запроса : Не указан конечный тип СПС!");
    }
    let qWhere = "(m1.tip_id = " + from_tip+") and (m2.id is null) ";
    if (!from_id) { qWhere += "and(m1.machine_id is null)"; } else { qWhere += "and(m1.machine_id =" + from_id + ")"; }

    let to_id_or_isnull = "";
    if (!to_id) { to_id_or_isnull += " is null "; } else { to_id_or_isnull += " = " + to_id + ")"; }
    
    let str = 'INSERT INTO public.askr_diag_machine(machine_id, tip_id, diag_table_param_id, name, dim_id, presc, coef_q, coef_a, coef_b, min_val, max_val, min_acc_val, acc_val, max_acc_val, description, notify_over, notify_under) '+   
      'SELECT ' + to_id + ' as machine_id, ' + to_tip + ' as tip_id, m1.diag_table_param_id, m1.name, m1.dim_id, m1.presc, m1.coef_q, m1.coef_a, m1.coef_b, m1.min_val, m1.max_val, m1.min_acc_val, m1.acc_val, m1.max_acc_val, m1.description, m1.notify_over, m1.notify_under FROM public.askr_diag_machine as m1 left join public.askr_diag_machine as m2 on m2.machine_id ' + to_id_or_isnull + ' and m2.tip_id = ' + to_tip +' and m2.diag_table_param_id = m1.diag_table_param_id  Where ' + qWhere + ';'
    console.log(str);
    
    pool.connect().then(client => {
      client
        .query(str)
        .then(res => {
          client.release();
          console.log('copyParamsByMachineAndType row count', res.rowCount);//res.rowCount
          resolve({rowCount: res.rowCount});
        })
        .catch(e => {
          client.release();
          console.error('copyParamsByMachineAndType query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
    
  });
};


module.exports.getParamsByMachineType = function (id) {
  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query('SELECT askr_diag_machine.id, machine_id, tip_id, diag_table_param_id, name, dim_id, presc, coef_q, coef_a, coef_b, min_acc_val, acc_val, max_acc_val, description, notify_over, notify_under,askr_diag_table_params.diag_table_id,askr_diag_table_params.field_name,askr_diag_table.tbl_name,askr_diag_dims.dim_name_short  FROM public.askr_diag_machine '+
        ' left join public.askr_diag_table_params on askr_diag_table_params.id = askr_diag_machine.diag_table_param_id '+
        ' left join public.askr_diag_table on askr_diag_table.id = askr_diag_table_params.diag_table_id ' +
        ' left join public.askr_diag_dims on askr_diag_dims.id = askr_diag_machine.dim_id ' +
        ' Where tip_id = $1 and machine_id is null;', [id])
        .then(res => {
          client.release();
          console.log('getParamsByMachineType row count', res.rowCount);
          if (res.rowCount === 0) {
            console.error("Ни одной записи по указанному параметру не найдено!");
            //reject("Ни одной записи по указанному параметру не найдено!");                      
          }          
          resolve(res.rows);
        })
        .catch(e => {
          client.release();
          console.error('getParamsByMachineType query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });
};

module.exports.getAllParams = function () {
  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query('SELECT askr_diag_machine.id, machine_id, tip_id, diag_table_param_id, name, dim_id, presc '+
        ' ,coef_q, coef_a, coef_b, min_acc_val, acc_val, max_acc_val, description, notify_over, notify_under '+
        ' ,askr_diag_table_params.diag_table_id,askr_diag_table_params.field_name,askr_diag_table.tbl_name,askr_diag_dims.dim_name_short '+
        " ,askr_diag_table.ext_code, askr_diag_table_params.ext_param " +
        " ,(CASE  WHEN (not askr_machines.id is null) THEN CONCAT(mach_type.type,' ',mach_type.modification,' №', askr_machines.zav_nomer, ' (',askr_machines.cur_imei, ')') "+
               " WHEN (askr_machines.id is null) AND (not straight_tip.id is null) THEN CONCAT(straight_tip.type,' ',straight_tip.modification) "+
               " ELSE NULL END) as machine_or_tip_name "+  
        ' FROM public.askr_diag_machine ' +
        ' left join public.askr_diag_table_params on askr_diag_table_params.id = askr_diag_machine.diag_table_param_id ' +
        ' left join public.askr_diag_table on askr_diag_table.id = askr_diag_table_params.diag_table_id ' +
        ' left join public.askr_diag_dims on askr_diag_dims.id = askr_diag_machine.dim_id '+
        ' left join public.spr_machine_type as straight_tip on straight_tip.id = askr_diag_machine.tip_id ' +
        ' left join public.askr_machines on  askr_machines.id =  askr_diag_machine.machine_id '+
        ' left join public.spr_machine_type as mach_type on mach_type.id = askr_machines.tip '+
        ';')
        .then(res => {
          client.release();
          console.log('getAllParams row count', res.rowCount);
          resolve(res.rows);
        })
        .catch(e => {
          client.release();
          console.error('getAllParams query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });
};

module.exports.getParamsByMachine = function (id) {
  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query('SELECT askr_diag_machine.id, machine_id, tip_id, diag_table_param_id, name, dim_id, presc, coef_q, coef_a, coef_b, min_acc_val, acc_val, max_acc_val, description, notify_over, notify_under,askr_diag_table_params.diag_table_id,askr_diag_table_params.field_name,askr_diag_table.tbl_name,askr_diag_dims.dim_name_short  FROM public.askr_diag_machine ' +
          ' left join public.askr_diag_table_params on askr_diag_table_params.id = askr_diag_machine.diag_table_param_id ' +
          ' left join public.askr_diag_table on askr_diag_table.id = askr_diag_table_params.diag_table_id ' +
          ' left join public.askr_diag_dims on askr_diag_dims.id = askr_diag_machine.dim_id ' +
        ' Where machine_id = $1;', [id])
        .then(res => {
          client.release();
          console.log('getParamsByMachineType row count', res.rowCount);
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
          console.error('getParamsByMachineType query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });
};


module.exports.getParamsForDiag = function (id) {
  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query("SELECT id, imei, ext_code, ext_n_param, name, dim, dim_short, coef_q, coef_a , coef_b, min_val, max_val, min_acc_val, acc_val, max_acc_val , description, presc, group_name, isdiscrete, ds_param_type, concat(name,' (',group_name,')') as full_name,tbl_name,dt_field  FROM public.askr_diag_params_by_machine (" + id + " )")
        .then(res => {
          client.release();
          console.log('getParamsForDiag row count', res.rowCount);
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
          console.error('getParamsForDiag query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });
};


module.exports.delMachParam = function (id) {

  console.info('delMachParam', id);

  //.query('delete from public.askr_diag_tablde Where id = $1;', [table_id])

  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query('delete from public.askr_diag_machine Where id = $1;', [id])
        .then(res => {
          client.release();
          console.log('Params delMachParam', res.rowCount, res.command);
          resolve({ rowCount: res.rowCount });
        })
        .catch(e => {
          client.release();
          console.error('MachParam del query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });

};


module.exports.saveParam = function (data) {

  console.info('saveParam data:', data);

  let qText = ``;
  let params = [data.machine_id, data.tip_id, data.diag_table_param_id, data.name, data.dim_id, data.presc, data.coef_q, data.coef_a, data.coef_b, data.min_val, data.max_val, data.min_acc_val, data.acc_val, data.max_acc_val, data.description, data.notify_over, data.notify_under];
  if (!data.id) {
    qText = `INSERT INTO public.askr_diag_machine(machine_id, tip_id, diag_table_param_id, name, dim_id, presc, coef_q, coef_a, coef_b, min_val, max_val, min_acc_val, acc_val, max_acc_val, description, notify_over, notify_under) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id;`;

  } else {
    qText = `UPDATE public.askr_diag_machine	SET machine_id=$1, tip_id=$2, diag_table_param_id=$3, name=$4, dim_id=$5, presc=$6, coef_q=$7, coef_a=$8, coef_b=$9, min_val=$10, max_val=$11, min_acc_val=$12, acc_val=$13, max_acc_val=$14, description=$15, notify_over=$16, notify_under=$17 WHERE id = $18 RETURNING id;`;
    params.push(data.id);
  }

  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query(qText, params)
        .then(res => {
          client.release();
          console.log('saveParam db res', res.rows[0], res.command);
          if (res.rowCount === 0) {
            console.error("Ни одной записи по указанному параметру не найдено!");
            reject("Ни одной записи по указанному параметру не найдено!");
          } else {
            resolve(res.rows[0]);
          }
        })
        .catch(e => {
          client.release();
          console.error('saveParamType query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });

};



module.exports.saveParamType = function (data, type_id) {

  console.info('saveParamType data:', data);

  let qText = ``;
  let params = [null, type_id, data.diag_table_param_id, data.name, data.dim_id, data.presc, data.coef_q, data.coef_a, data.coef_b, data.min_val, data.max_val, data.min_acc_val, data.acc_val, data.max_acc_val, data.description, data.notify_over, data.notify_under];
  if (!data.id) {
    qText = `INSERT INTO public.askr_diag_machine(machine_id, tip_id, diag_table_param_id, name, dim_id, presc, coef_q, coef_a, coef_b, min_val, max_val, min_acc_val, acc_val, max_acc_val, description, notify_over, notify_under) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id, machine_id, tip_id, diag_table_param_id, name, dim_id, presc, coef_q, coef_a, coef_b, min_val, max_val, min_acc_val, acc_val, max_acc_val, description, notify_over, notify_under;`;

  } else {
    qText = `UPDATE public.askr_diag_machine	SET machine_id=$1, tip_id=$2, diag_table_param_id=$3, name=$4, dim_id=$5, presc=$6, coef_q=$7, coef_a=$8, coef_b=$9, min_val=$10, max_val=$11, min_acc_val=$12, acc_val=$13, max_acc_val=$14, description=$15, notify_over=$16, notify_under=$17 WHERE id = $18;`;
    params.push(data.id);
  }

  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query(qText, params)
        .then(res => {
          client.release();
          console.log('saveParamType', res.rows[0], res.command);
          if (res.rowCount === 0) {
            console.error("Ни одной записи по указанному параметру не найдено!");
            reject("Ни одной записи по указанному параметру не найдено!");
          } else {
            resolve(res.rows[0]);
          }
        })
        .catch(e => {
          client.release();
          console.error('saveParamType query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });

};

module.exports.saveParamMachine = function (data, machine_id) {

  console.info('saveParamMachine data:', data);

  let qText = ``;
  let params = [machine_id, data.tip_id, data.diag_table_param_id, data.name, data.dim_id, data.presc, data.coef_q, data.coef_a, data.coef_b, data.min_val, data.max_val, data.min_acc_val, data.acc_val, data.max_acc_val, data.description, data.notify_over, data.notify_under];
  if (!data.id) {
    qText = `INSERT INTO public.askr_diag_machine(machine_id, tip_id, diag_table_param_id, name, dim_id, presc, coef_q, coef_a, coef_b, min_val, max_val, min_acc_val, acc_val, max_acc_val, description, notify_over, notify_under) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id, machine_id, tip_id, diag_table_param_id, name, dim_id, presc, coef_q, coef_a, coef_b, min_val, max_val, min_acc_val, acc_val, max_acc_val, description, notify_over, notify_under;`;

  } else {
    qText = `UPDATE public.askr_diag_machine	SET machine_id=$1, tip_id=$2, diag_table_param_id=$3, name=$4, dim_id=$5, presc=$6, coef_q=$7, coef_a=$8, coef_b=$9, min_val=$10, max_val=$11, min_acc_val=$12, acc_val=$13, max_acc_val=$14, description=$15, notify_over=$16, notify_under=$17 WHERE id = $18;`;
    params.push(data.id);
  }

  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query(qText, params)
        .then(res => {
          client.release();
          console.log('saveParamMachine', res.rows[0], res.command);
          if (res.rowCount === 0) {
            console.error("Ни одной записи по указанному параметру не найдено!");
            reject("Ни одной записи по указанному параметру не найдено!");
          } else {
            resolve(res.rows[0]);
          }
        })
        .catch(e => {
          client.release();
          console.error('saveParamMachine query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });

};

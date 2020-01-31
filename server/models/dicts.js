const { pool } = require('./pool');

module.exports.getMachines = function () {
  return new Promise(function (resolve, reject) {

    console.log('SELECT askr_machines.id, predpr, tip, spr_machine_type.type,spr_machine_type.modification, zav_nomer, nomer_8zn, cur_imei, detail, espul_id, last_loc_id, last_loc_gps_datetime, spr_organizations.shortname, spr_machine_type.classification	' +
      ' ,(SELECT COUNT(id) FROM public.askr_diag_machine Where ( machine_id = askr_machines.id) ) as cnt_params ' +
      ' FROM public.askr_machines left join spr_machine_type on spr_machine_type.id = askr_machines.tip left join public.spr_organizations on spr_organizations.id = askr_machines.predpr ' +
      " Where spr_machine_type.type like '%ЩОМ%' or spr_machine_type.type like '%УК%' or spr_machine_type.type like '%ССГ%' or spr_machine_type.type like '%АДМ%' " +
      ' order by spr_machine_type.type, spr_machine_type.modification, askr_machines.zav_nomer;')

    pool.connect().then(client => {
      client
        .query('SELECT askr_machines.id, predpr, tip, spr_machine_type.type,spr_machine_type.modification, zav_nomer, nomer_8zn, cur_imei, detail, espul_id, last_loc_id, last_loc_gps_datetime, spr_organizations.shortname, spr_machine_type.classification	' +        
        ' ,(SELECT COUNT(id) FROM public.askr_diag_machine Where ( machine_id = askr_machines.id) ) as cnt_params ' +
          ' FROM public.askr_machines left join spr_machine_type on spr_machine_type.id = askr_machines.tip left join public.spr_organizations on spr_organizations.id = askr_machines.predpr '+
          " Where spr_machine_type.type like '%ЩОМ%' or spr_machine_type.type like '%УК%' or spr_machine_type.type like '%ССГ%'  or spr_machine_type.type like '%АДМ%' "+
          ' order by spr_machine_type.type, spr_machine_type.modification, askr_machines.zav_nomer;')
        .then(res => {
          client.release();
          console.log('getMachines row count', res.rowCount);
          resolve(res.rows);
        })
        .catch(e => {
          client.release();
          console.error('getMachines query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });
};
//--massa_mode, god_vypuska, srok_sluzhby, sil_agregat, sys_bezop, sdrgo, weight_limiter, nsm, data_spis, org, mtype, base, 
module.exports.getMachinesByType = function (id) {
  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query('SELECT askr_machines.id, predpr, tip, spr_machine_type.type,spr_machine_type.modification, zav_nomer, nomer_8zn, cur_imei, detail, espul_id, last_loc_id, last_loc_gps_datetime, spr_organizations.shortname, spr_machine_type.classification	' +
          ' FROM public.askr_machines left join spr_machine_type on spr_machine_type.id = askr_machines.tip left join public.spr_organizations on spr_organizations.id = askr_machines.predpr' +
          ' Where tip = &1	order by spr_machine_type.type, spr_machine_type.modification, askr_machines.zav_nomer;', [id])
        .then(res => {
          client.release();
          console.log('getMachinesByType row count', res.rowCount);
          resolve(res.rows);
        })
        .catch(e => {
          client.release();
          console.error('getMachinesByType query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });
};

module.exports.getMachinesTypes = function () {
  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query('SELECT id, type, modification, classification, espul_code ' + //developer,category, descript, 
        ' ,(SELECT COUNT(id) FROM public.askr_diag_machine Where    (machine_id is null) and tip_id = spr_machine_type.id) as cnt_type_params ' +
        ' ,(SELECT COUNT(id) FROM public.askr_diag_machine Where not(machine_id is null) and tip_id = spr_machine_type.id) as cnt_mach_params ' +
        ' ,(SELECT COUNT(id) FROM public.askr_machines Where tip  = spr_machine_type.id) as cnt_mach ' +        
        ' FROM public.spr_machine_type '+
        //" Where spr_machine_type.type like '%ЩОМ%' or spr_machine_type.type like '%УК%' " +
        ' order by type, modification;'
        )
        .then(res => {
          client.release();
          console.log('getMachinesTypes row count', res.rowCount);
          resolve(res.rows);
        })
        .catch(e => {
          client.release();
          console.error('getMachinesTypes query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!"); //Параметры работы струга ССГ - 1 askr_common_ssg1_11009
        });
    });
  });
};

module.exports.getMeasUnits = function () {
  return new Promise(function (resolve, reject) {
    pool.connect().then(client => {
      client
        .query('SELECT id, dim_name, dim_name_short	FROM public.askr_diag_dims;')
        .then(res => {
          client.release();
          console.log('getMeasUnits row count', res.rowCount);
          resolve(res.rows);
        })
        .catch(e => {
          client.release();
          console.error('getMeasUnits query error', e.message, e.stack);
          reject("Ошибка при обработке запроса базой данных: " + e.message + "!");
        });
    });
  });
};
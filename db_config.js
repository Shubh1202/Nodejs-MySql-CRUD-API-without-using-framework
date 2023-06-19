const mysql = require("mysql");
const dbHost = "localhost" ;
const dbUser = "root" ;
const dbPass = "" ;
const dbName = "school" ;

const con = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPass,
    database: dbName,
})

con.connect((err)=>{
    if(err){
        console.log(`\n\n\n --> Database connection faild....\n\n\n`);
        throw err;
    }
    console.log(`\n --> Database connection established..\n`);
});


const insetDataBase = (tableName=null, array=null, callback) => {
    if(tableName===null) throw "Provide your table name";

    if(array===null)throw "Provide your data for insert"

    let keys = Object.keys(array);
    let values = Object.values(array);

    keys = "`"+keys.join("`, `")+"`";
    values = "'"+values.join("', '")+"'";

    let query = `INSERT INTO ${tableName} (${keys}) VALUES (${values})`;

    con.query(query, (err, result)=>{
        if(err){
            throw err;
        }
        callback(result)
    })
}

const is_record_exist = ((tableName=null, array=null, callback)=>{
    if(tableName===null) throw "Provide your table name";
    if(array===null)throw "Provide your data for insert"

    let where_clause=[];
    let value;
    for(x in array){
        value = mysql.escape(array[x]);
        where_clause.push(`${x}= ${value}`);
    }

    where_clause = where_clause.join(" AND ");

    let query = `SELECT * FROM ${tableName} WHERE 1 `;

    if(where_clause.length>0){
        query += `AND ${where_clause}`;
    }

    con.query(query, (err, result)=>{
        if(err){
            throw err
        }
        callback(result)
    })
});

const delete_reocrd = ((tableName, array, callback)=>{

    let x;
    let value;
    let where_clause = [];
    for(x in array){
        value = mysql.escape(array[x]);
        where_clause.push(`${x} = ${value}`);
    }

    where_clause = where_clause.join(" AND ");

    const query = `DELETE FROM ${tableName} WHERE ${where_clause} `;
    con.query(query, (err, result)=>{
        if(err){
            throw err
        }
        callback(result);
    })
})

const select_record = ((tableName=null, selection=null, callback)=>{
    const query = `SELECT ${selection} FROM ${tableName}`;

    con.query(query, (err, result, fields)=>{
        if(err){
            throw err
        }
        callback(result)
    })
})

const update_record = ((tableName=null, array=null, where_array=null, callback)=>{

    let param = [];
    let where_clause = [];
    let x, value;
    for(x in array){
        value = mysql.escape(array[x]);
        param.push(`${x}= ${value}`);
    }

    for(x in where_array){
        value = mysql.escape(where_array[x]);
        where_clause.push(`${x} = ${where_array[x]}`);
    }

    param = param.join(", ");
    where_clause = where_clause.join(" AND ");

    let query = `UPDATE ${tableName} SET ${param} WHERE ${where_clause}`;
    con.query(query, (err, result, fields)=>{
        if(err){
            throw err
        }
        callback(result);
    })
})


module.exports = {save:insetDataBase, is_record_exist:is_record_exist, delete:delete_reocrd, select:select_record, update:update_record};
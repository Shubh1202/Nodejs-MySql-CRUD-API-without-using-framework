const crypto = require("crypto");
let tableName = "students";

const registerStudent = ((request, response) => {
    let name = request.input.name;
    let phone = request.input.phone;
    let email = request.input.email;
    let password = request.input.password;
    let gender = request.input.gender;
    let dob = request.input.dob;
    let count = true;
    let param_response;
    password = crypto.createHash("SHA256").update(password).digest("hex");

    if (!name || !phone || !email || !password || !gender || !dob) {
        request.response_data = { statusCode: 200, msg: "Name, Phone, Email, Password, Gender, Date of Birth all fields are required(*)." };
        request.redirect(request, response);
        return false;
    }

    let phone_exist = { phone: phone };
    let email_exist = { email: email };

    request.db.is_record_exist(tableName, phone_exist, (sql_response) => {
        if (sql_response.length > 0) {
            request.response_data = { statusCode: 200, msg: "Try another phone number." };
            request.redirect(request, response);
            count = false
        }
    });


    request.db.is_record_exist(tableName, email_exist, (sql_response) => {
        if (sql_response.length > 0) {
            request.response_data = { statusCode: 200, msg: "Try another email address." };
            request.redirect(request, response);
            count = false
        }
    })

    if (count === true) {
        let param = { name: name, phone: phone, email: email, password: password, gender: gender, dob: dob };
        let obj;
        request.db.save(tableName, param, (sql_response) => {
            if (sql_response.affectedRows > 0) {
                obj = { status: "success", msg: "Successfully registered" };
                param_response = { statusCode: 200, msg: JSON.stringify(obj) };
            } else {
                obj = { status: "error", msg: "Something went wrong, Please try again" };
                param_response = { statusCode: 200, msg: JSON.stringify(obj) };
            }
            request.response_data = param_response;
            request.redirect(request, response);
        });
    }

});

/******
 * Studetn Login
 */
const studentLogin = ((request, response) => {
    let email = request.input.email;
    let password = request.input.password;
    password = crypto.createHash("SHA256").update(password).digest("hex");
    if (!email || !password) {
        request.response_data = { statusCode: 200, msg: "Please enter your email and password." };
        request.redirect(request, response);
        return false;
    }

    let param = { email: email, password: password };
    let prx;
    let obj;
    request.db.is_record_exist(tableName, param, (sql_response) => {
        if (sql_response.length > 0) {
            let row_data = sql_response[0];
            let data = { name: row_data.name, phone: row_data.phone };
            prx = { status: "success", msg: "Successfully login", data: data }
            obj = JSON.stringify(prx);
            request.response_data = { statusCode: 200, msg: obj };
            request.redirect(request, response);
        } else {
            prx = { status: "error", msg: "Please enter valid login detail" }
            obj = JSON.stringify(prx);
            request.response_data = { statusCode: 200, msg: obj };
            request.redirect(request, response);
        }
    })

});

/*******
 * Single and All record
 */

const studentList = ((request, response) => {
    let url_obj = request.url_obj.searchParams;
    let id = url_obj.get("id");

    if (!id) {
        request.db.select(tableName, "*", (sql_response) => {
            let obj;
            if (sql_response.length > 0) {
                obj = { status: "success", msg: "Record list", data: sql_response };
                obj = JSON.stringify(obj, null, 5);
                request.response_data = { statusCode: 200, msg: obj };
                request.redirect(request, response)
            } else {
                obj = { status: "success", msg: "Record not exists" };
                request.response_data = { statusCode: 200, msg: obj };
                request.redirect(request, response)
            }
        })
    }

    if (id) {
        let param = { id: id };
        let obj;
        request.db.is_record_exist(tableName, param, (sql_response) => {
            if (sql_response.length > 0) {
                let row_data = sql_response[0];
                obj = { status: "success", msg: "Selected record", data: row_data }
                obj = JSON.stringify(obj);
                request.response_data = { statusCode: 200, msg: obj };
                request.redirect(request, response);
            } else {
                obj = { status: "error", msg: "Selected id not exist" }
                obj = JSON.stringify(obj);
                request.response_data = { statusCode: 200, msg: obj };
                request.redirect(request, response);
            }
        })
    }

});

/******
 * Delete Student
 */

const studentDelete = ((request, response) => {
    const url_obj = request.url_obj.searchParams;
    let id = url_obj.get("id");

    let res_obj
    if (id) {
        let where_clause = { id: id };
        request.db.delete(tableName, where_clause, (sql_response) => {
            if (sql_response.affectedRows > 0) {
                res_obj = { status: "success", msg: "Student successfully deleted" };
                res_obj = JSON.stringify(res_obj);
                request.response_data = { statusCode: 200, msg: res_obj };
                request.redirect(request, response);
            } else {
                res_obj = { status: "error", msg: "Invalid student id" };
                res_obj = JSON.stringify(res_obj);
                request.response_data = { statusCode: 200, msg: res_obj };
                request.redirect(request, response);
            }
        })
    } else {
        res_obj = { status: "error", msg: "Please provide student delete id" };
        res_obj = JSON.stringify(res_obj);
        request.response_data = { statusCode: 200, msg: res_obj };
        request.redirect(request, response);
    }

})

/*******
 * Update Student
 */
const studentUpdate = ((request, response)=>{
    let url_obj = request.url_obj.searchParams;
    let name = request.input.name;
    let phone = request.input.phone;
    let password = request.input.password;
    let gender = request.input.gender;
    let dob = request.input.dob;
    let id = url_obj.get("id") || request.input.id;
    let res_obj;

    if(!id){
        res_obj = {status:"error", msg:"Please provide student id for update record"};
        res_obj = JSON.stringify(res_obj);
        request.response_data = {statusCode:200, msg:res_obj};
        request.redirect(request, response);
        return false;
    }

    let param = {};
    if (name) {
        param = {...param, name:name};
    }
    // if (phone) {
    //     param = {...param, phone:phone};
    // }
    if (password) {
        password = crypto.createHash("SHA256").update(password).digest("hex");
        param = {...param, password:password};
    }
    if (gender) {
        param = {...param, gender:gender};
    }
    if (dob) {
        param = {...param, dob:dob};
    }

    let where_array = {id:id};

    request.db.update(tableName, param, where_array, (sql_response)=>{
        if(sql_response.affectedRows>0){
            request.db.is_record_exist(tableName, where_array, (result)=>{
                res_obj = {status:"success", msg:"Record successfully updated.", data:result[0]};
                res_obj = JSON.stringify(res_obj);
                request.response_data = {statusCode:200, msg:res_obj};
                request.redirect(request, response);
                return false;
            })
        }else{
            res_obj = {status:"error", msg:"Something went wrong, record not update."};
            res_obj = JSON.stringify(res_obj);
            request.response_data = {statusCode:200, msg:res_obj};
            request.redirect(request, response);
            return false;
        }
    });

})

module.exports = { registerStudent: registerStudent, studentLogin: studentLogin, studentDelete: studentDelete, studentList: studentList, studentUpdate:studentUpdate}
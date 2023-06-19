const student = require("../Controllers/StudentController");

module.exports = ((request, response) => {
    let pathname = request.url_obj.pathname;

    switch (pathname) {
        case "/":
            request.response_data = {statusCode:200, msg:"Welcome in node js api"};
            request.redirect(request, response);
            break;
        case "/student-register":
            student.registerStudent(request, response);
            break;
        case "/student-login":
            student.studentLogin(request, response);
            break;
        case "/student-delete":
            student.studentDelete(request, response);
            break;
        case "/student-list":
            student.studentList(request, response);
            break;
        case "/student-update":
            student.studentUpdate(request, response);
            break;
        default:
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end("Bad request url call");
            break;

    }
})
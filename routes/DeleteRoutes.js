const student = require("../Controllers/StudentController");

module.exports = ((request, response) => {
    let pathname = request.url_obj.pathname;

    switch (pathname) {
        case "/student-delete":
            student.studentDelete(request, response);
            break;
        default:
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end("Bad request url call on method");
            break;

    }
})
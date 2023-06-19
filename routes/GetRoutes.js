const fs = require("fs");
const student = require("../Controllers/StudentController");
const home = fs.readFileSync("./public/index.html", "utf-8");
module.exports = ((request, response) => {
    let pathname = request.url_obj.pathname;

    switch (pathname) {
        case "/":
            response.writeHead(200,{"Content-Type":"text/html"});
            response.end(home);
            break;
        case "/student-list":
            student.studentList(request, response);
            break;
        default:
            response.writeHead(404, { "Content-Type": "text/html" });
            response.end("<h2>404 Page not found</h2>");
            break;

    }
})
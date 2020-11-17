const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");

const team = [];
const employeeID = [];

const initialQuestion = [
  {
    type: "confirm",
    message: "Would you like to add an employee?",
    name: "addAnotheremployee",
  },
];

const manager = [
  {
    type: "input",
    name: "name",
    message: "What is your name?",
  },
  {
    type: "input",
    name: "id",
    message: "What is your employee ID?",
    validate: function (value) {
      var num = /^[0-9]*$/;
      var pass = value.match(num) && !employeeID.includes(value);

      if (pass) {
        return true;
      } else {
        return "ID must be a number and cannot be an ID which has already been assigned";
      }
    },
  },
  {
    type: "input",
    name: "email",
    message: "What is your email?",
    validate: function (value) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var pass = value.match(re);
      if (pass) {
        return true;
      } else {
        return "Please enter a valid email";
      }
    },
  },
  {
    type: "input",
    message: "What is your office number?",
    name: "officeNumber",
    validate: function (value) {
      var num = /^[0-9]*$/;
      var pass = value.match(num);

      if (pass) {
        return true;
      } else {
        return "ID must be a number";
      }
    },
  },
];

const engineer = [
  {
    type: "input",
    name: "name",
    message: "What is the employee name?",
  },
  {
    type: "input",
    name: "id",
    message: "What is the employee ID?",
    validate: function (value) {
      var num = /^[0-9]*$/;
      var pass = value.match(num) && !employeeID.includes(value);

      if (pass) {
        return true;
      } else {
        return "ID must be a number and cannot be an ID which has already been assigned";
      }
    },
  },
  {
    type: "input",
    name: "email",
    message: "What is the employee email?",
    validate: function (value) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var pass = value.match(re);
      if (pass) {
        return true;
      } else {
        return "Please enter a valid email";
      }
    },
  },
  {
    type: "input",
    message: "What is your GitHub ID?",
    name: "github",
  },
];

const intern = [
  {
    type: "input",
    name: "name",
    message: "What is the employee name?",
  },
  {
    type: "input",
    name: "id",
    message: "What is the employee ID?",
    validate: function (value) {
      var num = /^[0-9]*$/;
      var pass = value.match(num) && !employeeID.includes(value);

      if (pass) {
        return true;
      } else {
        return "ID must be a number and cannot be an ID which has already been assigned";
      }
    },
  },
  {
    type: "input",
    name: "email",
    message: "What is the employee email?",
    validate: function (value) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var pass = value.match(re);
      if (pass) {
        return true;
      } else {
        return "Please enter a valid email";
      }
    },
  },
  {
    type: "input",
    message: "What is the name of the school?",
    name: "school",
  },
];

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

function addEngineer() {
  inquirer.prompt(engineer).then((response) => {
    const engineer = new Engineer(
      response.name,
      response.id,
      response.email,
      response.github
    );

    team.push(engineer);
    employeeID.push(response.id);
    addEmployee();
  });
}

function addManager() {
  inquirer.prompt(manager).then((response) => {
    const manager = new Manager(
      response.name,
      response.id,
      response.email,
      response.officeNumber
    );
    team.push(manager);
    addEmployee();
  });
}

function addIntern() {
  inquirer.prompt(intern).then((response) => {
    const intern = new Intern(
      response.name,
      response.id,
      response.email,
      response.school
    );
    team.push(intern);
    addEmployee();
  });
}

function getEmployeeInformation() {
  inquirer
    .prompt({
      type: "list",
      message: "What kind of employee would you like to add?",
      name: "role",
      choices: ["Engineer", "Intern", "Manager"],
    })
    .then((response) => {
      switch (response.role) {
        case "Manager":
          addManager();
          break;
        case "Engineer":
          addEngineer();
          break;
        case "Intern":
          addIntern();
          break;
      }
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: "Would you like to add an employee?",
        name: "addEmployee",
      },
    ])
    .then((response) => {
      if (response.addEmployee) {
        getEmployeeInformation();
      } else {
        writeToFile();
        console.log(team);
        return;
      }
    });
}

getEmployeeInformation();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

function writeToFile() {
  const rendered = render(team);
  fs.writeFileSync(outputPath, rendered, "UTF-8");
}

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

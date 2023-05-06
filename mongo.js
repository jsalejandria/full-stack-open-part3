const mongoose = require("mongoose");

const password = process.argv[2];
const newName = process.argv[3];
const newNumber = process.argv[4];
const url = `mongodb+srv://jsalejandria:${password}@phonebook.u4gmhcq.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
} else if (process.argv.length === 3) {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name + " " + person.number);
    });
    mongoose.connection.close();
    process.exit(1);
  });
}

const person = new Person({
  name: `${newName}`,
  number: `${newNumber}`,
});

if (newName === undefined || newNumber === undefined) {
  return;
} else {
  person.save().then((result) => {
    console.log(`added ${newName} with number ${newNumber} to phonebook`);
    mongoose.connection.close();
  });
}

/*
Person.find({}).then((result) => {
  result.forEach((person) => {
    console.log(person);
  });
  mongoose.connection.close();
});
*/

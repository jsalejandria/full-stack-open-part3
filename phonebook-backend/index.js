const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("build"));

morgan.token("postInfo", (request) => {
  if (request.method == "POST") {
    return JSON.stringify(request.body);
  } else {
    return " ";
  }
});

app.use(
  morgan(
    ":method :url :status : res[content-length] - :response-time ms :postInfo"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 999999999);
};

app.get("/", (request, response) => {
  response.send("<h1>Welcome to your Phonebook</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  //const id = Number(request.params.id);
  //const person = persons.find((person) => person.id === id);
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).json({ error: "Not found" }).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/info", async (request, response) => {
  const numOfContacts = await Person.estimatedDocumentCount();
  const dateToday = new Date();

  response.send(
    `<p>Phonebook has info for ${numOfContacts} people<br><br>${dateToday}</p>`
  );
});

app.delete("/api/persons/:id", (request, response, next) => {
  //const id = Number(request.params.id);
  //persons = persons.filter((person) => person.id !== id);
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const id = body.id;
  const query = { name: body.name };

  const person = {
    name: body.name,
    number: body.number,
    id: body.id,
  };

  Person.findOneAndUpdate(query, person, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (body.name === undefined || body.number === undefined) {
    return response
      .status(400)
      .json({ error: "Missing details for name or number" })
      .end();
  }

  /*
  if (persons.find((person) => person.name === body.name)) {
    return response
      .status(400)
      .json({ error: "The contact already exists" })
      .end();
  } else {}
  */
  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number,
  });

  //persons = persons.concat(person);
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);

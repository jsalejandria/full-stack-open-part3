const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

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
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ error: "Not found" }).end();
  }
  response.json(person);
});

app.get("/info", (request, response) => {
  const numOfContacts = persons.length;
  const dateToday = new Date();

  response.send(
    `<p>Phonebook has info for ${numOfContacts} people<br><br>${dateToday}</p>`
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response
      .status(400)
      .json({ error: "Missing details for name or number" })
      .end();
  }

  if (persons.find((person) => person.name === body.name)) {
    return response
      .status(400)
      .json({ error: "The contact already exists" })
      .end();
  } else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };

    persons = persons.concat(person);

    response.json(person);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);

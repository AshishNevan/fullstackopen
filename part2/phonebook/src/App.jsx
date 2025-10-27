import personService from "./services/persons";

import { useState, useEffect } from "react";

const Filter = ({ search, setSearch }) => {
  return (
    <div>
      filter shown with:{" "}
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
    </div>
  );
};

const RenderPersons = ({ persons, setPersons }) => {
  return persons.map((person) => {
    return (
      <div key={person.id}>
        <p>
          {person.name} : {person.number}
        </p>
        <button
          onClick={() => {
            confirm(`Do you really want to delete ${person.name}`) &&
              personService
                .remove({ id: person.id })
                .then((response_data) => {
                  console.log("deleting person", person);
                  setPersons(
                    persons.filter((person) => person.id != response_data.id)
                  );
                })
                .catch((err) => console.log("error deleting", err));
          }}
        >
          delete
        </button>
      </div>
    );
  });
};

const PersonForm = ({ persons, setPersons, setMessage, setMessageType }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      persons.reduce(
        (exists, person) => exists || newName === person.name,
        false
      )
    ) {
      if (
        confirm(
          `${newName} is already added to phonebook, do you want to update the phone number?`
        )
      ) {
        const oldPerson = persons.find((person) => person.name === newName);
        personService
          .update({ id: oldPerson.id, name: oldPerson.name, number: newNumber })
          .then((updatedPerson) => {
            console.log(
              "updated person from ",
              updatedPerson,
              "to",
              updatedPerson
            );
            setPersons(
              persons.map((person) =>
                person.id === oldPerson.id ? updatedPerson : person
              )
            );
            setMessage(`updated ${updatedPerson.name}`);
            setMessageType("success");
            setTimeout(() => {
              setMessage("");
              setMessageType("");
            }, 5000);
          })
          .catch((err) => {
            console.log("failed to update the contact", err);
            setMessage(
              `Information of ${oldPerson.name} has already been removed from the server`
            );
            setMessageType("error");
            setTimeout(() => {
              setMessage("");
              setMessageType("");
            }, 5000);
            setPersons(persons.filter((person) => person.id !== oldPerson.id));
          });
      }
    } else {
      personService
        .create({ newName, newNumber })
        .then((newPerson) => {
          console.log("adding new person", newPerson);
          setPersons(persons.concat(newPerson));
          console.log("added new person", newPerson);
          setMessage(`added ${newPerson.name}`);
          setMessageType("success");
          setTimeout(() => {
            setMessage("");
            setMessageType("");
          }, 5000);
        })
        .catch((err) => {
          console.log("failed to add new contact", err);
          setMessage(`Failed to add ${newName} to the server`);
          setMessageType("error");
          setTimeout(() => {
            setMessage("");
            setMessageType("");
          }, 5000);
        });
      setNewName("");
      setNewNumber("");
    }
  };
  return (
    <div>
      <h2>add new</h2>

      <form onSubmit={handleSubmit}>
        <div>
          name:{" "}
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

const UserNotification = ({ message, type }) => {
  if (message === null) {
    return null;
  }
  return <div className={type}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fetchPersons = () => {
    console.log("fetching persons");
    personService
      .getAll()
      .then((response) => setPersons(response))
      .catch((err) => console.log("failed to fetch contacts", err));
  };
  useEffect(fetchPersons, []);
  const filteredPersons =
    search === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().startsWith(search)
        );
  return (
    <div>
      <h1>Phonebook</h1>
      <UserNotification message={message} type={messageType} />
      <Filter search={search} setSearch={setSearch} />
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        setMessage={setMessage}
        setMessageType={setMessageType}
      />
      <h2>Numbers</h2>
      <RenderPersons persons={filteredPersons} setPersons={setPersons} />
    </div>
  );
};

export default App;

import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const create = ({ newName, newNumber }) => {
  const response = axios.post(baseUrl, {
    name: newName,
    number: newNumber,
  });
  return response.then((response) => response.data);
};

const getAll = () => {
  const respose = axios.get(baseUrl);
  return respose.then((response) => response.data);
};

const remove = ({ id }) => {
  const response = axios.delete(`${baseUrl}/${id}`);
  return response.then((response) => response.data);
};

const update = ({ id, name, number }) => {
  const response = axios.put(`${baseUrl}/${id}`, { id, name, number });
  return response.then((response) => response.data);
};

export default {
  getAll,
  create,
  remove,
  update,
};

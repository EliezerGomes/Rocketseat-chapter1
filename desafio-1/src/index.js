const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(uName => uName.username === username);

  if(!user){
    return response.status(400).json({ error: "Username não encontrado" });
  }

  request.user = user; //Aqui terei acesso as informações apenas do usuario logado

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const usernameExists = users.some((uName) => uName.username === username);

  if(usernameExists){
    return response.status(400).json({ error: "Username já está cadastrado" });
  }

  const user = {
    name,
    username,
    id: uuid(),
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { user } = request;

  const todo = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo_id) => todo_id.id === id);

  if(!todo){
    return response.status(404).json({ error: "Todo não encontrada" });
  }

  todo.title = title;
  todo.deadline = deadline

  return response.json(user);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find((todo_id) => todo_id.id === id);

  if(!todo){
    return response.status(404).json({ error: "Tarefa não encontrada" });
  }

  todo.done = true;

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todoIndex = user.todos.findIndex(todo_id => todo_id.id === id);

  if(todoIndex === -1){
    return response.status(404).json({ error: "Todo não encontrada" });
  }
  
  user.todos.splice(todoIndex, 1);

  console.log(user)

  return response.status(204);
});

module.exports = app;
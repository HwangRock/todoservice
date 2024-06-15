import React from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import { Paper, List, Container, Grid, Button, AppBar, Toolbar, Typography, TextField } from '@material-ui/core';
import './App.css';
import { call, signout } from './service/ApiService';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      darkMode: false,
      page: 0,
      size: 5,
      keyword: ''
    };
  }

  add = (item) => {
    call("/todo", "POST", item).then(() => this.fetchTodos());
  }

  delete = (item) => {
    call("/todo", "DELETE", item).then(() => this.fetchTodos());
  }

  update = (item) => {
    call("/todo", "PUT", item).then(() => this.fetchTodos());
  }

  deleteCompleted = () => {
    call("/todo/completed", "DELETE", null).then(() => this.fetchTodos());
  }

  componentDidMount() {
    this.fetchTodos();
  }

  fetchTodos = () => {
    const { page, size, keyword } = this.state;
    call(`/todo?page=${page}&size=${size}&keyword=${keyword}`, "GET", null).then((response) => {
      const items = response.data;
      const totalItems = items.length;
      const completedItems = items.filter(item => item.done).length;
      this.setState({ items, totalItems, completedItems, loading: false });
    });
  }

  changePage = (newPage) => {
    this.setState({ page: newPage, loading: true }, this.fetchTodos);
  }

  toggleDarkMode = () => {
    this.setState({ darkMode: !this.state.darkMode });
  }

  handleSearchChange = (event) => {
    this.setState({ keyword: event.target.value });
  }

  handleSearch = () => {
    this.setState({ loading: true }, this.fetchTodos);
  }

  calculateCompletionRate = () => {
    const { totalItems, completedItems } = this.state;
    return totalItems === 0 ? 0 : (completedItems / totalItems) * 100;
  }

  render() {
    const { items, darkMode, page, keyword } = this.state;
    const completionRate = this.calculateCompletionRate().toFixed(1);

    var todoItems = items.length > 0 && (
      <Paper style={{ margin: 16 }}>
        <List>
          {items.map((item, idx) => (
            <Todo item={item} key={item.id} delete={this.delete} update={this.update} />
          ))}
        </List>
      </Paper>
    );

    var navigationBar = (
      <AppBar position="static">
        <Toolbar>
          <Grid justify="space-between" container>
            <Grid item>
              <Typography variant="h6">오늘의 할일</Typography>
            </Grid>
            <Grid item>
              <Button color="inherit" onClick={signout}>logout</Button>
              <Button color="inherit" onClick={this.toggleDarkMode}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );

    var todoListPage = (
      <div>
        {navigationBar}
        <Container maxWidth="md">
          <AddTodo add={this.add} />
          <TextField
            label="검색"
            value={keyword}
            onChange={this.handleSearchChange}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                this.handleSearch();
              }
            }}
            style={{ marginTop: '20px' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleSearch}
            style={{ marginTop: '20px', marginLeft: '10px' }}
          >
            검색
          </Button>
          <div className="TodoList">{todoItems}</div>
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            달성률: {completionRate}%
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.deleteCompleted}
            style={{ marginTop: '20px' }}
          >
            완료 항목 삭제
          </Button>
          <div style={{ marginTop: '20px' }}>
            <Button 
              onClick={() => this.changePage(page - 1)} 
              disabled={page === 0}
              style={{ backgroundColor: '#f0f0f0', color: '#000', marginRight: '10px' }}
            >
              이전
            </Button>
            <Button 
              onClick={() => this.changePage(page + 1)}
              style={{ backgroundColor: '#f0f0f0', color: '#000' }}
            >
              다음
            </Button>
          </div>
        </Container>
      </div>
    );

    var loadingPage = (
      <div style={{ textAlign: 'center', marginTop: '20px', color: darkMode ? '#fff' : '#000' }}>
        <h1>로딩중..</h1>
      </div>
    );
    
    var content = loadingPage;

    if (!this.state.loading) {
      content = todoListPage;
    }

    return (
      <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
        {content}
        <div style={{ marginTop: '700px', marginLeft: '100px' }}>TODO-LIST</div>
      </div>
    );
  }
}

export default App;

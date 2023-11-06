import React, { Component } from 'react';
import { Table, Button, Input } from 'reactstrap';
import ModalForm from '../Modals/Modal';

class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: '',
      sortOrder: 'asc',
      sortBy: 'created_at',
    };
  }

    
  deleteItem = id => {
    let confirmDelete = window.confirm('Delete user?')
    if (confirmDelete) {
      fetch(`http://localhost:9000/user/${id}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(item => {
          this.props.deleteItemFromState(id)
        })
        .catch(err => console.log(err))
    }

  }
  
  toggleSortOrder = () => {
    this.setState((prevState) => ({
      sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  
  toggleSortField = () => {
    this.setState((prevState) => ({
      sortBy: prevState.sortBy === 'created_at' ? 'updated_at' : 'created_at',
    }));
  };

  
  sortItemsByField = (items, field) => {
    const sortedItems = [...items];

    sortedItems.sort((a, b) => {
      const valueA = new Date(a[field]);
      const valueB = new Date(b[field]);

      if (this.state.sortOrder === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    return sortedItems;
  };

  
  renderItems = (items) => {
    return items.map((item) => (
      <tr key={item.id}>
        <th scope="row">{item.name}</th>
        <td>{item.email}</td>
        <td>{item.phone}</td>
        <td>{item.created_at}</td>
        <td>{item.updated_at}</td>
        <td>
          <div style={{ width: "110px" }}>
            <ModalForm buttonLabel="Edit" item={item} updateState={this.props.updateState} />
            {' '}
            <Button color="danger" onClick={() => this.deleteItem(item.id)}>Del</Button>
          </div>
        </td>
      </tr>
    ));
  };

  render() {
    const { searchName, sortOrder, sortBy } = this.state;
    const { items } = this.props;

    
    const filteredItemsByName = items.filter((item) =>
      item.name.toLowerCase().includes(searchName.toLowerCase())
    );

    
    const sortedItems = this.sortItemsByField(filteredItemsByName, sortBy);

    return (
      <div>
        <Input
          type="text"
          placeholder="Pesquisar por nome"
          value={searchName}
          onChange={this.handleSearchChange}
        />
        <Button color="primary" onClick={this.clearSearch}>
          Limpar Pesquisa
        </Button>
        <Button color="info" onClick={this.toggleSortOrder}>
          Ordenar por Data de {sortBy === 'created_at' ? 'Criação' : 'Atualização'} {sortOrder === 'asc' ? 'ascendente' : 'descendente'}
        </Button>
        <Button color="success" onClick={this.toggleSortField}>
          Alternar entre Criação e Atualização
        </Button>
        <Table responsive hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Create_At</th>
              <th>Updated_at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.renderItems(sortedItems)}</tbody>
        </Table>
      </div>
    );
  }
}

export default DataTable;

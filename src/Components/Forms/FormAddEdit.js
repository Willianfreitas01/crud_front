import React from 'react';
import {Form, FormGroup, Label, Input, Button } from 'reactstrap';


class AddEditForm extends React.Component {
  state = {
    id: 0,
    name: '',
    email: '',
    phone: '',
  }
  

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  
  deleteItem = id => {
    let confirmDelete = window.confirm('Delete item forever?')
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

  submitFormAdd = e => {
    e.preventDefault()
    fetch(`http://localhost:9000/user`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.name,
        email:this.state.email,
        phone: this.state.phone,
      })
    })
      .then(response => response.json())
      .then(item => {
        if (Array.isArray(item)) {
          this.props.addItemToState(item[0])
          this.props.toggle()
        } else {
          console.log('failure')
        }
      })
      .catch(err => console.log(err))
  }

  submitFormEdit = e => {
    e.preventDefault()
    fetch(`http://localhost:9000/user/${this.state.id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.name,
        email:this.state.email,
        phone: this.state.phone,
      })
    })
      .then(response => response.json())
      .then(item => {
        if (Array.isArray(item)) {
          this.props.updateState(item[0])
          this.props.toggle()
        } else {
          console.log('failure')
        }
      })
      .catch(err => console.log(err))
  }

  componentDidMount() {
    if (this.props.item) {
      const { id, name, email, phone, create_at, update_at} = this.props.item
      this.setState({ id, name, email,phone, create_at, update_at})
    }
  }
  

  render() {
    return (
      <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
       <FormGroup>
          <Label for="name">Name</Label>
          <Input type="text" name="name" id="name" onChange={this.onChange} value={this.state.name === null ? '' : this.state.name} />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="text" name="email" id="email" onChange={this.onChange} value={this.state.email === null ? '' : this.state.email} />
        </FormGroup>
        <FormGroup>
          <Label for="phone">phone</Label>
          <Input type="number" name="phone" id="phone" onChange={this.onChange} value={this.state.phone === null ? '' : this.state.phone} />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    );
  }
}

export default AddEditForm
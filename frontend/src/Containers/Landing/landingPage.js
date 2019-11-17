import React, { Component } from 'react';
import './styles.css';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';

const mapStateToProps = state => {
    return {
        userAsync: state.users.async,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getUser: (id) => dispatch({ type: 'GET_USER_INFO', payload: id })
    }
}

const FormRow = props => (<div className="row mt-3">
    <div className="col-12">
        <label>{props.label}</label>
    </div>
    <div className="col-12">
        <input type={props.inputType} className="form-control" name={props.name} onChange={props.onChange} />
    </div>
</div>)

class LandingPage extends Component {
    state = {
        username: '',
        password: '',
    }
    login = (e) => {
        if (this.state.username === 'monni') {
            this.props.getUser(1);
            this.setState({ status: '' });
        } else {
            this.setState({ status: 'Incorrect credentials' })
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        return (
            <div style={{ padding: '30px', minHeight: 'calc(100vh - 75px )', backgroundColor: '#f3f3f3' }}>
                <div className="row mt-4">
                    <div className="col-4 offset-4" style={{ alignItems: 'center' }}>
                        <div className="card p-3" style={{ borderColor: '#012877' }}>
                            <h4>Authenticate</h4>
                            <FormRow label="Username" inputType="text" name="username" onChange={this.handleChange} />
                            <FormRow label="Password" inputType="password" name="password" onChange={this.handleChange} />
                            <div className="row">
                                <div className="col-12 pt-3">
                                    {this.props.userAsync === 'FETCHING' ? <ReactLoading type="bubbles" color="#012877" /> : <button className="btn btn-primary" onClick={this.login}>
                                        Sign in
                                    </button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
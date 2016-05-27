import React, { Component, PropTypes } from 'react';
import Formsy from 'formsy-react';
import { Row, Col, Alert,FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';

import FormInput from './../../components/form/input/FormInput';
import SubmitButton from './../../components/form/button/SubmitButton';

import { loginUser } from '../../actions/login/login';

class Login extends Component {

    constructor(props) {
        super(props);

        this.enableSubmitButton = this.enableSubmitButton.bind(this);
        this.disableSubmitButton = this.disableSubmitButton.bind(this);

    }

    getInitialState() {
        return {
            canSubmit: false
        }
    }

    enableSubmitButton() {
        this.setState({
            canSubmit: true
        });
    }

    disableSubmitButton() {
        this.setState({
            canSubmit: false
        });
    }

    render() {

        return (
            <div>
                <Formsy.Form
                    className="form-horizontal"
                    onValidSubmit={this.props.onSubmit}
                    onValid={this.enableSubmitButton}
                    onInvalid={this.disableSubmitButton}
                >
                    <Row>
                        <Col md={3} mdOffset={4}>
                            <FormInput
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Username"
                                required
                            />
                            <FormInput
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                            />
                            <SubmitButton bsStyle="primary" block type="submit" disabled={!this.state.canSubmit}>
                                Login
                            </SubmitButton>
                            {
                                this.props.error
                                &&
                                <FormGroup>
                                    <Alert bsStyle="danger" className="text-center">
                                        {this.props.error.statusText}
                                    </Alert>
                                </FormGroup>
                            }
                        </Col>
                    </Row>
                </Formsy.Form>
            </div>
        )
    }

}

function mapStateToProps(state) {

    return {
        error: state.authentication.error
    }
    
}

function mapDispatchToProps(dispatch, ownProps) {

    return {
        onSubmit: (data) => {
            const username = data.username.trim();
            const password = data.password.trim();
            const credentials = { username, password };
            const location = ownProps.location;
            const redirect = location.state && location.state.nextPathname;
            dispatch(loginUser(credentials, redirect));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
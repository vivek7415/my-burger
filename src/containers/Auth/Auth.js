import React from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button'; 
import classes from './Auth.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
class Auth extends React.Component {
    
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address',
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password',
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 8,
                },
                valid: false,
                touched: false,
            },
        },
        isSignUp: true,
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls.validation),
                touched: true,
            }
        };
        this.setState({controls: updatedControls});
    }

    componentDidMount () {
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }

    checkValidity(value, rules) {
        let isValid = true;
        if(!rules){
            return true;
        }
        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }
        if(rules.minLength){
            isValid = value.length <= rules.minLength && isValid;
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }

    SubmitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
    }
     
    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return{isSignUp: !prevState.isSignUp};
        })
    }

    render () {

        const formElement = [];
        for (let key in this.state.controls) {
            formElement.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let form = formElement.map( formElement => (
            <Input
                key = {formElement.id}
                elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        inValid = {!formElement.config.valid}
                        shouldValidate = {formElement.config.validation}
                        touched = {formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                />
        ));

        if(this.props.loading){
            form = <Spinner/>
        }

        let errorMessage = null;

        if(this.props.error){
            errorMessage = <p>{this.props.error.message}</p>
        }

        let authRedirect = null;

        if(this.props.isAuthenticated){
            authRedirect = <Redirect to = {this.props.authRedirect}/>
        }
        return (
            <div className = {classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit = { this.SubmitHandler}>
                    {form}
                    <Button 
                        btnType = 'Success'>SUBMIT
                    </Button>
                    <Button 
                        btnType = 'Danger'
                        clicked = {this.switchAuthModeHandler}> 
                                  SWITCH TO {this.state.isSignUp ? "SIGN IN" : 'SIGN UP'}
                    </Button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token != null,
        buildingBurger: state.burgerBuilder.building,
        authRedirect: state.auth.authRedirectPath,  
    };
};

const mapDispatchToProps = dispatch => {
    return{
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
import React, { Component } from 'react';
import Layout from './components/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
// import Checkout from './containers/Checkout/Checkout';
import {Route, Switch, withRouter, Redirect } from 'react-router-dom';
// import Orders from './containers/Orders/Orders';
// import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';


// ************** LAZY LOADING *********//

import asyncComponent from './hoc/asyncComponent/asyncComponent';

const asyncCheckout = asyncComponent(() => {
  return import ('./containers/Checkout/Checkout');
});

const asyncOrder = asyncComponent(() => {
  return import ('./containers/Orders/Orders');
});

const asyncAuth = asyncComponent(() => {
  return import ('./containers/Auth/Auth');
});

class App extends Component {
  // state = {
  //   show:true,
  // }
  // componentDidMount() {
  //   setTimeout(() => {
  //     this.setState({show:false});
  //   }, 5000);
  // }

  componentDidMount () {
    this.props.onTryAutoSignup();
  }

  render() {

    let routes = (
      <Switch>
        <Route path = '/auth' component = {asyncAuth}/>
        <Route path = '/' exact component = {BurgerBuilder}/>
        <Redirect to = '/'/>
      </Switch>
    );

    if(this.props.isAuthenticated){
      routes = (
        <Switch>
          <Route path = '/checkout' component = {asyncCheckout}/>                      
          <Route path = '/logout' component = {Logout}/>
          <Route path = '/orders' component = {asyncOrder}/>
          <Route path = '/auth' component = {asyncAuth}/>
          <Route path = '/' exact component = {BurgerBuilder}/>
          <Redirect to = '/' />
        </Switch>
      );
    }

    return (
      <div>
        
        <Layout>
            {/* {this.state.show ? <BurgerBuilder /> : null} */}
            {/* <Switch>
            <Route path = '/checkout' component = {Checkout}/>            
            <Route path = '/auth' component = {Auth}/>
            <Route path = '/' component = {BurgerBuilder}/>
            <Route path = '/logout' component = {Logout}/>
            <Route path = '/orders' component = {Orders}/>
            </Switch> */}

            {routes}

          </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token != null,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()), 
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

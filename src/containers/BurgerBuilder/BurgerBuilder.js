import React,{Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
// import { Redirect } from 'react-router-dom';

// const INGREDIENT_PRICES = {
//     salad: 0.5,
//     cheese: 0.4,
//     meat: 1.3,
//     bacon: 0.7
// };

export class BurgerBuilder extends Component{
    // outdated way of state
    
    // constructor(props){
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        // ingredients: null,
        // totalPrice: 4,
        // purchasable: false,
        purchasing:false,
        //loading: false,
        // error: null,
    }

    updatePurchaseState (ingredients) {
        const sum = Object
                    .keys(ingredients)
                    .map(igKey =>{
                        return ingredients[igKey]
                    })
                    .reduce((sum, el)=>{
                        return sum+el;
                    },0);
        // this.setState({purchasable:sum>0});
        return sum>0;
    }

    //******we are handling this using redux***************

    // addIngredientHandler = (type)=>{
    //     const oldCount = this.state.ingredients[type];
    //     const updtaedCount = oldCount+1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updtaedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice  = oldPrice+priceAddition;
    //     this.setState({totalPrice:newPrice, ingredients:updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients);
    // }
    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     // if (oldCount <=0){
    //     //     return;
    //     // }
    //     const updtaedCount = oldCount-1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updtaedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice  = oldPrice-priceAddition;
    //     this.setState({totalPrice:newPrice, ingredients:updatedIngredients})
    //     this.updatePurchaseState(updatedIngredients);
    // }

    purchaseHandler = () => {
        if(this.props.isAuthenticated) {
            this.setState({purchasing:true});
        }else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
 
        
    }
    purchaseCancelHandler = ()=>{
        this.setState({purchasing:false});
    }
    purchaseContinueHandler = ()=>{
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
        // alert('You Continue...');
        // this.setState({loading: true});
        // const order = {
        //     ingredients: this.state.ingredients,
        //     customer: {
        //         name: 'Vivek Singh',
        //         address: {
        //             street: 'test street',
        //             zipcode: '412351',
        //             country: 'India'
        //         },
        //         email: 'test@test.com',
        //     },
        //     deliveryMethod: 'fastest'
        // }
        // axios.post('/orders.json', order)
        //      .then(response => 
        //         this.setState({loading: false, purchasing: false}))
        //      .catch(error => 
        //         this.setState({loading: false, purchasing: false}));
       
    //    ****removing this because passing this info using redux******
        // const queryParams = [];
        // for(let i in this.state.ingredients){
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price='+this.state.totalPrice);
        // const queryString = queryParams.join('&');


    }

    componentDidMount () {

        // below method is for fetching content from server we
        // will do it soon by using redux

        // axios.get('https://vsk-burger.firebaseio.com/ingredients.json')
        //      .then(response => {
        //          console.log(response);
        //          this.setState({ingredients: response.data});
        //      }
        //      )
        //      .catch(error =>{
        //          this.setState({error:true});
        //      });

        //******redux method */
        this.props.onInitIngredients();
    }
    

    render(){
        const disabledInfo = {
            // ...this.state.ingredients
            ...this.props.ings
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0;
        }
        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
        // console.log(this.state.ingredients);
        // if(this.state.ingredients){
            if(this.props.ings){
            
            burger = (
            <Aux>
            {/* <Burger ingredients= {this.state.ingredients} /> */}
            <Burger ingredients= {this.props.ings} /> 
                <BuildControls 
                ingredientAdded = {this.props.onIngredientAdded}
                ingredientRemoved = {this.props.onIngredientRemoved}
                disabled = {disabledInfo}
                //purchasable = {this.state.purchasable}
                purchasable = {this.updatePurchaseState(this.props.ings)}
                isAuth = {this.props.isAuthenticated}
                ordered = {this.purchaseHandler}
                //{/* price = {this.state.totalPrice}/> */}
                price = {this.props.price}/>

            </Aux>
        );
        orderSummary =  
        // {/* <OrderSummary ingredients = {this.state.ingredients}  */}
        <OrderSummary ingredients = {this.props.ings} 
        //{/* price = {this.state.totalPrice} */}
        price = {this.props.price}
        purchaseCanceled = {this.purchaseCancelHandler}
        purchaseContinue = {this.purchaseContinueHandler}/>;
        }
        if(this.state.loading){
            orderSummary = <Spinner />;
        }

        return (
          <Aux>
              <Modal show = {this.state.purchasing}
                        modalClosed={this.purchaseCancelHandler}>
                        {orderSummary}
              </Modal>
             {burger}
          </Aux>  
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredients(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredients(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
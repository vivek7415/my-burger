import React from 'react';
import Aux from '../Aux';
import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
     return class extends React.Component {
        
        state = {
            error: null,
        }
        
        componentWillMount () {
            this.reqInterceptors = axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            });
            this.resInterceptors = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
                
            });
        }
        componentWillUnmount () {
            // console.log("will unmount", this.reqInterceptors, this.resInterceptors);
            axios.interceptors.request.eject(this.reqInterceptors);
            axios.interceptors.response.eject(this.resInterceptors);
        } 
        errorConfirmedHandler = () => {
            this.setState({error:null});
            console.log(this.state.error);
        }
        render() {
             return (
                <Aux>
                    {/* {console.log(this.state.error)} */}
                    <Modal 
                        show = {this.state.error !==null}
                        modalClosed = {this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message :null}
                        {/* Something Went Wrong!!! */}
                    </Modal>
                   <WrappedComponent {...this.props} />
               </Aux>
            );
         }
     }
}

 export default withErrorHandler;
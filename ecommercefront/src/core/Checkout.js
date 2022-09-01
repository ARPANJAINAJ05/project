import React,{useState,useEffect} from 'react';
import { getProducts,getBraintreeClientToken,processPayment,createOrder } from './apiCore';
// import Card from './Card';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react'
import { emptyCart } from './cartHelpers';

const Checkout = ({ products,setRun = f => f, run = undefined }) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    });
    // console.log("st",data);
    let deliveryad=data.address;

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then(data => {
            if (data.error) {
                // console.log(data.error);
                setData({ ...data, error: data.error });
            } else {
                 console.log(data);
                setData({ clientToken: data.clientToken });   // so we have clientToken for braintree from our backend
            }
        });
    };
    const handleAddress = event => {
        setData({ ...data, address: event.target.value });
    };
    useEffect(() => {   // gets token from backend when cart component mounts or state changes
        getToken(userId, token);
    }, []);

    // const handleAddress = event => {
    //     setData({ ...data, address: event.target.value });
    // };

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };

    const showCheckout = () => {
        return isAuthenticated() ? (       // if signed in=>show payment options
            <div>{showDropIn()}</div>
        ) : (
            <Link to="/signin">
                <button className="btn btn-primary">Sign in to checkout</button>
            </Link>
        );
    }



    const buy=()=>{   // v125
        setData({loading:true})
         // send the nonce to your server
        // nonce = data.instance.requestPaymentMethod()
        let nonce;
        let getNonce = data.instance
            .requestPaymentMethod()
            .then(data => {
                // console.log(data);
                nonce = data.nonce;
                // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
                // and also total to be charged
                // console.log(
                //     "send nonce and total to process: ",
                //     nonce,
                //     getTotal(products))

                const paymentData={
                    paymentMethodNonce:nonce,
                    amount:getTotal(products)
                }
                processPayment(userId,token,paymentData)
                .then(response=>{
                    // console.log(response)

                    const createOrderData = {
                        products: products,
                        transaction_id: response.transaction.id,
                        amount: response.transaction.amount,
                        address: deliveryad
                    };

                    createOrder(userId, token, createOrderData)
                        .then(response => {
                            emptyCart(() => {
                                
                                console.log('payment success and empty cart');
                                setRun(!run)
                                setData({
                                    loading: false,
                                    success: true
                                });
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            setData({ loading: false });
                        });

                //      setData({...data,success:response.success})
                //      emptyCart(()=>{
                //     console.log("payment successful")
                //          setRun(!run); 
                //          setData({loading:false})
                         
                //  })

                })
                .catch(error=>{
                    setData({loading:false})
                    console.log(error)

                })
         })
         .catch(error=>{
            //console.log("dropin error:",error);
            setData({...data,error:error.message})
        })
    }

           
    const showDropIn=()=>(
            <div onBlur={() => setData({ ...data, error: '',success:false })}>
            {data.clientToken!==null && products.length > 0 ? (
                <div>
                <div className="gorm-group mb-3">
                        <label className="text-muted">Delivery address:</label>
                        <textarea
                            onChange={handleAddress}
                            className="form-control"
                            value={data.address}
                            placeholder="Type your delivery address here..."
                        />
                    </div>
                <DropIn
                  options={{
                      authorization:data.clientToken,
                      paypal:{
                          flow:"vault"
                      }
                  }}
                  onInstance={instance=>(data.instance=instance)}   
                  />
                  <button onClick={buy} className='btn btn-success btn-block'>Checkout</button>
                  </div>
                  ):null}
      </div>
    )

    const showError = error => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );
    const showSuccess = success => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
           Thanks your payment was successful
        </div>
    );

    const showLoading=(loading)=>(
        loading && <h2>Loading.....</h2>
    )

   return (
    <div>
      <h2>Total:<span>&#8377;</span>{getTotal()}</h2>
      {showSuccess(data.success)}
      {showLoading(data.loading)}
      {showError(data.error)}
      {showCheckout()}
    </div>)
} 

export default Checkout
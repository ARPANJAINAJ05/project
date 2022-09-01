import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

import { getCart } from './cartHelpers';
import Card from './Card';
import Checkout from './Checkout';


const Cart=()=>{
    const [products,setProducts]=useState([]);
    const [run, setRun] = useState(false);
    useEffect(() => {
        // console.log('MAX DEPTH ...');
        setProducts(getCart());
      }, [run]);

    const showProducts=products=>{   //v116
        return (
        <div>
        <h2>Your cart has {`${products.length}`} items </h2>
        <hr/>
        {products.map((p,i)=>(
            <Card key={i} product={p} showCartButton={false} showViewProductButton={false} cartUpdate={true} showRemoveProductButton={true} setRun={setRun} run={run}/>
        ))}
        </div>)
        }

        const noProducts=()=>{ 
            return (<h2>Sorry!Your shopping basket is empty.
            <br/>
             <Link to="/shop">Continue Shopping</Link>
             </h2>)
        }

    // useEffect(() => {
    //     setProducts(getCart())  //v116    // received products from ls
    // }, [products,run]); // added products here in v119       // adding products here ensures that product vansihes on clicking remove and if not used,then only upon reloading of page i.e. componentmount,it will set products to the products that are in ls and then only we won't see that prod
    //    // Note:useEffect state change hone pe run karta hai khud se ofc. but yaha state change hi ham useEffect ke andar kar rahe so state change tabhi hoga jab component mount hoga but waha products add karne se setProducts(getCart()) 
    

    return (
        <Layout
            title="Shopping Cart"
            description="Manage your cart items. Add remove checkout or continue shopping."
            className="container-fluid"
        >
            <div className="row">
                <div className="col-6">{products.length > 0 ? showProducts(products) : noProducts()}</div>

                <div className="col-6">
                    <h2 className="mb-4">Your cart summary</h2>
                    <hr />
                    <Checkout products={products} setRun={setRun} run={run} />
                </div>
            </div>
        </Layout>
    )
}

export default Cart
import React, { useState } from "react";
import { Link,Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import moment from 'moment'
import { addItem,updateItem,removeItem } from "./cartHelpers";

const Card=({product,showViewProductButton=true,showCartButton=true,cartUpdate=false,showRemoveProductButton=false,setRun = f => f,run = undefined })=>{
    const [redirect,setRedirect]=useState(false);
    const [count,setCount]=useState(product.count)    // count of product present in cart
    const showViewButton = showViewProductButton => {   // to make button visible conditionally
        return (
          showViewProductButton && (
            <Link to={`/product/${product._id}`} className="mr-2">
              <button className="btn btn-outline-primary mt-2 mb-2 card-btn-1">View Product</button>
            </Link>
          )
        );
      };
      const addToCart = () => {  // v114 // adds that prod. to localstorage and so to cart
        // console.log('added');
        addItem(product,()=> setRedirect(true));
      };
    
      const shouldRedirect = redirect => {  //v114  // redirects to /cart on adding a product
        if (redirect) {
          return <Redirect to="/cart" />;
        }
      };
      const showAddtoCartButton=()=>{
          return (
            showCartButton && 
            <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2">
                Add to Cart
            </button>
        
          )
      }
      const showStock=(quantity)=>{
          return quantity>0?(
            <span className="badge badge-primary badge-pill">In Stock </span>
          ) : (
            <span className="badge badge-primary badge-pill">Out of Stock </span>
          );
              }

              const handleChange = productId => event => {  // v118  //  runs when increment/decrement occurs
                setRun(!run); // run useEffect in parent Cart
                setCount(event.target.value < 1 ? 1 : event.target.value); // setCount only for value>1
                if (event.target.value >= 1) {
                  updateItem(productId, event.target.value);  // call this to update count of that product  in ls
                }
              };
            
            const showCartUpdateOptions = cartUpdate => { //v118  // only show this option when product is in cart  // to update count of that prod in ls
                return (
                  cartUpdate && (
                    <div>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Adjust Quantity</span>
                        </div>
                        <input type="number" className="form-control" value={count} onChange={handleChange(product._id)} />
                      </div>
                    </div>
                  )
                );
              };
              const showRemoveButton = showRemoveProductButton => { //v119   // to remove that prod from cart (i.e. ls)
                return (
                  showRemoveProductButton && (
                    <button
                      onClick={() => {
                        removeItem(product._id);
                        setRun(!run); // run useEffect in parent Cart
                      }}
                      className="btn btn-outline-danger mt-2 mb-2"
                    >
                      Remove Product
                    </button>
                  )
                );
              };

    return (
        
            <div className="card">
                <div className="card-header name">{product.name}</div>
                <div className="card-body">
                {shouldRedirect(redirect)}
                <ShowImage item={product} url="product" />
                    <p className="lead mt-2">{product.description.substring(0,100)}</p>
                    <p className="black-9"><span>&#8377;</span>{product.price}</p>
                    <p className="black-8">
                        Category:{product.category && product.category.name}
                    </p>
                    <p>
                        Added on {moment(product.createdAt).fromNow()}
                    </p>
                    {showStock(product.quantity)}
                    <br/>
                   {showViewButton(showViewProductButton)}
                   {showAddtoCartButton()}
                   {showCartUpdateOptions(cartUpdate)}   
                   {showRemoveButton(showRemoveProductButton)}
                 </div>
            </div>
       
    )

}
export default Card
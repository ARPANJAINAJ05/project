//section 14  to show single product on selecting view product
import React,{useState,useEffect} from 'react';
import Layout from './Layout';
import { read,listRelated } from './apiCore';
import Card from './Card';

const Product=(props)=>{     // accepted props from rrd
  const [product,setProduct]=useState({});
  const [error,setError]=useState(false);
  const [relatedProduct,setRelatedProduct]=useState([]);

  const loadSingleProduct=productId=>{
    read(productId).then(data=>{
        if(data.error){
            setError(data.error);
        }
        else
        {
            setProduct(data)
            // now fetch related product once we have prodId
            listRelated(productId).then(data=>{
              if(data.error){
                setError(data.error)
              }
              else{
                setRelatedProduct(data);
                console.log(data);
              }

            })
           
        }
    })
  }

  useEffect(()=>{
      const productId=props.match.params.productId      // we had props in our react-router-dom 
      loadSingleProduct(productId)
  },[props])       // passing props will ensure that useEffect runs when productId changes(i.e. a prop) so that when  click on view product on related product button,we can view that related product in single page
  

  return (
    <Layout
    title={product && product.name}
    description={product && product.description}
    className="container-fluid"
>
 
 <div className='row'>
 <div className='col-8'>
 {product && product.description && (<Card product={product} showViewProductButton={false}/>)}
 </div>
 <div className='col-4'>
 <h4>Related Products</h4>
   {relatedProduct.map((p,i)=>(
     <div className='mb-3'>
     <Card key={i} product={p}/>
     </div>
   ))}
 </div>

 </div>
 </Layout>
  )
}

export default Product
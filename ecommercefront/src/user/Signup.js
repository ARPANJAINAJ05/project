import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import { signup } from '../auth';

const Signup=()=>{
    const [values,setValues]=useState({      // initialise the state variables as nulls
        name:'',
        email:'',
        password:'',
        error:'',
        success:false
    })

    const {name,email,password,error,success}=values   //destructured

const handleChange=name=>event=>{      // when input in that target is changed,store the input in state var
    setValues({...values,error:false,[name]:event.target.value})
}

const clickSubmit=event=>{
    event.preventDefault()  // avoid reloading of page
    // if(!name || !email || !password){
    //     alert('All fields are required')
    //    return
    //    }
    
    setValues({...values,error:false})  
    signup({name,email,password})     // give required inputs to backend
    .then(data=>{
        if(data.error){
            setValues({...values,error:data.error,success:false})
        }
        else
        setValues({...values,name:'',email:'',password:'',error:'',success:true})
    })

}


  const signupForm=()=>(
    <form>
        <div className='form-group'>
            <label className='text-muted'>Name</label>
            <input onChange={handleChange("name")} type="text" className='form-control' value={name}/>
         </div>

         <div className='form-group'>
            <label className='text-muted'>Email</label>
            <input onChange={handleChange("email")} type="email" className='form-control' value={email}/>
         </div>

         <div className='form-group'>
            <label className='text-muted'>Password</label>
            <input onChange={handleChange("password")} type="password" className='form-control' value={password}/>
         </div>
         <button onClick={clickSubmit} className='btn btn-primary'>Submit</button>
    </form>
)
const showError=()=>(
    <div className='alert alert-danger' style={{display:error?'':'none'}}>
        {error}
    </div>
)
const showSuccess=()=>(
    <div className='alert alert-info' style={{display:success?'':'none'}}>
       You are successfully signed up!Please <Link to="/signin">Signin</Link> 
    </div>
)
return (
<Layout title='Signup' description='Signup to EcommerceApp' className="container col-md-8 offset-md-2">
{showSuccess()}
{showError()}
{signupForm()}
{/* {JSON.stringify(values)} */}
</Layout>
)}
export default Signup
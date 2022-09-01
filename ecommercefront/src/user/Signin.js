import React,{useState} from 'react';
import {Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
import { signin ,authenticate,isAuthenticated} from '../auth';

const Signin=()=>{
    const [values,setValues]=useState({
        email:'',
        password:'',
        error:'',
        loading:false,
        redirectToReferrer:false,
    })

    const {email,password,error,loading,redirectToReferrer}=values   //destructured

const handleChange=name=>event=>{
    setValues({...values,error:false,[name]:event.target.value})
}

const clickSubmit=event=>{
    event.preventDefault()
    setValues({...values,error:false,loading:true})
    signin({email,password})
    .then(data=>{
        if(data.error){
            setValues({...values,error:data.error,loading:false})
        }
        else{
            authenticate(data,()=>{
        setValues({...values,redirectToReferrer:true})})}
    })

}
  const signinForm=()=>(
    <form>
        <div className='form-group'>
            <label className='text-muted'>Email</label>
            <input onChange={handleChange("email")}  type="email" className='form-control' value={email}/>
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
const showLoading=()=>(
    loading && (<div className='alert alert-info'>
        <h2>Loading...</h2>
    </div>)
)

const {user}=isAuthenticated();    // when signin is done,user info is saved in ls in 'user object and it is returned by isauth function
const redirectUser=()=>{        // on signin
    if(redirectToReferrer){
        if(user && user.role===1)
        return <Redirect to="/admin/dashboard"/>;
        else
        return <Redirect to="/user/dashboard"/>

    }
    if(isAuthenticated())   // i.e. when a gen user is signed in and when he tries to access "/admin/dashboard"..redirect him to homepage(user is still signed in).Without this user was being directed to signin page(user was still signed in) 
    return <Redirect to="/"/>
 }
return (
<Layout title='Signin' description='Signin to EcommerceApp' className="container col-md-8 offset-md-2">
{showLoading()}
{showError()}
{signinForm()}
{redirectUser()}
{/* {JSON.stringify(values)} */}
</Layout>
)}
export default Signin
import { API } from "../config";
import queryString from "query-string";// v106

export const getProducts = sortBy => {      // to get sorted products in home page ie. sort by arrival and by sell  
    return fetch(`${API}/product?sortBy=${sortBy}&order=desc&limit=6`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const getCategories = () => {   // to get all categories 
    return fetch(`${API}/categories`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
export const getFilteredProducts=(limit,skip,filters={})=>{   // used in shop.js to get filtered products 
    const data={
        limit,skip,filters
    }

    return fetch(`${API}/products/by/search`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json",
           
        },
        body:JSON.stringify(data)
    })
    .then(response=>{
        return response.json();
    })
    .catch(err=>{
        console.log(err);
    });
}

export const list = params => {         // v106  // used in Search.js 
    const query = queryString.stringify(params);
    console.log("query", query);
    return fetch(`${API}/product/search?${query}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const read=(productId)=>{    // to fetch single product on click of view product 
    return fetch(`${API}/product/${productId}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
export const listRelated=id=>{     // to list related product //v112
    return fetch(`${API}/product/related/${id}`,{
        method:"GET"
    })
    .then(response=>{
        return response.json();
    })
    .catch(err=>console.log(err))
}

export const getBraintreeClientToken = (userId, token) => {
    return fetch(`${API}/braintree/getToken/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
export const processPayment = (userId, token, paymentData) => {
    return fetch(`${API}/braintree/payment/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
export const createOrder = (userId, token, createOrderData) => {
    return fetch(`${API}/order/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ order: createOrderData })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

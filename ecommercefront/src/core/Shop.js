//setion 12
import React,{useState,useEffect} from 'react';
import Layout from './Layout';
import { getCategories,getFilteredProducts } from './apiCore';
import Card from './Card';
import Checkbox from './Checkbox';  // for categories
import RadioBox from './RadioBox';  // for prices
import { prices } from './fixPrices'; 


const Shop=()=>{
    const [myFilters,setmyFilters]=useState({
        filter:{category:[],price:[]}             // filter is an object with two keys
    })
    const [categories,setCategories]=useState([]);
     const [error,setError]=useState(false);
     const [limit,setLimit]=useState(6);
     const [skip,setSkip]=useState(0);
     const [filteredResults,setFilteredResults]=useState([]);
     const [size,setSize]=useState(0)

     const init = () => {        // populate the categories and make the form data ready for us to use
        getCategories().then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setCategories(data);
                 console.log(data);
            }
        });
    };

    const loadFilteredResults=(newFilters)=>{
        // console.log(newFilters)
         getFilteredProducts(limit,skip,newFilters).then(data=>{
             if(data.error){
                 setError(data.error)
             }
             else{
                 setFilteredResults(data.data)
                 setSize(data.size)
                 setSkip(0)
             }
         })
    }

    const loadMore = () => {
        let toSkip = skip + limit;
        // console.log(newFilters);
        getFilteredProducts(toSkip, limit, myFilters.filter).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setFilteredResults([...filteredResults, ...data.data]);
                setSize(data.size);
                setSkip(toSkip);
            }
        });
    };

    const loadMoreButton = () => {
        return (
            size > 0 &&
            size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">
                    Load more
                </button>
            )
        );
    };

    useEffect(() => {                // runs when component mounts or everytime the state variables change
        init();
        loadFilteredResults(limit,skip,myFilters.filter);
    }, []);
    const handleFilters=(filters,filterBy)=>{        //v97
        // console.log("SHOP", filters, filterBy);
        const newFilters={...myFilters}
        newFilters.filter[filterBy]=filters

        if (filterBy === "price") {     // to pass range of price range selected instead of price id which we were passing to filters from radioboc.js

            let priceValues = handlePrice(filters);
            newFilters.filter[filterBy] = priceValues;
        }
         loadFilteredResults(myFilters.filter);

        setmyFilters(newFilters);   
    }
    const handlePrice = value => {
        const data = prices;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value)) {
                array = data[key].array;
            }
        }
        return array;
    };

    
    return (
        <Layout
        title="Your Customised Shop"
        description="Filter by price and category and choose items of your choice"
        className="container-fluid">

        <div className='row'>
            <div className='col-4'>
            <h4>Filter By Category</h4>
             <ul>
             <Checkbox
                            categories={categories}
                            handleFilters={filters =>
                                handleFilters(filters, "category")      // filters contain which categories are checked
                            }
                        />
                </ul>
                <h4>Filter by price range</h4>
                    <div>
                        <RadioBox
                            prices={prices}
                            handleFilters={filters =>
                                handleFilters(filters, "price")   // also filters contain which price range is selected
                            }
                        />
                    </div>   
            </div>

            <div className='col-8'>
            <h2 className='mb-4'>Products</h2>
            <div className='row'>
               
                {filteredResults.map((product,i)=>(
                    <div key={i} className="col-4 mb-3">
                   <Card product={product}/>
                   </div>  
                    

                ))} 
               
            </div>
            <hr/>
            {loadMoreButton()}
            </div>
        </div>
        



    </Layout>
    )
}
export default Shop
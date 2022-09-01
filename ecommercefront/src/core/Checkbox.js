import React,{useState,useEffect,Fragment} from "react";

const Checkbox = ( {categories, handleFilters }) => {
    console.log(categories);
    const [checked, setCheked] = useState([]);

    const handleToggle = c => () => {
        
        const currentCategoryId = checked.indexOf(c);  // returns the index of 1st occurence of c or -1
        const newCheckedCategoryId = [...checked];  // stores all checked id in newCheckedCategoryId  (actualy checked is an array itself containing ids of checked categories)
        // if currently checked was not already in checked state > push
        // else pull/take off
        if (currentCategoryId === -1) {
            newCheckedCategoryId.push(c);
        } else {
            newCheckedCategoryId.splice(currentCategoryId, 1);
        }
        // console.log(newCheckedCategoryId);
        setCheked(newCheckedCategoryId);
        handleFilters(newCheckedCategoryId);
    };
  

    
   // v94 & 95

return categories.map((c, i) => (
    <li key={i} className="list-unstyled">
        <input
            onChange={handleToggle(c._id)}
            value={checked.indexOf(c._id === -1)}
            type="checkbox"
            className="form-check-input"
        />
        <label className="form-check-label">{c.name}</label>
    </li>
));
};



export default Checkbox
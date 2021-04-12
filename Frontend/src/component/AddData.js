import React, { useState ,useContext} from 'react'
import axios from 'axios'
import CSVReader from 'react-csv-reader'
import XLSX from "xlsx";
import {make_cols} from './MakeColumns';
import {SheetJSFT} from './types';
import { ApiContext } from './ApiContext'
const AddData = () => {
    const [value,setValue]=useState({})
    const { truevalue, settruevalue}=useContext(ApiContext)
    const [file,setFile]=useState({});
    const [data,setData]=useState([]);
    const [cols,setCols]=useState([])
    // console.log(truevalue)
    const teamName=[
        {
        team:"RCB"
        },
        {
            team: "MI"
        },
        {
            team: "PK"
        },
        {
            team: "DC"
        },
        {
            team: "RR"
        },
        {
            team: "SRH"
        },
        {
            team:"KKR"
        },
        {
            team:"CSK"
        }
]
    var emailRegex = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    var letters = /^[a-zA-Z\s]*$/;


    const handleChange = (key, value) => {
        setValue((prev) => ({ ...prev, [key]: value }))
    }
    const formHandle=(e)=>{
            e.preventDefault();
            console.log(value)
            if(Object.keys(value).length===0)
            {
               return alert("Please Fill the fields before submitting..")
            }
            if(value.name.length===0)
            {
                return alert("Please fill the name field..")
            }
        if (!letters.test(value.name)) {
            return alert("Enter only Text in name field")
        }
        if (!emailRegex.test(value.email)) {

            // isValid = false;

            return alert("Enter a valid Email..")

        }
        if(value.age<18)
        {
            return alert("Age must be greater then 18.")
        }
        console.log("The team value",value.team)
        if(value.team===undefined)
        {
            return alert("Please Select a team..")
        }
        axios.post('http://localhost:7000/addDetails',value)
        .then((result)=>{
            console.log(result)
            settruevalue(!truevalue)
        })
        .catch(err=>{
            console.log({err})
        })
    }
    const make_cols = refstr => {
        let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
        for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i }
        return o;
    };
    const convert=(e)=>{
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = e => {
            /* Parse data */
            console.log("It's Result time",e.target.result);
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {
                type: rABS ? "binary" : "array",
                bookVBA: true
            });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);
            /* Update state */
            // this.setState({ data: data, cols: make_cols(ws["!ref"]) }, () => {
            //     console.log(JSON.stringify(data, null, 2));
            // });
            setCols(make_cols(ws["!ref"]))
            setData(data);
            console.log("Stringfy",JSON.stringify(data,null,2));
        };

        if (rABS) {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    }
 
    const handleFile=(e)=>{
        const files=e.target.files;
        console.log(files);
        if(files && files[0]) setFile(files[0]);
    }
    return (
        <div className="w-50 m-auto ">
                {/* <input
                type="file"
                className="form-control"
                id="file"
                accept={SheetJSFT}
                onChange={handleFile}
               />

            <button onClick={() => convert()}>Convert to json</button>  */}
            <form onSubmit={formHandle} className="form-group">

            <label>Name</label>
            <input
                    class="form-control"
                value={value.name}
                onChange={(e) => handleChange("name", e.target.value)}
            />
            <label>Email</label>
            <input
                    class="form-control"
            value={value.email}
            onChange={(e)=>handleChange("email",e.target.value)}
            />
            <label>Age</label>
            <input
                    class="form-control"
                value={value.age}
                type="number"
                onChange={(e) => handleChange("age", e.target.value)}
            />
            
            <select
                className="dropdown mt-2 container-fluid p-2 bg-primary "
                onChange={(e) => {
                    handleChange("team", e.target.value)
                }} name="category">
                {teamName && teamName.map((val, index) => {
                    return (
                        <option value={val.team} className="bg-white">{val.team}</option>)
                })}
                </select>
                <input type="submit" className="btn btn-success mt-2"/>
            </form>

        </div>
    )
}

export default AddData

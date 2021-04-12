import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { ApiContext } from './ApiContext';
import CsvDownload from 'react-json-to-csv'
import ReactFileReader from 'react-file-reader';
import CSVReader from 'react-csv-reader'
import FileDataShow from './FileDataShow'
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';
import XLSX from "xlsx";

const ShowData = () => {

    const [value, setValue] = useState()
    const { truevalue, settruevalue, isAuth, setIsAuth} = useContext(ApiContext)
    const [edit, setEdit] = useState(true);
    const [data, setData] = useState("");
    const [editValue, setEditValue] = useState({})
    const [stop, setStop] = useState(false);
    const [store, setStore] = useState();
    const [updatEEffect, setUpdateEffect] = useState(false);
    const [editEffect, setEditEffect] = useState(false);
    const [delteEffect, setDeleteEffect] = useState(false)
    // const [file,setFile]=useState();
    const [uploadFile,setUploadFile]=useState();
    const [controlModal,setControlModal]=useState(false);
    const [modalData,setModalData]=useState()
    const [multer, setMulter] = useState();
    const [multerFileUpload,setMulteFileUplaod]=useState(false);
    const [fileToDownload,setFileToDownload]=useState();
    const [addDataThroughCsv,setAddDataThroughCsv]=useState(true)
    const [file, setFile] = useState({});
    // const [, setData] = useState([]);
    const [cols, setCols] = useState([])
    var emailRegex = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    var letters = /^[a-zA-Z\s]*$/;

    const [csvData,setCsvData]=useState()
    const handleChange = (key, value) => {
        setEditValue((prev) => ({ ...prev, [key]: value }))
    }
    const teamName = [
        {
            team: "RCB"
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
            team: "KKR"
        },
        {
            team: "CSK"
        }
    ]
    const header=['_id','name','email','age','team'];
    useEffect(() => {
        axios.get('http://localhost:7000/getDetails')
            .then(result => {
                setValue(result.data)
                setStore(result.data)

                console.log(value)
                console.log(csvData)
            })
    }, [delteEffect, updatEEffect, editEffect, truevalue])

    useEffect(() => {
        axios.get('http://localhost:9000/multerfile')
            .then(result => {
               console.log(result.data.value)
               setFileToDownload(result.data)
            }).catch((err)=>{
                console.log({err})
            })
           
    }, [multerFileUpload])


    const trufalse = (text) => {
        setEdit(!edit);
        setData(text);
        console.log(data)
    }
    const cancelFun = () => {
        setEdit(!edit);
        setData("")
        setEditValue({ name: "", age: "", email: "", })

    }
    const updateFun = (id) => {
        console.log("Edit value", editValue)
        console.log("upate id", id)
        if (Object.keys(editValue).length === 0) {
            return alert("Please Fill the fields before submitting..")
        }
        if (editValue.name.length === 0) {
            return alert("Please fill the name field..")
        }
        if (!letters.test(editValue.name)) {
            return alert("Enter only Text in name field")
        }
        if (!emailRegex.test(editValue.email)) {
            return alert("Enter a valid Email..")
        }
        if (editValue.age < 18) {
            return alert("Age must be greater then 18.")
        }
        
        if (editValue.team === '') {
            return alert("Please Select a team..")
        }
        axios.patch(`http://localhost:7000/updateDetails/${id}`, editValue)
            .then((result) => {
                console.log(result)
                setData("")
                setEdit(!edit)
                setUpdateEffect(!updatEEffect)
                setEditValue({ name: "", age: "", email: "", })
            }).catch(err => {
                console.log("While updating", { err })
            })
    }

    const deleteData = (id) => {
        axios.delete(`http://localhost:7000/delteDetails/${id}`)
            .then(Response => {
                console.log(Response)
                setDeleteEffect(!delteEffect)
            })
            .catch(err => {
                console.log("Error in Delete..", { err })
            })
    }
    // console.log(Papa.parse(csvData,config))
    // console.log(fileValue)
    const handleFileChange=(e)=>{
        e.preventDefault();
        // setFileValue(e.target.value);
        console.log("Something is happening..",file)
        const formData=new FormData();
        formData.append('file',file)
        const config={
            headers:{
                'content-type':'multipart/form-data'
            }
        }
        axios.post('http://localhost:7000/upload',formData,config)
        .then((response)=>{
            console.log(response)
            // setIsAuth(!isAuth);
        })
        .catch((err)=>{
            console.log(err)
            alert("Choose the file first...")
        })
    }

    const uploadHandle=(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('profile', multer)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        axios.post('http://localhost:9000/single', formData, config)
            .then((response) => {
                console.log(response)
                // setIsAuth(!isAuth);
                setMulteFileUplaod(!multerFileUpload);
            })
            .catch((err) => {
                console.log(err)
                // alert("Choose the file first...")
            })
    }

    const validateData=()=>{
        setControlModal(!controlModal)
        // axios.get('http://localhost:7000/validateData')
        // .then(response=>{
        //     console.log("This from validate data",response.data)
        //     setControlModal(!controlModal)
        //     setModalData(response.data)
        // })
        // .catch((err)=>{
        //     console.log("The erro value from validate",err)
        //     alert("Please Choose the file first...!!")
        //     setControlModal(!controlModal);
        // })
    }
   const download=(id)=>{
       axios.get(`http://localhost:9000/download/${id}`)
       .then(response=>{
           console.log("download response",response.data)
           window.location.href=response.data.url;
       })
       .catch(err=>{
           console.log({err})
       })
   }
   const csvFileData=()=>{
       settruevalue(false)

       axios.post('http://localhost:7000/create')
       .then((result)=>{
           console.log("Create csv",result)
           setValue(result.data)
           setStore(result.data)
        //    setAddDataThroughCsv(false)
       })
       .catch((err)=>{
           console.log("err")
        //    alert("Something went wrong..")
       })
   }
    const convert = (e) => {
        // e.preventDefault();
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = e => {
            /* Parse data */
            console.log("It's Result time", e.target.result);
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
            console.log("Just checking is dfdfd",data);
            setModalData(data);
            console.log(JSON.stringify(data, null, 2));
            console.log("Modal Data",modalData);

        };

        if (rABS) {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    }

    const handleFile = (e) => {
        const files = e.target.files;
        console.log(files);
        if (files && files[0]) setFile(files[0]);
    }
    return (
        <div>
            {/* {addDataThroughCsv?<button className="btn btn-warning d-block d-flex m-auto mt-4 mb-4 p-3" onClick={()=>csvFileData()}>Add Data through Csv</button>:''} */}
            <CsvDownload data={store} className="btn btn-danger d-block d-flex m-auto mt-2 mb-2 p-3"/>
            {controlModal?<FileDataShow data={modalData}/>:''}
            {/* <FileDataShow/> */}
                <div class="form-group">
                    {/* <label for="exampleFormControlFile1">Example file input</label> */}
                     {/* <input type="file"
                        onChange={(e)=>setFile(e.target.files[0])}
                        name="file"
                        accept="file_extension|.csv"
                    class="form-control-file" id="exampleFormControlFile1"/>
                    <button onClick={(e)=>handleFileChange(e)}>Upload doc</button> */}
                    <input
                        type="file"
                        className="form-control"
                        id="file"
                        accept={SheetJSFT}
                        onChange={handleFile}
                    />

                    <button onClick={() => convert()}>Convert to json</button>
                </div>
            
            <button className="btn btn-primary" onClick={() => validateData()}>Validate Data</button>
            <h1 className="text-danger bg-dark m-2">Upload File to DataBase</h1>
            <form  onSubmit={(e)=>uploadHandle(e)}>
                <div class="custom-file mb-3">
                    <label>
                        <input type="file" name="profile" onChange={(e) => setMulter(e.target.files[0])} />
                Choose file to upload
            </label>
                </div>
                    <input type="submit" value="Submit" class="btn btn-primary btn-block mb-2"/>
             </form>
                  <div className="border border-dark m-auto w-50 mb-3">
                      {fileToDownload&&fileToDownload.map((val,index)=>{
                          return(
                              <div className=" m-2 ">
                                  <a onClick={()=>download(val._id)} className="btn btn-success mt-1 mb-1 p-1">{val.originalname}</a>
                              <br/>
                              </div>
                          )
                      })}
                  </div>  
            
            {value && value.map((val, index) => {
                return (
                    <div>
                        {data._id === val._id ? <div className="m-auto form-group w-50 border border-success p-2">
                            {/* <hr/> */}
                            <label>Name</label>
                            <input
                                class="form-control"
                                value={editValue.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                            />
                            <label>Email</label>
                            <input
                                class="form-control"
                                value={editValue.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />
                            <label>Age</label>
                            <input
                                class="form-control"
                            type="number"
                                value={editValue.age}
                                onChange={(e) => handleChange("age", e.target.value)}
                            />
                            <select
                                className="dropdown mt-2 container-fluid p-2 bg-primary"
                                onChange={(e) => {
                                    handleChange("team", e.target.value)
                                }} name="category">
                                {teamName && teamName.map((val, index) => {
                                    return (
                                        <option value={val.team} className="bg-white">{val.team}</option>)
                                })}
                            </select>
                            {/* <hr/> */}
                        </div> : <>
                                <div class="card mb-3 container h-25 w-50">
                                    <img src={val.image} className="card-img-top container p-5 height" alt="..."/>
                                        <div className="card-body">
                                            <h5 className="card-title"><span>Name : </span>{val.name}</h5>
                                        <p className="card-text"><span>Email : </span>{val.email}</p>
                                        <p className="card-text"><span>Favourite Team : </span>{val.team}</p>

                                            <p className="card-text"><small className="text-muted">Age: {val.age}</small></p>
                                        </div>
                                        </div>
                            <button onClick={() => deleteData(val._id)} className="btn btn-danger" >Delete</button>
                           
                        </>}
                        {edit ? <button onClick={() => trufalse(val)} className="btn btn-primary m-2">Edit</button> :
                            <>{data._id === val._id ? <><button onClick={() => updateFun(val._id)} className="btn btn-primary">Update</button><button onClick={() => cancelFun()} className="btn btn-warning m-2">Cancel</button></> :
                                <button onClick={() => trufalse(val)} className="btn btn-primary m-2">Edit</button>}</>}
                    </div>
                )
            })}
        </div>
    )
}

export default ShowData

import axios from 'axios';
import React, { useState,useContext } from 'react'
import { Modal, Button, Table } from 'react-bootstrap';
import { ApiContext } from './ApiContext';

const AddModal = ({data}) => {
    const [show, setShow] = useState(false);
    const [modalError,setModalError]=useState();
    const [showMessage,setShowMessage]=useState(true);
    // const [showError,setError]=useState();
    var showError='';
    console.log("This is when modal open",data)
    const { truevalue, settruevalue}=useContext(ApiContext)
    const handleClose = () => {
        console.log("Hello World")
        setShow(!show)
    };
    const handleShow = () => setShow(!show);
    const saveToDb=()=>{
        axios.post('http://localhost:7000/addFileDetails',data)
        .then((Response)=>{
            console.log("response from modal",Response)
            data=''
            setShowMessage(!showMessage)
            settruevalue(!truevalue);
            console.log("showMessage....",showMessage)
        })
        .catch((err)=>{
            alert("This Table contain duplicate data try again...!!")
        })
    }

    return (
        <>
            <Button onClick={handleShow}>SHOW</Button>
            <Modal 
                size="lg"
            show={show}
            
            >
                <Modal.Header onClick={handleClose}>
                    <Modal.Title className="text-dark">File Value</Modal.Title>
                </Modal.Header>

                <Modal.Body >
                   {showMessage?<Table striped bordered hover variant="dark" >
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Team</th>
                            </tr>
                        </thead>
                        <tbody>
                                {data&&data.map((val,index)=>{
                                    return(
                                        <tr className="">
                                              <td>{val.name}</td>
                                            <td>{val.email}</td>
                                            <td>{val.age}</td>
                                            <td>{val.team}</td>
                                    </tr>
                                    )
                                })}
                        </tbody>
                    </Table>:'Data Successfully Added to DataBase'}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                 <Button variant="primary" onClick={()=>saveToDb()}>Save to DB</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddModal;
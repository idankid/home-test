import React, {useRef, useState} from 'react'
import * as emailValidator from 'email-validator';
import Modal from 'react-modal';
import styles from "./style.module.css"

const root = document.getElementById('root')
Modal.setAppElement(root?root:'');

const EmailForm = () => {
    const emailSubject = useRef("");
    const emailBody = useRef("");
    const emailList = useRef("");
    const [open, setOpen] = useState(false);
    

    //parsing the input to get an array of emails
    const parseEmailList = ()=>{
        // spliting the emails to get the email list
        let list = emailList.current.split(',');

        let validEmails : string[] = [];
        let invalidEmails : string[] = [];

        // chacking if the mails are valid emails
        list.forEach(email=>{
            emailValidator.validate(email.trim())? validEmails.push(email.trim()): invalidEmails.push(email.trim());
        })
        
        // sending the user the invalid emails he has put in
        if(invalidEmails.length>0){

            // building the string
            let alertText = "there are invalid emails: ";
            invalidEmails.forEach(email=>{
                alertText+= email + ', ' ;
            })

            alert(alertText);

            return null;
        }

        return validEmails;
    };
    
    // takes care of submitting the form
    const handleSubmit = ()=>{

        // checking if one of the inputs are empty
        if(emailSubject.current.trim() === ""){ alert("please enter an email subject"); return};
        if(emailBody.current.trim() === ""){ alert("please enter an email body"); return};
        if(emailList.current.trim() === ""){ alert("please enter at least one email address");return};

        // parsing the email list
        let emailArray  =  parseEmailList();
        if(!emailArray) return;

        sendMail(emailArray).then(()=>{
            setOpen(false);
        })        

    }

    // sending the mail
    const sendMail = async(emailArray: string[])=>{
        let toSend = {
            emailArray: emailArray,
            subject: emailSubject.current,
            body: emailBody.current
        }

        await fetch("http://localhost:3000/send",{
            method:"POST",
            headers: {"content-type":"application/json"},
            body: JSON.stringify(toSend)
        })
    }



  return (
    <>
        <Modal
            isOpen={open}
            onRequestClose={()=>setOpen(false)}
        >
            {/* closing button */}
            <button className={styles.close} onClick={()=>setOpen(false)}>X</button>

            <h1 className={styles.header}>Email Form</h1>

            {/* the input for the email subject */}
            <input 
                type='text'
                placeholder='Email Subject'
                className={styles.sub}
                onChange={(e)=>{emailSubject.current = e.target.value;}}/>
            

            {/* the input for the email Body */}
            <textarea
                placeholder='Email body'
                className={styles.body}
                onChange={(e)=>{emailBody.current = e.target.value;}}/>
            

            {/* the input for the email lists separated by commas */}
            <textarea 
                placeholder='reciever email addresses separated by , '
                className={styles.list}
                onChange={(e)=>{emailList.current = e.target.value;}}/>

            <button className={styles.submit} onClick={handleSubmit}>send</button>
        </Modal>

        {/* oppening the modal button  */}
        <button className={styles.open} onClick={()=>setOpen(true)}>open email form</button>
    </>
  ) 
}

export default EmailForm;
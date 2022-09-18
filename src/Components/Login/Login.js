import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from "../../firebase.init";
import { useState } from "react";

const auth = getAuth(app);


const Login = () => {

  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  // const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleNameBlur = event => {
    setName(event.target.value);
  }
  const handleNumberBlur = event => {
    setNumber(event.target.value);
  }

  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }

  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  }

  const handleRegisteredChange = event => {
    setRegistered(event.target.checked);
  }

  const handleFormSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {

      event.stopPropagation();
      return;
    }
    if (!/(?=.*\d)/.test(password)) {
      setError('Password Should Contain atlast 5 charcters and 1 number')
      return;
    }
    setValidated(true);
    setError('');

    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .catch(error => {
          console.error(error);
          setError(error.message);
        })
    }
    else {
      // console.log('forn submmit', email, password);
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
          setEmail('');
          setPassword('');
          verifyEmail();
          setUserName();
        })
        .catch(error => {
          console.error(error);
          setError(error.message)
        })
    }

    event.preventDefault();
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name,
      phoneNumber: number
    })
      .then(() => {
        console.log('upadting name & number');
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('Email Verification Sent');
      })
  }
  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('email sent');
      })
  }
  return (
    <div className="regestration w-50 mx-auto mt-5">
      <h2 className="text-primary">Please {registered ? 'Login' : 'Register'}!!!</h2>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>

        {!registered && <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Your Name</Form.Label>
          <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter your name" required />
          <Form.Control.Feedback type="invalid">
            Please provide your name.
          </Form.Control.Feedback>
        </Form.Group>}

        {!registered && <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Your Number</Form.Label>
          <Form.Control onBlur={handleNumberBlur} type="number" placeholder="Enter your number" required />
          <Form.Control.Feedback type="invalid">
            Please provide your number.
          </Form.Control.Feedback>
        </Form.Group>}

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Allready Regiested?" />
        </Form.Group>
        {/* <p className="text-success">{success}</p> */}
        <p className="text-danger">{error}</p>
        <Button onClick={handlePasswordReset} variant="link">Forget Password</Button>
        <br />
        <Button variant="primary" type="submit">
          {registered ? 'Login' : 'Register'}
        </Button>
      </Form>
    </div>
  );
};

export default Login;

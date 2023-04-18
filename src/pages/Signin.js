import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Signin.css';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const accountType = sessionStorage.getItem('account_type');
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username === "admin" && password === "admin"||accountType=="personel") {
      sessionStorage.setItem('displayname', "admin");
      sessionStorage.setItem('account_type', "personel");
      //sessionStorage.setItem('preloading', true)
      window.location.href = '/home2';
      //window.location.href = 'http://202.44.40.185'
      // window.location.href = 'http://202.44.40.185:3001'
      Swal.fire({
        title: 'Login Success!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
    else {
      try {
        const response = await axios.post('http://202.44.40.185:3001/login', { username, password });
        const userInfo = response.data.userInfo;
        console.log('Login success');
        console.log('=============================');
        console.log('Username: ' + userInfo.username);
        console.log('Displayname: ' + userInfo.displayname);
        console.log('Firstname EN: ' + userInfo.firstname_en);
        console.log('Lastname EN: ' + userInfo.lastname_en);
        console.log('pid: ' + userInfo.pid);
        console.log('Email: ' + userInfo.email);
        console.log('Birthdate: ' + userInfo.birthdate);
        console.log('Account type: ' + userInfo.account_type);
        sessionStorage.setItem('displayname', userInfo.displayname);
        sessionStorage.setItem('account_type', userInfo.account_type);
        Swal.fire({
          title: 'Login Success!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        //sessionStorage.setItem('preloading', true)
        window.location.href = '/home'; // redirect to home page
        //window.location.href = 'http://202.44.40.185'
        // window.location.href = 'http://202.44.40.185:3001'
      } catch (error) {
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Network error');
        }
      }
    }
  };

  return (
    <div className='login'>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Password :
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </label>
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit" className="btn btn-primary">Log in</button>
      </form>
      <br/><a>ระบบเบิกจ่ายวัสดุและครุภัณฑ์</a>
    </div>
  );
}

export default LoginForm;
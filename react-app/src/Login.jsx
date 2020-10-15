import React, { Component } from 'react'

function login(e){
    console.log('login page button clicked')
    // prevent default form action from being carried out
    e.preventDefault()

    const username = document.querySelector( '#username' ).value;
    const pass = document.querySelector( '#password' ).value;
    let json = { username: username,
                password: pass};
    let body = JSON.stringify( json );

    fetch( '/login', {
        method:'POST',
        body : body,
        headers:{
            "Content-Type": "application/json"
        }
    })
    .then(function(response){
        if (response.redirected == true){
        window.open(response.url, "_self")
        } else {
        return  response.json()
        }
        
    })
    .then( function( json ) {
        let errmsg = document.getElementById('errormsg');
        if (json.error == 'password'){
        errmsg.innerText = "Password Incorrect"
        } else { //username not found
        errmsg.innerText = "Username not found"
        }
    })

    return false;
}

function register(e){
    console.log('register page button clicked')

    // prevent default form action from being carried out
    e.preventDefault()

    const username = document.querySelector( '#username' ).value;
    const pass = document.querySelector( '#password' ).value;
    let json = { username: username,
                password: pass};
    let body = JSON.stringify( json );

    fetch( '/register', {
        method:'POST',
        body : body,
        headers:{
            "Content-Type": "application/json"
        }
    })
    .then(function(response){
        return  response.json()
    })
    .then( function( json ) {
        if (json.code === 'found'){
            alert('This username already exists')
        } else {
            window.open('/', "_self")
        }
    })

    return false;
    
}

export class Login extends Component {
    constructor(props){
        super(props);
        if(props.isLogin){
            this.buttonClick = login;
        } else {
            this.buttonClick = register;
        }
    }
    
    checkIfFieldsEmpty() {
        const inputs = document.querySelectorAll('.loginField');
        for(let i=0; i<inputs.length; i++) {
            if(inputs[i].value=='') {
                document.querySelector('#signin').disabled = true
                return true
            }
        }
        document.querySelector('#signin').disabled = false
        return false
    }

    render() {
        return (
            <div>
                <p id = "errormsg"></p>
                <div className="container" style = {{"margin": "10px"}}>
                    <div className = "row">
                        <div className = "col">
                            <p id = "errormsg"></p>
                            <input type='text' id='username' className='loginField' placeholder="Username here" onInput={this.checkIfFieldsEmpty}/>
                            <br/>
                            <input type='password' id='password' className='loginField' placeholder="Password here" onInput={this.checkIfFieldsEmpty}/>
                            <br/>
                            <button id='signin' onClick = {this.buttonClick}>{this.props.isLogin?"Login":"Signup"}</button>
                        </div>
                        <div className = "col">
                            <a href = "/auth/github" target="_blank" rel="noopener noreferrer">
                                <p>Login with github OAuth</p>
                                <img src = "img/githubLogo.png"/>
                            </a>
                        </div>

                        {this.props.isLogin  ?  (<div className = "col">
                            <a href="/register" >
                                <p>
                                    Register for account
                                </p>
                            
                            </a>
                        </div>) : "" }
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default Login

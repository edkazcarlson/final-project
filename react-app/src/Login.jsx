import React, {Component} from 'react'
import Button from '@material-ui/core/Button';

function login(e) {
    console.log('login page button clicked')
    // prevent default form action from being carried out
    e.preventDefault()

    const username = document.querySelector('#username').value;
    const pass = document.querySelector('#password').value;
    let json = {
        username: username,
        password: pass
    };
    let body = JSON.stringify(json);

    fetch('/login', {
        method: 'POST',
        body: body,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            if (response.redirected === true) {
                window.open(response.url, "_self")
            } else {
                return response.json()
            }

        })
        .then(function (json) {
            let errmsg = document.getElementById('errormsg');
            if (json.error.toString() === 'password') {
                errmsg.innerText = "Password Incorrect"
            } else { //username not found
                errmsg.innerText = "Username not found"
            }
        })

    return false;
}

function register(e) {
    console.log('register page button clicked')

    // prevent default form action from being carried out
    e.preventDefault()

    const username = document.querySelector('#username').value;
    const pass = document.querySelector('#password').value;
    let json = {
        username: username,
        password: pass
    };
    let body = JSON.stringify(json);

    fetch('/register', {
        method: 'POST',
        body: body,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (json) {
            if (json.code === 'found') {
                alert('This username already exists')
            } else {
                window.open('/', "_self")
            }
        })

    return false;

}

export class Login extends Component {
    constructor(props) {
        super(props);
        if (props.isLogin) {
            this.buttonClick = login;
        } else {
            this.buttonClick = register;
        }
    }

    checkIfFieldsEmpty() {
        const inputs = document.querySelectorAll('.loginField');
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value === '') {
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
                <p id="errormsg"/>
                <div className="container" style={{"margin": "10px", display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        <p id="errormsg"/>
                        <input type='text' id='username' className='loginField' placeholder="Username here"
                               onInput={this.checkIfFieldsEmpty}/>
                        <br/>
                        <input type='password' id='password' className='loginField' placeholder="Password here"
                               onInput={this.checkIfFieldsEmpty}/>
                        <br/>
                        <Button id='signin' onClick={this.buttonClick}
                                variant="contained">{this.props.isLogin ? "Login" : "Signup"}</Button>
                    </div>
                    <div>
                        <a href="/auth/github" target="_blank" rel="noopener noreferrer">
                            <p>Login with github OAuth</p>
                            <img src="img/githubLogo.png" alt="GitHub logo"/>
                        </a>
                    </div>

                    {this.props.isLogin ? (<div>
                        <a href="/register">
                            <p>
                                Register for account
                            </p>

                        </a>
                    </div>) : ""}

                </div>
            </div>
        )
    }
}

export default Login

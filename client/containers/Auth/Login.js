import React ,{Component} from 'react';
import classes from './Login.scss';
class Login extends Component{
    submitHandler(){ }
    render(){
        return (
            <div className={classes.container}>
                <div className={classes.header}> Login In Admin Panel </div>
                <div className={classes.main}>
                    <form onSubmit={this.submitHandler()}>
                        <div className={classes.formGroup}>
                            <label htmlFor="username">UserName:</label>
                            <input 
                                type="text" 
                                id='username' 
                                className={classes.box}
                                placeholder="type your username"
                            ></input>
                            <small className={classes.small}>* Email Also Accepted</small>
                        </div>
                        <div className={classes.formGroup}>
                            <label htmlFor="password">Password:</label>
                            <input 
                                type="password" 
                                id='password' 
                                className={classes.box}
                                placeholder="type your password"
                                autoComplete="true"
                            ></input>
                        </div>
                        <div className={classes.formGroup}>
                            <select className={classes.adminType}>
                                <option>Main admin</option>
                            </select>
                        </div>
                        <button type="submit" className={classes.button}>LogIn</button>
                    </form>
                </div>
            </div>
        )
    }
}
export default Login;
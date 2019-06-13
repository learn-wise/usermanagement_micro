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
                            <div class={classes.formGroup}>
                                <label for="username">UserName:</label>
                                <input 
                                    type="text" 
                                    id='username' 
                                    className={classes.username}
                                    placeholder="type your username"
                                ></input>
                                <small className={classes.small}>* Email Also Accepted</small>
                            </div>
                            <div class={classes.formGroup}>
                                <label for="password">Password:</label>
                                <input 
                                    type="password" 
                                    id='password' 
                                    className={classes.password}
                                    placeholder="type your password"
                                ></input>
                            </div>
                            <div class={classes.formGroup}>
                               <select className={classes.adminType}>
                                   <option>Main admin</option>
                               </select>
                            </div>
                            <button type="submit" class={classes.button}>LogIn</button>
                        </form>
                    </div>
                </div>
        )
    }
}
export default Login;
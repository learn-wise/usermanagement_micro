import React, { Component } from 'react';
import classes from './style.scss';
import {ReactComponent  as CheckMark } from '../../../../../assets/icons/check-solid.svg'
import {ReactComponent  as CrossMark } from '../../../../../assets/icons/times-solid.svg';
import { graphql } from 'react-apollo';
import mutation from '../../../../../Graphql/mutations/usersList';
import moment from 'moment';
import Pagination from './pagination';
class UsersList extends Component {
  constructor(props){
    super(props)
    this.state={
      usersList:{
        show:10,
        filter:'Recently Login',
        search:null,
        Users:[],
        hasNextPage:false,
        hasPreviousPage:false,
        lastPage:1,
        currentPage:1,
        totalUsers:0,
        errorMessage:null
      },
      updateList:false,
      errors:null,
      loading:true
    }
  }

  listMutation = ({isUpdate})=>{
    const {show,filter,search,currentPage} = this.state.usersList
    this.props.mutate({
      variables: {show,filter,search,page:currentPage} 
    })
    .then(({data})=>{
      let usersList = {
        ...data.usersList,
        filter:this.state.usersList.filter
      }
      let stateHandler = { usersList, errors:null,loading:false }
      if(isUpdate){ stateHandler.updateList = false }
      this.setState(stateHandler)
    })
    .catch(e=>{
      const stateHandler = {
        ...this.state.usersList,
        updateList:false,
        errors:e.message
      }
      this.setState(stateHandler)
    })
  }

  componentWillMount=()=>{ this.listMutation({isUpdate:false}) }

  componentDidUpdate(prevProps,prevState){
    if(this.state.updateList === true && !this.state.errors){ 
      this.listMutation({isUpdate:true})
    }
  }

  rowsHandler = () => {

    if(this.state.usersList.errorMessage || this.state.errors){
        return <tr align="center">
          <td colSpan="8">{this.state.usersList.errorMessage  || this.state.errors }</td>
        </tr>
    }
    if(this.state.loading){
      return <tr><td colSpan="8"><div className={classes.loader}>Loading...</div></td></tr>
    }
    return this.state.usersList.Users.map((user, key) => {
      const rule = key % 2 === 0 || key % 2 === 'NaN' ? 'even' : 'odd';
      const status =
        user.status === true 
            ?<button className={classes.on}>&nbsp;</button>
            :<button className={classes.off}>&nbsp;</button>;
      const verify =
        user.isVerified === true 
            ?<CheckMark width="20px" height="20px" style={{color:"green"}}/>
            :<CrossMark width="20px" height="20px" style={{color:"red"}}/>;
      return (
        <tr role={rule} key={Math.random()*key}>
          <td>{user._id.substring(0,10)}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>country</td>
          <td>{moment(user.createdAt).format('YYYY/MM/DD')}</td>
          <td>{moment(user.lastLogin).format('YYYY/MM/DD | h:mm')}</td>
          <td style={{ textAlign: 'center' }}>{verify}</td>
          <td style={{ textAlign: 'center' }}>{status}</td>
        </tr>
      );
    });
  };

  stateHandler=(target,val)=>{
    const usersList = { ...this.state.usersList, [target]:val }
    this.setState({usersList,updateList:true})
  }

  tableInfo = ()=>{
    if(this.state.usersList){
      const {currentPage,show,totalUsers} = this.state.usersList
      if(totalUsers < show){
        return <p>Showing 0 to {totalUsers} of {totalUsers} entries</p>
      }
      return <p>Showing {(currentPage - 1) * show } to {currentPage * show} of {totalUsers} entries</p>
    }
    return ''
  }
  render() {
    return (
        <div className={classes['card-container']}>
          <div className={classes['card-header']}>
            <div className={classes['header-show']}>
              <label>
                show
                <select 
                  className={classes['header-show-select']} 
                  onChange={e=>this.stateHandler('show',+e.target.value)}>
                  <option value='10'>10</option>
                  <option value='20'>20</option>
                  <option value='30'>30</option>
                  <option value='50'>50</option>
                </select>
                entires
              </label>
            </div>
            <div className={classes['header-filter']}>
              <label>
                filter By:
                <select 
                  className={classes['header-filter-select']} 
                  onChange={e=>this.stateHandler('filter',e.target.value)} 
                  defaultValue='Recently Login' >
                  <option value='Recently Login'>Recently Login</option>
                  <option value='Onlines'>Onlines</option>
                  <option value='Verified'>Verified</option>
                  <option value='Recently Registered'>Recently Registered</option>
                </select>
              </label>
            </div>
            <div className={classes['header-search']}>
              <label>
                <input 
                  className={classes['header-search-input']}
                  placeholder='Search in here [Email,Name]' 
                  type='search'
                  onKeyUp={e=>this.stateHandler('search',e.target.value)}/>
              </label>
            </div>
          </div>
          <div className={classes['card-body']}>
            <table className={classes['body-tableData']}>
              <thead style={{ textAlign: 'center' }}>
                <tr role='row'>
                    <th aria-label='ID'> ID </th>
                    <th aria-label='name'> name </th>
                    <th aria-label='Email'> Email </th>
                    <th aria-label='from'> from </th>
                    <th aria-label='created_Date'> created_Date </th>
                    <th aria-label='last_Login'> last_Login </th>
                    <th aria-label='verify'> verify </th>
                    <th aria-label='status'> status </th>
                </tr>
              </thead>
              <tbody>{this.rowsHandler()}</tbody>
            </table>
          </div>
          <div className={classes['card-footer']}>
            <div className={classes['footer-info']}>
              <div className={classes['footer-info-content']}>
                {this.tableInfo()}
              </div>
            </div>
            <div className={classes['footer-pagination']}>
              <ul className={classes['footer-pagination-list']}>
              <Pagination 
                classes = {classes}
                pageHandler = {page=>this.stateHandler('currentPage',+page)}
                lastPageHandler = {()=>this.stateHandler('currentPage',+this.state.usersList.lastPage)}
                nextPageHandler = {()=>this.stateHandler('currentPage',+this.state.usersList.currentPage+1)}
                prevPageHandler = {()=>this.stateHandler('currentPage',+this.state.usersList.currentPage-1)}
                {...this.state.usersList} />
              </ul>
            </div>
          </div>
        </div>
    );
  }
}

export default graphql(mutation)(UsersList);
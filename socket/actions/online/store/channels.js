const { Day, Year, Month } = require('../helper/util');

module.exports = {
  //visitors
  online_Visitors: 'online:count',
  online_Visitors_List: `online:visitors:list:${Day}`,
  Visitors_State_List: `visitors:state:city:month:${Year}:${Month}`,
  online_Visitors_Total_List: 'online:visitors:TList',
  //users
  online_Users_List: `online:users:list:${Day}`,
  online_Users_Total_List: 'online:users:TList',
  online_Users_Count: 'online:users:count',
  Total_Users_Count: 'total:users:TList',
  Total_Verified_User: 'total:Verified:UserList',
};

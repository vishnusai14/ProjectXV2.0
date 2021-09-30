import classes from  './App.module.css';
import { Route } from "react-router"
import Admin from "../Admin/Admin"
import SearchResult from '../SearchResults/SearchResult';
import Detail from '../Details/Details';
import Login from '../Login/Login';
import SignUp from '../SignUp/Signup';
import EditProfile from "../EditProfile/EditProfile"
import FeedBack from '../Feedback/Feedback';
import Logout from '../LogOut/Logout';
import Chat from '../chat/Chat';
import Field from '../Field/HeaderExample'
import Favourite from "../Favourite/favourite"
function App() {
  return (
    <div className={classes.App}>
      <Route path = "/" component = {Admin} exact/>
      <Route path = "/details" component = {SearchResult}/>
      <Route path = "/worker-details" component ={Detail}/>
      <Route path = "/login" component = {Login}/>
      <Route path = "/signup" component = {SignUp}/>
      <Route path = "/editprofile" component = {EditProfile}/>
      <Route path = "/feedback" component = {FeedBack}/>
      <Route path = "/chat" component = {Chat}/>
      <Route path = "/logout" component = {Logout} exact/>
      <Route path = "/field" component = {Field} exact />
      <Route path = "/myFavourite" component = {Favourite} exact />
    </div>
  );
}

export default App;

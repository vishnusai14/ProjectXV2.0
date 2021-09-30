import React, {Component} from "react" 
import { withRouter } from "react-router"
import * as actionTypes from "../store/creators/authCreators"
import { connect  } from "react-redux"
class LogOut extends Component {
    render() {
        return (
            <>
            {localStorage.removeItem("SSUID")}
            {localStorage.removeItem("valid")}
            {localStorage.removeItem("SOCKET_ID")}
            {localStorage.removeItem("CLIENT_EMAIL")}
            {this.props.history.push("/")}
        </>
        )

    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        logout : () => {dispatch(actionTypes.logout())}
    }
}

const mapStateToProps = (state) => {
    return {
        token : state.token,
        error : state.error,
        loading : state.isLoading,
        otpCheck : state.otpCheck
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LogOut))
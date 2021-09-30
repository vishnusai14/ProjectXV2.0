import axios from "axios";
// Create instance called instance
const instance = axios.create({
    baseURL : 'http://localhost:8080/api/v1'
});

export default instance;
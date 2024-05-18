import axios from "axios";

const config = {
    baseURL:"https://api.homologation.cliqdrive.com.br"
}

const api = axios.create(config)

export default api
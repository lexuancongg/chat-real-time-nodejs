import { AuthRequest, LoginResponse, RegisterRequestDto } from "@/models/auth/auth";
import apiClient from "@/utils/api/apiClient";

class AuthService {
      private baseUrl:string
    constructor() {
        this.baseUrl = "http://localhost:8000/auth"
    }

    public async login(authRequest : AuthRequest):Promise<LoginResponse>{
        const response = await apiClient.post(`${this.baseUrl}/login`,JSON.stringify(authRequest));
        if(response.ok){
            return await response.json();
        }
        throw response;
    }

    public async register(data:RegisterRequestDto):Promise<void>{
        const response = await apiClient.post(`${this.baseUrl}/register`,JSON.stringify(data));
        if(!response.ok){
            throw response;
        }
    }

}

export default new AuthService();
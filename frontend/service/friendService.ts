import { ApiResponse } from "@/models/response/response";
import apiClient from "@/utils/api/apiClient";

class FriendService {
      private baseUrl:string
    constructor() {
        this.baseUrl = "http://localhost:8000/friends"
    }


    async getCountRequestFriends():Promise<ApiResponse<number>>{
        const response = await apiClient.get(`${this.baseUrl}/count-requests`);
        if(response.ok){
            return await response.json();
        }
        throw response;
    }

    async getRequestFriends():Promise<ApiResponse<FriendRequestResponse[]>>{
          const response = await apiClient.get(`${this.baseUrl}/requests`);
        if(response.ok){
            return await response.json();
        }
        throw response;
    }
    

}

export default new FriendService();
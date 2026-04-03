import { Conversation } from "@/models/conversations/conversation";
import { ApiResponse } from "@/models/response/response";
import apiClient from "@/utils/api/apiClient";

class ConversationService {
      private baseUrl:string
    constructor() {
        this.baseUrl = "http://localhost:8000/conversations"
    }


    async getOrCreateConversationByUserId(userId:number):Promise<ApiResponse<Conversation>>{
        const response = await apiClient.post(`${this.baseUrl}/private`,JSON.stringify({userId:userId}));
        if(response.ok){
            return await response.json();
        }
        throw response;
    }

    

}

export default new ConversationService();
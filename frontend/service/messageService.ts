import { Message } from "@/models/message/message";
import { ApiResponse } from "@/models/response/response";
import apiClient from "@/utils/api/apiClient";

class MessageService {
      private baseUrl:string
    constructor() {
        this.baseUrl = "http://localhost:8000/messages"
    }


    async getMessagesByConversationId(conversationId:number):Promise<ApiResponse<Message[]>>{
        const response = await apiClient.get(`${this.baseUrl}/conversation/${conversationId}`);
        if(response.ok){
            return await response.json();
        }
        throw response;
       
    }

    
    

}

export default new MessageService();
import axios from "axios";

const BASE_URL = import.meta.env.BASE_URL || 'http://localhost:3000';

export const tagsRename = async (hash: string, tags: string) => {
  try{
    const options = {
      method: 'POST',
      url: `${BASE_URL}/tags`,
      headers: {
        'Content-Type': 'application/json' 
      },
      data: {
        hash: hash,
        messages: tags,
      }
    };
    const response = await axios.request(options);
    
    return response.data;

  } catch(error){
    console.error(error);
    return;
  }
}

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

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
        message: tags,
      }
    };
    const response = await axios.request(options);
    
    return response.data;

  } catch(error){
    console.error(error);
    return "Error";
  }
}

export const fetchTags = async (hash: string): Promise<string> => {
  const options = {
    method: 'GET',
    url: `${BASE_URL}/tags/${hash}`
  }
  try{
    const response = await axios.request(options);
    return response.data.message;
  } catch(error){
    console.log(error);
    return "Error";
  }
}

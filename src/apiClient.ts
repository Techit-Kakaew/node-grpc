import axios from 'axios';
import { User } from './dataProcessor';

export const fetchUserData = async () => {
  const response = await axios.get<{ users: User[] }>('https://dummyjson.com/users');
  return response.data.users;
};

import axios from 'axios';

export function createClient() {
  return axios.create({
    baseURL: process.env.HOST,
    withCredentials: true,
  });
}

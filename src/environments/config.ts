import * as dotenv from 'dotenv';
dotenv.config();

export const token = process.env.TOKEN;
export const prefix = "ct!";
export const timeout = 10000;
export const color = {
  brand: '#0099ff',
  warning: '#e7c000',
  error: '#cf0202',
}




import axios from 'axios';
import {NetworkError} from 'src/domain/data-fetching/errors/network.error';

export const transformError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return new NetworkError(error.response?.status);
  }
  return error;
};

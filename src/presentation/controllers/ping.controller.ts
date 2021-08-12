import axios, {AxiosError} from 'axios';
import {Request, Response} from 'express';

export const pingControllerBuilder =
  (path: string, query: object) => async (req: Request, res: Response) => {
    let status: number;
    try {
      const response = await axios.get(
        `http://localhost:${process.env.PORT}${path}`,
        {
          headers: {
            'X-Api-Key': process.env.PING_TOKEN,
          },
          params: query,
        }
      );
      status = response.status;
    } catch (error) {
      const axiosError = error as AxiosError;
      status = axiosError.response?.status ?? 500;
    }

    if (status < 500) {
      return res.json('pong');
    }
    return res.status(status).json({
      error: 'service_unavailable',
      reason: 'Data provider is not available',
      message: "Le fournisseur de donnée n'est pas disponible",
    });
  };

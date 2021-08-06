import axios from 'axios';
import {Request, Response} from 'express';

export const pingControllerBuilder =
  (path: string, query: object) => async (req: Request, res: Response) => {
    let status: number;
    try {
      const response = await axios.get(
        (process.env.NODE_ENV === 'development' ? 'http://' : 'https://') +
          req.header('host') +
          path,
        {
          headers: {
            'X-Api-Key': process.env.PING_TOKEN,
          },
          params: query,
        }
      );
      status = response.status;
    } catch (error) {
      status = error.statusCode ?? 500;
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
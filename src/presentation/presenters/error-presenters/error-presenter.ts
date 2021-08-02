export type ErrorPresenter = (error: Error) => {
  statusCode: number;
  json: object;
};

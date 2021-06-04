export type DataProvider<InputType, OutputType> = {
  fetch(input: InputType): Promise<OutputType>;
};

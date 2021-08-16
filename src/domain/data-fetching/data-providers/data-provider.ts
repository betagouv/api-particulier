export type DataProvider<InputType, OutputType, MetadataType = object> = {
  fetch(input: InputType, metadata?: MetadataType): Promise<OutputType>;
};

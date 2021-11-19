export type PrimitiveType = 'string' | 'number' | 'boolean';
export type EnumDescriptor = { [key: string]: number };

export type FieldType =
  | PrimitiveType
  | PrimitiveType[]
  | EnumDescriptor
  | EnumDescriptor[]
  | FieldsDescriptor
  | FieldsDescriptor[];
export type FieldOptions = {
  required?: boolean;
  readonly?: boolean;
};

export type FieldsDescriptor = {
  [key: string]: FieldDescriptor;
};
export type FieldDescriptor = {
  type: FieldType;
  tag: number;
} & FieldOptions;

export type FieldDescriptorLite = Omit<FieldDescriptor, 'tag'>;
export type FieldDescriptorLites = {
  [key: string]: FieldDescriptorLite;
};

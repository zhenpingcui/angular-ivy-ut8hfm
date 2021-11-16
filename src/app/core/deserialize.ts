import {
  FieldsDescriptor,
  EnumDescriptor,
  isFieldsDescriptor,
  isValidEnumValue,
} from './descriptor';
import { Proto, WithType } from './descriptor.mapping';

export function deserialize<D extends FieldsDescriptor>(
  proto: Proto,
  descriptor: D
): WithType<D> {
  const ans: any = {};
  Object.keys(descriptor).forEach((k) => {
    const kVal = proto[descriptor[k].tag];
    const kDes = descriptor[k];
    if (kDes.required && kVal === undefined) {
      throw Error(`${JSON.stringify(proto)} is missing ${k}.`);
    }
    if (kVal === undefined || !kDes.type) return;
    if (Array.isArray(kDes.type)) {
      if (!Array.isArray(kVal)) {
        console.log(kDes);

        console.log(kVal);
        throw Error(`${JSON.stringify(proto)}[${k}] is not an array.`);
      } else {
        const list = [];
        if (typeof kDes.type[0] === 'string') {
          (kVal as Array<any>).forEach((e) => {
            if (typeof e !== kDes.type[0]) {
              throw Error(
                `${JSON.stringify(proto)}[${k}] is not an array of ${
                  kDes.type[0]
                }.`
              );
            } else {
              list.push(e);
            }
          });
        } else {
          (kVal as Array<any>).forEach((e) => {
            list.push(deserialize(e, kDes.type[0]));
          });
        }
        ans[k] = list;
      }
    } else if (typeof kDes.type === 'object') {
      if (isFieldsDescriptor(kDes.type)) {
        if (typeof kVal !== 'object') {
          throw Error(`${JSON.stringify(proto)}[${k}] is not an object.`);
        } else {
          ans[k] = deserialize(kVal, kDes.type as FieldsDescriptor);
        }
      } else {
        if (!isValidEnumValue(kVal, kDes.type as EnumDescriptor)) {
          throw Error(
            `${JSON.stringify(proto)}[${k}] is not valid enum value.`
          );
        }
        ans[k] = kVal;
      }
    } else {
      if (typeof kVal !== kDes.type) {
        throw Error(`${JSON.stringify(proto)}[${k}] is not a ${kDes.type}.`);
      } else {
        ans[k] = kVal;
      }
    }
  });
  if (descriptor['_type'] !== undefined) {
    ans['_type'] = descriptor['_type'];
  }
  return ans;
}

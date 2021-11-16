import {
  FieldsDescriptor,
  EnumDescriptor,
  isFieldsDescriptor,
  isValidEnumValue,
} from './descriptor';
import { Proto, WithType } from './descriptor.mapping';

export function serialize<D extends FieldsDescriptor>(
  withType: WithType<D>,
  descriptor: D
): Proto {
  const ans: any = {};
  Object.keys(descriptor).forEach((k) => {
    const kVal = withType[k];
    const kDes = descriptor[k];
    if (kDes.required && kVal === undefined) {
      throw Error(`${JSON.stringify(withType)} is missing ${k}.`);
    }
    if (kVal === undefined || !kDes.type) return;
    if (Array.isArray(kDes.type)) {
      if (!Array.isArray(kVal)) {
        throw Error(`${JSON.stringify(withType)}[${k}] is not an array.`);
      } else {
        const list = [];
        if (typeof kDes.type[0] === 'string') {
          (kVal as Array<any>).forEach((e) => {
            if (typeof e !== kDes.type[0]) {
              throw Error(
                `${JSON.stringify(withType)}[${k}] is not an array of ${
                  kDes.type[0]
                }.`
              );
            } else {
              list.push(e);
            }
          });
        } else {
          (kVal as Array<any>).forEach((e) => {
            list.push(serialize(e, kDes.type[0]));
          });
        }
        ans[kDes.tag] = list;
      }
    } else if (typeof kDes.type === 'object') {
      if (isFieldsDescriptor(kDes.type)) {
        if (typeof kVal !== 'object') {
          throw Error(`${JSON.stringify(withType)}[${k}] is not an object.`);
        } else {
          ans[kDes.tag] = serialize(kVal, kDes.type as FieldsDescriptor);
        }
      } else {
        if (!isValidEnumValue(kVal, kDes.type as EnumDescriptor)) {
          throw Error(
            `${JSON.stringify(withType)}[${k}] is not a valid enum value.`
          );
        }
        ans[kDes.tag] = kVal;
      }
    } else {
      if (typeof kVal !== kDes.type) {
        throw Error(`${JSON.stringify(withType)}[${k}] is not a ${kDes.type}.`);
      } else {
        ans[kDes.tag] = kVal;
      }
    }
  });
  return ans;
}

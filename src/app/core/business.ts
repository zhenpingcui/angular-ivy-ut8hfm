import { assertTrue } from './assert';
import { FieldsDescriptor, EnumDescriptor } from './descriptor';
import { Proto, WithType } from './descriptor.mapping';
import { deserialize } from './deserialize';
import { serialize } from './serialize';
import { DeepReadonly } from './util';

export type BusinessDescriptor<
  AllBusinesses extends EnumDescriptor,
  Key extends keyof AllBusinesses,
  MS extends Methods
> = {
  businessType: AllBusinesses[Key];
} & MS;

export function businessDescriptor<
  AllBusinesses extends EnumDescriptor,
  Key extends keyof AllBusinesses,
  MS extends Methods
>(
  allBusinesses: AllBusinesses,
  key: Key,
  ms: MS
): BusinessDescriptor<AllBusinesses, Key, MS> {
  return {
    businessType: allBusinesses[key],
    ...ms,
  };
}
type MethodDescriptor = {
  request: FieldsDescriptor;
  response: FieldsDescriptor;
  tag: number;
};
type Methods = { [key: string]: MethodDescriptor };

export type Business<MS extends Methods> = {
  [p in keyof MS]: (request: Request<MS, p>) => Response<MS, p>;
};
type OrReadOnly<T> = {
  [p in keyof T]: T[p] | DeepReadonly<T[p]>;
};
export type Request<MS extends Methods, K extends keyof MS> = OrReadOnly<
  WithType<MS[K]['request']>
>;
export type Response<MS extends Methods, K extends keyof MS> = WithType<
  MS[K]['response']
>;

export type BusinessFactory<
  B extends BusinessDescriptor<any, any, MS>,
  MS extends Methods
> = (descriptor: B) => Business<MS>;

export class BusinessDirector {
  private businesses: { [key: number]: Business<any> } = {};
  private descriptors: { [key: number]: BusinessDescriptor<any, any, any> } =
    {};

  register<
    AllBusinesses extends EnumDescriptor,
    Key extends keyof AllBusinesses,
    MS extends Methods,
    B extends BusinessDescriptor<AllBusinesses, Key, MS>
  >(business: Business<MS>, descriptor: B) {
    const businessType = descriptor.businessType;
    // assertTrue(!this.businesses[businessType]);
    this.businesses[businessType] = business;
    this.descriptors[businessType] = descriptor;
  }
  execute(action: Action): ActionDone {
    try {
      return {
        d: this.executeMethod(
          this.businesses[action.b],
          action.m,
          action.d,
          this.descriptors[action.b]
        ),
      };
    } catch (e) {
      return {
        e: e.stack,
      };
    }
  }

  executeMethod(
    business: Business<any>,
    methodTag: number,
    requestProto: Proto,
    descriptor: BusinessDescriptor<any, any, any>
  ) {
    const method = Object.keys(descriptor).find((key) => {
      const val = descriptor[key];
      return val.tag !== undefined && val.tag === methodTag;
    });
    const requestDescriptor = descriptor[method].request;
    const request: any = deserialize(requestProto, requestDescriptor);
    const response = ((business as any)[method] as any)(request);
    const responseDescriptor = descriptor[method].response;
    return serialize(response, responseDescriptor);
  }
}
export const businessDirector = new BusinessDirector();

export interface AplClientMiddleWare {
  onSend(action: Action): Action;
  onSuccess(response: any): void;
  onFailed(error: any): boolean;
}
export class ApiClient {
  constructor(private middleWare?: AplClientMiddleWare) {}
  async callApi<
    AllBusinesses extends EnumDescriptor,
    Key extends keyof AllBusinesses,
    MS extends Methods,
    K extends keyof MS
  >(
    descriptor: BusinessDescriptor<AllBusinesses, Key, MS>,
    method: K,
    request: Request<MS, K>
  ): Promise<Response<MS, K> | undefined> {
    const methodDescriptor = (descriptor as any)[method] as MethodDescriptor;
    const requestProto = serialize(request as any, methodDescriptor.request);
    let action: Action = {
      b: descriptor.businessType,
      m: methodDescriptor.tag,
      d: requestProto,
    };
    if (this.middleWare) {
      action = this.middleWare.onSend(action);
    }
    const actionDone = businessDirector.execute(action);
    if (actionDone.d) {
      const response = deserialize(
        actionDone.d,
        methodDescriptor.response
      ) as any;
      this.middleWare?.onSuccess(response);
      return Promise.resolve(response);
    } else {
      if (this.middleWare?.onFailed(actionDone.e)) {
        return Promise.resolve(undefined);
      }
      return Promise.reject(actionDone.e);
    }
  }
}

type Action = {
  b: number; // business
  m: number; // method
  d: Proto; // data
};
type ActionDone = {
  d?: Proto; // data
  e?: any; // error
};

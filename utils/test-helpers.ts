import { isObject } from './object';

export class MockObject {
  original: unknown;
  object: unknown;
  property: string;
  value: unknown;

  constructor(object: unknown, property: string, value: unknown) {
    if (!isObject(object)) {
      throw new Error('Invalid object!');
    }

    this.original = object[property];
    this.object = object;
    this.property = property;
    this.value = value;
  }

  setup = () => {
    Object.defineProperty(this.object, this.property, {
      value: this.value,
      writable: true,
      configurable: true,
    });
  };

  restore = () => {
    Object.defineProperty(this.object, this.property, {
      value: this.original,
      writable: true,
      configurable: true,
    });
  };
}

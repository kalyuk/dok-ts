export function route() {
  return (target, propertyKey: string, descriptor: PropertyDescriptor) => {
    console.log(target, propertyKey, descriptor);
  };
}
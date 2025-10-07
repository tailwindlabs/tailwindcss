export function replaceObject<T extends object, U extends object | null>(target: T, source: U): U {
  // Clear out the target object, otherwise inspecting the final object will
  // look very confusing.
  for (let key in target) delete target[key]

  return Object.assign(target, source)
}

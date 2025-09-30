export type Writable<T> = T extends Readonly<infer U> ? U : T

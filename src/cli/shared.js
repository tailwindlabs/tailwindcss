// @ts-check

export const env = {
  DEBUG: process.env.DEBUG !== undefined && process.env.DEBUG !== '0',
  OXIDE: process.env.OXIDE,
}

// @flow
import math from 'utils/mathjs'

// TODO test this? Maybe Flow is good enough

export function validateBoolean(value: mixed) {
  const valueType = typeof value
  if (valueType !== 'boolean') {
    throw new TypeError('value must be boolean')
  }
}

export function isEqualNumerically(obj1: mixed, obj2: mixed): bool {
  if (obj1 === obj2) { return true }
  if (!(obj1 instanceof Array && obj2 instanceof Array)) { return false }
  if (obj1.length !== obj2.length) { return false }

  // Both objects are arrays of the same length
  return (obj1: any).every((element, index) => {
    return isEqualNumerically(element, (obj2: any)[index] )
  } )

}

export function isNumeric(value: mixed) {
  return typeof value === 'number'
}

export function validateNumeric(value: mixed) {
  if (isNumeric(value)) { return }
  throw TypeError(`Expected value to be a number, but it was an ${typeof value}`)
}

export function isVector(value: mixed, numComponents: number) {
  if (value instanceof Array) {
    if (value.length !== numComponents) { return false }
    return value.every(x => isNumeric(x))
  }
  return false
}

export function validateVector(value: mixed, numComponents: number) {
  if (isVector(value, numComponents)) { return }
  throw TypeError(`Expected value to be a ${numComponents}-component vector, but it is not.`)
}

// Validate that func is a function from R^numInputs to R^numpOutputs
export function validateFunctionSignature(func: mixed, numInputs: number, numOutputs: number) {
  if (!(typeof func === 'function')) {
    throw TypeError(`Expected a function, but received a ${typeof func}`)
  }

  if (func.length !== numInputs) {
    throw TypeError(`Expected function to have ${String(numInputs)} inputs`)
  }
  const theArgs = [...Array(numInputs)].map(() => Math.random())

  const result = func(...theArgs) // if func throws, well... then that's the error!

  if (numOutputs === 1) {
    if (isNumeric(result) || result instanceof math.type.Complex) {
      return
    }
    throw TypeError('Expected function to return a number, but it did not.')
  }
  if (numOutputs > 1) {
    if (isVector(result, numOutputs)) {
      return
    }
    throw TypeError(`Expected function to return a vector of length ${numOutputs}, but it did not.`)
  }
}

export function hasFunctionSignature(func: mixed, numInputs: number, numOutputs: number) {
  try {
    validateFunctionSignature(func, numInputs, numOutputs)
    return true
  }
  catch (err) {
    return false
  }
}

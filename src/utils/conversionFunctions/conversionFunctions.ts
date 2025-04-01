/* eslint-disable @typescript-eslint/no-explicit-any */

import { UserTable } from "../../types/userTable";

// convert snake_case to camelCase
const toCamelCase = (str: string): string => str.replace(/_([a-z])/g, (_, group1) => group1.toUpperCase());

// convert camelCase to snake_case
const toSnakeCase = (str: string): string => str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);

// transform object keys in arrays or objects, selectively based on a condition
const transformKeys = (data: any, transformFn: (str: string) => string, keysToTransform?: string[]): any => {
  if (Array.isArray(data)) {
    return data.map((item) => transformKeys(item, transformFn, keysToTransform)); // Handle array of objects
  }

  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        // Transform key only if it's in the keysToTransform array or transform all keys by default
        if (!keysToTransform || keysToTransform.includes(key)) {
          return [transformFn(key), value];
        }
        return [key, value];
      })
    );
  }

  return data;
};

export const transformToCamelCase = (data: any, keysToTransform?: string[]): any => transformKeys(data, toCamelCase, keysToTransform);

export const transformToSnakeCase = (data: any, keysToTransform?: string[]): any => transformKeys(data, toSnakeCase, keysToTransform);

export const replaceNullWithUndefined = (obj: any) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = obj[key] === null ? undefined : obj[key];
    return acc;
  }, {} as Record<string, any>);
};

export const convertUsersToTravelers = (userArray: UserTable[]) => {
  return userArray.map(user => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}` 
  }));
};


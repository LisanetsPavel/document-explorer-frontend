import { createContext } from 'react';
import { AppAction, initialAppState } from './AppReducer.ts';

export const AppContext = createContext(initialAppState);

// @ts-expect-error ESLint: 'args' is defined but never used.(@typescript-eslint/no-unused-vars)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AppDispatchContext = createContext((args: AppAction) => {});

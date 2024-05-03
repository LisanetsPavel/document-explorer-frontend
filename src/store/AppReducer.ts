import { FilePreviewType } from '../types/FilePreviewType.ts';

import { Message } from '../types/History.ts';
import { PUT_MESSAGE, REMOVE_FILE_PREVIEW, SELECT_FILE, SET_FILE_PREVIEW, SET_HISTORY, UPDATE_LAST_MESSAGE } from './actions.ts';

type History = { [key: string]: Message[] };

export interface AppState {
    selectedFile?: string;
    previewFile?: FilePreviewType;
    history: History;
}

interface MessagePayload {
    historyId: string;
    message: Message;
}

interface SetHistoryPayload {
    historyId: string;
    messages: Message[];
}

export type AppAction = { type: string; payload?: object | string | number | MessagePayload };

export const initialAppState: AppState = {
    selectedFile: undefined,
    previewFile: undefined,
    history: {
        fakeId1: [
            {
                text: 'The first mock history?',
                isMyMessage: true,
            },
            {
                text: 'Mock answer 1',
                isMyMessage: false,
            },
        ],
        fakeId2: [
            {
                text: 'The second mock history? (It`s not connected to API yet)',
                isMyMessage: true,
            },
            {
                text: 'Mock answer 2',
                isMyMessage: false,
            },
            {
                text: 'Mock question',
                isMyMessage: true,
            },
            {
                text: 'Mock answer 3',
                isMyMessage: false,
            },
        ],
    },
};

export function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case SELECT_FILE: {
            return { ...state, selectedFile: action.payload as string };
        }
        case SET_FILE_PREVIEW: {
            return { ...state, previewFile: action.payload as FilePreviewType };
        }
        case REMOVE_FILE_PREVIEW: {
            return { ...state, previewFile: undefined };
        }
        case SET_HISTORY: {
            const payload = action.payload as SetHistoryPayload;
            return { ...state, history: { ...state.history, [payload.historyId]: payload.messages } };
        }
        case PUT_MESSAGE: {
            const payload = action.payload as MessagePayload;
            return { ...state, history: { ...state.history, [payload.historyId]: [...state.history[payload.historyId], payload.message] } }; // { ...state, history: { ...state.history, [payload.historyId]: payload.message } };
        }
        case UPDATE_LAST_MESSAGE: {
            const payload = action.payload as MessagePayload;
            return {
                ...state,
                history: { ...state.history, [payload.historyId]: [...state.history[payload.historyId].slice(0, -1), payload.message] },
            };
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

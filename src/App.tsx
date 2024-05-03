import './App.css';
import { RouterProvider } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import AuthenticatorWrapper from './components/Auth/AuthenticatorWrapper/AuthenticatorWrapper.tsx';
import { useReducer } from 'react';
import { AppContext, AppDispatchContext } from './store/AppContext.ts';
import { appReducer, initialAppState } from './store/AppReducer.ts';
import { ThemeProvider } from '@material-tailwind/react';
import { pdfjs } from 'react-pdf';
import { router } from './utils/router.tsx';
import { configureAmplify } from './utils/amplify.ts';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

configureAmplify();

function App() {
    const [state, dispatch] = useReducer(appReducer, initialAppState);

    return (
        <>
            <ThemeProvider>
                <AppContext.Provider value={state as never}>
                    <AppDispatchContext.Provider value={dispatch}>
                        <AuthenticatorWrapper>{() => <RouterProvider router={router} />}</AuthenticatorWrapper>
                    </AppDispatchContext.Provider>
                </AppContext.Provider>
            </ThemeProvider>
        </>
    );
}

export default App;

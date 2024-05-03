import * as React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { AuthUser } from 'aws-amplify/auth';

import { useEffect } from 'react';
import { components, formFields } from './utils';

// @ts-expect-error TS2307: Cannot find module
import { SignOut } from '@aws-amplify/ui-react/dist/types/components/Authenticator/Authenticator';

interface Props {
    children: React.ReactNode | ((props: { signOut?: SignOut; user?: AuthUser }) => JSX.Element);
}
export default function AuthenticatorWrapper({ children }: Props) {
    useEffect(() => {
        const elements = document.querySelectorAll('button.amplify-button.amplify-field-group__control');
        elements.forEach((item: Element) => {
            if (item.textContent === 'Resend Code') {
                item?.parentNode?.removeChild(item);
            }
        });
        const passwordElements = document.querySelectorAll('.amplify-flex.amplify-field.amplify-textfield.amplify-passwordfield');
        const timeNow = new Date().getTime().toString();
        passwordElements.forEach((item: Element) => {
            const htmlElement = item as HTMLElement;
            const input = htmlElement.getElementsByTagName('input')[0];
            input.value = `${timeNow}15CharactersNow`;
            htmlElement.style.display = 'none';
        });
    });

    return (
        <Authenticator components={components} formFields={formFields} initialState="signUp">
            {children}
        </Authenticator>
    );
}

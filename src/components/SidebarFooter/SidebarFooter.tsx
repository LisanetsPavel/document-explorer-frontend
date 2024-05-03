import { useEffect, useState } from 'react';
import { FetchUserAttributesOutput, fetchUserAttributes } from 'aws-amplify/auth';

export default function SidebarFooter() {
    const [attributes, setAttributes] = useState<FetchUserAttributesOutput>();

    useEffect(() => {
        async function getAttributes() {
            const userAttributes = await fetchUserAttributes();
            setAttributes(userAttributes);
        }
        getAttributes();
    }, []);

    return <div className="grow content-end">{attributes?.email}</div>;
}

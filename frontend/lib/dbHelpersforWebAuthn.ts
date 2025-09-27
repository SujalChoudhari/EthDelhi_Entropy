// app/lib/mockDB.ts
interface UserCredentials {
    id: string;
    publicKey: Uint8Array;
    counter: number;
    deviceType: string;
    backedUp: boolean;
    transports: string[];
}

export const addUser = async (userID: string, credentials: UserCredentials) => {
    // Convert Uint8Array to a regular array of numbers
    const publicKeyArray = Array.from(credentials.publicKey);
    
    console.log(`Public key as array: ${publicKeyArray.length} numbers`);
    
    const response = await fetch(`http://localhost:8000/webauthn/add_user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userID,
            credential_id: credentials.id,
            public_key: publicKeyArray, // Send as a regular array
            counter: credentials.counter,
            device_type: credentials.deviceType,
            backed_up: credentials.backedUp,
            transports: credentials.transports,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add user: ${errorText}`);
    }

    return await response.json();
}

export const findUser = async (userID: string): Promise<UserCredentials> => {
    const response = await fetch(`http://localhost:8000/webauthn/find_user/${userID}`);

    if (!response.ok) {
        throw new Error('User not found');
    }

    const userData = await response.json();

    if (userData.message) {
        throw new Error(userData.message);
    }

    // Convert the array of numbers back to Uint8Array
    const publicKeyArray = new Uint8Array(userData.public_key);
    
    console.log(`Retrieved public key length: ${publicKeyArray.length} bytes`);

    return {
        id: userData.credential_id,
        publicKey: publicKeyArray,
        counter: userData.counter,
        deviceType: userData.device_type,
        backedUp: userData.backed_up,
        transports: userData.transports
    };
}


export const updateUserCounter = async (userID: string, counter: number) => {
    const response = await fetch(`http://localhost:8000/webauthn/update_counter/${userID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ counter }),
    });

    if (!response.ok) {
        throw new Error('Failed to update user counter');
    }

    return await response.json();
}

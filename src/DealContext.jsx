import { createContext, useState } from 'react';

export function DealProvider({ children }) {
	const [loggedUser, setLoggedUser] = useState({
		loggedUser: '',
	});
    const [balance, setBalance] = useState(0);

    const updateBalance = (amount) => {
        setBalance(prevBalance => prevBalance + amount);
    };

	const resetBalance = () => {
        setBalance(0);
    };

	const resetUser = () => {
        setLoggedUser({loggedUser: ''});
    };

	return (
        <DealContext.Provider value={{ loggedUser, setLoggedUser, balance, updateBalance, resetBalance, resetUser  }}>
			{children}
		</DealContext.Provider>
	);
}

export const DealContext = createContext();

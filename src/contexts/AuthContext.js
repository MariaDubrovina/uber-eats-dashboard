import { createContext, useState, useEffect, useContext } from 'react';
import { Auth, DataStore } from 'aws-amplify';
import { Restaurant } from '../models';



const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const [authRestaurant, setAuthRestaurant] = useState(null);
    const [dbRestaurant, setDbRestaurant] = useState(null);

    const sub = authRestaurant?.attributes?.sub;

    useEffect(() => {
        Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthRestaurant);
    }, []);

    useEffect(() => {
        if (!sub) {
            return;
        }
       DataStore.query(Restaurant, (restaurant) => restaurant.adminSub('eq', sub)).then((restaurants) => setDbRestaurant(restaurants[0]));
    }, [sub]);

    

    return (
        <AuthContext.Provider value={{dbRestaurant, setDbRestaurant, sub}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
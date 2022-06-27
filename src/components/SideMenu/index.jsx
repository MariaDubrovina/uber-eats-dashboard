import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useAuthContext } from '../../contexts/AuthContext';


const SideMenu = () => {
    const navigate = useNavigate();
    const {dbRestaurant} = useAuthContext();


    const mainMenuItems = [

      {
        key: '/',
        label: 'Orders'
       },
       {
        key: 'menu',
        label: 'Menu'
       },
       {
        key: 'history',
        label: 'Orders History'
       },
    ];

    const menuItems = [
      ...(dbRestaurant ? mainMenuItems : []),
       {
        key: 'settings',
        label: 'Settings'
       },
       {
        key: 'signOut',
        label: 'Sign Out',
        danger: 'true'
       }
      ];

      const onMenuItemClick = async (menuItem) => {
        if (menuItem.key === 'signOut') {
          await Auth.signOut();
          window.location.reload(); //refresh page after sign out
        } else {
          navigate(menuItem.key)
        }
        
      };


    return (
        <>
          {dbRestaurant && <h4>{dbRestaurant.name}</h4>}
          <Menu
              onClick={onMenuItemClick}        
              items={menuItems}
          />
        </>
    )
};

export default SideMenu;
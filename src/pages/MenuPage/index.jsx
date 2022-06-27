import { Card, Table, Popconfirm, Button, message } from 'antd';
import classes from './MenuPage.module.css';
import { Link } from 'react-router-dom';

import {DataStore} from 'aws-amplify';
import {Dish} from '../../models';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


const MenuPage = () => {
  const [dishes, setDishes] = useState([]);
  const {dbRestaurant} = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!dbRestaurant) {
      return;
    }
    DataStore.query(Dish, (dish) => 
      dish.restaurantID('eq', dbRestaurant.id)).then(setDishes);
  }, [dbRestaurant]);


  const deleteDish = (dish) => {
    DataStore.delete(dish);
    setDishes(dishes.filter(d => d.id != dish.id));
  };
  
  

    const columns = [
        {
          title: 'Menu Item',
          dataIndex: 'name',
          key: 'name',
          
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
          render: (price) => `${price} $`,
        },
        {
          title: 'Action',
          key: 'action',
          render: (_, item) => 
          <>
            <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteDish(item)}
            okText="Yes"
            cancelText="No"
          >
              <Button danger>Delete</Button>
           </Popconfirm>

           <Link to={`update/${item.id}`}>
              <Button style={{color: 'blue', borderColor: 'blue', marginLeft: 20}} >Update</Button>
           </Link>
          </>
        },
      ];

      const newItemButton = () => {
        return (
          <Link to={'create'}>
            <Button type="primary">New Item</Button>
          </Link>
        )
      };

    return (
        <div className={classes.cardWrapper}>
            <Card
                title="Menu"
                bordered={false}
                extra={newItemButton()}
            >
                <Table dataSource={dishes} 
                        columns={columns} 
                        rowKey='id'
                        
                
                />
                                  
            </Card>
        </div>
    )
};

export default MenuPage;
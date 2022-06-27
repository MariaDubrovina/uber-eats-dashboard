import { Card, Table, Tag } from 'antd';
import classes from './OrdersPage.module.css';
import { useNavigate } from 'react-router-dom';

import {DataStore} from 'aws-amplify';
import {Order, OrderStatus} from '../../models';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const {dbRestaurant} = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!dbRestaurant) {
      return;
    }
    DataStore.query(Order, (order) => 
      order.orderRestaurantId('eq', dbRestaurant.id)
      .or((orderStatus) => 
        orderStatus
        .status('eq', "NEW")
        .status('eq', "COOKING")
        .status('eq', "READY_FOR_PICKUP")
        .status('eq', 'ACCEPTED')
      )     
    ).then(setOrders);
  }, [dbRestaurant]);


  useEffect(() => {
    
    const subscription = DataStore.observe(Order).subscribe(({opType, element}) => {
        if (opType === 'INSERT' && element.orderRestaurantId === dbRestaurant.id) {
           setOrders((existingOrders) => [element, ...existingOrders])
        }
    });

    // Call unsubscribe to close the subscription
    return () => subscription.unsubscribe();
}, []);


    const renderOrderStatus = (orderStatus) => {
       
            const statusToColor = {
              [OrderStatus.ACCEPTED]: 'green',
              [OrderStatus.NEW]: 'orange',
              [OrderStatus.COOKING]: 'blue',
              [OrderStatus.READY_FOR_PICKUP]: 'red'
            };
            
            return <Tag color={statusToColor[orderStatus]}>{orderStatus}</Tag>
    };

    const columns = [
        {
          title: 'Order ID',
          dataIndex: 'id',
          key: 'id',
          
        },
        {
          title: 'Created at',
          dataIndex: 'createdAt',
          key: 'createdAt',
          render: (createdAt) => dayjs(createdAt).fromNow() // 20 years ago
        },
        {
          title: 'Price',
          dataIndex: 'total',
          key: 'total',
          render: (total) => `${total.toFixed(2)} $`,
        },
        {
          title: 'Status',
          key: 'status',
          dataIndex: 'status',
          render: renderOrderStatus
        },
      ];


      // 👇️ create copy and reverse
    const reversedOrders = [...orders].reverse();

    return (
        <div className={classes.cardWrapper}>
            <Card
                title="Orders"
                bordered={false}
            >
                <Table dataSource={reversedOrders} 
                        columns={columns} 
                        rowKey='id'
                        onRow={(orderItem) => ({
                          onClick: () => navigate(`order/${orderItem.id}`)
                        })}
                        style={{cursor: "pointer"}}
                />
                                  
            </Card>
        </div>
    )
};

export default OrdersPage;
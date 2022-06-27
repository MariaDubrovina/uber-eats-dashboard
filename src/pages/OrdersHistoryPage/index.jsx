import { Card, Table, Tag } from 'antd';
import classes from './OrdersHistoryPage.module.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import {DataStore} from 'aws-amplify';
import {Order, OrderStatus} from '../../models';
import { useNavigate } from 'react-router-dom';

const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const OrdersHistoryPage = () => {
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
        .status('eq', 'COMPLETED')
        .status('eq', 'PICKED_UP')
        .status('eq', 'DECLINED_BY_RESTAURANT')
      )     
    ).then(setOrders);
  }, [dbRestaurant]);

  const renderOrderStatus = (orderStatus) => {
       
    const statusToColor = {
      [OrderStatus.PICKED_UP]: 'orange',
      [OrderStatus.DECLINED_BY_RESTAURANT]: 'red',
      [OrderStatus.COMPLETED]: 'gray'
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

    return (
        <div className={classes.cardWrapper}>
            <Card
                title="Orders History"
                bordered={false}
            >
                <Table dataSource={orders} 
                        columns={columns} 
                        rowKey='id'
                        onRow={(orderItem) => ({
                          onClick: () => navigate(`/order/${orderItem.id}`)
                        })}
                        style={{cursor: "pointer"}}
                
                />
                                  
            </Card>
        </div>
    )
};

export default OrdersHistoryPage;
import { Card, Descriptions, Divider, List, Button, Tag, Spin, message } from 'antd';
import classes from './OrderDetailsPage.module.css';
import { useParams } from "react-router-dom";
import {DataStore} from 'aws-amplify';
import {Order, User, OrderItem, OrderStatus} from '../../models';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';


const OrderDetailsPage = () => {
    const {id} = useParams();
    const [order, setOrder] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    
    const {dbRestaurant} = useAuthContext();
    const subtotalPrice = orderItems.reduce((sum, orderItem) => sum + orderItem.quantity * orderItem.Dish.price, 0);

    const renderOrderStatus = (orderStatus) => {
       
        const statusToColor = {
          [OrderStatus.ACCEPTED]: 'green',
          [OrderStatus.NEW]: 'orange',
          [OrderStatus.COOKING]: 'blue',
          [OrderStatus.READY_FOR_PICKUP]: 'red'
        };
        
        return <Tag color={statusToColor[orderStatus]}>{orderStatus}</Tag>
};


    useEffect(() => {
        DataStore.query(Order, id).then(setOrder);
      }, [id]);

    useEffect(() => {
        if (order?.userID) {
            DataStore.query(User, order.userID).then(setCustomer);
        }    
      }, [order?.userID]);



    useEffect(() => {
        if (!order?.id) {
           return; 
        }
        DataStore.query(OrderItem, (oi) => oi.orderID('eq', order.id)).then(setOrderItems);
      }, [order?.id]);

      

    const onDeclineOrder = async () => {
        const declined = 'Order has been declined';
        updateOrderStatus(OrderStatus.DECLINED_BY_RESTAURANT, declined)
    };


    const onAcceptOrder = () => {
        updateOrderStatus(OrderStatus.COOKING, 'Order has been accepted')
    };

    const onFoodReady = () => {
       updateOrderStatus(OrderStatus.READY_FOR_PICKUP, 'Order is ready for Pick Up')
    };

    const updateOrderStatus = async (orderStatus, text) => {
        try {
            const updatedOrder = await DataStore.save(
              Order.copyOf(order, (updated) => {
                updated.status = orderStatus;
              }));
              setOrder(updatedOrder);
              message.success(text);
          } catch (error) {
            message.error(error.message);
          }  
    };


    if (!order) {
        return  <Spin size="large" />;
    }

    return (
        <div className={classes.cardWrapper}>
            <Card
                title={`Order ${id}`}
                bordered={false}
                extra={renderOrderStatus(order?.status)}
            >
                <Descriptions title="Customer Info" bordered>
                    <Descriptions.Item label="Customer" span={3}>
                        {customer?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Customer Address" span={3}>
                        {customer?.address}
                    </Descriptions.Item>
                </Descriptions>
                
                <Divider />

                <p className={classes.title}>Ordered from Menu</p>

                <List
                    dataSource={orderItems}
                    renderItem={(item) => (
                        <List.Item>
                            <div>{item.Dish.name} x{item.quantity}</div>
                            <div>${item.Dish.price}</div>
                        </List.Item>
                    )}
                />

                <Divider />

                <div className={classes.priceContainer}>
                    <h2>Subtotal:</h2>
                    <h2 className={classes.totalPrice}>${subtotalPrice.toFixed(2)}</h2>
                </div>

                <div className={classes.priceContainer}>
                    <h2>Delivery Fee:</h2>
                    <h2 className={classes.totalPrice}>${dbRestaurant?.deliveryFee?.toFixed(2)}</h2>
                </div> 

                <div className={classes.priceContainer}>
                    <h2>Total:</h2>
                    <h2 className={classes.totalPrice}>${order?.total?.toFixed(2)}</h2>
                </div>

                <Divider />

                {order?.status === OrderStatus.NEW && (
                    <div className={classes.buttonContainer}>
                    
                        <Button onClick={onDeclineOrder} type="danger" size='large' className={classes.button} block>
                            Decline Order
                        </Button>
                        <Button onClick={onAcceptOrder} type="primary" size='large' className={classes.button} block>
                            Accept Order
                        </Button>
                    
                    </div>
                )}
                {order?.status === OrderStatus.COOKING && (
                    <div className={classes.buttonContainer}>
                        <Button onClick={onFoodReady} type="primary" size='large' className={classes.button} block>
                                FOOD IS DONE
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    )
};

export default OrderDetailsPage;
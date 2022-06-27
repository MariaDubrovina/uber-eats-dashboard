import { Card, Form, Input, InputNumber, Button, message, Spin } from 'antd';
import { useState } from 'react';
import classes from './SettingsPage.module.css';
import { DataStore } from 'aws-amplify';
import { Restaurant } from '../../models';
import { useAuthContext } from '../../contexts/AuthContext';
import { useEffect } from 'react';


const SettingsPage = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState("");
    const [image, setImage] = useState("");
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [minDeliveryTime, setMinDeliveryTime] = useState(0);
    const [maxDeliveryTime, setMaxDeliveryTime] = useState(0);

    const {dbRestaurant, setDbRestaurant, sub} = useAuthContext();

    console.log('rest', name);
    useEffect(() => {
      
      if (dbRestaurant) {      
        setName(dbRestaurant.name);
        setAddress(dbRestaurant.address);
        setImage(dbRestaurant.image);
        setDeliveryFee(dbRestaurant.deliveryFee);
        setMinDeliveryTime(dbRestaurant.minDeliveryTime);
        setMaxDeliveryTime(dbRestaurant.maxDeliveryTime);
      }
    }, [dbRestaurant]);

    const onFinish = async () => {
      if (dbRestaurant) {
        await updateRestaurant();
      } else {
        await createRestaurant();
      };
    };

    const createRestaurant = async () => {
      try {
        const restaurant = await DataStore.save(
          new Restaurant({
            name, 
            address,
            image,
            deliveryFee,
            minDeliveryTime,
            maxDeliveryTime,
            lat: 0, 
            lng: 0, 
            adminSub: sub}));
          setDbRestaurant(restaurant);
          
          message.success('Restaurant has been succesfully created!');
      } catch (error) {
        message.error(error.message);
        
      }
    };

    const updateRestaurant = async () => {
      try {
        const updatedRestaurant = await DataStore.save(
          Restaurant.copyOf(dbRestaurant, (updated) => {
            updated.name = name;
            updated.address = address;
            updated.image = image;
            updated.deliveryFee = deliveryFee;
            updated.minDeliveryTime = minDeliveryTime;
            updated.maxDeliveryTime = maxDeliveryTime;
          }));
          setDbRestaurant(updatedRestaurant);
          message.success('Restaurant has been succesfully updated!');
      } catch (error) {
        message.error(error.message);
      }
      
    };

   

    return (
        <div className={classes.cardWrapper}>
            <Card
                title="Restaurant Details"
                bordered={false}
            >
                 <Form
                    layout="vertical"
                    wrapperCol={{
                        span: 8,
                      }}
                    onFinish={onFinish}
                    >
                    <Form.Item label="Restaurant Name" 
                                name="restaurantName"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please enter restaurant name',
                                    },
                                  ]}
                    >
                       <Input 
                          placeholder='Enter restaurant name'
                          value={name}
                          onChange={(e) => setName(e.target.value)} 
                        />
                    </Form.Item>

                    <Form.Item label="Restaurant Address" 
                                name="restaurantAddress"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please enter address',
                                    },
                                  ]}

                    >
                       <Input placeholder='Enter restaurant address'
                              value={address}
                              onChange={(e) => setAddress(e.target.value)} 
                        />
                    </Form.Item>

                    <Form.Item label="Restaurant Image" 
                                name="restaurantImage"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please enter link of the image',
                                    },
                                  ]}

                    >
                       <Input placeholder='Enter link of the image'
                              value={image}
                              onChange={(e) => setImage(e.target.value)} 
                        />
                    </Form.Item>

                    <Form.Item label="Delivery Fee" 
                                name="deliveryFee"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please enter Delivery Fee',
                                    },
                                  ]}

                    >
                       <InputNumber 
                              value={deliveryFee}
                              onChange={(value) => setDeliveryFee(value)} 
                        />
                    </Form.Item>

                    <Form.Item label="Minimum Delivery Time" 
                                name="minDeliveryTime"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please enter Minimum Delivery Time',
                                    },
                                  ]}

                    >
                       <InputNumber 
                              value={minDeliveryTime}
                              onChange={(value) => setMinDeliveryTime(value)} 
                        />
                    </Form.Item>

                    <Form.Item label="Maximum Delivery Time" 
                                name="maxDeliveryTime"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please enter Maximum Delivery Time',
                                    },
                                  ]}

                    >
                       <InputNumber 
                              value={maxDeliveryTime}
                              onChange={(value) => setMaxDeliveryTime(value)} 
                        />
                    </Form.Item>

                    
                    <Form.Item >
                        <Button type="primary" htmlType="submit" block>
                             Submit
                        </Button>
                    </Form.Item>
                    
                </Form>
                                  
            </Card>
        </div>
    )
};

export default SettingsPage;
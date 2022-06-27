import { Card, Form, Input, InputNumber, Button, message, Spin } from 'antd';
import classes from './SettingsPage.module.css';
import { DataStore } from 'aws-amplify';
import { Restaurant } from '../../models';
import { useAuthContext } from '../../contexts/AuthContext';



const SettingsPage = () => {
    
    const {dbRestaurant, setDbRestaurant, sub} = useAuthContext();

   

    const onFinish = async ({name, address, image, deliveryFee, minDeliveryTime, maxDeliveryTime}) => {
      if (dbRestaurant) {
        await updateRestaurant(name, address, image, deliveryFee, minDeliveryTime, maxDeliveryTime);
      } else {
        await createRestaurant(name, address, image, deliveryFee, minDeliveryTime, maxDeliveryTime);
      };
    };

    const createRestaurant = async ( name, address, image, deliveryFee, minDeliveryTime, maxDeliveryTime) => {
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

    const updateRestaurant = async (name, address, image, deliveryFee, minDeliveryTime, maxDeliveryTime) => {
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

    if (!dbRestaurant) {
      return  <Spin size="large" />;
  }

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
                    initialValues={{
                      name: dbRestaurant?.name, 
                      address: dbRestaurant?.address,
                      image: dbRestaurant?.image,
                      deliveryFee: dbRestaurant?.deliveryFee.toFixed(2),
                      minDeliveryTime: dbRestaurant?.minDeliveryTime,
                      maxDeliveryTime: dbRestaurant?.maxDeliveryTime,
                    }}
                    >
                    <Form.Item label="Restaurant Name" 
                                name="name"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please enter restaurant name',
                                    },
                                  ]}
                    >
                       <Input 
                          placeholder='Enter restaurant name' />
                    </Form.Item>

                    <Form.Item label="Restaurant Address" 
                                name="address"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please enter address',
                                    },
                                  ]}

                    >
                       <Input placeholder='Enter restaurant address' />
                    </Form.Item>

                    <Form.Item label="Restaurant Image" 
                                name="image"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please enter link of the image',
                                    },
                                  ]}

                    >
                       <Input placeholder='Enter link of the image' />
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
                       <InputNumber />
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
                       <InputNumber />
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
                       <InputNumber />
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
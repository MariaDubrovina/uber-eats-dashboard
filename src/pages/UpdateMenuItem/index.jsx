import { Card, Form, Input, InputNumber, Button, message, Spin } from 'antd';
import classes from './UpdateMenuItem.module.css';
import { DataStore } from 'aws-amplify';
import { Dish } from '../../models';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';

const { TextArea } = Input;

const UpdateMenuItem = () => {
  const {id} = useParams();
  const [dish, setDish] = useState(null);
  
  const navigate = useNavigate();


  useEffect(() => {
    DataStore.query(Dish, id).then(setDish);
  }, [id]);

  

  const onFinish = async ({name, description, price}) => {
    try {
     await DataStore.save(
        Dish.copyOf(dish, (updated) => {
          updated.name = name;
          updated.description = description;
          updated.price = price;
          
      }));
        
        message.success('Dish was successfully updated!');
        navigate('/menu');
    } catch (error) {
      message.error(error.message);
    }  
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  if (!dish) {
    return  <Spin size="large" />;
}


    return (
        <div className={classes.cardWrapper}>
            <Card
                title="Update Menu Item"
                bordered={false}
            >
                 <Form
                    layout="vertical"
                    wrapperCol={{
                        span: 8,
                      }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{
                      name: dish?.name,
                      description: dish?.description,
                      price: dish?.price
                    }}
                    
                    >
                    <Form.Item label="Dish Name" 
                                name="name"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please enter dish name',
                                    },
                                  ]}
                    >
                       <Input placeholder='Enter dish name'/>
                    </Form.Item>

                    <Form.Item label="Description" 
                                name="description"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please enter description',
                                    },
                                  ]}
                    >
                       <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item label="Price ($)" 
                                name="price"
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please enter price',
                                    },
                                  ]}
                    >
                       <InputNumber />
                    </Form.Item>

                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                             Submit
                        </Button>
                    </Form.Item>
                    
                </Form>
                                  
            </Card>
        </div>
    )
};

export default UpdateMenuItem;
import { Card, Form, Input, InputNumber, Button, message } from 'antd';
import classes from './CreateMenuItem.module.css';
import { DataStore } from 'aws-amplify';
import { Dish } from '../../models';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const CreateMenuItem = () => {
  const {dbRestaurant} = useAuthContext();
  const navigate = useNavigate();

  const onFinish = ({name, description, price}) => {
    try {
     DataStore.save(
        new Dish({
          name,
          description,
          price,
          restaurantID: dbRestaurant.id}));
        
        
        message.success('New Item has been succesfully created!');
        navigate('/menu')
    } catch (error) {
      message.error(error.message);
      
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

    return (
        <div className={classes.cardWrapper}>
            <Card
                title="New Menu Item"
                bordered={false}
            >
                 <Form
                    layout="vertical"
                    wrapperCol={{
                        span: 8,
                      }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
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
                       <Input placeholder='Enter dish name' />
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

export default CreateMenuItem;
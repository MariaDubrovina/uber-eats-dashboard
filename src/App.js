import { Layout, Image } from 'antd';
import logo from './assets/logo.jpg'
import SideMenu from "./components/SideMenu";
import AppRoutes from "./components/AppRoutes";
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import AuthContextProvider from './contexts/AuthContext';

Amplify.configure(awsExports);


const { Content, Footer, Sider } = Layout;

function App() {
  return (
    <AuthContextProvider>
      <Layout>
        <Sider style={{
          minHeight: '100vh', backgroundColor: 'white'
        }}>
          <Image
            src={logo}
            preview={false}
          />

          <SideMenu />

        </Sider>
        <Layout>       
          <Content>
            <AppRoutes />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Uber Eats Restaurant Dashboard Â©2022
          </Footer>

        </Layout>
      </Layout>
    </AuthContextProvider>

   
  );
}

export default withAuthenticator(App);

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import AIAssistantChatBox from '../AIAssistantChatBox.jsx';

function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <AIAssistantChatBox />  
    </>
  );
}

export default AppLayout;

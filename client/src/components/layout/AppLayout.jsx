import { Outlet } from 'react-router-dom';
import Footer from './Footer.jsx';
import Header from './Header.jsx';

function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default AppLayout;

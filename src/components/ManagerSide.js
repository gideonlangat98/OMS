import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeftCircle } from 'react-icons/bs';
import Logo from '../assets/images/logo.svg';
import HamburgerButton from './HamburgerMenuButton/HamburgerButton';
import {
    FaTasks,
    FaChevronRight,
    FaThLarge
  } from 'react-icons/fa';

const ManagerSide = ({ dashboardType }) => {
  const [open, setOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeDashboard, setActiveDashboard] = useState(false);

  const Menus = [
    {
      title: 'Dashboard',
      path: '/managerdash',
      isDashboard: true,
      icon: <FaThLarge />,
    },

    { title: 'Projects', path: '/projects', icon: <FaTasks /> },
    { title: 'Tasks', path: '/tasks', icon: <FaTasks /> },
    { title: 'Task report', path: '/task-report', icon: <FaTasks /> },
  ];

  const handleDashboardClick = () => {
    setActiveDashboard(!activeDashboard);
  };

  return (
    <>
      <div
        className={`${
          open ? 'w-95' : 'w-fit'
        } hidden sm:block fixed top-0 left-0 h-screen duration-300 bg-black border-r border-gray-200 dark:border-gray-600 p-4 dark:bg-slate-800`}
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: '#4A5568 #1A202C',
          paddingRight: '8rem',
        }}
      >
        <BsArrowLeftCircle
          className={`${
            !open && 'rotate-180'
          } absolute text-3xl bg-white fill-gray-400 rounded-full cursor-pointer top-9 -right-1 mr-2 dark:fill-gray-400 dark:bg-gray-800`}
          onClick={() => setOpen(!open)}
        />
        <Link to="/">
          <div className={`flex ${open && 'gap-x-4'} items-center`}>
            <img src={Logo} alt="" className="bg-fuchsia-500 rounded-full" />
            {open && (
              <span className="text-xl font-medium whitespace-nowrap dark:text-gray-200">
                OMS
              </span>
            )}
          </div>
        </Link>

        <ul
          className="pt-6 space-y-2 text-white flex-1"
          style={{
            maxHeight: 'calc(100vh - 200px)',
            textDecoration: 'none',
            paddingRight: '15px',
            marginRight: '-15px',
            listStyle: 'none',
          }}
        >
          {Menus.map((menu, index) => (
            <li
              key={index}
              className={`${
                menu.isDashboard && 'flex' && 'mr-4'
              } items-center gap-x-3 p-2 pl-8 text-base font-normal rounded-lg dark:text-gray-200`}
              style={{ width: '100%', alignItems: 'center' }}
            >
              <Link
                to={
                  dashboardType === 'manager'
                    ? `/managerdashboard${menu.path}`
                    : `/admindashboard${menu.path}`
                }
                className="flex items-center gap-x-2 hover:bg-fuchsia-600 rounded-lg p-2"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                onClick={() => {
                  if (menu.isDashboard) {
                    handleDashboardClick();
                  }
                }}
              >
                {menu.icon && (
                  <span className="text-2xl mr-2">{menu.icon}</span>
                )}
                <span className={`${!open && 'hidden'} origin-left text-white`}>
                  {menu.title}
                </span>
                <FaChevronRight className="ml-auto text-gray-400" /> 
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-3">
        <HamburgerButton setMobileMenu={setMobileMenu} mobileMenu={mobileMenu} />
      </div>
      <div className="sm:hidden">
        <div
          className={`${
            mobileMenu ? 'flex' : 'hidden'
          } absolute z-50 flex-col items-center self-end py-8 mt-16 space-y-4 font-semibold sm:w-auto left-6 right-6 dark:text-white  bg-gray-50 dark:bg-slate-800 drop-shadow md rounded-xl`}
        >
          {Menus.map((menu, index) => (
            <Link
              to={
                dashboardType === 'manager'
                  ? `/managerdashboard${menu.path}`
                  : `/admindashboard${menu.path}`
              }
              key={index}
              onClick={() => {
                setMobileMenu(false);
                if (menu.isDashboard) {
                  handleDashboardClick();
                }
              }}
            >
              <span
                className="py-2 px-10 rounded-lg hover:bg-fuchsia-600"
                style={{ width: '100%', paddingRight: '2.5rem' }}
              >
                {menu.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ManagerSide;
import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BallotIcon from '@mui/icons-material/Ballot';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

export const SidebarData = [
    {
        title: "Dashboard",
        icon: <DashboardIcon />,
        link: "/dashboard"
    },
    {
        title: "Inventory",
        icon: <BallotIcon />,
        link: "/inventory"
    },
    {
        title: "Order",
        icon: <ShoppingCartIcon />,
        link: "/order"
    },
    {
        title: "Manage",
        icon: <ManageAccountsIcon />,
        link: "/home"
    }
] 
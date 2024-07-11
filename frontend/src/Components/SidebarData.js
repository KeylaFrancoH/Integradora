import React from "react";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

export const SidebarData = [
    {
        title: "Catálogos",
        icon: <AiIcons.AiFillBook />,
        ionClosed: <RiIcons.RiArrowDownFill />,
        iconOpened: <RiIcons.RiArrowUpFill />,
        subNav: [
            {
                title: "Clientes",
                path: "/Clientes",
                icon: <IoIcons.IoIosPaper />
            },
            {
                title: "Productos",
                path: "/Productos",
                icon: <IoIcons.IoIosPaper />
            },
            
        ]
    },
    {
        title: "Documentos",
        icon: <FaIcons.FaCartPlus />,
        ionClosed: <RiIcons.RiArrowDownFill />,
        iconOpened: <RiIcons.RiArrowUpFill />,
        subNav: [
            {
                title: "Facturas",
                path: "/Facturacion",
                icon: <IoIcons.IoIosPaper />
            },
        
        ]
    }
    
]
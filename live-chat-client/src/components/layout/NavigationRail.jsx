import React from 'react';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../features/themeSlice';

function NavigationRail({ onCreateGroup }) {
    const lightTheme = useSelector((state) => state.themeToggle.isLight);
    const dispatch = useDispatch();

    return (
        <div className="flex flex-col items-center py-4 gap-4 bg-panel rounded-2xl shadow h-full w-16 transition-colors">
            <IconButton>
                <AccountCircleIcon className="text-icon" />
            </IconButton>

            <div className="flex flex-col gap-2 mt-4 flex-1">
                <IconButton title="Add Person">
                    <PersonAddIcon className="text-icon" />
                </IconButton>

                <IconButton title="Create Group" onClick={() => { }}>
                    <GroupAddIcon className="text-icon" />
                </IconButton>

                <IconButton title="Add New" onClick={onCreateGroup}>
                    <AddCircleIcon className="text-icon" />
                </IconButton>
            </div>

            <div className="mt-auto">
                <IconButton onClick={() => dispatch(toggleTheme())}>
                    {lightTheme ? <DarkModeIcon className="text-icon" /> : <LightModeIcon className="text-icon" />}
                </IconButton>
            </div>
        </div>
    );
}

export default NavigationRail;

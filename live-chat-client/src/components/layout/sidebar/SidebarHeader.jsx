import { IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../features/themeSlice';
import { useNavigate } from 'react-router-dom';

function SidebarHeader({ userData, onCreateGroup }) {
    const lightTheme = useSelector((state) => state.themeToggle.isLight);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <div className="hidden md:flex bg-panel rounded-2xl shadow p-3 justify-between items-center transition-colors">
            <div className="flex items-center">
                <IconButton>
                    <AccountCircleIcon />
                </IconButton>
                <p className="font-bold text-primary ml-2 min-w-0 truncate max-w-[100px] lg:max-w-none">
                    {userData?.name}
                </p>
            </div>
            <div className="flex gap-1">
                <IconButton onClick={onCreateGroup}>
                    <GroupAddIcon />
                </IconButton>
                <IconButton onClick={() => dispatch(toggleTheme())}>
                    {lightTheme && <DarkModeIcon />}
                    {!lightTheme && <LightModeIcon />}
                </IconButton>
                <IconButton onClick={handleLogout}>
                    <ExitToAppIcon />
                </IconButton>
            </div>
        </div>
    );
}

export default SidebarHeader;

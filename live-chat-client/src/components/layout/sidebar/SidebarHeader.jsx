import { IconButton, Tooltip } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../features/themeSlice';
import { useNavigate } from 'react-router-dom';
import { getAvatarGradient } from '../../../utils/avatarColor';

function SidebarHeader({ userData, onCreateGroup }) {
    const lightTheme = useSelector((state) => state.themeToggle.isLight);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const gradient = getAvatarGradient(userData?.name || '');

    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-panel">
            <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : '?'}
                </div>
                <p className="font-semibold text-primary text-sm truncate max-w-[100px] lg:max-w-none">
                    {userData?.name}
                </p>
            </div>
            <div className="flex gap-0.5">
                <Tooltip title="Create Group" placement="bottom">
                    <IconButton onClick={onCreateGroup} size="small" sx={{ color: 'var(--text-icon)', '&:hover': { color: 'var(--accent)' } }}>
                        <GroupAddIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title={lightTheme ? "Dark Mode" : "Light Mode"} placement="bottom">
                    <IconButton onClick={() => dispatch(toggleTheme())} size="small" sx={{ color: 'var(--text-icon)', '&:hover': { color: 'var(--accent)' } }}>
                        {lightTheme ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
                <Tooltip title="Logout" placement="bottom">
                    <IconButton onClick={handleLogout} size="small" sx={{ color: 'var(--text-icon)', '&:hover': { color: 'var(--accent)' } }}>
                        <ExitToAppIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}

export default SidebarHeader;

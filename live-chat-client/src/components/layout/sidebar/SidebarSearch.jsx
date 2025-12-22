import SearchIcon from '@mui/icons-material/Search';

function SidebarSearch({ search, setSearch }) {
    return (
        <div className="bg-panel rounded-2xl shadow p-3 flex items-center transition-colors">
            <SearchIcon />
            <input
                placeholder="Search"
                className="ml-2 w-full outline-none bg-transparent text-primary placeholder:text-secondary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
}

export default SidebarSearch;

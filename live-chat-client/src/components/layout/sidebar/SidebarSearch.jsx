import SearchIcon from '@mui/icons-material/Search';

function SidebarSearch({ search, setSearch }) {
    return (
        <div className="mx-4 my-3 flex items-center gap-2 bg-input rounded-xl px-3 py-2 ring-1 ring-transparent focus-within:ring-accent transition-all">
            <SearchIcon sx={{ color: 'var(--text-secondary)', fontSize: 18 }} />
            <input
                placeholder="Search"
                className="flex-1 text-sm text-primary bg-transparent outline-none placeholder:text-secondary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
}

export default SidebarSearch;

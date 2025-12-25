import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from './AuthContext';
import { 
    Users, 
    Edit2, 
    Trash2, 
    Check, 
    X, 
    Plus, 
    Search, 
    Download, 
    Upload,
    Shield,
    UserCircle,
    GraduationCap
} from 'lucide-react';

const UserManagement = () => {
    // State Management
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const [message, setMessage] = useState({ text: '', type: '' });
    const [refresh, setRefresh] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editRole, setEditRole] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    const { isLoggedIn, userRole } = useContext(AuthContext);

    // Fetch Users
    useEffect(() => {
        if (isLoggedIn && userRole === 'admin') {
            fetch('http://127.0.0.1:5000/api/users')
                .then(res => res.json())
                .then(data => setUsers(data))
                .catch(err => console.error("Failed to fetch users:", err));
        }
    }, [refresh, isLoggedIn, userRole]);

    // Handlers
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        
        try {
            const response = await fetch('http://127.0.0.1:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role }),
            });
            const data = await response.json();
            
            setMessage({ text: data.message, type: response.ok ? 'success' : 'error' });
            
            if (response.ok) {
                setRefresh(prev => !prev);
                setUsername('');
                setPassword('');
                // Clear success message after 3 seconds
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            }
        } catch (error) {
            setMessage({ text: "Failed to create user.", type: 'error' });
        }
    };

    const handleDeleteUser = async (username) => {
        if (window.confirm(`Are you sure you want to delete ${username}?`)) {
            const response = await fetch(`http://127.0.0.1:5000/api/user/delete/${username}`, {
                method: 'DELETE',
            });
            if (response.ok) setRefresh(prev => !prev);
        }
    };

    const handleUpdateUser = async (user) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user.username, role: editRole }),
            });
            if (response.ok) {
                setEditingUser(null);
                setRefresh(prev => !prev);
            }
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    // Filter users based on search
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // CSV Functions
    const handleCSVUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;
            const lines = text.split(/\r?\n/).filter(Boolean);
            const header = lines[0].split(',');
            
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',');
                const user = {
                    username: values[header.indexOf('username')],
                    password: values[header.indexOf('password')],
                    role: values[header.indexOf('role')] || 'student',
                };
                await fetch('http://127.0.0.1:5000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user),
                });
            }
            setRefresh(prev => !prev);
            alert('Bulk import complete!');
        };
        reader.readAsText(file);
    };

    const handleExportCSV = () => {
        if (!users.length) return;
        const header = 'username,role';
        const rows = users.map(u => `${u.username},${u.role}`);
        const csvContent = [header, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users_export.csv';
        a.click();
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">User Management</h1>
                    <p className="text-slate-500 mt-2">Oversee accounts, roles, and permissions.</p>
                </div>
                
                <div className="flex gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer transition shadow-sm">
                        <Upload size={18} />
                        <span className="text-sm font-medium">Import CSV</span>
                        <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
                    </label>
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm"
                    >
                        <Download size={18} />
                        <span className="text-sm font-medium">Export CSV</span>
                    </button>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- Left Column: Create User Form --- */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 sticky top-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Plus className="text-blue-600 w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Add New User</h2>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                                <input 
                                    type="text" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="e.g. john_doe"
                                    required 
                                />
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="••••••••"
                                    required 
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Role</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {/* UPDATED: Only Admin and Student */}
                                    {['admin', 'student'].map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setRole(r)}
                                            className={`py-3 px-2 rounded-lg text-sm font-medium capitalize transition-all ${
                                                role === r 
                                                ? 'bg-slate-800 text-white shadow-md transform scale-105' 
                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Create Account
                            </button>

                            <AnimatePresence>
                                {message.text && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-3 rounded-lg text-sm font-medium text-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}
                                    >
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </motion.div>

                {/* --- Right Column: User List --- */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                        
                        {/* List Header & Search */}
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <Users className="text-emerald-600 w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg">Existing Users</h3>
                                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                                    {users.length}
                                </span>
                            </div>
                            
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input 
                                    type="text" 
                                    placeholder="Search users..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <motion.tr 
                                                layout
                                                key={user.username} 
                                                className="hover:bg-slate-50/80 transition-colors group"
                                            >
                                                {/* Username Cell */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm
                                                            ${user.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-indigo-500' : 
                                                              'bg-gradient-to-br from-blue-400 to-sky-500'}`}
                                                        >
                                                            {user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-700">{user.username}</p>
                                                            <p className="text-xs text-slate-400">ID: #{Math.floor(Math.random() * 10000)}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Role Cell */}
                                                <td className="px-6 py-4">
                                                    {editingUser?.username === user.username ? (
                                                        // UPDATED: Only Admin and Student
                                                        <select 
                                                            value={editRole} 
                                                            onChange={(e) => setEditRole(e.target.value)}
                                                            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                        >
                                                            <option value="admin">Admin</option>
                                                            <option value="student">Student</option>
                                                        </select>
                                                    ) : (
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border
                                                            ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                                                              'bg-blue-50 text-blue-700 border-blue-200'}`}
                                                        >
                                                            {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <GraduationCap className="w-3 h-3 mr-1" />}
                                                            {user.role}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions Cell */}
                                                <td className="px-6 py-4 text-right">
                                                    {editingUser?.username === user.username ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button 
                                                                onClick={() => handleUpdateUser(user)}
                                                                className="p-2 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 transition"
                                                            >
                                                                <Check size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => setEditingUser(null)}
                                                                className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => { setEditingUser(user); setEditRole(user.role); }}
                                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                                                                title="Edit Role"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteUser(user.username)}
                                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                                                title="Delete User"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-12 text-center text-slate-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <UserCircle className="w-10 h-10 opacity-20" />
                                                    <p>No users found matching "{searchQuery}"</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default UserManagement;
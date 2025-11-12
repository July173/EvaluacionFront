

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hook/useAuth';
import { useUserData } from '../../hook/useUserData';
import menuService from '../../Api/Services/MenuService';
import { MenuDto, MenuFormDto, FormItemDto } from '../../Api/types/Menu';
import logo from '/public/logo.png';

interface MenuItem {
  id: number;
  name: string;
  path: string;
  module: string;
}

interface SidebarMenuProps {
  className?: string;
}

const Menu: React.FC<SidebarMenuProps> = ({ className = '' }) => {
  const { logout } = useAuth();
  const { userData } = useUserData();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const handleLogout = () => {
    try {
      logout();
    } catch (e) {
      localStorage.removeItem('user_data');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    navigate('/');
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
  // userData.id is the canonical user id in our hook; fall back to null if missing
  const uid = userData?.id ?? null;
  if (!uid) return;
  const data = await menuService.getMenuItems(Number(uid));
        const items: MenuItem[] = [];
        let idCounter = 1;
        if (Array.isArray(data)) {
          data.forEach((m: MenuDto) => {
            const moduleForms: MenuFormDto[] = m.ModuleForm || [];
            moduleForms.forEach((mf: MenuFormDto) => {
              const moduleName = mf.Name || '';
              const forms: FormItemDto[] = mf.Form || [];
              forms.forEach((f: FormItemDto) => {
                items.push({ id: idCounter++, name: f.Name, path: f.Path, module: moduleName });
              });
            });
          });
        }
        setMenuItems(items);
      } catch (err) {
        console.error('Error loading menu', err);
      }
    };
    fetchMenu();
  }, [userData]);

  const grouped: Record<string, MenuItem[]> = {};
  menuItems.forEach(i => {
    if (!grouped[i.module]) grouped[i.module] = [];
    grouped[i.module].push(i);
  });

  const orderedModules = Object.entries(grouped).sort(([a], [b]) => {
    if (a.toLowerCase() === 'inicio') return -1;
    if (b.toLowerCase() === 'inicio') return 1;
    return a.localeCompare(b);
  });

  return (
    <div className={`w-64 rounded-xl bg-[linear-gradient(to_bottom_right,_#43A047,_#2E7D32)] text-white flex flex-col m-2 relative ${className} md:h-screen h-auto`}>
      <div className="p-6 flex items-center gap-3 flex-shrink-0">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center">
          <img src={logo} alt="Logo" className="w-10 h-10" />
        </div>
        <h1 className="text-white font-semibold">Autogestión CIES</h1>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <nav className="flex-1 px-4 overflow-y-auto min-h-0 max-h-[calc(100vh-180px)] md:max-h-none">
          <ul className="space-y-2">
            {orderedModules.map(([moduleName, forms]) => {
              const isOpen = openModule === moduleName;
              const isInicio = moduleName.toLowerCase() === 'inicio';

              if (isInicio) {
                return (
                  <li key={moduleName}>
                    <button
                      onClick={() => {
                        setOpenModule(moduleName);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-white/10`}
                    >
                      <span className="font-medium leading-tight">{moduleName}</span>
                    </button>
                  </li>
                );
              }

              return (
                <li key={moduleName}>
                  <button
                    onClick={() => setOpenModule(isOpen ? null : moduleName)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors hover:bg-white/10`}
                  >
                    <span className="font-medium leading-tight">{moduleName}</span>
                    <span className={`text-sm`}>{isOpen ? '−' : '+'}</span>
                  </button>

                  {isOpen && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {forms.map(f => (
                        <li key={f.id}>
                          <button
                            onClick={() => {
                              setActiveItem(f.id);
                              navigate(f.path);
                            }}
                            className={`w-full text-left px-2 py-1 rounded-lg text-sm hover:bg-white/10 ${activeItem === f.id ? 'bg-white/20' : ''}`}
                          >
                            {f.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/20 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-lg bg-[#EE7878] hover:bg-red-600 text-black font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;

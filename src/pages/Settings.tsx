import React, { useState } from 'react';
import { Bell, Lock, Users, Mail, Moon, Sun, Globe, Shield, BellRing, BellOff } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    newRnc: true,
    emailUpdates: true,
    statusChanges: true,
    mentions: true
  });
  const [language, setLanguage] = useState('pt-BR');
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '30',
    passwordExpiration: '90'
  });

  const handleNotificationChange = (setting: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Aparência */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aparência</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  ) : (
                    <Sun className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Tema</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {theme === 'dark' ? 'Modo escuro ativado' : 'Modo claro ativado'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  style={{ backgroundColor: theme === 'dark' ? '#3b82f6' : '#e5e7eb' }}
                >
                  <span
                    className={`${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Idioma</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Selecione o idioma do sistema</p>
                  </div>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1 block w-32 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="pt-BR">Português</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notificações</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BellRing className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Novas RNCs</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Notificar sobre novas RNCs</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.newRnc}
                    onChange={() => handleNotificationChange('newRnc')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Atualizações por Email</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receber emails sobre atualizações</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.emailUpdates}
                    onChange={() => handleNotificationChange('emailUpdates')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BellOff className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Mudanças de Status</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Notificar sobre mudanças de status</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.statusChanges}
                    onChange={() => handleNotificationChange('statusChanges')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Segurança</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Autenticação em Dois Fatores</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Adicionar uma camada extra de segurança</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={security.twoFactor}
                    onChange={() => setSecurity(prev => ({ ...prev, twoFactor: !prev.twoFactor }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Tempo Limite da Sessão (minutos)
                </label>
                <select
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="120">2 horas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Expiração da Senha (dias)
                </label>
                <select
                  value={security.passwordExpiration}
                  onChange={(e) => setSecurity(prev => ({ ...prev, passwordExpiration: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="30">30 dias</option>
                  <option value="60">60 dias</option>
                  <option value="90">90 dias</option>
                  <option value="180">180 dias</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { format, subDays, startOfDay, endOfDay, isWithinInterval, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  BarChart3, 
  PieChartIcon, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  X
} from 'lucide-react';
import { Menu } from '@headlessui/react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Card,
  Title,
  Text,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  AreaChart,
  DonutChart,
} from "@tremor/react";

// Neon color palette
const colors = {
  primary: '#3b82f6', // Bright blue
  secondary: '#6366f1', // Bright indigo
  success: '#10b981', // Bright emerald
  warning: '#f59e0b', // Bright amber
  error: '#ef4444', // Bright red
  info: '#06b6d4', // Bright cyan
  chart: ['#3b82f6', '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
};

// Mock data
const mockRNCs = Array.from({ length: 50 }, (_, i) => ({
  id: `RNC-${i + 1}`,
  title: `Problema de Qualidade ${i + 1}`,
  type: Math.random() > 0.5 ? 'client' : 'supplier',
  status: ['new', 'analyzing', 'resolved'][Math.floor(Math.random() * 3)],
  priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
  createdAt: subDays(new Date(), Math.floor(Math.random() * 30)),
  resolvedAt: Math.random() > 0.3 ? subDays(new Date(), Math.floor(Math.random() * 15)) : null,
  assignedTo: ['João Silva', 'Maria Santos', 'Pedro Oliveira'][Math.floor(Math.random() * 3)],
  department: ['Produção', 'Qualidade', 'Logística'][Math.floor(Math.random() * 3)]
}));

const dateRanges = [
  { label: 'Últimos 7 dias', value: 7 },
  { label: 'Últimos 15 dias', value: 15 },
  { label: 'Últimos 30 dias', value: 30 },
  { label: 'Últimos 90 dias', value: 90 },
  { label: 'Personalizado', value: 'custom' }
];

export default function Reports() {
  const [selectedDateRange, setSelectedDateRange] = useState(30);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  const filterByDateRange = (rncs: typeof mockRNCs) => {
    const endDate = endOfDay(selectedDateRange === 'custom' 
      ? parse(customDateRange.endDate, 'yyyy-MM-dd', new Date())
      : new Date()
    );
    const startDate = startOfDay(selectedDateRange === 'custom'
      ? parse(customDateRange.startDate, 'yyyy-MM-dd', new Date())
      : subDays(endDate, typeof selectedDateRange === 'number' ? selectedDateRange : 30)
    );

    return rncs.filter(rnc => 
      isWithinInterval(new Date(rnc.createdAt), { start: startDate, end: endDate })
    );
  };

  const filteredRNCs = filterByDateRange(mockRNCs);

  // KPI Calculations
  const totalRNCs = filteredRNCs.length;
  const resolvedRNCs = filteredRNCs.filter(rnc => rnc.status === 'resolved').length;
  const resolutionRate = totalRNCs > 0 ? (resolvedRNCs / totalRNCs) * 100 : 0;
  
  const averageResolutionTime = filteredRNCs
    .filter(rnc => rnc.resolvedAt)
    .reduce((acc, rnc) => {
      const days = Math.ceil((new Date(rnc.resolvedAt!).getTime() - new Date(rnc.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return acc + days;
    }, 0) / resolvedRNCs || 0;

  // Chart Data
  const statusData = [
    { name: 'Novos', value: filteredRNCs.filter(rnc => rnc.status === 'new').length },
    { name: 'Em Análise', value: filteredRNCs.filter(rnc => rnc.status === 'analyzing').length },
    { name: 'Resolvidos', value: resolvedRNCs }
  ];

  const typeData = [
    { name: 'Cliente', value: filteredRNCs.filter(rnc => rnc.type === 'client').length },
    { name: 'Fornecedor', value: filteredRNCs.filter(rnc => rnc.type === 'supplier').length }
  ];

  const priorityData = [
    { name: 'Alta', value: filteredRNCs.filter(rnc => rnc.priority === 'high').length },
    { name: 'Média', value: filteredRNCs.filter(rnc => rnc.priority === 'medium').length },
    { name: 'Baixa', value: filteredRNCs.filter(rnc => rnc.priority === 'low').length }
  ];

  const departmentData = filteredRNCs.reduce((acc: Record<string, number>, rnc) => {
    acc[rnc.department] = (acc[rnc.department] || 0) + 1;
    return acc;
  }, {});

  const dailyRNCs = filteredRNCs.reduce((acc: Record<string, number>, rnc) => {
    const date = format(new Date(rnc.createdAt), 'yyyy-MM-dd');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const trendData = Object.entries(dailyRNCs).map(([date, count]) => ({
    date: format(new Date(date), 'dd/MM', { locale: ptBR }),
    "RNCs": count
  }));

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const reportData = {
        period: selectedDateRange === 'custom' 
          ? `${customDateRange.startDate} até ${customDateRange.endDate}`
          : `Últimos ${selectedDateRange} dias`,
        kpis: {
          totalRNCs,
          resolvedRNCs,
          resolutionRate,
          averageResolutionTime
        },
        charts: {
          status: statusData,
          type: typeData,
          priority: priorityData,
          department: departmentData
        },
        rncs: filteredRNCs
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-qualidade-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#3b82f6]">Relatórios de Qualidade</h1>
        <div className="flex items-center space-x-4">
          <Menu as="div" className="relative">
            <Menu.Button className="px-4 py-2 border border-[#3b82f6] text-[#3b82f6] rounded-lg hover:bg-blue-50 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {selectedDateRange === 'custom' 
                ? 'Período Personalizado'
                : dateRanges.find(range => range.value === selectedDateRange)?.label}
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-[#3b82f6]">
              <div className="py-1">
                {dateRanges.map((range) => (
                  <Menu.Item key={range.value}>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          setSelectedDateRange(range.value);
                          if (range.value === 'custom') {
                            setIsCustomDateOpen(true);
                          }
                        }}
                        className={`${
                          active ? 'bg-blue-50 dark:bg-blue-900/50 text-[#3b82f6]' : 'text-[#3b82f6]'
                        } w-full text-left px-4 py-2 text-sm`}
                      >
                        {range.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] disabled:bg-blue-300 flex items-center"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card decoration="top" decorationColor="blue">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-[#3b82f6] font-medium">Total de RNCs</Text>
              <Title className="text-[#3b82f6] text-3xl font-bold">{totalRNCs}</Title>
            </div>
            <BarChart3 className="w-12 h-12 text-[#3b82f6]" />
          </div>
        </Card>

        <Card decoration="top" decorationColor="emerald">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-[#10b981] font-medium">Taxa de Resolução</Text>
              <Title className="text-[#10b981] text-3xl font-bold">{resolutionRate.toFixed(1)}%</Title>
            </div>
            <TrendingUp className="w-12 h-12 text-[#10b981]" />
          </div>
        </Card>

        <Card decoration="top" decorationColor="amber">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-[#f59e0b] font-medium">Tempo Médio de Resolução</Text>
              <Title className="text-[#f59e0b] text-3xl font-bold">{averageResolutionTime.toFixed(1)} dias</Title>
            </div>
            <Clock className="w-12 h-12 text-[#f59e0b]" />
          </div>
        </Card>

        <Card decoration="top" decorationColor="indigo">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-[#6366f1] font-medium">RNCs por Colaborador</Text>
              <Title className="text-[#6366f1] text-3xl font-bold">{(totalRNCs / 3).toFixed(1)}</Title>
            </div>
            <Users className="w-12 h-12 text-[#6366f1]" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <TabGroup>
        <TabList className="mt-8">
          <Tab className="text-[#3b82f6] data-[state=active]:border-[#3b82f6]">Visão Geral</Tab>
          <Tab className="text-[#3b82f6] data-[state=active]:border-[#3b82f6]">Análise por Status</Tab>
          <Tab className="text-[#3b82f6] data-[state=active]:border-[#3b82f6]">Análise por Tipo</Tab>
          <Tab className="text-[#3b82f6] data-[state=active]:border-[#3b82f6]">Análise por Departamento</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="mt-6 grid grid-cols-2 gap-6">
              <Card>
                <Title className="text-[#3b82f6] font-bold mb-4">Tendência de RNCs</Title>
                <AreaChart
                  className="mt-4 h-72"
                  data={trendData}
                  index="date"
                  categories={["RNCs"]}
                  colors={[colors.primary]}
                  showAnimation={true}
                  showLegend={false}
                  valueFormatter={(value) => `${value} RNCs`}
                />
              </Card>
              <Card>
                <Title className="text-[#3b82f6] font-bold mb-4">RNCs por Status</Title>
                <DonutChart
                  className="mt-4 h-72"
                  data={statusData}
                  category="value"
                  index="name"
                  colors={[colors.warning, colors.info, colors.success]}
                  showAnimation={true}
                  valueFormatter={(value) => `${value} RNCs`}
                />
              </Card>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <Card>
                <Title className="text-[#3b82f6] font-bold mb-4">Distribuição por Status</Title>
                <BarChart
                  className="mt-4 h-80"
                  data={statusData}
                  index="name"
                  categories={["value"]}
                  colors={[colors.primary]}
                  showAnimation={true}
                  valueFormatter={(value) => `${value} RNCs`}
                />
              </Card>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-6 grid grid-cols-2 gap-6">
              <Card>
                <Title className="text-[#3b82f6] font-bold mb-4">RNCs por Tipo</Title>
                <DonutChart
                  className="mt-4 h-72"
                  data={typeData}
                  category="value"
                  index="name"
                  colors={[colors.secondary, colors.info]}
                  showAnimation={true}
                  valueFormatter={(value) => `${value} RNCs`}
                />
              </Card>
              <Card>
                <Title className="text-[#3b82f6] font-bold mb-4">RNCs por Prioridade</Title>
                <DonutChart
                  className="mt-4 h-72"
                  data={priorityData}
                  category="value"
                  index="name"
                  colors={[colors.error, colors.warning, colors.success]}
                  showAnimation={true}
                  valueFormatter={(value) => `${value} RNCs`}
                />
              </Card>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <Card>
                <Title className="text-[#3b82f6] font-bold mb-4">RNCs por Departamento</Title>
                <BarChart
                  className="mt-4 h-80"
                  data={Object.entries(departmentData).map(([name, value]) => ({ name, value }))}
                  index="name"
                  categories={["value"]}
                  colors={[colors.secondary]}
                  showAnimation={true}
                  valueFormatter={(value) => `${value} RNCs`}
                />
              </Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {/* Detailed Table */}
      <Card>
        <Title className="text-[#3b82f6] font-bold mb-4">Listagem Detalhada</Title>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#3b82f6] uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#3b82f6] uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#3b82f6] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#3b82f6] uppercase tracking-wider">Prioridade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#3b82f6] uppercase tracking-wider">Responsável</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#3b82f6] uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRNCs.slice(0, 10).map((rnc) => (
                <tr key={rnc.id} className="hover:bg-blue-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/quality/rnc/${rnc.id.split('-')[1]}`} className="text-sm text-[#3b82f6] hover:text-[#2563eb] font-medium">
                      {rnc.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/quality/rnc/${rnc.id.split('-')[1]}`} className="text-sm text-[#3b82f6] hover:text-[#2563eb]">
                      {rnc.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rnc.status === 'new' ? 'bg-amber-100 text-amber-800' :
                      rnc.status === 'analyzing' ? 'bg-cyan-100 text-cyan-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {rnc.status === 'new' ? 'Novo' :
                       rnc.status === 'analyzing' ? 'Em Análise' :
                       'Resolvido'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rnc.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rnc.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {rnc.priority === 'high' ? 'Alta' :
                       rnc.priority === 'medium' ? 'Média' :
                       'Baixa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6366f1]">{rnc.assignedTo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6366f1]">
                    {format(new Date(rnc.createdAt), 'dd/MM/yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Custom Date Range Modal */}
      {isCustomDateOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Selecionar Período</h3>
              <button onClick={() => setIsCustomDateOpen(false)}>
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={customDateRange.startDate}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white [color-scheme:auto]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Final
                </label>
                <input
                  type="date"
                  value={customDateRange.endDate}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white [color-scheme:auto]"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsCustomDateOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setIsCustomDateOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
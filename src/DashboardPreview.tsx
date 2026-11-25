import { BarChart3, MessagesSquare, MoreHorizontal, Receipt, ShoppingBag } from './icons';
import { BASE } from './base';
import { dashboardDemo } from './content';

const kpiIcons = { chart: BarChart3, receipt: Receipt, bag: ShoppingBag, messages: MessagesSquare } as const;

// Representação ilustrativa do painel do CRM. Os números são fictícios e o bloco inteiro é
// apresentado ao leitor de tela como uma única imagem, para não serem lidos como dados reais.
export function DashboardPreview() {
  const { period, kpis, byDay, byAgent } = dashboardDemo;
  const highest = Math.max(...byDay.map(day => day.value));
  const topAgent = Math.max(...byAgent.map(agent => agent.sales));
  return <div className="dashboard-preview" role="img" aria-label="Ilustração do painel do SIA Markets com o total vendido pelo WhatsApp, vendas registradas, ticket médio, atendimentos finalizados, vendas por dia e por atendente">
    <div className="dashboard-top"><img src={`${BASE}brand/icon.svg`} width="24" height="24" alt="" /><strong>Vendas pelo WhatsApp</strong><span className="dashboard-period">{period}</span><MoreHorizontal size={18} /></div>
    <div className="kpi-grid">{kpis.map(kpi => { const Icon = kpiIcons[kpi.icon as keyof typeof kpiIcons]; return <div className="kpi" key={kpi.label}><span className="kpi-icon"><Icon size={17} /></span><span className="kpi-label">{kpi.label}</span><strong className="kpi-value">{kpi.value}</strong></div>; })}</div>
    <div className="dashboard-lower">
      <div className="dashboard-card"><span className="dashboard-card-title">Vendas por dia</span><div className="day-bars">{byDay.map(day => <span className="day-bar" key={day.day}><span className="day-bar-fill" style={{ height: `${Math.round(day.value / highest * 100)}%` }} /><small>{day.day}</small></span>)}</div></div>
      <div className="dashboard-card"><span className="dashboard-card-title">Por atendente</span>{byAgent.map(agent => <div className="agent-row" key={agent.name}><span className="agent-initial">{agent.name[0]}</span><span className="agent-name">{agent.name}</span><span className="agent-track"><span style={{ width: `${Math.round(agent.sales / topAgent * 100)}%` }} /></span><strong>{agent.sales}</strong></div>)}</div>
    </div>
  </div>;
}

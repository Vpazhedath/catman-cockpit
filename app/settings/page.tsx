'use client';

import { useTheme } from '@/lib/ThemeContext';

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

const SETTINGS_CONFIG = [
  {
    category: 'Lifecycle Thresholds',
    settings: [
      { name: 'New SKU Period', value: '30 days', description: 'Days before SKU leaves new stage' },
      { name: 'Probation Period', value: '90 days', description: 'Days before SKU is considered mature' },
      { name: 'Zero Mover Threshold', value: '0 units/week', description: 'Sales below this = zero mover' },
      { name: 'Slow Mover Threshold', value: '<1 unit/week', description: 'Sales below this = slow mover' },
    ],
  },
  {
    category: 'Status Triggers',
    settings: [
      { name: 'On-Hold Service Level', value: '0% for 30 days', description: 'Trigger on-hold status' },
      { name: 'Discontinue Service Level', value: '0% for 60 days', description: 'Trigger discontinue status' },
      { name: 'Shrinkage Warning', value: '>20% of revenue', description: 'Alert threshold for shrinkage' },
    ],
  },
  {
    category: 'Inventory Thresholds',
    settings: [
      { name: 'Target Days on Hand', value: '14 days', description: 'Optimal inventory level' },
      { name: 'Warning Days on Hand', value: '30 days', description: 'Trigger inventory review' },
      { name: 'Critical Days on Hand', value: '60 days', description: 'Trigger stock depletion' },
    ],
  },
  {
    category: 'Clearance Settings',
    settings: [
      { name: 'Minimum Discount', value: '10%', description: 'Lowest clearance discount' },
      { name: 'Maximum Discount', value: '70%', description: 'Highest clearance discount' },
      { name: 'Discount Algorithm', value: 'GPV Maximizing', description: 'Optimization method' },
    ],
  },
];

const NOTIFICATION_RULES = [
  { event: 'New recommendation', channels: ['Email', 'In-app'], enabled: true },
  { event: 'Status change', channels: ['In-app'], enabled: true },
  { event: 'Shrinkage alert', channels: ['Email', 'Slack', 'In-app'], enabled: true },
  { event: '0% Service Level', channels: ['Email', 'Slack'], enabled: true },
  { event: 'Clearance completed', channels: ['In-app'], enabled: false },
];

const DATA_SOURCES = [
  { name: 'Competitor Prices', status: 'connected', lastSync: '2 hours ago' },
  { name: 'Nielsen Data', status: 'connected', lastSync: 'Daily at 6am' },
  { name: 'Search Trends', status: 'connected', lastSync: '4 hours ago' },
  { name: 'Internal Sales', status: 'connected', lastSync: 'Real-time' },
  { name: 'Inventory System', status: 'connected', lastSync: 'Real-time' },
  { name: 'Supplier Portal', status: 'error', lastSync: 'Failed 2 days ago' },
];

export default function SettingsPage() {
  const { theme } = useTheme();
  const t = theme === 'dark';

  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const fg3 = t ? '#6C6D73' : '#93949D';
  const surfPrimary = t ? '#1E1E20' : '#fff';
  const surfSecondary = t ? '#343437' : '#F4F5F6';
  const border = t ? '#343437' : '#E9EAEC';

  const cardStyle: React.CSSProperties = {
    background: surfPrimary,
    border: `1px solid ${border}`,
    borderRadius: 12,
    padding: 20,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>Engine Settings</div>
          <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>Configure thresholds and automation rules</div>
        </div>
        <button style={{ background: '#4629FF', color: '#fff', border: 0, borderRadius: 8, padding: '10px 20px', font: `600 13px/1 ${font}`, cursor: 'pointer' }}>Save Changes</button>
      </div>

      {/* Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {SETTINGS_CONFIG.map((section) => (
          <div key={section.category} style={cardStyle}>
            <div style={{ font: `600 14px/1.4 ${font}`, color: fg1, marginBottom: 16 }}>{section.category}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {section.settings.map((setting) => (
                <div key={setting.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${border}` }}>
                  <div>
                    <div style={{ font: `500 13px/1.3 ${font}`, color: fg1 }}>{setting.name}</div>
                    <div style={{ font: `500 11px/1.3 ${font}`, color: fg3, marginTop: 2 }}>{setting.description}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ font: `600 13px/1 ${font}`, color: '#4629FF' }}>{setting.value}</span>
                    <button style={{ border: 0, background: 'transparent', font: `500 11px/1 ${font}`, color: fg3, cursor: 'pointer' }}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notification Rules */}
      <div style={cardStyle}>
        <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 4 }}>Notification Rules</div>
        <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginBottom: 16 }}>Configure when and how you receive alerts</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: surfSecondary }}>
              <th style={{ textAlign: 'left', padding: '10px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Event</th>
              <th style={{ textAlign: 'left', padding: '10px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Channels</th>
              <th style={{ textAlign: 'center', padding: '10px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Enabled</th>
            </tr>
          </thead>
          <tbody>
            {NOTIFICATION_RULES.map((rule) => (
              <tr key={rule.event} style={{ borderBottom: `1px solid ${border}` }}>
                <td style={{ padding: '12px 14px', font: `500 13px/1 ${font}`, color: fg1 }}>{rule.event}</td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {rule.channels.map((channel) => (
                      <span key={channel} style={{ background: t ? 'rgba(70,41,255,0.15)' : '#EDEBFF', color: '#4629FF', font: `600 10px/1 ${font}`, padding: '4px 8px', borderRadius: 200 }}>{channel}</span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  <button style={{
                    position: 'relative',
                    width: 44,
                    height: 24,
                    borderRadius: 200,
                    border: 0,
                    cursor: 'pointer',
                    background: rule.enabled ? '#D61F26' : (t ? '#434347' : '#E9EAEC'),
                  }}>
                    <span style={{
                      position: 'absolute',
                      top: 2,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#fff',
                      transition: 'transform 150ms',
                      transform: rule.enabled ? 'translateX(22px)' : 'translateX(2px)',
                    }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Sources */}
      <div style={cardStyle}>
        <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 4 }}>Data Sources</div>
        <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginBottom: 16 }}>Connected data sources for engine inputs</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {DATA_SOURCES.map((source) => (
            <div key={source.name} style={{ background: surfSecondary, borderRadius: 8, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ font: `600 13px/1 ${font}`, color: fg1 }}>{source.name}</span>
                <span style={{ background: source.status === 'connected' ? '#E5F5EC' : '#FCEBE8', color: source.status === 'connected' ? '#047538' : '#BF280A', font: `600 10px/1 ${font}`, padding: '4px 8px', borderRadius: 200 }}>{source.status}</span>
              </div>
              <div style={{ font: `500 11px/1 ${font}`, color: fg3 }}>Last sync: {source.lastSync}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
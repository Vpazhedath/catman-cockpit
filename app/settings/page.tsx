'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

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

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dh-blue">Engine Settings</h1>
          <p className="text-gray-500 mt-1">Configure thresholds and automation rules</p>
        </div>
        <Button>Save Changes</Button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {SETTINGS_CONFIG.map((section) => (
          <Card key={section.category}>
            <CardHeader title={section.category} />
            <div className="space-y-4">
              {section.settings.map((setting) => (
                <div key={setting.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{setting.name}</p>
                    <p className="text-xs text-gray-400">{setting.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-dh-blue">{setting.value}</span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Notification Rules */}
      <Card>
        <CardHeader
          title="Notification Rules"
          subtitle="Configure when and how you receive alerts"
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Event</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Channels</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Enabled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {NOTIFICATION_RULES.map((rule) => (
                <tr key={rule.event} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">{rule.event}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {rule.channels.map((channel) => (
                        <Badge key={channel} variant="default" size="sm">{channel}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        rule.enabled ? 'bg-dh-red' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          rule.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader
          title="Data Sources"
          subtitle="Connected data sources for engine inputs"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Competitor Prices', status: 'connected', lastSync: '2 hours ago' },
            { name: 'Nielsen Data', status: 'connected', lastSync: 'Daily at 6am' },
            { name: 'Search Trends', status: 'connected', lastSync: '4 hours ago' },
            { name: 'Internal Sales', status: 'connected', lastSync: 'Real-time' },
            { name: 'Inventory System', status: 'connected', lastSync: 'Real-time' },
            { name: 'Supplier Portal', status: 'error', lastSync: 'Failed 2 days ago' },
          ].map((source) => (
            <div key={source.name} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">{source.name}</span>
                <Badge variant={source.status === 'connected' ? 'success' : 'danger'} size="sm">
                  {source.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">Last sync: {source.lastSync}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
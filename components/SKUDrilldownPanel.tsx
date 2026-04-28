'use client';

import { useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { WAREHOUSE_CLUSTERS, Warehouse, WarehouseCluster, SKUStatus, UAE_WAREHOUSES } from '@/lib/sample-data';

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';
const mono = 'var(--font-mono, monospace)';

interface WarehouseStatus {
  warehouse: Warehouse;
  status: SKUStatus;
  inStock: boolean;
  quantity: number;
  lastUpdated: string;
}

interface SKUDetail {
  skuId: string;
  name: string;
  category: string;
  status: SKUStatus;
  maturityStage: string;
  efficiency: string;
  costPrice: number;
  basePrice: number;
  discount: number | null;
  margin: number;
  engineSignals: readonly string[];
  warehouses: WarehouseStatus[];
  supplier: string;
  weeklyUnitsSold: number;
  availability: number;
}

interface SKUDrilldownPanelProps {
  sku: SKUDetail;
  onClose: () => void;
  onUpdateStatus?: (warehouse: Warehouse, status: SKUStatus) => void;
  onUpdateClusterStatus?: (clusterId: string, status: SKUStatus) => void;
}

const statusOptions: SKUStatus[] = ['active', 'on-hold', 'discontinued', 'retired'];
const statusStyle: Record<SKUStatus, { bg: string; fg: string; label: string }> = {
  active: { bg: '#E5F5EC', fg: '#047538', label: 'Active' },
  'on-hold': { bg: '#FFF8DF', fg: '#8F5D00', label: 'On Hold' },
  discontinued: { bg: '#FCEBE8', fg: '#BF280A', label: 'Discontinued' },
  retired: { bg: '#E9EAEC', fg: '#6C6D73', label: 'Retired' },
};

export function SKUDrilldownPanel({ sku, onClose, onUpdateStatus, onUpdateClusterStatus }: SKUDrilldownPanelProps) {
  const { theme } = useTheme();
  const t = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'warehouses' | 'clusters' | 'actions'>('warehouses');
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [editingCluster, setEditingCluster] = useState<string | null>(null);

  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const fg3 = t ? '#6C6D73' : '#93949D';
  const surfPrimary = t ? '#1E1E20' : '#fff';
  const surfSecondary = t ? '#343437' : '#F4F5F6';
  const border = t ? '#343437' : '#E9EAEC';

  const cardStyle: React.CSSProperties = {
    background: surfSecondary,
    borderRadius: 8,
    padding: 12,
  };

  // Get warehouse data with cluster info
  const getWarehouseData = (warehouse: Warehouse) => {
    return sku.warehouses.find(w => w.warehouse === warehouse) || {
      warehouse,
      status: 'active' as SKUStatus,
      inStock: false,
      quantity: 0,
      lastUpdated: 'N/A',
    };
  };

  // Get cluster status summary
  const getClusterSummary = (cluster: WarehouseCluster) => {
    const clusterWarehouses = cluster.warehouses.map(w => getWarehouseData(w));
    const activeCount = clusterWarehouses.filter(w => w.status === 'active' && w.inStock).length;
    const totalCount = clusterWarehouses.length;
    const totalQuantity = clusterWarehouses.reduce((sum, w) => sum + w.quantity, 0);
    return { activeCount, totalCount, totalQuantity, warehouses: clusterWarehouses };
  };

  // Handle status change for a warehouse
  const handleStatusChange = (warehouse: Warehouse, newStatus: SKUStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(warehouse, newStatus);
    }
    setEditingWarehouse(null);
  };

  // Handle status change for entire cluster
  const handleClusterStatusChange = (clusterId: string, newStatus: SKUStatus) => {
    if (onUpdateClusterStatus) {
      onUpdateClusterStatus(clusterId, newStatus);
    }
    setEditingCluster(null);
  };

  return (
    <div style={{
      background: surfPrimary,
      border: `1px solid ${border}`,
      borderRadius: 12,
      padding: 20,
      height: 'fit-content',
      position: 'sticky',
      top: 0,
      maxHeight: 'calc(100vh - 48px)',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ font: `700 18px/1.3 ${font}`, color: fg1 }}>{sku.name}</div>
          <div style={{ font: `500 12px/1.3 ${font}`, color: fg2, marginTop: 2 }}>{sku.supplier} · {sku.skuId}</div>
        </div>
        <button onClick={onClose} style={{ border: 0, background: 'transparent', cursor: 'pointer', padding: 4, font: `500 20px/1 ${font}`, color: fg3 }}>×</button>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { l: 'Cost', v: `AED ${sku.costPrice.toFixed(2)}` },
          { l: 'Price', v: `AED ${sku.basePrice.toFixed(2)}${sku.discount ? ` -${sku.discount}%` : ''}` },
          { l: 'Margin', v: `${sku.margin}%`, c: sku.margin >= 30 ? '#047538' : sku.margin >= 20 ? '#8F5D00' : '#D62D0B' },
          { l: 'Units', v: sku.weeklyUnitsSold.toLocaleString() },
        ].map((x, i) => (
          <div key={i} style={{ ...cardStyle, textAlign: 'center' }}>
            <div style={{ font: `500 9px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{x.l}</div>
            <div style={{ font: `700 13px/1.2 ${font}`, color: x.c || fg1, marginTop: 4 }}>{x.v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 16, background: surfSecondary, borderRadius: 8, padding: 3 }}>
        {(['warehouses', 'clusters', 'actions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 0,
              borderRadius: 6,
              cursor: 'pointer',
              font: `600 11px/1 ${font}`,
              background: activeTab === tab ? surfPrimary : 'transparent',
              color: activeTab === tab ? fg1 : fg3,
              transition: 'background 150ms',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Warehouses Tab */}
      {activeTab === 'warehouses' && (
        <div>
          <div style={{ font: `600 11px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Warehouse Distribution</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {UAE_WAREHOUSES.map(wh => {
              const data = getWarehouseData(wh);
              const ss = statusStyle[data.status];
              const isEditing = editingWarehouse === wh;

              return (
                <div key={wh} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: data.inStock ? '#047538' : '#D62D0B', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: `600 12px/1.3 ${font}`, color: fg1 }}>{wh}</div>
                    <div style={{ font: `500 10px/1.3 ${font}`, color: fg3 }}>{data.inStock ? `${data.quantity} units` : 'Out of stock'} · {data.lastUpdated}</div>
                  </div>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: 4 }}>
                      {statusOptions.map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(wh, s)}
                          style={{
                            padding: '4px 8px',
                            border: 0,
                            borderRadius: 4,
                            cursor: 'pointer',
                            font: `600 9px/1 ${font}`,
                            background: ss.fg === statusStyle[s].fg ? statusStyle[s].bg : 'transparent',
                            color: statusStyle[s].fg,
                          }}
                        >
                          {statusStyle[s].label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingWarehouse(wh)}
                      style={{
                        background: t ? `${ss.fg}18` : ss.bg,
                        color: ss.fg,
                        border: 0,
                        borderRadius: 200,
                        padding: '4px 10px',
                        font: `600 10px/1 ${font}`,
                        cursor: 'pointer',
                      }}
                    >
                      {ss.label}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Clusters Tab */}
      {activeTab === 'clusters' && (
        <div>
          <div style={{ font: `600 11px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Cluster Management</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {WAREHOUSE_CLUSTERS.map(cluster => {
              const summary = getClusterSummary(cluster);
              const isExpanded = expandedCluster === cluster.id;
              const isEditing = editingCluster === cluster.id;

              // Determine overall cluster status
              const allActive = summary.warehouses.every(w => w.status === 'active' && w.inStock);
              const anyOnHold = summary.warehouses.some(w => w.status === 'on-hold');
              const clusterStatus: SKUStatus = allActive ? 'active' : anyOnHold ? 'on-hold' : 'discontinued';
              const ss = statusStyle[clusterStatus];

              return (
                <div key={cluster.id} style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                  {/* Cluster Header */}
                  <div
                    onClick={() => setExpandedCluster(isExpanded ? null : cluster.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '12px 14px',
                      cursor: 'pointer',
                      borderBottom: isExpanded ? `1px solid ${border}` : 'none',
                    }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: allActive ? '#047538' : '#D62D0B', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: `600 13px/1.3 ${font}`, color: fg1 }}>{cluster.name}</div>
                      <div style={{ font: `500 10px/1.3 ${font}`, color: fg3 }}>{cluster.region} · {cluster.warehouses.length} warehouses</div>
                    </div>
                    <div style={{ textAlign: 'right', marginRight: 8 }}>
                      <div style={{ font: `700 14px/1 ${font}`, color: fg1 }}>{summary.totalQuantity.toLocaleString()}</div>
                      <div style={{ font: `500 9px/1 ${font}`, color: fg3 }}>units</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={fg3} strokeWidth="2" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>

                  {/* Expanded Cluster Details */}
                  {isExpanded && (
                    <div style={{ padding: '10px 14px' }}>
                      {/* Quick Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ font: `500 11px/1 ${font}`, color: fg3 }}>Set all warehouses:</span>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: 4 }}>
                            {statusOptions.map(s => (
                              <button
                                key={s}
                                onClick={() => handleClusterStatusChange(cluster.id, s)}
                                style={{
                                  padding: '4px 8px',
                                  border: 0,
                                  borderRadius: 4,
                                  cursor: 'pointer',
                                  font: `600 9px/1 ${font}`,
                                  background: t ? 'rgba(70,41,255,0.15)' : '#EDEBFF',
                                  color: '#4629FF',
                                }}
                              >
                                {statusStyle[s].label}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingCluster(cluster.id)}
                            style={{
                              background: t ? `${ss.fg}18` : ss.bg,
                              color: ss.fg,
                              border: 0,
                              borderRadius: 200,
                              padding: '4px 10px',
                              font: `600 10px/1 ${font}`,
                              cursor: 'pointer',
                            }}
                          >
                            {ss.label} ▾
                          </button>
                        )}
                      </div>

                      {/* Warehouse List */}
                      {cluster.warehouses.map(wh => {
                        const whData = getWarehouseData(wh);
                        const whss = statusStyle[whData.status];
                        return (
                          <div key={wh} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderTop: `1px solid ${border}` }}>
                            <div style={{ width: 6, height: 6, borderRadius: 2, background: whData.inStock ? '#047538' : '#D62D0B' }} />
                            <span style={{ flex: 1, font: `500 11px/1 ${font}`, color: fg1 }}>{wh}</span>
                            <span style={{ font: `500 10px/1 ${mono}`, color: whData.inStock ? fg2 : '#D62D0B' }}>{whData.inStock ? `${whData.quantity}` : 'OOS'}</span>
                            <span style={{ background: t ? `${whss.fg}18` : whss.bg, color: whss.fg, font: `600 8px/1 ${font}`, padding: '2px 6px', borderRadius: 200, textTransform: 'capitalize' }}>{whss.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add New Cluster Button */}
          <button
            style={{
              width: '100%',
              marginTop: 12,
              padding: '10px 14px',
              border: `1px dashed ${border}`,
              borderRadius: 8,
              background: 'transparent',
              cursor: 'pointer',
              font: `500 12px/1 ${font}`,
              color: fg3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Create New Cluster
          </button>
        </div>
      )}

      {/* Actions Tab */}
      {activeTab === 'actions' && (
        <div>
          <div style={{ font: `600 11px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Quick Actions</div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 10, border: 0, cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: t ? 'rgba(70,41,255,0.15)' : '#EDEBFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4629FF" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: `600 12px/1.3 ${font}`, color: fg1 }}>Edit Master Data</div>
                <div style={{ font: `500 10px/1.3 ${font}`, color: fg3 }}>Update SKU details, pricing, category</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={fg3} strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <button style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 10, border: 0, cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: t ? 'rgba(4,117,56,0.15)' : '#E5F5EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047538" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: `600 12px/1.3 ${font}`, color: fg1 }}>Accept All Recommendations</div>
                <div style={{ font: `500 10px/1.3 ${font}`, color: fg3 }}>Apply {sku.engineSignals.length} engine suggestions</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={fg3} strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <button style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 10, border: 0, cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: t ? 'rgba(143,93,0,0.15)' : '#FFF8DF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8F5D00" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: `600 12px/1.3 ${font}`, color: fg1 }}>Schedule Review</div>
                <div style={{ font: `500 10px/1.3 ${font}`, color: fg3 }}>Set reminder for follow-up</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={fg3} strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <button style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 10, border: 0, cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: t ? 'rgba(191,40,10,0.15)' : '#FCEBE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BF280A" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: `600 12px/1.3 ${font}`, color: fg1 }}>Discontinue SKU</div>
                <div style={{ font: `500 10px/1.3 ${font}`, color: fg3 }}>Mark as phased out across all warehouses</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={fg3} strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>

          {/* Engine Signals */}
          {sku.engineSignals.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ font: `600 11px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Engine Signals</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {sku.engineSignals.map((s, i) => (
                  <span key={i} style={{ background: t ? 'rgba(70,41,255,0.1)' : '#EDEBFF', color: '#4629FF', font: `600 11px/1 ${font}`, padding: '5px 10px', borderRadius: 200, textTransform: 'capitalize' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
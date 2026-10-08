import React, { useState } from 'react';
import { PurchaseOrder } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ShoppingCart, Plus, Search, X } from 'lucide-react';
import { apiService } from '../services/api';

interface PurchaseOrdersPageProps {
  purchaseOrders: PurchaseOrder[];
  onPoCreated: (po: PurchaseOrder) => void;
}

export const PurchaseOrdersPage: React.FC<PurchaseOrdersPageProps> = ({
  purchaseOrders = [],
  onPoCreated,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [poNum, setPoNum] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [amount, setAmount] = useState('');
  const [search, setSearch] = useState('');

  const handleCreatePo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poNum || !vendorName || !amount) return;

    try {
      const newPo = await apiService.createPurchaseOrder({
        po_number: poNum,
        vendor_name: vendorName,
        total_amount: parseFloat(amount),
        status: 'Active',
      });
      onPoCreated(newPo);
      setShowModal(false);
      setPoNum('');
      setVendorName('');
      setAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = purchaseOrders.filter((po) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return po.po_number?.toLowerCase().includes(s) || po.vendor_name?.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAF0] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#082B55] tracking-tight flex items-center gap-2.5">
            <span>Purchase Orders ERP Registry</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1769E0] border border-blue-200">
              {purchaseOrders.length} PO Records
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enterprise procurement commitments and line-item baseline thresholds
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#1769E0] hover:bg-blue-600 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-2 transition-colors self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Issue New Demo PO
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by PO# or vendor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-xs text-[#082B55] placeholder-slate-400 focus:outline-none focus:border-[#1769E0] focus:bg-white"
        />
      </div>

      {/* PO Table */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF0] text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">PO Baseline Amount</th>
                <th className="py-3 px-4">Line Items</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#082B55] text-xs font-mono">{po.po_number}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{po.vendor_name}</td>
                  <td className="py-3.5 px-4 font-bold text-[#1769E0] font-mono">
                    ${po.total_amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{po.items?.length || 1} Item(s)</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={po.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl p-6 border border-[#E5EAF0] max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-3">
              <h3 className="text-base font-bold text-[#082B55] flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#1769E0]" />
                Create Baseline Purchase Order
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreatePo} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[11px]">PO Reference Number</label>
                <input
                  type="text"
                  placeholder="e.g. PO-90025"
                  value={poNum}
                  onChange={(e) => setPoNum(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-[#082B55] font-mono focus:outline-none focus:border-[#1769E0] focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[11px]">Vendor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Cloud Solutions"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-[#082B55] focus:outline-none focus:border-[#1769E0] focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[11px]">Baseline Total ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-[#082B55] font-mono focus:outline-none focus:border-[#1769E0] focus:bg-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF0]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1769E0] hover:bg-blue-600 text-white font-semibold rounded-lg text-xs shadow-xs"
                >
                  Create PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Policy } from '../types';
import { Sliders, Plus, Edit2, ShieldCheck, AlertCircle, X } from 'lucide-react';
import { apiService } from '../services/api';

interface PoliciesPageProps {
  policies: Policy[];
  onPolicyUpdated: (updated: Policy) => void;
  onPolicyCreated: (created: Policy) => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({
  policies = [],
  onPolicyUpdated,
  onPolicyCreated,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Amount Limit');
  const [condition, setCondition] = useState('Invoice Amount <= Limit');
  const [threshold, setThreshold] = useState<number>(50000);
  const [action, setAction] = useState('Auto Approve');

  const openCreateModal = () => {
    setEditingPolicy(null);
    setName('');
    setCategory('Amount Limit');
    setCondition('Invoice Amount <= Limit');
    setThreshold(50000);
    setAction('Auto Approve');
    setShowModal(true);
  };

  const openEditModal = (pol: Policy) => {
    setEditingPolicy(pol);
    setName(pol.name);
    setCategory(pol.category);
    setCondition(pol.condition);
    setThreshold(pol.threshold);
    setAction(pol.action);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPolicy) {
      const res = await apiService.updatePolicy(editingPolicy.id, {
        name,
        category,
        condition,
        threshold: Number(threshold),
        action,
      });
      onPolicyUpdated(res);
    } else {
      const res = await apiService.createPolicy({
        name,
        category,
        condition,
        threshold: Number(threshold),
        action,
        is_active: true,
      });
      onPolicyCreated(res);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAF0] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#082B55] tracking-tight flex items-center gap-2.5">
            <span>Corporate Governance & Policy Engine</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1769E0] border border-blue-200">
              {policies.length} Rules Active
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configurable corporate expenditure thresholds, variance ceilings, and autonomous dispatch rules
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#1769E0] hover:bg-blue-600 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-2 transition-colors self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Policy Rule
        </button>
      </div>

      {/* Grid of Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {policies.map((pol) => (
          <div
            key={pol.id}
            className="bg-white rounded-xl p-5 sm:p-6 border border-[#E5EAF0] shadow-xs hover:border-slate-300 hover:shadow-sm space-y-4 flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#1769E0] uppercase tracking-wider block">
                    {pol.category}
                  </span>
                  <h3 className="text-base font-bold text-[#082B55] group-hover:text-[#1769E0] transition-colors">
                    {pol.name}
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                    pol.is_active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  {pol.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div className="mt-3.5 p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF0] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Condition Evaluator:</span>
                  <span className="text-[#082B55] font-semibold font-mono">{pol.condition}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Enforced Threshold:</span>
                  <span className="font-bold text-amber-700 font-mono">
                    {pol.condition.includes('Variance')
                      ? `${pol.threshold}%`
                      : `$${pol.threshold.toLocaleString('en-US')}`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#E5EAF0]">
                  <span className="text-slate-500">Action Dispatch:</span>
                  <span className="font-bold text-[#1769E0]">{pol.action}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => openEditModal(pol)}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-[#E5EAF0] transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#1769E0]" /> Edit Rule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-[#E5EAF0] p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-3">
              <h3 className="text-base font-bold text-[#082B55] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#1769E0]" />
                {editingPolicy ? 'Update Policy Rule' : 'New Corporate Policy Rule'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Policy Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-[#082B55] focus:outline-none focus:border-[#1769E0] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-[#082B55] focus:outline-none focus:border-[#1769E0]"
                >
                  <option value="Amount Limit">Amount Limit</option>
                  <option value="PO Variance">PO Variance</option>
                  <option value="PO Required">PO Required</option>
                  <option value="Approval Tiers">Approval Tiers</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Condition</label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-[#082B55] focus:outline-none focus:border-[#1769E0] focus:bg-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Threshold</label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-[#082B55] focus:outline-none focus:border-[#1769E0] focus:bg-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Action Trigger</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-[#082B55] focus:outline-none focus:border-[#1769E0]"
                >
                  <option value="Auto Approve">Auto Approve</option>
                  <option value="Human Review">Human Review</option>
                  <option value="Reject">Reject</option>
                  <option value="Require PO">Require PO</option>
                </select>
              </div>
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
                Save Policy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

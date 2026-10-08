import React, { useState, useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { InboxPage } from './pages/InboxPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { ExceptionsPage } from './pages/ExceptionsPage';
import { HumanReviewPage } from './pages/HumanReviewPage';
import { VendorsPage } from './pages/VendorsPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { DocumentInspectionModal } from './components/DocumentInspectionModal';
import { UploadModal } from './components/UploadModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { DocumentRow, INITIAL_DOCUMENTS } from './components/RecentDocumentsTable';

import {
  Invoice, PurchaseOrder, Vendor, Policy, AuditLog, AnalyticsResponse
} from './types';
import { apiService } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected document for the interactive inspection drawer
  const [selectedDocument, setSelectedDocument] = useState<DocumentRow | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Platform Data
  const [documents, setDocuments] = useState<DocumentRow[]>(INITIAL_DOCUMENTS);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const loadData = async () => {
    try {
      const [invs, vends, pols, ana, logs] = await Promise.allSettled([
        apiService.getInvoices(),
        apiService.getVendors(),
        apiService.getPolicies(),
        apiService.getAnalytics(),
        apiService.getAuditLogs(),
      ]);

      if (invs.status === 'fulfilled') setInvoices(invs.value);
      if (vends.status === 'fulfilled') setVendors(vends.value);
      if (pols.status === 'fulfilled') setPolicies(pols.value);
      if (ana.status === 'fulfilled') setAnalytics(ana.value);
      if (logs.status === 'fulfilled') setAuditLogs(logs.value);
    } catch (err) {
      console.error('Data loading error:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveDocument = (doc: DocumentRow) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, status: 'Auto-resolved' as const } : d))
    );
    setSelectedDocument(null);
  };

  const handleRejectDocument = (doc: DocumentRow) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, status: 'Blocked' as const } : d))
    );
    setSelectedDocument(null);
  };

  const handleUploadSuccess = (newDoc: DocumentRow) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  return (
    <>
      <MainLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        pendingReviewCount={8}
        exceptionsCount={8}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      >
        {activeTab === 'dashboard' && (
          <DashboardPage
            onViewDocument={(doc) => setSelectedDocument(doc)}
            onNavigateTab={setActiveTab}
            onUploadInvoice={() => setIsUploadModalOpen(true)}
          />
        )}

        {activeTab === 'inbox' && (
          <InboxPage
            onSelectDocument={(doc) => setSelectedDocument(doc)}
            onNavigateUpload={() => setIsUploadModalOpen(true)}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoicesPage
            invoices={invoices}
            onSelectDocument={(doc) => setSelectedDocument(doc)}
            onNavigateUpload={() => setIsUploadModalOpen(true)}
          />
        )}

        {activeTab === 'expenses' && (
          <InvoicesPage
            invoices={invoices.filter((i) => i.vendor_name?.includes('Priya') || i.total_amount < 5000)}
            onSelectDocument={(doc) => setSelectedDocument(doc)}
            onNavigateUpload={() => setIsUploadModalOpen(true)}
          />
        )}

        {activeTab === 'exceptions' && (
          <ExceptionsPage
            invoices={invoices}
            onSelectDocument={(doc) => setSelectedDocument(doc)}
          />
        )}

        {activeTab === 'my-review' && (
          <HumanReviewPage
            pendingInvoices={invoices.filter((i) => i.status === 'Review' || i.requires_human_review)}
            onReviewCompleted={() => loadData()}
            onSelectDocument={(doc) => setSelectedDocument(doc)}
          />
        )}

        {activeTab === 'vendors' && <VendorsPage vendors={vendors} />}

        {activeTab === 'workflows' && (
          <PoliciesPage
            policies={policies}
            onPolicyUpdated={(pol) => setPolicies(policies.map((p) => (p.id === pol.id ? pol : p)))}
            onPolicyCreated={(pol) => setPolicies([...policies, pol])}
          />
        )}

        {activeTab === 'reports' && <AnalyticsPage analytics={analytics} />}

        {activeTab === 'audit-trail' && <AuditLogsPage logs={auditLogs} />}

        {activeTab === 'settings' && <SettingsPage />}
      </MainLayout>

      {/* Interactive Document Inspection Modal */}
      <DocumentInspectionModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
        onApprove={handleApproveDocument}
        onReject={handleRejectDocument}
      />

      {/* Upload Invoice Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* AI Assistant Copilot Drawer */}
      <AiAssistantDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onViewDocument={(doc) => setSelectedDocument(doc)}
        onNavigateTab={setActiveTab}
      />
    </>
  );
}

export default App;

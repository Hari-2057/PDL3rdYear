import datetime
from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine, Base
from app.database.models import (
    Role, User, Vendor, PurchaseOrder, PurchaseOrderItem, Policy,
    Invoice, InvoiceItem, ExceptionItem, AgentExecution, RiskAssessment,
    Approval, AuditLog, Notification
)
from app.auth.jwt import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Clear existing data if any
    db.query(Notification).delete()
    db.query(AuditLog).delete()
    db.query(Approval).delete()
    db.query(RiskAssessment).delete()
    db.query(AgentExecution).delete()
    db.query(ExceptionItem).delete()
    db.query(InvoiceItem).delete()
    db.query(Invoice).delete()
    db.query(Policy).delete()
    db.query(PurchaseOrderItem).delete()
    db.query(PurchaseOrder).delete()
    db.query(Vendor).delete()
    db.query(User).delete()
    db.query(Role).delete()
    db.commit()

    print("Seeding database...")

    # 1. Roles
    roles = [
        Role(id=1, name="Admin", description="Full system access and policy configuration"),
        Role(id=2, name="Finance Manager", description="Financial approval and exception management"),
        Role(id=3, name="Reviewer", description="Human-in-the-loop invoice reviewer"),
        Role(id=4, name="Employee", description="Standard invoice submitter")
    ]
    db.add_all(roles)
    db.commit()

    # 2. Users
    pwd = get_password_hash("password123")
    users = [
        User(id=1, email="admin@invoiceguard.ai", password_hash=pwd, full_name="System Admin", role_id=1),
        User(id=2, email="finance@invoiceguard.ai", password_hash=pwd, full_name="Sarah Jenkins (Finance Manager)", role_id=2),
        User(id=3, email="reviewer@invoiceguard.ai", password_hash=pwd, full_name="Alex Rivera (HITL Reviewer)", role_id=3),
        User(id=4, email="employee@invoiceguard.ai", password_hash=pwd, full_name="David Chen (Employee)", role_id=4),
    ]
    db.add_all(users)
    db.commit()

    # 3. Policies
    policies = [
        Policy(id=1, name="Auto Approval Limit", category="Amount Limit", condition="Invoice amount <=", threshold=50000.0, action="Auto Approve"),
        Policy(id=2, name="Maximum PO Variance", category="PO Variance", condition="PO Variance <=", threshold=10.0, action="Human Review"),
        Policy(id=3, name="PO Required Threshold", category="PO Required", condition="Invoice amount >=", threshold=10000.0, action="Require PO"),
        Policy(id=4, name="Manager Approval Required", category="Approval Tiers", condition="Invoice amount >=", threshold=50000.0, action="Human Review"),
        Policy(id=5, name="Finance Director Approval", category="Approval Tiers", condition="Invoice amount >=", threshold=200000.0, action="Require Finance Manager"),
        Policy(id=6, name="Tax Calculation Tolerance", category="Tax Check", condition="Tax Discrepancy >=", threshold=5.0, action="Flag Exception"),
    ]
    db.add_all(policies)
    db.commit()

    # 4. Vendors (10 vendors)
    vendors = [
        Vendor(id=1, vendor_id_str="VEND-1001", name="ABC Technologies", address="101 Tech Park, Bengaluru", email="billing@abctech.com", phone="+91-9876543210", tax_id="GSTIN29ABCDE1234F1Z5", total_invoices=14, total_value=2450000.0, avg_invoice_amount=175000.0, exception_count=3, risk_level="Medium"),
        Vendor(id=2, vendor_id_str="VEND-1002", name="Global Office Supplies", address="45 Commerce St, Mumbai", email="accounts@globaloffice.com", phone="+91-9876543211", tax_id="GSTIN27GLOBE5678G2Z1", total_invoices=28, total_value=620000.0, avg_invoice_amount=22140.0, exception_count=1, risk_level="Low"),
        Vendor(id=3, vendor_id_str="VEND-1003", name="Apex Cloud Solutions", address="700 Innovation Way, Hyderabad", email="invoices@apexcloud.io", phone="+91-9876543212", tax_id="GSTIN36APEXC9101H3Z4", total_invoices=8, total_value=1800000.0, avg_invoice_amount=225000.0, exception_count=0, risk_level="Low"),
        Vendor(id=4, vendor_id_str="VEND-1004", name="Vertex Logistics", address="12 Cargo Hub, Chennai", email="finance@vertexlog.in", phone="+91-9876543213", tax_id="GSTIN33VERTE1213I4Z2", total_invoices=15, total_value=950000.0, avg_invoice_amount=63333.0, exception_count=4, risk_level="High"),
        Vendor(id=5, vendor_id_str="VEND-1005", name="Precision Consulting", address="88 Mindspace, Gurugram", email="payables@precision.com", phone="+91-9876543214", tax_id="GSTIN06PRECI1415J5Z9", total_invoices=6, total_value=1200000.0, avg_invoice_amount=200000.0, exception_count=2, risk_level="Medium"),
        Vendor(id=6, vendor_id_str="VEND-1006", name="Starlight Hardware Corp", address="200 Industrial Area, Pune", email="billing@starlight.co.in", phone="+91-9876543215", tax_id="GSTIN27STARL1617K6Z8", total_invoices=19, total_value=1420000.0, avg_invoice_amount=74736.0, exception_count=1, risk_level="Low"),
        Vendor(id=7, vendor_id_str="VEND-1007", name="Nexus Facilities Mgmt", address="33 Green Park, New Delhi", email="inv@nexusfac.com", phone="+91-9876543216", tax_id="GSTIN07NEXUS1819L7Z3", total_invoices=22, total_value=880000.0, avg_invoice_amount=40000.0, exception_count=0, risk_level="Low"),
        Vendor(id=8, vendor_id_str="VEND-1008", name="Quantum Digital Media", address="500 Media City, Bengaluru", email="ar@quantumdigital.com", phone="+91-9876543217", tax_id="GSTIN29QUANT2021M8Z6", total_invoices=9, total_value=3100000.0, avg_invoice_amount=344444.0, exception_count=5, risk_level="Critical"),
        Vendor(id=9, vendor_id_str="VEND-1009", name="CyberShield Security", address="14 Cyber Tower, Noida", email="billing@cybershield.in", phone="+91-9876543218", tax_id="GSTIN09CYBER2223N9Z0", total_invoices=5, total_value=750000.0, avg_invoice_amount=150000.0, exception_count=0, risk_level="Low"),
        Vendor(id=10, vendor_id_str="VEND-1010", name="Unregistered Consulting (Unknown)", address="Unknown Address", email="ghost@suspiciousvendor.com", phone="+91-0000000000", tax_id="INVALID_TAX_ID", total_invoices=1, total_value=450000.0, avg_invoice_amount=450000.0, exception_count=3, risk_level="Critical"),
    ]
    db.add_all(vendors)
    db.commit()

    # 5. Purchase Orders (15 POs)
    pos = [
        PurchaseOrder(id=1, po_number="PO-10023", vendor_name="ABC Technologies", vendor_id=1, total_amount=250000.0, used_amount=250000.0, remaining_amount=0.0, status="Fully Invoiced"),
        PurchaseOrder(id=2, po_number="PO-10024", vendor_name="Global Office Supplies", vendor_id=2, total_amount=40000.0, used_amount=18500.0, remaining_amount=21500.0, status="Active"),
        PurchaseOrder(id=3, po_number="PO-10025", vendor_name="Apex Cloud Solutions", vendor_id=3, total_amount=300000.0, used_amount=300000.0, remaining_amount=0.0, status="Fully Invoiced"),
        PurchaseOrder(id=4, po_number="PO-10026", vendor_name="Vertex Logistics", vendor_id=4, total_amount=75000.0, used_amount=75000.0, remaining_amount=0.0, status="Active"),
        PurchaseOrder(id=5, po_number="PO-10027", vendor_name="Precision Consulting", vendor_id=5, total_amount=200000.0, used_amount=150000.0, remaining_amount=50000.0, status="Active"),
        PurchaseOrder(id=6, po_number="PO-10028", vendor_name="Starlight Hardware Corp", vendor_id=6, total_amount=120000.0, used_amount=120000.0, remaining_amount=0.0, status="Active"),
        PurchaseOrder(id=7, po_number="PO-10029", vendor_name="Nexus Facilities Mgmt", vendor_id=7, total_amount=45000.0, used_amount=35000.0, remaining_amount=10000.0, status="Active"),
        PurchaseOrder(id=8, po_number="PO-10030", vendor_name="Quantum Digital Media", vendor_id=8, total_amount=500000.0, used_amount=250000.0, remaining_amount=250000.0, status="Active"),
        PurchaseOrder(id=9, po_number="PO-10031", vendor_name="CyberShield Security", vendor_id=9, total_amount=150000.0, used_amount=150000.0, remaining_amount=0.0, status="Closed"),
        PurchaseOrder(id=10, po_number="PO-10032", vendor_name="ABC Technologies", vendor_id=1, total_amount=500000.0, used_amount=0.0, remaining_amount=500000.0, status="Active"),
        PurchaseOrder(id=11, po_number="PO-10033", vendor_name="Global Office Supplies", vendor_id=2, total_amount=80000.0, used_amount=0.0, remaining_amount=80000.0, status="Active"),
        PurchaseOrder(id=12, po_number="PO-10034", vendor_name="Starlight Hardware Corp", vendor_id=6, total_amount=95000.0, used_amount=0.0, remaining_amount=95000.0, status="Active"),
        PurchaseOrder(id=13, po_number="PO-10035", vendor_name="Vertex Logistics", vendor_id=4, total_amount=110000.0, used_amount=0.0, remaining_amount=110000.0, status="Active"),
        PurchaseOrder(id=14, po_number="PO-10036", vendor_name="Nexus Facilities Mgmt", vendor_id=7, total_amount=30000.0, used_amount=0.0, remaining_amount=30000.0, status="Active"),
        PurchaseOrder(id=15, po_number="PO-10037", vendor_name="Apex Cloud Solutions", vendor_id=3, total_amount=450000.0, used_amount=0.0, remaining_amount=450000.0, status="Active"),
    ]
    db.add_all(pos)
    db.commit()

    # Add PO Items
    po_items = [
        PurchaseOrderItem(po_id=1, description="Enterprise Cloud Server Licenses", quantity=5.0, unit_price=50000.0, total_price=250000.0),
        PurchaseOrderItem(po_id=2, description="Ergonomic Chairs & Desk Supplies", quantity=10.0, unit_price=4000.0, total_price=40000.0),
        PurchaseOrderItem(po_id=3, description="DevOps Infrastructure Support", quantity=1.0, unit_price=300000.0, total_price=300000.0),
        PurchaseOrderItem(po_id=4, description="Inter-state Freight Logistics", quantity=1.0, unit_price=75000.0, total_price=75000.0),
        PurchaseOrderItem(po_id=5, description="Financial Risk Audit Services", quantity=1.0, unit_price=200000.0, total_price=200000.0),
    ]
    db.add_all(po_items)
    db.commit()

    # 6. Invoices (20 realistic scenarios covering perfect, amount mismatch, missing PO, duplicate, tax mismatch, policy violation, suspicious, etc.)
    now = datetime.datetime.utcnow()
    
    invoices_data = [
        # Scenario 1: Critical Variance & Amount Mismatch (Demo Invoice #1)
        {
            "id": 1, "invoice_number": "INV-10245", "vendor_name": "ABC Technologies", "vendor_id": 1, "po_number": "PO-10023", "po_id": 1,
            "invoice_date": "2026-08-10", "due_date": "2026-09-10", "currency": "INR", "subtotal": 250000.0, "tax": 45000.0, "total_amount": 295000.0,
            "status": "Review", "risk_score": 82, "risk_level": "Critical", "decision": "REVIEW",
            "decision_reason": "Invoice amount exceeds PO amount by ₹45,000 (18.0% variance), exceeding the 10.0% allowable policy threshold.",
            "requires_human_review": True, "processing_time_ms": 1420,
            "items": [
                {"description": "Enterprise Cloud Server Licenses", "quantity": 5.0, "unit_price": 50000.0, "tax_percentage": 18.0, "total_price": 250000.0}
            ],
            "exceptions": [
                {"type": "Amount mismatch", "severity": "High", "description": "Invoice total (₹2,95,000) exceeds PO amount (₹2,50,000) by 18%", "risk_score_impact": 30, "agent": "PO Matching Agent"},
                {"type": "Policy violation", "severity": "Medium", "description": "PO variance 18% exceeds permitted 10%", "risk_score_impact": 25, "agent": "Policy Compliance Agent"},
                {"type": "Large transaction", "severity": "Medium", "description": "Invoice exceeds manager auto-approval limit", "risk_score_impact": 15, "agent": "Fraud & Anomaly Agent"},
                {"type": "Vendor anomaly", "severity": "Low", "description": "Recent surge in invoice amount variance for vendor", "risk_score_impact": 12, "agent": "Fraud & Anomaly Agent"}
            ]
        },
        # Scenario 2: Perfect Auto-Approved Invoice
        {
            "id": 2, "invoice_number": "INV-88901", "vendor_name": "Global Office Supplies", "vendor_id": 2, "po_number": "PO-10024", "po_id": 2,
            "invoice_date": "2026-08-08", "due_date": "2026-09-08", "currency": "INR", "subtotal": 15000.0, "tax": 2700.0, "total_amount": 17700.0,
            "status": "Approved", "risk_score": 12, "risk_level": "Low", "decision": "APPROVE",
            "decision_reason": "Invoice fully compliant with PO-10024, valid calculations, and under auto-approval limit.",
            "requires_human_review": False, "processing_time_ms": 680,
            "items": [
                {"description": "Printer Paper & Stationary Pack", "quantity": 10.0, "unit_price": 1500.0, "tax_percentage": 18.0, "total_price": 15000.0}
            ],
            "exceptions": []
        },
        # Scenario 3: Missing Purchase Order
        {
            "id": 3, "invoice_number": "INV-77342", "vendor_name": "Precision Consulting", "vendor_id": 5, "po_number": None, "po_id": None,
            "invoice_date": "2026-08-05", "due_date": "2026-09-05", "currency": "INR", "subtotal": 150000.0, "tax": 27000.0, "total_amount": 177000.0,
            "status": "Review", "risk_score": 65, "risk_level": "High", "decision": "REVIEW",
            "decision_reason": "No Purchase Order associated with high value transaction (₹1,77,000). PO required for invoices > ₹10,000.",
            "requires_human_review": True, "processing_time_ms": 1150,
            "items": [
                {"description": "Advisory & Strategy Consulting Services", "quantity": 1.0, "unit_price": 150000.0, "tax_percentage": 18.0, "total_price": 150000.0}
            ],
            "exceptions": [
                {"type": "Missing PO", "severity": "High", "description": "High-value invoice lacks purchase order number", "risk_score_impact": 40, "agent": "PO Matching Agent"},
                {"type": "Policy violation", "severity": "High", "description": "Required PO missing for amount > ₹10,000", "risk_score_impact": 25, "agent": "Policy Compliance Agent"}
            ]
        },
        # Scenario 4: Duplicate Invoice Number Detected
        {
            "id": 4, "invoice_number": "INV-88901", "vendor_name": "Global Office Supplies", "vendor_id": 2, "po_number": "PO-10024", "po_id": 2,
            "invoice_date": "2026-08-09", "due_date": "2026-09-09", "currency": "INR", "subtotal": 15000.0, "tax": 2700.0, "total_amount": 17700.0,
            "status": "Rejected", "risk_score": 95, "risk_level": "Critical", "decision": "REJECT",
            "decision_reason": "Duplicate invoice number INV-88901 detected for vendor Global Office Supplies.",
            "requires_human_review": True, "processing_time_ms": 920,
            "items": [
                {"description": "Duplicate Printer Paper Pack", "quantity": 10.0, "unit_price": 1500.0, "tax_percentage": 18.0, "total_price": 15000.0}
            ],
            "exceptions": [
                {"type": "Duplicate invoice", "severity": "Critical", "description": "Exact match found with previously processed Invoice #2", "risk_score_impact": 70, "agent": "Validation Agent"},
                {"type": "Unusual frequency", "severity": "High", "description": "Identical invoice submitted twice in 24 hours", "risk_score_impact": 25, "agent": "Fraud & Anomaly Agent"}
            ]
        },
        # Scenario 5: Tax Calculation Mismatch
        {
            "id": 5, "invoice_number": "INV-55102", "vendor_name": "Starlight Hardware Corp", "vendor_id": 6, "po_number": "PO-10028", "po_id": 6,
            "invoice_date": "2026-08-07", "due_date": "2026-09-07", "currency": "INR", "subtotal": 100000.0, "tax": 32000.0, "total_amount": 132000.0,
            "status": "Review", "risk_score": 58, "risk_level": "Medium", "decision": "REVIEW",
            "decision_reason": "Tax calculation mismatch. Expected 18% GST (₹18,000), but invoice specified ₹32,000 tax.",
            "requires_human_review": True, "processing_time_ms": 1050,
            "items": [
                {"description": "Industrial Hardware Screws & Cables", "quantity": 100.0, "unit_price": 1000.0, "tax_percentage": 32.0, "total_price": 100000.0}
            ],
            "exceptions": [
                {"type": "Tax mismatch", "severity": "Medium", "description": "Calculated GST (₹18,000) does not match invoice tax field (₹32,000)", "risk_score_impact": 35, "agent": "Validation Agent"},
                {"type": "Policy violation", "severity": "Medium", "description": "Tax discrepancy exceeds 5% policy tolerance limit", "risk_score_impact": 23, "agent": "Policy Compliance Agent"}
            ]
        },
        # Scenario 6: Vendor Mismatch / Suspicious Vendor
        {
            "id": 6, "invoice_number": "INV-99011", "vendor_name": "Unregistered Consulting (Unknown)", "vendor_id": 10, "po_number": "PO-10027", "po_id": 5,
            "invoice_date": "2026-08-01", "due_date": "2026-08-31", "currency": "INR", "subtotal": 400000.0, "tax": 50000.0, "total_amount": 450000.0,
            "status": "Rejected", "risk_score": 92, "risk_level": "Critical", "decision": "REJECT",
            "decision_reason": "Unregistered vendor submitting invoice against PO belonging to Precision Consulting. Critical fraud alert.",
            "requires_human_review": True, "processing_time_ms": 1300,
            "items": [
                {"description": "Unverified Executive Coaching", "quantity": 1.0, "unit_price": 400000.0, "tax_percentage": 12.5, "total_price": 400000.0}
            ],
            "exceptions": [
                {"type": "Vendor mismatch", "severity": "Critical", "description": "Vendor name on invoice does not match PO vendor", "risk_score_impact": 45, "agent": "PO Matching Agent"},
                {"type": "Suspicious tax amount", "severity": "High", "description": "Invalid tax identification number GSTIN", "risk_score_impact": 25, "agent": "Fraud & Anomaly Agent"},
                {"type": "Unusual vendor", "severity": "High", "description": "Vendor flag: Unregistered / High risk tier", "risk_score_impact": 22, "agent": "Fraud & Anomaly Agent"}
            ]
        },
        # Scenario 7: Perfect Low-Risk IT Invoice
        {
            "id": 7, "invoice_number": "INV-44120", "vendor_name": "Apex Cloud Solutions", "vendor_id": 3, "po_number": "PO-10025", "po_id": 3,
            "invoice_date": "2026-08-02", "due_date": "2026-09-02", "currency": "INR", "subtotal": 300000.0, "tax": 54000.0, "total_amount": 354000.0,
            "status": "Approved", "risk_score": 18, "risk_level": "Low", "decision": "APPROVE",
            "decision_reason": "100% PO line item match, verified GST tax, and approved by Finance Director tier.",
            "requires_human_review": False, "processing_time_ms": 710,
            "items": [
                {"description": "DevOps Infrastructure Support Services", "quantity": 1.0, "unit_price": 300000.0, "tax_percentage": 18.0, "total_price": 300000.0}
            ],
            "exceptions": []
        },
        # Scenario 8: Logistics Freight Mismatch
        {
            "id": 8, "invoice_number": "INV-66321", "vendor_name": "Vertex Logistics", "vendor_id": 4, "po_number": "PO-10026", "po_id": 4,
            "invoice_date": "2026-08-04", "due_date": "2026-09-04", "currency": "INR", "subtotal": 82000.0, "tax": 14760.0, "total_amount": 96760.0,
            "status": "Review", "risk_score": 52, "risk_level": "Medium", "decision": "REVIEW",
            "decision_reason": "Logistics charge ₹96,760 exceeds PO-10026 (₹75,000) by 9.3% variance.",
            "requires_human_review": True, "processing_time_ms": 890,
            "items": [
                {"description": "Inter-state Cargo & Surcharge Logistics", "quantity": 1.0, "unit_price": 82000.0, "tax_percentage": 18.0, "total_price": 82000.0}
            ],
            "exceptions": [
                {"type": "Amount mismatch", "severity": "Medium", "description": "Invoice subtotal ₹82,000 exceeds PO unit price ₹75,000", "risk_score_impact": 30, "agent": "PO Matching Agent"},
                {"type": "Policy violation", "severity": "Low", "description": "Variance 9.3% close to 10% tolerance limit", "risk_score_impact": 22, "agent": "Policy Compliance Agent"}
            ]
        },
        # Scenarios 9-20: Additional realistic historical invoices
    ]

    for idx in range(9, 21):
        v_idx = (idx % 9) + 1
        v = vendors[v_idx - 1]
        po_num = f"PO-100{23 + (idx % 10)}"
        amt = round(25000.0 + (idx * 12500.0), 2)
        tax_amt = round(amt * 0.18, 2)
        tot = amt + tax_amt
        is_appr = (idx % 3 != 0)
        status_str = "Approved" if is_appr else "Review"
        dec_str = "APPROVE" if is_appr else "REVIEW"
        risk_sc = 15 if is_appr else 48 + (idx * 2)
        risk_lvl = "Low" if is_appr else "Medium"
        
        invoices_data.append({
            "id": idx,
            "invoice_number": f"INV-{10000 + idx * 37}",
            "vendor_name": v.name,
            "vendor_id": v.id,
            "po_number": po_num,
            "po_id": (idx % 15) + 1,
            "invoice_date": f"2026-07-{(idx % 28) + 1:02d}",
            "due_date": f"2026-08-{(idx % 28) + 1:02d}",
            "currency": "INR",
            "subtotal": amt,
            "tax": tax_amt,
            "total_amount": tot,
            "status": status_str,
            "risk_score": risk_sc,
            "risk_level": risk_lvl,
            "decision": dec_str,
            "decision_reason": "Routine operational invoice verified by automated policy engine." if is_appr else "Minor variance in subtotal requiring finance reviewer sign-off.",
            "requires_human_review": not is_appr,
            "processing_time_ms": 650 + (idx * 45),
            "items": [
                {"description": f"Standard Operational Item #{idx}", "quantity": 2.0, "unit_price": amt / 2, "tax_percentage": 18.0, "total_price": amt}
            ],
            "exceptions": [] if is_appr else [
                {"type": "Policy violation", "severity": "Medium", "description": "Requires reviewer signoff due to department budget thresholds", "risk_score_impact": risk_sc, "agent": "Policy Compliance Agent"}
            ]
        })

    for inv_d in invoices_data:
        inv = Invoice(
            id=inv_d["id"],
            invoice_number=inv_d["invoice_number"],
            vendor_name=inv_d["vendor_name"],
            vendor_id=inv_d["vendor_id"],
            po_number=inv_d["po_number"],
            po_id=inv_d["po_id"],
            document_url=f"/uploads/invoices/{inv_d['invoice_number']}.pdf",
            file_type="PDF",
            raw_text=f"INVOICE\nVendor: {inv_d['vendor_name']}\nInvoice No: {inv_d['invoice_number']}\nDate: {inv_d['invoice_date']}\nPO No: {inv_d['po_number']}\nTotal: ₹{inv_d['total_amount']}",
            invoice_date=inv_d["invoice_date"],
            due_date=inv_d["due_date"],
            currency=inv_d["currency"],
            subtotal=inv_d["subtotal"],
            tax=inv_d["tax"],
            total_amount=inv_d["total_amount"],
            payment_terms="Net 30",
            status=inv_d["status"],
            risk_score=inv_d["risk_score"],
            risk_level=inv_d["risk_level"],
            decision=inv_d["decision"],
            decision_reason=inv_d["decision_reason"],
            requires_human_review=inv_d["requires_human_review"],
            processing_time_ms=inv_d["processing_time_ms"],
            created_at=now - datetime.timedelta(days=20 - inv_d["id"])
        )
        db.add(inv)
        db.commit()

        # Add Items
        for it in inv_d["items"]:
            inv_item = InvoiceItem(
                invoice_id=inv.id,
                description=it["description"],
                quantity=it["quantity"],
                unit_price=it["unit_price"],
                tax_percentage=it["tax_percentage"],
                total_price=it["total_price"]
            )
            db.add(inv_item)

        # Add Exceptions
        for exc in inv_d["exceptions"]:
            exc_item = ExceptionItem(
                invoice_id=inv.id,
                type=exc["type"],
                severity=exc["severity"],
                description=exc["description"],
                risk_score_impact=exc["risk_score_impact"],
                detected_by_agent=exc["agent"],
                status="Open" if inv.status == "Review" else "Resolved",
                assigned_to_user_id=3 if inv.status == "Review" else None
            )
            db.add(exc_item)

        # Add Agent Executions for each invoice
        agents = [
            ("OCR Agent", "SUCCESS", 120, "PDF document parsed into raw OCR text"),
            ("Extraction Agent", "SUCCESS", 250, "Extracted 12 structured fields and 1 line items"),
            ("Validation Agent", "WARNING" if inv_d["exceptions"] else "SUCCESS", 180, "Executed 8 rule validation checks"),
            ("PO Matching Agent", "WARNING" if any(e["type"] in ["Amount mismatch", "Missing PO", "Vendor mismatch"] for e in inv_d["exceptions"]) else "SUCCESS", 210, "Cross-referenced against PO database"),
            ("Policy Compliance Agent", "WARNING" if any(e["type"] == "Policy violation" for e in inv_d["exceptions"]) else "SUCCESS", 140, "Evaluated corporate policy engine rules"),
            ("Fraud & Anomaly Agent", "WARNING" if inv_d["risk_score"] > 30 else "SUCCESS", 290, f"Scored risk profile: {inv_d['risk_score']}/100"),
            ("Decision Agent", "SUCCESS", 150, f"Final synthesized decision: {inv_d['decision']}")
        ]
        for ag_name, ag_stat, ag_time, ag_sum in agents:
            ag_exec = AgentExecution(
                invoice_id=inv.id,
                agent_name=ag_name,
                status=ag_stat,
                execution_time_ms=ag_time,
                input_summary=ag_sum,
                output_json={"status": ag_stat, "summary": ag_sum},
                executed_at=inv.created_at
            )
            db.add(ag_exec)

        # Add Risk Assessment
        risk_breakdown = [
            {"factor": e["type"], "score": e["risk_score_impact"], "description": e["description"]}
            for e in inv_d["exceptions"]
        ]
        if not risk_breakdown:
            risk_breakdown = [{"factor": "Baseline Risk", "score": inv_d["risk_score"], "description": "Standard baseline verification passed"}]

        risk_ass = RiskAssessment(
            invoice_id=inv.id,
            total_risk_score=inv_d["risk_score"],
            risk_level=inv_d["risk_level"],
            breakdown_json=risk_breakdown,
            reasoning=inv_d["decision_reason"],
            created_at=inv.created_at
        )
        db.add(risk_ass)

        # Add Audit log entry
        audit_log = AuditLog(
            timestamp=inv.created_at,
            actor="Decision Agent",
            action=f"Generated Decision: {inv_d['decision']}",
            invoice_id=inv.id,
            invoice_number=inv.invoice_number,
            previous_state="Processing",
            new_state=inv.status,
            details=inv_d["decision_reason"]
        )
        db.add(audit_log)

    db.commit()

    # Add sample Human Approvals for approved/rejected HITL reviews
    approvals = [
        Approval(invoice_id=2, reviewer_id=3, reviewer_name="Alex Rivera (HITL Reviewer)", decision="Approved", comments="Verified line item paper quantities match recent shipment note.", created_at=now - datetime.timedelta(days=2)),
        Approval(invoice_id=4, reviewer_id=2, reviewer_name="Sarah Jenkins (Finance Manager)", decision="Rejected", comments="Duplicate submission confirmed. Rejecting duplicate claim.", created_at=now - datetime.timedelta(days=1)),
    ]
    db.add_all(approvals)
    
    # Add notifications
    notifications = [
        Notification(user_id=2, title="Critical Exception Detected", message="Invoice #INV-10245 from ABC Technologies has 18% PO variance and critical risk score 82/100.", type="danger", is_read=False, invoice_id=1),
        Notification(user_id=3, title="Human Review Required", message="Invoice #INV-77342 (Precision Consulting) requires PO exception clearance.", type="warning", is_read=False, invoice_id=3),
        Notification(user_id=2, title="Duplicate Invoice Blocked", message="Duplicate invoice #INV-88901 automatically flagged and rejected.", type="info", is_read=True, invoice_id=4),
        Notification(user_id=3, title="Tax Discrepancy Alert", message="Invoice #INV-55102 from Starlight Hardware has GST calculation mismatch.", type="warning", is_read=False, invoice_id=5),
    ]
    db.add_all(notifications)
    db.commit()

    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()

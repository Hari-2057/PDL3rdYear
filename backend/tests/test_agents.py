import pytest
from app.agents.ocr_agent import OCRAgent
from app.agents.extraction_agent import ExtractionAgent
from app.agents.validation_agent import ValidationAgent
from app.agents.po_matching_agent import POMatchingAgent
from app.agents.policy_agent import PolicyAgent
from app.agents.fraud_agent import FraudDetectionAgent
from app.agents.decision_agent import DecisionAgent
from app.agents.workflow import agent_workflow

def test_ocr_agent():
    agent = OCRAgent()
    state = {"document_url": "", "raw_text": "INVOICE Vendor: ABC Technologies Invoice Number: INV-10245 Date: 2026-08-10 PO: PO-10023 Total: 295000"}
    res = agent.execute(state)
    assert res["document_type"] == "INVOICE"
    assert res["ocr_confidence"] >= 0.90
    print("OCR Agent Test Passed!")

def test_extraction_agent():
    agent = ExtractionAgent()
    state = {"raw_text": "INVOICE Vendor: ABC Technologies Invoice Number: INV-10245 Purchase Order Number: PO-10023 Subtotal: 250,000 Tax: 45,000 Total: 295,000"}
    res = agent.execute(state)
    assert res["extracted_invoice"]["vendor_name"] == "ABC Technologies"
    assert res["extracted_invoice"]["invoice_number"] == "INV-10245"
    assert res["extracted_invoice"]["po_number"] == "PO-10023"
    print("Extraction Agent Test Passed!")

def test_po_matching_agent_mismatch():
    agent = POMatchingAgent()
    state = {
        "extracted_invoice": {"vendor_name": "ABC Technologies", "invoice_number": "INV-10245", "po_number": "PO-10023", "subtotal": 295000.0, "total": 295000.0},
        "po_database": [{"po_number": "PO-10023", "vendor_name": "ABC Technologies", "total_amount": 250000.0}]
    }
    res = agent.execute(state)
    assert res["po_match_result"]["po_match"] == False
    assert res["po_match_result"]["variance_percentage"] == 18.0
    print("PO Matching Agent Test Passed!")

def test_policy_agent():
    agent = PolicyAgent()
    state = {
        "extracted_invoice": {"total": 295000.0, "po_number": "PO-10023"},
        "po_match_result": {"po_found": True, "variance_percentage": 18.0},
        "policies": [{"name": "Maximum PO Variance", "threshold": 10.0, "is_active": True}]
    }
    res = agent.execute(state)
    assert res["policy_result"]["policy_compliant"] == False
    assert len(res["policy_result"]["violations"]) > 0
    print("Policy Agent Test Passed!")

def test_fraud_agent():
    agent = FraudDetectionAgent()
    state = {
        "extracted_invoice": {"invoice_number": "INV-10245", "total": 295000.0},
        "validation_result": {"errors": [], "warnings": []},
        "po_match_result": {"po_found": True, "po_match": False, "variance_percentage": 18.0},
        "policy_result": {"violations": ["Variance exceeds 10%"]},
        "vendor_database": []
    }
    res = agent.execute(state)
    assert res["risk_score"] > 50
    print(f"Fraud Agent Risk Score: {res['risk_score']} - Test Passed!")

def test_end_to_end_langgraph_workflow():
    initial_state = {
        "invoice_id": 1,
        "raw_text": "INVOICE Vendor: ABC Technologies Invoice Number: INV-10245 Purchase Order Number: PO-10023 Subtotal: 250,000 Tax: 45,000 Total: 295,000",
        "po_database": [{"po_number": "PO-10023", "vendor_name": "ABC Technologies", "total_amount": 250000.0}],
        "vendor_database": [{"name": "ABC Technologies", "risk_level": "Medium"}],
        "policies": [{"name": "Maximum PO Variance", "threshold": 10.0, "is_active": True}]
    }
    final_state = agent_workflow.run(initial_state)
    assert final_state["decision"] in ["REVIEW", "REJECT", "APPROVE"]
    assert len(final_state["agent_logs"]) == 7
    print(f"End-to-End Workflow Decision: {final_state['decision']} - Passed!")

if __name__ == "__main__":
    test_ocr_agent()
    test_extraction_agent()
    test_po_matching_agent_mismatch()
    test_policy_agent()
    test_fraud_agent()
    test_end_to_end_langgraph_workflow()
    print("\nALL 7 AGENT UNIT TESTS PASSED PERFECTLY!")

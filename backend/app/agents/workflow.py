import time
from typing import Dict, Any, TypedDict, List, Annotated
import logging

from app.agents.ocr_agent import OCRAgent
from app.agents.extraction_agent import ExtractionAgent
from app.agents.validation_agent import ValidationAgent
from app.agents.po_matching_agent import POMatchingAgent
from app.agents.policy_agent import PolicyAgent
from app.agents.fraud_agent import FraudDetectionAgent
from app.agents.decision_agent import DecisionAgent

logger = logging.getLogger("InvoiceGuard.Workflow")

# Define LangGraph State schema
class InvoiceAgentState(TypedDict, total=False):
    invoice_id: int
    document_url: str
    document_type: str
    raw_text: str
    ocr_confidence: float
    extracted_invoice: Dict[str, Any]
    validation_result: Dict[str, Any]
    po_match_result: Dict[str, Any]
    policy_result: Dict[str, Any]
    fraud_result: Dict[str, Any]
    risk_score: int
    risk_level: str
    decision: str
    decision_reason: str
    requires_human_review: bool
    agent_logs: List[Dict[str, Any]]
    existing_invoices: List[Dict[str, Any]]
    po_database: List[Dict[str, Any]]
    vendor_database: List[Dict[str, Any]]
    policies: List[Dict[str, Any]]
    errors: List[str]

class MultiAgentWorkflow:
    def __init__(self):
        self.ocr_agent = OCRAgent()
        self.extraction_agent = ExtractionAgent()
        self.validation_agent = ValidationAgent()
        self.po_matching_agent = POMatchingAgent()
        self.policy_agent = PolicyAgent()
        self.fraud_agent = FraudDetectionAgent()
        self.decision_agent = DecisionAgent()
        self._build_graph()

    def _build_graph(self):
        try:
            from langgraph.graph import StateGraph, END
            
            workflow = StateGraph(InvoiceAgentState)
            
            workflow.add_node("ocr_agent", self.ocr_agent.execute)
            workflow.add_node("extraction_agent", self.extraction_agent.execute)
            workflow.add_node("validation_agent", self.validation_agent.execute)
            workflow.add_node("po_matching_agent", self.po_matching_agent.execute)
            workflow.add_node("policy_agent", self.policy_agent.execute)
            workflow.add_node("fraud_agent", self.fraud_agent.execute)
            workflow.add_node("decision_agent", self.decision_agent.execute)

            workflow.set_entry_point("ocr_agent")
            workflow.add_edge("ocr_agent", "extraction_agent")
            workflow.add_edge("extraction_agent", "validation_agent")
            workflow.add_edge("validation_agent", "po_matching_agent")
            workflow.add_edge("po_matching_agent", "policy_agent")
            workflow.add_edge("policy_agent", "fraud_agent")
            workflow.add_edge("fraud_agent", "decision_agent")
            workflow.add_edge("decision_agent", END)

            self.app = workflow.compile()
            self.use_langgraph = True
            logger.info("Successfully compiled LangGraph multi-agent workflow StateGraph.")
        except Exception as e:
            logger.warning(f"LangGraph import or compilation warning: {e}. Falling back to robust sequential agent orchestrator.")
            self.use_langgraph = False

    def run(self, initial_state: Dict[str, Any]) -> Dict[str, Any]:
        start_time = time.time()
        
        if getattr(self, "use_langgraph", False) and hasattr(self, "app"):
            try:
                final_state = self.app.invoke(initial_state)
                final_state["total_processing_time_ms"] = int((time.time() - start_time) * 1000)
                return final_state
            except Exception as e:
                logger.error(f"LangGraph execution exception: {e}. Fallback to direct pipeline execution.")

        # Robust sequential agent execution fallback
        state = dict(initial_state)
        state = self.ocr_agent.execute(state)
        state = self.extraction_agent.execute(state)
        state = self.validation_agent.execute(state)
        state = self.po_matching_agent.execute(state)
        state = self.policy_agent.execute(state)
        state = self.fraud_agent.execute(state)
        state = self.decision_agent.execute(state)
        
        state["total_processing_time_ms"] = int((time.time() - start_time) * 1000)
        return state

# Shared workflow singleton instance
agent_workflow = MultiAgentWorkflow()

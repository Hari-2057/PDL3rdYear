import time
import logging
from typing import Any, Dict

logger = logging.getLogger("InvoiceGuard.Agents")
logger.setLevel(logging.INFO)

class BaseAgent:
    name: str = "BaseAgent"
    
    def __init__(self, name: str = None):
        if name:
            self.name = name

    def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        start_time = time.time()
        logger.info(f"[{self.name}] Starting agent execution...")
        try:
            result_state = self.run(state)
            execution_time_ms = int((time.time() - start_time) * 1000)
            logger.info(f"[{self.name}] Execution finished in {execution_time_ms}ms")
            
            # Record execution log in agent state
            if "agent_logs" not in result_state:
                result_state["agent_logs"] = []
                
            log_entry = {
                "agent_name": self.name,
                "status": result_state.get(f"{self.name.lower().replace(' ', '_')}_status", "SUCCESS"),
                "execution_time_ms": execution_time_ms,
                "summary": result_state.get(f"{self.name.lower().replace(' ', '_')}_summary", f"{self.name} completed successfully.")
            }
            result_state["agent_logs"].append(log_entry)
            return result_state
        except Exception as e:
            execution_time_ms = int((time.time() - start_time) * 1000)
            logger.error(f"[{self.name}] Failed with error: {str(e)}", exc_info=True)
            if "agent_logs" not in state:
                state["agent_logs"] = []
            state["agent_logs"].append({
                "agent_name": self.name,
                "status": "FAILED",
                "execution_time_ms": execution_time_ms,
                "summary": f"Error in {self.name}: {str(e)}"
            })
            state["errors"] = state.get("errors", []) + [f"{self.name}: {str(e)}"]
            return state

    def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError("Subclasses must implement run()")

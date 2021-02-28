import { TestRunResults } from "../state_types/state_types";
import { EndTestRunActionParams } from "../../action_types/actions_types";
declare type CancelRun = (results: TestRunResults, params: EndTestRunActionParams) => TestRunResults;
declare const cancelRunState: CancelRun;
export { cancelRunState };